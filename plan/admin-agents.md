# Admin Agents - test plan (DEV https://admin.dev.app.velaops.ai/admin/agents)

Depth: **standard read-only slice**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/admin-agents.baseline.json`.

Spec files: `admin-agents.spec.ts` (read-only) · `admin-agents-state.spec.ts` (changes asta; runs in the `chromium-state` project after the read-only run). Every test requests the `adminSession` fixture (cookie + sessionStorage restored from `.auth/admin.json`).

Read-only except the asta state slice below. Elsewhere row menus and dialogs are only OPENED and closed - never Deploy, Reprovision, Delete or Download bundle. **Delete is never used on any agent.** Row-specific tests target the user's own agent **Asta** (owner Naiemul Hasan Naiem), found by search. Live numbers (agent counts, activity, polling data) are never asserted; only their labels. Plain-text messages have no ARIA role - located with `getByText`.

## Agents list - /admin/agents

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Agents | populated | page shows heading "Agents", stat cards Total Agents, Running, Stopped, Error with their sparkline images "Agents created per day over the last 7 days", "Deploy and start events per day", "Stop events per day" and "Failed, denied or blocked events per day", heading "All Agents", the search box "Search agents by name, role or owner" and the All, Running, Stopped, Error filters | TC-01 | @smoke |
| Agents | populated | text "Live · polling every 15s" and the note "activity covers the last 1 day, not 7 - the audit feed caps at 500 events" are shown | TC-02 | @regression |
| Agents | populated | table All Agents has columns Agent, Owner, Status, Activity, Integrations, Created, Actions | TC-03 | @regression |
| Agents | populated | searching "Asta" narrows the table to the Asta row and puts ?q=Asta in the URL | TC-04 | @critical |
| Agents | empty | a nonsense search shows "No agents match these filters" and "Try a different search term, or widen the status filter." | TC-05 | @regression |
| Agents | empty | Clear filters in the empty state empties the search and brings the agents back | TC-06 | @regression |
| Agents | populated | All filter is pressed by default | TC-07 | @regression |
| Agents | populated | Running filter becomes pressed and sets ?status=running | TC-08 | @regression |
| Agents | populated | Stopped filter becomes pressed and sets ?status=stopped | TC-09 | @regression |
| Agents | populated | Error filter becomes pressed and sets ?status=error | TC-10 | @regression |
| Agents | role-gated:authenticated | the saved admin session opens /admin/agents signed in | TC-11 | @critical |

## Row menu and dialogs - Asta

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Actions for Asta menu | populated | the "Actions for <agent name>" button opens a menu that lists View details, Deploy, Stop, View logs, Download bundle, Storage quota, Reprovision and Delete for a running agent | TC-12 | @regression |
| Agent detail dialog | populated | View details shows the Asta heading and Agent ID, Owner, Agent email, Public URL, Container, Image, Channels, Skills, Tasks, Sub-agents, Created, Updated and the Storage heading | TC-13 | @regression |
| Agent detail dialog | loading | the Storage section shows "Loading usage…" while usage loads | TC-14 | @regression |
| Agent detail dialog | terminal | Close closes the detail dialog | TC-15 | @regression |
| Container logs dialog | populated | View logs shows the Filter logs… box and the buttons Refresh, Close, Regex toggle (.*), Match case toggle (Aa), All, Hide noise, Warn + errors, Group by run, Toggle line wrap, Toggle auto-scroll, Copy filtered lines, Download all lines, Clear logs, Live and Load more (+150) | TC-16 | @regression |
| Container logs dialog | loading | while fetching, the dialog shows "Fetching logs…" with Refresh and Load more (+150) disabled | TC-17 | @regression |
| Storage quota dialog | disabled | Storage quota shows Quota (GB) with the inherited default, Reset to default disabled, and the Cancel, Save quota and Close buttons | TC-18 | @regression |
| Storage quota dialog | terminal | Cancel closes the Storage quota dialog without saving | TC-19 | @regression |

## State changes - Asta only

Approved on Dev: Stop and Start (any agent, asta used) and Storage quota save then Reset to default on asta. A `ownAgent` guard fixture restores asta (Start if stopped, Reset to default if overridden) after every test, even a failed one, through the UI (teardown ladder: UI, because the admin API is not exposed). The precondition (a stopped or overridden asta) is built through the UI for the same reason: there is no API seeding path. The tests run serially because they share one agent.

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Agents | stopped | Stop on Asta flips its row to Stopped and its menu then offers Start instead of Stop | TC-20 | @regression |
| Agents | stopped | a stopped Asta is listed under the Stopped filter and Start brings it back to Running | TC-21 | @regression |
| Storage quota dialog | overridden | Save quota with a custom value closes the dialog; reopening shows the value, the note "Currently overridden - agent owner sees this cap, not the platform default." and an enabled Reset to default | TC-22 | @regression |
| Storage quota dialog | terminal | Reset to default returns Asta to the inherited default: the override note disappears and Reset to default is disabled again | TC-23 | @regression |

## Out of scope (recorded, not tested)

- Draft agents (Start from a never-deployed state) are not reachable on shared Dev without creating an agent, and there is no create-agent entry.
- "No container found for this agent." appears only for an agent with no container; Asta has one.
- Deploy, Reprovision and Download bundle change or export shared state and are not approved. Delete is forbidden on every agent.
- The list error state needs a backend failure and is not forced on shared Dev.
- The Findings recorded in the baseline (no create-agent entry, one-click destructive actions) go to `findings/admin.txt`, not assertions.
