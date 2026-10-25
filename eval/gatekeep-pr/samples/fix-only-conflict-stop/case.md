bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
- base_repository: meadow/events
- viewer: { login: "river-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:meadow/events.git, head_ref: feature/event-guard, head_pushable: true }
- status_checks: [ { name: "ci / test", kind: check_run, status: COMPLETED, conclusion: SUCCESS, required: true, url: https://git.example.invalid/meadow/events/actions/runs/910 } ]
- actions_runs: [ { databaseId: 910, status: completed, conclusion: success, workflowName: ci } ]
- comments: { inline: [], top_level: [], review_threads: [] }
- issue_ref: null; issue: null
- scope: { source: pr, path: null, rows: [], design: "", cross_check: "not run: no reference found" }; original stated intent is to reject unsigned events
- worktree: .worktrees/pr-642 provisioned, clean, HEAD == headRefOid
- configuration from merge-base overrides: verification command `node --test src/guard.test.ts`; scoped fix command `node --test src/guard.test.ts`; requires credentials false; timeout minutes 15; merge policy squash
- harness: pi, plan tracker and sequential helper facility available; closureReview.maxFixRounds 3
- evidence: { source: ci, head_sha: 1111111111111111111111111111111111111111, checks: [{ name: "ci / test", status: completed, conclusion: success, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: guard rejects unsigned input; no failing checks or scope gap; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

Initial rows assess=1, deliver=2, stop=3 were rendered; human selected `2`. Retain course deliver, repair.rounds_used 1, rounds_cap 6, syncs_used 0, syncs_cap 6 after P1 empty-signature blocker was repaired, reviewed and pushed. Main advances and forge reports CONFLICTING. Fresh sync helper resolves, fresh review is clean, checked push yields 2222222222222222222222222222222222222222, CI succeeds and all claims match. Continue without another menu until final, then stop without selecting merge.

## Arguments

`642`
