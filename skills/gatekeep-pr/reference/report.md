# gatekeep-pr: step 5 - report

Read from SKILL.md step 5, after `findings.md`. Input: the integration output. Output: the report followed by the selected menu from `menus.md`. Apply SKILL.md `## Wording rules` to both; keep internal records unchanged.

## Report

Write whole sentences, not labeled fields or a fixed template. Keep the report bottom-up: what the PR does and its scope, the viewer's role, comments and nits, prior-review result, blockers, sync result, then one standing sentence immediately before the menu. Omit empty sections. Use headings or numbered findings when they help the reader choose; keep concrete file, test and comment locators without forcing a parenthetical layout.

Preserve these facts in prose:

- Explain what the PR does. With a spec, name the covered rows, deferred rows and their references, deviations and their reasons, rows handled elsewhere and their repositories, and observation halves checked after merge. Count a covered mechanism in the covered rows even when its observation waits. Group rows by reference or repository without losing their numbers; say when no rows are covered. Keep the detailed per-row assessment under `show evidence`.
- State whether the viewer is the author, a requested reviewer, neither, or unreadable, using refreshed `viewer.role` and `pr.review_requests`. Keep other requested users and teams in API order: exclude the viewer by case-insensitive User login comparison, exclude nobody when that login is unreadable, render Users by login and Teams by slug, and use `unknown` for a missing login or slug. Say, for example, "You are a requested reviewer; robin and acme/reviewers are also requested." Omit the list when empty.
- Explain replyable PR comments and the drafted reply's meaning, a pending reviewer run, a failed refresh or incomplete source review, and any merge prerequisite that still blocks progress. Name each concrete blocker and why it matters; retain the exact supplied failing test name and its file, or the file alone when no test name was supplied. Keep nits distinct and name their count and the offered action that can take them.
- For a non-null `prior_review`, count addressed items from distinct resolved `R#` entries and the supplied total. For an ancestor, say how many were addressed; with nonzero items and `prior_review.commit == headRefOid`, also say there are no commits since that review. With zero items, say that review posted no items and the changes since it were reviewed. For a baseline that is not an ancestor, retain the reason from `assessment.md` `## Prior-review ancestry` and that the whole diff was reviewed. Omit the prior-review sentence when null.
- Only with `--rebase`, explain the sync outcome, including resolved files on success and the actual reason on a skip, decline or failure. Translate the digest's status into prose; keep its exact value in the evidence record. Do not invent a sync result on loop re-entry.

For eligible BLOCKED readiness, omit the blocked comment and explain the admin override through `menus.md` `## final`. Otherwise say GitHub blocks this actor from merging; never invent a named rule. Keep `bypass_eligible` and its value in the digest's permissions only, including when answering `show evidence`. Resolve other unavailable actions through `menus.md` and explain their actual missing prerequisites in prose, not a separate omission line.

## Standing

End with one standing sentence immediately before the choices: what blocks merging or why it can proceed, with the recommendation's reason from `menus.md` when applicable. For example, "Two fixes are needed before this can merge, so I recommend deliver" or "Nothing blocks this PR from merging, so I recommend merge." Name a running required check or an unchanged obstacle rather than claiming readiness. Translate the internal verdict and exit state; do not print their fixed strings.

Keep evidence provenance true. Mention a passing result only when useful to explain the standing, distinguish CI from a local run, and never turn pending or missing evidence into a pass. Put check conclusions, run URLs, head, prior-review and sync SHAs, pending-check counts and raw field/value pairs under `show evidence`, not in report prose, a separate evidence line or a hint parenthetical. A pending reviewer's run URL may still locate its comment. Apply the same rule to obstacle and final reports.

## What stays out

Verbatim command output stays in its `log_path` file and never prints; `show evidence` prints its `show evidence: <log_path>` line instead. Keep full drafted file edits, description bodies and replies, matched claims, per-row AC outcomes, internal IDs and check classifications behind that command. Print a compact exact old-to-new description preview under its blocker for consent; retain a declined proposal's preview on every re-render until the claim resolves. An author assertion the gate cannot verify is non-blocking uncertainty, not a fabricated finding.

Under `show evidence`, print `state: <absolute-path>`, then the run record's course, immutable target, stored scope baseline, cumulative round/sync usage and caps, deadline, wave checkpoints and failed-prerequisite history. Follow with the prior-review and sync records, retaining their SHAs, and the evidence record (CI: each satisfying check's name, conclusion, SHA and run URL; local: each run's command, `result`, `exit_code` and `show evidence: <log_path>`); claim dispositions; AC outcomes and `cross-check:` from `assessment.md` `## Select the scope contract`; check dispositions; drafted payloads keyed by blocker or nit; drafted replies keyed by comment. Keep these records inspectable without copying them into the report.
