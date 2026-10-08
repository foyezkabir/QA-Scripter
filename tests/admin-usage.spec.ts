import { test } from '../fixtures/base';

test('TC-01: Verify that the usage page shows its heading, subtitle and report sections', { tag: ['@smoke'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectPageIsOpen();
});

test('TC-02: Verify that the usage page shows its three stat cards', { tag: ['@regression'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectStatCards();
});

test('TC-03: Verify that Integration Adoption lists every integration with a percentage', { tag: ['@regression'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectIntegrationTiles();
});

test('TC-04: Verify that Tracker Imports lists projects with their tracker and last import', { tag: ['@regression'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectTrackerImportsAreListed();
});

test('TC-05: Verify that the agent creation timeline explains it is calculated from audit logs', { tag: ['@regression'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectTimelineNote();
});

test('TC-06: Verify that opening the usage page logged out redirects to admin sign-in', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath('/admin/usage');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-07: Verify that the saved admin session opens the usage page signed in', { tag: ['@critical'] }, async ({ adminSession, adminUsagePage }) => {
  await adminUsagePage.open();
  await adminUsagePage.expectPageIsOpen();
});
