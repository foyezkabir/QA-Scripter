# User Projects - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/projects)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-projects.baseline.json`.

Spec file: `user-projects.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, in Asta's Projects section.

Setup: none. Every test only reads or cancels: nothing is saved, archived, trashed, restored, imported or deleted. Project names, counts, the people list, the trash rows and the Jira and Huly project lists are shared live data and are never asserted by value; tests only check that cards, rows and buttons exist. A card is opened through its Open project link, so no project is named in the tests. Plain-text messages have no ARIA role. The project detail view (Overview, Board, Progress, Risks, Digest, People and Budget tabs, New task, Board settings) is its own module.

## Projects page

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Projects | populated | the page shows the heading Projects, "Group everything for one piece of work together so your assistant always knows the full story", the buttons People, Trash & Archive, Import from Jira, Import from Huly and New Project, the Search projects box and Sort: Recent | TC-01 | @smoke |
| Project card | populated | the cards each offer an Open project link and an Edit project button | TC-02 | @regression |
| Sort menu | populated | Sort: Recent offers Recent, Oldest and Name (A–Z) | TC-03 | @regression |
| Search | empty | searching for text that matches nothing hides every card and shows "No projects match your search." with a Clear search button, and Clear search brings the cards back | TC-04 | @regression |
| Project card | populated | opening a card goes to /chat/<assistant id>/projects/<project id> | TC-05 | @critical |
| Agent sections | populated | the Projects link in Agent sections opens /chat/<assistant id>/projects | TC-06 | @regression |

## Create Project dialog

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Create Project dialog | disabled | New Project opens Create Project with Project Name, What it's for, How it should work (Bold, Italic, Code, Bullet List, Numbered List, Link), the Kind of project choices, the Team project switch, Close, Cancel and Save disabled while Project Name is empty | TC-07 | @regression |
| Create Project dialog | populated | Kind of project offers General (chosen by default), Software delivery, Event, Marketing campaign, Construction or renovation, Study or course, Client work (agency), Hiring, Research and Operations | TC-08 | @regression |
| Create Project dialog | disabled | typing a Project Name enables Save, and Cancel closes the dialog without creating a project | TC-09 | @critical |

## Project Settings dialog

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Project Settings dialog | populated | Edit project opens Project Settings with Project Name, What it's for, How it should work, Kind of project, What you call a round of work, the Team project switch, Who can see this board (Everyone in your Team Space and Only people I add), People on this board, Close, Archive, Move to Trash, Cancel and Save | TC-10 | @regression |
| Project Settings dialog | disabled | the kind of project is disabled once the board has tasks, with "Fixed now that the board has tasks - their kinds of work were sorted for it." | TC-11 | @regression |
| Project Settings dialog | populated | Cancel closes the dialog without saving | TC-12 | @regression |

## People, Trash & Archive and import dialogs

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| People dialog | populated | People opens a dialog with "Your assistant's contact book - everyone across all projects, in one place.", the tabs All, Projects and CRM with counts, Search people and Add Person, and each person has Edit and Remove buttons | TC-13 | @regression |
| People dialog | populated | choosing the Projects tab selects it and the All tab is no longer selected | TC-14 | @regression |
| Trash & Archive dialog | populated | Trash & Archive opens a dialog with "Nothing here is gone yet. Put anything back where it was, or clear out what you're sure about." and the tabs Archived and Trash with counts | TC-15 | @regression |
| Trash & Archive dialog | populated | choosing the Trash tab selects it and lists deleted projects | TC-16 | @regression |
| Import from Jira dialog | populated | Import from Jira opens a dialog with "Import creates a local copy. Re-import adds issues that are new in Jira; it never changes tasks you already have.", Search projects…, the checkbox "On a first import, create board columns from the tracker's statuses" and an Import button per project | TC-17 | @regression |
| Import from Huly dialog | populated | Import from Huly opens a dialog with "Import creates a local copy. Re-import adds issues that are new in Huly; it never changes tasks you already have.", Search projects…, the same checkbox and an Import button per project | TC-18 | @regression |

## Out of scope (recorded, not tested)

- The toolbar buttons **People (2 pending)** and **Trash & Archive (18)** carry live counts in their names; tests match them by their leading words. The pending-approval state of the People dialog depends on live agent proposals and is not forced.
- **Save** in Create Project and Project Settings creates or changes a project, **Archive** and **Move to Trash** put a project away, and **Everyone in your Team Space** and **Only people I add** change who can see a board; all are shown and never clicked.
- **Approve**, **Reject**, **Add Person**, **Edit person** and **Remove person** in the People dialog change the shared contact book and are only checked for presence. **Search people** is not typed into.
- **Restore project** and **Delete project forever** in Trash & Archive change shared project data and are only checked for presence. The message "Nothing archived." belongs to the Archived tab and depends on live data, so it is not asserted.
- **Import**, **Re-import** and the first-import checkbox create or change project data; **Search projects…** in the import dialogs is not typed into.
- The empty project list, loading and error states and the terminal states (archived, trashed, restored, deleted) are not reached: they need removing projects or a failing request.
- The sidebar controls **Back**, **Collapse sidebar**, **New Chat**, **Open command palette**, **Filter chats by time**, **Team Spaces**, **More options**, **Switch agent**, **Notifications** and **Settings** belong to the chat and shell modules. The Project detail view is its own module.
