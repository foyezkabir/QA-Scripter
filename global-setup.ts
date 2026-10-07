import { chromium, type FullConfig } from '@playwright/test';
import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';

const ADMIN_SESSION_FILE = '.auth/admin.json';

async function saveAdminSession() {
  const adminUrl = process.env.DEV_ADMIN_URL?.replace(/\/+$/, '');
  if (!adminUrl || !process.env.DEV_ADMIN_EMAIL || !process.env.DEV_ADMIN_TOKEN) {
    return;
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${adminUrl}/admin/login`);
  await page.getByLabel('Admin email').fill(process.env.DEV_ADMIN_EMAIL);
  await page.getByLabel('Admin token').fill(process.env.DEV_ADMIN_TOKEN);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL(/\/admin$/);
  // the admin session is a cookie PLUS sessionStorage, which storageState does not carry
  const session = await page.evaluate(() => ({
    email: sessionStorage.getItem('velaops-admin-email'),
    token: sessionStorage.getItem('velaops-admin-token'),
  }));
  const cookies = await page.context().cookies();
  writeFileSync(ADMIN_SESSION_FILE, JSON.stringify({ cookies, session }));
  await browser.close();
}

async function globalSetup(_config: FullConfig) {
  mkdirSync('.auth', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.context().storageState({ path: '.auth/user.json' });
  await browser.close();
  await saveAdminSession();
}

export default globalSetup;
