import { faker } from '@faker-js/faker';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

export const EXPECTED = {
  createDialogTitle: 'Create Subagent',
  editDialogTitle: 'Edit Subagent',
  detailsDialogTitle: 'Subagent Details',
  emptyStateHeading: 'No subagents yet',
  noMatchesHeading: 'No matches',
  deleteDialogDescription: "This will permanently remove this subagent. This can't be undone.",
};

export const newSubagent = () => ({
  name: `QA Subagent ${faker.word.adjective()} ${faker.string.alphanumeric(6)}`,
  description: faker.lorem.sentence(),
  instructions: faker.lorem.sentences(2),
});

// A leftover subagent from an earlier, untracked session (confirmed live 2026-07-20) whose
// instructions bake in a deterministic reply tag - reused as a reliable delegation trigger for
// TestRail case 62050 rather than creating a new subagent with unpredictable LLM routing.
export const FINANCE_SUBAGENT_TRIGGER_PROMPT = 'Can you give me some budgeting advice for tracking my monthly invoices?';
export const FINANCE_SUBAGENT_REPLY_TAG = '[QA-FINANCE-SUBAGENT-REPLY]';
// The subagent's internal slug (read via network inspection only, never shown in the UI) - used
// as a negative check that no routing metadata leaks into the visible reply.
export const FINANCE_SUBAGENT_SLUG_FRAGMENT = 'qa-finance-helper';
