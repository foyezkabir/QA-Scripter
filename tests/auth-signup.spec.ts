import { test } from '../fixtures/base';
import { EDGE, newSignUp } from '../datas/auth/AuthData';

test.use({ storageState: { cookies: [], origins: [] } });

test('TC-24: Verify that the sign-up page shows its form and fields', { tag: ['@smoke'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.expectPageIsOpen();
});

test('TC-25: Verify that Create account is disabled while all fields are empty', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.expectCreateAccountIsDisabled();
  await signUpPage.expectNoFieldErrorAfterBlurringEmptyFields();
});

test('TC-26: Verify that Create account stays disabled until all three fields are filled', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillFullName(newSignUp().fullName);
  await signUpPage.expectCreateAccountIsDisabled();
});

test('TC-27: Verify that Create account is enabled once all three fields are filled', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp());
  await signUpPage.expectCreateAccountIsEnabled();
});

test('TC-28: Verify that a blank full name shows a full name required error', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp({ fullName: EDGE.blankFullName }));
  await signUpPage.clickCreateAccount();
  await signUpPage.expectFullNameRequiredError();
});

test('TC-29: Verify that a malformed work email shows an invalid email error', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp({ email: EDGE.malformedEmail }));
  await signUpPage.clickCreateAccount();
  await signUpPage.expectInvalidEmailError();
});

test('TC-30: Verify that a short password shows a minimum length error', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp({ password: EDGE.shortPassword }));
  await signUpPage.clickCreateAccount();
  await signUpPage.expectPasswordTooShortError();
});

test('TC-31: Verify that the show password button reveals and re-masks the password', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp());
  await signUpPage.expectPasswordIsMasked();
  await signUpPage.showPassword();
  await signUpPage.expectPasswordIsRevealed();
  await signUpPage.hidePassword();
  await signUpPage.expectPasswordIsMasked();
});

test('TC-32: Verify that Create account and social buttons are disabled while the request is in flight', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.holdSignUpRequestOpen();
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp());
  await signUpPage.clickCreateAccount();
  await signUpPage.expectSignUpIsBusy();
});

test('TC-33: Verify that an accepted sign-up opens the verify email page for the entered email', { tag: ['@smoke', '@critical'] }, async ({ signUpPage, verifyEmailPage }) => {
  const record = newSignUp();
  await signUpPage.mockSignUpAccepted();
  await signUpPage.open();
  await signUpPage.fillForm(record);
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(record.email);
});

test('TC-35: Verify that a server error shows an internal server error banner', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.mockServerError();
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp());
  await signUpPage.clickCreateAccount();
  await signUpPage.expectServerError();
});

test('TC-36: Verify that a network failure shows a failed to fetch banner', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.mockNetworkFailure();
  await signUpPage.open();
  await signUpPage.fillForm(newSignUp());
  await signUpPage.clickCreateAccount();
  await signUpPage.expectNetworkError();
});

test('TC-37: Verify that Remember me is checked by default on sign-up', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.expectRememberMeIsChecked();
});

test('TC-38: Verify that the Sign in link opens the sign-in page', { tag: ['@regression'] }, async ({ signUpPage, signInPage }) => {
  await signUpPage.open();
  await signUpPage.clickSignIn();
  await signInPage.expectPageIsOpen();
});

test('TC-39: Verify that the Google and Microsoft sign-up buttons are available', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.expectSocialButtonsAreEnabled();
});

test('TC-40: Verify that the sign-up footer links target home, terms and privacy', { tag: ['@regression'] }, async ({ signUpPage }) => {
  await signUpPage.open();
  await signUpPage.expectFooterLinksTargetLegalPages();
});

test('TC-41: Verify that the verify email page confirms the verification link was sent', { tag: ['@critical'] }, async ({ signUpPage, verifyEmailPage }) => {
  const record = newSignUp();
  await signUpPage.mockSignUpAccepted();
  await signUpPage.open();
  await signUpPage.fillForm(record);
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(record.email);
});

test('TC-42: Verify that the verify email page links lead back to sign-up and sign-in', { tag: ['@regression'] }, async ({ signUpPage, verifyEmailPage, signInPage }) => {
  const record = newSignUp();
  await signUpPage.mockSignUpAccepted();
  await signUpPage.open();
  await signUpPage.fillForm(record);
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(record.email);
  await verifyEmailPage.clickSignInInstead();
  await signInPage.expectPageIsOpen();
});

test('TC-43: Verify that the verify email footer links target home, terms and privacy', { tag: ['@regression'] }, async ({ signUpPage, verifyEmailPage }) => {
  const record = newSignUp();
  await signUpPage.mockSignUpAccepted();
  await signUpPage.open();
  await signUpPage.fillForm(record);
  await signUpPage.clickCreateAccount();
  await verifyEmailPage.expectPageIsOpenFor(record.email);
  await verifyEmailPage.expectFooterLinksTargetLegalPages();
});
