import { Page, Locator } from '@playwright/test';

export const WorkspaceLocators = {
  pageHeading: (page: Page): Locator => page.getByRole('button', { name: 'Workspace' }).first(),

  uploadFileButton: (page: Page): Locator => page.getByRole('button', { name: 'Upload file' }),
  uploadFolderButton: (page: Page): Locator => page.getByRole('button', { name: 'Upload folder' }),
  advancedViewButton: (page: Page): Locator => page.getByRole('button', { name: 'Advanced view' }),

  fileList: (page: Page): Locator => page.getByRole('main').getByRole('list'),

  // A file row's accessible name combines "<filename> <size>" (e.g. "casefile.md 104 B"), which
  // Playwright's getByRole name match performs case-INSENSITIVELY by default - unusable here since
  // this module has real files differing only by case ("casefile.md" vs "CaseFile.md"). Filtering
  // the listitem by an exact-text child node keeps the match case-sensitive. Scoped to <main> -
  // the separate "Upload activity" toast panel is its own sibling <ul>/<li> outside <main> and
  // repeats the file name as its own exact-text node, so an unscoped page-wide match hits both
  // (confirmed live: strict-mode violation without this scope).
  fileRow: (page: Page, fileName: string): Locator =>
    page.getByRole('main').getByRole('listitem').filter({ has: page.getByText(fileName, { exact: true }) }),

  fileActionsButton: (page: Page, fileName: string): Locator =>
    WorkspaceLocators.fileRow(page, fileName).getByRole('button', { name: 'Actions' }),

  actionsMenu: (page: Page): Locator => page.getByRole('menu', { name: 'Actions' }),
  openMenuItem: (page: Page): Locator => WorkspaceLocators.actionsMenu(page).getByRole('menuitem', { name: 'Open' }),
  downloadMenuItem: (page: Page): Locator => WorkspaceLocators.actionsMenu(page).getByRole('menuitem', { name: 'Download' }),
  renameMenuItem: (page: Page): Locator => WorkspaceLocators.actionsMenu(page).getByRole('menuitem', { name: 'Rename' }),
  deleteMenuItem: (page: Page): Locator => WorkspaceLocators.actionsMenu(page).getByRole('menuitem', { name: 'Delete' }),

  deleteConfirmDialog: (page: Page): Locator =>
    page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Delete file?' }) }),
  deleteConfirmText: (page: Page): Locator => WorkspaceLocators.deleteConfirmDialog(page).getByRole('paragraph'),
  deleteConfirmCancelButton: (page: Page): Locator => WorkspaceLocators.deleteConfirmDialog(page).getByRole('button', { name: 'Cancel' }),
  deleteConfirmDeleteButton: (page: Page): Locator => WorkspaceLocators.deleteConfirmDialog(page).getByRole('button', { name: 'Delete' }),

  uploadActivityRegion: (page: Page): Locator => page.getByRole('region', { name: 'Upload activity' }),
  // A conflict/duplicate-name block would surface as an error toast or a rename/overwrite prompt -
  // neither exists today (see findings/workspace.txt), so this matches on intent, not an observed string.
  duplicateNameConflictIndicator: (page: Page): Locator =>
    page.getByText(/already exists|duplicate file name|overwrite\?|rename to continue/i),
};
