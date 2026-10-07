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
