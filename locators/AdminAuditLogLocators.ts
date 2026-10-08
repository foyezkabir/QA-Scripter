import type { Locator, Page } from '@playwright/test';

export class AdminAuditLogLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Audit Log', level: 1 });
  subtitle = this.page.getByText('Every provisioning and lifecycle event, newest first.');
  sectionHeading = this.page.getByRole('heading', { name: 'Audit Log', level: 2 });
  totalCount = this.page.getByText(/\(Total: \d+\)/);

  actionFilter = this.page.getByRole('combobox', { name: 'Filter by action' });

  actionOption(optionName: string): Locator {
    return this.actionFilter.getByRole('option', { name: optionName, exact: true });
  }

  refreshButton = this.page.getByRole('button', { name: 'Refresh' });

  eventsTable = this.page.getByRole('table');

  columnHeader(columnName: string): Locator {
    return this.eventsTable.getByRole('columnheader', { name: columnName, exact: true });
  }

  eventRows = this.eventsTable.getByRole('row').filter({ has: this.page.getByRole('cell') });

  eventRowsWithoutAction(actionName: string): Locator {
    return this.eventRows.filter({ hasNotText: actionName });
  }

  pagination = this.page.getByRole('navigation', { name: 'Pagination' });

  showingText(range: string): Locator {
    return this.pagination.getByText(new RegExp(`Showing ${range} of \\d+ events`));
  }

  previousButton = this.pagination.getByRole('button', { name: 'Previous' });
  nextButton = this.pagination.getByRole('button', { name: 'Next' });

  noEntriesText = this.page.getByText('No audit log entries');
  noEntriesHint = this.page.getByText('Provisioning and lifecycle events appear here as soon as they happen.');
  noReprovisionText = this.page.getByText('No reprovision events');
  noActionHint = this.page.getByText('Nothing has been recorded for this action yet. Try All Actions.');
  clearFiltersButton = this.page.getByRole('button', { name: 'Clear filters' });

  couldNotLoadText = this.page.getByText('Could not load this');
  tryAgainButton = this.page.getByRole('button', { name: 'Try again' });

  errorMessage(message: string): Locator {
    return this.page.getByText(message, { exact: true });
  }
}
