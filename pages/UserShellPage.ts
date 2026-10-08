import { expect, type Page } from '@playwright/test';
import { ACCOUNT_MENU_ITEMS, PALETTE_TABS, QUICK_ACTIONS, SETTINGS_SECTIONS } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserShellLocators } from '../locators/UserShellLocators';

export class UserShellPage {
  private readonly locators: UserShellLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserShellLocators(page);
  }

  async open() {
    await this.page.goto('/dashboard');
    await expect(this.locators.welcomeHeading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async clickHome() {
    await this.locators.homeLink.click();
  }

  async clickMyWork() {
    await this.locators.myWorkLink.click();
  }

  async clickAssistant(assistantName: string) {
    await this.locators.assistantLink(assistantName).click();
  }

  async openPalette() {
    // the page re-renders as its data arrives and can swallow a click made too early
    await expect(async () => {
      await this.locators.searchButton.click();
      await expect(this.locators.palette).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openPaletteWithShortcut() {
    // a shortcut pressed before the page's key listener is attached is lost, so press until the palette shows
    await expect(async () => {
      await this.page.keyboard.press('Control+KeyK');
      await expect(this.locators.palette).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
  }

  async chooseTab(tabName: string) {
    await this.locators.paletteTab(tabName).click();
  }

  async closePaletteWithEscape() {
    await this.page.keyboard.press('Escape');
  }

  async clickClosePalette() {
    await this.locators.paletteCloseButton.click();
  }

  async openNotifications() {
    await expect(async () => {
      await this.locators.notificationsButton.click();
      await expect(this.locators.notificationsPanel).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async chooseUnread() {
    await this.locators.unreadRadio.click();
  }

  async openSettings() {
    await expect(async () => {
      await this.locators.settingsButton.click();
      await expect(this.locators.settingsDialog).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async closeSettingsWithEscape() {
    await this.page.keyboard.press('Escape');
  }

  async openAccountMenu() {
    await expect(async () => {
      await this.locators.accountButton.click();
      await expect(this.locators.accountMenu).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async expectSidebarLists() {
    await expect(this.locators.logoLink).toBeVisible();
    await expect(this.locators.homeLink).toBeVisible();
    await expect(this.locators.myWorkLink).toBeVisible();
    await expect(this.locators.searchButton).toBeVisible();
    await expect(this.locators.notificationsButton).toBeVisible();
    await expect(this.locators.settingsButton).toBeVisible();
    await expect(this.locators.accountButton).toBeVisible();
  }

  async expectSidebarListsAssistant(assistantName: string) {
    await expect(this.locators.assistantLink(assistantName)).toBeVisible();
  }

  async expectUrlMatches(path: RegExp) {
    await expect(this.page).toHaveURL(path);
  }

  async expectPaletteIsOpenWithTabs() {
    await expect(this.locators.palette).toBeVisible();
    await expect(this.locators.paletteSearchBox).toBeVisible();
    for (const tabName of PALETTE_TABS) {
      await expect(this.locators.paletteTab(tabName)).toBeVisible();
    }
  }

  async expectQuickActionsAreDisabled() {
    for (const actionName of QUICK_ACTIONS) {
      await expect(this.locators.quickAction(actionName)).toBeDisabled();
    }
  }

  async expectTabIsSelected(tabName: string) {
    await expect(this.locators.paletteTab(tabName)).toHaveAttribute('aria-selected', 'true');
  }

  async expectPaletteIsClosed() {
    await expect(this.locators.palette).toBeHidden();
  }

  async expectPaletteIsOpen() {
    await expect(this.locators.palette).toBeVisible();
  }

  async expectNotificationsShowAll() {
    await expect(this.locators.notificationsPanel).toBeVisible();
    await expect(this.locators.allRadio).toBeChecked();
    await expect(this.locators.unreadRadio).not.toBeChecked();
  }

  async expectUnreadIsSelected() {
    await expect(this.locators.unreadRadio).toBeChecked();
    await expect(this.locators.allRadio).not.toBeChecked();
  }

  async expectSettingsSections() {
    for (const sectionName of SETTINGS_SECTIONS) {
      await expect(this.locators.settingsSection(sectionName)).toBeVisible();
    }
  }

  async expectSettingsIsClosed() {
    await expect(this.locators.settingsDialog).toBeHidden();
  }

  async expectAccountMenuShowsUserAndItems(fullName: string, email: string) {
    await expect(this.locators.accountMenuText(fullName)).toBeVisible();
    await expect(this.locators.accountMenuText(email)).toBeVisible();
    for (const itemName of ACCOUNT_MENU_ITEMS) {
      await expect(this.locators.accountMenuItem(itemName)).toBeVisible();
    }
  }
}
