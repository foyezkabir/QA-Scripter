import type { Locator, Page } from '@playwright/test';

export class UserHomeLocators {
  constructor(private readonly page: Page) {}

  subtitle = this.page.getByText('Your assistants, and the teams they work in.');
  createButton = this.page.getByRole('button', { name: 'Create', exact: true });
  assistantsHeading = this.page.getByRole('heading', { name: 'Assistants', level: 2 });
  teamSpacesHeading = this.page.getByRole('heading', { name: 'Team spaces', level: 2 });

  welcomeHeading(firstName: string): Locator {
    return this.page.getByRole('heading', { name: `Welcome back, ${firstName}`, level: 1 });
  }

  createMenu = this.page.getByRole('menu', { name: 'Create' });
  createAgentItem = this.createMenu.getByRole('menuitem', { name: /^Agent/ });
  createTeamSpaceItem = this.createMenu.getByRole('menuitem', { name: /^Team space/ });
  createAgentHint = this.createMenu.getByText('Your own assistant, guided setup.');
  createTeamSpaceHint = this.createMenu.getByText('Invite people who bring their own agents.');

  assistantName(assistantName: string): Locator {
    return this.page.getByRole('heading', { name: assistantName, level: 3, exact: true });
  }

  assistantRole(roleName: string): Locator {
    return this.page.getByText(roleName, { exact: true });
  }

  moreButton(assistantName: string): Locator {
    return this.page.getByRole('button', { name: `More for ${assistantName}` });
  }

  moreMenu(assistantName: string): Locator {
    return this.page.getByRole('menu', { name: `More for ${assistantName}` });
  }

  configureItem(assistantName: string): Locator {
    return this.moreMenu(assistantName).getByRole('menuitem', { name: 'Configure' });
  }

  restartItem(assistantName: string): Locator {
    return this.moreMenu(assistantName).getByRole('menuitem', { name: 'Restart' });
  }

  twoFactorText = this.page.getByText('Protect your account. Turn on two-factor authentication.');
  enableTwoFactorLink = this.page.getByRole('link', { name: 'Enable 2FA' });
  dismissBannerButton = this.page.getByRole('button', { name: 'Dismiss', exact: true });
}
