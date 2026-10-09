import { mergeTests } from '@playwright/test';
import { newChatMessage, newProjectName, newSkill, newTask, newWorkspaceName, OWN_ASSISTANT, type ChatMessage, type NewSkill, type NewTask } from '../datas/user/UserData';
import { OWN_AGENT } from '../datas/admin/AdminData';
import { test as admin } from './admin';
import { test as pages } from './pages';

export const test = mergeTests(admin, pages).extend<{ ownAgent: string; chatCleanup: void; sentChat: ChatMessage; restoredSettings: void; taskCleanup: void; createdTask: NewTask; workspaceCleanup: void; uploadCleanup: void; workspaceFile: string; workspaceFolder: string; skillCleanup: void; createdSkill: NewSkill; projectCleanup: void; createdProject: string }>({
  /**
   * Hands a test the user's own agent and puts it back afterwards: Start if the test left it
   * stopped, Reset to default if it left a custom quota. Teardown ladder rung 3 (UI): the
   * admin API is not exposed to the suite. A failed restore is attached, never thrown, so it
   * cannot turn a green test red.
   */
  ownAgent: [async ({ adminSession, adminAgentsPage }, use, testInfo) => {
    await use(OWN_AGENT.name);
    testInfo.setTimeout(testInfo.timeout + 90_000);
    try {
      await adminAgentsPage.restoreAgentState(OWN_AGENT.name);
    } catch (error) {
      await testInfo.attach('agent-not-restored.txt', {
        body: `${OWN_AGENT.name} may still be stopped or have a custom quota after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * Deletes every QA-AUTO conversation left in Asta's sidebar after the test.
   * Teardown ladder rung 3 (UI delete): chats have no API delete the suite can call. A failed
   * cleanup is attached, never thrown.
   */
  chatCleanup: [async ({ userChatPage }, use, testInfo) => {
    await use();
    try {
      await userChatPage.deleteAutomationChats();
    } catch (error) {
      await testInfo.attach('chat-not-deleted.txt', {
        body: `A QA-AUTO conversation may be left in ${OWN_ASSISTANT.name}'s sidebar after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * Puts Asta's Role, Dream Mode and Response Tone back to their usual values after a test that
   * changed them. Teardown ladder rung 3 (UI): the settings page is the only way to set them. A
   * failed restore is attached, never thrown.
   */
  restoredSettings: [async ({ userSettingsPage }, use, testInfo) => {
    await use();
    try {
      await userSettingsPage.restoreOwnSettings();
    } catch (error) {
      await testInfo.attach('settings-not-restored.txt', {
        body: `${OWN_ASSISTANT.name}'s Role, Dream Mode or Response Tone may still be changed after ${testInfo.title}:
${String(error)}
`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * Deletes every QA-AUTO task left in Asta's Tasks list after the test.
   * Teardown ladder rung 3 (UI delete): tasks have no API delete the suite can call. A failed
   * cleanup is attached, never thrown.
   */
  taskCleanup: [async ({ userTasksPage }, use, testInfo) => {
    await use();
    try {
      await userTasksPage.deleteAutomationTasks();
    } catch (error) {
      await testInfo.attach('task-not-deleted.txt', {
        body: `A QA-AUTO task may be left in ${OWN_ASSISTANT.name}'s Tasks list after ${testInfo.title}:
${String(error)}
`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * A task that already exists: created through the UI (no API seeding path) with Enabled
   * switched off, so it never runs or sends to a channel; removed by taskCleanup.
   */
  createdTask: [async ({ taskCleanup, userTasksPage }, use) => {
    const task = newTask();
    await userTasksPage.open();
    await userTasksPage.createTask(task);
    await use(task);
  }, { timeout: 60_000 }],

  /**
   * Deletes every QA-AUTO file and folder left in Asta's workspace after the test.
   * Teardown ladder rung 3 (UI delete): the workspace has no API delete the suite can call. A
   * failed cleanup is attached, never thrown.
   */
  workspaceCleanup: [async ({ userWorkspacePage }, use, testInfo) => {
    await use();
    try {
      await userWorkspacePage.deleteAutomationTreeItems();
    } catch (error) {
      await testInfo.attach('workspace-not-deleted.txt', {
        body: `A QA-AUTO item may be left in ${OWN_ASSISTANT.name}'s workspace after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * Deletes every QA-AUTO file uploaded through Simple view, which stores uploads in the
   * directory folder where the tree sweep does not look. Teardown ladder rung 3 (UI delete). A
   * failed cleanup is attached, never thrown.
   */
  uploadCleanup: [async ({ userWorkspacePage }, use, testInfo) => {
    await use();
    try {
      await userWorkspacePage.deleteAutomationUploads();
    } catch (error) {
      await testInfo.attach('upload-not-deleted.txt', {
        body: `A QA-AUTO upload may be left in ${OWN_ASSISTANT.name}'s workspace after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * A file that already exists in the workspace: a tiny text file uploaded in Simple view
   * (no API seeding path); removed by uploadCleanup.
   */
  workspaceFile: [async ({ uploadCleanup, userWorkspacePage }, use) => {
    const fileName = newWorkspaceName('File', '.txt');
    await userWorkspacePage.openSimpleView();
    await userWorkspacePage.uploadFile(fileName);
    await use(fileName);
  }, { timeout: 60_000 }],

  /**
   * A folder that already exists in the workspace, created with New folder in Advanced view;
   * removed by workspaceCleanup.
   */
  workspaceFolder: [async ({ workspaceCleanup, userWorkspacePage }, use) => {
    const folderName = newWorkspaceName('Folder', '');
    await userWorkspacePage.openAdvancedView();
    await userWorkspacePage.createFolder(folderName);
    await use(folderName);
  }, { timeout: 60_000 }],

  /**
   * Removes every QA-AUTO custom skill left in Asta's Skills list after the test.
   * Teardown ladder rung 3 (UI delete): skills have no API delete the suite can call. A failed
   * cleanup is attached, never thrown.
   */
  skillCleanup: [async ({ userSkillsPage }, use, testInfo) => {
    await use();
    try {
      await userSkillsPage.removeAutomationSkills();
    } catch (error) {
      await testInfo.attach('skill-not-removed.txt', {
        body: `A QA-AUTO skill may be left in ${OWN_ASSISTANT.name}'s Skills list after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * A custom skill that already exists: created through Create Skill (no API seeding path);
   * removed by skillCleanup.
   */
  createdSkill: [async ({ skillCleanup, userSkillsPage }, use) => {
    const skill = newSkill();
    await userSkillsPage.open();
    await userSkillsPage.createSkill(skill);
    await use(skill);
  }, { timeout: 60_000 }],

  /**
   * Puts away every QA-AUTO project left in Asta's Projects (active, archived or in the trash)
   * and deletes it forever. Teardown ladder rung 3 (UI delete): projects have no API delete the
   * suite can call. A failed cleanup is attached, never thrown.
   */
  projectCleanup: [async ({ userProjectsPage }, use, testInfo) => {
    await use();
    try {
      await userProjectsPage.removeAutomationProjects();
    } catch (error) {
      await testInfo.attach('project-not-deleted.txt', {
        body: `A QA-AUTO project may be left in ${OWN_ASSISTANT.name}'s Projects after ${testInfo.title}:\n${String(error)}\n`,
        contentType: 'text/plain',
      });
    }
  }, { timeout: 60_000 }],

  /**
   * A project that already exists: created through New Project (no API seeding path); removed by
   * projectCleanup.
   */
  createdProject: [async ({ projectCleanup, userProjectsPage }, use) => {
    const projectName = newProjectName();
    await userProjectsPage.open();
    await userProjectsPage.createProject(projectName);
    await use(projectName);
  }, { timeout: 60_000 }],

  /**
   * A conversation that already exists: one short QA-AUTO message sent to the assistant and
   * answered. Built through the UI because the chat has no API seeding path (each send spends a
   * few cents of the assistant's budget); removed by chatCleanup.
   */
  sentChat: [async ({ chatCleanup, userChatPage }, use) => {
    const message = newChatMessage();
    await userChatPage.open();
    await userChatPage.sendMessage(message.text);
    await userChatPage.waitForReply();
    await use(message);
  }, { timeout: 60_000 }],
});
