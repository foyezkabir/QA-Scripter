import { expect, type Page } from '@playwright/test';
import { CREATE_PROJECT_EDITOR_BUTTONS, OWN_ASSISTANT, PROJECT_KINDS, PROJECT_SORT_OPTIONS, PROJECT_TOASTS, TEAM_PROJECT_TOAST } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserProjectsLocators } from '../locators/UserProjectsLocators';

export class UserProjectsPage {
  private readonly locators: UserProjectsLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserProjectsLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/projects`);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.projectLinks).not.toHaveCount(0);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.projectsLink.click();
  }

  async openSortMenu() {
    await this.locators.sortButton.click();
  }

  async searchProjects(query: string) {
    await this.locators.searchBox.fill(query);
  }

  async clearSearch() {
    await this.locators.clearSearchButton.click();
  }

  async openFirstProject() {
    await this.locators.firstProjectLink.click();
  }

  async openNewProjectDialog() {
    await this.locators.newProjectButton.click();
  }

  async typeProjectName(projectName: string) {
    await this.locators.dialogField(this.locators.createDialog, 'Project Name').fill(projectName);
  }

  async cancelNewProject() {
    await this.locators.dialogButton(this.locators.createDialog, 'Cancel').click();
  }

  async openProjectSettings() {
    await this.locators.firstEditProjectButton.click();
  }

  async cancelProjectSettings() {
    await this.locators.dialogButton(this.locators.settingsDialog, 'Cancel').click();
  }

  async openPeopleDialog() {
    await this.locators.peopleButton.click();
  }

  async choosePeopleTab(tabName: string) {
    await this.locators.peopleTab(tabName).click();
  }

  async openTrashDialog() {
    await this.locators.trashButton.click();
  }

  async chooseTrashTab() {
    await this.locators.trashTab.click();
  }

  async openJiraDialog() {
    await this.locators.importJiraButton.click();
  }

  async openHulyDialog() {
    await this.locators.importHulyButton.click();
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.pageDescription).toBeVisible();
    await expect(this.locators.peopleButton).toBeVisible();
    await expect(this.locators.trashButton).toBeVisible();
    await expect(this.locators.importJiraButton).toBeVisible();
    await expect(this.locators.importHulyButton).toBeVisible();
    await expect(this.locators.newProjectButton).toBeVisible();
    await expect(this.locators.searchBox).toBeVisible();
    await expect(this.locators.sortButton).toBeVisible();
  }

  async expectProjectCards() {
    await expect(this.locators.projectLinks).not.toHaveCount(0);
    await expect(this.locators.editProjectButtons).toHaveCount(await this.locators.projectLinks.count());
  }

  async expectSortOptions() {
    for (const optionName of PROJECT_SORT_OPTIONS) {
      await expect(this.locators.sortOption(optionName)).toBeVisible();
    }
  }

  async expectNoProjectsMatch() {
    await expect(this.locators.noMatchText).toBeVisible();
    await expect(this.locators.projectLinks).toHaveCount(0);
    await expect(this.locators.clearSearchButton).toBeVisible();
  }

  async expectProjectCardsAreBack() {
    await expect(this.locators.noMatchText).toBeHidden();
    await expect(this.locators.projectLinks).not.toHaveCount(0);
  }

  async expectProjectDetailUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/projects/[0-9a-f-]+`));
  }

  async expectProjectsUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/projects$`));
    await expect(this.locators.heading).toBeVisible();
  }

  async expectCreateProjectDialog() {
    const dialog = this.locators.createDialog;
    await expect(dialog).toBeVisible();
    await expect(this.locators.createSubtitle).toBeVisible();
    await expect(this.locators.dialogField(dialog, 'Project Name')).toBeVisible();
    await expect(this.locators.dialogField(dialog, "What it's for")).toBeVisible();
    for (const buttonName of CREATE_PROJECT_EDITOR_BUTTONS) {
      await expect(this.locators.dialogButton(dialog, buttonName)).toBeVisible();
    }
    await expect(this.locators.teamProjectSwitch(dialog)).not.toBeChecked();
    await expect(this.locators.dialogButton(dialog, 'Close')).toBeVisible();
    await expect(this.locators.dialogButton(dialog, 'Cancel')).toBeVisible();
    await expect(this.locators.dialogButton(dialog, 'Save')).toBeDisabled();
  }

  async expectProjectKinds() {
    for (const kindName of PROJECT_KINDS) {
      await expect(this.locators.kindOption(this.locators.createDialog, kindName)).toBeVisible();
    }
    await expect(this.locators.kindOption(this.locators.createDialog, 'General')).toBeChecked();
  }

  async expectSaveIsEnabled() {
    await expect(this.locators.dialogButton(this.locators.createDialog, 'Save')).toBeEnabled();
  }

  async expectCreateDialogIsClosed() {
    await expect(this.locators.createDialog).toBeHidden();
  }

  async expectProjectIsNotListed(projectName: string) {
    await expect(this.locators.projectLinkNamed(projectName)).toHaveCount(0);
  }

  async expectProjectSettingsDialog() {
    const dialog = this.locators.settingsDialog;
    await expect(dialog).toBeVisible();
    await expect(this.locators.dialogField(dialog, 'Project Name')).toBeVisible();
    await expect(this.locators.dialogField(dialog, "What it's for")).toBeVisible();
    await expect(this.locators.roundNameField).toBeVisible();
    await expect(this.locators.teamProjectSwitch(dialog)).toBeVisible();
    await expect(this.locators.everyoneVisibilityButton).toBeVisible();
    await expect(this.locators.onlyPeopleVisibilityButton).toBeVisible();
    await expect(this.locators.peopleOnBoardText).toBeVisible();
    for (const buttonName of ['Close', 'Archive', 'Move to Trash', 'Cancel', 'Save']) {
      await expect(this.locators.dialogButton(dialog, buttonName)).toBeVisible();
    }
  }

  async expectKindIsFixed() {
    await expect(this.locators.kindFixedNote).toBeVisible();
    await expect(this.locators.lockedKindOption).toHaveCount(1);
  }

  async expectProjectSettingsDialogIsClosed() {
    await expect(this.locators.settingsDialog).toBeHidden();
  }

  async expectPeopleDialog() {
    await expect(this.locators.peopleDialog).toBeVisible();
    await expect(this.locators.peopleDescription).toBeVisible();
    for (const tabName of ['All', 'Projects', 'CRM']) {
      await expect(this.locators.peopleTab(tabName)).toBeVisible();
    }
    await expect(this.locators.peopleSearch).toBeVisible();
    await expect(this.locators.addPersonButton).toBeVisible();
    await expect(this.locators.editPersonButtons).not.toHaveCount(0);
    await expect(this.locators.removePersonButtons).not.toHaveCount(0);
  }

  async expectPeopleTabIsSelected(tabName: string) {
    await expect(this.locators.peopleTab(tabName)).toHaveAttribute('aria-selected', 'true');
    await expect(this.locators.peopleTab('All')).toHaveAttribute('aria-selected', 'false');
  }

  async expectTrashDialog() {
    await expect(this.locators.trashDialog).toBeVisible();
    await expect(this.locators.trashDescription).toBeVisible();
    await expect(this.locators.archivedTab).toBeVisible();
    await expect(this.locators.trashTab).toBeVisible();
  }

  async expectTrashTabIsSelected() {
    await expect(this.locators.trashTab).toHaveAttribute('aria-selected', 'true');
    await expect(this.locators.deletedRows).not.toHaveCount(0);
  }

  async expectJiraDialog() {
    await this.expectImportDialog(this.locators.jiraDialog, 'Jira');
  }

  async expectHulyDialog() {
    await this.expectImportDialog(this.locators.hulyDialog, 'Huly');
  }

  async saveProject() {
    await this.locators.dialogButton(this.locators.createDialog, 'Save').click();
  }

  async createProject(projectName: string) {
    await this.openNewProjectDialog();
    await this.typeProjectName(projectName);
    await this.saveProject();
    await this.locators.createDialog.waitFor({ state: 'hidden' });
    await this.locators.projectLinkNamed(projectName).waitFor();
  }

  async openSettingsOf(projectName: string) {
    await this.locators.cardEditButton(projectName).click();
    await expect(this.locators.settingsDialog).toBeVisible();
  }

  async renameProjectTo(newName: string) {
    await this.locators.dialogField(this.locators.settingsDialog, 'Project Name').fill(newName);
  }

  async saveSettings() {
    await this.locators.dialogButton(this.locators.settingsDialog, 'Save').click();
  }

  async clickArchive() {
    await this.locators.dialogButton(this.locators.settingsDialog, 'Archive').click();
  }

  async clickMoveToTrash() {
    await this.locators.dialogButton(this.locators.settingsDialog, 'Move to Trash').click();
  }

  async confirmArchive(projectName: string) {
    await this.locators.confirmButton(this.locators.archiveDialog(projectName), 'Yes, archive it').click();
  }

  async cancelArchive(projectName: string) {
    await this.locators.confirmButton(this.locators.archiveDialog(projectName), 'Cancel').click();
  }

  async confirmMoveToTrash(projectName: string) {
    await this.locators.confirmButton(this.locators.trashConfirmDialog(projectName), 'Move to trash').click();
  }

  async cancelMoveToTrash(projectName: string) {
    await this.locators.confirmButton(this.locators.trashConfirmDialog(projectName), 'Cancel').click();
  }

  async chooseArchivedTab() {
    await this.locators.archivedTab.click();
  }

  async clickRestore(projectName: string) {
    await this.locators.restoreButton(projectName).click();
  }

  async confirmRestore(projectName: string) {
    await this.locators.confirmButton(this.locators.restoreDialog(projectName), 'Yes, restore').click();
  }

  async clickDeleteForever(projectName: string) {
    await this.locators.deleteForeverButton(projectName).click();
  }

  async keepProject(projectName: string) {
    await this.locators.confirmButton(this.locators.deleteForeverDialog(projectName), 'Keep it').click();
  }

  async confirmDeleteForever(projectName: string) {
    await this.locators.confirmButton(this.locators.deleteForeverDialog(projectName), 'Yes, delete').click();
  }

  async removeAutomationProjects(prefix: string) {
    await this.open();
    while ((await this.locators.automationCards(prefix).count()) > 0) {
      const before = await this.locators.automationCards(prefix).count();
      await this.locators.firstAutomationEdit(prefix).click();
      await this.clickMoveToTrash();
      await this.locators.dialogButton(this.locators.topDialog, 'Move to trash').click();
      await expect(this.locators.automationCards(prefix)).toHaveCount(before - 1);
    }
    await this.openTrashDialog();
    await this.chooseArchivedTab();
    while ((await this.locators.automationArchivedRows(prefix).count()) > 0) {
      const before = await this.locators.automationArchivedRows(prefix).count();
      await this.locators.firstAutomationArchived(prefix).click();
      await expect(this.locators.automationArchivedRows(prefix)).toHaveCount(before - 1);
    }
    await this.chooseTrashTab();
    while ((await this.locators.automationDeleteButtons(prefix).count()) > 0) {
      const before = await this.locators.automationDeleteButtons(prefix).count();
      await this.locators.firstAutomationDelete(prefix).click();
      await this.locators.confirmButton(this.locators.topDialog, 'Yes, delete').click();
      await expect(this.locators.automationDeleteButtons(prefix)).toHaveCount(before - 1);
    }
  }

  async createTeamProject(projectName: string) {
    await this.openNewProjectDialog();
    await this.typeProjectName(projectName);
    await this.locators.teamProjectSwitch(this.locators.createDialog).click();
    await this.saveProject();
    await this.locators.createDialog.waitFor({ state: 'hidden' });
    await this.locators.projectLinkNamed(projectName).waitFor();
  }

  async switchTeamProjectOn() {
    await this.locators.teamProjectSwitch(this.locators.createDialog).click();
  }

  async expectTeamProjectCreated(projectName: string) {
    await expect(this.locators.toast(TEAM_PROJECT_TOAST)).toBeVisible();
    await expect(this.locators.projectLinkNamed(projectName)).toBeVisible();
  }

  async expectProjectCreated(projectName: string) {
    await expect(this.locators.toast(PROJECT_TOASTS.created)).toBeVisible();
    await expect(this.locators.projectLinkNamed(projectName)).toBeVisible();
  }

  async expectNewProjectCard(projectName: string) {
    await expect(this.locators.projectLinkNamed(projectName)).toBeVisible();
    await expect(this.locators.cardText(projectName, 'Last updated')).toBeVisible();
    await expect(this.locators.cardText(projectName, '0 of 0 milestones done')).toBeVisible();
    await expect(this.locators.cardText(projectName, 'No milestones planned yet')).toBeVisible();
  }

  async expectProjectRenamed(newName: string) {
    await expect(this.locators.toast(PROJECT_TOASTS.updated)).toBeVisible();
    await expect(this.locators.projectLinkNamed(newName)).toBeVisible();
  }

  async expectArchiveConfirmation(projectName: string) {
    await expect(this.locators.archiveDialog(projectName)).toBeVisible();
    await expect(this.locators.archiveWarning(projectName)).toBeVisible();
    await expect(this.locators.confirmButton(this.locators.archiveDialog(projectName), 'Cancel')).toBeVisible();
    await expect(this.locators.confirmButton(this.locators.archiveDialog(projectName), 'Yes, archive it')).toBeVisible();
  }

  async expectProjectIsStillListed(projectName: string) {
    await expect(this.locators.projectLinkNamed(projectName)).toBeVisible();
  }

  async expectProjectIsArchived(projectName: string) {
    await expect(this.locators.toast(PROJECT_TOASTS.archived)).toBeVisible();
    await expect(this.locators.projectLinkNamed(projectName)).toHaveCount(0);
  }

  async expectArchivedRow(projectName: string) {
    await expect(this.locators.archivedRowText(projectName)).toBeVisible();
    await expect(this.locators.archivedMeta).toBeVisible();
    await expect(this.locators.restoreButton(projectName)).toBeVisible();
    await expect(this.locators.moveToTrashButton(projectName)).toBeVisible();
  }

  async expectRestoreConfirmation(projectName: string) {
    await expect(this.locators.restoreDialog(projectName)).toBeVisible();
    await expect(this.locators.restoreWarning(projectName)).toBeVisible();
  }

  async expectProjectIsBack(projectName: string) {
    await expect(this.locators.restoreDialog(projectName)).toBeHidden();
    await expect(this.locators.toast(`Restored "${projectName}"`)).toBeVisible();
    await expect(this.locators.projectLinkNamed(projectName)).toBeVisible();
  }

  async expectTrashConfirmation(projectName: string) {
    await expect(this.locators.trashConfirmDialog(projectName)).toBeVisible();
    await expect(this.locators.trashWarning(projectName)).toBeVisible();
  }

  async expectProjectIsTrashed(projectName: string) {
    await expect(this.locators.toast(PROJECT_TOASTS.trashed)).toBeVisible();
    await expect(this.locators.projectLinkNamed(projectName)).toHaveCount(0);
  }

  async expectTrashedRow(projectName: string) {
    await expect(this.locators.deleteForeverButton(projectName)).toBeVisible();
  }

  async expectDeleteForeverConfirmation(projectName: string) {
    await expect(this.locators.deleteForeverDialog(projectName)).toBeVisible();
    await expect(this.locators.deleteForeverWarning(projectName)).toBeVisible();
  }

  async expectTrashedProjectIsKept(projectName: string) {
    await expect(this.locators.deleteForeverDialog(projectName)).toBeHidden();
    await expect(this.locators.deleteForeverButton(projectName)).toBeVisible();
  }

  async expectProjectIsDeleted(projectName: string) {
    await expect(this.locators.toast(PROJECT_TOASTS.deleted)).toBeVisible();
    await expect(this.locators.deleteForeverButton(projectName)).toHaveCount(0);
  }

  private async expectImportDialog(dialog: ReturnType<Page['getByRole']>, trackerName: string) {
    await expect(dialog).toBeVisible();
    await expect(this.locators.importDescription(dialog, trackerName)).toBeVisible();
    await expect(this.locators.importSearch(dialog)).toBeVisible();
    await expect(this.locators.firstImportColumnsCheckbox(dialog)).toBeVisible();
    await expect(this.locators.importButtons(dialog)).not.toHaveCount(0);
  }
}
