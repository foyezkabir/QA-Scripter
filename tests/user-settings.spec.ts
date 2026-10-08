import { test } from '../fixtures/base';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that the agent Settings page shows its heading and sections', { tag: ['@smoke'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectPageIsOpen();
});

test('TC-02: Verify that Basic Information shows the agent name, role, description and hints', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectBasicInformation();
});

test('TC-03: Verify that Save Changes is disabled until a field is changed', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectSaveIsDisabled();
});

test('TC-04: Verify that emptying the agent name marks it invalid and keeps Save Changes disabled', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.clearName();
  await userSettingsPage.expectNameIsInvalid();
  await userSettingsPage.expectSaveIsDisabled();
});

test('TC-05: Verify that emptying the role marks it invalid and keeps Save Changes disabled', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.clearRole();
  await userSettingsPage.expectRoleIsInvalid();
  await userSettingsPage.expectSaveIsDisabled();
});

test('TC-06: Verify that the icon button opens the emoji picker', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.openEmojiPicker();
  await userSettingsPage.expectEmojiPicker();
});

test('TC-07: Verify that the Behavior section shows three switches with their hints', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectBehaviorSection();
});

test('TC-08: Verify that Response Tone offers five tones with Concise selected', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectToneOptions();
});

test('TC-09: Verify that the Access key section shows the no-key state and Generate access key', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectAccessKeySection();
});

test('TC-10: Verify that the Agent-to-agent access section offers New key', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectAgentToAgentSection();
});

test('TC-11: Verify that New key opens a form with Create disabled and Cancel closes it', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.openNewKeyForm();
  await userSettingsPage.expectNewKeyFormIsOpen();
  await userSettingsPage.cancelNewKeyForm();
  await userSettingsPage.expectNewKeyFormIsClosed();
});

test('TC-12: Verify that the Backup section shows Backup now and both download buttons', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectBackupSection();
});

test('TC-13: Verify that the Danger Zone warns before Delete Agent', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.open();
  await userSettingsPage.expectDangerZone();
});

test('TC-17: Verify that the Settings link in Agent sections opens the agent Settings page', { tag: ['@regression'] }, async ({ userSettingsPage }) => {
  await userSettingsPage.openFromChat();
  await userSettingsPage.expectSettingsUrl();
});
