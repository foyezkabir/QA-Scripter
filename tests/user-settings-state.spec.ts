import { test } from '../fixtures/base';
import { CHANGED_ROLE, CHANGED_TONE } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-14: Verify that a changed role enables Save Changes and is kept after saving', { tag: ['@critical'] }, async ({ userSettingsPage, restoredSettings }) => {
  await userSettingsPage.open();
  await userSettingsPage.changeRole(CHANGED_ROLE);
  await userSettingsPage.expectSaveIsEnabled();
  await userSettingsPage.saveChanges();
  await userSettingsPage.expectSaveIsDisabled();
  await userSettingsPage.reload();
  await userSettingsPage.expectRoleIs(CHANGED_ROLE);
});

test('TC-15: Verify that Dream Mode saves on its own and stays on after a reload', { tag: ['@regression'] }, async ({ userSettingsPage, restoredSettings }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectDreamModeIsOff();
  await userSettingsPage.toggleDreamMode();
  await userSettingsPage.reload();
  await userSettingsPage.expectDreamModeIsOn();
});

test('TC-16: Verify that Response Tone saves on its own and is kept after a reload', { tag: ['@regression'] }, async ({ userSettingsPage, restoredSettings }) => {
  await userSettingsPage.open();
  await userSettingsPage.chooseTone(CHANGED_TONE);
  await userSettingsPage.reload();
  await userSettingsPage.expectToneIs(CHANGED_TONE);
});
