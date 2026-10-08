import { test } from '../fixtures/base';
import { newTask, TASK_NO_MATCH_SEARCH, TASK_RENAME_SUFFIX } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that the Tasks page shows its heading, subtitle and Create Task', { tag: ['@smoke'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.expectTasksPage();
});

test('TC-02: Verify that Create Task opens its form with Save disabled', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.expectCreateDialog();
});

test('TC-03: Verify that Schedule offers the eight choices with Every morning at 9am chosen', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.expectScheduleOptions();
});

test('TC-04: Verify that Model and Channel offer their choices', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.expectModelAndChannelOptions();
});

test('TC-05: Verify that choosing Custom… shows the custom schedule picker', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.chooseCustomSchedule();
  await userTasksPage.expectCustomSchedulePicker();
});

test('TC-06: Verify that Advanced cron swaps the picker and Back to picker returns to it', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.chooseCustomSchedule();
  await userTasksPage.openAdvancedCron();
  await userTasksPage.expectAdvancedCron();
  await userTasksPage.backToPicker();
  await userTasksPage.expectCustomSchedulePicker();
});

test('TC-07: Verify that focusing the empty How it should work box fills a template', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.focusInstructions();
  await userTasksPage.expectInstructionsTemplate();
});

test('TC-08: Verify that Save stays disabled until every required field is filled', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  const task = newTask();
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.fillNameOnly(task.name);
  await userTasksPage.expectSaveIsDisabled();
  await userTasksPage.fillPurposeOnly(task.purpose);
  await userTasksPage.expectSaveIsDisabled();
  await userTasksPage.fillInstructionsOnly(task.instructions);
  await userTasksPage.expectSaveIsDisabled();
  await userTasksPage.chooseChannelOnly(task.channel);
  await userTasksPage.expectSaveIsEnabled();
});

test('TC-09: Verify that Cancel closes Create Task without creating the task', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  const task = newTask();
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.fillTask(task);
  await userTasksPage.cancelCreateDialog();
  await userTasksPage.expectCreateDialogIsClosed();
  await userTasksPage.expectTaskIsNotListed(task.name);
});

test('TC-10: Verify that Close closes Create Task', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.closeCreateDialog();
  await userTasksPage.expectCreateDialogIsClosed();
});

test('TC-11: Verify that saving a disabled task opens its sheet on the Runs tab and lists it', { tag: ['@critical'] }, async ({ userTasksPage, taskCleanup }) => {
  const task = newTask();
  await userTasksPage.open();
  await userTasksPage.openCreateDialog();
  await userTasksPage.fillTask(task);
  await userTasksPage.switchEnabledOff();
  await userTasksPage.saveTask();
  await userTasksPage.expectSheetOnRunsTab(task.name);
  await userTasksPage.closeSheet(task.name);
  await userTasksPage.expectTaskIsListed(task.name);
});

test('TC-12: Verify that a created task shows its name, schedule, channel and purpose with Enable and Delete', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.expectTaskRow(createdTask);
});

test('TC-13: Verify that the summary strip and the health tabs are shown', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.expectSummaryAndTabs();
});

test('TC-14: Verify that a disabled task is listed under Off and the summary says it is turned off', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.expectTaskIsTurnedOff();
  await userTasksPage.chooseHealthTab('Off');
  await userTasksPage.expectOffTabShows(createdTask.name);
});

test('TC-15: Verify that the Needs you, Running and Healthy tabs are empty and Show all tasks returns to All', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.expectEmptyHealthTabs();
  await userTasksPage.clickShowAllTasks();
  await userTasksPage.expectAllTabIsSelected();
});

test('TC-16: Verify that a search with no match says so and clearing it brings the task back', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.searchTasks(TASK_NO_MATCH_SEARCH);
  await userTasksPage.expectNoTaskMatches();
  await userTasksPage.searchTasks('');
  await userTasksPage.expectTaskIsListed(createdTask.name);
});

test('TC-17: Verify that searching for part of the task name keeps the task listed', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.searchTasks(createdTask.name);
  await userTasksPage.expectTaskIsListed(createdTask.name);
});

test('TC-18: Verify that the Sort menu offers Recent, Oldest and Name (A–Z)', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSortMenu();
  await userTasksPage.expectSortOptions();
});

test('TC-19: Verify that the Enable switch shows Disable and a countdown, and switching it off restores Enable', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.switchRowOn(createdTask.name);
  await userTasksPage.expectRowIsEnabled(createdTask.name);
  await userTasksPage.switchRowOff(createdTask.name);
  await userTasksPage.expectRowIsDisabled(createdTask.name);
});

test('TC-20: Verify that the Tasks link in Agent sections opens the Tasks page', { tag: ['@regression'] }, async ({ userTasksPage }) => {
  await userTasksPage.openFromChat();
  await userTasksPage.expectTasksUrl();
});

test('TC-21: Verify that the Overview tab shows the task facts, Run now and its history', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.chooseSheetTab(createdTask.name, 'Overview');
  await userTasksPage.expectOverviewTab(createdTask.name);
});

test('TC-22: Verify that the Runs tab shows the creation steps, the run filters and the empty run history', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.chooseSheetTab(createdTask.name, 'Runs');
  await userTasksPage.expectRunsTab(createdTask.name);
});

test('TC-23: Verify that the Settings tab shows the task values with Discard changes and Save changes disabled', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.chooseSheetTab(createdTask.name, 'Settings');
  await userTasksPage.expectSettingsTab(createdTask);
});

test('TC-24: Verify that changing the task name enables the change buttons and Discard changes undoes it', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.chooseSheetTab(createdTask.name, 'Settings');
  await userTasksPage.changeSheetName(createdTask.name, createdTask.name + TASK_RENAME_SUFFIX);
  await userTasksPage.expectSheetChangesAreEnabled(createdTask.name);
  await userTasksPage.discardSheetChanges(createdTask.name);
  await userTasksPage.expectSheetNameIs(createdTask.name, createdTask.name);
  await userTasksPage.expectSheetChangesAreDisabled(createdTask.name);
});

test('TC-25: Verify that Save changes renames the task in the list', { tag: ['@critical'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.chooseSheetTab(createdTask.name, 'Settings');
  await userTasksPage.changeSheetName(createdTask.name, createdTask.name + TASK_RENAME_SUFFIX);
  await userTasksPage.saveSheetChanges(createdTask.name);
  await userTasksPage.open();
  await userTasksPage.expectTaskIsListed(createdTask.name + TASK_RENAME_SUFFIX);
});

test('TC-26: Verify that the task sheet footer offers the Ask about box and suggestions with Send disabled', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.openSheet(createdTask.name);
  await userTasksPage.expectSheetFooter(createdTask.name);
});

test('TC-27: Verify that Delete asks for confirmation and Keep it leaves the task', { tag: ['@regression'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.clickDelete(createdTask.name);
  await userTasksPage.expectDeleteConfirmation();
  await userTasksPage.clickKeepIt();
  await userTasksPage.expectTaskIsKept(createdTask.name);
});

test('TC-28: Verify that Yes, delete removes the task from the list', { tag: ['@critical'] }, async ({ userTasksPage, createdTask }) => {
  await userTasksPage.clickDelete(createdTask.name);
  await userTasksPage.clickYesDelete();
  await userTasksPage.expectTaskIsGone(createdTask.name);
});
