import type { Page } from '@playwright/test';

export class SignInLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Welcome back', exact: true });

  emailInput = this.page.getByRole('textbox', { name: 'Work email' });
  passwordInput = this.page.getByLabel('Password', { exact: true });
  rememberMeCheckbox = this.page.getByRole('checkbox', { name: 'Remember me' });
  showPasswordButton = this.page.getByRole('button', { name: 'Show password' });
  hidePasswordButton = this.page.getByRole('button', { name: 'Hide password' });
  signInButton = this.page.getByRole('button', { name: 'Sign in', exact: true });

  googleButton = this.page.getByRole('button', { name: 'Google' });
  microsoftButton = this.page.getByRole('button', { name: 'Microsoft' });

  forgotPasswordLink = this.page.getByRole('link', { name: 'Forgot password?' });
  createAccountLink = this.page.getByRole('link', { name: 'Create an account' });
  homeLink = this.page.getByRole('link', { name: 'VelaCrew home' });
  termsLink = this.page.getByRole('link', { name: 'Terms of Service' });
  privacyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

  // the banner is a plain div with no ARIA role (checked live), so no role locator can match it
  // while submitting, the spinner replaces the button text so it has no accessible name
  busySubmitButton = this.page.locator('form button[type="submit"]');

  invalidCredentialsError = this.page.getByText('Invalid email or password');
  emailNotVerifiedError = this.page.getByText('Email not verified', { exact: true });
  tooManyRequestsError = this.page.getByText('Too many requests. Please try again later.');
  passwordUpdatedBanner = this.page.getByText('Password updated. Sign in with your new password.');
}
