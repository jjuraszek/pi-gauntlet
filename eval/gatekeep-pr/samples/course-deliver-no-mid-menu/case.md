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

Return only compact run-record updates and the menus for the main sequence and independent checkpoints B-D. Use a compact table for heads, usage, deadlines, and outcomes; include the own-push deadline values and the base-observation distinction there. Do not narrate each iteration or repeat the digest, tool procedures, or finding details. Keep the entire reply under 1500 words.

Initial source review has P1: src/guard.mjs:8 accepts an empty signature. Initial menu is assess=1, deliver=2, stop=3; human selects `2` once. Persist course deliver and both caps/usage before writes. P1 helper repairs, scoped test passes, reviewer resolves, own push at 12:02 yields head 2222222222222222222222222222222222222222. CI on that head fails with `expected unsigned rejection, got accepted`; logs and source confirm P2 at src/guard.mjs:12. P2 helper repairs, scoped test passes, range review resolves, own push at 12:10 yields head 3333333333333333333333333333333333333333. CI becomes pending; main moves at 12:11, BEHIND. Required sync is clean, reviewer clean, pushes synced head 4444444444444444444444444444444444444444 at 12:12. CI and reviewer finish success at 12:20, all claims matched; render final then stop without picking merge. Record each own-push deadline and distinguish a base-only observation from a push.

Independent checkpoint B: restore course deliver, rounds_used 2, syncs_used 1, both caps 10 at head 3333333333333333333333333333333333333333. ci / test is red twice with no intervening pushed repair-wave source commit; the only intervening SHA movement is a base sync. Logs give no source lead. Record the exit, not another repair.

Independent checkpoint C: restore course deliver, usage 0/0, caps 10/10 at gathered head. ci / test fails, `--log-failed` gives no evidence and source review no lead. The one authorized re-run is in progress with a binding check pending and its CI P1 still open; no helper/no-progress prerequisite or other blocker remains. Watch within the retained 15-minute window; the next snapshot completes SUCCESS on the same head, fresh claim-check closure resolves P1, all merge prerequisites hold. Render final with no additional repair dispatch or re-run.

Independent checkpoint D: course deliver, remote head A=1111111111111111111111111111111111111111, reviewed local repair commit B=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, clean tree. Required rebase produces C=2222222222222222222222222222222222222222. The checked push is rejected. Show the persisted sync restore/lease heads and resulting local head; retain the unpushed B repair, make no second push and render obstacle.

## Arguments

`42`
