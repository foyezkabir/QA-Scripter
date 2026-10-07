import { expect, type Page } from '@playwright/test';
import { SessionLocators } from '../locators/SessionLocators';

export class SessionPage {
  private readonly locators: SessionLocators;

  constructor(private readonly page: Page) {
    this.locators = new SessionLocators(page);
  }

  async openDashboard() {
    await this.page.goto('/dashboard');
  }

  async openAccountMenu() {
    await this.locators.accountButton.click();
  }

  async signOut() {
    await this.locators.signOutMenuItem.click();
  }

  async expectDashboardIsOpen() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.locators.dashboardHeading).toBeVisible();
  }

  async expectAccountMenuItems() {
    await expect(this.locators.profileMenuItem).toBeVisible();
    await expect(this.locators.helpMenuItem).toBeVisible();
    await expect(this.locators.shareFeedbackMenuItem).toBeVisible();
    await expect(this.locators.privacyPolicyMenuItem).toBeVisible();
    await expect(this.locators.termsOfServiceMenuItem).toBeVisible();
    await expect(this.locators.signOutMenuItem).toBeVisible();
  }
}
