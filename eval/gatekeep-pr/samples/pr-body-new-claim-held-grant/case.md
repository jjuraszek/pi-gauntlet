bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 2222222222222222222222222222222222222222, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
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
- evidence: { source: ci, head_sha: 2222222222222222222222222222222222222222, checks: [{ name: "ci / test", status: completed, conclusion: success, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: guard rejects unsigned input; no failing checks or scope gap; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

Same-run saved record {"consent": {"target": {"base_repository": "meadow/events", "number": 642, "baseRefName": "main"}}, "repair": {"rounds_used": 1, "wave": null, "rounds_cap": 6, "syncs_used": 0, "syncs_cap": 6, "poll_deadline": null}, "assessed_head": "1111111111111111111111111111111111111111", "assessed_body": "Reject unsigned events.\nA small, readable change.\n", "findings": [], "evidence": {"source": "ci", "head_sha": "1111111111111111111111111111111111111111", "checks": [{"name": "ci / test", "conclusion": "success"}]}, "helper_outputs": ["/tmp/guard-review.synthetic"], "comment_baseline": {"inline": [], "top_level": []}, "comment_ledger": [], "scope": {"source": "pr", "rows": [], "design": "", "original_intent": {"title": "Reject unsigned events", "body": "Reject unsigned events.\nA small, readable change.\n"}}, "course": "deliver"} at /tmp/gatekeep-state.synthetic has course deliver from the prior assessment at 1111111111111111111111111111111111111111. That assessment contained no test claim or description proposal. The authorized code repair was reviewed and pushed to 2222222222222222222222222222222222222222; refreshed CI is green as supplied in the digest. The post-push forge read returns the digest body, with the added sentence now newly claiming "The rejected path has a test."; source confirms only signed-input cases. P4 new description contradiction has exact proposal The rejected path has a test. -> The rejected path has no test.. No human has seen or selected this proposal. Continue to the next menu.

## Arguments

`642`
