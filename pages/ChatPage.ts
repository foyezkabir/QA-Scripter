import { Page, Locator } from '@playwright/test';
import { ChatLocators } from '../locators/ChatLocators';

export class ChatPage {
  constructor(private readonly page: Page) {}

  async openDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}`);
  }

  async openConversation(agentId: string, convId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/${convId}`);
  }

  /** Opens a conversation via its sidebar link rather than a direct URL - a direct deep-link was
   * observed live to sometimes silently fall back to the empty agent state during agent flakiness
   * (see findings/chat.txt); clicking the link mirrors how a real user actually navigates. */
  async openConversationViaSidebar(agentId: string, title: string): Promise<void> {
    await this.open(agentId);
    await ChatLocators.conversationLink(this.page, title).click();
  }

  /** Stops the named agent from its dashboard card. */
  async stopAgentFromDashboard(agentName: string): Promise<void> {
    const card = ChatLocators.agentCard(this.page, agentName);
    await ChatLocators.stopAgentButton(card).click();
  }

  /** Re-activates the named agent from its dashboard card (after stopping it). */
  async activateAgentFromDashboard(agentName: string): Promise<void> {
    const card = ChatLocators.agentCard(this.page, agentName);
    await ChatLocators.activateAndChatButton(card).click();
  }

  dashboardStatusBadgeLocator(agentName: string, status: 'Active' | 'Inactive'): Locator {
    const card = ChatLocators.agentCard(this.page, agentName);
    return ChatLocators.statusBadge(card, status);
  }

  /** Activates the agent from the dashboard if currently Inactive, and waits until ready. For fixture setup - not a spec assertion. */
  async ensureAgentActive(agentName: string): Promise<void> {
    await this.openDashboard();
    const card = ChatLocators.agentCard(this.page, agentName);
    const activateButton = ChatLocators.activateButton(card);
    const isInactive = (await activateButton.count()) > 0;
    if (isInactive) {
      await activateButton.click();
      await ChatLocators.openChatButton(card).waitFor({ state: 'visible', timeout: 180_000 });
    } else {
      await ChatLocators.openChatButton(card).waitFor({ state: 'visible', timeout: 180_000 });
    }
  }

  async sendMessage(text: string): Promise<void> {
    // The agent can flicker back to a transient not-ready state even after the dashboard reports
    // it Active (see findings/chat.txt) - wait for a genuinely enabled composer immediately before
    // typing, rather than trusting an earlier ensureAgentActive() check alone.
    const input = ChatLocators.messageInput(this.page);
    await input.waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      (el) => !(el as HTMLTextAreaElement).disabled,
      await input.elementHandle(),
      { timeout: 30_000 },
    );
    await input.fill(text);
    await ChatLocators.sendButton(this.page).click();
  }

  /** Sends a message, waits until the mid-stream state (Stop generating) has been observed at
   * least once - fast replies can otherwise complete between the click resolving and a caller's
   * next await, making the streaming state unobservable from outside this method - and returns
   * whether the composer was disabled at that same moment, for the spec to assert on. */
  async sendMessageAndCaptureStreaming(text: string): Promise<boolean> {
    const input = ChatLocators.messageInput(this.page);
    await input.waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      (el) => !(el as HTMLTextAreaElement).disabled,
      await input.elementHandle(),
      { timeout: 30_000 },
    );
    await input.fill(text);
    // Start polling for the streaming button BEFORE the click resolves, so a reply that completes
    // within milliseconds of the click is still caught mid-poll rather than missed entirely.
    const streamingSeen = ChatLocators.stopGeneratingButton(this.page).waitFor({ state: 'visible', timeout: 15_000 });
    await ChatLocators.sendButton(this.page).click();
    await streamingSeen;
    return input.isDisabled();
  }

  async selectSuggestionChip(text: string): Promise<void> {
    await ChatLocators.suggestionChip(this.page, text).click();
  }

  async waitForReplyComplete(timeoutMs = 60_000): Promise<void> {
    await ChatLocators.assistantMessageActions(this.page).last().waitFor({ state: 'visible', timeout: timeoutMs });
  }

  async openModelMenu(): Promise<void> {
    await ChatLocators.modelSelectorButton(this.page).click();
  }

  async closeModelMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async openConversationMenu(title: string): Promise<void> {
    await ChatLocators.conversationMoreOptions(this.page, title).click();
  }

  async renameConversation(oldTitle: string, newTitle: string): Promise<void> {
    await this.openConversationMenu(oldTitle);
    await ChatLocators.renameOption(this.page).click();
    await ChatLocators.conversationRenameInput(this.page).fill(newTitle);
    await this.page.keyboard.press('Enter');
  }

  async openDeleteConfirm(title: string): Promise<void> {
    await this.openConversationMenu(title);
    await ChatLocators.deleteChatOption(this.page).click();
  }

  async confirmDeleteConversation(): Promise<void> {
    await ChatLocators.deleteChatConfirmButton(this.page).click();
  }

  async cancelDeleteConversation(): Promise<void> {
    await ChatLocators.deleteChatCancelButton(this.page).click();
  }

  /** Deletes the named conversation via the UI if it currently exists; no-op otherwise. For fixture teardown only. */
  async deleteConversationIfExists(title: string): Promise<void> {
    const count = await ChatLocators.conversationLink(this.page, title).count();
    if (count === 0) return;
    await this.openDeleteConfirm(title);
    await this.confirmDeleteConversation();
  }

  /** Same as deleteConversationIfExists but keyed by conversation id - survives sidebar title truncation. */
  async deleteConversationByIdIfExists(convId: string): Promise<void> {
    const count = await ChatLocators.conversationLinkById(this.page, convId).count();
    if (count === 0) return;
    await ChatLocators.conversationMoreOptionsById(this.page, convId).click();
    await ChatLocators.deleteChatOption(this.page).click();
    await this.confirmDeleteConversation();
  }

  /** The current conversation's id, read from the URL - reliable even when the sidebar title is truncated. */
  getCurrentConversationId(): string {
    const segments = new URL(this.page.url()).pathname.split('/');
    return segments[segments.length - 1];
  }

  // --- State getters (no assertions - specs assert on these) ---

  messageInputLocator(): Locator {
    return ChatLocators.messageInput(this.page);
  }

  sendButtonLocator(): Locator {
    return ChatLocators.sendButton(this.page);
  }

  conversationLinkLocator(title: string): Locator {
    return ChatLocators.conversationLink(this.page, title);
  }

  conversationLinkByIdLocator(convId: string): Locator {
    return ChatLocators.conversationLinkById(this.page, convId);
  }

  async getMessageInputPlaceholder(): Promise<string | null> {
    return ChatLocators.messageInput(this.page).getAttribute('placeholder');
  }

  async isMessageInputDisabled(): Promise<boolean> {
    return ChatLocators.messageInput(this.page).isDisabled();
  }

  async isSendButtonDisabled(): Promise<boolean> {
    return ChatLocators.sendButton(this.page).isDisabled();
  }

  deleteChatDialogHeadingLocator(): Locator {
    return ChatLocators.deleteChatDialogHeading(this.page);
  }

  modelMenuOptionLocator(modelName: string): Locator {
    return ChatLocators.modelMenuOption(this.page, modelName);
  }

  stopGeneratingButtonLocator(): Locator {
    return ChatLocators.stopGeneratingButton(this.page);
  }

  /** Full visible transcript text of the current conversation. */
  async getTranscriptText(): Promise<string> {
    // Not every route in this app exposes a <main> landmark (confirmed live on Configuration and
    // this chat route both) - <body> is the one container guaranteed to exist everywhere.
    return this.page.locator('body').innerText();
  }
}
