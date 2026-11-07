# Sample: bypass-eligible-check-pending

Render the report and menu from this synthetic snapshot. Use no tools, perform no merge, and do not invent a numeric pick. This fixture tests the instruction contract, not live non-admin GitHub behavior.

## Digest

```text
- pr: { number: 42, title: "Retry feed fetch once", body: "Adds a bounded retry with tests.", author: robin, author_is_bot: false, state: OPEN, isDraft: false, headRefName: retry-feed, baseRefName: main, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: BLOCKED, headRefOid: abc1234, reviewDecision: REVIEW_REQUIRED, review_requests: [] }
- viewer: { login: robin, is_author: true, role: author }
- permissions: { viewer_permission: MAINTAIN, merge_state_status: BLOCKED, bypass_eligible: true, can_update_branch: true, head_url: https://github.com/acme/widgets.git, head_ref: retry-feed, head_pushable: true }
- status_checks:
  - { name: test, kind: check_run, status: completed, conclusion: success, required: true, url: https://github.com/acme/widgets/actions/runs/701/job/1, workflowName: CI }
  - { name: e2e, kind: check_run, status: in_progress, conclusion: null, required: true, url: https://github.com/acme/widgets/actions/runs/702/job/2, workflowName: E2E }
- actions_runs:
  - { databaseId: 701, status: completed, conclusion: success, workflowName: CI, url: https://github.com/acme/widgets/actions/runs/701 }
  - { databaseId: 702, status: in_progress, conclusion: null, workflowName: E2E, url: https://github.com/acme/widgets/actions/runs/702 }
- comments: { inline: [], top_level: [] }
- course: null
- repair: { rounds_used: 0, rounds_cap: 10, syncs_used: 0, syncs_cap: 10 }
```

Pre-menu refresh succeeded on abc1234; the matching fixed GraphQL query returned viewerCanMergeAsAdmin true. The tracked-clean worktree matches the remote head, merge policy is squash and allow_squash_merge is true. Every material claim is matched, source review is complete, no comment delta, blockers, nits, or replies remain. No prior review; scope source is pr. Helpers are available, maxFixRounds is 5. All merge prerequisites other than the pending check and its unresolved evidence hold. Resolve the evidence source from the digest, not from the completed test check alone. Stop at the first menu with course unset.
