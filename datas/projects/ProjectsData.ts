import { faker } from '@faker-js/faker';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

// Pre-existing, permanent project on Rex Dev - used only for a read-only check, never mutated.
export const EXISTING_PROJECT = {
  name: 'Wellness QA',
  id: '037beafb-3b16-4a4d-b901-f441e12dfbe3',
};

export const EXPECTED = {
  createDialogTitle: 'Create Project',
  settingsDialogTitle: 'Project Settings',
  deleteDialogDescription: 'This will remove the project and its custom instructions. Conversations inside it stay in your chat history.',
};

export const newProject = () => ({
  name: `QA Project ${faker.word.adjective()} ${faker.string.alphanumeric(6)}`,
  description: faker.lorem.sentence(),
});

// Edge-case text for Instructions field validation - a script tag (with a window-flag payload so
// a test can prove it never executed) plus a shell-command-looking string, well past any
// reasonable field length limit.
export const SCRIPT_LIKE_INSTRUCTIONS =
  '<script>window.__qaProjectScriptExecuted = true;</script> rm -rf / ; echo done';

export const LONG_INSTRUCTIONS = `Project rules: ${'x'.repeat(3000)}`;
