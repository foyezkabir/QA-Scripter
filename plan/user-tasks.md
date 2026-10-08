# User Tasks - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/tasks)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-tasks.baseline.json`.

Spec file: `user-tasks.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, in Asta's Tasks section (full access granted on this Dev account).

Setup: tests that need a task get one from the `createdTask` fixture (precondition built through the UI because the page has no API seeding path): it creates a QA-AUTO task through Create Task with **Enabled switched off**, so it never runs or sends anything, and closes the task sheet. Teardown ladder rung 3 (UI): the fixture deletes every task whose name starts with QA-AUTO through Delete and Yes, delete, even after a failure; a failed cleanup is attached to the test, never thrown. TC-10 (the creation test) uses the `taskCleanup` fixture for the same cleanup. Tests never press **Run now** or a **Try saying** suggestion, because they send to Telegram or the assistant and spend its budget. Pre-existing tasks (none today) are never touched. The countdown, run counts, times and the model list are live and are not asserted by value. Plain-text messages have no ARIA role, and the page shows no toast after any action.

## Page and Create Task dialog

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Tasks | populated | the page shows the heading Tasks, "Set up jobs your assistant runs on a schedule so the routine stuff happens without you lifting a finger" and the Create Task button | TC-01 | @smoke |
| Create Task dialog | disabled | Create Task opens "Set it up once and let your assistant handle it for you." with Task Name, What it's for, Schedule, How it should work, Model, Channel, Enabled (on), their hints, Close, Cancel and Save disabled | TC-02 | @regression |
| Create Task dialog | populated | Schedule offers Every morning at 9am (chosen), Every hour, Every weekday at 9am, Every Monday at 9am, Every day at noon, Every evening at 6pm, Every 30 minutes and Custom… | TC-03 | @regression |
| Create Task dialog | populated | Model starts on "Default (agent's model)" and lists Primary, Coder and Fast, and Channel starts on "Select a channel…" and lists Telegram and Slack | TC-04 | @regression |
| Create Task dialog | populated | choosing Custom… shows the Custom schedule picker with Frequency, At time, a plain-words summary and Advanced cron | TC-05 | @regression |
| Create Task dialog | populated | Advanced cron swaps the picker for ADVANCED CRON with a schedule label box and a cron box, and Back to picker returns to the picker | TC-06 | @regression |
| Create Task dialog | populated | focusing the empty How it should work box fills a template with Goal, Context, Steps and Output | TC-07 | @regression |
| Create Task dialog | disabled | Save stays disabled until Task Name, What it's for, How it should work and Channel are all filled | TC-08 | @regression |
| Create Task dialog | populated | Cancel closes the dialog and the typed task is not created | TC-09 | @regression |
| Create Task dialog | populated | Close closes the dialog | TC-10 | @regression |
| Create Task dialog | populated | filling the form with Enabled off and choosing Save creates the task: its sheet opens on the Runs tab and the task is listed | TC-11 | @critical |

## Task list

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Task list | populated | a created task shows its name, "Hasn't run yet", its schedule label, its channel Telegram, its purpose, the Enable switch and Delete | TC-12 | @regression |
| Task list | populated | the summary strip shows Running now, Needs you, Next run and Ran clean, and the health tabs All, Needs you, Running, Healthy and Off carry counts | TC-13 | @regression |
| Task list | task-status:off | the disabled task is listed under the Off tab, the summary says it is turned off and Next run says "nothing scheduled" | TC-14 | @regression |
| Task list | tab-filter-empty | the Needs you, Running and Healthy tabs show "No task is in that state." with Show all tasks, which returns to All | TC-15 | @regression |
| Task list | filtered-empty | searching for text that matches nothing shows "No task matches" the query and the number hidden by these filters, and clearing the search brings the task back | TC-16 | @regression |
| Task list | populated | searching for part of the task name keeps the task listed | TC-17 | @regression |
| Sort menu | populated | Sort: Recent offers Recent, Oldest and Name (A–Z) | TC-18 | @regression |
| Task list | task-status:enabled | switching Enable on turns its label into Disable and shows a countdown, and switching it off again restores Enable | TC-19 | @regression |
| Agent sections | populated | the Tasks link in Agent sections opens /chat/<assistant id>/tasks | TC-20 | @regression |

## Task sheet

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Task sheet | populated | Open on a task shows its Overview tab with Reliability, Next run, Typical run, Last outcome, Run now, "What it's told to do" and "Changes to this task" with the Created entry | TC-21 | @regression |
| Task sheet | empty | the Runs tab shows Right now, Next run, Runs recorded "0 runs", "Creating the task" with its steps, the Each time it ran filters All, Failed, Skipped and Not sent, "This task hasn't run yet. Its first fire will appear here." and the Full log filters Everything, Creation and Runs | TC-22 | @regression |
| Task sheet | disabled | the Settings tab shows the task's values, Send it to, How long may it take?, Tell me when a run is taking a while, and Discard changes and Save changes disabled | TC-23 | @regression |
| Task sheet | dirty-form | changing the Task Name enables Discard changes and Save changes, and Discard changes puts the name back | TC-24 | @regression |
| Task sheet | populated | Save changes with a new Task Name renames the task in the list | TC-25 | @critical |
| Task sheet | disabled | the footer shows the "Ask about" box, the Try saying suggestions and Send disabled while the box is empty | TC-26 | @regression |

## Delete

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Delete this task? dialog | populated | Delete asks "Delete this task?" with "This will permanently remove this task and everything it's tracking." and Keep it leaves the task in the list | TC-27 | @regression |
| Delete this task? dialog | terminal | Yes, delete removes the task from the list | TC-28 | @critical |

## Out of scope (recorded, not tested)

- **Open <task name>** is the task row itself and is used by every test that opens a task sheet; **Search tasks** is used by TC-16 and TC-17. The empty-list heading **No tasks yet** and its **Create your first task** button depend on there being no tasks at all (live data), so they are recorded and not asserted.
- The task sheet's **Ask about <task name>** box is only checked for presence (TC-26); typing in it asks the assistant and is not done.

- **Run now**, and the suggestions **Always include a summary and a total**, **Move it to 7am**, **Send it somewhere else** and **Tell me when a run takes a while**, send to Telegram or the assistant and spend its budget; they are checked for presence (the suggestions) or not at all (Run now beyond its presence on Overview) and are never clicked. **Show raw detail** and the footer's **Ask about** box are not used.
- The statuses needs you, running and healthy, the run history and the error and terminal states need a task to run and are not reached; **Needs you**, **Running** and **Healthy** are only checked as empty tabs.
- **Create your first task** opens the same dialog as **Create Task** and is only checked for presence when the list is empty, which depends on live data, so it is not asserted.
- The Slack channel option, a Custom schedule saved with a cron, and the Model, Send it to and How long may it take? choices are not saved by tests.
- The sidebar controls **Back**, **Collapse sidebar**, **New Chat** and **Switch agent** belong to the chat and shell modules.
