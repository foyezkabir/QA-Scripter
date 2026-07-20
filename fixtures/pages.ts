import { test as base } from '@playwright/test';
import { TasksPage } from '../pages/TasksPage';
import { AGENT_ID, newTask } from '../datas/tasks/TasksData';
import { ChatPage } from '../pages/ChatPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { newProject } from '../datas/projects/ProjectsData';
import { SkillsPage } from '../pages/SkillsPage';
import { SubagentsPage } from '../pages/SubagentsPage';
import { newSubagent } from '../datas/subagents/SubagentsData';
import { MessagingPage } from '../pages/MessagingPage';
import { ToolsPage } from '../pages/ToolsPage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { AgentConfigPage } from '../pages/AgentConfigPage';
import { AGENT_ID as CONFIG_AGENT_ID, ORIGINAL as CONFIG_ORIGINAL } from '../datas/agentConfig/AgentConfigData';
import { ProfilePage } from '../pages/ProfilePage';
import { ORIGINAL as PROFILE_ORIGINAL } from '../datas/profile/ProfileData';

// No API endpoint was captured for task delete during exploration, and UI-delete already proved
// reliable (verified persistence-after-reload live) - per the teardown ladder, UI delete is an
// accepted rung, so all seeding/cleanup below goes through the page object rather than a setup/
// API layer (no endpoint to seed against either - tasks are created through the dialog only).
export const test = base.extend<{
  tasksPage: TasksPage;
  cleanupTasks: (taskName: string) => void;
  seededTask: { name: string; description: string; prompt: string };
  chatPage: ChatPage;
  secondChatPage: ChatPage;
  cleanupConversations: (title: string) => void;
  cleanupConversationsById: (convId: string) => void;
  projectsPage: ProjectsPage;
  cleanupProjects: (name: string) => void;
  seededProject: { name: string; description: string };
  skillsPage: SkillsPage;
  cleanupSkills: (skillName: string) => void;
  subagentsPage: SubagentsPage;
  cleanupSubagents: (subagentName: string) => void;
  seededSubagent: { name: string; description: string; instructions: string };
  messagingPage: MessagingPage;
  cleanupTeamsConnection: void;
  toolsPage: ToolsPage;
  workspacePage: WorkspacePage;
  cleanupWorkspaceFiles: (fileName: string) => void;
  agentConfigPage: AgentConfigPage;
  restoreAgentBasicInfo: void;
  profilePage: ProfilePage;
  restoreProfileFields: void;
}>({
  tasksPage: async ({ page }, use) => {
    await use(new TasksPage(page));
  },
  cleanupTasks: async ({ page }, use) => {
    const names: string[] = [];
    await use((taskName: string) => { names.push(taskName); });
    const tasksPage = new TasksPage(page);
    for (const name of names) {
      await tasksPage.deleteTaskIfExists(name);
    }
  },
  // Pattern A precondition: a temp task the test can edit/toggle/delete without touching the
  // 14 permanent seeded tasks on the Rex Dev agent. Seeded/torn down via UI (see note above).
  seededTask: async ({ page }, use) => {
    const tasksPage = new TasksPage(page);
    await tasksPage.open(AGENT_ID);
    const task = newTask();
    await tasksPage.openNewTaskDialog();
    await tasksPage.fillFields(task);
    await tasksPage.submitCreate();
    // List refresh after create isn't instant - wait for it rather than assume, to avoid a
    // race where the test body looks for the card before it's rendered (observed once live).
    await tasksPage.taskCardLocator(task.name).waitFor({ state: 'visible' });
    await use(task);
    await tasksPage.deleteTaskIfExists(task.name);
  },

  chatPage: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
  // A second, independent browser context sharing the same auth session - for tests that need two
  // real tabs/sessions concurrently (per CLAUDE.md: "two users in ONE test = two browser
  // contexts"). Specs never `new ChatPage()` themselves - this is the sanctioned way to get a
  // second one.
  secondChatPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: '.auth/user.json' });
    const page = await context.newPage();
    await use(new ChatPage(page));
    await context.close();
  },
  // Conversation creation is always Pattern B (the subject under test) - no API endpoint captured
  // and none needed, UI-delete via the kebab menu is the teardown rung.
  cleanupConversations: async ({ page }, use) => {
    const titles: string[] = [];
    await use((title: string) => { titles.push(title); });
    const chatPage = new ChatPage(page);
    for (const title of titles) {
      await chatPage.deleteConversationIfExists(title);
    }
  },
  // Long messages truncate in the sidebar (confirmed live), so cleanup keyed by title alone can
  // silently miss them - this variant matches by conversation id (the URL segment) instead.
  cleanupConversationsById: async ({ page }, use) => {
    const ids: string[] = [];
    await use((convId: string) => { ids.push(convId); });
    const chatPage = new ChatPage(page);
    for (const convId of ids) {
      await chatPage.deleteConversationByIdIfExists(convId);
    }
  },

  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },
  // Project creation is always Pattern B (the subject under test) - no API endpoint captured and
  // none needed, UI-delete via the card's own Delete button is the teardown rung.
  cleanupProjects: async ({ page }, use) => {
    const names: string[] = [];
    await use((name: string) => { names.push(name); });
    const projectsPage = new ProjectsPage(page);
    for (const name of names) {
      await projectsPage.deleteProjectIfExists(name);
    }
  },
  // Pattern A precondition: a temp project the test can edit/view/delete without touching the 5
  // permanent seeded projects on the Rex Dev agent. Seeded/torn down via UI.
  seededProject: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.open(AGENT_ID);
    const project = newProject();
    await projectsPage.openNewProjectDialog();
    await projectsPage.fillFields(project);
    await projectsPage.submitCreate();
    await use(project);
    await projectsPage.open(AGENT_ID);
    await projectsPage.deleteProjectIfExists(project.name);
  },

  skillsPage: async ({ page }, use) => {
    await use(new SkillsPage(page));
  },
  // No confirmation dialog on uninstall (confirmed live) - a direct Uninstall click is the whole
  // teardown, no ladder needed. Escape first: a test that fails its own assertion mid-flow (e.g.
  // a duplicate-name defect test) can leave the Create Skill dialog open, which would otherwise
  // block the Installed-tab click below - Escape is a no-op when nothing is open.
  cleanupSkills: async ({ page }, use) => {
    const names: string[] = [];
    await use((skillName: string) => { names.push(skillName); });
    await page.keyboard.press('Escape');
    const skillsPage = new SkillsPage(page);
    for (const name of names) {
      await skillsPage.uninstallIfInstalled(name);
    }
  },

  subagentsPage: async ({ page }, use) => {
    await use(new SubagentsPage(page));
  },
  // Subagent creation is always Pattern B (the subject under test) - no API endpoint exploited for
  // seeding, UI-delete via the card's own Delete button + "Yes, delete" confirm is the teardown rung.
  cleanupSubagents: async ({ page }, use) => {
    const names: string[] = [];
    await use((subagentName: string) => { names.push(subagentName); });
    const subagentsPage = new SubagentsPage(page);
    for (const name of names) {
      await subagentsPage.deleteSubagentIfExists(name);
    }
  },
  // Pattern A precondition: a temp subagent the test can view/edit/toggle/delete. This agent starts
  // with zero subagents (confirmed live), so seeding/teardown via UI is both sufficient and the only
  // option (no permanent seeded subagents exist here, unlike Tasks/Projects's 14/5 permanent rows).
  // Create/delete round-trips on this dev environment have been observed taking 10-30s under load,
  // so this fixture extends the test's timeout up front - the default 30s budget is shared with
  // fixture setup, and TestDetails has no `timeout` field (only tag/annotation), so this is the
  // only place a per-fixture allowance can actually be applied.
  seededSubagent: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(90_000);
    const subagentsPage = new SubagentsPage(page);
    await subagentsPage.open(AGENT_ID);
    const subagent = newSubagent();
    await subagentsPage.openNewSubagentDialog();
    await subagentsPage.fillFields(subagent);
    await subagentsPage.submitCreate();
    await subagentsPage.subagentCardLocator(subagent.name).waitFor({ state: 'visible' });
    await use(subagent);
    await subagentsPage.open(AGENT_ID);
    await subagentsPage.deleteSubagentIfExists(subagent.name);
  },

  messagingPage: async ({ page }, use) => {
    await use(new MessagingPage(page));
  },
  // Teams has no persistent seeded state (unlike the permanent shared WhatsApp/Telegram
  // connections) - Disconnect is the whole teardown, run unconditionally so a test that fails its
  // own assertion mid-flow (e.g. the Tenant ID validation defect test) never leaves Teams connected
  // for the next test in this serial file.
  cleanupTeamsConnection: async ({ page }, use) => {
    await use(undefined);
    const messagingPage = new MessagingPage(page);
    await messagingPage.disconnectTeamsIfConnected();
  },

  toolsPage: async ({ page }, use) => {
    await use(new ToolsPage(page));
  },

  agentConfigPage: async ({ page }, use) => {
    await use(new AgentConfigPage(page));
  },
  // Role/Description are the only Basic Information fields any test in this module is allowed to
  // temporarily change (never Agent Name - too many other spec files key off the literal string
  // 'Rex Dev' to find this agent on the dashboard). Runs unconditionally so a test that fails its
  // own assertion mid-flow still leaves the one shared dev agent's real config exactly as found.
  restoreAgentBasicInfo: async ({ page }, use) => {
    await use(undefined);
    const agentConfigPage = new AgentConfigPage(page);
    await agentConfigPage.open(CONFIG_AGENT_ID);
    await agentConfigPage.fillBasicInfo({ role: CONFIG_ORIGINAL.role, description: CONFIG_ORIGINAL.description });
    await agentConfigPage.submitBasicInfoSave();
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  // Same guarantee as restoreAgentBasicInfo - runs unconditionally so the real shared account's
  // profile fields are back to their original values regardless of test outcome.
  restoreProfileFields: async ({ page }, use) => {
    await use(undefined);
    const profilePage = new ProfilePage(page);
    await profilePage.openProfileEdit();
    await profilePage.fillProfileEdit({ fullName: PROFILE_ORIGINAL.fullName, company: PROFILE_ORIGINAL.company, role: PROFILE_ORIGINAL.role });
    await profilePage.submitProfileEdit();
  },

  workspacePage: async ({ page }, use) => {
    await use(new WorkspacePage(page));
  },
  // Delete confirm is a UI dialog with no API endpoint captured - UI-delete is the teardown rung
  // (same ladder position as Tasks/Projects/Subagents cleanup in this file).
  cleanupWorkspaceFiles: async ({ page }, use) => {
    const names: string[] = [];
    await use((fileName: string) => { names.push(fileName); });
    const workspacePage = new WorkspacePage(page);
    for (const name of names) {
      await workspacePage.deleteFileIfExists(name);
    }
  },
});

export { expect } from '@playwright/test';
