import { expect, type Page } from '@playwright/test';
import {
  BOARD_FILTER_ITEMS,
  BOARD_LAYOUTS,
  BOARD_SETTINGS_TABS,
  BOARD_VIEW_CHOICES,
  BUDGET_BUTTONS,
  NEW_TASK_FIELDS,
  NEW_TASK_LISTS,
  OVERVIEW_TILES,
  OWN_ASSISTANT,
  OWN_PROJECT,
  PEOPLE_ASK_BUTTONS,
  PEOPLE_HEADINGS,
  PEOPLE_TILES,
  PROJECT_SUBTITLES,
  PROJECT_TABS,
  ROUND_OPTIONS,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserProjectDetailLocators } from '../locators/UserProjectDetailLocators';

export class UserProjectDetailPage {
  private readonly locators: UserProjectDetailLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserProjectDetailLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/projects/${OWN_PROJECT.id}`);
    await expect(this.locators.projectHeading).toHaveText(OWN_PROJECT.name);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openTabByAddress(tabName: string) {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/projects/${OWN_PROJECT.id}?tab=${tabName.toLowerCase()}`);
    await expect(this.locators.projectHeading).toHaveText(OWN_PROJECT.name);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async chooseTab(tabName: string) {
    await this.locators.tab(tabName).click();
  }

  async closeDashboard() {
    await this.locators.closeDashboardButton.click();
  }

  async openRoundMenu() {
    await this.locators.roundButton.click();
  }

  async openFilterMenu() {
    await this.locators.filterButton.click();
  }

  async openViewOptions() {
    await this.locators.viewOptionsButton.click();
  }

  async openViewsDialog() {
    await this.locators.viewsButton.click();
  }

  async openNewTaskDialog() {
    await this.locators.newTaskButton.click();
  }

  async closeNewTaskDialog() {
    await this.locators.newTaskClose.click();
  }

  async openBoardSettings() {
    await this.locators.boardSettingsButton.click();
  }

  async cancelBoardSettings() {
    await this.locators.boardSettingsCancel.click();
  }

  async chooseBoardSettingsTab(tabName: string) {
    await this.locators.boardSettingsTab(tabName).click();
  }

  async expectProjectDashboard() {
    await expect(this.locators.projectHeading).toHaveText(OWN_PROJECT.name);
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Overview)).toBeVisible();
    for (const tabName of PROJECT_TABS) {
      await expect(this.locators.tab(tabName)).toBeVisible();
    }
    await expect(this.locators.tab('Overview')).toHaveAttribute('aria-selected', 'true');
  }

  async expectOverview() {
    for (const tileName of OVERVIEW_TILES) {
      await expect(this.locators.tileText(tileName)).toBeVisible();
      await expect(this.locators.infoButton(tileName)).toBeVisible();
    }
    await expect(this.locators.sectionHeading('People on task', 3)).toBeVisible();
    await expect(this.locators.sectionHeading('Latest', 3)).toBeVisible();
    for (const buttonName of ['Ask to change these tiles', 'Ask to even this out', 'Share them out']) {
      await expect(this.locators.dashboardButton(buttonName)).toBeVisible();
    }
    await expect(this.locators.seeEverythingButton).toBeVisible();
  }

  async expectTabIsSelected(tabName: string) {
    await expect(this.locators.tab(tabName)).toHaveAttribute('aria-selected', 'true');
    await expect(this.page).toHaveURL(new RegExp(`tab=${tabName.toLowerCase()}`));
  }

  async expectDashboardIsClosed() {
    await expect(this.locators.dashboard).toBeHidden();
  }

  async expectProjectChat() {
    await expect(this.locators.chatComposer).toBeVisible();
    await expect(this.locators.chatSend).toBeDisabled();
    await expect(this.locators.chatNewChat).toBeVisible();
    await expect(this.locators.chatAttach).toBeVisible();
    await expect(this.locators.chatModel).toBeVisible();
    await expect(this.locators.chatSpeech).toBeVisible();
    await expect(this.locators.chatSuggestion).toBeVisible();
  }

  async expectHeaderButtons() {
    await expect(this.locators.compactDensityButton).toBeVisible();
    await expect(this.locators.newTaskButton).toBeVisible();
    await expect(this.locators.boardSettingsButton).toBeVisible();
  }

  async expectBoardTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Board)).toBeVisible();
    await expect(this.locators.viewsButton).toBeVisible();
    for (const choiceName of BOARD_VIEW_CHOICES) {
      await expect(this.locators.viewChoice(choiceName)).toBeVisible();
    }
    await expect(this.locators.viewChoice('Board')).toBeChecked();
    await expect(this.locators.cardSearch).toBeVisible();
    await expect(this.locators.myTasksButton).toBeVisible();
    await expect(this.locators.roundButton).toBeVisible();
    await expect(this.locators.filterButton).toBeVisible();
    await expect(this.locators.viewOptionsButton).toBeVisible();
    await expect(this.locators.hiddenTasksStatus).toBeVisible();
    await expect(this.locators.showAllButton).toBeVisible();
  }

  async expectRoundOptions() {
    for (const optionName of ROUND_OPTIONS) {
      await expect(this.locators.menuItem(optionName)).toBeVisible();
    }
  }

  async expectFilterItems() {
    for (const itemName of BOARD_FILTER_ITEMS) {
      await expect(this.locators.menuItem(itemName).or(this.locators.menuCheckboxItem(itemName))).toBeVisible();
    }
  }

  async expectViewOptionsDialog() {
    await expect(this.locators.groupBySelect).toBeVisible();
    await expect(this.locators.sortBySelect).toBeVisible();
    await expect(this.locators.comfortableChoice).toBeChecked();
    await expect(this.locators.compactChoice).toBeVisible();
    await expect(this.locators.keyboardShortcutsButton).toBeVisible();
  }

  async expectViewsDialog() {
    await expect(this.locators.viewNameField).toBeVisible();
    await expect(this.locators.shareViewCheckbox).toBeVisible();
    await expect(this.locators.saveViewButton).toBeDisabled();
  }

  async expectNewTaskDialog() {
    await expect(this.locators.newTaskDialog).toBeVisible();
    for (const fieldName of NEW_TASK_FIELDS) {
      await expect(this.locators.newTaskField(fieldName)).toBeVisible();
    }
    for (const listName of NEW_TASK_LISTS) {
      await expect(this.locators.newTaskList(listName)).toBeVisible();
    }
    await expect(this.locators.startButton).toBeVisible();
    await expect(this.locators.dueButton).toBeVisible();
    await expect(this.locators.estimateField).toBeVisible();
    await expect(this.locators.createAnotherCheckbox).toBeVisible();
    await expect(this.locators.createTaskButton).toBeDisabled();
  }

  async expectNewTaskDialogIsClosed() {
    await expect(this.locators.newTaskDialog).toBeHidden();
  }

  async expectBoardSettingsDialog() {
    await expect(this.locators.boardSettingsDialog).toBeVisible();
    for (const tabName of BOARD_SETTINGS_TABS) {
      await expect(this.locators.boardSettingsTab(tabName)).toBeVisible();
    }
    for (const layoutName of BOARD_LAYOUTS) {
      await expect(this.locators.layoutButton(layoutName)).toBeVisible();
    }
    await expect(this.locators.boardSettingsCancel).toBeVisible();
    await expect(this.locators.boardSettingsSave).toBeVisible();
  }

  async expectBoardSettingsDialogIsClosed() {
    await expect(this.locators.boardSettingsDialog).toBeHidden();
  }

  async expectBoardSettingsTabIsSelected(tabName: string) {
    await expect(this.locators.boardSettingsTab(tabName)).toHaveAttribute('aria-selected', 'true');
  }

  async expectProgressTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Progress)).toBeVisible();
    await expect(this.locators.dashboardButton('Manage rounds')).toBeVisible();
    await expect(this.locators.sectionHeading('Tasks finished each sprint', 4)).toBeVisible();
    await expect(this.locators.dashboardButton('Ask to change these numbers')).toBeVisible();
  }

  async expectRisksTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Risks)).toBeVisible();
    await expect(this.locators.sectionHeading('All risks', 3)).toBeVisible();
  }

  async expectDigestTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Digest)).toBeVisible();
    await expect(this.locators.dashboardButton('Write the first digest')).toBeVisible();
    await expect(this.locators.dashboardButton('Write it for the client')).toBeVisible();
    await expect(this.locators.coversButton).toBeVisible();
  }

  async expectPeopleTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.People)).toBeVisible();
    for (const tileName of PEOPLE_TILES) {
      await expect(this.locators.tileText(tileName)).toBeVisible();
    }
    for (const headingName of PEOPLE_HEADINGS) {
      await expect(this.locators.sectionHeading(headingName, 3)).toBeVisible();
    }
    for (const buttonName of PEOPLE_ASK_BUTTONS) {
      await expect(this.locators.dashboardButton(buttonName)).toBeVisible();
    }
  }

  async expectBudgetTab() {
    await expect(this.locators.subtitle(PROJECT_SUBTITLES.Budget)).toBeVisible();
    for (const buttonName of BUDGET_BUTTONS) {
      await expect(this.locators.dashboardButton(buttonName)).toBeVisible();
    }
    await expect(this.locators.sectionHeading('Time', 3)).toBeVisible();
    await expect(this.locators.sectionHeading('Decided costs', 3)).toBeVisible();
  }
}
