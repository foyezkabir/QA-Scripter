# Admin app - what is NOT covered yet (Dev, as of 2026-10-08)

Every admin page has a baseline, a plan and specs (login, agents, dashboard, usage, AI platform, users, audit log, feedback). The items below were skipped on purpose or could not be reached. Pick them up when the blocker is gone.

## Needs approval before it is safe (changes shared data)

| Area | Not covered | Blocker / what is needed |
|---|---|---|
| Users | Promote to admin, Demote to user, Reinstate | fire immediately with no confirmation; needs a disposable account the owner approves |
| Users | Add $20.00 (Top up), Suspend account, Refresh LiteLLM limits, Chat tool view change | change a shared account or key; same disposable account |
| Agents | Deploy, Reprovision, Download bundle | not approved; Reprovision restarts a container |
| Agents | Delete | **forbidden on every agent - never automate** |
| AI Platform | Refresh (credit, activity), Save thresholds, Cleanup Orphaned, Delete key | re-query OpenRouter / change shared alert settings / delete keys; confirmation behaviour unverified |
| AI Platform | Open Dashboard | links to http://localhost:4001 (already a finding) |
| Dashboard | Top up and Dismiss on the low-credit banner | Top up leaves for openrouter.ai; Dismiss changes banner state |

Already approved and covered: Stop, Start and the storage quota save and reset on the user's own agent **asta** (`admin-agents-state.spec.ts`, restore guard in `fixtures/guards.ts`).

## States that could not be reached

- Feedback populated state and any filters: Dev holds no ratings, so the response shape is unknown. Seed ratings through the user app first.
- Dashboard "Things to look at" items (Turn back on, Review, Open agents) and the empty Happy replies message: driven by live data.
- Agents: list error state, Start on a draft agent (no create-agent entry exists), "No container found for this agent." in the logs dialog.
- Credit pill states (Healthy / Low - reminder) and the low-credit banner: driven by live OpenRouter credit.
- Audit Log: last page and exact-multiple totals (live total is not controllable).

## Login gaps

- A valid allowlisted email with a wrong token (only a made-up email is tested).
- A non-allowlisted real email.

## Open findings worth re-checking

See `findings/admin.txt`: no confirmation on Promote/Demote/Reinstate, localhost link, 32-character string in the key table, infinite audit skeleton, dashboard search box does nothing, usage timeline has no chart, unlabeled "?" on tracker rows, feedback Try again leaves the negative-list notice.

## Other

- Pilot and Prod admin are untouched (`PILOT_ADMIN_URL`, `PROD_ADMIN_URL` in `.env`); the suite is wired to Dev through `DEV_ADMIN_*`.
- The account "test mail" (testrttfhfrs@jhjhsfd.com) was reinstated by an early crawl mistake and still needs a human re-suspend.
- `.claude/hooks/qa-crawl.mjs` still has the Windows path bug (lines ~276 and ~282, same fix as `qa-coverage.mjs`); not patched without approval.
- Running only a `-state.spec.ts` file pulls in the whole read-only project first (project dependency), so it takes several minutes.
