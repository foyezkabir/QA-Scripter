# Test Plan - Tasks module (VelaOps / VOPS)

Source: live exploration of `https://dev.app.velaops.ai/chat/<agentId>/tasks` (Rex Dev agent),
`raw/velaops/velaops-application-guide.md` section 8, `KNOWLEDGE_HANDOFF.md` (Second Brain vault).
No Jira ticket cited for this pass - traceability matrix skipped per project convention.

Note (project-critical context): Tasks/scheduled-automation reliability is one of Luca Licata's
three named shutdown-threat categories (stable by end of July 2026 or platform shuts down).
Weight coverage accordingly - CRUD + persistence + toggle-state get @critical, not just @regression.

## View: Tasks list (`/chat/:agentId/tasks`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Populated (14 existing tasks) | Page loads, tasks render | TC-01 | @smoke |
| Populated | Click "New Task" -> dialog opens | TC-02 (part of create flow) | @smoke |
| Create dialog, empty | Create button disabled until Name + Task/Prompt filled | TC-03 | @regression |
| Create dialog, Name only filled | Create button still disabled (Prompt also required) | TC-04 | @regression |
| Create dialog, valid | Submit -> task appears in list (subject = UI-created, Pattern B) | TC-02 | @smoke @critical |
| Create dialog | Task/Prompt field auto-inserts Goal/Context/Steps/Output scaffold on focus (undocumented in app-guide - flag as drift, not a bug) | TC-05 | @regression |
| Create dialog | Schedule preset dropdown (7 presets + Custom) | TC-06 | @regression |
| Create dialog, Custom selected | Frequency/time picker shown, live human label + cron preview (`0 9 * * *` style), timezone shown (Asia/Dhaka) | TC-07 | @regression |
| Create dialog, Custom + Advanced cron | Raw label + cron/interval/one-shot text inputs shown, accepts free text | TC-08 | @regression |
| Create dialog | Task complexity Simple/Complex toggle-buttons (Simple = default) | TC-09 | @regression |
| Create dialog | Enabled switch defaults on | TC-10 | @regression |
| Existing task (precondition, Pattern A) | Click "Edit" -> Edit dialog pre-filled with existing values, cron normalizes back to matching preset when exact | TC-11 | @regression |
| Existing task | Edit -> change name/description -> Save Changes -> list reflects update | TC-12 | @regression |
| Existing task | Toggle switch Disable->Enable flips accessible name + visual state (name = next action, not current state - do not locate by fixed "Disable"/"Enable" text alone; scope by row heading) | TC-13 | @critical |
| Disabled task | Toggle Enable->Disable restores original state | TC-14 | @regression |
| Existing task | Click "Delete" -> confirmation dialog ("Delete <name>? This can't be undone.") | TC-15 | @regression |
| Delete confirm dialog | Click "Keep it" -> dialog closes, task NOT removed | TC-16 | @regression |
| Delete confirm dialog | Click "Yes, delete" -> task removed from list immediately | TC-17 | @critical |
| Post-delete | Reload page -> deleted task does NOT reappear (regression guard against known delete-persistence race - KNOWLEDGE_HANDOFF.md section 10: "deleted tasks can silently resurrect on the next Tasks-page sync") | TC-18 | @critical |

## Known product-risk areas observed but NOT covered by UI-only tests in this pass (documented gaps, not silent)

- Cron model allowlist bug (unfiled, per handoff): task creation accepts any model at save time but
  silently rejects non-allowlist models at runtime. Requires a model-selector field not present in
  this Tasks dialog (model chosen elsewhere in chat) - out of scope for this module's UI tests.
- Task channel lane-binding: task fires but delivers to the wrong channel. Requires multi-channel
  integration setup (Teams/Telegram) beyond this module's exploration scope - flag for a
  cross-module (Tasks + Messaging) test pass.
- Cascade delete anomaly (unconfirmed, needs RnD per handoff): deleting one task once appeared to
  remove an unrelated second task. Not reproduced in 3 prior attempts. TC-17/TC-18 above will catch
  a recurrence if it happens during a run (assert only the targeted task is affected), but this is
  not a dedicated repro test - flagged as a known-flaky area to watch.
- Empty-state (zero tasks) view: NOT captured this pass - the only available agent (Rex Dev) has
  14 seeded tasks and provisioning a fresh agent to observe the empty state was judged too costly/
  slow for this exploration pass (full 8-stage pipeline). Gap - flagged, not silently skipped.

## Completeness critic

- Every observed state/transition above has an intended TC. Zero-missing at time of writing.
- Gap: empty-state view (see above) - explicitly flagged, not silently dropped.
- No AC list exists (no Jira ticket) - traceability matrix not applicable this pass.
