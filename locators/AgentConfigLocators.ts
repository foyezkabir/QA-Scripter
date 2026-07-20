import { Page, Locator } from '@playwright/test';

export const AgentConfigLocators = {
  pageHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Configuration', level: 1 }),

  agentNameInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Agent Name' }),
  roleInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Role' }),
  descriptionInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Describe what your agent does' }),
  // Basic Information's own Save Changes button - distinct from any other "Save" control on the
  // page - disabled until a field actually changes (confirmed live).
  basicInfoSaveButton: (page: Page): Locator =>
    page.getByText('Identity and core details.').locator('xpath=ancestor::*[2]').getByRole('button', { name: 'Save Changes' }),

  responseToneSelect: (page: Page): Locator => page.getByRole('combobox'),

  deleteAgentButton: (page: Page): Locator => page.getByRole('button', { name: 'Delete Agent' }),
  // Confirmed live: this dialog has NO name-confirmation text field at all (see findings/agentConfig.txt) -
  // just "Keep it" / "Yes, delete". No confirmDeleteButton locator is exposed anywhere in this
  // module by design - "Yes, delete" is deliberately never wrapped so no spec can accidentally
  // click it against the one shared dev agent this whole suite depends on.
  deleteConfirmDialog: (page: Page): Locator => page.getByRole('dialog').filter({ has: page.getByText(/^Delete .+\?$/) }),
  deleteConfirmHeading: (page: Page, agentName: string): Locator => page.getByRole('heading', { name: `Delete ${agentName}?` }),
  keepItButton: (page: Page): Locator => AgentConfigLocators.deleteConfirmDialog(page).getByRole('button', { name: 'Keep it' }),
  // Exposed for STATE INSPECTION ONLY (e.g. `.toBeEnabled()`) - case 62098 needs to observe this
  // button's enabled/disabled state. AgentConfigPage deliberately has no method that .click()s it.
  yesDeleteButton: (page: Page): Locator => AgentConfigLocators.deleteConfirmDialog(page).getByRole('button', { name: 'Yes, delete' }),
};
