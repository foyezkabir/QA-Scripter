import { expect, type Page } from '@playwright/test';
import {
  BUILT_IN_SKILL,
  CUSTOM_SKILL_BYLINE,
  INSTALLED_SKILLS,
  NOT_INSTALLED_SKILL,
  OWN_ASSISTANT,
  SKILL_SOURCE_FILTERS,
  SKILL_TABS,
  SKILLS_SUBTITLE,
  type NewSkill,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserSkillsLocators } from '../locators/UserSkillsLocators';

export class UserSkillsPage {
  private readonly locators: UserSkillsLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserSkillsLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/skills`);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.listLoaded).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.skillsLink.click();
  }

  async chooseTab(tabName: string) {
    await this.locators.tab(tabName).click();
  }

  async searchFor(placeholder: string, query: string) {
    await this.locators.searchBox(placeholder).fill(query);
  }

  async openSkillDetails(skillName: string) {
    await this.locators.card(skillName).click();
    await expect(this.locators.detailDialog(skillName)).toBeVisible();
  }

  async closeSkillDetails(skillName: string) {
    await this.locators.detailButton(skillName, 'Close').click();
  }

  async openCreateDialog() {
    await this.locators.headerCreateSkill.click();
    await expect(this.locators.createDialog).toBeVisible();
  }

  async fillSkill(skill: NewSkill) {
    await this.locators.nameField.fill(skill.name);
    await this.locators.categoryField.fill(skill.category);
    await this.locators.whenField.fill(skill.whenToUse);
    await this.locators.stepsField.fill(skill.steps);
  }

  async saveSkill() {
    await this.locators.createSave.click();
  }

  async cancelCreateDialog() {
    await this.locators.createCancel.click();
  }

  async closeCreateDialog() {
    await this.locators.createClose.click();
  }

  async createSkill(skill: NewSkill) {
    await this.openCreateDialog();
    await this.fillSkill(skill);
    await this.saveSkill();
    await this.locators.createDialog.waitFor({ state: 'hidden' });
  }

  async clickRemove(skillName: string) {
    await this.locators.detailButton(skillName, 'Remove').click();
  }

  async clickKeepIt() {
    await this.locators.keepItButton.click();
  }

  async clickYesRemove() {
    await this.locators.yesRemoveButton.click();
  }

  async removeAutomationSkills() {
    await this.open();
    await this.chooseTab('Custom');
    const marked = await this.locators.automationCards.count();
    for (let remaining = marked; remaining > 0; remaining--) {
      await this.locators.firstAutomationCard.click();
      await this.locators.detailButton(await this.firstOpenSkillName(), 'Remove').click();
      await this.clickYesRemove();
      await this.locators.removeDialog.waitFor({ state: 'hidden' });
      await expect(this.locators.automationCards).toHaveCount(remaining - 1);
    }
  }

  private async firstOpenSkillName() {
    const title = this.page.getByRole('dialog').getByRole('heading', { level: 2 });
    return (await title.innerText()).trim();
  }

  async expectSkillsPage() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toHaveText(SKILLS_SUBTITLE);
    await expect(this.locators.headerCreateSkill).toBeVisible();
    for (const tabName of SKILL_TABS) {
      await expect(this.locators.tab(tabName)).toBeVisible();
    }
    await expect(this.locators.searchBox('Search skills...')).toBeVisible();
  }

  async expectBrowseTab() {
    for (const filterName of SKILL_SOURCE_FILTERS) {
      await expect(this.locators.sourceFilter(filterName)).toBeVisible();
    }
    await expect(this.locators.cards).not.toHaveCount(0);
    await expect(this.locators.installButtons).not.toHaveCount(0);
  }

  async expectBrowseEmpty() {
    await expect(this.locators.noSkillsFoundText).toBeVisible();
    await expect(this.locators.browseEmptyHint).toBeVisible();
  }

  async expectInstalledTab() {
    await expect(this.locators.searchBox('Search installed skills...')).toBeVisible();
    for (const skillName of INSTALLED_SKILLS) {
      await expect(this.locators.card(skillName)).toBeVisible();
    }
    await expect(this.locators.sourceFilter('All')).toBeHidden();
  }

  async expectInstalledEmpty() {
    await expect(this.locators.noSkillsFoundText).toBeVisible();
    await expect(this.locators.installedEmptyHint).toBeVisible();
  }

  async expectNoCustomSkills() {
    await expect(this.locators.noCustomHeading).toBeVisible();
    await expect(this.locators.noCustomHint).toBeVisible();
    await expect(this.locators.createSkillButtons).toHaveCount(2);
  }

  async expectCustomEmpty() {
    await expect(this.locators.noSkillsFoundText).toBeVisible();
    await expect(this.locators.customEmptyHint).toBeVisible();
  }

  async expectBuiltInDetail() {
    const name = BUILT_IN_SKILL.name;
    await expect(this.locators.detailByline(name, BUILT_IN_SKILL.byline)).toBeVisible();
    await expect(this.locators.detailFilesHeading(name)).toBeVisible();
    await expect(this.locators.detailInstalledAt(name)).toBeVisible();
    await expect(this.locators.detailButton(name, 'Close')).toBeVisible();
    await expect(this.locators.detailButton(name, 'Cancel')).toBeVisible();
    await expect(this.locators.detailButton(name, 'Remove')).toBeVisible();
  }

  async expectNotInstalledDetail() {
    const name = NOT_INSTALLED_SKILL;
    await expect(this.locators.detailDialog(name)).toBeVisible();
    await expect(this.locators.detailButton(name, 'Install')).toBeVisible();
    await expect(this.locators.detailButton(name, 'Cancel')).toBeVisible();
    await expect(this.locators.detailButton(name, 'Close')).toBeVisible();
    await expect(this.locators.detailButton(name, 'Remove')).toHaveCount(0);
  }

  async expectCreateDialog() {
    await expect(this.locators.createSubtitle).toBeVisible();
    await expect(this.locators.nameField).toBeVisible();
    await expect(this.locators.nameHint).toBeVisible();
    await expect(this.locators.categoryField).toBeVisible();
    await expect(this.locators.categoryHint).toBeVisible();
    await expect(this.locators.whenField).toBeVisible();
    await expect(this.locators.whenHint).toBeVisible();
    await expect(this.locators.stepsField).toBeVisible();
    await expect(this.locators.stepsHint).toBeVisible();
    await expect(this.locators.createClose).toBeVisible();
    await expect(this.locators.createCancel).toBeVisible();
    await expect(this.locators.createSave).toBeVisible();
  }

  async expectRequiredAlert() {
    await expect(this.locators.requiredAlert).toBeVisible();
  }

  async expectCreateDialogIsOpen() {
    await expect(this.locators.createDialog).toBeVisible();
  }

  async expectCreateDialogIsClosed() {
    await expect(this.locators.createDialog).toBeHidden();
  }

  async expectSkillIsNotListed(skillName: string) {
    await expect(this.locators.card(skillName)).toHaveCount(0);
  }

  async expectSkillWasCreated(skillName: string) {
    await expect(this.locators.createdToast).toBeVisible();
    await this.chooseTab('Custom');
    await expect(this.locators.card(skillName)).toBeVisible();
  }

  async expectDuplicateError(skillName: string) {
    await expect(this.locators.duplicateError(skillName)).toBeVisible();
    await expect(this.locators.nameField).toHaveAttribute('aria-invalid', 'true');
    await expect(this.locators.createSave).toBeDisabled();
  }

  async expectCustomDetail(skillName: string) {
    await expect(this.locators.detailByline(skillName, CUSTOM_SKILL_BYLINE)).toBeVisible();
    await expect(this.locators.detailFilesHeading(skillName)).toBeVisible();
    await expect(this.locators.detailFile(skillName, 'SKILL.md')).toBeVisible();
    await expect(this.locators.detailInstalledAt(skillName)).toBeVisible();
  }

  async expectRemoveConfirmation() {
    await expect(this.locators.removeDialog).toBeVisible();
    await expect(this.locators.removeWarning).toBeVisible();
    await expect(this.locators.keepItButton).toBeVisible();
    await expect(this.locators.yesRemoveButton).toBeVisible();
  }

  async expectSkillDetailIsStillOpen(skillName: string) {
    await expect(this.locators.removeDialog).toBeHidden();
    await expect(this.locators.detailDialog(skillName)).toBeVisible();
  }

  async expectSkillWasRemoved(skillName: string) {
    await expect(this.locators.removedToast).toBeVisible();
    await expect(this.locators.removeDialog).toBeHidden();
    await expect(this.locators.card(skillName)).toHaveCount(0);
  }

  async expectSkillsUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/skills$`));
    await expect(this.locators.heading).toBeVisible();
  }
}
