import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, AUDIT_ACTIONS, AUDIT_COLUMNS, AUDIT_ERROR_MESSAGE, AUDIT_REQUEST } from '../datas/admin/AdminData';
import { ApiMockHelper } from '../helpers/ApiMockHelper';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminAuditLogLocators } from '../locators/AdminAuditLogLocators';

export class AdminAuditLogPage {
  private readonly locators: AdminAuditLogLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminAuditLogLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/audit-log`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async holdAuditRequestOpen() {
    await ApiMockHelper.holdOpen(this.page, AUDIT_REQUEST);
  }

  async mockEmptyAuditLog() {
    await ApiMockHelper.respondWith(this.page, AUDIT_REQUEST, 200, { success: true, data: [], total: 0, limit: 50, offset: 0 });
  }

  async failAuditRequests() {
    await ApiMockHelper.fail(this.page, AUDIT_REQUEST, AUDIT_ERROR_MESSAGE);
  }

  async restoreAuditRequests() {
    await ApiMockHelper.stopMocking(this.page, AUDIT_REQUEST);
  }

  async selectAction(optionName: string) {
    await this.locators.actionFilter.selectOption({ label: optionName });
  }

  async clickNext() {
    await this.locators.nextButton.click();
  }

  async clickPrevious() {
    await this.locators.previousButton.click();
  }

  async clickRefresh() {
    await this.locators.refreshButton.click();
  }

  async clickTryAgain() {
    await this.locators.tryAgainButton.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.sectionHeading).toBeVisible();
    await expect(this.locators.totalCount).toBeVisible();
    await expect(this.locators.actionFilter).toBeVisible();
    await expect(this.locators.refreshButton).toBeVisible();
    for (const columnName of AUDIT_COLUMNS) {
      await expect(this.locators.columnHeader(columnName)).toBeVisible();
    }
    await expect(this.locators.showingText('1–50')).toBeVisible();
  }

  async expectActionOptions() {
    for (const optionName of AUDIT_ACTIONS) {
      await expect(this.locators.actionOption(optionName)).toBeAttached();
    }
  }

  async expectOnlyProvisionEvents() {
    await expect(this.locators.eventRowsWithoutAction('provision')).toHaveCount(0);
    await expect(this.locators.eventRows.first()).toContainText('provision');
  }

  async expectFirstPageNavigation() {
    await expect(this.locators.showingText('1–50')).toBeVisible();
    await expect(this.locators.previousButton).toBeDisabled();
    await expect(this.locators.nextButton).toBeEnabled();
  }

  async expectSecondPage() {
    await expect(this.locators.showingText('51–100')).toBeVisible();
    await expect(this.locators.previousButton).toBeEnabled();
  }

  async expectFirstPage() {
    await expect(this.locators.showingText('1–50')).toBeVisible();
  }

  async expectRefreshIsEnabledWithEvents() {
    await expect(this.locators.refreshButton).toBeEnabled();
    await expect(this.locators.eventRows.first()).toBeVisible();
  }

  async expectLoadingState() {
    await expect(this.locators.refreshButton).toBeDisabled();
    await expect(this.locators.eventsTable).toBeHidden();
  }

  async expectEmptyAuditLog() {
    await expect(this.locators.noEntriesText).toBeVisible();
    await expect(this.locators.noEntriesHint).toBeVisible();
  }

  async expectNoEventsForActionState() {
    await expect(this.locators.noReprovisionText).toBeVisible();
    await expect(this.locators.noActionHint).toBeVisible();
    await expect(this.locators.clearFiltersButton).toBeVisible();
  }

  async expectCouldNotLoadState() {
    await expect(this.locators.couldNotLoadText).toBeVisible();
    await expect(this.locators.errorMessage(AUDIT_ERROR_MESSAGE)).toBeVisible();
    await expect(this.locators.tryAgainButton).toBeVisible();
  }

  async expectEventsAreListed() {
    await expect(this.locators.eventRows.first()).toBeVisible();
    await expect(this.locators.couldNotLoadText).toBeHidden();
  }
}
