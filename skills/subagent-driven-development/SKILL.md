---
name: subagent-driven-development
description: Use when executing an implementation plan in the current session (the task-plan implement engine; the acceptance-criteria ledger engine is /skill:loop-implementation)
---

> **Related skills:** Need an isolated workspace? `/skill:using-git-worktrees`. Need a plan first? `/skill:writing-plans`. Done? `/skill:finishing-a-development-branch`. Reached via the auto-chain from `/skill:writing-plans` (not a direct human entry point; direct invocation stays possible for recovery, e.g. re-running after a STOP).

# Subagent-Driven Development

Execute a plan by dispatching a **fresh subagent per task**, then review each integrated wave once for spec compliance and code quality.

**Core principle:** Fresh subagent per task + one integrated wave review.

If a tool result contains a ⚠️ workflow warning, stop immediately and address it before continuing.

Gauntlet execution dispatches are foreground: set top-level `async: false` on every implementation, review, conformance, retry, and prose-described dispatch. Preserve parallel `tasks` batches and chain groups. `forceTopLevelAsync` is incompatible; an unexpected async handle means stop and report, never poll or relaunch. See [pi-cohort dispatch configuration](https://github.com/jjuraszek/pi-cohort/blob/main/doc/configuration.md).

## Orchestrator holds

Keep the plan_check manifest, tracker state, skill resources read at their absolute paths, structured JSON, `Artifacts:` patch paths, coordination/scoped-gate output, `Worktree ready` values and delegated source facts during implement. Delegate plan/spec/task/source reads, including content-loading shell commands. Apply this boundary from implement start through completion; leave other phases and the loop engine unchanged.

Consume structured `status`, `verdict`, `maxSeverity`, `findingCount`, `findings`, `touchedTasks`, `trajectory`, `concerns`, `question` and `anchorUnreadable` first. Use a direct `read` with `limit: 300` only for unresolved `DONE_WITH_CONCERNS` concerns, `BLOCKED` / `NEEDS_CONTEXT` question evidence, or `FIX_FIRST` / `REJECT` findings needed for repair or a stop note. Read at most once per printed `report <path>` observation per wave; never paginate or use an offset past the bound. When the read does not reach the report's footer (its `Parallel-safe:` line; `TRAJECTORY:` on a re-review), re-dispatch the same wave-reviewer once with `Compact report: findings and footer only, at most 150 lines`. Read its saved report under the same bound; stop naming the oversized path on a second overflow. Never dispatch `scout`, `delegate` or another child to relay reports. Retain delegated source-fact lookup.

For a dispatched task missing structured result text, also admit capture reads from `<Artifacts>/structured-output/*/output.json`, one file per `read`, `limit: 300`, no offset or pagination, under [Chain stopped or failed](#chain-stopped-or-failed). Keep saved prose reports outside this exception.

Read [reference/dispatch-contract.md](./reference/dispatch-contract.md) now for schemas, anchored payloads and one-step carriers. Read [reference/implement-amendments.md](./reference/implement-amendments.md) now for delegated amendments.

Use primary shell coordination only: `rev-parse`, `status --porcelain`, `diff --stat`, `apply`, `reset --soft`, `add -A`, path-scoped `add -- <plan> <spec>` for committed-original entry, `commit`, `update-ref`, `ls <Artifacts>/structured-output/*/output.json` only for missing-result recovery and `test -s <patch>` only for patch admission, plus the marked preflight, repair-base and scratch-index recipes and scoped-command redirection. Prohibit content-loading `cat`, `sed -n`, `git show <path>`, `git diff` without `--stat`, and contextual `grep`/`rg` over source. Route source questions, provenance and human escalation wording through the answer/evidence carrier; stop on delegated failure; for an exhausted-escalation stop note, emit it in the parent turn from held observations with no further dispatch or shell command.

## Continuous Execution

**Do not pause to check in with the user between tasks.** The plan is already approved. Pause only when:

- A subagent returns `NEEDS_CONTEXT` or `BLOCKED` (see [Implementer Status](#implementer-status))
- An escalated round fails with no funded round left (stop note per [The Wave Loop](#the-wave-loop))
- A ⚠️ workflow warning fires

Reaching the end of the plan is not a pause: continue through verification and invoke `/skill:finishing-a-development-branch <abs worktree path>` as defined in [After All Tasks](#after-all-tasks-complete).

Periodic "should I continue?" prompts add latency without adding safety. The plan is the contract; execute it.

## Prerequisites

- The worktree path is known - from the `using-git-worktrees` Step 4 report in this session or the handoff brief's `worktree:` row - and is passed as the top-level dispatch `cwd`. If no worktree path exists, stop and invoke `/skill:using-git-worktrees` first - implementation never lands directly on `main`. The process cwd is the primary checkout; nothing here changes it.
- Approved plan or clear task scope. Before the first wave, establish committed originals at home: run `git -C "<abs home worktree>" status --porcelain -- "<home-relative plan path>" "<home-relative spec path>"`. If nonempty, run `git -C "<abs home worktree>" add -- "<home-relative plan path>" "<home-relative spec path>"` and `git -C "<abs home worktree>" commit -m "plan: <spec title>" -- "<home-relative plan path>" "<home-relative spec path>"`. Stop on failure before dispatch; never stage unrelated source or use dirty retry text as a baseline.
- `plan_tracker` list initialized at writing-plans handoff with the full wave-ordered task list. Consume and preserve it on continuation; only direct recovery with no tracker initializes the full plan list once, before dispatch, and never over an existing list.

Call `plan_check({ planPath })` for the manifest; stop on FAIL; for `manifest-size`, emit a stop note asking for plan reduction. Consume each task's `files`, `tests`, `leg`, `mode`, heading and explicit `orchestrator`. Pass isolated implementers only their own task's `tests` as `SCOPED_TEST_COMMANDS`, or `none` when empty. Give in-place implementers, the integrated test gate and wave reviews the wave union of `tests`. Preserve each array element as one command without splitting or joining command strings. Children read Tests metadata themselves.

On a spec-defect citation, pause the fix loop and take the delegated amendment route for [amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec) with amend permission on the `**Amend-grant:**` line decoded by the existing surface. Keep code-vs-spec mismatch in wave review; an unreadable spec anchor blocks instead of falling back to task-only review.

## Fix delta

Include a `## Fix delta` block in every wave re-review payload: the recorded tree-before and tree-after object IDs between the tree recorded at the prior review's dispatch and the tree recorded at this re-review's dispatch. Record each tree with the shell block below; keep the printed SHA keyed by wave. Run it in the integrated branch checkout (`FD_ROOT`). Tree objects share the repository's object store; require the reviewer child to run `git -C "$FD_ROOT" diff --binary <tree-before> <tree-after>` to produce/read the delta; the parent uses only `diff --stat` to detect empty changes. Worker commits and staging state do not affect it; never substitute a SHA range or working-tree diff.

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

Omit the delta for whole-diff re-reviews. During implement, missing prior review-tree transcript lines take Recovery's stop-note path; never reconstruct dynamic state from reports. On an empty delta (including ignored-only repairs), dispatch no re-review: count a failed attempt under [When a Subagent Fails](#when-a-subagent-fails), resend the prior report path with "your fix changed no tracked file", and follow the transition table for escalation and funding.

## Implementer Status

Every implementer dispatch returns one of:

| Status | Meaning | Orchestrator action |
|---|---|---|
| `DONE` | Implemented + tests pass + self-reviewed; work present in the worker's tree; the wave commit follows SHIP | Proceed to integration and gate |
| `DONE_WITH_CONCERNS` | Implemented + tests pass, but flagged a deviation or risk | Read concerns. If acceptable, proceed. If not, dispatch fix subagent. |
| `NEEDS_CONTEXT` | Implementer needs information you have | For a spec-defect citation, take the amendment route below first. Resolve fact asks per [lookup handling](./stop-note.md). For decisions under amend permission, follow [takeable-decision ladder](#escalation-and-funding); otherwise answer and re-dispatch or escalate to the user. |
| `BLOCKED` | Cannot proceed (missing dependency, spec contradicts code, environment broken) | For a spec-defect citation, take the amendment route below first. Resolve fact asks per [lookup handling](./stop-note.md). For decisions under amend permission, follow [takeable-decision ladder](#escalation-and-funding); otherwise diagnose and re-dispatch or escalate to the user. |

Classify each question: treat a question whose candidate answers are each edits to the spec, plan, or an approved rule as an amendment batch per [amendment-surface.md](../brainstorming/reference/amendment-surface.md), never a decision. Treat a drafted AC row text correction backed by quoted implementer evidence (test, assertion, or code line) as an amend through the delegated amendment route; record it in the granted `amend:` audit body. Stop for redraws: ticket rows, row add/remove, reviewer-only or taste objections, problem changes, or component boundary changes. Execute the delegated amendment reference above before other routing, preserving Standing grants decoding, recommended-choice application without reviewer, menu or confirmation turns under amend permission, and the same-turn plan-writer apply, parent `plan_check`, tracker update, printed amendment and single `amend:` commit; without permission retain the surface's menu and escalation/redraw routing. For remaining questions, delegate artifact location, value or existence as a fact ask; treat scope and option choices as decisions, and another-round approval as a decision only with no funded round left.

Implementer prompt templates must instruct subagents to return one of these statuses explicitly.

## Model

- Omit `model:` so the operator's `subagents.agentOverrides.<agent>.model` pin applies, or else the child inherits the main loop.
- Pass `model:` only a runtime-resolved `gauntlet_setting` value (`closureReview.model`, `escalationLoop.implModel`, `specCouncil.members[]`, `specCouncil.chair`) or a model the user named for that dispatch.
- Read the main loop's own string from `$PI_PROVIDER`/`$PI_MODEL` with the bash tool only when a skill must bypass a persona's frontmatter `thinking` pin for cost or must pass an explicit fallback after a configured model is unreachable.
- Omit `model:` when `closureReview.model` or `specCouncil.chair` is `undefined`; pass an `implModel` string verbatim, and stop with a note when `implModel` is `undefined` (The Wave Loop).
- Apply suffix edits such as `:low` only to a runtime-resolved string, never to a name the skill wrote; never write a provider or model name, tier tasks by cost, or swap a pinned model for a cheaper or stronger one.

## Leg routing

Delegate `## Legs` reads in the home spec through [the leg contract](../brainstorming/reference/legs.md). Consume admitted task `leg` through `plan_check`; absent means home. Repair `leg-unknown` in the plan, never membership. Keep the existing flat tracker and task indices.

Require leg-homogeneous waves. Split a mixed wave into consecutive single-leg waves preserving dependencies before dispatch. Select its owning worktree before capturing `WAVE_BASE_SHA`; use that root for isolation, dispatch `cwd`, `git -C`, snapshots, integration, scoped tests, in-place repair and wave commit. In the following recipes, substitute that root for every implementation worktree placeholder. Keep authoritative spec reads at the absolute home spec path.

Carry `Leg:` and combined spec/task `Rules:` as additive task context to every implementer, wave-reviewer and conformance-reviewer, including repairs and re-reviews, as `Leg: <leg>; Rules: <task Rules> + <leg> Rules from home ## Legs, resolved in the owning checkout`; require reading those files before acting. Resolve rules from the owning checkout, not home; keep `Spec:` the absolute home path. Keep dispatch and acceptance shapes unchanged.

## Dispatch

Use `dispatching-parallel-agents` for isolation and serial patch integration. Use the dispatch-contract one-step chain for every repair and wave re-review, including escalated and funded rounds. Carry anchors, prior report path and scoped command arrays; never paste task or report contents. Resolve models only through the Model rules above. Keep verification conformance as its own dispatch under After All Tasks.

## The Wave Loop

Run every plan task through this loop in a wave of N >= 1 tasks. Run waves in sequence; dispatch file- and runtime-resource-disjoint tasks concurrently in isolated worktrees, then integrate serially behind one test + review gate. For dependent tasks, include the previous task's structured status line and report path in the next subagent's `task`; track outputs to pass them forward.

**Enter the implement phase first.** Before the first wave, call `phase_tracker({ action: "start", phase: "implement" })`; `plan_tracker` auto-completes it once every task across all waves is done.

**Progress tracking (`plan_tracker`).** `plan_tracker` is a flat list with no native group concept, so waves are *encoded*, not modeled:

- **Consume, preserve, recover only if absent:** consume the wave-ordered list initialized at writing-plans handoff; indices are positional and stable, so never re-init on continuation or mid-run. Only direct recovery with no tracker initializes the full plan list once before dispatch.
- **Wave fan-out → `in_progress`:** unconditionally mark every task index in the wave `in_progress` before dispatch, in increasing index order (the tracker validates each call against the previous one and rejects a start while an earlier index is still `pending`). Expect one or more simultaneous entries.
- **Wave commit → `complete`:** after the wave's gate passes and it commits, unconditionally mark all those same indices `complete`. `complete` = durably committed, so a task in conflict fallback stays `in_progress` until its wave commits.
- **Lifecycle per task:** `pending → in_progress (wave fan-out) → complete (wave commit)`; keep `in_progress` through exhausted integration or repair attempts pending the human's decision (see [When a Subagent Fails](#when-a-subagent-fails)); use `failed` only for a human-decided terminal failure; `skipped` when the plan drops it as not applicable (terminal, counted done). A rejected `update` names the earlier pending tasks and the legal fixes - record those tasks' true state, never `clear` or re-`init` to move on.
- **Widget caveat (known, deliberately unfixed).** The persistent `plan_tracker` widget's icon strip (`○ → ✓`) and `(c/total)` count reflect every task, but its trailing *name* shows only the **first** `in_progress` task. Use the icon strip and the `status` action for the full in-flight view; a richer multi-task widget is a separate extension change, out of scope (YAGNI).

1. **Independence check.** Assert pairwise-disjoint manifest `files`: Test/Test is allowed, Test/Create, Test/Modify and Modify/Modify overlap. Split overlaps into singleton waves. Trust the plan for runtime-resource disjointness; capture `WAVE_BASE_SHA` with `git -C <worktree> rev-parse HEAD`, print `wave <w> base <sha>` and hold it.
2. **Dispatch.** One one-step chain whose single `parallel` step contains only implementers, one item per task: `subagent({ async: false, context: "fresh", cwd: <worktree>, chain: [{ parallel: [{ agent: "implementer", as: "impl_<n>", outputSchema: IMPLEMENTER_STATUS_SCHEMA, output: "<REPORT_DIR>/wave<w>-task<n>.md", outputMode: "file-only", task: ... }], worktree: true, concurrency: 4, stopOn: { path: "/status", in: ["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"] } }] })`. Use step `stopOn` to expose `## Outputs` structured JSON in the tool-result text; top-level `tasks` has no item schema and is not used. For manifest `"mode":"in-place"`: `cwd` the branch checkout, no `worktree:`, the wave union as `SCOPED_TEST_COMMANDS`. Payload is `planPath`, task anchor, spec path, `Leg:` with additive `Rules:` per [Leg routing](#leg-routing), `SCOPED_TEST_COMMANDS` (the task's own `tests` for isolated waves), status protocol. Dispatch no reviewer step after the implementers.
3. **Read and integrate.** Read each child's structured output and report under the bound above; print `wave <w> task <n> <status> report <path> patch <path>`. Isolated waves: before integrating `DONE` / `DONE_WITH_CONCERNS`, require an `Artifacts:` patch path and a successful `test -s <patch>`. A missing or zero-byte initial patch takes the transition-table repair row; apply nothing and retain siblings. A nonempty patch -> `git -C <worktree> apply --index <patch>` in plan index order, print `wave <w> integrated task <n>`; a nonempty initial patch that fails to apply prints `wave <w> task <n> apply failed`, leaves every already-integrated sibling staged, and stops with a stop note listing which tasks are integrated and which failed - no automatic rebuild (the human may ask for one, which runs the rebuild recipe below). In-place waves: nothing to apply; the checkout already carries the work. `BLOCKED` / `NEEDS_CONTEXT` -> the takeable-decision ladder below.
4. **Test gate.** Run each manifest test for the wave union separately, logs to `gate-<i>.log`; print `wave <w> gate <i> exit <code>`. A red gate enters step 6 as a gate repair for every task whose `files` the failing test belongs to (the manifest's `tests` owner), before any review; the review in step 5 runs only on a green gate.
5. **Review.** One `wave-reviewer` dispatch per wave, doc-only waves included (`context: "fresh"`, `async: false`, read-only, one-step carrier with `WAVE_VERDICT_SCHEMA` and `stopOn: { path: "/verdict", in: ["FIX_FIRST", "REJECT"] }`), `cwd` the integrated tree after `git -C <worktree> add -A`, with `planPath`, the wave's task `anchors`, `Spec:` (absolute home spec), `Leg:` with additive `Rules:` per [Leg routing](#leg-routing), `BASE_SHA: <WAVE_BASE_SHA>`, `HEAD_SHA: WORKTREE`, and the wave union as `SCOPED_TEST_COMMANDS` (`none` for a doc-only wave, so the reviewer runs nothing and applies the clause table and documentation checks only). Record the review tree per `## Fix delta`; print `wave <w> review <k> verdict <value> report <path> tree <sha>`. `SHIP` -> step 7; `FIX_FIRST` -> step 6; `REJECT` -> hard stop with a stop note.
6. **Repair round.** Attribute each finding to a task: the task whose manifest `files` contain the finding's file, else the tasks in the structured `touchedTasks`; a finding with neither a file inside any wave task's `files` nor a `touchedTasks` owner stops with `Recommendation: spec/plan amendment` through [delegated amendments](./reference/implement-amendments.md) - findings are never dropped from a repair payload. For each attributed task, dispatch one `implementer` on the current tree with the findings block or gate log as its task text, the prior report path under `## Previous review report`, the task's anchors, and `SCOPED_TEST_COMMANDS` (isolated: the task's own `tests`; in-place: the wave union), through the one-step carrier with no `context: "fresh"` override and no prior-patch path:
   - *Isolated waves* use the repair-base recipe below: a committed snapshot of the current integrated tree (every integrated patch, every applied repair delta, added files included), so the dispatch root is clean and pi-cohort's exported patch is exactly the repair delta. The snapshot carries the current tree forward; it is not the rebuild below and discards nothing. Dispatch with `cwd: <RP_TREE>`, `worktree: true`; the delta is the `Artifacts:` patch at `<Artifacts dir>/worktree-diffs/step-0/task-0-implementer.patch`. Apply it to the integrated tree with `git -C <worktree> apply --index <delta>`; print `wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>`; then `git -C <worktree> worktree remove --force <RP_TREE>`.
   - *In-place waves* dispatch with `cwd` the branch checkout and no `worktree:`; the child edits the checkout directly; apply no patch and run no snapshot recipe; print the same line with `delta none applied n/a`.

   After the round: `git -C <worktree> add -A`; `git -C <worktree> diff --stat` against the recorded pre-repair tree decides emptiness; re-run the test gate for the touched tasks' `tests`; on green, one `wave-reviewer` re-review with the marker `## Previous review report (re-review trigger)`, the prior report path, the `## Fix delta` tree pair, the same `BASE_SHA` / `HEAD_SHA: WORKTREE`. Transitions follow the table below.
7. **Commit.** Only when the gate is green and the latest `wave-reviewer` verdict is `SHIP`: isolated waves `git -C <worktree> reset --soft "$WAVE_BASE_SHA" && git -C <worktree> add -A && git -C <worktree> commit -m <message>`; in-place waves commit a descendant commit without amending or `reset --soft`. Then mark every index of the original wave `complete` together; execute manifest `orchestrator` instructions at the completed-wave boundary.

`WAVE_BASE_SHA` is fixed across repair rounds, so every re-review diffs against the same root the first review saw.

**Repair-base recipe** - a committed snapshot of the current integrated tree, not a rebuild (isolated waves; substitute shell-quoted literals; run the whole block, stop on nonzero exit and retain `RP_DIR` for diagnosis):

<!-- repair-base-shell -->
```bash
RP_ROOT={{WORKTREE}}
RP_BASE={{BASE_SHA}}
RP_DIR=$(mktemp -d) || exit 1
RP_TREE="$RP_DIR/tree"
git -C "$RP_ROOT" add -A || exit 1
git -C "$RP_ROOT" diff --binary --cached "$RP_BASE" > "$RP_DIR/integrated.patch" || exit 1
git -C "$RP_ROOT" worktree add --detach "$RP_TREE" "$RP_BASE" || exit 1
if [ -s "$RP_DIR/integrated.patch" ]; then git -C "$RP_TREE" apply --index "$RP_DIR/integrated.patch" || exit 1; fi
git -C "$RP_TREE" -c user.name=gauntlet -c user.email=gauntlet@local commit -q --allow-empty -m "wave integrated snapshot" || exit 1
printf 'repair-base: %s %s\n' "$RP_TREE" "$(git -C "$RP_TREE" rev-parse HEAD)"
```

The redirected `diff --binary --cached` writes a file and loads nothing into the orchestrator's context; the orchestrator never reads `integrated.patch`.

**Transition table.** One per-task counter `failed[n]` starts at 0 when the wave enters step 3; `escalated[n]` and `converged[n]` are once-per-wave flags.

| Event | Counts for task n | Next operation |
|---|---|---|
| Red gate at step 4 or after a repair (any implementer status, including `DONE`) | +1 for each task owning a failing test | repair from the gate log; no review until green |
| Dispatch error, missing structured output after diagnosis says `repair`, or `BLOCKED` / `NEEDS_CONTEXT` answered by the ladder | +1 | For a ladder-answered `NEEDS_CONTEXT` / `BLOCKED` whose prior attempt produced no edits, re-dispatch the retained original payload verbatim with the answer appended under `## Answer to your BLOCKED question` into the tree the original attempt ran in (owning checkout for in-place and sequential tasks); ask the human nothing, because every required field is already retained in that payload, and use the registered `RP_TREE` or repair-base recipe only for isolated waves whose integrated tree changed. For dispatch errors and diagnosed repairs, re-dispatch the identical payload with the answer appended under `## Answer to your BLOCKED question` into the registered `RP_TREE` with `worktree: true` for isolated waves; with no registered `RP_TREE`, first run the repair-base recipe on the current integrated tree and dispatch from the resulting `RP_TREE` with `worktree: true`. In-place waves dispatch into the owning checkout without `worktree:`. Reuse a registered `RP_TREE`; never remove, re-snapshot or rebuild it on re-dispatch |
| Missing or zero-byte initial patch for `DONE` / `DONE_WITH_CONCERNS` | +1 | apply nothing, retain siblings, and start a repair round on the current tree with "your work produced no patch" appended |
| Repair delta or in-place repair leaves `diff --stat` empty (`DONE` with an unchanged tree) | +1 | no re-review of the unchanged tree; next repair resends the prior report path with "your fix changed no tracked file" |
| Repair delta fails `git apply --index` | +1 | rebuild |
| Review 1 `FIX_FIRST` (no `TRAJECTORY:` line) | +1 for each attributed task | repair |
| Re-review `FIX_FIRST`, `TRAJECTORY: CONVERGING` or `DIVERGING` | +1 for each attributed task | repair while `failed[n] < 2`; else escalation |
| Re-review `FIX_FIRST`, `TRAJECTORY: STAGNANT`, or a missing/malformed line | sets `failed[n] = 2` for each attributed task | escalation now (ordinary rounds), no convergence exception; never re-dispatch the review merely to obtain the line; stop immediately on a funded re-review |
| `failed[n] == 2` reached by a `CONVERGING` re-review whose line lacks `max severity Critical`, `converged[n]` unset | sets `converged[n]` | one extra ordinary repair, then re-review; a further `FIX_FIRST` escalates whatever the trajectory |
| `failed[n] == 2` (or `> 2` after the convergence exception), `escalated[n]` unset | sets `escalated[n]` | escalated round with `model: <implModel>` |
| Escalated round fails (dispatch error, non-`DONE`, red gate, empty delta, or attributed `FIX_FIRST`) | spent | funded round while the task's ledger has one left, else stop note |
| Funded round fails the same way | spends one | next funded round while one remains, else stop note; `STAGNANT` stops regardless |
| Gate green and review or re-review `SHIP` | - | step 7 |
| `REJECT`, `anchorUnreadable` on a reviewer, or the round cap: more than `4 + N` re-reviews in one wave (`N` = the largest funded grant among the wave's tasks, 0 without a token) | - | hard stop with the stop note |

Execution escalation to `implModel` is available whenever `failed[n]` reaches 2, independently of any `**Amend-grant:**` value; funding only adds rounds after the escalated round. Follow this table after two failed attempts, without requiring amend permission.

### Rebuild

A repair delta that fails `git apply --index` prints `rebuild: task <n> - delta apply failed` and counts one failed attempt. Then, in the integrated tree: partition the task's manifest paths - every `Create` path (including a new test file declared as both `Create` and `Test`) is removed (`git -C <worktree> rm -q -f --ignore-unmatch -- <paths>`), and the remaining `Modify` / `Test` paths, deduplicated and excluding every `Create` path, are restored from the wave base (`git -C <worktree> restore --source="$WAVE_BASE_SHA" --staged --worktree -- <paths>`); sibling paths are untouched (step 1 guarantees disjointness). Run the repair-base recipe on that tree, so the snapshot holds the base plus every accepted sibling and nothing of task n; dispatch one `implementer` from `<RP_TREE>` with `worktree: true` and the task's original payload (this dispatch is the next attempt on `failed[n]`'s counter - the escalated round when the counter has reached 2); apply its `Artifacts:` patch to the integrated tree with `git apply --index` (a failure here is a hard stop, not a second rebuild). The rebuilt task rejoins its original wave: re-run the gate for the wave union, one `wave-reviewer` re-review with the marker and the prior report path, and step 7 commits the whole wave once and completes all of its indices together. The human may ask for a rebuild at any stop, which runs this same recipe; nothing else triggers one. `BLOCKED` / `NEEDS_CONTEXT` on a repair never rebuilds or re-snapshots: the ladder answers, then the identical payload is re-dispatched into the existing repair tree with the answer appended.

### Escalation and funding

- **Execution escalation.** When the transition table reaches the escalated round for task n, print `escalated round for task <n> after 2 failed attempts`, call `gauntlet_setting({ key: "escalationLoop" })`, and dispatch one `implementer` with `model: <implModel>`, `async: false`, on the current tree (repair-base snapshot for isolated waves, branch checkout for in-place) with the same payload as the failed round; no `context: "fresh"`, no prior-patch path. `implModel` undefined or the settings tool unavailable -> stop note. Once per task per wave; spends independently of funding. The escalated round runs the ordinary test gate and `wave-reviewer` re-review.
- **Funded rounds.** Delegate current grant read and Value decoding through [Standing grants](../brainstorming/reference/amendment-surface.md#standing-grants); one per-task ledger from zero; `funded round <k> of <N> for task <n>` before each funded dispatch; each funded dispatch repeats the escalated payload (`model: <implModel>`, same tree, same anchors) and spends one including failures; `STAGNANT` on a funded re-review stops immediately; `budget: <spent> of <N> spent` in stop notes after `Problem:` and `Searched:` lines; resume recovers spent only from `funded round` transcript lines, otherwise exhausted with `(not recovered on resume)`. Funding never supplies a missing `implModel`.
- **Takeable decision.** `BLOCKED` / `NEEDS_CONTEXT` with attempts remaining: compare the whitespace-normalized `file:line` or failing command plus assertion against decisions already auto-taken on this task (`Recommendation: none - evidence repeats task <n>` and stop on a repeat); in-task repair counts as an ordinary attempt under the two-attempt limit; spec/plan rule edits route through [amendment aftermath](../brainstorming/reference/amendment-surface.md#5-apply-aftermath-commit) under the grant; `fix-first` enters `/skill:shape-ticket`; everything else emits the stop note ending in `Recommendation: <option> - <why>` and waits. Print `took recommendation: <option> for task <n>` when taken.
- **Hard stops:** malformed grants, missing `implModel`, unavailable settings tools, dirty-tree or commit-boundary returns, empty-commit stagnation, the round cap in the table, funded re-review `STAGNANT`, `REJECT`, an initial-patch or rebuild-patch apply failure, an oversized compact report, redraws.

The `TRAJECTORY:` block and `stop-note.md` grammar bind to the single `wave-reviewer` line.


### Initial dispatch carrier

Run the preflight once per implement phase, before the first dispatch. Use owning checkout `cwd`; omit `worktree: true` for manifest `"mode":"in-place"` and pass that wave's tests union.

```ts
subagent({ async: false, context: "fresh", cwd: "<owning checkout>",
  chain: [{ parallel: [
    { agent: "implementer", as: "impl_1", outputSchema: IMPLEMENTER_STATUS_SCHEMA,
      output: "<REPORT_DIR>/wave<w>-task1.md", outputMode: "file-only",
      task: "planPath: <absolute plan>; anchor: ### Task N:; Spec: <absolute home spec>; Leg: <owning leg>; Rules: <combined task/leg Rules>; SCOPED_TEST_COMMANDS: <task manifest tests or none>. pi-cohort saves your final report; do not write it yourself." }
  ], worktree: true, concurrency: 4,
     stopOn: { path: "/status", in: ["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"] } }]
})
```

Keep context/async/cwd invocation-level; worktree/concurrency/stopOn step-level; as/output/outputMode/outputSchema/task item-level. Never use top-level `tasks`. Consume fenced structured JSON in `## Outputs` / `## Stop` from result text; admit the identity-matched capture as the second source after result text under [Chain stopped or failed](#chain-stopped-or-failed), never details or saved prose verdicts. Obtain patches from `Artifacts:` at `<Artifacts dir>/worktree-diffs/step-0/task-<i>-implementer.patch` (zero-based wave position). Keep known report paths. Require accepted statuses and a nonempty patch before initial isolated integration per step 3; count empty repair deltas through the transition table.

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


Create `REPORT_DIR` with `mktemp -d`. Forward predecessor status and report paths across dependent waves; never paste task text.

### Chain stopped or failed

Retain accepted siblings; never repeat the initial chain or rerun accepted tasks. Inspect failed tasks alongside `## Stop`; a matched stop precedes sibling-error checking. Reconcile every dispatched task without a structured result in `## Outputs` or `## Stop`, including successful siblings suppressed by a chain failure. Repair rounds use this same recovery.

List captures once with `ls <Artifacts>/structured-output/*/output.json`. Read each listed file once with `limit: 300`, no offset or pagination. Accept only a complete `{"status":"success","value":{...}}` envelope whose `value` satisfies `IMPLEMENTER_STATUS_SCHEMA`: an allowed `value.status`, `question` for `NEEDS_CONTEXT`, `concerns` for `DONE_WITH_CONCERNS`, and exactly one identity. Match `value.anchor` to the dispatched anchor verbatim, or `value.anchors` to the dispatched heading list as a set. Read only this run's artifacts.

| Capture result | Action |
|---|---|
| One valid matching capture | Route `value.status` through Implementer Status and the transition table as an observed result. Reconcile accepted `DONE` / `DONE_WITH_CONCERNS` siblings through step 3 in plan index order before handling unanswered tasks; send `NEEDS_CONTEXT` / `BLOCKED` to the takeable-decision ladder. For a batch identity, route once for every task in that batch. Print the existing `wave <w> task <n> <status> report <path> patch <path>` observation per task. |
| Two captures claim the same dispatched identity | Stop naming both paths; never guess. |
| No file, error envelope, missing value, malformed/rejected schema, stale or unmatched identity, or a read truncated before the closing brace | Treat the task's capture as absent; diagnose below. |

Only a task with no accepted capture takes delegated identity-matched artifact diagnosis, once. Dispatch one sequential chain step, never a `parallel` item, with `agent: "delegate"`, `DIAGNOSIS_SCHEMA` and `stopOn` on `/decision`; put the literal sentence `Do not edit any file.` on its own line in the task text. After `decision: repair`, use the ordinary one-step implementer carrier.

```ts
subagent({ async: false, context: "fresh", cwd: "<owning checkout>",
  chain: [{ agent: "delegate", task: `Diagnose <run/task identities>; Artifacts: <dir>; known reports: <paths>; session artifacts: <locations>.
Do not edit any file.
Return compact statuses and retry/repair/stop; never invent a verdict.`, 
    output: "<REPORT_DIR>/wave<w>-diagnosis.md", outputMode: "file-only", outputSchema: DIAGNOSIS_SCHEMA,
    stopOn: { path: "/decision", in: ["retry", "repair", "stop"] } }]
})
```

Keep this a sequential step, not a parallel item. Let the child alone inspect identity-matched session failure artifacts, not empty parallel-0 directories; diagnosis is not a saved-report relay. Route diagnosis JSON through the transition table. Missing/ambiguous artifacts or delegated failure stop; never recursively diagnose. An implementer anchor failure takes the failed-attempt path; reviewer anchorUnreadable hard-stops.

### Recovery

Recover static state only with `plan_check({ planPath })` and tracker status. Recover dynamic state only from the observations below. Stop for an in_progress wave without its base, repair applied status or terminal outcome. Continue after a repair only with a terminal review after `applied yes` or a green gate after the last repair. Old tree-only review lines do not authorize continuation. Keep original base, report paths, tree IDs and funding spending; never infer integration or redispatch interrupted workers. Recover funded spent only from `funded round` observations; absent history means exhausted, not reset. A funded observation records spending before dispatch, not a terminal outcome.

```text
wave <w> base <sha>
wave <w> task <n> <status> report <path> patch <path>
wave <w> integrated task <n>
wave <w> task <n> apply failed
wave <w> gate <i> exit <code>
wave <w> review <k> verdict <value> report <path> tree <sha>
wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>
rebuild: task <n> - delta apply failed
escalated round for task <n> after 2 failed attempts
funded round <k> of <N> for task <n>
repair-base: <path> <sha>
```

For in-place repairs print `delta none applied n/a`. Print each observation immediately after the operation returns; invent no path, result or SHA.

## When a Subagent Fails

**You are the orchestrator. You do NOT write code.**

Use the transition table as the only attempt counter; count each failed operation once.

1. **Attempt 1:** dispatch a NEW fix subagent on the same tree with error-output paths, the original task anchors, and specific instructions about what went wrong.
2. **Attempt 2:** if attempt 1 also fails, dispatch one more on the same tree with a simplified scope or different approach.
3. after 2 failed attempts the transition table's escalated round runs; STOP only when that round and any funded round are spent. Keep `in_progress` pending the human decision; completion requires the wave commit.

**NEVER:**

- Write code yourself to "help" or "finish up"
- Fix the subagent's work inline - that pollutes your context and defeats fresh-subagent isolation
- Silently skip the failed task
- Lower quality gates (skip reviews) because a task is "almost done"

## After All Tasks Complete

For a coordinated run, execute verification and the following reviews for every leg in its own checkout against its owned original ACs and recorded verification contract, under home flow policy. Keep freshness per leg and route repairs to their owning checkout; repeat invalidated gates there. After every leg passes, finish the coordinated run once from home. Keep legacy and single-member execution free of companion loops, leg files, `legs:` briefs and `--leg` arguments.

0. Call `phase_tracker({ action: "start", phase: "verify" })`. (The `implement` phase was started at execution start and auto-completes from `plan_tracker` once all tasks are done; this flow runs its own verify gate instead of `/skill:verification-before-completion`, so it must mark verify itself.)
1. **Parent full verification.** Run the complete plan-header `**Verification:**` command set foreground in the worktree via `(cd "<worktree>" && <command>)`: tests plus every declared lint, type, format, and build check. A failure must be repaired and the full set rerun successfully before the next step. Before dispatching a verification repair, reopen (`in_progress`) every existing plan-task index whose `Files:` ownership includes its touched files; leave unowned cross-cutting repair work in the verification report. Those indices stay `in_progress` through the successful full rerun **and** step 2's whole-diff review accepting the repair - that acceptance is their completion point, not the passing rerun. Commit any verification-produced tracked changes; use the resulting `HEAD_SHA` in the review task and include the commands/results in its existing `DESCRIPTION`.
2. **Whole-diff code review.** Only after passing full verification, dispatch one foreground whole-diff `wave-reviewer` per `/skill:requesting-code-review` against that committed HEAD, with `SCOPED_TEST_COMMANDS: none`; the reviewer does not repeat the full suite. Act on the verdict per `/skill:requesting-code-review` Fix rounds; carry the final `SHIP` report's Minor finding lines verbatim into the closure block's `whole-diff minors:` section (`verification-before-completion/reference/conformance-check.md` "Closure / conformance"), or `whole-diff minors: none`. Before dispatching a review repair, reopen (`in_progress`) every existing plan-task index whose `Files:` ownership includes its touched files; leave unowned cross-cutting repair work in the review report. Mark each reopened index `complete` only once the repair is re-verified and the re-review accepts it - this is the same completion point step 1's reopened indices wait for, not an extra gate, and the gate order stays full verification -> whole-diff CR -> conformance. Any repair invalidates prior full verification, so rerun the full set successfully before the next gate.
3. **Close the loop - conformance check.** The review in step 2 is plan-vs-code (single-step); it inherits any requirement the plan already dropped.

   **Happy-path run:** When the plan header carries a `**Happy path:**` line or the diff selects a row, `read` `reference/happy-path-run.md` at its absolute path beside this skill and follow its instructions. On an unreadable reference, stop with a blocking error; never reconstruct the runner.

   Before marking verify complete, dispatch a fresh-context **`conformance-reviewer`** - its **own** dispatch, never fused into the step-2 review - to confront the deliverable (code **and** docs) against the *origin* - the spec **and** the original prompt - per `verification-before-completion/reference/conformance-check.md`. Pass the spec path, the verbatim original prompt, the full diff, and - when a run happened - `Happy path: <abs path to $HP_DIR/summary.txt> (<outcome>)` (`<outcome>` = the outcome line without its `happy-path: ` prefix). Follow that reference for the partition rule, concern decomposition, and fix-loop mechanics; do not reimplement them here. The fix loop reuses durable `Gn` gap indices as defined in conformance-check.md; it never calls `phase_tracker`. Call `phase_tracker({ action: "complete", phase: "verify" })` only when the reference says the handoff is durably complete: either a current `CONFORMS` result, or a current `## Closure / conformance` inventory whose carried-open concerns all come from valid deferred gaps, including `recommended: fix` gaps carried open because a declared precondition made the fix loop unavailable (`maxFixRounds: 0`, or no eligible named-branch worktree). A started positive-cap fix loop that blocks, fails, or exhausts its rounds with an open `fix` gap is escalation, not completion; on escalation, do not complete verify, stop and report.
4. Summarize what was implemented (tasks completed, files changed, test counts, code-review verdict). Emit the `## Closure / conformance` block exactly as defined in `verification-before-completion/reference/conformance-check.md`: it must open with the sentinel (`status: CONFORMS (0 open)` or `status: GAPS (N open)`, then `audited-base: <full HEAD SHA>`, then - exactly when a happy-path run happened - `happy-path: <value of the reviewer's Happy path: line from the final audit, the text after Happy path: >`), then carry the exact durable concern schema by reference with no renamed or reformatted fields. `finishing-a-development-branch` Step 3.5 consumes that block verbatim.
5. **Proceed to finishing - no confirmation prompt.** Once verify is complete per step 3's criterion, invoke `/skill:finishing-a-development-branch <abs worktree path>` immediately - the same absolute path every dispatch in this flow carried as `cwd`; finishing stops without it. Its Step 4 menu (PR / draft PR / squash / keep / discard) is the human gate; a separate "ready to finish?" prompt only stacks a second stop in front of it. Carried-open concerns are resolved there per concern via the `## Closure / conformance` block from step 4. Manual testing is a follow-up after the finishing choice (on `<base-branch>` after a squash-merge, or on the PR branch), never a reason to hold this gate.

## Red Flags - STOP

- Writing code yourself instead of dispatching.
- Pausing between tasks for anything other than `NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation, a workflow warning, a redraw, or an amend with no standing grant.
- Dispatching parallel implementers on overlapping files, on a shared mutable runtime resource, or without `worktree: true`.
- Pasting task text, spec excerpts, or report contents into a dispatch, or opening plan/spec/source files in the primary or reading a report beyond its bound
- Dispatching wave review before a green gate, or per task inside a wave.
- Moving to the next task with the wave verdict still showing blocking issues, or skipping the `Implementer Status` parse.
- Repeating the initial wave chain after a stop or error instead of retaining accepted siblings and using one-step repair/re-review carriers.
- Dispatching a third ordinary repair without a reviewer-emitted `CONVERGING` verdict, or continuing past `STAGNANT` instead of escalating (or, on a funded re-review, stopping).
- Running the full verification entrypoint, or any test command outside `SCOPED_TEST_COMMANDS`, during the implement phase.
- Dispatching a repair before reopening the plan-task indices that own its files, whole-diff CR before parent verification passes, or conformance before the CR result is accepted.
- Polling, joining, or relaunching an unexpectedly asynchronous dispatch, or starting on main without explicit user consent.

## Integration

**Required workflow skills:**

- `/skill:using-git-worktrees` - set up isolation first (small changes can branch in place with user approval)
- `/skill:writing-plans` - creates the plan this skill executes
- `/skill:requesting-code-review` - review template for reviewer subagents
- `/skill:finishing-a-development-branch <abs worktree path>` - invoked automatically once every gap is fixed (`CONFORMS`) or carried open

**Subagents follow by default:**

- TDD - runtime warnings on source-before-test. Implementer agents receive the three-scenario TDD instructions (new feature / modifying tested code / trivial) via agent profile and prompt template.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
