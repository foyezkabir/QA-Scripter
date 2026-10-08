import type { Locator, Page } from '@playwright/test';

export class UserShellLocators {
  constructor(private readonly page: Page) {}

  welcomeHeading = this.page.getByRole('heading', { name: /Welcome back/, level: 1 });

  sidebar = this.page.getByRole('complementary', { name: 'Main' });
  logoLink = this.sidebar.getByRole('link', { name: 'VelaCrew' });
  homeLink = this.sidebar.getByRole('link', { name: 'Home', exact: true });
  myWorkLink = this.sidebar.getByRole('link', { name: 'My work', exact: true });
  searchButton = this.sidebar.getByRole('button', { name: 'Search', exact: true });
  notificationsButton = this.sidebar.getByRole('button', { name: 'Notifications', exact: true });
  settingsButton = this.sidebar.getByRole('button', { name: 'Settings', exact: true });
  accountButton = this.sidebar.getByRole('button', { name: 'Account', exact: true });

  assistantLink(assistantName: string): Locator {
    return this.sidebar.getByRole('link', { name: assistantName });
  }

  palette = this.page.getByRole('dialog', { name: 'Command palette' });
  paletteSearchBox = this.palette.getByRole('combobox', { name: 'Search or run a command' });
  // the palette has two Close command palette buttons (header and footer) with the same name; either closes it
  paletteCloseButton = this.palette.getByRole('button', { name: 'Close command palette' }).first();

  paletteTab(tabName: string): Locator {
    return this.palette.getByRole('tab', { name: tabName, exact: true });
  }

  quickAction(actionName: string): Locator {
    return this.palette.getByRole('option', { name: new RegExp(`^${actionName}`) });
  }

  notificationsPanel = this.page.getByRole('dialog', { name: 'Notifications' });
  showNotificationsGroup = this.notificationsPanel.getByRole('radiogroup', { name: 'Show notifications' });
  allRadio = this.showNotificationsGroup.getByRole('radio', { name: 'All' });
  unreadRadio = this.showNotificationsGroup.getByRole('radio', { name: 'Unread' });

  settingsDialog = this.page.getByRole('dialog', { name: 'Settings' });

  settingsSection(sectionName: string): Locator {
    return this.settingsDialog.getByRole('navigation', { name: 'Settings sections' }).getByRole('button', { name: sectionName, exact: true });
  }

  accountMenu = this.page.getByRole('menu', { name: 'Account' });

  accountMenuText(text: string): Locator {
    return this.accountMenu.getByText(text, { exact: true });
  }

  accountMenuItem(itemName: string): Locator {
    return this.accountMenu.getByRole('menuitem', { name: itemName, exact: true });
  }
}
