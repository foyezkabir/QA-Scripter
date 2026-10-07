import { expect, type Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/NavigationHelper';
import { VerifyEmailLocators } from '../locators/VerifyEmailLocators';

export class VerifyEmailPage {
  private readonly locators: VerifyEmailLocators;

  constructor(private readonly page: Page) {
    this.locators = new VerifyEmailLocators(page);
  }

  async openVerificationLink(link: string) {
    await this.page.goto(link);
  }

  async clickTryAgain() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.tryAgainLink, /\/auth\/signup/);
  }

  async clickSignInInstead() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.signInInsteadLink, /\/auth\/signin/);
  }

  async expectPageIsOpenFor(email: string) {
    await expect.poll(() => new URL(this.page.url()).pathname).toBe('/auth/verify-email');
    await expect.poll(() => new URL(this.page.url()).searchParams.get('email')).toBe(email);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.verificationMessageFor(email)).toBeVisible();
    await expect(this.locators.tryAgainLink).toBeVisible();
    await expect(this.locators.signInInsteadLink).toBeVisible();
  }

  async expectFooterLinksTargetLegalPages() {
    await expect(this.locators.homeLink).toHaveAttribute('href', '/');
    await expect(this.locators.termsLink).toHaveAttribute('href', '/terms');
    await expect(this.locators.privacyLink).toHaveAttribute('href', '/privacy');
  }
}
