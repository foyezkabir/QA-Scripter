# User Settings - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/configuration)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-settings.baseline.json`.

Spec files: `user-settings.spec.ts` (read-only) · `user-settings-state.spec.ts` (changes Asta; runs in the `chromium-state` project after the read-only run). Runs signed in as **DEV user 1** through the default `.auth/user.json`, against the user's own assistant **Asta** (approved for any test action except deleting it).

Setup: the three tests that change Asta (the role, Dream Mode and Response Tone ones in the state spec) request the `restoredSettings` fixture. Teardown ladder rung 3 (UI): it opens the page and puts Role back to QA Assistant, Dream Mode off and Response Tone to Concise, waiting for each change request to finish; a failed restore is attached to the test, never thrown. Every other test only reads. The key list, tokens and description text are live data and are not asserted by value. The three Behavior switches and the Response Tone select have no accessible name, so they are found by role (the switches by their fixed order). The page shows no toast after Save Changes or an autosave, so the tests assert the saved value after a reload instead.

## Basic Information

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Settings | populated | the page shows the heading Settings, "Set up who your assistant is, how it behaves, and what happens to it." and the sections Basic Information, Behavior (with Response Behavior), Access key, Agent-to-agent access, Backup and Danger Zone | TC-01 | @smoke |
| Basic Information | populated | the Pick an icon button, Agent Name Asta, Role QA Assistant and Describe what your agent does are shown with their hints | TC-02 | @regression |
| Basic Information | disabled | Save Changes is disabled until a field changes | TC-03 | @regression |
| Basic Information | error | emptying Agent Name marks it invalid and keeps Save Changes disabled | TC-04 | @regression |
| Basic Information | error | emptying Role marks it invalid and keeps Save Changes disabled | TC-05 | @regression |
| Emoji picker | populated | the icon button opens a picker with the search box "Type to search for an emoji" and the tabs Frequently Used, Smileys & People, Animals & Nature, Food & Drink, Travel & Places, Activities, Objects, Symbols and Flags | TC-06 | @regression |
| Basic Information | dirty | a changed Role enables Save Changes, Save Changes stores it, disables the button again and the new Role is still there after a reload | TC-14 | @critical |

## Behavior

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Behavior | populated | the section says "Changes save on their own." and shows three switches (Learn from your feedback, Dream Mode, Sentiment Analysis) with their hints and the Response Tone hint | TC-07 | @regression |
| Behavior | populated | Response Tone offers Professional, Friendly, Concise, Detailed and Custom with Concise selected | TC-08 | @regression |
| Behavior | autosaved | switching Dream Mode on saves at once and it is still on after a reload | TC-15 | @regression |
| Behavior | autosaved | choosing a Response Tone saves at once and it is still chosen after a reload | TC-16 | @regression |

## Access key, Agent-to-agent access, Backup, Danger Zone

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Access key | no-access-key | the section explains the key, shows "No access key" with the fallback hint and offers Generate access key | TC-09 | @regression |
| Agent-to-agent access | populated | the section explains the A2A protocol and offers New key | TC-10 | @regression |
| New key form | disabled | New key opens the box "What will use it? e.g. Zapier, our CI, Maya's agent" with Create disabled while it is empty, and Cancel closes the form | TC-11 | @regression |
| Backup | populated | the section shows Agent Backup with Backup now and Download Copy, and "Copy for your own setup" with Download bundle | TC-12 | @regression |
| Danger Zone | populated | the zone shows "Destructive actions live here. Proceed carefully." and Delete Agent with its permanent-removal warning | TC-13 | @regression |
| Agent sections | populated | the Settings link in Agent sections opens /chat/<assistant id>/configuration | TC-17 | @regression |

## Out of scope (recorded, not tested)

- **Generate access key** creates a key whose private part is shown once and rotates any earlier key, **Create** in the New key form creates an A2A key, **Backup now** triggers a backup, and **Download Copy** and **Download bundle** start downloads; all are shown and never clicked.
- **Delete Agent** is never clicked: agents are never deleted by tests, so the Delete Agent confirmation dialog and the terminal state are not reached.
- The switches **Learn from your feedback** and **Sentiment Analysis** are only counted; only Dream Mode is toggled. Choosing an emoji, typing a description and changing Agent Name are not done.
- The revoked key row (its badge, prefix and "Revoked" date) is live data and is not asserted. The empty key list, loading and the Save error cases need deleting keys or a failing save and are not reached.
- The sidebar controls **Back**, **Collapse sidebar**, **Switch agent** and **Notifications** belong to the chat and shell modules.
