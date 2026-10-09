import { expect, type Page } from '@playwright/test';
import {
  OWN_ASSISTANT,
  WORKSPACE_ADVANCED_BUTTONS,
  WORKSPACE_FILE_CONTENT,
  WORKSPACE_FILE_MENU,
  WORKSPACE_FOLDER_MENU,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserWorkspaceLocators } from '../locators/UserWorkspaceLocators';

export class UserWorkspacePage {
  private readonly locators: UserWorkspaceLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserWorkspaceLocators(page);
  }

  async openWorkspace() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/workspace`);
    await expect(this.locators.advancedViewButton.or(this.locators.simpleViewButton)).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openSimpleView() {
    await this.openWorkspace();
    await expect(this.locators.advancedViewButton.or(this.locators.simpleViewButton)).toBeVisible();
    if (await this.locators.simpleViewButton.isVisible()) {
      await this.locators.simpleViewButton.click();
    }
    await expect(this.locators.firstFileButton).toBeVisible();
  }

  async openAdvancedView() {
    await this.openWorkspace();
    await expect(this.locators.advancedViewButton.or(this.locators.simpleViewButton)).toBeVisible();
    if (await this.locators.advancedViewButton.isVisible()) {
      await this.locators.advancedViewButton.click();
    }
    await expect(this.locators.rootButton).toBeVisible();
    await expect(this.locators.expandButtons).not.toHaveCount(0);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.workspaceLink.click();
  }

  async switchToAdvancedView() {
    await this.locators.advancedViewButton.click();
  }

  async switchToSimpleView() {
    await this.locators.simpleViewButton.click();
  }

  async showHidden() {
    await this.locators.showHiddenButton.click();
  }

  async hideHidden() {
    await this.locators.hideHiddenButton.click();
  }

  async uploadFile(fileName: string) {
    await this.locators.fileInput.setInputFiles({ name: fileName, mimeType: 'text/plain', buffer: Buffer.from(WORKSPACE_FILE_CONTENT) });
    await this.locators.itemButton(fileName).waitFor();
  }

  async openFolderDialog() {
    await this.locators.newFolderButton.click();
    await expect(this.locators.folderDialog).toBeVisible();
  }

  async typeFolderName(itemName: string) {
    await this.locators.dialogName(this.locators.folderDialog).fill(itemName);
  }

  async confirmFolder() {
    await this.locators.dialogButton(this.locators.folderDialog, 'Create folder').click();
  }

  async cancelFolderDialog() {
    await this.locators.dialogButton(this.locators.folderDialog, 'Cancel').click();
  }

  async createFolder(folderName: string) {
    await this.openFolderDialog();
    await this.typeFolderName(folderName);
    await this.confirmFolder();
    await this.locators.folderDialog.waitFor({ state: 'hidden' });
    await this.locators.itemButton(folderName).waitFor();
  }

  async openFileDialog() {
    await this.locators.newFileButton.click();
    await expect(this.locators.fileDialog).toBeVisible();
  }

  async typeFileName(itemName: string) {
    await this.locators.dialogName(this.locators.fileDialog).fill(itemName);
  }

  async confirmFile() {
    await this.locators.dialogButton(this.locators.fileDialog, 'Create file').click();
  }

  async cancelFileDialog() {
    await this.locators.dialogButton(this.locators.fileDialog, 'Cancel').click();
  }

  async createFile(fileName: string) {
    await this.openFileDialog();
    await this.typeFileName(fileName);
    await this.confirmFile();
    await this.locators.fileDialog.waitFor({ state: 'hidden' });
    await this.locators.viewerPath(fileName).waitFor();
  }

  async openActions(itemName: string) {
    await this.locators.actionsFor(itemName).click();
  }

  async chooseMenuItem(itemName: string) {
    await this.locators.menuItem(itemName).click();
  }

  async typeRename(itemName: string) {
    await this.locators.dialogName(this.locators.renameDialog).fill(itemName);
  }

  async confirmRename() {
    await this.locators.dialogButton(this.locators.renameDialog, 'Rename').click();
  }

  async cancelRename() {
    await this.locators.dialogButton(this.locators.renameDialog, 'Cancel').click();
  }

  async renameItem(itemName: string, newName: string) {
    await this.openActions(itemName);
    await this.chooseMenuItem('Rename');
    await this.typeRename(newName);
    await this.confirmRename();
  }

  async cancelDelete() {
    await this.locators.dialogButton(this.locators.anyDeleteDialog, 'Cancel').click();
  }

  async confirmDelete() {
    await this.locators.dialogButton(this.locators.anyDeleteDialog, 'Delete').click();
  }

  async chooseSource() {
    await this.locators.sourceButton.click();
  }

  async clickEdit() {
    await this.locators.editButton.click();
  }

  async typeInEditor(text: string) {
    await this.locators.editor.fill(text);
  }

  async clickSave() {
    await this.locators.saveButton.click();
  }

  async deleteAutomationUploads() {
    await this.openSimpleView();
    await this.deleteMarkedItems();
  }

  async deleteAutomationTreeItems() {
    await this.openAdvancedView();
    await this.deleteMarkedItems();
  }

  private async deleteMarkedItems() {
    const marked = await this.locators.automationItems.count();
    for (let remaining = marked; remaining > 0; remaining--) {
      await this.locators.firstAutomationActions.click();
      await this.chooseMenuItem('Delete');
      await this.confirmDelete();
      await this.locators.anyDeleteDialog.waitFor({ state: 'hidden' });
      await expect(this.locators.automationItems).toHaveCount(remaining - 1);
    }
  }

  async expectSimpleView() {
    await expect(this.locators.breadcrumb).toBeVisible();
    await expect(this.locators.storageText).toBeVisible();
    await expect(this.locators.uploadFileButton).toBeVisible();
    await expect(this.locators.uploadFolderButton).toBeVisible();
    await expect(this.locators.advancedViewButton).toBeVisible();
    await expect(this.locators.firstFileButton).toBeVisible();
    await expect(this.locators.firstActionsButton).toBeVisible();
  }

  async expectFileIsUploaded(fileName: string) {
    await expect(this.locators.itemButton(fileName)).toBeVisible();
    await expect(this.locators.uploadedRow(fileName)).toBeVisible();
  }

  async expectFileMenu() {
    for (const itemName of WORKSPACE_FILE_MENU) {
      await expect(this.locators.menuItem(itemName)).toBeVisible();
    }
  }

  async expectFolderMenu() {
    for (const itemName of WORKSPACE_FOLDER_MENU) {
      await expect(this.locators.menuItem(itemName)).toBeVisible();
    }
  }

  async expectRenameDialog(itemName: string) {
    await expect(this.locators.renameDialog).toBeVisible();
    await expect(this.locators.renameText(itemName)).toBeVisible();
    await expect(this.locators.dialogName(this.locators.renameDialog)).toHaveValue(itemName);
  }

  async expectRenameNeedsAName() {
    await this.typeRename('');
    await expect(this.locators.dialogButton(this.locators.renameDialog, 'Rename')).toBeDisabled();
  }

  async expectRenameDialogIsClosed() {
    await expect(this.locators.renameDialog).toBeHidden();
  }

  async expectDeleteFileDialog(itemName: string) {
    await expect(this.locators.deleteFileDialog).toBeVisible();
    await expect(this.locators.deleteWarning(this.locators.deleteFileDialog, itemName, '. This cannot be undone.')).toBeVisible();
  }

  async expectDeleteFolderDialog(itemName: string) {
    await expect(this.locators.deleteFolderDialog).toBeVisible();
    await expect(this.locators.deleteWarning(this.locators.deleteFolderDialog, itemName, ' along with everything inside it. This cannot be undone.')).toBeVisible();
  }

  async expectItemIsKept(itemName: string) {
    await expect(this.locators.anyDeleteDialog).toBeHidden();
    await expect(this.locators.itemButton(itemName)).toBeVisible();
  }

  async expectItemIsGone(itemName: string) {
    await expect(this.locators.anyDeleteDialog).toBeHidden();
    await expect(this.locators.itemButton(itemName)).toHaveCount(0);
  }

  async expectItemIsListed(itemName: string) {
    await expect(this.locators.itemButton(itemName)).toBeVisible();
  }

  async expectAdvancedView() {
    await expect(this.locators.uploadingToText).toBeVisible();
    for (const buttonName of WORKSPACE_ADVANCED_BUTTONS) {
      await expect(this.page.getByRole('main').getByRole('button', { name: buttonName })).toBeVisible();
    }
    await expect(this.locators.addStorageButton).toBeVisible();
    await expect(this.locators.rootButton).toBeVisible();
    await expect(this.locators.pickFileText).toBeVisible();
  }

  async expectSimpleViewIsBack() {
    await expect(this.locators.advancedViewButton).toBeVisible();
    await expect(this.locators.simpleViewButton).toBeHidden();
  }

  async expectHiddenAreShown() {
    await expect(this.locators.hideHiddenButton).toBeVisible();
    await expect(this.locators.showHiddenButton).toBeHidden();
  }

  async expectHiddenAreNotShown() {
    await expect(this.locators.showHiddenButton).toBeVisible();
    await expect(this.locators.hideHiddenButton).toBeHidden();
  }

  async expectFolderDialog() {
    await expect(this.locators.folderDialogText).toBeVisible();
    await expect(this.locators.dialogName(this.locators.folderDialog)).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.folderDialog, 'Cancel')).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.folderDialog, 'Close')).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.folderDialog, 'Create folder')).toBeDisabled();
  }

  async expectFolderNeedsAName() {
    await this.typeFolderName('   ');
    await expect(this.locators.dialogButton(this.locators.folderDialog, 'Create folder')).toBeDisabled();
  }

  async expectFolderDialogIsClosed() {
    await expect(this.locators.folderDialog).toBeHidden();
  }

  async expectDuplicateAlert(itemName: string) {
    await expect(this.locators.duplicateAlert(itemName)).toBeVisible();
  }

  async expectFileDialog() {
    await expect(this.locators.fileDialogText).toBeVisible();
    await expect(this.locators.dialogName(this.locators.fileDialog)).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.fileDialog, 'Cancel')).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.fileDialog, 'Close')).toBeVisible();
    await expect(this.locators.dialogButton(this.locators.fileDialog, 'Create file')).toBeDisabled();
  }

  async expectFileDialogIsClosed() {
    await expect(this.locators.fileDialog).toBeHidden();
  }

  async expectViewer(fileName: string) {
    await expect(this.locators.viewerPath(fileName)).toBeVisible();
    await expect(this.locators.renderedButton).toHaveAttribute('aria-pressed', 'true');
    await expect(this.locators.sourceButton).toBeVisible();
    await expect(this.locators.copySourceButton).toBeVisible();
    await expect(this.locators.downloadButton).toBeVisible();
    await expect(this.locators.moreFormatsButton).toBeVisible();
    await expect(this.locators.editButton).toBeVisible();
  }

  async expectSourceIsPressed() {
    await expect(this.locators.sourceButton).toHaveAttribute('aria-pressed', 'true');
    await expect(this.locators.renderedButton).toHaveAttribute('aria-pressed', 'false');
  }

  async expectEditor() {
    await expect(this.locators.backToPreviewButton).toBeVisible();
    await expect(this.locators.downloadButton).toBeVisible();
    await expect(this.locators.saveButton).toBeDisabled();
  }

  async expectSaveIsEnabled() {
    await expect(this.locators.saveButton).toBeEnabled();
  }

  async expectSaved() {
    await expect(this.locators.savedText).toBeVisible();
  }

  async expectWorkspaceUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/workspace$`));
    await expect(this.locators.advancedViewButton.or(this.locators.simpleViewButton)).toBeVisible();
  }
}
