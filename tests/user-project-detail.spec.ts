import { test } from '../fixtures/base';

test('TC-01: Verify that the project dashboard shows the project name, its subtitle and the seven tabs', { tag: ['@smoke'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.expectProjectDashboard();
});

test('TC-02: Verify that Overview shows its tiles, People on task and Latest', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.expectOverview();
});

test('TC-03: Verify that opening the address with a tab selects that tab', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.openTabByAddress('Budget');
  await userProjectDetailPage.expectTabIsSelected('Budget');
});

test('TC-04: Verify that Close the dashboard closes the dashboard', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.closeDashboard();
  await userProjectDetailPage.expectDashboardIsClosed();
});

test('TC-05: Verify that the project chat offers its composer with Send disabled while empty', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.expectProjectChat();
});

test('TC-06: Verify that the dashboard header offers New task, Board settings and Compact density', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.expectHeaderButtons();
});

test('TC-07: Verify that the Board tab shows its toolbar and the hidden tasks status', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('Board');
  await userProjectDetailPage.expectTabIsSelected('Board');
  await userProjectDetailPage.expectBoardTab();
});

test('TC-08: Verify that the Round menu offers This round, Backlog and Everything', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.openTabByAddress('Board');
  await userProjectDetailPage.openRoundMenu();
  await userProjectDetailPage.expectRoundOptions();
});

test('TC-09: Verify that the Filter menu offers Round, Assignee, Priority, Hide subtasks and Show archived', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.openTabByAddress('Board');
  await userProjectDetailPage.openFilterMenu();
  await userProjectDetailPage.expectFilterItems();
});

test('TC-10: Verify that View options shows Group by, Sort by, the density choices and Keyboard shortcuts', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.openTabByAddress('Board');
  await userProjectDetailPage.openViewOptions();
  await userProjectDetailPage.expectViewOptionsDialog();
});

test('TC-11: Verify that Views shows View name, the share checkbox and Save view disabled while empty', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.openTabByAddress('Board');
  await userProjectDetailPage.openViewsDialog();
  await userProjectDetailPage.expectViewsDialog();
});

test('TC-12: Verify that New task opens its form with Create task disabled and Close closes it', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.openNewTaskDialog();
  await userProjectDetailPage.expectNewTaskDialog();
  await userProjectDetailPage.closeNewTaskDialog();
  await userProjectDetailPage.expectNewTaskDialogIsClosed();
});

test('TC-13: Verify that Board settings shows its tabs and layouts and Cancel closes it without saving', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.openBoardSettings();
  await userProjectDetailPage.expectBoardSettingsDialog();
  await userProjectDetailPage.cancelBoardSettings();
  await userProjectDetailPage.expectBoardSettingsDialogIsClosed();
});

test('TC-14: Verify that choosing a Board settings tab selects it', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.openBoardSettings();
  await userProjectDetailPage.chooseBoardSettingsTab('Rules');
  await userProjectDetailPage.expectBoardSettingsTabIsSelected('Rules');
  await userProjectDetailPage.chooseBoardSettingsTab('Priorities');
  await userProjectDetailPage.expectBoardSettingsTabIsSelected('Priorities');
  await userProjectDetailPage.chooseBoardSettingsTab('Labels');
  await userProjectDetailPage.expectBoardSettingsTabIsSelected('Labels');
  await userProjectDetailPage.chooseBoardSettingsTab('Rounds');
  await userProjectDetailPage.expectBoardSettingsTabIsSelected('Rounds');
});

test('TC-15: Verify that the Progress tab shows its heading, Manage rounds and the sprint chart', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('Progress');
  await userProjectDetailPage.expectTabIsSelected('Progress');
  await userProjectDetailPage.expectProgressTab();
});

test('TC-16: Verify that the Risks tab shows its subtitle and All risks', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('Risks');
  await userProjectDetailPage.expectTabIsSelected('Risks');
  await userProjectDetailPage.expectRisksTab();
});

test('TC-17: Verify that the Digest tab shows the Covers button and both write buttons', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('Digest');
  await userProjectDetailPage.expectTabIsSelected('Digest');
  await userProjectDetailPage.expectDigestTab();
});

test('TC-18: Verify that the People tab shows its tiles, headings and ask buttons', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('People');
  await userProjectDetailPage.expectTabIsSelected('People');
  await userProjectDetailPage.expectPeopleTab();
});

test('TC-19: Verify that the Budget tab shows its subtitle, budget buttons and sections', { tag: ['@regression'] }, async ({ userProjectDetailPage }) => {
  await userProjectDetailPage.open();
  await userProjectDetailPage.chooseTab('Budget');
  await userProjectDetailPage.expectTabIsSelected('Budget');
  await userProjectDetailPage.expectBudgetTab();
});
