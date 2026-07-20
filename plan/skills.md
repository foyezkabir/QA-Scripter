# Test Plan - Skills module (VelaOps / VOPS)

Source: live exploration of `https://dev.app.velaops.ai/chat/<agentId>/skills` (Rex Dev agent),
`raw/velaops/velaops-application-guide.md` section 12 (Skills). No Jira ticket cited -
traceability matrix skipped per project convention.

Note (project-critical context): Skills is one of Luca Licata's three named shutdown-threat
categories alongside Tasks and Chat. Weight coverage accordingly.

## View: Skills - Browse tab (`/chat/:agentId/skills`)

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Populated | Page loads, source filters (All/VelaOps/Anthropic/GitHub with live counts), search box, skill cards each showing name + "Installed on this agent" badge OR an "Install <name>" button | TC-01 | @smoke |
| Populated | Click "View details for <skill>" -> detail dialog: title, source/version/author/license, "When to use"/"How to use" (rendered SKILL.md body), "FILES IN THIS SKILL" panel (file list + sizes), install path note, Remove (if installed) or Install button | TC-02 | @regression |
| Not-installed skill | Click "Install <name>" -> toast "Skill installed / Available on next chat turn.", card badge flips to "Installed on this agent", "Installed (N)" count increments | TC-03 | @smoke @critical |
| Installed skill (via detail dialog) | Click "Remove" -> toast "Skill removed", card badge flips back to Install button, count decrements | TC-04 | @critical |
| List | "Installed (N)" tab switches to a flat list of only-installed skills, each row = name + install date + "· tap to view" + a direct "Uninstall" button (no separate View-details button in this tab - the whole row is clickable) | TC-05 | @regression |
| Installed tab, direct Uninstall | Click "Uninstall" on a row -> removes immediately, **no confirmation dialog** (unlike Tasks/Projects delete flows) - flag as a deliberate UX difference, not a bug | TC-06 | @critical |
| List | Search box filters skill cards by name | TC-07 | @regression |
| List | Source filter buttons (All (58) / VelaOps (4) / Anthropic (17) / GitHub (37)) narrow the grid | TC-08 | @regression |

## View: Create Skill dialog

| State | Action / Element | Intended TC | Tag |
|---|---|---|---|
| Click "Create skill" | Dialog opens: Skill Name*, Category* (defaults to "custom"), When to use it*, Instructions for the agent* | TC-09 | @regression |
| Valid submit | Skill appears in Installed list as "<name> CUSTOM Installed <date>" | TC-10 | @smoke @critical |
| Custom-created skill row (Installed tab) | Row button itself renders **disabled** (no "· tap to view" suffix, clicking does nothing) unlike every catalog-sourced installed skill - confirmed live, not investigated further; likely by-design (no SKILL.md file browser for inline-authored skills) rather than a bug, but flagged since it's an inconsistency a user could reasonably expect to work the same as other rows. Uninstall button on the same row works normally. | TC-10 (same TC, observed as part of it) | @regression |

## Known gaps - NOT covered this pass (documented, not silent)

- **Actually exercising an installed skill in chat** ("Available on next chat turn" claim) - would
  require a full chat round-trip with a prompt that reliably triggers the skill; overlaps Chat
  module scope, deferred.
- **Uploading a custom skill folder** (doc section 12 mentions "+ Create skill... upload your own
  SKILL.md-formatted folder") - the live Create Skill dialog only offers a structured form (Name/
  Category/When-to-use/Instructions), no folder-upload control was found. This may be a
  documentation/implementation drift (app-guide describes an upload flow that doesn't exist, or it
  exists elsewhere) - flagged, not confirmed as a bug without more investigation.
- **Anthropic/Community pin-by-commit-SHA behavior** - confirmed the GitHub-sourced "Napkin" skill
  links to a specific commit (`github/awesome-copilot@fb80ec4`), matching the doc's claim, but did
  not verify version-pinning survives a source repo update (out of scope, needs the upstream repo
  to actually change).

## Completeness critic

- Every state/transition captured live has an intended TC. Zero-missing at time of writing for the
  surfaces actually exercised.
- Gaps above are explicit, not silently dropped.
- No AC list exists (no Jira ticket) - traceability matrix not applicable this pass.
