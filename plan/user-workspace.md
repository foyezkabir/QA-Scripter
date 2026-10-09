# User Workspace - test plan (DEV https://dev.app.velaops.ai/chat/<assistant id>/workspace)

Depth: **standard**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/user-workspace.baseline.json`.

Spec file: `user-workspace.spec.ts`. Runs signed in as **DEV user 1** through the default `.auth/user.json`, in Asta's Workspace section (full access granted on this Dev account).

Setup: tests that need a file get one from the `workspaceFile` fixture and tests that need a folder get one from the `workspaceFolder` fixture. Both are preconditions built through the UI because the page has no API seeding path: the file is uploaded in Simple view with a tiny text file, the folder is created with New folder in Advanced view. Every item is named QA-AUTO-<kind>-<unique> (no spaces, because an upload turns spaces into underscores). Teardown ladder rung 3 (UI): the `workspaceCleanup` fixture (tree items made in Advanced view) and the `uploadCleanup` fixture (files uploaded in Simple view) delete every workspace item whose name starts with QA-AUTO through Actions, Delete and Delete, even after a failure; a failed cleanup is attached to the test, never thrown. Existing workspace files and folders, the storage figures and the team space named in Share to are live data and are never touched or asserted. The page remembers the last view, so every test opens the view it needs. An uploaded file is stored under the directory folder, so `uploadCleanup` sweeps Simple view, which lists it. Plain-text messages have no ARIA role, and the page shows no toast after any action.

## Simple view

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Workspace | view:simple | Simple view shows the Workspace breadcrumb, the Storage text, Upload file, Upload folder, Advanced view and a list of files that each have an Actions button | TC-01 | @smoke |
| Simple view | populated | uploading a file with Upload file lists it and shows it in the Upload activity panel | TC-02 | @critical |
| File Actions menu | populated | Actions on a file offers Preview, Download, Share to, Rename and Delete | TC-03 | @regression |
| Rename dialog | disabled | Rename opens a dialog prefilled with the file name, Rename is disabled while Name is empty and Cancel closes it | TC-04 | @regression |
| Delete file? dialog | populated | Delete asks "Delete file?" with the permanent-deletion warning and Cancel keeps the file | TC-05 | @regression |
| Delete file? dialog | terminal | Delete removes the file from the list | TC-06 | @critical |

## Advanced view

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Advanced view | view:advanced | Advanced view shows "Uploading to Workspace", New file, New folder, Upload file, Upload folder, Show hidden, Simple view, the Storage panel with Add more storage, the Workspace ACTIVE root and the text "Pick a file to view or edit", and Simple view returns to the simple list | TC-07 | @regression |
| Advanced view | hidden-shown | Show hidden turns into Hide hidden and Hide hidden turns back into Show hidden | TC-08 | @regression |
| New folder dialog | disabled | New folder opens "Create a new folder at the workspace root." with a Name box, Cancel, Close and Create folder disabled while Name is empty or only spaces | TC-09 | @regression |
| New folder dialog | populated | Create folder adds the new folder to the tree | TC-10 | @critical |
| New folder dialog | error | a folder name that already exists shows the alert "A folder named" the name "already exists here. Pick a different name." and creates nothing | TC-11 | @regression |
| New file dialog | disabled | New file opens "Create a new file at the workspace root." with a Name box, Cancel, Close and Create file disabled while Name is empty | TC-12 | @regression |
| Viewer | viewer:rendered | Create file adds the file and opens it in the viewer with the file name, Rendered pressed, Source, Copy source, Download, More download formats and Edit | TC-13 | @critical |
| Viewer | viewer:rendered | choosing Source presses Source and unpresses Rendered | TC-14 | @regression |
| Viewer | viewer:edit | Edit shows Back to preview, Download and Save disabled until the text changes | TC-15 | @regression |
| Viewer | saved | typing enables Save and Save shows "Saved" with the time | TC-16 | @critical |
| Folder Actions menu | populated | Actions on a folder offers New file, New folder, Upload file, Upload folder, Download as zip, Share to, Rename and Delete | TC-17 | @regression |
| Rename dialog | populated | Rename changes a file's name in the tree | TC-18 | @critical |
| Rename dialog | error | renaming a folder to the name of another folder shows the "already exists here" alert and changes nothing | TC-19 | @regression |
| Delete folder? dialog | populated | Delete on a folder asks "Delete folder?" with "will be permanently deleted along with everything inside it" and Cancel keeps it | TC-20 | @regression |
| Delete folder? dialog | terminal | Delete removes the folder from the tree | TC-21 | @critical |
| Agent sections | populated | the Workspace link in Agent sections opens /chat/<assistant id>/workspace | TC-22 | @regression |

## Out of scope (recorded, not tested)

- The **file content** box in the editor is typed into by TC-16 and not otherwise asserted; the hidden **file input** (a files input and a folder input) is filled by the upload in TC-02 through the browser's file-input API, never through the system file picker.

- **Download**, **Download as zip**, the viewer's **Download**, **Copy source** and **More download formats** (PDF document .pdf and Word document .docx) start downloads or copy to the clipboard; they are checked for presence and never used. **Share to** shares an item to a team space and is only checked for presence; **Add more storage** is a billing action and **Upload folder** opens the folder picker; neither is used.
- **Preview** in Simple view and the **Expand** chevrons are used only incidentally. **Minimize upload activity**, **Cancel upload** and **Close upload panel** control the upload panel and are not tested.
- A name with a slash creates nested folders and a name with a very long length is accepted (no limit is shown); neither is asserted. Uploaded names have spaces turned into underscores and are stored in the directory folder (the delete dialog shows directory/<name>) even when another folder is chosen; both are recorded as findings.
- The system folders (the ones marked sys), hidden files and the existing workspace files are never changed. The empty workspace and loading states are not reached; the page cannot be emptied without deleting existing items.
- **Back**, **Collapse sidebar** and **Switch agent** belong to the chat and shell modules; a signed-out visit redirecting to sign-in is covered by the sign-in module.
