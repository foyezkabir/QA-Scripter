import { chromium, FullConfig } from '@playwright/test';
import 'dotenv/config';

async function globalSetup(_config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL}/auth/signin`);
  await page.getByRole('textbox', { name: 'Work email' }).fill(process.env.EMAIL!);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: '.auth/user.json' });
  // MULTI-ROLE: repeat the login block above per role, saving each to
  // `.auth/<role>.json` (e.g. admin.json, customer.json) - see "Roles & environment".
  await browser.close();
}

export default globalSetup;
