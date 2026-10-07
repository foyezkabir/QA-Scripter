import { test as base } from '@playwright/test';
import { MAIL, newPassword, newSignUp, type NewSignUp } from '../datas/auth/AuthData';
import { LoopHelper } from '../helpers/LoopHelper';
import { MailHelper } from '../helpers/MailHelper';
import { MailboxPage } from '../pages/MailboxPage';
import { AccountSetup } from '../setup/AccountSetup';
import { MailboxClient } from '../setup/MailboxClient';

type VerifiedAccount = NewSignUp & { verifyLink: string };
type ResetAccount = { email: string; oldPassword: string; newPassword: string; usedResetLink: string };

export const test = base.extend<{
  mailbox: MailboxClient;
  mailboxPage: MailboxPage;
  accountSetup: AccountSetup;
  registeredAccount: NewSignUp;
  verifiedAccount: VerifiedAccount;
  resetLink: string;
  resetAccount: ResetAccount;
}>({
  /**
   * A disposable inbox. Every account made with it is permanent: Dev has no account delete
   * (teardown ladder rung 4), so the leak is attached to the run instead of hidden.
   */
  mailbox: async ({}, use, testInfo) => {
    const mailbox = await MailboxClient.create();
    await use(mailbox);
    await testInfo.attach('undeletable-account.txt', {
      body: `Dev has no account delete. Left behind by ${testInfo.title}:\n${mailbox.address}\n`,
      contentType: 'text/plain',
    });
    await mailbox.dispose();
  },

  mailboxPage: async ({ mailbox }, use) => {
    await use(new MailboxPage(mailbox));
  },

  accountSetup: async ({}, use) => {
    const accountSetup = await AccountSetup.create();
    await use(accountSetup);
    await accountSetup.dispose();
  },

  registeredAccount: async ({ mailbox, accountSetup }, use) => {
    const account = newSignUp({ email: mailbox.address });
    await accountSetup.signUp(account);
    await use(account);
  },

  verifiedAccount: [async ({ mailbox, accountSetup, registeredAccount }, use) => {
    const link = await LoopHelper.retryUntil(async () => (await mailbox.linkInMessage(MAIL.verifySubject, '/api/auth/verify-email')) || undefined, 40, 3_000);
    await accountSetup.verifyEmail(link ?? '');
    await use({ ...registeredAccount, verifyLink: link ?? '' });
  }, { timeout: 60_000 }],

  resetLink: [async ({ mailbox, accountSetup, verifiedAccount }, use) => {
    await accountSetup.requestPasswordReset(verifiedAccount.email);
    const link = await LoopHelper.retryUntil(async () => (await mailbox.linkInMessage(MAIL.resetSubject, '/api/auth/reset-password/')) || undefined, 40, 3_000);
    await use(link ?? '');
  }, { timeout: 60_000 }],

  resetAccount: [async ({ accountSetup, verifiedAccount, resetLink }, use) => {
    const changedPassword = newPassword();
    await accountSetup.resetPassword(MailHelper.resetTokenFrom(resetLink), changedPassword);
    await use({ email: verifiedAccount.email, oldPassword: verifiedAccount.password, newPassword: changedPassword, usedResetLink: resetLink });
  }, { timeout: 60_000 }],
});

export { expect } from '@playwright/test';
