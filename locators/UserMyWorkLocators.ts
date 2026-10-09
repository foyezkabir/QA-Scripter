import type { Locator, Page } from '@playwright/test';

export class UserMyWorkLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'My work', level: 1 });
  subtitle = this.page.getByText(/^\d+ open tasks?\.$/);
  projectFilter = this.page.getByRole('combobox', { name: 'Filter by project' });
  sortList = this.page.getByRole('combobox', { name: 'Sort my work' });
  allProjectsOption = this.page.getByRole('option', { name: /^All projects/ });
  projectOptions = this.page.getByRole('option', { name: / · / });

  sortOption(optionName: string): Locator {
    // the chosen option is announced as "<name>, selected", so match the start of the name
    return this.page.getByRole('option', { name: new RegExp(`^${optionName}`) });
  }

  groupHeadings = this.page.getByRole('heading', { level: 2, name: /^.+ \d+$/ });
  groupRegions = this.page.getByRole('region').filter({ has: this.groupHeadings });
  taskKeys = this.groupRegions.getByText(/^[A-Z][A-Z0-9]+-\d+$/);
  taskLinks = this.groupRegions.getByRole('link').filter({ hasNotText: 'Open board' });
  openBoardLinks = this.groupRegions.getByRole('link', { name: /^Open board for / });
  // any task will do; which one comes first is not important
  firstTaskLink = this.taskLinks.first();
  // any task will do; which one comes first is not important
  firstOpenBoardLink = this.openBoardLinks.first();

  homeSidebarLink = this.page.getByRole('link', { name: 'Home', exact: true });
  myWorkSidebarLink = this.page.getByRole('link', { name: 'My work', exact: true });
}
