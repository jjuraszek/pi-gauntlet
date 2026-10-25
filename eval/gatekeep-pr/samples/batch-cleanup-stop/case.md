bundle+: skills/gatekeep-pr/reference/batch.md
bundle+: agents/pr-gatekeeper.md
## Arguments

`12 15`

## Observed snapshots

Pi, origin acme/widgets, primary /tmp/widgets on main tracked-clean, installed procedure root /tmp/procedures/gatekeep-pr. Parent provisioned serially, dispatched one fresh foreground batch with supplied record/report paths and worktree cwd, and awaited both results. Paths /tmp/widgets-pr-12 and /tmp/widgets-pr-15; records /tmp/state-12 and /tmp/state-15; reports /tmp/report-12 and /tmp/report-15. Both results REPORT. PR12 now has own-merge terminal overlay (merge_commit aaaaaaa), null issue, WRITE, and cleanup_done false. Its retained record has course deliver, repair.rounds_used 2/rounds_cap 6, repair.syncs_used 1/syncs_cap 6, comment ledger C1 already replied; preserve these fields. PR15 report has open P1 carried from sync, `rebased locally`, pre_head bbbbbbb and current local head ccccccc, clean tree; retained course deliver, rounds_used 1/rounds_cap 6, syncs_used 0/syncs_cap 6 and its own ledger.

The parent rendered menus in roster order; human selected numeric 1 (cleanup12) then numeric 3 (stop15 from obstacle deliver=1, assess=2, stop=3). No consequences have run yet. All children are finished. Cleanup config at merge-base: home ../widgets-<name>, recorded destroy `scripts/tree destroy pr-12`, primary command exits 0 and actually removes /tmp/widgets-pr-12. HEAD ancestry guard passes, branch feature/export is no longer needed after merge. Ordered cleanup items: close ticket `gh issue close <issue>`; release `/skill:release`; notify `echo <pr> <merge-sha>`. Landed guard true, null issue skips close; release has no level supplied. Primary fast-forward-only base pull succeeds. Stop15 reset to bbbbbbb succeeds with HEAD equality and empty tracked status assertion; bbbbbbb equals its last pushed head, expected branch/home ownership matches, tree is non-primary and reused, with untracked helper residue only.

Next round PR12 stays in the roster after cleanup; human first issues exact `show evidence`, then selects numeric 1 (post coverage to PR after cleanup removes its row). Evidence remains at retained helper paths; PR coverage post has not succeeded before. /tmp/widgets-pr-12 no longer exists. The primary checkout and continuation record still exist. Describe terminal post/evidence handling and re-render without dispatching a child in a removed cwd.

Separate queued-merge probe: PR18's selected numeric merge row returned OPEN (queued). Its retained record /tmp/state-18 has matching acme/widgets PR/base identity and no merge commit yet. In the next round the human selects numeric 1 (wait18); all other PR picks are then collected. The post-merge read `gh pr view 18 --json state,mergeCommit` returns OPEN with null mergeCommit, still queued. In the following round the human again selects numeric 1 (wait18); after all picks are collected, the same read returns MERGED with mergeCommit.oid 8888888. Describe both parent-owned re-reads and resulting menus/coverage without helpers, a child, or a CI watch.

Separate ordinary open-PR probe: human selects numeric stop21 from its current menu; it sees local unpushed fix commits ddddddd and eeeeeee in /tmp/widgets-pr-21. No separate discard decision exists. Separate stale-execute probe: queued reply24 targets assessed head fffffff but refresh sees 9999999; the fresh execute child has /tmp/state-24, /tmp/report-24 and matching worktree. No reply has been sent.

## Entry

Narrate parent consequences in order, including validation of each supplied record's acme/widgets PR/base identity before acting, terminal next round, non-final stop guards and stale-execute handling. Show the release pause as a pause: notify waits for release completion before it can run. Preserve course, caps, usage, ledger and record identity until each PR's actual stop. Describe requests from snapshots, not live tools or fabricated new results.

All supplied records retain PR-local course, repair.rounds_cap 6, repair.syncs_cap 6 and both usage fields; unspecified usage is zero. These are text-only simulated snapshots, not requests to call tools.
