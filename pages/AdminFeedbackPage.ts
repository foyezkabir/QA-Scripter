import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, FEEDBACK_ERROR_MESSAGE, FEEDBACK_REQUEST } from '../datas/admin/AdminData';
import { ApiMockHelper } from '../helpers/ApiMockHelper';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminFeedbackLocators } from '../locators/AdminFeedbackLocators';

export class AdminFeedbackPage {
  private readonly locators: AdminFeedbackLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminFeedbackLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/feedback`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async mockNoFeedback() {
    await ApiMockHelper.respondWith(this.page, FEEDBACK_REQUEST, 200, { success: true, data: [] });
  }

  async holdFeedbackRequestsOpen() {
    await ApiMockHelper.holdOpen(this.page, FEEDBACK_REQUEST);
  }

  async failFeedbackRequests() {
    await ApiMockHelper.fail(this.page, FEEDBACK_REQUEST, FEEDBACK_ERROR_MESSAGE);
  }

  async restoreFeedbackRequests() {
    await ApiMockHelper.stopMocking(this.page, FEEDBACK_REQUEST);
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
    await expect(this.locators.responseQualityHeading).toBeVisible();
    await expect(this.locators.negativeFeedbackHeading).toBeVisible();
    await expect(this.locators.refreshButton).toBeVisible();
  }

  async expectNoFeedbackState() {
    await expect(this.locators.noFeedbackText).toBeVisible();
    await expect(this.locators.noFeedbackHint).toBeVisible();
    await expect(this.locators.noNegativeFeedbackText).toBeVisible();
  }

  async expectLoadingState() {
    await expect(this.locators.refreshButton).toBeDisabled();
  }

  async expectCouldNotLoadState() {
    await expect(this.locators.couldNotLoadText).toBeVisible();
    await expect(this.locators.errorMessage).toBeVisible();
    await expect(this.locators.tryAgainButton).toBeVisible();
    await expect(this.locators.negativeListNotLoadedText).toBeVisible();
  }

  async expectResponseQualityErrorIsCleared() {
    await expect(this.locators.couldNotLoadText).toBeHidden();
    await expect(this.locators.tryAgainButton).toBeHidden();
  }

  async expectRefreshIsEnabledAgain() {
    await expect(this.locators.refreshButton).toBeEnabled();
    await expect(this.locators.responseQualityHeading).toBeVisible();
  }
}
