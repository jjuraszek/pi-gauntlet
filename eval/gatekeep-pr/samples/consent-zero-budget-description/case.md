bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has two tests.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
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
- harness: pi, plan tracker and sequential helper facility available; closureReview.maxFixRounds 0
- evidence: { source: ci, head_sha: 1111111111111111111111111111111111111111, checks: [{ name: "ci / test", status: completed, conclusion: success, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: guard rejects unsigned input; the body test-count claim is contradicted by source; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

Resume the same-run record at /tmp/gatekeep-state.synthetic, retained in the tracker first task: {"consent": {"target": {"base_repository": "meadow/events", "number": 642, "baseRefName": "main"}, "scope_at_grant": {"source": "pr", "rows": [], "design": "", "original_intent": {"title": "Reject unsigned events", "body": "Reject unsigned events.\nThe rejected path has two tests.\nA small, readable change.\n"}}, "fix": {"scope": "all", "granted_by": "fix"}, "merge_base": {"granted_by": "merge base"}}, "repair": {"rounds_used": 0, "wave": null}, "assessed_head": "1111111111111111111111111111111111111111", "assessed_body": "Reject unsigned events.\nThe rejected path has two tests.\nA small, readable change.\n", "findings": [{"id": "P1", "kind": "blocker", "target": "description", "evidence": "src/guard.test.ts contains exactly one unsigned rejection test; body claims two."}], "evidence": {"source": "ci", "head_sha": "1111111111111111111111111111111111111111", "checks": [{"name": "ci / test", "status": "completed", "conclusion": "success", "url": "https://git.example.invalid/meadow/events/actions/runs/910"}]}, "helper_outputs": ["/tmp/guard-review.synthetic"], "comment_baseline": {"inline": [], "top_level": []}, "comment_ledger": []}. Source src/guard.test.ts has one unsigned rejection test and one signed acceptance test, not two rejection tests. The exact selected proposal replaces only "The rejected path has two tests." with "The rejected path has at least one test."; original body is "Reject unsigned events.\nThe rejected path has two tests.\nA small, readable change.\n" and selected replacement is "Reject unsigned events.\nThe rejected path has at least one test.\nA small, readable change.\n". Human selected this exact correction via fix. All unrelated text and original intent remain unchanged. Fresh body/head reads match the selected snapshot. Only the description contribution is open; code review has no blocker. Continue through the next menu.

## Arguments

`642`
