import { expect, type Page } from '@playwright/test';
import {
  DEFAULT_SCHEDULE,
  DEFAULT_SCHEDULE_LABEL,
  OWN_ASSISTANT,
  PROJECT_SORT_OPTIONS,
  SCHEDULE_OPTIONS,
  TASK_CHANNEL_OPTIONS,
  TASK_EMPTY_TABS,
  TASK_HEALTH_TABS,
  TASK_LOG_FILTERS,
  TASK_MODEL_DEFAULT,
  TASK_MODEL_OPTIONS,
  TASK_RUN_FILTERS,
  TASK_SHEET_TABS,
  TASK_SUBTITLE,
  TASK_SUGGESTIONS,
  TASK_SUMMARY_CARDS,
  TASK_TEMPLATE_WORDS,
  type NewTask,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserTasksLocators } from '../locators/UserTasksLocators';

export class UserTasksPage {
  private readonly locators: UserTasksLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserTasksLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/tasks`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.tasksLink.click();
  }

  async openCreateDialog() {
    await this.locators.createTaskButton.click();
    await expect(this.locators.createDialog).toBeVisible();
  }

  async closeCreateDialog() {
    await this.locators.createClose.click();
  }

  async cancelCreateDialog() {
    await this.locators.createCancel.click();
  }

  async fillTask(task: NewTask) {
    await this.locators.nameField.fill(task.name);
    await this.locators.purposeField.fill(task.purpose);
    await this.locators.instructionsField.fill(task.instructions);
    await this.locators.channelSelect.selectOption({ label: task.channel });
  }

  async fillNameOnly(taskName: string) {
    await this.locators.nameField.fill(taskName);
  }

  async fillPurposeOnly(purpose: string) {
    await this.locators.purposeField.fill(purpose);
  }

  async fillInstructionsOnly(instructions: string) {
    await this.locators.instructionsField.fill(instructions);
  }

  async chooseChannelOnly(channelName: string) {
    await this.locators.channelSelect.selectOption({ label: channelName });
  }

  async focusInstructions() {
    await this.locators.instructionsField.focus();
  }

  async chooseCustomSchedule() {
    await this.locators.scheduleSelect.selectOption({ label: 'Custom…' });
  }

  async openAdvancedCron() {
    await this.locators.advancedCronButton.click();
  }

  async backToPicker() {
    await this.locators.backToPickerButton.click();
  }

  async switchEnabledOff() {
    await this.locators.enabledSwitch.click();
  }

  async saveTask() {
    await this.locators.createSave.click();
  }

  async createTask(task: NewTask) {
    await this.openCreateDialog();
    await this.fillTask(task);
    await this.switchEnabledOff();
    await this.saveTask();
    await this.locators.sheet(task.name).waitFor();
    await this.locators.sheetClose(task.name).click();
    await this.locators.sheet(task.name).waitFor({ state: 'hidden' });
  }

  async openSheet(taskName: string) {
    await this.locators.taskRow(taskName).click();
    await expect(this.locators.sheet(taskName)).toBeVisible();
  }

  async chooseSheetTab(taskName: string, tabName: string) {
    await this.locators.sheetTab(taskName, tabName).click();
  }

  async closeSheet(taskName: string) {
    await this.locators.sheetClose(taskName).click();
  }

  async changeSheetName(taskName: string, newName: string) {
    await this.locators.sheetField(taskName, 'Task Name').fill(newName);
  }

  async discardSheetChanges(taskName: string) {
    await this.locators.sheetButton(taskName, 'Discard changes').click();
  }

  async saveSheetChanges(taskName: string) {
    await this.locators.sheetButton(taskName, 'Save changes').click();
  }

  async chooseHealthTab(tabName: string) {
    await this.locators.healthTab(tabName).click();
  }

  async clickShowAllTasks() {
    await this.locators.showAllTasksButton.click();
  }

  async searchTasks(query: string) {
    await this.locators.searchBox.fill(query);
  }

  async openSortMenu() {
    await this.locators.sortButton.click();
  }

  async switchRowOn(taskName: string) {
    await this.locators.rowSwitch(taskName, 'Enable').click();
  }

  async switchRowOff(taskName: string) {
    await this.locators.rowSwitch(taskName, 'Disable').click();
  }

  async clickDelete(taskName: string) {
    await this.locators.rowDelete(taskName).click();
  }

  async clickKeepIt() {
    await this.locators.keepItButton.click();
  }

  async clickYesDelete() {
    await this.locators.yesDeleteButton.click();
  }

  async deleteAutomationTasks() {
    await this.open();
    await expect(this.locators.listLoaded).toBeVisible();
    const marked = await this.locators.automationRows.count();
    for (let remaining = marked; remaining > 0; remaining--) {
      await this.locators.firstAutomationDelete.click();
      await this.clickYesDelete();
      await this.locators.deleteDialog.waitFor({ state: 'hidden' });
    }
  }

  async expectTasksPage() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toHaveText(TASK_SUBTITLE);
    await expect(this.locators.createTaskButton).toBeVisible();
  }

  async expectCreateDialog() {
    await expect(this.locators.createDialog).toBeVisible();
    await expect(this.locators.createSubtitle).toBeVisible();
    await expect(this.locators.nameField).toBeVisible();
    await expect(this.locators.nameHint).toBeVisible();
    await expect(this.locators.purposeField).toBeVisible();
    await expect(this.locators.purposeHint).toBeVisible();
    await expect(this.locators.scheduleSelect).toBeVisible();
    await expect(this.locators.scheduleHint).toBeVisible();
    await expect(this.locators.instructionsField).toBeVisible();
    await expect(this.locators.instructionsHint).toBeVisible();
    await expect(this.locators.modelSelect).toBeVisible();
    await expect(this.locators.channelSelect).toBeVisible();
    await expect(this.locators.channelHint).toBeVisible();
    await expect(this.locators.enabledSwitch).toBeChecked();
    await expect(this.locators.createClose).toBeVisible();
    await expect(this.locators.createCancel).toBeVisible();
    await expect(this.locators.createSave).toBeDisabled();
  }

  async expectScheduleOptions() {
    for (const optionName of SCHEDULE_OPTIONS) {
      await expect(this.locators.createOption(this.locators.scheduleSelect, optionName)).toHaveCount(1);
    }
    await expect(this.locators.selectedOption(this.locators.scheduleSelect, DEFAULT_SCHEDULE)).toHaveCount(1);
  }

  async expectModelAndChannelOptions() {
    await expect(this.locators.selectedOption(this.locators.modelSelect, TASK_MODEL_DEFAULT)).toHaveCount(1);
    for (const optionName of TASK_MODEL_OPTIONS) {
      await expect(this.locators.createOption(this.locators.modelSelect, optionName)).toHaveCount(1);
    }
    await expect(this.locators.selectedOption(this.locators.channelSelect, 'Select a channel…')).toHaveCount(1);
    for (const optionName of TASK_CHANNEL_OPTIONS) {
      await expect(this.locators.createOption(this.locators.channelSelect, optionName)).toHaveCount(1);
    }
  }

  async expectCustomSchedulePicker() {
    await expect(this.locators.customSchedulePicker).toBeVisible();
    await expect(this.locators.frequencySelect).toBeVisible();
    await expect(this.locators.atTimeText).toBeVisible();
    await expect(this.locators.advancedCronButton).toBeVisible();
  }

  async expectAdvancedCron() {
    await expect(this.locators.advancedCronText).toBeVisible();
    await expect(this.locators.scheduleLabelField).toBeVisible();
    await expect(this.locators.cronField).toBeVisible();
    await expect(this.locators.backToPickerButton).toBeVisible();
  }

  async expectInstructionsTemplate() {
    for (const word of TASK_TEMPLATE_WORDS) {
      await expect(this.locators.instructionsField).toHaveValue(new RegExp(word));
    }
  }

  async expectSaveIsDisabled() {
    await expect(this.locators.createSave).toBeDisabled();
  }

  async expectSaveIsEnabled() {
    await expect(this.locators.createSave).toBeEnabled();
  }

  async expectCreateDialogIsClosed() {
    await expect(this.locators.createDialog).toBeHidden();
  }

  async expectTaskIsNotListed(taskName: string) {
    await expect(this.locators.taskRow(taskName)).toHaveCount(0);
  }

  async expectTaskIsListed(taskName: string) {
    await expect(this.locators.taskRow(taskName)).toBeVisible();
  }

  async expectSheetOnRunsTab(taskName: string) {
    await expect(this.locators.sheet(taskName)).toBeVisible();
    await expect(this.locators.sheetTab(taskName, 'Runs')).toHaveAttribute('aria-selected', 'true');
  }

  async expectTaskRow(task: NewTask) {
    await expect(this.locators.taskRow(task.name)).toBeVisible();
    await expect(this.locators.rowText(task.name, "Hasn't run yet")).toBeVisible();
    await expect(this.locators.rowText(task.name, DEFAULT_SCHEDULE_LABEL)).toBeVisible();
    await expect(this.locators.rowText(task.name, task.channel)).toBeVisible();
    await expect(this.locators.rowText(task.name, task.purpose)).toBeVisible();
    await expect(this.locators.rowSwitch(task.name, 'Enable')).toBeVisible();
    await expect(this.locators.rowDelete(task.name)).toBeVisible();
  }

  async expectSummaryAndTabs() {
    for (const cardName of TASK_SUMMARY_CARDS) {
      await expect(this.locators.summaryCard(cardName)).toBeVisible();
    }
    for (const tabName of TASK_HEALTH_TABS) {
      await expect(this.locators.healthTab(tabName)).toBeVisible();
    }
  }

  async expectTaskIsTurnedOff() {
    await expect(this.locators.turnedOffText).toBeVisible();
    await expect(this.locators.nothingScheduledText).toBeVisible();
  }

  async expectOffTabShows(taskName: string) {
    await expect(this.locators.healthTab('Off')).toHaveAttribute('aria-selected', 'true');
    await expect(this.locators.taskRow(taskName)).toBeVisible();
  }

  async expectEmptyHealthTabs() {
    for (const tabName of TASK_EMPTY_TABS) {
      await this.chooseHealthTab(tabName);
      await expect(this.locators.noTaskInStateText).toBeVisible();
      await expect(this.locators.showAllTasksButton).toBeVisible();
    }
  }

  async expectAllTabIsSelected() {
    await expect(this.locators.healthTab('All')).toHaveAttribute('aria-selected', 'true');
  }

  async expectNoTaskMatches() {
    await expect(this.locators.noMatchText).toBeVisible();
    await expect(this.locators.hiddenByFiltersText).toBeVisible();
  }

  async expectSortOptions() {
    for (const optionName of PROJECT_SORT_OPTIONS) {
      await expect(this.locators.sortOption(optionName)).toBeVisible();
    }
  }

  async expectRowIsEnabled(taskName: string) {
    await expect(this.locators.rowSwitch(taskName, 'Disable')).toBeVisible();
    await expect(this.locators.nextInCountdown).toBeVisible();
  }

  async expectRowIsDisabled(taskName: string) {
    await expect(this.locators.rowSwitch(taskName, 'Enable')).toBeVisible();
  }

  async expectTasksUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/tasks$`));
    await expect(this.locators.heading).toBeVisible();
  }

  async expectOverviewTab(taskName: string) {
    for (const tabName of TASK_SHEET_TABS) {
      await expect(this.locators.sheetTab(taskName, tabName)).toBeVisible();
    }
    await expect(this.locators.sheetText(taskName, 'Reliability')).toBeVisible();
    await expect(this.locators.sheetText(taskName, 'Typical run')).toBeVisible();
    await expect(this.locators.sheetText(taskName, 'Last outcome')).toBeVisible();
    await expect(this.locators.sheetButton(taskName, 'Run now')).toBeVisible();
    await expect(this.locators.sheetHeading(taskName, "What it's told to do")).toBeVisible();
    await expect(this.locators.sheetHeading(taskName, 'Changes to this task')).toBeVisible();
    await expect(this.locators.sheetText(taskName, `Created “${taskName}”`)).toBeVisible();
  }

  async expectRunsTab(taskName: string) {
    await expect(this.locators.sheetText(taskName, 'Right now')).toBeVisible();
    await expect(this.locators.sheetText(taskName, 'Runs recorded')).toBeVisible();
    await expect(this.locators.sheetHeading(taskName, 'Creating the task')).toBeVisible();
    await expect(this.locators.sheetHeading(taskName, 'Each time it ran')).toBeVisible();
    for (const filterName of TASK_RUN_FILTERS) {
      await expect(this.locators.sheetButton(taskName, filterName)).toBeVisible();
    }
    await expect(this.locators.sheetText(taskName, "This task hasn't run yet. Its first fire will appear here.")).toBeVisible();
    await expect(this.locators.sheetHeading(taskName, 'Full log')).toBeVisible();
    for (const filterName of TASK_LOG_FILTERS) {
      await expect(this.locators.sheetButton(taskName, filterName)).toBeVisible();
    }
  }

  async expectSettingsTab(task: NewTask) {
    await expect(this.locators.sheetField(task.name, 'Task Name')).toHaveValue(task.name);
    await expect(this.locators.sheetField(task.name, "What it's for")).toHaveValue(task.purpose);
    await expect(this.locators.sheetSelect(task.name, 'Schedule')).toBeVisible();
    await expect(this.locators.sheetSelect(task.name, 'Channel')).toBeVisible();
    await expect(this.locators.sheetSelect(task.name, 'Send it to')).toBeVisible();
    await expect(this.locators.sheetSelect(task.name, 'How long may it take?')).toBeVisible();
    await expect(this.locators.slowRunSwitch(task.name)).not.toBeChecked();
    await expect(this.locators.sheetButton(task.name, 'Discard changes')).toBeDisabled();
    await expect(this.locators.sheetButton(task.name, 'Save changes')).toBeDisabled();
  }

  async expectSheetChangesAreEnabled(taskName: string) {
    await expect(this.locators.sheetButton(taskName, 'Discard changes')).toBeEnabled();
    await expect(this.locators.sheetButton(taskName, 'Save changes')).toBeEnabled();
  }

  async expectSheetChangesAreDisabled(taskName: string) {
    await expect(this.locators.sheetButton(taskName, 'Discard changes')).toBeDisabled();
    await expect(this.locators.sheetButton(taskName, 'Save changes')).toBeDisabled();
  }

  async expectSheetNameIs(taskName: string, expectedName: string) {
    await expect(this.locators.sheetField(taskName, 'Task Name')).toHaveValue(expectedName);
  }

  async expectSheetFooter(taskName: string) {
    await expect(this.locators.askBox(taskName)).toBeVisible();
    for (const suggestion of TASK_SUGGESTIONS) {
      await expect(this.locators.sheetButton(taskName, suggestion)).toBeVisible();
    }
    await expect(this.locators.sheetButton(taskName, 'Send')).toBeDisabled();
  }

  async expectDeleteConfirmation() {
    await expect(this.locators.deleteDialog).toBeVisible();
    await expect(this.locators.deleteWarning).toBeVisible();
    await expect(this.locators.keepItButton).toBeVisible();
    await expect(this.locators.yesDeleteButton).toBeVisible();
  }

  async expectTaskIsKept(taskName: string) {
    await expect(this.locators.deleteDialog).toBeHidden();
    await expect(this.locators.taskRow(taskName)).toBeVisible();
  }

  async expectTaskIsGone(taskName: string) {
    await expect(this.locators.deleteDialog).toBeHidden();
    await expect(this.locators.taskRow(taskName)).toHaveCount(0);
  }
}
