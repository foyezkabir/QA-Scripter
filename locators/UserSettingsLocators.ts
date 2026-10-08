import type { Locator, Page } from '@playwright/test';

export class UserSettingsLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Settings', level: 1 });
  pageDescription = this.page.getByText('Set up who your assistant is, how it behaves, and what happens to it.');
  responseBehaviorHeading = this.page.getByRole('heading', { name: 'Response Behavior', level: 3 });

  sectionHeading(sectionName: string): Locator {
    return this.page.getByRole('heading', { name: sectionName, level: 2 });
  }

  basicInformationNote = this.page.getByText("Your assistant's name and what it does. Save when you're done.");
  iconButton = this.page.getByRole('button', { name: '🤖' });
  pickAnIconText = this.page.getByText('Pick an icon', { exact: true });
  nameInput = this.page.getByRole('textbox', { name: 'Agent Name' });
  nameHint = this.page.getByText('Give your assistant a name your team and customers will see.');
  roleInput = this.page.getByRole('textbox', { name: 'Role', exact: true });
  roleHint = this.page.getByText('Sum up its job in a few words, like Customer assistant or Sales helper.');
  descriptionInput = this.page.getByRole('textbox', { name: 'Describe what your agent does' });
  descriptionHint = this.page.getByText('Describe how it should help and what it handles, its tone, and when to pass things to a person.');
  saveButton = this.page.getByRole('button', { name: 'Save Changes' });

  emojiSearch = this.page.getByRole('textbox', { name: 'Type to search for an emoji' });

  emojiTab(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName, exact: true });
  }

  behaviorNote = this.page.getByText('Shape how your assistant replies and learns. Changes save on their own.');
  learnHint = this.page.getByText('Gets better over time by learning from the way you correct it.');
  dreamHint = this.page.getByText(/^Run a nightly memory-consolidation pass/);
  sentimentHint = this.page.getByText('Detect customer sentiment and adjust tone accordingly.');
  toneHint = this.page.getByText('Choose the tone your assistant replies in.');
  switches = this.page.getByRole('switch');
  // the three switches have no accessible name; their order (Learn, Dream Mode, Sentiment) is fixed by the page
  learnSwitch = this.switches.nth(0);
  // the three switches have no accessible name; their order (Learn, Dream Mode, Sentiment) is fixed by the page
  dreamSwitch = this.switches.nth(1);
  // the three switches have no accessible name; their order (Learn, Dream Mode, Sentiment) is fixed by the page
  sentimentSwitch = this.switches.nth(2);
  toneSelect = this.page.getByRole('combobox');

  toneOption(toneName: string): Locator {
    return this.toneSelect.getByRole('option', { name: toneName, exact: true });
  }

  selectedToneOption(toneName: string): Locator {
    return this.toneSelect.getByRole('option', { name: toneName, exact: true, selected: true });
  }

  noAccessKeyText = this.page.getByText('No access key', { exact: true });
  accessKeyFallbackHint = this.page.getByText('Terminal access falls back to your login session. Generate a key to require the .pem and encrypt backups.');
  accessKeyDescription = this.page.getByText(/^The private key is shown once at generation/);
  generateKeyButton = this.page.getByRole('button', { name: 'Generate access key' });

  a2aDescription = this.page.getByText(/^Let other software send this agent a message/);
  newKeyButton = this.page.getByRole('button', { name: 'New key' });
  keyNameInput = this.page.getByPlaceholder("What will use it? e.g. Zapier, our CI, Maya's agent");
  createKeyButton = this.page.getByRole('button', { name: 'Create', exact: true });
  cancelKeyButton = this.page.getByRole('button', { name: 'Cancel', exact: true });
  revokedBadge = this.page.getByText('revoked', { exact: true });

  backupDescription = this.page.getByText('Save a full copy of your assistant so you can restore it later or move it somewhere else.');
  agentBackupText = this.page.getByText('A complete copy of your assistant - its name, personality, memory, and settings. Saved automatically, but you can save one anytime.');
  backupNowButton = this.page.getByRole('button', { name: 'Backup now' });
  downloadCopyButton = this.page.getByRole('button', { name: 'Download Copy' });
  ownSetupText = this.page.getByText('Choose this if you want to run your assistant on your own systems.');
  downloadBundleButton = this.page.getByRole('button', { name: 'Download bundle' });

  dangerNote = this.page.getByText('Destructive actions live here. Proceed carefully.');
  deleteWarning = this.page.getByText("Permanently remove this agent, all its subagents, conversations, and files. This can't be undone.");
  deleteAgentButton = this.page.getByRole('button', { name: 'Delete Agent' });

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  settingsLink = this.agentSections.getByRole('link', { name: 'Settings', exact: true });
}
