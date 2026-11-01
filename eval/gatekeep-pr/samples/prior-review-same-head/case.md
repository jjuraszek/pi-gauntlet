bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
## Digest

- pr: { number: 42, title: "Reject unsigned events", body: "Reject unsigned events.", author: { login: river-example }, state: OPEN, isDraft: false, headRefName: feature/guard, baseRefName: main, headRefOid: 2222222222222222222222222222222222222222, mergeable: MERGEABLE, mergeStateStatus: CLEAN, reviewDecision: CHANGES_REQUESTED }
- base_repository: acme/widgets; viewer: { login: delta-example, is_author: false, role: none }; permissions: { viewer_permission: WRITE, head_pushable: true, merge_state_status: CLEAN, head_url: git@git.example.invalid:acme/widgets.git, head_ref: feature/guard }
- scope: { source: pr, rows: [], design: "", original_intent: { title: "Reject unsigned events", body: "Reject unsigned events." } }; issue: null, issue_note: no reference found
- worktree: /work/widgets-pr-42, tracked-clean, HEAD equals gathered head, no unpushed commits; primary /work/widgets
- configuration: verification command `node --test`; closureReview.maxFixRounds 5; timeout 15 minutes; merge policy squash; fresh sequential helpers available; no --rebase
- status_checks: [{ name: "ci / test", kind: check_run, status: completed, conclusion: success, url: "https://github.com/acme/widgets/actions/runs/910", workflowName: ci }]; actions_runs: [{ databaseId: 910, status: completed, conclusion: success, workflowName: ci }]; all on the gathered head
- gh api user --jq .login: delta-example
- gh api repos/acme/widgets/pulls/42/reviews --paginate returns [{ id: 702, user: { login: delta-example }, state: CHANGES_REQUESTED, submitted_at: "2026-10-29T10:00:00Z", commit_id: "2222222222222222222222222222222222222222", body: "1. The CI test check is still red. Supply a passing run for this head. (ci / test)\n2. The retry path bypasses signature validation. Validate retries too. (src/caller.mjs:19)" }]
- comments.inline, comments.top_level and review_threads are empty.
- git merge-base --is-ancestor 2222222222222222222222222222222222222222 2222222222222222222222222222222222222222 exits 0; the selected review commit is exactly the assessed head. No commits or code changes have occurred since that review. The CI rerun became green without a commit.
- git diff --name-only --no-renames origin/main...2222222222222222222222222222222222222222 returns src/guard.mjs and src/caller.mjs. The gathered whole PR patch exists but contains no changes since the selected review.
- Verifier result: source ci on 2222222222222222222222222222222222222222; the material claim is matched, no contract findings.
- Reviewer result: R1: resolved; R2: open - retries still bypass the guard. Native report lists the retry bypass at src/caller.mjs:19 and no new findings. These are explicit closure results from checking the current head and green CI, not a conclusion inferred from an empty delta.
- simulations: snapshots and helpers are hypothetical, not live operations. All omitted reads retain this exact head/body/check state. No writes or menu pick occur.

## Entry

Start just after provisioning's HEAD check with the gathered REST rows above. Narrate selection, ancestry, sequential verification and review through the first report/menu. Show the previous-report item ids, the complete Fix delta content, the task's review scope and closure instructions on both pi and Claude Code (use pi for helper calls), the integrated prior-item states and the report. Stop at the first menu.

Then narrate one independent same-head checkpoint with fresh ledgers: replace review 702's second body item with "2. The PR description promises retries are validated, but the code deliberately rejects retries. Correct the description. (PR description)". The description was corrected without a commit to the current body "Reject unsigned events."; the scope's stored original intent and the verifier's matched claim are unchanged. The reviewer now returns R1: resolved and R2: resolved with no findings, and GitHub's reviewDecision is APPROVED. Keep the same review commit, assessed head and green CI. Show this checkpoint's closure mapping and first report/menu too.

## Arguments

`42`
