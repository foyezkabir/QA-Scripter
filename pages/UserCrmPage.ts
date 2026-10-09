import { expect, type Page } from '@playwright/test';
import {
  COLUMN_MENU,
  CRM_EMPTY_NAME_ERROR,
  CRM_SUBTITLE,
  CRM_TAB_MENU,
  CRM_TABLES,
  CRM_TABS,
  DASHBOARD_WIDGETS,
  OWN_ASSISTANT,
  PERSON_EDIT_BUTTONS,
  type NewMember,
  type NewPerson,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserCrmLocators } from '../locators/UserCrmLocators';

type TableName = keyof typeof CRM_TABLES;

export class UserCrmPage {
  private readonly locators: UserCrmLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserCrmLocators(page);
  }

  async openLanding() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/crm`);
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.crmLink).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openWorkspace() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/crm?open=1`);
    await expect(this.locators.crmTab('People')).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.crmSectionLink.click();
  }

  async openCrm() {
    await this.locators.crmLink.click();
    await expect(this.locators.crmTab('People')).toBeVisible();
  }

  async openTrashDialog() {
    await this.locators.archiveTrashButton.click();
    await expect(this.locators.trashDialog).toBeVisible();
  }

  async chooseTrashTab() {
    await this.locators.trashTab.click();
  }

  async chooseTab(tabName: string) {
    await this.locators.crmTab(tabName).click();
  }

  async openTabMenu() {
    await this.locators.tabMenuButton.click();
  }

  async openFilterBuilder() {
    await this.locators.filterByFieldButton.click();
  }

  async openColumnMenu(columnName: string) {
    await this.locators.columnHeader(columnName).click();
  }

  async openNewPersonDialog() {
    await this.locators.newButton.click();
    await expect(this.locators.personDialog).toBeVisible();
  }

  async typePersonName(person: NewPerson) {
    await this.locators.firstNameField.fill(person.first);
    await this.locators.lastNameField.fill(person.last);
  }

  async clickCreatePerson() {
    await this.locators.createPersonButton.click();
  }

  async createPerson(person: NewPerson) {
    await this.openNewPersonDialog();
    await this.typePersonName(person);
    await this.clickCreatePerson();
    await this.locators.personDialog.waitFor({ state: 'hidden' });
    await this.locators.recordHeading(person.name).waitFor();
  }

  async editJobTitle(jobTitle: string) {
    await this.locators.recordButton('Edit Job title').click();
    await this.locators.inlineEditorBox.fill(jobTitle);
    await this.locators.inlineSave.click();
  }

  async clickDeleteRecord() {
    await this.locators.recordButton('Delete').click();
  }

  async keepIt() {
    await this.locators.keepItButton.click();
  }

  async confirmDelete() {
    await this.locators.yesDeleteButton.click();
  }

  async selectRow(recordName: string) {
    await this.locators.rowCheckbox(recordName).check();
  }

  async clickDeleteSelected() {
    await this.locators.deleteSelectedButton.click();
  }

  async clickDeleteForever(recordName: string) {
    await this.locators.deleteForeverButton(recordName).click();
  }

  async openAddMemberDialog() {
    await this.locators.addPersonButton.click();
    await expect(this.locators.memberDialog).toBeVisible();
  }

  async typeMember(member: NewMember) {
    await this.locators.memberNameField.fill(member.name);
    await this.locators.memberEmailField.fill(member.email);
  }

  async addMember(member: NewMember) {
    await this.openAddMemberDialog();
    await this.typeMember(member);
    await this.locators.addToTeamButton.click();
    await this.locators.memberDialog.waitFor({ state: 'hidden' });
    await this.locators.memberCard(member.name).waitFor();
  }

  async clickRemoveMember(memberName: string) {
    await this.locators.removeMemberButton(memberName).click();
  }

  async confirmRemoveMember() {
    await this.locators.yesRemoveButton.click();
  }

  async openDashboardMenu() {
    await this.locators.chooseDashboardButton.click();
  }

  async openNewDashboardDialog() {
    await this.openDashboardMenu();
    await this.locators.dashboardMenuItem('New dashboard').click();
    await expect(this.locators.dashboardDialog).toBeVisible();
  }

  async typeDashboardName(dashboardName: string) {
    await this.locators.dashboardNameField.fill(dashboardName);
  }

  async clickCreateDashboard() {
    await this.locators.createDashboardButton.click();
  }

  async createDashboard(dashboardName: string) {
    await this.openNewDashboardDialog();
    await this.typeDashboardName(dashboardName);
    await this.clickCreateDashboard();
    await this.locators.dashboardDialog.waitFor({ state: 'hidden' });
    await this.locators.chosenDashboard(dashboardName).waitFor();
  }

  async clickDeleteDashboard() {
    await this.openDashboardMenu();
    await this.locators.dashboardMenuItem('Delete dashboard').click();
  }

  async confirmDeleteDashboard() {
    await this.locators.yesDeleteDashboardButton.click();
  }

  async removeAutomationRecords() {
    await this.openWorkspace();
    await this.chooseTab('People');
    while ((await this.locators.automationRows.count()) > 0) {
      const before = await this.locators.automationRows.count();
      await this.locators.firstAutomationCheckbox.check();
      await this.clickDeleteSelected();
      await this.locators.yesDeleteOneButton.click();
      await expect(this.locators.automationRows).toHaveCount(before - 1);
    }
    await this.chooseTab('Team');
    while ((await this.locators.automationMemberRemovers.count()) > 0) {
      const before = await this.locators.automationMemberRemovers.count();
      await this.locators.firstAutomationMemberRemover.click();
      await this.confirmRemoveMember();
      await expect(this.locators.automationMemberRemovers).toHaveCount(before - 1);
    }
    await this.chooseTab('Dashboards');
    await this.openDashboardMenu();
    while ((await this.locators.automationDashboardItems.count()) > 0) {
      await this.locators.firstAutomationDashboard.click();
      await this.clickDeleteDashboard();
      await this.confirmDeleteDashboard();
      await this.locators.deleteDashboardDialog('').waitFor({ state: 'hidden' }).catch(() => undefined);
      await this.openDashboardMenu();
    }
    await this.page.keyboard.press('Escape');
    await this.openLanding();
    await this.openTrashDialog();
    await this.chooseTrashTab();
    while ((await this.locators.automationForeverButtons.count()) > 0) {
      const before = await this.locators.automationForeverButtons.count();
      await this.locators.firstAutomationForever.click();
      await this.confirmDelete();
      await expect(this.locators.automationForeverButtons).toHaveCount(before - 1);
    }
  }

  async expectLanding() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.subtitle).toHaveText(CRM_SUBTITLE);
    await expect(this.locators.archiveTrashButton).toBeVisible();
    await expect(this.locators.crmLink).toBeVisible();
    await expect(this.locators.crmSetupButton).toBeVisible();
  }

  async expectTrashDialog() {
    await expect(this.locators.trashDescription).toBeVisible();
    await expect(this.locators.archivedTab).toBeVisible();
    await expect(this.locators.trashTab).toBeVisible();
  }

  async expectWorkspaceTabs() {
    await expect(this.page).toHaveURL(/crm\?open=1/);
    for (const tabName of CRM_TABS) {
      await expect(this.locators.crmTab(tabName)).toBeVisible();
    }
  }

  async expectDashboards() {
    await expect(this.locators.chooseDashboardButton).toBeVisible();
    await expect(this.locators.editDashboardButton).toBeVisible();
    await expect(this.locators.overviewTab).toBeVisible();
    await expect(this.locators.workTab).toBeVisible();
    for (const widgetName of DASHBOARD_WIDGETS) {
      await expect(this.locators.widget(widgetName)).toBeVisible();
    }
  }

  async expectTable(tableName: TableName) {
    const table = CRM_TABLES[tableName];
    await expect(this.locators.searchBox(table.search)).toBeVisible();
    for (const chipName of table.chips) {
      await expect(this.locators.chip(chipName)).toBeVisible();
    }
    for (const columnName of table.columns) {
      await expect(this.locators.columnHeader(columnName)).toBeVisible();
    }
    await expect(this.locators.newButton).toBeVisible();
  }

  async expectFilterByField() {
    await expect(this.locators.filterByFieldButton).toBeVisible();
  }

  async expectTableOrKanbanChoice() {
    await expect(this.locators.tableOrKanbanButton).not.toHaveCount(0);
  }

  async expectTeam() {
    await expect(this.locators.addPersonButton).toBeVisible();
    await expect(this.locators.workspace.getByRole('article')).not.toHaveCount(0);
  }

  async expectTabMenu() {
    for (const itemName of CRM_TAB_MENU) {
      await expect(this.locators.tabMenuItem(itemName)).toBeVisible();
    }
  }

  async expectFilterBuilder() {
    await expect(this.locators.filterField).toBeVisible();
    await expect(this.locators.filterValue).toBeVisible();
    await expect(this.locators.filterAdd).toBeDisabled();
    await expect(this.locators.filterCancel).toBeVisible();
  }

  async expectColumnMenu() {
    for (const itemName of COLUMN_MENU) {
      await expect(this.locators.columnMenuItem(itemName)).toBeVisible();
    }
  }

  async expectCrmUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/crm`));
    await expect(this.locators.heading.or(this.locators.crmTab('People'))).toBeVisible();
  }

  async expectPersonDialog() {
    await expect(this.locators.personSubtitle).toBeVisible();
    await expect(this.locators.firstNameField).toBeVisible();
    await expect(this.locators.lastNameField).toBeVisible();
    for (const labelText of ['Job title', 'Company', 'Email', 'Phone', 'LinkedIn']) {
      await expect(this.locators.personFieldLabel(labelText)).toBeVisible();
    }
    await expect(this.locators.emailField).toBeVisible();
    await expect(this.locators.linkedinField).toBeVisible();
    await expect(this.locators.companyButton).toBeVisible();
    await expect(this.locators.createPersonButton).toBeVisible();
    await expect(this.locators.personCancel).toBeVisible();
    await expect(this.locators.shortcutHint).toBeVisible();
  }

  async expectEmptyNameError() {
    await expect(this.locators.emptyNameError).toHaveText(CRM_EMPTY_NAME_ERROR);
    await expect(this.locators.personDialog).toBeVisible();
  }

  async expectPersonCreated(person: NewPerson) {
    await expect(this.locators.toast('Person created')).toBeVisible();
    await expect(this.locators.recordHeading(person.name)).toBeVisible();
  }

  async expectPersonRecord(person: NewPerson) {
    await expect(this.locators.recordHeading(person.name)).toBeVisible();
    await expect(this.locators.recordButton('Edit all')).toBeVisible();
    await expect(this.locators.recordButton('Delete')).toBeVisible();
    for (const buttonName of PERSON_EDIT_BUTTONS) {
      await expect(this.locators.recordButton(buttonName)).toBeVisible();
    }
    await expect(this.locators.sectionHeading('Notes')).toBeVisible();
    await expect(this.locators.sectionHeading('Tasks')).toBeVisible();
    await expect(this.locators.noneYet).toHaveCount(2);
  }

  async expectInlineEditor() {
    await expect(this.locators.inlineSave).toBeVisible();
    await expect(this.locators.inlineCancel).toBeVisible();
  }

  async expectJobTitleSaved(jobTitle: string) {
    await expect(this.locators.recordValue(jobTitle)).toBeVisible();
  }

  async expectDeleteRecordDialog(person: NewPerson) {
    await expect(this.locators.deleteRecordDialog(person.name)).toBeVisible();
    await expect(this.locators.deleteRecordWarning(person.name)).toBeVisible();
  }

  async expectRecordIsKept(person: NewPerson) {
    await expect(this.locators.deleteRecordDialog(person.name)).toBeHidden();
    await expect(this.locators.recordHeading(person.name)).toBeVisible();
  }

  async expectPersonIsDeleted() {
    await expect(this.locators.toast('Deleted')).toBeVisible();
  }

  async expectPersonInTrash(person: NewPerson) {
    await expect(this.locators.trashMeta('person')).not.toHaveCount(0);
    await expect(this.locators.restoreButton(person.name)).toBeVisible();
    await expect(this.locators.deleteForeverButton(person.name)).toBeVisible();
  }

  async expectDeleteForeverDialog(person: NewPerson) {
    await expect(this.locators.deleteForeverDialog(person.name)).toBeVisible();
    await expect(this.locators.deleteForeverWarning(person.name)).toBeVisible();
  }

  async expectPersonIsKeptInTrash(person: NewPerson) {
    await expect(this.locators.deleteForeverDialog(person.name)).toBeHidden();
    await expect(this.locators.deleteForeverButton(person.name)).toBeVisible();
  }

  async expectPersonDeletedForever(person: NewPerson) {
    await expect(this.locators.toast(`"${person.name}" deleted forever`)).toBeVisible();
    await expect(this.locators.deleteForeverButton(person.name)).toHaveCount(0);
  }

  async expectSelectionBar() {
    await expect(this.locators.deleteSelectedButton).toBeVisible();
    await expect(this.locators.clearSelectionButton).toBeVisible();
  }

  async expectBulkDeleteDialog() {
    await expect(this.locators.bulkDeleteDialog).toBeVisible();
  }

  async expectPersonIsStillListed(person: NewPerson) {
    await expect(this.locators.bulkDeleteDialog).toBeHidden();
    await expect(this.locators.personRow(person.name)).toBeVisible();
  }

  async expectMemberDialog() {
    await expect(this.locators.memberNote).toBeVisible();
    await expect(this.locators.memberNameField).toBeVisible();
    await expect(this.locators.memberEmailField).toBeVisible();
    await expect(this.locators.memberTitleField).toBeVisible();
    await expect(this.locators.memberCancel).toBeVisible();
    await expect(this.locators.addToTeamButton).toBeDisabled();
  }

  async expectMemberCard(member: NewMember) {
    await expect(this.locators.memberCard(member.name)).toBeVisible();
    await expect(this.locators.editMemberButton(member.name)).toBeVisible();
    await expect(this.locators.removeMemberButton(member.name)).toBeVisible();
  }

  async expectRemoveMemberDialog(member: NewMember) {
    await expect(this.locators.removeMemberDialog(member.name)).toBeVisible();
    await expect(this.locators.removeMemberWarning(member.name)).toBeVisible();
  }

  async expectMemberIsKept(member: NewMember) {
    await expect(this.locators.removeMemberDialog(member.name)).toBeHidden();
    await expect(this.locators.memberCard(member.name)).toBeVisible();
  }

  async expectMemberRemoved(member: NewMember) {
    await expect(this.locators.toast('Removed')).toBeVisible();
    await expect(this.locators.memberCard(member.name)).toHaveCount(0);
  }

  async expectDashboardDialog() {
    await expect(this.locators.dashboardNote).toBeVisible();
    await expect(this.locators.dashboardNameField).toBeVisible();
    await expect(this.locators.dashboardHint).toBeVisible();
    await expect(this.locators.dashboardCancel).toBeVisible();
    await expect(this.locators.createDashboardButton).toBeDisabled();
  }

  async expectNewDashboardIsChosen(dashboardName: string) {
    await expect(this.locators.chosenDashboard(dashboardName)).toBeVisible();
    await expect(this.locators.overviewTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectDeleteDashboardDialog(dashboardName: string) {
    await expect(this.locators.deleteDashboardDialog(dashboardName)).toBeVisible();
    await expect(this.locators.deleteDashboardWarning(dashboardName)).toBeVisible();
  }

  async expectDashboardIsKept(dashboardName: string) {
    await expect(this.locators.deleteDashboardDialog(dashboardName)).toBeHidden();
    await expect(this.locators.chosenDashboard(dashboardName)).toBeVisible();
  }

  async expectDashboardIsDeleted(dashboardName: string) {
    await expect(this.locators.deleteDashboardDialog(dashboardName)).toBeHidden();
    await expect(this.locators.chosenDashboard(dashboardName)).toHaveCount(0);
  }
}
