import type { Locator, Page } from '@playwright/test';

export class AdminAgentsLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Agents', level: 1 });
  totalAgentsHeading = this.page.getByRole('heading', { name: 'Total Agents' });
  runningHeading = this.page.getByRole('heading', { name: 'Running', level: 3 });
  stoppedHeading = this.page.getByRole('heading', { name: 'Stopped', level: 3 });
  errorHeading = this.page.getByRole('heading', { name: 'Error', level: 3 });
  allAgentsHeading = this.page.getByRole('heading', { name: 'All Agents' });

  totalAgentsSparkline = this.page.getByRole('img', { name: 'Agents created per day over the last 7 days' });
  runningSparkline = this.page.getByRole('img', { name: /Deploy and start events per day/ });
  stoppedSparkline = this.page.getByRole('img', { name: /Stop events per day/ });
  errorSparkline = this.page.getByRole('img', { name: /Failed, denied or blocked events per day/ });

  livePollingText = this.page.getByText(/Live · polling every 15s/);
  auditFeedNote = this.page.getByText('activity covers the last 1 day, not 7 - the audit feed caps at 500 events');

  searchInput = this.page.getByRole('searchbox', { name: 'Search agents by name, role or owner' });
  allFilter = this.page.getByRole('button', { name: 'All', exact: true });
  runningFilter = this.page.getByRole('button', { name: 'Running', exact: true });
  stoppedFilter = this.page.getByRole('button', { name: 'Stopped', exact: true });
  errorFilter = this.page.getByRole('button', { name: 'Error', exact: true });

  noAgentsMatchText = this.page.getByText('No agents match these filters');
  widenFilterHint = this.page.getByText('Try a different search term, or widen the status filter.');
  clearFiltersButton = this.page.getByRole('button', { name: 'Clear filters' });

  agentsTable = this.page.getByRole('table');

  columnHeader(columnName: string): Locator {
    return this.agentsTable.getByRole('columnheader', { name: columnName, exact: true });
  }

  agentRow(agentName: string): Locator {
    return this.agentsTable.getByRole('row').filter({ hasText: agentName });
  }

  statusOf(agentName: string, status: string): Locator {
    // a running row shares its status cell with the public URL, so an exact text match misses it
    return this.agentRow(agentName).getByText(status);
  }

  actionsButton(agentName: string): Locator {
    return this.page.getByRole('button', { name: `Actions for ${agentName}` });
  }

  rowMenu = this.page.getByRole('menu');
  viewDetailsItem = this.rowMenu.getByRole('menuitem', { name: 'View details' });
  deployItem = this.rowMenu.getByRole('menuitem', { name: 'Deploy' });
  stopItem = this.rowMenu.getByRole('menuitem', { name: 'Stop', exact: true });
  startItem = this.rowMenu.getByRole('menuitem', { name: 'Start', exact: true });
  viewLogsItem = this.rowMenu.getByRole('menuitem', { name: 'View logs' });
  downloadBundleItem = this.rowMenu.getByRole('menuitem', { name: 'Download bundle' });
  storageQuotaItem = this.rowMenu.getByRole('menuitem', { name: 'Storage quota' });
  reprovisionItem = this.rowMenu.getByRole('menuitem', { name: 'Reprovision' });
  deleteItem = this.rowMenu.getByRole('menuitem', { name: 'Delete' });

  detailDialog(agentName: string): Locator {
    return this.page.getByRole('dialog', { name: new RegExp(agentName) });
  }

  detailHeading(agentName: string): Locator {
    return this.detailDialog(agentName).getByRole('heading', { name: new RegExp(agentName), level: 2 });
  }

  detailLabel(agentName: string, label: string): Locator {
    return this.detailDialog(agentName).getByRole('term').filter({ hasText: new RegExp(`^${label}$`) });
  }

  detailStorageHeading(agentName: string): Locator {
    return this.detailDialog(agentName).getByRole('heading', { name: 'Storage', level: 4 });
  }

  detailLoadingUsageText(agentName: string): Locator {
    return this.detailDialog(agentName).getByText('Loading usage…');
  }

  detailCloseButton(agentName: string): Locator {
    return this.detailDialog(agentName).getByRole('button', { name: 'Close', exact: true });
  }

  logsDialog = this.page.getByRole('dialog', { name: /Container Logs/ });
  logsFilterInput = this.logsDialog.getByRole('textbox', { name: 'Filter logs…' });
  logsRefreshButton = this.logsDialog.getByRole('button', { name: 'Refresh' });
  logsCloseButton = this.logsDialog.getByRole('button', { name: 'Close', exact: true });
  logsRegexButton = this.logsDialog.getByRole('button', { name: '.*', exact: true });
  logsMatchCaseButton = this.logsDialog.getByRole('button', { name: 'Aa', exact: true });
  logsAllLevelsButton = this.logsDialog.getByRole('button', { name: 'All', exact: true });
  logsHideNoiseButton = this.logsDialog.getByRole('button', { name: 'Hide noise' });
  logsWarnErrorsButton = this.logsDialog.getByRole('button', { name: 'Warn + errors' });
  logsGroupByRunButton = this.logsDialog.getByRole('button', { name: 'Group by run' });
  logsToggleWrapButton = this.logsDialog.getByRole('button', { name: 'Toggle line wrap' });
  logsToggleAutoScrollButton = this.logsDialog.getByRole('button', { name: 'Toggle auto-scroll' });
  logsCopyLinesButton = this.logsDialog.getByRole('button', { name: 'Copy filtered lines' });
  logsDownloadLinesButton = this.logsDialog.getByRole('button', { name: 'Download all lines' });
  logsClearButton = this.logsDialog.getByRole('button', { name: /^Clear logs/ });
  logsLiveButton = this.logsDialog.getByRole('button', { name: 'Live', exact: true });
  logsLoadMoreButton = this.logsDialog.getByRole('button', { name: 'Load more (+150)' });
  logsFetchingText = this.logsDialog.getByText('Fetching logs…');

  quotaDialog = this.page.getByRole('dialog', { name: 'Storage quota' });
  quotaInput = this.quotaDialog.getByRole('spinbutton', { name: 'Quota (GB)' });
  quotaResetButton = this.quotaDialog.getByRole('button', { name: 'Reset to default' });
  quotaCancelButton = this.quotaDialog.getByRole('button', { name: 'Cancel' });
  quotaSaveButton = this.quotaDialog.getByRole('button', { name: 'Save quota' });
  quotaOverriddenNote = this.quotaDialog.getByText('Currently overridden - agent owner sees this cap, not the platform default.');
  quotaCloseButton = this.quotaDialog.getByRole('button', { name: 'Close', exact: true });
}
