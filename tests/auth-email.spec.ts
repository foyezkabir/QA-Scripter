import { test } from '../fixtures/base';
import { EDGE, newPassword, newSignUp } from '../datas/auth/AuthData';

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-60: Verify that a real sign-up opens the verify email page and sends the verification email', { tag: ['@email', '@critical'] }, async ({ signUpPage, verifyEmailPage, mailbox, mailboxPage }) => {
  const record = newSignUp({ email: mailbox.address });
  await signUpPage.open();
  await signUpPage.fillForm(record);
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(record.email);
  await mailboxPage.expectVerificationEmailIsFromVelaCrew();
});

test('TC-61: Verify that the emailed verification link signs the user in to the dashboard', { tag: ['@email', '@critical'] }, async ({ registeredAccount, mailboxPage, verifyEmailPage, sessionPage }) => {
  const link = await mailboxPage.verificationLink();
  await verifyEmailPage.openVerificationLink(link);
  await sessionPage.expectDashboardIsOpen();
});

test('TC-62: Verify that a used verification link redirects to sign-in without a session', { tag: ['@email', '@regression'] }, async ({ verifiedAccount, verifyEmailPage, signInPage }) => {
  await verifyEmailPage.openVerificationLink(verifiedAccount.verifyLink);
  await signInPage.expectRedirectedToSignInWithDashboardCallback();
});

test('TC-63: Verify that signing in with an unverified account shows an email not verified error', { tag: ['@email', '@critical'] }, async ({ registeredAccount, signInPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilNotVerified(registeredAccount);
  await signInPage.expectStaysOnSignIn();
});

test('TC-64: Verify that signing up with an existing email shows the verify email page and emails a notice', { tag: ['@email', '@regression'] }, async ({ verifiedAccount, signUpPage, verifyEmailPage, mailboxPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp({ email: verifiedAccount.email }));
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(verifiedAccount.email);
  await mailboxPage.expectDuplicateSignupNoticeArrived();
});

test('TC-65: Verify that a real password reset request confirms and sends the reset email', { tag: ['@email', '@critical'] }, async ({ verifiedAccount, forgotPasswordPage, mailboxPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.fillEmail(verifiedAccount.email);
  await forgotPasswordPage.clickSendResetLink();
  await forgotPasswordPage.expectResetInstructionsSentFor(verifiedAccount.email);
  await mailboxPage.expectResetEmailArrived();
});

test('TC-66: Verify that the emailed reset link opens the reset password page', { tag: ['@email', '@regression'] }, async ({ resetLink, resetPasswordPage }) => {
  await resetPasswordPage.openFromEmailLink(resetLink);
  await resetPasswordPage.expectPageIsOpen();
  await resetPasswordPage.expectResetIsDisabled();
});

test('TC-67: Verify that mismatched passwords show a passwords do not match error', { tag: ['@email', '@regression'] }, async ({ resetLink, resetPasswordPage }) => {
  await resetPasswordPage.openFromEmailLink(resetLink);
  await resetPasswordPage.fillPasswords(newPassword(), newPassword());
  await resetPasswordPage.clickResetPassword();
  await resetPasswordPage.expectPasswordsDontMatchError();
});

test('TC-68: Verify that Reset password stays disabled for a short password', { tag: ['@email', '@regression'] }, async ({ resetLink, resetPasswordPage }) => {
  await resetPasswordPage.openFromEmailLink(resetLink);
  await resetPasswordPage.fillPasswords(EDGE.shortPassword, EDGE.shortPassword);
  await resetPasswordPage.expectResetIsDisabled();
});

test('TC-69: Verify that a valid reset returns to sign-in with a password updated banner', { tag: ['@email', '@critical'] }, async ({ resetLink, resetPasswordPage, signInPage }) => {
  const changedPassword = newPassword();
  await resetPasswordPage.openFromEmailLink(resetLink);
  await resetPasswordPage.fillPasswords(changedPassword, changedPassword);
  await resetPasswordPage.clickResetPassword();
  await signInPage.expectPasswordUpdatedBanner();
});

test('TC-70: Verify that the new password signs the user in after a reset', { tag: ['@email', '@critical'] }, async ({ resetAccount, signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilAccepted({ email: resetAccount.email, password: resetAccount.newPassword });
  await sessionPage.expectDashboardIsOpen();
});

test('TC-71: Verify that the old password is rejected after a reset', { tag: ['@email', '@critical'] }, async ({ resetAccount, signInPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilRejected({ email: resetAccount.email, password: resetAccount.oldPassword });
  await signInPage.expectStaysOnSignIn();
});

test('TC-72: Verify that a used reset link opens a blank form and rejects the submit', { tag: ['@email', '@regression'] }, async ({ resetAccount, resetPasswordPage }) => {
  const changedPassword = newPassword();
  await resetPasswordPage.openFromEmailLink(resetAccount.usedResetLink);
  await resetPasswordPage.expectNoErrorBeforeSubmitting();
  await resetPasswordPage.fillPasswords(changedPassword, changedPassword);
  await resetPasswordPage.clickResetPassword();
  await resetPasswordPage.expectMissingTokenError();
});
