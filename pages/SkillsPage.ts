import { Page, Locator } from '@playwright/test';
import { SkillsLocators } from '../locators/SkillsLocators';

export class SkillsPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/skills`);
  }

  async openBrowseTab(): Promise<void> {
    await SkillsLocators.browseTab(this.page).click();
  }

  async openInstalledTab(): Promise<void> {
    await SkillsLocators.installedTab(this.page).click();
  }

  async search(text: string): Promise<void> {
    await SkillsLocators.searchInput(this.page).fill(text);
  }

  async selectSourceFilter(label: string): Promise<void> {
    await SkillsLocators.sourceFilter(this.page, label).click();
  }

  async openDetails(skillName: string): Promise<void> {
    await SkillsLocators.viewDetailsButton(this.page, skillName).click();
  }

  async closeDetails(): Promise<void> {
    await SkillsLocators.detailCloseButton(this.page).click();
  }

  async installFromCard(skillName: string): Promise<void> {
    await SkillsLocators.installButton(this.page, skillName).click();
  }

  async installFromDetails(skillName: string): Promise<void> {
    await this.openDetails(skillName);
    await SkillsLocators.detailInstallButton(this.page).click();
  }

  async removeFromDetails(skillName: string): Promise<void> {
    await this.openDetails(skillName);
    await SkillsLocators.detailRemoveButton(this.page).click();
  }

  async uninstallFromInstalledTab(skillName: string): Promise<void> {
    await this.openInstalledTab();
    await SkillsLocators.uninstallButton(this.page, skillName).click();
  }

  /** Uninstalls the named skill via the Installed tab if it currently exists; no-op otherwise. For fixture teardown only. */
  async uninstallIfInstalled(skillName: string): Promise<void> {
    await this.openInstalledTab();
    const count = await SkillsLocators.installedRow(this.page, skillName).count();
    if (count === 0) return;
    await SkillsLocators.uninstallButton(this.page, skillName).click();
  }

  async openCreateSkillDialog(): Promise<void> {
    await SkillsLocators.createSkillButton(this.page).click();
  }

  async fillCreateSkillFields(fields: { name?: string; category?: string; whenToUse?: string; instructions?: string }): Promise<void> {
    if (fields.name !== undefined) await SkillsLocators.skillNameInput(this.page).fill(fields.name);
    if (fields.category !== undefined) await SkillsLocators.categoryInput(this.page).fill(fields.category);
    if (fields.whenToUse !== undefined) await SkillsLocators.whenToUseInput(this.page).fill(fields.whenToUse);
    if (fields.instructions !== undefined) await SkillsLocators.instructionsInput(this.page).fill(fields.instructions);
  }

  async submitCreateSkill(): Promise<void> {
    await SkillsLocators.createSkillSubmitButton(this.page).click();
  }

  async cancelCreateSkillDialog(): Promise<void> {
    await SkillsLocators.cancelButton(this.page).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  installedTabLabelLocator(): Locator {
    return SkillsLocators.installedTab(this.page);
  }

  cardLocator(skillName: string): Locator {
    return SkillsLocators.card(this.page, skillName);
  }

  installedBadgeLocator(skillName: string): Locator {
    return SkillsLocators.installedBadge(this.page, skillName);
  }

  installButtonLocator(skillName: string): Locator {
    return SkillsLocators.installButton(this.page, skillName);
  }

  installedRowLocator(skillName: string): Locator {
    return SkillsLocators.installedRow(this.page, skillName);
  }

  createDialogHeadingLocator(): Locator {
    return SkillsLocators.createDialogHeading(this.page);
  }

  detailDialogHeadingLocator(skillName: string): Locator {
    return SkillsLocators.detailDialogHeading(this.page, skillName);
  }

  detailInstallButtonLocator(): Locator {
    return SkillsLocators.detailInstallButton(this.page);
  }

  detailRemoveButtonLocator(): Locator {
    return SkillsLocators.detailRemoveButton(this.page);
  }

  async getInstalledCount(): Promise<number> {
    const label = await SkillsLocators.installedTab(this.page).textContent();
    const match = label?.match(/\((\d+)\)/);
    return match ? Number(match[1]) : -1;
  }
}
