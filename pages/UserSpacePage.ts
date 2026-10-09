import { expect, type Page } from '@playwright/test';
import {
  ACTIVITY_TABS,
  AUTOPILOT_PRESETS,
  HISTORY_FILTERS,
  ROUTINE_FIGURES,
  ROUTINE_KINDS,
  SETUP_AUTOPILOT_SECTIONS,
  SETUP_GENERAL_SECTIONS,
  SETUP_LINKS,
  SPACE,
  SPACE_PATHS,
  SPACE_SECTIONS,
  WORK_COLUMNS,
  type SpaceSection,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserSpaceLocators } from '../locators/UserSpaceLocators';

export class UserSpacePage {
  private readonly locators: UserSpaceLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserSpaceLocators(page);
  }

  async openSection(section: SpaceSection) {
    await this.page.goto(`/space/${SPACE.id}${SPACE_PATHS[section]}`);
    await expect(this.locators.sectionNav).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromDashboard() {
    await this.page.goto('/dashboard');
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.spaceCard.click();
  }

  async openSpaceSwitcher() {
    await this.locators.spaceSwitcher.click();
  }

  async openAskTheTeam() {
    await this.locators.askTheTeamButton.click();
  }

  async openAutopilot() {
    await this.locators.autopilotButton.click();
  }

  async chooseActivityTab(tabName: string) {
    await this.locators.activityTab(tabName).click();
  }

  async openFirstThread() {
    await this.locators.firstThread.click();
  }

  async chooseListView() {
    await this.locators.listButton.click();
  }

  async chooseAssignedToMe() {
    await this.locators.assignedToMeButton.click();
  }

  async searchTasks(query: string) {
    await this.locators.workSearch.fill(query);
  }

  async openCreateRoutine() {
    await this.locators.button('Create routine').click();
  }

  async openFirstRoutine() {
    await this.locators.firstRoutine.click();
  }

  async switchToAdvancedFiles() {
    await this.locators.button('Advanced view').click();
  }

  async switchToSimpleFiles() {
    await this.locators.button('Simple view').click();
  }

  async openInvitePeople() {
    await this.locators.button('Invite people').click();
  }

  async openMemberAsk() {
    await this.locators.firstAskButton.click();
  }

  async chooseSetupLink(linkName: string) {
    await this.locators.link(linkName).click();
  }

  async closeDialog(dialogName: string) {
    await this.locators.dialogButton(dialogName, 'Close').click();
  }

  async expectSpaceShell() {
    await expect(this.locators.spaceSwitcher).toBeVisible();
    await expect(this.locators.askTheTeamButton).toBeVisible();
    await expect(this.locators.autopilotButton).toBeVisible();
    await expect(this.locators.representingLink).toBeVisible();
    await expect(this.locators.collapseButton).toBeVisible();
    for (const sectionName of SPACE_SECTIONS) {
      await expect(this.locators.sectionLink(sectionName)).toBeVisible();
    }
    await expect(this.locators.heading('Activity')).toBeVisible();
  }

  async expectSwitcherMenu() {
    await expect(this.locators.menuItem('Invite people')).toBeVisible();
    await expect(this.locators.menuItem('Setup')).toBeVisible();
  }

  async expectAskTheTeamDialog() {
    const dialogName = 'Ask the team';
    await expect(this.locators.dialog(dialogName)).toBeVisible();
    await expect(this.locators.dialogText(dialogName, "One question to everyone's assistant. The answers come back in a single Activity thread.")).toBeVisible();
    await expect(this.locators.dialogTextbox(dialogName)).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Ask')).toBeDisabled();
    await expect(this.locators.dialogButton(dialogName, 'Close')).toBeVisible();
  }

  async expectAutopilotDialog() {
    const dialogName = 'Autopilot';
    await expect(this.locators.dialog(dialogName)).toBeVisible();
    await expect(this.locators.dialogText(dialogName, "How much your teammates' agents do on their own in this space.")).toBeVisible();
    for (const presetName of AUTOPILOT_PRESETS) {
      await expect(this.locators.dialogChoice(dialogName, presetName)).toBeVisible();
    }
    await expect(this.locators.dialog(dialogName).getByRole('link', { name: /Fine-tune every rule/ })).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Close')).toBeVisible();
  }

  async expectDialogIsClosed(dialogName: string) {
    await expect(this.locators.dialog(dialogName)).toBeHidden();
  }

  async expectActivityTabs() {
    for (const tabName of ACTIVITY_TABS) {
      await expect(this.locators.activityTab(tabName)).toBeVisible();
    }
  }

  async expectEmptyActivityTab() {
    await expect(this.locators.emptyActivityText).toBeVisible();
  }

  async expectThreadDetail() {
    await expect(this.locators.reopenButton).toBeVisible();
    await expect(this.locators.replySend).toBeDisabled();
    await expect(this.locators.participantsButton).toBeVisible();
  }

  async expectProjects() {
    await expect(this.locators.heading('Projects')).toBeVisible();
    await expect(this.locators.text('Boards shared with this space.')).toBeVisible();
    await expect(this.locators.projectOpenLinks).not.toHaveCount(0);
  }

  async expectWork() {
    await expect(this.locators.heading('Work')).toBeVisible();
    await expect(this.locators.text('Every task across the projects you can see in this space.')).toBeVisible();
    await expect(this.locators.everyProjectButton).toBeVisible();
    await expect(this.locators.assignedToMeButton).toBeVisible();
    await expect(this.locators.workSearch).toBeVisible();
    await expect(this.locators.listButton).toBeVisible();
    await expect(this.locators.boardButton).toBeVisible();
  }

  async expectWorkColumns() {
    for (const columnName of WORK_COLUMNS) {
      await expect(this.locators.columnHeading(columnName).first()).toBeVisible();
    }
  }

  async expectWorkFilterUrl(parameter: string) {
    await expect(this.page).toHaveURL(new RegExp(parameter));
  }

  async expectNoTasks() {
    await expect(this.locators.noTasksText).toBeVisible();
  }

  async expectRoutines() {
    await expect(this.locators.heading('Routines')).toBeVisible();
    await expect(this.locators.text("The team's rhythms - a morning check-in, a weekly brief. They send as you, so opt-ins still apply.")).toBeVisible();
    await expect(this.locators.routineSearch).toBeVisible();
    await expect(this.locators.button('Create routine')).toBeVisible();
    await expect(this.locators.premadeHeading).toBeVisible();
    for (const figureName of ROUTINE_FIGURES) {
      await expect(this.locators.text(figureName).first()).toBeVisible();
    }
  }

  async expectCreateRoutineDialog() {
    const dialogName = 'Create routine';
    await expect(this.locators.dialog(dialogName)).toBeVisible();
    for (const kindName of ROUTINE_KINDS) {
      await expect(this.locators.dialogChoice(dialogName, kindName)).toBeVisible();
    }
    await expect(this.locators.dialogText(dialogName, 'Give it a name.')).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Create routine')).toBeDisabled();
    await expect(this.locators.dialogButton(dialogName, 'Close')).toBeVisible();
  }

  async expectRoutineDialog() {
    await expect(this.page.getByRole('dialog').getByRole('tab', { name: 'Overview' })).toBeVisible();
    await expect(this.page.getByRole('dialog').getByRole('tab', { name: /^Runs/ })).toBeVisible();
    for (const buttonName of ['Run now', 'Edit', 'Remove']) {
      await expect(this.page.getByRole('dialog').getByRole('button', { name: buttonName, exact: true })).toBeVisible();
    }
  }

  async expectFiles() {
    await expect(this.locators.heading('Files')).toBeVisible();
    await expect(this.locators.text("The one place this space's agents can see each other's work.")).toBeVisible();
    await expect(this.locators.storageText.first()).toBeVisible();
    await expect(this.locators.button('Upload file')).toBeVisible();
    await expect(this.locators.button('Upload folder')).toBeVisible();
    await expect(this.locators.button('Advanced view')).toBeVisible();
    await expect(this.locators.rowActions).not.toHaveCount(0);
  }

  async expectAdvancedFiles() {
    for (const buttonName of ['New file', 'New folder', 'Add more storage', 'Simple view']) {
      await expect(this.locators.button(buttonName)).toBeVisible();
    }
    await expect(this.locators.text('Pick a file to view or edit')).toBeVisible();
  }

  async expectSimpleFilesAreBack() {
    await expect(this.locators.button('Advanced view')).toBeVisible();
    await expect(this.locators.button('Simple view')).toBeHidden();
  }

  async expectTeam() {
    await expect(this.locators.heading('People')).toBeVisible();
    await expect(this.locators.text('Your agent in this space')).toBeVisible();
    await expect(this.locators.button('Invite people')).toBeVisible();
    await expect(this.locators.memberRows).not.toHaveCount(0);
    await expect(this.locators.askButtons).not.toHaveCount(0);
  }

  async expectInviteDialog() {
    const dialogName = 'Invite people';
    await expect(this.locators.dialog(dialogName)).toBeVisible();
    await expect(this.locators.dialogText(dialogName, 'Up to 10 people including you. Each brings their own agent.')).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Member')).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Admin')).toBeVisible();
    await expect(this.locators.dialogTextbox(dialogName)).toBeVisible();
    await expect(this.locators.dialogButton(dialogName, 'Send invitation')).toBeDisabled();
    await expect(this.locators.dialogButton(dialogName, 'Close')).toBeVisible();
  }

  async expectMemberAskDialog() {
    await expect(this.page.getByRole('dialog').getByRole('textbox')).toBeVisible();
    await expect(this.page.getByRole('dialog').getByRole('button', { name: 'Ask', exact: true })).toBeDisabled();
  }

  async expectSetupGeneral() {
    for (const sectionName of SETUP_GENERAL_SECTIONS) {
      await expect(this.locators.text(sectionName).first()).toBeVisible();
    }
    await expect(this.locators.button('Leave space')).toBeVisible();
  }

  async expectSetupLinks() {
    for (const linkName of SETUP_LINKS) {
      await expect(this.locators.link(linkName)).toBeVisible();
    }
  }

  async expectSetupAutopilot() {
    for (const sectionName of SETUP_AUTOPILOT_SECTIONS) {
      await expect(this.locators.text(sectionName).first()).toBeVisible();
    }
    for (const presetName of AUTOPILOT_PRESETS) {
      await expect(this.locators.presetButton(presetName)).toBeVisible();
    }
  }

  async expectSetupSkills() {
    await expect(this.locators.text('Shared skills').first()).toBeVisible();
    await expect(this.locators.text('No shared skills yet')).toBeVisible();
    await expect(this.locators.text('Share a skill').first()).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Search skills…' })).toBeVisible();
  }

  async expectSetupConnections() {
    for (const headingName of ['Yours', 'Shared tools', 'Share one of your connections']) {
      await expect(this.locators.text(headingName).first()).toBeVisible();
    }
    await expect(this.locators.link('Connect a CRM')).toBeVisible();
    await expect(this.locators.link('Connect a tool')).toBeVisible();
  }

  async expectSetupHistory() {
    for (const filterName of HISTORY_FILTERS) {
      await expect(this.locators.button(filterName)).toBeVisible();
    }
  }

  async expectSpaceUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/space/${SPACE.id}`));
    await expect(this.locators.sectionNav).toBeVisible();
  }
}
