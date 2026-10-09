import { test } from '../fixtures/base';
import { newWorkspaceName, WORKSPACE_EDIT_TEXT } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that Simple view shows the breadcrumb, storage, upload buttons and the file list', { tag: ['@smoke'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openSimpleView();
  await userWorkspacePage.expectSimpleView();
});

test('TC-02: Verify that an uploaded file is listed and shown in the Upload activity panel', { tag: ['@critical'] }, async ({ userWorkspacePage, uploadCleanup }) => {
  const fileName = newWorkspaceName('File', '.txt');
  await userWorkspacePage.openSimpleView();
  await userWorkspacePage.uploadFile(fileName);
  await userWorkspacePage.expectFileIsUploaded(fileName);
});

test('TC-03: Verify that Actions on a file offers Preview, Download, Share to, Rename and Delete', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFile }) => {
  await userWorkspacePage.openActions(workspaceFile);
  await userWorkspacePage.expectFileMenu();
});

test('TC-04: Verify that Rename opens prefilled, needs a name and Cancel closes it', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFile }) => {
  await userWorkspacePage.openActions(workspaceFile);
  await userWorkspacePage.chooseMenuItem('Rename');
  await userWorkspacePage.expectRenameDialog(workspaceFile);
  await userWorkspacePage.expectRenameNeedsAName();
  await userWorkspacePage.cancelRename();
  await userWorkspacePage.expectRenameDialogIsClosed();
});

test('TC-05: Verify that Delete asks to confirm a file deletion and Cancel keeps the file', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFile }) => {
  await userWorkspacePage.openActions(workspaceFile);
  await userWorkspacePage.chooseMenuItem('Delete');
  await userWorkspacePage.expectDeleteFileDialog(workspaceFile);
  await userWorkspacePage.cancelDelete();
  await userWorkspacePage.expectItemIsKept(workspaceFile);
});

test('TC-06: Verify that confirming Delete removes the file from the list', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceFile }) => {
  await userWorkspacePage.openActions(workspaceFile);
  await userWorkspacePage.chooseMenuItem('Delete');
  await userWorkspacePage.confirmDelete();
  await userWorkspacePage.expectItemIsGone(workspaceFile);
});

test('TC-07: Verify that Advanced view shows its toolbar, storage panel and root, and Simple view returns', { tag: ['@regression'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openSimpleView();
  await userWorkspacePage.switchToAdvancedView();
  await userWorkspacePage.expectAdvancedView();
  await userWorkspacePage.switchToSimpleView();
  await userWorkspacePage.expectSimpleViewIsBack();
});

test('TC-08: Verify that Show hidden turns into Hide hidden and back', { tag: ['@regression'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.showHidden();
  await userWorkspacePage.expectHiddenAreShown();
  await userWorkspacePage.hideHidden();
  await userWorkspacePage.expectHiddenAreNotShown();
});

test('TC-09: Verify that New folder opens with Create folder disabled for an empty or blank name', { tag: ['@regression'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.openFolderDialog();
  await userWorkspacePage.expectFolderDialog();
  await userWorkspacePage.expectFolderNeedsAName();
  await userWorkspacePage.cancelFolderDialog();
  await userWorkspacePage.expectFolderDialogIsClosed();
});

test('TC-10: Verify that Create folder adds the new folder to the tree', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const folderName = newWorkspaceName('Folder', '');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFolder(folderName);
  await userWorkspacePage.expectItemIsListed(folderName);
});

test('TC-11: Verify that a folder name that already exists shows an alert and creates nothing', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFolder }) => {
  await userWorkspacePage.openFolderDialog();
  await userWorkspacePage.typeFolderName(workspaceFolder);
  await userWorkspacePage.confirmFolder();
  await userWorkspacePage.expectDuplicateAlert(workspaceFolder);
});

test('TC-12: Verify that New file opens with Create file disabled while the name is empty', { tag: ['@regression'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.openFileDialog();
  await userWorkspacePage.expectFileDialog();
  await userWorkspacePage.cancelFileDialog();
  await userWorkspacePage.expectFileDialogIsClosed();
});

test('TC-13: Verify that Create file adds the file and opens it in the viewer', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const fileName = newWorkspaceName('File', '.md');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFile(fileName);
  await userWorkspacePage.expectViewer(fileName);
});

test('TC-14: Verify that choosing Source presses Source and unpresses Rendered', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const fileName = newWorkspaceName('File', '.md');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFile(fileName);
  await userWorkspacePage.chooseSource();
  await userWorkspacePage.expectSourceIsPressed();
});

test('TC-15: Verify that Edit shows Back to preview, Download and Save disabled', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const fileName = newWorkspaceName('File', '.md');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFile(fileName);
  await userWorkspacePage.clickEdit();
  await userWorkspacePage.expectEditor();
});

test('TC-16: Verify that typing enables Save and Save shows the saved time', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const fileName = newWorkspaceName('File', '.md');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFile(fileName);
  await userWorkspacePage.clickEdit();
  await userWorkspacePage.typeInEditor(WORKSPACE_EDIT_TEXT);
  await userWorkspacePage.expectSaveIsEnabled();
  await userWorkspacePage.clickSave();
  await userWorkspacePage.expectSaved();
});

test('TC-17: Verify that Actions on a folder offers the eight folder actions', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFolder }) => {
  await userWorkspacePage.openActions(workspaceFolder);
  await userWorkspacePage.expectFolderMenu();
});

test('TC-18: Verify that Rename changes the name of a file in the tree', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceCleanup }) => {
  const fileName = newWorkspaceName('File', '.md');
  const renamed = newWorkspaceName('Renamed', '.md');
  await userWorkspacePage.openAdvancedView();
  await userWorkspacePage.createFile(fileName);
  await userWorkspacePage.renameItem(fileName, renamed);
  await userWorkspacePage.expectItemIsListed(renamed);
});

test('TC-19: Verify that renaming a folder to the name of another folder shows an alert', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFolder }) => {
  const otherFolder = newWorkspaceName('Folder', '');
  await userWorkspacePage.createFolder(otherFolder);
  await userWorkspacePage.renameItem(otherFolder, workspaceFolder);
  await userWorkspacePage.expectDuplicateAlert(workspaceFolder);
});

test('TC-20: Verify that Delete asks to confirm a folder deletion and Cancel keeps the folder', { tag: ['@regression'] }, async ({ userWorkspacePage, workspaceFolder }) => {
  await userWorkspacePage.openActions(workspaceFolder);
  await userWorkspacePage.chooseMenuItem('Delete');
  await userWorkspacePage.expectDeleteFolderDialog(workspaceFolder);
  await userWorkspacePage.cancelDelete();
  await userWorkspacePage.expectItemIsKept(workspaceFolder);
});

test('TC-21: Verify that confirming Delete removes the folder from the tree', { tag: ['@critical'] }, async ({ userWorkspacePage, workspaceFolder }) => {
  await userWorkspacePage.openActions(workspaceFolder);
  await userWorkspacePage.chooseMenuItem('Delete');
  await userWorkspacePage.confirmDelete();
  await userWorkspacePage.expectItemIsGone(workspaceFolder);
});

test('TC-22: Verify that the Workspace link in Agent sections opens the Workspace page', { tag: ['@regression'] }, async ({ userWorkspacePage }) => {
  await userWorkspacePage.openFromChat();
  await userWorkspacePage.expectWorkspaceUrl();
});
