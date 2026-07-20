import { test, expect } from '../fixtures/base';
import { AGENT_ID, EXISTING_TASK_NAMES, EXPECTED, newTask, CUSTOM_CRON, SPECIAL_CHARS_PROMPT } from '../datas/tasks/TasksData';

// Only one live agent exists to test against (provisioning a second is a slow 8-stage
// pipeline - see plan/tasks.md). Every test shares that one agent's Tasks list, so running
// them concurrently means multiple contexts mutating the same live list at once - confirmed
// live: parallel workers produced spurious timeouts that disappeared under serial execution.
// This is an environment constraint, not a locator/fixture bug - force serial for this file.
test.describe.configure({ mode: 'serial' });

// Live dev environment occasionally lags on task-list refresh after create (observed directly -
// KNOWLEDGE_HANDOFF.md's QA Notes flag Docker-in-Docker latency and say to increase timeouts
// rather than treat it as a bug). Default 30s intermittently isn't enough for this file.
test.beforeEach(async ({}, testInfo) => {
  testInfo.setTimeout(60_000);
});

test('TC-01: Verify that the Tasks page displays existing scheduled tasks',
  { tag: ['@smoke'] },
  async ({ tasksPage, page }) => {
    await tasksPage.open(AGENT_ID);
    await expect(page.getByRole('heading', { name: 'Tasks', level: 1 }), 'Tasks page should load').toBeVisible();
    await expect(
      tasksPage.taskCardLocator(EXISTING_TASK_NAMES.dailyDigest),
      'seeded task should render in the list',
    ).toBeVisible();
  });

test('TC-02: Verify that a new task can be created and appears in the list',
  { tag: ['@smoke', '@critical'] },
  async ({ tasksPage, cleanupTasks }) => {
    const task = newTask();

    await test.step('Open Tasks and create a new task', async () => {
      await tasksPage.open(AGENT_ID);
      await tasksPage.openNewTaskDialog();
      await tasksPage.fillFields(task);
      await tasksPage.submitCreate();
      cleanupTasks(task.name);
    });

    await test.step('Verify it appears in the list', async () => {
      await expect(
        tasksPage.taskCardLocator(task.name),
        'newly created task should appear in the Tasks list',
      ).toBeVisible();
    });
  });

test('TC-03: Verify that the Create button stays disabled with no fields filled',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await expect(tasksPage.createButtonLocator(), 'Create should be disabled with empty form').toBeDisabled();
  });

test('TC-04: Verify that the Create button stays disabled when only Name is filled',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await tasksPage.fillFields({ name: 'Only Name Filled' });
    await expect(
      tasksPage.createButtonLocator(),
      'Create should stay disabled until Task/Prompt is also filled',
    ).toBeDisabled();
  });

test('TC-05: Verify that the Task/Prompt field auto-inserts a Goal/Context/Steps/Output scaffold',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await tasksPage.fillFields({ prompt: 'Say hello' });
    const value = await tasksPage.promptFieldValue();
    for (const marker of EXPECTED.promptScaffoldMarkers) {
      expect.soft(value, `prompt scaffold should include "${marker}"`).toContain(marker);
    }
  });

test('TC-06: Verify that selecting a schedule preset updates the Schedule field',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await tasksPage.selectSchedulePreset('Every evening at 6pm');
    await expect
      .poll(() => tasksPage.getSelectedSchedulePreset(), { message: 'Schedule combobox should reflect the chosen preset' })
      .toBe('Every evening at 6pm');
  });

test('TC-07: Verify that the Custom schedule picker shows a live human label and cron preview',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await tasksPage.selectSchedulePreset('Custom…');
    await expect(
      tasksPage.scheduleLabelPreviewLocator('Every day at 9:00am'),
      'default custom picker should preview the human-readable label',
    ).toBeVisible();
    await expect(
      tasksPage.cronExpressionPreviewLocator(EXPECTED.presetCronEveryMorning9am),
      'default custom picker should preview the equivalent cron expression',
    ).toBeVisible();
  });

test('TC-08: Verify that Advanced cron accepts a free-text cron expression',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await tasksPage.selectSchedulePreset('Custom…');
    await tasksPage.switchToAdvancedCron();
    await tasksPage.fillAdvancedCron(CUSTOM_CRON);
    await expect(
      tasksPage.dialogLocator().getByRole('textbox', { name: /^Cron \(/ }),
      'advanced cron field should accept the custom expression',
    ).toHaveValue(CUSTOM_CRON.expression);
  });

test('TC-09: Verify that Task complexity can be switched from Simple to Complex',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await expect
      .soft(await tasksPage.isComplexitySelected('Simple'), 'Simple should be selected by default')
      .toBe(true);
    await tasksPage.selectComplexity('Complex');
    await expect
      .poll(() => tasksPage.isComplexitySelected('Complex'), { message: 'Complex should become selected' })
      .toBe(true);
  });

test('TC-10: Verify that a new task defaults to Enabled',
  { tag: ['@regression'] },
  async ({ tasksPage }) => {
    await tasksPage.open(AGENT_ID);
    await tasksPage.openNewTaskDialog();
    await expect(tasksPage.dialogLocator().getByRole('switch'), 'Enabled switch should default on').toBeChecked();
  });

test('TC-11: Verify that Edit pre-fills the dialog with the task\'s current values',
  { tag: ['@regression'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.openEditDialog(seededTask.name);
    await expect(tasksPage.dialogHeadingLocator(), 'dialog should open in Edit mode').toHaveText(EXPECTED.editDialogTitle);
    await expect(
      tasksPage.dialogLocator().getByRole('textbox', { name: 'Name' }),
      'Name should be pre-filled with the existing task name',
    ).toHaveValue(seededTask.name);
  });

test('TC-12: Verify that editing a task\'s name and saving updates the list',
  { tag: ['@regression'] },
  async ({ tasksPage, seededTask, cleanupTasks }) => {
    const updatedName = `${seededTask.name} (edited)`;
    await tasksPage.openEditDialog(seededTask.name);
    await tasksPage.fillFields({ name: updatedName });
    await tasksPage.submitSaveChanges();
    cleanupTasks(updatedName);
    await expect(tasksPage.taskCardLocator(updatedName), 'updated task name should appear in the list').toBeVisible();
  });

test('TC-13: Verify that disabling a task flips its toggle state',
  { tag: ['@critical'] },
  async ({ tasksPage, seededTask }) => {
    await expect
      .soft(await tasksPage.isTaskEnabled(seededTask.name), 'task should start enabled')
      .toBe(true);
    await tasksPage.toggleEnabled(seededTask.name);
    await expect
      .poll(() => tasksPage.isTaskEnabled(seededTask.name), { message: 'task should become disabled' })
      .toBe(false);
  });

test('TC-14: Verify that re-enabling a disabled task flips its toggle state back',
  { tag: ['@regression'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.toggleEnabled(seededTask.name);
    await expect
      .poll(() => tasksPage.isTaskEnabled(seededTask.name), { message: 'task should be disabled after first toggle' })
      .toBe(false);
    await tasksPage.toggleEnabled(seededTask.name);
    await expect
      .poll(() => tasksPage.isTaskEnabled(seededTask.name), { message: 'task should be re-enabled after second toggle' })
      .toBe(true);
  });

test('TC-15: Verify that Delete opens a confirmation dialog naming the task',
  { tag: ['@regression'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.openDeleteConfirm(seededTask.name);
    await expect(
      tasksPage.deleteDialogHeadingLocator(seededTask.name),
      'confirmation dialog should name the task being deleted',
    ).toBeVisible();
  });

test('TC-16: Verify that "Keep it" cancels deletion and the task remains',
  { tag: ['@regression'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.openDeleteConfirm(seededTask.name);
    await tasksPage.keepTask();
    await expect(tasksPage.taskCardLocator(seededTask.name), 'task should still exist after Keep it').toBeVisible();
  });

test('TC-17: Verify that "Yes, delete" removes the task from the list',
  { tag: ['@critical'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.openDeleteConfirm(seededTask.name);
    await tasksPage.confirmDelete();
    await expect(tasksPage.taskCardLocator(seededTask.name), 'task should be removed immediately').toHaveCount(0);
  });

test('TC-18: Verify that a deleted task does not reappear after reload',
  { tag: ['@critical'] },
  async ({ tasksPage, seededTask, page }) => {
    await test.step('Delete the task', async () => {
      await tasksPage.openDeleteConfirm(seededTask.name);
      await tasksPage.confirmDelete();
      await expect(tasksPage.taskCardLocator(seededTask.name), 'task should be removed immediately').toHaveCount(0);
    });

    await test.step('Reload and confirm it stays deleted', async () => {
      await page.reload();
      await expect(
        tasksPage.taskCardLocator(seededTask.name),
        'deleted task must not resurrect on reload (known delete-persistence race)',
      ).toHaveCount(0);
    });
  });

// The 3 TCs below map to TestRail Suite 201, section "07 - Tasks & Automations" (daily-checklist
// TC-06, TC-07, TC-14 respectively) - registered in datas/common/testrailRegistry.ts by case id.

test('TC-19: Verify that creating a task with a duplicate name is not blocked, and the delete dialog fails to disambiguate between the two',
  { tag: ['@critical', '@case-61988'] },
  async ({ tasksPage, cleanupTasks }) => {
    const task = newTask();

    await test.step('Create the first task', async () => {
      await tasksPage.open(AGENT_ID);
      await tasksPage.openNewTaskDialog();
      await tasksPage.fillFields(task);
      await tasksPage.submitCreate();
      cleanupTasks(task.name);
      await tasksPage.taskCardLocator(task.name).first().waitFor({ state: 'visible' });
    });

    await test.step('Create a second task with the identical name', async () => {
      await tasksPage.openNewTaskDialog();
      await tasksPage.fillFields(task);
      await tasksPage.submitCreate();
      // Soft: the app always lets this through (confirmed live) - flag it without halting the
      // test, since the delete-dialog disambiguation check below matters regardless of this one.
      await expect
        .soft(tasksPage.taskCardLocator(task.name), 'duplicate task name should be blocked or warned at creation - see findings/tasks.txt')
        .toHaveCount(1);
    });

    await test.step('Delete dialog should disambiguate between the two identically-named tasks', async () => {
      await tasksPage.openDeleteConfirmForDuplicate(task.name);
      // deleteDialogHeadingLocator matches the exact generic "Delete <name>?" heading - if the
      // dialog ever gains a distinguishing detail (date/ID/schedule), the heading text changes
      // and this exact-match locator stops matching, flipping this assertion green.
      await expect(
        tasksPage.deleteDialogHeadingLocator(task.name),
        'delete dialog should show a distinguishing detail (date/ID/schedule) for duplicate names, not the bare generic heading - see findings/tasks.txt',
      ).not.toBeVisible();
      await tasksPage.keepTask();
    });
  });

test('TC-20: Verify that a Prompt containing special characters survives a schedule-picker interaction and reopen unaltered',
  { tag: ['@critical', '@case-61989'] },
  async ({ tasksPage, cleanupTasks }) => {
    const task = newTask();

    await test.step('Create a task with a special-character prompt and interact with the schedule picker', async () => {
      await tasksPage.open(AGENT_ID);
      await tasksPage.openNewTaskDialog();
      await tasksPage.fillFields({ name: task.name, prompt: SPECIAL_CHARS_PROMPT });
      await tasksPage.selectSchedulePreset('Custom…');
      await tasksPage.selectCustomFrequency('Every N minutes');
      await tasksPage.setCustomInterval(15);
      await tasksPage.submitCreate();
      cleanupTasks(task.name);
    });

    await test.step('Reopen and diff the Prompt field against the original text', async () => {
      await tasksPage.openEditDialog(task.name);
      const reopened = await tasksPage.promptFieldValue();
      expect(
        reopened,
        'special characters (quotes, &, <, emoji, line break) should be preserved exactly, unaltered by the schedule picker',
      ).toContain(SPECIAL_CHARS_PROMPT);
    });
  });

test('TC-21: Verify that custom "every N minutes/hours" values outside 1-59 / 1-23 are rejected, not silently clamped',
  { tag: ['@regression', '@case-61996'] },
  async ({ tasksPage, seededTask }) => {
    await tasksPage.openEditDialog(seededTask.name);
    await tasksPage.selectSchedulePreset('Custom…');
    await tasksPage.selectCustomFrequency('Every N minutes');

    await test.step('0 minutes should be rejected, not clamped to 1', async () => {
      await tasksPage.setCustomInterval(0);
      await expect
        .soft(tasksPage.customIntervalLocator(), 'invalid 0 should be rejected with a validation error, not silently clamped to 1 - see findings/tasks.txt')
        .not.toHaveValue('1');
    });

    await test.step('60 minutes should be rejected, not clamped to 59', async () => {
      await tasksPage.setCustomInterval(60);
      await expect
        .soft(tasksPage.customIntervalLocator(), 'invalid 60 should be rejected with a validation error, not silently clamped to 59 - see findings/tasks.txt')
        .not.toHaveValue('59');
    });

    await tasksPage.selectCustomFrequency('Every N hours');

    await test.step('0 hours should be rejected, not clamped to 1', async () => {
      await tasksPage.setCustomInterval(0);
      await expect
        .soft(tasksPage.customIntervalLocator(), 'invalid 0 should be rejected with a validation error, not silently clamped to 1 - see findings/tasks.txt')
        .not.toHaveValue('1');
    });

    await tasksPage.cancelDialog();
  });
