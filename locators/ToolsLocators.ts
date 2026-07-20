import { Page, Locator } from '@playwright/test';

export const ToolsLocators = {
  pageHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Tools', level: 1 }),

  // Tile cards have no individual role/data-testid (confirmed live via DOM inspection) - they're
  // a flat sibling set of `div.rounded-2xl.border.bg-card` (same last-resort CSS-class pattern
  // already used for Tasks/Projects cards in this repo). Filtering by the tool's own icon (a real
  // semantic locator) picks the one specific tile - context-based disambiguation, not position.
  // `.group` is required to exclude the outer "Available Tools" section wrapper, which shares
  // the same rounded-2xl/border/bg-card classes as each individual tile (confirmed live).
  tile: (page: Page, toolName: string): Locator =>
    page.locator('div.group.rounded-2xl.border.bg-card').filter({ has: page.getByRole('img', { name: toolName, exact: true }) }),

  connectButton: (page: Page, toolName: string): Locator =>
    ToolsLocators.tile(page, toolName).getByRole('button', { name: 'Connect' }),

  tryAgainButton: (page: Page, toolName: string): Locator =>
    ToolsLocators.tile(page, toolName).getByRole('button', { name: 'Try again' }),

  connectedStatus: (page: Page, toolName: string): Locator =>
    ToolsLocators.tile(page, toolName).getByText('Connected', { exact: true }),

  unfinishedSignInNote: (page: Page, toolName: string): Locator =>
    ToolsLocators.tile(page, toolName).getByText('A previous sign-in attempt was left unfinished. Click Try again to retry.'),
};
