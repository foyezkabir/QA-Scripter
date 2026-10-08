import type { Locator, Page } from '@playwright/test';

export class UserTasksLocators {
  constructor(private readonly page: Page) {}

  main = this.page.getByRole('main');
  heading = this.main.getByRole('heading', { name: 'Tasks', level: 1 });
  subtitle = this.main.getByText('Set up jobs your assistant runs on a schedule so the routine stuff happens without you lifting a finger');
  createTaskButton = this.main.getByRole('button', { name: 'Create Task' });

  createDialog = this.page.getByRole('dialog', { name: 'Create Task' });
  createSubtitle = this.createDialog.getByText('Set it up once and let your assistant handle it for you.');
  createClose = this.createDialog.getByRole('button', { name: 'Close', exact: true });
  createCancel = this.createDialog.getByRole('button', { name: 'Cancel', exact: true });
  createSave = this.createDialog.getByRole('button', { name: 'Save', exact: true });
  enabledSwitch = this.createDialog.getByRole('switch');

  nameHint = this.createDialog.getByText("Name it after what it does, so it's easy to spot in your list.");
  purposeHint = this.createDialog.getByText("Tell us the outcome you want and what you'll get and when.");
  scheduleHint = this.createDialog.getByText('Choose how often this runs and your assistant handles it automatically at the times you pick.');
  instructionsHint = this.createDialog.getByText('Spell out exactly what your assistant should do, step by step.');
  channelHint = this.createDialog.getByText("Where this task's output is delivered. Required - pick a connected channel.");

  nameField = this.createDialog.getByRole('textbox', { name: 'Task Name' });
  purposeField = this.createDialog.getByRole('textbox', { name: "What it's for" });
  instructionsField = this.createDialog.getByRole('textbox', { name: 'How it should work' });
  scheduleSelect = this.createDialog.getByRole('combobox', { name: 'Schedule' });
  modelSelect = this.createDialog.getByRole('combobox', { name: 'Model' });
  channelSelect = this.createDialog.getByRole('combobox', { name: 'Channel' });

  createOption(select: Locator, optionName: string): Locator {
    return select.getByRole('option', { name: optionName, exact: true });
  }

  selectedOption(select: Locator, optionName: string): Locator {
    return select.getByRole('option', { name: optionName, exact: true, selected: true });
  }

  customSchedulePicker = this.createDialog.getByText('Custom schedule', { exact: true });
  frequencySelect = this.createDialog.getByRole('combobox', { name: 'Frequency' });
  atTimeText = this.createDialog.getByText('At time', { exact: true });
  advancedCronButton = this.createDialog.getByRole('button', { name: 'Advanced cron' });
  advancedCronText = this.createDialog.getByText('Advanced cron', { exact: true });
  backToPickerButton = this.createDialog.getByRole('button', { name: 'Back to picker' });
  scheduleLabelField = this.createDialog.getByRole('textbox', { name: 'Schedule label (shown in the task list)' });
  cronField = this.createDialog.getByRole('textbox', { name: /^Cron/ });

  taskRow(taskName: string): Locator {
    return this.main.getByRole('button', { name: `Open ${taskName}` });
  }

  rowSwitch(taskName: string, label: string): Locator {
    return this.taskRow(taskName).getByRole('switch', { name: label });
  }

  rowDelete(taskName: string): Locator {
    return this.taskRow(taskName).getByRole('button', { name: 'Delete', exact: true });
  }

  rowText(taskName: string, text: string | RegExp): Locator {
    return this.taskRow(taskName).getByText(text);
  }

  automationRows = this.main.getByRole('button', { name: /^Open QA-AUTO / });
  // every QA-AUTO task is deleted in turn, so whichever row is first is the next one to remove
  firstAutomationDelete = this.automationRows.first().getByRole('button', { name: 'Delete', exact: true });
  nextInCountdown = this.main.getByText(/next in \d+:\d+:\d+/);

  summaryCard(cardName: string): Locator {
    return this.main.getByText(cardName, { exact: true });
  }

  healthTabs = this.main.getByRole('tablist', { name: 'Filter tasks by health' });

  healthTab(tabName: string): Locator {
    return this.healthTabs.getByRole('tab', { name: new RegExp(`^${tabName} \\d+`) });
  }

  noTasksHeading = this.main.getByRole('heading', { name: 'No tasks yet', level: 2 });
  listLoaded = this.healthTabs.or(this.noTasksHeading);
  turnedOffText = this.main.getByText(/\d+ turned off/);
  nothingScheduledText = this.main.getByText('nothing scheduled');
  noTaskInStateText = this.main.getByText('No task is in that state.');
  showAllTasksButton = this.main.getByRole('button', { name: 'Show all tasks' });
  searchBox = this.main.getByRole('searchbox', { name: 'Search tasks' });
  noMatchText = this.main.getByText(/^No task matches/);
  hiddenByFiltersText = this.main.getByText(/\d+ hidden by these filters/);
  sortButton = this.main.getByRole('button', { name: /^Sort:/ });

  sortOption(optionName: string): Locator {
    return this.page.getByRole('menuitemradio', { name: optionName, exact: true });
  }

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  tasksLink = this.agentSections.getByRole('link', { name: 'Tasks', exact: true });

  sheet(taskName: string): Locator {
    return this.page.getByRole('dialog', { name: taskName });
  }

  sheetTab(taskName: string, tabName: string): Locator {
    return this.sheet(taskName).getByRole('tab', { name: tabName, exact: true });
  }

  sheetClose(taskName: string): Locator {
    return this.sheet(taskName).getByRole('button', { name: 'Close', exact: true });
  }

  sheetText(taskName: string, text: string | RegExp): Locator {
    return this.sheet(taskName).getByText(text);
  }

  sheetHeading(taskName: string, headingName: string): Locator {
    return this.sheet(taskName).getByRole('heading', { name: headingName });
  }

  sheetButton(taskName: string, buttonName: string): Locator {
    return this.sheet(taskName).getByRole('button', { name: buttonName, exact: true });
  }

  sheetField(taskName: string, fieldName: string): Locator {
    return this.sheet(taskName).getByRole('textbox', { name: fieldName });
  }

  sheetSelect(taskName: string, selectName: string): Locator {
    return this.sheet(taskName).getByRole('combobox', { name: selectName });
  }

  slowRunSwitch(taskName: string): Locator {
    return this.sheet(taskName).getByRole('switch', { name: 'Tell me when a run is taking a while' });
  }

  askBox(taskName: string): Locator {
    return this.sheet(taskName).getByRole('textbox', { name: `Ask about ${taskName}` });
  }

  deleteDialog = this.page.getByRole('dialog', { name: 'Delete this task?' });
  deleteWarning = this.deleteDialog.getByText("This will permanently remove this task and everything it's tracking.");
  keepItButton = this.deleteDialog.getByRole('button', { name: 'Keep it' });
  yesDeleteButton = this.deleteDialog.getByRole('button', { name: 'Yes, delete' });
}
