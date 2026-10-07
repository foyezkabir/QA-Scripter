import type { Page } from '@playwright/test';

export class LegalLocators {
  constructor(private readonly page: Page) {}

  termsHeading = this.page.getByRole('heading', { level: 1, name: 'Terms of Service' });
  privacyHeading = this.page.getByRole('heading', { level: 1, name: 'Privacy Policy' });

  inReviewBadge = this.page.getByText('IN REVIEW');
  termsPlaceholderCopy = this.page.getByText('Our terms are being finalized with legal.');
  privacyPlaceholderCopy = this.page.getByText('The full policy will be published here.');

  goBackButton = this.page.getByRole('button', { name: 'Go back' });
  goToDashboardLink = this.page.getByRole('link', { name: 'Go to dashboard' });
}
