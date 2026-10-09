# User Team Space - test plan (DEV https://dev.app.velaops.ai/space/<space id>)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-space.baseline.json`.

Spec file: `user-space.spec.ts`. Runs signed in as **DEV user 1**, an Admin of the space **VOPS-358 Retest Space**, through the default `.auth/user.json`.

Setup: none. A Team Space is shared with another person, so every test is read-only: it opens a section, switches a view or filter, opens a dialog and closes it, and follows navigation. Nothing is sent, asked, invited, shared, reopened, rolled back, saved, renamed, uploaded or deleted, and no Autopilot preset or switch is changed. Thread titles, counts, members, project and routine names, storage figures and the other person's agent are live data and are never asserted by value. The space is opened by its fixed address. Toasts do not appear because nothing is changed. Plain-text messages have no ARIA role.

## Shell and Activity

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Space shell | populated | the space opens on Activity with the space switcher, Ask the team, Autopilot · Balanced, "Asta Represents you here", Collapse sidebar and the Space sections Activity, Projects, Work, Routines, Files, Team and Setup | TC-01 | @smoke |
| Space switcher | populated | the space switcher menu offers Invite people and Setup | TC-02 | @regression |
| Ask the team dialog | disabled | Ask the team opens "One question to everyone's assistant. The answers come back in a single Activity thread." with a question box, Ask disabled while it is empty and Close | TC-03 | @regression |
| Autopilot dialog | populated | Autopilot · Balanced opens "How much your teammates' agents do on their own in this space." with the presets Development, Project, Sales / Business and HR, a Fine-tune every rule link and Close | TC-04 | @regression |
| Activity | populated | Activity shows the tabs All, Needs you, Working and Done with counts | TC-05 | @regression |
| Activity | empty | an Activity tab with nothing in it shows "Nothing in this view right now." | TC-06 | @regression |
| Activity thread | terminal | choosing a thread shows its Closed state with Reopen, the reply box with Send disabled and the participants button | TC-07 | @regression |

## Projects, Work and Routines

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Projects | populated | Projects shows its heading, "Boards shared with this space." and project cards with an Open link | TC-08 | @regression |
| Work | populated | Work shows "Every task across the projects you can see in this space.", the Every project menu, Assigned to me, Search tasks and the List and Board choices | TC-09 | @regression |
| Work | populated | the Board lists the columns To do, Being worked on, Waiting on someone, Ready to hand over and Done | TC-10 | @regression |
| Work | filtered | choosing List adds ?view=list and choosing Assigned to me adds ?assignee=me | TC-11 | @regression |
| Work | empty | a search with no match shows "No tasks here yet" | TC-12 | @regression |
| Routines | populated | Routines shows "The team's rhythms - a morning check-in, a weekly brief. They send as you, so opt-ins still apply.", the Search routines box, Create routine, the Start from a premade tiles and the figures Switched on, Needs you, Next run and Answered | TC-13 | @regression |
| Create routine dialog | disabled | Create routine opens a form with a name, WHAT IT DOES choices Chase, Round, Brief and Upkeep, WHEN presets, WHAT COUNTS AS OUTSTANDING choices and Close, with Create routine disabled and the hint "Give it a name." | TC-14 | @regression |
| Routine dialog | populated | choosing a routine opens its dialog with the tabs Overview and Runs and the buttons Run now, Edit and Remove | TC-15 | @regression |

## Files and Team

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Files | populated | Files shows "The one place this space's agents can see each other's work.", the Storage text, Upload file, Upload folder, Advanced view and the rows with Actions | TC-16 | @regression |
| Files | view:advanced | Advanced view adds New file, New folder, Add more storage and "Pick a file to view or edit", and Simple view returns | TC-17 | @regression |
| Team | populated | Team shows the heading People, "Your agent in this space", Invite people, and a row for each member with Manage and Ask | TC-18 | @regression |
| Invite people dialog | disabled | Invite people opens "Up to 10 people including you. Each brings their own agent." with the Member and Admin choices, an email box, Send invitation disabled while it is empty and Close | TC-19 | @regression |
| Ask dialog | disabled | Ask on a member opens a dialog with a question box and Ask disabled while it is empty | TC-20 | @regression |

## Setup

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Setup General | populated | Setup opens General with the sections Identity, Agent runs, Shared drive, Kind of project, Kinds of work, Long days, Board templates, Post to a team channel, Space actions and Danger zone, with Leave space shown | TC-21 | @regression |
| Setup | populated | the Setup sub navigation offers General, Autopilot, Skills, Connections and History | TC-22 | @regression |
| Setup Autopilot | populated | Autopilot shows the sections SHARED KNOWLEDGE, SKILLS & TOOLS, MESSAGING, AUTONOMY & SAFETY and PROJECTS and the presets | TC-23 | @regression |
| Setup Skills | empty | Skills shows "Shared skills", "No shared skills yet", "Share a skill" and a Search skills… box | TC-24 | @regression |
| Setup Connections | populated | Connections shows Yours, Shared tools and "Share one of your connections" with the links Connect a CRM and Connect a tool | TC-25 | @regression |
| Setup History | populated | History shows the filters Everything, People, Configuration, Sharing, Messages & safety and Files | TC-26 | @regression |
| Dashboard | populated | the space card under TEAM SPACES on the dashboard opens the space | TC-27 | @regression |

## Out of scope (recorded, not tested)

- The space switcher is named after the space and its live member count (**<space name> 2 people · Admin**) and the link to the representing agent reads **Asta Represents you here · Ready**; both are matched by their leading words. The email box **teammate@company.com** in Invite people is never typed into, and **Ask <member>** (the dialog TC-20 opens from a member row) is never sent.

- **Assign this thread** is a choice inside the participants panel of a thread and assigns the thread to a teammate; it is not opened or used.

- **Reopen**, **Send** (a reply), **More actions** (Block this and undo what it did), **Roll back these changes** and **Assign this thread** act on another person's agent and change shared threads; they are shown and never used. **Ask**, **Send invitation**, **Create routine** (the Create button), **Run now**, **Edit**, **Remove**, the premade tiles (Morning chase, End-of-day check-in, Weekly roadmap brief, Weekly review sweep, Friday wrap, Pipeline nudge, Monday health check, Daily standup) and the switch **Turn off Daily standup** message or change the whole space and are never used.
- **Development**, **Project**, **Sales / Business** and **HR** change the space policy; **Share** and **Stop sharing <tool>** change what other agents can use; **Leave space**, **Change agent**, **Detach**, **Manage <member>** (Change to member, Suspend), **Their agent can message you**, file **Actions**, **Upload file** and **Upload folder** change members, files or access and are never used.
- The member view of the space, the loading and error states and the project page of the space (`/space/<id>/projects/<project id>`, which is a shared board) are not reached. **Collapse sidebar** is a layout control and is not tested. **Open** on a project card is only followed to check its address.
