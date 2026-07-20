import { test, expect } from '../fixtures/base';
import { AGENT_ID, INVALID_AGENT_ID, EXPECTED, SECRET_PATTERN } from '../datas/security/SecurityData';
import { fakeTeamsCredentials } from '../datas/messaging/MessagingData';

// TestRail Suite 201, section "15 - Security (Critical)" - 15 cases total. Only 4 are built below
// (62121/62122/62127/62134) - fresh module, no existing page object needed since every test reuses
// pages already built for other modules (Chat/Messaging/Skills). The rest are explicitly out of
// scope for this pass: 62123/62124 are Auth (excluded per standing instruction to skip Auth).
// 62126 (platform refuses to start on missing/corrupt encryption key), 62131 (plaintext credential
// never in server logs/cache), 62133 (audit log entry is read-only) all need server-side/infra
// access this Playwright suite has no way to reach. 62128 (export bundle contains only encrypted
// credential blob) and 62130 (pre-stripped PII unrecoverable from export/admin path) need parsing
// a downloaded archive and/or an admin surface not explored yet - deferred, bigger lift. 62129 and
// 62135 are both explicitly exploratory/gap-flagging cases in their own AC wording ("flag it as a
// gap if so" / "as a documented gap") tied to an "unmapped integration field" and a PII-stripping
// attachment flow neither of which was located anywhere in this app during exploration - nothing to
// automate against. 62125 (prompt-injection resisting system-prompt extraction via a scheduled
// Task) is deferred - would need a full Task-run-and-read-output round trip not yet built out for
// this module. 62132 (rate limit blocks excess requests with 429) is deliberately NOT exercised:
// this exact dev environment was independently observed hitting real 429s from this session's own
// testing volume moments before this file was written - deliberately hammering it further to try to
// reproduce 62132 on purpose would be irresponsible against a shared environment already showing
// rate-limit strain.
test.describe.configure({ mode: 'serial' });

// TestRail case 62122. Same underlying app-shell behavior already proven for Skills (case 62040,
// tests/skills.spec.ts TC-12) - re-verified here directly against the base chat route (the most
// direct "access another user's agent" attempt) for this section's own traceability.
test('TC-01: Verify that guessing another user\'s agent ID is denied cleanly, with no agent data exposed',
  { tag: ['@critical', '@case-62122'] },
  async ({ page }) => {
    await page.goto(`/chat/${INVALID_AGENT_ID}`);
    await expect(page.getByRole('heading', { name: EXPECTED.agentNotFoundHeading }), 'an inaccessible agent id should show a clear not-found state, not any real agent data').toBeVisible();
    await expect(page.getByText(EXPECTED.agentNotFoundText), 'the not-found state should explain why, without leaking why access was actually denied').toBeVisible();
  });

// TestRail case 62121. Sweeps the full visible text of several already-explored surfaces (agent
// Configuration, Messaging, Skills) for anything secret-shaped, extending the same check already
// proven for Chat (TC-18) to the rest of the app rather than duplicating it there.
test('TC-02: Verify that agent info surfaces never expose tokens or secrets in visible text',
  { tag: ['@critical', '@case-62121'] },
  async ({ page }) => {
    // Neither a literal <main> tag nor role="main" exists on the Configuration route (confirmed
    // live via the raw accessibility snapshot - its content wrapper is plain generic/banner nodes)
    // - scoping to <body> is the one container guaranteed to exist on every route, and is actually
    // the right scope for a full-page secret sweep anyway.
    await page.goto(`/chat/${AGENT_ID}/configuration`);
    const configText = await page.locator('body').innerText();
    expect(configText, 'the Configuration page should never render a secret-shaped value').not.toMatch(SECRET_PATTERN);

    await page.goto(`/chat/${AGENT_ID}/messaging`);
    const messagingText = await page.locator('body').innerText();
    expect(messagingText, 'the Messaging page should never render a secret-shaped value').not.toMatch(SECRET_PATTERN);

    await page.goto(`/chat/${AGENT_ID}/skills`);
    const skillsText = await page.locator('body').innerText();
    expect(skillsText, 'the Skills page should never render a secret-shaped value').not.toMatch(SECRET_PATTERN);
  });

// TestRail case 62134. Extends the existing masking checks (Telegram Bot token, Teams App
// password) with the specific negative this case cares about - no "reveal"/"show" control exists
// anywhere near either masked field.
test('TC-03: Verify that no "reveal secret" control exists for a previously-saved credential',
  { tag: ['@critical', '@case-62134'] },
  async ({ messagingPage, page }) => {
    await messagingPage.open(AGENT_ID);
    await expect(messagingPage.telegramBotTokenInputLocator(), 'precondition: Telegram Bot token should be masked').toHaveValue('••••••••');
    await expect(
      page.getByRole('button', { name: /reveal|show password|show secret/i }),
      'no reveal/show control should exist anywhere on the Messaging page for a saved credential',
    ).toHaveCount(0);
  });

// TestRail case 62127. Connects Teams (the one channel this suite is allowed to freely
// connect/disconnect) while recording every network response, then scans all of them for the
// plaintext password that was typed in - proving it's never echoed back over the wire, encrypted
// or not. Uses the same disconnect-on-teardown fixture as messaging.spec.ts so the real shared
// agent's Teams connection is guaranteed back to Disconnected regardless of outcome.
test('TC-04: Verify that a decrypted credential value never appears in any network response payload',
  { tag: ['@critical', '@case-62127'] },
  async ({ messagingPage, cleanupTeamsConnection, page }) => {
    const credentials = fakeTeamsCredentials();
    const responseBodies: string[] = [];
    page.on('response', (response) => {
      response.text().then((body) => responseBodies.push(body)).catch(() => undefined);
    });

    await messagingPage.open(AGENT_ID);
    await messagingPage.toggleChannel('Microsoft Teams');
    await messagingPage.fillTeamsFields(credentials);
    await messagingPage.submitTeamsConnect();
    await expect(messagingPage.channelStatusLocator('Microsoft Teams', 'Connected'), 'setup: Teams should connect first').toBeVisible();

    expect(
      responseBodies.some((body) => body.includes(credentials.appPassword)),
      'the plaintext App password should never appear in any network response body after saving',
    ).toBe(false);
  });
