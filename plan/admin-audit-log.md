# Admin Audit Log - test plan (DEV https://admin.dev.app.velaops.ai/admin/audit-log)

Depth: **standard read-only**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/admin-audit-log.baseline.json`.

Spec file: `admin-audit-log.spec.ts`. Tests request the `adminSession` fixture, except the logged-out redirect.

Read-only. The log is live and grows while tests run, so no event, timestamp, agent id or total is asserted - only labels and shape. The empty, loading and error states are reached by **mocking the GET `/api/admin/audit-log` read** (owned by the page object through `ApiMockHelper`): an empty list, a request held open, and a single failing request. Nothing is ever written. Plain-text messages have no ARIA role.

## Audit Log - /admin/audit-log

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Audit Log | populated | page shows heading "Audit Log", the text "Every provisioning and lifecycle event, newest first.", a "(Total: N)" count, the Filter by action select, Refresh, the table columns Timestamp, Action, Agent and Details, and the Pagination navigation "Showing 1–50 of N events" | TC-01 | @smoke |
| Audit Log | populated | Filter by action offers All Actions, Provision, Deploy, Stop, Start, Reprovision and Delete | TC-02 | @regression |
| Audit Log | populated | choosing Provision lists only provision events | TC-03 | @critical |
| Audit Log | disabled | on the first page Previous is disabled and Next is enabled | TC-04 | @regression |
| Audit Log | populated | Next shows the second page ("Showing 51–100 of N events") and enables Previous | TC-05 | @regression |
| Audit Log | populated | Previous returns to the first page ("Showing 1–50 of N events") | TC-06 | @regression |
| Audit Log | populated | Refresh re-reads the list and is enabled again afterwards | TC-07 | @regression |
| Audit Log | loading | while the request is open Refresh is disabled and no table is shown | TC-08 | @regression |
| Audit Log | empty | an empty response shows "No audit log entries" and "Provisioning and lifecycle events appear here as soon as they happen." | TC-09 | @regression |
| Audit Log | empty | a filter with no events shows "No reprovision events", "Nothing has been recorded for this action yet. Try All Actions." and Clear filters | TC-10 | @regression |
| Audit Log | error | a failed request shows "Could not load this", the error message and a Try again button | TC-11 | @critical |
| Audit Log | error | Try again after a failed request loads the list | TC-12 | @regression |
| Audit Log | role-gated:unauthenticated | opening /admin/audit-log logged out redirects to /admin/login | TC-13 | @critical |
| Audit Log | role-gated:authenticated | the saved admin session opens /admin/audit-log signed in | TC-14 | @critical |

## Out of scope (recorded, not tested)

- The OpenRouter low-credit banner (**Top up**, **Dismiss**) shows only while credit is under the reminder line; Top up leaves for openrouter.ai.
- The last page and a total that is an exact multiple of 50 need a known total; the live total is not controllable.
- The finding in the baseline (a hung request leaves the table on a skeleton with no timeout message) is logged in `findings/admin.txt`, not asserted.
