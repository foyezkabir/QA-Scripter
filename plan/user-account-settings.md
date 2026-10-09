# User Account Settings - test plan (DEV https://dev.app.velaops.ai/settings)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-account-settings.baseline.json`.

Spec files: `user-account-settings.spec.ts` (read-only) · `user-account-settings-state.spec.ts` (changes two preferences; runs in the `chromium-state` project after the read-only run). Runs signed in as **DEV user 1** through the default `.auth/user.json`.

Setup: the read-only tests only look, open lists and reveal an empty password field's text; nothing is typed into a password or key field. The two state tests (TC-14, TC-15) switch **Compact mode** and **Product updates**; the `restoredPreferences` fixture (teardown ladder rung 3, UI) opens the pages and puts Compact mode back on and Product updates back off, even after a failure, and a failed restore is attached to the test, never thrown. API key state (the Anthropic key is not set), balances, usage figures and the quiet hours are live data and are never asserted by value or changed. **Remove key**, **Replace key**, **Save key**, **Update password**, **Sign out all other sessions**, **Enable** (two-factor authentication), **Export Data**, **Delete Account**, **Adjust plan** and **See Plans** are never used: they change credentials, sessions, billing or data. Plain-text messages have no ARIA role and the page shows no toast after a change.

## Pages

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Settings General | populated | /settings shows "Manage your settings and usage.", the navigation General, Notification, Security, Usage and Analytics and Data Control and Privacy, and Chat Preferences with the switches Sound effects, Compact mode and Remember me with their hints | TC-01 | @smoke |
| Settings General | role-gated:admin and key-set | the cards DeepSeek API key (internal), Anthropic (Claude) API key (internal) and OpenAI API key (internal) are shown as Admin-only with "Stored encrypted at rest. It is never shown again after saving." and a Show key button each, and the keys that are set show a "Key set" pill | TC-02 | @regression |
| Settings General | disabled | the key buttons Replace key and Save key are disabled while no key is typed | TC-03 | @regression |
| Settings General | populated | Session offers Auto-logout after with 15 min of inactivity, 30 min of inactivity, 1 hr of inactivity, 4 hrs of inactivity and Never | TC-04 | @regression |
| Settings Notifications | populated | /settings/notifications shows Browser Notifications (Notify when an AI response completes, Play a chime when a response completes), Email Notifications (Agent activity summary, Weekly performance digest, Error alerts, Billing receipts, Team Space activity, Task assigned to you, Mentions, Comments on watched tasks, Watched task moved, Due soon, Watched task updated, Budget alerts, Costs, Product updates) and Quiet Hours (Enable quiet hours, Start, End) | TC-05 | @regression |
| Settings Security | populated | /settings/security shows Password with Current password, New password ("At least 10 characters.") and Confirm new password, and Two-factor authentication with Enable | TC-06 | @regression |
| Settings Security | disabled | Update password is disabled while the password fields are empty | TC-07 | @regression |
| Settings Security | populated | Show password changes an empty password field to plain text | TC-08 | @regression |
| Settings Usage | populated | /settings/usage shows Usage and Analytics, Your Balance, Analytics with Tokens, Requests and Spend (30 days), the 14-day spend chart, the plan card and Want more power? | TC-09 | @regression |
| Settings Usage | disabled | Adjust plan and See Plans are disabled | TC-10 | @regression |
| Settings Privacy | populated | /settings/privacy shows Downloads with Export Data, My Information with Help us improve VelaCrew, Your Privacy Matters and the Danger Zone with Delete Account | TC-11 | @regression |
| Settings dialog | populated | the Settings dialog's Preferences section shows Appearance with System, Light and Dark and Language "English. Other languages are not available yet." | TC-12 | @regression |
| Banner | populated | the banner link Enable 2FA opens /settings/security | TC-13 | @regression |

## Changing a preference

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Chat Preferences | toggled | switching Compact mode off shows it off, and it is still off after a reload | TC-14 | @critical |
| Email Notifications | toggled | switching Product updates on shows it on, and it is still on after a reload | TC-15 | @regression |

## Out of scope (recorded, not tested)

- The icon buttons **Show key / Show password (eye)** inside the key and password inputs are checked only through **Show password** (TC-08); **Show key** is only checked for presence. The Quiet hours lists **Quiet hours Start** and **Quiet hours End** are only counted (TC-05) because they have no accessible name.
- The view **Settings pages** (/settings and its four sub-pages) is populated in TC-01 to TC-11.

- **Replace key**, **Remove key**, **Save key** and the key fields (**Replace key (DeepSeek)**, **API key (Anthropic)**, **Replace key (OpenAI)**) change stored provider credentials; **Update password** and the fields **Current password**, **New password** and **Confirm new password** change the account password and sign out other sessions; none is typed into or used. **Enable** starts two-factor authentication, **Sign out all other sessions** ends sessions, **Export Data** starts a download, **Delete Account** deletes the account and **Adjust plan** and **See Plans** open billing; all are shown and never used. **Dismiss** on the banner and **Go back** are shell controls and are not tested here.
- Changing **Auto-logout after**, the **Quiet hours Start** and **End** lists, **Sound effects**, **Remember me**, the other Notification switches, **Help us improve VelaCrew** and the **Appearance** choice changes the account or how the app looks and is not done; only Compact mode and Product updates are switched, and they are put back.
- The loading and error states and the terminal state are not reached; the password and key error messages need a typed value. The dialog's General, Notifications, Security, Usage and Privacy sections hold the same content as the pages and are covered by the shell module's dialog tests. A signed-out visit redirecting to sign-in is covered by the sign-in module.
