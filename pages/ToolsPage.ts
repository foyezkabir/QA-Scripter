import { Page } from '@playwright/test';
import { ToolsLocators } from '../locators/ToolsLocators';

export class ToolsPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/tools`);
  }

  /**
   * Clicks Connect on the named (currently Not Connected) tool tile, waits for the resulting
   * OAuth popup to open, then closes ONLY that popup (never the main page) before sign-in
   * completes. Returns once the popup is closed.
   */
  async connectAndAbortPopup(toolName: string): Promise<void> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      ToolsLocators.connectButton(this.page, toolName).click(),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.close();
  }

  // --- State getters (no assertions - specs assert on these) ---

  connectButtonLocator(toolName: string) {
    return ToolsLocators.connectButton(this.page, toolName);
  }

  tryAgainButtonLocator(toolName: string) {
    return ToolsLocators.tryAgainButton(this.page, toolName);
  }

  unfinishedSignInNoteLocator(toolName: string) {
    return ToolsLocators.unfinishedSignInNote(this.page, toolName);
  }
}
