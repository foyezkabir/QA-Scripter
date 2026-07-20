import { Page, Locator } from '@playwright/test';

export const ProfileLocators = {
  // /profile (read view)
  profileHeading: (page: Page): Locator => page.getByRole('heading', { name: 'Profile', level: 1 }),
  editLink: (page: Page): Locator => page.getByRole('link', { name: 'Edit' }),

  // /profile/edit
  fullNameInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Full name' }),
  companyInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Company' }),
  roleInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Role' }),
  saveChangesButton: (page: Page): Locator => page.getByRole('button', { name: 'Save Changes' }),

  // /settings/security
  currentPasswordInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Current password' }),
  newPasswordInput: (page: Page): Locator => page.getByRole('textbox', { name: 'New password', exact: true }),
  confirmPasswordInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Confirm new password' }),
  updatePasswordButton: (page: Page): Locator => page.getByRole('button', { name: 'Update password' }),

  // /settings/privacy
  deleteAccountButton: (page: Page): Locator => page.getByRole('button', { name: 'Delete Account' }),
  deleteAccountDialog: (page: Page): Locator => page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Delete your account?' }) }),
  gotItButton: (page: Page): Locator => page.getByRole('button', { name: 'Got it' }),
};
