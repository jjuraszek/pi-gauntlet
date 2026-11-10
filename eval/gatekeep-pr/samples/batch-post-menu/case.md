bundle+: skills/gatekeep-pr/reference/batch.md
## Arguments

`12 15`

## Observed snapshots

Pi, origin acme/widgets, primary /tmp/widgets on main, clean. The parent has provisioned both PRs serially, awaited every child result, collected both merge picks and executed them. Both PRs are MERGED, with merge commits aaaaaaa for #12 and bbbbbbb for #15. All children have finished; there are no live tools to run in this replay. The roster order is #12, then #15. Parent records /tmp/state-12 and /tmp/state-15 have matching target identities and retain each child's private fields. Child standing sentences supplied with their reports are exactly `Nothing blocks this PR from merging.` for #12 and `The required checks passed, so this PR can merge.` for #15. Print the parent's summary by copying those sentences, even though both PRs have since merged. No shared changed files.

Each PR has its own eligible cleanup, including owned worktree removal, local branch deletion and fast-forward-only primary base pull. Worktrees are /tmp/widgets-pr-12 and /tmp/widgets-pr-15; branches feature/export and feature/cache. Every cleanup guard succeeds. Cleanup12 uses `git worktree remove /tmp/widgets-pr-12`, `git branch -d feature/export`, then `git pull --ff-only origin main`; cleanup15 uses the corresponding #15 path and feature/cache branch, then the same pull. All selected commands below succeed; there is no invented credential problem or head drift.

Merge-base cleanup overrides in their configured order:
- `announce PR <pr>: node scripts/announce.mjs <pr> <merge-sha>` is PR-specific, substituting #12/aaaaaaa or #15/bbbbbbb.
- `close ticket: gh issue close <issue>` is PR-specific even though it names no PR token. Issues are 112 for #12 and 115 for #15.
- `publish docs: node scripts/publish-docs.mjs` contains none of `<issue>`, `<pr>`, `<merge-sha>` before substitution and is shared by the set. It needs the merged change; a successful cleanup base pull supplies it. No nested skill or approval gate is involved.

Each PR has no coverage destinations, drafted reply, or PR-named action. The steps offered are its own cleanup, its own announce and close-ticket overrides and the shared publish override while that item has not run. The shared override is an individual selectable row on an earlier merged PR, but belongs to row 1 only on the last merged PR in this round.

## Entry

Replay two independent variants, each starting from the snapshots above with no shared item executed. Label them A and B. Use message separators so that every PR's post menu is in its own message, with its marker on the first line. Show both post menus and the queued-pick acknowledgements before execution, then the execution results, per-PR retirement messages, and the single parent closing message in each variant. Do not elide the actual menu rows or their commands. Interpret the stipulated human selections by action label after assigning row numbers; no need to wait for another turn.

A: The human selects row 1 for #12 and then row 1 for #15. Shared publish is omitted from #12's recommended combination and included in #15's. After both picks are collected, run them in roster order. Each PR retires immediately after its picked steps finish. There is no post-menu re-render after cleanup or announce.

B: The human selects all individual runnable rows on #12, explicitly including publish docs, then selects stop on #15. Both picks are collected before executing either. Publish runs once on #12, so skip the already-run shared item when processing #15; it runs no second time. #15's cleanup, announce and close-ticket steps were not picked. End with one parent closing message carrying their not-run sentences and exact commands. State what any later-round post menu in this set can offer after the shared publish has run; do not render a new menu for either retired PR.

These are text-only simulated snapshots. Describe only the supplied results; do not invoke tools, dispatch children, or invent an extra confirmation.
