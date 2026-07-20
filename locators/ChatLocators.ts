import { Page, Locator } from '@playwright/test';

export const ChatLocators = {
  // Dashboard agent card - same "div.bg-card" pattern confirmed live as the Tasks module
  // (no ARIA role/data-testid on the card wrapper).
  agentCard: (page: Page, agentName: string): Locator =>
    page.locator('div.bg-card').filter({ has: page.getByRole('heading', { name: agentName, exact: true, level: 3 }) }),
  activateButton: (card: Locator): Locator => card.getByRole('button', { name: 'Activate & Chat' }),
  openChatButton: (card: Locator): Locator => card.getByRole('button', { name: 'Open chat' }),
  bootingButton: (card: Locator): Locator => card.getByRole('button', { name: 'Agent is booting' }),
  reloadAgentButton: (card: Locator): Locator => card.getByRole('button', { name: 'Reload agent' }),
  stopAgentButton: (card: Locator): Locator => card.getByRole('button', { name: 'Stop agent' }),
  activateAndChatButton: (card: Locator): Locator => card.getByRole('button', { name: 'Activate & Chat' }),
  statusBadge: (card: Locator, status: 'Active' | 'Inactive'): Locator => card.getByText(status, { exact: true }),

  // Composer / chat surface
  // "Agent is getting ready…" observed live as a third, transient placeholder distinct from the
  // cold-start "Agent is starting up…" - the agent can flicker back into a not-ready state even
  // after the dashboard reported it Active (see findings/chat.txt).
  messageInput: (page: Page): Locator =>
    page.getByRole('textbox', { name: /Type a message|Agent is starting up|Agent is getting ready/ }),
  sendButton: (page: Page): Locator => page.getByRole('button', { name: 'Send message' }),
  stopGeneratingButton: (page: Page): Locator => page.getByRole('button', { name: 'Stop generating' }),
  addFilesButton: (page: Page): Locator => page.getByRole('button', { name: 'Add files' }),
  modelSelectorButton: (page: Page): Locator => page.getByRole('button', { name: /\(Direct\)$/ }),
  modelMenuOption: (page: Page, modelName: string): Locator => page.getByRole('button', { name: modelName, exact: true }),
  suggestionChip: (page: Page, text: string): Locator => page.getByRole('button', { name: text, exact: true }),

  // Sidebar conversation list
  newChatButton: (page: Page): Locator => page.getByRole('button', { name: 'New Chat' }),
  conversationLink: (page: Page, title: string): Locator => page.getByRole('link', { name: title, exact: true }),
  // Long messages are confirmed live to render truncated with an ellipsis in the sidebar (e.g.
  // "Pull my Jira tickets for VOPS by status (Ready for QA, In…") - matching by conversation id
  // (the URL's last path segment) is the only way to reliably re-find a just-created row
  // regardless of title length. CSS attribute selector is the last resort here since there's no
  // role/testid to anchor to and the href itself is the one stable, non-truncated identifier.
  conversationLinkById: (page: Page, convId: string): Locator => page.locator(`a[href$="${convId}"]`),
  // Link and "More options" are confirmed live to be direct siblings under one row <div> with no
  // distinguishing class/role - XPath immediate-parent traversal (one tier above CSS) is the
  // precise, minimal-scope way to reach the sibling button from the link.
  conversationMoreOptions: (page: Page, title: string): Locator =>
    page.getByRole('link', { name: title, exact: true }).locator('xpath=..').getByRole('button', { name: 'More options' }),
  conversationMoreOptionsById: (page: Page, convId: string): Locator =>
    page.locator(`a[href$="${convId}"]`).locator('xpath=..').getByRole('button', { name: 'More options' }),
  // The rename textbox has no accessible name (confirmed live) and replaces the link in place -
  // scoped to the sidebar landmark so it can't match the named "Search in chat" textbox.
  conversationRenameInput: (page: Page): Locator => page.getByRole('complementary').getByRole('textbox', { name: '' }),
  kebabMenu: (page: Page): Locator => page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'Rename' }) }),
  renameOption: (page: Page): Locator => page.getByRole('button', { name: 'Rename' }),
  pinOption: (page: Page): Locator => page.getByRole('button', { name: 'Pin' }),
  deleteChatOption: (page: Page): Locator => page.getByRole('button', { name: 'Delete chat' }),

  // Delete confirmation dialog
  deleteChatDialogHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Delete chat?' }),
  deleteChatCancelButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Cancel' }),
  deleteChatConfirmButton: (page: Page): Locator => page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }),

  // Message content
  assistantMessageActions: (page: Page): Locator => page.getByRole('button', { name: 'Read aloud' }),
  userMessageActions: (page: Page): Locator => page.getByRole('button', { name: 'Regenerate response' }),
};
