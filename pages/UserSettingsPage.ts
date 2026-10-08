import { expect, type Page, type Response } from '@playwright/test';
import { DEFAULT_TONE, EMOJI_TABS, OWN_ASSISTANT, RESPONSE_TONES, SETTINGS_SECTION_HEADINGS } from '../datas/user/UserData';
import { HydrationHelper } from '../helpers/HydrationHelper';
import { UserSettingsLocators } from '../locators/UserSettingsLocators';

const isAgentUpdate = (response: Response) => response.request().method() === 'PATCH' && response.url().includes('/api/agents/');

export class UserSettingsPage {
  private readonly locators: UserSettingsLocators;

  constructor(private readonly page: Page) {
    this.locators = new UserSettingsLocators(page);
  }

  async open() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}/configuration`);
    await expect(this.locators.sectionHeading('Basic Information')).toBeVisible();
    await expect(this.locators.roleInput).toHaveValue(/\S/);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openFromChat() {
    await this.page.goto(`/chat/${OWN_ASSISTANT.id}`);
    await HydrationHelper.waitUntilHydrated(this.page);
    await this.locators.settingsLink.click();
  }

  async reload() {
    await this.page.reload();
    await expect(this.locators.roleInput).toHaveValue(/\S/);
    await HydrationHelper.waitUntilHydrated(this.page);
  }

  async openEmojiPicker() {
    await this.locators.iconButton.click();
  }

  async openNewKeyForm() {
    await this.locators.newKeyButton.click();
  }

  async cancelNewKeyForm() {
    await this.locators.cancelKeyButton.click();
  }

  async changeRole(role: string) {
    await this.locators.roleInput.fill(role);
  }

  async clearName() {
    await this.locators.nameInput.fill('');
  }

  async clearRole() {
    await this.locators.roleInput.fill('');
  }

  async saveChanges() {
    await Promise.all([this.page.waitForResponse(isAgentUpdate), this.locators.saveButton.click()]);
  }

  async toggleDreamMode() {
    await Promise.all([this.page.waitForResponse(isAgentUpdate), this.locators.dreamSwitch.click()]);
  }

  async chooseTone(toneName: string) {
    await Promise.all([this.page.waitForResponse(isAgentUpdate), this.locators.toneSelect.selectOption({ label: toneName })]);
  }

  async restoreOwnSettings() {
    await this.open();
    if ((await this.locators.roleInput.inputValue()) !== OWN_ASSISTANT.role) {
      await this.changeRole(OWN_ASSISTANT.role);
      await this.saveChanges();
    }
    if (await this.locators.dreamSwitch.isChecked()) {
      await this.toggleDreamMode();
    }
    if ((await this.locators.selectedToneOption(DEFAULT_TONE).count()) === 0) {
      await this.chooseTone(DEFAULT_TONE);
    }
  }

  async expectPageIsOpen() {
    await expect(this.locators.heading).toBeVisible();
    await expect(this.locators.pageDescription).toBeVisible();
    for (const sectionName of SETTINGS_SECTION_HEADINGS) {
      await expect(this.locators.sectionHeading(sectionName)).toBeVisible();
    }
    await expect(this.locators.responseBehaviorHeading).toBeVisible();
  }

  async expectBasicInformation() {
    await expect(this.locators.basicInformationNote).toBeVisible();
    await expect(this.locators.iconButton).toBeVisible();
    await expect(this.locators.pickAnIconText).toBeVisible();
    await expect(this.locators.nameInput).toHaveValue(OWN_ASSISTANT.name);
    await expect(this.locators.nameHint).toBeVisible();
    await expect(this.locators.roleInput).toHaveValue(OWN_ASSISTANT.role);
    await expect(this.locators.roleHint).toBeVisible();
    await expect(this.locators.descriptionInput).toBeVisible();
    await expect(this.locators.descriptionHint).toBeVisible();
  }

  async expectSaveIsDisabled() {
    await expect(this.locators.saveButton).toBeDisabled();
  }

  async expectSaveIsEnabled() {
    await expect(this.locators.saveButton).toBeEnabled();
  }

  async expectEmojiPicker() {
    await expect(this.locators.emojiSearch).toBeVisible();
    for (const tabName of EMOJI_TABS) {
      await expect(this.locators.emojiTab(tabName)).toBeVisible();
    }
  }

  async expectBehaviorSection() {
    await expect(this.locators.behaviorNote).toBeVisible();
    await expect(this.locators.switches).toHaveCount(3);
    await expect(this.locators.learnHint).toBeVisible();
    await expect(this.locators.dreamHint).toBeVisible();
    await expect(this.locators.sentimentHint).toBeVisible();
    await expect(this.locators.toneHint).toBeVisible();
  }

  async expectToneOptions() {
    for (const toneName of RESPONSE_TONES) {
      await expect(this.locators.toneOption(toneName)).toHaveCount(1);
    }
    await expect(this.locators.selectedToneOption(DEFAULT_TONE)).toHaveCount(1);
  }

  async expectDreamModeIsOn() {
    await expect(this.locators.dreamSwitch).toBeChecked();
  }

  async expectDreamModeIsOff() {
    await expect(this.locators.dreamSwitch).not.toBeChecked();
  }

  async expectToneIs(toneName: string) {
    await expect(this.locators.selectedToneOption(toneName)).toHaveCount(1);
  }

  async expectRoleIs(role: string) {
    await expect(this.locators.roleInput).toHaveValue(role);
  }

  async expectNameIsInvalid() {
    await expect(this.locators.nameInput).toHaveAttribute('aria-invalid', 'true');
  }

  async expectRoleIsInvalid() {
    await expect(this.locators.roleInput).toHaveAttribute('aria-invalid', 'true');
  }

  async expectAccessKeySection() {
    await expect(this.locators.accessKeyDescription).toBeVisible();
    await expect(this.locators.noAccessKeyText).toBeVisible();
    await expect(this.locators.accessKeyFallbackHint).toBeVisible();
    await expect(this.locators.generateKeyButton).toBeVisible();
  }

  async expectAgentToAgentSection() {
    await expect(this.locators.a2aDescription).toBeVisible();
    await expect(this.locators.newKeyButton).toBeVisible();
  }

  async expectNewKeyFormIsOpen() {
    await expect(this.locators.keyNameInput).toBeVisible();
    await expect(this.locators.createKeyButton).toBeDisabled();
    await expect(this.locators.cancelKeyButton).toBeVisible();
  }

  async expectNewKeyFormIsClosed() {
    await expect(this.locators.keyNameInput).toBeHidden();
    await expect(this.locators.newKeyButton).toBeVisible();
  }

  async expectBackupSection() {
    await expect(this.locators.backupDescription).toBeVisible();
    await expect(this.locators.agentBackupText).toBeVisible();
    await expect(this.locators.backupNowButton).toBeVisible();
    await expect(this.locators.downloadCopyButton).toBeVisible();
    await expect(this.locators.ownSetupText).toBeVisible();
    await expect(this.locators.downloadBundleButton).toBeVisible();
  }

  async expectDangerZone() {
    await expect(this.locators.dangerNote).toBeVisible();
    await expect(this.locators.deleteWarning).toBeVisible();
    await expect(this.locators.deleteAgentButton).toBeVisible();
  }

  async expectSettingsUrl() {
    await expect(this.page).toHaveURL(new RegExp(`/chat/${OWN_ASSISTANT.id}/configuration$`));
    await expect(this.locators.heading).toBeVisible();
  }
}
