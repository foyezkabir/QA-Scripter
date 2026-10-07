import type { Locator, Page } from '@playwright/test';

export class ForgotPasswordLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { level: 1, name: /Forgot your password/ });

  emailInput = this.page.getByRole('textbox', { name: 'Enter email' });
  sendResetLinkButton = this.page.getByRole('button', { name: 'Send reset link' });

  backToSignInLink = this.page.getByRole('link', { name: 'Back to sign-in' });
  homeLink = this.page.getByRole('link', { name: 'VelaCrew home' });
  termsLink = this.page.getByRole('link', { name: 'Terms of Service' });
  privacyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

  // while submitting, the spinner replaces the button text so it has no accessible name
  busySubmitButton = this.page.locator('form button[type="submit"]');

  checkYourEmailHeading = this.page.getByRole('heading', { name: 'Check your email' });
  resetInstructionsSentFor(email: string): Locator {
    return this.page.getByText("we've sent password reset instructions").filter({ hasText: email });
  }

  // error banners are plain divs with no ARIA role (checked live), so no role locator can match them
  tooManyRequestsError = this.page.getByText('Too many requests. Please try again later.');
  serverError = this.page.getByText('Internal server error');
  networkError = this.page.getByText('Failed to fetch');
}
