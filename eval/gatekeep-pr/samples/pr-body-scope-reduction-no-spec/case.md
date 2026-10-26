bundle-: skills/gatekeep-pr/reference/sync.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject every unsigned event using constant-time comparison.", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
- base_repository: meadow/events
- viewer: { login: "river-example", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:meadow/events.git, head_ref: feature/event-guard, head_pushable: true }
- status_checks: [ { name: "ci / test", kind: check_run, status: COMPLETED, conclusion: SUCCESS, required: true, url: https://git.example.invalid/meadow/events/actions/runs/910 } ]
- actions_runs: [ { databaseId: 910, status: completed, conclusion: success, workflowName: ci } ]
- comments: { inline: [], top_level: [], review_threads: [] }
- issue_ref: null; issue: null
- scope: { source: pr, path: null, rows: [], design: "", cross_check: "not run: no reference found" }; original stated intent is to reject every unsigned event using constant-time comparison
- worktree: .worktrees/pr-642 provisioned, clean, HEAD == headRefOid
- configuration from merge-base overrides: verification command `node --test src/guard.test.ts`; scoped fix command `node --test src/guard.test.ts`; requires credentials false; timeout minutes 15; merge policy squash
- harness: pi, plan tracker and sequential helper facility available; closureReview.maxFixRounds 3
- evidence: { source: ci, head_sha: 1111111111111111111111111111111111111111, checks: [{ name: "ci / test", status: completed, conclusion: success, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: src/guard.ts accepts unsigned arrays and compares signatures with ordinary equality; P1 missing unsigned-event rejection behavior and P2 missing constant-time comparison mechanism are source-verified scope gaps; no failing checks; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

No spec applies. Original assessment body: "Reject every unsigned event using constant-time comparison." Original title: "Reject unsigned events". Current source accepts unsigned arrays and compares signatures with ordinary equality. P1 missing behavior and P2 missing mechanism are source-verified. Human selects numeric 2 (deliver, from initial assess=1, deliver=2, stop=3) after seeing a proposed deletion of "using constant-time comparison". An external description write/readback then removes that phrase without a contract amendment. The gate must not treat delivery selection or that body write as a scope amendment. Later head 2222222222222222222222222222222222222222 and body refresh contain only "Reject signed events." No contract amendment was selected. Continue through the later reassessment to its next menu.

## Arguments

`642`
