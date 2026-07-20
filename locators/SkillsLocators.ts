import { Page, Locator } from '@playwright/test';

export const SkillsLocators = {
  browseTab: (page: Page): Locator => page.getByRole('button', { name: 'Browse' }),
  installedTab: (page: Page): Locator => page.getByRole('button', { name: /^Installed \(\d+\)$/ }),
  searchInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Search skills...' }),
  createSkillButton: (page: Page): Locator => page.getByRole('button', { name: 'Create skill' }),
  sourceFilter: (page: Page, label: string): Locator => page.getByRole('button', { name: label }),

  // Browse tab - card wrapper has no stable shared class: installed cards use
  // "border-emerald-300/80 bg-primary-foreground" while not-yet-installed cards use
  // "border-border bg-card" (confirmed live via DOM inspection on both states) - no ARIA role or
  // data-testid either. The one thing both share structurally is that the card div is the
  // "View details" button's immediate parent, so XPath immediate-parent traversal (one tier above
  // CSS) is the only selector stable across both install states.
  viewDetailsButton: (page: Page, skillName: string): Locator => page.getByRole('button', { name: `View details for ${skillName}` }),
  card: (page: Page, skillName: string): Locator => SkillsLocators.viewDetailsButton(page, skillName).locator('xpath=..'),
  installButton: (page: Page, skillName: string): Locator => SkillsLocators.card(page, skillName).getByRole('button', { name: `Install ${skillName}` }),
  // "Installed on this agent" is exposed only via the HTML title attribute (a tooltip) on a plain
  // <span> with no text content, role, or aria-label - confirmed live via DOM inspection. A CSS
  // attribute selector on title is the only way to reach it; last resort, justified since no
  // semantic alternative exists.
  installedBadge: (page: Page, skillName: string): Locator =>
    SkillsLocators.card(page, skillName).locator('[title="Installed on this agent"]'),

  // Installed tab - flat rows, direct Uninstall button, no confirmation dialog (confirmed live)
  installedRow: (page: Page, skillName: string): Locator => page.getByRole('button', { name: new RegExp(`^${skillName} `) }),
  uninstallButton: (page: Page, skillName: string): Locator =>
    SkillsLocators.installedRow(page, skillName).locator('xpath=..').getByRole('button', { name: 'Uninstall' }),

  // Detail modal - confirmed live it has NO role="dialog" anywhere in its container chain (plain
  // fixed-position divs), unlike Create Task/Project modals which do - a real accessibility gap
  // (see findings/skills.txt). The level-3 heading already disambiguates from the card's own
  // level-4 heading of the same name, so no extra scoping is required for the heading; the
  // buttons are scoped structurally via the fixed-position modal container class as the only
  // available signal (CSS, last resort, justified by the absence of any semantic role).
  detailModal: (page: Page): Locator => page.locator('div.fixed.inset-x-4'),
  detailDialogHeading: (page: Page, skillName: string): Locator => page.getByRole('heading', { name: skillName, exact: true, level: 3 }),
  detailCloseButton: (page: Page): Locator => SkillsLocators.detailModal(page).getByRole('button', { name: 'Close' }).first(),
  detailRemoveButton: (page: Page): Locator => SkillsLocators.detailModal(page).getByRole('button', { name: 'Remove' }),
  detailInstallButton: (page: Page): Locator => SkillsLocators.detailModal(page).getByRole('button', { name: /^Install /}),

  // Create Skill dialog
  createDialogHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Create Skill' }),
  skillNameInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: /Weekly status report/ }),
  categoryInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: 'custom' }),
  whenToUseInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: /Use this skill when/ }),
  instructionsInput: (page: Page): Locator => page.getByRole('dialog').getByRole('textbox', { name: /Step-by-step guidance/ }),
  createSkillSubmitButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Create Skill' }),
  cancelButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
};
