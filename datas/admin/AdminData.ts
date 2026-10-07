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
