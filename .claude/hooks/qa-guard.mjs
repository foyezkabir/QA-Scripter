#!/usr/bin/env node
/**
 * qa-guard - the zero-dependency half of enforcement.
 *
 * Deliberately narrow. It covers only what ESLint CANNOT:
 *
 *  1. secrets/no-write (PreToolUse) - blocks a write to .env or .auth/** before
 *     it happens. Not a lint at all: there is no AST, the file may not be .ts,
 *     and the point is to stop the write, not to judge its contents.
 *
 *  2. A bootstrap-window safety net - this repo has no package.json until the
 *     qa-scripter agent's Phase 0 scaffolds one, so ESLint does not exist yet.
 *     Until it does, these regex checks keep the loudest CLAUDE.md rules alive:
 *     control flow in specs, fixed sleeps, and test-name format.
 *
 * Everything else - locator strategy, tier separation, assertion placement -
 * is enforced by ./eslint.config.mjs + ./qa-rules.mjs (AST, authoritative) and NOT
 * duplicated here. Two implementations of one rule drift apart, and the weaker
 * one breeds false confidence. Once npm install has run, qa-lint.mjs routes to
 * ESLint and this file is only the PreToolUse guard.
 *
 * Exit codes (Claude Code contract):
 *   0 - clean, or out of scope. stdout is ignored by design.
 *   2 - BLOCKING. stderr is fed back to the agent as the error to fix.
 * Any internal failure also exits 0: a broken guard must never wedge the agent.
 */

import { readFileSync } from 'node:fs';

/* ------------------------------------------------------------------ *
 * Source sanitising
 * ------------------------------------------------------------------ */

/**
 * Blanks comments and string/template contents, preserving offsets and newlines
 * so line numbers stay accurate.
 *
 * This is what stops `'Verify that it errors for bad input'` from tripping the
 * `for` rule - the single most likely false positive in a regex linter.
 */
function stripCommentsAndStrings(src) {
  const out = Array.from(src);
  const N = src.length;
  let i = 0;

  const blank = (from, to) => {
    for (let k = from; k < to && k < N; k++) {
      if (out[k] !== '\n') out[k] = ' ';
    }
  };

  while (i < N) {
    const c = src[i];
    const next = src[i + 1];

    if (c === '/' && next === '/') {
      let j = i + 2;
      while (j < N && src[j] !== '\n') j++;
      blank(i, j);
      i = j;
      continue;
    }

    if (c === '/' && next === '*') {
      let j = i + 2;
      while (j < N && !(src[j] === '*' && src[j + 1] === '/')) j++;
      blank(i, Math.min(j + 2, N));
      i = j + 2;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      let j = i + 1;
      while (j < N) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === quote) break;
        if (quote !== '`' && src[j] === '\n') break; // unterminated - bail
        j++;
      }
      blank(i + 1, j); // keep the quotes, blank the contents
      i = j + 1;
      continue;
    }

    i++;
  }

  return out.join('');
}

/** 1-based line number of a character offset. */
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

/* ------------------------------------------------------------------ *
 * Rules - bootstrap window only
 * ------------------------------------------------------------------ */

const SPEC = (p) => /(^|\/)tests\/.*\.spec\.ts$/.test(p);
const CODE = (p) => /\.ts$/.test(p);

const rx = (re) => (clean) => {
  const out = [];
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m;
  while ((m = r.exec(clean)) !== null) {
    out.push({ index: m.index, text: m[0].trim() });
    if (m.index === r.lastIndex) r.lastIndex++;
  }
  return out;
};

const RULES = [
  {
    id: 'spec/no-branching',
    applies: SPEC,
    find: rx(/(^|[^.\w])if\s*\(|(^|[^.\w])else(\s*\{|\s+if\b)|(^|[^.\w])switch\s*\(/m),
    msg: 'branching (`if` / `else` / `switch`) in a spec',
    fix: 'Specs must be linear. Move the decision into helpers/ConditionalHelper.ts, or split into two deterministic tests.',
  },
  {
    id: 'spec/no-loops',
    applies: SPEC,
    find: rx(/(^|[^.\w])(for|while)\s*\(/m),
    msg: 'a loop (`for` / `while`) in a spec',
    fix: 'Repeating an action N times → helpers/LoopHelper.ts. Waiting for something → a web-first assertion (expect(locator).toBeVisible()), never a loop.',
  },
  {
    id: 'spec/no-try-catch',
    applies: SPEC,
    find: rx(/(^|[^.\w])(try\s*\{|catch\s*\(|finally\s*\{)/m),
    msg: 'try / catch / finally in a spec (silent error swallowing)',
    fix: 'A spec must fail loudly. Move error handling into helpers/ErrorHelper.ts.',
  },
  {
    id: 'wait/no-sleep',
    applies: CODE,
    find: rx(/waitForTimeout\s*\(/),
    msg: '`waitForTimeout` - a fixed sleep',
    fix: 'Wait declaratively. DOM/locator → expect(locator).toBeVisible()/.toHaveText(). Off-page value that settles → expect.poll(fn). Several things must all hold → expect(async () => {...}).toPass({ timeout }).',
  },
];

/** Test titles must read `TC-XX: Verify that ...`. */
function checkTestNames(rawSrc, clean) {
  const problems = [];
  const re = /(^|[^.\w])test\s*(\.\s*(only|skip|fixme)\s*)?\(\s*(['"`])/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const quote = m[4];
    const start = m.index + m[0].length;
    let j = start;
    while (j < rawSrc.length && rawSrc[j] !== quote) {
      if (rawSrc[j] === '\\') j++;
      j++;
    }
    const title = rawSrc.slice(start, j);
    if (title.includes('${')) continue; // computed title - leave it to ESLint
    if (!/^TC-\d+:\s*Verify that\s+\S/.test(title)) {
      problems.push({
        index: m.index,
        title: title.length > 60 ? title.slice(0, 60) + '…' : title,
      });
    }
  }
  return problems;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function main() {
  let payload;
  try {
    payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return 0; // unparseable payload - fail open
  }

  const input = payload.tool_input ?? {};
  const filePath = input.file_path ?? input.filePath ?? '';
  if (!filePath) return 0;

  const rel = filePath.replace(/^.*?\/QA-Scripter\//, '');

  /* --- PreToolUse: never write secrets or session files (no ESLint equivalent) --- */
  if (payload.hook_event_name === 'PreToolUse') {
    if (/(^|\/)\.env$/.test(rel) || /(^|\/)\.auth\//.test(rel)) {
      process.stderr.write(
        `BLOCKED by qa-guard [secrets/no-write]\n\n` +
        `  ${rel} must never be written by the agent.\n\n` +
        `  .env holds real credentials; .auth/*.json are session files produced by\n` +
        `  global-setup.ts at run time. Both are gitignored.\n` +
        `  → To document a new key, add it to .env.example WITHOUT its value and ask\n` +
        `    the user to fill in .env themselves.\n`
      );
      return 2;
    }
    return 0;
  }

  /* --- PostToolUse: bootstrap-window lint (ESLint takes over once installed) --- */
  if (!/\.ts$/.test(rel)) return 0;

  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    return 0; // deleted or unreadable
  }

  const clean = stripCommentsAndStrings(raw);
  const violations = [];

  for (const rule of RULES) {
    if (!rule.applies(rel)) continue;
    for (const hit of rule.find(clean)) {
      violations.push({
        line: lineOf(raw, hit.index),
        id: rule.id,
        msg: rule.msg,
        fix: rule.fix,
      });
    }
  }

  if (SPEC(rel)) {
    for (const p of checkTestNames(raw, clean)) {
      violations.push({
        line: lineOf(raw, p.index),
        id: 'spec/test-name-format',
        msg: `test name does not match the required format: "${p.title}"`,
        fix: 'Test names must read exactly: `TC-XX: Verify that ...` (e.g. "TC-07: Verify that an invalid password shows an inline error").',
      });
    }
  }

  if (violations.length === 0) return 0;

  const seen = new Set();
  const unique = violations
    .filter((v) => {
      const k = `${v.id}:${v.line}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.line - b.line);

  const out = [
    `BLOCKED by qa-guard - ${unique.length} CLAUDE.md violation(s) in ${rel}`,
    '',
  ];
  for (const v of unique) {
    out.push(`  ${rel}:${v.line}  [${v.id}]`);
    out.push(`    Found: ${v.msg}`);
    out.push(`    Fix:   ${v.fix}`);
    out.push('');
  }
  out.push('These are the "zero tolerance" rules in CLAUDE.md. Fix the file, do not');
  out.push('work around the check. If a rule is genuinely wrong here, say so and ask');
  out.push('the user - do not disable the hook yourself.');
  out.push('');
  out.push('Note: this is the regex fallback (ESLint not installed yet). Once Phase 0');
  out.push('has run, the full AST ruleset applies and catches more.');

  process.stderr.write(out.join('\n') + '\n');
  return 2;
}

let code = 0;
try {
  code = main();
} catch (err) {
  // Fail open: a broken guard must never block the agent.
  process.stderr.write(`qa-guard internal error (ignored): ${err?.message}\n`);
  code = 0;
}
process.exit(code);
