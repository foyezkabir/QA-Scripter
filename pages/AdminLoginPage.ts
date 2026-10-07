import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, type AdminCredentials } from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminLoginLocators } from '../locators/AdminLoginLocators';

export class AdminLoginPage {
  private readonly locators: AdminLoginLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminLoginLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/login`);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openPath(path: string) {
    await this.page.goto(`${ADMIN_URL}${path}`);
  }

  async fillEmail(email: string) {
    await this.locators.emailInput.fill(email);
  }

  async fillToken(token: string) {
    await this.locators.tokenInput.fill(token);
  }

  async fillCredentials(credentials: AdminCredentials) {
    await this.fillEmail(credentials.email);
    await this.fillToken(credentials.token);
  }

  async clickSignIn() {
    await this.locators.signInButton.click();
  }

  async signInAs(credentials: AdminCredentials) {
    await this.open();
    await this.fillCredentials(credentials);
    await this.clickSignIn();
  }

  async holdVerifyRequestOpen() {
    // the verify call never completes, so the loading state stays on screen
    await this.page.route('**/api/admin-auth/verify', async () => {});
  }

  async openAccountMenu() {
    await HydrationHelper.waitUntilHydrated(this.page);
    // the dashboard re-renders as its data arrives and can close a menu opened too early
    await expect(async () => {
      await this.locators.adminAccountButton.click();
      await expect(this.locators.accountMenu).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async clickSignOut() {
    await this.locators.signOutMenuItem.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.locators.tokenInput).toBeVisible();
    await expect(this.locators.signInButton).toBeVisible();
  }

  async expectSignInIsDisabled() {
    await expect(this.locators.signInButton).toBeDisabled();
  }

  async expectSignInIsEnabled() {
    await expect(this.locators.signInButton).toBeEnabled();
  }

  async expectInvalidTokenError() {
    await expect(this.locators.invalidTokenError).toBeVisible();
    await expect(this.page).toHaveURL(/\/admin\/login$/);
  }

  async expectSigningInState() {
    await expect(this.locators.signingInButton).toBeDisabled();
    await expect(this.locators.emailInput).toBeDisabled();
    await expect(this.locators.tokenInput).toBeDisabled();
  }

  async expectSignedIn() {
    await expect(this.page).toHaveURL(/\/admin$/);
    await expect(this.locators.welcomeHeading).toBeVisible();
  }

  async expectRedirectedToLoginWithoutQuery() {
    await expect(this.page).toHaveURL(/\/admin\/login$/);
    await expect(this.locators.heading).toBeVisible();
  }

  async expectAccountMenuListsEmailAppearanceAndSignOut(email: string) {
    await expect(this.locators.signedInEmailMenuItem(email)).toBeDisabled();
    await expect(this.locators.appearanceMenuItem).toBeVisible();
    await expect(this.locators.signOutMenuItem).toBeVisible();
  }
}
