# User Home - test plan (DEV https://dev.app.velaops.ai/dashboard)

Depth: **standard read-only**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-home.baseline.json`.

Spec file: `user-home.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json` that `global-setup` writes (one sign-in per run).

Read-only. Menus are only OPENED. **Create, Activate, Restart, Stop and Configure are never clicked**: Create starts a wizard, the others change or leave the assistant. Tests rely only on the user's own assistant **Asta** (QA Assistant); other assistants and spaces are the user's live data and may be deleted, so they are never asserted. Asta's status and the "needs attention" and credit-limit messages depend on its live budget and are never asserted. Plain-text messages have no ARIA role.

## Home - /dashboard

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Home | populated | page shows the heading "Welcome back, Naiemul", the text "Your assistants, and the teams they work in.", the Create button and the sections Assistants and Team spaces | TC-01 | @smoke |
| Home | role-gated:authenticated | the saved user-1 session opens /dashboard signed in | TC-02 | @critical |
| Home | populated | Asta's card shows its name and role "QA Assistant" with a "More for Asta" button | TC-03 | @regression |
| Create menu | populated | Create opens a menu with Agent ("Your own assistant, guided setup.") and Team space ("Invite people who bring their own agents.") | TC-04 | @regression |
| More for Asta menu | populated | the "More for <assistant name>" button (here More for Asta) opens a menu that offers Configure and Restart | TC-05 | @regression |
| Security banner | populated | the banner shows "Protect your account. Turn on two-factor authentication." with an Enable 2FA link to /settings/security and a Dismiss button | TC-06 | @regression |

## Out of scope (recorded, not tested)

- **Create** (Agent, Team space) starts a creation wizard; **Activate**, **Restart**, **Stop**, **Configure** and **Dismiss** change or leave an assistant or the banner. Menus are opened, never chosen.
- **Stopped assistants** (status text "Stopped - tap Activate to wake it", the **Activate** button and a More menu with only Configure) and **Connect a channel** links depend on which assistants the user owns and whether they run; they are not asserted.
- "**Asta needs your attention**", "**Credit limit reached - top up**" and the Needs you list depend on live budgets and are not asserted.
- Logged-out redirect from /dashboard is covered by the `auth` module's redirect test.
- Empty and error states need an account with no assistants or a backend failure; neither is approved for shared Dev.
- The sidebar, command palette, notifications, settings and account menu belong to `user-shell`.
