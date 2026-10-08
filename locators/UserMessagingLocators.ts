import type { Locator, Page } from '@playwright/test';

export class UserMessagingLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Messaging', level: 1 });
  pageDescription = this.page.getByText('Talk to your agent from anywhere. Connect a channel to start sending and receiving messages.');
  connectedChannelsHeading = this.page.getByRole('heading', { name: 'Connected channels', level: 3 });
  modelPerChannelHeading = this.page.getByRole('heading', { name: 'Model per channel', level: 3 });

  whatsAppDescription = this.page.getByText('Receive and respond to customer messages via your own WhatsApp number.');
  telegramDescription = this.page.getByText('Chat with customers via Telegram bot.');
  teamsDescription = this.page.getByText('Receive @-mentions and DMs via a registered Azure Bot (Bot Framework).');
  slackDescription = this.page.getByText('Receive @-mentions and DMs via a Slack app in Socket Mode.');

  connectedStatuses = this.page.getByText(/^Connected( @\S+)?$/);
  disconnectedStatuses = this.page.getByText('Disconnected', { exact: true });
  disconnectButtons = this.page.getByRole('button', { name: 'Disconnect', exact: true });

  channelSwitches = this.page.getByRole('switch');
  checkedSwitches = this.page.getByRole('switch', { checked: true });
  uncheckedSwitches = this.page.getByRole('switch', { checked: false });

  telegramBotToken = this.page.getByRole('textbox', { name: 'Bot token', exact: true });
  telegramAllowedUsers = this.page.getByRole('textbox', { name: 'Allowed Telegram user IDs (comma-separated)' });
  telegramHint = this.page.getByText('Numeric Telegram user IDs only - the bot ignores everyone else. Leave empty to lock to you automatically once you first message the bot.');

  slackBotToken = this.page.getByRole('textbox', { name: 'Bot token (xoxb-…)' });
  slackAppToken = this.page.getByRole('textbox', { name: 'App-level token (xapp-…)' });
  slackAllowedUsers = this.page.getByRole('textbox', { name: 'Allowed Slack user IDs (comma-separated)' });
  slackHint = this.page.getByText('Slack user IDs only - the bot ignores everyone else. Leave empty to lock to you automatically once you first message the bot.');
  slackSetupInstructions = this.page.getByText(/Create a .* with Socket Mode enabled\./);
  slackAppLink = this.page.getByRole('link', { name: 'Slack app' });

  modelSectionDescription = this.page.getByText(/^Each channel replies on a fast model by default/);
  modelSelects = this.page.getByRole('combobox');
  slowerRepliesHint = this.page.getByText('slower replies', { exact: true });

  modelOption(optionName: string): Locator {
    return this.page.getByRole('option', { name: optionName, exact: true });
  }

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  messagingLink = this.agentSections.getByRole('link', { name: 'Messaging', exact: true });
}
