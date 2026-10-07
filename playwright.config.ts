import 'dotenv/config';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: true,
  grepInvert: process.env.EMAIL_TESTS ? undefined : /@email/,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  retryStrategy: 'isolated', // PW ≥1.62: retries run at the END, one at a time in a
                             // single worker - a retry can't be polluted by a neighbour
                             // still running. Default 'immediate' retries in place.
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    // An absolute path: smart-reporter resolves even './x' relative to testDir, which lands
    // the report in tests/ where the .gitignore entry does not match it.
    ['playwright-smart-reporter', { outputFile: path.resolve(__dirname, 'smart-report.html') }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    // Phase 1 runs before any session file exists. There is no CLI flag to drop
    // storageState, so it is a config switch: SMOKE_NO_AUTH=1 npx playwright test.
    // Normal runs are unaffected and still load .auth/user.json.
    ...(process.env.SMOKE_NO_AUTH ? {} : { storageState: '.auth/user.json' }),
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
