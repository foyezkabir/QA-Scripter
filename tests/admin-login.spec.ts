import { test } from '../fixtures/base';
import { DEEP_LINK, EDGE, unknownAdmin, VALID_ADMIN } from '../datas/admin/AdminData';

test.use({ storageState: { cookies: [], origins: [] } });

test('TC-01: Verify that the admin sign-in page shows its heading, fields and Sign in button', { tag: ['@smoke'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.open();
  await adminLoginPage.expectPageIsOpen();
});

test('TC-02: Verify that Sign in is disabled while both fields are empty', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.open();
  await adminLoginPage.expectSignInIsDisabled();
});

test('TC-03: Verify that Sign in is disabled with only the admin email filled', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.open();
  await adminLoginPage.fillEmail(VALID_ADMIN.email);
  await adminLoginPage.expectSignInIsDisabled();
});

test('TC-04: Verify that Sign in is disabled with only the admin token filled', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.open();
  await adminLoginPage.fillToken(VALID_ADMIN.token);
  await adminLoginPage.expectSignInIsDisabled();
});

test('TC-05: Verify that Sign in is enabled once both fields are filled, even with a malformed email', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.open();
  await adminLoginPage.fillCredentials({ email: EDGE.malformedEmail, token: VALID_ADMIN.token });
  await adminLoginPage.expectSignInIsEnabled();
});

test('TC-06: Verify that an allowlisted admin with a valid token lands on the admin dashboard', { tag: ['@smoke', '@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.signInAs(VALID_ADMIN);
  await adminLoginPage.expectSignedIn();
});

test('TC-07: Verify that a wrong token shows an invalid-token error and stays on the sign-in page', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.signInAs(unknownAdmin());
  await adminLoginPage.expectInvalidTokenError();
});

test('TC-08: Verify that the sign-in form is locked while the request is in flight', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.holdVerifyRequestOpen();
  await adminLoginPage.signInAs(VALID_ADMIN);
  await adminLoginPage.expectSigningInState();
});

test('TC-09: Verify that a logged-out deep link redirects to sign-in without keeping the query', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.openPath(DEEP_LINK);
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-10: Verify that the Admin account menu lists the signed-in email, Appearance and Sign out', { tag: ['@regression'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.signInAs(VALID_ADMIN);
  await adminLoginPage.expectSignedIn();
  await adminLoginPage.openAccountMenu();
  await adminLoginPage.expectAccountMenuListsEmailAppearanceAndSignOut(VALID_ADMIN.email);
});

test('TC-11: Verify that Sign out returns to sign-in and protects the admin dashboard', { tag: ['@critical'] }, async ({ adminLoginPage }) => {
  await adminLoginPage.signInAs(VALID_ADMIN);
  await adminLoginPage.expectSignedIn();
  await adminLoginPage.openAccountMenu();
  await adminLoginPage.clickSignOut();
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
  await adminLoginPage.openPath('/admin');
  await adminLoginPage.expectRedirectedToLoginWithoutQuery();
});

test('TC-12: Verify that the saved admin session opens the dashboard without the sign-in form', { tag: ['@critical'] }, async ({ adminSession, adminLoginPage }) => {
  await adminLoginPage.openPath('/admin');
  await adminLoginPage.expectSignedIn();
});
