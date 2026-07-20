import { Page, Locator } from '@playwright/test';

export const MessagingLocators = {
  // Each channel's name is a plain <p>, not a heading, and the toggle switch has no accessible name
  // of its own (confirmed live via DOM inspection) - so every action within a card is scoped from
  // this name paragraph via structural XPath. Verified live (browser_evaluate against the actual
  // DOM): ancestor::*[4] is the true card root (name+icon wrapper -> header row -> status row ->
  // card) - it's the shallowest ancestor whose textContent includes the status label AND the
  // expanded panel's fields/buttons; ancestor::*[2]/[3] only reach inner wrapper divs.
  channelCard: (page: Page, channelName: string): Locator =>
    page.getByText(channelName, { exact: true }).locator('xpath=ancestor::*[4]'),

  channelToggle: (page: Page, channelName: string): Locator =>
    MessagingLocators.channelCard(page, channelName).getByRole('switch'),
  // "Connected", "Disconnected", and "Failed" are exact-matched (not substrings of one another).
  channelStatus: (page: Page, channelName: string, status: 'Connected' | 'Disconnected' | 'Failed'): Locator =>
    MessagingLocators.channelCard(page, channelName).getByText(status, { exact: true }),

  // WhatsApp (permanent, pre-existing - a real number is paired on this shared agent; read-only only)
  whatsAppPairedText: (page: Page): Locator => MessagingLocators.channelCard(page, 'WhatsApp').getByText('Paired', { exact: true }),

  // Telegram (permanent, pre-existing - read-only reference, never disconnect)
  telegramBotTokenInput: (page: Page): Locator => MessagingLocators.channelCard(page, 'Telegram').getByRole('textbox', { name: 'Bot token' }),
  telegramDisconnectButton: (page: Page): Locator => MessagingLocators.channelCard(page, 'Telegram').getByRole('button', { name: 'Disconnect' }),

  // Microsoft Teams (fully connectable/disconnectable via automated test)
  teamsAppIdInput: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('textbox', { name: 'App ID' }),
  teamsTenantIdInput: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('textbox', { name: 'Tenant ID' }),
  teamsAppPasswordInput: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('textbox', { name: 'App password' }),
  teamsConnectButton: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('button', { name: 'Connect' }),
  teamsDisconnectButton: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('button', { name: 'Disconnect' }),
  copyMessagingEndpointButton: (page: Page): Locator => MessagingLocators.channelCard(page, 'Microsoft Teams').getByRole('button', { name: 'Copy messaging endpoint' }),
};
