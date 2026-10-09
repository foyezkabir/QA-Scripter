import type { Locator, Page } from '@playwright/test';

export class UserToolsLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Tools', level: 1 });
  intro = this.page.getByText('Connect the apps you already use so your assistant can do the work for you.');
  browseButton = this.page.getByRole('button', { name: 'Browse Tool' });
  connectedButton = this.page.getByRole('button', { name: /^Connected \(\d+\)$/ });
  searchTools = this.page.getByRole('textbox', { name: 'Search tools…' });
  searchConnected = this.page.getByRole('textbox', { name: 'Search connected tools…' });
  syncButton = this.page.getByRole('button', { name: 'Sync', exact: true });

  categoryHeader(categoryName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${categoryName} \\d+$`) });
  }

  toolImage(toolName: string): Locator {
    return this.page.getByRole('img', { name: toolName, exact: true });
  }

  toolName(toolName: string): Locator {
    return this.page.getByText(toolName, { exact: true });
  }

  permissionGroup(toolName: string): Locator {
    return this.page.getByRole('group', { name: `${toolName} permission` });
  }

  permissionButton(toolName: string, label: string): Locator {
    return this.permissionGroup(toolName).getByRole('button', { name: label, exact: true });
  }

  pressedPermission(toolName: string): Locator {
    return this.permissionGroup(toolName).getByRole('button', { pressed: true });
  }

  // the icon-only Connect buttons have a title but no accessible name, so the title is the only handle
  connectButtons = this.page.getByTitle('Connect', { exact: true });
  connectionErrorButtons = this.page.getByRole('button', { name: 'Connection error' });
  // either Scheduling tool shows the same error, so the first one is enough
  firstConnectionError = this.connectionErrorButtons.first();
  connectionErrorPopover = this.page.getByRole('dialog').filter({ hasText: 'Click Try again to retry.' });

  noMatchText(query: string): Locator {
    return this.page.getByText(`Nothing matches “${query}”. Try a different name or clear the search.`);
  }

  connectedLabels = this.page.getByText(/^Connected( ·|$)/);
  manageButtons = this.page.getByRole('button', { name: 'Manage', exact: true });
  // any connected card will do; the order of cards is not important
  firstManageButton = this.manageButtons.first();
  manageMenu = this.page.getByRole('menu', { name: 'Manage' });
  reauthenticateItem = this.manageMenu.getByRole('menuitem', { name: /^Reauthenticate/ });
  disconnectItem = this.manageMenu.getByRole('menuitem', { name: 'Disconnect' });

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  toolsLink = this.agentSections.getByRole('link', { name: 'Tools', exact: true });
}
