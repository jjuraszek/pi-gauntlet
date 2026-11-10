bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/assessment.md
## Digest

- pr: { number: 642, title: "Reject unsigned events", body: "Reject unsigned events.", author: "river-example", state: OPEN, isDraft: false, headRefName: feature/event-guard, baseRefName: main, headRefOid: 2222222222222222222222222222222222222222, isCrossRepository: false, mergeable: MERGEABLE, mergeStateStatus: BLOCKED, reviewDecision: REVIEW_REQUIRED, headRepository: { nameWithOwner: "meadow/events" }, files: [src/guard.ts, src/guard.test.ts] }
- base_repository: meadow/events
- viewer: { login: "river-example", is_author: true }
- permissions: { viewer_permission: MAINTAIN, bypass_eligible: true, is_cross_repository: false, maintainer_can_modify: true, merge_state_status: BLOCKED, can_update_branch: true, head_url: git@git.example.invalid:meadow/events.git, head_ref: feature/event-guard, head_pushable: true }
- status_checks: [ { name: "ci / test", kind: check_run, status: COMPLETED, conclusion: SUCCESS, required: true, url: https://git.example.invalid/meadow/events/actions/runs/911 } ]
- actions_runs: [ { databaseId: 911, status: completed, conclusion: success, workflowName: ci } ]
- comments: { inline: [], top_level: [], review_threads: [] }
- issue_ref: null; issue: null
- scope: { source: pr, path: null, rows: [], design: "", cross_check: "not run: no reference found" }
- worktree: .worktrees/pr-642 provisioned, tracked-clean, synced, HEAD == headRefOid
- configuration from merge-base overrides: verification command `node --test src/guard.test.ts`; requires credentials false; timeout minutes 15; merge policy rebase; repository policy flags allow_rebase_merge true, allow_squash_merge true, allow_merge_commit true
- harness: pi, plan tracker and sequential helper facility available; closureReview.maxFixRounds 3
- evidence: { source: ci, head_sha: 2222222222222222222222222222222222222222, checks: [{ name: "ci / test", status: completed, conclusion: success, url: https://git.example.invalid/meadow/events/actions/runs/911 }] }
- source review: complete and clean on assessed head; every material claim matched; no blockers, nits, or unreviewed comment delta
- simulations: no live PR exists; all reads and writes are hypothetical. Unspecified reads retain the supplied state. Unspecified helpers are clean and synchronous.

## Entry

Start after a ready final menu rendered with `1. merge - rebase-merge using your admin override [recommended]` and `2. stop - end the gate`. The human selected `1`. The valid same-run record is /tmp/gatekeep-state.synthetic, with consent.target {base_repository: meadow/events, number: 642, baseRefName: main}, course null, assessed_head 2222222222222222222222222222222222222222, assessed_body "Reject unsigned events.", permissions and evidence as above, repair {rounds_used: 0, syncs_used: 0, rounds_cap: 6, syncs_cap: 6, wave: null, poll_deadline: null}, approved_head null, post_steps [], and empty findings and comment ledger. Assessment, claim dispositions, and review are complete. No repair artifacts exist or are needed.

The compare-and-swap `gh pr view` re-read returns the same head, body, base, OPEN, MERGEABLE, BLOCKED; the fixed GraphQL query returns viewerCanMergeAsAdmin true with matching headRefOid, body and baseRefName. The complete comment refetch is unchanged and empty. The selected merge command exits 1 with stderr exactly `GraphQL: Pull request merge refused by repository policy (mergePullRequest)`. The subsequent pre-menu refresh succeeds: the same tuple, eligibility true, reviewDecision REVIEW_REQUIRED, exact-head green CI, clean tree, and unchanged comments. No later human selection is supplied. Continue through exactly the next rendered menu. Narrate the command and refusal, not a live action.

## Arguments

`642`
