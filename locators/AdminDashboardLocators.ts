import type { Locator, Page } from '@playwright/test';

export class AdminDashboardLocators {
  constructor(private readonly page: Page) {}

  welcomeHeading = this.page.getByRole('heading', { name: /Welcome back/ });
  welcomeSubtitle = this.page.getByText('A few things need a look. Here is how your workspace is doing today.');
  searchInput = this.page.getByRole('searchbox', { name: 'Search agents, people or events' });
  noRatingsText = this.page.getByText('Nobody has rated a reply yet');

  sectionHeading(sectionName: string): Locator {
    return this.page.getByRole('heading', { name: sectionName, level: 2 });
  }

  sidebar = this.page.getByRole('complementary');
  sidebarNav = this.page.getByRole('navigation', { name: 'Admin sections' });
  logoLink = this.sidebar.getByRole('link', { name: 'Admin dashboard' });
  managementLabel = this.sidebar.getByText('Management', { exact: true });
  systemLabel = this.sidebar.getByText('System', { exact: true });
  collapseButton = this.sidebar.getByRole('button', { name: 'Collapse sidebar' });
  expandButton = this.sidebar.getByRole('button', { name: 'Expand sidebar' });
  adminAccountButton = this.sidebar.getByRole('button', { name: 'Admin account' });
  adminAccountLink = this.sidebar.getByRole('link', { name: 'Admin account' });
  superAdminRole = this.adminAccountButton.getByText('Super Admin');

  navLink(linkName: string): Locator {
    return this.sidebarNav.getByRole('link', { name: linkName, exact: true });
  }

  cardOptionsButton(cardName: string): Locator {
    return this.page.getByRole('button', { name: `${cardName} options` });
  }

  viewDetailsItem = this.page.getByRole('menuitem', { name: 'View details' });

  channelFilterButton(label: string): Locator {
    return this.page.getByRole('main').getByRole('button', { name: label, exact: true });
  }

  allChannelsItem = this.page.getByRole('menuitemradio', { name: 'All channels' });
  connectedOnlyItem = this.page.getByRole('menuitemradio', { name: 'Connected only' });

  seeAllLink = this.page.getByRole('link', { name: 'See all' });
  learningCentreLink = this.page.getByRole('link', { name: 'Open the learning centre' });

  appearanceMenuItem = this.page.getByRole('menuitem', { name: /Appearance/ });
  accountMenu = this.page.getByRole('menu');
}
