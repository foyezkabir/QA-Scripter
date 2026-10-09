# User CRM - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/crm)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-crm.baseline.json`.

Spec file: `user-crm.spec.ts`. Runs signed in as **DEV user 1** (the CRM owner) through the default `.auth/user.json`, in Asta's CRM section (full access granted on this Dev account).

Setup: tests that need a record get one from a fixture (preconditions built through the UI, because the CRM has no API seeding path the suite can call): `createdPerson` creates a QA-AUTO person with New and Create person, `createdMember` adds a QA-AUTO team member with Add person and Add to team, and `createdDashboard` creates a QA-AUTO dashboard with New dashboard. Teardown ladder rung 3 (UI): the `crmCleanup` fixture deletes every QA-AUTO person with the row selection, Delete and Yes, delete 1, removes every QA-AUTO team member, deletes every QA-AUTO dashboard and then deletes the QA-AUTO rows in Archive & Trash forever, even after a failure; a failed cleanup is attached to the test, never thrown. The creation tests use `crmCleanup` directly. The spec runs its tests one after another because the cleanup sweeps every QA-AUTO item. Existing companies, people, deals, notes, tasks, team members, dashboards and the CRM itself are never touched; the record counts in the tab names and in the cards are live data and are matched by their leading words. Toasts are items in the Notifications region and have no role status or alert. The Setup tab (data model, fields, email and calendar connections, Archive and Move to Trash of the CRM) and the dashboard Six checks actions change the CRM schema, connect external accounts or change many records, so they are listed and never used.

## Landing and workspace

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| CRM landing | populated | the page shows the heading CRM, "Your book of business in one place, so your assistant always knows who matters and what is at risk", Archive & Trash (1) and the CRM card with its Open link and CRM setup | TC-01 | @smoke |
| Archive & Trash dialog | populated | Archive & Trash (1) opens a dialog with "Nothing here is gone. Put anything back where it was, or clear out what you are sure about." and the tabs Archived (0) and Trash (2) | TC-02 | @regression |
| CRM workspace | populated | the Open link opens the workspace at ?open=1 with the tabs Dashboards, Companies 19, People 7, Opportunities 7, Notes 17, Tasks 6, Team and Setup | TC-03 | @regression |
| Dashboards | populated | Dashboards shows Choose a dashboard, Edit, the Overview and Work tabs and the widgets Open pipeline, Open opportunities, Won, Overdue tasks and Six checks | TC-04 | @regression |
| Companies | populated | Companies shows Search companies, the chips Has open opportunity, Dark over 30d and Single-threaded, New, Filter by field and the columns Name, Domain, Revenue, Account owner, Location, Last contact, Contacts, Open opportunities and Open value | TC-05 | @regression |
| People | populated | People shows Search people, the chips Owes us a reply, Never replied and Exec level, New, Filter by field and the columns Name, Job title, Email, Company, They last replied, We last wrote and Reply debt | TC-06 | @regression |
| Opportunities | populated | Opportunities shows Search opportunities, the chips Open only, 2+ risk signals, Dark over 30d, Close date passed, Closing in 30 days and Single-threaded, New, Filter by field, the columns Opportunity, Stage, Amount, Close date, Company, Point of contact, Owner, Days to close and Since contact (the columns Age and Risk signals sit further right and are only listed), and a Table view or Kanban view choice | TC-07 | @regression |
| Notes | populated | Notes shows Search notes, the chips Last 14 days and About a deal, New and the columns Title, About, Body and Written | TC-08 | @regression |
| Tasks | populated | Tasks shows Search tasks, the chips Not done, Overdue and Due this week, New and the columns Task, Status, Due, Timing, Assignee and About | TC-09 | @regression |
| Team | populated | Team shows Add person and a card for each member with Edit and Remove from the team | TC-10 | @regression |
| Tab menu | populated | Choose which tabs to show offers Companies, People, Opportunities, Notes, Tasks and Team | TC-11 | @regression |
| Filter builder | disabled | Filter by field opens a field choice, an operator choice and a Value box with Add disabled and Cancel | TC-12 | @regression |
| Column menu | populated | a column's options (Name column options) offer Sort ascending, Sort descending, Move left, Move right and Hide column | TC-13 | @regression |
| Agent sections | populated | the CRM link in Agent sections opens /chat/<assistant id>/crm | TC-14 | @regression |

## Person

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| New person dialog | populated | New on People opens "Saved to your VelaCrew CRM as soon as you create it." with Name (First and Last), Job title, Company, Email, Phone, LinkedIn, Create person, Cancel and "⌘↵ to create" | TC-15 | @regression |
| New person dialog | error | Create person with no name shows "Name cannot be empty." and creates nothing | TC-16 | @regression |
| New person dialog | created | Create person with a name shows the toast "Person created" and opens the person's record | TC-17 | @critical |
| Record | populated | a new person's record shows the name, Edit all, Delete, the Edit buttons for Name, Email, Phone, Job title, LinkedIn and Company, and Notes and Tasks with "None yet." | TC-18 | @regression |
| Record | dirty | Edit Job title opens an inline editor with Save and Cancel and Save shows the new job title | TC-19 | @regression |
| Delete dialog | populated | Delete asks "Delete <name>?" with "It moves to your CRM's trash, where it can be restored. VelaCrew also keeps a copy in the change log." and Keep it leaves the record | TC-20 | @regression |
| Delete dialog | deleted | Yes, delete shows the toast "Deleted" and Archive & Trash lists the person under Trash as "person · deleted" with Restore and Delete forever | TC-21 | @critical |
| Delete forever dialog | populated | Delete forever asks 'Delete "<name>" forever?' with "This removes the person from your CRM for good..." and Keep it leaves it in the trash | TC-22 | @regression |
| Delete forever dialog | terminal | Yes, delete shows the toast '"<name>" deleted forever' and the person is gone from the trash | TC-23 | @critical |
| Row selection | selected-rows | selecting a person's row shows Delete and Clear, Delete asks "Delete 1 record?" and Keep it leaves the person | TC-24 | @regression |

## Team

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Add someone to the team dialog | disabled | Add person opens a dialog with Name*, Email, Job title, the note "They become selectable as an owner or assignee straight away..." and Add to team disabled while Name is empty | TC-25 | @regression |
| Add someone to the team dialog | created | Add to team with a name lists the member as a card | TC-26 | @critical |
| Remove from the team dialog | populated | Remove from the team asks "Remove <name> from the team?" with "They have nothing assigned. They will stop appearing in owner and assignee pickers." and Keep it leaves the member | TC-27 | @regression |
| Remove from the team dialog | terminal | Yes, remove shows the toast "Removed" and the member is gone | TC-28 | @critical |

## Dashboards

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| New dashboard dialog | disabled | New dashboard opens a dialog with "Everyone whose agent is bound to this CRM workspace will see it.", a Name box with the hint "You can rename it at any time." and Create dashboard disabled while Name is empty | TC-29 | @regression |
| New dashboard dialog | created | Create dashboard makes the new dashboard the chosen one with its Overview tab selected | TC-30 | @critical |
| Delete dashboard dialog | populated | Delete dashboard asks 'Delete "<name>"?' with "Every agent on this workspace loses it. The records it charted are untouched." and Keep it leaves the dashboard | TC-31 | @regression |
| Delete dashboard dialog | terminal | Yes, delete the dashboard removes the dashboard | TC-32 | @critical |

## Out of scope (recorded, not tested)

- The row actions **Select row** (used by TC-24 and the cleanup), **Edit Name**, **Edit Title** and **Edit all fields** on every table row change shared records and are not used on existing rows. The Team card buttons are named per person, for example **Remove <person> from the team**, and open the dialog **Remove <person> from the team?** that TC-27 and TC-28 check for QA-AUTO members only.

- The message "Nothing here yet. Add a widget from the bar above." belongs to a new dashboard in edit mode (**Edit**), which is not used, so it is not asserted.

- The tab names and the card carry live counts (**Archive & Trash (1)**, **Companies 19**, **People 7**, **Opportunities 7**, **Notes 17**, **Tasks 6**, **Archived (0)** and **Trash (2)**) and are matched by their leading words; **Open <CRM name>** is matched by its leading word because the CRM's name is live data.
- The **Setup** tab, **CRM setup**, **Add object**, **Use Gmail** (and the Outlook and calendar options), **Archive** and **Move to Trash** of the CRM change the CRM schema, connect external accounts or hide the CRM and are never used. **Edit** on the dashboard, its widgets and the Six checks actions (**Push out 30 days**, **Suggest who else to meet**) change many records or call the assistant and are never used; **Rename**, **Duplicate dashboard**, **Star**, **Comfortable layout** and **Compact layout** are only checked for presence.
- **Edit all**, **Restore <name>**, **Edit <person>** and the **Columns - show, hide, reorder or add** button change shared records or the table layout and are not used; **Table view** and **Kanban view** are only checked for presence. The filter chips are toggles and are only checked for presence.
- A person's email is accepted without validation (a finding, not asserted); creating companies, opportunities, notes and tasks, and the record's Notes and Tasks **New** buttons, are not tested because the people flow already covers the shared dialogs.
- The loading state and the non-owner role are not reached; **Back**, **Collapse sidebar** and **Switch agent** belong to the chat and shell modules.
