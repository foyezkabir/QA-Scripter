# Admin AI Platform - test plan (DEV https://admin.dev.app.velaops.ai/admin/ai-platform)

Depth: **standard read-only**. Source: live UI only. Baseline: `baselines/admin-ai-platform.baseline.json`.

Spec file: `admin-ai-platform.spec.ts`. Tests request the `adminSession` fixture, except the logged-out redirect.

Read-only. This page can re-query OpenRouter, change alert thresholds and delete keys, so nothing here is clicked except to reveal state. The threshold fields are only typed into, never saved; a reload discards the value. Credit, spend, request, token and key numbers are live and never asserted - only labels and shape.

## AI Platform - /admin/ai-platform

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| AI Platform | populated | page shows heading "AI Platform", the text "LiteLLM keys, models and OpenRouter credit." and the sections OpenRouter Credit, Model Configuration, Virtual API Keys, Today's Activity and LiteLLM Dashboard | TC-01 | @smoke |
| AI Platform | populated | stat labels Models, API Keys, Today’s Spend and Today’s Requests are shown | TC-02 | @regression |
| OpenRouter Credit | populated | the section shows Remaining, the fields Reminder at (USD) and Warning at (USD), the buttons Refresh and Save thresholds, and a "Last checked" time | TC-03 | @regression |
| OpenRouter Credit | populated | the Reminder at (USD) and Warning at (USD) fields accept a typed value without saving it | TC-04 | @regression |
| Model Configuration | populated | the nine models agent-primary, agent-coder, agent-fast, agent-vision, agent-image, agent-free-primary, agent-free-fast, whisper-1 and gpt-4o-transcribe are listed | TC-05 | @regression |
| Virtual API Keys | populated | the key table has columns Key, User, Spend, Budget, Status and Actions, and the Cleanup Orphaned button is shown | TC-06 | @regression |
| Virtual API Keys | populated | rows offer a "Delete key <masked key>" button (only shown, never clicked) | TC-07 | @regression |
| Today's Activity | populated | Today's Activity shows Prompt Tokens, Completion Tokens, Successful and Failed with a Refresh button | TC-08 | @regression |
| LiteLLM Dashboard | populated | the section shows "Full dashboard with detailed analytics, logs, and configuration" and the Open Dashboard link | TC-09 | @regression |
| AI Platform | role-gated:unauthenticated | opening /admin/ai-platform logged out redirects to /admin/login | TC-10 | @critical |
| AI Platform | role-gated:authenticated | the saved admin session opens /admin/ai-platform signed in | TC-11 | @critical |

## Out of scope (recorded, not tested)

- **Refresh** (credit and activity) re-queries OpenRouter and LiteLLM, **Save thresholds** changes shared alert settings, **Cleanup Orphaned** and **Delete key** delete keys. None of them is clicked on shared Dev; their confirmation behaviour stays unverified.
- **Open Dashboard** points at http://localhost:4001 and is not clicked; recorded as a finding.
- The credit pill states (Healthy, Low - reminder) depend on live credit and cannot be held.
- Empty, loading and error variants need data or backend conditions that shared Dev does not let us hold.
- The credit banner and sidebar are shared across admin pages and covered in `admin-dashboard`.
