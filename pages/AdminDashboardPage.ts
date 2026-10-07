import { expect, type Page } from '@playwright/test';
import { ADMIN_URL, DASHBOARD_SECTIONS, NAV_LINKS } from '../datas/admin/AdminData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { AdminDashboardLocators } from '../locators/AdminDashboardLocators';

export class AdminDashboardPage {
  private readonly locators: AdminDashboardLocators;

  constructor(private readonly page: Page) {
    this.locators = new AdminDashboardLocators(page);
  }

  async open() {
    await this.openPath('/admin');
    await expect(this.locators.welcomeHeading).toBeVisible();
  }

  async openPath(path: string) {
    await this.page.goto(`${ADMIN_URL}${path}`);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async clickNavLink(linkName: string) {
    await this.locators.navLink(linkName).click();
  }

  async clickCollapseSidebar() {
    await this.locators.collapseButton.click();
  }

  async clickExpandSidebar() {
    await this.locators.expandButton.click();
  }

  async openCardMenu(cardName: string) {
    // the cards re-render as their data arrives and can close a menu opened too early
    await expect(async () => {
      await this.locators.cardOptionsButton(cardName).click();
      await expect(this.locators.viewDetailsItem).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async clickViewDetails() {
    await this.locators.viewDetailsItem.click();
  }

  async openChannelFilterMenu() {
    await expect(async () => {
      await this.locators.channelFilterButton('All channels').click();
      await expect(this.locators.connectedOnlyItem).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async chooseConnectedOnly() {
    await this.locators.connectedOnlyItem.click();
  }

  async clickSeeAll() {
    await this.locators.seeAllLink.click();
  }

  async openAccountMenu() {
    await expect(async () => {
      await this.locators.adminAccountButton.click();
      await expect(this.locators.appearanceMenuItem).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async clickAppearance() {
    await this.locators.appearanceMenuItem.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.welcomeHeading).toBeVisible();
    await expect(this.locators.welcomeSubtitle).toBeVisible();
    for (const sectionName of DASHBOARD_SECTIONS) {
      await expect(this.locators.sectionHeading(sectionName)).toBeVisible();
    }
    await expect(this.locators.searchInput).toBeVisible();
  }

  async expectSignedInAsSuperAdmin() {
    await expect(this.locators.superAdminRole).toBeVisible();
  }

  async expectSidebarLists() {
    await expect(this.locators.logoLink).toBeVisible();
    await expect(this.locators.managementLabel).toBeVisible();
    await expect(this.locators.systemLabel).toBeVisible();
    for (const linkName of NAV_LINKS) {
      await expect(this.locators.navLink(linkName)).toBeVisible();
    }
    await expect(this.locators.collapseButton).toBeVisible();
    await expect(this.locators.adminAccountButton).toBeVisible();
  }

  async expectUrlMatches(path: RegExp) {
    await expect(this.page).toHaveURL(path);
  }

  async expectSidebarIsCollapsed() {
    await expect(this.locators.expandButton).toBeVisible();
    await expect(this.locators.collapseButton).toBeHidden();
    await expect(this.locators.managementLabel).toBeHidden();
    await expect(this.locators.systemLabel).toBeHidden();
    await expect(this.locators.adminAccountLink).toBeVisible();
  }

  async expectSidebarIsExpanded() {
    await expect(this.locators.collapseButton).toBeVisible();
    await expect(this.locators.expandButton).toBeHidden();
    await expect(this.locators.managementLabel).toBeVisible();
    await expect(this.locators.systemLabel).toBeVisible();
  }

  async expectCardMenuOffersViewDetails() {
    await expect(this.locators.viewDetailsItem).toBeVisible();
  }

  async expectChannelFilterMenuItems() {
    await expect(this.locators.allChannelsItem).toBeVisible();
    await expect(this.locators.connectedOnlyItem).toBeVisible();
  }

  async expectChannelFilterShows(label: string) {
    await expect(this.locators.channelFilterButton(label)).toBeVisible();
  }

  async expectLearningCentreLinkTargetsHelp() {
    await expect(this.locators.learningCentreLink).toHaveAttribute('href', '/help');
  }

  async expectDarkMode() {
    await expect(this.page.locator('html')).toHaveClass(/dark/);
  }

  async expectLightMode() {
    await expect(this.page.locator('html')).not.toHaveClass(/dark/);
  }
}
