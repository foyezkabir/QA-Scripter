# User Shell - test plan (DEV https://dev.app.velaops.ai, sidebar and overlays)

Depth: **standard read-only**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-shell.baseline.json`.

Spec file: `user-shell.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json` that `global-setup` writes.

Read-only. Overlays and menus are only OPENED and closed. **Sign Out, Profile, Help, Share Feedback, Privacy Policy and Terms of Service are never clicked** (they leave the page or end the session; sign-out is covered by the auth module with a different user). The palette search box is never typed into (results are the user's live chats, projects and tasks). Notification items are live data and never asserted. Only the user's own assistant **Asta** is relied on in the sidebar.

## Sidebar

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Sidebar | populated | the Main sidebar shows the VelaCrew logo link, Home, My work, Search, Notifications, Settings and Account | TC-01 | @smoke |
| Sidebar | populated | the sidebar lists the assistant Asta as a link | TC-02 | @regression |
| Sidebar | terminal | Home opens /dashboard | TC-03 | @regression |
| Sidebar | terminal | My work opens /dashboard/my-work | TC-04 | @critical |
| Sidebar | terminal | the Asta link opens that assistant's chat | TC-05 | @critical |

## Command palette

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Command palette | populated | Search opens the dialog "Command palette" with the box "Search or run a command" and the tabs All, Chats, Projects, Tasks and Tools | TC-06 | @regression |
| Command palette | disabled | on Home the quick actions New chat, New task, New project and Connect a tool are listed and disabled | TC-07 | @regression |
| Command palette | populated | choosing the Chats tab selects it | TC-08 | @regression |
| Command palette | terminal | Escape closes the command palette | TC-09 | @regression |
| Command palette | populated | Ctrl+K opens the command palette | TC-10 | @regression |
| Command palette | terminal | the Close command palette button closes it | TC-11 | @regression |

## Notifications, settings and account menu

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Notifications panel | populated | Notifications opens the panel with "Show notifications" set to All | TC-12 | @regression |
| Notifications panel | populated | choosing Unread selects it | TC-13 | @regression |
| Settings dialog | populated | Settings opens the dialog with the sections General, Preferences, Notifications, Security, Usage and Privacy | TC-14 | @regression |
| Settings dialog | terminal | Escape closes the Settings dialog | TC-15 | @regression |
| Account menu | role-gated:authenticated | Account opens a menu showing the user's name and email and the items Profile, Help, Share Feedback, Privacy Policy, Terms of Service and Sign Out | TC-16 | @critical |

## Out of scope (recorded, not tested)

- Typing in **Search or run a command** returns live chats, projects and tasks; results are not asserted.
- **Notification** items (Today, Earlier) are live data; only the panel and its All and Unread radios are tested.
- The content of the **Settings** dialog (chat preferences, API keys, security, usage, privacy) belongs to `user-settings`; here it is only opened and its section buttons listed.
- **Profile**, **Help**, **Share Feedback**, **Privacy Policy**, **Terms of Service** and **Sign Out** are listed but never clicked; sign-out is covered by `auth`.
- Empty notification lists and a user with no assistants need other accounts; none is approved.
- Logged-out redirects are covered by the `auth` module redirect test.
