import { test } from '../fixtures/base';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-14: Verify that switching Compact mode off is kept after a reload', { tag: ['@critical'] }, async ({ userAccountSettingsPage, restoredPreferences }) => {
  await userAccountSettingsPage.openSection('general');
  await userAccountSettingsPage.switchCompactMode();
  await userAccountSettingsPage.expectCompactModeIsOff();
  await userAccountSettingsPage.reload();
  await userAccountSettingsPage.expectCompactModeIsOff();
});

test('TC-15: Verify that switching Product updates on is kept after a reload', { tag: ['@regression'] }, async ({ userAccountSettingsPage, restoredPreferences }) => {
  await userAccountSettingsPage.openSection('notifications');
  await userAccountSettingsPage.switchProductUpdates();
  await userAccountSettingsPage.expectProductUpdatesAreOn();
  await userAccountSettingsPage.reload();
  await userAccountSettingsPage.expectProductUpdatesAreOn();
});
