import { expect } from '@playwright/test';
import { MAIL } from '../datas/auth/AuthData';
import type { MailboxClient } from '../setup/MailboxClient';

const ARRIVAL = { timeout: 60_000, intervals: [3_000] };

export class MailboxPage {
  constructor(private readonly mailbox: MailboxClient) {}

  async verificationLink(): Promise<string> {
    await this.expectVerificationEmailArrived();
    return this.mailbox.linkInMessage(MAIL.verifySubject, '/api/auth/verify-email');
  }

  async expectVerificationEmailArrived() {
    await expect.poll(() => this.mailbox.findMessage(MAIL.verifySubject), ARRIVAL).toBeDefined();
  }

  async expectVerificationEmailIsFromVelaCrew() {
    await this.expectVerificationEmailArrived();
    const message = await this.mailbox.findMessage(MAIL.verifySubject);
    expect(message?.fromName).toBe(MAIL.senderName);
    expect(message?.fromAddress).toBe(MAIL.senderAddress);
  }

  async expectDuplicateSignupNoticeArrived() {
    await expect.poll(() => this.mailbox.findMessage(MAIL.duplicateSubject), ARRIVAL).toBeDefined();
  }

  async expectResetEmailArrived() {
    await expect.poll(() => this.mailbox.findMessage(MAIL.resetSubject), ARRIVAL).toBeDefined();
  }
}
