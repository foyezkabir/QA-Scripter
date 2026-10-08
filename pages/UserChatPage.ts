import { expect, type Page } from '@playwright/test';
import { AGENT_SECTIONS, MODEL_OPTIONS, OWN_ASSISTANT, SUGGESTIONS, TIME_FILTER_OPTIONS } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserChatLocators } from '../locators/UserChatLocators';

const REPLY = { timeout: 60_000 };

export class UserChatPage {
  private readonly locators: UserChatLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserChatLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await expect(this.locators.composer).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async typeMessage(text: string) {
    await this.locators.composer.fill(text);
  }

  async clearComposer() {
    await this.locators.composer.fill('');
  }

  async sendMessage(text: string) {
    await this.locators.composer.fill(text);
    await this.locators.sendButton.click();
  }

  async waitForReply() {
    await this.locators.retryButton.waitFor(REPLY);
  }

  async openModelDialog() {
    await this.locators.modelButton.click();
  }

  async openSwitchAgentDialog() {
    await this.locators.switchAgentButton.click();
  }

  async openTimeFilter() {
    await this.locators.timeFilterButton.click();
  }

  async chooseChatsFilter() {
    await this.locators.chatsFilter.click();
  }

  async collapseSidebar() {
    await this.locators.collapseButton.click();
  }

  async expandSidebar() {
    await this.locators.expandButton.click();
  }

  async openPalette() {
    await this.locators.paletteButton.click();
  }

  async openMoreOptionsFor(token: string) {
    const conversation = this.locators.conversationLink(token);
    await conversation.hover();
    await this.locators.moreOptionsFor(conversation).click();
  }

  async clickDeleteChat() {
    await this.locators.deleteChatItem.click();
  }

  async clickKeepIt() {
    await this.locators.keepItButton.click();
  }

  async clickYesDelete() {
    await this.locators.yesDeleteButton.click();
  }

  async deleteAutomationChats() {
    await this.open();
    const marked = await this.locators.automationConversations.count();
    for (let remaining = marked; remaining > 0; remaining--) {
      const conversation = this.locators.automationConversations.first();
      await conversation.hover();
      await this.locators.moreOptionsFor(conversation).click();
      await this.clickDeleteChat();
      await this.clickYesDelete();
      await this.locators.deleteDialog.waitFor({ state: 'hidden' });
    }
  }

  async expectStartScreen(firstName: string) {
    await expect(this.locators.greeting(firstName)).toBeVisible();
    await expect(this.locators.prompt(OWN_ASSISTANT.name)).toBeVisible();
    await expect(this.locators.composer).toBeVisible();
    await expect(this.locators.attachButton).toBeVisible();
    await expect(this.locators.modelButton).toBeVisible();
    await expect(this.locators.speechButton).toBeVisible();
    await expect(this.locators.sendButton).toBeVisible();
    await expect(this.locators.searchBox).toBeVisible();
    await expect(this.locators.composerHint).toBeVisible();
  }

  async expectSendIsDisabled() {
    await expect(this.locators.sendButton).toBeDisabled();
  }

  async expectSendIsEnabled() {
    await expect(this.locators.sendButton).toBeEnabled();
  }

  async expectSuggestions() {
    for (const suggestion of SUGGESTIONS) {
      await expect(this.page.getByRole('button', { name: suggestion })).toBeVisible();
    }
  }

  async expectAgentSections() {
    for (const sectionName of AGENT_SECTIONS) {
      await expect(this.locators.sectionLink(sectionName)).toBeVisible();
    }
  }

  async expectModelDialog() {
    await expect(this.locators.modelDialog).toBeVisible();
    await expect(this.locators.modelSwitchNote).toBeVisible();
    for (const optionName of MODEL_OPTIONS) {
      await expect(this.locators.modelOption(optionName)).toBeVisible();
    }
  }

  async expectSwitchAgentDialog() {
    await expect(this.locators.switchAgentDialog).toBeVisible();
    await expect(this.locators.assistantOption(OWN_ASSISTANT.name)).toBeVisible();
    await expect(this.locators.teamSpacesText).toBeVisible();
  }

  async expectTimeFilterOptions() {
    for (const optionName of TIME_FILTER_OPTIONS) {
      await expect(this.locators.timeFilterOption(optionName)).toBeVisible();
    }
  }

  async expectAllFilterIsPressedByDefault() {
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'true');
  }

  async expectChatsFilterIsPressed() {
    await expect(this.locators.chatsFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'false');
  }

  async expectSidebarIsCollapsed() {
    await expect(this.locators.expandButton).toBeVisible();
    await expect(this.locators.collapseButton).toBeHidden();
  }

  async expectSidebarIsExpanded() {
    await expect(this.locators.collapseButton).toBeVisible();
    await expect(this.locators.expandButton).toBeHidden();
  }

  async expectPaletteIsOpen() {
    await expect(this.locators.paletteDialog).toBeVisible();
  }

  async expectMessageWasAnswered(text: string, token: string) {
    await expect(this.locators.userMessage(text)).toBeVisible();
    await expect(this.locators.retryButton).toBeVisible(REPLY);
    await expect(this.locators.conversationLink(token)).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/[0-9a-f-]+$`));
  }

  async expectMessageAndReplyActions() {
    await expect(this.locators.copyButtons).toHaveCount(2);
    await expect(this.locators.editButton).toBeVisible();
    await expect(this.locators.regenerateButton).toBeVisible();
    await expect(this.locators.retryButton).toBeVisible();
    await expect(this.locators.readAloudButton).toBeVisible();
    await expect(this.locators.likeButton).toBeVisible();
    await expect(this.locators.unlikeButton).toBeVisible();
  }

  async expectMoreOptionsMenu() {
    await expect(this.locators.renameItem).toBeVisible();
    await expect(this.locators.pinItem).toBeVisible();
    await expect(this.locators.moveToProjectItem).toBeVisible();
    await expect(this.locators.deleteChatItem).toBeVisible();
  }

  async expectDeleteConfirmation() {
    await expect(this.locators.deleteDialog).toBeVisible();
    await expect(this.locators.deleteWarning).toBeVisible();
    await expect(this.locators.keepItButton).toBeVisible();
    await expect(this.locators.yesDeleteButton).toBeVisible();
  }

  async expectConversationIsKept(token: string) {
    await expect(this.locators.deleteDialog).toBeHidden();
    await expect(this.locators.conversationLink(token)).toBeVisible();
  }

  async expectConversationIsGone(token: string) {
    await expect(this.locators.deleteDialog).toBeHidden();
    await expect(this.locators.conversationLink(token)).toHaveCount(0);
  }
}
