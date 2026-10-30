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

The four explicit multi-PR samples and six no-argument discovery samples add these checks:

| Sample | Must-hold behavior |
|---|---|
| `batch-summary-queue` | Isolated fresh tasks and Verify/Review helpers; input-order summary, shared-file warnings, and menus; picks queue until all menus finish before the next parallel batch. |
| `batch-failure-retry` | Timeout and unpushable-head failures stay separate from a sibling report; safe retries mix assess with execute, while dirty or mid-rebase retries are withheld and provisioning retries validate the worktree. |
| `batch-rebase-answers` | Separate invocations carry yes/no/not-asked answers without inventing sibling authority; no declines sync but still assesses, yes binds helpers to the lease-pushed head, and terminal sync failures use failure menus. No-op and merge-commit heads are excluded from confirmation. |
| `batch-cleanup-stop` | Parent cleanup and stop run between batches; cleanup retains terminal post/evidence rows, stop restores pre_head, records retain grants/counters/ledger, and stale execute refreshes instead of writing. Ordered cleanup pauses for release before notification. |
| `no-arg-discovery-over-cap` | Filter drafts and decided PRs, deduplicate and sort the queue, then print the cap rejection and pasteable sorted list without provisioning or dispatch. |
| `no-arg-discovery-single` | Bind both queries to origin despite a mismatched `GH_REPO`; one match continues with an origin URL on the single-PR path. |
| `no-arg-discovery-zero` | No matches stop before provisioning with the origin-naming message and `@me` when the viewer login is unreadable. |
| `no-arg-discovery-cc-multi` | Claude Code rejects multiple matches with the pi-only message and sorted discovered list, without dispatch. |
| `no-arg-discovery-failed` | A failed query or a result reaching the query limit stops discovery without a current-branch fallback. |
| `no-arg-discovery-under-cap` | Keep eligible rows beyond the first 100, re-enter set routing with sorted origin URLs and `source: discovered`, and admit pasted trailing commas. |

All ten samples use a local `bundle+` line for `skills/gatekeep-pr/reference/batch.md`. The four `batch-` samples and only `no-arg-discovery-under-cap` among the discovery samples also bundle `agents/pr-gatekeeper.md`. Neither file is added to the global `target.json` manifest, and existing sample assemblies stay unchanged. Bundled files must be committed and readable at the pinned baseline before capture: the runner rejects a `bundle+` file absent at that base.

The separate `role-line-requested` sample uses no extra bundles. It checks all four viewer roles under `Delivers`, requested User and Team entries and unreadable entries, explicit-token discovery bypass, same-head pre-menu refresh, and verbatim batch report handling.

These samples replay text snapshots and judge narration of requests, not live dispatch. They do not prove nested tool rights or worktree execution. The parent owns separate live runtime evidence: two synthetic PR worktrees, one child failing before Verify without a report, and a sibling using Verify, Review, and plan_tracker and writing only its supplied report.

Baseline capture with `node eval/run.mjs gatekeep-pr --baseline-only --base <ref>` succeeds when baseline replay outputs are usable; it does not check intent, judge facts, or write `report.md`. Run the target-wide candidate comparison with `node eval/run.mjs gatekeep-pr --base <ref>` against the same pinned baseline. Delivery requires every new or changed must-hold fact to have `after: holds` for both frozen replay models in the committed candidate results, with no regression, error, or inconclusive outcome. A successful exit or aggregate `improved`/`unchanged` verdict is not sufficient: unchanged failures can be labeled `pre-existing` or `intended but unchanged`.

Samples use `bundle-` lines in `case.md` to drop the reference files their facts never exercise (`sync.md` outside `--rebase` digests, `assessment.md` and `fix-wave.md` where no config or fix-wave fact exists); samples whose facts span the whole workflow keep the complete assembly and carry no `bundle-` line, so a reference edit replays only the samples that keep it.

Process, commands, and record schema: [eval process](../README.md).

Samples prefixed `cleanup-keyed-` enter at the `cleanup` pick with a keyed `## using-git-worktrees` contract in the merge-base overrides and judge the ownership match before removal.
