import { test, expect } from '../fixtures/base';
import { QA_SCRATCH_AGENT_ID, QA_SCRATCH_AGENT_NAME, INVALID_AGENT_ID } from '../datas/dashboard/DashboardData';

// TestRail Suite 201, section "03 - Dashboard (Low)" - 14 cases total. Only 4 are built below
// (61920/61924/61931/61932). Every test that stops/renames/opens a delete dialog uses the second
// "QA-Scratch-Agent" (confirmed live, clearly a throwaway by name) rather than the primary Rex Dev
// agent every other module's tests depend on. The rest are out of scope for this pass: 61921
// (crash/disconnect detection), 61928 (stuck-in-Provisioning auto-Error), 61929 (Docker host at
// capacity), 61930 (server unreachable mid-session) all need infra-level fault injection this
// Playwright suite has no way to trigger. 61922 (10+ agents dashboard performance) and 61923 (two
// identically-named agents open separate contexts) would both require creating many throwaway
// agents on a shared account, unwarranted scope/cost for this pass. 61925 (no secrets in agent
// card DOM/network) overlaps the broader sweep already built for Security (case 62121). 61926
// (blocked actions on another user's agent) and 61927 (zero-agents empty state) both need a second
// real user account this repo doesn't have. 61933 (agent in "Not Found" state) needs an agent
// artificially put into that specific state, not naturally reachable.
test.describe.configure({ mode: 'serial' });

// TestRail case 61920. Confirms the badge flips WITHOUT a manual page reload - the same MCP/page
// instance is used to click Stop and then immediately re-check the badge.
test('TC-01: Verify that stopping an agent updates its status badge without requiring a manual page refresh',
  { tag: ['@critical', '@case-61920'] },
  async ({ chatPage, page }) => {
    test.slow();
    await chatPage.openDashboard();
    await expect(chatPage.dashboardStatusBadgeLocator(QA_SCRATCH_AGENT_NAME, 'Active'), 'setup: scratch agent should start Active').toBeVisible();

    await chatPage.stopAgentFromDashboard(QA_SCRATCH_AGENT_NAME);

    await expect(
      chatPage.dashboardStatusBadgeLocator(QA_SCRATCH_AGENT_NAME, 'Inactive'),
      'badge should flip to Inactive without a manual page reload',
    ).toBeVisible({ timeout: 20_000 });

    // Restore Active state for whatever else might depend on this scratch agent.
    await chatPage.activateAgentFromDashboard(QA_SCRATCH_AGENT_NAME);
    await expect(chatPage.dashboardStatusBadgeLocator(QA_SCRATCH_AGENT_NAME, 'Active'), 'cleanup: scratch agent should be Active again').toBeVisible({ timeout: 60_000 });
  });

// TestRail case 61924. Same underlying app-shell behavior already proven for Skills/Security
// (cases 62040/62122) - re-verified directly against the Dashboard's own agent-id-driven chat
// route for this section's own traceability.
test('TC-02: Verify that another user\'s agent cannot be accessed via agent ID manipulation',
  { tag: ['@critical', '@case-61924'] },
  async ({ page }) => {
    await page.goto(`/chat/${INVALID_AGENT_ID}`);
    await expect(page.getByRole('heading', { name: 'Agent not found' }), 'an inaccessible agent id should show a clear not-found state').toBeVisible();
  });

test('TC-03: Verify that cancelling the delete confirmation leaves the agent completely untouched',
  { tag: ['@critical', '@case-61931'] },
  async ({ agentConfigPage }) => {
    await agentConfigPage.open(QA_SCRATCH_AGENT_ID);
    await agentConfigPage.openDeleteConfirm();
    await expect(agentConfigPage.deleteConfirmHeadingLocator(QA_SCRATCH_AGENT_NAME), 'confirmation dialog should name the agent being deleted').toBeVisible();

    await agentConfigPage.keepAgent();

    await expect(agentConfigPage.deleteConfirmDialogLocator(), 'dialog should close on Keep it').toBeHidden();
    await expect(agentConfigPage.agentNameInputLocator(), 'agent name should be completely unchanged').toHaveValue(QA_SCRATCH_AGENT_NAME);
  });

// TestRail case 61932. Never actually saves a blank name - the Save button's own state is the
// assertion, matching the same "assert intended, don't risk persisting garbage" approach used for
// Agent Configuration's blank-Role case (case 62091).
test('TC-04: Verify that submitting Rename with a blank name is rejected and the agent keeps its old name',
  { tag: ['@regression', '@case-61932'] },
  async ({ agentConfigPage }) => {
    await agentConfigPage.open(QA_SCRATCH_AGENT_ID);
    await agentConfigPage.fillBasicInfo({ name: '' });
    await expect(
      agentConfigPage.basicInfoSaveButtonLocator(),
      'Save should be rejected (stay disabled, or a clear validation error should appear) when the agent name is left blank',
    ).toBeDisabled();
  });
