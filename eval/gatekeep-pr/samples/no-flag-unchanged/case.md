## Digest

- pr: { number: 412, title: "Round ledger totals half-up", author: "mara-lindqvist", state: OPEN, isDraft: false, headRefName: feature/ledger-rounding, baseRefName: main, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: BEHIND, headRefOid: 7c1e9a2f4b0d6e8a1c3f5b7d9e0a2c4e6f8a0b1c, files: [src/ledger/round.ts, src/ledger/round.test.ts, docs/rounding.md] }
- viewer: { login: "mara-lindqvist", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: BEHIND, can_update_branch: true, head_url: git@git.example.invalid:orchard/ledger.git, head_ref: feature/ledger-rounding, head_pushable: true }
- status_checks: [ { name: "ci / test", status: COMPLETED, conclusion: SUCCESS, required: true } ]
- actions_runs: [ { databaseId: 9001, status: completed, conclusion: success, workflowName: "ci" } ]
- comments: { inline: [ { id: 501, user_type: User, body: "Prefer bankers rounding here?" } ], top_level: [] }
- issue_ref: gh-388
- worktree: .worktrees/pr-412 provisioned, HEAD == headRefOid, clean
- base: origin/main at 3f0b8d2e1a7c4f6b9d0e2a4c6e8f0a1b3c5d7e9f, head is 4 commits behind; origin/release/2 exists at 5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b
- head commits: 4, none a merge commit
- rebase onto the named base: completes without a conflict stop
- harness: pi with the subagent facility; closureReview.maxFixRounds 3; timeout minutes 15
- after a push: the pushed head gets one check "ci / test" that completes SUCCESS within the poll window

## Arguments

`412`
