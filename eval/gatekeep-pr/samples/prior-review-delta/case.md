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
- gh api repos/acme/widgets/pulls/42/reviews --paginate returns these complete REST rows in API order:
  - { id: 700, user: { login: delta-example }, state: COMMENTED, submitted_at: "2026-10-28T10:00:00Z", commit_id: "0000000000000000000000000000000000000000", body: "An older note." }
  - { id: 702, user: { login: delta-example }, state: CHANGES_REQUESTED, submitted_at: "2026-10-29T10:00:00Z", commit_id: "1111111111111111111111111111111111111111", body: "1. The guard accepts an empty signature. Reject it before parsing. (src/guard.mjs:8)\n2. The caller bypasses the guard for retries. Validate retries too. (src/caller.mjs:19)" }
  - { id: 701, user: { login: delta-example }, state: APPROVED, submitted_at: "2026-10-29T10:00:00Z", commit_id: "0000000000000000000000000000000000000000", body: "Lower id at the same timestamp." }
  - { id: 703, user: { login: another-example }, state: CHANGES_REQUESTED, submitted_at: "2026-10-30T10:00:00Z", commit_id: "2222222222222222222222222222222222222222", body: "Another human's review." }
  - { id: 704, user: { login: delta-example }, state: DISMISSED, submitted_at: "2026-10-30T11:00:00Z", commit_id: "2222222222222222222222222222222222222222", body: "Dismissed review." }
  - { id: 705, user: { login: delta-example }, state: PENDING, submitted_at: "2026-10-30T12:00:00Z", commit_id: "2222222222222222222222222222222222222222", body: "Pending draft." }
  - { id: 706, user: { login: delta-example }, state: COMMENTED, submitted_at: null, commit_id: "2222222222222222222222222222222222222222", body: "Unsubmitted note." }
- comments.inline in API order: [{ id: 801, pull_request_review_id: 702, path: "src/caller.mjs", original_line: 24, body: "The fallback skips validation. Use the same guard.", user_type: User, updated_at: "2026-10-29T10:00:00Z" }, { id: 802, pull_request_review_id: 700, path: "src/guard.mjs", original_line: 6, body: "Older review's inline note.", user_type: User, updated_at: "2026-10-28T10:00:00Z" }]; comments.top_level and review_threads empty
- git merge-base --is-ancestor 1111111111111111111111111111111111111111 2222222222222222222222222222222222222222 exits 0; no stderr; all commits are local
- git diff --name-only --no-renames origin/main...1111111111111111111111111111111111111111 returns src/guard.mjs, src/caller.mjs, src/legacy-helper.mjs
- git diff --name-only --no-renames origin/main...2222222222222222222222222222222222222222 returns src/guard.mjs, src/caller.mjs
- git rev-list --reverse --merges 1111111111111111111111111111111111111111..2222222222222222222222222222222222222222 returns no commits
- git diff 1111111111111111111111111111111111111111 2222222222222222222222222222222222222222 -- src/guard.mjs src/caller.mjs src/legacy-helper.mjs shows the empty-signature rejection in src/guard.mjs and removal of the earlier PR's src/legacy-helper.mjs addition (restored to base); caller code is unchanged
- Verifier result: source ci on 2222222222222222222222222222222222222222; the material claim is matched
- Reviewer result: R1: resolved; R2: open - retries still bypass the guard; R3: open - fallback still skips validation. Native findings list these two remaining code gaps as Moderate; no other findings. Any returned R ids are the call-time ids, not generic new findings.
- simulations: snapshots and helpers are hypothetical, not live operations. All omitted reads retain this exact head/body/check state. No writes or menu pick occur.

## Entry

Start just after provisioning's HEAD check with the complete gathered REST rows above. Narrate selection and the ancestry check, then verification and review through the first report/menu. Show the previous-report item ids, the delta commands and task instructions, and the addressed-items report line. State how the same task contract is supplied on pi and Claude Code; use pi for this narration's actual helper calls.

## Arguments

`42`
