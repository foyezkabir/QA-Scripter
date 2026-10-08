# Admin Usage - test plan (DEV https://admin.dev.app.velaops.ai/admin/usage)

Depth: **light read-only** (the page is a report with no controls). Source: live UI only. Baseline: `baselines/admin-usage.baseline.json`.

Spec file: `admin-usage.spec.ts`. Tests request the `adminSession` fixture, except the logged-out redirect.

Read-only. All counts, percentages and tracker rows are live data and are never asserted - only labels and the shape of each section. Plain-text labels have no ARIA role.

## Usage - /admin/usage

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Usage | populated | page shows heading "Usage", the text "Provisioning volume and integration adoption." and the sections Integration Adoption, Tracker Imports and Agent Creation Timeline (Last 7 Days) | TC-01 | @smoke |
| Usage | populated | stat cards Total Agents Provisioned, Active Agents and Total Integrations Enabled are shown | TC-02 | @regression |
| Usage | populated | Integration Adoption lists the integrations teams, telegram, slack, github and atlassian, each with a percentage | TC-03 | @regression |
| Usage | populated | Tracker Imports lists projects with their tracker (huly or jira) and last import | TC-04 | @regression |
| Usage | populated | Agent Creation Timeline (Last 7 Days) shows the note "This metric is calculated from audit logs. Check the Audit Log tab for detailed provisioning history." | TC-05 | @regression |
| Usage | role-gated:unauthenticated | opening /admin/usage logged out redirects to /admin/login | TC-06 | @critical |
| Usage | role-gated:authenticated | the saved admin session opens /admin/usage signed in | TC-07 | @critical |

## Out of scope (recorded, not tested)

- Empty, loading and error variants need data or backend conditions that shared Dev does not let us hold.
- The credit banner and sidebar are shared across admin pages and covered in `admin-dashboard`.
- The two findings in the baseline (no timeline chart, a bare "?" beside each tracker row) go to `findings/admin.txt`, not assertions.
