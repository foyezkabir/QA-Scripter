import type { Page } from '@playwright/test';

export class ResetPasswordLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { level: 1, name: /Choose a new password/ });

  newPasswordInput = this.page.getByLabel(/^New password/);
  confirmPasswordInput = this.page.getByLabel('Confirm password');
  showPasswordButton = this.page.getByRole('button', { name: 'Show password' });
  hidePasswordButton = this.page.getByRole('button', { name: 'Hide password' });
  resetPasswordButton = this.page.getByRole('button', { name: 'Reset password', exact: true });

  // while submitting, the spinner replaces the button text so it has no accessible name
  busySubmitButton = this.page.locator('form button[type="submit"]');

  backToSignInLink = this.page.getByRole('link', { name: 'Back to sign-in' });
  homeLink = this.page.getByRole('link', { name: 'VelaCrew home' });
  termsLink = this.page.getByRole('link', { name: 'Terms of Service' });
  privacyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

  // error messages are plain divs with no ARIA role (checked live), so no role locator can match them
  passwordsDontMatchError = this.page.getByText("Passwords don't match");
  invalidTokenError = this.page.getByText('Invalid token', { exact: true });
  missingTokenError = this.page.getByText('Missing reset token - open the email link again.');
}
