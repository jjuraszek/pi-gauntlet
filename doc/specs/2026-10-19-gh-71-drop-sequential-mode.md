# Drop sequential mode: every plan task runs as a wave of N >= 1

> **Superseded by:** [doc/specs/2026-10-20-skill-read-budget.md](./2026-10-20-skill-read-budget.md) - the older-runtime fallback bullet for N=1 waves (L106) only

**Ticket:** #71
**Goal:** `subagent-driven-development` runs one per-wave loop for every plan; a wave of one task is an ordinary wave. The re-review `## Fix delta` has one definition - `git diff --binary <tree-before> <tree-after>` over tree objects recorded through a scratch index - so a repair worker's commit or staging state can no longer empty it.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-10-18-gh-70-wave-as-one-chain.md` (D1 out-of-scope clause keeping sequential mode), `doc/specs/2026-09-30-gh-56-minor-findings-ride-along-fix-waves.md` (D6 fix-delta definitions), `doc/specs/2026-06-15-auto-proceed-spec-to-execution.md` (D4 execution-mode auto-selection)

## Problem

The implement phase has two code paths for the same work. A multi-task wave runs implementers in nested worktrees, spec-reviews each patch, integrates, tests, code-reviews the integrated tree, and commits once. A one-task plan step runs an in-place implementer that commits its own work, then the same reviews. Both reach the same three dispatches per task (implementer, spec reviewer, code reviewer), but the mode split is named in 18 lines across five skill files (`rg -n -i "sequential mode|wave mode|wave-mode|parallel-wave mode|in either mode|both modes" skills/` at 7.20.0), the plan carries a `Solo:` line that `plan_check` enforces only to justify the one-task case, and `writing-plans` picks the mode at handoff.

The split also carries a defect. `## Fix delta` (`skills/subagent-driven-development/SKILL.md:76`) has three definitions; the in-place one (wave step 6, `SKILL.md:173`) tells the repair worker to leave its fix uncommitted and unstaged, then captures `git diff --binary` on the working tree. `implementer-prompt.md:35` tells every worker to commit. When the repair worker commits anyway, the captured delta is empty and the re-reviewer sees no fix.

Since #70 (commit `9d32f42`) a one-task wave already dispatches as one chain; pi-cohort's `createWorktrees` and `captureWorktreeDiff` (`src/runs/shared/worktree.ts:441-528`, 7.4.0) have no N==1 special case, and the conformance retry and spec-gap re-dispatch already use one-entry `tasks` waves. The wave path is the proven N >= 1 path; the sequential path is a duplicate.

Framing: kept. The user confirmed the ask as framed; the CR fix fan-out is unavailable on every uncommitted integrated wave today (`dispatching-parallel-agents/SKILL.md:116`), so a one-task wave loses nothing a multi-task wave has.

## Acceptance criteria

Ticket #71, `## Acceptance Criteria`, rows verbatim:

- [ ] `rg -n -i "sequential mode|wave mode|wave-mode|parallel-wave mode|in either mode|both modes" skills/` returns zero matches; `skills/subagent-driven-development/SKILL.md` has no "Sequential vs. Parallel-Wave" heading, and its process section describes one per-wave loop that admits a wave of one task.
  in-scope
- [ ] `skills/writing-plans/SKILL.md` Execution Handoff contains no mode-selection step and its Wave Grouping, wave template, and commit-step prose name no execution mode; `skills/writing-plans/reference/plan-contract.md` has no Solo line section and no `Parallel-safe:` construct; `plan_check` no longer emits `solo-line` (its test in `extensions/lib/plan-check.test.*` is removed or inverted), and a plan whose every wave holds one task with no `Solo:` lines passes `plan_check`.
  in-scope
- [ ] The `## Fix delta` rule in `skills/subagent-driven-development/SKILL.md` has exactly one definition of the delta's content - `git diff --binary <tree-before> <tree-after>` between the tree object recorded at the previous review's dispatch and the one recorded at the re-review's dispatch - and carries the capture as one marked shell block that records a tree through a temporary index (`GIT_INDEX_FILE` pointing at a scratch file, `git add -A`, `git write-tree`) and names the checkout it runs in for the pre-integration case (the spec-review snapshot) and the integrated case (the branch checkout); no clause instructs a repair worker to leave its fix uncommitted or unstaged; the wave loop names one commit point: after the code review accepts, before `plan_tracker` `complete`.
  in-scope
- [ ] `scripts/wave-review.test.mjs`, run by `npm test`, exercises that shell block against a real Git fixture whose tree-before already contains a changed file and whose repair adds a new file, three times - repair committed, repair staged, repair unstaged - and asserts the three captured deltas are byte-identical, equal to the fixture's expected repair-only patch (the new file, not the pre-existing change), and that `git status --porcelain` in the checkout is identical before and after each capture.
  in-scope
- [ ] `skills/dispatching-parallel-agents/SKILL.md` Fix fan-out precondition and `skills/verification-before-completion/reference/conformance-check.md` name no sequential mode and match that commit point.
  in-scope
- [ ] `eval/subagent-driven-development/` gains one sample and updates one, with `intent.md` listing both: (a) new - a plan whose every wave has one task; must hold: each task runs through the wave loop (nested worktree, spec-review snapshot, patch integration, per-wave commit), one spec review per task, one initial code review per wave, and no lone `agent: "implementer"` dispatch outside a `tasks` fan-out. (b) `integrated-wave-repair`, a one-task wave whose code review returns `FIX_FIRST`; must hold: the fix is one in-place worker (no fan-out), the repair payload carries no commit or staging instruction, the re-review's delta is the tree-before/tree-after diff, the commit lands after the re-review accepts, and `plan_tracker` `complete` follows the commit. `node eval/run.mjs subagent-driven-development` passes both samples and its `report.md` is committed.
  in-scope
- [ ] `npm test` passes and `CHANGELOG.md` `## Unreleased` carries the entry naming the removed mode and the single fix-delta definition.
  in-scope

Readings adopted as Design clauses: "no lone `agent: "implementer"` dispatch" in row 6(a) covers plan tasks; in-place repair workers (row 6(b), wave step 6) and escalation workers stay plain dispatches. "One initial code review per wave" keeps the doc-only wave SR-only exemption; the new sample is a code-touching plan. "Spec-review snapshot" in row 6(a) is satisfied by the chain's `treePath` tree on pi-cohort >= 7.4.0 and by the materialized snapshot on the fallback path.

## Design

### D1. One loop

`skills/subagent-driven-development/SKILL.md` loses `## Sequential vs. Parallel-Wave`, the sequential `## The Process`, and the `## Parallel-Wave Mode` heading. `## The Wave Loop` replaces `## Parallel-Wave Mode` at its current position (after `## Dispatch`, before `### Chain stopped or failed`); its first sentence states that a wave holds N >= 1 tasks and that every plan task runs through it. Section order elsewhere is unchanged, so `## Fix-Loop Rounds` stays the stable heading ahead of the loop.

Two rules that only `## The Process` states today move into `## Prerequisites` before that section is deleted: the `SCOPED_TEST_COMMANDS` extraction rule (`**Tests:**` command bullets, backticks stripped, `- none:` -> `none`, wave = union; `via:` bullets and `- Test:` paths are contract, never commands) and the spec-amendment / unreadable-anchor paragraph (orchestrator is the spec's only writer; `BLOCKED` citing a spec defect or a finding showing the spec is wrong -> brainstorming's amendment path; an SR unable to read a cited anchor returns a blocking finding).

The loop body is the current wave steps 1-7 with these edits:

- Step 1 drops "run those tasks as sequential single-task waves"; a mis-grouped wave is split into one-task waves.
- Step 4: an `apply --index` failure drops that task from the wave; the surviving tasks finish steps 5-7, and the dropped task is then re-dispatched as a one-task wave from the new committed HEAD. No rerun happens inside the dirty wave. With zero surviving patches, skip steps 5-7 and retry the failed task from the unchanged clean HEAD under the existing two-attempt failure limit; do not review or commit an empty wave. An exhausted retry keeps the task `in_progress` and stops for the human; `failed` is written only on a human-decided terminal failure.
- Step 5: a test-gate failure is repaired in place - one `implementer` in the branch checkout with the failing output, the owning task's text, and the wave's `SCOPED_TEST_COMMANDS` (the same worker shape as step 6, under [When a Subagent Fails](#when-a-subagent-fails) attempts) - then the scoped gate reruns. After it passes, stage repair deliverables and spec-review every affected task against the integrated checkout before the initial CR; prior SR acceptance does not cover the repair. A nested one-task wave is never dispatched from the integrated, uncommitted checkout: pi-cohort refuses a dirty checkout and a child from the old HEAD would not see the integrated siblings.
- Step 6 drops the override that leaves the fix uncommitted and unstaged and the `git add -N` capture. The repair worker runs in place in the branch checkout; its payload carries the report verbatim and no commit or staging instruction (the retained `implementer-prompt.md:35` commit step may run - D2 makes it irrelevant). Before every CR dispatch and every SR/CR re-review the orchestrator runs `git -C <worktree> add -A` so every repair deliverable, new files included, appears in the `HEAD_SHA: WORKTREE` whole diff the reviewer reads. The fix delta comes from D2.
- Step 7 is the one commit point: after the wave's required gate accepts (CR for a code-touching wave; SR alone for a doc-only wave), the orchestrator folds everything since the wave base into one wave commit - `git -C <worktree> reset --soft "$WAVE_BASE_SHA" && git -C <worktree> add -A && git -C <worktree> commit -m <message>` - so a repair worker's own commit and any staged or unstaged remainder become that commit; then it marks the wave's tasks `complete`. There is always something to commit after an accepted wave, so "nothing to commit" is a stop.

"Dependent tasks: include previous task's summary" moves into the loop intro. The `DONE` row of the status table reads "work present in the worker's tree; the wave commit is step 7". The dispatch-shape section keeps #70's one chain per wave (including N=1), the `pi list` preflight, and the older-runtime fallback unchanged. `### Chain stopped or failed` and `## Spec-review snapshots` stay as they are, except that `Re-dispatch by cause` names the tree recording of D2 at each snapshot dispatch and drops "same as sequential". `stop-note.md:3` drops its "Wave mode:" prefix; the sentence applies to every stall.

### D2. Fix delta

`## Fix delta` becomes one rule: every re-review payload (SR or CR) carries a `## Fix delta` block holding `git diff --binary <tree-before> <tree-after>`, where each tree is recorded by this block at the moment the review it precedes is dispatched - tree-before at the prior review's dispatch, tree-after at the re-review's dispatch. The block runs in the spec-review snapshot for a pre-integration review and in the branch checkout for an integrated review; `FD_ROOT` is that checkout. It reads the checkout and writes only a scratch index and a tree object; `git status` is identical before and after.

<!-- fix-delta-tree-shell -->
```bash
FD_ROOT={{CHECKOUT}}
FD_INDEX=$(mktemp) || exit 1
cp "$(git -C "$FD_ROOT" rev-parse --path-format=absolute --git-path index)" "$FD_INDEX" || { rm -f "$FD_INDEX"; exit 1; }
GIT_INDEX_FILE="$FD_INDEX" git -C "$FD_ROOT" add -A && GIT_INDEX_FILE="$FD_INDEX" git -C "$FD_ROOT" write-tree
FD_STATUS=$?
rm -f "$FD_INDEX"
exit "$FD_STATUS"
```

`rev-parse --git-path index` resolves the live index in a primary checkout (`.git/index`) and in a linked worktree (`.git/worktrees/<name>/index`), where `$FD_ROOT/.git` is a file; a zero-byte scratch index makes Git exit with `index file smaller than expected`, so a failed seed is a failed capture, and `write-tree`'s status survives the cleanup. The printed SHA is the recorded tree.

Recording lifecycle - the orchestrator runs the block and keeps the printed tree keyed by task (SR) or wave (CR):

- Every SR dispatch it makes itself (snapshot-backed first reviews and every SR re-review): in that review's snapshot, before dispatch.
- Every CR dispatch and CR re-review: in the branch checkout, after the `add -A` of D1 step 6, before dispatch.
- A chain-run SR has no parent-owned checkout: pi-cohort removes its trees before the chain returns (`SKILL.md:279`). When its verdict is `NEEDS_REWORK` or `OUT_OF_SCOPE_CHANGES`, the orchestrator materializes the snapshot of that task's artifact patch (`## Spec-review snapshots`; `WAVE_BASE_SHA` + `apply --index`, the same inputs as the chain's `treePath`) and records tree-before from it before dispatching the fix. The replacement patch's snapshot gives tree-after at the re-review dispatch. The chain itself is unchanged.

The delta is `git -C "$FD_ROOT" diff --binary <tree-before> <tree-after>` (tree objects live in the shared object store, so any checkout of the repository resolves them). Whole-diff re-reviews carry no fix delta (unchanged). Omit the block only when the prior tree is genuinely unavailable (a fresh-session resume); the reviewer then treats the task's whole diff as the delta. Worker commit, staging, or unstaged state has no effect on the delta. Never a SHA range, never the working-tree diff.

### D3. Plan contract

`skills/writing-plans/SKILL.md`: Wave Grouping drops the Solo rule and the "executor auto-selects" sentences (`:121`), the "see `subagent-driven-development` Parallel-Wave Mode" pointer (`:111`) names the wave loop, and the doc-wave collision rule (`:125`) says a multi-task doc wave runs its tasks concurrently, naming no mode; the wave template loses `Parallel-safe:` and `Solo:`; the commit-step prose (`:243`) reads "the orchestrator commits each wave after code review accepts; a task's own commit step runs inside its nested worktree and is captured as its patch"; Self-Review drops "Solo-reason validity"; Execution Handoff initializes `plan_tracker` and invokes `/skill:subagent-driven-development`, with no mode bullets. `reference/plan-contract.md` loses `## Solo line (solo-line)`. `implementer-prompt.md:35` "Commit your work" stays.

`skills/requesting-code-review/SKILL.md`: the mandatory-trigger bullet (`:17`, "After each task in subagent-driven development") and the Integration bullets (`:62-64`, "Review after EACH task ... before moving to next task") read "one initial code review per code-touching wave in subagent-driven development, over the integrated wave diff; doc-only waves are SR-only". The Fix rounds paragraph (`:54`) keeps "Sequential round (one task)" - that names a one-task fix round, not an execution mode, and the rg gate in AC row 1 does not match it.

`extensions/lib/plan-check.ts`: delete `soloLine`/`soloReason`, their parse, and `checkSoloLine`. `plan-check.test.ts`: remove `Solo:` from fixtures, invert check 7 to "every-wave-singleton plan without `Solo:` lines passes", drop the composite test's solo assertion. `npm run build:bins`, commit `bin/`. `skills/gauntlet-resume/reference/brief-contract.md:161` drops `solo-line` from the check list.

### D4. Downstream wording

`skills/dispatching-parallel-agents/SKILL.md:16` names the wave loop. The Fix fan-out precondition (`:116`) keeps its three cases and loses the mode word: (1) a clean committed HEAD containing the code under review - the verify-phase whole-diff review and the conformance loop; (2) an unintegrated patch (a per-patch spec review) - each fix task branches from `WAVE_BASE_SHA` and carries the prior patch verbatim, the consuming loop's spec-gap re-dispatch; (3) an integrated wave before its commit - fan-out unavailable, fix in place (D1 step 6). The `**Fix fan-out.**` paragraph in `## Fix-Loop Rounds` points at that precondition instead of restating it. `conformance-check.md:127-129` names the wave loop instead of "Parallel-Wave mirror/Mode". `skills/requesting-code-review/SKILL.md:28,54` keep BASE_SHA/WORKTREE review sources; the committed-range source is named for the whole-diff review only. The one persona comment `writing-plans' plan-time Parallel-safe: line is a deliberately different free-text form; do not unify` lives only at `agents/code-reviewer.md:80` and is deleted; the reviewer-side `Parallel-safe:` report grammar in `agents/spec-reviewer.md:63-86`, `agents/conformance-reviewer.md:113-132`, and `spec-reviewer-prompt.md:36,99-100` is the live fix fan-out certificate and stays byte-identical. Frozen copies under `eval/forge-skill/samples/*/fixture/` stay.

### D5. Supersession

Banners per `brainstorming/reference/superseding.md` on the three predecessors named in the header, scoped to the sections listed there, plus one on `2026-05-31-parallel-wave-execution.md` scoped to its three reversed clauses: line 21 (mode chosen at handoff, defaulting to sequential), line 29 ("Sequential remains the default mode"), and line 204 ("Single-task wave. Runs as today's sequential per-task flow"); its D3 and the rest of its text describe the surviving wave loop and stay unbannered. `2026-08-21-execution-latency-review-scoping.md` keeps no banner.

## Errors and edge cases

- The tree block exits non-zero (unseedable index, failed `add -A` or `write-tree`) -> the review dispatch stops with the shell error, the same rule as the snapshot block.
- A repair that touches only ignored paths yields an empty delta: that is a failed fix attempt under [When a Subagent Fails](#when-a-subagent-fails) - no re-review is dispatched, the attempt counter advances, the prior report is re-sent with "your fix changed no tracked file", and the existing two-attempt limit stops.
- A repair worker commits in the branch checkout: the capture reads the tree, HEAD position is irrelevant, the re-review sees the repair-only delta, and step 7's `reset --soft` to `WAVE_BASE_SHA` folds that commit into the one wave commit before `plan_tracker` `complete`.
- Integration or the test gate fails with the checkout dirty: repair in place (D1 steps 4-5); the checkout stays dirty until step 7, and no nested wave is dispatched from it.
- A plan that still carries `Solo:` lines passes `plan_check` silently; the line is free text under the wave header.
- One-task wave stops on `BLOCKED`, `NEEDS_CONTEXT`, or chain error: the existing recovery table applies unchanged.
- Older runtime (< pi-cohort 7.4.0): the fallback fan-out applies to N=1 like any wave.

## Tests

- `scripts/wave-review.test.mjs`: split markers move to `## The Wave Loop` / `## Spec-review snapshots`; new test extracts the `<!-- fix-delta-tree-shell -->` block and runs it in a **linked worktree** of the fixture repo (`git worktree add`, the production shape of every checkout the block sees) whose tree-before holds a changed file and whose repair adds a new file, three times (committed, staged, unstaged); asserts the three deltas are byte-identical, equal the repair-only patch, and `git status --porcelain` is identical before and after each capture. One negative case: the block exits non-zero on a path with no index and leaves no scratch file.
- `extensions/lib/plan-check.test.ts`: per D3.
- Text evals: `eval/subagent-driven-development` - add `all-singleton-waves` (code-touching 3-task linear plan; facts per AC row 6(a)), rewrite `integrated-wave-repair` (facts per row 6(b), including: the repair worker commits, the re-review delta is still the repair-only tree diff, the wave commit follows acceptance, `complete` follows the commit), delete `committed-sequential-review`; `target.json` slice starts at `## Fix-Loop Rounds` (present on `main` and on the candidate, so baseline replay resolves; the span covers the fix-delta rule, the loop, and recovery) and ends at `## When a Subagent Fails`; `intent.md` lists the new sample, the rewritten facts, and the deleted sample. `eval/writing-plans` - add `all-singleton-plan` (handoff names no mode, template carries no `Solo:`), fix `parent-fail-redispatches-once` fixtures that quote `solo-line`. Add `test-gate-repair` (in-place behavior repair, passing scoped rerun, affected-task SR before initial CR) and `singleton-apply-failure` (zero survivors, no empty review/commit, bounded retry from clean unchanged HEAD) to the SDD target and its intent. Run both targets fully; commit both `report.md`.
- Live paired fixture (recorded in the squash commit body), two arms, each run once on `main` and once on the candidate:
  - Parity: a linear 3-task plan with no seeded finding. Compare per-persona dispatch counts, tracker transitions, and one wave commit per task.
  - Committed-repair probe: a 2-task single-wave plan (on `main` this reaches the integrated-wave path; a 1-task plan takes `main`'s sequential path, whose `git diff <HEAD> HEAD` delta is nonempty after a commit and cannot show the defect). The CR finding is seeded through the task text - task 2 deliberately leaves a named unused export so CR returns `FIX_FIRST` on it - and the repair worker is told to commit. Expected: `main` captures an empty `## Fix delta`; the candidate captures the repair-only diff (the removed export). If either arm's CR does not return the seeded `FIX_FIRST`, record the probe as inconclusive; it is not defect evidence.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` pi-cohort peer requirement line (communication contract: a wave of N >= 1 is one chain call); `README.md:113` glossary "Wave" row rewritten to "A batch of N >= 1 plan tasks with disjoint files, run through the one wave loop; N > 1 dispatches concurrently"; `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: `doc/specs/2026-09-30-gh-56-minor-findings-ride-along-fix-waves.md` D6, `doc/specs/2026-10-18-gh-70-wave-as-one-chain.md` D1 out-of-scope clause, `doc/specs/2026-06-15-auto-proceed-spec-to-execution.md` D4, `doc/specs/2026-05-31-parallel-wave-execution.md` lines 21, 29, 204 (supersession banners)

## Out of scope

- Committing the integrated wave before CR to regain fix fan-out.
- pi-cohort changes; pi-cohort#25's re-ask lands independently and the chain benefits without edits here. Peer-floor bump is a release decision.
- The `loop` engine (#68).
- Checkout-local setup beyond pi-cohort's `node_modules` symlink.
- `extensions/plan-tracker.ts` / `phase-tracker.ts` `executionMode: "sequential"` (pi tool-execution mode, unrelated).

## Open questions

none
