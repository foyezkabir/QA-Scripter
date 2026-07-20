import { Page } from '@playwright/test';
import { WorkspaceLocators } from '../locators/WorkspaceLocators';

export class WorkspacePage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/workspace`);
  }

  async uploadFile(filePath: string): Promise<void> {
    const [chooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      WorkspaceLocators.uploadFileButton(this.page).click(),
    ]);
    await chooser.setFiles(filePath);
  }

  async openActionsMenu(fileName: string): Promise<void> {
    await WorkspaceLocators.fileActionsButton(this.page, fileName).click();
  }

  async clickDelete(fileName: string): Promise<void> {
    await this.openActionsMenu(fileName);
    await WorkspaceLocators.deleteMenuItem(this.page).click();
  }

  async confirmDelete(): Promise<void> {
    await WorkspaceLocators.deleteConfirmDeleteButton(this.page).click();
  }

  async cancelDelete(): Promise<void> {
    await WorkspaceLocators.deleteConfirmCancelButton(this.page).click();
  }

  /** Teardown helper: deletes the named file if it currently exists, no-ops otherwise. */
  async deleteFileIfExists(fileName: string): Promise<void> {
    const count = await WorkspaceLocators.fileRow(this.page, fileName).count();
    if (count === 0) return;
    await this.clickDelete(fileName);
    await this.confirmDelete();
    await WorkspaceLocators.fileRow(this.page, fileName).waitFor({ state: 'detached' });
  }

  // --- State getters (no assertions - specs assert on these) ---

  fileRowLocator(fileName: string) {
    return WorkspaceLocators.fileRow(this.page, fileName);
  }

  deleteConfirmDialogLocator() {
    return WorkspaceLocators.deleteConfirmDialog(this.page);
  }

  deleteConfirmTextLocator() {
    return WorkspaceLocators.deleteConfirmText(this.page);
  }

  duplicateNameConflictIndicatorLocator() {
    return WorkspaceLocators.duplicateNameConflictIndicator(this.page);
  }
}
