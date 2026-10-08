import { test } from '../fixtures/base';
import { OWN_ASSISTANT, SIGNED_IN_USER } from '../datas/user/UserData';

test('TC-01: Verify that the sidebar shows the logo, Home, My work, Search, Notifications, Settings and Account', { tag: ['@smoke'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.expectSidebarLists();
});

test('TC-02: Verify that the sidebar lists the assistant as a link', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.expectSidebarListsAssistant(OWN_ASSISTANT.name);
});

test('TC-03: Verify that the Home link opens the dashboard', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.clickHome();
  await userShellPage.expectUrlMatches(/\/dashboard$/);
});

test('TC-04: Verify that the My work link opens the my work page', { tag: ['@critical'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.clickMyWork();
  await userShellPage.expectUrlMatches(/\/dashboard\/my-work$/);
});

test('TC-05: Verify that the assistant link opens that assistant\'s chat', { tag: ['@critical'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.clickAssistant(OWN_ASSISTANT.name);
  await userShellPage.expectUrlMatches(/\/chat\/[0-9a-f-]+$/);
});

test('TC-06: Verify that Search opens the command palette with its search box and tabs', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPalette();
  await userShellPage.expectPaletteIsOpenWithTabs();
});

test('TC-07: Verify that the palette quick actions are listed and disabled on the home page', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPalette();
  await userShellPage.expectQuickActionsAreDisabled();
});

test('TC-08: Verify that choosing the Chats tab selects it', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPalette();
  await userShellPage.chooseTab('Chats');
  await userShellPage.expectTabIsSelected('Chats');
});

test('TC-09: Verify that Escape closes the command palette', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPalette();
  await userShellPage.closePaletteWithEscape();
  await userShellPage.expectPaletteIsClosed();
});

test('TC-10: Verify that Ctrl+K opens the command palette', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPaletteWithShortcut();
  await userShellPage.expectPaletteIsOpen();
});

test('TC-11: Verify that the Close command palette button closes it', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openPalette();
  await userShellPage.clickClosePalette();
  await userShellPage.expectPaletteIsClosed();
});

test('TC-12: Verify that the Notifications panel opens with the All filter selected', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openNotifications();
  await userShellPage.expectNotificationsShowAll();
});

test('TC-13: Verify that choosing Unread selects it in the Notifications panel', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openNotifications();
  await userShellPage.chooseUnread();
  await userShellPage.expectUnreadIsSelected();
});

test('TC-14: Verify that Settings opens with its six sections', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openSettings();
  await userShellPage.expectSettingsSections();
});

test('TC-15: Verify that Escape closes the Settings dialog', { tag: ['@regression'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openSettings();
  await userShellPage.closeSettingsWithEscape();
  await userShellPage.expectSettingsIsClosed();
});

test('TC-16: Verify that the Account menu shows the signed-in user and its items', { tag: ['@critical'] }, async ({ userShellPage }) => {
  await userShellPage.open();
  await userShellPage.openAccountMenu();
  await userShellPage.expectAccountMenuShowsUserAndItems(SIGNED_IN_USER.fullName, SIGNED_IN_USER.email);
});
