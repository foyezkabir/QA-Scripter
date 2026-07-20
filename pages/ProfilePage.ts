import { Page, Locator } from '@playwright/test';
import { ProfileLocators } from '../locators/ProfileLocators';

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async openProfile(): Promise<void> {
    await this.page.goto('/profile');
  }

  async openProfileEdit(): Promise<void> {
    await this.page.goto('/profile/edit');
  }

  async openSecuritySettings(): Promise<void> {
    await this.page.goto('/settings/security');
  }

  async openPrivacySettings(): Promise<void> {
    await this.page.goto('/settings/privacy');
  }

  async fillProfileEdit(fields: { fullName?: string; company?: string; role?: string }): Promise<void> {
    if (fields.fullName !== undefined) await ProfileLocators.fullNameInput(this.page).fill(fields.fullName);
    if (fields.company !== undefined) await ProfileLocators.companyInput(this.page).fill(fields.company);
    if (fields.role !== undefined) await ProfileLocators.roleInput(this.page).fill(fields.role);
  }

  async submitProfileEdit(): Promise<void> {
    await ProfileLocators.saveChangesButton(this.page).click();
  }

  async fillPasswordChange(fields: { current?: string; next?: string; confirm?: string }): Promise<void> {
    if (fields.current !== undefined) await ProfileLocators.currentPasswordInput(this.page).fill(fields.current);
    if (fields.next !== undefined) await ProfileLocators.newPasswordInput(this.page).fill(fields.next);
    if (fields.confirm !== undefined) await ProfileLocators.confirmPasswordInput(this.page).fill(fields.confirm);
  }

  async submitPasswordUpdate(): Promise<void> {
    await ProfileLocators.updatePasswordButton(this.page).click();
  }

  async openDeleteAccountDialog(): Promise<void> {
    await ProfileLocators.deleteAccountButton(this.page).click();
  }

  /** Dismisses the delete-account info dialog. This module has no method that performs a real
   * account deletion - the dialog itself never offers one (confirmed live: only "Got it"/"Close"). */
  async closeDeleteAccountDialog(): Promise<void> {
    await ProfileLocators.gotItButton(this.page).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  fullNameInputLocator(): Locator {
    return ProfileLocators.fullNameInput(this.page);
  }

  companyInputLocator(): Locator {
    return ProfileLocators.companyInput(this.page);
  }

  roleInputLocator(): Locator {
    return ProfileLocators.roleInput(this.page);
  }

  updatePasswordButtonLocator(): Locator {
    return ProfileLocators.updatePasswordButton(this.page);
  }

  deleteAccountDialogLocator(): Locator {
    return ProfileLocators.deleteAccountDialog(this.page);
  }
}
