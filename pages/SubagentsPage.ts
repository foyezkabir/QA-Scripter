import { Page, Locator } from '@playwright/test';
import { SubagentsLocators } from '../locators/SubagentsLocators';

export class SubagentsPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/subagents`);
  }

  async openNewSubagentDialog(): Promise<void> {
    await SubagentsLocators.newSubagentButton(this.page).click();
  }

  async fillFields(fields: { name?: string; description?: string; instructions?: string }): Promise<void> {
    if (fields.name !== undefined) await SubagentsLocators.nameInput(this.page).fill(fields.name);
    if (fields.description !== undefined) await SubagentsLocators.descriptionInput(this.page).fill(fields.description);
    if (fields.instructions !== undefined) await SubagentsLocators.instructionsInput(this.page).fill(fields.instructions);
  }

  async submitCreate(): Promise<void> {
    await SubagentsLocators.createButton(this.page).click();
  }

  async submitSaveChanges(): Promise<void> {
    await SubagentsLocators.saveChangesButton(this.page).click();
  }

  async search(text: string): Promise<void> {
    await SubagentsLocators.searchInput(this.page).fill(text);
  }

  async openDetails(name: string): Promise<void> {
    await SubagentsLocators.detailsButton(this.page, name).click();
  }

  async closeDialog(): Promise<void> {
    await SubagentsLocators.closeButton(this.page).click();
  }

  async openEdit(name: string): Promise<void> {
    await SubagentsLocators.editButton(this.page, name).click();
  }

  async toggleEnabled(name: string): Promise<void> {
    await SubagentsLocators.toggleSwitch(this.page, name).click();
  }

  async openDeleteConfirm(name: string): Promise<void> {
    await SubagentsLocators.deleteButton(this.page, name).click();
  }

  async confirmDelete(): Promise<void> {
    await SubagentsLocators.yesDeleteButton(this.page).click();
  }

  async keepSubagent(): Promise<void> {
    await SubagentsLocators.keepItButton(this.page).click();
  }

  /** Deletes the named subagent via the UI if it currently exists; no-op otherwise. For fixture teardown only. */
  async deleteSubagentIfExists(name: string): Promise<void> {
    const count = await SubagentsLocators.card(this.page, name).count();
    if (count === 0) return;
    await this.openDeleteConfirm(name);
    await this.confirmDelete();
  }

  // --- State getters (no assertions - specs assert on these) ---

  subagentCardLocator(name: string): Locator {
    return SubagentsLocators.card(this.page, name);
  }

  toggleSwitchLocator(name: string): Locator {
    return SubagentsLocators.toggleSwitch(this.page, name);
  }

  createButtonLocator(): Locator {
    return SubagentsLocators.createButton(this.page);
  }

  deleteDialogHeadingLocator(name: string): Locator {
    return SubagentsLocators.deleteDialogHeading(this.page, name);
  }

  async getSubagentCount(): Promise<number> {
    return this.page.getByRole('main').getByRole('heading', { level: 3 }).count();
  }
}
