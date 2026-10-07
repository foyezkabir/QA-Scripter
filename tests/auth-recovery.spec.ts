import { test } from '../fixtures/base';
import { EDGE, FAKE_RESET_TOKEN, newPassword, resetEmail } from '../datas/auth/AuthData';

test.use({ storageState: { cookies: [], origins: [] } });

test('TC-44: Verify that the forgot password page shows its form', { tag: ['@smoke'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.expectPageIsOpen();
});

test('TC-45: Verify that Send reset link is disabled while the email is empty', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.expectSendResetLinkIsDisabled();
});

test('TC-46: Verify that Send reset link is enabled once an email is typed', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(EDGE.malformedEmail);
  await forgotPasswordPage.expectSendResetLinkIsEnabled();
});

test('TC-47: Verify that a malformed email is rejected by browser validation', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.blockResetRequests();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(EDGE.malformedEmail);
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectEmailRejectedByBrowserValidation();
});

test('TC-48: Verify that Send reset link is disabled while the request is in flight', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.holdResetRequestOpen();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(resetEmail());
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectResetRequestIsBusy();
});

test('TC-49: Verify that an accepted reset request confirms instructions were sent', { tag: ['@critical'] }, async ({ forgotPasswordPage }) => {
  const email = resetEmail();
  await forgotPasswordPage.mockResetRequestAccepted();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(email);
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectResetInstructionsSentFor(email);
});

test('TC-50: Verify that a rate-limited request shows a too many requests error', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.mockTooManyRequests();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(resetEmail());
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectTooManyRequestsError();
});

test('TC-51: Verify that a server error shows an internal server error banner', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.mockServerError();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(resetEmail());
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectServerError();
});

test('TC-52: Verify that a network failure shows a failed to fetch banner', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.mockNetworkFailure();
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(resetEmail());
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectNetworkError();
});

test('TC-53: Verify that the forgot password page is reachable without a session', { tag: ['@regression'] }, async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.expectPageIsOpen();
});

test('TC-54: Verify that the page links lead back to sign-in and target the legal pages', { tag: ['@regression'] }, async ({ forgotPasswordPage, signInPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.expectFooterLinksTargetLegalPages();
  await forgotPasswordPage.clickBackToSignIn();
  await signInPage.expectPageIsOpen();
});

test('TC-73: Verify that a fake reset token is rejected with an invalid token error', { tag: ['@regression'] }, async ({ resetPasswordPage }) => {
  const changedPassword = newPassword();
  await resetPasswordPage.openWithToken(FAKE_RESET_TOKEN);
  await resetPasswordPage.fillPasswords(changedPassword, changedPassword);
  await resetPasswordPage.clickResetPassword();
  await resetPasswordPage.expectInvalidTokenError();
});

test('TC-74: Verify that a reset page without a token asks to open the email link again', { tag: ['@regression'] }, async ({ resetPasswordPage }) => {
  const changedPassword = newPassword();
  await resetPasswordPage.openWithoutToken();
  await resetPasswordPage.fillPasswords(changedPassword, changedPassword);
  await resetPasswordPage.clickResetPassword();
  await resetPasswordPage.expectMissingTokenError();
});

test('TC-75: Verify that the show password button reveals both reset passwords', { tag: ['@regression'] }, async ({ resetPasswordPage }) => {
  await resetPasswordPage.openWithoutToken();
  await resetPasswordPage.expectBothPasswordsAreMasked();
  await resetPasswordPage.showPassword();
  await resetPasswordPage.expectBothPasswordsAreRevealed();
  await resetPasswordPage.hidePassword();
  await resetPasswordPage.expectBothPasswordsAreMasked();
});

test('TC-76: Verify that the reset page links lead back to sign-in and target the legal pages', { tag: ['@regression'] }, async ({ resetPasswordPage, signInPage }) => {
  await resetPasswordPage.openWithoutToken();
  await resetPasswordPage.expectFooterLinksTargetLegalPages();
  await resetPasswordPage.clickBackToSignIn();
  await signInPage.expectPageIsOpen();
});

test('TC-77: Verify that Reset password is disabled while the request is in flight', { tag: ['@regression'] }, async ({ resetPasswordPage }) => {
  const changedPassword = newPassword();
  await resetPasswordPage.holdResetRequestOpen();
  await resetPasswordPage.openWithToken(FAKE_RESET_TOKEN);
  await resetPasswordPage.fillPasswords(changedPassword, changedPassword);
  await resetPasswordPage.clickResetPassword();
  await resetPasswordPage.expectResetRequestIsBusy();
});
