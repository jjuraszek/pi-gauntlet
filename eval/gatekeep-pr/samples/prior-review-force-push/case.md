bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
## Digest

- pr: { number: 42, title: "Reject unsigned events", body: "Reject unsigned events.", author: { login: river-example }, state: OPEN, isDraft: false, headRefName: feature/guard, baseRefName: main, headRefOid: 2222222222222222222222222222222222222222, mergeable: MERGEABLE, mergeStateStatus: CLEAN, reviewDecision: CHANGES_REQUESTED, reviews: [{ id: PRR_node42, author: { login: delta-example }, state: CHANGES_REQUESTED }] }
- base_repository: acme/widgets; viewer: { login: delta-example, is_author: false, role: none }; permissions: { viewer_permission: WRITE, head_pushable: true, merge_state_status: CLEAN, head_url: git@git.example.invalid:acme/widgets.git, head_ref: feature/guard }
- scope: { source: pr, rows: [], design: "", original_intent: { title: "Reject unsigned events", body: "Reject unsigned events." } }
- worktree: /work/widgets-pr-42, tracked-clean, HEAD equals gathered head, no unpushed commits; primary /work/widgets
- configuration: verification command `node --test`; closureReview.maxFixRounds 5; timeout 15 minutes; merge policy squash; fresh sequential helpers available; no --rebase
- status_checks: [{ name: "ci / test", kind: check_run, status: completed, conclusion: success, url: "https://github.com/acme/widgets/actions/runs/910", workflowName: ci }]; actions_runs: [{ databaseId: 910, status: completed, conclusion: success, workflowName: ci }]; all on the gathered head
- gh api user --jq .login: delta-example
- gh api repos/acme/widgets/pulls/42/reviews --paginate returns these complete REST rows:
  - { id: 702, user: { login: delta-example }, state: CHANGES_REQUESTED, submitted_at: "2026-10-29T10:00:00Z", commit_id: "1111111111111111111111111111111111111111", body: "1. The guard accepts an empty signature. Reject it before parsing. (src/guard.mjs:8)" }
  - { id: 705, user: { login: delta-example }, state: PENDING, submitted_at: "2026-10-30T12:00:00Z", commit_id: "2222222222222222222222222222222222222222", body: "Pending draft." }
  - { id: 706, user: { login: delta-example }, state: COMMENTED, submitted_at: null, commit_id: "2222222222222222222222222222222222222222", body: "Unsubmitted note." }
- comments.inline, comments.top_level and review_threads are empty.
- git diff origin/main...2222222222222222222222222222222222222222 supplies the current whole PR patch, including src/guard.mjs and src/caller.mjs. The patch is available independently of review 702's commit.
- Verifier result: source ci on 2222222222222222222222222222222222222222, material claim matched, no contract findings.
- Reviewer result for A and B: [Moderate] The retry path bypasses signature validation at src/caller.mjs:19. No other findings. Reviewer result for C is clean. No R closure lines are supplied in any checkpoint.
- simulations: snapshots and helpers are hypothetical, not live operations. All omitted reads retain this exact head/body/check state. No writes or menu pick occur.

## Entry

Three independent checkpoints start just after provisioning's HEAD check with the gathered REST rows above. Narrate selection, the ancestry decision, sequential verification and review, and the first report/menu for each. Show each digest delta value and the review task's diff boundary. Explain whether prior-item closure or ordinary whole-diff integration applies. Keep each checkpoint separate.

A: The selected review commit is local but was removed from the PR's ancestry by a force push. `git -C /work/widgets-pr-42 merge-base --is-ancestor 1111111111111111111111111111111111111111 2222222222222222222222222222222222222222` exits 1 with empty stderr. The branch and gathered head are already synced.

B: The selected review commit 1111111111111111111111111111111111111111 is absent locally. The same ancestry command exits 128; stderr line 1 is `fatal: Not a valid commit name 1111111111111111111111111111111111111111`; line 2 is `additional diagnostic details`. No operation supplies that old commit.

C: Review 702 has `commit_id: null` instead. All other REST fields and excluded rows are unchanged. Git has no review commit to check. The whole-diff reviewer is clean.

State the review boundary on both pi and Claude Code; use pi for these narrations' helper calls. Render one reason-bearing prior-review line in each report, with the supplied failure reason, and preserve the ordinary blocker severity in A and B. Stop at each first menu.

## Arguments

`42`
