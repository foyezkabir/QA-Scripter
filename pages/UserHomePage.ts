import { expect, type Page } from '@playwright/test';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserHomeLocators } from '../locators/UserHomeLocators';

export class UserHomePage {
  private readonly locators: UserHomeLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserHomeLocators(page);
  }

  async open(firstName: string) {
    await this.page.goto('/dashboard');
    await expect(this.locators.welcomeHeading(firstName)).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openCreateMenu() {
    // the cards re-render as their data arrives and can close a menu opened too early
    await expect(async () => {
      await this.locators.createButton.click();
      await expect(this.locators.createMenu).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openMoreMenuFor(assistantName: string) {
    await expect(async () => {
      await this.locators.moreButton(assistantName).click();
      await expect(this.locators.moreMenu(assistantName)).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async expectPageIsOpen(firstName: string) {
    await expect(this.locators.welcomeHeading(firstName)).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.createButton).toBeVisible();
    await expect(this.locators.assistantsHeading).toBeVisible();
    await expect(this.locators.teamSpacesHeading).toBeVisible();
  }

  async expectAssistantCard(assistantName: string, roleName: string) {
    await expect(this.locators.assistantName(assistantName)).toBeVisible();
    await expect(this.locators.assistantRole(roleName)).toBeVisible();
    await expect(this.locators.moreButton(assistantName)).toBeVisible();
  }

  async expectCreateMenuItems() {
    await expect(this.locators.createAgentItem).toBeVisible();
    await expect(this.locators.createAgentHint).toBeVisible();
    await expect(this.locators.createTeamSpaceItem).toBeVisible();
    await expect(this.locators.createTeamSpaceHint).toBeVisible();
  }

  async expectMoreMenuOffersConfigureAndRestart(assistantName: string) {
    await expect(this.locators.configureItem(assistantName)).toBeVisible();
    await expect(this.locators.restartItem(assistantName)).toBeVisible();
  }

  async expectSecurityBanner() {
    await expect(this.locators.twoFactorText).toBeVisible();
    await expect(this.locators.enableTwoFactorLink).toHaveAttribute('href', '/settings/security');
    await expect(this.locators.dismissBannerButton).toBeVisible();
  }
}
