import type { Locator, Page } from '@playwright/test';

export class UserCrmLocators {
  constructor(private readonly page: Page) {}

  main = this.page.getByRole('main');
  heading = this.main.getByRole('heading', { name: 'CRM', level: 1 });
  subtitle = this.main.getByText('Your book of business in one place, so your assistant always knows who matters and what is at risk');
  archiveTrashButton = this.main.getByRole('button', { name: /^Archive & Trash/ });
  crmLink = this.main.getByRole('link', { name: /^Open / });
  crmSetupButton = this.main.getByRole('button', { name: 'CRM setup' });

  trashDialog = this.page.getByRole('dialog', { name: 'Archive & Trash' });
  trashDescription = this.trashDialog.getByText('Nothing here is gone. Put anything back where it was, or clear out what you are sure about.');
  archivedTab = this.trashDialog.getByRole('tab', { name: /^Archived \(\d+\)/ });
  trashTab = this.trashDialog.getByRole('tab', { name: /^Trash \(\d+\)/ });

  trashMeta(kind: string): Locator {
    return this.trashDialog.getByText(new RegExp(`^${kind} · deleted`));
  }

  restoreButton(recordName: string): Locator {
    return this.trashDialog.getByRole('button', { name: `Restore ${recordName}`, exact: true });
  }

  deleteForeverButton(recordName: string): Locator {
    return this.trashDialog.getByRole('button', { name: `Delete ${recordName} forever`, exact: true });
  }

  automationForeverButtons = this.trashDialog.getByRole('button', { name: /^Delete QA-AUTO .* forever$/ });
  // every QA-AUTO row is deleted in turn, so whichever one is first is the next
  firstAutomationForever = this.automationForeverButtons.first();

  deleteForeverDialog(recordName: string): Locator {
    return this.page.getByRole('dialog', { name: `Delete "${recordName}" forever?` });
  }

  deleteForeverWarning(recordName: string): Locator {
    return this.deleteForeverDialog(recordName).getByText('This removes the person from your CRM for good. VelaCrew keeps a copy in the change log, but nothing in the CRM will hold it again. This cannot be undone.');
  }

  // a confirmation opens on top of the dialog that started it, so the last dialog is the topmost one
  topDialog = this.page.getByRole('dialog').last();

  workspace = this.page.getByRole('region', { name: 'CRM records' });

  crmTab(tabName: string): Locator {
    return this.workspace.getByRole('button', { name: new RegExp(`^${tabName}( \\d+)?$`) });
  }

  tabMenuButton = this.workspace.getByRole('button', { name: 'Choose which tabs to show' });

  tabMenuItem(itemName: string): Locator {
    return this.page.getByRole('menuitemcheckbox', { name: new RegExp(`^${itemName}`) });
  }

  chooseDashboardButton = this.workspace.getByRole('button', { name: 'Choose a dashboard' });
  editDashboardButton = this.workspace.getByRole('button', { name: 'Edit', exact: true });
  overviewTab = this.workspace.getByRole('tab', { name: 'Overview' });
  workTab = this.workspace.getByRole('tab', { name: 'Work' });

  widget(widgetName: string): Locator {
    return this.workspace.getByRole('region', { name: widgetName, exact: true });
  }

  searchBox(placeholder: string): Locator {
    return this.workspace.getByRole('textbox', { name: placeholder });
  }

  chip(chipName: string): Locator {
    return this.workspace.getByRole('button', { name: chipName, exact: true });
  }

  newButton = this.workspace.getByRole('button', { name: 'New', exact: true });
  filterByFieldButton = this.workspace.getByRole('button', { name: 'Filter by field' });
  tableOrKanbanButton = this.workspace.getByRole('button', { name: /^(Table|Kanban) view/ });

  columnHeader(columnName: string): Locator {
    return this.workspace.getByRole('button', { name: `${columnName} column options` });
  }

  columnMenuItem(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: itemName, exact: true });
  }

  // the field choice is the first of the builder's two choices
  filterField = this.workspace.getByRole('combobox').first();
  filterValue = this.workspace.getByRole('textbox', { name: 'Value' });
  filterAdd = this.workspace.getByRole('button', { name: 'Add', exact: true });
  filterCancel = this.workspace.getByRole('button', { name: 'Cancel', exact: true });

  personRow(recordName: string): Locator {
    return this.workspace.getByRole('row').filter({ hasText: recordName });
  }

  rowCheckbox(recordName: string): Locator {
    return this.personRow(recordName).getByRole('checkbox', { name: 'Select row' });
  }

  clearSelectionButton = this.workspace.getByRole('button', { name: 'Clear', exact: true });
  deleteSelectedButton = this.workspace.getByRole('button', { name: 'Delete', exact: true });
  bulkDeleteDialog = this.page.getByRole('dialog', { name: 'Delete 1 record?' });

  automationRows = this.workspace.getByRole('row').filter({ hasText: 'QA-AUTO' });
  // every QA-AUTO row is selected in turn, so whichever one is first is the next
  firstAutomationCheckbox = this.automationRows.first().getByRole('checkbox', { name: 'Select row' });

  personDialog = this.page.getByRole('dialog', { name: 'New person' });
  personSubtitle = this.personDialog.getByText('Saved to your VelaCrew CRM as soon as you create it.');
  firstNameField = this.personDialog.getByRole('textbox', { name: 'First' });
  lastNameField = this.personDialog.getByRole('textbox', { name: 'Last' });
  emailField = this.personDialog.getByRole('textbox', { name: 'name@company.com' });
  linkedinField = this.personDialog.getByRole('textbox', { name: 'https://' });
  companyButton = this.personDialog.getByRole('button', { name: 'Choose…' });
  createPersonButton = this.personDialog.getByRole('button', { name: 'Create person' });
  personCancel = this.personDialog.getByRole('button', { name: 'Cancel', exact: true });
  shortcutHint = this.personDialog.getByText('⌘↵ to create');
  emptyNameError = this.personDialog.getByText('Name cannot be empty.');

  personFieldLabel(labelText: string): Locator {
    return this.personDialog.getByText(labelText, { exact: true });
  }

  notifications = this.page.getByRole('region', { name: /^Notifications/ });

  toast(text: string): Locator {
    return this.notifications.getByText(text);
  }

  recordHeading(recordName: string): Locator {
    return this.workspace.getByRole('heading', { name: recordName, level: 3 });
  }

  recordButton(buttonName: string): Locator {
    return this.workspace.getByRole('button', { name: buttonName, exact: true });
  }

  sectionHeading(headingName: string): Locator {
    return this.workspace.getByRole('heading', { name: headingName, level: 4 });
  }

  noneYet = this.workspace.getByText('None yet.');

  // a record view has no other textbox, so the inline editor is the only one in the workspace
  inlineEditorBox = this.workspace.getByRole('textbox');

  inlineSave = this.workspace.getByRole('button', { name: 'Save', exact: true });
  inlineCancel = this.workspace.getByRole('button', { name: 'Cancel', exact: true });

  recordValue(text: string): Locator {
    return this.workspace.getByText(text, { exact: true });
  }

  deleteRecordDialog(recordName: string): Locator {
    return this.page.getByRole('dialog', { name: `Delete ${recordName}?` });
  }

  deleteRecordWarning(recordName: string): Locator {
    return this.deleteRecordDialog(recordName).getByText("It moves to your CRM's trash, where it can be restored. VelaCrew also keeps a copy in the change log.");
  }

  keepItButton = this.topDialog.getByRole('button', { name: 'Keep it' });
  yesDeleteButton = this.topDialog.getByRole('button', { name: /^Yes, delete$/ });
  yesDeleteOneButton = this.bulkDeleteDialog.getByRole('button', { name: 'Yes, delete 1' });

  addPersonButton = this.workspace.getByRole('button', { name: 'Add person' });
  memberDialog = this.page.getByRole('dialog', { name: 'Add someone to the team' });
  memberNote = this.memberDialog.getByText('They become selectable as an owner or assignee straight away. This does not create a VelaCrew account, send an invitation, or give anybody access to your workspace.');
  memberNameField = this.memberDialog.getByRole('textbox', { name: 'Name*' });
  memberEmailField = this.memberDialog.getByRole('textbox', { name: 'Email' });
  memberTitleField = this.memberDialog.getByRole('textbox', { name: 'Job title' });
  addToTeamButton = this.memberDialog.getByRole('button', { name: 'Add to team' });
  memberCancel = this.memberDialog.getByRole('button', { name: 'Cancel', exact: true });

  memberCard(memberName: string): Locator {
    return this.workspace.getByRole('article').filter({ hasText: memberName });
  }

  editMemberButton(memberName: string): Locator {
    return this.workspace.getByRole('button', { name: `Edit ${memberName}`, exact: true });
  }

  removeMemberButton(memberName: string): Locator {
    return this.workspace.getByRole('button', { name: `Remove ${memberName} from the team`, exact: true });
  }

  removeMemberDialog(memberName: string): Locator {
    return this.page.getByRole('dialog', { name: `Remove ${memberName} from the team?` });
  }

  removeMemberWarning(memberName: string): Locator {
    return this.removeMemberDialog(memberName).getByText('They have nothing assigned. They will stop appearing in owner and assignee pickers.');
  }

  yesRemoveButton = this.topDialog.getByRole('button', { name: 'Yes, remove' });
  automationMemberRemovers = this.workspace.getByRole('button', { name: /^Remove QA-AUTO .* from the team$/ });
  // every QA-AUTO member is removed in turn, so the first one is the next
  firstAutomationMemberRemover = this.automationMemberRemovers.first();

  dashboardMenuItem(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: new RegExp(`^${itemName}`) });
  }

  dashboardDialog = this.page.getByRole('dialog', { name: 'New dashboard' });
  dashboardNote = this.dashboardDialog.getByText('Everyone whose agent is bound to this CRM workspace will see it.');
  dashboardHint = this.dashboardDialog.getByText('You can rename it at any time.');
  dashboardNameField = this.dashboardDialog.getByRole('textbox', { name: 'Name' });
  createDashboardButton = this.dashboardDialog.getByRole('button', { name: 'Create dashboard' });
  dashboardCancel = this.dashboardDialog.getByRole('button', { name: 'Cancel', exact: true });
  emptyDashboardText = this.workspace.getByText('Nothing here yet. Add a widget from the bar above.');

  chosenDashboard(dashboardName: string): Locator {
    return this.workspace.getByRole('button', { name: 'Choose a dashboard' }).filter({ hasText: dashboardName });
  }

  deleteDashboardDialog(dashboardName: string): Locator {
    return this.page.getByRole('dialog', { name: `Delete "${dashboardName}"?` });
  }

  deleteDashboardWarning(dashboardName: string): Locator {
    return this.deleteDashboardDialog(dashboardName).getByText('Every agent on this workspace loses it. The records it charted are untouched.');
  }

  yesDeleteDashboardButton = this.topDialog.getByRole('button', { name: 'Yes, delete the dashboard' });
  automationDashboardItems = this.page.getByRole('menuitem', { name: /QA-AUTO .* \d+ tabs?$/ });
  // every QA-AUTO dashboard is chosen and deleted in turn, so the first one is the next
  firstAutomationDashboard = this.automationDashboardItems.first();

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  crmSectionLink = this.agentSections.getByRole('link', { name: 'CRM', exact: true });
}
