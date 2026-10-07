# gatekeep-pr: optional `--rebase [base]` sync before verification

> **Superseded by:** [doc/specs/2026-10-07-gatekeep-sync-scoped-test-failure.md](./2026-10-07-gatekeep-sync-scoped-test-failure.md) - Design `### reference/sync.md` "Conflict stop" and "Push" clauses and the edge-table row "implementer returns `open`, leaves residue, or unmerged paths remain", for the red-scoped-test case only

**Goal:** `/skill:gatekeep-pr <pr> --rebase [base]` rebases the PR head onto the fetched base, resolves rebase conflicts through a fresh implementer, has a fresh reviewer gate every rewritten head, lease-pushes, and only then verifies - so the first verdict reflects the current base instead of a stale head, while the orchestrator still never edits a tracked file and no push leaves without a review.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** #58
**Predecessor:** `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` - not superseded; its Phase 4 `deviates:` (no force-push menu row) stays true. This spec adds a pre-verification sync gated by an argument, not a menu row.

## Problem

Today's gate verifies the PR head as pushed. A head behind its base gets a verdict that does not reflect current `main`, and the operator's only ways to sync are the step-5 conflict rows (`update branch` as a forge merge commit, `merge base` through a helper), both of which fire after a menu pick and after a stale verdict was already rendered. The ticket records that the operator repeatedly spends a run's first messages steering the gate around this ordering gap (the 92-message / 86-session count is the reporter's private history, recorded here as motivation, not audited evidence).

The ticket's proposed shape - the orchestrator resolves rebase conflicts inline and a red-flag exception blesses it - was rejected in the questionary. The gh-57 guarantees (`fix-wave.md` line 3: every edit and commit belongs to a fresh helper; gh-57 spec line 3: a reviewer before every push) are not weakened by the ordering gap, and the ticket's reason for the exception ("no review comment exists yet") holds only for gate-created artifacts: step 1 already fetches the PR's pre-existing reviewer comments, and a rewritten head can leave their commit anchors outdated exactly as gh-57 spec line 53 feared.

Framing: pivoted to `--rebase` sync with helper-resolved conflicts - the pre-verification sync runs the rebase, lease push, and CI wait the ticket asks for; a conflict stop goes to a fresh implementer and a fresh reviewer gates every push; the orchestrator conflict-resolution red flag (`SKILL.md` line 67) stays unconditional.

Premise corrections carried from the questionary:

- `head_pushable` is declared in the step-1 digest schema but set in step 2 by a dry-run push probe after checkout (`reference/assessment.md` line 15, `verification-brief.md` line 66). The probe proves push, not force-push past branch protection; a server rejection on the lease push is a distinct outcome.
- "Nothing mutates before a menu pick" already has one exception: step 2 provisions and ff-syncs the worktree (`reference/assessment.md` line 3). The consent invariant is stated three times in `SKILL.md` (description line 3, intro line 10, red flag line 58) and once in `reference/assessment.md` line 3, not only in the conflict red flag.
- `eval/gatekeep-pr/` does not exist. "Existing eval samples pass unchanged" is vacuous; a new target needs at least five samples (`eval/README.md`).
- gh-57 limited force-push to own-repo-and-author (spec line 52). This spec keeps the ticket's `head_pushable` gate and adds an explicit confirmation when the token user is not the PR author.
- `gh pr update-branch --rebase` exists (forge-side rebase, fails on conflict). It cannot handle the conflicting case the ticket centers on and still rewrites history, so it is not used.
- `npm test` pins `skills/gatekeep-pr/SKILL.md` under 120 lines and the literal red-flag phrase `resolving a merge conflict itself` (`scripts/gatekeep-comment-reconcile.test.mjs` lines 74, 82); `scripts/ci.mjs` line 460 runs eval drivers from an explicit list, not by discovery.

## Acceptance criteria

Ticket #58, `Acceptance criteria`, rows verbatim:

- [ ] `/skill:gatekeep-pr <pr> --rebase` on a PR whose head is behind `origin/<target>` and conflict-free: after checkout the worktree head is the branch rebased onto the fetched target, the push uses `--force-with-lease=<head_ref>:<pre_head>`, and the verification evidence names the pushed SHA as the assessed head with a terminal CI state for it; report and verification use that head and supersede the head-dependent values the gather step collected (head SHA, mergeability, check summary).
  in-scope (reading: "terminal CI state" means the state step 3's existing first-pass poll resolves to within `timeout minutes`; a check still pending at the timeout renders the evidence row's `wait` overlay, never green - see Design, "Push and re-gather")
- [ ] `--rebase release-1.x` rebases onto `origin/release-1.x`; a bare `--rebase` rebases onto the PR's target branch (`baseRefName`).
  in-scope
- [ ] A PR with a known conflicting file under `--rebase`: the orchestrator resolves it before verification, the rebase completes, and the resolved file names appear in the report.
  deviates: a fresh implementer resolves each rebase stop and a fresh reviewer gates the push; the orchestrator runs only `rebase`, `rebase --continue`, `rebase --abort`, `reset --hard <pre_head>`, and the push (framing pivot, questionary). The rebase completing before verification and the resolved file names in the report are restated as Design clauses.
- [ ] `SKILL.md` `## Red flags` names the pre-verification sync as the only case where the orchestrator resolves a conflict and keeps forbidding it inside a fix wave.
  deviates: the orchestrator never resolves a conflict; the red flag at `SKILL.md` line 67 stays unconditional and its pinned phrase stays intact. `## Red flags` instead names `--rebase` as the one argument-granted mutation before a menu pick (Design, "Consent wording").
- [ ] Red CI on the pushed head does not trigger an automatic fix: verification records the failing checks and the menu offers `fix [recommended]`, capped by the existing fix-round setting.
  in-scope (reading: no automatic fix is the requirement; the `[recommended]` marker follows the existing menu rules unchanged - `verification-brief.md` line 142 recommends `fix` only when a drafted payload exists for the failure, and the consent table in `reference/decision-menu.md` keeps its author-dependent recommendation)
- [ ] `head_pushable` false with `--rebase`: the run stops after checkout with a report naming the reason; no rebase, no push.
  in-scope (`unreadable` stops the same way; the no-flag path's local-fix mode, `reference/decision-menu.md` line 73, is unchanged)
- [ ] A rejected lease push (the remote head moved since the run started) stops the run with the reason; no retry.
  in-scope (the worktree is restored to `<pre_head>` before the stop; the stop offers `stop` and `show evidence` only)
- [ ] A head already up to date with the target under `--rebase` skips the push and continues to verification.
  in-scope
- [ ] The pushed head's checks resolve through the existing evidence table exactly as a fix-wave push does (poll 30s for `timeout minutes`, then the row: CI-sufficient, Pending with the `wait` overlay, Fallback local run when no checks exist) - the sync adds no new wait rule and never treats pending or absent checks as green (pointer: `verification-brief.md` Section B, row `Fix wave`).
  in-scope (reading: the three evidence rows and the poll cadence apply; the sync runs no poll of its own, step 3's first pass is the single poll window, and the `Fix wave` row's own-push `### Re-render` sequence does not apply because step 3 has not run yet)
- [ ] Without `--rebase`, the run performs no additional fetch, rebase, or push before a menu pick; existing eval samples pass unchanged.
  deviates: the first clause is in-scope and restated in Design; `eval/gatekeep-pr/` does not exist, so there are no existing samples - the new target's baseline run on the pre-edit wording is the record that the no-flag path is unchanged (sample `no-flag-unchanged`).
- [ ] `eval/gatekeep-pr/` gains passing samples for: the conflict-free sync (rebase, push, terminal-CI evidence precede verification), the conflicting-file sync (resolved names in the report), the red-CI path (menu offers `fix`, no auto-fix), and the `head_pushable` stop (reason reported, no rebase, no push).
  in-scope (the four named samples plus three more, see Tests)

## Design

### Arguments

The frontmatter `argument-hint` becomes `"<pr> [issue-ref] [--rebase [base]]  (e.g. 123, 123 gh-45, 123 --rebase, 123 gh-45 --rebase release/2)"`. `## Arguments` gains one paragraph: `--rebase` is parsed after `<pr> [issue-ref]`; the token after it, when present, is the base branch name (so `123 --rebase gh-45` means base `gh-45`, not an issue ref); absent, the base is the digest's `baseRefName`. The base is validated after step 2's fetch: no `origin/<base>` stops with a one-line error before any write.

Without `--rebase` the skill's behavior is unchanged: no additional fetch, rebase, or push before a menu pick, and no sync line in the brief or report.

### Step table

`SKILL.md` `## Steps` gains one row between Provision and Verify:

| # | Step | Read now | Output |
|---|---|---|---|
| 2b | Sync (only with `--rebase`) | `reference/sync.md` | the PR worktree on the rebased, pushed head with a refreshed digest, or a `sync` record and the unsynced head |

`## Progress tracking` inits four stages when `--rebase` is present (`gather, provision, sync, verify, ...`), three otherwise. The `sync` stage closes before step 3 starts: `complete` when the head was rebased and pushed or was already current (`no-op`); `skipped` when the sync was declined or failed and step 3 runs unsynced; `failed` on a terminal stop (non-pushable head, missing base, helper facility unavailable, a git error in a precondition, baseline mismatch, lease refused). Step 3 never starts behind a pending or failed `sync` stage. The re-entry rule under `## Steps` gains: a loop re-entry never re-runs step 2b; the sync runs once per invocation. `SKILL.md` stays under 120 lines.

### Consent wording

The consent statements name the exception in one clause each: `SKILL.md` description line 3 ("every mutation ... waits for an explicit menu pick, except the sync `--rebase` asks for"), intro line 10 ("steps 1-5 read, provision a worktree, run the `--rebase` sync when asked, and draft"), red flag line 58 ("Any mutation ... without an explicit menu pick or the `--rebase` argument"), and `reference/assessment.md` line 3 ("the orchestrator's only mutation before the menu, besides the `--rebase` sync of step 2b"). The red flag forbidding an open-PR menu without `fix` gains the sync terminal stop as a second exception beside the conflict menu (`stop` and `show evidence` only, `reference/sync.md`). Red flag line 67 (orchestrator resolving a conflict) is untouched.

`reference/fix-wave.md` is not loaded during the sync and is not edited; `reference/sync.md` states its own permitted git writes, its own reviewer dispatch, and borrows nothing by pointer from the fix wave.

### `reference/sync.md`

A new sibling, about sixty lines, loaded only by step 2b. One reference per mutating step is the skill's layout (`assessment.md` for step 2, `fix-wave.md` for step 5); `fix-wave.md` stays the post-menu contract. Contents, in order:

**Permitted orchestrator git writes in this step:** `fetch`, `rebase origin/<base>`, `GIT_EDITOR=true git rebase --continue`, `rebase --abort` (only while a rebase this invocation started is in progress), `reset --hard <pre_head>` (only after that rebase completed, to restore the recorded SHA), and the lease push. No `add`, no `commit`, no `rebase --skip`, no edit to a tracked file, no `--continue` while `git diff --name-only --diff-filter=U` is non-empty.

**Preconditions**, checked in order after step 2:

1. The harness has a helper facility (the same check `SKILL.md` lines 39-41 apply at step 3); without one -> terminal stop before any sync write: `sync: stopped - no helper facility for conflict resolution and review`.
2. `head_pushable` is `true`; `false` or `unreadable` -> terminal stop with the report naming the reason (ticket row 6); no rebase, no push.
3. `origin/<base>` exists after `git fetch origin <base>`; missing -> terminal stop with a one-line error (operator input, not a finding).
4. `git merge-base --is-ancestor origin/<base> HEAD` exits 1 (the head is behind); 0 -> `sync: no-op - head already contains origin/<base>`, stage `complete`, continue to step 3; any other exit is a git error -> terminal stop quoting it.
5. `git rev-list --merges origin/<base>..HEAD` is empty; a head containing merge commits is not rewritten (a default rebase drops them and any amendment held only in them) -> `sync: skipped - head contains merge commits`, stage `skipped`, continue to step 3 unsynced.

A fetch is the only git write that may precede the other-author confirmation below.

**Baseline.** Refresh `headRefOid` with `gh pr view <N> --json headRefOid` and set `<pre_head>` = `git -C <worktree> rev-parse HEAD`. The two must agree (a reused worktree ff-pulls in step 2, so the step-1 digest may be stale); a mismatch is a terminal stop naming both SHAs - the remote moved during provisioning, which is the head-move case.

**Other-author confirmation.** When `pr.author.login` differs from `gh api user --jq .login`, or that login is unreadable, print one explanation before any rewrite: the rebase replays the author's commits under new SHAs (authorship stays, the committer becomes the local git identity of this checkout), review comments anchored on the old commits may render as outdated on the forge, and branch protection may dismiss existing approvals; then ask for a yes. Any other reply -> `sync: declined - other author's branch`, stage `skipped`, step 3 runs unsynced. The yes covers the whole sync (rebase, helper commits, review, lease push, and any restore). Same-author PRs run on `--rebase` alone.

**Rebase.** `git -C <worktree> rebase origin/<base>`. A non-zero exit with no unmerged paths (`git diff --name-only --diff-filter=U` empty - a hook failure, an untracked-file overwrite) takes the failure path. A non-zero exit with unmerged paths is a conflict stop.

**Conflict stop** - one fresh `implementer` per stop, sequential, `cwd` the PR worktree, dispatched per `SKILL.md` `## Harness notes` (pi: the `implementer` persona; Claude Code: the sync conflict-stop duty). Before dispatch the orchestrator records the stop's `git status --porcelain` (the clean replays git already staged for this commit are part of it) and the conflicted file list. The task carries: the conflicted file list, the stopped commit (`git rebase --show-current-patch`), the base being rebased onto, `SCOPED_TEST_COMMANDS` resolved by the orchestrator - the resolved `verification command` followed by the paths of the test files among the stopped commit's changed files when the ladder documents a file-scoped form, otherwise `none` - and the rule "resolve every listed file so both sides' intent survives, run exactly the supplied scoped test commands and report each result (or report that none were supplied), `git add` each resolved file, return `done` with the list of files you changed; never run `git rebase --continue`, `git rebase --abort`, `git rebase --skip`, or `git commit`; never edit a file outside the list". The orchestrator continues (`GIT_EDITOR=true git rebase --continue`) only when the helper returns `done` with the scoped results, `--diff-filter=U` is empty, every listed file is fully staged, and `git status --porcelain` differs from the recorded snapshot only in the listed files; a non-zero `--continue` with unmerged paths is the next conflict stop; without unmerged paths it takes the failure path. Anything else (`open`, residue outside the listed files, unmerged paths left) -> failure path. One attempt per stop, no round counter (`closureReview.maxFixRounds` is untouched; the sync is not a fix wave). Resolved file names accumulate across stops.

**Review before push** - runs on every rewritten head (gh-57's guarantee: a reviewer before every push), whether or not a stop occurred; only a `no-op` skips it because nothing is pushed. One fresh `code-reviewer`, `cwd` the PR worktree, over `git range-diff origin/<base> <pre_head> HEAD` and, when stops were resolved, `git diff <pre_head> HEAD -- <resolved files>`; the task asks for the reviewer's native findings report with "rebase replay and conflict resolutions" as the review subject (no finding-closure lines - there are no prior findings before step 4). A report with a Critical or Moderate finding -> failure path; no second helper.

**Push.** `git -C <worktree> push --no-follow-tags --force-with-lease=<head_ref>:<pre_head> <head_url> HEAD:refs/heads/<head_ref>`. The destination is `head_url`/`head_ref` as in `fix-wave.md` line 50, never `origin` (a fork's push target differs from the PR base).

**Re-gather.** Re-run every step-1 forge read for the PR: `headRefOid`, `mergeable`, `mergeStateStatus`, `reviewDecision`, checks and `actions_runs`, commits, changed files and diff, comments and reviews (a rewrite can mark anchors outdated, dismiss approvals, and queue reviewer workflows; the step-1 ticket reads are not repeated). Unreadable fields fail closed as in step 1. Re-resolve the trusted configuration ladder (`reference/assessment.md` lines 19-40) at `git merge-base origin/<baseRefName> HEAD` - `baseRefName` stays the trust source even when `--rebase <base>` named another branch. The sync runs no CI poll: step 3's existing first pass polls 30 s for `timeout minutes` (`verification-brief.md` line 137) and resolves the pushed head as for any assessed head (the sync push is not an own push for `### Re-render`; the `Fix wave` row of Section B does not apply); a head that moves during that poll takes the existing head-move rule (`reference/post-selection-loop.md` `### Re-render`), with step 2's divergence stop as the backstop. Stage `complete`; enter step 3 with the refreshed digest.

**Failure path** (an unresolved stop, `open`, residue, a non-zero `rebase` or `--continue` without unmerged paths, a reviewer Critical/Moderate, a push rejected by server policy). Restore `<pre_head>`: `git rebase --abort` while the rebase is in progress, `git reset --hard <pre_head>` after it completed; assert `HEAD == <pre_head>` and a clean `git status --porcelain` (a mismatch is a hard stop with the error, never a silent continue). Record `sync: failed - <reason>` with reason one of `unresolved stop in <commit7>`, `implementer returned open`, `residue outside conflicted files`, `rebase failed: <first line>`, `reviewer: <top finding>`, `push rejected: <first server line>`. Stage `skipped`; continue to step 3 on the unsynced head. Step 5's conflict rows (`update branch`, `merge base`, `reply`, `stop`) carry the follow-up as today.

**Lease refusal** (`stale info` / the lease rejection message - the remote head moved since the baseline). Restore `<pre_head>` with `reset --hard` and assert as above, then terminal stop: stage `failed`, the reason and both SHAs printed, the menu offering `stop` and `show evidence` only (the mutation rows assume the worktree equals the remote head, which it no longer does). No retry.

### Brief and report

`verification-brief.md` Section A's digest schema gains one field, present only when `--rebase` was passed: `sync`, whose schema line points to `reference/sync.md` `## Sync record` as the grammar's owner; that grammar is `rebased <pre_head7>..<new_head7> onto origin/<base>, <n> stop(s) resolved in <files>, <m> commit(s) dropped as already applied` or `no-op - ...` / `skipped - ...` / `declined - ...` / `failed - ...` / `stopped - ...`.

`reference/report.md` `## Order` gains one fixed-position line immediately before `Verdict:`, present only when `--rebase` was passed, rendered as one whole sentence from the `sync` field (for example `Sync: rebased a1b2c3d..e4f5a6b onto origin/main, one stop resolved in src/parser.ts and src/parser.test.ts.`). This line is where ticket row 3's resolved file names appear; rule 5 of the report wording (passing facts only under `show evidence`) is exempted for it. Nothing else in the report changes.

### Harness

Precondition 1 moves the existing unsupported-harness stop (`SKILL.md` lines 39-41) ahead of the first sync write when `--rebase` is passed; without the flag it stays at step 3. The Claude Code mapping in `## Harness notes` gains two duties so the sync helpers never receive fix-wave prompts: the sync conflict stop uses the task `reference/sync.md` `## Conflict stop` builds; the sync review uses Section C plus `review-baseline.md` with the `## Review before push` subject and no closure lines.

## Errors and edge cases

| Case | Behavior |
|---|---|
| `--rebase` on a harness without a helper facility | terminal stop before any write; no rebase, no push |
| `--rebase` and `head_pushable` false/unreadable | terminal stop after checkout, report names the reason; no rebase, no push |
| `--rebase` plus a base that is not on `origin` | terminal stop, one line naming the missing ref |
| head already contains `origin/<base>` | `sync: no-op`, no push, no review, step 3 |
| head contains merge commits | `sync: skipped`, step 3 unsynced |
| worktree HEAD != refreshed `headRefOid` after step 2 | terminal stop naming both SHAs |
| PR author != token user, or login unreadable | explanation + ask; no -> `sync: declined`, step 3 unsynced |
| reused worktree with local-only commits or a foreign in-progress operation | step 2's existing stop (`assessment.md` line 9) fires before 2b; unchanged |
| `rebase` or `--continue` non-zero with no unmerged paths | failure path |
| implementer returns `open`, leaves residue, or unmerged paths remain | failure path |
| stopped commit has one conflicted and one cleanly replayed file | the clean file is in the snapshot and is not residue; the helper touches only the conflicted file |
| reviewer Critical/Moderate (with or without stops) | failure path, `sync: failed - reviewer: ...` |
| lease refused, head moved | restore `<pre_head>`, terminal stop, `stop`/`show evidence` only; no retry |
| push rejected by server policy | failure path, `sync: failed - push rejected` |
| restore leaves `HEAD != <pre_head>` or a dirty tree | hard stop with the error |
| CI pending at step 3's timeout | evidence row `wait` overlay, as a fix-wave push |
| no check appears within step 3's poll | existing "no checks" handling (Fallback local run row) |
| head moves during step 3's poll | existing head-move rule; step 2's divergence stop backs it |
| loop re-entry after a fix wave | step 2b never re-runs |

## Tests

Deterministic (`npm test` via `scripts/ci.mjs`): the existing skill lint (frontmatter, path, and model-literal contracts) over `reference/sync.md` and the edited `SKILL.md`; `scripts/gatekeep-comment-reconcile.test.mjs` unchanged - it keeps pinning `SKILL.md` under 120 lines and the red-flag phrase `resolving a merge conflict itself`; marketplace assertions unchanged (gatekeep-pr stays listed); `eval/gatekeep-pr/run.test.mjs` added to the explicit `--test` list at `scripts/ci.mjs` line 460. Imperative voice and branch count are forge-skill authoring rules checked at review, not by `ci.mjs`.

Eval target `eval/gatekeep-pr/` per `eval/README.md`: `README.md`, `reviewer-prompt.md`, `run.mjs`, `run.test.mjs`, `sample/<slug>/{source.md, expected.md}`, `results/<run-id>/`. The driver follows the spec-gate pattern (`eval/spec-gate/README.md` line 20): `pi -p` from a scratch cwd with no tools, skills, extensions, or context files. The system prompt is the gatekeep-pr `SKILL.md` plus `reference/sync.md` and `reference/decision-menu.md` for the candidate, and the pre-edit `SKILL.md` plus `reference/decision-menu.md` for the baseline (no `sync.md` exists before the edit). The user prompt is `source.md` - a synthetic step-1 digest (PR number, author login, token login, `headRefOid`, `baseRefName`, `head_pushable`, `mergeStateStatus`, check summary, changed files, helper facility present or absent) plus the argument string - and the instruction to narrate every command and dispatch in order, then the sync sentence and the first menu. The target tests instruction adherence (what the skill text makes the model do), not execution. All sample data is anonymized: synthetic repository names, PR numbers, logins, SHAs, branch names, and file paths; no real tracker, user, or repository identifier appears anywhere under `eval/gatekeep-pr/`, and the leak check (`GAUNTLET_EVAL_DENYLIST`) runs before any model call. `expected.md` holds 4-6 must-hold facts, approved before the baseline run on the current (pre-edit) wording; the first run's results are committed.

Samples (the ticket's four plus three):

| slug | source | must-hold facts (summary) |
|---|---|---|
| `conflict-free-sync` | behind base, same author, pushable, no conflicts, `--rebase release/2` | rebase onto `origin/release/2`, a reviewer dispatch over the range-diff, then the lease push with `<head_ref>:<pre_head>`, all before verification; no sync-side poll; brief names the pushed SHA; `Sync:` sentence present |
| `conflicting-file-sync` | behind base, one stop with one conflicted and one cleanly replayed file | one implementer dispatch naming only the conflicted file, carrying `SCOPED_TEST_COMMANDS`, forbidding `--continue`/`--abort`/`--skip`/`commit`; `GIT_EDITOR=true ... --continue` after `done`; reviewer before the push; the resolved file name in the `Sync:` sentence |
| `red-ci-no-autofix` | pushed head, one failing check, a reviewer workflow queued by the push | verification records the failure and the queued run; no fix dispatched; menu offers `fix` under the existing recommendation rules; round cap untouched |
| `head-not-pushable` | `head_pushable: false` | terminal stop after checkout naming the reason; no rebase, no push, no verification |
| `other-author-confirm` | author login != token user | explanation names new SHAs, retained authorship, local committer identity, possibly outdated anchors; asks before any rewrite; a no yields `sync: declined` and unsynced verification |
| `helper-unavailable` | digest says no helper facility, `--rebase` | terminal stop before any rebase or push |
| `no-flag-unchanged` | same digest as `conflict-free-sync`, no `--rebase` | no fetch/rebase/push before the menu; no `Sync:` sentence; three tracker stages |

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` `## Unreleased` - gatekeep-pr `--rebase [base]` entry (#58) (category: major procedures / conventions - an opt-in pre-verification rewrite of the PR head is a workflow change an operator must know before passing the flag)
- Derived / memory docs invalidated: `README.md` gatekeep-pr sentence (line 72, "nothing mutates ... until you pick a row") - gains the `--rebase` exception; `doc/configuration.md` unchanged (no new key)

Skill and reference bodies (`skills/gatekeep-pr/SKILL.md`, `reference/sync.md`, `reference/assessment.md`, `verification-brief.md`, `reference/report.md`) and `scripts/ci.mjs` are implementation surface, tracked in the plan. Guideline: `reference/documentation-impact.md`.

## Out of scope

- Any menu row for rebase or force-push after verification (gh-57 Phase 4 `deviates:` stands).
- `gh pr update-branch --rebase` as a sync path.
- Retargeting the PR when `--rebase <base>` names a branch other than `baseRefName`; `baseRefName` still governs mergeability and trusted configuration.
- Rebasing heads that contain merge commits (`--rebase-merges`); such heads are skipped.
- Recovering a rebase or merge left in progress by an earlier run; step 2's provisioning stop owns that worktree.
- Parallel fan-out of conflict resolution (see Open questions).
- Changes to `closureReview.maxFixRounds`, the poll cadence, or the evidence table.
- Automatic approval of held workflow runs; the menu-only rule stands.
- `chase-bug`/hotfix sharing; suggest delivery.

## Open questions

- Per-stop fan-out: when one stopped commit conflicts in many disjoint files, dispatching one implementer per file in place would need an integration path the parallel skill rules out on a dirty tree (`dispatching-parallel-agents` line 116). Revisit only with evidence that PRs regularly conflict in many files within one commit.
