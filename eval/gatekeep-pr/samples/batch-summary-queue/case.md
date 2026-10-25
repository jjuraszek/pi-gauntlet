bundle+: skills/gatekeep-pr/reference/batch.md
bundle+: agents/pr-gatekeeper.md
## Arguments

`12 15 https://github.com/acme/widgets/pull/18 --rebase main`

## Observed snapshots

Pi harness, origin acme/widgets, parallel.maxTasks 8, concurrency 3, viewer alex. Installed procedure root /tmp/procedures/gatekeep-pr. Parent fetched origin once and provisioned serially, gitignore done. Worktrees /tmp/widgets-pr-12, /tmp/widgets-pr-15, /tmp/widgets-pr-18 have HEAD equal their gathered headRefOid. Records /tmp/state-12, /tmp/state-15, /tmp/state-18 and supplied reports /tmp/report-12, /tmp/report-15, /tmp/report-18 are minted outside the trees. Each consent.target is acme/widgets with its number and main; course null, repair.rounds_used 0, repair.rounds_cap 6, repair.syncs_used 0, repair.syncs_cap 6, approved_head null, cleanup_done false. Files: 12 [src/export.ts], 15 [src/export.ts, src/parser.ts], 18 [src/auth.ts]. PR12 and 15 are alex's; only PR18 is another author's eligible non-no-op linear head. Parent's single confirmation listing 18 received yes.

The following assessment result snapshot begins AFTER provisioning. Observe the no-write boundary from this point through each menu selection, excluding authorized sync pushes. One fresh foreground batch carries report tasks with supplied record/report paths, skill gatekeep-pr, worktree cwd, provisioned-HEAD instruction, procedure root, and confirmation not asked/not asked/yes. PR12 and 15 pushed their sync with lease and each ran fresh Verify then Review helpers; PR18's conflict helper could not resolve stop 4e2a1b7. Recovery aborted/reset to pre_head and asserted clean; sync record `sync: failed - unresolved stop in 4e2a1b7`, no report. Its last line is `CONFLICTING /tmp/report-18 - sync: failed - unresolved stop in 4e2a1b7`. Other closing lines: `REPORT /tmp/report-12`, `REPORT /tmp/report-15`.

Report /tmp/report-12 verbatim:
Delivers
Export preserves the requested column order.
Blockers
1. Empty input throws instead of returning an empty export. (src/export.ts:8)
Verdict: fixable - 1 blockers

Report /tmp/report-15 verbatim:
Delivers
Parsing preserves escaped separators.
Verdict: mergeable - all mechanisms match

Records: PR12 source ci, open P1; PR15 source local (local verification: always), no open P#, binding CI still pending with merge withheld and initial deliver available; PR18 no Verify or Review, source/count unknown. All PRs have viewer_permission WRITE and can_update_branch true. PR18's recovered conflicting state offers safe retry under the batch pick-round contract. All worktrees tracked-clean with no rebase in progress after recovery. No PR edit, review, comment, tracker write or non-sync push has occurred in the observation interval.

## Entry

Narrate this observed batch (not tool execution), including its task envelope and helper isolation, summary and roster-order menus. The human picks numeric 2 (deliver) for 12, numeric 2 (deliver) for 15, numeric 1 (retry) for 18. Show the queue immediately after the 12 numeric deliver pick before presenting 15, then describe the next parallel batch only after all picks. Do not invent updated reports from that next batch.

All supplied records retain PR-local course, repair.rounds_cap 6, repair.syncs_cap 6 and both usage fields; unspecified usage is zero. These are text-only simulated snapshots, not requests to call tools.
