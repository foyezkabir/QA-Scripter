# User My Work - test plan (DEV https://dev.app.velaops.ai/dashboard/my-work)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-my-work.baseline.json`.

Spec file: `user-my-work.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`.

Setup: none. My work is a read-only list of the account's own open tasks and has no control that creates, edits or deletes one, so every test only looks, opens the filter and sort lists, and follows links. The tasks, their keys, statuses, due dates, the group names and the project list are live data and are never asserted by value or changed; the tests check that rows exist and carry the right kind of content. The task panel and the project dashboard that a link opens belong to the Project detail module. Plain-text messages have no ARIA role.

## My work page

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| My work | populated | the page shows the heading My work, a subtitle such as "1 open task.", the Filter by project list on All projects and the Sort my work list on Sort: Due | TC-01 | @smoke |
| Filter by project | populated | Filter by project offers All projects and at least one project | TC-02 | @regression |
| Sort my work | populated | Sort my work offers Sort: Due, Sort: Priority and Sort: Project | TC-03 | @regression |
| Sort my work | populated | choosing Sort: Priority shows it as the chosen sort | TC-04 | @regression |
| Task group | populated | the tasks are listed in groups with a heading and a count, such as "This week 1" | TC-05 | @regression |
| Task row | populated | each task row shows its key, its title as a link, its status and an Open board link | TC-06 | @regression |
| Task row | populated | choosing a task title opens its project with the task, at an address with ?task= | TC-07 | @regression |
| Task row | populated | choosing Open board opens the project board at an address with ?dash=full&tab=board | TC-08 | @regression |
| Left sidebar | populated | the My work link in the left sidebar opens /dashboard/my-work from Home | TC-09 | @regression |

## Out of scope (recorded, not tested)

- The empty state (no open tasks), the loading and error states are not reached: they need every task reassigned or completed, or a failing request, and My work has no way to change a task. The group names other than the one observed (This week) are not asserted.
- The banner link **Enable 2FA** (to /settings/security) and **Dismiss** are shell controls that appear on several pages; they are not followed or clicked here.
- The task title link is named after each task (**<task title>**) and **Open board for <project name>** after its project; both are matched by their leading words because the tasks and projects are live data.
