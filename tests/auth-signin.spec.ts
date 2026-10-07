import { test } from '../fixtures/base';
import { EDGE, VALID_USER, unknownUser } from '../datas/auth/AuthData';

test.use({ storageState: { cookies: [], origins: [] } });

test('TC-01: Verify that the sign-in page shows its form and fields', { tag: ['@smoke'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.expectPageIsOpen();
  await signInPage.expectAllLinksAreShown();
});

test('TC-02: Verify that Sign in is disabled while both fields are empty', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.expectSignInIsDisabled();
  await signInPage.expectNoFieldErrorAfterBlurringEmptyFields();
});

test('TC-03: Verify that Sign in is disabled when only the work email is filled', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillEmail(VALID_USER.email);
  await signInPage.expectSignInIsDisabled();
});

test('TC-04: Verify that Sign in is disabled when only the password is filled', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillPassword(VALID_USER.password);
  await signInPage.expectSignInIsDisabled();
});

test('TC-05: Verify that Sign in is enabled once the work email and password are filled', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillEmail(VALID_USER.email);
  await signInPage.fillPassword(VALID_USER.password);
  await signInPage.expectSignInIsEnabled();
});

test('TC-08: Verify that a malformed work email is rejected by browser validation', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillEmail(EDGE.malformedEmail);
  await signInPage.fillPassword(VALID_USER.password);
  await signInPage.clickSignIn();
  await signInPage.expectEmailRejectedByBrowserValidation();
});

test('TC-09: Verify that sign-in and social buttons are disabled while the request is in flight', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.holdSignInRequestOpen();
  await signInPage.open();
  await signInPage.signInAs(unknownUser());
  await signInPage.expectSignInIsBusy();
});

test('TC-10: Verify that the show password button reveals and re-masks the password', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillPassword(VALID_USER.password);
  await signInPage.expectPasswordIsMasked();
  await signInPage.showPassword();
  await signInPage.expectPasswordIsRevealed();
  await signInPage.hidePassword();
  await signInPage.expectPasswordIsMasked();
});

test('TC-12: Verify that Remember me is checked by default', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.expectRememberMeIsChecked();
});

test('TC-15: Verify that the Forgot password link opens the forgot password page', { tag: ['@regression'] }, async ({ signInPage, forgotPasswordPage }) => {
  await signInPage.open();
  await signInPage.clickForgotPassword();
  await forgotPasswordPage.expectPageIsOpen();
});

test('TC-16: Verify that the Create an account link opens the sign-up page', { tag: ['@regression'] }, async ({ signInPage, signUpPage }) => {
  await signInPage.open();
  await signInPage.clickCreateAccount();
  await signUpPage.expectPageIsOpen();
});

test('TC-17: Verify that the VelaCrew home link targets the site root', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.expectHomeLinkTargetsRoot();
});

test('TC-18: Verify that the Terms of Service footer link opens the terms page', { tag: ['@regression'] }, async ({ signInPage, legalPage }) => {
  await signInPage.open();
  await signInPage.clickTermsLink();
  await legalPage.expectTermsPageIsOpen();
});

test('TC-19: Verify that the Privacy Policy footer link opens the privacy page', { tag: ['@regression'] }, async ({ signInPage, legalPage }) => {
  await signInPage.open();
  await signInPage.clickPrivacyLink();
  await legalPage.expectPrivacyPageIsOpen();
});

test('TC-20: Verify that the Google and Microsoft sign-in buttons are available', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.expectSocialButtonsAreEnabled();
});

test('TC-23: Verify that a logged-out visit to the dashboard redirects to sign-in', { tag: ['@critical'] }, async ({ signInPage }) => {
  await signInPage.openDashboardLoggedOut();
  await signInPage.expectRedirectedToSignInWithDashboardCallback();
});

test('TC-59: Verify that a rate-limited sign-in shows a too many requests error', { tag: ['@regression'] }, async ({ signInPage }) => {
  await signInPage.mockSignInRateLimited();
  await signInPage.open();
  await signInPage.signInAs(unknownUser());
  await signInPage.expectTooManyRequestsError();
  await signInPage.expectStaysOnSignIn();
});
