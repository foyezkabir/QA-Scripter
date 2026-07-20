import { test, expect } from '../fixtures/base';
import { TEMP_COMPANY_FOR_PERSISTENCE_CHECK, EMOJI_NAME, WRONG_CURRENT_PASSWORD, NEW_PASSWORD_CANDIDATE } from '../datas/profile/ProfileData';

// TestRail Suite 201, section "17 - Profile & Settings (Low)" - 13 cases total. Only 4 are built
// below (62150/62152/62154/62161). Every test that touches Profile fields changes ONLY Company/
// Role/Full name and requests restoreProfileFields, guaranteed to revert the real shared account
// back to its original values regardless of pass/fail. The rest are out of scope for this pass:
// 62151 (invalid email rejected) doesn't apply to this app's actual design - confirmed live the
// Email field is read-only ("managed by your identity provider and can't be changed here"), so
// there is no submission path to test against. 62158 (password section hidden for OAuth-linked
// accounts) doesn't apply either - confirmed live this account has a full Password + 2FA section
// on /settings/security, so it isn't OAuth-linked; no OAuth-linked account is available to test
// the hidden-section behavior against. 62153 (cross-tab reflection) and 62155 (password change
// invalidates other sessions) both need a real successful password change, which this suite
// deliberately never performs (no real current password available, and a real change would risk
// signing out the actual human account owner's other sessions). 62156/62157 (2FA backup-code
// reuse / lockout recovery) need a real 2FA setup, a hard-to-reverse change to the shared account -
// skipped. 62159 (empty Timezone falls back to UTC) needs a Timezone field this exploration didn't
// locate. 62160 (agent-rules hard constraint honored across languages) is really a Chat/Agent-
// Configuration behavior, not a Profile/Settings UI case, and needs a multi-language chat
// round-trip - deferred. 62162 (identical Quiet Hours start/end blocks the full 24h) has no
// UI-visible signal for the resulting behavior (no duration/preview text shown), so there is
// nothing to assert against without triggering a real notification at a specific time of day.
test.describe.configure({ mode: 'serial' });

// TestRail case 62150. Changes Company (never Full name/Role in this one, to keep the persistence
// check isolated to a single field) and reloads to prove the value is actually persisted
// server-side.
test('TC-01: Verify that profile updates persist after a page reload',
  { tag: ['@critical', '@case-62150'] },
  async ({ profilePage, restoreProfileFields }) => {
    await profilePage.openProfileEdit();
    await profilePage.fillProfileEdit({ company: TEMP_COMPANY_FOR_PERSISTENCE_CHECK });
    await profilePage.submitProfileEdit();

    await profilePage.openProfileEdit(); // simulate navigating away and back via a fresh load
    await expect(profilePage.companyInputLocator(), 'the changed Company should persist after reloading the page').toHaveValue(TEMP_COMPANY_FOR_PERSISTENCE_CHECK);
  });

// TestRail case 62152. Saves an emoji + special-character display name, reloads, and confirms it
// renders identically both on the edit form and the read-only Profile view.
test('TC-02: Verify that emoji and special characters in the display name save correctly and render identically everywhere',
  { tag: ['@regression', '@case-62152'] },
  async ({ profilePage, page, restoreProfileFields }) => {
    await profilePage.openProfileEdit();
    await profilePage.fillProfileEdit({ fullName: EMOJI_NAME });
    await profilePage.submitProfileEdit();

    await profilePage.openProfileEdit();
    await expect(profilePage.fullNameInputLocator(), 'the emoji/special-character name should persist exactly as entered').toHaveValue(EMOJI_NAME);

    await profilePage.openProfile();
    // Two elements legitimately render the same name on this view (the profile card + the
    // "Full name" definition row) - .first() is fine here since both are expected to match, not a
    // disambiguation need.
    await expect(page.getByText(EMOJI_NAME, { exact: true }).first(), 'the read-only Profile view should render the exact same name').toBeVisible();
    await expect(page.getByText(EMOJI_NAME, { exact: true }), 'the name should render identically everywhere it appears on this view').toHaveCount(2);
  });

// TestRail case 62154. A deliberately wrong current password should be rejected before the change
// is ever applied - no real current password is needed since any wrong value must fail.
test('TC-03: Verify that changing the password with an incorrect current password is rejected and the password remains unchanged',
  { tag: ['@critical', '@case-62154'] },
  async ({ profilePage, page }) => {
    await profilePage.openSecuritySettings();
    await profilePage.fillPasswordChange({ current: WRONG_CURRENT_PASSWORD, next: NEW_PASSWORD_CANDIDATE, confirm: NEW_PASSWORD_CANDIDATE });
    await expect(profilePage.updatePasswordButtonLocator(), 'Update password should enable once all three fields are filled').toBeEnabled();

    await profilePage.submitPasswordUpdate();

    await expect(
      page.getByText(/incorrect|wrong|invalid current password/i),
      'an incorrect current password should produce a clear rejection error',
    ).toBeVisible();
  });

// TestRail case 62161. Confirmed live: the dialog offers only "Got it" and a mailto link to
// support - there is no delete-confirmation path anywhere in it. Never clicks anything that could
// perform a real deletion, because no such control exists to click.
test('TC-04: Verify that clicking Delete Account only opens the support-email info dialog',
  { tag: ['@critical', '@case-62161'] },
  async ({ profilePage, page }) => {
    await profilePage.openPrivacySettings();
    await profilePage.openDeleteAccountDialog();

    await expect(profilePage.deleteAccountDialogLocator(), 'a Delete your account? dialog should open').toBeVisible();
    await expect(page.getByRole('link', { name: 'support@velaops.ai' }), 'the dialog should point to support, not a self-serve delete').toBeVisible();
    await expect(page.getByRole('button', { name: /^(Yes,? )?delete/i }), 'no confirming delete button should exist anywhere in this dialog').toHaveCount(0);

    await profilePage.closeDeleteAccountDialog();
  });
