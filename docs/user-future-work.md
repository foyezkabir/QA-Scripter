# User app - future work

What the user-app suites do not cover yet, and why. Everything here was seen in the live app on Dev as user 1 (Asta). Nothing below was skipped by accident: each item either changes a real connection or person, sends something outside the app, spends the assistant's budget, or needs a state that cannot be forced on shared Dev data.

## Needs an approved disposable target

- **Messaging channels** (`/chat/<id>/messaging`): the four channel switches, Disconnect, Connect and the per-channel model selects change the live Telegram and Slack channels. They need a throw-away bot or workspace before they can be tested.
- **Tools** (`/chat/<id>/tools`): Connect, Reauthenticate, Add account, Disconnect and the Read only / Read & write toggle act on the user's real Google, Microsoft, Atlassian, Notion, Dropbox and GitHub connections. They need disposable provider accounts. The Connect buttons have no accessible name (finding).
- **Skills** (`/chat/<id>/skills`): Install fetches code from an external marketplace. The 56 not-installed skills are only checked for presence.
- **CRM Setup tab**: the data model (Add object, Add field, Switch off), the email and calendar connections (Use Gmail, Use Outlook, Use Google Calendar), and Archive / Move to Trash of the CRM itself change the CRM schema or hide the only CRM. The dashboard widgets (Add widget, Edit) and the Six checks actions (Push out 30 days, Suggest who else to meet) change many records or call the assistant.
- **Team space** (`/space/<id>`): anything that messages, invites, mentions or changes members is shared with other people.

## Spends the assistant's budget

- **Tasks**: Run now and the Try saying suggestions send to Telegram and run the model. Because no task is run, the needs-you, running and healthy states, the run history and the terminal states are not reached.
- **Chat**: the suggestion buttons, Edit, Regenerate response, Retry, Read aloud, Like and the model switch in the Agent model dialog are only checked for presence.
- **Project detail**: the Ask buttons (Ask to change these tiles, Ask about the load, Share them out, ...) and the project chat send messages to the assistant.

## States that need shared data to change

- Empty lists: Projects (all projects removed), Tasks list with other users' tasks, My work with no open tasks, CRM tables.
- The Settings error and loading states, the Delete Agent dialog (agents are never deleted by tests), and the revoked-key list in Agent-to-agent access.
- Loading skeletons: most pages render faster than a test can observe them.

## Known fragility

- Tests on the existing project **Pilot Release QA - Oct 2026** depend on its name and shape. Assertions that depend on its live state (tasks hidden by This round, Set up budget, task counts) were removed; the disposable Team project covers those.
- Tests on Asta's CRM, Tools and Projects pages match live counts by their leading words (for example "People 7", "Connected (15)").
- The Connection error popover on the Scheduling tools reads differently in different sessions; only "Click Try again to retry." is asserted.

## Open findings (see findings/user.txt)

Accessibility names missing on the channel switches, the Behavior switches, the Response Tone and model selects, the Connect buttons and the Skills source filters; no toast or confirmation after saving settings, tasks and workspace changes; the Workspace upload landing in `directory/` with underscored names; accepted invalid email in the CRM; and the inconsistent Create Skill validation.

## Housekeeping

- `qa-crawl.mjs` still has the unpatched Windows path bug (lines ~276 and ~282) and VelaCrew's own copy of `qa-coverage.mjs` is unpatched; both are tooling, not product.
- Pilot and Prod are untouched; the suite is wired to Dev only.
- QA-AUTO cleanup is UI-only (teardown ladder rung 3) for chats, tasks, workspace items, skills, projects and CRM records. Each fixture attaches a note when a cleanup fails, so a leak is never silent; after any run it is worth opening the matching list and checking for a QA-AUTO row.
