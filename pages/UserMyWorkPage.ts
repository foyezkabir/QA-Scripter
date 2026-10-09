import { expect, type Page } from '@playwright/test';
import { MY_WORK_SORT_OPTIONS } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserMyWorkLocators } from '../locators/UserMyWorkLocators';

export class UserMyWorkPage {
  private readonly locators: UserMyWorkLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserMyWorkLocators(page);
  }

  async open() {
    await this.page.goto('/dashboard/my-work');
    await expect(this.locators.heading).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromHome() {
    await this.page.goto('/dashboard');
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.myWorkSidebarLink.click();
  }

  async openProjectFilter() {
    await this.locators.projectFilter.click();
  }

  async openSortList() {
    await this.locators.sortList.click();
  }

  async chooseSort(optionName: string) {
    await this.locators.sortOption(optionName).click();
  }

  async openFirstTask() {
    await this.locators.firstTaskLink.click();
  }

  async openFirstBoard() {
    await this.locators.firstOpenBoardLink.click();
  }

  async expectMyWork() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toBeVisible();
    await expect(this.locators.projectFilter).toContainText('All projects');
    await expect(this.locators.sortList).toContainText('Sort: Due');
  }

  async expectProjectFilterOptions() {
    await expect(this.locators.allProjectsOption).toBeVisible();
    await expect(this.locators.projectOptions).not.toHaveCount(0);
  }

  async expectSortOptions() {
    for (const optionName of MY_WORK_SORT_OPTIONS) {
      await expect(this.locators.sortOption(optionName)).toBeVisible();
    }
  }

  async expectSortIs(optionName: string) {
    await expect(this.locators.sortList).toContainText(optionName);
  }

  async expectTaskGroups() {
    await expect(this.locators.groupHeadings).not.toHaveCount(0);
  }

  async expectTaskRows() {
    await expect(this.locators.taskKeys).not.toHaveCount(0);
    await expect(this.locators.taskLinks).not.toHaveCount(0);
    await expect(this.locators.openBoardLinks).toHaveCount(await this.locators.taskLinks.count());
  }

  async expectTaskOpened() {
    await expect(this.page).toHaveURL(/\/projects\/[0-9a-f-]+\?task=/);
  }

  async expectBoardOpened() {
    await expect(this.page).toHaveURL(/\/projects\/[0-9a-f-]+\?dash=full&tab=board/);
  }

  async expectMyWorkUrl() {
    await expect(this.page).toHaveURL(/\/dashboard\/my-work$/);
    await expect(this.locators.heading).toBeVisible();
  }
}
