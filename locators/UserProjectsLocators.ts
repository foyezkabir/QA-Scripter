import type { Locator, Page } from '@playwright/test';

export class UserProjectsLocators {
  constructor(private readonly page: Page) {}

  main = this.page.getByRole('main');
  heading = this.main.getByRole('heading', { name: 'Projects', level: 1 });
  pageDescription = this.main.getByText('Group everything for one piece of work together so your assistant always knows the full story');
  peopleButton = this.main.getByRole('button', { name: /^People/ });
  trashButton = this.main.getByRole('button', { name: /^Trash & Archive/ });
  importJiraButton = this.main.getByRole('button', { name: 'Import from Jira' });
  importHulyButton = this.main.getByRole('button', { name: 'Import from Huly' });
  newProjectButton = this.main.getByRole('button', { name: 'New Project' });
  searchBox = this.main.getByRole('searchbox', { name: 'Search projects' });
  clearSearchButton = this.main.getByRole('button', { name: 'Clear search' });
  noMatchText = this.main.getByText('No projects match your search.');
  sortButton = this.main.getByRole('button', { name: /^Sort:/ });

  sortOption(optionName: string): Locator {
    return this.page.getByRole('menuitemradio', { name: optionName, exact: true });
  }

  projectLinks = this.main.getByRole('link', { name: /^Open project / });
  editProjectButtons = this.main.getByRole('button', { name: 'Edit project' });
  // any card will do and the order of cards changes with Sort, so the first one is enough
  firstProjectLink = this.projectLinks.first();
  // any card will do and the order of cards changes with Sort, so the first one is enough
  firstEditProjectButton = this.editProjectButtons.first();

  projectLinkNamed(projectName: string): Locator {
    return this.main.getByRole('link', { name: `Open project ${projectName}` });
  }

  createDialog = this.page.getByRole('dialog', { name: 'Create Project' });
  settingsDialog = this.page.getByRole('dialog', { name: 'Project Settings' });

  dialogField(dialog: Locator, fieldName: string): Locator {
    return dialog.getByRole('textbox', { name: fieldName, exact: true });
  }

  dialogButton(dialog: Locator, buttonName: string): Locator {
    return dialog.getByRole('button', { name: buttonName, exact: true });
  }

  kindOption(dialog: Locator, kindName: string): Locator {
    return dialog.getByRole('radio', { name: new RegExp(`^${kindName.replace(/[()]/g, '\\$&')} `) });
  }

  teamProjectSwitch(dialog: Locator): Locator {
    return dialog.getByRole('switch', { name: 'Team project' });
  }

  createSubtitle = this.createDialog.getByText('Keep everything for one job in a single place so nothing gets lost');
  kindFixedNote = this.settingsDialog.getByText('Fixed now that the board has tasks - their kinds of work were sorted for it.');
  roundNameField = this.settingsDialog.getByRole('textbox', { name: 'What you call a round of work' });
  everyoneVisibilityButton = this.settingsDialog.getByRole('button', { name: /^Everyone in your Team Space/ });
  onlyPeopleVisibilityButton = this.settingsDialog.getByRole('button', { name: /^Only people I add/ });
  peopleOnBoardText = this.settingsDialog.getByText('People on this board', { exact: true });
  lockedKindOption = this.settingsDialog.getByRole('radio', { checked: true, disabled: true });

  peopleDialog = this.page.getByRole('dialog', { name: 'People' });
  peopleDescription = this.peopleDialog.getByText("Your assistant's contact book - everyone across all projects, in one place.");
  peopleSearch = this.peopleDialog.getByRole('textbox', { name: 'Search people' });
  addPersonButton = this.peopleDialog.getByRole('button', { name: 'Add Person' });
  editPersonButtons = this.peopleDialog.getByRole('button', { name: /^Edit / });
  removePersonButtons = this.peopleDialog.getByRole('button', { name: /^Remove / });

  peopleTab(tabName: string): Locator {
    return this.peopleDialog.getByRole('tab', { name: new RegExp(`^${tabName} \\d+`) });
  }

  trashDialog = this.page.getByRole('dialog', { name: 'Trash & Archive' });
  trashDescription = this.trashDialog.getByText("Nothing here is gone yet. Put anything back where it was, or clear out what you're sure about.");
  archivedTab = this.trashDialog.getByRole('tab', { name: /^Archived \(\d+\)/ });
  trashTab = this.trashDialog.getByRole('tab', { name: /^Trash \(\d+\)/ });
  deletedRows = this.trashDialog.getByText(/Deleted .* · Left \d+ days/);

  jiraDialog = this.page.getByRole('dialog', { name: 'Import from Jira' });
  hulyDialog = this.page.getByRole('dialog', { name: 'Import from Huly' });

  importDescription(dialog: Locator, trackerName: string): Locator {
    return dialog.getByText(`Import creates a local copy. Re-import adds issues that are new in ${trackerName}; it never changes tasks you already have.`);
  }

  importSearch(dialog: Locator): Locator {
    return dialog.getByRole('textbox', { name: 'Search projects…' });
  }

  firstImportColumnsCheckbox(dialog: Locator): Locator {
    return dialog.getByRole('checkbox', { name: "On a first import, create board columns from the tracker's statuses" });
  }

  importButtons(dialog: Locator): Locator {
    return dialog.getByRole('button', { name: 'Import', exact: true });
  }

  toast(text: string): Locator {
    return this.page.getByRole('region', { name: /^Notifications/ }).getByText(text);
  }

  cardEditButton(projectName: string): Locator {
    return this.projectLinkNamed(projectName).getByRole('button', { name: 'Edit project' });
  }

  cardText(projectName: string, text: string): Locator {
    return this.projectLinkNamed(projectName).getByText(text);
  }

  archiveDialog(projectName: string): Locator {
    return this.page.getByRole('dialog', { name: `Archive "${projectName}"?` });
  }

  trashConfirmDialog(projectName: string): Locator {
    return this.page.getByRole('dialog', { name: `Move "${projectName}" to trash?` });
  }

  restoreDialog(projectName: string): Locator {
    return this.page.getByRole('dialog', { name: `Restore "${projectName}"?` });
  }

  deleteForeverDialog(projectName: string): Locator {
    return this.page.getByRole('dialog', { name: `Delete "${projectName}" forever?` });
  }

  confirmButton(dialog: Locator, buttonName: string): Locator {
    return dialog.getByRole('button', { name: buttonName, exact: true });
  }

  archiveWarning(projectName: string): Locator {
    return this.archiveDialog(projectName).getByText('It leaves your project list and the agent stops tracking it. Restore it any time from Trash & Archive.');
  }

  trashWarning(projectName: string): Locator {
    return this.trashConfirmDialog(projectName).getByText("It stays restorable for 30 days in Trash & Archive, then it's deleted permanently - milestones and files included.");
  }

  restoreWarning(projectName: string): Locator {
    return this.restoreDialog(projectName).getByText('It goes back into your active projects, and the agent starts tracking it again.');
  }

  deleteForeverWarning(projectName: string): Locator {
    return this.deleteForeverDialog(projectName).getByText("This permanently removes the project, its milestones, its rounds of work and its files. Your chats stay in your history, just ungrouped. This can't be undone.");
  }

  archivedRowText(projectName: string): Locator {
    return this.trashDialog.getByText(projectName, { exact: true });
  }

  archivedMeta = this.trashDialog.getByText(/^Archived .* · \d+ milestones? · \d+ chats?$/);

  restoreButton(projectName: string): Locator {
    return this.trashDialog.getByRole('button', { name: `Restore ${projectName}`, exact: true });
  }

  moveToTrashButton(projectName: string): Locator {
    return this.trashDialog.getByRole('button', { name: `Move ${projectName} to trash`, exact: true });
  }

  deleteForeverButton(projectName: string): Locator {
    return this.trashDialog.getByRole('button', { name: `Delete ${projectName} forever`, exact: true });
  }

  // a confirmation opens on top of the dialog that started it, so the last dialog is the topmost one
  topDialog = this.page.getByRole('dialog').last();
  automationCards = this.main.getByRole('link', { name: /^Open project QA-AUTO / });
  // every QA-AUTO project is put away in turn, so whichever card is first is the next one
  firstAutomationEdit = this.automationCards.first().getByRole('button', { name: 'Edit project' });
  automationArchivedRows = this.trashDialog.getByRole('button', { name: /^Move QA-AUTO .* to trash$/ });
  // every archived QA-AUTO project is moved in turn, so the first one is the next
  firstAutomationArchived = this.automationArchivedRows.first();
  automationDeleteButtons = this.trashDialog.getByRole('button', { name: /^Delete QA-AUTO .* forever$/ });
  // every trashed QA-AUTO project is deleted in turn, so the first one is the next
  firstAutomationDelete = this.automationDeleteButtons.first();

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  projectsLink = this.agentSections.getByRole('link', { name: 'Projects', exact: true });
}
