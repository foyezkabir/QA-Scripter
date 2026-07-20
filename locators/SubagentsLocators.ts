import { Page, Locator } from '@playwright/test';

export const SubagentsLocators = {
  searchInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Search subagents…' }),

  // The top "Create Subagent" button and the empty-state's own "Create Subagent" button can both
  // exist at once (confirmed live in the zero-results/no-match state) - same accessible name, two
  // instances. Scope to the one that's a sibling of the page's H1 wrapper via structural XPath
  // (no stable class/role distinguishes them; chaining off the H1 is the least-fragile option).
  newSubagentButton: (page: Page): Locator =>
    page.getByRole('heading', { name: 'Subagents', level: 1 }).locator('xpath=../following-sibling::button[1]'),

  emptyStateHeading: (page: Page): Locator => page.getByRole('heading', { name: 'No subagents yet', level: 2 }),
  noMatchesHeading: (page: Page): Locator => page.getByRole('heading', { name: 'No matches', level: 2 }),

  subagentHeading: (page: Page, name: string): Locator => page.getByRole('heading', { name, level: 3 }),

  // No stable class/role wraps a card's action row (confirmed live via DOM inspection) - it is the
  // heading's immediate following sibling, so XPath sibling traversal from the heading is the only
  // way to scope Details/Edit/Delete/toggle to THIS subagent's row without touching another card's.
  actionsRow: (page: Page, name: string): Locator =>
    SubagentsLocators.subagentHeading(page, name).locator('xpath=following-sibling::*[1]'),
  detailsButton: (page: Page, name: string): Locator =>
    SubagentsLocators.actionsRow(page, name).getByRole('button', { name: 'Details' }),
  editButton: (page: Page, name: string): Locator =>
    SubagentsLocators.actionsRow(page, name).getByRole('button', { name: 'Edit' }),
  deleteButton: (page: Page, name: string): Locator =>
    SubagentsLocators.actionsRow(page, name).getByRole('button', { name: 'Delete' }),
  // Accessible name flips between "Disable" (checked=enabled) and "Enable" (unchecked=disabled) -
  // confirmed live via PATCH payload inspection, so no name filter here (it would break after toggling).
  toggleSwitch: (page: Page, name: string): Locator => SubagentsLocators.actionsRow(page, name).getByRole('switch'),

  // Whole card (heading + actions row + description) - two levels up from the heading (confirmed
  // via live DOM walk). Used only for existence/count checks, never for scoping actions (use
  // actionsRow for that - it is closer and avoids picking up an unrelated sibling card).
  card: (page: Page, name: string): Locator => SubagentsLocators.subagentHeading(page, name).locator('xpath=ancestor::*[2]'),

  // Create/Edit dialog (shared field set)
  nameInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Name' }),
  descriptionInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Description' }),
  instructionsInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'Instructions' }),
  createButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Create' }),
  saveChangesButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Save Changes' }),
  cancelButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
  closeButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Close' }),

  createDialogHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Create Subagent' }),
  editDialogHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Edit Subagent' }),

  // Details modal
  detailsModalHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Subagent Details' }),
  detailsModalStatus: (page: Page): Locator => page.getByRole('dialog').getByText('Active', { exact: true }),
  recentActivityHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Recent activity' }),

  // Delete confirmation
  deleteDialogHeading: (page: Page, name: string): Locator => page.getByRole('heading', { name: `Delete ${name}?` }),
  keepItButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Keep it' }),
  yesDeleteButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Yes, delete' }),
};
