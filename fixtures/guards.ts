import { mergeTests } from '@playwright/test';
import { OWN_AGENT } from '../datas/admin/AdminData';
import { test as admin } from './admin';
import { test as pages } from './pages';

export const test = mergeTests(admin, pages).extend<{ ownAgent: string }>({
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
});
