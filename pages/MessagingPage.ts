import { Page, Locator } from '@playwright/test';
import { MessagingLocators } from '../locators/MessagingLocators';

export class MessagingPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/messaging`);
  }

  async toggleChannel(channelName: string): Promise<void> {
    await MessagingLocators.channelToggle(this.page, channelName).click();
  }

  async fillTeamsFields(fields: { appId?: string; tenantId?: string; appPassword?: string }): Promise<void> {
    if (fields.appId !== undefined) await MessagingLocators.teamsAppIdInput(this.page).fill(fields.appId);
    if (fields.tenantId !== undefined) await MessagingLocators.teamsTenantIdInput(this.page).fill(fields.tenantId);
    if (fields.appPassword !== undefined) await MessagingLocators.teamsAppPasswordInput(this.page).fill(fields.appPassword);
  }

  async submitTeamsConnect(): Promise<void> {
    await MessagingLocators.teamsConnectButton(this.page).click();
  }

  async submitTeamsDisconnect(): Promise<void> {
    await MessagingLocators.teamsDisconnectButton(this.page).click();
  }

  async clickCopyMessagingEndpoint(): Promise<void> {
    await MessagingLocators.copyMessagingEndpointButton(this.page).click();
  }

  /** Disconnects Teams if it currently shows Connected or Failed; no-op if already Disconnected. For fixture teardown only. */
  async disconnectTeamsIfConnected(): Promise<void> {
    const disconnected = await MessagingLocators.channelStatus(this.page, 'Microsoft Teams', 'Disconnected').count();
    if (disconnected > 0) return;
    await MessagingLocators.teamsDisconnectButton(this.page).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  channelStatusLocator(channelName: string, status: 'Connected' | 'Disconnected' | 'Failed'): Locator {
    return MessagingLocators.channelStatus(this.page, channelName, status);
  }

  teamsConnectButtonLocator(): Locator {
    return MessagingLocators.teamsConnectButton(this.page);
  }

  telegramBotTokenInputLocator(): Locator {
    return MessagingLocators.telegramBotTokenInput(this.page);
  }

  teamsAppPasswordInputLocator(): Locator {
    return MessagingLocators.teamsAppPasswordInput(this.page);
  }

  whatsAppPairedTextLocator(): Locator {
    return MessagingLocators.whatsAppPairedText(this.page);
  }
}
