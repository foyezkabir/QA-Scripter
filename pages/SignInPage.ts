import { expect, type Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/NavigationHelper';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { SignInLocators } from '../locators/SignInLocators';
import type { Credentials } from '../datas/auth/AuthData';

const SESSION_COOKIE = '__Secure-better-auth.session_token';
const DONT_REMEMBER_COOKIE = '__Secure-better-auth.dont_remember';

export class SignInPage {
  private readonly locators: SignInLocators;

  constructor(private readonly page: Page) {
    this.locators = new SignInLocators(page);
  }

  async open() {
    await this.page.goto('/auth/signin');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openDashboardLoggedOut() {
    await this.page.goto('/dashboard');
  }

  async fillEmail(email: string) {
    await this.locators.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.locators.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.locators.signInButton.click();
  }

  async signInAs(user: Credentials) {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.clickSignIn();
  }

  async signInAsUntilAccepted(user: Credentials) {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.submitUntilSignedIn(() => this.clickSignIn());
  }

  async signInAsUntilRejected(user: Credentials) {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await expect(async () => {
      await this.clickSignIn();
      await expect(this.locators.invalidCredentialsError).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 60_000, intervals: [3_000, 5_000] });
  }

  async signInAsUntilNotVerified(user: Credentials) {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await expect(async () => {
      await this.clickSignIn();
      await expect(this.locators.emailNotVerifiedError).toBeVisible({ timeout: 20_000 });
    }).toPass({ timeout: 60_000, intervals: [3_000, 5_000] });
  }

  async pressEnterUntilSignedIn() {
    await this.submitUntilSignedIn(() => this.locators.passwordInput.press('Enter'));
  }

  async uncheckRememberMe() {
    await this.locators.rememberMeCheckbox.uncheck();
  }

  async showPassword() {
    await this.locators.showPasswordButton.click();
  }

  async hidePassword() {
    await this.locators.hidePasswordButton.click();
  }

  async clickForgotPassword() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.forgotPasswordLink, /\/auth\/forgot-password/);
  }

  async clickCreateAccount() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.createAccountLink, /\/auth\/signup/);
  }

  async clickTermsLink() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.termsLink, /\/terms/);
  }

  async clickPrivacyLink() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.privacyLink, /\/privacy/);
  }

  async mockSignInRateLimited() {
    await this.page.route('**/api/auth/sign-in/email', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Too many requests. Please try again later.' }),
      }),
    );
  }

  async holdSignInRequestOpen() {
    // the request never completes, so the loading state stays on screen
    await this.page.route('**/api/auth/sign-in/email', async () => {});
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.locators.passwordInput).toBeVisible();
    await expect(this.locators.rememberMeCheckbox).toBeVisible();
    await expect(this.locators.signInButton).toBeVisible();
  }

  async expectAllLinksAreShown() {
    await expect(this.locators.forgotPasswordLink).toBeVisible();
    await expect(this.locators.createAccountLink).toBeVisible();
    await expect(this.locators.homeLink).toBeVisible();
    await expect(this.locators.termsLink).toBeVisible();
    await expect(this.locators.privacyLink).toBeVisible();
  }

  async expectSignInIsDisabled() {
    await expect(this.locators.signInButton).toBeDisabled();
  }

  async expectSignInIsEnabled() {
    await expect(this.locators.signInButton).toBeEnabled();
  }

  async expectNoFieldErrorAfterBlurringEmptyFields() {
    await this.locators.emailInput.focus();
    await this.locators.passwordInput.focus();
    await this.locators.emailInput.focus();
    await expect(this.locators.invalidCredentialsError).toBeHidden();
    await expect(this.locators.emailInput).not.toHaveAttribute('aria-invalid', 'true');
  }

  async expectInvalidCredentialsError() {
    await expect(this.locators.invalidCredentialsError).toBeVisible();
  }

  async expectTooManyRequestsError() {
    await expect(this.locators.tooManyRequestsError).toBeVisible();
  }

  async expectEmailNotVerifiedError() {
    await expect(this.locators.emailNotVerifiedError).toBeVisible();
  }

  async expectPasswordUpdatedBanner() {
    await expect(this.page).toHaveURL(/\/auth\/signin\?reset=1/);
    await expect(this.locators.passwordUpdatedBanner).toBeVisible();
  }

  async expectStaysOnSignIn() {
    await expect(this.page).toHaveURL(/\/auth\/signin/);
  }

  async expectEmailRejectedByBrowserValidation() {
    await expect.poll(() => this.locators.emailInput.evaluate((field: HTMLInputElement) => field.validity.typeMismatch)).toBe(true);
    await this.expectStaysOnSignIn();
  }

  async expectSignInIsBusy() {
    await expect(this.locators.busySubmitButton).toBeDisabled();
    await expect(this.locators.googleButton).toBeDisabled();
    await expect(this.locators.microsoftButton).toBeDisabled();
  }

  async expectPasswordIsMasked() {
    await expect(this.locators.passwordInput).toHaveAttribute('type', 'password');
    await expect(this.locators.showPasswordButton).toBeVisible();
  }

  async expectPasswordIsRevealed() {
    await expect(this.locators.passwordInput).toHaveAttribute('type', 'text');
    await expect(this.locators.hidePasswordButton).toBeVisible();
  }

  async expectRememberMeIsChecked() {
    await expect(this.locators.rememberMeCheckbox).toBeChecked();
  }

  async expectSocialButtonsAreEnabled() {
    await expect(this.locators.googleButton).toBeEnabled();
    await expect(this.locators.microsoftButton).toBeEnabled();
  }

  async expectHomeLinkTargetsRoot() {
    await expect(this.locators.homeLink).toHaveAttribute('href', '/');
  }

  async expectPersistentSessionCookie() {
    await expect.poll(() => this.sessionCookieExpiry()).toBeGreaterThan(0);
  }

  async expectSessionOnlyCookies() {
    await expect.poll(() => this.sessionCookieExpiry()).toBe(-1);
    await expect.poll(() => this.hasCookie(DONT_REMEMBER_COOKIE)).toBe(true);
  }

  async expectRedirectedToSignInWithDashboardCallback() {
    await expect(this.page).toHaveURL(/\/auth\/signin\?callbackUrl=%2Fdashboard/);
  }

  // Dev rate-limits sign-in requests per IP ("Too many requests"); retry until the limit clears
  private async submitUntilSignedIn(submit: () => Promise<void>) {
    await expect(async () => {
      await submit();
      await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 5_000 });
    }).toPass({ timeout: 60_000, intervals: [3_000, 5_000] });
  }

  private async sessionCookieExpiry(): Promise<number> {
    const cookies = await this.page.context().cookies();
    return cookies.find((cookie) => cookie.name === SESSION_COOKIE)?.expires ?? 0;
  }

  private async hasCookie(name: string): Promise<boolean> {
    const cookies = await this.page.context().cookies();
    return cookies.some((cookie) => cookie.name === name);
  }
}
