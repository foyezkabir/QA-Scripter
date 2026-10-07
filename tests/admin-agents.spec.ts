import { test } from '../fixtures/base';
import { noSuchAgent, OWN_AGENT } from '../datas/admin/AdminData';

test('TC-01: Verify that the agents page shows its stat cards, search and status filters', { tag: ['@smoke'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.expectPageIsOpen();
});

test('TC-02: Verify that the live polling and audit feed notes are shown', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.expectLivePollingNotes();
});

test('TC-03: Verify that the All Agents table has its seven columns', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.expectTableColumns();
});

test('TC-04: Verify that searching by name narrows the table to that agent and updates the URL', { tag: ['@critical'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.expectOnlyAgentRow(OWN_AGENT.name);
});

test('TC-05: Verify that a search with no match shows the empty state', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(noSuchAgent());
  await adminAgentsPage.expectNoAgentsMatchState();
});

test('TC-06: Verify that Clear filters brings the agents back from the empty state', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(noSuchAgent());
  await adminAgentsPage.expectNoAgentsMatchState();
  await adminAgentsPage.clickClearFilters();
  await adminAgentsPage.expectFiltersCleared();
});

test('TC-07: Verify that the All filter is pressed by default', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.expectAllFilterIsPressedByDefault();
});

test('TC-08: Verify that the Running filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.clickRunningFilter();
  await adminAgentsPage.expectRunningFilterIsApplied();
});

test('TC-09: Verify that the Stopped filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.clickStoppedFilter();
  await adminAgentsPage.expectStoppedFilterIsApplied();
});

test('TC-10: Verify that the Error filter is applied and sets the status in the URL', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.clickErrorFilter();
  await adminAgentsPage.expectErrorFilterIsApplied();
});

test('TC-11: Verify that the saved admin session opens the agents page signed in', { tag: ['@critical'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.expectPageIsOpen();
});

test('TC-12: Verify that the row menu of a running agent lists its actions', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openRowMenu(OWN_AGENT.name);
  await adminAgentsPage.expectRunningAgentMenuItems();
});

test('TC-13: Verify that View details shows the agent fields and the storage section', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openDetailsFor(OWN_AGENT.name);
  await adminAgentsPage.expectDetailDialogShowsAgentFields(OWN_AGENT.name);
});

test('TC-14: Verify that the storage section shows a loading state while usage loads', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openDetailsFor(OWN_AGENT.name);
  await adminAgentsPage.expectDetailStorageIsLoading(OWN_AGENT.name);
});

test('TC-15: Verify that Close closes the agent detail dialog', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openDetailsFor(OWN_AGENT.name);
  await adminAgentsPage.closeDetails(OWN_AGENT.name);
  await adminAgentsPage.expectDetailDialogIsClosed(OWN_AGENT.name);
});

test('TC-16: Verify that View logs shows the filter box and all log controls', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openLogsFor(OWN_AGENT.name);
  await adminAgentsPage.expectLogsDialogControls();
});

test('TC-17: Verify that the logs dialog shows a fetching state with Refresh and Load more disabled', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openLogsFor(OWN_AGENT.name);
  await adminAgentsPage.expectLogsAreFetching();
});

test('TC-18: Verify that Storage quota shows the inherited default with Reset to default disabled', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openStorageQuotaFor(OWN_AGENT.name);
  await adminAgentsPage.expectStorageQuotaDialogShowsDefault();
});

test('TC-19: Verify that Cancel closes the Storage quota dialog without saving', { tag: ['@regression'] }, async ({ adminSession, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(OWN_AGENT.name);
  await adminAgentsPage.openStorageQuotaFor(OWN_AGENT.name);
  await adminAgentsPage.cancelStorageQuota();
  await adminAgentsPage.expectStorageQuotaDialogIsClosed();
});
