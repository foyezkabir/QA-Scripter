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

export const BUDGET_BUTTONS = ['Log time', 'Export CSV', 'Submit a cost'] as const;

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

export const newWorkspaceName = (kind: string, extension: string) => `${DataHelper.unique(kind).replaceAll(' ', '-')}${extension}`;

export const WORKSPACE_FILE_CONTENT = 'QA-AUTO workspace file used by automated tests';

export const WORKSPACE_EDIT_TEXT = 'Edited by an automated test';

export const WORKSPACE_FILE_MENU = ['Preview', 'Download', 'Share to', 'Rename', 'Delete'] as const;

export const WORKSPACE_FOLDER_MENU = ['New file', 'New folder', 'Upload file', 'Upload folder', 'Download as zip', 'Share to', 'Rename', 'Delete'] as const;

export const WORKSPACE_ADVANCED_BUTTONS = ['New file', 'New folder', 'Upload file', 'Upload folder', 'Show hidden', 'Simple view'] as const;

export const TOOL_CATEGORIES = ['Google Workspace', 'Microsoft 365', 'Atlassian', 'Productivity', 'Developer', 'Scheduling', 'Finance & Accounting'] as const;

export const TOOL_NAMES = [
  'Google Calendar', 'Gmail', 'Google Drive', 'Google Sheets', 'Google Docs',
  'Outlook', 'OneDrive', 'SharePoint', 'Excel', 'Microsoft Teams',
  'Jira', 'Confluence',
  'Notion', 'Linear', 'Asana', 'Trello', 'Dropbox', 'Slack', 'Huly',
  'GitHub',
  'Cal.com', 'Calendly',
  'Xero', 'Odoo', 'QuickBooks',
] as const;

export const TOOLS_WITH_PERMISSION = ['Google Calendar', 'Gmail', 'Google Drive', 'Jira', 'GitHub'] as const;

export const TOOL_SEARCH = { partName: 'git', match: 'GitHub', other: 'Gmail', nothing: 'zzqq-no-such-tool' } as const;

export const TOOLS_INTRO = 'Connect the apps you already use so your assistant can do the work for you.';

export type NewSkill = { name: string; category: string; whenToUse: string; steps: string };

export const newSkill = (): NewSkill => ({
  name: DataHelper.unique('Skill'),
  category: 'QA-AUTO',
  whenToUse: 'Use this skill when an automated test needs a placeholder skill.',
  steps: '1. Do nothing.\n2. Report that nothing was done.',
});

export const SKILLS_SUBTITLE = 'Save the things you have taught your assistant so it can repeat them anytime you ask';

export const SKILL_TABS = ['Browse', 'Installed', 'Custom'] as const;

export const SKILL_SOURCE_FILTERS = ['All', 'VelaCrew', 'Anthropic', 'GitHub'] as const;

export const INSTALLED_SKILLS = ['data-visualization', 'file-sharing', 'image-creation', 'memory-purge', 'pdf', 'space-collab'] as const;

export const SKILL_NO_MATCH_SEARCH = 'zzqq-no-such-skill';

export const NOT_INSTALLED_SKILL = 'Academy Guide';

export const BUILT_IN_SKILL = { name: 'data-visualization', byline: /v1\.0\.0.*by VelaCrew.*Apache-2\.0/ } as const;

export const CUSTOM_SKILL_BYLINE = /v1\.0\.0.*by User/;

export const PROJECT_TOASTS = {
  created: 'Project created successfully',
  updated: 'Project updated successfully',
  archived: 'Project archived',
  trashed: 'Project moved to trash',
  deleted: 'Project permanently deleted',
} as const;

export const PROJECT_RENAME_SUFFIX = ' renamed';

export type NewPerson = { first: string; last: string; name: string };

export const newPerson = (): NewPerson => {
  const last = `Person-${DataHelper.uid()}`;
  return { first: 'QA-AUTO', last, name: `QA-AUTO ${last}` };
};

export type NewMember = { name: string; email: string };

export const newMember = (): NewMember => ({ name: DataHelper.unique('Member'), email: DataHelper.email('example.test') });

export const newDashboardName = () => DataHelper.unique('Dashboard');

export const CRM_SUBTITLE = 'Your book of business in one place, so your assistant always knows who matters and what is at risk';

export const CRM_TABS = ['Dashboards', 'Companies', 'People', 'Opportunities', 'Notes', 'Tasks', 'Team', 'Setup'] as const;

export const DASHBOARD_WIDGETS = ['Open pipeline', 'Open opportunities', 'Won', 'Overdue tasks', 'Six checks'] as const;

export const CRM_TABLES = {
  Companies: { search: 'Search companies', chips: ['Has open opportunity', 'Dark over 30d', 'Single-threaded'], columns: ['Name', 'Domain', 'Revenue', 'Account owner', 'Location', 'Last contact', 'Contacts', 'Open opportunities', 'Open value'] },
  People: { search: 'Search people', chips: ['Owes us a reply', 'Never replied', 'Exec level'], columns: ['Name', 'Job title', 'Email', 'Company', 'They last replied', 'We last wrote', 'Reply debt'] },
  Opportunities: { search: 'Search opportunities', chips: ['Open only', '2+ risk signals', 'Dark over 30d', 'Close date passed', 'Closing in 30 days', 'Single-threaded'], columns: ['Opportunity', 'Stage', 'Amount', 'Close date', 'Company', 'Point of contact', 'Owner', 'Days to close', 'Since contact'] },
  Notes: { search: 'Search notes', chips: ['Last 14 days', 'About a deal'], columns: ['Title', 'About', 'Body', 'Written'] },
  Tasks: { search: 'Search tasks', chips: ['Not done', 'Overdue', 'Due this week'], columns: ['Task', 'Status', 'Due', 'Timing', 'Assignee', 'About'] },
} as const;

export const CRM_TAB_MENU = ['Companies', 'People', 'Opportunities', 'Notes', 'Tasks', 'Team'] as const;

export const COLUMN_MENU = ['Sort ascending', 'Sort descending', 'Move left', 'Move right', 'Hide column'] as const;

export const PERSON_EDIT_BUTTONS = ['Edit Name', 'Edit Email', 'Edit Phone', 'Edit Job title', 'Edit LinkedIn', 'Edit Company'] as const;

export const PERSON_JOB_TITLE = 'QA Automation Lead';

export const CRM_EMPTY_NAME_ERROR = 'Name cannot be empty.';

export const PROJECT_CLEANUP_PREFIX = 'QA-AUTO Project';

export const TEAM_PROJECT_CLEANUP_PREFIX = 'QA-AUTO Team';

export const newTeamProjectName = () => DataHelper.unique('Team');

export const newBoardTaskTitle = () => DataHelper.unique('Task');

export const TEAM_PROJECT_TOAST = 'Team project created';
