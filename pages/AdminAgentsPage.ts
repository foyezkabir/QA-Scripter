import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, AGENT_COLUMNS, AGENT_DETAIL_LABELS } from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminAgentsLocators } from '../locators/AdminAgentsLocators';

export class AdminAgentsPage {
  private readonly locators: AdminAgentsLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminAgentsLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/agents`);
    await expect(this.locators.allAgentsHeading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async search(query: string) {
    await this.locators.searchInput.fill(query);
  }

  async clickClearFilters() {
    await this.locators.clearFiltersButton.click();
  }

  async clickAllFilter() {
    await this.locators.allFilter.click();
  }

  async clickRunningFilter() {
    await this.locators.runningFilter.click();
  }

  async clickStoppedFilter() {
    await this.locators.stoppedFilter.click();
  }

  async clickErrorFilter() {
    await this.locators.errorFilter.click();
  }

  async openRowMenu(agentName: string) {
    // the list re-renders on each 15s poll and can close a menu opened mid-refresh
    await expect(async () => {
      await this.locators.actionsButton(agentName).click();
      await expect(this.locators.rowMenu).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openDetailsFor(agentName: string) {
    await this.openRowMenu(agentName);
    await this.locators.viewDetailsItem.click();
  }

  async openLogsFor(agentName: string) {
    await this.openRowMenu(agentName);
    await this.locators.viewLogsItem.click();
  }

  async openStorageQuotaFor(agentName: string) {
    await this.openRowMenu(agentName);
    await this.locators.storageQuotaItem.click();
  }

  async closeDetails(agentName: string) {
    await this.locators.detailCloseButton(agentName).click();
  }

  async cancelStorageQuota() {
    await this.locators.quotaCancelButton.click();
  }

  async stopAgent(agentName: string) {
    await this.openRowMenu(agentName);
    await this.locators.stopItem.click();
  }

  async startAgent(agentName: string) {
    await this.openRowMenu(agentName);
    await this.locators.startItem.click();
  }

  async saveStorageQuota(gigabytes: string) {
    await this.locators.quotaInput.fill(gigabytes);
    await this.locators.quotaSaveButton.click();
  }

  async resetStorageQuotaToDefault() {
    await this.locators.quotaResetButton.click();
  }

  async restoreAgentState(agentName: string) {
    await this.open();
    await this.search(agentName);
    await this.openRowMenu(agentName);
    if (await this.locators.startItem.isVisible()) {
      await this.locators.startItem.click();
      await this.locators.statusOf(agentName, 'Running').waitFor({ timeout: 45_000 });
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.openStorageQuotaFor(agentName);
    if (await this.locators.quotaResetButton.isEnabled()) {
      await this.locators.quotaResetButton.click();
    } else {
      await this.locators.quotaCancelButton.click();
    }
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.totalAgentsHeading).toBeVisible();
    await expect(this.locators.runningHeading).toBeVisible();
    await expect(this.locators.stoppedHeading).toBeVisible();
    await expect(this.locators.errorHeading).toBeVisible();
    await expect(this.locators.totalAgentsSparkline).toBeVisible();
    await expect(this.locators.runningSparkline).toBeVisible();
    await expect(this.locators.stoppedSparkline).toBeVisible();
    await expect(this.locators.errorSparkline).toBeVisible();
    await expect(this.locators.allAgentsHeading).toBeVisible();
    await expect(this.locators.searchInput).toBeVisible();
    await expect(this.locators.allFilter).toBeVisible();
    await expect(this.locators.runningFilter).toBeVisible();
    await expect(this.locators.stoppedFilter).toBeVisible();
    await expect(this.locators.errorFilter).toBeVisible();
  }

  async expectLivePollingNotes() {
    await expect(this.locators.livePollingText).toBeVisible();
    await expect(this.locators.auditFeedNote).toBeVisible();
  }

  async expectTableColumns() {
    for (const columnName of AGENT_COLUMNS) {
      await expect(this.locators.columnHeader(columnName)).toBeVisible();
    }
  }

  async expectOnlyAgentRow(agentName: string) {
    await expect(this.locators.agentRow(agentName)).toHaveCount(1);
    await expect(this.page).toHaveURL(new RegExp(`[?&]q=${agentName}`));
  }

  async expectNoAgentsMatchState() {
    await expect(this.locators.noAgentsMatchText).toBeVisible();
    await expect(this.locators.widenFilterHint).toBeVisible();
    await expect(this.locators.clearFiltersButton).toBeVisible();
  }

  async expectFiltersCleared() {
    await expect(this.locators.noAgentsMatchText).toBeHidden();
    await expect(this.locators.searchInput).toHaveValue('');
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'true');
  }

  async expectAllFilterIsPressedByDefault() {
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'true');
  }

  async expectRunningFilterIsApplied() {
    await expect(this.locators.runningFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=running/);
  }

  async expectStoppedFilterIsApplied() {
    await expect(this.locators.stoppedFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=stopped/);
  }

  async expectErrorFilterIsApplied() {
    await expect(this.locators.errorFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=error/);
  }

  async expectRunningAgentMenuItems() {
    await expect(this.locators.viewDetailsItem).toBeVisible();
    await expect(this.locators.deployItem).toBeVisible();
    await expect(this.locators.stopItem).toBeVisible();
    await expect(this.locators.viewLogsItem).toBeVisible();
    await expect(this.locators.downloadBundleItem).toBeVisible();
    await expect(this.locators.storageQuotaItem).toBeVisible();
    await expect(this.locators.reprovisionItem).toBeVisible();
    await expect(this.locators.deleteItem).toBeVisible();
  }

  async expectDetailDialogShowsAgentFields(agentName: string) {
    await expect(this.locators.detailHeading(agentName)).toBeVisible();
    for (const label of AGENT_DETAIL_LABELS) {
      await expect(this.locators.detailLabel(agentName, label)).toBeVisible();
    }
    await expect(this.locators.detailStorageHeading(agentName)).toBeVisible();
  }

  async expectDetailStorageIsLoading(agentName: string) {
    await expect(this.locators.detailLoadingUsageText(agentName)).toBeVisible();
  }

  async expectDetailDialogIsClosed(agentName: string) {
    await expect(this.locators.detailDialog(agentName)).toBeHidden();
  }

  async expectLogsDialogControls() {
    await expect(this.locators.logsFilterInput).toBeVisible();
    await expect(this.locators.logsRefreshButton).toBeVisible();
    await expect(this.locators.logsCloseButton).toBeVisible();
    await expect(this.locators.logsRegexButton).toBeVisible();
    await expect(this.locators.logsMatchCaseButton).toBeVisible();
    await expect(this.locators.logsAllLevelsButton).toBeVisible();
    await expect(this.locators.logsHideNoiseButton).toBeVisible();
    await expect(this.locators.logsWarnErrorsButton).toBeVisible();
    await expect(this.locators.logsGroupByRunButton).toBeVisible();
    await expect(this.locators.logsToggleWrapButton).toBeVisible();
    await expect(this.locators.logsToggleAutoScrollButton).toBeVisible();
    await expect(this.locators.logsCopyLinesButton).toBeVisible();
    await expect(this.locators.logsDownloadLinesButton).toBeVisible();
    await expect(this.locators.logsClearButton).toBeVisible();
    await expect(this.locators.logsLiveButton).toBeVisible();
    await expect(this.locators.logsLoadMoreButton).toBeVisible();
  }

  async expectLogsAreFetching() {
    await expect(this.locators.logsFetchingText).toBeVisible();
    await expect(this.locators.logsRefreshButton).toBeDisabled();
    await expect(this.locators.logsLoadMoreButton).toBeDisabled();
  }

  async expectStorageQuotaDialogShowsDefault() {
    await expect(this.locators.quotaInput).toBeVisible();
    await expect(this.locators.quotaResetButton).toBeDisabled();
    await expect(this.locators.quotaCancelButton).toBeVisible();
    await expect(this.locators.quotaSaveButton).toBeVisible();
    await expect(this.locators.quotaCloseButton).toBeVisible();
  }

  async expectStorageQuotaDialogIsClosed() {
    await expect(this.locators.quotaDialog).toBeHidden();
  }

  async expectAgentIsStopped(agentName: string) {
    // the list only learns the new status on its next 15s poll
    await expect(this.locators.statusOf(agentName, 'Stopped')).toBeVisible({ timeout: 45_000 });
  }

  async expectAgentIsRunning(agentName: string) {
    await expect(this.locators.statusOf(agentName, 'Running')).toBeVisible({ timeout: 45_000 });
  }

  async expectStoppedAgentMenuOffersStartInsteadOfStop() {
    await expect(this.locators.startItem).toBeVisible();
    await expect(this.locators.stopItem).toBeHidden();
  }

  async expectAgentIsListedUnderStoppedFilter(agentName: string) {
    await expect(this.locators.agentRow(agentName)).toBeVisible();
    await expect(this.locators.statusOf(agentName, 'Stopped')).toBeVisible();
  }

  async expectStorageQuotaIsOverridden(gigabytes: string) {
    await expect(this.locators.quotaInput).toHaveValue(gigabytes);
    await expect(this.locators.quotaOverriddenNote).toBeVisible();
    await expect(this.locators.quotaResetButton).toBeEnabled();
  }

  async expectStorageQuotaIsInheritedDefaultOnReopen(agentName: string) {
    // the dialog is filled from the list, which only refreshes on its 15s poll after a reset
    await expect(async () => {
      await this.openStorageQuotaFor(agentName);
      try {
        await expect(this.locators.quotaOverriddenNote).toBeHidden({ timeout: 2_000 });
        await expect(this.locators.quotaResetButton).toBeDisabled({ timeout: 2_000 });
      } catch (stale) {
        await this.locators.quotaCancelButton.click();
        throw stale;
      }
    }).toPass({ timeout: 50_000 });
  }
}
