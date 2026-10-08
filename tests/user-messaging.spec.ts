import { test } from '../fixtures/base';

test('TC-01: Verify that the Messaging page shows its heading, description and sections', { tag: ['@smoke'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectPageIsOpen();
});

test('TC-02: Verify that the four channel cards are described', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectChannelDescriptions();
});

test('TC-03: Verify that connected channels show a Connected status and a Disconnect button', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectTwoChannelsConnected();
});

test('TC-04: Verify that disconnected channels show a Disconnected status', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectTwoChannelsDisconnected();
});

test('TC-05: Verify that there are four channel switches with two switched on', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectChannelSwitches();
});

test('TC-06: Verify that the Telegram card shows its fields and hint', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectTelegramFields();
});

test('TC-07: Verify that the Slack card shows its fields, hint and setup instructions', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectSlackFields();
});

test('TC-08: Verify that stored channel tokens are hidden as password fields', { tag: ['@critical'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectTokensAreMasked();
});

test('TC-09: Verify that Model per channel offers a model select for Telegram and Slack', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectModelPerChannel();
});

test('TC-10: Verify that the Slack model select carries the slower replies hint', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.open();
  await userMessagingPage.expectSlowerRepliesHint();
});

test('TC-11: Verify that the Messaging link in Agent sections opens the Messaging page', { tag: ['@regression'] }, async ({ userMessagingPage }) => {
  await userMessagingPage.openFromChat();
  await userMessagingPage.expectMessagingUrl();
});
