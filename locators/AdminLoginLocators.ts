import type { Locator, Page } from '@playwright/test';

export class AdminLoginLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Admin sign-in' });

  emailInput = this.page.getByLabel('Admin email');
  tokenInput = this.page.getByLabel('Admin token');
  signInButton = this.page.getByRole('button', { name: 'Sign in', exact: true });
  signingInButton = this.page.getByRole('button', { name: 'Signing in…' });

  invalidTokenError = this.page.getByText('Invalid admin token.');

  adminAccountButton = this.page.getByRole('button', { name: 'Admin account' });
  appearanceMenuItem = this.page.getByRole('menuitem', { name: /Appearance/ });
  signOutMenuItem = this.page.getByRole('menuitem', { name: 'Sign out' });
  accountMenu = this.page.getByRole('menu');

  signedInEmailMenuItem(email: string): Locator {
    return this.accountMenu.getByRole('menuitem').filter({ hasText: email });
  }

  welcomeHeading = this.page.getByRole('heading', { name: /Welcome back/ });
}
