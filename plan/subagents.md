# Plan: Subagents module

Route: `/chat/:agentId/subagents`
Explored live at: dev.app.velaops.ai (Rex Dev agent, AGENT_ID = ae4ba9b2-1add-482c-a053-200b729200bd)
No ticket/AC/Figma supplied - plan derived purely from live-UI exploration (Chrome DevTools MCP then Playwright MCP after the former disconnected mid-session).

## Views discovered
- **List view** (`/subagents`): heading "Subagents", intro paragraph, "Create Subagent" button, "Search subagents…" textbox, grid of subagent cards.
- **Empty state** (zero subagents, or zero after search filter with no match): heading + message + "Create Subagent" button. Two distinct copies:
  - True empty (no subagents at all): "No subagents yet" / "Create a subagent to handle a specific task — code reviews, customer support, lead scoring — the choice is yours."
  - Search no-match: "No matches" / "Try a different search term."
- **Create Subagent dialog** (`role="dialog"`, opened by "Create Subagent"): Icon picker (emoji button, default 🤖), Name (textbox, placeholder "e.g. Code Reviewer"), Description (textbox, placeholder "Brief description of what this subagent does", optional), Instructions (textbox, placeholder "Detailed instructions for this subagent's behavior…"). Cancel / Create / Close buttons. **Create stays disabled until BOTH Name and Instructions are filled** - Description is optional (confirmed live: Name-only leaves Create disabled; Name+Instructions enables it). This differs from the Projects module, where Name alone is sufficient - do not assume parity across modules.
- **Edit Subagent dialog** (`role="dialog"`, opened by a card's "Edit" button): same field set as Create, prefilled with the subagent's current values. Heading "Edit Subagent".
- **Subagent Details modal** (`role="dialog"`, opened by a card's "Details" button): heading "Subagent Details", subagent name/icon, status pill ("Active"), "View instructions →" button, four stat blocks (Today / This week / All time run counts, all "0 runs" for a fresh subagent; Success rate "— no runs yet"), "Recent activity" section with empty state "Nothing yet" / "No activity yet" / explanatory copy. Close button.
- **Delete confirmation dialog** (`role="dialog"`, opened by a card's "Delete" button): heading `Delete <name>?`, paragraph "This will permanently remove this subagent. This can't be undone.", buttons "Keep it" / "Yes, delete" / Close.

## Card structure (per subagent)
- `heading [level=3]`: subagent name
- Action buttons (unnamed group, resolved via full/non-compact accessibility snapshot): "Details", "Edit", "Delete"
- A `switch` toggle whose accessible name flips between **"Disable"** (checked=true, subagent currently enabled) and **"Enable"** (unchecked, subagent currently disabled) - confirmed live: clicking it fires `PATCH /api/agents/:agentId/sub-agents/:id` with `{ enabled: <bool> }`, and the accessible name updates to reflect the new state after refetch.
- Description paragraph (optional - only present if a Description was set).

No kebab/overflow menu on a card - all three actions plus the toggle are always-visible siblings.

## API observed (read-only network capture - NOT used for seeding, per project rule; no API setup layer for this module, same as Tasks/Chat/Projects/Skills)
- `GET /api/agents/:agentId/sub-agents` - list
- `POST /api/agents/:agentId/sub-agents` - create (201)
- `PATCH /api/agents/:agentId/sub-agents/:id` - used for the enable/disable toggle (`{ enabled: bool }`)
- `GET /api/agents/:agentId/sub-agents/:id/invocations` - backs the Details modal's Recent activity section

## Test plan (view x state x action -> TC)

| # | View/State | Action | TC | Tag |
|---|---|---|---|---|
| 1 | List, zero subagents (fresh env) | Load page | TC-01: empty state renders | @smoke |
| 2 | Create dialog | Leave Name+Instructions empty | TC-02: Create disabled | @regression |
| 3 | Create dialog | Fill Name+Description+Instructions, submit | TC-03: subagent created, appears in list | @smoke @critical |
| 4 | List, subagent exists | Search by exact name | TC-04: search filters to match | @regression |
| 5 | List, subagent exists | Search with no match | TC-05: "No matches" empty state | @regression |
| 6 | Details modal | Open via "Details" | TC-06: shows status/stats/Recent activity | @regression |
| 7 | Edit dialog | Open via "Edit" | TC-07: opens prefilled with current values | @regression |
| 8 | Edit dialog | Change Name, save | TC-08: list reflects the renamed subagent | @critical |
| 9 | Card toggle | Click Disable/Enable switch | TC-09: toggles state and label, persists after reload | @critical |
| 10 | Delete confirm | Open then "Keep it" | TC-10: dialog names the subagent; cancel leaves it intact | @regression |
| 11 | Delete confirm | "Yes, delete" | TC-11: subagent removed from the list | @critical |

## Fixture pattern
- **Pattern B (subject)**: subagent creation (TC-03) - created via UI, registered with `cleanupSubagents` for teardown.
- **Pattern A (precondition)**: every other test (search, details, edit, toggle, delete) needs an already-existing subagent - seeded via `seededSubagent` fixture (UI-created before test body, UI-deleted after), same convention as `seededTask`/`seededProject` (no API endpoint exploited for seeding - not needed, UI creation is instant and reliable; teardown is UI-delete, an accepted rung on the teardown ladder).

## Known defect affecting TC-09
Confirmed 3/3 in automated re-runs (isolated from any other test/timing noise): the very first click on
a freshly-created subagent's Enable/Disable toggle sends a no-op PATCH (`{"enabled": <same value>}`)
instead of the inverse - a second click on the same switch always works correctly. TC-09 asserts the
correct (single-click) behavior and will legitimately fail until this is fixed - see `findings/subagents.txt`.
This is NOT a script defect (confirmed via network trace: the PATCH payload itself is wrong, not a
stale read on the test side).

## Critic gate
- Every discovered state (list-populated, list-empty, search-no-match, Create validation, Details modal, Edit dialog, toggle on/off, delete-cancel, delete-confirm) has >=1 TC. Zero missing.
- No Jira ticket/AC supplied for this module -> `traceability/subagents.txt` skipped per project rule (no ticket/AC to map against).
