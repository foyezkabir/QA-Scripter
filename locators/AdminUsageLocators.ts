import type { Locator, Page } from '@playwright/test';

export class AdminUsageLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Usage', level: 1 });
  subtitle = this.page.getByText('Provisioning volume and integration adoption.');

  integrationAdoptionHeading = this.page.getByRole('heading', { name: 'Integration Adoption' });
  trackerImportsHeading = this.page.getByRole('heading', { name: 'Tracker Imports' });
  timelineHeading = this.page.getByRole('heading', { name: 'Agent Creation Timeline (Last 7 Days)' });
  timelineNote = this.page.getByText('This metric is calculated from audit logs. Check the Audit Log tab for detailed provisioning history.');

  statLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true });
  }

  integrationTile(integrationName: string): Locator {
    return this.page.getByText(new RegExp(`^${integrationName} \\(\\d+%\\)$`));
  }

  trackerImportRows = this.page.getByText(/^(huly|jira) · /);
}
