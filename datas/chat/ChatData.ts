import { faker } from '@faker-js/faker';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';
export const AGENT_NAME = 'Rex Dev';

export const EXPECTED = {
  emptyStateGreetingPattern: /Good (morning|afternoon|evening),/,
  warmingPlaceholder: 'Agent is starting up…',
  reconnectingPlaceholder: 'Agent is getting ready…',
  readyPlaceholder: 'Type a message…',
  deleteChatDialogTitle: 'Delete chat?',
  primaryModelMenuHeader: 'PRIMARY MODEL (APPLIES TO ALL CONVERSATIONS)',
  modelSwitchWarning: 'Switching will briefly reload the agent.',
};

export const MODEL_OPTIONS = ['DeepSeek V4 Flash (Direct)', 'DeepSeek V4 Pro (Direct)'] as const;

// Pre-existing, permanent conversation on Rex Dev - used only for a read-only history-render
// check (TC-10), never mutated. NOTE: "QA TC-05 injection test" (87c3f280-bc97-4fbd-b1b5-8f4475d708a7)
// was deliberately NOT used here - confirmed live that it no longer loads its history at all and
// always falls back to the empty state (see findings/chat.txt) - using it would make TC-10 fail
// on a real product bug rather than exercise the reload behavior it's meant to verify.
export const EXISTING_CONVERSATION = {
  title: 'What can you help me with today?',
  id: '188eca74-3d13-4f12-a755-b6f5ab6ea008',
};

export const newMessage = () => `QA smoke ${faker.word.adjective()} ${faker.string.alphanumeric(6)}`;

// A short, single-word/short-phrase reply (e.g. "Hello from Rex.") generates almost instantly -
// too fast to reliably observe the streaming/"Stop generating" state. Use a prompt that forces a
// longer reply for tests that need to catch the mid-stream state.
export const newSlowMessage = () => `QA smoke ${faker.word.adjective()} ${faker.string.alphanumeric(6)} - write exactly a 150 word story about a lighthouse keeper`;
