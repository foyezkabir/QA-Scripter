import type { Page } from '@playwright/test';

export class SignUpLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Create your account' });

  fullNameInput = this.page.getByRole('textbox', { name: 'Full name' });
  emailInput = this.page.getByRole('textbox', { name: 'Work email' });
  passwordInput = this.page.getByPlaceholder('Enter a strong password');
  passwordHint = this.page.getByText('min. 10 characters');
  rememberMeCheckbox = this.page.getByRole('checkbox', { name: 'Remember me' });
  showPasswordButton = this.page.getByRole('button', { name: 'Show password' });
  hidePasswordButton = this.page.getByRole('button', { name: 'Hide password' });
  createAccountButton = this.page.getByRole('button', { name: 'Create account' });

  googleButton = this.page.getByRole('button', { name: 'Google' });
  microsoftButton = this.page.getByRole('button', { name: 'Microsoft' });

  signInLink = this.page.getByRole('link', { name: 'Sign in' });
  homeLink = this.page.getByRole('link', { name: 'VelaCrew home' });
  termsLink = this.page.getByRole('link', { name: 'Terms of Service' });
  privacyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

  // while submitting, the spinner replaces the button text so it has no accessible name
  busySubmitButton = this.page.locator('form button[type="submit"]');

  fullNameRequiredError = this.page.getByRole('alert').filter({ hasText: 'Please enter your full name.' });
  invalidEmailError = this.page.getByRole('alert').filter({ hasText: 'Please enter a valid work email address.' });
  passwordTooShortError = this.page.getByRole('alert').filter({ hasText: 'Password must be at least 10 characters.' });

  // server-error banners are plain divs with no ARIA role (checked live), so no role locator can match them
  serverError = this.page.getByText('Internal server error');
  networkError = this.page.getByText('Failed to fetch');
}
