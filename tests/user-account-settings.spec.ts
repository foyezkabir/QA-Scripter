import { test } from '../fixtures/base';

test('TC-01: Verify that Settings General shows the navigation and the Chat Preferences switches with their hints', { tag: ['@smoke'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('general');
  await userAccountSettingsPage.expectGeneral();
});

test('TC-02: Verify that the three internal API key cards are Admin-only with their storage hint and Show key', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('general');
  await userAccountSettingsPage.expectApiKeyCards();
});

test('TC-03: Verify that Replace key and Save key are disabled while no key is typed', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('general');
  await userAccountSettingsPage.expectKeyButtonsAreDisabled();
});

test('TC-04: Verify that Auto-logout after offers five choices', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('general');
  await userAccountSettingsPage.openAutoLogout();
  await userAccountSettingsPage.expectAutoLogoutOptions();
});

test('TC-05: Verify that Settings Notifications shows the browser, email and quiet hours switches', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('notifications');
  await userAccountSettingsPage.expectNotifications();
});

test('TC-06: Verify that Settings Security shows the password fields, the hint and Enable', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('security');
  await userAccountSettingsPage.expectSecurity();
});

test('TC-07: Verify that Update password is disabled while the fields are empty', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('security');
  await userAccountSettingsPage.expectUpdatePasswordIsDisabled();
});

test('TC-08: Verify that Show password turns an empty password field into plain text', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('security');
  await userAccountSettingsPage.revealCurrentPassword();
  await userAccountSettingsPage.expectCurrentPasswordIsRevealed();
});

test('TC-09: Verify that Settings Usage shows the balance, analytics tiles, spend chart and Want more power?', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('usage');
  await userAccountSettingsPage.expectUsage();
});

test('TC-10: Verify that Adjust plan and See Plans are disabled', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('usage');
  await userAccountSettingsPage.expectPlanButtonsAreDisabled();
});

test('TC-11: Verify that Settings Privacy shows Export Data, the information switch and Delete Account', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openSection('privacy');
  await userAccountSettingsPage.expectPrivacy();
});

test('TC-12: Verify that the Settings dialog Preferences section shows Appearance and Language', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openDialog();
  await userAccountSettingsPage.chooseDialogSection('Preferences');
  await userAccountSettingsPage.expectDialogPreferences();
});

test('TC-13: Verify that the Enable 2FA banner link opens Settings Security', { tag: ['@regression'] }, async ({ userAccountSettingsPage }) => {
  await userAccountSettingsPage.openFromBanner();
  await userAccountSettingsPage.expectSecurityUrl();
});
