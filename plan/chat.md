# Test Plan - Chat module (VelaOps / VOPS)

Source: live exploration of `https://dev.app.velaops.ai/chat/<agentId>[/...]` (Rex Dev agent),
`raw/velaops/velaops-application-guide.md` section 6 (Chat) + section 5 (Agent Shell layout).
No Jira ticket cited - traceability matrix skipped per project convention.

Note (project-critical context): Chat/response reliability is one of Luca Licata's three named
shutdown-threat categories alongside Tasks and Skills. Weight coverage accordingly.

## View: Dashboard agent card (`/dashboard`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Agent Inactive (container stopped) | "Activate & Chat" button shown instead of Open/Reload/Stop | TC-01 | @regression |
| Agent activating | Boot-step progress ("Finishing up… N/6"), "Agent is booting" disabled button | TC-02 | @regression |
| Agent Active | "Open chat" / "Reload agent" / "Stop agent" buttons all present | TC-01 (same TC, opposite branch) | @regression |

## View: Chat empty state (`/chat/:agentId`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Agent warming (cold start, whether idle-resume or full reactivation) | Greeting heading present but input placeholder = "Agent is starting up…", input+chips all disabled | TC-03 | @critical (shutdown-threat: response reliability) |
| Agent ready, empty state | Greeting heading, 3 suggestion chips enabled, input enabled, Send disabled until text present | TC-04 | @smoke |
| Empty state | Type text -> Send enables | TC-05 | @regression |

## View: Conversation (`/chat/:agentId/:convId`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Empty state, valid text entered | Submit -> new conversation created lazily, URL navigates to new convId, sidebar gets new entry titled with the message text | TC-06 | @smoke @critical |
| Message sent | While generating: input disabled, "Send message" replaced by "Stop generating" | TC-07 | @regression |
| Reply complete | Assistant message renders with token-usage footer (input/cached/output) and action buttons: Copy, Retry, Read aloud, Like, Unlike | TC-08 | @smoke |
| Reply complete | User's own message shows Copy, Edit, Regenerate response | TC-09 | @regression |
| Existing conversation reloaded | Full history (user + assistant turns, token stats) renders on navigation, independent of agent warm/ready state | TC-10 | @regression |

## View: Conversation list (sidebar) kebab menu

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Conversation row | "More options" -> menu shows Rename / Pin / Delete chat (Pin undocumented in app-guide - flag as drift, not a bug) | TC-11 | @regression |
| Rename selected | Row becomes an inline-editable textbox; Enter commits new title | TC-12 | @regression |
| Delete chat selected | Confirmation dialog "Delete chat?" names the conversation, warns "cannot be undone"; Cancel / Delete / Close | TC-13 | @regression |
| Confirm delete | Conversation removed from sidebar; navigates back to agent's empty chat state | TC-14 | @critical (data-loss path) |

## View: Model selector (composer)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Composer | Model button shows current model name; opens menu labeled "PRIMARY MODEL (APPLIES TO ALL CONVERSATIONS)" with a warning that switching reloads the agent | TC-15 | @regression |
| Model menu open | Two options observed live: "DeepSeek V4 Flash (Direct)", "DeepSeek V4 Pro (Direct)" | TC-15 (same TC) | @regression |

**Deliberately NOT automated: actually switching models.** Confirmed live that switching triggers
an agent reload (full container restart) - too disruptive to run in a shared-agent regression
suite (would knock the agent offline for every other module's tests mid-run). TC-15 verifies the
menu opens and shows the expected options only; never clicks a model option.

## Known gaps - NOT covered this pass (documented, not silent)

- **Tool-call collapsible blocks** ("Thinking...", inline tool execution UI) - requires a prompt
  that reliably triggers a real tool call (Jira/Gmail/etc.) with deterministic output; out of
  scope without a seeded, stable trigger phrase. Flag for a follow-up pass once a stable
  tool-invoking prompt is agreed with dev.
- **Detached streaming / re-attach on refresh** (doc section 6.3) - requires refreshing mid-generation
  with precise timing; not attempted this pass (high flake risk, needs a longer-running prompt to
  create a safe reattach window).
- **File attachment (Add files), voice input (Speech to text), slash commands** - not exercised;
  each needs its own fixture data (files) or is inherently non-deterministic (speech), deferred.
- **Sound chime / browser notification on reply complete** - requires notification permission
  grants and audio assertions, deferred as a cross-cutting concern (also touches Account Settings).
- **Cold-start timing**: observed live boot sequence (Inactive -> Active -> 6/6 steps -> ready)
  took well over a minute in one observed run - longer than the "~10s idle-resume" the QA notes
  describe. Could not conclude whether this was ordinary Docker-in-Docker cold-boot (a fresh
  container start, not just idle-resume) or a genuine slowdown - not filed as a finding, but
  flagged here since repeated slow boots would make any Chat suite that assumes "already active"
  unreliable in CI. TC-01/02 exist specifically to keep this state under regression watch.

## Completeness critic

- Every state/transition captured live has an intended TC. Zero-missing at time of writing for
  the surfaces actually exercised.
- Gaps above are explicit, not silently dropped.
- No AC list exists (no Jira ticket) - traceability matrix not applicable this pass.
