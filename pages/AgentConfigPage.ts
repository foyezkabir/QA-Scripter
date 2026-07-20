import { Page, Locator } from '@playwright/test';
import { AgentConfigLocators } from '../locators/AgentConfigLocators';

export class AgentConfigPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/configuration`);
  }

  async fillBasicInfo(fields: { name?: string; role?: string; description?: string }): Promise<void> {
    if (fields.name !== undefined) await AgentConfigLocators.agentNameInput(this.page).fill(fields.name);
    if (fields.role !== undefined) await AgentConfigLocators.roleInput(this.page).fill(fields.role);
    if (fields.description !== undefined) await AgentConfigLocators.descriptionInput(this.page).fill(fields.description);
  }

  async submitBasicInfoSave(): Promise<void> {
    await AgentConfigLocators.basicInfoSaveButton(this.page).click();
  }

  async openDeleteConfirm(): Promise<void> {
    await AgentConfigLocators.deleteAgentButton(this.page).click();
  }

  /** Dismisses the delete confirmation without deleting anything. This module intentionally has
   * no method that confirms a real delete - see locators/AgentConfigLocators.ts. */
  async keepAgent(): Promise<void> {
    await AgentConfigLocators.keepItButton(this.page).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  agentNameInputLocator(): Locator {
    return AgentConfigLocators.agentNameInput(this.page);
  }

  roleInputLocator(): Locator {
    return AgentConfigLocators.roleInput(this.page);
  }

  descriptionInputLocator(): Locator {
    return AgentConfigLocators.descriptionInput(this.page);
  }

  basicInfoSaveButtonLocator(): Locator {
    return AgentConfigLocators.basicInfoSaveButton(this.page);
  }

  deleteConfirmDialogLocator(): Locator {
    return AgentConfigLocators.deleteConfirmDialog(this.page);
  }

  deleteConfirmHeadingLocator(agentName: string): Locator {
    return AgentConfigLocators.deleteConfirmHeading(this.page, agentName);
  }

  /** State inspection only - see locators/AgentConfigLocators.ts. Never clicked from this page object. */
  yesDeleteButtonLocator(): Locator {
    return AgentConfigLocators.yesDeleteButton(this.page);
  }
}
