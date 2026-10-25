bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 1111111111111111111111111111111111111111, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: CLEAN, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
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
- evidence: { source: pending, head_sha: 1111111111111111111111111111111111111111, checks: [{ name: "ci / test", status: in_progress, conclusion: null, url: https://git.example.invalid/meadow/events/actions/runs/910 }] }
- source review: guard rejects unsigned input; no failing checks or scope gap; no comment reply selected
- simulations: all forge reads, writes, helper results and file operations below are hypothetical. No live PR exists. Unspecified reads keep the last supplied state; unspecified helper results are clean, synchronous, committed for selected file repairs, and read-only for reviews.

## Entry

Resume the same-run record at /tmp/gatekeep-state.synthetic, retained in the tracker first task: {"consent": {"target": {"base_repository": "meadow/events", "number": 642, "baseRefName": "main"}}, "repair": {"rounds_used": 0, "wave": null, "rounds_cap": 6, "syncs_used": 0, "syncs_cap": 6, "poll_deadline": null}, "assessed_head": "1111111111111111111111111111111111111111", "assessed_body": "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n", "findings": [], "evidence": {"source": "pending", "head_sha": "1111111111111111111111111111111111111111", "checks": [{"name": "ci / test", "status": "in_progress", "conclusion": null, "url": "https://git.example.invalid/meadow/events/actions/runs/910"}]}, "helper_outputs": ["/tmp/guard-review.synthetic"], "comment_baseline": {"inline": [], "top_level": []}, "comment_ledger": [], "scope": {"source": "pr", "rows": [], "design": "", "original_intent": {"title": "Reject unsigned events", "body": "Reject unsigned events.\nThe rejected path has a test.\nA small, readable change.\n"}}, "course": null}. Current forge reads return the same head/body, ci / test IN_PROGRESS with null conclusion and matching run 910 in_progress with null conclusion on that head. No reviewer work or code blocker exists. Verification evidence is pending on this head, not successful; no local fallback result is supplied. Course is null. No numeric deliver selection exists and no poll window has been started. Continue through the next menu.

## Arguments

`642`
