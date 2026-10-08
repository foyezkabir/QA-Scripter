import type { Locator, Page } from '@playwright/test';

export class AdminUsersLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Users', level: 1 });
  subtitle = this.page.getByText('Promote, demote, suspend and inspect every account.');
  totalUsersHeading = this.page.getByRole('heading', { name: 'Total users' });
  activeHeading = this.page.getByRole('heading', { name: 'Active', level: 3, exact: true });
  unverifiedHeading = this.page.getByRole('heading', { name: 'Unverified', level: 3, exact: true });
  suspendedHeading = this.page.getByRole('heading', { name: 'Suspended', level: 3, exact: true });
  allUsersHeading = this.page.getByRole('heading', { name: 'All users' });

  signupsSparkline = this.page.getByRole('img', { name: 'Signups per day over the last 7 days' });
  activeSparkline = this.page.getByRole('img', { name: /Accounts active today, by the day they signed up/ });
  unverifiedSparkline = this.page.getByRole('img', { name: /Accounts still unverified, by the day they signed up/ });
  suspendedSparkline = this.page.getByRole('img', { name: /Accounts suspended per day over the last 1 day/ });

  liveText = this.page.getByText(/Live · \d+ users · re-reads on focus/);
  auditFeedNote = this.page.getByText('activity covers the last 1 day, not 7 - the audit feed caps at 500 events');

  searchInput = this.page.getByRole('searchbox', { name: 'Search users by name, email or role' });
  allFilter = this.page.getByRole('button', { name: 'All', exact: true });
  activeFilter = this.page.getByRole('button', { name: 'Active', exact: true });
  unverifiedFilter = this.page.getByRole('button', { name: 'Unverified', exact: true });
  suspendedFilter = this.page.getByRole('button', { name: 'Suspended', exact: true });

  noUsersMatchText = this.page.getByText('No users match these filters');
  clearFiltersButton = this.page.getByRole('button', { name: 'Clear filters' });

  usersTable = this.page.getByRole('table');

  columnHeader(columnName: string): Locator {
    return this.usersTable.getByRole('columnheader', { name: columnName, exact: true });
  }

  userRow(userEmail: string): Locator {
    return this.usersTable.getByRole('row').filter({ hasText: userEmail });
  }

  actionsButton(userEmail: string): Locator {
    return this.userRow(userEmail).getByRole('button', { name: /^Actions for / });
  }

  rowMenu = this.page.getByRole('menu');
  viewDetailsItem = this.rowMenu.getByRole('menuitem', { name: 'View details' });
  demoteItem = this.rowMenu.getByRole('menuitem', { name: 'Demote to user' });
  refreshLimitsItem = this.rowMenu.getByRole('menuitem', { name: 'Refresh LiteLLM limits' });
  topUpItem = this.rowMenu.getByRole('menuitem', { name: 'Top up credit' });
  suspendItem = this.rowMenu.getByRole('menuitem', { name: 'Suspend', exact: true });

  detailDialog(userName: string): Locator {
    return this.page.getByRole('dialog', { name: userName });
  }

  detailEmail(userName: string, userEmail: string): Locator {
    return this.detailDialog(userName).getByText(userEmail);
  }

  detailLabel(userName: string, label: string): Locator {
    return this.detailDialog(userName).getByRole('term').filter({ hasText: new RegExp(`^${label}$`) });
  }

  detailChatToolViewLabel(userName: string): Locator {
    return this.detailDialog(userName).getByText('Chat tool view', { exact: true });
  }

  detailChatToolViewSelect(userName: string): Locator {
    return this.detailDialog(userName).getByRole('combobox');
  }

  detailCloseButton(userName: string): Locator {
    return this.detailDialog(userName).getByRole('button', { name: 'Close', exact: true });
  }

  topUpDialog = this.page.getByRole('dialog', { name: 'Top up credit' });
  topUpAmountInput = this.topUpDialog.getByRole('spinbutton', { name: 'Amount (USD)' });
  topUpNoteInput = this.topUpDialog.getByRole('textbox', { name: 'Note (optional)' });
  topUpCloseButton = this.topUpDialog.getByRole('button', { name: 'Close', exact: true });
  topUpCancelButton = this.topUpDialog.getByRole('button', { name: 'Cancel' });
  topUpConfirmButton = this.topUpDialog.getByRole('button', { name: 'Add $20.00' });

  suspendDialog = this.page.getByRole('dialog', { name: 'Suspend this account?' });
  suspendWarning = this.suspendDialog.getByText(/They are signed out of every session immediately/);
  suspendReasonInput = this.suspendDialog.getByRole('textbox', { name: 'Reason (stored on the account)' });
  suspendExpiresInput = this.suspendDialog.getByRole('textbox', { name: /^Expires \(optional\)/ });
  suspendCloseButton = this.suspendDialog.getByRole('button', { name: 'Close', exact: true });
  suspendCancelButton = this.suspendDialog.getByRole('button', { name: 'Cancel' });
  suspendConfirmButton = this.suspendDialog.getByRole('button', { name: 'Suspend account' });
}
