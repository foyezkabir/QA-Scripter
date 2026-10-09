import { test } from '../fixtures/base';
import { newDashboardName, newMember, newPerson, PERSON_JOB_TITLE } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that the CRM landing page shows its heading, subtitle, Archive & Trash and the CRM card', { tag: ['@smoke'] }, async ({ userCrmPage }) => {
  await userCrmPage.openLanding();
  await userCrmPage.expectLanding();
});

test('TC-02: Verify that Archive & Trash opens with the Archived and Trash tabs', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openLanding();
  await userCrmPage.openTrashDialog();
  await userCrmPage.expectTrashDialog();
});

test('TC-03: Verify that opening the CRM shows the workspace tabs', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openLanding();
  await userCrmPage.openCrm();
  await userCrmPage.expectWorkspaceTabs();
});

test('TC-04: Verify that Dashboards shows the dashboard chooser, Edit, Overview and Work and the widgets', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Dashboards');
  await userCrmPage.expectDashboards();
});

test('TC-05: Verify that Companies shows its search, chips, New, Filter by field and columns', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Companies');
  await userCrmPage.expectTable('Companies');
  await userCrmPage.expectFilterByField();
});

test('TC-06: Verify that People shows its search, chips, New, Filter by field and columns', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.expectTable('People');
  await userCrmPage.expectFilterByField();
});

test('TC-07: Verify that Opportunities shows its search, chips, New, Filter by field and view choice', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Opportunities');
  await userCrmPage.expectTable('Opportunities');
  await userCrmPage.expectFilterByField();
  await userCrmPage.expectTableOrKanbanChoice();
});

test('TC-08: Verify that Notes shows its search, chips, New and columns', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Notes');
  await userCrmPage.expectTable('Notes');
});

test('TC-09: Verify that Tasks shows its search, chips, New and columns', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Tasks');
  await userCrmPage.expectTable('Tasks');
});

test('TC-10: Verify that Team shows Add person and the team member cards', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Team');
  await userCrmPage.expectTeam();
});

test('TC-11: Verify that Choose which tabs to show offers the six optional tabs', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.openTabMenu();
  await userCrmPage.expectTabMenu();
});

test('TC-12: Verify that Filter by field opens a builder with Add disabled and Cancel', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.openFilterBuilder();
  await userCrmPage.expectFilterBuilder();
});

test('TC-13: Verify that a column menu offers sort, move and hide', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.openColumnMenu('Name');
  await userCrmPage.expectColumnMenu();
});

test('TC-14: Verify that the CRM link in Agent sections opens the CRM page', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openFromChat();
  await userCrmPage.expectCrmUrl();
});

test('TC-15: Verify that New on People opens the New person form with every field and button', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.openNewPersonDialog();
  await userCrmPage.expectPersonDialog();
});

test('TC-16: Verify that Create person with no name shows the empty name error', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.openNewPersonDialog();
  await userCrmPage.clickCreatePerson();
  await userCrmPage.expectEmptyNameError();
});

test('TC-17: Verify that creating a person shows the created toast and opens the record', { tag: ['@critical'] }, async ({ userCrmPage, crmCleanup }) => {
  const person = newPerson();
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.openNewPersonDialog();
  await userCrmPage.typePersonName(person);
  await userCrmPage.clickCreatePerson();
  await userCrmPage.expectPersonCreated(person);
});

test('TC-18: Verify that a new person record shows its fields, Edit all, Delete, Notes and Tasks', { tag: ['@regression'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.expectPersonRecord(createdPerson);
});

test('TC-19: Verify that Edit Job title opens an inline editor and Save shows the new job title', { tag: ['@regression'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.editJobTitle(PERSON_JOB_TITLE);
  await userCrmPage.expectJobTitleSaved(PERSON_JOB_TITLE);
});

test('TC-20: Verify that Delete asks for confirmation and Keep it leaves the record', { tag: ['@regression'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.clickDeleteRecord();
  await userCrmPage.expectDeleteRecordDialog(createdPerson);
  await userCrmPage.keepIt();
  await userCrmPage.expectRecordIsKept(createdPerson);
});

test('TC-21: Verify that Yes, delete moves the person to the trash with a toast', { tag: ['@critical'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.clickDeleteRecord();
  await userCrmPage.confirmDelete();
  await userCrmPage.expectPersonIsDeleted();
  await userCrmPage.openLanding();
  await userCrmPage.openTrashDialog();
  await userCrmPage.chooseTrashTab();
  await userCrmPage.expectPersonInTrash(createdPerson);
});

test('TC-22: Verify that Delete forever asks for confirmation and Keep it leaves the person in the trash', { tag: ['@regression'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.clickDeleteRecord();
  await userCrmPage.confirmDelete();
  await userCrmPage.openLanding();
  await userCrmPage.openTrashDialog();
  await userCrmPage.chooseTrashTab();
  await userCrmPage.clickDeleteForever(createdPerson.name);
  await userCrmPage.expectDeleteForeverDialog(createdPerson);
  await userCrmPage.keepIt();
  await userCrmPage.expectPersonIsKeptInTrash(createdPerson);
});

test('TC-23: Verify that Yes, delete in the forever dialog removes the person for good with a toast', { tag: ['@critical'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.clickDeleteRecord();
  await userCrmPage.confirmDelete();
  await userCrmPage.openLanding();
  await userCrmPage.openTrashDialog();
  await userCrmPage.chooseTrashTab();
  await userCrmPage.clickDeleteForever(createdPerson.name);
  await userCrmPage.confirmDelete();
  await userCrmPage.expectPersonDeletedForever(createdPerson);
});

test('TC-24: Verify that selecting a row shows Delete and Clear and the bulk delete asks to confirm', { tag: ['@regression'] }, async ({ userCrmPage, createdPerson }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('People');
  await userCrmPage.selectRow(createdPerson.name);
  await userCrmPage.expectSelectionBar();
  await userCrmPage.clickDeleteSelected();
  await userCrmPage.expectBulkDeleteDialog();
  await userCrmPage.keepIt();
  await userCrmPage.expectPersonIsStillListed(createdPerson);
});

test('TC-25: Verify that Add person opens its form with Add to team disabled while the name is empty', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Team');
  await userCrmPage.openAddMemberDialog();
  await userCrmPage.expectMemberDialog();
});

test('TC-26: Verify that Add to team lists the new member as a card', { tag: ['@critical'] }, async ({ userCrmPage, crmCleanup }) => {
  const member = newMember();
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Team');
  await userCrmPage.addMember(member);
  await userCrmPage.expectMemberCard(member);
});

test('TC-27: Verify that Remove from the team asks for confirmation and Keep it leaves the member', { tag: ['@regression'] }, async ({ userCrmPage, createdMember }) => {
  await userCrmPage.clickRemoveMember(createdMember.name);
  await userCrmPage.expectRemoveMemberDialog(createdMember);
  await userCrmPage.keepIt();
  await userCrmPage.expectMemberIsKept(createdMember);
});

test('TC-28: Verify that Yes, remove removes the member and shows a toast', { tag: ['@critical'] }, async ({ userCrmPage, createdMember }) => {
  await userCrmPage.clickRemoveMember(createdMember.name);
  await userCrmPage.confirmRemoveMember();
  await userCrmPage.expectMemberRemoved(createdMember);
});

test('TC-29: Verify that New dashboard opens its form with Create dashboard disabled while the name is empty', { tag: ['@regression'] }, async ({ userCrmPage }) => {
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Dashboards');
  await userCrmPage.openNewDashboardDialog();
  await userCrmPage.expectDashboardDialog();
});

test('TC-30: Verify that Create dashboard makes the new dashboard the chosen one and empty', { tag: ['@critical'] }, async ({ userCrmPage, crmCleanup }) => {
  const dashboardName = newDashboardName();
  await userCrmPage.openWorkspace();
  await userCrmPage.chooseTab('Dashboards');
  await userCrmPage.openNewDashboardDialog();
  await userCrmPage.typeDashboardName(dashboardName);
  await userCrmPage.clickCreateDashboard();
  await userCrmPage.expectNewDashboardIsChosen(dashboardName);
});

test('TC-31: Verify that Delete dashboard asks for confirmation and Keep it leaves the dashboard', { tag: ['@regression'] }, async ({ userCrmPage, createdDashboard }) => {
  await userCrmPage.clickDeleteDashboard();
  await userCrmPage.expectDeleteDashboardDialog(createdDashboard);
  await userCrmPage.keepIt();
  await userCrmPage.expectDashboardIsKept(createdDashboard);
});

test('TC-32: Verify that Yes, delete the dashboard removes the dashboard', { tag: ['@critical'] }, async ({ userCrmPage, createdDashboard }) => {
  await userCrmPage.clickDeleteDashboard();
  await userCrmPage.confirmDeleteDashboard();
  await userCrmPage.expectDashboardIsDeleted(createdDashboard);
});
