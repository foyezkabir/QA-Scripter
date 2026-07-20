# Test Plan - Projects module (VelaOps / VOPS)

Source: live exploration of `https://dev.app.velaops.ai/chat/<agentId>/projects` (Rex Dev agent),
`raw/velaops/velaops-application-guide.md` section 7 (Projects). No Jira ticket cited -
traceability matrix skipped per project convention.

## View: Projects list (`/chat/:agentId/projects`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Populated (5 existing projects) | Page loads, project cards render (name, description if set, "Updated" date, Delete project button) | TC-01 | @smoke |
| Populated | Search box filters cards by name (confirmed live: "Wellness" -> only "Wellness QA" remains) | TC-02 | @regression |
| Populated | Sort combobox (native `<select>`, confirmed live) - "Sort: Recent" / "Sort: Name" | TC-03 | @regression |
| List | Click "New Project" -> Create Project dialog opens | TC-04 (part of create flow) | @smoke |
| Create dialog, empty | Create button disabled until Name filled | TC-05 | @regression |
| Create dialog, Name only | Create button becomes ENABLED - Description is NOT actually required despite the app-guide documenting it as required (drift - live UI wins, doc is stale) | TC-06 | @regression |
| Create dialog, valid | Submit -> toast "Project created / Slug: <slug> - files will live under projects/<slug>/", navigates into the new project's (empty) chat view | TC-04 | @smoke @critical |
| Projects list | "Delete project" button directly on each card (no kebab needed - simpler than Tasks/Chat's menu pattern) -> confirmation dialog "Delete <name>?" "This will remove the project and its custom instructions. Conversations inside it stay in your chat history." | TC-07 | @regression |
| Delete confirm dialog | "Keep it" cancels, "Yes, delete" removes the project from the list | TC-08 | @critical |

## View: Project detail (`/chat/:agentId/projects/:projectId`)

Looks like the main chat surface but scoped to the project - matches app-guide.

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Project detail | Banner shows project name + "Files" and "Settings" buttons; sidebar shows project-scoped conversation list (separate from main agent list, confirmed live: fresh project shows "No chats") | TC-09 | @regression |
| Project detail, empty | Greeting reads "...to help you with in <project name>?" (project-scoped variant of the main empty-state greeting) | TC-09 | @regression |
| Settings clicked | "Project Settings" dialog: Name, Description, Instructions (same rich-text toolbar as Create), Save Changes disabled until something changes | TC-10 | @regression |
| Files clicked | "Project files — <name>" dialog: breadcrumb, Upload file / Upload folder / Advanced view buttons, existing files listed each with an "Actions" menu (Open/Download/Rename/Delete). New projects start with `memory.md` and `project.md` auto-created. | TC-11 | @regression |

## Known gaps - NOT covered this pass (documented, not silent)

- **Instructions field rich-text toolbar** (Bold/Italic/Code/Bullet/Numbered/Link) - buttons exist
  and were observed but not exercised; formatting-output verification deferred (would need to
  inspect the saved markdown, out of scope for a UI-only pass).
- **File upload / rename / delete inside Project files** - Upload requires a real file fixture;
  deferred pending a small test-file asset in `datas/projects/`.
- **Per-project conversation inheriting project instructions** - would require sending a message
  and inspecting whether the instructions actually influenced the reply; deferred as it overlaps
  Chat module scope and needs a deterministic prompt/response pair.
- **"Conversations inside it stay in your chat history" claim on delete** - the app-guide says
  deleting a project "removes the project + all its conversations" (opposite claim). Live UI copy
  explicitly says conversations persist. Not verified end-to-end this pass (would need a project
  with a real conversation, deleted, then checking the main chat list) - flagged as a drift to
  verify, not filed as a confirmed bug since the live UI's own copy is internally consistent, just
  contradicts the (possibly stale) app-guide doc.

## Completeness critic

- Every state/transition captured live has an intended TC. Zero-missing at time of writing for the
  surfaces actually exercised.
- Gaps above are explicit, not silently dropped.
- No AC list exists (no Jira ticket) - traceability matrix not applicable this pass.
