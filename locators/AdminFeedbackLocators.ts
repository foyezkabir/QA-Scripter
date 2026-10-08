import type { Page } from '@playwright/test';

export class AdminFeedbackLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Feedback', level: 1 });
  subtitle = this.page.getByText('Reply ratings and the messages people flagged.');
  responseQualityHeading = this.page.getByRole('heading', { name: 'Response Quality' });
  negativeFeedbackHeading = this.page.getByRole('heading', { name: 'Recent Negative Feedback' });

  refreshButton = this.page.getByRole('button', { name: 'Refresh' });

  noFeedbackText = this.page.getByText('No feedback data yet');
  noFeedbackHint = this.page.getByText('Ratings appear here once people start liking or disliking agent replies in chat.');
  noNegativeFeedbackText = this.page.getByText('No negative feedback yet.');

  couldNotLoadText = this.page.getByText('Could not load this');
  errorMessage = this.page.getByText('Feedback is unavailable', { exact: true });
  tryAgainButton = this.page.getByRole('button', { name: 'Try again' });
  negativeListNotLoadedText = this.page.getByText('This list could not be loaded. The counts above are unaffected.');
}
