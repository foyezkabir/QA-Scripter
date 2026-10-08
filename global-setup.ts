import { chromium, type FullConfig } from '@playwright/test';
import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';

const ADMIN_SESSION_FILE = '.auth/admin.json';
const USER_SESSION_FILE = '.auth/user.json';
const USER_SIGN_IN_ATTEMPTS = 4;

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

async function saveUserSession() {
  const baseUrl = process.env.BASE_URL?.replace(/\/+$/, '');
  const email = process.env.DEV_USER1_EMAIL;
  const password = process.env.DEV_USER1_PASSWORD;
  if (!baseUrl || !email || !password) {
    return;
  }
  const browser = await chromium.launch();
  for (let attempt = 1; attempt <= USER_SIGN_IN_ATTEMPTS; attempt++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}/auth/signin`);
      await page.waitForFunction(() => Object.keys(document).some((key) => key.startsWith('__reactContainer')));
      await page.getByRole('textbox', { name: 'Work email' }).fill(email);
      // the password field has a Show password button, so a role name would be ambiguous
      await page.locator('#password').fill(password);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
      await context.storageState({ path: USER_SESSION_FILE });
      await browser.close();
      return;
    } catch {
      // sign-in is rate limited (about 3 requests per 10 seconds): wait it out and retry
      await context.close();
      await new Promise((resolve) => setTimeout(resolve, 12_000));
    }
  }
  await browser.close();
  console.warn('global-setup: user 1 could not sign in; user-app specs will run signed out');
}

async function globalSetup(_config: FullConfig) {
  mkdirSync('.auth', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.context().storageState({ path: USER_SESSION_FILE });
  await browser.close();
  await saveUserSession();
  await saveAdminSession();
}

export default globalSetup;
