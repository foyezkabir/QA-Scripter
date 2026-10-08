import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, AI_ACTIVITY_LABELS, AI_KEY_COLUMNS, AI_MODELS, AI_STATS } from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminAiPlatformLocators } from '../locators/AdminAiPlatformLocators';

export class AdminAiPlatformPage {
  private readonly locators: AdminAiPlatformLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminAiPlatformLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/ai-platform`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async typeReminderThreshold(amount: string) {
    await this.locators.reminderInput.fill(amount);
  }

  async typeWarningThreshold(amount: string) {
    await this.locators.warningInput.fill(amount);
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.creditHeading).toBeVisible();
    await expect(this.locators.modelConfigurationHeading).toBeVisible();
    await expect(this.locators.virtualKeysHeading).toBeVisible();
    await expect(this.locators.activityHeading).toBeVisible();
    await expect(this.locators.liteLlmHeading).toBeVisible();
  }

  async expectStatLabels() {
    for (const label of AI_STATS) {
      await expect(this.locators.statLabel(label)).toBeVisible();
    }
  }

  async expectCreditSection() {
    await expect(this.locators.statLabel('Remaining')).toBeVisible();
    await expect(this.locators.reminderInput).toBeVisible();
    await expect(this.locators.warningInput).toBeVisible();
    await expect(this.locators.saveThresholdsButton).toBeVisible();
    await expect(this.locators.lastCheckedText).toBeVisible();
  }

  async expectThresholdFieldsAcceptTypedValues(reminder: string, warning: string) {
    await expect(this.locators.reminderInput).toHaveValue(reminder);
    await expect(this.locators.warningInput).toHaveValue(warning);
  }

  async expectModelsAreListed() {
    for (const modelName of AI_MODELS) {
      await expect(this.locators.modelName(modelName)).toBeVisible();
    }
  }

  async expectKeyTableColumnsAndCleanupButton() {
    for (const columnName of AI_KEY_COLUMNS) {
      await expect(this.locators.keyColumn(columnName)).toBeVisible();
    }
    await expect(this.locators.cleanupOrphanedButton).toBeVisible();
  }

  async expectKeyRowsOfferDeleteButtons() {
    await expect(this.locators.deleteKeyButtons.first()).toBeVisible();
    await expect(this.locators.deleteKeyButtons).not.toHaveCount(0);
  }

  async expectActivitySection() {
    for (const label of AI_ACTIVITY_LABELS) {
      await expect(this.locators.activityLabel(label)).toBeVisible();
    }
    // one Refresh belongs to OpenRouter Credit and one to Today's Activity
    await expect(this.locators.refreshButtons).toHaveCount(2);
  }

  async expectLiteLlmDashboardLink() {
    await expect(this.locators.liteLlmNote).toBeVisible();
    await expect(this.locators.openDashboardLink).toBeVisible();
  }
}
