import { expect, type Page } from '@playwright/test';
import { NavigationHelper } from '../helpers/NavigationHelper';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { SignUpLocators } from '../locators/SignUpLocators';
import type { NewSignUp } from '../datas/auth/AuthData';

export class SignUpPage {
  private readonly locators: SignUpLocators;

  constructor(private readonly page: Page) {
    this.locators = new SignUpLocators(page);
  }

  async open() {
    await this.page.goto('/auth/signup');
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async fillForm(record: NewSignUp) {
    await this.locators.fullNameInput.fill(record.fullName);
    await this.locators.emailInput.fill(record.email);
    await this.locators.passwordInput.fill(record.password);
  }

  async fillFullName(fullName: string) {
    await this.locators.fullNameInput.fill(fullName);
  }

  async clickCreateAccount() {
    await this.locators.createAccountButton.click();
  }

  async showPassword() {
    await this.locators.showPasswordButton.click();
  }

  async hidePassword() {
    await this.locators.hidePasswordButton.click();
  }

  async clickSignIn() {
    await NavigationHelper.clickUntilUrl(this.page, this.locators.signInLink, /\/auth\/signin/);
  }

  async mockSignUpAccepted() {
    await this.page.route('**/api/auth/sign-up/email', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  }

  async mockServerError() {
    await this.page.route('**/api/auth/sign-up/email', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal server error' }) }),
    );
  }

  async mockNetworkFailure() {
    await this.page.route('**/api/auth/sign-up/email', (route) => route.abort('failed'));
  }

  async holdSignUpRequestOpen() {
    // the request never completes, so the loading state stays on screen
    await this.page.route('**/api/auth/sign-up/email', async () => {});
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.fullNameInput).toBeVisible();
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.locators.passwordInput).toBeVisible();
    await expect(this.locators.passwordHint).toBeVisible();
    await expect(this.locators.rememberMeCheckbox).toBeVisible();
    await expect(this.locators.createAccountButton).toBeVisible();
    await expect(this.locators.signInLink).toBeVisible();
  }

  async expectCreateAccountIsDisabled() {
    await expect(this.locators.createAccountButton).toBeDisabled();
  }

  async expectCreateAccountIsEnabled() {
    await expect(this.locators.createAccountButton).toBeEnabled();
  }

  async expectNoFieldErrorAfterBlurringEmptyFields() {
    await this.locators.fullNameInput.focus();
    await this.locators.emailInput.focus();
    await this.locators.passwordInput.focus();
    await this.locators.fullNameInput.focus();
    await expect(this.locators.fullNameRequiredError).toBeHidden();
    await expect(this.locators.invalidEmailError).toBeHidden();
    await expect(this.locators.passwordTooShortError).toBeHidden();
  }

  async expectFullNameRequiredError() {
    await expect(this.locators.fullNameRequiredError).toBeVisible();
  }

  async expectInvalidEmailError() {
    await expect(this.locators.invalidEmailError).toBeVisible();
  }

  async expectPasswordTooShortError() {
    await expect(this.locators.passwordTooShortError).toBeVisible();
  }

  async expectServerError() {
    await expect(this.locators.serverError).toBeVisible();
  }

  async expectNetworkError() {
    await expect(this.locators.networkError).toBeVisible();
  }

  async expectSignUpIsBusy() {
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

  async expectFooterLinksTargetLegalPages() {
    await expect(this.locators.homeLink).toHaveAttribute('href', '/');
    await expect(this.locators.termsLink).toHaveAttribute('href', '/terms');
    await expect(this.locators.privacyLink).toHaveAttribute('href', '/privacy');
  }
}
