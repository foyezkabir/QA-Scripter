import { test } from '../fixtures/base';
import { OWN_ASSISTANT, SIGNED_IN_USER } from '../datas/user/UserData';

test('TC-01: Verify that the home page shows its welcome heading, subtitle, Create and the Assistants and Team spaces sections', { tag: ['@smoke'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.expectPageIsOpen(SIGNED_IN_USER.firstName);
});

test('TC-02: Verify that the saved user session opens the home page signed in', { tag: ['@critical'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.expectPageIsOpen(SIGNED_IN_USER.firstName);
});

test('TC-03: Verify that the assistant card shows its name, role and More button', { tag: ['@regression'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.expectAssistantCard(OWN_ASSISTANT.name, OWN_ASSISTANT.role);
});

test('TC-04: Verify that Create offers Agent and Team space', { tag: ['@regression'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.openCreateMenu();
  await userHomePage.expectCreateMenuItems();
});

test('TC-05: Verify that the More menu of an assistant offers Configure and Restart', { tag: ['@regression'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.openMoreMenuFor(OWN_ASSISTANT.name);
  await userHomePage.expectMoreMenuOffersConfigureAndRestart(OWN_ASSISTANT.name);
});

test('TC-06: Verify that the security banner offers Enable 2FA and Dismiss', { tag: ['@regression'] }, async ({ userHomePage }) => {
  await userHomePage.open(SIGNED_IN_USER.firstName);
  await userHomePage.expectSecurityBanner();
});
