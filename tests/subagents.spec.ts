import { test, expect } from '../fixtures/base';
import { AGENT_ID, EXPECTED, newSubagent } from '../datas/subagents/SubagentsData';
import { AGENT_NAME } from '../datas/chat/ChatData';
import { FINANCE_SUBAGENT_TRIGGER_PROMPT, FINANCE_SUBAGENT_REPLY_TAG, FINANCE_SUBAGENT_SLUG_FRAGMENT } from '../datas/subagents/SubagentsData';

// Same environment constraint as tasks/chat/projects/skills.spec.ts - only one live agent exists,
// and the Subagents list is shared across every test. Force serial to avoid cross-test races.
// TC-01 additionally relies on running FIRST, before any other test's create - this agent starts
// with zero subagents (confirmed live), so file order preserves that true-empty precondition. NOTE
// (2026-07-20): live exploration found this precondition already broken by leftover data from an
// earlier, untracked session - "QA Finance Helper" and "QA Weather Helper Renamed" both already
// exist on this agent. TC-01 as written will therefore fail on a fresh run until that stray data is
// manually cleared - this is an environment-hygiene issue, not a new defect, and out of scope to
// fix here. The leftover "QA Finance Helper" (with its distinctive [QA-FINANCE-SUBAGENT-REPLY]
// trigger tag baked into its instructions) is reused below as a reliable delegation trigger for
// TC-14 rather than being deleted.
//
// TestRail Suite 201, section "10 - Sub-agents (Critical)" - 16 cases total. Only 3 are built below
// (62050/62053/62055); the rest are out of scope for this pass because they need one of: backend/
// infra fault injection (forced task failure 62043, container restart mid-delegation 62046, missing
// operator-write scope header 62047), a way to force the PARENT agent into an error state that
// wasn't found in this exploration (62048), fuzzy free-text LLM response assertions with no
// deterministic ground truth (62041, 62042, 62044, 62054), or overlap with an already-covered
// defect class (62045 mid-stream reload is the same bug already documented for the main chat
// surface - see findings/chat.txt and case 61908 in chat.spec.ts). Cases 62049 needs a per-subagent
// workspace-folder concept this exploration could not locate in the UI. Cases 62051/62052/62056 all
// hinge on the subagent's "slug" - confirmed live via network inspection to be a random-suffixed
// value (e.g. "qa-slug-test-r563r9") never exposed anywhere in the UI (see TC-12/62053 below) -
// verifying slug uniqueness/persistence would require a dedicated authenticated API-test harness
// (this repo's apiTests/ layer has only a type contract so far, no auth client yet), which is
// disproportionate effort for a property the random-suffix design already makes near-certain by
// construction; skipped rather than building a misleading UI-only check.
test.describe.configure({ mode: 'serial' });

test('TC-01: Verify that the Subagents page shows the empty state with none created yet',
  { tag: ['@smoke'] },
  async ({ subagentsPage, page }) => {
    await subagentsPage.open(AGENT_ID);
    await expect(page.getByRole('heading', { name: 'Subagents', level: 1 }), 'Subagents page should load').toBeVisible();
    await expect(page.getByRole('heading', { name: EXPECTED.emptyStateHeading, level: 2 }), 'empty state should render with zero subagents').toBeVisible();
  });

test('TC-02: Verify that the Create button stays disabled until Name and Instructions are both filled',
  { tag: ['@regression'] },
  async ({ subagentsPage }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openNewSubagentDialog();
    await expect(subagentsPage.createButtonLocator(), 'Create should be disabled with everything empty').toBeDisabled();

    await subagentsPage.fillFields({ name: 'Name Only Check' });
    await expect(subagentsPage.createButtonLocator(), 'Create should stay disabled with only Name filled - Instructions is also required').toBeDisabled();
  });

test('TC-03: Verify that a new subagent can be created and appears in the list',
  { tag: ['@smoke', '@critical'] },
  async ({ subagentsPage, cleanupSubagents }) => {
    // Create round-trips on this dev environment have been observed taking well past the default
    // 30s test budget under load - triples it, same accommodation as the seededSubagent fixture.
    test.slow();
    const subagent = newSubagent();

    await test.step('Create the subagent', async () => {
      await subagentsPage.open(AGENT_ID);
      await subagentsPage.openNewSubagentDialog();
      await subagentsPage.fillFields(subagent);
      await subagentsPage.submitCreate();
      cleanupSubagents(subagent.name);
    });

    await test.step('Verify it appears in the list', async () => {
      await expect(subagentsPage.subagentCardLocator(subagent.name), 'new subagent should appear in the list').toBeVisible();
    });
  });

test('TC-04: Verify that the search box filters subagents by name',
  { tag: ['@regression'] },
  async ({ subagentsPage, seededSubagent }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.search(seededSubagent.name);
    await expect(subagentsPage.subagentCardLocator(seededSubagent.name), 'matching subagent should remain visible').toBeVisible();
    const count = await subagentsPage.getSubagentCount();
    expect(count, 'search should narrow the list to matching subagents only').toBe(1);
  });

test('TC-05: Verify that a non-matching search shows the "No matches" empty state',
  { tag: ['@regression'] },
  async ({ subagentsPage, seededSubagent, page }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.search('zzz-no-match-zzz');
    await expect(page.getByRole('heading', { name: EXPECTED.noMatchesHeading, level: 2 }), 'no-match empty state should render').toBeVisible();
    await expect(subagentsPage.subagentCardLocator(seededSubagent.name), 'seeded subagent should be filtered out').toHaveCount(0);
  });

test('TC-06: Verify that Subagent Details shows status, run stats, and Recent activity',
  { tag: ['@regression'] },
  async ({ subagentsPage, seededSubagent, page }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openDetails(seededSubagent.name);
    await expect(page.getByRole('heading', { name: EXPECTED.detailsDialogTitle }), 'Subagent Details modal should open').toBeVisible();
    await expect(page.getByText('Active', { exact: true }), 'a fresh subagent should show an Active status').toBeVisible();
    // The em-dash and "no runs yet" render as separate child nodes (confirmed live) with no space
    // between them in the accessible text, so match the stable substring rather than the exact string.
    await expect(page.getByText(/no runs yet/), 'Success rate should show the no-runs placeholder for a fresh subagent').toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent activity' }), 'Recent activity section should render').toBeVisible();
    await expect(page.getByText('No activity yet'), 'Recent activity should show its empty state for a fresh subagent').toBeVisible();
    await subagentsPage.closeDialog();
  });

test('TC-07: Verify that Edit Subagent opens prefilled with the current values',
  { tag: ['@regression'] },
  async ({ subagentsPage, seededSubagent, page }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openEdit(seededSubagent.name);
    await expect(page.getByRole('heading', { name: EXPECTED.editDialogTitle }), 'Edit Subagent dialog should open').toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' }), 'Name should be prefilled with the current value').toHaveValue(seededSubagent.name);
    await expect(page.getByRole('textbox', { name: 'Description' }), 'Description should be prefilled with the current value').toHaveValue(seededSubagent.description);
  });

test('TC-08: Verify that editing a subagent\'s name updates it in the list',
  { tag: ['@critical'] },
  async ({ subagentsPage, seededSubagent }) => {
    const updatedName = `${seededSubagent.name} Updated`;
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openEdit(seededSubagent.name);
    await subagentsPage.fillFields({ name: updatedName });
    await subagentsPage.submitSaveChanges();
    await expect(subagentsPage.subagentCardLocator(updatedName), 'list should reflect the renamed subagent').toBeVisible();
    // Rename the fixture's own record back so its teardown (keyed on the original name) still finds it.
    await subagentsPage.openEdit(updatedName);
    await subagentsPage.fillFields({ name: seededSubagent.name });
    await subagentsPage.submitSaveChanges();
  });

test('TC-09: Verify that the Enable/Disable toggle switches state and the label updates',
  { tag: ['@critical'] },
  async ({ subagentsPage, seededSubagent }) => {
    await subagentsPage.open(AGENT_ID);
    const toggle = subagentsPage.toggleSwitchLocator(seededSubagent.name);
    await expect(toggle, 'a freshly created subagent should start enabled').toHaveAttribute('aria-checked', 'true');

    // The toggle round-trips through a PATCH + refetch (confirmed live) that can take longer than
    // the default 5s expect timeout under this dev environment's observed load - extend it rather
    // than treat a slow-but-correct round-trip as a failure.
    await subagentsPage.toggleEnabled(seededSubagent.name);
    await expect(toggle, 'toggling should flip aria-checked to false').toHaveAttribute('aria-checked', 'false', { timeout: 15_000 });
    await expect(subagentsPage.toggleSwitchLocator(seededSubagent.name), 'accessible name should flip to Enable once disabled').toHaveAccessibleName('Enable');

    await subagentsPage.open(AGENT_ID);
    await expect(subagentsPage.toggleSwitchLocator(seededSubagent.name), 'disabled state should persist after reload').toHaveAttribute('aria-checked', 'false');

    // Restore enabled state so the fixture's own teardown deletes a subagent in its original state.
    await subagentsPage.toggleEnabled(seededSubagent.name);
    await expect(subagentsPage.toggleSwitchLocator(seededSubagent.name), 'toggling back should re-enable it').toHaveAttribute('aria-checked', 'true', { timeout: 15_000 });
  });

test('TC-10: Verify that Delete opens a confirmation dialog naming the subagent, and "Keep it" cancels',
  { tag: ['@regression'] },
  async ({ subagentsPage, seededSubagent }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openDeleteConfirm(seededSubagent.name);
    await expect(
      subagentsPage.deleteDialogHeadingLocator(seededSubagent.name),
      'confirmation dialog should name the subagent being deleted',
    ).toBeVisible();
    await subagentsPage.keepSubagent();
    await expect(subagentsPage.subagentCardLocator(seededSubagent.name), 'subagent should remain after Keep it').toBeVisible();
  });

test('TC-11: Verify that confirming delete removes the subagent from the list',
  { tag: ['@critical'] },
  async ({ subagentsPage, seededSubagent }) => {
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openDeleteConfirm(seededSubagent.name);
    await subagentsPage.confirmDelete();
    await expect(subagentsPage.subagentCardLocator(seededSubagent.name), 'subagent should be removed').toHaveCount(0);
  });

// TestRail case 62053. Confirmed live across all three surfaces (card, Details, Edit) - no "slug"
// label or value appears anywhere; Edit only exposes Name/Description/Instructions.
test('TC-12: Verify that no UI surface exposes or allows editing a subagent\'s slug directly',
  { tag: ['@regression', '@case-62053'] },
  async ({ subagentsPage, seededSubagent, page }) => {
    await subagentsPage.open(AGENT_ID);
    await expect(page.getByText(/slug/i), 'the card view should never expose a "slug" label or value').toHaveCount(0);

    await subagentsPage.openDetails(seededSubagent.name);
    await expect(page.getByText(/slug/i), 'the Details panel should never expose a "slug" label or value').toHaveCount(0);
    await subagentsPage.closeDialog();

    await subagentsPage.openEdit(seededSubagent.name);
    await expect(page.getByText(/slug/i), 'the Edit panel should never expose or allow editing a "slug" field').toHaveCount(0);
  });

// TestRail case 62055. Fires two native click events on the same Create button before Playwright's
// own actionability re-check can run between them - the closest a script gets to a genuine rapid
// human double-click - then asserts the safety invariant that matters: exactly one subagent is
// created, never two.
test('TC-13: Verify that rapidly double-clicking Create does not create two subagents from one submission',
  { tag: ['@critical', '@case-62055'] },
  async ({ subagentsPage, cleanupSubagents, page }) => {
    test.slow();
    const subagent = newSubagent();

    await subagentsPage.open(AGENT_ID);
    await subagentsPage.openNewSubagentDialog();
    await subagentsPage.fillFields(subagent);
    cleanupSubagents(subagent.name);
    await subagentsPage.createButtonLocator().evaluate((el) => {
      (el as HTMLButtonElement).click();
      (el as HTMLButtonElement).click();
    });

    await expect(subagentsPage.subagentCardLocator(subagent.name), 'the subagent should still be created once').toBeVisible();
    const count = await page.getByRole('heading', { name: subagent.name, level: 3, exact: true }).count();
    expect(count, 'a rapid double-click on Create should never produce two subagents from one submission').toBe(1);
  });

// TestRail case 62050. Reuses the pre-existing "QA Finance Helper" leftover subagent (see the
// file-level note above) as a reliable delegation trigger via its baked-in reply tag, then checks
// the visible reply for any leaked internal identity/routing metadata (subagent id, slug, or the
// literal words "sub-agent"/"subagent"/"delegat*", none of which a real user should ever see).
test('TC-14: Verify that a delegated reply never leaks sub-agent identity or routing metadata to the end user',
  { tag: ['@critical', '@case-62050'] },
  async ({ chatPage, cleanupConversationsById, page }, testInfo) => {
    // Delegating to a subagent is an extra hop on top of this environment's already-documented
    // reply slowness (see findings/chat.txt) - observed live to occasionally exceed even a 5-minute
    // budget end-to-end (the same intermittent agent-reply flakiness documented project-wide, not a
    // defect in this test), so both the internal wait and the overall test budget carry generous
    // headroom rather than a tight bound.
    testInfo.setTimeout(240_000);
    await chatPage.ensureAgentActive(AGENT_NAME);
    await chatPage.open(AGENT_ID);
    await chatPage.sendMessage(FINANCE_SUBAGENT_TRIGGER_PROMPT);
    await chatPage.waitForReplyComplete(180_000);
    cleanupConversationsById(chatPage.getCurrentConversationId());

    const pageText = await page.locator('main').innerText();
    expect(pageText, 'precondition: the finance subagent should actually have handled this request').toContain(FINANCE_SUBAGENT_REPLY_TAG);

    // Strip the deliberately-injected marker tag before scanning for leaks - it contains the word
    // "SUBAGENT" by design and would otherwise trip the very check below on its own trigger text.
    const replyTextOnly = pageText.split(FINANCE_SUBAGENT_REPLY_TAG).join('');
    expect(
      replyTextOnly,
      'the reply should never leak the subagent\'s internal slug to the end user',
    ).not.toContain(FINANCE_SUBAGENT_SLUG_FRAGMENT);
    expect(
      replyTextOnly,
      'the reply should never leak routing/delegation metadata (subagent id, "delegated to", etc.) to the end user',
    ).not.toMatch(/\bsub-?agent\b|\bdelegat(ed|ion|ing)\b|\brouted? (to|via)\b/i);
  });
