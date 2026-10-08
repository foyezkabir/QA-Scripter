import type { Locator, Page } from '@playwright/test';

export class UserChatLocators {
  constructor(private readonly page: Page) {}

  greeting(firstName: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(`^Good (morning|afternoon|evening), ${firstName}$`), level: 1 });
  }

  prompt(assistantName: string): Locator {
    return this.page.getByText(`What would you like ${assistantName} to help you with today?`);
  }

  composer = this.page.getByRole('textbox', { name: 'Type a message…' });
  sendButton = this.page.getByRole('button', { name: 'Send message' });
  attachButton = this.page.getByRole('button', { name: 'Add attachments' });
  speechButton = this.page.getByRole('button', { name: 'Speech to text' });
  modelButton = this.page.getByRole('button', { name: /^(Primary|Coder|Fast)$/ });
  composerHint = this.page.getByText(/Enter to send, Shift\+Enter for new line/);

  whatCanYouDoSuggestion = this.page.getByRole('button', { name: 'What can you do for me?' });
  projectsSuggestion = this.page.getByRole('button', { name: 'How are my projects performing?' });
  emailSuggestion = this.page.getByRole('button', { name: 'Draft an email to a client' });

  sidebar = this.page.getByRole('complementary');
  searchBox = this.sidebar.getByRole('textbox', { name: 'Search in chat' });
  collapseButton = this.sidebar.getByRole('button', { name: 'Collapse sidebar' });
  expandButton = this.sidebar.getByRole('button', { name: /^Expand sidebar/ });
  paletteButton = this.sidebar.getByRole('button', { name: /^Open command palette/ });
  filterGroup = this.sidebar.getByRole('group', { name: 'Filter sidebar' });
  allFilter = this.filterGroup.getByRole('button', { name: 'All', exact: true });
  chatsFilter = this.filterGroup.getByRole('button', { name: 'Chats', exact: true });
  timeFilterButton = this.sidebar.getByRole('button', { name: 'Filter chats by time' });
  switchAgentButton = this.sidebar.getByRole('button', { name: 'Switch agent' });

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });

  sectionLink(sectionName: string): Locator {
    return this.agentSections.getByRole('link', { name: sectionName, exact: true });
  }

  modelDialog = this.page.getByRole('dialog').filter({ hasText: 'Agent model (applies to all conversations)' });
  modelSwitchNote = this.modelDialog.getByText('Switching will briefly reload the agent.');

  modelOption(optionName: string): Locator {
    return this.modelDialog.getByRole('button', { name: new RegExp(`^${optionName}`) });
  }

  switchAgentDialog = this.page.getByRole('dialog').filter({ hasText: 'Switch Agent' });
  teamSpacesText = this.switchAgentDialog.getByText('Team Spaces', { exact: true });

  assistantOption(assistantName: string): Locator {
    return this.switchAgentDialog.getByRole('button', { name: new RegExp(`^${assistantName} `) });
  }

  timeFilterDialog = this.page.getByRole('dialog').filter({ has: this.page.getByRole('button', { name: 'Pick a date' }) });

  timeFilterOption(optionName: string): Locator {
    return this.timeFilterDialog.getByRole('button', { name: optionName, exact: true });
  }

  paletteDialog = this.page.getByRole('dialog', { name: 'Command palette' });

  userMessage(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  copyButtons = this.page.getByRole('button', { name: 'Copy', exact: true });
  editButton = this.page.getByRole('button', { name: 'Edit', exact: true });
  regenerateButton = this.page.getByRole('button', { name: 'Regenerate response' });
  retryButton = this.page.getByRole('button', { name: 'Retry', exact: true });
  readAloudButton = this.page.getByRole('button', { name: 'Read aloud' });
  likeButton = this.page.getByRole('button', { name: 'Like', exact: true });
  unlikeButton = this.page.getByRole('button', { name: 'Unlike', exact: true });

  conversationLink(token: string): Locator {
    return this.sidebar.getByRole('link').filter({ hasText: token });
  }

  automationConversations = this.sidebar.getByRole('link').filter({ hasText: 'QA-AUTO' });

  moreOptionsFor(conversation: Locator): Locator {
    // the More options button is a sibling of the conversation link, so step up to their shared row
    return conversation.locator('..').getByRole('button', { name: 'More options' });
  }

  moreOptionsMenu = this.page.getByRole('dialog').filter({ has: this.page.getByRole('button', { name: 'Delete chat' }) });
  renameItem = this.moreOptionsMenu.getByRole('button', { name: 'Rename' });
  pinItem = this.moreOptionsMenu.getByRole('button', { name: 'Pin' });
  moveToProjectItem = this.moreOptionsMenu.getByRole('button', { name: 'Move to project' });
  deleteChatItem = this.moreOptionsMenu.getByRole('button', { name: 'Delete chat' });

  deleteDialog = this.page.getByRole('dialog', { name: 'Delete this chat?' });
  deleteWarning = this.deleteDialog.getByText('This will permanently remove this conversation and all its messages.');
  keepItButton = this.deleteDialog.getByRole('button', { name: 'Keep it' });
  yesDeleteButton = this.deleteDialog.getByRole('button', { name: 'Yes, delete' });
}
