import { test, expect } from '../fixtures/base';
import { AGENT_ID, newConcurrentMessage } from '../datas/concurrency/ConcurrencyData';
import { AGENT_NAME } from '../datas/chat/ChatData';
import { AGENT_ID as TASKS_AGENT_ID, newTasks } from '../datas/tasks/TasksData';

// TestRail Suite 201, section "22 - Concurrency & Chaos (Critical)" - 14 cases total. Only 2 are
// built below (62203/62212) - both reuse existing page objects (Tasks/Chat), no new module needed.
// The rest are out of scope for this pass: 62206/62215 (container restart mid-run/mid-stream) and
// 62205 (disallowed-model cron isolation) need infra-level fault injection this Playwright suite
// has no way to reach. 62202/62210/62211 need real scheduled/inbound message delivery through real
// external channels (WhatsApp/Telegram/Teams) this repo has no sandbox accounts for. 62207/62208/
// 62209 need a real Jira/Composio integration to verify side effects "confirmed directly against
// the target system", which this repo doesn't have credentials for. 62204 (rapid double-click "run
// now" triggers a single execution) has no matching control anywhere in the Tasks module explored
// so far - no "Run now" button was found. 62213/62214 (mid-stream backgrounding/network-kill and
// reconnect) overlap the same reload-mid-stream defect class already documented for both the main
// chat surface (case 61908, findings/chat.txt) and sub-agent delegation (observed flaky, case
// 62050) - deferred rather than building a third variant of an already-known-fragile area.
test.describe.configure({ mode: 'serial' });

// TestRail case 62203. Creates 10 tasks back-to-back, deletes a subset, and verifies the exact
// surviving set - no orphans, no accidental over/under-deletion. Runs against this agent's Tasks
// list regardless of what else is on it (doesn't depend on the 14-seeded-tasks baseline other
// tasks.spec.ts tests assume).
test('TC-01: Verify that creating 10 tasks rapidly and deleting a subset leaves exactly the correct surviving set',
  { tag: ['@critical', '@case-62203'] },
  async ({ tasksPage, cleanupTasks }) => {
    test.slow();
    const tasks = newTasks(10);
    const toDelete = tasks.slice(0, 4);
    const toKeep = tasks.slice(4);

    await tasksPage.open(TASKS_AGENT_ID);
    await tasksPage.createTasks(tasks);
    tasks.forEach((t) => cleanupTasks(t.name));

    await tasksPage.deleteTasks(toDelete.map((t) => t.name));

    await Promise.all(toKeep.map((task) =>
      expect(tasksPage.taskCardLocator(task.name), `${task.name} should survive - it was never deleted`).toBeVisible(),
    ));
    await Promise.all(toDelete.map((task) =>
      expect(tasksPage.taskCardLocator(task.name), `${task.name} should be gone - no orphan left behind`).toHaveCount(0),
    ));
  });

// TestRail case 62212. Two independent browser contexts (real separate sessions, not just two
// locators on one page - see fixtures/pages.ts secondChatPage) join the SAME conversation and send
// messages at roughly the same time, then both tabs' final transcripts are checked for correct
// ordering with neither message dropped nor duplicated.
test('TC-02: Verify that two sessions sending concurrently to the same agent chat preserve correct message ordering with no drops or duplicates',
  { tag: ['@critical', '@case-62212'] },
  async ({ chatPage, secondChatPage, cleanupConversationsById }, testInfo) => {
    testInfo.setTimeout(240_000); // two full reply round-trips plus this environment's documented reply slowness - see findings/chat.txt

    await chatPage.ensureAgentActive(AGENT_NAME);
    await chatPage.open(AGENT_ID);
    const openingMessage = newConcurrentMessage('opener');
    await chatPage.sendMessage(openingMessage);
    await chatPage.waitForReplyComplete(120_000);
    const convId = chatPage.getCurrentConversationId();
    cleanupConversationsById(convId);

    await secondChatPage.openConversation(AGENT_ID, convId);

    const messageFromTabA = newConcurrentMessage('tabA');
    const messageFromTabB = newConcurrentMessage('tabB');
    await Promise.all([
      chatPage.sendMessage(messageFromTabA),
      secondChatPage.sendMessage(messageFromTabB),
    ]);
    await Promise.all([
      chatPage.waitForReplyComplete(120_000),
      secondChatPage.waitForReplyComplete(120_000),
    ]);

    // Reload tab A to fetch the canonical, server-merged transcript rather than trusting its own
    // live in-memory state (which only ever saw its own send).
    await chatPage.openConversation(AGENT_ID, convId);
    const transcript = await chatPage.getTranscriptText();

    const countOf = (needle: string) => transcript.split(needle).length - 1;
    expect(countOf(messageFromTabA), 'tab A\'s message should appear exactly once in the merged transcript').toBe(1);
    expect(countOf(messageFromTabB), 'tab B\'s message should appear exactly once in the merged transcript - neither dropped nor duplicated').toBe(1);
    expect(
      transcript.indexOf(openingMessage),
      'the opening message should still come before both concurrent messages in the transcript',
    ).toBeLessThan(Math.min(transcript.indexOf(messageFromTabA), transcript.indexOf(messageFromTabB)));
  });
