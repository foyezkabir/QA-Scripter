# User Project Detail - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/projects/<project id>)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-project-detail.baseline.json`.

Spec file: `user-project-detail.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, on the user's project **Pilot Release QA - Oct 2026**, opened by its fixed address.

Setup: none. Every test only reads or cancels: no task, view, label, round, digest, budget entry or board setting is created, saved, started, finished or deleted, and nothing is sent in the project chat (a send spends the assistant's budget). Task counts, people, the activity feed, round names and the saved views, digest and budget are shared live data and are never asserted by value; tests check headings, labels and controls. The project may be renamed or emptied by its owners, which would fail these tests for that reason, not because of the page. Plain-text messages have no ARIA role.

## Dashboard and Overview

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Project dashboard | populated | the project opens with its name, "Where this project stands" and the tabs Overview, Board, Progress, Risks, Digest, People and Budget (Board and Progress carry live counts) | TC-01 | @smoke |
| Overview | populated | the Overview tab shows the tiles This sprint, Open tasks, Waiting to be checked and Your assistant with their info buttons, the headings "People on task · across the project" and Latest, and the buttons Ask to change these tiles, Ask to even this out, Share them out and See everything | TC-02 | @regression |
| Project dashboard | populated | opening the address with ?tab=budget selects the Budget tab | TC-03 | @regression |
| Project dashboard | populated | Close the dashboard closes the dashboard | TC-04 | @regression |
| Project chat | disabled | the project chat shows the Type a message… box, Send message disabled while it is empty, New chat, Add attachments, Fast, Speech to text and the suggestion Where does this project stand? | TC-05 | @regression |
| Project dashboard | populated | New task, Board settings and Compact density are shown in the dashboard header | TC-06 | @regression |

## Board

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Board | filtered | the Board tab shows "Every task by stage", the Board filters toolbar (Views, the View choices List, Board and Timeline with Board chosen, Search the cards on this board, My tasks, Round This round, Filter and View options) and a status "tasks hidden by This round" with Show all | TC-07 | @regression |
| Round menu | populated | Round This round offers This round, Backlog (not in a round) and Everything | TC-08 | @regression |
| Filter menu | populated | Filter offers Round, Assignee, Priority, Hide subtasks and Show archived | TC-09 | @regression |
| View options dialog | populated | View options shows Group by, Sort by, Comfortable and Compact and Keyboard shortcuts | TC-10 | @regression |
| Views dialog | disabled | Views shows View name, Share with everyone on this board and Save view disabled while the name is empty | TC-11 | @regression |
| New task dialog | disabled | New task opens a dialog with Title, Detail, Column, Priority, Assignee, Phase, Start, Due, Estimate, New label name and Create another, with Create task disabled while Title is empty, and Close closes it | TC-12 | @regression |

## Board settings

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Board settings dialog | populated | Board settings opens a dialog with the tabs Columns, Rules, Priorities, Labels and Rounds, the layouts Standard, Full pipeline (review + QA) and Simple pipeline, Cancel and Save, and Cancel closes it without saving | TC-13 | @regression |
| Board settings dialog | populated | choosing each of the tabs Rules, Priorities, Labels and Rounds selects it | TC-14 | @regression |

## Progress, Risks, Digest, People and Budget

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Progress | populated | the Progress tab shows "Pace and rounds", Manage rounds, the heading "Tasks finished each sprint" and Ask to change these numbers | TC-15 | @regression |
| Risks | empty | the Risks tab shows "What might slip and why" and the heading All risks | TC-16 | @regression |
| Digest | empty | the Digest tab shows "Written summaries for the team", the Covers button and the buttons Write the first digest and Write it for the client | TC-17 | @regression |
| People | populated | the People tab shows "Who is doing what", the tiles Carrying a lot, Could take more and Work nobody owns, the headings "Who is carrying what", "What the team cannot cover" and "Work nobody owns", and the Ask about the load, Ask about them, Ask about the gap and Ask who should take it buttons | TC-18 | @regression |
| Budget | empty | the Budget tab shows "What it costs, what is left, and what it earns", the buttons Set up budget, Log time, Export CSV and Submit a cost, and the headings Time and Decided costs | TC-19 | @regression |

## Out of scope (recorded, not tested)

- **Create task** and **Add** in New task, **Save view**, **Save**, **Standard**, **Full pipeline (review + QA)**, **Simple pipeline**, **Use the shared layout**, **Add column**, **Reset to defaults**, **New label**, **Plan a round**, **Start**, **Finish** and **More actions for round** in Board settings, **Set up budget**, **Log time**, **Export CSV**, **Submit a cost**, **Write the first digest**, **Write it for the client**, **Manage rounds**, **Assign** and **Open PRQO-2** create or change shared project data and are only checked for presence where the table says so.
- **Ask to change these tiles**, **Ask to even this out**, **Share them out**, **Ask to change these numbers**, **Ask about the load**, **Ask about them**, **Ask about the gap**, **Ask who should take it**, **How This sprint is worked out** and the project chat suggestions **Share out the unowned tasks** and **Needs you** send a message to the assistant and spend its budget; they are shown and never clicked. **Where does this project stand?** and **Send message** are not clicked either.
- **List**, **Timeline**, **My tasks**, **Show all**, **Compact density**, **Keyboard shortcuts** and **See everything** change what is displayed or open other screens and are not clicked; typing in **Search the cards on this board**, **View name**, **Title** and the other fields is not done.
- The columns, rules, priority and label settings inside Board settings (**Column name**, **Only allow the moves listed under Can move to**, and the per-column menus) change the board when edited and are not touched; **Reorder column - drag, or Alt+Arrow up or down** is not used.
- The loading and error states and the terminal states (task created, round finished, board saved) are not reached: they need changing shared data or a failing request.
- Names with live parts are matched by their leading words: the tabs **Board (0)** and **Progress (0%)**, the button **See everything (32)**, the button **Covers: Sprint 3** and the headings **Who is carrying what · across the whole project, backlog included**, **No budget yet** and **Waiting for approval** (the last two change once a budget exists). Only the stable part of each is asserted.
- The finding that the Board tab label shows (0) while 9 tasks are hidden by This round is recorded in findings/user.txt, not asserted.
- The shell buttons **Notifications** and **Settings** repeat on every page and are covered by the shell module. The project chat's **New chat** is only checked for presence.
