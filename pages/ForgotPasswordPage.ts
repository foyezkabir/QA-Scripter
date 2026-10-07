import { expect, type Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/NavigationHelper';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { ForgotPasswordLocators } from '../locators/ForgotPasswordLocators';

export class ForgotPasswordPage {
  private readonly locators: ForgotPasswordLocators;

  constructor(private readonly page: Page) {
    this.locators = new ForgotPasswordLocators(page);
  }

  async open() {
    await this.page.goto('/auth/forgot-password');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async fillEmail(email: string) {
    await this.locators.emailInput.fill(email);
  }

  async clickSendResetLink() {
    await this.locators.sendResetLinkButton.click();
  }

  async clickBackToSignIn() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.backToSignInLink, /\/auth\/signin/);
  }

  async mockResetRequestAccepted() {
    await this.page.route('**/api/auth/request-password-reset', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: true }) }),
    );
  }

  async mockTooManyRequests() {
    await this.page.route('**/api/auth/request-password-reset', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Too many requests. Please try again later.' }),
      }),
    );
  }

  async mockServerError() {
    await this.page.route('**/api/auth/request-password-reset', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal server error' }) }),
    );
  }

  async mockNetworkFailure() {
    await this.page.route('**/api/auth/request-password-reset', (route) => route.abort('failed'));
  }

  async holdResetRequestOpen() {
    // the request never completes, so the loading state stays on screen
    await this.page.route('**/api/auth/request-password-reset', async () => {});
  }

  async blockResetRequests() {
    // aborts any reset request so a real email can never be sent while probing validation
    await this.page.route('**/api/auth/request-password-reset', (route) => route.abort('failed'));
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.locators.sendResetLinkButton).toBeVisible();
    await expect(this.locators.backToSignInLink).toBeVisible();
  }

  async expectSendResetLinkIsDisabled() {
    await expect(this.locators.sendResetLinkButton).toBeDisabled();
  }

  async expectSendResetLinkIsEnabled() {
    await expect(this.locators.sendResetLinkButton).toBeEnabled();
  }

  async expectEmailRejectedByBrowserValidation() {
    await expect.poll(() => this.locators.emailInput.evaluate((field: HTMLInputElement) => field.validity.typeMismatch)).toBe(true);
    await expect(this.locators.checkYourEmailHeading).toBeHidden();
  }

  async expectResetRequestIsBusy() {
    await expect(this.locators.busySubmitButton).toBeDisabled();
  }

  async expectResetInstructionsSentFor(email: string) {
    await expect(this.locators.checkYourEmailHeading).toBeVisible();
    await expect(this.locators.resetInstructionsSentFor(email)).toBeVisible();
    await expect(this.locators.emailInput).toBeHidden();
  }

  async expectTooManyRequestsError() {
    await expect(this.locators.tooManyRequestsError).toBeVisible();
  }

  async expectServerError() {
    await expect(this.locators.serverError).toBeVisible();
  }

  async expectNetworkError() {
    await expect(this.locators.networkError).toBeVisible();
  }

  async expectFooterLinksTargetLegalPages() {
    await expect(this.locators.homeLink).toHaveAttribute('href', '/');
    await expect(this.locators.termsLink).toHaveAttribute('href', '/terms');
    await expect(this.locators.privacyLink).toHaveAttribute('href', '/privacy');
  }
}
