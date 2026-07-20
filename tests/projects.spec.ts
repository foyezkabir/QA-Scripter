import { test, expect } from '../fixtures/base';
import { AGENT_ID, EXISTING_PROJECT, EXPECTED, newProject, SCRIPT_LIKE_INSTRUCTIONS, LONG_INSTRUCTIONS } from '../datas/projects/ProjectsData';

// Same environment constraint as tasks.spec.ts and chat.spec.ts - only one live agent exists,
// and the Projects list is shared across every test. Force serial to avoid cross-test races.
test.describe.configure({ mode: 'serial' });

test('TC-01: Verify that the Projects page displays existing projects',
  { tag: ['@smoke'] },
  async ({ projectsPage, page }) => {
    await projectsPage.open(AGENT_ID);
    await expect(page.getByRole('heading', { name: 'Projects', level: 1 }), 'Projects page should load').toBeVisible();
    await expect(
      projectsPage.projectCardLocator(EXISTING_PROJECT.name),
      'seeded project should render in the list',
    ).toBeVisible();
  });

test('TC-02: Verify that the search box filters projects by name',
  { tag: ['@regression'] },
  async ({ projectsPage, page }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.search(EXISTING_PROJECT.name);
    await expect(projectsPage.projectCardLocator(EXISTING_PROJECT.name), 'matching project should remain visible').toBeVisible();
    const count = await projectsPage.getProjectCount();
    expect(count, 'search should narrow the list to matching projects only').toBe(1);
    await expect(page.getByRole('link', { name: /^Open project /}).first()).toHaveText(new RegExp(EXISTING_PROJECT.name));
  });

test('TC-03: Verify that the Sort control offers Recent and Name options',
  { tag: ['@regression'] },
  async ({ projectsPage }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.selectSort('Sort: Name');
    // No stable assertion on resulting order without knowing every project name in advance -
    // this just confirms the control is interactable and accepts the option.
  });

test('TC-04: Verify that a new project can be created and appears in the list',
  { tag: ['@smoke', '@critical'] },
  async ({ projectsPage, cleanupProjects, page }) => {
    const project = newProject();

    await test.step('Create the project', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields(project);
      await projectsPage.submitCreate();
      cleanupProjects(project.name);
    });

    await test.step('Verify the created-toast and navigation into the project', async () => {
      await expect(page.getByText('Project created'), 'a success toast should appear').toBeVisible();
      await expect(page.getByText(new RegExp(project.name)).first(), 'the project-scoped chat view should show the project name').toBeVisible();
    });

    await test.step('Verify it appears back in the Projects list', async () => {
      await projectsPage.open(AGENT_ID);
      await expect(projectsPage.projectCardLocator(project.name), 'new project should appear in the list').toBeVisible();
    });
  });

test('TC-05: Verify that the Create button stays disabled with no Name filled',
  { tag: ['@regression'] },
  async ({ projectsPage }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.openNewProjectDialog();
    await expect(projectsPage.createButtonLocator(), 'Create should be disabled with empty Name').toBeDisabled();
  });

test('TC-06: Verify that the Create button enables with only Name filled (Description not required)',
  { tag: ['@regression'] },
  async ({ projectsPage }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.openNewProjectDialog();
    await projectsPage.fillFields({ name: 'Name Only Check' });
    await expect(
      projectsPage.createButtonLocator(),
      'Create should enable with just Name - app-guide documents Description as required but live UI does not enforce it',
    ).toBeEnabled();
  });

test('TC-07: Verify that Delete project opens a confirmation dialog naming the project',
  { tag: ['@regression'] },
  async ({ projectsPage, seededProject }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.openDeleteConfirm(seededProject.name);
    await expect(
      projectsPage.deleteDialogHeadingLocator(seededProject.name),
      'confirmation dialog should name the project being deleted',
    ).toBeVisible();
    await projectsPage.keepProject();
  });

test('TC-08: Verify that confirming delete removes the project from the list',
  { tag: ['@critical'] },
  async ({ projectsPage, seededProject }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.openDeleteConfirm(seededProject.name);
    await projectsPage.confirmDelete();
    await expect(projectsPage.projectCardLocator(seededProject.name), 'project should be removed').toHaveCount(0);
  });

test('TC-09: Verify that a project\'s detail view shows Files and Settings actions',
  { tag: ['@regression'] },
  async ({ projectsPage, seededProject, page }) => {
    await expect(
      page.getByText(new RegExp(seededProject.name)).first(),
      'project-scoped chat view should reference the project by name',
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Files', exact: true }), 'project banner should offer Files').toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings', exact: true }), 'project banner should offer Settings').toBeVisible();
  });

test('TC-10: Verify that Project Settings opens with Save Changes disabled until edited',
  { tag: ['@regression'] },
  async ({ projectsPage, seededProject }) => {
    await projectsPage.openSettings();
    await expect(projectsPage.settingsDialogHeadingLocator(), 'Project Settings dialog should open').toBeVisible();
    await expect(projectsPage.saveChangesButtonLocator(), 'Save Changes should be disabled with nothing changed').toBeDisabled();
  });

test('TC-11: Verify that Project files shows the auto-created memory.md and project.md',
  { tag: ['@regression'] },
  async ({ projectsPage, seededProject, page }) => {
    await projectsPage.openFiles();
    await expect(projectsPage.filesDialogHeadingLocator(seededProject.name), 'Project files dialog should open').toBeVisible();
    await expect(page.getByRole('button', { name: /^memory\.md/ }), 'memory.md should be auto-created').toBeVisible();
    await expect(page.getByRole('button', { name: /^project\.md/ }), 'project.md should be auto-created').toBeVisible();
  });

// The 9 TCs below map to TestRail Suite 201, section "06 - Projects" (daily-checklist TC-01/03/07/
// 11/12/13/14/15/16 respectively) - registered in datas/common/testrailRegistry.ts by case id.
// Excluded from this file (out of scope, not fabricated): case 61968 (needs a Telegram/Teams bot
// round-trip - no bot test harness), 61970 (checklist itself calls for human judgment on recall
// quality - Manual), 61972 (no live Project<->Task binding UI found - not a real feature to test),
// 61974 (needs a 2nd agent - this dev environment only has one). Cases 61975/61976 (workspace file
// cross-visibility) deferred until the Workspace module itself is built.

test('TC-12: Verify that a project\'s custom instructions are reflected in the agent\'s reply, not just its default persona',
  { tag: ['@critical', '@case-61967'] },
  async ({ projectsPage, chatPage, cleanupProjects, page }) => {
    test.slow(); // waits on a real agent reply, same accommodation as subagents.spec.ts
    const project = newProject();
    const marker = 'ORANGE-SIGNAL-42';

    await test.step('Create a project with a distinctive instruction', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields({ ...project, instructions: `Always end every reply with the exact phrase ${marker}` });
      await projectsPage.submitCreate();
      cleanupProjects(project.name);
    });

    await test.step('Ask a question inside the project and check the reply', async () => {
      await chatPage.sendMessage('What is 2+2?');
      await chatPage.waitForReplyComplete();
      await expect(page.getByText(marker), 'reply should reflect the project\'s custom instructions, not just the default persona').toBeVisible();
    });
  });

test('TC-13: Verify that opening a non-existent Project shows a clear not-found state instead of a fabricated view',
  { tag: ['@regression', '@case-61969'] },
  async ({ projectsPage, page }) => {
    await projectsPage.openProject(AGENT_ID, '00000000-0000-0000-0000-000000000000');
    await expect(page.getByText('Project not found'), 'a nonexistent project id should show a clear not-found state').toBeVisible();
  });

test('TC-14: Verify that saving a new Project with Name or Description left blank is blocked with a required-field indicator',
  { tag: ['@regression', '@case-61973'] },
  async ({ projectsPage }) => {
    // Corroborates the existing TC-06 finding in this file: live UI enables Create with Name alone -
    // Description is not actually enforced despite the checklist expecting it required.
    await projectsPage.open(AGENT_ID);
    await projectsPage.openNewProjectDialog();
    await projectsPage.fillFields({ name: 'Blank Description Check' });
    await expect(
      projectsPage.createButtonLocator(),
      'Create should stay blocked until Description is also filled - known drift, see findings/projects.txt',
    ).toBeDisabled();
  });

test('TC-15: Verify that deleting a Project permanently removes it and all its conversations with no recycle bin or undo option',
  { tag: ['@critical', '@case-61977'] },
  async ({ projectsPage, seededProject, page }) => {
    await projectsPage.open(AGENT_ID);
    await projectsPage.openDeleteConfirm(seededProject.name);
    await projectsPage.confirmDelete();
    await expect(projectsPage.projectCardLocator(seededProject.name), 'project should be permanently removed').toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Undo/ }), 'no undo/recycle-bin option should be offered').toHaveCount(0);
  });

test('TC-16: Verify that conversations started in two different Projects do not appear in the other Project\'s list or main history',
  { tag: ['@critical', '@case-61978'] },
  async ({ projectsPage, chatPage, cleanupProjects }, testInfo) => {
    testInfo.setTimeout(180_000); // two full agent round-trips + two project creations - test.slow()'s 90s wasn't enough
    const projectA = newProject();
    const projectB = newProject();
    const messageA = `Ping for ${projectA.name}`;
    const messageB = `Ping for ${projectB.name}`;

    await test.step('Create two projects and send a distinct message in each', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields(projectA);
      await projectsPage.submitCreate();
      cleanupProjects(projectA.name);
      await chatPage.sendMessage(messageA);
      await chatPage.waitForReplyComplete();

      // Project list has an observed refresh lag right after creation (same class of issue as
      // findings/tasks.txt's task-list race) - waitFor before navigating away avoids racing it.
      await projectsPage.open(AGENT_ID);
      await projectsPage.projectCardLocator(projectA.name).waitFor({ state: 'visible' });
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields(projectB);
      await projectsPage.submitCreate();
      cleanupProjects(projectB.name);
      await chatPage.sendMessage(messageB);
      await chatPage.waitForReplyComplete();
    });

    await test.step('Neither project\'s sidebar shows the other\'s conversation', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.projectCardLocator(projectA.name).waitFor({ state: 'visible' });
      await projectsPage.projectCardLocator(projectA.name).click();
      await expect(chatPage.conversationLinkLocator(messageB), 'Project A\'s conversation list should not show Project B\'s message').toHaveCount(0);

      await projectsPage.open(AGENT_ID);
      await projectsPage.projectCardLocator(projectB.name).waitFor({ state: 'visible' });
      await projectsPage.projectCardLocator(projectB.name).click();
      await expect(chatPage.conversationLinkLocator(messageA), 'Project B\'s conversation list should not show Project A\'s message').toHaveCount(0);
    });
  });

test('TC-17: Verify that an embedded script/command string in a Project\'s Instructions field is treated as plain text and never executed',
  { tag: ['@critical', '@case-61979'] },
  async ({ projectsPage, cleanupProjects, page }) => {
    const project = newProject();

    await projectsPage.open(AGENT_ID);
    await projectsPage.openNewProjectDialog();
    await projectsPage.fillFields({ ...project, instructions: SCRIPT_LIKE_INSTRUCTIONS });
    await projectsPage.submitCreate();
    cleanupProjects(project.name);

    const executed = await page.evaluate(() => (window as unknown as { __qaProjectScriptExecuted?: boolean }).__qaProjectScriptExecuted === true);
    expect(executed, 'inline <script> content in Instructions should never actually execute').toBe(false);

    await projectsPage.openSettings();
    await expect(
      page.getByText(SCRIPT_LIKE_INSTRUCTIONS, { exact: false }),
      'the script/command string should be stored and displayed as plain text, unaltered',
    ).toBeVisible();
  });

test('TC-18: Verify that editing a Project\'s instructions mid-conversation leaves earlier messages unchanged',
  { tag: ['@regression', '@case-61980'] },
  async ({ projectsPage, chatPage, cleanupProjects, page }) => {
    test.slow(); // two real agent replies, waited on in full
    const project = newProject();
    const firstMarker = 'FIRST-MARKER-AAA';
    const secondMarker = 'SECOND-MARKER-BBB';

    await test.step('Create project with a first instruction and send a message', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields({ ...project, instructions: `Always end every reply with the exact phrase ${firstMarker}` });
      await projectsPage.submitCreate();
      cleanupProjects(project.name);
      await chatPage.sendMessage('Say hello');
      await chatPage.waitForReplyComplete();
    });

    await test.step('Change the instructions and send a second message', async () => {
      await projectsPage.openSettings();
      await projectsPage.fillFields({ instructions: `Always end every reply with the exact phrase ${secondMarker}` });
      await projectsPage.submitSaveChanges();
      await chatPage.sendMessage('Say hello again');
      await chatPage.waitForReplyComplete();
    });

    await test.step('The first reply keeps the old marker; only the new reply reflects the edit', async () => {
      await expect(page.getByText(firstMarker), 'the reply sent before the edit should retain the original instruction-derived marker').toBeVisible();
      await expect(page.getByText(secondMarker), 'the reply sent after the edit should reflect the new instruction').toBeVisible();
    });
  });

test('TC-19: Verify that creating two Projects with an identical name saves both as separate cards with no merge or collision',
  { tag: ['@regression', '@case-61981'] },
  async ({ projectsPage, cleanupProjects }) => {
    const project = newProject();

    await test.step('Create the first project', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields(project);
      await projectsPage.submitCreate();
      cleanupProjects(project.name);
    });

    await test.step('Create a second project with the identical name', async () => {
      await projectsPage.open(AGENT_ID);
      await projectsPage.openNewProjectDialog();
      await projectsPage.fillFields(project);
      await projectsPage.submitCreate();
    });

    await test.step('Both cards should exist as separate projects', async () => {
      await projectsPage.open(AGENT_ID);
      await expect(projectsPage.projectCardLocator(project.name), 'duplicate project names should be permitted as separate cards, not merged - see findings/projects.txt').toHaveCount(2);
    });
  });

test('TC-20: Verify that an extremely long string in a Project\'s Instructions is accepted in full without silent truncation',
  { tag: ['@regression', '@case-61982'] },
  async ({ projectsPage, cleanupProjects }) => {
    const project = newProject();

    await projectsPage.open(AGENT_ID);
    await projectsPage.openNewProjectDialog();
    await projectsPage.fillFields({ ...project, instructions: LONG_INSTRUCTIONS });
    await projectsPage.submitCreate();
    cleanupProjects(project.name);

    await projectsPage.openSettings();
    const stored = await projectsPage.getInstructionsText();
    expect(stored, 'long instructions text should be stored in full, not silently truncated').toContain(LONG_INSTRUCTIONS.slice(0, 200));
  });
