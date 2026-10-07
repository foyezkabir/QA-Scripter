import type { Locator, Page } from '@playwright/test';

export class VerifyEmailLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Check your email' });

  tryAgainLink = this.page.getByRole('link', { name: 'try again' });
  signInInsteadLink = this.page.getByRole('link', { name: 'Sign in instead' });
  homeLink = this.page.getByRole('link', { name: 'VelaCrew home' });
  termsLink = this.page.getByRole('link', { name: 'Terms of Service' });
  privacyLink = this.page.getByRole('link', { name: 'Privacy Policy' });

  verificationMessageFor(email: string): Locator {
    return this.page.getByText('We sent a verification link to').filter({ hasText: email });
  }
}
