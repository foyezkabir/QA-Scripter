import { DataHelper } from '../../helpers/DataHelper';

export type AdminCredentials = { email: string; token: string };

export const ADMIN_URL = process.env.DEV_ADMIN_URL!.replace(/\/+$/, '');

export const VALID_ADMIN: AdminCredentials = {
  email: process.env.DEV_ADMIN_EMAIL!,
  token: process.env.DEV_ADMIN_TOKEN!,
};

export const EDGE = {
  malformedEmail: 'notanemail',
};

export const unknownAdmin = (): AdminCredentials => ({
  email: DataHelper.email('example.test'),
  token: DataHelper.unique('WrongToken'),
});

export const DEEP_LINK = '/admin/users?q=anything';

export const OWN_AGENT = {
  name: 'Asta',
  role: 'QA Assistant',
  owner: 'Naiemul Hasan Naiem',
};

export const AGENT_COLUMNS = ['Agent', 'Owner', 'Status', 'Activity', 'Integrations', 'Created', 'Actions'] as const;

export const AGENT_DETAIL_LABELS = [
  'Agent ID',
  'Owner',
  'Agent email',
  'Public URL',
  'Container',
  'Image',
  'Channels',
  'Skills',
  'Tasks',
  'Sub-agents',
  'Created',
  'Updated',
] as const;

export const noSuchAgent = (): string => DataHelper.unique('NoSuchAgent');

export const QUOTA_OVERRIDE_GB = '0.6';

export const DASHBOARD_SECTIONS = [
  'Agents working',
  'People with access',
  'Money left',
  'Happy replies',
  'Where people reach your agents',
  'Your agents right now',
  'Money and usage',
  'Things to look at',
  'What happened recently',
  'Suggestions',
] as const;

export const NAV_LINKS = [
  'Dashboard',
  'Agents',
  'Users',
  'Usage',
  'AI Platform',
  'Audit Log',
  'Feedback',
] as const;

export const NAV_TARGETS = {
  agents: { name: 'Agents', path: /\/admin\/agents$/ },
  users: { name: 'Users', path: /\/admin\/users$/ },
  usage: { name: 'Usage', path: /\/admin\/usage$/ },
  aiPlatform: { name: 'AI Platform', path: /\/admin\/ai-platform$/ },
  auditLog: { name: 'Audit Log', path: /\/admin\/audit-log$/ },
  feedback: { name: 'Feedback', path: /\/admin\/feedback$/ },
} as const;

export const OVERVIEW_CARDS = {
  agents: { name: 'Agents working', path: /\/admin\/agents$/ },
  people: { name: 'People with access', path: /\/admin\/users$/ },
  money: { name: 'Money left', path: /\/admin\/ai-platform$/ },
  replies: { name: 'Happy replies', path: /\/admin\/feedback$/ },
} as const;

export const USAGE_STATS = [
  'Total Agents Provisioned',
  'Active Agents',
  'Total Integrations Enabled',
] as const;

export const INTEGRATIONS = ['teams', 'telegram', 'slack', 'github', 'atlassian'] as const;

export const AI_STATS = ['Models', 'API Keys', 'Today’s Spend', 'Today’s Requests'] as const;

export const AI_ACTIVITY_LABELS = ['Prompt Tokens', 'Completion Tokens', 'Successful', 'Failed'] as const;

export const AI_KEY_COLUMNS = ['Key', 'User', 'Spend', 'Budget', 'Status', 'Actions'] as const;

export const AI_MODELS = [
  'agent-primary',
  'agent-coder',
  'agent-fast',
  'agent-vision',
  'agent-image',
  'agent-free-primary',
  'agent-free-fast',
  'whisper-1',
  'gpt-4o-transcribe',
] as const;

export const THRESHOLD_TYPED = { reminder: '7', warning: '3' };

export const OWN_USER = {
  name: 'Naiemul Hasan Naiem',
  email: 'nhnaiem@tulip-tech.com',
};

export const USER_COLUMNS = ['User', 'Role', 'Status', 'Agents', 'LiteLLM Key', 'Created', 'Actions'] as const;

export const USER_DETAIL_LABELS = ['Status', 'Role', 'Agents owned', 'Two-factor', 'LiteLLM key', 'Created'] as const;

export const CHAT_VIEW_OPTIONS = ['Inherit default (detailed)', 'Compact', 'Detailed', 'Off'] as const;

export const TOP_UP_DEFAULT_AMOUNT = '20';

export const SUSPEND_DEFAULT_REASON = 'Violation of terms of service';

export const noSuchUser = (): string => DataHelper.unique('NoSuchUser');
