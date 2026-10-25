bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
- base_repository: meadow/events
- viewer: { login: "river-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:meadow/events.git, head_ref: feature/event-guard, head_pushable: true }
- status_checks: [ { name: "ci / test", kind: check_run, status: IN_PROGRESS, conclusion: null, required: true, url: https://git.example.invalid/meadow/events/actions/runs/910 } ]
- actions_runs: [ { databaseId: 910, status: in_progress, conclusion: null, workflowName: ci } ]
- comments: { inline: [], top_level: [], review_threads: [] }
- issue_ref: null; issue: null
- scope: { source: pr, path: null, rows: [], design: "", cross_check: "not run: no reference found" }; original stated intent is to reject unsigned events
- worktree: .worktrees/pr-642 provisioned, clean, HEAD == headRefOid
- configuration from merge-base overrides: verification command `node --test src/guard.test.ts`; scoped fix command `node --test src/guard.test.ts`; requires credentials false; timeout minutes 15; merge policy squash
- harness: pi, plan tracker and sequential helper facility available; closureReview.maxFixRounds 3
- evidence: { source: pending, head_sha: 1111111111111111111111111111111111111111, checks: [{ name: "ci / test", status: in_progress, conclusion: null, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: no code blocker; N1 open for a redundant local variable; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

One prior report rendered. Resume the same-run record at /tmp/gatekeep-state.synthetic, retained in the tracker first task, for meadow/events PR 642, main. Course is null; repair.rounds_used 0, repair.poll_deadline null; assessed_head and assessed_body match the Digest and original intent is the Digest title/body. Blockers are empty; N1 is open. At the pre-menu refresh ci / test is IN_PROGRESS. Independent completed-failure snapshot, not the result of an authorized watch: rollup shows ci / test COMPLETED FAILURE, run 910 completed with conclusion failure. `gh run view 910 --log-failed` prints `FAIL src/guard.test.ts > rejects unsigned (expected 401, got 200)`. Continue through the next menu without selecting a repair.

## Arguments

`642`
