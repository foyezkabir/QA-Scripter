import { mergeTests } from '@playwright/test';
import { newChatMessage, OWN_ASSISTANT, type ChatMessage } from '../datas/user/UserData';
import { OWN_AGENT } from '../datas/admin/AdminData';
import { test as admin } from './admin';
import { test as pages } from './pages';

export const test = mergeTests(admin, pages).extend<{ ownAgent: string; chatCleanup: void; sentChat: ChatMessage }>({
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
