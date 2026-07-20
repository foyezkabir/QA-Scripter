import { Page, Locator } from '@playwright/test';
import { ProjectsLocators } from '../locators/ProjectsLocators';

export class ProjectsPage {
  constructor(private readonly page: Page) {}

  async open(agentId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/projects`);
  }

  async openProject(agentId: string, projectId: string): Promise<void> {
    await this.page.goto(`/chat/${agentId}/projects/${projectId}`);
  }

  async openNewProjectDialog(): Promise<void> {
    await ProjectsLocators.newProjectButton(this.page).click();
  }

  async fillFields(fields: { name?: string; description?: string; instructions?: string }): Promise<void> {
    if (fields.name !== undefined) await ProjectsLocators.nameInput(this.page).fill(fields.name);
    if (fields.description !== undefined) await ProjectsLocators.descriptionInput(this.page).fill(fields.description);
    if (fields.instructions !== undefined) await ProjectsLocators.instructionsInput(this.page).fill(fields.instructions);
  }

  async submitCreate(): Promise<void> {
    await ProjectsLocators.createButton(this.page).click();
  }

  async submitSaveChanges(): Promise<void> {
    await ProjectsLocators.saveChangesButton(this.page).click();
  }

  async search(text: string): Promise<void> {
    await ProjectsLocators.searchInput(this.page).fill(text);
  }

  async selectSort(label: string): Promise<void> {
    await ProjectsLocators.sortCombobox(this.page).selectOption({ label });
  }

  // .first() is deliberate: duplicate project names are permitted by the app (findings/projects.txt),
  // and whichever card the DOM currently orders first is fine to target for a single delete step -
  // callers that need this N times (deleteProjectIfExists) just call it in a loop.
  async openDeleteConfirm(name: string): Promise<void> {
    await ProjectsLocators.projectCardDeleteButton(this.page, name).first().click();
  }

  async confirmDelete(): Promise<void> {
    await ProjectsLocators.yesDeleteButton(this.page).click();
  }

  async keepProject(): Promise<void> {
    await ProjectsLocators.keepItButton(this.page).click();
  }

  /**
   * Deletes every project card matching this name via the UI (usually one, but duplicate names
   * are permitted by the app - see findings/projects.txt - so this loops until none remain).
   * No-op if none exist. For fixture teardown only.
   */
  async deleteProjectIfExists(name: string): Promise<void> {
    for (;;) {
      if ((await ProjectsLocators.projectCard(this.page, name).count()) === 0) break;
      await this.openDeleteConfirm(name);
      await this.confirmDelete();
    }
  }

  async openFiles(): Promise<void> {
    await ProjectsLocators.filesButton(this.page).click();
  }

  async openSettings(): Promise<void> {
    await ProjectsLocators.settingsButton(this.page).click();
  }

  // --- State getters (no assertions - specs assert on these) ---

  projectCardLocator(name: string): Locator {
    return ProjectsLocators.projectCard(this.page, name);
  }

  createButtonLocator(): Locator {
    return ProjectsLocators.createButton(this.page);
  }

  saveChangesButtonLocator(): Locator {
    return ProjectsLocators.saveChangesButton(this.page);
  }

  deleteDialogHeadingLocator(name: string): Locator {
    return ProjectsLocators.deleteDialogHeading(this.page, name);
  }

  filesDialogHeadingLocator(name: string): Locator {
    return ProjectsLocators.filesDialogHeading(this.page, name);
  }

  settingsDialogHeadingLocator(): Locator {
    return ProjectsLocators.settingsDialogHeading(this.page);
  }

  async getProjectCount(): Promise<number> {
    return this.page.getByRole('link', { name: /^Open project /}).count();
  }

  async getInstructionsText(): Promise<string> {
    return (await ProjectsLocators.instructionsInput(this.page).textContent()) ?? '';
  }
}
