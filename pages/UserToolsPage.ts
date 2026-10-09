import { expect, type Page } from '@playwright/test';
import { OWN_ASSISTANT, TOOL_CATEGORIES, TOOL_NAMES, TOOL_SEARCH, TOOLS_WITH_PERMISSION } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserToolsLocators } from '../locators/UserToolsLocators';

export class UserToolsPage {
  private readonly locators: UserToolsLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserToolsLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/tools`);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.toolImage('Gmail')).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.toolsLink.click();
  }

  async openConnected() {
    await this.locators.connectedButton.click();
    await expect(this.locators.searchConnected).toBeVisible();
  }

  async toggleCategory(categoryName: string) {
    await this.locators.categoryHeader(categoryName).click();
  }

  async searchFor(query: string) {
    await this.locators.searchTools.fill(query);
  }

  async clickSync() {
    await this.locators.syncButton.click();
  }

  async openFirstManageMenu() {
    await this.locators.firstManageButton.click();
  }

  async openConnectionError() {
    await this.locators.firstConnectionError.click();
  }

  async expectToolsPage() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.intro).toBeVisible();
    await expect(this.locators.browseButton).toBeVisible();
    await expect(this.locators.connectedButton).toBeVisible();
    await expect(this.locators.searchTools).toBeVisible();
  }

  async expectCategories() {
    for (const categoryName of TOOL_CATEGORIES) {
      await expect(this.locators.categoryHeader(categoryName)).toBeVisible();
    }
  }

  async expectToolCatalog() {
    for (const toolName of TOOL_NAMES) {
      await expect(this.locators.toolName(toolName)).toBeVisible();
    }
  }

  async expectPermissionGroups() {
    for (const toolName of TOOLS_WITH_PERMISSION) {
      await expect(this.locators.permissionButton(toolName, 'Read only')).toBeVisible();
      await expect(this.locators.permissionButton(toolName, 'Read & write')).toBeVisible();
      await expect(this.locators.pressedPermission(toolName)).toHaveCount(1);
    }
  }

  async expectConnectButtons() {
    await expect(this.locators.connectButtons).not.toHaveCount(0);
  }

  async expectConnectionErrorPopover() {
    await expect(this.locators.connectionErrorPopover).toBeVisible();
  }

  async expectCategoryIsCollapsed(toolName: string) {
    await expect(this.locators.toolImage(toolName)).toBeHidden();
  }

  async expectToolIsShown(toolName: string) {
    await expect(this.locators.toolImage(toolName)).toBeVisible();
  }

  async expectOnlyMatchingTool() {
    await expect(this.locators.toolImage(TOOL_SEARCH.match)).toBeVisible();
    await expect(this.locators.toolImage(TOOL_SEARCH.other)).toBeHidden();
  }

  async expectNothingMatches(query: string) {
    await expect(this.locators.noMatchText(query)).toBeVisible();
  }

  async expectConnectedView() {
    await expect(this.locators.searchConnected).toBeVisible();
    await expect(this.locators.syncButton).toBeVisible();
    await expect(this.locators.connectedLabels).not.toHaveCount(0);
    await expect(this.locators.manageButtons).not.toHaveCount(0);
  }

  async expectSyncRuns() {
    await expect(this.locators.syncButton).toBeDisabled();
    await expect(this.locators.syncButton).toBeEnabled();
  }

  async expectManageMenu() {
    await expect(this.locators.manageMenu).toBeVisible();
    await expect(this.locators.reauthenticateItem).toBeVisible();
    await expect(this.locators.disconnectItem).toBeVisible();
  }

  async expectToolsUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/tools$`));
    await expect(this.locators.heading).toBeVisible();
  }
}
