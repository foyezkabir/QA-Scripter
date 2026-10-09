import { test } from '../fixtures/base';
import { SPACE_NO_MATCH_SEARCH } from '../datas/user/UserData';

test('TC-01: Verify that the space opens on Activity with its switcher, Ask the team, Autopilot and section navigation', { tag: ['@smoke'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.expectSpaceShell();
});

test('TC-02: Verify that the space switcher menu offers Invite people and Setup', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.openSpaceSwitcher();
  await userSpacePage.expectSwitcherMenu();
});

test('TC-03: Verify that Ask the team opens with Ask disabled while the question is empty', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.openAskTheTeam();
  await userSpacePage.expectAskTheTeamDialog();
  await userSpacePage.closeDialog('Ask the team');
  await userSpacePage.expectDialogIsClosed('Ask the team');
});

test('TC-04: Verify that Autopilot opens with the four presets and a link to every rule', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.openAutopilot();
  await userSpacePage.expectAutopilotDialog();
  await userSpacePage.closeDialog('Autopilot');
  await userSpacePage.expectDialogIsClosed('Autopilot');
});

test('TC-05: Verify that Activity shows the All, Needs you, Working and Done tabs', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.expectActivityTabs();
});

test('TC-06: Verify that an empty Activity tab says nothing is in the view', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.chooseActivityTab('Working');
  await userSpacePage.expectEmptyActivityTab();
});

test('TC-07: Verify that a closed thread shows Reopen, a reply box with Send disabled and the participants button', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('activity');
  await userSpacePage.openFirstThread();
  await userSpacePage.expectThreadDetail();
});

test('TC-08: Verify that Projects shows its subtitle and project cards with Open', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('projects');
  await userSpacePage.expectProjects();
});

test('TC-09: Verify that Work shows its subtitle, project menu, Assigned to me, search and view choices', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('work');
  await userSpacePage.expectWork();
});

test('TC-10: Verify that the Work board lists its five columns', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('work');
  await userSpacePage.expectWorkColumns();
});

test('TC-11: Verify that List and Assigned to me add their choice to the address', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('work');
  await userSpacePage.chooseListView();
  await userSpacePage.expectWorkFilterUrl('view=list');
  await userSpacePage.chooseAssignedToMe();
  await userSpacePage.expectWorkFilterUrl('assignee=me');
});

test('TC-12: Verify that a Work search with no match says there are no tasks', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('work');
  await userSpacePage.chooseListView();
  await userSpacePage.searchTasks(SPACE_NO_MATCH_SEARCH);
  await userSpacePage.expectNoTasks();
});

test('TC-13: Verify that Routines shows its subtitle, search, Create routine, premade tiles and figures', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('routines');
  await userSpacePage.expectRoutines();
});

test('TC-14: Verify that Create routine opens with its choices and Create routine disabled until it has a name', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('routines');
  await userSpacePage.openCreateRoutine();
  await userSpacePage.expectCreateRoutineDialog();
  await userSpacePage.closeDialog('Create routine');
  await userSpacePage.expectDialogIsClosed('Create routine');
});

test('TC-15: Verify that a routine opens its dialog with the Overview and Runs tabs and its buttons', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('routines');
  await userSpacePage.openFirstRoutine();
  await userSpacePage.expectRoutineDialog();
});

test('TC-16: Verify that Files shows its subtitle, storage, upload buttons, Advanced view and rows', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('files');
  await userSpacePage.expectFiles();
});

test('TC-17: Verify that Advanced view adds New file, New folder and Add more storage and Simple view returns', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('files');
  await userSpacePage.switchToAdvancedFiles();
  await userSpacePage.expectAdvancedFiles();
  await userSpacePage.switchToSimpleFiles();
  await userSpacePage.expectSimpleFilesAreBack();
});

test('TC-18: Verify that Team shows People, Your agent in this space, Invite people and the member rows', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('team');
  await userSpacePage.expectTeam();
});

test('TC-19: Verify that Invite people opens with Member and Admin and Send invitation disabled while the email is empty', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('team');
  await userSpacePage.openInvitePeople();
  await userSpacePage.expectInviteDialog();
  await userSpacePage.closeDialog('Invite people');
  await userSpacePage.expectDialogIsClosed('Invite people');
});

test('TC-20: Verify that Ask on a member opens a question box with Ask disabled while it is empty', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('team');
  await userSpacePage.openMemberAsk();
  await userSpacePage.expectMemberAskDialog();
});

test('TC-21: Verify that Setup General shows its sections and Leave space', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('setup');
  await userSpacePage.expectSetupGeneral();
});

test('TC-22: Verify that Setup offers General, Autopilot, Skills, Connections and History', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('setup');
  await userSpacePage.expectSetupLinks();
});

test('TC-23: Verify that Setup Autopilot shows its five sections and the presets', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('autopilot');
  await userSpacePage.expectSetupAutopilot();
});

test('TC-24: Verify that Setup Skills shows the empty shared skills and the share list', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('skills');
  await userSpacePage.expectSetupSkills();
});

test('TC-25: Verify that Setup Connections shows Yours, Shared tools and the share list', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('connections');
  await userSpacePage.expectSetupConnections();
});

test('TC-26: Verify that Setup History shows its filters', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openSection('history');
  await userSpacePage.expectSetupHistory();
});

test('TC-27: Verify that the space card on the dashboard opens the space', { tag: ['@regression'] }, async ({ userSpacePage }) => {
  await userSpacePage.openFromDashboard();
  await userSpacePage.expectSpaceUrl();
});
