import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { addResult, closeRun, createRun, getRunSummary, ResultStatus } from '../testrail/testrailClient';
import { REGISTRY, RegistryEntry, scriptedOf, unscriptedOf } from '../datas/common/testrailRegistry';
import type { ApiTestResult } from '../apiTests/types';

interface DailyRunOptions {
  runName: string;
  description?: string;
  caseIds: number[];
}

type DailyRunResult =
  | { status: 'needs-scripting'; unscripted: number[] }
  | { status: 'completed'; runId: number; summary: Awaited<ReturnType<typeof getRunSummary>> };

export async function runDailyChecklist({ runName, description, caseIds }: DailyRunOptions): Promise<DailyRunResult> {
  const unscripted = unscriptedOf(caseIds);
  if (unscripted.length > 0) {
    // Caller (the agent, via /qa-scripter or an API-test build) must script these first,
    // register them in datas/common/testrailRegistry.ts, then re-run.
    return { status: 'needs-scripting', unscripted };
  }

  const entries = scriptedOf(caseIds);
  const playwrightEntries = entries.filter((e) => e.kind === 'playwright');
  const apiEntries = entries.filter((e) => e.kind === 'api');

  const runId = await createRun(runName, caseIds, description);
  if (!runId) throw new Error('Failed to create TestRail run');

  if (playwrightEntries.length > 0) {
    runPlaywrightSubset(runId, playwrightEntries);
  }

  for (const entry of apiEntries) {
    if (!entry.apiScript) continue;
    const mod = await import(path.resolve(entry.apiScript));
    const result: ApiTestResult = await mod.run();
    await addResult(runId, entry.caseId, result.status, result.comment);
  }

  await closeRun(runId);
  const summary = await getRunSummary(runId);
  return { status: 'completed', runId, summary };
}

function runPlaywrightSubset(runId: number, entries: RegistryEntry[]) {
  const grepPattern = entries.map((e) => e.tag).filter(Boolean).join('|');
  const reportPath = path.resolve('playwright-results.json');

  // shell:true spawns via cmd.exe on Windows regardless of the parent shell, and cmd.exe treats
  // an unquoted "|" inside the grep pattern as a real pipe operator, silently truncating the
  // command instead of passing one grep argument - so the whole flag must be one quoted token.
  const grepArg = `"--grep=${grepPattern}"`;

  try {
    execFileSync('npx', ['playwright', 'test', grepArg, '--project=chromium', '--reporter=json'], {
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: reportPath },
    });
  } catch {
    // Non-zero exit just means some tests failed - the JSON report is still written.
  }

  if (!existsSync(reportPath)) {
    // Playwright itself crashed (config error, no matching tests, etc.) - block every case honestly.
    for (const entry of entries) {
      void addResult(runId, entry.caseId, 'blocked', 'Playwright run produced no report - see console output');
    }
    return;
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
  for (const entry of entries) {
    const { status, comment } = extractPlaywrightResult(report, entry);
    void addResult(runId, entry.caseId, status, comment);
  }
}

function extractPlaywrightResult(report: any, entry: RegistryEntry): { status: ResultStatus; comment: string } {
  const specs: any[] = [];
  const walk = (suite: any) => {
    for (const spec of suite.specs ?? []) specs.push(spec);
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const suite of report.suites ?? []) walk(suite);

  const spec = specs.find((s) => (s.tags ?? []).includes(entry.tag) || s.title?.startsWith(entry.tcId));
  if (!spec) {
    return { status: 'blocked', comment: `Spec not found in report for ${entry.tcId} (tag ${entry.tag})` };
  }

  const test = spec.tests?.[0];
  const result = test?.results?.[0];
  const passed = result?.status === 'passed';
  const healed = (result?.stdout ?? []).some((l: any) => String(l.text ?? l).includes('locator updated'));
  const driftNote = healed ? ' (self-healed: locator drift, see run log)' : '';

  if (passed) return { status: 'passed', comment: `Automated - passed${driftNote}` };
  const errMsg = String(result?.error?.message ?? 'see trace/evidence').split('\n')[0];
  return { status: 'failed', comment: `Automated - failed: ${errMsg}` };
}

// CLI entry point: npx ts-node scripts/runDailyChecklist.ts '{"runName":"...","caseIds":[1,2,3]}'
if (require.main === module) {
  const argJson = process.argv[2];
  if (!argJson) {
    console.error('Usage: ts-node runDailyChecklist.ts \'{"runName":"...","description":"...","caseIds":[1,2,3]}\'');
    process.exit(1);
  }
  runDailyChecklist(JSON.parse(argJson))
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
