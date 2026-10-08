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

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  projectsLink = this.agentSections.getByRole('link', { name: 'Projects', exact: true });
}
