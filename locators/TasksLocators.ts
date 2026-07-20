import { Page, Locator } from '@playwright/test';

// Card containers have no ARIA role or data-testid (confirmed via live DOM inspection -
// grandparent of each task heading is a plain <div class="bg-card ..."> shared by all 14 cards).
// CSS class + role filter is the most precise scoping available - last resort per locator priority.
export const TasksLocators = {
  pageHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Tasks', level: 1 }),
  newTaskButton: (page: Page): Locator => page.getByRole('button', { name: 'New Task' }),

  taskCards: (page: Page): Locator => page.locator('div.bg-card'),
  taskCard: (page: Page, taskName: string): Locator =>
    page.locator('div.bg-card').filter({ has: page.getByRole('heading', { name: taskName, exact: true, level: 3 }) }),

  cardEditButton: (card: Locator): Locator => card.getByRole('button', { name: 'Edit' }),
  cardDeleteButton: (card: Locator): Locator => card.getByRole('button', { name: 'Delete' }),
  cardEnabledSwitch: (card: Locator): Locator => card.getByRole('switch'),

  dialog: (page: Page): Locator => page.getByRole('dialog'),
  dialogHeading: (page: Page): Locator => page.getByRole('dialog').getByRole('heading'),

  nameInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Name' }),
  descriptionInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Description' }),
  promptInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Task / Prompt' }),

  scheduleCombobox: (page: Page): Locator => page.getByRole('dialog').getByRole('combobox', { name: 'Schedule' }),
  scheduleOption: (page: Page, label: string): Locator => page.getByRole('dialog').getByRole('option', { name: label }),

  frequencyCombobox: (page: Page): Locator => page.getByRole('dialog').getByRole('combobox', { name: 'Frequency' }),
  // No accessible name (labeled only by adjacent "Run every"/"minutes|hours" text) - only one
  // spinbutton renders at a time (Every N minutes/hours), so an unqualified role lookup is unique.
  customIntervalInput: (page: Page): Locator => page.getByRole('dialog').getByRole('spinbutton'),
  advancedCronButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Advanced cron' }),
  backToPickerButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Back to picker' }),
  scheduleLabelInput: (page: Page): Locator =>
    page.getByRole('dialog').getByRole('textbox', { name: 'Schedule label (shown in the task list)' }),
  cronExpressionInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: /^Cron \(/ }),

  // No aria-pressed/aria-selected on these (see findings/tasks.txt) - matched by visible text only.
  complexityButton: (page: Page, level: 'Simple' | 'Complex'): Locator =>
    page.getByRole('dialog').getByRole('button', { name: new RegExp(`^${level}`) }),

  enabledSwitch: (page: Page): Locator => page.getByRole('dialog').getByRole('switch'),

  cancelButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
  createButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Create' }),
  saveChangesButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Save Changes' }),
  closeButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Close' }),

  deleteDialogHeading: (page: Page, taskName: string): Locator =>
    page.getByRole('dialog').getByRole('heading', { name: `Delete ${taskName}?` }),
  keepItButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Keep it' }),
  yesDeleteButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Yes, delete' }),
};
