import { Page, Locator } from '@playwright/test';
import { TasksLocators } from '../locators/TasksLocators';

export type SchedulePreset =
  | 'Every morning at 9am'
  | 'Every hour'
  | 'Every weekday at 9am'
  | 'Every Monday at 9am'
  | 'Every day at noon'
  | 'Every evening at 6pm'
  | 'Every 30 minutes'
  | 'Custom…';

export type TaskComplexity = 'Simple' | 'Complex';

export class TasksPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/tasks`);
  }

  async openNewTaskDialog(): Promise<void> {
    await TasksLocators.newTaskButton(this.page).click();
  }

  async openEditDialog(taskName: string): Promise<void> {
    const card = TasksLocators.taskCard(this.page, taskName);
    // Edit/Delete are hover-revealed (card has a Tailwind `group` class, actions likely
    // opacity-0 until group-hover) - hover explicitly first rather than relying on the
    // implicit hover Playwright performs mid-click, which proved flaky against this pattern.
    await card.hover();
    await TasksLocators.cardEditButton(card).click();
  }

  async openDeleteConfirm(taskName: string): Promise<void> {
    const card = TasksLocators.taskCard(this.page, taskName);
    await card.hover();
    await TasksLocators.cardDeleteButton(card).click();
  }

  async fillFields(fields: { name?: string; description?: string; prompt?: string }): Promise<void> {
    if (fields.name !== undefined) await TasksLocators.nameInput(this.page).fill(fields.name);
    if (fields.description !== undefined) await TasksLocators.descriptionInput(this.page).fill(fields.description);
    if (fields.prompt !== undefined) await TasksLocators.promptInput(this.page).fill(fields.prompt);
  }

  // Confirmed live: this is a native <select> (Playwright resolves its options to <option>
  // elements that are never "visible" while closed) - selectOption(), not click+click.
  async selectSchedulePreset(preset: SchedulePreset): Promise<void> {
    await TasksLocators.scheduleCombobox(this.page).selectOption({ label: preset });
  }

  async switchToAdvancedCron(): Promise<void> {
    await TasksLocators.advancedCronButton(this.page).click();
  }

  async selectCustomFrequency(freq: 'Every N minutes' | 'Every N hours'): Promise<void> {
    await TasksLocators.frequencyCombobox(this.page).selectOption({ label: freq });
  }

  async setCustomInterval(value: number): Promise<void> {
    await TasksLocators.customIntervalInput(this.page).fill(String(value));
  }

  customIntervalLocator(): Locator {
    return TasksLocators.customIntervalInput(this.page);
  }

  async switchBackToPicker(): Promise<void> {
    await TasksLocators.backToPickerButton(this.page).click();
  }

  async fillAdvancedCron(fields: { label?: string; expression?: string }): Promise<void> {
    if (fields.label !== undefined) await TasksLocators.scheduleLabelInput(this.page).fill(fields.label);
    if (fields.expression !== undefined) await TasksLocators.cronExpressionInput(this.page).fill(fields.expression);
  }

  async selectComplexity(level: TaskComplexity): Promise<void> {
    await TasksLocators.complexityButton(this.page, level).click();
  }

  async setEnabledInDialog(enabled: boolean): Promise<void> {
    const toggle = TasksLocators.enabledSwitch(this.page);
    const isChecked = await toggle.isChecked();
    if (isChecked !== enabled) await toggle.click();
  }

  async submitCreate(): Promise<void> {
    await TasksLocators.createButton(this.page).click();
  }

  async submitSaveChanges(): Promise<void> {
    await TasksLocators.saveChangesButton(this.page).click();
  }

  async cancelDialog(): Promise<void> {
    await TasksLocators.cancelButton(this.page).click();
  }

  async closeDialog(): Promise<void> {
    await TasksLocators.closeButton(this.page).click();
  }

  async toggleEnabled(taskName: string): Promise<void> {
    const card = TasksLocators.taskCard(this.page, taskName);
    await TasksLocators.cardEnabledSwitch(card).click();
  }

  async confirmDelete(): Promise<void> {
    await TasksLocators.yesDeleteButton(this.page).click();
  }

  async keepTask(): Promise<void> {
    await TasksLocators.keepItButton(this.page).click();
  }

  /** Creates each task in order via the dialog, waiting for its card to render before starting the next. */
  async createTasks(tasks: { name: string; description?: string; prompt?: string }[]): Promise<void> {
    for (const task of tasks) {
      await this.openNewTaskDialog();
      await this.fillFields(task);
      await this.submitCreate();
      await this.taskCardLocator(task.name).waitFor({ state: 'visible' });
    }
  }

  /** Deletes every named task (each via deleteTaskIfExists, so already-absent ones are a no-op). */
  async deleteTasks(taskNames: string[]): Promise<void> {
    for (const name of taskNames) {
      await this.deleteTaskIfExists(name);
    }
  }

  /**
   * Deletes every task card matching this name via the UI (usually one, but duplicate names are
   * permitted by the app - see findings/tasks.txt - so this loops until none remain). No-op if
   * none exist. For fixture teardown only.
   */
  async deleteTaskIfExists(taskName: string): Promise<void> {
    for (;;) {
      const matches = TasksLocators.taskCard(this.page, taskName);
      if ((await matches.count()) === 0) break;
      const card = matches.first();
      await card.hover();
      await TasksLocators.cardDeleteButton(card).click();
      await this.confirmDelete();
      // Wait for this specific card to actually detach before re-checking count/looping to the
      // next task - without this, a rapid sequence of deletes can race ahead of the confirm click
      // actually taking effect (observed live: one deletion silently no-op'd under back-to-back
      // rapid deletes - see findings/tasks.txt).
      await card.waitFor({ state: 'detached' });
    }
  }

  /**
   * Opens the delete-confirmation dialog for one of several identically-named task cards.
   * Duplicates are indistinguishable in the DOM (that's the defect under test - see
   * findings/tasks.txt), so `.first()` is a deliberate last resort: the assertion this supports
   * is about the dialog's own content, not about targeting a specific instance.
   */
  async openDeleteConfirmForDuplicate(taskName: string): Promise<void> {
    const card = TasksLocators.taskCard(this.page, taskName).first();
    await card.hover();
    await TasksLocators.cardDeleteButton(card).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  getTaskCount(): Promise<number> {
    return TasksLocators.taskCards(this.page).count();
  }

  taskCardLocator(taskName: string): Locator {
    return TasksLocators.taskCard(this.page, taskName);
  }

  async isTaskEnabled(taskName: string): Promise<boolean> {
    const card = TasksLocators.taskCard(this.page, taskName);
    return TasksLocators.cardEnabledSwitch(card).isChecked();
  }

  // Native <select> - .toHaveText() on the element returns every option's concatenated text,
  // not the selection, so read the selected option's own text instead.
  getSelectedSchedulePreset(): Promise<string> {
    return TasksLocators.scheduleCombobox(this.page).evaluate(
      (el) => (el as HTMLSelectElement).selectedOptions[0]?.textContent ?? '',
    );
  }

  dialogLocator(): Locator {
    return TasksLocators.dialog(this.page);
  }

  dialogHeadingLocator(): Locator {
    return TasksLocators.dialogHeading(this.page);
  }

  deleteDialogHeadingLocator(taskName: string): Locator {
    return TasksLocators.deleteDialogHeading(this.page, taskName);
  }

  createButtonLocator(): Locator {
    return TasksLocators.createButton(this.page);
  }

  promptFieldValue(): Promise<string> {
    return TasksLocators.promptInput(this.page).inputValue();
  }

  scheduleLabelPreviewLocator(label: string): Locator {
    return TasksLocators.dialog(this.page).getByText(label, { exact: true });
  }

  cronExpressionPreviewLocator(expression: string): Locator {
    return TasksLocators.dialog(this.page).getByText(expression, { exact: true });
  }

  descriptionTextLocator(taskName: string, description: string): Locator {
    return TasksLocators.taskCard(this.page, taskName).getByText(description, { exact: true });
  }

  scheduleTextLocator(taskName: string, scheduleLabel: string): Locator {
    return TasksLocators.taskCard(this.page, taskName).getByText(scheduleLabel, { exact: true });
  }

  // No aria-pressed/aria-selected exposed by the app (findings/tasks.txt) - class name is the
  // only available signal for which complexity button is currently selected.
  async isComplexitySelected(level: TaskComplexity): Promise<boolean> {
    const className = (await TasksLocators.complexityButton(this.page, level).getAttribute('class')) ?? '';
    return className.includes('border-primary');
  }
}
