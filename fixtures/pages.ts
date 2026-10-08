import { test as base } from '@playwright/test';
import { AdminAgentsPage } from '../pages/AdminAgentsPage';
import { AdminAiPlatformPage } from '../pages/AdminAiPlatformPage';
import { AdminAuditLogPage } from '../pages/AdminAuditLogPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminFeedbackPage } from '../pages/AdminFeedbackPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminUsagePage } from '../pages/AdminUsagePage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LegalPage } from '../pages/LegalPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SessionPage } from '../pages/SessionPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { UserChatPage } from '../pages/UserChatPage';
import { UserHomePage } from '../pages/UserHomePage';
import { UserMessagingPage } from '../pages/UserMessagingPage';
import { UserShellPage } from '../pages/UserShellPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';

export const test = base.extend<{
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  forgotPasswordPage: ForgotPasswordPage;
  verifyEmailPage: VerifyEmailPage;
  legalPage: LegalPage;
  sessionPage: SessionPage;
  resetPasswordPage: ResetPasswordPage;
  adminLoginPage: AdminLoginPage;
  adminAgentsPage: AdminAgentsPage;
  adminDashboardPage: AdminDashboardPage;
  adminUsagePage: AdminUsagePage;
  adminAiPlatformPage: AdminAiPlatformPage;
  adminUsersPage: AdminUsersPage;
  adminAuditLogPage: AdminAuditLogPage;
  adminFeedbackPage: AdminFeedbackPage;
  userHomePage: UserHomePage;
  userShellPage: UserShellPage;
  userChatPage: UserChatPage;
  userMessagingPage: UserMessagingPage;
}>({
  userMessagingPage: async ({ page }, use) => {
    await use(new UserMessagingPage(page));
  },
  userChatPage: async ({ page }, use) => {
    await use(new UserChatPage(page));
  },
  userShellPage: async ({ page }, use) => {
    await use(new UserShellPage(page));
  },
  userHomePage: async ({ page }, use) => {
    await use(new UserHomePage(page));
  },
  adminFeedbackPage: async ({ page }, use) => {
    await use(new AdminFeedbackPage(page));
  },
  adminAuditLogPage: async ({ page }, use) => {
    await use(new AdminAuditLogPage(page));
  },
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },
  adminAiPlatformPage: async ({ page }, use) => {
    await use(new AdminAiPlatformPage(page));
  },
  adminUsagePage: async ({ page }, use) => {
    await use(new AdminUsagePage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  adminAgentsPage: async ({ page }, use) => {
    await use(new AdminAgentsPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  verifyEmailPage: async ({ page }, use) => {
    await use(new VerifyEmailPage(page));
  },
  legalPage: async ({ page }, use) => {
    await use(new LegalPage(page));
  },
  sessionPage: async ({ page }, use) => {
    await use(new SessionPage(page));
  },
  resetPasswordPage: async ({ page }, use) => {
    await use(new ResetPasswordPage(page));
  },
});

export { expect } from '@playwright/test';
