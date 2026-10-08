import { expect, type Page } from '@playwright/test';
import { CHANNEL_MODEL_OPTIONS, OWN_ASSISTANT } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserMessagingLocators } from '../locators/UserMessagingLocators';

export class UserMessagingPage {
  private readonly locators: UserMessagingLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserMessagingLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/messaging`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.messagingLink.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.pageDescription).toBeVisible();
    await expect(this.locators.connectedChannelsHeading).toBeVisible();
    await expect(this.locators.modelPerChannelHeading).toBeVisible();
  }

  async expectChannelDescriptions() {
    await expect(this.locators.whatsAppDescription).toBeVisible();
    await expect(this.locators.telegramDescription).toBeVisible();
    await expect(this.locators.teamsDescription).toBeVisible();
    await expect(this.locators.slackDescription).toBeVisible();
  }

  async expectTwoChannelsConnected() {
    await expect(this.locators.connectedStatuses).toHaveCount(2);
    await expect(this.locators.disconnectButtons).toHaveCount(2);
  }

  async expectTwoChannelsDisconnected() {
    await expect(this.locators.disconnectedStatuses).toHaveCount(2);
  }

  async expectChannelSwitches() {
    await expect(this.locators.channelSwitches).toHaveCount(4);
    await expect(this.locators.checkedSwitches).toHaveCount(2);
    await expect(this.locators.uncheckedSwitches).toHaveCount(2);
  }

  async expectTelegramFields() {
    await expect(this.locators.telegramBotToken).toBeVisible();
    await expect(this.locators.telegramAllowedUsers).toBeVisible();
    await expect(this.locators.telegramHint).toBeVisible();
  }

  async expectSlackFields() {
    await expect(this.locators.slackBotToken).toBeVisible();
    await expect(this.locators.slackAppToken).toBeVisible();
    await expect(this.locators.slackAllowedUsers).toBeVisible();
    await expect(this.locators.slackHint).toBeVisible();
    await expect(this.locators.slackSetupInstructions).toBeVisible();
    await expect(this.locators.slackAppLink).toBeVisible();
  }

  async expectTokensAreMasked() {
    await expect(this.locators.telegramBotToken).toHaveAttribute('type', 'password');
    await expect(this.locators.slackBotToken).toHaveAttribute('type', 'password');
    await expect(this.locators.slackAppToken).toHaveAttribute('type', 'password');
  }

  async expectModelPerChannel() {
    await expect(this.locators.modelSectionDescription).toBeVisible();
    await expect(this.locators.modelSelects).toHaveCount(2);
    for (const optionName of CHANNEL_MODEL_OPTIONS) {
      await expect(this.locators.modelOption(optionName)).toHaveCount(2);
    }
  }

  async expectSlowerRepliesHint() {
    await expect(this.locators.slowerRepliesHint).toBeVisible();
  }

  async expectMessagingUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/messaging$`));
    await expect(this.locators.heading).toBeVisible();
  }
}
