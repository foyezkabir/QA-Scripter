# User Skills - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/skills)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-skills.baseline.json`.

Spec file: `user-skills.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, in Asta's Skills section (full access granted on this Dev account).

Setup: tests that need a custom skill get one from the `createdSkill` fixture (precondition built through the UI because the page has no API seeding path): it fills Create Skill with a QA-AUTO name and chooses Save. Teardown ladder rung 3 (UI): the `skillCleanup` fixture removes every custom skill whose name starts with QA-AUTO through View details, Remove and Yes, remove, even after a failure; a failed cleanup is attached to the test, never thrown. TC-14 (the creation test) uses `skillCleanup` for the same cleanup. The installed skills, the Anthropic and GitHub catalog, the counts in the tab and filter names and the notification count are live data and are never changed; **Install** and **Install <skill name>** fetch from an external marketplace and are never clicked. Plain-text messages have no ARIA role; the toasts have role status.

## Page, tabs and search

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Skills | populated | the page shows the heading Skills, "Save the things you have taught your assistant so it can repeat them anytime you ask", Create skill, the views Browse (62), Installed (6) and Custom (0) and the Search skills... box | TC-01 | @smoke |
| Browse | populated | Browse shows the source filters All (62), VelaCrew (6), Anthropic (19) and GitHub (37) skill cards with View details for <skill name>, and an Install <skill name> button on skills that are not installed | TC-02 | @regression |
| Browse | filtered-empty | searching for text that matches nothing shows "No skills found" and "Try a different search or pick a different source." | TC-03 | @regression |
| Installed | installed | Installed shows the Search installed skills... box and the six VelaCrew skills data-visualization, file-sharing, image-creation, memory-purge, pdf and space-collab, without the source filters | TC-04 | @regression |
| Installed | filtered-empty | searching for text that matches nothing shows "No skills found" and "No installed skill matches your search. Try a different term." | TC-05 | @regression |
| Custom | empty | with no custom skill, Custom shows "No custom skills yet", "Write your own skill to teach this assistant a routine only you need - the steps you would otherwise repeat in chat every time." and a Create skill button | TC-06 | @regression |
| Custom | filtered-empty | with a custom skill, searching Search custom skills... for text that matches nothing shows "No skills found" and "No custom skill matches your search. Try a different term." | TC-07 | @regression |
| Skill detail | built-in | View details for an installed VelaCrew skill opens a dialog with "VelaCrew v1.0.0 · by VelaCrew · Apache-2.0", the rendered skill, FILES IN THIS SKILL, where it is installed, Close, Cancel and Remove | TC-08 | @regression |
| Skill detail | not-installed | View details for a skill that is not installed offers Install, Close and Cancel and no Remove | TC-09 | @regression |

## Create Skill

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Create Skill dialog | populated | Create skill opens "Show your assistant how to do something once and it remembers it for next time" with Skill Name, Category, When to use it, Steps to follow, their hints, Close, Cancel and Save | TC-10 | @regression |
| Create Skill dialog | error | choosing Save with the form empty shows the alert "Name, When to use it, and Steps to follow are required." and creates nothing | TC-11 | @regression |
| Create Skill dialog | populated | Cancel closes the dialog without creating the skill | TC-12 | @regression |
| Create Skill dialog | populated | Close closes the dialog | TC-13 | @regression |
| Create Skill dialog | populated | filling the form and choosing Save shows the toast "Custom skill created" and lists the skill under Custom | TC-14 | @critical |
| Create Skill dialog | error | a Skill Name that already exists marks the field invalid with "A skill named" the name "already exists. Pick a different name." as it is typed, and Save is disabled | TC-15 | @regression |

## Custom skill and Remove

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Skill detail | custom | View details for a custom skill shows "VelaCrew v1.0.0 by User", FILES IN THIS SKILL with SKILL.md and where it is installed | TC-16 | @regression |
| Remove this skill? dialog | populated | Remove asks "Remove this skill?" with "This will remove the skill from your agent." and Keep it leaves the skill detail open | TC-17 | @regression |
| Remove this skill? dialog | terminal | Yes, remove removes the skill, shows the toast "Skill removed" and Custom no longer lists it | TC-18 | @critical |
| Agent sections | populated | the Skills link in Agent sections opens /chat/<assistant id>/skills | TC-19 | @regression |

## Out of scope (recorded, not tested)

- The badge **Installed on this agent** on installed and custom skill cards is exposed only as a description, not as text a role-and-name locator can reach, so it is not asserted; installed skills are recognised by their VelaCrew source and by having no Install button.

- **Install <skill name>** on a Browse card and **Install** in a skill's detail dialog fetch code from an external marketplace; they are checked for presence and never clicked. **Remove** on the installed VelaCrew skills is shown in their detail dialog and never used: only skills the tests created are removed.
- The tab names **Browse (62)**, **Installed (6)** and **Custom (0)** and the filters **All (62)**, **VelaCrew (6)**, **Anthropic (19)** and **GitHub (37)** carry live counts and are matched by their leading words; choosing the Anthropic and GitHub filters changes only what is listed and is not tested.
- **Close toast** closes a toast and is not tested; the toast **Notifications (1 unread)** count is live data. The loading and error states are not reached: no loading indicator exists and a server error cannot be forced.
- Over-long values are not tested: no field shows a length limit. Category is optional and is not shown on the card or in the detail.
