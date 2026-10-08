## Digest

- pr: { number: 517, title: "Export reports as CSV", author: "tomas-vik", state: OPEN, isDraft: false, headRefName: feature/csv-export, baseRefName: main, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRefOid: a9c1e3f5b7d9e1a3c5f7b9d1e3a5c7f9b1d3e5a7, files: [src/api/export.ts, src/api/export.test.ts, docs/exports.md] }
- viewer: { login: "tomas-vik", is_author: true }
- permissions: { viewer_permission: WRITE, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: CLEAN, can_update_branch: true, head_url: git@git.example.invalid:orchard/reports.git, head_ref: feature/csv-export, head_pushable: true }
- status_checks: [ { name: "ci / test", status: COMPLETED, conclusion: SUCCESS, required: true } ]
- actions_runs: [ { databaseId: 9102, status: completed, conclusion: success, workflowName: "ci" } ]
- comments: { inline: [], top_level: [] }
- issue_ref: null
- scope: source pr; the PR body states the intent "export the reports page as CSV on demand"
- worktree: .worktrees/pr-517 provisioned, HEAD == headRefOid, clean
- harness: pi with the subagent facility; closureReview.maxFixRounds 3; timeout minutes 15
- verify helper: source ci, every material claim matched
- review helper: no Critical or Moderate finding; three Minor findings - the export loop re-implements the shared paging helper (src/api/export.ts:31), a variable named `tmp2` (src/api/export.ts:40), and a doc label "CSV-Export" where the page says "CSV export" (docs/exports.md:12)

## Arguments

`517`
