# Enforcement rules - full reference

Human-facing documentation for the hooks in this directory. **Not loaded into
context** - the agent learns each rule from the hook's own output at the moment
it matters (rule id + reason + fix), so carrying this table in CLAUDE.md would be
paying rent on information the hook hands over for free.

Read this when you want to see the whole rule set at once, or when deciding
whether a rule is worth keeping.

## How the three gates fit together

| When | Hook | Event | Blocks |
|---|---|---|---|
| Before a write lands | `qa-guard.mjs` | `PreToolUse` | writes to `.env` / `.auth/**` |
| After a write lands | `qa-lint.mjs` → ESLint or `qa-guard.mjs` | `PostToolUse` | every lint rule below |
| Agent tries to finish | `qa-coverage.mjs` | `Stop` | missing / dishonest coverage |
| Agent tries to finish | `qa-crawl.mjs` | `Stop` | untested states; baseline controls in no plan row; shallow crawl |
| After a write to `fixtures/evidence.ts` | `evidence-drift.sh` | `PostToolUse` | drift from the template |
| Session start | `session-status.mjs` | `SessionStart` | reports only - never blocks |
| Project init / maintenance | `qa-setup.mjs` | `Setup` | scaffolds only - never blocks |

`qa-setup.mjs` owns the **mechanical half of Phase 0** so it cannot be half-done
or skipped: `npm init` + 8 dev deps, `eslint.config.mjs` + `qa-rules.mjs` copied
to the project root, `tsconfig.json`, `.env` seeded from `.env.example` (values
left empty - credentials cannot be invented), the `lint`/`typecheck` npm scripts,
and the `baselines/ plan/ traceability/ findings/` dirs.

The specific failure it closes: **if the lint config is not copied to the root,
the AST tier never activates and enforcement silently degrades to the regex
fallback with no warning.** That copy is two lines of shell; it should never
depend on the agent remembering.

Safety: `npm install` is not run speculatively. The hook refuses to act unless
the directory contains BOTH `.claude/skills/qa-scripter/SKILL.md` and
`.claude/hooks/qa-lint.mjs` - a combination no unrelated repo has. Verified: it
makes no changes in an unrelated repo, nor in one that only half-matches. Fully
idempotent - a satisfied project produces no output and exits in ~0.09s.

Judgement work stays with the agent: browser binaries,
`playwright.config.ts`, `fixtures/`, `global-setup.ts`, and proving the smoke
test green.

`session-status.mjs` prints which gates are armed, which lint tier is live
(ESLint vs regex fallback), project readiness (deps, baselines, plans, specs,
auth files), and empty `.env` keys. It exists because **config loads at session
startup** - after editing a hook, skill or MCP server you must restart, and this
is how you confirm the restart took effect. It also warns when `plan/` or
`tests/` exist with no `baselines/`, since the baseline must come first.

`qa-lint.mjs` is a dispatcher: it prefers ESLint (AST-accurate) and falls back to
`qa-guard.mjs` (regex) when ESLint is not installed yet or its config is broken.
The two tiers do **not** duplicate each other - ESLint owns every lint rule;
`qa-guard.mjs` owns the secret guard plus a small bootstrap-window subset.

Rules marked **B** are also live during the bootstrap window (before
`npm install` has run); the rest need ESLint.

## Lint rules

| Rule id | Blocks | B |
|---|---|---|
| `spec/no-branching` · `no-loops` · `no-try-catch` · `no-ternary` | control flow in `tests/*.spec.ts` | ✅ |
| `wait/no-sleep` · `no-poll-wrapping-locator` | `waitForTimeout`; `expect.poll` around a locator | ✅ |
| `locator/xpath-needs-comment` · `css-needs-comment` · `positional-needs-comment` · `prefer-contentFrame` | XPath/CSS/`.nth()`/`frameLocator` with no justifying comment | |
| `spec/no-direct-instantiation` · `import-base-only` · `no-hooks-block` · `no-inline-faker` | tier leaks in specs (`new XPage()`, direct `pages/` import, `beforeEach`, inline faker) | |
| `page/no-assertions` · `fixture/no-assertions` · `setup/no-api-assertions` · `locators/no-logic` | assertions/logic in the wrong tier | |
| `auth/no-direct-login` · `no-hardcoded-creds` · `no-testuse-in-test` | login in a spec; hard-coded secret; `test.use()` inside `test()` | |
| `spec/test-name-format` · `tag-not-in-title` | name ≠ `TC-XX: Verify that ...`; `@tag` in the title instead of `{ tag: [...] }` | ✅ |
| `secrets/no-write` (PreToolUse) | any write to `.env` or `.auth/**` | ✅ |
| `evidence/verbatim-template` | `fixtures/evidence.ts` differing from `.claude/templates/evidence.ts` | n/a |
| `quality/assertion-intent` · `needs-test-step` · `duplicate-selector` | assertion with no intent message; multi-phase test with no `test.step()`; a selector string repeated in one file | |
| `runtime/networkidle` · `serial-mode` · `inflated-timeout` | `waitForLoadState('networkidle')`; `describe.serial`; a timeout over 60s | |

### Justifying comments

The four `locator/*` rules accept a **justifying comment** - trailing on the same
line, or on the line directly above. A bare label (`// TODO`, `// BAD:`,
`// step 2`) does not count: the check requires at least three real words, so one
stray section header cannot silence every rule beneath it.

Comments and string contents are excluded from code rules, so prose mentioning
`for` or `//div[@id]` never trips a check. Both tiers **fail open** - an internal
error exits 0 and never blocks the agent.

## Coverage gate

`qa-coverage.mjs` runs on `Stop` because coverage is a property of the whole
suite; judging it per-write would fire constantly while the agent is still
partway through generating a module.

It reconciles `plan/<module>.md` ↔ `tests/*.spec.ts` ↔ `traceability/<module>.txt`
and blocks the turn on any of:

- a **planned TC with no test** (SKILL.md step 6: "proceed only at zero-missing")
- a test **not in any plan** - the plan is the source of truth
- a **`GAP` line** in traceability (an AC with no test)
- a **dishonest `Coverage: N/M` line** - the claimed number disagreeing with the
  GAP count. A wrong number is worse than a missing one: it reads as covered
  when it is not.
- a **duplicate TC number**, a test with **no `TC-XX` id**, or **no tier tag**

No `plan/` and no ticket → nothing to reconcile, gate stays silent.

This is **requirement coverage, not istanbul/c8 line coverage**. A Playwright
suite exercises the app, not itself, so line coverage of the spec files would be
meaningless.

## Crawl gate

`qa-crawl.mjs` (on `Stop`) is the mechanical form of the CRAWL rule *"done only
when the worklist is empty · a surface you did not expand is a control you WILL
miss."*

It works because `baselines/<module>.baseline.json` is already an exhaustive,
machine-readable inventory of the page. So the crawl does not need re-doing to be
checked - it needs **reconciling**:

```
baseline.json    -> every control that exists on the page
plan/<module>.md -> what the agent intends to test
tests/*.spec.ts  -> what it actually wrote
```

**Blocks on:**
- **a state observed live (`states[].reached: true`) with no plan row or test** -
  the MODEL half, and the more valuable one. SKILL.md: *"gaps come from missed
  states/transitions, not missed buttons."* A plan can name every control on a
  page and still test only the populated happy path; the control check alone
  passes that. A state marked `reached: false` with a `why` is a documented
  limitation, not a gap. Sub-view states additionally require the view itself to
  be planned, so a state named on the list page cannot silently cover the detail
  page.
- a control in the baseline named in **no** plan row and no test - grouped by
  location (`view:Organisation detail > table:Member list`) so a gap reads as a
  place, not a list. Covers actions, icons, tabs, headings, fields, modals, table
  columns, row actions, row menus, nested ⋮ items and sub-views.
- a **shallow crawl**: menu-like controls with no expanded `opens.items`;
  `"modals": []`; `"views": []` (list page only); tables with no columns; no
  fields anywhere; **no `states[]` on a view** (controls captured but the state
  machine never explored). These matter because *"I did not look"* and *"nothing was
  there"* both serialise to an empty array.

**Implications for the workflow:**
- capture the baseline **before** writing the plan - it is the checklist
- expand every menu during capture, or it reads as shallow
- never trim the baseline to pass the gate; it records what EXISTS
- a surface that truly does not exist → note it in `changelog[]`

Matching is name-based and normalised (case/punctuation/whitespace-insensitive,
parentheticals dropped), so a plan row mentioning a control by name covers it.
Names shorter than 3 characters are skipped as too generic to match reliably.

**Silent when** there are no baselines, or no plan and no tests yet (the crawl may
still be in progress). It walks whatever keys the JSON contains rather than a
fixed list, so a control recorded under a module-specific key or `other[]` still
counts.

## Limits - what no hook can check

- whether an assertion is **meaningful**, or whether a test verifies the
  behaviour that actually matters
- **a control the crawl never recorded at all.** This is the crawl gate's one real
  blind spot: it proves *baseline ⊆ plan*, not *page ⊆ baseline*. If a whole
  surface was never visited, it is absent from the baseline and the gate cannot
  miss what it cannot see. The shallow-crawl smells are the partial defence
  (they catch the common shapes of "did not look"), and re-baselining at sprint
  start against the live site is the real one. Nothing short of an independent
  crawl can close it completely.
- **transitions and preconditions.** States are now inventoried and gated, but
  the ORDER between them is not: nothing proves "check-in must precede prescribe"
  was tested. A baseline can list states; it cannot express the edges between
  them.
- **a state nobody thought to look for.** The gate requires coverage of states
  recorded `reached: true`; it cannot demand a state absent from the baseline.
  Same blind spot as controls, mitigated by the missing-`states[]` smell.
- **runtime**, on write - the test has not run. The `runtime/*` rules attack the
  known code-level *causes* of slowness instead.
- `spec/no-direct-instantiation` matches class names ending `Page`/`Locators`, so
  a page object named against convention slips that one rule (its import is
  still caught by `import-base-only`).

## Maintenance

- Rule sources: `lint/eslint.config.mjs` (selector rules) and `lint/qa-rules.mjs`
  (the ten rules needing source/comment access).
- Phase 0 copies both to the project root - ESLint only reads
  `eslint.config.mjs` from the root, never a subdirectory.
- After editing either, run `npx eslint .` to confirm the suite still passes.
- **Never edit these to silence a violation.** Fix the code, or raise the rule
  with a human.
