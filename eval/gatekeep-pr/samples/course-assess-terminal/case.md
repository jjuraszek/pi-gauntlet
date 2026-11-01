## Digest

- pr: { number: 42, title: "Reject unsigned events", body: "Reject unsigned events.", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, mergeable: MERGEABLE, mergeStateStatus: CLEAN }
- base_repository: acme/widgets; viewer: { login: river-example, is_author: true }; permissions: { viewer_permission: WRITE, head_pushable: true, head_url: git@git.example.invalid:acme/widgets.git, head_ref: feature/guard }
- scope: { source: pr, rows: [], design: "", original_intent: { title: "Reject unsigned events", body: "Reject unsigned events." } }
- worktree: /work/widgets-pr-42, recorded home /work/widgets-pr-<N>, expected branch feature/guard, non-primary, tracked-clean, HEAD equals gathered head, no unpushed commits; primary /work/widgets
- configuration: closureReview.maxFixRounds 5 (resolved override, not the runtime default); timeout 15 minutes; merge policy squash; scoped verification `node --test src/guard.test.mjs`; fresh sequential helpers available
- record: /tmp/gatekeep-state.synthetic, consent.target { base_repository: acme/widgets, number: 42, baseRefName: main }, course null, repair { rounds_used: 0, rounds_cap: 10, syncs_used: 0, syncs_cap: 10, poll_deadline: null, wave: null }, approved_head null, cleanup_done false
- checks: ci / test completed SUCCESS, run 910 completed success on gathered head; evidence source ci on that exact head; comments inline/top_level/review_threads empty; no drafted replies
- gh api repos/acme/widgets/pulls/42/reviews --paginate: []; prior_review null; no ancestry check or Prior review line applies.
- simulations: all snapshots, tool requests and helper results are hypothetical, not live operations. Narrate from these finite snapshots without tools. Unspecified forge reads retain the last supplied head/body/base/check state. Read-only reviews are clean except explicit findings; no result beyond these checkpoints may be invented.

## Entry

Independent checkpoints use initial assess=1, deliver=2, stop=3; human selects `1`. Usage remains 0/0 with caps 10/10 and no writes to source or sync. A: someone else authored the PR (viewer is delta-example, is_author false); P1 src/guard.mjs:8 accepts empty signatures; one drafted thread reply C1 acknowledges an unrelated test fix. The review POST succeeds with response { id: 920, commit_id: "1111111111111111111111111111111111111111", state: CHANGES_REQUESTED }. Re-render once without another pick. B: same blocker but viewer is author river-example; POST succeeds with { id: 921, commit_id: "1111111111111111111111111111111111111111", state: COMMENTED }. C: someone else's PR, zero blockers but one binding CI check pending, so not ready. D: own PR, zero blockers, pending check. E: same as B but the successful POST response has commit_id 2222222222222222222222222222222222222222, despite all pre-write reads retaining assessed head 1111111111111111111111111111111111111111. Narrate each assess action and terminal menu, including the exact POST fields and response provenance, no reply selection supplied. For C/D explain what review baseline a fresh session will select; no later session or write occurs.

## Arguments

`42`
