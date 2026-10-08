import { test } from '../fixtures/base';

test('TC-01: Verify that the feedback page shows its heading, subtitle, two sections and Refresh', { tag: ['@smoke'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectPageIsOpen();
});

test('TC-02: Verify that with no ratings both sections show their empty messages', { tag: ['@regression'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.mockNoFeedback();
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectNoFeedbackState();
});

test('TC-03: Verify that Refresh is disabled while the ratings load', { tag: ['@regression'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.holdFeedbackRequestsOpen();
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectLoadingState();
});

test('TC-04: Verify that a failed request shows Could not load this, the message, Try again and the list notice', { tag: ['@critical'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.failFeedbackRequests();
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectCouldNotLoadState();
});

test('TC-05: Verify that Try again after a failed request clears the Response Quality error', { tag: ['@regression'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.failFeedbackRequests();
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectCouldNotLoadState();
  await adminFeedbackPage.restoreFeedbackRequests();
  await adminFeedbackPage.clickTryAgain();
  await adminFeedbackPage.expectResponseQualityErrorIsCleared();
});

test('TC-06: Verify that Refresh re-reads the ratings and is enabled again afterwards', { tag: ['@regression'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.open();
  await adminFeedbackPage.clickRefresh();
  await adminFeedbackPage.expectRefreshIsEnabledAgain();
});

test('TC-07: Verify that opening the feedback page logged out redirects to admin sign-in', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath('/admin/feedback');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-08: Verify that the saved admin session opens the feedback page signed in', { tag: ['@critical'] }, async ({ adminSession, adminFeedbackPage }) => {
  await adminFeedbackPage.open();
  await adminFeedbackPage.expectPageIsOpen();
});
