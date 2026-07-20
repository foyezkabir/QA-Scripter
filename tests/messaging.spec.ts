import { test, expect } from '../fixtures/base';
import { AGENT_ID, EXPECTED, fakeTeamsCredentials, fakeTeamsCredentialsWithInvalidTenant } from '../datas/messaging/MessagingData';

// Same environment constraint as every other module spec - only one live agent exists, and the
// Messaging page's channel states are shared across every test. Force serial to avoid cross-test races.
//
// TestRail Suite 201, section "11 - Messaging (Critical)" - 18 cases total. Only 2 more are built
// below (62072/62074; case 62072 documents a real defect, see findings/messaging.txt) on top of the
// existing TC-01..08 general coverage. The rest are out of scope for this pass: WhatsApp and
// Telegram are both permanent, pre-existing, real shared channels on this dev agent (a real paired
// phone number, a real bot token) that this suite must never disconnect/re-pair/reconfigure - which
// rules out 62066 (unlink WhatsApp), 62067 (invalidate the real Telegram token), 62068 (edit the
// real Telegram Allowed Chat IDs field - no isolated way to test validation without risking an
// auto-save against the live shared config), 62070 (WhatsApp QR expiry - would require unlinking
// the current real pairing first), and 62071 (needs a second agent). The remaining cases need an
// actual message round-trip through a real external Telegram/WhatsApp/Teams account this repo has
// no sandbox credentials for (62057, 62059, 62060, 62061, 62062, 62063, 62064, 62065, 62069) or a
// pre-existing active Teams connection as a precondition to test replacement against (62073) -
// none of which this environment can safely provide.
test.describe.configure({ mode: 'serial' });

test('TC-01: Verify that the Messaging page loads with all three channel cards at their baseline status',
  { tag: ['@smoke'] },
  async ({ messagingPage, page }) => {
    await messagingPage.open(AGENT_ID);
    await expect(page.getByRole('heading', { name: EXPECTED.pageHeading, level: 1 }), 'Messaging page should load').toBeVisible();
    await expect(page.getByRole('heading', { name: EXPECTED.connectedChannelsHeading }), 'Connected channels section should render').toBeVisible();
    await expect(messagingPage.channelStatusLocator('WhatsApp', 'Connected'), 'WhatsApp is a pre-existing permanently-paired channel on this shared agent').toBeVisible();
    await expect(messagingPage.channelStatusLocator('Telegram', 'Connected'), 'Telegram is the other pre-existing Connected channel').toBeVisible();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Disconnected'), 'Microsoft Teams should start Disconnected').toBeVisible();
  });

// WhatsApp and Telegram are both permanent, pre-existing connected channels on this shared dev agent
// (WhatsApp was live-paired by another concurrent user/process mid-session, not by this suite) - never
// click their switch, Disconnect, or Re-pair. These two TCs are read-only reference checks only.

test('TC-02: Verify that the pre-existing WhatsApp channel shows Connected with a Paired indicator',
  { tag: ['@regression'] },
  async ({ messagingPage }) => {
    await messagingPage.open(AGENT_ID);
    await expect(messagingPage.channelStatusLocator('WhatsApp', 'Connected'), 'WhatsApp should show Connected').toBeVisible();
    await expect(messagingPage.whatsAppPairedTextLocator(), 'a paired number should show a Paired indicator').toBeVisible();
  });

test('TC-03: Verify that the pre-existing Telegram channel shows Connected with a masked Bot token',
  { tag: ['@regression'] },
  async ({ messagingPage }) => {
    await messagingPage.open(AGENT_ID);
    await expect(messagingPage.channelStatusLocator('Telegram', 'Connected'), 'Telegram should show Connected').toBeVisible();
    await expect(messagingPage.telegramBotTokenInputLocator(), 'Bot token should be masked, never shown in plaintext').toHaveValue('••••••••');
  });

test('TC-04: Verify that toggling Microsoft Teams expands its connect panel',
  { tag: ['@regression'] },
  async ({ messagingPage, page }) => {
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await expect(page.getByRole('textbox', { name: 'App ID' }), 'App ID field should appear once expanded').toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Tenant ID' }), 'Tenant ID field should appear once expanded').toBeVisible();
    await expect(page.getByRole('textbox', { name: 'App password' }), 'App password field should appear once expanded').toBeVisible();
    await messagingPage.toggleChannel('Microsoft Teams');
  });

test('TC-05: Verify that Teams Connect stays disabled until App ID, Tenant ID, and App password are all filled',
  { tag: ['@regression'] },
  async ({ messagingPage }) => {
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await expect(messagingPage.teamsConnectButtonLocator(), 'Connect should be disabled with everything empty').toBeDisabled();

    await messagingPage.fillTeamsFields({ appId: '00000000-0000-0000-0000-000000000001' });
    await expect(messagingPage.teamsConnectButtonLocator(), 'Connect should stay disabled with only App ID filled').toBeDisabled();

    await messagingPage.fillTeamsFields({ tenantId: 'common' });
    await expect(messagingPage.teamsConnectButtonLocator(), 'Connect should stay disabled without App password').toBeDisabled();

    await messagingPage.toggleChannel('Microsoft Teams');
  });

test('TC-06: Verify that connecting Microsoft Teams with all fields filled flips status to Connected',
  { tag: ['@smoke', '@critical'] },
  async ({ messagingPage }) => {
    const credentials = fakeTeamsCredentials();
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await messagingPage.fillTeamsFields(credentials);
    await expect(messagingPage.teamsConnectButtonLocator(), 'Connect should enable once all 3 fields are filled').toBeEnabled();

    await messagingPage.submitTeamsConnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Connected'), 'status should flip to Connected').toBeVisible();

    // Clean up immediately - Teams has no persistent seeded state, this test owns its own teardown.
    await messagingPage.submitTeamsDisconnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Disconnected'), 'Teams should be back to Disconnected after cleanup').toBeVisible();
  });

test('TC-07: Verify that disconnecting Microsoft Teams reverts status to Disconnected and collapses the panel',
  { tag: ['@critical'] },
  async ({ messagingPage, page }) => {
    const credentials = fakeTeamsCredentials();
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await messagingPage.fillTeamsFields(credentials);
    await messagingPage.submitTeamsConnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Connected'), 'Teams should connect first so disconnect has something to revert').toBeVisible();

    await messagingPage.submitTeamsDisconnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Disconnected'), 'status should revert to Disconnected').toBeVisible();
    await expect(page.getByRole('textbox', { name: 'App ID' }), 'connect panel should collapse after disconnect').toBeHidden();
  });

test('TC-08: Verify that "Copy messaging endpoint" is interactable on the Teams card',
  { tag: ['@regression'] },
  async ({ messagingPage, page }) => {
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await expect(page.getByRole('button', { name: 'Copy messaging endpoint' }), 'Copy button should be visible and enabled').toBeEnabled();
    await messagingPage.clickCopyMessagingEndpoint();
    await messagingPage.toggleChannel('Microsoft Teams');
  });

// TestRail case 62074. The App password field re-renders masked after saving - never re-displays
// the plaintext value entered, mirroring the existing Telegram Bot token masking check (TC-03).
test('TC-09: Verify that the Teams App password is never returned in plaintext after saving',
  { tag: ['@critical', '@case-62074'] },
  async ({ messagingPage, cleanupTeamsConnection }) => {
    const credentials = fakeTeamsCredentials();
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await messagingPage.fillTeamsFields(credentials);
    await messagingPage.submitTeamsConnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Connected'), 'setup: Teams should connect first').toBeVisible();

    await expect(
      messagingPage.teamsAppPasswordInputLocator(),
      'App password should be masked, never shown in plaintext after saving',
    ).toHaveValue('••••••••');
  });

// TestRail case 62072. Actual live behavior (confirmed 2026-07-20): entering a clearly invalid
// Tenant ID and clicking Connect flips status straight to "Connected" - no validation against
// Azure at all, so no Failed status is ever shown. See findings/messaging.txt. This asserts the
// spec-intended "moves to Failed" behavior, which currently fails against the real app - the
// failure is the documented evidence of the defect. Placed last (out of TC-number order) so its
// expected failure doesn't cascade-skip other tests under `mode: 'serial'`.
test('TC-10: Verify that saving Teams credentials with an invalid Tenant ID moves the connection to Failed',
  { tag: ['@regression', '@case-62072'] },
  async ({ messagingPage, cleanupTeamsConnection }) => {
    const credentials = fakeTeamsCredentialsWithInvalidTenant();
    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await messagingPage.fillTeamsFields(credentials);
    await messagingPage.submitTeamsConnect();

    await expect(
      messagingPage.channelStatusLocator('Microsoft Teams', 'Failed'),
      'an invalid Tenant ID should move the connection to Failed, not silently report Connected - see findings/messaging.txt',
    ).toBeVisible();
  });
