import { test } from '../fixtures/base';

test('TC-01: Verify that My work shows its heading, task count, project filter and sort', { tag: ['@smoke'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.expectMyWork();
});

test('TC-02: Verify that Filter by project offers All projects and a project', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.openProjectFilter();
  await userMyWorkPage.expectProjectFilterOptions();
});

test('TC-03: Verify that Sort my work offers Due, Priority and Project', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.openSortList();
  await userMyWorkPage.expectSortOptions();
});

test('TC-04: Verify that choosing Sort: Priority shows it as the chosen sort', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.openSortList();
  await userMyWorkPage.chooseSort('Sort: Priority');
  await userMyWorkPage.expectSortIs('Sort: Priority');
});

test('TC-05: Verify that tasks are listed in groups with a heading and a count', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.expectTaskGroups();
});

test('TC-06: Verify that each task row shows its key, title link and Open board link', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.expectTaskRows();
});

test('TC-07: Verify that choosing a task title opens its project with the task', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.openFirstTask();
  await userMyWorkPage.expectTaskOpened();
});

test('TC-08: Verify that Open board opens the project board', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.open();
  await userMyWorkPage.openFirstBoard();
  await userMyWorkPage.expectBoardOpened();
});

test('TC-09: Verify that the My work link in the left sidebar opens My work from Home', { tag: ['@regression'] }, async ({ userMyWorkPage }) => {
  await userMyWorkPage.openFromHome();
  await userMyWorkPage.expectMyWorkUrl();
});
