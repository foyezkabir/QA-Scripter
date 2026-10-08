import { expect, type Page } from '@playwright/test';
import {
  ADMIN_URL,
  CHAT_VIEW_OPTIONS,
  SUSPEND_DEFAULT_REASON,
  TOP_UP_DEFAULT_AMOUNT,
  USER_COLUMNS,
  USER_DETAIL_LABELS,
} from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminUsersLocators } from '../locators/AdminUsersLocators';

export class AdminUsersPage {
  private readonly locators: AdminUsersLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminUsersLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/users`);
    await expect(this.locators.allUsersHeading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async search(query: string) {
    await this.locators.searchInput.fill(query);
  }

  async clickClearFilters() {
    await this.locators.clearFiltersButton.click();
  }

  async clickActiveFilter() {
    await this.locators.activeFilter.click();
  }

  async clickUnverifiedFilter() {
    await this.locators.unverifiedFilter.click();
  }

  async clickSuspendedFilter() {
    await this.locators.suspendedFilter.click();
  }

  async openRowMenu(userEmail: string) {
    // the list re-reads on focus and can close a menu opened mid-refresh
    await expect(async () => {
      await this.locators.actionsButton(userEmail).click();
      await expect(this.locators.rowMenu).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openDetailsFor(userEmail: string) {
    await this.openRowMenu(userEmail);
    await this.locators.viewDetailsItem.click();
  }

  async openTopUpFor(userEmail: string) {
    await this.openRowMenu(userEmail);
    await this.locators.topUpItem.click();
  }

  async openSuspendFor(userEmail: string) {
    await this.openRowMenu(userEmail);
    await this.locators.suspendItem.click();
  }

  async closeDetails(userName: string) {
    await this.locators.detailCloseButton(userName).click();
  }

  async cancelTopUp() {
    await this.locators.topUpCancelButton.click();
  }

  async cancelSuspend() {
    await this.locators.suspendCancelButton.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.totalUsersHeading).toBeVisible();
    await expect(this.locators.activeHeading).toBeVisible();
    await expect(this.locators.unverifiedHeading).toBeVisible();
    await expect(this.locators.suspendedHeading).toBeVisible();
    await expect(this.locators.signupsSparkline).toBeVisible();
    await expect(this.locators.activeSparkline).toBeVisible();
    await expect(this.locators.unverifiedSparkline).toBeVisible();
    await expect(this.locators.suspendedSparkline).toBeVisible();
    await expect(this.locators.allUsersHeading).toBeVisible();
    await expect(this.locators.searchInput).toBeVisible();
    await expect(this.locators.allFilter).toBeVisible();
    await expect(this.locators.activeFilter).toBeVisible();
    await expect(this.locators.unverifiedFilter).toBeVisible();
    await expect(this.locators.suspendedFilter).toBeVisible();
  }

  async expectLiveNotes() {
    await expect(this.locators.liveText).toBeVisible();
    await expect(this.locators.auditFeedNote).toBeVisible();
  }

  async expectTableColumns() {
    for (const columnName of USER_COLUMNS) {
      await expect(this.locators.columnHeader(columnName)).toBeVisible();
    }
  }

  async expectOnlyUserRow(userEmail: string) {
    await expect(this.locators.userRow(userEmail)).toHaveCount(1);
    await expect(this.page).toHaveURL(new RegExp(`[?&]q=${encodeURIComponent(userEmail).replace(/%40/g, '(@|%40)')}`));
  }

  async expectNoUsersMatchState() {
    await expect(this.locators.noUsersMatchText).toBeVisible();
    await expect(this.locators.clearFiltersButton).toBeVisible();
  }

  async expectFiltersCleared() {
    await expect(this.locators.noUsersMatchText).toBeHidden();
    await expect(this.locators.searchInput).toHaveValue('');
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'true');
  }

  async expectAllFilterIsPressedByDefault() {
    await expect(this.locators.allFilter).toHaveAttribute('aria-pressed', 'true');
  }

  async expectActiveFilterIsApplied() {
    await expect(this.locators.activeFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=active/);
  }

  async expectUnverifiedFilterIsApplied() {
    await expect(this.locators.unverifiedFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=unverified/);
  }

  async expectSuspendedFilterIsApplied() {
    await expect(this.locators.suspendedFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(this.page).toHaveURL(/[?&]status=suspended/);
  }

  async expectActiveAdminMenuItems() {
    await expect(this.locators.viewDetailsItem).toBeVisible();
    await expect(this.locators.demoteItem).toBeVisible();
    await expect(this.locators.refreshLimitsItem).toBeVisible();
    await expect(this.locators.topUpItem).toBeVisible();
    await expect(this.locators.suspendItem).toBeVisible();
  }

  async expectDemoteAndSuspendAreDisabled() {
    await expect(this.locators.demoteItem).toBeDisabled();
    await expect(this.locators.suspendItem).toBeDisabled();
  }

  async expectDetailDialogShowsUserFields(userName: string, userEmail: string) {
    await expect(this.locators.detailDialog(userName)).toBeVisible();
    await expect(this.locators.detailEmail(userName, userEmail)).toBeVisible();
    for (const label of USER_DETAIL_LABELS) {
      await expect(this.locators.detailLabel(userName, label)).toBeVisible();
    }
    await expect(this.locators.detailChatToolViewLabel(userName)).toBeVisible();
  }

  async expectChatToolViewOptions(userName: string) {
    for (const optionName of CHAT_VIEW_OPTIONS) {
      await expect(this.locators.detailChatToolViewSelect(userName).getByRole('option', { name: optionName, exact: true })).toBeAttached();
    }
  }

  async expectDetailDialogIsClosed(userName: string) {
    await expect(this.locators.detailDialog(userName)).toBeHidden();
  }

  async expectTopUpDialogShowsDefaults(userEmail: string) {
    await expect(this.locators.topUpDialog.getByText(userEmail)).toBeVisible();
    await expect(this.locators.topUpAmountInput).toHaveValue(TOP_UP_DEFAULT_AMOUNT);
    await expect(this.locators.topUpNoteInput).toBeVisible();
    await expect(this.locators.topUpCloseButton).toBeVisible();
    await expect(this.locators.topUpCancelButton).toBeVisible();
    await expect(this.locators.topUpConfirmButton).toBeVisible();
  }

  async expectTopUpDialogIsClosed() {
    await expect(this.locators.topUpDialog).toBeHidden();
  }

  async expectSuspendDialogShowsDefaults() {
    await expect(this.locators.suspendDialog).toBeVisible();
    await expect(this.locators.suspendWarning).toBeVisible();
    await expect(this.locators.suspendReasonInput).toHaveValue(SUSPEND_DEFAULT_REASON);
    await expect(this.locators.suspendExpiresInput).toHaveValue('');
    await expect(this.locators.suspendCloseButton).toBeVisible();
    await expect(this.locators.suspendCancelButton).toBeVisible();
    await expect(this.locators.suspendConfirmButton).toBeVisible();
  }

  async expectSuspendDialogIsClosed() {
    await expect(this.locators.suspendDialog).toBeHidden();
  }
}
