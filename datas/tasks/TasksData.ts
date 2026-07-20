import { faker } from '@faker-js/faker';

// Rex Dev agent on the dev environment (matches EMAIL/PASSWORD in .env) - the only agent
// available for exploration; carries 14 pre-seeded tasks used as read-only fixtures below.
export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

export const EXISTING_TASK_NAMES = {
  dailyDigest: 'Daily Ready-for-QA Digest',
  weekendPlans: 'Weekend Plans Suggestion',
} as const;

export const EXPECTED = {
  dialogDescription: 'Give the task a name, pick when it runs, and tell the agent exactly what to do.',
  createDialogTitle: 'Create Task',
  editDialogTitle: 'Edit Task',
  deleteDialogDescription: "The scheduled task will stop running. This can't be undone.",
  promptScaffoldMarkers: ['Goal', 'Context', 'Steps', 'Output'],
  defaultSchedulePreset: 'Every morning at 9am',
  presetCronEveryMorning9am: '0 9 * * *',
};

export const newTask = () => ({
  name: `QA ${faker.word.adjective()} Task ${faker.string.alphanumeric(6)}`,
  description: faker.lorem.sentence(),
  prompt: faker.lorem.sentence(),
});

export const newTasks = (count: number) => Array.from({ length: count }, () => newTask());

export const CUSTOM_CRON = {
  label: 'Every 15 minutes (custom)',
  expression: '*/15 * * * *',
};

// Edge-case text for the Prompt field: quotes, an ampersand, a "<" (HTML-escaping risk), an
// emoji, and a line break - covers the character classes TC-07 (daily-checklist Suite 201)
// calls out as at risk of truncation/escaping/corruption.
export const SPECIAL_CHARS_PROMPT =
  'Quotes: "double" \'single\' & ampersand < less-than 😀 emoji\nSecond line after break';
