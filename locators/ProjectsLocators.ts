import { Page, Locator } from '@playwright/test';

export const ProjectsLocators = {
  newProjectButton: (page: Page): Locator => page.getByRole('button', { name: 'New Project' }),
  searchInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Search projects…' }),
  sortCombobox: (page: Page): Locator => page.getByRole('combobox'),
  sortOption: (page: Page, label: string): Locator => page.getByRole('option', { name: label }),

  // The project card IS the link itself (confirmed live) - "Delete project" nests as a child
  // button inside that same link, so no extra scoping/CSS is needed at all.
  projectCard: (page: Page, name: string): Locator => page.getByRole('link', { name: `Open project ${name}` }),
  projectCardDeleteButton: (page: Page, name: string): Locator =>
    ProjectsLocators.projectCard(page, name).getByRole('button', { name: 'Delete project' }),

  // Create/Settings dialog (shared field set)
  nameInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Name' }),
  descriptionInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Description' }),
  // No <label>/aria-label on this field (confirmed live via DOM inspection) - its placeholder is
  // the only accessible name Chromium exposes for it, stable regardless of typed value since
  // accessible name comes from the placeholder attribute, not the current value. Create dialog
  // shows a scaffold-template placeholder; Settings (existing project) shows a short one instead.
  instructionsInput: (page: Page): Locator =>
    page.getByRole('dialog').getByRole('textbox', { name: /^## describe what is the project|Tailor the agent's behavior/ }),
  createButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Create' }),
  saveChangesButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Save Changes' }),
  cancelButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
  closeButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Close' }),

  // Delete confirmation
  deleteDialogHeading: (page: Page, name: string): Locator => page.getByRole('heading', { name: `Delete ${name}?` }),
  keepItButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Keep it' }),
  yesDeleteButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Yes, delete' }),

  // Project detail (chat scoped to project)
  filesButton: (page: Page): Locator => page.getByRole('button', { name: 'Files', exact: true }),
  settingsButton: (page: Page): Locator => page.getByRole('button', { name: 'Settings', exact: true }),
  filesDialogHeading: (page: Page, name: string): Locator => page.getByRole('heading', { name: `Project files — ${name}` }),
  settingsDialogHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Project Settings' }),
};
