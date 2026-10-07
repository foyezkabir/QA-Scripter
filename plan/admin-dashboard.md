# Admin Dashboard - test plan (DEV https://admin.dev.app.velaops.ai/admin)

Depth: **standard read-only**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/admin-dashboard.baseline.json`.

Spec file: `admin-dashboard.spec.ts`. Every test requests the `adminSession` fixture (cookie + sessionStorage restored from `.auth/admin.json`).

Read-only. Nothing on the dashboard changes shared data. The Appearance toggle only changes this browser's theme (localStorage of a fresh context). Live numbers (agents, people, credit, spend, messages, activity feed rows) are never asserted - only section headings, labels and navigation targets. Plain-text messages have no ARIA role.

## Dashboard - /admin

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Dashboard | populated | page shows heading "Welcome back", the text "A few things need a look. Here is how your workspace is doing today." and the sections Agents working, People with access, Money left, Happy replies, Where people reach your agents, Your agents right now, Money and usage, Things to look at, What happened recently and Suggestions, plus the search box "Search agents, people or events" | TC-01 | @smoke |
| Dashboard | role-gated:authenticated | the Admin account button shows the signed-in role Super Admin | TC-02 | @critical |

## Sidebar navigation

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Sidebar | populated | sidebar lists the groups Management and System with the links Dashboard, Agents, Users, Usage, AI Platform, Audit Log and Feedback, the Admin dashboard logo link, and the buttons Collapse sidebar and Admin account | TC-03 | @regression |
| Sidebar | terminal | Agents opens /admin/agents | TC-04 | @critical |
| Sidebar | terminal | Users opens /admin/users | TC-05 | @critical |
| Sidebar | terminal | Usage opens /admin/usage | TC-06 | @critical |
| Sidebar | terminal | AI Platform opens /admin/ai-platform | TC-07 | @critical |
| Sidebar | terminal | Audit Log opens /admin/audit-log | TC-08 | @critical |
| Sidebar | terminal | Feedback opens /admin/feedback | TC-09 | @critical |
| Sidebar | terminal | Dashboard opens /admin from another page | TC-10 | @regression |
| Sidebar | collapsed | Collapse sidebar becomes Expand sidebar, the group labels are hidden and Admin account becomes a link | TC-11 | @regression |
| Sidebar | collapsed | Expand sidebar restores the Collapse sidebar button and the group labels | TC-12 | @regression |

## Overview cards

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Agents working card | terminal | "Agents working options" opens a menu with View details, which opens /admin/agents | TC-13 | @regression |
| People with access card | terminal | "People with access options" opens a menu with View details, which opens /admin/users | TC-14 | @regression |
| Money left card | terminal | "Money left options" opens a menu with View details, which opens /admin/ai-platform | TC-15 | @regression |
| Happy replies card | terminal | "Happy replies options" opens a menu with View details, which opens /admin/feedback | TC-16 | @regression |

## Channels chart, activity and links

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Channels chart | populated | the All channels filter opens a menu with the items All channels and Connected only | TC-17 | @regression |
| Channels chart | populated | choosing Connected only changes the filter button to Connected only | TC-18 | @regression |
| What happened recently | terminal | See all opens /admin/audit-log | TC-19 | @regression |
| Dashboard | populated | Open the learning centre links to /help | TC-20 | @regression |

## Appearance

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Admin account menu | theme | Appearance switches the page to dark mode | TC-21 | @regression |
| Admin account menu | theme | choosing Appearance again switches the page back to light mode | TC-22 | @regression |

## Out of scope (recorded, not tested)

- **Things to look at** items (Turn back on, Review, Open agents) are data-driven: each appears only while agents are switched off, people are unconfirmed or blocked, or an agent was never finished. Their targets (/admin/agents, /admin/users) are the same routes TC-04 and TC-05 cover; the items themselves cannot be held in place on shared Dev.
- The low OpenRouter credit banner (Top up, Dismiss) shows only while credit is under the reminder line and was absent at capture. Top up leaves for openrouter.ai and Dismiss changes banner state.
- Happy replies with no ratings shows "Nobody has rated a reply yet" and Suggestions shows the matching hint; both depend on whether anyone has rated a reply, which shared Dev data controls, so the empty state is recorded but not asserted.
- The search box "Search agents, people or events" accepts text but returns nothing and Enter does nothing; recorded as a finding in `findings/admin.txt` rather than asserting a no-op.
- Loading and error states need a slow or failed backend and are not forced on shared Dev.
- The Admin account menu items (signed-in email, Sign out) are covered by `admin-login`.
