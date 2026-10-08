# Admin Feedback - test plan (DEV https://admin.dev.app.velaops.ai/admin/feedback)

Depth: **light read-only** (no ratings exist on Dev). Source: live UI only. Baseline: `baselines/admin-feedback.baseline.json`.

Spec file: `admin-feedback.spec.ts`. Tests request the `adminSession` fixture, except the logged-out redirect.

Read-only. The empty, loading and error states are reached by **mocking the GET `/api/admin/feedback-stats` and `/api/admin/feedback-negative` reads** (owned by the page object through `ApiMockHelper`): an empty list, requests held open, and failing requests. Nothing is ever written. Plain-text messages have no ARIA role. The populated state is not covered because Dev holds no ratings and none are seeded.

## Feedback - /admin/feedback

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Feedback | populated | page shows heading "Feedback", the text "Reply ratings and the messages people flagged.", the sections Response Quality and Recent Negative Feedback and a Refresh button | TC-01 | @smoke |
| Feedback | empty | with no ratings Response Quality shows "No feedback data yet" and "Ratings appear here once people start liking or disliking agent replies in chat." and Recent Negative Feedback shows "No negative feedback yet." | TC-02 | @regression |
| Feedback | loading | while the requests are open Refresh is disabled | TC-03 | @regression |
| Feedback | error | a failed request shows "Could not load this", the error message and a Try again button in Response Quality, and "This list could not be loaded. The counts above are unaffected." under Recent Negative Feedback | TC-04 | @critical |
| Feedback | error | Try again after a failed request clears the Response Quality error | TC-05 | @regression |
| Feedback | populated | Refresh re-reads the ratings and is enabled again afterwards | TC-06 | @regression |
| Feedback | role-gated:unauthenticated | opening /admin/feedback logged out redirects to /admin/login | TC-07 | @critical |
| Feedback | role-gated:authenticated | the saved admin session opens /admin/feedback signed in | TC-08 | @critical |

## Out of scope (recorded, not tested)

- Try again re-reads only Response Quality; the notice under Recent Negative Feedback stays after it (logged as a finding, not asserted).
- The populated state (rating counts, flagged messages) needs people to rate agent replies in chat; Dev holds no ratings and none are seeded, so the response shape is unobserved.
- The OpenRouter low-credit banner (**Top up**, **Dismiss**) shows only while credit is under the reminder line; Top up leaves for openrouter.ai.
- The finding in the baseline (error banners carry no ARIA role) is already covered in `findings/admin.txt`, not asserted.
