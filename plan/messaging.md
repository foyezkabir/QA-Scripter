# Plan: Messaging module

Route: `/chat/:agentId/messaging`
Explored live at: dev.app.velaops.ai (Rex Dev agent, AGENT_ID = ae4ba9b2-1add-482c-a053-200b729200bd)
No ticket/AC/Figma supplied - plan derived purely from live-UI exploration (Playwright MCP).

## View discovered
Single view: heading "Messaging", intro paragraph, one "Connected channels" section listing three
fixed channel cards (no add/remove of channels themselves - the set of channels is static):

### WhatsApp card (PRE-EXISTING, PERMANENT - never disconnect/re-pair in tests)
- Initially explored Disconnected (a toggle switch expanded a "Pair your device" panel with "Show QR" +
  a permanently-disabled "Connect" button; "Show QR" opened a `role="dialog"` "Pair WhatsApp" modal with
  instructions + a "Pair WhatsApp" button + Close - captured for the baseline's structural record only).
- **Mid-session live drift (2026-07-17): a real phone number was paired to this shared Rex Dev agent by
  someone/something else** (not this test suite - confirmed via network/UI evidence: status flipped to
  "Connected" / "Paired" with a phone field, "Re-pair" and "Disconnect" buttons, between two live
  navigations, alongside a new unrelated chat conversation appearing - the same shared-environment
  concurrent-usage signature already seen on the Subagents module). User decision: treat WhatsApp as a
  **permanent, read-only reference channel from here on, same as Telegram** - never click its switch,
  Disconnect, or Re-pair. Tests only verify the Connected/Paired read-only state.

### Telegram card (PRE-EXISTING, PERMANENT - never disconnect in tests)
- Status label "Connected" (real, pre-existing integration - confirmed live; a chat titled "openclaw
  pairing approve telegram RZ4J393F" in this agent's history references this real Telegram bot).
- Fields: "Bot token" (masked, prefilled `••••••••`), "Allowed chat IDs (comma-separated)" (empty).
- "Disconnect" button (destructive - would tear down a real, currently-relied-upon integration; treated
  like Chat/Projects' permanent seeded items - read-only reference in tests, same convention as
  `EXISTING_PROJECT`/the 14 permanent Tasks).

### Microsoft Teams card
- Status label "Disconnected" (baseline) + a toggle switch.
- Clicking the switch expands an inline panel: "App ID" / "Tenant ID" / "App password" textboxes, a
  read-only "Messaging endpoint (set this in Azure)" textbox (prefilled with this agent's real webhook
  URL) + "Copy messaging endpoint" button, an explanatory paragraph with an external "Azure Bot" doc
  link, and a "Connect" button.
- **Connect stays disabled until all three of App ID + Tenant ID + App password are filled** (confirmed
  live - Name-only-style partial fill leaves it disabled, matching the Subagents module's Create dialog
  pattern rather than the Projects module's more lenient one).
- Confirmed live: submitting **fabricated** credentials (`00000000-...`, `common`, a dummy password)
  succeeds immediately - status flips to "Connected", fields mask to `••••••••`, "Connect" is replaced
  by "Disconnect". No synchronous credential validation against Azure happens (a real Azure Bot would
  only start receiving traffic once its side is configured to point at the endpoint) - flagged in
  findings as informational, not a confirmed bug (could be intentional - real validation may only ever
  happen via Azure's own callback, not at save time).
- **Fully connectable/disconnectable via automated test** (no real external side effects - a fake Azure
  Bot ID never gets called back) - this is the module's Pattern-B-equivalent (subject under test), and
  every test that connects it must disconnect it again for cleanup (no persistent seeded state needed).

## API observed (read-only network capture - no API setup layer, same convention as every other module)
- Channel state is read as part of the agent config fetch; connect/disconnect actions save through the
  agent's configuration endpoints (not deeply inspected - out of scope, UI-only automation).

## Test plan (view x state x action -> TC)

| # | View/State | Action | TC | Tag |
|---|---|---|---|---|
| 1 | Messaging page | Load | TC-01: page loads, all three channel cards render with correct baseline status | @smoke |
| 2 | WhatsApp card | Load (pre-existing, read-only) | TC-02: shows Connected status and a Paired indicator | @regression |
| 3 | Telegram card | Load (pre-existing, read-only) | TC-03: shows Connected status, masked Bot token, Disconnect button present | @regression |
| 4 | Teams card | Click toggle | TC-04: connect panel expands (App ID/Tenant ID/App password/Connect) | @regression |
| 5 | Teams connect panel | Leave fields empty/partial | TC-05: Connect stays disabled until all 3 fields are filled | @regression |
| 6 | Teams connect panel | Fill all 3 fields, click Connect | TC-06: status flips to Connected, Disconnect replaces Connect | @smoke @critical |
| 7 | Teams card (connected) | Click Disconnect | TC-07: status reverts to Disconnected, connect panel collapses | @critical |
| 8 | Teams "Messaging endpoint" | Click "Copy messaging endpoint" | TC-08: copy action is interactable (no visible error) | @regression |

## Fixture pattern
- No `seeded*`/`cleanup*` fixtures needed - Teams connect/disconnect is fully self-contained per test
  (TC-06 connects then disconnects within its own body; every other test only reads state).
- WhatsApp and Telegram are both read-only reference channels now (like `EXISTING_PROJECT`) - never
  disconnected, never re-paired, never edited.

## Critic gate
- Every discovered state (all 3 channels' disconnected/connected baselines, WhatsApp pairing dialog,
  Teams connect validation, Teams full connect/disconnect round-trip) has >=1 TC. Zero missing.
- No Jira ticket/AC supplied -> `traceability/messaging.txt` skipped per project rule.
