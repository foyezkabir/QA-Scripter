import { test } from '../fixtures/base';
import { THRESHOLD_TYPED } from '../datas/admin/AdminData';

test('TC-01: Verify that the AI platform page shows its heading, subtitle and five sections', { tag: ['@smoke'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectPageIsOpen();
});

test('TC-02: Verify that the AI platform page shows its four stat labels', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectStatLabels();
});

test('TC-03: Verify that OpenRouter Credit shows remaining credit, threshold fields and its buttons', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectCreditSection();
});

test('TC-04: Verify that the threshold fields accept a typed value without saving it', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.typeReminderThreshold(THRESHOLD_TYPED.reminder);
  await adminAiPlatformPage.typeWarningThreshold(THRESHOLD_TYPED.warning);
  await adminAiPlatformPage.expectThresholdFieldsAcceptTypedValues(THRESHOLD_TYPED.reminder, THRESHOLD_TYPED.warning);
});

test('TC-05: Verify that Model Configuration lists the nine configured models', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectModelsAreListed();
});

test('TC-06: Verify that the Virtual API Keys table has its six columns and a Cleanup Orphaned button', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectKeyTableColumnsAndCleanupButton();
});

test('TC-07: Verify that key rows offer a Delete key button', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectKeyRowsOfferDeleteButtons();
});

test('TC-08: Verify that Today\'s Activity shows its four measures and both Refresh buttons exist', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectActivitySection();
});

test('TC-09: Verify that the LiteLLM Dashboard section describes itself and offers Open Dashboard', { tag: ['@regression'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectLiteLlmDashboardLink();
});

test('TC-10: Verify that opening the AI platform page logged out redirects to admin sign-in', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath('/admin/ai-platform');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-11: Verify that the saved admin session opens the AI platform page signed in', { tag: ['@critical'] }, async ({ adminSession, adminAiPlatformPage }) => {
  await adminAiPlatformPage.open();
  await adminAiPlatformPage.expectPageIsOpen();
});
