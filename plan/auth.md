# Auth - test plan (DEV https://dev.app.velaops.ai)

Depth: **deep** (auth is @critical). Source: live UI only, no Jira/Figma/Gherkin. Baseline: `baselines/auth.baseline.json`.

Spec files: `auth-signin.spec.ts` · `auth-signup.spec.ts` · `auth-recovery.spec.ts` · `auth-legal.spec.ts`. All run logged out via file-scope `test.use({ storageState: { cookies: [], origins: [] } })`.

Accounts: sign-in and sign-out specs use **DEV user 2** (`DEV_USER2_*`), never the user 1 account that `global-setup` signs in for the suite session, so a Sign Out here cannot invalidate it. A wrong-credential test uses a fake email, never a real account (no lockout risk).

Server-side states of signup and forgot-password are reached by **network mock** (`page.route`, owned by the page object, non-GET to the mocked endpoint only): `POST /api/auth/sign-up/email`, `POST /api/auth/request-password-reset`. No real account is created and no email is sent. Native browser messages are asserted through the field's `validationMessage`, not a role locator. Banners have no ARIA role - located with `getByText`.

## Sign in - /auth/signin

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Sign in | populated | page shows heading "Welcome back", Work email, Password, Remember me, Sign in, Forgot password?, Create an account, VelaCrew home, Terms of Service, Privacy Policy | TC-01 | @smoke |
| Sign in | empty | Sign in disabled with both fields empty; blur on empty fields shows no inline error | TC-02 | @regression |
| Sign in | disabled/invalid | Sign in disabled with only Work email filled | TC-03 | @regression |
| Sign in | disabled/invalid | Sign in disabled with only Password filled | TC-04 | @regression |
| Sign in | populated | Sign in enabled once Work email and Password are filled | TC-05 | @regression |
| Sign in | terminal | valid credentials (DEV user 2) land on /dashboard with callbackUrl honoured | TC-06 | @smoke @critical |
| Sign in | error | wrong credentials show banner "Invalid email or password" and stay on /auth/signin | TC-07 | @critical |
| Sign in | disabled/invalid | malformed Work email blocked by native validation message, no navigation | TC-08 | @regression |
| Sign in | loading | during the request Sign in, Google and Microsoft are disabled (delayed mocked response) | TC-09 | @regression |
| Sign in | populated | Show password button reveals the Password (type text, name Hide password) and hides it again | TC-10 | @regression |
| Sign in | terminal | pressing Enter in Password submits and reaches /dashboard | TC-11 | @regression |
| Sign in | populated | Remember me is checked by default | TC-12 | @regression |
| Sign in | terminal | Remember me checked: session_token cookie is persistent | TC-13 | @regression |
| Sign in | terminal | Remember me unchecked: session cookies only and dont_remember cookie set | TC-14 | @regression |
| Sign in | populated | Forgot password? link opens /auth/forgot-password | TC-15 | @regression |
| Sign in | populated | Create an account link opens /auth/signup | TC-16 | @regression |
| Sign in | populated | VelaCrew home link and logo target / | TC-17 | @regression |
| Sign in | populated | Terms of Service footer link opens /terms | TC-18 | @regression |
| Sign in | populated | Privacy Policy footer link opens /privacy | TC-19 | @regression |
| Sign in | populated | Google and Microsoft buttons are visible and enabled (NOT clicked - outward-facing OAuth, destination unverified) | TC-20 | @regression |
| Signed-in session | role-gated:authenticated-user | Account menu lists Profile, Help, Share Feedback, Privacy Policy, Terms of Service, Sign Out (DEV user 2) | TC-21 | @regression |
| Signed-in session | terminal | Sign Out returns to /auth/signin and /dashboard then redirects to /auth/signin?callbackUrl=%2Fdashboard | TC-22 | @critical |
| Sign in | role-gated:unauthenticated | opening /dashboard logged out redirects to /auth/signin?callbackUrl=%2Fdashboard | TC-23 | @critical |
| Sign in | error | rate-limited sign-in (mocked 429) shows "Too many requests. Please try again later." | TC-59 | @regression |
| Sign in | error | unverified account shows "Email not verified" and stays on sign-in (real API-seeded account) | TC-63 | @email @critical |
| Sign in | terminal | the new password signs the user in after a reset | TC-70 | @email @critical |
| Sign in | error | the old password is rejected after a reset with "Invalid email or password" | TC-71 | @email @critical |
| Sign in | populated | after a reset the page shows the banner "Password updated. Sign in with your new password." at /auth/signin?reset=1 | TC-69 | @email @critical |

## Sign up - /auth/signup

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Sign up | populated | page shows heading "Create your account", Full name, Work email, Password with hint "min. 10 characters", Remember me, Create account, Sign in link | TC-24 | @smoke |
| Sign up | empty | Create account disabled with all fields empty; blur shows no error | TC-25 | @regression |
| Sign up | disabled/invalid | Create account disabled until Full name, Work email and Password are all filled | TC-26 | @regression |
| Sign up | populated | Create account enabled once all three fields are filled | TC-27 | @regression |
| Sign up | error | blank Full name shows "Please enter your full name." | TC-28 | @regression |
| Sign up | error | invalid Work email shows "Please enter a valid work email address." | TC-29 | @regression |
| Sign up | error | Password shorter than 10 characters shows "Password must be at least 10 characters." | TC-30 | @regression |
| Sign up | populated | Show password / Hide password icon button toggles the Password visibility | TC-31 | @regression |
| Sign up | loading | delayed mocked response disables Create account, Google and Microsoft | TC-32 | @regression |
| Sign up | terminal | mocked success navigates to /auth/verify-email with the email in the query | TC-33 | @smoke @critical |
| Sign up | error | mocked 500 shows banner "Internal server error" | TC-35 | @regression |
| Sign up | error | network failure shows banner "Failed to fetch" | TC-36 | @regression |
| Sign up | populated | Remember me is checked by default | TC-37 | @regression |
| Sign up | populated | Sign in link opens /auth/signin | TC-38 | @regression |
| Sign up | populated | Google and Microsoft buttons visible and enabled (NOT clicked) | TC-39 | @regression |
| Sign up | populated | VelaCrew home, Terms of Service and Privacy Policy links target /, /terms and /privacy | TC-40 | @regression |
| Verify email | populated | page shows heading "Check your email", the message with the email, try again and Sign in instead links | TC-41 | @critical |
| Verify email | populated | try again and Sign in instead links are shown; Sign in instead opens /auth/signin | TC-42 | @regression |
| Verify email | populated | VelaCrew home, Terms of Service and Privacy Policy links target /, /terms and /privacy | TC-43 | @regression |

## Forgot password - /auth/forgot-password

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Forgot password | populated | page shows the heading "Forgot your password? Enter your email and we'll send you a reset link.", Enter email field, Send reset link, Back to sign-in | TC-44 | @smoke |
| Forgot password | empty | Send reset link disabled with an empty email | TC-45 | @regression |
| Forgot password | populated | Send reset link enabled once any text is typed | TC-46 | @regression |
| Forgot password | disabled/invalid | malformed email blocked by native validation message, no request sent | TC-47 | @regression |
| Forgot password | loading | delayed mocked response disables Send reset link | TC-48 | @regression |
| Forgot password | terminal | mocked success swaps the form for heading "Check your email" and "If an account exists for <email>, we've sent password reset instructions." | TC-49 | @critical |
| Forgot password | error | mocked 429 shows banner "Too many requests. Please try again later." | TC-50 | @regression |
| Forgot password | error | mocked 500 shows banner "Internal server error" | TC-51 | @regression |
| Forgot password | error | network failure shows banner "Failed to fetch" | TC-52 | @regression |
| Forgot password | role-gated:unauthenticated | form renders with no session and no redirect | TC-53 | @regression |
| Forgot password | populated | Back to sign-in opens /auth/signin; VelaCrew home, Terms of Service, Privacy Policy target /, /terms, /privacy | TC-54 | @regression |

## Legal - /terms, /privacy

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Terms of Service | populated | page shows h1 "Terms of Service", the IN REVIEW badge, Go back and Go to dashboard | TC-55 | @regression |
| Terms of Service | terminal | static placeholder page, no legal text (terminal) | TC-55 | @regression |
| Terms of Service | populated | Go back returns to the previous page | TC-56 | @regression |
| Privacy Policy | populated | page shows h1 "Privacy Policy", the IN REVIEW badge, Go back and Go to dashboard | TC-57 | @regression |
| Privacy Policy | terminal | static placeholder page, no policy text (terminal) | TC-57 | @regression |
| Privacy Policy | populated | Go back returns to the previous page | TC-58 | @regression |

## Real email flows - /auth/signup, /auth/verify-email, verification link, /auth/forgot-password, /auth/reset-password

Tagged `@email`: they use a disposable mail.tm inbox per test, seed preconditions through the API, and leave a permanent throwaway account on Dev (no delete). They are excluded from the default run; run them with `EMAIL_TESTS=1`.

| View | State | Action / rule | TC | Tag |
|---|---|---|---|---|
| Verify email | populated | a real sign-up opens the verify email page for the entered email and the "Verify your VelaCrew email" message arrives from VelaCrew | TC-60 | @email @critical |
| Email verification link | terminal | the emailed link verifies the account, signs the user in and lands on the dashboard | TC-61 | @email @critical |
| Email verification link | error | a used link redirects to /auth/signin?callbackUrl=%2Fdashboard with no session and no message | TC-62 | @email @regression |
| Sign up | terminal | signing up with an existing email shows the verify email page and the owner gets the "You already have a VelaCrew account" email (no error banner) | TC-64 | @email @regression |
| Forgot password | terminal | a real reset request shows "Check your email" and the "Reset your VelaCrew password" email arrives | TC-65 | @email @critical |
| Reset password | empty | the emailed reset link opens the page with the heading "Choose a new password for your VelaCrew account.", the fields "New password (min. 10 characters)" and "Confirm password" empty, and Reset password disabled | TC-66 | @email @regression |
| Reset password | error | mismatched passwords show "Passwords don't match" | TC-67 | @email @regression |
| Reset password | disabled/invalid | Reset password stays disabled while a password is under 10 characters | TC-68 | @email @regression |
| Reset password | populated | both passwords of at least 10 characters enable Reset password (exercised by TC-69, TC-72, TC-73, TC-74) | TC-69 | @email @critical |
| Reset password | terminal | a valid reset redirects to /auth/signin?reset=1 | TC-69 | @email @critical |
| Reset password | error | a used reset link opens a blank form; submitting shows "Missing reset token - open the email link again." | TC-72 | @email @regression |
| Reset password | error | a fake token shows "Invalid token" after submit | TC-73 | @regression |
| Reset password | error | opening the page with no token and submitting shows "Missing reset token - open the email link again." | TC-74 | @regression |
| Reset password | populated | Show password reveals both fields and Hide password masks them again | TC-75 | @regression |
| Reset password | populated | Back to sign-in opens /auth/signin and the footer links target /, /terms and /privacy | TC-76 | @regression |
| Reset password | loading | the submit button is disabled while the request is in flight | TC-77 | @regression |

## Out of scope / not tested (recorded, not gaps)

- Google and Microsoft OAuth flows: external redirect, outward-facing, destination unverified. Only presence and enabled state are tested (TC-20, TC-39).
- Real account registration and real reset email: would create data / send mail with no verified teardown or inbox access. Covered by network mock only (TC-33, TC-49). Real duplicate-email wording unconfirmed.
- Go to dashboard link on /terms and /privacy: depends on the sign-in redirect already covered by TC-23.
- Account menu items Profile, Help, Share Feedback, Privacy Policy, Terms of Service destinations and the dashboard contents (Home, My work, Enable 2FA, Dismiss, Search, Notifications, Settings, Create): belong to the Dashboard and Settings module crawls.
- Sign in `role-gated:authenticated` state (no guest-only redirect for a signed-in user on /auth/signin, /auth/signup, /auth/forgot-password): logged in findings/auth.txt; no test asserts the current (probably defective) behaviour.
- Server-side password policy and the unconfirmed 409 wording: not reachable without a real submit.
- Notifications alt+T region (an empty toast container with aria-live polite, present on every route): no toast ever appears on any auth flow, so there is nothing to assert; the empty route announcer alert is likewise not an error locator.
- Native browser validation messages "Please include an '@' in the email address. 'not-an-email' is missing an '@'.", "Please include an '@' in the email address. 'notanemail' is missing an '@'." and "Please enter a part following '@'. 'a@' is incomplete.": browser-owned text that differs per browser, so TC-08 and TC-47 assert the field's validity (`typeMismatch`) instead of the wording.
- The signed-in dashboard heading "Welcome back, Naiemul" is account-specific; TC-06 asserts the pattern "Welcome back, " not the name.
- Retired test number 34 (a mocked "User already exists. Use another email." banner): the real backend never shows it, so the number is deliberately left unused; a duplicate email is covered by TC-64.
- Reset password and verify-email expiry (links expire after 1 hour): not testable without waiting; the sign-in rate limit also stays covered by mock only (TC-59).
- Earlier unused reset links staying valid after a later link is used: logged in findings/auth.txt, no test asserts the current behaviour.
- The heading "Welcome back, QA" reached through the verification link is account-specific (the throwaway account's first name); TC-61 asserts the pattern "Welcome back, " through the dashboard heading locator, not the name.
