# gatekeep-pr sync and decision-grants eval

Sixty-eight synthetic digest samples test command and helper narration through the first menu or an `## Entry` continuation state. The inventory covers sync and scoped-test push holds; permissions, helpers, and other-author confirmation; blocker-only and one-shot nit fixes; reviewed carried-set retries; separate fix/base grants and named-fix limits; missing, mismatched, revoked, and Claude Code continuation state; shared repair budgets, no-progress stops, contract decisions, and bounded polling; exact description corrections, uncertainty, independent test/scope blockers, stale proposals, concurrent edits, write failures, and mixed file/body progress. Samples and must-hold facts live under `samples/`; the current change intent is in `intent.md`.

| Skill file loaded |
|---|
| `skills/gatekeep-pr/SKILL.md` |
| `skills/gatekeep-pr/reference/sync.md` |
| `skills/gatekeep-pr/reference/decision-menu.md` |
| `skills/gatekeep-pr/reference/findings.md` |
| `skills/gatekeep-pr/reference/post-selection-loop.md` |
| `skills/gatekeep-pr/reference/cleanup.md` |
| `skills/gatekeep-pr/reference/fix-wave.md` |
| `skills/gatekeep-pr/reference/report.md` |
| `skills/gatekeep-pr/verification-brief.md` |
| `skills/gatekeep-pr/reference/assessment.md` |

The batch, discovery and typed-list samples cover these cases:

| Sample | Must-hold behavior |
|---|---|
| `batch-summary-queue` | Isolated fresh tasks and Verify/Review helpers; input-order summary, shared-file warnings, and menus; picks queue until all menus finish before the next parallel batch. |
| `batch-failure-retry` | Timeout and unpushable-head failures stay separate from a sibling report; safe retries mix assess with execute, while dirty or mid-rebase retries are withheld and provisioning retries validate the worktree. |
| `batch-rebase-answers` | Separate invocations carry yes/no/not-asked answers without inventing sibling authority; no declines sync but still assesses, yes binds helpers to the lease-pushed head, and terminal sync failures use failure menus. No-op and merge-commit heads are excluded from confirmation. |
| `batch-cleanup-stop` | Parent cleanup and stop run between batches; cleanup retains terminal post/evidence rows, stop restores pre_head, records retain grants/counters/ledger, and stale execute refreshes instead of writing. Ordered cleanup pauses for release before notification. |
| `no-arg-discovery-over-cap` | Exclude the unanswered PR and show the six eligible entries under `**Open PRs to gate, smallest first:**`, then reject the set in a separate marked message ending with the pasteable numbers. |
| `no-arg-discovery-single` | Bind one review-requested search excluding the viewer's PRs to origin despite a mismatched `GH_REPO`; print one linked entry under `**Open PR to gate:**` and continue with its origin URL without a pasteable line or a pause. |
| `no-arg-discovery-zero` | One empty list stops before provisioning with `no open PRs awaiting @me's review in acme/widgets` when the viewer login is unreadable. |
| `no-arg-discovery-cc-multi` | On Claude Code, show three entries under `**Open PRs to gate, smallest first:**` in the reply reading the stop format, before a separate marked stop ending with the pi-only rejection and the pasteable numbers. |
| `no-arg-discovery-failed` | A failed, truncated or malformed review-requested list stops discovery without a current-branch fallback. |
| `no-arg-discovery-answered` | Look up surviving changes-requested PRs in number order. List answered ones under `**Open PRs to gate, smallest first:**` and route them in size order. Stop without a list on a failed, malformed or incomplete lookup. |
| `no-arg-discovery-under-cap` | Keep the three other authors' PRs beyond the first 100 drafts, re-enter set routing with sorted origin URLs and `source: discovered`, and admit pasted trailing commas. |
| `no-arg-discovery-note` | Show other authors' PRs once under `**Open PRs to gate, smallest first:**`, name the request source, summarize untrusted text, and continue through admission without a reply. |
| `list-send-if-missing` | At first provisioning, show a missing `**PR to gate:**` list for one typed PR or `**Open PRs to gate, smallest first:**` for a discovered set. Skip the list when earlier reply text shows it. |
| `typed-list-note` | Show `**PRs to gate:**` in typed order before provisioning; show `**PR to gate:**` before the single PR's diff, CI and comment reads. Neither list waits for a reply. |

All these samples use a local `bundle+` line for `skills/gatekeep-pr/reference/batch.md`. The four `batch-` samples and only `no-arg-discovery-under-cap` among the discovery samples also bundle `agents/pr-gatekeeper.md`. Neither file is in the global `target.json` manifest. The note, single-match and two rejection samples omit later gate stages with `bundle-` lines. Bundled files must be committed and readable at the pinned baseline before capture: the runner rejects a `bundle+` file absent at that base.

The two report-role samples use no extra bundles. `role-line-requested` covers authorship, a direct request, neither, and unreadable identity when no team matches, plus same-head refresh, explicit-token discovery bypass and verbatim batch reports. `role-line-team` checks the two-sentence opening for a team request on discovered and typed PRs, including a direct request, an author with two requested teams and an unreadable membership list.

These samples replay text snapshots and judge narration of requests, not live dispatch. They do not prove nested tool rights or worktree execution. The parent owns separate live runtime evidence: two synthetic PR worktrees, one child failing before Verify without a report, and a sibling using Verify, Review, and plan_tracker and writing only its supplied report.

Baseline capture with `node eval/run.mjs gatekeep-pr --baseline-only --base <ref>` succeeds when baseline replay outputs are usable; it does not check intent, judge facts, or write `report.md`. Run the target-wide candidate comparison with `node eval/run.mjs gatekeep-pr --base <ref>` against the same pinned baseline. Delivery requires every new or changed must-hold fact to have `after: holds` for both frozen replay models in the committed candidate results, with no regression, error, or inconclusive outcome. A successful exit or aggregate `improved`/`unchanged` verdict is not sufficient: unchanged failures can be labeled `pre-existing` or `intended but unchanged`.

Samples use `bundle-` lines in `case.md` to drop the reference files their facts never exercise (`sync.md` outside `--rebase` digests, `assessment.md` and `fix-wave.md` where no config or fix-wave fact exists); samples whose facts span the whole workflow keep the complete assembly and carry no `bundle-` line, so a reference edit replays only the samples that keep it.

Process, commands, and record schema: [eval process](../README.md).

Samples prefixed `cleanup-keyed-` enter at the `cleanup` pick with a keyed `## using-git-worktrees` contract in the merge-base overrides and judge the ownership match before removal.
