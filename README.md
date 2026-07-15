# QA-Scripter - Playwright E2E Automation (qa-scripter)

A Playwright end-to-end test-automation project built around the **`qa-scripter`** agent. It turns a **Jira ticket**, **Figma design**, **Gherkin scenario**, **pasted requirement**, or the **live UI** into maintainable Playwright tests using a **Strict Decoupled Page Object Model**.

All test-authoring work goes through the agent - you do **not** hand-write specs that bypass its rules.

---

## Table of Contents

- [What This Project Is](#what-this-project-is)
- [Core Restrictions (read first)](#core-restrictions-read-first)
- [Inputs the Agent Accepts](#inputs-the-agent-accepts)
- [How to Work Here](#how-to-work-here)
- [The Workflow (end to end)](#the-workflow-end-to-end)
- [Architecture: 4 Code Tiers and Companions](#architecture-4-code-tiers-and-companions)
- [Tier Rules](#tier-rules)
- [Locators: Strict Source and Priority](#locators-strict-source-and-priority)
- [Waiting & Retries](#waiting--retries)
- [Fixtures: DI, Scope, Composition](#fixtures-di-scope-composition)
- [Roles & Environment](#roles--environment)
- [The UI Baseline & Self-Healing](#the-ui-baseline--self-healing)
- [API Setup Layer](#api-setup-layer-companion-lazy)
- [Findings Log](#findings-log-local-only)
- [Failure Evidence (automatic)](#failure-evidence-automatic)
- [Tagging & Traceability](#tagging--traceability)
- [Test Naming & Steps](#test-naming--steps)
- [Folder Structure](#folder-structure)
- [Setup & Tooling](#setup--tooling)
- [Bootstrap & First Run](#bootstrap--first-run-what-the-agent-does)
- [Running Tests](#running-tests)
- [Gotchas](#gotchas)

---

## What This Project Is

QA automation for a web app. The mission: take business intent (Jira/Figma/Gherkin/pasted text) plus the **live UI**, and produce a resilient, CI-grade Playwright suite that a senior reviewer approves on the first pass.

Guiding principles:
- **Explore the UI fully before writing a selector** - assumptions cause flaky tests.
- **Specs are linear and deterministic** - all control flow lives in helpers.
- **Never fabricate selectors or data** - if it wasn't inspected, it isn't written.

---

## Core Restrictions (read first)

**In test spec files (`tests/*.spec.ts`) these are PROHIBITED - zero tolerance:**

| Prohibited in specs | Push it into |
|---|---|
| `if / else` (branching) | `helpers/ConditionalHelper.ts` |
| `for` / `while` loops | `helpers/LoopHelper.ts` |
| `try / catch` (silent error catching) | `helpers/ErrorHelper.ts` |
| data-building / string logic (substring, calc, transform) | `helpers/DataHelper.ts` |

→ Specs must be **linear and deterministic**.

**Other hard rules:**
- **Locators come ONLY from live site navigation.** Jira / Figma / Gherkin / AC are **NEVER a source of locators** - use them only to verify the live UI against intent and flag drift. No live build yet → you do NOT write locators; wait until it exists, then capture them.
- **No sleeps, no loops for waiting** - wait declaratively (see [Waiting & Retries](#waiting--retries)). Never `waitForTimeout`.
- **No direct login** - use `storageState` from `.auth/<role>.json`.
- **Test names** = `TC-XX: Verify that ...`.

---

## Inputs the Agent Accepts

Combine any of these - they are **layers, not alternatives**:

| Source | Tool | Role |
|---|---|---|
| **Jira ticket** (business + AC) | Atlassian MCP `getJiraIssue` | AC drives the `TC-XX` list - *what* to verify |
| **Figma** (intended UI) | Figma MCP `get_design_context` | Verify live UI vs design; **NEVER a locator source** |
| **Gherkin** (Given/When/Then) | - | Each scenario → a `TC-XX`; steps → page-object calls |
| **Pasted content** (text/tables/screenshots) | - | Used directly as the requirement |
| **Live / staging UI** | Chrome DevTools MCP | **The ONLY source of locators** + the baseline |
| **API docs** (Swagger/OpenAPI/Postman) | - | **Optional** - asked once at intake; network capture is the default |

**Precedence (STRICT):** Jira / Gherkin / Figma / pasted content define *what* to test and the *intended* UI. **Every locator comes from navigating the live site. Full stop.** Drift between intent and live is flagged, never silently reconciled.

---

## How to Work Here

- **Invoke the agent:** `@qa-scripter <task>` (e.g. *"automate the <module> module at staging"*).
- The agent's full spec lives in **`.claude/agents/qa-scripter.md`** - read it before writing any test code. `CLAUDE.md` is orientation only.
- Do **not** hand-write specs that bypass the agent's rules.

The agent has **two execution workflows**:

1. **Live UI Inspection (RECOMMENDED)** - a live/staging environment is accessible → run the full Map → Crawl → Model → Triangulate → Plan → Critic → Generate sequence and capture real locators.
2. **Gherkin / Natural Language (no live UI yet)** - derive the TC list, page method signatures, data factories, and spec structure. Locators are **stubbed** with `// TODO: capture from live UI` - never guessed. As soon as a build exists, switch to Workflow 1 to fill them.

---

## The Workflow (end to end)

### Explore before you script - NO GAPS (mandatory sequence)

Gaps come from missed **states/transitions**, not missed buttons - and you can't see states without data. Run this fully **before any locator or test**:

1. **MAP** - enumerate every route/view/entry point (nav + AC + Figma) before going deep.
2. **CRAWL** - worklist of surfaces; expand every ⋮/menu/dropdown/tab/accordion/modal; new surfaces re-queue; **done only at empty worklist**.
3. **MODEL** - per view: states (empty/loading/populated/error/disabled/role-gated/terminal), transitions + preconditions, data in/out, validation. **Seed data via API to force non-happy states.**
4. **TRIANGULATE** - AC ↔ Figma ↔ live: in AC/Figma not live = missing/bug; in live not AC = unspec'd; Figma ≠ live = drift.
5. **PLAN (persisted)** - write `plan/<module>.md` (view × state × action → `TC-XX` + tag). On disk, so it survives context compaction and feeds traceability.
6. **CRITIC (gate)** - FAIL & loop if any AC / observed state / transition / error / validation / role-gated element has 0 tests. Proceed only at **zero-missing**.
7. **GENERATE** the 4 tiers from the plan.

### Phase 0 & 1 (first run)

Before any feature work, the agent runs a one-time **Bootstrap (Phase 0)** and a **Smoke Test + Self-Heal (Phase 1)** to prove the harness runs green. See [Bootstrap & First Run](#bootstrap--first-run-what-the-agent-does).

---

## Architecture: 4 Code Tiers and Companions

| Tier / artifact | Path | Holds |
|---|---|---|
| **Locators** | `locators/*Locators.ts` | selectors only, no logic |
| **Pages** | `pages/*Page.ts` | interactions only, no assertions |
| **Data** | `datas/<module>/<Module>Data.ts` | static values + faker factories (shared → `datas/common/`) |
| **Spec** | `tests/*.spec.ts` | deterministic test logic |
| Fixtures (support) | `fixtures/*.ts` | DI - page objects + seeded state + teardown; specs import `base.ts` only |
| Auth sessions | `.auth/<role>.json` | per-role `storageState` (generated by global-setup, **gitignored**) |
| Baseline (companion) | `baselines/*.baseline.json` | git-versioned UI snapshot for self-healing |
| Helpers (support) | `helpers/*.ts` | control flow (Loop/Conditional/Error/Data) + generic stateless helpers - no separate `utils/` |
| Setup (companion) | `setup/*Setup.ts` | API state seeding + teardown [lazy - only if needed] |
| Findings (companion) | `findings/*.txt` | local defect notes - **NEVER auto-filed to Jira** [committed] |
| Traceability (companion) | `traceability/*.txt` | generated TC↔AC coverage map, GAP-flagged [committed; only with a Jira ticket] |
| Plan (companion) | `plan/*.md` | persisted test plan (view × state × action → TC), pre-code gate [committed] |
| Evidence (companion) | `failures/<module>/` | auto-captured proof per failed test: PNG + `log.txt` [entirely gitignored] |

---

## Tier Rules

**Locators**
- Pure selectors, arrow-function properties. No logic, actions, or assertions.
- Name by intent (`create<Entity>Button`, not `button3`).

**Pages**
- Action-named methods that act and return values. **Assertions belong in specs** - expose state getters (`getRowCount()`).
- Data comes in as params (nothing hard-coded). Auto-wait only, never `waitForTimeout()`. One object per page/component (a modal is its own).
- **Drag & drop / file drop** (wrap in a page method):
  - element → element (reorder/kanban) → `source.dragTo(target)`
  - external file/clipboard drop onto a dropzone → `locator.drop({ files } | { data })` (Playwright ≥ 1.60)
  - standard `<input type="file">` → `locator.setInputFiles(...)`

**Data**
- Never inline `faker` in a spec - factories live in `datas/`. **Faker** = throwaway inputs; **Static** = anything you assert on, edge/boundary, domain-constrained, reference values.
- One sub-folder per module (`datas/<module>/<Module>Data.ts` + fixtures); shared/cross-module → `datas/common/`.

**Assertions**
- Attach a short intent message to every non-obvious assertion (2nd arg to `expect`, shown in the report on pass/fail): `expect(locator, 'why this matters').toBeVisible()`.
- **Hard** `expect` for critical paths; **soft** `expect.soft(...)` for validations (optionally `expect.configure({ soft: true })`).

**Parallel-safe by design**
- Every test passes alone, in parallel, and in any order - isolation via per-test fixtures + uniquely-named data. Never shared mutable state or hardcoded IDs.

---

## Locators: Strict Source and Priority

**Selector priority (STRICT order):**

```
getByRole → getByLabel → getByPlaceholder → getByText → getByTestId (no accessible name)
  → chain any mix → XPath → CSS (last resort, + comment)
```

Never drop to XPath/CSS while a chained semantic locator is still possible.

**Chaining is type-agnostic** - mix any of them into one unique locator:
```ts
page.getByTestId('list-toolbar').getByRole('button', { name: 'Export' })
page.getByRole('dialog').getByLabel('<Field label>')
page.getByRole('row').filter({ hasText: '<unique cell text>' }).getByTestId('row-menu')
```

**Disambiguate by CONTEXT, not position:** `.filter({ hasText })` · `.filter({ has: <child> })` · scoping/chaining.
`.nth()` / `.first()` / `.last()` are a **last resort** (order-dependent → flaky on re-sort/pagination) + comment why.

**Hidden items** (behind ⋮/dropdown): reveal first with an action, then chain - open the menu → `page.getByRole('menu').getByRole('menuitem', { name: 'Delete' })`.

---

## Waiting & Retries

No sleeps, no loops. Pick by *what* you're waiting on:

| Waiting on… | Use | Note |
|---|---|---|
| DOM / locator on the page | web-first assertion - `expect(locator).toBeVisible()` / `.toHaveText()` / `.toHaveCount()` | auto-polls; do **NOT** wrap in `expect.poll` |
| An off-page value that settles later (API/DB status, `page.evaluate()`, storage/cookie/URL) | `expect.poll(fn).toBe(x)` | `fn` only *reads* (runs many times - no side effects) |
| Several things must *eventually all* hold | `expect(async () => { …asserts… }).toPass({ timeout })` | |
| Repeating an **action** N times | `LoopHelper` | it is **NOT** a waiter |

**NEVER** `waitForTimeout` (a fixed sleep). **NEVER** a `while` in a spec.

---

## Fixtures: DI, Scope, Composition

Fixtures deliver a test its ready-made world, then clean up.

- **Specs import `fixtures/base.ts` ONLY** - never `new PageObject()`, never import `pages.ts`/`setup.ts` directly.
- Spec top = imports only (no `beforeEach`/setup blocks). Request fixtures per-test in the callback args (`{ <module>Page, seeded<Entity> | cleanup }`).
- **Scope:** page objects & API-setup fixtures are **per-test** (isolation; any-order/parallel-safe). Worker scope only for expensive read-only state.
- Setup runs before `use()`, teardown after (runs even on failure). Lazy - only requested fixtures run. No assertions in a fixture.
- **Split rule:** day one = `fixtures/base.ts` + `fixtures/evidence.ts` (failure evidence is standing; `base.ts` starts as `mergeTests(evidence)`). Once you add API-setup fixtures (or page fixtures grow past ~6), split into `fixtures/pages.ts` + `fixtures/setup.ts`, merged in `base.ts` too. Specs never change.

**Two patterns - STRICT (decide by the entity's ROLE in the test, not the action name):**

- **Pattern A · entity is a precondition** - any action on already-existing data (edit, delete, view, search, export, approve…) → **API-seed it** (`seeded<Entity>`); UI runs only the behavior under test.
- **Pattern B · entity IS the subject** - the test verifies *creating* it (Create/register flow) → create via **UI**, register the returned id with `cleanup(id)` for API teardown.

> Never build a precondition through the UI. Never create the subject-under-test via API.

---

## Roles & Environment

- Session files live in gitignored `.auth/`, **named by role** (`.auth/<role>.json`).
- **`global-setup.ts` *produces* the session files** (always required; creds from `.env`). `test.use()` / config only *selects* which one loads.
- Naming is decided at **onboarding**, not scaffold:
  - Bootstrap (roles unknown): one neutral `.auth/user.json` as config default.
  - At onboarding (roles discovered from Jira/live UI/permissions): one `.auth/<real-role>.json` per role; config default = dominant role; `test.use()` on every non-default role file.

| Situation | Config default `storageState` | `test.use()` |
|---|---|---|
| Single role | `.auth/user.json` (or the one real role) | never |
| One dominant role + others | `.auth/<dominant-role>.json` | only in the exception files |
| No dominant role (even split) | none - removed from config | every file declares its role |

- `test.use()` is set at **file/describe scope, never inside a `test()`**. It also overrides `viewport`, `timezoneId` + `locale`, `colorScheme`, `testIdAttribute`.
- Different users → different tests: `test.use({ storageState })`. Two users in ONE test: two browser contexts.

---

## The UI Baseline & Self-Healing

A companion (captured reference data, not runnable code) that enables self-healing when a script breaks.

**Principles:**
- Capture from the **accessibility/DOM snapshot** (`take_snapshot` / `browser_snapshot`) - **not pixels**.
- Store as `baselines/<module>.baseline.json` and **commit it** - git history is the change log.
- **Text only.** A screenshot is taken transiently during capture just to read placement (recorded as `region`), then discarded. **Never commit screenshots.**
- Never gate on colors, exact sizes, or pixel diffs.
- **EXHAUSTIVE + RECURSIVE** - walk the entire accessibility tree; expand every hidden surface; capture every view (list + detail + sub-views), every table (`{ name, columns, rowActions, hasRowMenu }`), every nested ⋮ menu. Self-verified to **zero-missing** before committing.
- Update **only** on human-confirmed intended change; log it in `changelog[]` (`createdAt` never changes, `updatedAt` + newest-first changelog give the audit trail).

**Self-heal flow (when a spec fails on a missing/timed-out locator):** re-snapshot live → load baseline → diff & classify (`removed`/`renamed`/`role-changed`/`moved`/`new`) → fuzzy-match failing locator by role + accessible name → confident match: update locator, re-run, emit a drift line → ambiguous/removed: STOP and ask (**never invent a locator**) → update baseline + changelog **only after a human confirms the change is intended**.

---

## API Setup Layer (companion, lazy)

Purpose: put a test into its starting state and clean up after, so the UI runs only for the behavior under test.

- **Rule:** set up state via **API** · test behavior via **UI** · tear down via **API**. The subject under test is ALWAYS UI-driven.
- **Lazy:** build `setup/` only when a module needs seeded preconditions or cleanup. Fixtures fire only when a test requests them. Teardown runs in cleanup - always, even on failure.
- **Boundary:** `setup/` = state seeding + teardown ONLY. **Never assert on an API response in a spec** (that's `qa-api-tester` / `test-ticket`).
- **Endpoint discovery - default = network capture:** drive the flow once, read the real call (`list_network_requests` + `get_network_request`). Cross-check docs only if given. **Never invent an endpoint.**
- **Teardown ladder:** `DELETE` → soft-delete/deactivate (`PATCH status`) → UI delete → unique-data namespacing → backend reset / seeded DB → last resort: leave it and **log the leak** (never silent).
- Wiring uses the built-in `APIRequestContext` - **no new dependency**:
  ```
  setup/
  ├── apiClient.ts      # auth'd APIRequestContext
  ├── <Entity>Setup.ts  # action-named create/remove; return IDs; NO assertions
  └── index.ts
  ```

---

## Findings Log (local only)

- Record **real product defects** to `findings/<module>.txt` as found (plain text) - fields: Title (`Where: what .. when`), Type, Module, Description, Steps to reproduce, Actual result, Expected result, Confidence.
- **NEVER post to Jira / never list issues** - a false bug erodes trust. A human reviews the file and files it.
- **Exclude** baseline drift (→ self-heal) and your own locator/test bugs (→ fix them).

---

## Failure Evidence (automatic)

Any failed test leaves a timestamped proof trail - no spec changes needed (one `auto: true` fixture, `fixtures/evidence.ts`, merged into `base.ts`; scaffolded verbatim from the committed template `.claude/templates/evidence.ts`):

- **PNG** - full-page screenshot to `failures/<module>/<TC-XX>_<YYYY-MM-DD>_<HH-MM-SS>.png`. Flat per module, TC number + timestamp in the filename - sorting the folder groups each TC's failure history chronologically.
- **Toast recorder** - a MutationObserver (installed via `addInitScript`) logs every toast's text + exact timestamp during the whole run. A screenshot can lose the race against a 2-second toast; the observer cannot.
- **`failures/<module>/log.txt`** - one entry per failure: timestamp, TC id, error line, recorded toasts. The glanceable text record next to the PNGs (all of `failures/` stays local, gitignored).
- **Video + trace** (`retain-on-failure` in the config) - the trace timeline carries DOM snapshots + timestamps; scrub to the exact toast moment when someone says "it was working".

Capture fires ONLY when a test fails (green runs leave nothing) and is wrapped so it can never throw and mask the real failure.

---

## Tagging & Traceability

**Tags** (project convention, via `{ tag: [...] }` so titles stay clean):

| Tag | Meaning |
|---|---|
| `@smoke` | proves-it-works; keep tiny (~1-3 per module) |
| `@critical` | must-never-break: auth / payment / data / permissions |
| `@regression` | default - the untagged full run **is** the regression suite |

Decide by scenario role at authoring, first match wins. Run subsets: `--grep @smoke` · `--grep "@smoke|@critical"` · `--grep-invert @regression`.

**Traceability** - `traceability/<module>.txt` is a **generated** companion (ticket AC × authored TCs, GAP-flagged), regenerated on every change - never hand-kept. Skipped if there's no ticket/AC.

```
Traceability - <Module> (<TICKET-KEY>)              generated <date>
AC-1  <criterion>      → TC-01    @smoke @critical
AC-2  <criterion>      → TC-02    @regression
AC-3  <criterion>      → (none)   GAP - no test

Coverage: 2/3 AC (67%) · 1 gap
```

---

## Test Naming & Steps

**Naming** - every test: `TC-XX: Verify that <testable statement>`
- `TC-XX` sequential per feature file. The lead-in is always **"Verify that"** (not Navigate/Validate/Check).

```ts
test('TC-15: Verify that search filters results by name', async () => { /* ... */ });
```

**`test.step()`** - wrap phases in named steps **only** for multi-phase / cross-page / Gherkin-mapped tests (usually `@smoke`/`@critical`). It's a label, not control flow. Skip it for short single-assert tests - the POM method name already documents them. Heuristic: **>1 screen or >~3 phases → step it.**

---

## Folder Structure

```
<project-root>/
├── locators/              # Selectors only (arrow functions)
├── pages/                 # Page objects (interactions)
├── datas/                 # Test data - one sub-folder per module
│   ├── <module>/          #   <Module>Data.ts (static + faker) + *.json fixtures
│   └── common/            # shared / cross-module data
├── tests/                 # Test specs (pure logic)
├── baselines/             # UI baseline snapshots - text JSON only [committed]
│   └── <module>.baseline.json
├── findings/              # local defect notes - plain .txt, NEVER auto-filed [committed]
├── traceability/          # generated TC↔AC coverage map, GAP-flagged [committed; with a ticket]
├── plan/                  # persisted test plan (view × state × action → TC) [committed]
├── failures/              # failure evidence trail [entirely gitignored - local only]
│   └── <module>/          #   <TC-XX>_<YYYY-MM-DD>_<HH-MM-SS>.png + log.txt
├── setup/                 # API state seeding + teardown [LAZY]
│   ├── apiClient.ts
│   ├── <Entity>Setup.ts
│   └── index.ts
├── fixtures/              # Playwright fixtures (specs import base.ts only)
│   ├── base.ts
│   ├── evidence.ts        # failure-evidence auto fixture
│   ├── pages.ts           # (after split)
│   └── setup.ts           # (after split)
├── helpers/               # control flow + generic stateless helpers (no utils/)
│   ├── LoopHelper.ts
│   ├── ConditionalHelper.ts
│   ├── ErrorHelper.ts
│   ├── DataHelper.ts
│   └── index.ts
├── .env.example           # committed template - copy to .env and fill in
├── .env                   # BASE_URL + credentials (gitignored)
├── .gitignore
├── tsconfig.json
├── playwright.config.ts   # multi-browser + smart reporter
├── global-setup.ts        # auth - generates .auth/<role>.json
├── .auth/                 # generated storageState per role (gitignored)
│   └── <role>.json        # user.json (default) / admin.json / customer.json
├── smart-report.html      # generated after a test run
└── package.json
```

---

## Setup & Tooling

**MCP servers** (`.mcp.json`, auto-connect at session start):

| Server | Package | Role |
|---|---|---|
| `chrome-devtools` | `chrome-devtools-mcp@latest` | **Primary** UI inspection - `take_snapshot`, `take_screenshot`, navigation, clicks; the source of locators |
| `playwright` | `@playwright/mcp@latest` | Secondary / fallback browser automation |

**Permissions** (`.claude/settings.json`, committed) - pre-approved so there are no prompts:
- `mcp__chrome-devtools`, `mcp__playwright`, `mcp__plugin_playwright_playwright`
- `npx playwright:*`, `npx chrome-devtools-mcp:*`, `npm install:*`, `npm init:*`

**Env / secrets** - copy `.env.example` (committed template, documents every key) to `.env` (gitignored) and fill in `BASE_URL` + credentials.

**Dev dependencies** (installed at bootstrap): `@playwright/test`, `typescript`, `@types/node`, `@faker-js/faker`, `dotenv`, `playwright-smart-reporter`.

**Browsers:** chromium, webkit, firefox (config runs all three projects).

**Committed (auditable):** `baselines/`, `findings/`, `traceability/`, `plan/`.

---

## Bootstrap & First Run (what the agent does)

**Phase 0 - One-Time Bootstrap** (idempotent; skipped if everything already exists):
```bash
[ -f package.json ] || npm init -y
npm install --save-dev @playwright/test typescript @types/node @faker-js/faker dotenv playwright-smart-reporter
npx playwright install
npx playwright install chromium webkit firefox
```
Creates any missing standard files: `tsconfig.json` (strict), `.env` (copied from `.env.example`), `.gitignore`, `playwright.config.ts`, `fixtures/base.ts`, `fixtures/evidence.ts` (copied verbatim from `.claude/templates/evidence.ts`), `global-setup.ts`. Verifies `npx tsc --noEmit` is clean and MCPs are connected.

**Phase 1 - Smoke Test & Self-Heal** (first run only): generates a minimal `tests/smoke.spec.ts`, runs `npx tsc --noEmit` then `npx playwright test tests/smoke.spec.ts --project=chromium`, and self-heals red output (up to 5 attempts). On green it deletes the smoke spec and proceeds; on red after 5 attempts it STOPS and reports. Never continues on red.

---

## Running Tests

```bash
# full suite (all browsers) - this IS the regression run
npx playwright test

# a single project
npx playwright test --project=chromium

# a single spec
npx playwright test tests/<module>.spec.ts

# tag subsets
npx playwright test --grep @smoke
npx playwright test --grep "@smoke|@critical"
npx playwright test --grep-invert @regression

# type check
npx tsc --noEmit
```

Report: `smart-report.html` (falls back to the built-in `html` reporter if `playwright-smart-reporter` can't load). CI-aware config: `retries: 2` and `workers: 1` under `CI`, trace + video `retain-on-failure` (feeds the failure-evidence trail), screenshot `only-on-failure`.

---

## Gotchas

- MCP servers + permissions load at **session startup** - after config changes, **restart the session**.
- `chrome-devtools-mcp` is the real package name (not `@anthropic-ai/...`).
- **Never commit baseline images** - baselines are text JSON only.
- Locators are captured from the **live UI only** - if there's no build yet, locators are stubbed `// TODO: capture from live UI`, never guessed.

---

*Full agent specification: **`.claude/agents/qa-scripter.md`**. Project orientation: **`CLAUDE.md`**.*
