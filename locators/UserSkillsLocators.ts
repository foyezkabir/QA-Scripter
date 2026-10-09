import type { Locator, Page } from '@playwright/test';

export class UserSkillsLocators {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: 'Skills', level: 1 });
  subtitle = this.page.getByText('Save the things you have taught your assistant so it can repeat them anytime you ask');
  createSkillButtons = this.page.getByRole('button', { name: 'Create skill' });
  // the page header button comes first; the Custom tab's empty state repeats it further down
  headerCreateSkill = this.createSkillButtons.first();

  tab(tabName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${tabName} \\(\\d+\\)$`) });
  }

  searchBox(placeholder: string): Locator {
    return this.page.getByRole('textbox', { name: placeholder });
  }

  sourceFilter(filterName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${filterName} \\(\\d+\\)$`) });
  }

  card(skillName: string): Locator {
    return this.page.getByRole('button', { name: `View details for ${skillName}`, exact: true });
  }

  cards = this.page.getByRole('button', { name: /^View details for / });
  automationCards = this.page.getByRole('button', { name: /^View details for QA-AUTO / });
  // every QA-AUTO skill is removed in turn, so whichever card is first is the next one to remove
  firstAutomationCard = this.automationCards.first();
  installButtons = this.page.getByRole('button', { name: /^Install / });

  noSkillsFoundText = this.page.getByText('No skills found', { exact: true });
  browseEmptyHint = this.page.getByText('Try a different search or pick a different source.');
  installedEmptyHint = this.page.getByText('No installed skill matches your search. Try a different term.');
  customEmptyHint = this.page.getByText('No custom skill matches your search. Try a different term.');
  noCustomHeading = this.page.getByRole('heading', { name: 'No custom skills yet', level: 3 });
  noCustomHint = this.page.getByText('Write your own skill to teach this assistant a routine only you need - the steps you would otherwise repeat in chat every time.');
  // any card proves the list has loaded; which one is not important
  listLoaded = this.cards.first().or(this.noCustomHeading).or(this.noSkillsFoundText);

  createDialog = this.page.getByRole('dialog', { name: 'Create Skill' });
  createSubtitle = this.createDialog.getByText('Show your assistant how to do something once and it remembers it for next time');
  nameField = this.createDialog.getByRole('textbox', { name: 'Skill Name' });
  categoryField = this.createDialog.getByRole('textbox', { name: 'Category' });
  whenField = this.createDialog.getByRole('textbox', { name: 'When to use it' });
  stepsField = this.createDialog.getByRole('textbox', { name: 'Steps to follow' });
  nameHint = this.createDialog.getByText("Name the thing you're teaching your assistant to do.");
  categoryHint = this.createDialog.getByText('Group it with similar skills, like Reports, Sales, or Support.');
  whenHint = this.createDialog.getByText('Describe the moment this should kick in, so your assistant knows when to reach for it.');
  stepsHint = this.createDialog.getByText('List the steps in order and your assistant will follow them every time.');
  createClose = this.createDialog.getByRole('button', { name: 'Close', exact: true });
  createCancel = this.createDialog.getByRole('button', { name: 'Cancel', exact: true });
  createSave = this.createDialog.getByRole('button', { name: 'Save', exact: true });
  requiredAlert = this.createDialog.getByRole('alert').filter({ hasText: 'Name, When to use it, and Steps to follow are required.' });

  duplicateError(skillName: string): Locator {
    return this.createDialog.getByText(`A skill named "${skillName}" already exists. Pick a different name.`);
  }

  notifications = this.page.getByRole('region', { name: /^Notifications/ });
  createdToast = this.notifications.getByText('Custom skill created');
  removedToast = this.notifications.getByText('Skill removed');

  detailDialog(skillName: string): Locator {
    return this.page.getByRole('dialog', { name: skillName, exact: true });
  }

  detailByline(skillName: string, byline: RegExp): Locator {
    return this.detailDialog(skillName).getByText(byline);
  }

  detailFilesHeading(skillName: string): Locator {
    return this.detailDialog(skillName).getByText('FILES IN THIS SKILL');
  }

  detailInstalledAt(skillName: string): Locator {
    return this.detailDialog(skillName).getByText(/Installed at skills\//);
  }

  detailButton(skillName: string, buttonName: string): Locator {
    return this.detailDialog(skillName).getByRole('button', { name: buttonName, exact: true });
  }

  detailFile(skillName: string, fileName: string): Locator {
    return this.detailDialog(skillName).getByText(fileName, { exact: true });
  }

  removeDialog = this.page.getByRole('dialog', { name: 'Remove this skill?' });
  removeWarning = this.removeDialog.getByText('This will remove the skill from your agent.');
  keepItButton = this.removeDialog.getByRole('button', { name: 'Keep it' });
  yesRemoveButton = this.removeDialog.getByRole('button', { name: 'Yes, remove' });

  agentSections = this.page.getByRole('navigation', { name: 'Agent sections' });
  skillsLink = this.agentSections.getByRole('link', { name: 'Skills', exact: true });
}
