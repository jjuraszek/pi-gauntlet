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

Source head already satisfies every merge prerequisite, with N1 unused import at src/guard.mjs:1 and N2 duplicate guard at src/guard.mjs:6. Retained course is deliver-nits selected numerically at the prior initial menu, caps 10/10 and usage 0/0; no outstanding one-shot nit action. If helpers are dispatched for N1 and N2, they commit, scoped tests pass, and the reviewer resolves both. If pushed, the head becomes 2222222222222222222222222222222222222222 with exact-head CI success; fresh comment source review finds N3 unused helper at src/guard.mjs:20. If dispatched for N3, the helper commits, the scoped test passes, and the reviewer resolves N3. If pushed again, the head becomes 3333333333333333333333333333333333333333 with exact-head CI success; the last re-review has no nit or blocker. Narrate through the final menu, no merge pick.

## Arguments

`42`
