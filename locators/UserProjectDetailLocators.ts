import type { Locator, Page } from '@playwright/test';

export class UserProjectDetailLocators {
  constructor(private readonly page: Page) {}

  dashboard = this.page.getByRole('region', { name: 'Project dashboard' });
  projectHeading = this.dashboard.getByRole('heading', { level: 2 });
  closeDashboardButton = this.dashboard.getByRole('button', { name: 'Close the dashboard' });
  newTaskButton = this.dashboard.getByRole('button', { name: 'New task' });
  boardSettingsButton = this.dashboard.getByRole('button', { name: 'Board settings' });
  compactDensityButton = this.dashboard.getByRole('button', { name: 'Compact density' });

  tab(tabName: string): Locator {
    return this.dashboard.getByRole('tab', { name: new RegExp(`^${tabName}`) });
  }

  subtitle(text: string): Locator {
    return this.dashboard.getByText(text, { exact: true });
  }

  sectionHeading(text: string, level: number): Locator {
    return this.dashboard.getByRole('heading', { name: new RegExp(`^${text}`), level });
  }

  infoButton(tileName: string): Locator {
    return this.dashboard.getByRole('button', { name: `How ${tileName} is worked out` });
  }

  tileText(tileName: string): Locator {
    // a tile label can repeat as a heading or a per-person badge; the tile comes first in the page
    return this.dashboard.getByText(tileName, { exact: true }).first();
  }

  dashboardButton(buttonName: string): Locator {
    return this.dashboard.getByRole('button', { name: buttonName, exact: true });
  }

  coversButton = this.dashboard.getByRole('button', { name: /^Covers:/ });
  seeEverythingButton = this.dashboard.getByRole('button', { name: /^See everything/ });

  chatComposer = this.page.getByRole('textbox', { name: 'Type a message…' });
  chatSend = this.page.getByRole('button', { name: 'Send message' });
  chatNewChat = this.page.getByRole('button', { name: 'New chat', description: 'Start a new chat in this project' });
  chatAttach = this.page.getByRole('button', { name: 'Add attachments' });
  chatModel = this.page.getByRole('button', { name: /^(Primary|Coder|Fast)$/ });
  chatSpeech = this.page.getByRole('button', { name: 'Speech to text' });
  chatSuggestion = this.page.getByRole('button', { name: 'Where does this project stand?' });

  boardToolbar = this.dashboard.getByRole('toolbar', { name: 'Board filters' });
  viewsButton = this.boardToolbar.getByRole('button', { name: 'Views' });
  viewGroup = this.boardToolbar.getByRole('radiogroup', { name: 'View' });

  viewChoice(choiceName: string): Locator {
    return this.viewGroup.getByRole('radio', { name: choiceName, exact: true });
  }

  cardSearch = this.boardToolbar.getByRole('searchbox', { name: 'Search the cards on this board' });
  myTasksButton = this.boardToolbar.getByRole('button', { name: 'My tasks' });
  roundButton = this.boardToolbar.getByRole('button', { name: /^Round / });
  filterButton = this.boardToolbar.getByRole('button', { name: 'Filter', exact: true });
  viewOptionsButton = this.boardToolbar.getByRole('button', { name: 'View options' });
  hiddenTasksStatus = this.dashboard.getByRole('status').filter({ hasText: /tasks? hidden by/ });
  showAllButton = this.dashboard.getByRole('button', { name: 'Show all' });

  menuItem(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: new RegExp(`^${itemName.replace(/[()]/g, '\\$&')}`) });
  }

  menuCheckboxItem(itemName: string): Locator {
    return this.page.getByRole('menuitemcheckbox', { name: itemName });
  }

  viewOptionsDialog = this.page.getByRole('dialog').filter({ has: this.page.getByRole('button', { name: 'Keyboard shortcuts' }) });
  groupBySelect = this.viewOptionsDialog.getByRole('combobox', { name: 'Group by' });
  sortBySelect = this.viewOptionsDialog.getByRole('combobox', { name: 'Sort by' });
  comfortableChoice = this.viewOptionsDialog.getByRole('radio', { name: 'Comfortable' });
  compactChoice = this.viewOptionsDialog.getByRole('radio', { name: 'Compact' });
  keyboardShortcutsButton = this.viewOptionsDialog.getByRole('button', { name: 'Keyboard shortcuts' });

  viewsDialog = this.page.getByRole('dialog').filter({ has: this.page.getByRole('button', { name: 'Save view' }) });
  viewNameField = this.viewsDialog.getByRole('textbox', { name: 'View name' });
  shareViewCheckbox = this.viewsDialog.getByRole('checkbox', { name: 'Share with everyone on this board' });
  saveViewButton = this.viewsDialog.getByRole('button', { name: 'Save view' });

  newTaskDialog = this.page.getByRole('dialog', { name: 'New task' });
  newTaskClose = this.newTaskDialog.getByRole('button', { name: 'Close' });
  createTaskButton = this.newTaskDialog.getByRole('button', { name: 'Create task' });
  createAnotherCheckbox = this.newTaskDialog.getByRole('checkbox', { name: 'Create another' });
  estimateField = this.newTaskDialog.getByRole('spinbutton', { name: 'Estimate' });
  startButton = this.newTaskDialog.getByRole('button', { name: /^Start/ });
  dueButton = this.newTaskDialog.getByRole('button', { name: /^Due/ });

  newTaskField(fieldName: string): Locator {
    return this.newTaskDialog.getByRole('textbox', { name: fieldName });
  }

  newTaskList(listName: string): Locator {
    return this.newTaskDialog.getByRole('combobox', { name: listName });
  }

  boardSettingsDialog = this.page.getByRole('dialog', { name: 'Board settings' });
  boardSettingsCancel = this.boardSettingsDialog.getByRole('button', { name: 'Cancel', exact: true });
  boardSettingsSave = this.boardSettingsDialog.getByRole('button', { name: 'Save', exact: true });

  boardSettingsTab(tabName: string): Locator {
    return this.boardSettingsDialog.getByRole('tab', { name: tabName, exact: true });
  }

  layoutButton(layoutName: string): Locator {
    return this.boardSettingsDialog.getByRole('button', { name: new RegExp(`^${layoutName.replace(/[()+]/g, '\\$&')}`) });
  }
}
