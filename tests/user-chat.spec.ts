import { test } from '../fixtures/base';
import { newChatMessage, SIGNED_IN_USER, TYPED_TEXT } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that a fresh assistant chat shows its greeting, composer and sidebar search', { tag: ['@smoke'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.expectStartScreen(SIGNED_IN_USER.firstName);
});

test('TC-02: Verify that Send is disabled while the composer is empty and enabled once text is typed', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.expectSendIsDisabled();
  await userChatPage.typeMessage(TYPED_TEXT);
  await userChatPage.expectSendIsEnabled();
  await userChatPage.clearComposer();
  await userChatPage.expectSendIsDisabled();
});

test('TC-03: Verify that the three suggestions are offered', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.expectSuggestions();
});

test('TC-04: Verify that the agent section links are shown', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.expectAgentSections();
});

test('TC-05: Verify that the model button opens the agent model dialog', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.openModelDialog();
  await userChatPage.expectModelDialog();
});

test('TC-06: Verify that Switch agent lists the assistants and team spaces', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.openSwitchAgentDialog();
  await userChatPage.expectSwitchAgentDialog();
});

test('TC-07: Verify that the time filter offers Recent, All chats and Pick a date', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.openTimeFilter();
  await userChatPage.expectTimeFilterOptions();
});

test('TC-08: Verify that the sidebar filter is All by default and choosing Chats presses it', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.expectAllFilterIsPressedByDefault();
  await userChatPage.chooseChatsFilter();
  await userChatPage.expectChatsFilterIsPressed();
});

test('TC-09: Verify that collapsing and expanding the sidebar swaps its toggle button', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.collapseSidebar();
  await userChatPage.expectSidebarIsCollapsed();
  await userChatPage.expandSidebar();
  await userChatPage.expectSidebarIsExpanded();
});

test('TC-10: Verify that the command palette button opens the command palette', { tag: ['@regression'] }, async ({ userChatPage }) => {
  await userChatPage.open();
  await userChatPage.openPalette();
  await userChatPage.expectPaletteIsOpen();
});

test('TC-11: Verify that a sent message is answered and its conversation is listed', { tag: ['@critical'] }, async ({ chatCleanup, userChatPage }) => {
  const message = newChatMessage();
  await userChatPage.open();
  await userChatPage.sendMessage(message.text);
  await userChatPage.expectMessageWasAnswered(message.text, message.token);
});

test('TC-12: Verify that an answered message and reply offer their action buttons', { tag: ['@regression'] }, async ({ sentChat, userChatPage }) => {
  await userChatPage.expectMessageAndReplyActions();
});

test('TC-13: Verify that More options on a conversation offers Rename, Pin, Move to project and Delete chat', { tag: ['@regression'] }, async ({ sentChat, userChatPage }) => {
  await userChatPage.openMoreOptionsFor(sentChat.token);
  await userChatPage.expectMoreOptionsMenu();
});

test('TC-14: Verify that Keep it in the delete confirmation leaves the conversation in place', { tag: ['@regression'] }, async ({ sentChat, userChatPage }) => {
  await userChatPage.openMoreOptionsFor(sentChat.token);
  await userChatPage.clickDeleteChat();
  await userChatPage.expectDeleteConfirmation();
  await userChatPage.clickKeepIt();
  await userChatPage.expectConversationIsKept(sentChat.token);
});

test('TC-15: Verify that Yes, delete removes the conversation from the sidebar', { tag: ['@critical'] }, async ({ sentChat, userChatPage }) => {
  await userChatPage.openMoreOptionsFor(sentChat.token);
  await userChatPage.clickDeleteChat();
  await userChatPage.clickYesDelete();
  await userChatPage.expectConversationIsGone(sentChat.token);
});
