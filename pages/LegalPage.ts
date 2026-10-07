import { expect, type Page } from '@playwright/test';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { LegalLocators } from '../locators/LegalLocators';

export class LegalPage {
  private readonly locators: LegalLocators;

  constructor(private readonly page: Page) {
    this.locators = new LegalLocators(page);
  }

  async openTerms() {
    await this.page.goto('/terms');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openPrivacy() {
    await this.page.goto('/privacy');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async clickGoBack() {
    await this.locators.goBackButton.click();
  }

  async expectTermsPageIsOpen() {
    await expect(this.page).toHaveURL(/\/terms/);
    await expect(this.locators.termsHeading).toBeVisible();
    await expect(this.locators.inReviewBadge).toBeVisible();
    await expect(this.locators.goBackButton).toBeVisible();
    await expect(this.locators.goToDashboardLink).toBeVisible();
  }

  async expectTermsAreStillAPlaceholder() {
    await expect(this.locators.termsPlaceholderCopy).toBeVisible();
  }

  async expectPrivacyPageIsOpen() {
    await expect(this.page).toHaveURL(/\/privacy/);
    await expect(this.locators.privacyHeading).toBeVisible();
    await expect(this.locators.inReviewBadge).toBeVisible();
    await expect(this.locators.goBackButton).toBeVisible();
    await expect(this.locators.goToDashboardLink).toBeVisible();
  }

  async expectPrivacyPolicyIsStillAPlaceholder() {
    await expect(this.locators.privacyPlaceholderCopy).toBeVisible();
  }
}
