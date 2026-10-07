# Admin Login - test plan (DEV https://admin.dev.app.velaops.ai)

Depth: **deep** (admin access is @critical). Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/admin-login.baseline.json`.

Spec file: `admin-login.spec.ts`. Runs logged out via file-scope `test.use({ storageState: { cookies: [], origins: [] } })`.

Read-only: sign-in and sign-out create no data. The wrong-token test uses a made-up email, never a real admin. The loading state is reached by holding `POST /api/admin-auth/verify` open (non-GET only, owned by the page object). The error banner has no ARIA role - located with `getByText`.

Session note: the admin session is the `velaops-admin` cookie plus sessionStorage keys `velaops-admin-email` / `velaops-admin-token`, so plain `storageState` cannot carry it. Later admin modules inject cookie + sessionStorage; this module signs in through the UI because sign-in is the subject.

## Admin sign-in - /admin/login

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Admin sign-in | populated | page shows heading "Admin sign-in", Admin email, Admin token and Sign in | TC-01 | @smoke |
| Admin sign-in | empty | Sign in disabled with both fields empty | TC-02 | @regression |
| Admin sign-in | disabled/invalid | Sign in disabled with only Admin email filled | TC-03 | @regression |
| Admin sign-in | disabled/invalid | Sign in disabled with only Admin token filled | TC-04 | @regression |
| Admin sign-in | populated | Sign in enabled once both fields are filled, even with a malformed email | TC-05 | @regression |
| Admin sign-in | terminal | allowlisted email + valid token lands on /admin | TC-06 | @smoke @critical |
| Admin sign-in | error | wrong token shows "Invalid admin token." and stays on /admin/login | TC-07 | @critical |
| Admin sign-in | loading | during the request both fields are disabled and the button reads "Signing in…" | TC-08 | @regression |
| Admin sign-in | role-gated:unauthenticated | opening /admin/users logged out redirects to /admin/login without the query | TC-09 | @critical |
| Admin account menu | role-gated:authenticated | Admin account menu lists the signed-in email (disabled), Appearance and Sign out | TC-10 | @regression |
| Admin account menu | terminal | Sign out returns to /admin/login and /admin then redirects back to /admin/login | TC-11 | @critical |
| Admin session | role-gated:authenticated | the saved cookie + sessionStorage session (adminSession fixture) opens /admin signed in, with no sign-in form | TC-12 | @critical |

## Out of scope (recorded, not tested)

- Findings in the baseline (token kept in sessionStorage, signed-in visit to /admin/login not redirected, Sign in enabling on a malformed email) are logged in `findings/admin.txt`, not asserted.
- Appearance toggle behaviour belongs to the admin dashboard module.
