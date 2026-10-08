import { test } from '../fixtures/base';

test('TC-01: Verify that the audit log shows its heading, total, filter, table and pagination', { tag: ['@smoke'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectPageIsOpen();
});

test('TC-02: Verify that Filter by action offers every action', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectActionOptions();
});

test('TC-03: Verify that filtering by Provision lists only provision events', { tag: ['@critical'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.selectAction('Provision');
  await adminAuditLogPage.expectOnlyProvisionEvents();
});

test('TC-04: Verify that on the first page Previous is disabled and Next is enabled', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectFirstPageNavigation();
});

test('TC-05: Verify that Next shows the second page and enables Previous', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.clickNext();
  await adminAuditLogPage.expectSecondPage();
});

test('TC-06: Verify that Previous returns to the first page', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.clickNext();
  await adminAuditLogPage.expectSecondPage();
  await adminAuditLogPage.clickPrevious();
  await adminAuditLogPage.expectFirstPage();
});

test('TC-07: Verify that Refresh re-reads the list and is enabled again afterwards', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.clickRefresh();
  await adminAuditLogPage.expectRefreshIsEnabledWithEvents();
});

test('TC-08: Verify that Refresh is disabled and no table is shown while the list loads', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.holdAuditRequestOpen();
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectLoadingState();
});

test('TC-09: Verify that an empty audit log shows its empty message', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.mockEmptyAuditLog();
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectEmptyAuditLog();
});

test('TC-10: Verify that a filter with no events shows a no-events message and Clear filters', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.mockEmptyAuditLog();
  await adminAuditLogPage.selectAction('Reprovision');
  await adminAuditLogPage.expectNoEventsForActionState();
});

test('TC-11: Verify that a failed request shows Could not load this, the message and Try again', { tag: ['@critical'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.failAuditRequests();
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectCouldNotLoadState();
});

test('TC-12: Verify that Try again after a failed request loads the list', { tag: ['@regression'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.failAuditRequests();
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectCouldNotLoadState();
  await adminAuditLogPage.restoreAuditRequests();
  await adminAuditLogPage.clickTryAgain();
  await adminAuditLogPage.expectEventsAreListed();
});

test('TC-13: Verify that opening the audit log logged out redirects to admin sign-in', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath('/admin/audit-log');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-14: Verify that the saved admin session opens the audit log signed in', { tag: ['@critical'] }, async ({ adminSession, adminAuditLogPage }) => {
  await adminAuditLogPage.open();
  await adminAuditLogPage.expectPageIsOpen();
});
