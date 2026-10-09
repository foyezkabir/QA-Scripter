import type { Locator, Page } from '@playwright/test';

export class UserWorkspaceLocators {
  constructor(private readonly page: Page) {}

  main = this.page.getByRole('main');
  breadcrumb = this.main.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('button', { name: 'Workspace' });
  storageText = this.main.getByText('Storage', { exact: true }).filter({ visible: true });
  uploadFileButton = this.main.getByRole('button', { name: 'Upload file' });
  uploadFolderButton = this.main.getByRole('button', { name: 'Upload folder' });
  advancedViewButton = this.main.getByRole('button', { name: 'Advanced view' });
  simpleViewButton = this.main.getByRole('button', { name: 'Simple view' });
  newFileButton = this.main.getByRole('button', { name: 'New file' });
  newFolderButton = this.main.getByRole('button', { name: 'New folder' });
  showHiddenButton = this.main.getByRole('button', { name: 'Show hidden' });
  hideHiddenButton = this.main.getByRole('button', { name: 'Hide hidden' });
  uploadingToText = this.main.getByText('Uploading to', { exact: true });
  addStorageButton = this.main.getByRole('button', { name: 'Add more storage' });
  rootButton = this.main.getByRole('button', { name: /^Workspace ACTIVE/i });
  pickFileText = this.main.getByText('Pick a file to view or edit');

  // the file input that is not the folder picker is hidden, so it is addressed by type
  fileInput = this.page.locator('input[type=file]:not([webkitdirectory])');

  fileButtons = this.main.getByRole('listitem').getByRole('button', { name: /\d (B|KB|MB)$/ });
  actionsButtons = this.main.getByRole('listitem').getByRole('button', { name: 'Actions' });
  // any file row proves the list has loaded; which one is not important
  firstFileButton = this.fileButtons.first();
  // any file row will do; which one is not important
  firstActionsButton = this.actionsButtons.first();
  expandButtons = this.main.getByRole('button', { name: 'Expand' });

  uploadPanel = this.page.getByRole('region', { name: 'Upload activity' });

  uploadedRow(fileName: string): Locator {
    return this.uploadPanel.getByText(fileName, { exact: true });
  }

  itemButton(itemName: string): Locator {
    return this.main.getByRole('button', { name: new RegExp(`^${itemName}( |$)`) });
  }

  actionsFor(itemName: string): Locator {
    // the name button and its Actions button are siblings in one row, so step up to the row
    return this.itemButton(itemName).locator('..').getByRole('button', { name: 'Actions' });
  }

  menuItem(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: new RegExp(`^${itemName}`) });
  }

  automationItems = this.main.getByRole('button', { name: /^QA-AUTO-/ });
  // every QA-AUTO item is deleted in turn, so whichever row is first is the next one to remove
  firstAutomationActions = this.automationItems.first().locator('..').getByRole('button', { name: 'Actions' });

  folderDialog = this.page.getByRole('dialog', { name: 'New folder' });
  fileDialog = this.page.getByRole('dialog', { name: 'New file' });
  renameDialog = this.page.getByRole('dialog', { name: 'Rename' });
  deleteFileDialog = this.page.getByRole('dialog', { name: 'Delete file?' });
  deleteFolderDialog = this.page.getByRole('dialog', { name: 'Delete folder?' });
  anyDeleteDialog = this.deleteFileDialog.or(this.deleteFolderDialog);

  dialogName(dialog: Locator): Locator {
    return dialog.getByRole('textbox', { name: 'Name' });
  }

  dialogButton(dialog: Locator, buttonName: string): Locator {
    return dialog.getByRole('button', { name: buttonName, exact: true });
  }

  folderDialogText = this.folderDialog.getByText('Create a new folder at the workspace root.');
  fileDialogText = this.fileDialog.getByText('Create a new file at the workspace root.');

  renameText(itemName: string): Locator {
    return this.renameDialog.getByText(`Rename "${itemName}".`);
  }

  deleteWarning(dialog: Locator, itemName: string, tail: string): Locator {
    // the dialog shows the stored path (an upload is stored as directory/<name>), so match the name at the end of it
    return dialog.getByText(new RegExp(`${itemName}" will be permanently deleted${tail}`));
  }

  duplicateAlert(itemName: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: `A folder named "${itemName}" already exists here. Pick a different name.` });
  }

  viewerPath(itemName: string): Locator {
    return this.main.getByText(itemName, { exact: true });
  }

  renderedButton = this.main.getByRole('button', { name: 'Rendered' });
  sourceButton = this.main.getByRole('button', { name: 'Source', exact: true });
  copySourceButton = this.main.getByRole('button', { name: 'Copy source' });
  downloadButton = this.main.getByRole('button', { name: 'Download', exact: true });
  moreFormatsButton = this.main.getByRole('button', { name: 'More download formats' });
  editButton = this.main.getByRole('button', { name: 'Edit', exact: true });
  backToPreviewButton = this.main.getByRole('button', { name: 'Back to preview' });
  saveButton = this.main.getByRole('button', { name: 'Save', exact: true });
  editor = this.main.getByRole('textbox');
  savedText = this.main.getByText(/^Saved \d+:\d+/);

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  workspaceLink = this.agentSections.getByRole('link', { name: 'Workspace', exact: true });
}
