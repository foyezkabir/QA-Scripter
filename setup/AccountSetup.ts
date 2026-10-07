import { request, type APIRequestContext } from '@playwright/test';
import type { NewSignUp } from '../datas/auth/AuthData';
import { LoopHelper } from '../helpers/LoopHelper';

export class AccountSetup {
  private constructor(
    private readonly api: APIRequestContext,
    private readonly origin: string,
  ) {}

  static async create(): Promise<AccountSetup> {
    const origin = new URL(process.env.BASE_URL!).origin;
    const api = await request.newContext({ baseURL: origin, extraHTTPHeaders: { Origin: origin } });
    return new AccountSetup(api, origin);
  }

  async signUp(account: NewSignUp) {
    await this.postUntilAccepted('/api/auth/sign-up/email', { name: account.fullName, email: account.email, password: account.password });
  }

  async verifyEmail(link: string) {
    await this.api.get(link);
  }

  async requestPasswordReset(email: string) {
    await this.postUntilAccepted('/api/auth/request-password-reset', { email, redirectTo: `${this.origin}/auth/reset-password` });
  }

  async resetPassword(token: string, newPassword: string) {
    await this.postUntilAccepted('/api/auth/reset-password', { newPassword, token });
  }

  // Dev rate-limits these endpoints (429); retry until accepted and fail loudly if never, never silently
  private async postUntilAccepted(path: string, data: Record<string, string>) {
    const accepted = await LoopHelper.retryUntil(async () => ((await this.api.post(path, { data })).ok() ? true : undefined), 8, 6_000);
    if (!accepted) {
      throw new Error(`Dev did not accept ${path} after 8 attempts`);
    }
  }

  async dispose() {
    await this.api.dispose();
  }
}
