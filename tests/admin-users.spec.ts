import { test } from '../fixtures/base';
import { noSuchUser, OWN_USER, VALID_ADMIN } from '../datas/admin/AdminData';

test('TC-01: Verify that the users page shows its stat cards, search and status filters', { tag: ['@smoke'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.expectPageIsOpen();
});

test('TC-02: Verify that the live and audit feed notes are shown', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.expectLiveNotes();
});

test('TC-03: Verify that the All users table has its seven columns', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.expectTableColumns();
});

test('TC-04: Verify that searching by email narrows the table to that user and updates the URL', { tag: ['@critical'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.expectOnlyUserRow(OWN_USER.email);
});

test('TC-05: Verify that a search with no match shows the empty state', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(noSuchUser());
  await adminUsersPage.expectNoUsersMatchState();
});

test('TC-06: Verify that Clear filters brings the users back from the empty state', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(noSuchUser());
  await adminUsersPage.expectNoUsersMatchState();
  await adminUsersPage.clickClearFilters();
  await adminUsersPage.expectFiltersCleared();
});

test('TC-07: Verify that the All filter is pressed by default', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.expectAllFilterIsPressedByDefault();
});

test('TC-08: Verify that the Active filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.clickActiveFilter();
  await adminUsersPage.expectActiveFilterIsApplied();
});

test('TC-09: Verify that the Unverified filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.clickUnverifiedFilter();
  await adminUsersPage.expectUnverifiedFilterIsApplied();
});

test('TC-10: Verify that the Suspended filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.clickSuspendedFilter();
  await adminUsersPage.expectSuspendedFilterIsApplied();
});

test('TC-11: Verify that opening the users page logged out redirects to admin sign-in', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath('/admin/users');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-12: Verify that the saved admin session opens the users page signed in', { tag: ['@critical'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.expectPageIsOpen();
});

test('TC-13: Verify that the row menu of an active admin user lists its actions', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openRowMenu(OWN_USER.email);
  await adminUsersPage.expectActiveAdminMenuItems();
});

test('TC-14: Verify that Demote to user and Suspend are disabled on the signed-in admin\'s own row', { tag: ['@critical'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(VALID_ADMIN.email);
  await adminUsersPage.openRowMenu(VALID_ADMIN.email);
  await adminUsersPage.expectDemoteAndSuspendAreDisabled();
});

test('TC-15: Verify that View details shows the user fields and the chat tool view setting', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openDetailsFor(OWN_USER.email);
  await adminUsersPage.expectDetailDialogShowsUserFields(OWN_USER.name, OWN_USER.email);
});

test('TC-16: Verify that the chat tool view setting offers its four options', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openDetailsFor(OWN_USER.email);
  await adminUsersPage.expectChatToolViewOptions(OWN_USER.name);
});

test('TC-17: Verify that Close closes the user detail dialog', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openDetailsFor(OWN_USER.email);
  await adminUsersPage.closeDetails(OWN_USER.name);
  await adminUsersPage.expectDetailDialogIsClosed(OWN_USER.name);
});

test('TC-18: Verify that Top up credit shows the default amount, a note box and its buttons', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openTopUpFor(OWN_USER.email);
  await adminUsersPage.expectTopUpDialogShowsDefaults(OWN_USER.email);
});

test('TC-19: Verify that Cancel closes the Top up credit dialog without adding credit', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openTopUpFor(OWN_USER.email);
  await adminUsersPage.cancelTopUp();
  await adminUsersPage.expectTopUpDialogIsClosed();
});

test('TC-20: Verify that Suspend shows its warning, default reason, empty expiry and buttons', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openSuspendFor(OWN_USER.email);
  await adminUsersPage.expectSuspendDialogShowsDefaults();
});

test('TC-21: Verify that Cancel closes the Suspend dialog without suspending the account', { tag: ['@regression'] }, async ({ adminSession, adminUsersPage }) => {
  await adminUsersPage.open();
  await adminUsersPage.search(OWN_USER.email);
  await adminUsersPage.openSuspendFor(OWN_USER.email);
  await adminUsersPage.cancelSuspend();
  await adminUsersPage.expectSuspendDialogIsClosed();
});
