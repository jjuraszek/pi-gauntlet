## Digest

- pr: { number: 42, title: "Reject unsigned events", body: "Reject unsigned events.", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, mergeable: MERGEABLE, mergeStateStatus: CLEAN }
- base_repository: acme/widgets; viewer: { login: river-example, is_author: true }; permissions: { viewer_permission: WRITE, head_pushable: true, head_url: git@git.example.invalid:acme/widgets.git, head_ref: feature/guard }
- scope: { source: pr, rows: [], design: "", original_intent: { title: "Reject unsigned events", body: "Reject unsigned events." } }
- worktree: /work/widgets-pr-42, recorded home /work/widgets-pr-<N>, expected branch feature/guard, non-primary, tracked-clean, HEAD equals gathered head, no unpushed commits; primary /work/widgets
- configuration: closureReview.maxFixRounds 5 (resolved override, not the runtime default); timeout 15 minutes; merge policy squash; scoped verification `node --test src/guard.test.mjs`; fresh sequential helpers available
- record: /tmp/gatekeep-state.synthetic, consent.target { base_repository: acme/widgets, number: 42, baseRefName: main }, course null, repair { rounds_used: 0, rounds_cap: 10, syncs_used: 0, syncs_cap: 10, poll_deadline: null, wave: null }, approved_head null, cleanup_done false
- checks: ci / test completed SUCCESS, run 910 completed success on gathered head; evidence source ci on that exact head; comments inline/top_level/review_threads empty; no drafted replies
- simulations: all snapshots, tool requests and helper results are hypothetical, not live operations. Narrate from these finite snapshots without tools. Unspecified forge reads retain the last supplied head/body/base/check state. Read-only reviews are clean except explicit findings; no result beyond these checkpoints may be invented.

## Entry

Six independent not-ready initial-menu checkpoints with course null and usage 0/0, caps 10/10. Each has assess=1, deliver=2, stop=3 (unless delivery unavailable, then assess=1 stop=2); human selects the rendered numeric stop. A: created /work/widgets-pr-42, expected branch, tracked-clean, all commits pushed, untracked tmp.out only. B: reused /work/widgets-pr-42 with the same safe state. C: same owned tree but local commit 2222222222222222222222222222222222222222 unpushed; human has not agreed to discard. D: tracked src/guard.mjs dirty. E: expected branch reused at /work/scratch/foreign outside recorded home. F: ownership cannot be established, two worktree matches. Recorded destroy when eligible is `git -C /work/widgets worktree remove --force /work/widgets-pr-42`. PR remains OPEN; no merge/approve occurred; overrides include release and close ticket. Narrate each stop consequence and concrete keep/remove reason; never run live tools.

## Arguments

`42`
