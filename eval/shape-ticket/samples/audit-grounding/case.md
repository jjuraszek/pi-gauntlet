bundle+: skills/shape-ticket/SKILL.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start repair ABC-701; capability ladder already resolved native read-only tracker commands, no subagent tool available. Describe native fresh low-effort fallback with same brief/artifacts, no extra gate. Tools disabled here; supplied citations are authoritative fixture evidence.
Current checkout origin resolves to team/reports; use that tracker repository name for its AC group. All add/replace instructions below define the already-fetched snapshot, not new requester scope.
Snapshot:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Add Context claim "Export retries are disabled." Add Problem reporter comment observation "My report never retries." Add Problem claim "All users prefer email." Idea "Build a new ExportWrapper around report downloads." ACs include the base row plus "- [ ] Given a report receipt, opening it in the viewer shows its report ID."
Prepare-the-run checkpoint before the returned audit: cwd and top level /repos/reports/.worktrees/abc-701; first porcelain entry `worktree /repos/reports`. Resolved overrides ## shape-ticket contains `- sibling: git@example.test:team/viewer.git`, `- sibling: git@example.test:team/missing.git`, `- sibling: git@example.test:team/billing.git`. /repos/viewer is a checkout with stored origin https://example.test/team/viewer.git; /repos/billing is a checkout with stored origin git@example.test:team/billing.git; nothing exists at /repos/missing. Show the found paths and parent-supplied line in the brief before folding the separately supplied audit below.
Code docs/retries.md:4 says exports retry twice; this contradicts the code claim but cannot establish what reporter saw. Preferences are not checkable. Audit file:
Claims: Export retries are disabled. - contradicted: exports retry twice, docs/retries.md:4
Claims: My report never retries. - contradicted: configured retries twice, docs/retries.md:4
Claims: All users prefer email. - not checkable: no preference evidence
Repo-fit: simpler: use a different wrapper (no citation)
AC-fit: how: Given a 12-row report (no citation)
Sibling: /repos/viewer - leg: opening a receipt shows its report ID, src/receipt.ts:9
Sibling: git@example.test:team/missing.git - not found: expected at /repos/missing; clone with git clone 'git@example.test:team/missing.git' '/repos/missing'
Sibling: /repos/billing - none
In-motion: unavailable (PR search verb)
Scenario: setup: report R has 12 rows; action: download R; observation: zero rows; inputs: screenshot.png, trace.zip
src/receipt.ts:9 grounds existing receipt observable. Billing has no stated observable. Attachment links are named, not read. Native fallback already returned the audit text. Show changed body diff, new Reporter note and existing gate, preserving defect expected result.
Independent degradation checkpoints: create outside git checkout; missing PR-search command in checkout; sibling path with grounded observable but unresolvable repo name. Report outcomes without extra drafts or questions.
