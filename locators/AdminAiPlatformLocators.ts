import type { Locator, Page } from '@playwright/test';

export class AdminAiPlatformLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'AI Platform', level: 1 });
  subtitle = this.page.getByText('LiteLLM keys, models and OpenRouter credit.');

  creditHeading = this.page.getByRole('heading', { name: 'OpenRouter Credit' });
  modelConfigurationHeading = this.page.getByRole('heading', { name: 'Model Configuration' });
  virtualKeysHeading = this.page.getByRole('heading', { name: 'Virtual API Keys' });
  activityHeading = this.page.getByRole('heading', { name: "Today's Activity" });
  liteLlmHeading = this.page.getByRole('heading', { name: 'LiteLLM Dashboard' });

  statLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true });
  }

  refreshButtons = this.page.getByRole('button', { name: 'Refresh' });
  reminderInput = this.page.getByRole('spinbutton', { name: 'Reminder at (USD)' });
  warningInput = this.page.getByRole('spinbutton', { name: 'Warning at (USD)' });
  saveThresholdsButton = this.page.getByRole('button', { name: 'Save thresholds' });
  lastCheckedText = this.page.getByText(/^Last checked /);

  modelName(modelName: string): Locator {
    return this.page.getByText(modelName, { exact: true });
  }

  keysTable = this.page.getByRole('table');
  cleanupOrphanedButton = this.page.getByRole('button', { name: 'Cleanup Orphaned' });

  keyColumn(columnName: string): Locator {
    return this.keysTable.getByRole('columnheader', { name: columnName, exact: true });
  }

  deleteKeyButtons = this.keysTable.getByRole('button', { name: /^Delete key / });

  activityLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true });
  }

  liteLlmNote = this.page.getByText('Full dashboard with detailed analytics, logs, and configuration');
  openDashboardLink = this.page.getByRole('link', { name: 'Open Dashboard' });
}
