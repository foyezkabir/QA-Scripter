import type { Page, Route } from '@playwright/test';
import { ADMIN_URL } from '../datas/admin/AdminData';

export class ApiMockHelper {
  /**
   * The admin pages read from a different origin, so a fulfilled response needs the CORS
   * headers the real API sends or the browser discards it.
   */
  static async fulfilJson(route: Route, status: number, body: object) {
    await route.fulfill({
      status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': ADMIN_URL, 'access-control-allow-credentials': 'true' },
      body: JSON.stringify(body),
    });
  }

  static async respondWith(page: Page, url: RegExp, status: number, body: object) {
    await page.route(url, (route) => ApiMockHelper.fulfilJson(route, status, body));
  }

  static async fail(page: Page, url: RegExp, errorMessage: string) {
    await page.route(url, (route) => ApiMockHelper.fulfilJson(route, 500, { success: false, error: errorMessage }));
  }

  static async stopMocking(page: Page, url: RegExp) {
    await page.unroute(url);
  }

  static async holdOpen(page: Page, url: RegExp) {
    // the request never completes, so the loading state stays on screen
    await page.route(url, async () => {});
  }
}
