import { test } from '../fixtures/base';
import { QUOTA_OVERRIDE_GB } from '../datas/admin/AdminData';

test.describe.configure({ mode: 'default', timeout: 60_000 });

test('TC-20: Verify that stopping an agent marks it Stopped and its menu offers Start instead of Stop', { tag: ['@regression'] }, async ({ ownAgent, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(ownAgent);
  await adminAgentsPage.stopAgent(ownAgent);
  await adminAgentsPage.expectAgentIsStopped(ownAgent);
  await adminAgentsPage.openRowMenu(ownAgent);
  await adminAgentsPage.expectStoppedAgentMenuOffersStartInsteadOfStop();
});

test('TC-21: Verify that a stopped agent is listed under the Stopped filter and Start brings it back to Running', { tag: ['@regression'] }, async ({ ownAgent, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(ownAgent);
  await adminAgentsPage.stopAgent(ownAgent);
  await adminAgentsPage.expectAgentIsStopped(ownAgent);
  await adminAgentsPage.clickStoppedFilter();
  await adminAgentsPage.expectAgentIsListedUnderStoppedFilter(ownAgent);
  await adminAgentsPage.startAgent(ownAgent);
  await adminAgentsPage.clickAllFilter();
  await adminAgentsPage.expectAgentIsRunning(ownAgent);
});

test('TC-22: Verify that saving a storage quota marks it overridden and enables Reset to default', { tag: ['@regression'] }, async ({ ownAgent, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(ownAgent);
  await adminAgentsPage.openStorageQuotaFor(ownAgent);
  await adminAgentsPage.saveStorageQuota(QUOTA_OVERRIDE_GB);
  await adminAgentsPage.expectStorageQuotaDialogIsClosed();
  await adminAgentsPage.openStorageQuotaFor(ownAgent);
  await adminAgentsPage.expectStorageQuotaIsOverridden(QUOTA_OVERRIDE_GB);
});

test('TC-23: Verify that Reset to default returns the storage quota to the inherited default', { tag: ['@regression'] }, async ({ ownAgent, adminAgentsPage }) => {
  await adminAgentsPage.open();
  await adminAgentsPage.search(ownAgent);
  await adminAgentsPage.openStorageQuotaFor(ownAgent);
  await adminAgentsPage.saveStorageQuota(QUOTA_OVERRIDE_GB);
  await adminAgentsPage.expectStorageQuotaDialogIsClosed();
  await adminAgentsPage.openStorageQuotaFor(ownAgent);
  await adminAgentsPage.resetStorageQuotaToDefault();
  await adminAgentsPage.expectStorageQuotaDialogIsClosed();
  await adminAgentsPage.expectStorageQuotaIsInheritedDefaultOnReopen(ownAgent);
});
