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
- Modify: `skills/subagent-driven-development/SKILL.md`
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
- Baseline provenance: current amendment BASE `2a46081a`; initial per-file inventory ` M doc/specs/2026-10-28-pr-subject-rebase-sync.md`, admitted as the parent-supplied in-flight spec. Only `doc/specs/2026-10-28-pr-subject-rebase-sync.md` and `doc/plans/2026-10-28-pr-subject-rebase-sync.md` are admitted workflow paths. Endpoint proof `git diff --quiet a2bb2e18 HEAD -- . ':!doc/specs/' ':!doc/plans/'` with HEAD `2a46081a` exited 1; retained no earlier evidence and reran all five task commands. Task 1: 46 tests; Task 2: 1 test; Task 3: 46 tests; Task 4: 14 tests; Task 5: 47 tests. Every run exited 0; after each run HEAD stayed `2a46081a` and the sole porcelain entry stayed the admitted spec edit. No artifacts or source changes.

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
- baseline: 2a46081a pass
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
- baseline: 2a46081a pass
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
- Modify: `skills/writing-plans/SKILL.md:189-196`
- Modify: `skills/subagent-driven-development/SKILL.md:169-174`
- Modify: `skills/finishing-a-development-branch/SKILL.md:169-317`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 2a46081a pass
- via: `skills/writing-plans/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md`

Reopened for the in-place sync-repair amendment. Preserve completed finishing behavior and all unchanged steps; execute only the new planning/executor assertions, marker and wave-rule delta, then rerun the scoped gate and commit. This feature plan keeps Task 3 in Wave 2; the generated PR-subject plan's rebase-form Task 1 is the task that must occupy an in-place Wave 1.

Decision: Preserve accepted-complete task/thread evidence, strip/seal order, body bytes, six-row menu, and gated member closure; replace only mode-specific proofs/pushes - finishing SKILL.md:169-317 owns them. Record form, not a new setting or forwarded selector, determines mode, including `merge-forward` records.

Decision: Use one explicit in-place exception in the existing wave loop, not a second engine or patch representation - `skills/subagent-driven-development/SKILL.md:169-174` owns dispatch, integration, scoped gates, review and fold; its Dispatch section already supplies the plain in-place worker shape. Review this wave in the branch checkout with the existing SR/CR gates and in-place repair rules, not an artifact snapshot. Keep the pre-dispatch boundary for that wave's review; record the following wave's `WAVE_BASE_SHA` from the post-repair committed HEAD.

- [ ] **Step 1: Run tests, then write red assertions.** Run Tests. Extend receiver tests for rework-base mode, merge compatibility, incomplete-record stop before menu, missing-only ref writes, first lease versus later non-force push, refused lease withholding, and range/cherry closure. Add planning assertions for pending replay completion and record amendment. Extend the existing planning test at `scripts/brainstorming-contract.test.mjs:686-689` to read the executor too: require both rebase rows to select Task 1 alone in Wave 1 marked `in-place`, the merge row to stay ordinary, and the executor rule to use one `implementer` with branch-checkout `cwd` and no `worktree: true`, skip patch integration and `reset --soft`, retain its commit as the wave commit, and capture the next `WAVE_BASE_SHA` afterward. Assert the executor remains under 50,000 bytes. Run Tests again; expect failures on the absent in-place contract, not on completed finishing instructions.
- [ ] **Step 2: Replace Task 1 selection.** In writing-plans keep `merge: unresolved` as merge/resolution preserving original commits and an ordinary wave task. `sync: unresolved` becomes `git rebase --no-rebase-merges origin/<base>` plus resolution; unresolved `Member replay:` becomes that member replay plus resolution. Mark both rebase-form Task 1 rows as alone in Wave 1 marked `in-place`. Both consume every `pending` member in order, write the rework-base ref, and use the existing amendment path to persist `Rework base:` plus final outcomes before finish. Cite pr-head's helper instead of duplicating it; retain thread-id tasks, scoped tests/baselines, and disjoint waves. Replace the row's conflicting "without changing executor" clause with a link to the executor's wave-loop rule while preserving spec-commit mechanics. Helper continuation remains the targeted equivalent of `GIT_EDITOR=true git rebase --continue`.
- [ ] **Step 2a: Replace the wave dispatch owner with the in-place exception.** Near `WAVE_BASE_SHA`/integration in `skills/subagent-driven-development/SKILL.md:169-174`, add one minimal rule for a wave marked `in-place`: run its sole task as one `implementer` with `cwd` the branch checkout and no `worktree: true`; use the existing branch-checkout SR, scoped-test and CR gates, including in-place repairs; skip patch integration and the `reset --soft` fold because its commit is the wave commit. Keep task completion behind those gates and a clean committed tree. Record the next wave's `WAVE_BASE_SHA` after that commit, never fold the rebase back onto the pre-repair boundary. Scope the exception to marked waves; the ordinary chain/patch/fold path, including merge-form Task 1, stays unchanged. Keep one rule owner rather than duplicating the exception at every step, unchanged frontmatter, forge-skill minimal diff, and the file under 50,000 bytes.
- [ ] **Step 3: Replace mode and preflight.** `Rework base:` selects rebase; only `Base:` in `merge:` form selects merge. An incomplete rebase record stops before menu with `rework sync incomplete for PR #<home>: no Rework base recorded; finish Task 1 first.` In rebase mode prove recorded base ancestor of HEAD once, using the specified rewritten-history stop. After fetch: origin equals `PRE_REWORK_HEAD` -> lease; origin descends from `Rework base` and is ancestor of HEAD -> non-force; otherwise withhold row 1 with `push withheld: origin/<headRefName> moved past <PRE_REWORK_HEAD7>`. Recompute each menu return. Keep every-original-head and origin-ancestry proofs only in merge mode, including command-error stops and withheld-menu numeric handling.
- [ ] **Step 4: Replace push and provenance.** Preserve scoped/task/thread evidence before strip and whole-PR sealing. Probe every pre-rework ref with `git -C "$WORKTREE" rev-parse -q --verify`, updating only absent refs. Lease case: `git -C "$WORKTREE" push --no-follow-tags --force-with-lease=<home headRefName>:<PRE_REWORK_HEAD> origin HEAD:refs/heads/<home headRefName>`; other admitted cases retain non-force. `stale info` withholds row 1 on return, with no retry/reset; other rejections report once, skip body/closure, retain tree. Thread naming range uses rework base, else merge SHA, else prehead. The concrete body line shape is `Before: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (local ref `refs/gauntlet/pre-rework/pr-12` in the rework checkout)`; interpolate the actual SHA/PR, with no origin-retention claim. Preserve fresh fetch, exact bytes, scratch append, and manual-paste fallback.
- [ ] **Step 5: Replace closure eligibility and text.** Rebase mode requires `OPEN` and current `headRefOid` equal to recorded member original, otherwise `#14 skipped: head moved to <sha7>`. A range proves last replayed SHA ancestor of pushed home. `empty` or `(already landed)` requires `git -C "$WORKTREE" cherry <pushed home head> <pre-rework head>` with no `+`. Keep merge current-head ancestry and comment verbatim. Rebase range comments name the recorded replay range; empty/already-landed comments say commits are already contained there. Preserve exact gated target/text pairs, immediate post-approval state/head recheck, no branch deletion/member push, and one-time error reporting.
- [ ] **Step 6: Update reference/flags and run green.** Set `PR row 1. Push to PR branch` Push cell `yes (lease; non-force for merge records)`. Keep `Force-push without explicit request`; replace only the next flag with `Force-push a PR-subject rework without ` followed by the code literal `--force-with-lease=<headRefName>:<PRE_REWORK_HEAD>` and `, or retry after a refused lease`. Run Tests; expect green. Inspect compact replacements against forge-skill and keep `finishing-a-development-branch/SKILL.md` under 50,000 bytes and at or below 500 lines. Inspect the in-place rule and row link against the same authoring rules; keep `subagent-driven-development/SKILL.md` under 50,000 bytes. Header-linked spec-only finish stays unchanged.
- [ ] **Step 7: Commit.** Stage only changed declared files; run `git commit -m "Finish rebased PR rework with explicit lease protection"` with behavior-change classification and the in-place wave amendment in the body.

## Wave 3 - Behavioral regression matrix

Depends on Waves 1-2: Task 4 evaluates final provisioning, record, planning, finish, and resume instructions. One task serializes model-run record writes and avoids provider contention.

### Task 4: Update and run the PR rebase behavioral evals

**TDD scenario:** Modifying tested code - establish new failing facts before judging the candidate.

**Spec:** doc/specs/2026-10-28-pr-subject-rebase-sync.md § "Plan (`writing-plans/SKILL.md:189`)" L81, § "Tests" L138, § "Tests" L139, § "Tests" L140, § "Tests" L141, § "Tests" L142, § "Tests" L143, § "Tests" L144, § "Tests" L145, § "Tests" L146, § "Tests" L147, § "Tests" L148, § "Tests" L149, § "Tests" L150, § "Tests" L151, § "Tests" L152

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
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-push/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-push/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-push-and-close/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-push-and-close/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-close-outcomes/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-close-outcomes/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-member-advanced/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-member-advanced/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-lease-refused/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-lease-refused/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push-legacy-record/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-push-legacy-record/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-withheld/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-withheld/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-preflight-stops/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-rebase-preflight-stops/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-eligibility/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-list-rebase-eligibility/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-merge-preflight/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-merge-preflight/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-merge-fix-minors/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-merge-fix-minors/expected.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-legacy-ref-errors/case.md`
- Create: `eval/finishing-a-development-branch/samples/pr-subject-legacy-ref-errors/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-subject-push/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-push-and-close/expected.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/case.md`
- Modify: `eval/finishing-a-development-branch/samples/pr-list-member-advanced/expected.md`
- Modify: `eval/writing-plans/samples/pr-subject-sync-repair/case.md`
- Modify: `eval/writing-plans/samples/pr-subject-sync-repair/expected.md`
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
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-push/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-push/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-push-and-close/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-push-and-close/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-close-outcomes/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-close-outcomes/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-member-advanced/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-member-advanced/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-lease-refused/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-lease-refused/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push-legacy-record/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-push-legacy-record/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-withheld/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-withheld/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-preflight-stops/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-rebase-preflight-stops/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-eligibility/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-list-rebase-eligibility/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-merge-preflight/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-merge-preflight/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-merge-fix-minors/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-merge-fix-minors/candidate.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-legacy-ref-errors/baseline.json`
- Create: `eval/finishing-a-development-branch/results/pr-subject-legacy-ref-errors/candidate.json`
- Modify: `eval/writing-plans/results/pr-subject-sync-repair/baseline.json`
- Modify: `eval/writing-plans/results/pr-subject-sync-repair/candidate.json`
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
- baseline: 2a46081a pass
- via: `eval/run.mjs`, `lintAll()`, `eval/using-git-worktrees/samples/pr-head-base-rebase`, `eval/finishing-a-development-branch/samples/pr-subject-lease-refused`, `eval/finishing-a-development-branch/samples/pr-subject-rebase-withheld`, `eval/finishing-a-development-branch/samples/pr-list-rebase-eligibility`, `eval/finishing-a-development-branch/samples/pr-subject-merge-preflight`, `eval/finishing-a-development-branch/samples/pr-subject-legacy-ref-errors`, `eval/finishing-a-development-branch/samples/pr-list-rebase-close-outcomes`, `eval/finishing-a-development-branch/samples/pr-subject-rebase-preflight-stops`, `eval/finishing-a-development-branch/samples/pr-subject-merge-fix-minors`, `eval/writing-plans/samples/pr-subject-sync-repair`

Reopened for the in-place Wave 1 fact in `pr-subject-sync-repair`. Preserve completed fixtures and facts outside this amendment. Apply the planning-case/expected delta in Step 4, writing-plans intent in Step 6, fresh planning evals in Step 10, and deterministic/style/commit checks. Prior finishing split steps remain the delivered contract, not instructions to redo those completed edits.

Decision: Reuse text targets and sample-local `bundle+:` lines - `eval/README.md:85-137` and the existing finishing cases define the harness. Let the runner generate every baseline/candidate record; never author evidence. Rename samples by creating the new case/expected files and removing the old files/records. Split finishing by sync mode and checkpoint: every split case has a 600-word response budget, including `pr-list-rebase-close-outcomes`, `pr-subject-rebase-preflight-stops`, and `pr-subject-merge-fix-minors`; `pr-subject-push-legacy-record` retains 650 words. Measure current candidate and any confirmation replies for both replay models, not pre-change baseline replies. Keep `eval/finishing-a-development-branch/target.json:5`'s separate mechanical `wordCap` at 1800. The finishing-fixture amendment changes fixtures, intent, and generated records only, not source instructions or acceptance rows; the current in-place source delta belongs to Task 3.

Decision: Cover the planner/executor boundary in the named planning sample by adding `bundle+: skills/subagent-driven-development/SKILL.md` alongside its existing writing-plans and pr-head bundles - `eval/writing-plans/samples/pr-subject-sync-repair/case.md:1-10` and `eval/README.md:95-115` own sample-local assembly. Add a stable `in-place-wave` fact and preserve the five existing fact IDs; strengthen only `merge-control` to require an ordinary wave task. Update writing-plans intent with the new must-hold fact and its current bundle-free hash; no new target, runner changes, or target-wide assembly expansion.

Decision: Use eligibility-time replay proofs against the saved pushed home SHA, then immediately re-fetch live state/head before closing; after closes, mark ship complete and report outcomes - `skills/finishing-a-development-branch/SKILL.md:265,281-299` settles both boundaries. Correct contradictory fixture conjuncts rather than adding immediate replay/cherry re-proofs, an impossible post-approval fixed-SHA ancestry flip, or a report-before-completion requirement. Thread range begins at the recorded rework base and Before retains the original SHA/ref (`SKILL.md:263-277`); no `localBefore` capture machinery exists or is required. The reviewer diagnosis identifies these as fixture errors, not source defects.

Decision: Resolve the focused diagnosis's two narration failures with case-only requests and leave their expected facts unchanged: `pr-subject-legacy-ref-errors/boundary` asks where its stop sits after completed strip/seal and before push, including the closure question; `pr-list-push-and-close/ordering` asks for exact home-first original-head and origin proof calls - finishing `SKILL.md:174,264` supplies both. The approved Tests L145, L147-L148 authorize the three further splits below. Move whole facts verbatim except the explicitly partitioned `verification` conjuncts; preserve the same IDs in each destination. The diagnostic snapshot is evidence of the fixture mismatch and prior word counts, not fresh passing evidence.

- [ ] **Step 1: Run deterministic harness tests.** Run Tests; expect 14 structural cases green. Model comparisons below are required execution evidence, not planning baseline commands.
- [ ] **Step 2: Add home/list cases.** `pr-head-base-rebase` supplies merge-containing input plus `rebase.rebaseMerges` and requires `--no-rebase-merges`, straight first-parent history, rebased range, and `Rework base:` report. Rename `pr-head-base-merge` to `pr-head-merge-forward` with explicit merge mode and retained merge facts. Replace `pr-list-member-merge-order` with `pr-list-member-replay`: home then members in listed order, one `Member replay:` each, `empty` member, unchanged origin branches. Use synthetic full SHAs and observed branches.
- [ ] **Step 3: Add conflict/recovery cases.** New `pr-head-rebase-conflict-repaired` requires targeted `GIT_EDITOR=true git rebase --continue`, scoped tests, per-stop helpers. New `pr-head-rebase-conflict-unresolved` requires abort, restore assertions, `sync: unresolved`, members `pending`, and rebase Task 1. Rewrite `pr-list-member-conflict-repaired` and `pr-list-member-conflict-unresolved` for replay, including `checkout <home>`, saved rebased tip, unresolved member, pending later members, and restore failures. Rewrite `pr-list-interrupted-recovery` for ref/cherry decisions, active-rebase refusal, no-worktree recovery, mismatched refs, and canonical merge fallback without token. Supply `merge-forward` with a valid existing rework-base ref and a local home tip distinct from the original head; require recovery to force `SYNC=rebase`, skip landed members by `cherry`, and replay remaining members. In a home-conflict variant on that recovered tip, fail the helper and require abort/restoration plus post-sync equality proof against the saved actual pre-attempt local tip, not `PRE_REWORK_HEAD`; record `sync: unresolved`, every member `pending`, and continue to rebase Task 1. Keep the fresh-entry home-conflict control using `PRE_REWORK_HEAD`. Retain admission/clean-tree facts.
- [ ] **Step 4: Add routing/planning cases.** Brainstorming `pr-subject-merge-forward` requires first-token strip before scout and merge path, with nonleading-token and spec-only controls. Writing-plans `pr-subject-sync-repair` supplies home-sync and member-replay unresolved records with pending members; require Task 1 completion to replay them and amend the rework-base ref/record before finish, plus merge control. Extend its existing A/B/C case to ask explicitly for the Wave 1 marker, sole-worker checkout/dispatch, integration/fold treatment and next-wave base capture. Add the executor bundle and `in-place-wave` expected fact: A and B put Task 1 alone in Wave 1 marked `in-place`, run one `implementer` with branch-checkout `cwd` and no `worktree: true`, skip patch integration and `reset --soft`, retain its commit as the wave commit, and record the next wave's `WAVE_BASE_SHA` afterward. Strengthen `merge-control` so C's `merge: unresolved` stays ordinary. Preserve `home-first`, `member-first`, `persistence` and `threads`, the 750-word case budget, scoped header and approval gates. Keep `eval/brainstorming/samples/spec-pr-unmarked`, `spec-pr-regate`, and `eval/finishing-a-development-branch/samples/spec-pr-menu` inputs/expectations unchanged; both classifier rows still supply `SYNC=merge` and judge base merge.
- [ ] **Step 5: Split finishing checkpoints and correct fixture-only contradictions.** Use explicit synthetic observations, exact full SHA/URL data, and only the checkpoint owned by each case; never ask one reply to contrast both histories or narrate an entire finish when the checkpoint starts after body success. Move required checks, not outcomes. Retain stable fact IDs in their destination; remove migrated checks from donors and consolidate duplicate moved checks. Keep unrelated fact text and authorized directions unchanged. Each row below owns 600 words except the legacy-record row, which retains 650; no other case budget changes.

  | Sample | Required facts and controls |
  |---|---|
  | `pr-subject-push` | Keep merge mode and `landing`, `threads`, `body`, `failures`. Require non-force push, missing-ref creation, evidence before strip/seal, seal stop, merge-sha thread range, T1-T9 task/commit/disposition evidence, empty/failed fetch, exact body bytes, full local-ref `Before:` line, all-claims-dropped variant, outside-repo scratch, exact body edit, rejected-push report-once and manual-paste fallback, no member closure. Move `menus`, `verification`, `guards`, `divergence` with all their conjuncts and checkpoints to the two merge checkpoint cases below; remove their response allocations from this donor without increasing its 600-word total. |
  | `pr-subject-merge-preflight` | Keep `menus`, `guards`, `divergence` and basic `verification`: exact six-row PR menu and ordinary five-row control; task union plus lint/format or sentinel, ordinary full header, and known verified clean commit gate without weakening the hard gate; missing prehead/CLOSED/wrong branch/rewritten prehead/exit-128 stops; origin divergence with both SHAs, separate prehead-to-origin proof before claiming advance, withheld row 1 with labels 2-6, bare 1 clarification, 5 Keep, 6 Discard without origin mutation. Remove the independent F3 fix-minors request and its 100-word share, retaining verification selection/skip narration. Start at preflight, not push/body. |
  | `pr-subject-merge-fix-minors` | Own only the moved `verification` fix-minors conjuncts, copied verbatim under that same ID. Supply PR #42's Rework record, lint/format header, task test-timeout/test-retry commands, minor F3, sentinel-header variant and ordinary-spec control. At the Step 3.5 fix-minors checkpoint, require dispatch of lint, format, test-timeout and test-retry for lint/format, only task commands for sentinel, and header-only commands for ordinary spec. Require fresh successful evidence for every supplied command before Step 3.5/menu return, stopping on failed test-retry or missing evidence. Ask for no menu rendering or push. |
  | `pr-subject-rebase-push` | Keep `rebase-push`, `range`, `body`. Supply `Rework base:`, existing original ref, origin equal to original home head, original head not ancestor of rewritten HEAD. Require rework-base proof once, no original-head proof, explicit lease push, existing ref untouched, full local-ref `Before:` wording, rework-base naming-commit range, capture/strip/seal/push/body order, exact fresh body fetch and edit invocations and byte handling, all-claims-dropped control. Move `later` to withheld and `guard` to preflight-stops. |
  | `pr-subject-rebase-withheld` | Keep consolidated `later` and `moved`: second finish uses non-force only when origin descends from rework base and is ancestor of HEAD, preserving the original ref and thread-range base; either failed ancestry condition withholds row 1 with moved-past reason. Retain rows 2-6 and bare 1/5/6 handling; recompute on menu return. Keep the later-push and remote-movement observations; remove the four pre-menu stop variants and migrate `guard`/`incomplete` unchanged to preflight-stops. No push on failed preflight. |
  | `pr-subject-rebase-preflight-stops` | Own moved `guard` and `incomplete` verbatim. Supply original home aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, member #13 cccccccccccccccccccccccccccccccccccccccc, Rework base dddddddddddddddddddddddddddddddddddddddd and HEAD eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. Copy the four donor stop variants: rewritten Rework base, sync unresolved with members pending, member #13 unresolved/pending, and rebased Base without Rework base. Ask for exact recorded-base-history or incomplete-sync stop text, whether menu or push is reached, whether merge mode is allowed, and that #13 stays open. These are pre-menu stops, never a merge fallback. |
  | `pr-subject-lease-refused` | Narrow to initial lease selection/push, evidence and range, and `stale info` refusal. Keep `lease`, `refused`, corrected `range`: source push form `git -C "$WORKTREE" push --no-follow-tags --force-with-lease=<home headRefName>:<PRE_REWORK_HEAD> origin HEAD:refs/heads/<home headRefName>`, evidence before strip/seal, original full SHA/local ref, range from rework base; refusal names moved-past reason, withholds row 1, retains rows 2-6/tree/open members, no retry/reset/body/closure. Delete `localBefore` observation/capture demands; later non-force and movement move to withheld, incomplete/boundary controls to preflight-stops. |
  | `pr-list-push-and-close` | Keep merge `ordering`, `attribution`, `question`, `outcomes`: every-original-head proof, each ref, non-force home-only push after evidence/strip/seal, fresh byte-preserving body edit before closure; Absorbs and attributed home/member threads; exact merged-and-reachable comments; displayed targets, immediate state/head rechecks, no deletion; decline, post-approval moved #14, already-CLOSED #14, one-time close failure, row 5 leaving both untouched. Correct only the success timing conjunct: close after immediate rechecks, then mark ship complete and report outcomes. For the focused ordering failure, add a case-only request to show exact merge-mode preflight proof calls for A, B, C (the original home/#13/#14 full SHAs, home first) and origin/retry; leave the ordering fact unchanged. |
  | `pr-list-rebase-push-and-close` | Keep only `ordering` and `attribution`. Supply completed rebase record, existing refs, #13 replay range and #14 empty. Ask explicitly for preflight proof commands and exact body fetch/edit invocations. Require lease home-only push, preserved refs, successful body before eligibility or close question, Absorbs URLs, attributed threads and their retained dispositions. Remove closure-question and variant requests; end at body EDIT success and explicitly ask not to render eligibility or closure. Move `rebase-members`, `rebase-comments`, `outcomes` verbatim to close-outcomes; remove them from this donor. |
  | `pr-list-rebase-close-outcomes` | Own the moved `rebase-members`, `rebase-comments`, `outcomes` with their IDs unchanged. Start after successful lease push and body edit. Supply saved pushed home eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, originals aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb/cccccccccccccccccccccccccccccccccccccccc, `Member replay: #13 3333333..4444444`, `Member replay: #14 empty`, both members OPEN at originals, successful 4444444 ancestry and cherry output with only minus lines, and exact PR URLs. Narrate eligibility, the fully instantiated gated target/text question, answer 1 with successful closes, then answer 2 and #14 moving after answer 1 as independent deltas. Require live-head equality and range/cherry proofs against the immutable pushed SHA, exact replay-range/already-contained comments and options, immediate live state/head re-fetch before close, skip changed or failed refreshes, close before mark-complete then report every outcome, no deletion or member push. Add nothing to eligibility, whose independent variants retain their existing budget. |
  | `pr-list-rebase-eligibility` | Own `rebase-members` checkpoint variants, starting after successful push/body with fixed saved pushed home SHA and recorded member SHAs. Require OPEN and recorded-head equality, range-last ancestry for #13, no-`+` successful cherry for #14 `empty` and `(already landed)`. Independently fail #13's proof at eligibility, supply `+` for #14, fail refresh or Git proof command, and make neither eligible: exclude/name each failed member, adjust exact question targets/comments, ask nothing for none. After approval re-fetch live state/head immediately before each eligible close; skip changed state/head or failed refresh. Do not require repeating immutable ancestry/cherry proofs after approval. |
  | `pr-list-member-advanced` | Keep merge `eligibility`, `targets`, `variants`: start the narrated closure checkpoint after successful push/body, fetching a not-yet-local current member head before ancestry against saved pushed home; advanced outside-home #14 excluded, only #13 offered/rechecked/closed; advanced but contained #14 remains eligible; no eligible members means no question. Preserve exact comments, no deletion and no home-history member-fix inference. Shared preparation stays supplied setup, not repeated output, so every check fits its existing 600 words. |
  | `pr-list-rebase-member-advanced` | Keep all source-grounded facts: unchanged OPEN #13 plus last replayed commit ancestor of pushed home at eligibility; advanced #14 excluded as `head moved` even if contained in home. Exact eligible-only replay comment/question, immediate live state/head recheck before close, skip changed/failed refresh, then mark complete and report every outcome. Keep no-eligible and #13 proof-fails-at-eligibility controls; remove only the impossible post-approval fixed-SHA ancestry-flip variant and immediate re-proof conjunct. No member push/deletion or home-history member-fix inference. |
  | `pr-subject-push-legacy-record` | Keep legacy `merge:` flow facts: original ancestry, non-force push, missing-ref creation, existing refs preserved, merge-sha or prehead thread-range fallback and full original local-ref wording. Move incomplete rebase stop to preflight-stops and ref-probe/update failures to legacy-ref-errors. Keep remaining legacy variants and the existing 650-word response budget. |
  | `pr-subject-legacy-ref-errors` | Own the two legacy ref-error checkpoints after strip/seal, with an otherwise admitted merge record: unexpected `rev-parse -q --verify` command error stops with output, not treated as absence; absent ref followed by update-ref permission failure stops. Neither proceeds to push/body/closure, overwrites an existing ref, or retries. Preserve the missing-ref success control in legacy-record. For the focused boundary failure, change only the case request to ask where the stop sits relative to completed strip/seal and push, and whether any push, body fetch/edit, closure question or close occurs; leave the boundary fact and every other expected fact unchanged. |

  Correct the list rebase `recheck` and `outcomes` conjuncts in their owning expected files and member-advanced case to match the source-owned boundaries above; keep eligibility-time proofs and immediate live identity rechecks mandatory. Correct merge list `outcomes` timing too. These earlier source-grounded corrections do not authorize rewriting the two facts identified by the focused diagnosis: its D1/D2 repairs change only the corresponding case requests, with no expected-fact changes. For single and list rebase body cases, explicitly request both `gh pr view <N> --json body` and the body-edit invocation so a source-grounded exact-command fact has an observation channel. Retain existing policy-rejection report-once behavior; no live branch-protection eval. A failing immutable proof is an eligibility input, never a new post-approval mechanism. Preserve every source-grounded conjunct across this split; no outcome is relaxed to fit a response budget.
- [ ] **Step 6: Rewrite brief cases and intents.** `eval/gauntlet-resume/samples/pr-subject-brief` and `pr-list-brief` carry `Rework base:` after pairs and scan from it; retain legacy first-head/no-pair fallbacks, ordered identity stops, member-spec exclusion, task snapshots. Write actual bundle-free assembly hashes in the five intent.md files and intended fact changes only; preserve stable IDs for surviving obligations. For the current reopen, update only writing-plans intent for `pr-subject-sync-repair/in-place-wave` and the ordinary merge control, and qualify its singleton-wave statement to retain ordinary singleton behavior except the marked rebase repair. Bind it to the current bundle-free assembly hash. For finishing, record the donor-to-destination sample/fact mapping from Step 5, move Expected-to-move references with migrated IDs, remove references to deleted donor facts, and explain the source-grounded corrections to recheck, timing, range, and lease spelling. Map both halves of `verification` to their actual checkpoint sample. Correct the merge-list ordering intent to: prove all three original heads at preflight; after evidence capture and strip/seal, preserve refs and push only home, then edit body before asking. Record D1/D2 as case-only clarification with expected facts unchanged and the three further splits as preservation, not accepted loss of a must-hold outcome. The runner's stale-intent refusal supplies the observed assembly hash before model calls. Never relabel old records as current.
- [ ] **Step 7: Run provisioning evals.** Run `node eval/run.mjs using-git-worktrees --baseline-only`, then changed samples individually while iterating, then `node eval/run.mjs using-git-worktrees`. Read report and candidate records; require improved/unchanged and new must-hold facts satisfied.
- [ ] **Step 8: Run brainstorming evals.** Run `node eval/run.mjs brainstorming --baseline-only`, iterate new sample/spec-only controls, then `node eval/run.mjs brainstorming`. Require both spec-only controls unchanged.
- [ ] **Step 9: Run finishing evals.** Run `node eval/run.mjs finishing-a-development-branch --baseline-only`. Run each changed sample while iterating: `node eval/run.mjs finishing-a-development-branch pr-subject-push`, `node eval/run.mjs finishing-a-development-branch pr-subject-rebase-push`, `node eval/run.mjs finishing-a-development-branch pr-list-push-and-close`, `node eval/run.mjs finishing-a-development-branch pr-list-rebase-push-and-close`, `node eval/run.mjs finishing-a-development-branch pr-list-rebase-close-outcomes`, `node eval/run.mjs finishing-a-development-branch pr-list-member-advanced`, `node eval/run.mjs finishing-a-development-branch pr-list-rebase-member-advanced`, `node eval/run.mjs finishing-a-development-branch pr-subject-lease-refused`, `node eval/run.mjs finishing-a-development-branch pr-subject-push-legacy-record`, `node eval/run.mjs finishing-a-development-branch pr-subject-rebase-withheld`, `node eval/run.mjs finishing-a-development-branch pr-subject-rebase-preflight-stops`, `node eval/run.mjs finishing-a-development-branch pr-list-rebase-eligibility`, `node eval/run.mjs finishing-a-development-branch pr-subject-merge-preflight`, `node eval/run.mjs finishing-a-development-branch pr-subject-merge-fix-minors`, and `node eval/run.mjs finishing-a-development-branch pr-subject-legacy-ref-errors`. Then run `node eval/run.mjs finishing-a-development-branch` for the full report. Require unchanged `spec-pr-menu`, all retained/migrated merge checks, all rebase checks, refusal, repeated-push, empty/already-landed-member, and legacy/error outcomes. Inspect current saved candidate replies and any confirmation replies from both replay models as well as verdicts: every split case stays within 600 words, legacy-record within 650, and every required fact holds. Pre-change baseline word counts do not measure the candidate change; neither the target's 1800-word mechanical ceiling nor a both-arms-fail unchanged label satisfies this amendment. Check `outputs` word counts and any `judge` confirmation text using the runner's whitespace-token rule (tokens containing a letter or digit, `eval/README.md:100`). D1/D2 require fresh replays after case changes and passing current judgments; the old replies and diagnostic do not prove the fixes. Generate both arms for each new sample and refresh stale records for retained samples; never copy another sample's evidence. Case changes require current replays; fact/intent-only changes require current judgments, with runner reuse only when its hashes match.
- [ ] **Step 10: Run planning evals.** Run `node eval/run.mjs writing-plans --baseline-only`, then `node eval/run.mjs writing-plans pr-subject-sync-repair` while iterating, then `node eval/run.mjs writing-plans`. Require both unresolved forms to finish pending replay and persist the boundary, not merely title Task 1. Require the new in-place Wave 1 fact on both candidate replay models and any confirmation, the ordinary merge control, all preserved facts and the 750-word case budget. Case/bundle changes require fresh replies; read the runner-generated records and full-target report, not the prior completion evidence.
- [ ] **Step 11: Run resume evals.** Run `node eval/run.mjs gauntlet-resume --baseline-only`, then `node eval/run.mjs gauntlet-resume`. Require both rewritten brief cases and unchanged non-PR routes. Never widen intent to accept regressions; fixture-only finishing corrections do not authorize instruction edits. Report a demonstrated source defect to its owner rather than fixing source to satisfy an invented fact.
- [ ] **Step 12: Check and commit.** Run Tests again; check ASCII, synthetic data, fact grammar, donor/destination coverage, unchanged target config, 600/650 candidate and confirmation budgets, and full-target reports. Preserve the completed focused pass's D1/D2 case-only repairs, three donor/destination splits, finishing intent and records; the current reopen changes only the planning case/expected, writing-plans intent and runner-generated planning records/report. Expected D1/D2 facts, acceptance rows and all case limits stay unchanged; Task 3 owns the new source instruction delta. Stage declared assets and generated records only; run `git commit -m "Cover PR rebase replay and lease workflows with evals"`, recording behavior-change classification, the in-place fact and reports in the body.

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
- baseline: 2a46081a pass
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
| § "Plan (`writing-plans/SKILL.md:189`)" L81 | Task 1 repairs pending members and persists boundary by amendment; both rebase forms run alone in Wave 1 marked `in-place` with one branch-checkout implementer, no nested worktree, patch integration or soft fold, retained wave commit and subsequent base capture; merge remains ordinary; behavioral eval proves the distinction | Task 3, Task 4 |
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
| § "Tests" L145 | Rebase push/list ordering and attribution; close-outcomes owns members/comments/outcomes; withheld and eligibility retain their checkpoints; merge-preflight keeps menus/basic verification/guards/divergence and merge-fix-minors owns fix evidence; source-grounded checks preserved within 600 words on candidate and confirmation replies, not pre-change baselines | Task 4 |
| § "Tests" L146 | New pr-list-rebase-member-advanced tests equality plus last-range ancestry; retain pr-list-member-advanced contained-head merge control, separate 600-word budgets | Task 4 |
| § "Tests" L147 | Lease-refused isolates refusal; rebase-withheld keeps remote movement/later non-force; rebase-preflight-stops owns incomplete and rewritten-boundary stops, 600 words each | Task 4 |
| § "Tests" L148 | Legacy merge/missing-ref flow retains 650 words; incomplete rebase in rebase-preflight-stops; probe/update failures in pr-subject-legacy-ref-errors at 600 words, with case-only boundary clarification | Task 4 |
| § "Tests" L149 | Unchanged spec-only controls | Task 4 |
| § "Tests" L150 | Pending replay and persistent Task 1 repair eval, with the Plan L81 in-place Wave 1 distinction | Task 4 |
| § "Tests" L151 | Rework-base handoff/reconstruction eval | Task 4 |
| § "Tests" L152 | No live branch-protection eval | Task 4 |
| § "Tests" L153 | Updated deterministic assertions and integrated check | Task 1, Task 5 |
| § "Documentation impact" L157 | Amend README and stage changelog for release | Task 5 |
