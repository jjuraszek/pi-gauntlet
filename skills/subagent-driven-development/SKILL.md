---
name: subagent-driven-development
description: Use when executing an implementation plan in the current session (the task-plan implement engine; the acceptance-criteria ledger engine is /skill:loop-implementation)
---

> **Related skills:** Need an isolated workspace? `/skill:using-git-worktrees`. Need a plan first? `/skill:writing-plans`. Done? `/skill:finishing-a-development-branch`. Reached via the auto-chain from `/skill:writing-plans` (not a direct human entry point; direct invocation stays possible for recovery, e.g. re-running after a STOP).

# Subagent-Driven Development

Execute a plan by dispatching a **fresh subagent per task**, with two-stage review after each: spec compliance first, then code quality.

**Core principle:** Fresh subagent per task + two-stage review = high quality, fast iteration.

If a tool result contains a ⚠️ workflow warning, stop immediately and address it before continuing.

Gauntlet execution dispatches are foreground: set top-level `async: false` on every implementation, review, conformance, retry, and prose-described dispatch. Preserve parallel `tasks` batches and chain groups. `forceTopLevelAsync` is incompatible; an unexpected async handle means stop and report, never poll or relaunch. See [pi-cohort dispatch configuration](https://github.com/jjuraszek/pi-cohort/blob/main/doc/configuration.md).

## Why Subagents

Your context window holds the full plan, prior decisions, and conversation history. Each subagent gets a fresh window with only the current task's text and context.

- **No context pollution.** Task N's noise doesn't leak into Task N+1.
- **Tighter focus.** Subagent reads less, makes fewer cross-task assumptions, ships smaller diffs.
- **Cheaper at scale.** Operator pins (`subagents.agentOverrides.<agent>.model`) route simple subtasks to smaller models; you spend top-tier tokens on orchestration and hard problems.

You are the **orchestrator**. You read the plan, dispatch, review the review, decide. You do **not** write code yourself.

## Continuous Execution

**Do not pause to check in with the user between tasks.** The plan is already approved. Pause only when:

- A subagent returns `NEEDS_CONTEXT` or `BLOCKED` (see [Implementer Status](#implementer-status))
- An escalated round fails with no funded round left (stop note per [Fix-Loop Rounds](#fix-loop-rounds))
- A ⚠️ workflow warning fires

Reaching the end of the plan is not a pause: continue through verification and invoke `/skill:finishing-a-development-branch <abs worktree path>` as defined in [After All Tasks](#after-all-tasks-complete).

Periodic "should I continue?" prompts add latency without adding safety. The plan is the contract; execute it.

## Prerequisites

- The worktree path is known - from the `using-git-worktrees` Step 4 report in this session or the handoff brief's `worktree:` row - and is passed as the top-level dispatch `cwd`, except per-patch spec reviews use [Spec-review snapshots](#spec-review-snapshots). If no worktree path exists, stop and invoke `/skill:using-git-worktrees` first - implementation never lands directly on `main`. The process cwd is the primary checkout; nothing here changes it.
- Approved plan or clear task scope
- `plan_tracker` list initialized at writing-plans handoff with the full wave-ordered task list. Consume and preserve it on continuation; only direct recovery with no tracker initializes the full plan list once, before dispatch, and never over an existing list.

Extract **`SCOPED_TEST_COMMANDS`** from the task's `**Tests:**` command bullets, backticks stripped, one per line; `- none:` -> `none`; a wave = the union of its tasks' commands. Treat `via:` and `baseline:` bullets and `- Test:` paths as contract, not commands: carry them with the task text, never in `SCOPED_TEST_COMMANDS`.

Keep the orchestrator as the spec's only writer during execution. On implementer `BLOCKED` citing a spec defect, or a review finding showing the spec (not the code) is wrong, pause the fix loop, read and execute brainstorming's [amendment path](../brainstorming/SKILL.md#amending-an-approved-spec) in place (it reviews first; with amend permission on the `**Amend-grant:**` line it applies amends without a stop and still stops on a redraw; without permission it stops on escalation or redraw), then resume. Keep code-vs-spec mismatch in the SR loop. Require an SR unable to read the spec at a cited anchor (missing file, unresolvable heading/range) to return a blocking finding - the contract is spec+task or stop, never a silent fallback to task-only review.

## Fix-Loop Rounds

Apply one rule to both review loops - spec-compliance and code-quality.

**Re-review dispatch rule:** every re-review task includes the complete prior review report verbatim under the marker `## Previous review report (re-review trigger)`, plus the trajectory block from the reviewer's prompt template. The marker's presence is what obligates the reviewer to emit the `TRAJECTORY:` line. You never select, summarize, or diff findings yourself - pattern-match the sentinel line only. Include the delta defined in [Fix delta](#fix-delta) in every SR/CR re-review.

**Fix fan-out.** When a fix round is fanned out per `/skill:requesting-code-review` Fix rounds, use the precondition and dispatch shape owned by `/skill:dispatching-parallel-agents` "Fix fan-out"; the fan-out counts as **one** fix against this budget, its scoped test gate is the consuming task/wave's `SCOPED_TEST_COMMANDS`, and one re-review of the integrated delta follows.

**Behaviour-change reroute.** When the triggering CR report carries `Behaviour-change: yes`, the fix round's re-review is SR first, then CR. Include `## Fix delta` on this SR-first behavior-change repair. Dispatch SR against the fix diff and the task's spec anchors as a first review (no `## Previous review report` marker, so no `TRAJECTORY:` line; SR carries no test commands but does carry the task's `**Tests:**` block and `- Test:` paths), but its ordinal continues the task's SR-loop count - a task whose SR loop ended at review 2 gets review 3 here, and an issue-bearing rerouted SR after review 4 escalates. Issues follow the normal sequence: fix, then SR re-review pasting this SR's report. CR round numbering is unchanged. `Behaviour-change: no` re-reviews with CR only. A missing or malformed `Behaviour-change:` line is re-asked once like `Parallel-safe:` (see `dispatching-parallel-agents` "Structural probe"); still missing -> route through SR, never default to `no`. Target the SR re-review at the task(s) whose files the fix touched; after integration, dispatch it against the current implementation worktree, not a pre-integration snapshot.

Every fix re-dispatch (implementer) and code-review re-review carries the consuming task/wave's `SCOPED_TEST_COMMANDS`; spec-reviewer re-reviews carry the `**Tests:**` block and `- Test:` paths, no commands - SR never executes.

**The sequence.** Each review that finds issues is a decision point: read the `TRAJECTORY:` line before dispatching anything (review 1 has no line - on issues, dispatch fix 1). Any clean review ends the loop. For code review, *issue-bearing* means verdict `FIX_FIRST` and *clean* means verdict `SHIP`, whatever Minors the report lists; spec review keeps its gaps/acceptance meaning. `REJECT` is neither: stop and report per `stop-note.md`; the loop never enters.

1. **Review 1** (first review - no sentinel). Issues -> dispatch fix 1.
2. **Review 2** (re-review). Issues -> if `STAGNANT`, escalate now - no fix 2. Otherwise dispatch fix 2.
3. **Review 3** (re-review). Issues -> if the line reads `CONVERGING` and does not contain `max severity Critical` (spec reviews: `CONVERGING` alone), run the convergence exception: dispatch fix 3, then review 4. Any other outcome - `STAGNANT`, `DIVERGING`, a missing or malformed line, `max severity Critical` - escalate. Do not re-dispatch just to obtain the line.
4. **Review 4** (re-review, only after the exception). Issues -> escalate, whatever the verdict. The exception fires at most once per loop; verdicts never chain into a second grant.

Every dispatched fix is verified by a re-review before escalation or task progression - the loop only ever exits on a clean review or an escalation.

Read [reference/fix-loop.md](./reference/fix-loop.md) now for escalation and funded-round dispatch rules.

**Worked examples:**

- Review-2 verdict `TRAJECTORY: STAGNANT (repeat of: unchecked error path in parser)` -> escalate now, before fix 2 - earlier than the ordinary budget.
- Review-3 verdict `TRAJECTORY: CONVERGING (3 -> 1, max severity Moderate)` -> dispatch fix 3; if review 4 still finds issues, escalate.
- Review-3 verdict `TRAJECTORY: CONVERGING (3 -> 2, max severity Critical)` or `TRAJECTORY: DIVERGING` or no `TRAJECTORY:` line -> escalate.

## Fix delta

Include a `## Fix delta` block in every SR/CR re-review payload: `git diff --binary <tree-before> <tree-after>` between the tree recorded at the prior review's dispatch and the tree recorded at this re-review's dispatch. Record each tree with the shell block below; keep the printed SHA keyed by task for SR or wave for CR. Run it in the spec-review snapshot for pre-integration reviews, or in the branch checkout for integrated reviews (`FD_ROOT`). Tree objects share the repository's object store; use `git -C "$FD_ROOT" diff --binary <tree-before> <tree-after>` to produce the delta. Worker commits and staging state do not affect it; never substitute a SHA range or working-tree diff.

Substitute a shell-quoted checkout path for `{{CHECKOUT}}` and run the entire block. Stop review dispatch on a nonzero exit and report the shell error. The block reads the live index, writes only a scratch index and tree object, and preserves checkout status.

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

Omit the delta for whole-diff re-reviews. Otherwise omit it only when the prior tree is genuinely unavailable after a fresh-session resume; the reviewer then treats the task's whole diff as the delta. On an empty delta (including ignored-only repairs), dispatch no re-review: count a failed attempt under [When a Subagent Fails](#when-a-subagent-fails), resend the prior report with "your fix changed no tracked file", and stop after the existing two-attempt limit.

## Implementer Status

Every implementer dispatch returns one of:

| Status | Meaning | Orchestrator action |
|---|---|---|
| `DONE` | Implemented + tests pass + self-reviewed; work present in the worker's tree; the wave commit is step 7 | Proceed to spec review |
| `DONE_WITH_CONCERNS` | Implemented + tests pass, but flagged a deviation or risk | Read concerns. If acceptable, proceed. If not, dispatch fix subagent. |
| `NEEDS_CONTEXT` | Implementer needs information you have | For a spec-defect citation, take the amendment route below first. Resolve fact asks per [lookup handling](./stop-note.md). For decisions, answer and re-dispatch with answers in the task text, or escalate to the user. |
| `BLOCKED` | Cannot proceed (missing dependency, spec contradicts code, environment broken) | For a spec-defect citation, take the amendment route below first. Resolve fact asks per [lookup handling](./stop-note.md). For decisions, stop and diagnose: fix the orchestration-level issue and re-dispatch, or escalate to the user. |

Classify each question: treat a question whose candidate answers are each edits to the spec, plan, or an approved rule as an amendment batch per [amendment-surface.md](../brainstorming/reference/amendment-surface.md), never a decision. Stop for a redraw: changed problem statement; component added, removed, or re-bounded. Decode the `**Amend-grant:**` value through that surface's Standing grants. With amend permission, apply each item's `recommended` (`accept` or named `alt-n`), print `amended the spec: <title> - <what>`, and complete section 5's plan-writer amend dispatch, `plan_check`, tracker update, and one `amend:` commit in the same turn; skip reviewer, menu, and confirmation turns. Without permission (including absent or `none`), retain the surface's menu and escalation/redraw routing. For remaining questions, classify artifact location, value, or existence as a fact ask; scope and option choices as decisions; another-round approval as a decision only with no funded round left.

Implementer prompt templates must instruct subagents to return one of these statuses explicitly.

## Model

- Omit `model:` so the operator's `subagents.agentOverrides.<agent>.model` pin applies, or else the child inherits the main loop.
- Pass `model:` only a runtime-resolved `gauntlet_setting` value (`closureReview.model`, `escalationLoop.implModel`, `specCouncil.members[]`, `specCouncil.chair`) or a model the user named for that dispatch.
- Read the main loop's own string from `$PI_PROVIDER`/`$PI_MODEL` with the bash tool only when a skill must bypass a persona's frontmatter `thinking` pin for cost or must pass an explicit fallback after a configured model is unreachable.
- Omit `model:` when `closureReview.model` or `specCouncil.chair` is `undefined`; pass an `implModel` string verbatim, and stop with a note when `implModel` is `undefined` (Fix-Loop Rounds).
- Apply suffix edits such as `:low` only to a runtime-resolved string, never to a name the skill wrote; never write a provider or model name, tier tasks by cost, or swap a pinned model for a cheaper or stronger one.

## Leg routing

Read `## Legs` in the home spec and [the leg contract](../brainstorming/reference/legs.md). Admit task `Leg:` through `plan_check`; absent means home. Repair `leg-unknown` in the plan, never membership. Keep the existing flat tracker and task indices.

Require leg-homogeneous waves. Split a mixed wave into consecutive single-leg waves preserving dependencies before dispatch. Select its owning worktree before capturing `WAVE_BASE_SHA`; use that root for isolation, dispatch `cwd`, `git -C`, snapshots, integration, scoped tests, in-place repair and wave commit. In the following recipes, substitute that root for every implementation worktree placeholder. Keep authoritative spec reads at the absolute home spec path, including companion SR snapshots.

Carry `Leg:` and combined spec/task `Rules:` as additive task context to every implementer, spec-reviewer and code-reviewer, including repairs and re-reviews; require reading those files before acting. Resolve rules from the owning checkout, not home. Keep dispatch and acceptance shapes unchanged.

## Dispatch

For the fan-out + worktree + patch-integration + conflict mechanics, see `dispatching-parallel-agents`.

Pass the implementation worktree as top-level `cwd`. For per-patch spec reviews, use [Spec-review snapshots](#spec-review-snapshots) instead.

```ts
// in-place repair worker
subagent({ agent: "implementer", async: false, cwd: "<abs worktree path>", task: "<task text + context + prior report verbatim + SCOPED_TEST_COMMANDS + status protocol>" })

// escalated fix round (Fix-Loop Rounds): same fix payload, model from gauntlet_setting({ key: "escalationLoop" }).implModel
subagent({ agent: "implementer", model: "<implModel>", context: "fresh", async: false, cwd: "<abs worktree path>", task: "<the just-dispatched fix payload + prior review report verbatim>" })

// spec compliance: per-patch reviews use the materialized snapshot cwd
subagent({ agent: "spec-reviewer", async: false, cwd: "<abs review checkout path>", task: "<task text + patch diff + absolute spec path + task's Spec: anchors + Tests: block + Test: paths>" })

// code quality
subagent({ agent: "code-reviewer", async: false, cwd: "<abs worktree path>", task: "<diff range + SCOPED_TEST_COMMANDS (task commands; wave: union; whole-diff: none) + ask: production-ready?>" })

// closing-loop conformance (origin vs deliverable) — its OWN dispatch, never fused with code quality
// model: call gauntlet_setting({ key: "closureReview" }) first; use the returned model (omit model: if undefined to inherit) and maxFixRounds
// If gauntlet_setting is unavailable, stop and report - never fall back to a manual bash/JSON settings merge.
subagent({ agent: "conformance-reviewer", async: false, cwd: "<abs worktree path>", model: /* gauntlet_setting({ key: "closureReview" }).model, else omit to inherit */, task: "<spec path + verbatim original prompt + full diff vs main; per conformance-check.md>" })
```

Prompt templates live alongside this SKILL.md:

- `./implementer-prompt.md`
- `./spec-reviewer-prompt.md`
- `./code-quality-reviewer-prompt.md`

## The Wave Loop

Run every plan task through this loop in a wave of N >= 1 tasks. Run waves in sequence; dispatch file- and runtime-resource-disjoint tasks concurrently in isolated worktrees, then integrate serially behind one test + review gate. For dependent tasks, include the previous task's implementation summary and relevant file paths in the next subagent's `task`; track outputs to pass them forward.

**Enter the implement phase first.** Before the first wave, call `phase_tracker({ action: "start", phase: "implement" })`; `plan_tracker` auto-completes it once every task across all waves is done.

**Progress tracking (`plan_tracker`).** `plan_tracker` is a flat list with no native group concept, so waves are *encoded*, not modeled:

- **Consume, preserve, recover only if absent:** consume the wave-ordered list initialized at writing-plans handoff; indices are positional and stable, so never re-init on continuation or mid-run. Only direct recovery with no tracker initializes the full plan list once before dispatch.
- **Wave fan-out → `in_progress`:** unconditionally mark every task index in the wave `in_progress` before dispatch, in increasing index order (the tracker validates each call against the previous one and rejects a start while an earlier index is still `pending`). Expect one or more simultaneous entries.
- **Wave commit → `complete`:** after the wave's gate passes and it commits, unconditionally mark all those same indices `complete`. `complete` = durably committed, so a task in conflict fallback stays `in_progress` until its wave commits.
- **Lifecycle per task:** `pending → in_progress (wave fan-out) → complete (wave commit)`; keep `in_progress` through exhausted integration or repair attempts pending the human's decision (see [When a Subagent Fails](#when-a-subagent-fails)); use `failed` only for a human-decided terminal failure; `skipped` when the plan drops it as not applicable (terminal, counted done). A rejected `update` names the earlier pending tasks and the legal fixes - record those tasks' true state, never `clear` or re-`init` to move on.
- **Widget caveat (known, deliberately unfixed).** The persistent `plan_tracker` widget's icon strip (`○ → ✓`) and `(c/total)` count reflect every task, but its trailing *name* shows only the **first** `in_progress` task. Use the icon strip and the `status` action for the full in-flight view; a richer multi-task widget is a separate extension change, out of scope (YAGNI).

For an `in-place` wave, dispatch one `implementer` with `cwd` the branch checkout and no `worktree: true`; skip step 4 integration and step 7's `reset --soft` fold, retain the test gate, SR against the branch checkout, and CR, and record the next wave's `WAVE_BASE_SHA` after completion. Repair every SR gap (including initial `NEEDS_REWORK` / `OUT_OF_SCOPE_CHANGES`), stopped chain, test-gate failure, and CR finding with a plain in-place `implementer` in the branch checkout; record Fix-delta trees from that checkout, never use the snapshot/patch-replacement path, and after the gates accept, commit any remaining changes as one new descendant commit on the branch before marking indices `complete`, without amending or running `reset --soft` across the recorded rework base.

**Per-wave loop:**

1. **Independence check.** Parse the wave's tasks' `Files:` blocks; assert pairwise-disjoint (mechanical, mirroring `wave-file-disjointness`: `Test`/`Test` on one path is not overlap, `Test` vs another task's `Create`/`Modify` is, `Modify`/`Modify` is). Runtime-resource disjointness (DB/schema, port, fixture, external service, shared temp path) is not machine-checkable here — trust the plan's wave grouping, which `writing-plans`' D5 contract guarantees. Either kind of overlap → the wave is mis-grouped; split it into one-task waves and note it.
2. **Start, then dispatch.** Record `WAVE_BASE_SHA` with `git -C <worktree> rev-parse HEAD` before dispatch; keep it fixed through the wave's commit. Mark every wave index `in_progress` in increasing index order. Run the once-per-phase preflight below before dispatching exactly one initial chain (including one-task waves).
3. **Read the result once.** Read statuses, verdicts, patches, and reports as specified below. All implementers `DONE` and all verdicts `COMPLIANT` -> step 4. Any other outcome -> [Chain stopped or failed](#chain-stopped-or-failed). The ticket's `FAIL` means a spec gap (`NEEDS_REWORK`), not a structured verdict or an SR `stopOn` condition.
4. **Integrate.** Run `git -C <worktree> apply --index <patch-path>` for each accepted task's patch sequentially. This stages additions as well as tracked changes for review. On an apply failure, drop that task from the wave; finish steps 5-7 for the survivors, then re-dispatch the dropped task as a one-task wave from the new committed HEAD. With zero surviving patches, skip steps 5-7 and retry the failed task from the unchanged clean HEAD under [When a Subagent Fails](#when-a-subagent-fails)'s two-attempt limit; dispatch no empty review or commit. Keep its tracker index `in_progress` until its own wave commits.
5. **Test gate.** Run the wave's `SCOPED_TEST_COMMANDS` (union of its tasks' `Tests:` commands) on the integrated tree as `(cd "<worktree>" && <command>)` for each command — the full verification set is the verify phase's job, run once. On failure, dispatch one plain in-place `implementer` in the branch checkout with the failing output, the owning task's full text, and the wave's `SCOPED_TEST_COMMANDS`, under [When a Subagent Fails](#when-a-subagent-fails), then rerun the scoped gate. After the repaired tree passes, stage repair deliverables with `git -C <worktree> add -A` and dispatch spec review for every affected task against the integrated checkout before the initial CR; prior SR acceptance does not cover the repair. Pass each affected task's full text, absolute spec path, `Spec:` anchors, `Tests:` block, and `- Test:` paths; record its review tree per [Fix delta](#fix-delta). Resolve SR findings through [Fix-Loop Rounds](#fix-loop-rounds), with repairs in place and the scoped gate rerun. Never dispatch a nested wave from this dirty checkout: children cannot see integrated siblings from the old HEAD.
6. **Quality review.** CR binds to the wave: exactly one **initial** code-review dispatch per code-touching wave, over the integrated wave diff - never per task within a wave, never batched across waves. Subsequent dispatches within the wave are re-reviews triggered only by findings, per Fix-Loop Rounds. Pass the wave's `SCOPED_TEST_COMMANDS`, `BASE_SHA: <WAVE_BASE_SHA>`, and `HEAD_SHA: WORKTREE` per `code-quality-reviewer-prompt.md`; the review reads the staged and unstaged integrated diff, not a commit range. On findings, fix and re-review per `/skill:requesting-code-review` and [Fix-Loop Rounds](#fix-loop-rounds). Dispatch repairs as plain in-place workers in the branch checkout, never nested waves from the dirty checkout. Carry the report verbatim and no commit or staging instruction in the repair payload. Before every CR dispatch and every SR/CR re-review, run `git -C <worktree> add -A` so all deliverables appear in the whole diff; record the review tree per [Fix delta](#fix-delta). Preserve `WAVE_BASE_SHA` and `HEAD_SHA: WORKTREE` through every re-review and escalated in-place repair. Skip CR for doc-only waves (SR-only per the commit precondition below).
7. **Commit and complete the wave.** After CR accepts (SR alone for doc-only waves), fold worker commits and all remaining changes into one durable wave commit: `git -C <worktree> reset --soft "$WAVE_BASE_SHA" && git -C <worktree> add -A && git -C <worktree> commit -m <message>`. Then mark the wave's existing indices `complete`. Stop on an empty commit instead of completing tasks. Leave a clean tree so the next wave's children see the integrated work.

**Two-stage review is preserved:** spec review per task (pre-integration, dispatched `spec-reviewer` — not inline), quality review per wave (post-integration). A wave commit requires one spec-review verdict per accepted task, plus one code-review verdict on the integrated diff for waves that touch code. A doc-only wave (every task's `Files:` block documentation-only, per `writing-plans`' Wave Grouping) is SR-only — the CR gate does not apply.

**Dependent context across waves:** wave N+1 tasks branch from a HEAD containing wave N, so they see the code; still forward wave N's task summaries into wave N+1 prompts.

**Caveat:** each task must be independently runnable and verifiable in a fresh worktree — no reliance on uncommitted local state. `pi-cohort` symlinks `node_modules`; repos needing other per-worktree setup must account for it.

Run this guard once per implement phase before the first wave. Stop on any error before dispatch; read the peer floor from the installed gauntlet package, not the consumer repository.

<!-- pi-cohort-preflight-shell -->
```bash
PI_PACKAGES=$(pi list) || { echo 'pi-cohort not installed' >&2; exit 1; }
export PI_PACKAGES
node <<'NODE'
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const lines = process.env.PI_PACKAGES.split('\n');
function directory(name) {
  for (let i = 0; i < lines.length - 1; i++) {
    const source = lines[i].match(/^(\s+)\S/);
    const path = lines[i + 1].match(/^(\s+)\S/);
    if (!source || !path || path[1].length <= source[1].length) continue;
    const dir = lines[++i].trim();
    try {
      if (JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name === name) return dir;
    } catch {}
  }
}
function fail(message) { console.error(message); process.exit(1); }
const cohort = directory('pi-cohort');
if (!cohort) fail('pi-cohort not installed');
let installed;
try { installed = JSON.parse(readFileSync(join(cohort, 'package.json'), 'utf8')).version; }
catch { fail('pi-cohort not installed'); }
let peer;
try {
  peer = JSON.parse(readFileSync(join(directory('pi-gauntlet'), 'package.json'), 'utf8')).peerDependencies['pi-cohort'];
} catch { fail('cannot read peer floor'); }
if (typeof peer !== 'string' || !/^>=\d+\.\d+\.\d+$/.test(peer)) fail('cannot read peer floor');
const floor = peer.slice(2);
if (typeof installed !== 'string' || !/^\d+\.\d+\.\d+$/.test(installed)) fail(`cannot parse pi-cohort version ${installed}`);
const minimum = floor.split('.').map(Number);
const actual = installed.split('.').map(Number);
for (let i = 0; i < 3; i++) {
  if (actual[i] < minimum[i]) fail(`pi-cohort >= ${floor} required, found ${installed}`);
  if (actual[i] > minimum[i]) break;
}
NODE
PREFLIGHT_STATUS=$?
[[ "$PREFLIGHT_STATUS" == 0 ]] || exit "$PREFLIGHT_STATUS"
```

Pass the implementation worktree's absolute path as top-level `cwd`. Per-task `cwd` outranks step and run `cwd`; only the SR tasks override it. Rule and rationale for editing dispatches: `dispatching-parallel-agents` "pi-cohort Integration".

```bash
REPORT_DIR=$(mktemp -d)
```

```ts
IMPLEMENTER_STATUS_SCHEMA = { type: "object", required: ["status"], additionalProperties: true,
  properties: { status: { type: "string", enum: ["DONE", "DONE_WITH_CONCERNS", "NEEDS_CONTEXT", "BLOCKED"] } } }
```

```ts
subagent({
  async: false,
  context: "fresh",
  cwd: "<abs worktree path>",
  chain: [
    {
      parallel: [
        { agent: "implementer", as: "impl_1", outputSchema: IMPLEMENTER_STATUS_SCHEMA,
          output: "<REPORT_DIR>/wave<w>-task1.md",
          task: "<full task text + owned files + SCOPED_TEST_COMMANDS + Tests: block + status protocol> pi-cohort saves your final report to the output path; do not write that file yourself, and it is not a concern about owned files." },
        // one entry per wave task, as: "impl_<n>" in plan index order
      ],
      worktree: true,
      concurrency: 4,
      stopOn: { path: "/status", in: ["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"] },
    },
    {
      parallel: [
        { agent: "spec-reviewer", as: "sr_1",
          cwd: "{outputs.impl_1.treePath}",
          output: "<REPORT_DIR>/wave<w>-sr1.md",
          acceptance: { level: "none", reason: "the parent reads each SR Verdict: line; review trees are staged by design" },
          task: "<full task text + absolute spec path (in the implementation worktree) + Spec: anchors + Tests: block + Test: paths> The patch under review is the file at {outputs.impl_1.patchPath}; the working tree you run in already has it applied. The implementer's report is at <REPORT_DIR>/wave<w>-task1.md; read it for the 'What Implementer Claims They Built' section." },
        // one entry per wave task, paired by index
      ],
      concurrency: 4,
    },
  ],
})
```

Count the clean code-wave path as one chain plus one separate CR `subagent()` call; integration and tests remain parent actions between them. Use positional 1-based `impl_<n>` and `sr_<n>` names; map results to plan indices by wave position. Keep `context`, `async`, and top-level `cwd` invocation-level; `worktree`, `concurrency`, and `stopOn` step-level; `as`, `outputSchema`, `cwd`, `output`, `acceptance`, and `task` per-task. Give the SR step neither `worktree` nor `stopOn`, and its tasks no `outputSchema`.

Tell SR to start from diff hunks carrying `file:line`, read every touched file in full from its materialized tree, read deleted files from `WAVE_BASE_SHA`, and never run tests. Pass the authoritative spec's absolute implementation-worktree path; SR reads the anchored ranges itself (never inline excerpts; authority hierarchy in `./spec-reviewer-prompt.md`; anchor-less tasks are task-text-only). Output references resolve only in `task` strings and `cwd` (`treePath` only), never `reads:`; paste no diff into the chain payload. Rely on pi-cohort's `structured_output` injection only for implementers carrying `outputSchema`; the runtime orders an enabled acceptance report before that call. Keep SR schema-free because no `stopOn` reads its verdict. Disable acceptance on each initial chained SR task with `none` and a nonempty reason because the parent reads each `Verdict:` line and review trees are staged by design: risky-word inference precedes read-only inference, non-none explicit levels only raise the inferred level, and `checked` or higher requires no staged files; snapshot-backed spec reviews and code review carry no `acceptance` field. Keep prompts and persona vocabularies unchanged.

Read the tool-result text, not `details`: read implementer statuses from fenced JSON in `## Outputs` and the `## Stop` line; read SR verdicts from the `Verdict:` line of each SR `output:` report, one of `COMPLIANT`, `NEEDS_REWORK`, or `OUT_OF_SCOPE_CHANGES`. Read patch locations from `Artifacts:`: `<Artifacts dir>/worktree-diffs/step-0/task-<i>-implementer.patch`, with 0-based wave position `<i>`. Use these artifact patches for integration and later repairs. Exit-0 reports are the known `output:` files. A nonzero task has no `output:` file and no bound output. Recover its prose from its session `subagent-artifacts` output file (`<runId>_implementer_<index>_output.md`, defined by pi-cohort `src/shared/artifacts.ts`), matching the run/task identity in the result or session transcript. Use the same source-defined per-agent naming for a failed reviewer. Do not use the chain's empty `parallel-0/` directories for failed prose. If artifacts are disabled, missing, or cannot be unambiguously matched, enter [When a Subagent Fails](#when-a-subagent-fails) with the visible diagnostic; never invent a status. Keep SR's large-wave `outputMode: "file-only"` hint; read the report itself, not its `Output saved to:` pointer. Carry its full contents verbatim under `## Previous review report (re-review trigger)` on re-review.

### Chain stopped or failed

Route the result already read in step 3; retain all successful sibling patches and verdicts. Inspect failed tasks regardless of whether `## Stop` is also present: pi-cohort evaluates the stop condition before checking sibling failures, so both can coexist. Read exit-0 statuses from `## Outputs` when present or their `output:` reports; recover failed-task prose using the session-artifact rule above, including its unavailable-artifact fallback. Treat `## Stop` as a matched exit-0 status, not proof that every sibling succeeded. For `DONE_WITH_CONCERNS` alongside a nonzero `BLOCKED`, judge the concerns, diagnose the failed task, and retain accepted siblings:

| Outcome | Recovery |
|---|---|
| Exit-0 stop (`## Stop`) with no failed siblings | Siblings finished, statuses remain in `## Outputs`, and no SR step ran. Judge `DONE_WITH_CONCERNS`, handle `NEEDS_CONTEXT` and `BLOCKED` per the status table, then snapshot accepted patches and use the ordinary SR fan-out below. |
| Chain error, with or without `## Stop` | Identify and diagnose every failed task from the result, including prose `**Status:**` / `Verdict:` recovered through the session-artifact rule above. Completion-guard failure with no edits, rejected/missing `structured_output`, failed `treePath`, and sibling process failure all take this route. Handle a recoverable `BLOCKED` or `NEEDS_CONTEXT` through its status matrix even when that unaccepted task has no patch. Route a task with no recoverable status, or an accepted task with a missing/empty patch, to [When a Subagent Fails](#when-a-subagent-fails) with the visible diagnostic; never invent a status or review an unchanged tree. Retain exit-0 SR verdicts obtained in a materialized tree; dispatch only accepted patches without a verdict. Successful siblings are never re-run. |
| Completed chain with `NEEDS_REWORK` or `OUT_OF_SCOPE_CHANGES` | Repair only those tasks using the spec-gap loop below. Preserve passing sibling patches/verdicts. |

Parse each `DONE`/`BLOCKED`/etc. (see [Implementer Status](#implementer-status)) **first**. Then **dispatch a `spec-reviewer` per accepted patch** (`DONE`, or a `DONE_WITH_CONCERNS` you proceeded with) still missing a verdict in one parallel fan-out - `context: "fresh"`, each task's `cwd` = its [Spec-review snapshot](#spec-review-snapshots), **no `worktree` flag** (read-only) - each passed its full task text, the returned **patch diff**, the absolute spec path, and the task's `**Spec:**` anchors, plus its `**Tests:**` block and `- Test:` paths as contract. SR reads the anchored ranges itself (never inline excerpts; authority hierarchy in `./spec-reviewer-prompt.md`; anchor-less tasks are task-text-only). Review starts from the diff (its hunks carry `file:line`) and reads each touched file in full; test execution is never the reviewer's job (step 5 runs the wave's `SCOPED_TEST_COMMANDS`). Inline verdicts are fine at normal wave sizes; large waves use `output:` + `outputMode: "file-only"`; read the full report file itself.

**Re-dispatch by cause:** Before fixing a chain-run SR's `NEEDS_REWORK` or `OUT_OF_SCOPE_CHANGES`, reconstruct the original artifact patch's snapshot from `WAVE_BASE_SHA` and record its tree-before per [Fix delta](#fix-delta); the chain's own trees are already removed. Route `BLOCKED`/`NEEDS_CONTEXT` per the [Implementer Status](#implementer-status) matrix; a **spec gap** re-dispatches only that implementer using a one-entry `tasks` array with invocation-level `worktree: true`, `context: "fresh"`, and implementation `cwd`, carrying the artifacts patch + full SR report verbatim. Materialize the replacement patch in a new detached `WAVE_BASE_SHA` checkout with `git apply --index` per [Spec-review snapshots](#spec-review-snapshots); on setup or tree-capture failure, stop dispatch and retain the failed snapshot directory and shell output for diagnosis. After successful setup, record tree-after in that replacement snapshot before dispatching one plain re-review with `## Previous review report (re-review trigger)`, the trajectory block, and `## Fix delta`. The new patch supersedes the old at step 4. Loop until accepted + spec compliant, within [Fix-Loop Rounds](#fix-loop-rounds). Never dispatch a second chain in the same wave.

## Spec-review snapshots

Materialize each accepted patch for every pre-integration review not run by the chain: accepted siblings after errors/stops, replacement patches on re-review. Keep the implementation worktree unchanged; pi-cohort removes its worker checkouts before returning patches.

Substitute shell-quoted literals for the implementation worktree, the recorded `WAVE_BASE_SHA`, and the absolute patch path. Run this block once per patch:

<!-- spec-review-snapshot-shell -->
```bash
SR_ROOT={{WORKTREE}}
SR_BASE={{BASE_SHA}}
SR_PATCH={{PATCH_PATH}}
SR_DIR=$(mktemp -d) || exit 1
SR_TREE="$SR_DIR/tree"
git -C "$SR_ROOT" worktree add --detach "$SR_TREE" "$SR_BASE" || exit 1
git -C "$SR_TREE" apply --index "$SR_PATCH" || exit 1
printf 'snapshot: %s\n' "$SR_TREE"
```

Record its review tree per [Fix delta](#fix-delta) before every parent-dispatched SR, keyed by task. Use the printed snapshot path as that spec-review task's `cwd` and whole-file read root. Keep the authoritative spec's absolute path in the implementation worktree. Pass the patch diff as before; the snapshot contains this task's changed and added files, with deleted files absent. Read deleted files from `WAVE_BASE_SHA` when the review needs their prior contents. Dispatch read-only, with no `worktree` flag. On snapshot setup or tree-capture failure, or a missing snapshot path, stop dispatch and retain the failed snapshot directory and shell output for diagnosis; dispatch no review and perform no snapshot cleanup. Save each snapshot-backed review's terminal report to its `output:` path, read it, then remove that review's snapshot with `git -C <implementation-worktree> worktree remove --force <snapshot-path>`. Keep every snapshot used as a reviewer `cwd` until that terminal report is saved; recording its tree never authorizes early cleanup. Remove a reconstruction used only to record tree-before after capturing its tree, since no reviewer runs there. Recreate from the replacement patch for each pre-integration re-review; on a failed recreate, stop dispatch and retain that snapshot directory and shell output, like any setup failure. Post-integration SR reviews the implementation worktree directly.

## When a Subagent Fails

**You are the orchestrator. You do NOT write code.**

1. **Attempt 1:** dispatch a NEW fix subagent with the error output, the original task, and specific instructions about what went wrong.
2. **Attempt 2:** if attempt 1 also fails, dispatch one more with a simplified scope or different approach.
3. **After 2 failed attempts:** STOP. Report failure to the user. Keep the task `in_progress`, not `failed` or `complete`, pending the human's decision; completion requires the wave commit.

**NEVER:**

- Write code yourself to "help" or "finish up"
- Fix the subagent's work inline — that pollutes your context and defeats fresh-subagent isolation
- Silently skip the failed task
- Lower quality gates (skip reviews) because a task is "almost done"

## After All Tasks Complete

For a coordinated run, execute verification and the following reviews for every leg in its own checkout against its owned original ACs and recorded verification contract, under home flow policy. Keep freshness per leg and route repairs to their owning checkout; repeat invalidated gates there. After every leg passes, finish the coordinated run once from home. Keep legacy and single-member execution free of companion loops, leg files, `legs:` briefs and `--leg` arguments.

0. Call `phase_tracker({ action: "start", phase: "verify" })`. (The `implement` phase was started at execution start and auto-completes from `plan_tracker` once all tasks are done; this flow runs its own verify gate instead of `/skill:verification-before-completion`, so it must mark verify itself.)
1. **Parent full verification.** Run the complete plan-header `**Verification:**` command set foreground in the worktree via `(cd "<worktree>" && <command>)`: tests plus every declared lint, type, format, and build check. A failure must be repaired and the full set rerun successfully before the next step. Before dispatching a verification repair, reopen (`in_progress`) every existing plan-task index whose `Files:` ownership includes its touched files; leave unowned cross-cutting repair work in the verification report. Those indices stay `in_progress` through the successful full rerun **and** step 2's whole-diff review accepting the repair — that acceptance is their completion point, not the passing rerun. Commit any verification-produced tracked changes; use the resulting `HEAD_SHA` in the review task and include the commands/results in its existing `DESCRIPTION`.
2. **Whole-diff code review.** Only after passing full verification, dispatch one foreground whole-diff `code-reviewer` per `/skill:requesting-code-review` against that committed HEAD, with `SCOPED_TEST_COMMANDS: none`; the reviewer does not repeat the full suite. Act on the verdict per `/skill:requesting-code-review` Fix rounds; carry the final `SHIP` report's Minor finding lines verbatim into the closure block's `whole-diff minors:` section (`verification-before-completion/reference/conformance-check.md` "Closure / conformance"), or `whole-diff minors: none`. Before dispatching a review repair, reopen (`in_progress`) every existing plan-task index whose `Files:` ownership includes its touched files; leave unowned cross-cutting repair work in the review report. Mark each reopened index `complete` only once the repair is re-verified and the re-review accepts it — this is the same completion point step 1's reopened indices wait for, not an extra gate, and the gate order stays full verification -> whole-diff CR -> conformance. Any repair invalidates prior full verification, so rerun the full set successfully before the next gate.
3. **Close the loop — conformance check.** The review in step 2 is plan-vs-code (single-step); it inherits any requirement the plan already dropped.

   **Happy-path run:** When the plan header carries a `**Happy path:**` line or the diff selects a row, `read` `reference/happy-path-run.md` at its absolute path beside this skill and follow its instructions. On an unreadable reference, stop with a blocking error; never reconstruct the runner.

   Before marking verify complete, dispatch a fresh-context **`conformance-reviewer`** — its **own** dispatch, never fused into the step-2 review — to confront the deliverable (code **and** docs) against the *origin* — the spec **and** the original prompt — per `verification-before-completion/reference/conformance-check.md`. Pass the spec path, the verbatim original prompt, the full diff, and - when a run happened - `Happy path: <abs path to $HP_DIR/summary.txt> (<outcome>)` (`<outcome>` = the outcome line without its `happy-path: ` prefix). Follow that reference for the partition rule, concern decomposition, and fix-loop mechanics; do not reimplement them here. The fix loop reuses durable `Gn` gap indices as defined in conformance-check.md; it never calls `phase_tracker`. Call `phase_tracker({ action: "complete", phase: "verify" })` only when the reference says the handoff is durably complete: either a current `CONFORMS` result, or a current `## Closure / conformance` inventory whose carried-open concerns all come from valid deferred gaps, including `recommended: fix` gaps carried open because a declared precondition made the fix loop unavailable (`maxFixRounds: 0`, or no eligible named-branch worktree). A started positive-cap fix loop that blocks, fails, or exhausts its rounds with an open `fix` gap is escalation, not completion; on escalation, do not complete verify, stop and report.
4. Summarize what was implemented (tasks completed, files changed, test counts, code-review verdict). Emit the `## Closure / conformance` block exactly as defined in `verification-before-completion/reference/conformance-check.md`: it must open with the sentinel (`status: CONFORMS (0 open)` or `status: GAPS (N open)`, then `audited-base: <full HEAD SHA>`, then - exactly when a happy-path run happened - `happy-path: <value of the reviewer's Happy path: line from the final audit, the text after Happy path: >`), then carry the exact durable concern schema by reference with no renamed or reformatted fields. `finishing-a-development-branch` Step 3.5 consumes that block verbatim.
5. **Proceed to finishing — no confirmation prompt.** Once verify is complete per step 3's criterion, invoke `/skill:finishing-a-development-branch <abs worktree path>` immediately - the same absolute path every dispatch in this flow carried as `cwd`; finishing stops without it. Its Step 4 menu (PR / draft PR / squash / keep / discard) is the human gate; a separate "ready to finish?" prompt only stacks a second stop in front of it. Carried-open concerns are resolved there per concern via the `## Closure / conformance` block from step 4. Manual testing is a follow-up after the finishing choice (on `<base-branch>` after a squash-merge, or on the PR branch), never a reason to hold this gate.

## Red Flags — STOP

- Writing code yourself instead of dispatching.
- Pausing between tasks for anything other than `NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation, a workflow warning, a redraw, or an amend with no standing grant.
- Dispatching parallel implementers on overlapping files, on a shared mutable runtime resource, or without `worktree: true`.
- Making a subagent read the plan, inlining spec excerpts to the spec reviewer, or dispatching with a `SCOPED_TEST_COMMANDS` value missing or not copied from the plan's `Tests:` bullets.
- Dispatching `code-reviewer` before every in-scope spec-review verdict is ✅, or per task inside a wave.
- Moving to the next task with either review still showing issues, or skipping the `Implementer Status` parse.
- Second chain call in the same wave after a stop or a chain error - the retained results are the fan-out result; continue on the snapshot path.
- Dispatching fix 3 without a reviewer-emitted `CONVERGING` verdict, or continuing past `STAGNANT` instead of escalating (or, on a funded re-review, stopping).
- Running the full verification entrypoint, or any test command outside `SCOPED_TEST_COMMANDS`, during the implement phase.
- Dispatching a repair before reopening the plan-task indices that own its files, whole-diff CR before parent verification passes, or conformance before the CR result is accepted.
- Polling, joining, or relaunching an unexpectedly asynchronous dispatch, or starting on main without explicit user consent.

## Integration

**Required workflow skills:**

- `/skill:using-git-worktrees` — set up isolation first (small changes can branch in place with user approval)
- `/skill:writing-plans` — creates the plan this skill executes
- `/skill:requesting-code-review` — review template for reviewer subagents
- `/skill:finishing-a-development-branch <abs worktree path>` — invoked automatically once every gap is fixed (`CONFORMS`) or carried open

**Subagents follow by default:**

- TDD — runtime warnings on source-before-test. Implementer agents receive the three-scenario TDD instructions (new feature / modifying tested code / trivial) via agent profile and prompt template.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
