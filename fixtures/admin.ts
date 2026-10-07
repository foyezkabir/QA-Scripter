import { test as base } from '@playwright/test';
import { readFileSync } from 'node:fs';

type SavedAdminSession = {
  cookies: Parameters<import('@playwright/test').BrowserContext['addCookies']>[0];
  session: { email: string | null; token: string | null };
};

export const test = base.extend<{ adminSession: void }>({
  /**
   * Restores the admin sign-in saved by global-setup: the cookie goes into the context and
   * the two sessionStorage keys are written before any page script runs. Request it BEFORE
   * the first page object call so the very first navigation is already signed in.
   */
  adminSession: async ({ context }, use) => {
    const saved: SavedAdminSession = JSON.parse(readFileSync('.auth/admin.json', 'utf8'));
    await context.addCookies(saved.cookies);
    await context.addInitScript((session) => {
      if (session.email && session.token) {
        sessionStorage.setItem('velaops-admin-email', session.email);
        sessionStorage.setItem('velaops-admin-token', session.token);
      }
    }, saved.session);
    await use();
  },
});
