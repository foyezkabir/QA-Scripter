import { expect, type Page } from '@playwright/test';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { NavigationHelper } from '../helpers/NavigationHelper';
import { ResetPasswordLocators } from '../locators/ResetPasswordLocators';

export class ResetPasswordPage {
  private readonly locators: ResetPasswordLocators;

  constructor(private readonly page: Page) {
    this.locators = new ResetPasswordLocators(page);
  }

  async openFromEmailLink(link: string) {
    await this.page.goto(link);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openWithToken(token: string) {
    await this.page.goto(`/auth/reset-password?token=${token}`);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openWithoutToken() {
    await this.page.goto('/auth/reset-password');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async holdResetRequestOpen() {
    // the request never completes, so the loading state stays on screen
    await this.page.route('**/api/auth/reset-password', async () => {});
  }

  async fillPasswords(newPassword: string, confirmPassword: string) {
    await this.locators.newPasswordInput.fill(newPassword);
    await this.locators.confirmPasswordInput.fill(confirmPassword);
  }

  async clickResetPassword() {
    await this.locators.resetPasswordButton.click();
  }

  async showPassword() {
    await this.locators.showPasswordButton.click();
  }

  async hidePassword() {
    await this.locators.hidePasswordButton.click();
  }

  async clickBackToSignIn() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.backToSignInLink, /\/auth\/signin/);
  }

  async expectPageIsOpen() {
    await expect(this.page).toHaveURL(/\/auth\/reset-password/);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.newPasswordInput).toBeVisible();
    await expect(this.locators.confirmPasswordInput).toBeVisible();
    await expect(this.locators.resetPasswordButton).toBeVisible();
    await expect(this.locators.backToSignInLink).toBeVisible();
  }

  async expectResetIsDisabled() {
    await expect(this.locators.resetPasswordButton).toBeDisabled();
  }

  async expectResetRequestIsBusy() {
    await expect(this.locators.busySubmitButton).toBeDisabled();
  }

  async expectResetIsEnabled() {
    await expect(this.locators.resetPasswordButton).toBeEnabled();
  }

  async expectPasswordsDontMatchError() {
    await expect(this.locators.passwordsDontMatchError).toBeVisible();
  }

  async expectInvalidTokenError() {
    await expect(this.locators.invalidTokenError).toBeVisible();
  }

  async expectMissingTokenError() {
    await expect(this.locators.missingTokenError).toBeVisible();
  }

  async expectNoErrorBeforeSubmitting() {
    await expect(this.locators.invalidTokenError).toBeHidden();
    await expect(this.locators.missingTokenError).toBeHidden();
    await expect(this.locators.passwordsDontMatchError).toBeHidden();
  }

  async expectBothPasswordsAreMasked() {
    await expect(this.locators.newPasswordInput).toHaveAttribute('type', 'password');
    await expect(this.locators.confirmPasswordInput).toHaveAttribute('type', 'password');
  }

  async expectBothPasswordsAreRevealed() {
    await expect(this.locators.newPasswordInput).toHaveAttribute('type', 'text');
    await expect(this.locators.confirmPasswordInput).toHaveAttribute('type', 'text');
    await expect(this.locators.hidePasswordButton).toBeVisible();
  }

  async expectFooterLinksTargetLegalPages() {
    await expect(this.locators.homeLink).toHaveAttribute('href', '/');
    await expect(this.locators.termsLink).toHaveAttribute('href', '/terms');
    await expect(this.locators.privacyLink).toHaveAttribute('href', '/privacy');
  }
}
