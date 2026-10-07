import type { Page } from '@playwright/test';

export class HydrationHelper {
  /**
   * Resolves once React has hydrated the page. Clicking or typing earlier is swallowed:
   * the server-rendered controls exist but have no handlers yet, so a click on a link or
   * a submit silently does nothing and the test fails on a navigation that never happens.
   */
  static async waitUntilHydrated(page: Page) {
    await page.waitForFunction(() => Object.keys(document).some((key) => key.startsWith('__reactContainer')));
  }
}
