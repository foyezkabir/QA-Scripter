import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, INTEGRATIONS, USAGE_STATS } from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminUsageLocators } from '../locators/AdminUsageLocators';

export class AdminUsagePage {
  private readonly locators: AdminUsageLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminUsageLocators(page);
  }

  async open() {
    await this.page.goto(`${ADMIN_URL}/admin/usage`);
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.integrationAdoptionHeading).toBeVisible();
    await expect(this.locators.trackerImportsHeading).toBeVisible();
    await expect(this.locators.timelineHeading).toBeVisible();
  }

  async expectStatCards() {
    for (const label of USAGE_STATS) {
      await expect(this.locators.statLabel(label)).toBeVisible();
    }
  }

  async expectIntegrationTiles() {
    for (const integrationName of INTEGRATIONS) {
      await expect(this.locators.integrationTile(integrationName)).toBeVisible();
    }
  }

  async expectTrackerImportsAreListed() {
    await expect(this.locators.trackerImportRows.first()).toBeVisible();
    await expect(this.locators.trackerImportRows).not.toHaveCount(0);
  }

  async expectTimelineNote() {
    await expect(this.locators.timelineNote).toBeVisible();
  }
}
