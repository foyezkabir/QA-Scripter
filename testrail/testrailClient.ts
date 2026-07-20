import 'dotenv/config';

const TR_URL = process.env.TESTRAIL_URL!;
const TR_EMAIL = process.env.TESTRAIL_EMAIL!;
const TR_API_KEY = process.env.TESTRAIL_API_KEY!;
const PROJECT_ID = Number(process.env.TESTRAIL_PROJECT_ID);
const SUITE_ID = Number(process.env.TESTRAIL_SUITE_ID);

const AUTH = Buffer.from(`${TR_EMAIL}:${TR_API_KEY}`).toString('base64');

export const STATUS_ID = { passed: 1, blocked: 2, untested: 3, retest: 4, failed: 5 } as const;
export type ResultStatus = keyof typeof STATUS_ID;

export interface TrSection {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface TrCase {
  id: number;
  title: string;
  section_id: number;
}

export interface TrTest {
  id: number;
  case_id: number;
  status_id: number;
}

async function api<T = any>(method: string, endpoint: string, body?: unknown, retries = 4): Promise<T | null> {
  const url = `${TR_URL}/index.php?/api/v2/${endpoint}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.ok) {
      const text = await res.text();
      return (text ? JSON.parse(text) : {}) as T;
    }
    if (res.status === 429 && attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    const errText = await res.text();
    console.error(`TestRail API ${res.status} on ${endpoint}: ${errText.slice(0, 400)}`);
    return null;
  }
  return null;
}

/** Returns top-level sections for Suite 201. */
export async function getAllSections(): Promise<TrSection[]> {
  const resp = await api<any>('GET', `get_sections/${PROJECT_ID}&suite_id=${SUITE_ID}`);
  const sections: TrSection[] = Array.isArray(resp) ? resp : (resp?.sections ?? []);
  return sections.filter((s) => !s.parent_id);
}

/** Returns all case IDs (with titles) in a given section, handling pagination. */
export async function getCasesForSection(sectionId: number): Promise<TrCase[]> {
  const cases: TrCase[] = [];
  let offset = 0;
  for (;;) {
    const resp = await api<any>(
      'GET',
      `get_cases/${PROJECT_ID}&suite_id=${SUITE_ID}&section_id=${sectionId}&offset=${offset}&limit=250`,
    );
    const batch: TrCase[] = Array.isArray(resp) ? resp : (resp?.cases ?? []);
    cases.push(...batch);
    const next = Array.isArray(resp) ? undefined : resp?._links?.next;
    if (!next) break;
    offset += 250;
  }
  return cases;
}

export async function getCaseIdsForSection(sectionId: number): Promise<number[]> {
  return (await getCasesForSection(sectionId)).map((c) => c.id);
}

export async function createRun(name: string, caseIds: number[], description?: string): Promise<number | null> {
  const resp = await api<any>('POST', `add_run/${PROJECT_ID}`, {
    suite_id: SUITE_ID,
    name,
    include_all: false,
    case_ids: caseIds,
    description,
  });
  return resp?.id ?? null;
}

export async function addResult(runId: number, caseId: number, status: ResultStatus, comment: string): Promise<void> {
  await api('POST', `add_result_for_case/${runId}/${caseId}`, {
    status_id: STATUS_ID[status],
    comment,
  });
}

export async function closeRun(runId: number): Promise<void> {
  await api('POST', `close_run/${runId}`, {});
}

export interface RunSummary {
  run: any;
  counts: Record<ResultStatus, number>;
  tests: TrTest[];
}

export async function getRunSummary(runId: number): Promise<RunSummary> {
  const run = await api<any>('GET', `get_run/${runId}`);
  const testsResp = await api<any>('GET', `get_tests/${runId}`);
  const tests: TrTest[] = Array.isArray(testsResp) ? testsResp : (testsResp?.tests ?? []);

  const idToName: Record<number, ResultStatus> = { 1: 'passed', 2: 'blocked', 3: 'untested', 4: 'retest', 5: 'failed' };
  const counts: Record<ResultStatus, number> = { passed: 0, blocked: 0, untested: 0, retest: 0, failed: 0 };
  for (const t of tests) {
    const name = idToName[t.status_id] ?? 'untested';
    counts[name]++;
  }
  return { run, counts, tests };
}
