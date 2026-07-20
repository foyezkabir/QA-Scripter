import { test, expect } from '../fixtures/base';
import { AGENT_ID, AGENT_NAME, ORIGINAL, TEMP_ROLE_FOR_PERSISTENCE_CHECK, SCRIPT_PAYLOAD } from '../datas/agentConfig/AgentConfigData';

// Same environment constraint as every other module spec - only one live agent exists, and its
// Configuration is shared across every test.
//
// TestRail Suite 201, section "13 - Agent Configuration (High)" - 15 cases total. Only 5 are built
// below (62090/62091/62095/62098/62099; cases 62091 and 62098 each document a real gap, see
// findings/agentConfig.txt). Every test that touches Basic Information changes ONLY Role or
// Description, NEVER Agent Name (too many other spec files key off the literal string 'Rex Dev' to
// find this agent from the dashboard) - and requests the restoreAgentBasicInfo fixture so the real
// shared agent's config is guaranteed back to its original values in teardown, pass or fail. The
// Danger Zone's actual "Yes, delete" button is NEVER clicked anywhere in this file - only its
// enabled/disabled state is inspected (see AgentConfigPage - it has no method that clicks it at
// all, by design). The rest of the section's cases are out of scope for this pass: 62093 (two-tab
// concurrent edit) and 62094/62100 (scheduled task + guardrail/model-allowlist behavior, inherently
// time-based) need infrastructure this exploration didn't build out; 62096/62097 (export bundle
// contents / stale download-link reuse) need parsing a downloaded archive, a bigger lift deferred
// for now; 62101 (jailbreak-style guardrail probing) and 62102 (needs a non-admin user account this
// repo doesn't have) are deferred; 62103 is budget/billing-adjacent and explicitly out of scope per
// standing instruction to skip Billing; 62104 (virtual key never exposed in plaintext) - no
// "virtual key" field was found anywhere on this Configuration page during exploration.

test.describe('Agent Configuration - passing coverage', () => {
  // Shared config state across these tests - force serial to avoid cross-test races.
  test.describe.configure({ mode: 'serial' });

  test('TC-01: Verify that the Configuration page loads with Basic Information, Behavior, Backup, and Danger Zone sections',
    { tag: ['@smoke'] },
    async ({ agentConfigPage, page }) => {
      await agentConfigPage.open(AGENT_ID);
      await expect(page.getByRole('heading', { name: 'Configuration', level: 1 }), 'Configuration page should load').toBeVisible();
      await expect(page.getByRole('heading', { name: 'Basic Information' }), 'Basic Information section should render').toBeVisible();
      await expect(page.getByRole('heading', { name: 'Behavior', exact: true }), 'Behavior section should render').toBeVisible();
      await expect(page.getByRole('heading', { name: 'Backup' }), 'Backup section should render').toBeVisible();
      await expect(page.getByRole('heading', { name: 'Danger Zone' }), 'Danger Zone section should render').toBeVisible();
    });

  // TestRail case 62090. Changes Role (never Agent Name) so a page navigation + return proves the
  // change actually persisted server-side, not just in local component state.
  test('TC-02: Verify that a changed configuration setting persists after navigating away and returning',
    { tag: ['@critical', '@case-62090'] },
    async ({ agentConfigPage, restoreAgentBasicInfo }) => {
      await agentConfigPage.open(AGENT_ID);
      await agentConfigPage.fillBasicInfo({ role: TEMP_ROLE_FOR_PERSISTENCE_CHECK });
      await agentConfigPage.submitBasicInfoSave();
      await expect(agentConfigPage.basicInfoSaveButtonLocator(), 'Save should go back to disabled once the change is saved').toBeDisabled();

      await agentConfigPage.open(AGENT_ID); // simulate navigating away and back via a fresh load of the same page
      await expect(agentConfigPage.roleInputLocator(), 'the changed Role should persist after reloading the page').toHaveValue(TEMP_ROLE_FOR_PERSISTENCE_CHECK);
    });

  test('TC-05: Verify that cancelling the delete confirmation leaves the agent fully intact',
    { tag: ['@critical', '@case-62099'] },
    async ({ agentConfigPage }) => {
      await agentConfigPage.open(AGENT_ID);
      await agentConfigPage.openDeleteConfirm();
      await agentConfigPage.keepAgent();

      await expect(agentConfigPage.deleteConfirmDialogLocator(), 'dialog should close on Keep it').toBeHidden();
      await expect(agentConfigPage.agentNameInputLocator(), 'Agent Name should be completely unchanged').toHaveValue(AGENT_NAME);
      await expect(agentConfigPage.roleInputLocator(), 'Role should be completely unchanged').toHaveValue(ORIGINAL.role);
    });

  // TestRail case 62095. Uses Description (never Agent Name) for the injection payload - the same
  // script-inert pattern as tests/chat.spec.ts TC-19, distinct global flag name.
  test('TC-06: Verify that HTML/script markup typed into the agent description field is stripped, never rendered',
    { tag: ['@critical', '@case-62095'] },
    async ({ agentConfigPage, page, restoreAgentBasicInfo }) => {
      await agentConfigPage.open(AGENT_ID);
      await agentConfigPage.fillBasicInfo({ description: SCRIPT_PAYLOAD });
      await agentConfigPage.submitBasicInfoSave();
      await expect(agentConfigPage.basicInfoSaveButtonLocator(), 'setup: save should complete').toBeDisabled();

      await agentConfigPage.open(AGENT_ID); // reload so we're checking the persisted, re-rendered value - not just live component state
      const executed = await page.evaluate(() => (window as unknown as { __qaConfigScriptExecuted?: boolean }).__qaConfigScriptExecuted === true);
      expect(executed, 'a <script> tag saved into the description should never actually execute on reload').toBe(false);
      await expect(
        agentConfigPage.descriptionInputLocator(),
        'the field should not silently render/keep raw <script> markup as active executable content',
      ).not.toHaveValue(/<script/);
    });
});

// Kept in a SEPARATE (non-serial) describe block on purpose: both of these are known, currently-
// failing defect-documenting tests (see findings/agentConfig.txt). Under `mode: 'serial'`,
// Playwright skips every remaining test in a describe block once one fails - with two independent
// known failures, only the first would ever actually execute. Neither test mutates persisted state
// (TC-03 never clicks Save while blank; TC-04 never clicks "Yes, delete"), so they're safe to run
// independently of the passing block above and of each other.
test.describe('Agent Configuration - documented gaps', () => {
  // TestRail case 62091. Blanks Role (a required field) but NEVER clicks Save while it's blank -
  // the button's own state is the assertion, so the blank value is never actually persisted.
  test('TC-03: Verify that saving with a required field left blank is rejected',
    { tag: ['@regression', '@case-62091'] },
    async ({ agentConfigPage }) => {
      await agentConfigPage.open(AGENT_ID);
      await agentConfigPage.fillBasicInfo({ role: '' });
      await expect(
        agentConfigPage.basicInfoSaveButtonLocator(),
        'Save should be rejected (stay disabled, or a clear validation error should appear) when a required field is blank - never silently save an empty Role - see findings/agentConfig.txt',
      ).toBeDisabled();
    });

  // TestRail case 62098. Actual live behavior (confirmed 2026-07-20): the delete confirmation
  // dialog has no name-confirmation text field at all - "Yes, delete" is enabled the instant it
  // opens. See findings/agentConfig.txt. "Yes, delete" is inspected for its state only, never
  // clicked - see AgentConfigPage.
  test('TC-04: Verify that the delete confirmation\'s confirm button stays disabled until the agent name is typed exactly',
    { tag: ['@critical', '@case-62098'] },
    async ({ agentConfigPage }) => {
      await agentConfigPage.open(AGENT_ID);
      await agentConfigPage.openDeleteConfirm();
      await expect(agentConfigPage.deleteConfirmHeadingLocator(AGENT_NAME), 'confirmation dialog should name the agent being deleted').toBeVisible();

      await expect(
        agentConfigPage.yesDeleteButtonLocator(),
        'Yes, delete should stay disabled until the agent name is typed exactly - see findings/agentConfig.txt',
      ).toBeDisabled();

      await agentConfigPage.keepAgent();
    });
});
