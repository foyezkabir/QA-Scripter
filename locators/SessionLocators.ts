import type { Page } from '@playwright/test';

export class SessionLocators {
  constructor(private readonly page: Page) {}

  dashboardHeading = this.page.getByRole('heading', { level: 1, name: /^Welcome back, / });

  accountButton = this.page.getByRole('button', { name: 'Account' });
  profileMenuItem = this.page.getByRole('menuitem', { name: 'Profile' });
  helpMenuItem = this.page.getByRole('menuitem', { name: 'Help' });
  shareFeedbackMenuItem = this.page.getByRole('menuitem', { name: 'Share Feedback' });
  privacyPolicyMenuItem = this.page.getByRole('menuitem', { name: 'Privacy Policy' });
  termsOfServiceMenuItem = this.page.getByRole('menuitem', { name: 'Terms of Service' });
  signOutMenuItem = this.page.getByRole('menuitem', { name: 'Sign Out' });
}
