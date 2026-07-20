import path from 'path';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

// Files already present live on the Rex Dev agent's Workspace (confirmed 2026-07-20) - reused
// as read-only preconditions for cases 61954/61955 instead of uploading fresh duplicates, since
// storage was already at 70% (718 MB / 1.00 GB) and these exact scenarios were already evidenced.
export const EXISTING_LONG_FILENAME =
  'this-is-an-extremely-long-file-name-intended-to-test-ui-layout-behavior-when-rendering-the-workspace-file-list-and-should-not-break-anything-at-all-1234567890.txt';
export const EXISTING_CASE_PAIR = { lower: 'casefile.md', upper: 'CaseFile.md' };

// Tiny (40 B) throwaway fixture, checked in, reused across upload/duplicate/delete cases so no
// new file needs to be authored per test run.
export const DUP_TEST_FILE_NAME = 'qa-dup-test.txt';
export const DUP_TEST_FILE_PATH = path.join(__dirname, 'fixtures', 'qa-dup-test.txt');
