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
