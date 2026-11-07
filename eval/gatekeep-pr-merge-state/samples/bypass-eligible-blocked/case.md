# Sample: bypass-eligible-blocked

Render two independent final reports and menus from these synthetic snapshots, first A then B. Use no tools, perform no merge, and do not invent a numeric pick. These fixtures test the instruction contract, not live non-admin GitHub behavior.

## Shared snapshot

```text
- pr: { number: 42, title: "Retry feed fetch once", body: "Adds a bounded retry with tests.", author: robin, author_is_bot: false, state: OPEN, isDraft: false, headRefName: retry-feed, baseRefName: main, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: BLOCKED, headRefOid: abc1234, reviewDecision: REVIEW_REQUIRED }
- permissions: { viewer_permission: WRITE, merge_state_status: BLOCKED, can_bypass_merge: true, can_update_branch: true, head_url: https://github.com/acme/widgets.git, head_ref: retry-feed, head_pushable: true }
- status_checks: [ { name: test, kind: check_run, status: completed, conclusion: success, required: true, url: https://github.com/acme/widgets/actions/runs/701/job/1, workflowName: CI } ]
- actions_runs: [ { databaseId: 701, status: completed, conclusion: success, workflowName: CI, url: https://github.com/acme/widgets/actions/runs/701 } ]
- comments: { inline: [], top_level: [] }
- course: null
- repair: { rounds_used: 0, rounds_cap: 10, syncs_used: 0, syncs_cap: 10 }
```

Pre-menu refresh succeeded on abc1234; the matching fixed GraphQL query returned viewerCanMergeAsAdmin true. This is viewer-relative bypass eligibility, not repository admin status. The tracked-clean worktree matches the remote head, merge policy is squash and allow_squash_merge is true. Exact-head CI is sufficient; every material claim is matched, source review is complete, no comment delta, blockers, nits, or replies remain. No prior review; scope source is pr. All other merge prerequisites hold. Helpers are available.

## Snapshot A

Viewer is robin, is_author true, role author, viewer_permission WRITE.

## Snapshot B

Same readiness, but viewer is casey, is_author false, role requested reviewer, viewer_permission MAINTAIN. This viewer also has a fresh true bypass field. Approve is available.
