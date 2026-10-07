import { request, type APIRequestContext } from '@playwright/test';
import { DataHelper } from '../helpers/DataHelper';
import { MailHelper } from '../helpers/MailHelper';

const MAIL_API = 'https://api.mail.tm';

export type MailMessage = { id: string; subject: string; fromName: string; fromAddress: string };

export class MailboxClient {
  private constructor(
    private readonly api: APIRequestContext,
    private readonly accountId: string,
    readonly address: string,
  ) {}

  static async create(): Promise<MailboxClient> {
    const anonymous = await request.newContext({ baseURL: MAIL_API });
    const domains = await (await anonymous.get('/domains')).json();
    const address = `qa${DataHelper.numericId(10)}@${domains['hydra:member'][0].domain}`;
    const password = `Mb${DataHelper.numericId(12)}Aa`;
    const account = await (await anonymous.post('/accounts', { data: { address, password } })).json();
    const session = await (await anonymous.post('/token', { data: { address, password } })).json();
    await anonymous.dispose();
    const api = await request.newContext({ baseURL: MAIL_API, extraHTTPHeaders: { Authorization: `Bearer ${session.token}` } });
    return new MailboxClient(api, account.id, address);
  }

  async findMessage(subjectPart: string): Promise<MailMessage | undefined> {
    const response = await this.api.get('/messages');
    if (!response.ok()) {
      return undefined;
    }
    const inbox = await response.json();
    const match = inbox['hydra:member'].find((message: { subject: string }) => message.subject.includes(subjectPart));
    return match && { id: match.id, subject: match.subject, fromName: match.from.name, fromAddress: match.from.address };
  }

  async linkInMessage(subjectPart: string, urlPart: string): Promise<string> {
    const message = await this.findMessage(subjectPart);
    const response = message && (await this.api.get(`/messages/${message.id}`));
    const body = response?.ok() ? await response.json() : undefined;
    return MailHelper.firstLink(body?.text ?? '', urlPart);
  }

  async dispose() {
    await this.api.delete(`/accounts/${this.accountId}`);
    await this.api.dispose();
  }
}
