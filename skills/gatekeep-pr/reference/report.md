# gatekeep-pr: step 5 - report

Read after `findings.md` at step 5. Render report, then `menus.md`; apply SKILL.md's wording rules.

## Report

Write whole sentences in three unlabeled parts: change and scope, standing and problems, then a recommendation. Keep the rejection note's required headings as the sole exception (`## Rejection note`). Omit empty sections; number findings when two or more problems block merging.

Preserve:

- Render the opening as one paragraph of exactly two sentences. Describe the change first; fold the role into either sentence. In the second, explain covered and deferred behavior, its references, deliberate deviations and their reasons, behavior handled elsewhere and its repositories, and observations checked after merge; name the behavior, never a row number. Count a covered mechanism as covered even when its observation waits; say when nothing is covered. Keep row numbers and detailed mapping under `show evidence` or in the posted `AC coverage` checklist.
- In that opening, state whether the viewer is the author, a requested reviewer, neither, or unreadable, using refreshed `viewer.role` and `pr.review_requests`. Keep other requested users and teams in API order: exclude the viewer by case-insensitive User login comparison, exclude nobody when that login is unreadable, render Users by login and Teams by slug, and use `unknown` for a missing login or slug. Say, for example, "You are a requested reviewer; robin and acme/reviewers are also requested." Omit the list when empty.
- Start the second part with the standing sentence: nothing blocks merging, a count of problems to fix, or the one thing it waits on. Supply this sentence unchanged to the set parent's summary. Explain each problem in one or two sentences with one concrete example; retain the exact supplied failing test name and its file, or the file when no test name was supplied. Retain supplied path:line locators for every problem and nit. Print a compact exact old-to-new description preview under its blocker for consent; retain a declined proposal's preview on every re-render until the claim resolves.
- Explain replyable PR comments and the drafted reply's meaning, a pending reviewer run, a failed refresh or incomplete source review, and any merge prerequisite that still blocks progress. Follow with any wait, sync and prior-review results, and PR-named after-merge steps. Keep nits distinct and name their count and the offered action that can take them.
- For a non-null `prior_review`, count addressed items from distinct resolved `R#` entries and the supplied total. For an ancestor, say how many were addressed; with nonzero items and `prior_review.commit == headRefOid`, also say there are no commits since that review. With zero items, say that review posted no items and the changes since it were reviewed. For a baseline that is not an ancestor, retain the reason from `assessment.md` `## Prior-review ancestry` and that the whole diff was reviewed. Omit the prior-review sentence when null.
- Only with `--rebase`, explain the sync outcome, including resolved files on success and the actual reason on a skip, decline or failure. Translate the digest's status into prose; keep its exact value in the evidence record. Do not invent a sync result on loop re-entry.

For eligible BLOCKED readiness, omit the blocked comment and explain the admin override through `menus.md` `## final`. For WRITE or MAINTAIN, name override eligibility, not admin rights. With unreadable eligibility and green CI, say required checks passed independently of GitHub's block. Otherwise say GitHub blocks this actor from merging; never invent a named rule. Keep `bypass_eligible` and its value in the digest's permissions only, including when answering `show evidence`. Resolve other unavailable actions through `menus.md` and explain their actual missing prerequisites in prose, not a separate omission line.

## Approach problems

In part two of the first report, state each validated approach blocker in one or two sentences total. For base-evidence grounds, report only `builds:` and `conflicts with:`, with the base path and optional line trailing the conflict. Keep `instead:` in the evidence pack; omit the remedy from this problem item. For example: "The PR adds a second import queue, but the existing task runner owns imports (doc/architecture.md:18)." Substitute the actual mechanism, conflict and citation; do not copy the example's facts. For needless machinery, combine `builds:` with `smaller:`: name the machinery, the smaller alternative and why it gives the same result. Omit a separate `instead:` sentence here too. Count sentences across the whole item and cut restatement rather than adding a third. Keep the opening exactly two sentences; do not repeat the problems there. Use the ordinary plain-language problem list, not separate explanation headings.

Render these blockers regardless of the native verdict or green CI. Do not double-count a blocker merged with a native or prior-review finding; retain independent ordinary blockers and nits. Keep `A<n>`, contributor IDs and ground numbers behind `show evidence`. A dropped entry or non-blocking overlay adds no approach problem to this list.

## Rejection note

Read `reject.md` `## Draft note` before rendering. With a prepared note, print one plain lead-in sentence, then the saved note in full and unfenced after the problems and before the recommendation. Read `reject.note_path`; do not summarize, reword or fence its bytes. Keep the note's three headings and its word cap separate from the ordinary report's two-sentence opening and short problem items. With no note, add no lead-in, headings or placeholder.

## Standing

Put part three's recommendation sentence and reason immediately above `Pick one:`; follow `menus.md`. Name a running required check or unchanged obstacle, not readiness. Translate verdict and exit state into prose.

Explain standing with true evidence: distinguish CI from local runs and never turn pending or missing evidence into a pass. Put raw check conclusions, run URLs, head, prior-review and sync SHAs, pending-check counts, repair/sync usage counters and raw field/value pairs under `show evidence`, not in report prose, a separate evidence line or a hint parenthetical. A pending reviewer's run URL may still locate its comment. Apply the same rule to obstacle and final reports.

## What stays out

Verbatim command output stays in its `log_path` file and never prints; `show evidence` prints its `show evidence: <log_path>` line instead. Keep full drafted file edits, description bodies and replies, matched claims, per-row AC outcomes, internal IDs and check classifications behind that command. The rejection note is the one drafted body printed outside `show evidence`, through `## Rejection note`. An author assertion the gate cannot verify is non-blocking uncertainty, not a fabricated finding.

Under `show evidence`, print `state: <absolute-path>`, then the run record's course, immutable target, stored scope baseline, cumulative round/sync usage and caps, deadline, wave checkpoints and failed-prerequisite history. Follow with the prior-review and sync records, retaining their SHAs, and the evidence record (CI: each satisfying check's name, conclusion, SHA and run URL; local: each run's command, `result`, `exit_code` and `show evidence: <log_path>`); claim dispositions; AC outcomes and `cross-check:` from `assessment.md` `## Select the scope contract`; check dispositions; drafted payloads keyed by blocker or nit; drafted replies keyed by comment. Keep these records inspectable without copying them into the report.

## Example

> This PR adds an on-demand CSV export button. The spec defers scheduled exports to acme/widgets#46, and the speed target needs checking after merge; you and robin are requested reviewers.
>
> One problem blocks merging: the description says "Exports run nightly", but the button exports on demand. The correction is "Exports run when you click Download." One smaller point does not block merging: the export repeats a shared helper's paging code.
>
> I recommend deliver because the description's correction is ready.
>
> Pick one:
> 1. deliver - apply the drafted description fix, merge main into the branch if it falls behind, watch the checks, and continue until merge is offered. [recommended]
> 2. deliver with nits - the same, and also replace the repeated paging code.
> 3. assess - post the problem to the PR as a review and make no repairs.
> 4. stop - remove the worktree and leave the PR as it is.
>
> Type a number; show evidence prints the full record.
