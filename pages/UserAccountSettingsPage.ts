import { expect, type Page } from '@playwright/test';
import {
  ACCOUNT_NAV_LINKS,
  ACCOUNT_PATHS,
  API_KEY_CARDS,
  APPEARANCE_CHOICES,
  AUTO_LOGOUT_OPTIONS,
  BROWSER_NOTIFICATION_SWITCHES,
  CHAT_PREFERENCE_SWITCHES,
  EMAIL_NOTIFICATION_SWITCHES,
  USAGE_TILES,
  type AccountSection,
} from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserAccountSettingsLocators } from '../locators/UserAccountSettingsLocators';

export class UserAccountSettingsPage {
  private readonly locators: UserAccountSettingsLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserAccountSettingsLocators(page);
  }

  async openSection(section: AccountSection) {
    await this.page.goto(ACCOUNT_PATHS[section]);
    await expect(this.locators.pageTitleText).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromBanner() {
    await this.page.goto('/dashboard');
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.enable2faLink.click();
  }

  async openDialog() {
    await this.page.goto('/dashboard');
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.settingsButton.click();
    await expect(this.locators.dialog).toBeVisible();
  }

  async chooseDialogSection(sectionName: string) {
    await this.locators.dialogNavButton(sectionName).click();
  }

  async openAutoLogout() {
    await this.locators.autoLogout.click();
  }

  async revealCurrentPassword() {
    await this.locators.showCurrentPassword.click();
  }

  async switchCompactMode() {
    await this.locators.switchNamed('Compact mode').click();
  }

  async switchProductUpdates() {
    await this.locators.switchNamed('Product updates').click();
  }

  async reload() {
    await this.page.reload();
    await expect(this.locators.pageTitleText).toBeVisible();
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async restorePreferences() {
    await this.openSection('general');
    if (!(await this.locators.switchNamed('Compact mode').isChecked())) {
      await this.switchCompactMode();
      await expect(this.locators.switchNamed('Compact mode')).toBeChecked();
    }
    await this.openSection('notifications');
    if (await this.locators.switchNamed('Product updates').isChecked()) {
      await this.switchProductUpdates();
      await expect(this.locators.switchNamed('Product updates')).not.toBeChecked();
    }
  }

  async expectGeneral() {
    await expect(this.locators.pageTitleText).toBeVisible();
    for (const linkName of ACCOUNT_NAV_LINKS) {
      await expect(this.locators.navLink(linkName)).toBeVisible();
    }
    await expect(this.locators.text('Chat Preferences').first()).toBeVisible();
    for (const preference of CHAT_PREFERENCE_SWITCHES) {
      await expect(this.locators.switchNamed(preference.name)).toBeVisible();
      await expect(this.locators.text(preference.hint)).toBeVisible();
    }
  }

  async expectApiKeyCards() {
    for (const cardName of API_KEY_CARDS) {
      await expect(this.locators.text(cardName).first()).toBeVisible();
    }
    await expect(this.locators.adminOnlyLabels).toHaveCount(API_KEY_CARDS.length);
    await expect(this.locators.keyHint).toHaveCount(API_KEY_CARDS.length);
    await expect(this.locators.keySetPills).not.toHaveCount(0);
    await expect(this.locators.showKeyButtons).toHaveCount(API_KEY_CARDS.length);
  }

  async expectKeyButtonsAreDisabled() {
    await expect(this.locators.saveKeyButton).toBeDisabled();
    for (const replaceButton of await this.locators.replaceKeyButtons.all()) {
      await expect(replaceButton).toBeDisabled();
    }
  }

  async expectAutoLogoutOptions() {
    for (const optionName of AUTO_LOGOUT_OPTIONS) {
      await expect(this.locators.autoLogoutOption(optionName)).toHaveCount(1);
    }
  }

  async expectNotifications() {
    for (const headingName of ['Browser Notifications', 'Email Notifications', 'Quiet Hours']) {
      await expect(this.locators.text(headingName).first()).toBeVisible();
    }
    for (const switchName of BROWSER_NOTIFICATION_SWITCHES) {
      await expect(this.locators.switchNamed(switchName)).toBeVisible();
    }
    for (const switchName of EMAIL_NOTIFICATION_SWITCHES) {
      await expect(this.locators.switchNamed(switchName)).toBeVisible();
    }
    await expect(this.locators.switchNamed('Enable quiet hours')).toBeVisible();
    await expect(this.locators.quietHoursSelects).toHaveCount(2);
  }

  async expectSecurity() {
    await expect(this.locators.text('Change your account password. All other sessions will be signed out.')).toBeVisible();
    await expect(this.locators.currentPassword).toBeVisible();
    await expect(this.locators.newPassword).toBeVisible();
    await expect(this.locators.passwordHint).toBeVisible();
    await expect(this.locators.confirmPassword).toBeVisible();
    await expect(this.locators.text("Add an extra layer of protection. You'll need a password before you can enable 2FA.")).toBeVisible();
    await expect(this.locators.enableTwoFactor).toBeVisible();
  }

  async expectUpdatePasswordIsDisabled() {
    await expect(this.locators.updatePasswordButton).toBeDisabled();
  }

  async expectCurrentPasswordIsRevealed() {
    await expect(this.locators.currentPassword).toHaveAttribute('type', 'text');
  }

  async expectUsage() {
    await expect(this.locators.text('Usage and Analytics').first()).toBeVisible();
    await expect(this.locators.text('Your Balance').first()).toBeVisible();
    for (const tileName of USAGE_TILES) {
      await expect(this.locators.text(tileName).first()).toBeVisible();
    }
    await expect(this.locators.dailySpendText).toBeVisible();
    await expect(this.locators.text('Want more power?')).toBeVisible();
  }

  async expectPlanButtonsAreDisabled() {
    await expect(this.locators.adjustPlan).toBeDisabled();
    await expect(this.locators.seePlans).toBeDisabled();
  }

  async expectPrivacy() {
    await expect(this.locators.text('Downloads').first()).toBeVisible();
    await expect(this.locators.exportData).toBeVisible();
    await expect(this.locators.text('My Information').first()).toBeVisible();
    await expect(this.locators.switchNamed('Help us improve VelaCrew')).toBeVisible();
    await expect(this.locators.text('Your Privacy Matters')).toBeVisible();
    await expect(this.locators.text('Danger Zone').first()).toBeVisible();
    await expect(this.locators.deleteAccount).toBeVisible();
  }

  async expectDialogPreferences() {
    await expect(this.locators.text('Appearance').first()).toBeVisible();
    for (const choiceName of APPEARANCE_CHOICES) {
      await expect(this.locators.appearanceRadio(choiceName)).toBeVisible();
    }
    await expect(this.locators.languageText).toBeVisible();
  }

  async expectSecurityUrl() {
    await expect(this.page).toHaveURL(/\/settings\/security$/);
    await expect(this.locators.enableTwoFactor).toBeVisible();
  }

  async expectCompactModeIsOff() {
    await expect(this.locators.switchNamed('Compact mode')).not.toBeChecked();
  }

  async expectProductUpdatesAreOn() {
    await expect(this.locators.switchNamed('Product updates')).toBeChecked();
  }
}
