# Sample: exempt-viewer-status-pending

Gather digest for a pull request on `harborline/tidewatch`; the gate is at step 5-6 with Verify (step 3) not yet resolved - resolve Section B's Evidence resolution table from `status_checks`, `actions_runs`, and `permissions.merge_state_status` below, then render the report and the menu.

## Digest

```text
- pr: { number: 412, title: "Retry tide-feed fetch on 503 (ref TW-88)", body: "Adds one bounded retry to the tide-feed client. Tests cover the retry path.", author: tlindqvist, author_is_bot: false, state: OPEN, isDraft: false, headRefName: tlindqvist/tw-88-retry, baseRefName: main, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: UNSTABLE, headRefOid: 9c1e4f2, headRepository: harborline/tidewatch, maintainerCanModify: true, files: [src/feed/client.ts, test/feed/client.test.ts], additions: 41, deletions: 3, reviewDecision: REVIEW_REQUIRED }
- viewer: { login: rhee-ops, is_author: false }
- permissions: { viewer_permission: MAINTAIN, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: UNSTABLE, can_update_branch: true, head_url: https://github.com/harborline/tidewatch.git, head_ref: tlindqvist/tw-88-retry, head_pushable: true }
- status_checks:
  - { name: "test_unit", kind: check_run, status: completed, conclusion: success, required: true, url: https://github.com/harborline/tidewatch/actions/runs/7001/job/1, workflowName: "tidewatch CI" }
  - { name: "build_image", kind: check_run, status: completed, conclusion: success, required: true, url: https://github.com/harborline/tidewatch/actions/runs/7001/job/2, workflowName: "tidewatch CI" }
  - { name: "lint", kind: check_run, status: completed, conclusion: skipped, required: false, url: https://github.com/harborline/tidewatch/actions/runs/7001/job/3, workflowName: "tidewatch CI" }
  - { name: "crew-approval", kind: status_context, status: pending, conclusion: null, required: true, url: https://github.com/harborline/tidewatch/actions/runs/7002, workflowName: null }
- actions_runs:
  - { databaseId: 7001, status: completed, conclusion: success, workflowName: "tidewatch CI", url: https://github.com/harborline/tidewatch/actions/runs/7001 }
- comments: { inline: [], top_level: [], review_threads: [] }
- issue_ref: null
- issue: null
- issue_note: no reference found
- worktree_discovery: { expected_path: .worktrees/pr-412, exists: true, branch: tlindqvist/tw-88-retry, dirty: false, ahead: 0, behind: 0 }
- truncation_notes: []
```

## Step 4 reviewer output

```text
verdict: SHIP
Critical: none
Moderate: none
Minor: none
claims: [ { claim: "Tests cover the retry path", disposition: matched, evidence: "test/feed/client.test.ts:12-40 exercises the 503 retry" } ]
```
