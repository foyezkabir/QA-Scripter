import { test } from '../fixtures/base';
import { VALID_USER, unknownUser } from '../datas/auth/AuthData';

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-06: Verify that valid credentials sign the user in to the dashboard', { tag: ['@smoke', '@critical'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilAccepted(VALID_USER);
  await sessionPage.expectDashboardIsOpen();
});

test('TC-07: Verify that wrong credentials show an invalid email or password error', { tag: ['@critical'] }, async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilRejected(unknownUser());
  await signInPage.expectStaysOnSignIn();
});

test('TC-11: Verify that pressing Enter in the password field signs the user in', { tag: ['@regression'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.fillEmail(VALID_USER.email);
  await signInPage.fillPassword(VALID_USER.password);
  await signInPage.pressEnterUntilSignedIn();
  await sessionPage.expectDashboardIsOpen();
});

test('TC-13: Verify that signing in with Remember me checked sets a persistent session cookie', { tag: ['@regression'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilAccepted(VALID_USER);
  await sessionPage.expectDashboardIsOpen();
  await signInPage.expectPersistentSessionCookie();
});

test('TC-14: Verify that signing in with Remember me unchecked sets session-only cookies', { tag: ['@regression'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.uncheckRememberMe();
  await signInPage.signInAsUntilAccepted(VALID_USER);
  await sessionPage.expectDashboardIsOpen();
  await signInPage.expectSessionOnlyCookies();
});

test('TC-21: Verify that the account menu lists the signed-in user options', { tag: ['@regression'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilAccepted(VALID_USER);
  await sessionPage.expectDashboardIsOpen();
  await sessionPage.openAccountMenu();
  await sessionPage.expectAccountMenuItems();
});

test('TC-22: Verify that Sign Out ends the session and protects the dashboard', { tag: ['@critical'] }, async ({ signInPage, sessionPage }) => {
  await signInPage.open();
  await signInPage.signInAsUntilAccepted(VALID_USER);
  await sessionPage.expectDashboardIsOpen();
  await sessionPage.openAccountMenu();
  await sessionPage.signOut();
  await signInPage.expectPageIsOpen();
  await sessionPage.openDashboard();
  await signInPage.expectRedirectedToSignInWithDashboardCallback();
});
