import { DataHelper } from '../../helpers/DataHelper';

export const SIGNED_IN_USER = {
  firstName: 'Naiemul',
  fullName: 'Naiemul Hasan Naiem',
  email: 'nhnaiem@tulip-tech.com',
};

export const OWN_ASSISTANT = {
  id: '400ae506-9191-42f0-bf3f-70ab16662d25',
  name: 'Asta',
  role: 'QA Assistant',
};

export const PALETTE_TABS = ['All', 'Chats', 'Projects', 'Tasks', 'Tools'] as const;

export const QUICK_ACTIONS = ['New chat', 'New task', 'New project', 'Connect a tool'] as const;

export const SETTINGS_SECTIONS = ['General', 'Preferences', 'Notifications', 'Security', 'Usage', 'Privacy'] as const;

export const ACCOUNT_MENU_ITEMS = ['Profile', 'Help', 'Share Feedback', 'Privacy Policy', 'Terms of Service', 'Sign Out'] as const;

export const AGENT_SECTIONS = ['Projects', 'Tasks', 'Workspace', 'Tools', 'Messaging', 'Skills', 'CRM', 'Settings'] as const;

export const MODEL_OPTIONS = ['Primary', 'Coder', 'Fast'] as const;

export const TIME_FILTER_OPTIONS = ['Recent', 'All chats', 'Pick a date'] as const;

export const SUGGESTIONS = ['What can you do for me?', 'How are my projects performing?', 'Draft an email to a client'] as const;

export type ChatMessage = { token: string; text: string };

export const newChatMessage = (): ChatMessage => {
  const token = DataHelper.unique('Chat');
  return { token, text: `${token} - reply with the single word OK` };
};

export const TYPED_TEXT = 'draft';

export const CHANNEL_MODEL_OPTIONS = ['Fast (recommended)', 'Primary · For everyday work and general reasoning', 'Coder · For complex, code-heavy or technical work', 'Fast · Fastest for quick, simple answers'] as const;

export const SETTINGS_SECTION_HEADINGS = ['Basic Information', 'Behavior', 'Access key', 'Agent-to-agent access', 'Backup', 'Danger Zone'] as const;

export const RESPONSE_TONES = ['Professional', 'Friendly', 'Concise', 'Detailed', 'Custom'] as const;

export const DEFAULT_TONE = 'Concise';

export const CHANGED_TONE = 'Friendly';

export const CHANGED_ROLE = 'QA Assistant (edited)';

export const EMOJI_TABS = ['Frequently Used', 'Smileys & People', 'Animals & Nature', 'Food & Drink', 'Travel & Places', 'Activities', 'Objects', 'Symbols', 'Flags'] as const;

export const PROJECT_SORT_OPTIONS = ['Recent', 'Oldest', 'Name (A–Z)'] as const;

export const PROJECT_KINDS = ['General', 'Software delivery', 'Event', 'Marketing campaign', 'Construction or renovation', 'Study or course', 'Client work (agency)', 'Hiring', 'Research', 'Operations'] as const;

export const CREATE_PROJECT_EDITOR_BUTTONS = ['Bold', 'Italic', 'Code', 'Bullet List', 'Numbered List', 'Link'] as const;

export const NO_MATCH_SEARCH = 'zzqq-no-such-project';

export const newProjectName = () => DataHelper.unique('Project');

export const OWN_PROJECT = { id: '505aa081-1c30-452b-b746-3821054745d1', name: 'Pilot Release QA - Oct 2026' } as const;

export const PROJECT_TABS = ['Overview', 'Board', 'Progress', 'Risks', 'Digest', 'People', 'Budget'] as const;

export const PROJECT_SUBTITLES = {
  Overview: 'Where this project stands',
  Board: 'Every task by stage',
  Progress: 'Pace and rounds',
  Risks: 'What might slip and why',
  Digest: 'Written summaries for the team',
  People: 'Who is doing what',
  Budget: 'What it costs, what is left, and what it earns',
} as const;

export const OVERVIEW_TILES = ['This sprint', 'Open tasks', 'Waiting to be checked', 'Your assistant'] as const;

export const BOARD_VIEW_CHOICES = ['List', 'Board', 'Timeline'] as const;

export const ROUND_OPTIONS = ['This round', 'Backlog (not in a round)', 'Everything'] as const;

export const BOARD_FILTER_ITEMS = ['Round', 'Assignee', 'Priority', 'Hide subtasks', 'Show archived'] as const;

export const NEW_TASK_FIELDS = ['Title', 'Detail', 'New label name'] as const;

export const NEW_TASK_LISTS = ['Column', 'Priority', 'Assignee', 'Phase'] as const;

export const BOARD_SETTINGS_TABS = ['Columns', 'Rules', 'Priorities', 'Labels', 'Rounds'] as const;

export const BOARD_LAYOUTS = ['Standard', 'Full pipeline (review + QA)', 'Simple pipeline'] as const;

export const PEOPLE_TILES = ['Carrying a lot', 'Could take more', 'Work nobody owns'] as const;

export const PEOPLE_HEADINGS = ['Who is carrying what', 'What the team cannot cover', 'Work nobody owns'] as const;

export const BUDGET_BUTTONS = ['Set up budget', 'Log time', 'Export CSV', 'Submit a cost'] as const;

export const PEOPLE_ASK_BUTTONS = ['Ask about the load', 'Ask about them', 'Ask about the gap', 'Ask who should take it'] as const;

export type NewTask = { name: string; purpose: string; instructions: string; channel: string };

export const newTask = (): NewTask => ({
  name: DataHelper.unique('Task'),
  purpose: 'A short QA check that only exists for automated tests',
  instructions: 'Do nothing. This task is created disabled by an automated test and removed afterwards.',
  channel: 'Telegram',
});

export const TASK_SUBTITLE = 'Set up jobs your assistant runs on a schedule so the routine stuff happens without you lifting a finger';

export const SCHEDULE_OPTIONS = ['Every morning at 9am', 'Every hour', 'Every weekday at 9am', 'Every Monday at 9am', 'Every day at noon', 'Every evening at 6pm', 'Every 30 minutes', 'Custom…'] as const;

export const DEFAULT_SCHEDULE = 'Every morning at 9am';

export const TASK_MODEL_DEFAULT = "Default (agent's model)";

export const TASK_MODEL_OPTIONS = ['Primary · For everyday work and general reasoning', 'Coder · For complex, code-heavy or technical work', 'Fast · Fastest for quick, simple answers'] as const;

export const TASK_CHANNEL_OPTIONS = ['Telegram', 'Slack'] as const;

export const TASK_HEALTH_TABS = ['All', 'Needs you', 'Running', 'Healthy', 'Off'] as const;

export const TASK_EMPTY_TABS = ['Needs you', 'Running', 'Healthy'] as const;

export const TASK_SUMMARY_CARDS = ['Running now', 'Needs you', 'Next run', 'Ran clean'] as const;

export const TASK_SHEET_TABS = ['Overview', 'Runs', 'Settings'] as const;

export const TASK_RUN_FILTERS = ['All', 'Failed', 'Skipped', 'Not sent'] as const;

export const TASK_LOG_FILTERS = ['Everything', 'Creation', 'Runs'] as const;

export const TASK_SUGGESTIONS = ['Always include a summary and a total', 'Move it to 7am', 'Send it somewhere else', 'Tell me when a run takes a while'] as const;

export const TASK_NO_MATCH_SEARCH = 'zzqq-no-such-task';

export const TASK_RENAME_SUFFIX = ' renamed';

export const TASK_TEMPLATE_WORDS = ['Goal', 'Context', 'Steps', 'Output'] as const;

export const DEFAULT_SCHEDULE_LABEL = 'Every day at 9:00am';
