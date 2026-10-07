import { DataHelper } from '../../helpers/DataHelper';

export type Credentials = { email: string; password: string };
export type NewSignUp = { fullName: string; email: string; password: string };

export const VALID_USER: Credentials = {
  email: process.env.DEV_USER2_EMAIL!,
  password: process.env.DEV_USER2_PASSWORD!,
};

export const EDGE = {
  blankFullName: '   ',
  malformedEmail: 'notanemail',
  shortPassword: 'short1',
};

export const unknownUser = (): Credentials => ({
  email: DataHelper.email('example.test'),
  password: DataHelper.unique('Wrong'),
});

export const newSignUp = (overrides: Partial<NewSignUp> = {}): NewSignUp => ({
  fullName: DataHelper.personName(),
  email: DataHelper.email('example.test'),
  password: DataHelper.unique('Valid'),
  ...overrides,
});

export const resetEmail = (): string => DataHelper.email('example.test');

export const newPassword = (): string => DataHelper.unique('NewPw');

export const MAIL = {
  verifySubject: 'Verify your VelaCrew email',
  duplicateSubject: 'You already have a VelaCrew account',
  resetSubject: 'Reset your VelaCrew password',
  senderName: 'VelaCrew',
  senderAddress: 'no-reply@updates.velaops.ai',
};

export const FAKE_RESET_TOKEN = 'faketoken123';
