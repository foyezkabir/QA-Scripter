import type { Locator, Page } from '@playwright/test';

export class UserSpaceLocators {
  constructor(private readonly page: Page) {}

  spaceSwitcher = this.page.getByRole('button', { name: /^VOPS-358 Retest Space .*people/ });
  askTheTeamButton = this.page.getByRole('button', { name: 'Ask the team', exact: true });
  autopilotButton = this.page.getByRole('button', { name: /^Autopilot ·/ });
  representingLink = this.page.getByRole('link', { name: /^Asta Represents you here/ });
  collapseButton = this.page.getByRole('button', { name: /^(Collapse|Open) sidebar/ });
  sectionNav = this.page.getByRole('navigation', { name: 'Space sections' });

  sectionLink(sectionName: string): Locator {
    return this.sectionNav.getByRole('link', { name: sectionName, exact: true });
  }

  menuItem(itemName: string): Locator {
    return this.page.getByRole('menuitem', { name: itemName, exact: true });
  }

  heading(headingName: string, level = 1): Locator {
    return this.page.getByRole('heading', { name: headingName, level });
  }

  text(text: string): Locator {
    return this.page.getByText(text);
  }

  button(buttonName: string): Locator {
    return this.page.getByRole('button', { name: buttonName, exact: true });
  }

  buttonStartingWith(prefix: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${prefix}`) });
  }

  link(linkName: string): Locator {
    return this.page.getByRole('link', { name: linkName, exact: true });
  }

  dialog(dialogName: string): Locator {
    return this.page.getByRole('dialog', { name: dialogName });
  }

  dialogButton(dialogName: string, buttonName: string): Locator {
    return this.dialog(dialogName).getByRole('button', { name: buttonName, exact: true });
  }

  dialogChoice(dialogName: string, choiceName: string): Locator {
    // a choice button's name carries its description after the title, so match the start
    return this.dialog(dialogName).getByRole('button', { name: new RegExp(`^${choiceName.replace('/', '\\/')}`) });
  }

  presetButton(presetName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${presetName.replace('/', '\\/')}`) });
  }

  dialogText(dialogName: string, text: string): Locator {
    return this.dialog(dialogName).getByText(text);
  }

  dialogTextbox(dialogName: string): Locator {
    return this.dialog(dialogName).getByRole('textbox');
  }

  activityTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: new RegExp(`^${tabName} \\d+`) });
  }

  emptyActivityText = this.page.getByText('Nothing in this view right now.');
  threadRows = this.page.getByRole('button', { name: / Closed / });
  // any thread will do; which one comes first is not important
  firstThread = this.threadRows.first();
  reopenButton = this.page.getByRole('button', { name: 'Reopen', exact: true });
  replySend = this.page.getByRole('button', { name: 'Send', exact: true });
  participantsButton = this.page.getByRole('button', { name: /^\d+ (people|person)$/ });

  projectOpenLinks = this.page.getByRole('link', { name: 'Open', exact: true });
  workSearch = this.page.getByRole('textbox', { name: 'Search tasks' });
  everyProjectButton = this.page.getByRole('button', { name: /^(Every project|Projects)/ });
  assignedToMeButton = this.page.getByRole('button', { name: 'Assigned to me', exact: true });
  listButton = this.page.getByRole('button', { name: 'List', exact: true });
  boardButton = this.page.getByRole('button', { name: 'Board', exact: true });
  noTasksText = this.page.getByText('No tasks here yet');

  columnHeading(columnName: string): Locator {
    return this.page.getByText(columnName, { exact: true });
  }

  routineSearch = this.page.getByRole('searchbox', { name: 'Search routines' });
  premadeHeading = this.page.getByText('Start from a premade');
  routineRows = this.page.getByRole('button', { name: /Next in|Asked|Every / });
  // any routine will do; which one comes first is not important
  firstRoutine = this.routineRows.first();

  rowActions = this.page.getByRole('button', { name: 'Actions' });
  storageText = this.page.getByText(/^Storage/);

  memberRows = this.page.getByRole('button', { name: /^Manage / });
  askButtons = this.page.getByRole('button', { name: 'Ask', exact: true });
  // any member will do; which one comes first is not important
  firstAskButton = this.askButtons.first();
  inviteTextbox = this.page.getByRole('textbox', { name: /teammate@company.com|email/i });

  nameBox = this.page.getByRole('textbox', { name: 'Name' });
  spaceCard = this.page.getByRole('link', { name: /^VOPS-358 Retest Space/ });
}
