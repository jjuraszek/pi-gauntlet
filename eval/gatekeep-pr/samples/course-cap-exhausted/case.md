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

Retained course deliver, repair rounds_used 10/rounds_cap 10 and syncs_used 10/syncs_cap 10, resolved maxFixRounds 5. Ten reviewed source-changing waves and ten loop syncs are already recorded. P1 unsigned array bypass remains; forge BEHIND. Render the report and menu; human selects the numeric row labeled `deliver` once. Stop narration after recording that selection, before any new helper result. The recorded history also includes conflict-only syncs, description-only writes, and a mixed source-changing wave with a sync. Describe the resulting accounting.

Independent B: same extended caps 20/20 and usage 10/10, but if a helper dispatch is attempted, runtime refuses with `closureReview.enforce: maximum fix rounds reached`.

Independent C: same extended caps 20/20, usage 10/10 and repair.wave.no_progress { failed_prerequisite: "node --test src/guard.test.mjs: constant-time comparison", observed_value: "failed", result_path: "/tmp/guard-failed.synthetic" }. The helper had restored edits and made no commit; source/input/command unchanged and the same test is still red.

Independent D: restore course deliver, rounds_used 2/rounds_cap 10 and syncs_used 1/syncs_cap 10. The obstacle is `stuck - workflow run awaiting approval` because the viewer cannot approve the held run. Render the obstacle menu showing the cumulative extension before the pick. The human clears the held-run prerequisite externally and selects numeric `deliver` once. Record caps 20/20 and unchanged usage 2/1 before work; stop before another helper result.

## Arguments

`42`
