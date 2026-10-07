import { expect, type Locator, type Page } from '@playwright/test';

export class NavigationHelper {
  /**
   * Clicks a link until the page reaches the expected URL. A click that lands just after
   * hydration can be dropped before the router handler is live; re-clicking a link is harmless.
   */
  static async clickUntilUrl(page: Page, link: Locator, url: RegExp) {
    await expect(async () => {
      await link.click();
      await expect(page).toHaveURL(url, { timeout: 4_000 });
    }).toPass({ timeout: 30_000 });
  }
}
