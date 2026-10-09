# User Tools - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/tools)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-tools.baseline.json`.

Spec file: `user-tools.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, in Asta's Tools section.

Setup: none. The page shows the user's real connections (Google, Microsoft, Atlassian, Notion, GitHub and others), so every test only looks, searches, collapses and opens menus: nothing is connected, reauthenticated, added, removed, disconnected or switched between Read only and Read & write, because those start an OAuth sign-in or change what the assistant can do on a real account. Which tools are connected, their accounts, their permission settings and the counts in the tab and category names are live data and are never asserted by value; the tool catalog (24 tools in 7 categories) is asserted by name. Plain-text messages have no ARIA role, and Sync shows no toast.

## Browse Tool and Connected

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Tools | populated | the page shows the heading Tools, "Connect the apps you already use so your assistant can do the work for you.", the views Browse Tool and Connected (15) and the Search tools… box | TC-01 | @smoke |
| Browse Tool | populated | the categories Google Workspace, Microsoft 365, Atlassian, Productivity, Developer, Scheduling and Finance & Accounting are listed with their counts | TC-02 | @regression |
| Browse Tool | populated | the 24 tools Google Calendar, Gmail, Google Drive, Google Sheets, Google Docs, Outlook, OneDrive, SharePoint, Excel, Microsoft Teams, Jira, Confluence, Notion, Linear, Asana, Trello, Dropbox, Slack, Huly, GitHub, Cal.com, Calendly, Xero, Odoo and QuickBooks are shown | TC-03 | @regression |
| Browse Tool | read-only | each tool card has a permission group with Read only and Read & write, exactly one of them pressed | TC-04 | @regression |
| Browse Tool | not-connected | the tools that are not connected offer an icon-only Connect button | TC-05 | @regression |
| Browse Tool | error | the Connection error button on a Scheduling tool opens a popover whose text ends with "Click Try again to retry." | TC-06 | @regression |
| Browse Tool | collapsed | choosing a category header hides its cards and choosing it again shows them | TC-07 | @regression |
| Search | populated | searching for "git" keeps GitHub and hides the tools that do not match | TC-08 | @regression |
| Search | empty | searching for text that matches nothing shows "Nothing matches" the query and "Try a different name or clear the search." | TC-09 | @regression |
| Connected | connected | choosing Connected shows the Search connected tools… box, Sync, the connected cards with Connected and a Manage button each | TC-10 | @regression |
| Connected | loading | Sync is disabled while it runs and enabled again afterwards | TC-11 | @regression |
| Manage menu | populated | Manage on a connected card offers Reauthenticate and Disconnect | TC-12 | @regression |
| Agent sections | populated | the Tools link in Agent sections opens /chat/<assistant id>/tools | TC-13 | @regression |

## Out of scope (recorded, not tested)

- The category names and the Connected view carry live counts (**Google Workspace 5**, **Microsoft 365 5**, **Atlassian 2**, **Productivity 7**, **Developer 1**, **Scheduling 2**, **Finance & Accounting 3** and **Connected (15)**) and are matched by their leading words. The Connection error popover text changes with the failure (the crawl saw "The sign-in window closed before authorization finished. Click Try again to retry.", a later run "A previous sign-in attempt was left unfinished. Click Try again to retry."), so only "Click Try again to retry." is asserted. The Huly card has no logo, so the catalog is matched by name text and the tool logos (alt text is the tool name) are used only by the collapse and search checks (TC-07, TC-08).

- **Connect**, **Reauthenticate**, **Add account…** and **Disconnect** start an OAuth sign-in or remove a real connection; **Remove additional account** removes a real account (its full name carries the account label). They are shown (Connect, the Manage items) and never clicked, and the Disconnect confirmation is not opened.
- **Read only** and **Read & write** change what the assistant may do on a real account; the groups are only checked for presence and for exactly one pressed button, and are never clicked.
- The notes "Enforced by VelaCrew...", "Enforced by the provider..." and "Read-only limits your assistant, not the account..." depend on each tool's live permission and are not asserted.
- The empty connections state needs every tool disconnected and is not reached; the roles other than user are not tested. **Add account…** appears only on some tools and is not asserted.
- **Connection error** exists only while a tool's last sign-in failed (live data); TC-06 depends on it and fails with a clear message if the error is cleared.
