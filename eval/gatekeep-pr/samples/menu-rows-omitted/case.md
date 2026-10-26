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

Narrate independent menu checkpoints, never execute actions. Initial not-ready has P1 source blocker and course unset, usage 0/0, caps 10/10. A: zero nits, helpers and push available. Render rows; human types `deliver` (not a number). B: maxFixRounds 0, both caps 0. C: helpers missing. D: head unpushable at git@git.example.invalid:acme/widgets.git:feature/guard. E: PR CLOSED before first report, cleanup_done false. F: otherwise ready final, draft true and one nit; viewer is someone else with WRITE. G: otherwise ready final, non-draft, viewer someone else with READ permission. H: otherwise ready own final, no nits and drafted reply C1; numeric reply row selected and simulated post succeeds. I: own PR already MERGED, merge_commit 9999999999999999999999999999999999999999, cleanup_done true, issue_ref null, PR coverage not posted; current terminal rows post coverage to PR=1, stop=2. Human selects numeric 1. The coverage post fails with permission denied; narrate its next menu without retrying. Independent J: same numeric post succeeds; narrate its next menu. All terminal actions require numeric current-row picks; evidence is only the exact hint command.

## Arguments

`42`
