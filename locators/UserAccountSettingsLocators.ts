import type { Locator, Page } from '@playwright/test';

export class UserAccountSettingsLocators {
  constructor(private readonly page: Page) {}

  pageTitleText = this.page.getByText('Manage your settings and usage.');
  nav = this.page.getByRole('navigation').filter({ has: this.page.getByRole('link', { name: 'Data Control and Privacy' }) });

  navLink(linkName: string): Locator {
    return this.nav.getByRole('link', { name: linkName, exact: true });
  }

  heading(headingName: string): Locator {
    return this.page.getByRole('heading', { name: headingName });
  }

  text(text: string): Locator {
    return this.page.getByText(text);
  }

  switchNamed(switchName: string): Locator {
    // the switches have no accessible name, so find the nearest row above the label that holds a switch
    return this.page.getByText(switchName, { exact: true }).locator('xpath=ancestor::div[.//*[@role="switch"]][1]').getByRole('switch');
  }

  button(buttonName: string): Locator {
    return this.page.getByRole('button', { name: buttonName, exact: true });
  }

  buttons(buttonName: string): Locator {
    return this.page.getByRole('button', { name: buttonName, exact: true });
  }

  adminOnlyLabels = this.page.getByText('Admin-only');
  keyHint = this.page.getByText('Stored encrypted at rest. It is never shown again after saving.');
  keySetPills = this.page.getByText('Key set', { exact: true });
  showKeyButtons = this.page.getByRole('button', { name: 'Show key' });
  replaceKeyButtons = this.page.getByRole('button', { name: 'Replace key', exact: true });
  saveKeyButton = this.page.getByRole('button', { name: 'Save key', exact: true });

  // the select has no accessible name; it is the one that offers Never
  autoLogout = this.page.getByRole('combobox').filter({ has: this.page.getByRole('option', { name: 'Never', exact: true }) });

  autoLogoutOption(optionName: string): Locator {
    return this.autoLogout.getByRole('option', { name: optionName, exact: true });
  }

  // the two quiet hours selects (Start and End) are the only selects on the Notifications page and have no accessible name
  quietHoursSelects = this.page.getByRole('combobox');

  currentPassword = this.page.getByRole('textbox', { name: 'Current password' });
  newPassword = this.page.getByRole('textbox', { name: 'New password', exact: true });
  confirmPassword = this.page.getByRole('textbox', { name: 'Confirm new password' });
  passwordHint = this.page.getByText('At least 10 characters.');
  updatePasswordButton = this.page.getByRole('button', { name: 'Update password', exact: true });
  showPasswordButtons = this.page.getByRole('button', { name: 'Show password' });
  // the three password fields have a Show password button each; the first belongs to Current password
  showCurrentPassword = this.showPasswordButtons.first();
  enableTwoFactor = this.page.getByRole('button', { name: 'Enable', exact: true });

  adjustPlan = this.page.getByRole('button', { name: 'Adjust plan', exact: true });
  seePlans = this.page.getByRole('button', { name: 'See Plans', exact: true });
  dailySpendText = this.page.getByText(/^DAILY SPEND/i);

  exportData = this.page.getByRole('button', { name: 'Export Data', exact: true });
  deleteAccount = this.page.getByRole('button', { name: 'Delete Account', exact: true });

  dialog = this.page.getByRole('dialog', { name: 'Settings' });
  dialogNavButton(sectionName: string): Locator {
    return this.dialog.getByRole('button', { name: sectionName, exact: true });
  }

  appearanceRadio(choiceName: string): Locator {
    return this.dialog.getByRole('radio', { name: choiceName });
  }

  languageText = this.dialog.getByText('English. Other languages are not available yet.');
  settingsButton = this.page.getByRole('button', { name: 'Settings', exact: true });
  enable2faLink = this.page.getByRole('link', { name: 'Enable 2FA' });
}
