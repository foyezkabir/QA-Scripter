import { faker } from '@faker-js/faker';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

// A real, uninstalled-by-default GitHub-sourced skill on the live catalog - safe to install and
// remove repeatedly without side effects (confirmed live: no confirmation dialog on either action).
export const TEST_SKILL = 'Napkin';

export const EXISTING_INSTALLED_SKILL = 'data-visualization';

// A syntactically-valid but non-existent agent id (TestRail case 62040).
export const INVALID_AGENT_ID = '00000000-0000-0000-0000-000000000000';

export const EXPECTED = {
  createDialogTitle: 'Create Skill',
  installedToast: 'Skill installed',
  removedToast: 'Skill removed',
  agentNotFoundHeading: 'Agent not found',
  agentNotFoundText: "This agent doesn't exist or you don't have access to it.",
  // Intent-based, not an observed string - no such message exists today (see findings/skills.txt).
  duplicateNameConflictPattern: /already exists|duplicate|choose a (different|unique) name/i,
};

export const newSkill = () => ({
  name: `QA Skill ${faker.word.adjective()} ${faker.string.alphanumeric(6)}`,
  whenToUse: `Use this skill when ${faker.lorem.sentence()}`,
  instructions: faker.lorem.sentences(2),
});
