import { test } from '../fixtures/base';
import { TOOL_SEARCH } from '../datas/user/UserData';

test('TC-01: Verify that the Tools page shows its heading, intro, views and search', { tag: ['@smoke'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.expectToolsPage();
});

test('TC-02: Verify that the seven tool categories are listed', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.expectCategories();
});

test('TC-03: Verify that the whole tool catalog is shown by name', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.expectToolCatalog();
});

test('TC-04: Verify that a tool card has a permission group with exactly one choice pressed', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.expectPermissionGroups();
});

test('TC-05: Verify that tools that are not connected offer a Connect button', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.expectConnectButtons();
});

test('TC-06: Verify that a Connection error opens a popover explaining the failed sign-in', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.openConnectionError();
  await userToolsPage.expectConnectionErrorPopover();
});

test('TC-07: Verify that a category header hides its tools and shows them again', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.toggleCategory('Google Workspace');
  await userToolsPage.expectCategoryIsCollapsed('Gmail');
  await userToolsPage.toggleCategory('Google Workspace');
  await userToolsPage.expectToolIsShown('Gmail');
});

test('TC-08: Verify that searching for part of a tool name keeps only the matching tool', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.searchFor(TOOL_SEARCH.partName);
  await userToolsPage.expectOnlyMatchingTool();
});

test('TC-09: Verify that a search with no match says nothing matches', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.searchFor(TOOL_SEARCH.nothing);
  await userToolsPage.expectNothingMatches(TOOL_SEARCH.nothing);
});

test('TC-10: Verify that Connected shows its search, Sync and the connected tools with Manage', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.openConnected();
  await userToolsPage.expectConnectedView();
});

test('TC-11: Verify that Sync is disabled while it runs and enabled again afterwards', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.openConnected();
  await userToolsPage.clickSync();
  await userToolsPage.expectSyncRuns();
});

test('TC-12: Verify that Manage on a connected tool offers Reauthenticate and Disconnect', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.open();
  await userToolsPage.openConnected();
  await userToolsPage.openFirstManageMenu();
  await userToolsPage.expectManageMenu();
});

test('TC-13: Verify that the Tools link in Agent sections opens the Tools page', { tag: ['@regression'] }, async ({ userToolsPage }) => {
  await userToolsPage.openFromChat();
  await userToolsPage.expectToolsUrl();
});
