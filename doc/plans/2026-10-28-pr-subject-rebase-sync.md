# PR subject rebase sync Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Rebase PR rework onto the fetched base, replay members onto home, and ship home with an explicit lease while retaining merge-forward compatibility.

**Architecture:** Keep provisioning in pr-head.md, pass the sync selector only from PR admission, and persist the result in the existing Rework record. Finish and resume consume the recorded rework base instead of requiring rewritten original commits to remain ancestors. Preserve spec-only and gatekeep routes.

**Tech Stack:** Markdown instruction contracts, Git and GitHub CLI recipes, Node.js node:test contract tests, existing text eval runner.

**Spec:** `doc/specs/2026-10-28-pr-subject-rebase-sync.md`

**Verification:** `npm test`

---

## Files

### Provisioning and record production
- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/brainstorming/reference/pr-subject.md`
- Modify: `skills/brainstorming/gatherer.md`
- Modify: `skills/brainstorming/reference/spec-finalization.md`
- Modify: `skills/using-git-worktrees/SKILL.md`
- Modify: `skills/using-git-worktrees/reference/pr-head.md`
- Modify: `scripts/brainstorming-contract.test.mjs`

### Record consumers
- Modify: `skills/writing-plans/SKILL.md`
- Modify: `skills/finishing-a-development-branch/SKILL.md`
- Modify: `skills/gauntlet-handoff/SKILL.md`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md`
- Modify: `scripts/brief-contract-lint.test.mjs`

### Behavioral evals
Task 4 lists every new/renamed sample file and generated record. Modify only its named existing samples and their records; full-target runs also refresh other stale records in these five existing targets. Keep target.json, replay.md, runner code, and unchanged spec-only sample inputs/expectations intact.
- Modify: `eval/using-git-worktrees/intent.md`, `eval/using-git-worktrees/report.md`, `eval/using-git-worktrees/results/**/*.json`
- Modify: `eval/brainstorming/intent.md`, `eval/brainstorming/report.md`, `eval/brainstorming/results/**/*.json`
- Modify: `eval/finishing-a-development-branch/intent.md`, `eval/finishing-a-development-branch/report.md`, `eval/finishing-a-development-branch/results/**/*.json`
- Modify: `eval/writing-plans/intent.md`, `eval/writing-plans/report.md`, `eval/writing-plans/results/**/*.json`
- Modify: `eval/gauntlet-resume/intent.md`, `eval/gauntlet-resume/report.md`, `eval/gauntlet-resume/results/**/*.json`

### User documentation
- Modify: `README.md:39-45`
- Modify: `CHANGELOG.md:1-3`

## Recon and execution conventions

- No Rework record exists in this approved spec: this is an ordinary feature plan, not a PR-subject plan. No Happy path table or separate lint/format commands exist in the first-found `.pi/gauntlet-overrides.md`.
- `package.json:25-28` routes verification to `scripts/ci.mjs`. It bundles instruction lint, model-literal lint, stage-skill lint, size limits, eval structure/hygiene, deterministic tests, packaging, and smoke tests. There is no independent Markdown formatter or scoped lint CLI. Use task-local node:test commands for contract checks, inspect touched instructions against `skills/forge-skill/SKILL.md:35-53`, and leave the bundled gate to verification. Add no formatter, dependency, runtime extension, or bin rebuild.
- Existing seams: admission/record in `skills/brainstorming/reference/pr-subject.md:3-117`; helper/recovery/threads in `skills/using-git-worktrees/reference/pr-head.md:3-111`; gather inputs in `skills/brainstorming/gatherer.md:127-154,230-236`; preservation in `skills/brainstorming/reference/spec-finalization.md:19-27`; finish in `skills/finishing-a-development-branch/SKILL.md:169-317`.
- Existing tests: `scripts/brainstorming-contract.test.mjs:173-207,487-646` reads actual instructions and eval facts; `scripts/brief-contract-lint.test.mjs:67-130` reads actual brief producers/consumers. Run one file with `node --test scripts/brainstorming-contract.test.mjs` or `node --test scripts/brief-contract-lint.test.mjs`.
- Use minimal sentence replacement, imperative voice, compact tables, and unchanged frontmatter. Keep the finishing skill at or below 500 lines and under 50,000 bytes through compact replacements, not appended explanations. It is currently 500 lines, so no oversized-file extraction is needed at entry.
- Git commands inside instruction edits and eval cases are authored recipes, not commands to execute on this development branch. Model evals narrate synthetic observations without actual pushes, rebases, closures, or tracker writes.
- Baseline provenance: initial HEAD `09e76ad8`; initial porcelain inventory empty. Only `doc/specs/2026-10-28-pr-subject-rebase-sync.md` and `doc/plans/2026-10-28-pr-subject-rebase-sync.md` are admitted workflow edits. Executed all five task commands on `09e76ad8`: Task 1 44 tests, Task 2 1 test, Task 3 44 tests, Task 4 14 tests, Task 5 45 tests; each exited 0. After each run HEAD remained `09e76ad8` and the sole porcelain entry was `?? doc/plans/2026-10-28-pr-subject-rebase-sync.md`; no artifacts or source changes. Amendment baseline BASE `ebc7879b`; initial per-file inventory ` M doc/specs/2026-10-28-pr-subject-rebase-sync.md`, admitted as the parent-supplied in-flight spec; plan and spec paths remain the only admitted workflow paths. Endpoint proof `git diff --quiet 09e76ad8 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 0; retained 5 bullets: 09e76ad8 -> ebc7879b, tree-equivalent outside doc/specs, doc/plans. All five Tests commands are unchanged; no reruns required.

## Wave 1 - Provisioning and independent brief consumers

Task 1 and Task 2 own disjoint files and run separate read-only contract suites; neither uses mutable forge state or shared fixtures.

### Task 1: Route and record rebase-based PR provisioning

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Acceptance criteria" L23-L24, § "Acceptance criteria" L25-L26, § "Acceptance criteria" L27-L28, § "Acceptance criteria" L29-L30, § "Acceptance criteria" L35-L36, § "Acceptance criteria" L37-L38, § "Design" L44, § "Token (`brainstorming/reference/pr-subject.md`)" L48, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L52, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L54, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L56-L61, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L63, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L65, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L67, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L69, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L71, § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L73, § "Record (`pr-subject.md`, `gatherer.md`, `spec-finalization.md`)" L77, § "Out of scope" L113, § "Errors and edge cases" L119, § "Errors and edge cases" L120, § "Errors and edge cases" L121, § "Errors and edge cases" L122, § "Errors and edge cases" L123, § "Errors and edge cases" L124, § "Errors and edge cases" L125, § "Errors and edge cases" L126, § "Errors and edge cases" L127, § "Errors and edge cases" L128, § "Errors and edge cases" L129, § "Tests" L153

**Files:**
- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/brainstorming/reference/pr-subject.md`
- Modify: `skills/brainstorming/gatherer.md`
- Modify: `skills/brainstorming/reference/spec-finalization.md`
- Modify: `skills/using-git-worktrees/SKILL.md`
- Modify: `skills/using-git-worktrees/reference/pr-head.md`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: ebc7879b pass
- via: `skills/brainstorming/reference/pr-subject.md`, `skills/using-git-worktrees/reference/pr-head.md`, `skills/brainstorming/gatherer.md`

Decision: Keep the existing foreground implementer helper and fetched-base scoped-runner selection; substitute only rebase discovery/continuation/abort operations - `pr-head.md:78-95` owns the file boundary, credentials policy, status checks, and orchestrator completion.

- [ ] **Step 1: Run existing contracts.** Run the Tests command; expect all node:test cases green before assertion changes.
- [ ] **Step 2: Rewrite provisioning assertions and confirm red.** In `scripts/brainstorming-contract.test.mjs:487-624`, replace merge-only section/order assertions with `## Sync onto the fetched base` and `## Recover an interrupted sync`. Slice the helper through `## Fetch unresolved review threads`; add `rebase --abort` to the targeted-command list. Assert recovery precedes exact-head stops, both spec-only classifier rows supply `SYNC=merge`, the selector does not reach scout, and post-sync proof depends on outcome. Assert an existing validated rework-base ref forces `SYNC=rebase` even with `merge-forward`, and home abort restoration/proof uses the saved actual pre-attempt local home tip (`PRE_REWORK_HEAD` only on fresh entry). Replace the every-head proof test rather than retaining contradictory expectations. Leave the `README.md` old carve-out assertion for Task 5; `scripts/brief-contract-lint.test.mjs` is owned by Task 2. Run the Tests command; expect red on changed instruction assertions.
- [ ] **Step 3: Replace token routing.** Strip only first intent token `merge-forward`, setting `SYNC=merge`; otherwise set `SYNC=rebase`. Pass `SYNC` beside the ordered array only to provisioning. Both spec-only classifier rows force `SYNC=merge`; keep `brainstorming/reference/spec-pr.md:45` and `finishing-a-development-branch/reference/spec-pr.md` unchanged, including their actual `skills/` paths. Preserve `merge: ...` record form on merge runs. Keep admission, binding, relatedness, pagination, fork stops, and remaining intent unchanged. A `#12 #13 #14` list rewrites home only; no settings key or member-origin writes.
- [ ] **Step 4: Replace recovery and provenance boundaries.** Record every original `refs/gauntlet/pre-rework/pr-<N>` after exact-head verification; stop on update-ref errors. Keep approval `commit --amend` and wave `reset --soft`, requiring `WAVE_BASE_SHA` to descend from rework base in rebase mode and retaining the old boundary in merge mode. Probe an existing worktree with `git -C "$WORKTREE" rev-parse -q --verify REBASE_HEAD`; stop with `worktree <path> has a rebase in progress; finish or abort it by hand`. Inspect actual local home tip, require clean state, and validate `refs/gauntlet/rework-base/pr-<home>` ancestry plus every pre-rework ref identity. When that ref exists and validation passes, force `SYNC=rebase` regardless of `merge-forward` and continue from the validated local tip without reset. Use `git -C "$WORKTREE" cherry <tip> <member headRefOid> <BASE_SHA>`: no `+` means `(already landed)`, otherwise replay remains. Without a worktree, inspect local refs from ROOT and provision the validated branch before worktree-targeted operations. With no rework-base ref keep canonical two-parent `merge PR #<N> head <sha7> into PR #<home>` recovery, forcing merge mode. Otherwise remove `(N=1)` labels and apply exact-head checks for every N. Preserve mismatch stops and prohibit reset, clean, or branch deletion.
- [ ] **Step 5: Replace the sync owner with a two-mode table.** Rebase: save the actual pre-attempt local home tip as last-good head (`PRE_REWORK_HEAD` on fresh entry, validated local tip on recovery); run `git -C "$WORKTREE" rebase --no-rebase-merges origin/<baseRefName>` and save last-good head on success; then per member run `git -C "$WORKTREE" rebase --no-rebase-merges --onto HEAD <BASE_SHA> <member headRefOid>`. After each successful detached replay update home to HEAD, check out home, and save last-good head. Do not update member refs. Force `--no-rebase-merges` despite `rebase.rebaseMerges`. On completion write the rework-base ref. Merge: retain the current member-merge then base-merge recipe verbatim, including canonical subjects, helper completion, failure stops, and no rework-base write. Keep original-head ancestry checks in that branch only.
- [ ] **Step 6: Replace conflict continuation.** Read paths with `git -C "$WORKTREE" diff --name-only --diff-filter=U`; include `git -C "$WORKTREE" rebase --show-current-patch` in the helper payload and retain fetched-base scoped-runner selection. Require every listed file staged, empty unmerged index, contained status delta. Only the orchestrator runs `GIT_EDITOR=true git -C "$WORKTREE" rebase --continue` (targeted form of `GIT_EDITOR=true git rebase --continue`) or `git -C "$WORKTREE" rebase --skip` for an empty stopped commit. Forbid helper `rebase --continue/--abort/--skip` and commits. Repeat a fresh helper for each later stop. On failure run `git -C "$WORKTREE" rebase --abort`; for member abort check out home before proving abort exit 0, saved HEAD, home `headRefName`, and clean porcelain. Preserve the complete restore-failure report and stop. Clean home abort restores and continues on the saved pre-attempt home tip, records `sync: unresolved` plus files and all members `pending`; use `PRE_REWORK_HEAD` as that saved tip only on fresh entry, not recovery. Clean member abort records its unresolved outcome and later members `pending`, retaining earlier outcomes. Open Design with the matching rebase/replay repair and continue to spec, not later replay.
- [ ] **Step 7: Record and validate outcomes.** Final tip differing from `PRE_REWORK_HEAD` records the rebased range and stops; only equality yields `Base: ... - sync: no-op`. Each `Member replay:` records actual first/last added commits, `empty`, `(already landed)`, unresolved files, or `pending`. All-dropped commits mean `empty`, not failure. Shared commits replay from `BASE_SHA`; equivalents drop and textual clashes use the helper. Rebase success proves rework-base ancestry; home abort proves HEAD equals the saved pre-attempt last-good home SHA (`PRE_REWORK_HEAD` only on fresh entry); member abort proves saved rebased home tip; merge proves every original head. Stop naming PR/SHAs on failure. Never prove original-head ancestry of a rebased tip. Report `Rework base:` immediately after `Base SHA:` only on completed rebase sync, retaining every `PR:` / `Pre-rework head:` pair.
- [ ] **Step 8: Update gather and record carry.** After `Base: ...`, add optional full rework base and ordered replay outcomes before combined claims. At `gatherer.md:138-141,234`, replace `Member merge:` / `Merge result:` with `Member replay:` / `Sync result:` and describe member replays and base sync. Retain merge outcomes when merge mode is selected. At `spec-finalization.md:22`, preserve sync result, rework base, member replay lines. At `pr-subject.md:95`, open Design with rebase/replay repair or the original wording for `merge: unresolved`. Preserve `Changes:`, fetched-base constraints on every outcome, and original-head attribution. In `brainstorming/SKILL.md` and `pr-head.md`, replace the exception phrase with the base sync (rebase or merge) and each member replay or merge, retaining helper edits/scoped tests as the sole exception. Keeping a Worktree Current delegates sync per that reference.
- [ ] **Step 9: Run green and inspect style.** Run the Tests command. Check forge-skill rules, frontmatter, and worktree targeting. Keep spec-only/gatekeep files and stacked-member selection out of scope. Preserve `spec-pr-unmarked`, `spec-pr-regate`, and `spec-pr-menu` fixtures for Task 4. Coordinate the minimal-diff budget for `finishing-a-development-branch/SKILL.md` with Task 3, which owns that file and keeps it under 50,000 bytes.
- [ ] **Step 10: Commit.** Stage only declared files with bare `git add`; run `git commit -m "Rebase PR provisioning and record member replays"`. Record behavior-change classification in the body; Task 4 supplies final eval evidence.

### Task 2: Carry the rework base through handoff and reconstruction

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Acceptance criteria" L39-L40, § "Handoff and resume" L105, § "Tests" L151

**Files:**
- Modify: `skills/gauntlet-handoff/SKILL.md:87-93`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:30-59`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md:24-47`
- Modify: `scripts/brief-contract-lint.test.mjs:108-130`
- Test: `scripts/brief-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: ebc7879b pass
- via: `skills/gauntlet-resume/reference/brief-contract.md`, `skills/gauntlet-resume/reference/reconstruction.md`, `skills/gauntlet-handoff/SKILL.md`

Decision: Keep grammar owned by brief-contract.md and copy the optional field in producer prose, not a second standalone grammar block - `scripts/brief-contract-lint.mjs:5-17` and the producer enforce single ownership.

- [ ] **Step 1: Run existing suite.** Run the Tests command; expect fixture assertions and one passing node:test file.
- [ ] **Step 2: Add red assertions.** Extend real-contract tests for one optional full `Rework base:` after all PR pairs and before gate-history, including loop-ledger production. Assert Candidates prefers it, retaining first-head and no-pair fallbacks. Run Tests; expect missing-field failures.
- [ ] **Step 3: Replace producer/consumer clauses.** Copy optional rework base from top-level record after pairs. `gauntlet-handoff/SKILL.md` cites the grammar owner; `gauntlet-resume/reference/brief-contract.md` updates the table, producer order, and process-state carry sentence together. `reconstruction.md` uses `Rework base:` as candidate base when present, else first pre-rework head; no pairs retain ordinary discovery. Preserve home-only identity fetch, ordered matching, member-spec exclusion, task/ledger pairing, and gate revalidation. Never invent a boundary for incomplete sync.
- [ ] **Step 4: Run green and inspect style.** Run Tests; confirm no duplicated grammar or changed frontmatter. Task 4 supplies behavioral coverage in `eval/gauntlet-resume/samples/pr-subject-brief` and `pr-list-brief`.
- [ ] **Step 5: Commit.** Stage four files; run `git commit -m "Carry rework base through handoff and resume"` with behavior-change classification in the body.

## Wave 2 - Planning and shipping consumers

Depends on Wave 1: Task 3 consumes Task 1's record forms and reuses its contract-test file after provisioning assertions land.

### Task 3: Complete interrupted syncs and ship with a guarded lease

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Acceptance criteria" L29-L30, § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Design" L44, § "Plan (`writing-plans/SKILL.md:189`)" L81, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L85, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L87, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L89, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L91, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L93, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L95, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L97, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L99, § "Finishing (`finishing-a-development-branch/SKILL.md`)" L101, § "Errors and edge cases" L130, § "Errors and edge cases" L131, § "Errors and edge cases" L132, § "Errors and edge cases" L133, § "Errors and edge cases" L134

**Files:**
- Modify: `skills/writing-plans/SKILL.md:189`
- Modify: `skills/finishing-a-development-branch/SKILL.md:169-317`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: ebc7879b pass
- via: `skills/writing-plans/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md`

Decision: Preserve accepted-complete task/thread evidence, strip/seal order, body bytes, six-row menu, and gated member closure; replace only mode-specific proofs/pushes - finishing SKILL.md:169-317 owns them. Record form, not a new setting or forwarded selector, determines mode, including `merge-forward` records.

- [ ] **Step 1: Run tests, then write red assertions.** Run Tests. Extend receiver tests for rework-base mode, merge compatibility, incomplete-record stop before menu, missing-only ref writes, first lease versus later non-force push, refused lease withholding, and range/cherry closure. Add planning assertions for pending replay completion and record amendment. Run Tests again; expect failures at the old instructions.
- [ ] **Step 2: Replace Task 1 selection.** In writing-plans keep `merge: unresolved` as merge/resolution preserving original commits. `sync: unresolved` becomes `git rebase --no-rebase-merges origin/<base>` plus resolution; unresolved `Member replay:` becomes that member replay plus resolution. Both consume every `pending` member in order, write the rework-base ref, and use the existing amendment path to persist `Rework base:` plus final outcomes before finish. Cite pr-head's helper instead of duplicating it; retain thread-id tasks, scoped tests/baselines, and disjoint waves. Helper continuation remains the targeted equivalent of `GIT_EDITOR=true git rebase --continue`.
- [ ] **Step 3: Replace mode and preflight.** `Rework base:` selects rebase; only `Base:` in `merge:` form selects merge. An incomplete rebase record stops before menu with `rework sync incomplete for PR #<home>: no Rework base recorded; finish Task 1 first.` In rebase mode prove recorded base ancestor of HEAD once, using the specified rewritten-history stop. After fetch: origin equals `PRE_REWORK_HEAD` -> lease; origin descends from `Rework base` and is ancestor of HEAD -> non-force; otherwise withhold row 1 with `push withheld: origin/<headRefName> moved past <PRE_REWORK_HEAD7>`. Recompute each menu return. Keep every-original-head and origin-ancestry proofs only in merge mode, including command-error stops and withheld-menu numeric handling.
- [ ] **Step 4: Replace push and provenance.** Preserve scoped/task/thread evidence before strip and whole-PR sealing. Probe every pre-rework ref with `git -C "$WORKTREE" rev-parse -q --verify`, updating only absent refs. Lease case: `git -C "$WORKTREE" push --no-follow-tags --force-with-lease=<home headRefName>:<PRE_REWORK_HEAD> origin HEAD:refs/heads/<home headRefName>`; other admitted cases retain non-force. `stale info` withholds row 1 on return, with no retry/reset; other rejections report once, skip body/closure, retain tree. Thread naming range uses rework base, else merge SHA, else prehead. The concrete body line shape is `Before: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (local ref `refs/gauntlet/pre-rework/pr-12` in the rework checkout)`; interpolate the actual SHA/PR, with no origin-retention claim. Preserve fresh fetch, exact bytes, scratch append, and manual-paste fallback.
- [ ] **Step 5: Replace closure eligibility and text.** Rebase mode requires `OPEN` and current `headRefOid` equal to recorded member original, otherwise `#14 skipped: head moved to <sha7>`. A range proves last replayed SHA ancestor of pushed home. `empty` or `(already landed)` requires `git -C "$WORKTREE" cherry <pushed home head> <pre-rework head>` with no `+`. Keep merge current-head ancestry and comment verbatim. Rebase range comments name the recorded replay range; empty/already-landed comments say commits are already contained there. Preserve exact gated target/text pairs, immediate post-approval state/head recheck, no branch deletion/member push, and one-time error reporting.
- [ ] **Step 6: Update reference/flags and run green.** Set `PR row 1. Push to PR branch` Push cell `yes (lease; non-force for merge records)`. Keep `Force-push without explicit request`; replace only the next flag with `Force-push a PR-subject rework without ` followed by the code literal `--force-with-lease=<headRefName>:<PRE_REWORK_HEAD>` and `, or retry after a refused lease`. Run Tests; expect green. Inspect compact replacements against forge-skill and keep `finishing-a-development-branch/SKILL.md` under 50,000 bytes and at or below 500 lines. Header-linked spec-only finish stays unchanged.
- [ ] **Step 7: Commit.** Stage three files; run `git commit -m "Finish rebased PR rework with explicit lease protection"` with behavior-change classification in the body.

## Wave 3 - Behavioral regression matrix

Depends on Waves 1-2: Task 4 evaluates final provisioning, record, planning, finish, and resume instructions. One task serializes model-run record writes and avoids provider contention.

### Task 4: Update and run the PR rebase behavioral evals

**TDD scenario:** Modifying tested code - establish new failing facts before judging the candidate.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Tests" L138, § "Tests" L139, § "Tests" L140, § "Tests" L141, § "Tests" L142, § "Tests" L143, § "Tests" L144, § "Tests" L145, § "Tests" L146, § "Tests" L147, § "Tests" L148, § "Tests" L149, § "Tests" L150, § "Tests" L151, § "Tests" L152

**Files:**
- Create: `eval/using-git-worktrees/samples/pr-head-base-rebase/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head-base-rebase/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-head-rebase-conflict-repaired/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head-rebase-conflict-repaired/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-head-rebase-conflict-unresolved/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head-rebase-conflict-unresolved/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-head-merge-forward/case.md`
- Create: `eval/using-git-worktrees/samples/pr-head-merge-forward/expected.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-replay/case.md`
- Create: `eval/using-git-worktrees/samples/pr-list-member-replay/expected.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-member-conflict-repaired/case.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-member-conflict-repaired/expected.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-member-conflict-unresolved/case.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-member-conflict-unresolved/expected.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-interrupted-recovery/case.md`
- Modify: `eval/using-git-worktrees/samples/pr-list-interrupted-recovery/expected.md`
- Create: `eval/brainstorming/samples/pr-subject-merge-forward/case.md`
- Create: `eval/brainstorming/samples/pr-subject-merge-forward/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-lease-refused/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-lease-refused/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push-legacy-record/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push-legacy-record/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/expected.md`
- Create: `eval/writing-plans/samples/pr-subject-sync-repair/case.md`
- Create: `eval/writing-plans/samples/pr-subject-sync-repair/expected.md`
- Modify: `eval/gauntlet-resume/samples/pr-subject-brief/case.md`
- Modify: `eval/gauntlet-resume/samples/pr-subject-brief/expected.md`
- Modify: `eval/gauntlet-resume/samples/pr-list-brief/case.md`
- Modify: `eval/gauntlet-resume/samples/pr-list-brief/expected.md`
- Modify: `eval/using-git-worktrees/intent.md`
- Modify: `eval/using-git-worktrees/report.md`
- Modify: `eval/using-git-worktrees/results/**/*.json`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/brainstorming/results/**/*.json`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Modify: `eval/finishing-a-development-branch/report.md`
- Modify: `eval/finishing-a-development-branch/results/**/*.json`
- Modify: `eval/writing-plans/intent.md`
- Modify: `eval/writing-plans/report.md`
- Modify: `eval/writing-plans/results/**/*.json`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/gauntlet-resume/results/**/*.json`
- Create: `eval/using-git-worktrees/results/pr-head-base-rebase/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-head-base-rebase/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-head-rebase-conflict-repaired/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-head-rebase-conflict-repaired/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-head-rebase-conflict-unresolved/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-head-rebase-conflict-unresolved/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-head-merge-forward/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-head-merge-forward/candidate.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-replay/baseline.json`
- Create: `eval/using-git-worktrees/results/pr-list-member-replay/candidate.json`
- Create: `eval/brainstorming/results/pr-subject-merge-forward/baseline.json`
- Create: `eval/brainstorming/results/pr-subject-merge-forward/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-lease-refused/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-lease-refused/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push-legacy-record/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push-legacy-record/candidate.json`
- Create: `eval/writing-plans/results/pr-subject-sync-repair/baseline.json`
- Create: `eval/writing-plans/results/pr-subject-sync-repair/candidate.json`
- Test: `eval/lib/lint.test.mjs`
- Delete: `eval/using-git-worktrees/samples/pr-head-base-merge/case.md`
- Delete: `eval/using-git-worktrees/samples/pr-head-base-merge/expected.md`
- Delete: `eval/using-git-worktrees/samples/pr-list-member-merge-order/case.md`
- Delete: `eval/using-git-worktrees/samples/pr-list-member-merge-order/expected.md`
- Delete: `eval/using-git-worktrees/results/pr-head-base-merge/baseline.json`
- Delete: `eval/using-git-worktrees/results/pr-head-base-merge/candidate.json`
- Delete: `eval/using-git-worktrees/results/pr-list-member-merge-order/baseline.json`
- Delete: `eval/using-git-worktrees/results/pr-list-member-merge-order/candidate.json`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: ebc7879b pass
- via: `eval/run.mjs`, `lintAll()`, `eval/using-git-worktrees/samples/pr-head-base-rebase`, `eval/finishing-a-development-branch/samples/pr-subject-lease-refused`, `eval/writing-plans/samples/pr-subject-sync-repair`

Decision: Reuse text targets and `bundle+:` lines, without changing caps or unrelated facts - `eval/README.md:85-137` and existing pr-subject-push/pr-list-interrupted-recovery cases define the harness. Let the runner generate every baseline/candidate record; never author evidence. Rename samples by creating the new case/expected files and removing the old files/records.

- [ ] **Step 1: Run deterministic harness tests.** Run Tests; expect 14 structural cases green. Model comparisons below are required execution evidence, not planning baseline commands.
- [ ] **Step 2: Add home/list cases.** `pr-head-base-rebase` supplies merge-containing input plus `rebase.rebaseMerges` and requires `--no-rebase-merges`, straight first-parent history, rebased range, and `Rework base:` report. Rename `pr-head-base-merge` to `pr-head-merge-forward` with explicit merge mode and retained merge facts. Replace `pr-list-member-merge-order` with `pr-list-member-replay`: home then members in listed order, one `Member replay:` each, `empty` member, unchanged origin branches. Use synthetic full SHAs and observed branches.
- [ ] **Step 3: Add conflict/recovery cases.** New `pr-head-rebase-conflict-repaired` requires targeted `GIT_EDITOR=true git rebase --continue`, scoped tests, per-stop helpers. New `pr-head-rebase-conflict-unresolved` requires abort, restore assertions, `sync: unresolved`, members `pending`, and rebase Task 1. Rewrite `pr-list-member-conflict-repaired` and `pr-list-member-conflict-unresolved` for replay, including `checkout <home>`, saved rebased tip, unresolved member, pending later members, and restore failures. Rewrite `pr-list-interrupted-recovery` for ref/cherry decisions, active-rebase refusal, no-worktree recovery, mismatched refs, and canonical merge fallback without token. Supply `merge-forward` with a valid existing rework-base ref and a local home tip distinct from the original head; require recovery to force `SYNC=rebase`, skip landed members by `cherry`, and replay remaining members. In a home-conflict variant on that recovered tip, fail the helper and require abort/restoration plus post-sync equality proof against the saved actual pre-attempt local tip, not `PRE_REWORK_HEAD`; record `sync: unresolved`, every member `pending`, and continue to rebase Task 1. Keep the fresh-entry home-conflict control using `PRE_REWORK_HEAD`. Retain admission/clean-tree facts.
- [ ] **Step 4: Add routing/planning cases.** Brainstorming `pr-subject-merge-forward` requires first-token strip before scout and merge path, with nonleading-token and spec-only controls. Writing-plans `pr-subject-sync-repair` supplies home-sync and member-replay unresolved records with pending members; require Task 1 completion to replay them and amend the rework-base ref/record before finish, plus merge control. Keep `eval/brainstorming/samples/spec-pr-unmarked`, `spec-pr-regate`, and `eval/finishing-a-development-branch/samples/spec-pr-menu` inputs/expectations unchanged; both classifier rows still supply `SYNC=merge` and judge base merge.
- [ ] **Step 5: Rewrite finish cases and add refusal/legacy cases.** `pr-subject-push`: lease form, existing ref untouched, `Before:` wording, thread range, later non-force finish. `pr-list-push-and-close`: range/`empty` comments, live-head equality, last-range ancestry/cherry proof, exact close question, immediate recheck. `pr-list-member-advanced`: `head moved` exclusion. New `pr-subject-lease-refused`: stale lease, exact withheld reason, rows 2-6, no retry/reset/body/closure. New `pr-subject-push-legacy-record`: `merge:` proof/non-force/missing ref creation and incomplete rebase stop. Keep existing policy-rejection report-once behavior; no live branch-protection eval.
- [ ] **Step 6: Rewrite brief cases and intents.** `eval/gauntlet-resume/samples/pr-subject-brief` and `pr-list-brief` carry `Rework base:` after pairs and scan from it; retain legacy first-head/no-pair fallbacks, ordered identity stops, member-spec exclusion, and task snapshots. Write actual bundle-free assembly hashes in the five intent.md files and intended fact changes only; preserve stable IDs for surviving obligations. The runner's stale-intent refusal supplies the observed assembly hash before model calls. Never relabel old records as current.
- [ ] **Step 7: Run provisioning evals.** Run `node eval/run.mjs using-git-worktrees --baseline-only`, then changed samples individually while iterating, then `node eval/run.mjs using-git-worktrees`. Read report and candidate records; require improved/unchanged and new must-hold facts satisfied.
- [ ] **Step 8: Run brainstorming evals.** Run `node eval/run.mjs brainstorming --baseline-only`, iterate new sample/spec-only controls, then `node eval/run.mjs brainstorming`. Require both spec-only controls unchanged.
- [ ] **Step 9: Run finishing evals.** Run `node eval/run.mjs finishing-a-development-branch --baseline-only`, iterate changed samples, then `node eval/run.mjs finishing-a-development-branch`. Require unchanged `spec-pr-menu` and correct refusal, repeated-push, empty-member, and legacy outcomes.
- [ ] **Step 10: Run planning evals.** Run `node eval/run.mjs writing-plans --baseline-only`, then `node eval/run.mjs writing-plans`. Require both unresolved forms to finish pending replay and persist the boundary, not merely title Task 1.
- [ ] **Step 11: Run resume evals.** Run `node eval/run.mjs gauntlet-resume --baseline-only`, then `node eval/run.mjs gauntlet-resume`. Require both rewritten brief cases and unchanged non-PR routes. Never widen intent to accept regressions; send required instruction fixes to their owning prior task.
- [ ] **Step 12: Check and commit.** Run Tests again; check ASCII, synthetic data, fact grammar, unchanged caps/config, and full-target reports. Stage declared assets and generated records only; run `git commit -m "Cover PR rebase replay and lease workflows with evals"`, recording behavior-change classification and reports in the body.

## Wave 4 - User documentation and final contract assertions

Depends on Waves 1-3: document delivered behavior and update the README-coupled assertion with its final wording. This is the trailing documentation wave.

### Task 5: Document rebase provisioning and lease-based finishing

**TDD scenario:** Modifying tested documentation - run existing contract assertions before replacement.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Docs" L109, § "Documentation impact" L157, § "Tests" L153

**Files:**
- Modify: `README.md:39-45`
- Modify: `CHANGELOG.md:1-3`
- Modify: `scripts/brainstorming-contract.test.mjs:596-600`
- Test: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brief-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs scripts/brief-contract-lint.test.mjs`
- baseline: ebc7879b pass
- via: `README.md`, `scripts/brainstorming-contract.test.mjs`, `scripts/brief-contract-lint.test.mjs`

Decision: Add the Design's requested `## Unreleased` entry without releasing; `CHANGELOG.md - deferred: release` defers its promotion, not the explicitly requested working entry. `CHANGELOG.md:1-3` currently starts at the released version; the release procedure promotes Unreleased later.

- [ ] **Step 1: Run current assertions and replace README expectation.** Run Tests; replace the README carve-out assertion in the existing leading-list test with base sync/replay wording. Run Tests again; expect the stale README assertion to fail.
- [ ] **Step 2: Replace affected user-facing clauses.** In `README.md:39`, describe home rebase, ordered member replay, first-token `merge-forward` opt-out, unresolved helper abort continuing to Task 1 repair, and without member replays for N=1. Set the exception to the base sync (rebase or merge), each member replay or merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests. In `README.md:45`, describe lease push of rebased home and non-force for `merge:` records; remove every-original-head ancestry/history-preservation claims. Keep existing owner links and body/closure gates; leave `README.md:78` gatekeep unchanged. Add one Changed bullet under `CHANGELOG.md` `## Unreleased` naming replay, opt-out, lease safety, local provenance; no version bump or publication.
- [ ] **Step 3: Run green and inspect.** Run Tests. Confirm `scripts/brainstorming-contract.test.mjs` slices from `## Sync onto the fetched base` to `## Fetch unresolved review threads`, covers `rebase --abort`, checks the carve-out in `brainstorming/SKILL.md`, `pr-head.md`, `README.md`, and asserts gatherer `Member replay:` with outcome-specific proof. Confirm `scripts/brief-contract-lint.test.mjs` covers `Rework base:`. No Markdown format CLI exists; inspect compact tables, owner links, present tense.
- [ ] **Step 4: Commit.** Stage three modified files; run `git commit -m "Document rebase-based PR rework and lease push"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L23-L24 | Single PR rebase and Step 4 boundary | Task 1 |
| § "Acceptance criteria" L25-L26 | Ordered list replay without member-origin writes | Task 1 |
| § "Acceptance criteria" L27-L28 | First-token merge opt-out stripped before scout | Task 1 |
| § "Acceptance criteria" L29-L30 | Scoped conflict helper, restoration, and Task 1 completion | Task 1, Task 3 |
| § "Acceptance criteria" L31-L32 | Initial lease, subsequent non-force, refusal without retry | Task 3 |
| § "Acceptance criteria" L33-L34 | Merge compatibility and incomplete-rebase stop | Task 3 |
| § "Acceptance criteria" L35-L36 | Durable refs and interrupted recovery boundary | Task 1 |
| § "Acceptance criteria" L37-L38 | Spec-only classifier forces merge and preserves existing route | Task 1 |
| § "Acceptance criteria" L39-L40 | Optional brief base controls reconstruction | Task 2 |
| § "Design" L44 | Minimal replacements and finishing size budget | Task 1, Task 3 |
| § "Token (`brainstorming/reference/pr-subject.md`)" L48 | Selector parsing, classifier override, provisioning-only transport | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L52 | Preserve admission, exact-head, thread owner except named changes | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L54 | Original refs and approved local fold boundaries | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L56-L61 | Two-mode sync saves actual pre-attempt home tip, replay order, unchanged merge recipe | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L63 | Per-stop helper, empty commits, abort to saved pre-attempt tip, repair continuation | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L65 | Outcome-specific proof; home abort uses saved pre-attempt tip, original head only on fresh entry | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L67 | Active-rebase stop; validated rework-base forces rebase regardless of token; cherry and no-ref fallbacks | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L69 | Report base after fetched Base SHA and retain pairs | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L71 | Replace sole preapproval exception phrase | Task 1 |
| § "Provisioning (`using-git-worktrees/reference/pr-head.md`)" L73 | Keeping-current delegates to sync owner | Task 1 |
| § "Record (`pr-subject.md`, `gatherer.md`, `spec-finalization.md`)" L77 | Optional base, outcomes, gather/finalization carry, repair Design | Task 1 |
| § "Plan (`writing-plans/SKILL.md:189`)" L81 | Task 1 repairs pending members and persists boundary by amendment | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L85 | Record mode and incomplete-sync stop | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L87 | Rework ancestry and origin-dependent push selection | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L89 | Missing-only refs, lease push, rejection paths | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L91 | Thread-fix naming range starts at rework base | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L93 | Before local handle without origin-retention claim | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L95 | Closure live identity plus range/cherry proof | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L97 | Range/already-contained comments and merge text | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L99 | Quick-reference Push cell | Task 3 |
| § "Finishing (`finishing-a-development-branch/SKILL.md`)" L101 | Lease-specific red flag and explicit-request guard | Task 3 |
| § "Handoff and resume" L105 | Producer/grammar field and candidate-base preference | Task 2 |
| § "Docs" L109 | README steps 1/5, untouched gatekeep, Unreleased entry | Task 5 |
| § "Out of scope" L113 | Preserve spec-only/gatekeep/settings/member-origin/selection boundaries; linear replay | Task 1 |
| § "Errors and edge cases" L119 | Home helper failure restores saved pre-attempt tip, records unresolved sync and pending members | Task 1 |
| § "Errors and edge cases" L120 | Member abort checks out home and preserves prior replays | Task 1 |
| § "Errors and edge cases" L121 | Failed restoration stops with observed diagnostics | Task 1 |
| § "Errors and edge cases" L122 | Final-tip no-op retains original boundary | Task 1 |
| § "Errors and edge cases" L123 | All-applied member is empty, not error | Task 1 |
| § "Errors and edge cases" L124 | Stacked equivalents drop or take conflict handling | Task 1 |
| § "Errors and edge cases" L125 | Multi-PR opt-out keeps merge recovery | Task 1 |
| § "Errors and edge cases" L126 | Active rebase refuses provisioning | Task 1 |
| § "Errors and edge cases" L127 | Existing rework-base forces rebase even with merge-forward; cherry recovery and mismatch | Task 1 |
| § "Errors and edge cases" L128 | Canonical merge tip forces merge | Task 1 |
| § "Errors and edge cases" L129 | No-ref ordinary tip uses exact-head checks for every N | Task 1 |
| § "Errors and edge cases" L130 | Repeat finish requires both ancestry proofs for non-force | Task 3 |
| § "Errors and edge cases" L131 | Refused lease withholds row 1, retains other rows | Task 3 |
| § "Errors and edge cases" L132 | Policy rejection reports once without pre-detection | Task 3 |
| § "Errors and edge cases" L133 | Merge keeps original proof and non-force | Task 3 |
| § "Errors and edge cases" L134 | Missing completion boundary blocks finish | Task 3 |
| § "Tests" L138 | Home linearization/report eval | Task 4 |
| § "Tests" L139 | Ordered replay/empty eval | Task 4 |
| § "Tests" L140 | Repaired home conflict eval | Task 4 |
| § "Tests" L141 | Unresolved home conflict eval | Task 4 |
| § "Tests" L142 | Repaired/unresolved member evals | Task 4 |
| § "Tests" L143 | Provisioning/brainstorming opt-out evals | Task 4 |
| § "Tests" L144 | Recovery eval forces rebase despite token and restores/proves recovered pre-attempt tip; merge fallback | Task 4 |
| § "Tests" L145 | Push/ref/body/closure/repeated finish evals | Task 4 |
| § "Tests" L146 | Live-head closure eligibility eval | Task 4 |
| § "Tests" L147 | Refused lease eval | Task 4 |
| § "Tests" L148 | Merge/incomplete record eval | Task 4 |
| § "Tests" L149 | Unchanged spec-only controls | Task 4 |
| § "Tests" L150 | Pending replay and persistent Task 1 repair eval | Task 4 |
| § "Tests" L151 | Rework-base handoff/reconstruction eval | Task 4 |
| § "Tests" L152 | No live branch-protection eval | Task 4 |
| § "Tests" L153 | Updated deterministic assertions and integrated check | Task 1, Task 5 |
| § "Documentation impact" L157 | Amend README and stage changelog for release | Task 5 |
