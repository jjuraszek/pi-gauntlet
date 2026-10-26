bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 2222222222222222222222222222222222222222, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
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
- evidence: { source: pending, head_sha: 2222222222222222222222222222222222222222, checks: [{ name: "ci / test", status: in_progress, conclusion: null, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: P1 remains open; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

A prior report rendered. A delivery iteration pushed head 2222222222222222222222222222222222222222. The same-run record at /tmp/gatekeep-state.synthetic is retained in the tracker first task for meadow/events PR 642, main, with course deliver, repair.rounds_cap 6, repair.syncs_used 0, repair.syncs_cap 6, repair.rounds_used 1, repair.poll_deadline null, and assessed_head equal to the new pushed head. Original intent is the Digest title/body. Blockers: P1 remains open; the implementer returned `open - needs src/guard.ts outside the diff` and the reviewer's closure line carried it unchanged. All other findings closed. CI is IN_PROGRESS on the new head. Continue through the next menu.

## Arguments

`642`
