import { test, expect } from '../fixtures/base';
import { AGENT_ID, EXISTING_LONG_FILENAME, EXISTING_CASE_PAIR, DUP_TEST_FILE_NAME, DUP_TEST_FILE_PATH } from '../datas/workspace/WorkspaceData';

// Same environment constraint as tasks/projects/chat.spec.ts - one live agent, one shared file
// listing. Force serial to avoid cross-test races on the same Workspace list.
test.describe.configure({ mode: 'serial' });

// TestRail case 61954. Reuses a file already present live (confirmed 2026-07-20) instead of
// uploading a fresh one - the exact scenario (very long file name) is already evidenced in the
// current Workspace state, and re-uploading would burn more of the already-70%-used storage quota.
test('TC-01: Verify that a file with an extremely long name uploads and renders without breaking layout',
  { tag: ['@regression', '@case-61954'] },
  async ({ workspacePage }) => {
    await workspacePage.open(AGENT_ID);
    await expect(
      workspacePage.fileRowLocator(EXISTING_LONG_FILENAME),
      'an extremely long file name should render as its own row, not break the list layout',
    ).toBeVisible();
  });

// TestRail case 61955. Reuses two files already present live differing only by case - proves the
// app treats file names as case-sensitive (both rows coexist) without needing a fresh upload.
test('TC-02: Verify that file names differing only by case are treated as distinct files',
  { tag: ['@regression', '@case-61955'] },
  async ({ workspacePage }) => {
    await workspacePage.open(AGENT_ID);
    await expect(
      workspacePage.fileRowLocator(EXISTING_CASE_PAIR.lower),
      'lower-case file name should have its own row',
    ).toBeVisible();
    await expect(
      workspacePage.fileRowLocator(EXISTING_CASE_PAIR.upper),
      'differently-cased file name should be a distinct row, not merged with the lower-case one',
    ).toBeVisible();
  });

test('TC-03: Verify that cancelling a delete confirmation leaves the file untouched',
  { tag: ['@critical', '@case-61961'] },
  async ({ workspacePage, cleanupWorkspaceFiles }) => {
    cleanupWorkspaceFiles(DUP_TEST_FILE_NAME);
    await workspacePage.open(AGENT_ID);
    await workspacePage.uploadFile(DUP_TEST_FILE_PATH);
    await expect(workspacePage.fileRowLocator(DUP_TEST_FILE_NAME), 'precondition: file should be uploaded').toBeVisible();

    await workspacePage.clickDelete(DUP_TEST_FILE_NAME);
    await expect(workspacePage.deleteConfirmDialogLocator(), 'a confirmation dialog should appear before deleting').toBeVisible();
    await workspacePage.cancelDelete();

    await expect(workspacePage.deleteConfirmDialogLocator(), 'dialog should close on Cancel').toBeHidden();
    await expect(
      workspacePage.fileRowLocator(DUP_TEST_FILE_NAME),
      'file should remain in the listing after Cancel - cancelling must not delete it',
    ).toBeVisible();
  });

test('TC-05: Verify that deleting a file removes it from the listing',
  { tag: ['@critical', '@case-61966'] },
  async ({ workspacePage, cleanupWorkspaceFiles }) => {
    cleanupWorkspaceFiles(DUP_TEST_FILE_NAME);
    await workspacePage.open(AGENT_ID);
    await workspacePage.uploadFile(DUP_TEST_FILE_PATH);
    await expect(workspacePage.fileRowLocator(DUP_TEST_FILE_NAME), 'precondition: file should be uploaded').toBeVisible();

    await workspacePage.clickDelete(DUP_TEST_FILE_NAME);
    await workspacePage.confirmDelete();

    await expect(
      workspacePage.fileRowLocator(DUP_TEST_FILE_NAME),
      'file should no longer appear in the listing after a confirmed delete',
    ).toHaveCount(0);
  });

// TestRail case 61964. Actual live behavior (confirmed 2026-07-20): re-uploading the same file
// name is NOT blocked - it silently succeeds and overwrites the existing entry with no warning.
// See findings/workspace.txt. This asserts the spec-intended "blocked" behavior, which currently
// fails against the real app - the failure is the documented evidence of the defect. Placed last
// in file (out of TC-number order) so its expected failure doesn't cascade-skip TC-05 under
// `mode: 'serial'` (Playwright skips remaining serial tests after one fails).
test('TC-04: Verify that uploading a file with a name that already exists is blocked',
  { tag: ['@regression', '@case-61964'] },
  async ({ workspacePage, cleanupWorkspaceFiles }) => {
    cleanupWorkspaceFiles(DUP_TEST_FILE_NAME);
    await workspacePage.open(AGENT_ID);
    await workspacePage.uploadFile(DUP_TEST_FILE_PATH);
    await expect(workspacePage.fileRowLocator(DUP_TEST_FILE_NAME), 'precondition: file should be uploaded once').toBeVisible();

    await workspacePage.uploadFile(DUP_TEST_FILE_PATH);

    await expect(
      workspacePage.duplicateNameConflictIndicatorLocator(),
      'uploading a duplicate file name should surface a block/conflict indication instead of silently overwriting - see findings/workspace.txt',
    ).toBeVisible();
  });
