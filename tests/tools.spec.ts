import { test, expect } from '../fixtures/base';
import { AGENT_ID, NOT_CONNECTED_TOOL } from '../datas/tools/ToolsData';

// TestRail Suite 201, section "19 - Tools / Productivity Integrations", case 62167. The only
// case built from this section - every other case needs a real connected Gmail/Jira/external
// OAuth sandbox account this repo has no credentials for (out of scope, not fabricated).

test('TC-01: Verify that aborting a third-party OAuth sign-in popup mid-flow cleanly returns the tool tile to Unconnected',
  { tag: ['@critical', '@case-62167'] },
  async ({ toolsPage, page }) => {
    await toolsPage.open(AGENT_ID);
    await expect(toolsPage.connectButtonLocator(NOT_CONNECTED_TOOL), 'precondition: tool should start Not Connected').toBeVisible();

    await toolsPage.connectAndAbortPopup(NOT_CONNECTED_TOOL);

    await expect(
      toolsPage.connectButtonLocator(NOT_CONNECTED_TOOL),
      'tile should cleanly return to a plain Connect (Unconnected) state, not a Try again/error state - see findings/tools.txt',
    ).toBeVisible();
    await expect(
      toolsPage.tryAgainButtonLocator(NOT_CONNECTED_TOOL),
      'no lingering error/partial state should require a Try again action after a clean abort',
    ).toHaveCount(0);
    await expect(page.getByText(/left unfinished|expired/i), 'no error banner about an unfinished or expired attempt should appear').toHaveCount(0);
  });
