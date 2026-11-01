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
- git rev-list --first-parent --reverse --merges 1111111111111111111111111111111111111111..2222222222222222222222222222222222222222 returns no commits
- git diff 1111111111111111111111111111111111111111 2222222222222222222222222222222222222222 -- src/guard.mjs src/caller.mjs src/legacy-helper.mjs shows the empty-signature rejection in src/guard.mjs and removal of the earlier PR's src/legacy-helper.mjs addition (restored to base); caller code is unchanged
- Verifier result: source ci on 2222222222222222222222222222222222222222; the material claim is matched. Whole-head doc drift: docs/validation.md:12 still promises that empty signatures are accepted, contradicting the new rejection; the doc line is outside the fix delta.
- Reviewer result: R1: resolved; R2: open - retries still bypass the guard; no R3 closure line. Native findings list the retry bypass as Minor and the fallback bypass as Moderate. Any returned R ids are the call-time ids, not generic new findings. Additional independent findings, none matching prior items:
  - [Moderate] (outside fix delta): the unchanged retry counter can overflow at src/caller.mjs:32.
  - [Minor] (outside fix delta): the unchanged retry label is misspelled at src/caller.mjs:35.
  - [Critical] (outside fix delta): the unchanged debug branch exposes the signing key at src/caller.mjs:40.
  - [Moderate] (inside fix delta): the new rejection path leaks its buffer at src/guard.mjs:12.
  - [Minor] (inside fix delta): the new rejection message says signatuer at src/guard.mjs:13.
- The caller findings are in the union path set but outside all supplied delta hunks. No REVIEW.md severity override is present.
- Integration checkpoint: no P or L ids exist before step 5. Comment 801 is C1, initially triaged reasonable with a drafted reply; comment 802 is C2, initially already-addressed with its own reply. Re-integrate the same reviewer output once and re-triage the unchanged comments once before the report; no source delta or additional helper run occurs.
- simulations: snapshots and helpers are hypothetical, not live operations. All omitted reads retain this exact head/body/check state. No writes or menu pick occur.

## Entry

Keep the complete narration under 1500 words across all checkpoints; show shared task rules once, summarize helper dispatches, and show compact reports without repeating evidence prose. Start just after provisioning's HEAD check with the complete gathered REST rows above. Narrate selection and the ancestry check, then verification and review through the first report/menu. Show the previous-report item ids, the delta commands and task instructions, the internal R-to-P and C ledger states after integration and re-triage, the retained show-evidence diagnostics (including each evidence-only finding), and the addressed-items report line. Integrate every supplied new finding and the whole-head doc drift before rendering. State how the same task contract is supplied on pi and Claude Code; use pi for this narration's actual helper calls.

## Own-PR checkpoint

After the first scenario, narrate this independent run with fresh ledgers and no writes. Keep the same head, configuration and CI evidence, but set viewer to river-example, is_author true, role author. Replace the REST reviews with [{ id: 710, user: { login: river-example }, state: COMMENTED, submitted_at: "2026-10-30T10:00:00Z", commit_id: "1111111111111111111111111111111111111111", body: "1. The caller bypasses the guard for retries. Validate retries too. (src/caller.mjs:19)" }]. Replace inline comments with [{ id: 810, pull_request_review_id: 710, path: "src/guard.mjs", original_line: 8, body: "Reject an empty signature before parsing.", user_type: User, updated_at: "2026-10-30T10:00:00Z" }]. The ancestor check, path union and delta commands have the same results as above. The whole-head contract and claim checks are clean. Reviewer returns only R1: open - retries still bypass the guard; R2: resolved; the native retry finding is Minor. Show the selected baseline, bounded task, closure mapping, C ledger and report/menu for this run; do not carry the first scenario's unrelated findings or counters into it.

## Delivery checkpoint

Return to the first scenario's first report and its ledgers, not the independent own-PR run. The human picks `deliver`. P1 is the id minted from review 702's open R2 retry bypass at src/caller.mjs:19; P2 is the id minted from R3's fallback bypass at src/caller.mjs:24. Narrate hypothetical delivery, not live operations. The P1 implementer repairs retries in one source-changing commit and passes its scoped test; the P2 implementer returns open - needs an external dependency, with no commit and a clean tree. The other independent blockers receive successful repairs and exact-head resolved reviewer closures. The pre-push wave reviewer receives P1 and P2, not R2 and R3, under Previous review report and git diff 2222222222222222222222222222222222222222 HEAD under Fix delta; it returns P1: resolved and P2: open - fallback still skips validation (Minor, no Critical or Moderate carried item). Its closures bind to local HEAD 5555555555555555555555555555555555555555. The ordinary push lands at that head; refreshed CI is green, comments and selected review 702 are unchanged. No new ancestor step-4 review runs after this own push. Show the recorded R2 closure from P1, then the re-rendered report with Prior review: 2 of 3 items addressed, the R2 retry item absent from Blockers and the R3 fallback item still listed with its posted text and locator. Keep the wave's pushed_head boundary unchanged and count no closure from push success alone.

## Arguments

`42`
