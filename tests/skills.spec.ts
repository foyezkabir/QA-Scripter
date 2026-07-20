import { test, expect } from '../fixtures/base';
import { AGENT_ID, TEST_SKILL, EXISTING_INSTALLED_SKILL, INVALID_AGENT_ID, EXPECTED, newSkill } from '../datas/skills/SkillsData';

// TestRail Suite 201, section "09 - Skills (Critical)" - 23 cases total. Only 4 are built below
// (62031/62037/62038/62040); the rest are out of scope for this pass because they need one of:
// backend fault injection (network drop mid-install 62020, DB write failure 62023, forced
// internal tool-call failure 62030, pinned-commit verification 62036), a second agent or user
// account this environment doesn't provide (62034, 62039), an unrealistic storage-at-quota setup
// (62035), a timing race that would be inherently flaky (62032), an enable/disable toggle that
// doesn't exist in this UI - only Install/Uninstall (62021), or fuzzy free-text LLM response
// assertions with no deterministic ground truth available here (62018, 62019, 62022, 62024,
// 62025, 62026, 62027, 62028, 62029). Case 62033 ("built-in skill cannot be removed") was
// deliberately NOT exercised: the Xlsx skill's detail modal was confirmed live to render an
// active "Remove" button despite being built-in with no Install control - clicking it would be a
// destructive, uncertain-reversibility action against a shared dev agent's real capability, so it
// was observed but not executed; flagged in findings/skills.txt without automation.
// Same environment constraint as the other agent-shell specs - only one live agent exists, and
// the Skills catalog/installed-list is shared across every test. Force serial.
test.describe.configure({ mode: 'serial' });

test('TC-01: Verify that the Skills page displays the catalog with source filters',
  { tag: ['@smoke'] },
  async ({ skillsPage, page }) => {
    await skillsPage.open(AGENT_ID);
    await expect(page.getByRole('heading', { name: 'Skills', level: 1 }), 'Skills page should load').toBeVisible();
    await expect(skillsPage.cardLocator(EXISTING_INSTALLED_SKILL), 'a known installed skill should render').toBeVisible();
    await expect(skillsPage.installedBadgeLocator(EXISTING_INSTALLED_SKILL), 'it should show the Installed badge').toBeVisible();
  });

test('TC-02: Verify that View details opens the full skill detail dialog',
  { tag: ['@regression'] },
  async ({ skillsPage }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.openDetails(EXISTING_INSTALLED_SKILL);
    await expect(skillsPage.detailDialogHeadingLocator(EXISTING_INSTALLED_SKILL), 'detail dialog should open').toBeVisible();
    await skillsPage.closeDetails();
  });

test('TC-03: Verify that installing a skill flips its card badge and increments the Installed count',
  { tag: ['@smoke', '@critical'] },
  async ({ skillsPage, cleanupSkills, page }) => {
    await skillsPage.open(AGENT_ID);
    await expect(skillsPage.cardLocator(TEST_SKILL), 'catalog should finish rendering before reading the count').toBeVisible();
    const before = await skillsPage.getInstalledCount();

    await skillsPage.installFromCard(TEST_SKILL);
    cleanupSkills(TEST_SKILL);

    await expect(page.getByText(EXPECTED.installedToast), 'a success toast should appear').toBeVisible();
    await expect(skillsPage.installedBadgeLocator(TEST_SKILL), 'card should flip to the Installed badge').toBeVisible();
    await expect
      .poll(() => skillsPage.getInstalledCount(), { message: 'Installed count should increment by 1' })
      .toBe(before + 1);
  });

test('TC-04: Verify that removing a skill from its detail dialog reverts the card and count',
  { tag: ['@critical'] },
  async ({ skillsPage, page }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.installFromCard(TEST_SKILL);
    await expect(skillsPage.installedBadgeLocator(TEST_SKILL), 'setup: skill should be installed first').toBeVisible();
    const before = await skillsPage.getInstalledCount();

    await skillsPage.removeFromDetails(TEST_SKILL);

    await expect(page.getByText(EXPECTED.removedToast), 'a removal toast should appear').toBeVisible();
    await expect(skillsPage.installButtonLocator(TEST_SKILL), 'card should revert to an Install button').toBeVisible();
    await expect
      .poll(() => skillsPage.getInstalledCount(), { message: 'Installed count should decrement by 1' })
      .toBe(before - 1);
  });

test('TC-05: Verify that the Installed tab lists only installed skills with a direct Uninstall action',
  { tag: ['@regression'] },
  async ({ skillsPage }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.openInstalledTab();
    await expect(skillsPage.installedRowLocator(EXISTING_INSTALLED_SKILL), 'installed skill should appear as a row').toBeVisible();
    await expect(
      skillsPage.installedRowLocator(TEST_SKILL),
      'a never-installed skill should NOT appear in the Installed tab',
    ).toHaveCount(0);
  });

test('TC-06: Verify that Uninstall from the Installed tab removes the skill with no confirmation dialog',
  { tag: ['@critical'] },
  async ({ skillsPage, page }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.installFromCard(TEST_SKILL);
    await expect(skillsPage.installedBadgeLocator(TEST_SKILL), 'setup: skill should be installed first').toBeVisible();

    await skillsPage.uninstallFromInstalledTab(TEST_SKILL);

    await expect(page.getByRole('dialog'), 'no confirmation dialog should appear on uninstall').toHaveCount(0);
    await expect(skillsPage.installedRowLocator(TEST_SKILL), 'skill should be removed from the Installed tab').toHaveCount(0);
  });

test('TC-07: Verify that the search box filters the skill catalog by name',
  { tag: ['@regression'] },
  async ({ skillsPage }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.search(TEST_SKILL);
    await expect(skillsPage.cardLocator(TEST_SKILL), 'matching skill should remain visible').toBeVisible();
    await expect(skillsPage.cardLocator(EXISTING_INSTALLED_SKILL), 'non-matching skill should be filtered out').toHaveCount(0);
  });

test('TC-08: Verify that the source filter buttons narrow the catalog grid',
  { tag: ['@regression'] },
  async ({ skillsPage, page }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.selectSourceFilter('VelaOps (4)');
    const cardCount = await page.getByRole('button', { name: /^View details for/ }).count();
    expect(cardCount, 'VelaOps filter should narrow the grid to exactly 4 skills').toBe(4);
  });

test('TC-09: Verify that Create Skill opens a form with all required fields',
  { tag: ['@regression'] },
  async ({ skillsPage }) => {
    await skillsPage.open(AGENT_ID);
    await skillsPage.openCreateSkillDialog();
    await expect(skillsPage.createDialogHeadingLocator(), 'Create Skill dialog should open').toBeVisible();
  });

test('TC-10: Verify that creating a custom skill adds it to the Installed list',
  { tag: ['@smoke', '@critical'] },
  async ({ skillsPage, cleanupSkills }) => {
    const skill = newSkill();

    await skillsPage.open(AGENT_ID);
    await skillsPage.openCreateSkillDialog();
    await skillsPage.fillCreateSkillFields(skill);
    await skillsPage.submitCreateSkill();
    cleanupSkills(skill.name);

    await skillsPage.openInstalledTab();
    await expect(
      skillsPage.installedRowLocator(skill.name),
      'newly created custom skill should appear in the Installed tab',
    ).toBeVisible();
  });

// TestRail case 62031. An already-installed skill's card never renders an Install control at all
// (confirmed live) - the only path back into its detail view offers Remove, never Install again.
// That structural absence is itself the block: there is no UI path to trigger a second install.
test('TC-11: Verify that attempting to install an already-installed skill is blocked with no duplicate entry created',
  { tag: ['@regression', '@case-62031'] },
  async ({ skillsPage }) => {
    await skillsPage.open(AGENT_ID);
    await expect(skillsPage.installedBadgeLocator(EXISTING_INSTALLED_SKILL), 'precondition: skill should already be installed').toBeVisible();
    await expect(
      skillsPage.installButtonLocator(EXISTING_INSTALLED_SKILL),
      'an already-installed skill card should have no Install control to trigger a duplicate',
    ).toHaveCount(0);

    await skillsPage.openDetails(EXISTING_INSTALLED_SKILL);
    await expect(skillsPage.detailRemoveButtonLocator(), 'detail view should offer Remove').toBeVisible();
    await expect(
      skillsPage.detailInstallButtonLocator(),
      'detail view should never offer Install for an already-installed skill',
    ).toHaveCount(0);
    await skillsPage.closeDetails();
  });

test('TC-12: Verify that using a non-existent agent ID on the Skills page shows a clear Agent not found state',
  { tag: ['@regression', '@case-62040'] },
  async ({ skillsPage, page }) => {
    await skillsPage.open(INVALID_AGENT_ID);
    await expect(page.getByRole('heading', { name: EXPECTED.agentNotFoundHeading }), 'an invalid agent id should show a clear not-found state').toBeVisible();
    await expect(page.getByText(EXPECTED.agentNotFoundText), 'the not-found state should explain why').toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to agents' }), 'a way back to the dashboard should be offered').toBeVisible();
  });

test('TC-13: Verify that a deleted custom skill is permanently gone with no way to recover it',
  { tag: ['@critical', '@case-62038'] },
  async ({ skillsPage, cleanupSkills }) => {
    const skill = newSkill();
    await skillsPage.open(AGENT_ID);
    await skillsPage.openCreateSkillDialog();
    await skillsPage.fillCreateSkillFields(skill);
    await skillsPage.submitCreateSkill();
    cleanupSkills(skill.name);

    await skillsPage.openInstalledTab();
    await expect(skillsPage.installedRowLocator(skill.name), 'precondition: custom skill should be installed').toBeVisible();

    await skillsPage.uninstallFromInstalledTab(skill.name);
    await expect(skillsPage.installedRowLocator(skill.name), 'skill should be gone from the Installed tab').toHaveCount(0);

    await skillsPage.openBrowseTab();
    await skillsPage.search(skill.name);
    await expect(
      skillsPage.cardLocator(skill.name),
      'a deleted custom skill should leave no ghost entry anywhere in the catalog',
    ).toHaveCount(0);
  });

// TestRail case 62037. Actual live behavior (confirmed 2026-07-20): the backend correctly rejects
// a duplicate custom skill name (409 on POST .../install-custom, no duplicate row created), but
// the dialog shows no visible error/rename prompt of any kind - the user has no feedback at all.
// See findings/skills.txt. This asserts the spec-intended "prompts for a different name" behavior,
// which currently fails against the real app - the failure is the documented evidence of the gap.
test('TC-14: Verify that creating a custom skill with an already-used name prompts for a different name',
  { tag: ['@regression', '@case-62037'] },
  async ({ skillsPage, cleanupSkills, page }) => {
    const skill = newSkill();
    await skillsPage.open(AGENT_ID);
    await skillsPage.openCreateSkillDialog();
    await skillsPage.fillCreateSkillFields(skill);
    await skillsPage.submitCreateSkill();
    cleanupSkills(skill.name);
    await expect(skillsPage.installedRowLocator(skill.name), 'precondition: skill should be created once').toBeVisible();

    await skillsPage.openBrowseTab();
    await skillsPage.openCreateSkillDialog();
    await skillsPage.fillCreateSkillFields(skill);
    await skillsPage.submitCreateSkill();

    await expect(
      page.getByText(EXPECTED.duplicateNameConflictPattern),
      'reusing an existing custom skill name should prompt the user for a different name - see findings/skills.txt',
    ).toBeVisible();
    await skillsPage.cancelCreateSkillDialog();
  });
