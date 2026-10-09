import { test } from '../fixtures/base';
import { NO_MATCH_SEARCH, newProjectName, PROJECT_RENAME_SUFFIX } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that the Projects page shows its heading, toolbar, search and sort', { tag: ['@smoke'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.expectPageIsOpen();
});

test('TC-02: Verify that every project card offers Open project and Edit project', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.expectProjectCards();
});

test('TC-03: Verify that the Sort menu offers Recent, Oldest and Name (A–Z)', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openSortMenu();
  await userProjectsPage.expectSortOptions();
});

test('TC-04: Verify that a search with no match shows the empty message and Clear search brings the cards back', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.searchProjects(NO_MATCH_SEARCH);
  await userProjectsPage.expectNoProjectsMatch();
  await userProjectsPage.clearSearch();
  await userProjectsPage.expectProjectCardsAreBack();
});

test('TC-05: Verify that opening a project card goes to the project page', { tag: ['@critical'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openFirstProject();
  await userProjectsPage.expectProjectDetailUrl();
});

test('TC-06: Verify that the Projects link in Agent sections opens the Projects page', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.openFromChat();
  await userProjectsPage.expectProjectsUrl();
});

test('TC-07: Verify that New Project opens Create Project with its fields and Save disabled', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openNewProjectDialog();
  await userProjectsPage.expectCreateProjectDialog();
});

test('TC-08: Verify that Create Project offers ten kinds of project with General chosen', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openNewProjectDialog();
  await userProjectsPage.expectProjectKinds();
});

test('TC-09: Verify that a typed project name enables Save and Cancel closes without creating the project', { tag: ['@critical'] }, async ({ userProjectsPage }) => {
  const projectName = newProjectName();
  await userProjectsPage.open();
  await userProjectsPage.openNewProjectDialog();
  await userProjectsPage.typeProjectName(projectName);
  await userProjectsPage.expectSaveIsEnabled();
  await userProjectsPage.cancelNewProject();
  await userProjectsPage.expectCreateDialogIsClosed();
  await userProjectsPage.expectProjectIsNotListed(projectName);
});

test('TC-10: Verify that Edit project opens Project Settings with its fields and actions', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openProjectSettings();
  await userProjectsPage.expectProjectSettingsDialog();
});

test('TC-11: Verify that the kind of project is fixed once the board has tasks', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openProjectSettings();
  await userProjectsPage.expectKindIsFixed();
});

test('TC-12: Verify that Cancel closes Project Settings without saving', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openProjectSettings();
  await userProjectsPage.cancelProjectSettings();
  await userProjectsPage.expectProjectSettingsDialogIsClosed();
});

test('TC-13: Verify that People opens the contact book with its tabs, search and Add Person', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openPeopleDialog();
  await userProjectsPage.expectPeopleDialog();
});

test('TC-14: Verify that choosing the Projects tab in People selects it', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openPeopleDialog();
  await userProjectsPage.choosePeopleTab('Projects');
  await userProjectsPage.expectPeopleTabIsSelected('Projects');
});

test('TC-15: Verify that Trash & Archive opens with the Archived and Trash tabs', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.expectTrashDialog();
});

test('TC-16: Verify that choosing the Trash tab lists the deleted projects', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseTrashTab();
  await userProjectsPage.expectTrashTabIsSelected();
});

test('TC-17: Verify that Import from Jira opens with its description, search, checkbox and Import buttons', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openJiraDialog();
  await userProjectsPage.expectJiraDialog();
});

test('TC-18: Verify that Import from Huly opens with its description, search, checkbox and Import buttons', { tag: ['@regression'] }, async ({ userProjectsPage }) => {
  await userProjectsPage.open();
  await userProjectsPage.openHulyDialog();
  await userProjectsPage.expectHulyDialog();
});

test('TC-19: Verify that saving a new project shows the created toast and lists the project', { tag: ['@critical'] }, async ({ userProjectsPage, projectCleanup }) => {
  const projectName = newProjectName();
  await userProjectsPage.open();
  await userProjectsPage.openNewProjectDialog();
  await userProjectsPage.typeProjectName(projectName);
  await userProjectsPage.saveProject();
  await userProjectsPage.expectProjectCreated(projectName);
});

test('TC-20: Verify that a new project card shows its date and empty milestones', { tag: ['@regression'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.expectNewProjectCard(createdProject);
});

test('TC-21: Verify that renaming a project in Project Settings shows the updated toast and the new name', { tag: ['@critical'] }, async ({ userProjectsPage, createdProject }) => {
  const renamed = createdProject + PROJECT_RENAME_SUFFIX;
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.renameProjectTo(renamed);
  await userProjectsPage.saveSettings();
  await userProjectsPage.expectProjectRenamed(renamed);
});

test('TC-22: Verify that Archive asks for confirmation and Cancel keeps the project listed', { tag: ['@regression'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickArchive();
  await userProjectsPage.expectArchiveConfirmation(createdProject);
  await userProjectsPage.cancelArchive(createdProject);
  await userProjectsPage.cancelProjectSettings();
  await userProjectsPage.expectProjectIsStillListed(createdProject);
});

test('TC-23: Verify that Yes, archive it archives the project and Trash & Archive lists it under Archived', { tag: ['@critical'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickArchive();
  await userProjectsPage.confirmArchive(createdProject);
  await userProjectsPage.expectProjectIsArchived(createdProject);
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseArchivedTab();
  await userProjectsPage.expectArchivedRow(createdProject);
});

test('TC-24: Verify that Restore asks for confirmation and Yes, restore brings the project back', { tag: ['@critical'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickArchive();
  await userProjectsPage.confirmArchive(createdProject);
  await userProjectsPage.expectProjectIsArchived(createdProject);
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseArchivedTab();
  await userProjectsPage.clickRestore(createdProject);
  await userProjectsPage.expectRestoreConfirmation(createdProject);
  await userProjectsPage.confirmRestore(createdProject);
  await userProjectsPage.expectProjectIsBack(createdProject);
});

test('TC-25: Verify that Move to Trash asks for confirmation and Cancel keeps the project listed', { tag: ['@regression'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickMoveToTrash();
  await userProjectsPage.expectTrashConfirmation(createdProject);
  await userProjectsPage.cancelMoveToTrash(createdProject);
  await userProjectsPage.cancelProjectSettings();
  await userProjectsPage.expectProjectIsStillListed(createdProject);
});

test('TC-26: Verify that Move to trash puts the project in the trash and shows a toast', { tag: ['@critical'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickMoveToTrash();
  await userProjectsPage.confirmMoveToTrash(createdProject);
  await userProjectsPage.expectProjectIsTrashed(createdProject);
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseTrashTab();
  await userProjectsPage.expectTrashedRow(createdProject);
});

test('TC-27: Verify that Delete forever asks for confirmation and Keep it leaves the project in the trash', { tag: ['@regression'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickMoveToTrash();
  await userProjectsPage.confirmMoveToTrash(createdProject);
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseTrashTab();
  await userProjectsPage.clickDeleteForever(createdProject);
  await userProjectsPage.expectDeleteForeverConfirmation(createdProject);
  await userProjectsPage.keepProject(createdProject);
  await userProjectsPage.expectTrashedProjectIsKept(createdProject);
});

test('TC-28: Verify that Yes, delete deletes the trashed project forever and shows a toast', { tag: ['@critical'] }, async ({ userProjectsPage, createdProject }) => {
  await userProjectsPage.openSettingsOf(createdProject);
  await userProjectsPage.clickMoveToTrash();
  await userProjectsPage.confirmMoveToTrash(createdProject);
  await userProjectsPage.openTrashDialog();
  await userProjectsPage.chooseTrashTab();
  await userProjectsPage.clickDeleteForever(createdProject);
  await userProjectsPage.confirmDeleteForever(createdProject);
  await userProjectsPage.expectProjectIsDeleted(createdProject);
});
