import { test } from '../fixtures/base';
import { newSkill, NOT_INSTALLED_SKILL, SKILL_NO_MATCH_SEARCH, BUILT_IN_SKILL } from '../datas/user/UserData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-01: Verify that the Skills page shows its heading, subtitle, Create skill, views and search', { tag: ['@smoke'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.expectSkillsPage();
});

test('TC-02: Verify that Browse shows the source filters, skill cards and Install buttons', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.expectBrowseTab();
});

test('TC-03: Verify that a Browse search with no match shows the empty message', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.searchFor('Search skills...', SKILL_NO_MATCH_SEARCH);
  await userSkillsPage.expectBrowseEmpty();
});

test('TC-04: Verify that Installed shows the six VelaCrew skills without the source filters', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.chooseTab('Installed');
  await userSkillsPage.expectInstalledTab();
});

test('TC-05: Verify that an Installed search with no match shows the empty message', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.chooseTab('Installed');
  await userSkillsPage.searchFor('Search installed skills...', SKILL_NO_MATCH_SEARCH);
  await userSkillsPage.expectInstalledEmpty();
});

test('TC-06: Verify that Custom with no custom skill shows the empty state and Create skill', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.expectNoCustomSkills();
});

test('TC-07: Verify that a Custom search with no match shows the empty message', { tag: ['@regression'] }, async ({ userSkillsPage, createdSkill }) => {
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.searchFor('Search custom skills...', SKILL_NO_MATCH_SEARCH);
  await userSkillsPage.expectCustomEmpty();
});

test('TC-08: Verify that an installed VelaCrew skill opens its details with Remove shown', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.chooseTab('Installed');
  await userSkillsPage.openSkillDetails(BUILT_IN_SKILL.name);
  await userSkillsPage.expectBuiltInDetail();
});

test('TC-09: Verify that a skill that is not installed offers Install and no Remove', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.searchFor('Search skills...', NOT_INSTALLED_SKILL);
  await userSkillsPage.openSkillDetails(NOT_INSTALLED_SKILL);
  await userSkillsPage.expectNotInstalledDetail();
});

test('TC-10: Verify that Create skill opens its form with every field, hint and button', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.expectCreateDialog();
});

test('TC-11: Verify that Save with an empty form shows the required alert', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.saveSkill();
  await userSkillsPage.expectRequiredAlert();
  await userSkillsPage.expectCreateDialogIsOpen();
});

test('TC-12: Verify that Cancel closes Create Skill without creating the skill', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  const skill = newSkill();
  await userSkillsPage.open();
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.fillSkill(skill);
  await userSkillsPage.cancelCreateDialog();
  await userSkillsPage.expectCreateDialogIsClosed();
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.expectSkillIsNotListed(skill.name);
});

test('TC-13: Verify that Close closes Create Skill', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.open();
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.closeCreateDialog();
  await userSkillsPage.expectCreateDialogIsClosed();
});

test('TC-14: Verify that saving the form creates the skill, shows a toast and lists it under Custom', { tag: ['@critical'] }, async ({ userSkillsPage, skillCleanup }) => {
  const skill = newSkill();
  await userSkillsPage.open();
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.fillSkill(skill);
  await userSkillsPage.saveSkill();
  await userSkillsPage.expectSkillWasCreated(skill.name);
});

test('TC-15: Verify that a Skill Name that already exists is rejected and Save is disabled', { tag: ['@regression'] }, async ({ userSkillsPage, createdSkill }) => {
  await userSkillsPage.openCreateDialog();
  await userSkillsPage.fillSkill(createdSkill);
  await userSkillsPage.expectDuplicateError(createdSkill.name);
});

test('TC-16: Verify that a custom skill opens its details with SKILL.md and where it is installed', { tag: ['@regression'] }, async ({ userSkillsPage, createdSkill }) => {
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.openSkillDetails(createdSkill.name);
  await userSkillsPage.expectCustomDetail(createdSkill.name);
});

test('TC-17: Verify that Remove asks for confirmation and Keep it leaves the skill open', { tag: ['@regression'] }, async ({ userSkillsPage, createdSkill }) => {
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.openSkillDetails(createdSkill.name);
  await userSkillsPage.clickRemove(createdSkill.name);
  await userSkillsPage.expectRemoveConfirmation();
  await userSkillsPage.clickKeepIt();
  await userSkillsPage.expectSkillDetailIsStillOpen(createdSkill.name);
});

test('TC-18: Verify that Yes, remove removes the skill and shows a toast', { tag: ['@critical'] }, async ({ userSkillsPage, createdSkill }) => {
  await userSkillsPage.chooseTab('Custom');
  await userSkillsPage.openSkillDetails(createdSkill.name);
  await userSkillsPage.clickRemove(createdSkill.name);
  await userSkillsPage.clickYesRemove();
  await userSkillsPage.expectSkillWasRemoved(createdSkill.name);
});

test('TC-19: Verify that the Skills link in Agent sections opens the Skills page', { tag: ['@regression'] }, async ({ userSkillsPage }) => {
  await userSkillsPage.openFromChat();
  await userSkillsPage.expectSkillsUrl();
});
