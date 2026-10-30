# Slim the subagent-driven-development dispatch protocol

**Goal:** Cut implement-phase dispatch count by replacing the per-task spec-review chain plus per-wave code review with one `wave-reviewer` dispatch per wave, letting the orchestrator read child reports directly, and making repair-on-top the re-dispatch default - while keeping execution escalation to `escalationLoop.implModel` working.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

Supersedes `doc/specs/2026-10-29-orchestrator-delegation-guard.md`, section 2 (the "a file-only pointer never authorizes opening a report" clause and the delegated report-read carrier). Its plan/spec/source no-read boundary and the `plan_check` manifest contract are carried forward unchanged.

## Problem

Gauntlet implement phases spend most of their wall time inside subagent dispatches, and the count of dispatches per plan task has grown with each protocol layer. Session-log measurement over 184 implement windows (local transcripts of sessions modified 2026-10-19..30, repo names and paths withheld; the scratch analysis lives under `$TMPDIR` and is not committed) is the input baseline, not a target; the first row holds the implement windows inside those sessions that started before 10-19:

| Period | Subagent calls per task | Orchestrator reads per task | Implement wall time inside dispatches |
|---|---|---|---|
| before 10-19 | 3.55 | 2.57 | 57% |
| 10-19..25 | 4.62 | 1.42 | 64% |
| 10-26..29 | 6.14 | 5.31 | 67% |
| 10-30 (5 windows) | 2.71 | 4.41 | 87% |

Counting unit for every number above and for the acceptance measurement below: the **numerator** is one count per child result (one parallel `subagent` call with three implementers counts three; this is the unit of telemetry's `kind: "dispatch"` events, which emit one event per entry in `details.results`), restricted to results observed between the implement `phase` start event and its complete event; the **denominator** is the number of plan tasks that reached `in_progress` in that window (attempted tasks, from `plan_tracker`), not only completed ones; a window is one implement phase of one session; the table aggregates by summing numerators and denominators across the windows in each period, not by averaging per-window ratios. A window whose sealed record carries `events_dropped > 0` or lacks both implement phase events is incomplete and is excluded from the ratio rather than counted. The baseline "subagent calls" column was derived from transcripts with the same per-child-result unit.

Three protocol layers produce the cost, all inside `skills/subagent-driven-development/`:

1. **Review sequence.** Every task runs an `implementer -> spec-reviewer` chain before integration (`SKILL.md:133-157`), every code-touching wave then runs a `code-reviewer`, and each repair re-runs SR, CR, or both depending on `Behaviour-change:` (`reference/fix-loop.md:5`). Two reviewers read the same diff against the same spec with two verdict vocabularies (`COMPLIANT | NEEDS_REWORK | OUT_OF_SCOPE_CHANGES` and `SHIP | FIX_FIRST | REJECT`) and two `TRAJECTORY:` lines the fix loop must reconcile. In 10-26..29, implementer chains alone took 75 of 135 dispatch-hours (median 212 s, n=204).
2. **Report relay.** The predecessor spec's section 2 forbids the orchestrator from opening any child report; every report comes back as a path that a second child (`scout` or `delegate`) is dispatched to read. In the one post-7.42.0 session, 30 of 63 implement dispatches were such relays (65 of 240 implement minutes, `delegate` median 597 s) for reports whose size is median 3 KB, max 69 KB. The plan/spec ban that the predecessor targeted was not obeyed either (8 plan reads, 5 spec reads in that session; 417 plan reads, 7.5 MB, across 57 sessions since 10-26), so the relay added cost without removing the leak it was written to stop.
3. **Fresh rebuilds.** Escalated and funded rounds re-dispatch with `context: "fresh"` and a prior-patch path (`reference/fix-loop.md:5,13`); an apply failure drops the task and rebuilds from the wave base (`SKILL.md:152`). Of the 1,019 implementer re-dispatches in the scan (793 repaired on top of the prior tree, 172 rebuilt from the base, 54 fresh-context chains with no labeled base; 84 of the 1,019 additionally asked the fresh child to reapply the prior patch by hand - an overlapping flag, not a fourth category), 56 rebuilds followed an attempt that had returned `DONE` or `DONE_WITH_CONCERNS`, discarding 1,039 implementer-minutes in 11 days.

Per-turn latency on a cache hit versus a full re-cache differs by seconds (16 s vs 23 s median), so context size is a token cost, not the wall-time driver; dispatch count is. Persona prompt length was not measurable from the logs and is out of scope.

Framing: pivoted to slimming the SDD implement protocol only - every measured cost sits in `skills/subagent-driven-development/`; nothing implicates persona bodies or pi-cohort spawn mechanics. The predecessor's section 2 rejected a bounded primary-read exception on context-size grounds (`doc/specs/2026-10-29-orchestrator-delegation-guard.md:93-99`); the measurement above shows the rule is both costly and unobeyed, and this spec narrows the exception to child reports only, with the bound stated in Design.

Checked premises: package registration (`pi list` shows `npm:pi-cohort` and `npm:pi-gauntlet`), the manifest producer (`extensions/lib/plan-check.ts:1283,1363`), the chain carrier (pi-cohort `src/extension/schemas.ts:201-239`; top-level `tasks` items carry no `outputSchema`, so structured output needs a chain step), the telemetry collector (`extensions/lib/telemetry-collect.ts:33`; findings are counted from the tool-result text, not from saved report files), the review-cadence guard (`extensions/phase-tracker.ts:815-816` compares hardcoded `spec-reviewer` / `code-reviewer` keys, not `CADENCE_AGENTS`), pi-cohort's runtime agent identity (`src/agents/agents.ts:878-888` derives it from frontmatter `name`, not the filename), the isolation precondition (pi-cohort `src/runs/shared/worktree.ts:116-126` rejects a dirty dispatch root; exported patches diff against the dispatch's base commit), and the non-SDD `code-reviewer` callers listed in Design - all found. The 63-dispatch session the scout could not identify was located by the session scan and is cited only as anonymized counts.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] Every wave - code-touching or doc-only - produces exactly one initial `wave-reviewer` dispatch over the integrated diff after the test gate passes, and no task in the wave is dispatched with a `spec-reviewer` or `code-reviewer` chain step before integration.
  in-scope
- [ ] After a child returns, the orchestrator reads its structured output and report file with the `read` tool directly; no `scout`, `delegate`, or other child is dispatched to read a report, and the orchestrator still performs no `read` of the plan, spec, or source files.
  in-scope
- [ ] A re-dispatch after a `FIX_FIRST` verdict or a failing test gate runs an `implementer` on the current tree with the findings or gate log as its task, carrying no `context: "fresh"` override and no prior-patch path; for an isolated wave the child is dispatched from a committed snapshot of the integrated tree and returns a delta patch that the orchestrator applies on top with `git apply --index`; for an in-place wave the child edits the branch checkout directly and no patch is applied.
  in-scope
- [ ] When a repair delta fails `git apply --index`, the orchestrator prints `rebuild: task <n> - delta apply failed`, restores that task's `files` to the wave base inside the integrated tree without touching sibling paths, dispatches one fresh implementer from a committed snapshot of that tree, and integrates its patch back into the same wave, which re-runs the gate and review and commits once; no other condition triggers an automatic rebuild.
  in-scope
- [ ] After two failed repair rounds on one task, the orchestrator prints `escalated round for task <n> after 2 failed attempts`, reads `gauntlet_setting({ key: "escalationLoop" })`, and dispatches one implementer with `model: <implModel>` on the current tree with the same payload; an undefined `implModel` or an unavailable settings tool ends in a stop note; funded rounds print `funded round <k> of <N> for task <n>` and stop notes carry `budget: <spent> of <N> spent` exactly as today.
  in-scope
- [ ] `agents/wave-reviewer.md` exists with frontmatter `name: wave-reviewer`, an updated routing-label `description:`, and every other frontmatter field byte-identical to the removed `agents/code-reviewer.md`; `agents/spec-reviewer.md` and `agents/code-reviewer.md` do not exist; every former `code-reviewer` dispatch site (`requesting-code-review` and its `code-reviewer.md` template, `loop-implementation`, `verification-before-completion` conformance check, `chase-bug` hotfix, `gatekeep-pr` skill, assessment and sync, `finishing-a-development-branch`, SDD `## After All Tasks Complete` step 2) dispatches `wave-reviewer` without a spec anchor and branches on `SHIP | FIX_FIRST | REJECT` as before, and `dispatching-parallel-agents`' `Parallel-safe:` probe and agent-choice line name `wave-reviewer`.
  in-scope
- [ ] A `wave-reviewer` task that supplies a spec anchor returns a clause table (`met | unmet | out-of-scope` per clause with evidence) before its findings, and any `unmet` or `out-of-scope` row yields at least `FIX_FIRST`; a task without a spec anchor returns no clause table and today's `code-reviewer` report shape with the `Parallel-safe:` and `TRAJECTORY:` lines and no `Behaviour-change:` line.
  in-scope
- [ ] `telemetry-collect` counts `wave-reviewer` findings by severity from the structured `findings` counts in the carrier result text and `phase-tracker` credits a completed `wave-reviewer` as the review cadence step after the last `implementer`; sealed records that name `spec-reviewer` or `code-reviewer` still parse.
  in-scope
- [ ] `npm test` passes with `eval/spec-reviewer/` and `eval/code-reviewer/` removed, `eval/wave-reviewer/` present, the superseded SDD samples removed or rewritten as listed in Design, and the replacement SDD samples present; `node eval/run.mjs subagent-driven-development` and `node eval/run.mjs wave-reviewer` reports are committed.
  in-scope
- [ ] `doc/specs/2026-10-29-orchestrator-delegation-guard.md` carries a supersession banner naming this spec and section 2 as the superseded scope.
  in-scope
- [ ] The gauntlet run that implements this spec seals a telemetry record whose implement-phase dispatch count per attempted plan task (numerator, denominator, and window per the Problem counting unit) is reported in the finish summary beside the 6.14 baseline from the Problem table; a record with `events_dropped > 0` in the implement window is reported as incomparable, not as a ratio.
  venue: local gauntlet run - the sealed telemetry record's implement-phase dispatch count per plan task

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: slim-subagent-dispatch
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` from the worktree; `node eval/run.mjs subagent-driven-development` and `node eval/run.mjs wave-reviewer` from the worktree (per-sample partial runs while iterating, the full target once at the end); `npm run build:bins` after any `extensions/lib/` edit, regenerated bundles committed
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/implement-engines.md
Rules: doc/gate-contract.md
Rules: doc/install-internals.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: none
design: owns every path in Design; observable outcomes are the acceptance rows above.

## Design

### Orchestrator frame (kept)

`skills/subagent-driven-development/SKILL.md` keeps preflight, worktree versus in-place mode selection, the `plan_tracker` lifecycle, `## Implementer Status`, `## Leg routing`, `## When a Subagent Fails` (its "After 2 failed attempts" step now points at the transition table below instead of `reference/fix-loop.md`), `## After All Tasks Complete` (step 2 dispatches `wave-reviewer`), `### Chain stopped or failed` (the diagnosis dispatch stays; its SR fan-out, snapshot reconstruction, and "retain accepted patches without a verdict" sentences go), `## Fix delta` (the `fix-delta-tree-shell` block and tree-pair rule, with SR references removed), and the `## Orchestrator holds` boundary with one change: the orchestrator reads each child's structured output and report file directly with `read`, under the bound below; plan, spec, and source reads stay delegated (children read their task by `planPath` + heading anchor; the orchestrator consumes only the `plan_check` manifest). The sentence "a file-only pointer never authorizes opening a report" and the delegated report-read recipe are removed from `SKILL.md` and `reference/dispatch-contract.md`.

**Bounded direct reads.** Consume structured output first: `status` / `verdict`, `maxSeverity`, `findingCount`, `findings`, `touchedTasks`, `trajectory`, `concerns`, `question`, `anchorUnreadable`. Open a report file only when the structured output does not settle the next operation: a `DONE_WITH_CONCERNS` concerns list, a `BLOCKED` / `NEEDS_CONTEXT` question that needs its evidence, or a `FIX_FIRST` / `REJECT` whose findings feed a repair payload or stop note. Each report is read at most once per wave with `read` and `limit: 300` (lines; about 24 KB at the measured median line length), and never with an offset past that bound; a wave reads at most one report per transcript `report <path>` line it printed. When the bounded read does not reach the report's `Verdict` / `TRAJECTORY:` footer, the report is oversized: re-dispatch the same `wave-reviewer` once with `Compact report: findings and footer only, at most 150 lines` appended to its task, read that report under the same bound, and stop with a stop note naming the oversized path if the compact report is oversized too. No `scout`, `delegate`, or other child ever reads a report on the orchestrator's behalf.

### The wave loop (rewritten)

One section, `## The Wave Loop`, replaces `## The Wave Loop`, `## Spec-review snapshots`, `## Fix-Loop Rounds`, and `reference/fix-loop.md`. Per wave:

1. Independence check on manifest `files` (unchanged); print `wave <w> base <sha>` and hold `WAVE_BASE_SHA`.
2. **Dispatch.** One one-step chain whose single `parallel` step contains only implementers, one item per task: `subagent({ async: false, context: "fresh", cwd: <worktree>, chain: [{ parallel: [{ agent: "implementer", as: "impl_<n>", outputSchema: IMPLEMENTER_STATUS_SCHEMA, output: "<REPORT_DIR>/wave<w>-task<n>.md", outputMode: "file-only", task: ... }], worktree: true, concurrency: 4, stopOn: { path: "/status", in: ["BLOCKED", "NEEDS_CONTEXT", "DONE_WITH_CONCERNS"] } }] })`. The `stopOn` on the step is what exposes `## Outputs` structured JSON in the tool-result text; top-level `tasks` has no item schema and is not used. For manifest `"mode":"in-place"`: `cwd` the branch checkout, no `worktree:`, the wave union as `SCOPED_TEST_COMMANDS`. Payload is `planPath`, task anchor, spec path, `SCOPED_TEST_COMMANDS` (the task's own `tests` for isolated waves), status protocol. No reviewer step follows the implementers; `reference/dispatch-contract.md` and `scripts/wave-review.test.mjs` are updated to this carrier.
3. **Read and integrate.** Read each child's structured output and report under the bound above; print `wave <w> task <n> <status> report <path> patch <path>`. Isolated waves: `DONE` / `DONE_WITH_CONCERNS` with a patch -> `git -C <worktree> apply --index <patch>` in plan index order, print `wave <w> integrated task <n>`; an initial patch that fails to apply prints `wave <w> task <n> apply failed`, leaves every already-integrated sibling staged, and stops with a stop note listing which tasks are integrated and which failed - no automatic rebuild (the human may ask for one, which runs the rebuild recipe below). In-place waves: nothing to apply; the checkout already carries the work. `BLOCKED` / `NEEDS_CONTEXT` -> the takeable-decision ladder below.
4. **Test gate.** Run each manifest test for the wave union separately, logs to `gate-<i>.log`; print `wave <w> gate <i> exit <code>`. A red gate enters step 6 as a gate repair for every task whose `files` the failing test belongs to (the manifest's `tests` owner), before any review; the review in step 5 runs only on a green gate.
5. **Review.** One `wave-reviewer` dispatch per wave, doc-only waves included (`context: "fresh"`, `async: false`, read-only, one-step carrier with `WAVE_VERDICT_SCHEMA` and `stopOn: { path: "/verdict", in: ["FIX_FIRST", "REJECT"] }`), `cwd` the integrated tree after `git -C <worktree> add -A`, with `planPath`, the wave's task `anchors`, `Spec:` (absolute home spec), `BASE_SHA: <WAVE_BASE_SHA>`, `HEAD_SHA: WORKTREE`, and the wave union as `SCOPED_TEST_COMMANDS` (`none` for a doc-only wave, so the reviewer runs nothing and applies the clause table and documentation checks only). Record the review tree per `## Fix delta`; print `wave <w> review <k> verdict <value> report <path> tree <sha>`. `SHIP` -> step 7; `FIX_FIRST` -> step 6; `REJECT` -> hard stop with a stop note.
6. **Repair round.** Attribute each finding to a task: the task whose manifest `files` contain the finding's file, else the tasks in the structured `touchedTasks`; a finding with neither a file inside any wave task's `files` nor a `touchedTasks` owner stops with `Recommendation: spec/plan amendment` through `reference/implement-amendments.md` - findings are never dropped from a repair payload. For each attributed task, dispatch one `implementer` on the current tree with the findings block or gate log as its task text, the prior report path under `## Previous review report`, the task's anchors, and `SCOPED_TEST_COMMANDS` (isolated: the task's own `tests`; in-place: the wave union), through the one-step carrier with no `context: "fresh"` override and no prior-patch path:
   - *Isolated waves* use the repair-base recipe below: a detached worktree at `WAVE_BASE_SHA` with the whole current integrated tree (every integrated patch, every applied repair delta, added files included) committed on top, so the dispatch root is clean and pi-cohort's exported patch is exactly the repair delta. Dispatch with `cwd: <RP_TREE>`, `worktree: true`; the delta is the `Artifacts:` patch at `<Artifacts dir>/worktree-diffs/step-0/task-0-implementer.patch`. Apply it to the integrated tree with `git -C <worktree> apply --index <delta>`; print `wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>`; then `git -C <worktree> worktree remove --force <RP_TREE>`.
   - *In-place waves* dispatch with `cwd` the branch checkout and no `worktree:`; the child edits the checkout directly; apply no patch and run no snapshot recipe; print the same line with `delta none applied n/a`.

   After the round: `git -C <worktree> add -A`; `git -C <worktree> diff --stat` against the recorded pre-repair tree decides emptiness; re-run the test gate for the touched tasks' `tests`; on green, one `wave-reviewer` re-review with the marker `## Previous review report (re-review trigger)`, the prior report path, the `## Fix delta` tree pair, the same `BASE_SHA` / `HEAD_SHA: WORKTREE`. Transitions follow the table below.
7. **Commit.** Only when the gate is green and the latest `wave-reviewer` verdict is `SHIP`: isolated waves `git -C <worktree> reset --soft "$WAVE_BASE_SHA" && git -C <worktree> add -A && git -C <worktree> commit -m <message>`; in-place waves commit a descendant commit without amending or `reset --soft` (unchanged). Then mark every index of the original wave `complete` together; execute manifest `orchestrator` instructions as today.

`WAVE_BASE_SHA` is fixed across repair rounds, so every re-review diffs against the same root the first review saw.

**Repair-base recipe** (isolated waves; replaces `## Spec-review snapshots`; substitute shell-quoted literals; run the whole block, stop on nonzero exit and retain `RP_DIR` for diagnosis):

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
| Dispatch error, missing structured output after diagnosis says `repair`, or `BLOCKED` / `NEEDS_CONTEXT` answered by the ladder | +1 | re-dispatch on the same tree with the answer appended |
| Repair delta or in-place repair leaves `diff --stat` empty (`DONE` with an unchanged tree) | +1 | no re-review of the unchanged tree; next repair resends the prior report path with "your fix changed no tracked file" |
| Repair delta fails `git apply --index` | +1 | rebuild (below) |
| Review 1 `FIX_FIRST` (no `TRAJECTORY:` line) | +1 for each attributed task | repair |
| Re-review `FIX_FIRST`, `TRAJECTORY: CONVERGING` or `DIVERGING` | +1 for each attributed task | repair while `failed[n] < 2`; else escalation |
| Re-review `FIX_FIRST`, `TRAJECTORY: STAGNANT`, or a missing/malformed line | sets `failed[n] = 2` for each attributed task | escalation now (ordinary rounds); stop immediately on a funded re-review |
| `failed[n] == 2` reached by a `CONVERGING` re-review whose line lacks `max severity Critical`, `converged[n]` unset | sets `converged[n]` | one extra ordinary repair, then re-review; a further `FIX_FIRST` escalates whatever the trajectory |
| `failed[n] == 2` (or `> 2` after the convergence exception), `escalated[n]` unset | sets `escalated[n]` | escalated round with `model: <implModel>` (below) |
| Escalated round fails (dispatch error, non-`DONE`, red gate, empty delta, or attributed `FIX_FIRST`) | spent | funded round while the task's ledger has one left, else stop note |
| Funded round fails the same way | spends one | next funded round while one remains, else stop note; `STAGNANT` stops regardless |
| Gate green and review or re-review `SHIP` | - | step 7 |
| `REJECT`, `anchorUnreadable` on a reviewer, or the round cap: more than `4 + N` re-reviews in one wave (`N` = the largest funded grant among the wave's tasks, 0 without a token) | - | hard stop with the stop note |

Execution escalation to `implModel` is available whenever `failed[n]` reaches 2, independently of any `**Amend-grant:**` value; funding only adds rounds after the escalated round. `## When a Subagent Fails` keeps its two-attempt wording, and its third step reads "after 2 failed attempts the transition table's escalated round runs; STOP only when that round and any funded round are spent".

### Rebuild (the one automatic path)

A repair delta that fails `git apply --index` prints `rebuild: task <n> - delta apply failed` and counts one failed attempt. Then, in the integrated tree: partition the task's manifest paths - every `Create` path (including a new test file declared as both `Create` and `Test`) is removed (`git -C <worktree> rm -q -f --ignore-unmatch -- <paths>`), and the remaining `Modify` / `Test` paths, deduplicated and excluding every `Create` path, are restored from the wave base (`git -C <worktree> restore --source="$WAVE_BASE_SHA" --staged --worktree -- <paths>`); sibling paths are untouched (step 1 guarantees disjointness). Run the repair-base recipe on that tree, so the snapshot holds the base plus every accepted sibling and nothing of task n; dispatch one `implementer` from `<RP_TREE>` with `worktree: true` and the task's original payload (this dispatch is the next attempt on `failed[n]`'s counter - the escalated round when the counter has reached 2); apply its `Artifacts:` patch to the integrated tree with `git apply --index` (a failure here is a hard stop, not a second rebuild). The rebuilt task rejoins its original wave: re-run the gate for the wave union, one `wave-reviewer` re-review with the marker and the prior report path, and step 7 commits the whole wave once and completes all of its indices together. The human may ask for a rebuild at any stop, which runs this same recipe; nothing else triggers one. `BLOCKED` / `NEEDS_CONTEXT` on a repair never rebuilds: the ladder answers, then the same child payload is re-dispatched on the same tree with the answer appended.

### Escalation and funding (folded in, semantics kept)

- **Execution escalation.** When the transition table reaches the escalated round for task n, print `escalated round for task <n> after 2 failed attempts`, call `gauntlet_setting({ key: "escalationLoop" })`, and dispatch one `implementer` with `model: <implModel>`, `async: false`, on the current tree (repair-base snapshot for isolated waves, branch checkout for in-place) with the same payload as the failed round; no `context: "fresh"`, no prior-patch path. `implModel` undefined or the settings tool unavailable -> stop note. Once per task per wave; spends independently of funding. The escalated round runs the ordinary test gate and `wave-reviewer` re-review.
- **Funded rounds.** Grant read and Value decoding through `reference/amendment-surface.md#standing-grants` unchanged; one per-task ledger from zero; `funded round <k> of <N> for task <n>` before each funded dispatch; each funded dispatch repeats the escalated payload (`model: <implModel>`, same tree, same anchors) and spends one including failures; `STAGNANT` on a funded re-review stops immediately; `budget: <spent> of <N> spent` in stop notes after `Problem:` and `Searched:` lines; resume recovers spent only from `funded round` transcript lines, otherwise exhausted with `(not recovered on resume)`. Funding never supplies a missing `implModel`.
- **Takeable decision.** `BLOCKED` / `NEEDS_CONTEXT` with attempts remaining: compare the whitespace-normalized `file:line` or failing command plus assertion against decisions already auto-taken on this task (`Recommendation: none - evidence repeats task <n>` and stop on a repeat); in-task repair counts as an ordinary attempt under the two-attempt limit; spec/plan rule edits route through `reference/amendment-surface.md` section 5 under the grant; `fix-first` enters `/skill:shape-ticket`; everything else emits the stop note ending in `Recommendation: <option> - <why>` and waits. Print `took recommendation: <option> for task <n>` when taken.
- **Hard stops:** malformed grants, missing `implModel`, unavailable settings tools, dirty-tree or commit-boundary returns, empty-commit stagnation, the round cap in the table, funded re-review `STAGNANT`, `REJECT`, an initial-patch or rebuild-patch apply failure, an oversized compact report, redraws.

The `TRAJECTORY:` block and `stop-note.md` grammar bind to the single `wave-reviewer` line.

### The merged persona

`agents/wave-reviewer.md` replaces `agents/spec-reviewer.md` and `agents/code-reviewer.md`. Frontmatter: `name: wave-reviewer`; `description:` rewritten as a routing label ("Wave review over an integrated diff: spec-clause table when a spec anchor is supplied plus prioritized code findings (Critical and Moderate block, Minor is a nit). Read-only - does not edit."); every other field (`tools`, `defaultContext`, `inheritProjectContext`, `inheritSkills`, `systemPromptMode`, `completionGuard: false`, no `thinking:` pin) byte-identical to today's `code-reviewer`. Body, in order:

1. **Clause table** - rendered only when the task supplies `anchors` and `Spec:`: read each selected task's `Spec:` anchors (as `spec-reviewer` does today) and decompose only the union of those cited spec ranges into clauses; each row `met | unmet | out-of-scope` with a `file:line` or test evidence; an unreadable anchor yields `REJECT` with `anchorUnreadable` set and the anchor named. `unmet` = a clause inside the wave's cited ranges that the diff does not deliver, including a requirement the plan task dropped in transcription (spec authority within the slice); `out-of-scope` = work in the diff outside the wave's anchors; clauses owned by tasks not in this wave are not rows and never produce `unmet`.
2. **Findings** - today's `code-reviewer` severity findings (`[Critical]`, `[Moderate]`, `[Minor]`), each with location and the spec-observable behavior a test must prove; the `Rules:` / `Leg:` read rule and the fix-delta re-review scope (review the `## Fix delta` tree pair when supplied, the whole diff otherwise) carry over from the two personas.
3. **Verdict** - `SHIP | FIX_FIRST | REJECT`; any `unmet` or `out-of-scope` clause forces at least `FIX_FIRST`; Minor-only findings still `SHIP` (today's rule).
4. **Footer** - `Parallel-safe:` (today's grammar, unchanged) and `TRAJECTORY:` (only under the re-review marker) lines verbatim, copied into structured output.

Structured output `WAVE_VERDICT_SCHEMA` in `reference/dispatch-contract.md` replaces `SPEC_VERDICT_SCHEMA` and `CODE_VERDICT_SCHEMA`: required `verdict` (`SHIP | FIX_FIRST | REJECT`), `reasoning`, `findingCount`, `findings` (`{ critical, moderate, minor }` integers); optional `maxSeverity` (`Critical | Moderate | Minor`), `parallelSafe`, `touchedTasks`, `trajectory` (`{ verdict, line }`), `anchorUnreadable`, `clauses` (array of `{ clause, status: met | unmet | out-of-scope, evidence }`); `additionalProperties: false`; no `behaviourChange`.

`skills/subagent-driven-development/wave-reviewer-prompt.md` replaces `spec-reviewer-prompt.md` and `code-quality-reviewer-prompt.md`. Non-SDD callers supply no spec anchor and get the findings-only shape.

### Extensions

- `extensions/phase-tracker.ts:139` `CADENCE_AGENTS` becomes `["implementer", "wave-reviewer"]`; Guard 5 (`extensions/phase-tracker.ts:815-816`) compares `cadenceLastSeen.implementer > cadenceLastSeen["wave-reviewer"]` instead of the two hardcoded removed names, and `REVIEW_CADENCE_WARNING` says one `wave-reviewer` per wave instead of SR per task; `extensions/phase-tracker.test.ts` covers a documentation commit and a code commit after an implementer with and without a newer `wave-reviewer`.
- `extensions/lib/phase-tracker-helpers.ts:38,68,70`: label `wave-reviewer` -> `wave-review`; the `implement+sr` label is removed.
- `extensions/lib/telemetry-collect.ts:33` `REVIEWER_AGENTS` = `{"wave-reviewer", "conformance-reviewer"}` (the active allowlist); a new `countStructuredFindings(text)` reads the `findings` object from the fenced structured JSON in the carrier result's `## Outputs` block and `extensions/telemetry.ts:698` uses it before falling back to `countFindings` tag parsing, so file-only reviewer results still yield severity counts; tag parsing is unchanged so old records with the removed names still count. `extensions/lib/telemetry-collect.test.ts` feeds the actual file-only carrier result text (`## Outputs` fenced JSON plus `Output saved to:` pointer), not an inline tag string, and keeps a separate historical-record case for `spec-reviewer` / `code-reviewer`.
- `npm run build:bins`, bundles committed.

### Transcript lines and recovery

The loop prints, in order: `wave <w> base <sha>`, `wave <w> task <n> <status> report <path> patch <path>`, `wave <w> integrated task <n>` (or `apply failed`), `wave <w> gate <i> exit <code>`, `wave <w> review <k> verdict <value> report <path> tree <sha>`, `wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>`, `rebuild: task <n> - delta apply failed`, `escalated round for task <n> after 2 failed attempts`, `funded round <k> of <N> for task <n>`, `repair-base: <path> <sha>`. `### Recovery` recovers dynamic state only from these lines: the wave base, which patches and deltas are integrated, the latest review verdict and tree, `failed[n]` (one per counting event above), `escalated[n]`, and spent funding. Continue only when those lines establish the current tree and the next permitted operation (a terminal review verdict after the last `applied yes` line, or a green gate line after the last repair); a missing terminal outcome, a repair line without its `applied` value, or an `in_progress` wave without its base line stops with a stop note naming the wave and the missing facts, as today. A brief written under the old protocol carries no reviewer rows to rename (the brief grammar names only `conformance-reviewer`); its static trackers restore as today and its dynamic state follows the same rule - the old `review <k> tree <path>` lines without a verdict do not establish a current tree, so such a resume stops rather than continuing.

### Removals and additions

Remove: `agents/spec-reviewer.md`, `agents/code-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, `skills/subagent-driven-development/reference/fix-loop.md`, `SKILL.md` sections `## Fix-Loop Rounds` and `## Spec-review snapshots`, the per-task SR chain step in `## Dispatch` and `reference/dispatch-contract.md`, `SPEC_VERDICT_SCHEMA` and `CODE_VERDICT_SCHEMA` (replaced by `WAVE_VERDICT_SCHEMA`), the report-relay clause in `## Orchestrator holds`, `implement+sr` in `phase-tracker-helpers.ts`, `spec-reviewer`/`code-reviewer` in `CADENCE_AGENTS`, Guard 5 and `REVIEWER_AGENTS`, `eval/spec-reviewer/`, `eval/code-reviewer/`, SDD samples `chain-wave-dispatch`, `report-by-path-fix`, `patch-review-snapshot`, `test-gate-repair`, the `code-reviewer` dispatch or persona lines in `requesting-code-review/SKILL.md:10,28,34,36,40,43,78` and its `code-reviewer.md` template (renamed `wave-reviewer.md`), `loop-implementation/SKILL.md:220`, `chase-bug/hotfix.md:123`, `verification-before-completion/reference/conformance-check.md:196`, `gatekeep-pr/SKILL.md:42`, `gatekeep-pr/reference/assessment.md:88`, `gatekeep-pr/reference/sync.md:56`, `finishing-a-development-branch/reference/disposition-protocol.md:46`, SDD `SKILL.md` `## After All Tasks Complete` step 2 and its Red Flags line, the `code-reviewer` name in `dispatching-parallel-agents/SKILL.md:131`'s structural probe and `:194`'s agent-choice line, the `scripts/ci.mjs:192-195` pins on `spec-reviewer-prompt.md`, `agents/spec-reviewer.md` and `agents/code-reviewer.md` (including the `Behaviour-change:` pin), and the `never default to \`no\`` pin at `ci.mjs:196`.
Migrate (existing components, not new ones): `skills/subagent-driven-development/stop-note.md` - drop its delegated-report-read mandate (`:3-11`), its link to the removed `reference/fix-loop.md`, and the unavailable-settings-tool exemption (`:36-44`), keeping its human-facing grammar; `extensions/telemetry.test.ts:749-802` - active-review assertions dispatch `wave-reviewer` instead of the deleted persona names; `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md` - include both in Task 2's owned files and refresh only their `for:` assembly hashes after the approved reviewer-reference migrations, preserving their intent bodies, expected moves, and gatekeep-pr gate semantics, then rerun Task 2's scoped test command before committing.

Rewrite (retained SDD samples whose `expected.md` asserts the SR/CR chain, snapshots, fresh-context or prior-patch repairs, forbidden report reads, or the `## Fix delta` SR scope): `delegated-source-investigation` (direct child-report reads allowed; plan/spec/source reads still delegated), `repair-compaction-recovery` (new transcript lines; missing-state stop kept), `leg-cwd` (bare implementer), `integrated-wave-repair`, `all-singleton-waves`, `singleton-apply-failure`, `snapshot-apply-failure`, `stagnant-under-budget`, `third-attempt-escalated`, `multi-task-wave-ledger`, every `budget-*` sample, `chain-stop-blocked`, `no-plan-read-wave`, plus any other sample the rule catches. Keep `delegated-amendment` unchanged. Retarget `eval/gatekeep-pr/samples/{conflict-free-sync,conflicting-file-sync,scoped-test-red-sync}/expected.md` and `eval/loop-implementation/samples/verify-lifecycle/expected.md` to `wave-reviewer`. Migrate `scripts/wave-review.test.mjs` (the deleted `fix-loop.md`, `spec-review-snapshot-shell` and `fix-delta-tree-shell` assertions, the persona list, the deleted-sample list, the Rules-sentence check now over `implementer` and `wave-reviewer` only), `scripts/anchored-task.test.mjs`, `scripts/loop-engine-contract.test.mjs`, `scripts/gatekeep-comment-reconcile.test.mjs`, and `eval/subagent-driven-development/target.json` (`skillFiles` lose `reference/fix-loop.md` and `code-quality-reviewer-prompt.md`, gain `wave-reviewer-prompt.md`; slices retarget the renamed headings). Compatibility tests that parse historical records or old briefs may keep the names `spec-reviewer` / `code-reviewer` as fixture data.

Add: `agents/wave-reviewer.md`, `skills/subagent-driven-development/wave-reviewer-prompt.md`, the rewritten `## The Wave Loop` with the `repair-base-shell` block and the transition table, `WAVE_VERDICT_SCHEMA`, `wave-reviewer` dispatch lines at every site above, `wave-review` cadence label, `countStructuredFindings`, two new `scripts/ci.mjs` checks - an agent-reference check that no `skills/**/*.md` or `agents/*.md` contains `agent: "spec-reviewer"` or `agent: "code-reviewer"` (scoped to dispatch lines; `extensions/` and test fixtures excluded), and a spec-lint check that the predecessor spec's `Superseded by` banner href resolves to this spec - `eval/wave-reviewer/` (`with-anchor`, `without-anchor`, `unreadable-anchor`, `partial-wave-ship` - a two-wave spec whose first wave `SHIP`s with later-wave clauses absent from the table), SDD samples `one-review-per-wave` (code-touching and doc-only waves each get one), `direct-report-read` (including an oversized report hitting the bound), `repair-on-top` (isolated delta and in-place direct edit), `gate-repair-before-review`, `empty-delta-attempt`, `apply-failure-rebuild` (rebuild rejoins its wave; initial-patch failure stops), `escalation-same-tree` (`failed[n] == 2` with no grant still escalates; undefined `implModel` stops), `convergence-exception`, `funded-failure-stop`, `reject-stop`, `blocked-resume-tree`, `eval/subagent-driven-development/intent.md` and `eval/wave-reviewer/intent.md`, the supersession banner on the predecessor spec, `doc/personas.md` / `doc/implement-engines.md` / `doc/configuration.md` / `README.md` rows, the operator pin migration note (`subagents.agentOverrides.code-reviewer` / `.spec-reviewer` pins move to `agentOverrides.wave-reviewer`; the `doc/personas.md:32-35` example configuration and `doc/configuration.md:69` updated), a CHANGELOG `## Unreleased` entry naming the removed personas, the pin migration, and the pi-cohort pairing note (no dispatch-shape change; pi-cohort docs unaffected).

Unlisted moving parts found during planning route through `reference/amendment-surface.md`.

### Implement-local plan maintenance

**Local patch.** Use the existing plan-writer amendment route during implement to patch only affected task entries, coverage and shifted anchors; preserve unaffected ids, titles, wave order, state and baseline evidence. Capture original task numbers, titles, anchors, anchored obligation text, task bodies, Tests and wave positions in the existing apply report before the first edit, and reuse that inventory on an idempotent retry. Keep the apply schema; interpret `tasksAnchorChanged` as semantic obligation or work changes, not line offsets or meaning-preserving rewording, and reopen completed tasks only for semantic changes. Keep mechanical `plan_check`, spec coverage and the parent stamp; add no persona, tool, state store or wholesale regeneration.

**Historical baselines.** Retain unchanged command evidence at its original SHA, including derived-pass, skipped and artifact suffixes, and retain initial per-leg declarations as original provenance. Do not restamp, prove endpoint-tree equivalence or rerun every command merely because implement HEAD advanced. Distinguish this implement-only policy through the existing protocol and plan metadata; keep initial planning, explicit full refresh and final verification unchanged. Accept mixed genuinely evidenced per-command revisions without weakening leg ownership, syntax, adjacency or test-anchor checks. Execute changed or added commands and missing or invalid evidence exactly or through a documented derived scoped command on an identified current or retained implementation; record checkout, revision, admitted changes, exit and nonzero executed-test count in the existing report/provenance surfaces. Never label a dirty execution as clean HEAD; use an identified execution tree or an existing parent-owned committed snapshot. Treat already-created anchors as existing; create new skipped evidence only for anchors all truly absent at the execution revision.

**Intermediate failures.** Permit spec/plan-only maintenance over declared in-flight repairs when no test execution is needed; preserve staged repairs rather than committing, restoring or discarding them for planning. Unknown dirty paths, contamination and moved test revisions still block. Attribute a failure to retained work only from its failing command, assertion or path together with corresponding repair evidence, never task membership alone; preserve failed revision/output and resolving evidence. Return an outstanding repair to its existing task gate loop, not repeated baseline refreshes or unrelated task reopening. Unrelated regressions remain substantive blockers; integrated tests, review and final verification remain mandatory.

**Consent.** Decode the standing grant at each batch boundary and apply the amend-class recommendation under amend permission without another permission, reviewer or menu turn. Repeated evidence of an already authorized intermediate disposition is neither new consent nor a reason to repeat refresh. Keep budget-only distinct and retain malformed-grant, redraw, unidentified-test-tree and unrelated-regression safety stops. Record one amendment audit; fabricate no evidence, restoration authorization or funded round.

**Implementation inventory.** Modify `agents/plan-writer.md`, `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `skills/brainstorming/reference/amendment-surface.md`, `skills/subagent-driven-development/reference/implement-amendments.md`, `skills/subagent-driven-development/reference/dispatch-contract.md`, `extensions/lib/plan-check.ts`, `extensions/lib/plan-check.test.ts`, `scripts/implement-amendment.test.mjs` and `scripts/brainstorming-contract.test.mjs`. Add writing-plans samples `implement-amend-historical-baseline` and `implement-amend-changed-command`, and SDD sample `local-amend-revalidation`, with case/expected pairs and both targets' intent/report/result updates. Preserve ordinary planning restamp cases and existing delegated-amendment cases. Regenerate bins after the library edit. Keep committed artifacts free of private session text and machine paths; change no install or shared registration.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Red test gate at step 4 | Gate repair for the owning tasks before any review; `wave-reviewer` runs only on green |
| Repair delta fails `git apply --index` | `rebuild: task <n> - delta apply failed`; one failed attempt; that task's paths restored to `WAVE_BASE_SHA`, siblings kept; one fresh implementer from the repair-base snapshot; the patch rejoins the original wave's gate, review and single commit; the only automatic rebuild |
| Initial patch fails `git apply --index` | `wave <w> task <n> apply failed`; accepted siblings stay staged; stop note listing integrated and failed tasks; no automatic rebuild |
| Rebuild patch fails `git apply --index` | Hard stop |
| Repair returns `DONE` with an unchanged tree | One failed attempt; no re-review; next repair told "your fix changed no tracked file" |
| Repair returns `DONE` but the gate stays red | One failed attempt; next repair from the new gate log |
| `wave-reviewer` returns `REJECT` | Hard stop, stop note per `stop-note.md`, no repair round |
| `BLOCKED` / `NEEDS_CONTEXT` on a repair | Takeable-decision ladder; on answer, same payload re-dispatched on the same tree with the answer appended; never a rebuild |
| `failed[n]` reaches 2 | Escalated round with `model: <implModel>` on the current tree, with or without an `**Amend-grant:**`; `implModel` undefined or settings tool unavailable -> stop note |
| Escalated round fails | Funded round while the ledger has one, else stop note with `budget:` line when a token exists |
| Finding names a file outside every wave task's `files` and carries no `touchedTasks` owner | Stop with `Recommendation: spec/plan amendment`; the finding stays in the stop note |
| Report longer than the 300-line bound | One compact re-dispatch of the same reviewer; a second oversized report stops |
| Child returns no structured output | Existing `### Chain stopped or failed` diagnosis (one fresh diagnostic dispatch), unchanged |
| Doc-only wave | One `wave-reviewer` with `SCOPED_TEST_COMMANDS: none`; test gate and commit as today; Guard 5 sees the reviewer |
| Session resumed mid-wave | Dynamic state only from the transcript lines in Design; continue when they establish the current tree and next operation, otherwise the missing-state stop; a brief written under the old protocol restores static trackers only |
| Old sealed telemetry record naming `spec-reviewer` / `code-reviewer` | Parses; findings counted by severity tags, not by agent name |
| Non-SDD caller dispatches `wave-reviewer` | No spec anchor supplied; findings-only report; verdict vocabulary unchanged |

## Tests

- One `wave-reviewer` per wave, code-touching and doc-only alike, no per-task SR chain - `eval/subagent-driven-development/samples/one-review-per-wave`
- Orchestrator reads report by path directly under the bound, oversized report takes the compact re-dispatch; plan/spec/source still delegated - `samples/direct-report-read`, `samples/delegated-source-investigation` (rewritten), `samples/delegated-amendment` (kept)
- Repair re-dispatch on the current tree with findings as task, no `context: "fresh"` / prior patch; isolated delta applied once, in-place edit not re-applied - `samples/repair-on-top`
- Red gate repairs before any review; `DONE` with a red gate counts an attempt - `samples/gate-repair-before-review`
- Empty delta counts an attempt without a re-review - `samples/empty-delta-attempt`
- Delta apply failure is the only automatic rebuild, the rebuilt task rejoins its wave's single commit; initial apply failure stops - `samples/apply-failure-rebuild`
- Escalated round uses `implModel` on the current tree without a grant; undefined `implModel` stops; funded-round lines unchanged; funded failure stops with the budget line - `samples/escalation-same-tree`, `samples/funded-failure-stop`
- Convergence exception fires once, then escalates - `samples/convergence-exception`
- `REJECT` hard stop - `samples/reject-stop`
- `BLOCKED` resume on the same tree after the answer - `samples/blocked-resume-tree`
- Mid-wave recovery from the new transcript lines, missing-state stop kept - `samples/repair-compaction-recovery` (rewritten)
- Bare implementer dispatch with leg `cwd` - `samples/leg-cwd` (rewritten)
- Clause table scoped to the wave's cited ranges; a first wave `SHIP`s with later-wave clauses absent; unreadable anchor -> `REJECT`; findings-only without anchor - `eval/wave-reviewer/samples/{with-anchor,partial-wave-ship,unreadable-anchor,without-anchor}`
- Non-SDD callers dispatch `wave-reviewer` and branch on the old vocabulary - the new `scripts/ci.mjs` agent-reference check (added by this spec) finds no `agent: "spec-reviewer"` / `agent: "code-reviewer"` under `skills/` or `agents/`; `scripts/anchored-task.test.mjs`, `scripts/loop-engine-contract.test.mjs`, `scripts/gatekeep-comment-reconcile.test.mjs` migrated
- One-step implementer carrier with item schemas and `stopOn` - `scripts/wave-review.test.mjs` (migrated)
- Telemetry counts `wave-reviewer` findings from the file-only carrier result; old agent names parse - `extensions/lib/telemetry-collect.test.ts`
- Cadence reminder credits `wave-reviewer` on doc and code commits; `implement+sr` label gone - `extensions/lib/phase-tracker-helpers.test.ts`, `extensions/phase-tracker.test.ts`
- Supersession banner on the predecessor - the new `scripts/ci.mjs` spec-lint check (added by this spec; banner href resolves)
- Dispatches per attempted task from the sealed record, numerator and denominator per the Problem counting unit - none: runtime observation reported in the finish summary; the baseline is recorded as input in `## Problem`; an implement window with `events_dropped > 0` is reported as incomparable
- Local amendment regressions: offset preservation versus semantic reopening; mixed historical revisions with leg ownership; malformed evidence rejection; already-created versus absent anchors; changed-command execution with identified tree and nonzero count. Exercise the checker and amendment contract tests without weakening ordinary planning restamp cases.
- Synthetic writing-plans samples implement-amend-historical-baseline and implement-amend-changed-command, and SDD local-amend-revalidation: retained template-rename repair versus unrelated regression, staged preservation, grant/budget/malformed/redraw boundaries and idempotent retry from original inventory; keep delegated-amendment scenarios intact.
- Add `node eval/run.mjs writing-plans` to final verification alongside the existing full SDD/wave-reviewer targets and repository verification; commit real target reports and regenerated bins, not fabricated evidence.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/personas.md` (roster and knobs table - `wave-reviewer` replaces two rows; the `agentOverrides` example moves its pins to `wave-reviewer`; major procedure), `doc/implement-engines.md` ("Task-plan orchestration" and the fix-loop pointer; major procedure), `doc/configuration.md` (cadence label table, the review-cadence guard paragraph, and the operator pin migration note for `agentOverrides.wave-reviewer`; operations), `README.md` (persona count 11 -> 10; major definition), `CHANGELOG.md` (`## Unreleased` entry naming the removed personas, the pin migration and implement-local amendment/revalidation contract, written in this change; major procedure)
- Derived / memory docs invalidated: `doc/specs/2026-10-29-orchestrator-delegation-guard.md` (supersession banner, section 2 scope)
- Internal protocol docs: amend the existing plan-writer, writing-plans contract, amendment surface and SDD amendment/dispatch references listed in Design; both affected eval targets record the new intent and real reports. No new guide or registration surface.

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- Persona body slimming (no evidence links child duration to prompt length).
- pi-cohort spawn mechanics, `scout` / `delegate` builtin personas, dispatch shape or settings keys (no cross-repo contract change).
- The loop engine's protocol (`/skill:loop-implementation`), except retargeting its `code-reviewer` dispatch.
- The verify-phase `conformance-reviewer`.
- `gatekeep-pr`'s gate semantics; only its reviewer persona reference changes to `wave-reviewer`.
- pi-condense prune-induced cache rewrites (25 of 32 rewrites in one session followed prune bursts) - a pi-condense cost question.
- A session-log analysis script under `scripts/` (would read private transcripts; no shippable fixture).

## Open questions

- The dispatch-count number from the implementing run is an observation, not a gate; a later spec may set a target once two or more post-change runs exist.
