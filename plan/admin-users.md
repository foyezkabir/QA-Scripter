# Admin Users - test plan (DEV https://admin.dev.app.velaops.ai/admin/users)

Depth: **standard read-only**. Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/admin-users.baseline.json`.

Spec file: `admin-users.spec.ts`. Tests request the `adminSession` fixture, except the logged-out redirect.

Read-only. Row menus and dialogs are only OPENED and then closed or cancelled. **Promote to admin, Demote to user and Reinstate fire immediately with no confirmation, so they are never clicked.** Add $20.00 and Suspend account are never clicked either, and the Chat tool view select is never changed. Row-specific tests use the user's own account **Naiemul Hasan Naiem** (nhnaiem@tulip-tech.com), found by search. The signed-in admin's own row is used only to check that Demote to user and Suspend are disabled. Live numbers (user counts, agents, keys, credit) are never asserted - only labels. Plain-text messages have no ARIA role.

## Users list - /admin/users

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Users | populated | page shows heading "Users", the text "Promote, demote, suspend and inspect every account.", stat cards Total users, Active, Unverified and Suspended with their sparkline images "Signups per day over the last 7 days", "Accounts active today, by the day they signed up, over the last 7 days", "Accounts still unverified, by the day they signed up, over the last 7 days" and "Accounts suspended per day over the last 1 day the audit feed reached", heading "All users", the search box "Search users by name, email or role" and the All, Active, Unverified, Suspended filters | TC-01 | @smoke |
| Users | populated | text "Live · N users · re-reads on focus" and the note "activity covers the last 1 day, not 7 - the audit feed caps at 500 events" are shown | TC-02 | @regression |
| Users | populated | table All users has columns User, Role, Status, Agents, LiteLLM Key, Created, Actions | TC-03 | @regression |
| Users | populated | searching by an email narrows the table to that user and puts ?q= in the URL | TC-04 | @critical |
| Users | empty | a nonsense search shows "No users match these filters" | TC-05 | @regression |
| Users | empty | Clear filters in the empty state empties the search and brings the users back | TC-06 | @regression |
| Users | populated | All filter is pressed by default | TC-07 | @regression |
| Users | populated | Active filter becomes pressed and sets ?status=active | TC-08 | @regression |
| Users | populated | Unverified filter becomes pressed and sets ?status=unverified | TC-09 | @regression |
| Users | populated | Suspended filter becomes pressed and sets ?status=suspended | TC-10 | @regression |
| Users | role-gated:unauthenticated | opening /admin/users logged out redirects to /admin/login | TC-11 | @critical |
| Users | role-gated:authenticated | the saved admin session opens /admin/users signed in | TC-12 | @critical |

## Row menu and dialogs

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Actions for <user name> menu | populated | the menu of an active admin user lists View details, Demote to user, Refresh LiteLLM limits, Top up credit and Suspend | TC-13 | @regression |
| Actions for <user name> menu | disabled | on the signed-in admin's own row Demote to user and Suspend are disabled | TC-14 | @critical |
| User detail dialog | populated | View details shows the user's name and email and the fields Status, Role, Agents owned, Two-factor, LiteLLM key, Created and Chat tool view | TC-15 | @regression |
| User detail dialog | populated | the Chat tool view select offers Inherit default (detailed), Compact, Detailed and Off | TC-16 | @regression |
| User detail dialog | terminal | Close closes the user detail dialog | TC-17 | @regression |
| Top up credit dialog | populated | Top up credit shows Amount (USD) defaulting to 20, a Note (optional) box, and the buttons Close, Cancel and Add $20.00 | TC-18 | @regression |
| Top up credit dialog | terminal | Cancel closes the Top up credit dialog without adding credit | TC-19 | @regression |
| Suspend dialog | populated | Suspend shows the heading "Suspend this account?", the warning that they are signed out immediately, the field "Reason (stored on the account)" defaulting to "Violation of terms of service", an empty Expires (optional), and the buttons Close, Cancel and Suspend account | TC-20 | @regression |
| Suspend dialog | terminal | Cancel closes the Suspend dialog without suspending the account | TC-21 | @regression |

## Out of scope (recorded, not tested)

- **Promote to admin**, **Demote to user** and **Reinstate** change roles or status with no confirmation. Promote shows only for a non-admin and Reinstate only for a suspended user. Never clicked on shared Dev.
- **Refresh LiteLLM limits** has an unverified effect on a shared key and is not clicked.
- **Add $20.00** and **Suspend account** change a shared account and are not clicked. The **Chat tool view** value is never changed.
- The OpenRouter low-credit banner (**Top up**, **Dismiss**) shows only while credit is under the reminder line; Top up leaves for openrouter.ai.
- Empty, loading and error variants of the list beyond the search empty state need backend conditions that shared Dev does not let us hold.
- The findings in the baseline (no confirmation on Promote, Demote and Reinstate) are logged in `findings/admin.txt`, not asserted.
