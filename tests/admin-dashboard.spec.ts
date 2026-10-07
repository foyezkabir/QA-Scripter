import { test } from '../fixtures/base';
import { NAV_TARGETS, OVERVIEW_CARDS } from '../datas/admin/AdminData';

test('TC-01: Verify that the dashboard shows its welcome heading, all sections and the search box', { tag: ['@smoke'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.expectPageIsOpen();
});

test('TC-02: Verify that the Admin account button shows the signed-in Super Admin role', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.expectSignedInAsSuperAdmin();
});

test('TC-03: Verify that the sidebar lists its groups, links and buttons', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.expectSidebarLists();
});

test('TC-04: Verify that the Agents sidebar link opens the agents page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.agents.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.agents.path);
});

test('TC-05: Verify that the Users sidebar link opens the users page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.users.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.users.path);
});

test('TC-06: Verify that the Usage sidebar link opens the usage page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.usage.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.usage.path);
});

test('TC-07: Verify that the AI Platform sidebar link opens the AI platform page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.aiPlatform.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.aiPlatform.path);
});

test('TC-08: Verify that the Audit Log sidebar link opens the audit log page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.auditLog.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.auditLog.path);
});

test('TC-09: Verify that the Feedback sidebar link opens the feedback page', { tag: ['@critical'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickNavLink(NAV_TARGETS.feedback.name);
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.feedback.path);
});

test('TC-10: Verify that the Dashboard sidebar link returns to the dashboard from another page', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.openPath('/admin/usage');
  await adminDashboardPage.clickNavLink('Dashboard');
  await adminDashboardPage.expectPageIsOpen();
});

test('TC-11: Verify that collapsing the sidebar hides its group labels and turns Admin account into a link', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickCollapseSidebar();
  await adminDashboardPage.expectSidebarIsCollapsed();
});

test('TC-12: Verify that expanding the sidebar restores its group labels', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickCollapseSidebar();
  await adminDashboardPage.expectSidebarIsCollapsed();
  await adminDashboardPage.clickExpandSidebar();
  await adminDashboardPage.expectSidebarIsExpanded();
});

test('TC-13: Verify that the Agents working card opens the agents page from View details', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openCardMenu(OVERVIEW_CARDS.agents.name);
  await adminDashboardPage.expectCardMenuOffersViewDetails();
  await adminDashboardPage.clickViewDetails();
  await adminDashboardPage.expectUrlMatches(OVERVIEW_CARDS.agents.path);
});

test('TC-14: Verify that the People with access card opens the users page from View details', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openCardMenu(OVERVIEW_CARDS.people.name);
  await adminDashboardPage.expectCardMenuOffersViewDetails();
  await adminDashboardPage.clickViewDetails();
  await adminDashboardPage.expectUrlMatches(OVERVIEW_CARDS.people.path);
});

test('TC-15: Verify that the Money left card opens the AI platform page from View details', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openCardMenu(OVERVIEW_CARDS.money.name);
  await adminDashboardPage.expectCardMenuOffersViewDetails();
  await adminDashboardPage.clickViewDetails();
  await adminDashboardPage.expectUrlMatches(OVERVIEW_CARDS.money.path);
});

test('TC-16: Verify that the Happy replies card opens the feedback page from View details', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openCardMenu(OVERVIEW_CARDS.replies.name);
  await adminDashboardPage.expectCardMenuOffersViewDetails();
  await adminDashboardPage.clickViewDetails();
  await adminDashboardPage.expectUrlMatches(OVERVIEW_CARDS.replies.path);
});

test('TC-17: Verify that the channels filter offers All channels and Connected only', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openChannelFilterMenu();
  await adminDashboardPage.expectChannelFilterMenuItems();
});

test('TC-18: Verify that choosing Connected only changes the channels filter to Connected only', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openChannelFilterMenu();
  await adminDashboardPage.chooseConnectedOnly();
  await adminDashboardPage.expectChannelFilterShows('Connected only');
});

test('TC-19: Verify that See all opens the audit log', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.clickSeeAll();
  await adminDashboardPage.expectUrlMatches(NAV_TARGETS.auditLog.path);
});

test('TC-20: Verify that the learning centre link targets the help page', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.expectLearningCentreLinkTargetsHelp();
});

test('TC-21: Verify that Appearance switches the admin to dark mode', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openAccountMenu();
  await adminDashboardPage.clickAppearance();
  await adminDashboardPage.expectDarkMode();
});

test('TC-22: Verify that choosing Appearance again switches the admin back to light mode', { tag: ['@regression'] }, async ({ adminSession, adminDashboardPage }) => {
  await adminDashboardPage.open();
  await adminDashboardPage.openAccountMenu();
  await adminDashboardPage.clickAppearance();
  await adminDashboardPage.expectDarkMode();
  await adminDashboardPage.clickAppearance();
  await adminDashboardPage.expectLightMode();
});
