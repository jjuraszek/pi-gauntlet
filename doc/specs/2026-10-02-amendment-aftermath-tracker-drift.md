# Amendment aftermath: reopened tasks close in place, no phase movement

**Goal:** an approved spec amendment that reopens plan tasks during `verify` repairs and closes them inside `verify`; the procedure that says so survives context pruning because skill references are loaded with `read`; and the phase tracker tells the main loop, after every repair wave, which plan tasks are still open.

Supersedes `doc/specs/2026-09-10-gh-27-remove-meaningless-gates.md`, the amendment-path aftermath clause "skip the current phase, then start implement force: true; later phases re-enter with force: true" only; and `doc/specs/2026-09-22-amend-batch-trigger-reviewer-contract.md`, the `restarts implement, then verify` phase consequence only. Every other section of both specs stands. `doc/specs/2026-09-16-plan-tracker-state-contract.md` (same-index reopening, completion backstop) stands unchanged: this spec builds on it.

## Problem

Fault story, from the pi-quiver session of 2026-10-01 (`sessions/--Users-jacek-repos-pi-quiver--/2026-10-01T15-24-04-862Z_*.jsonl`): the verify-phase code review raised a spec amendment -> the main loop loaded `skills/brainstorming/reference/amendment-surface.md` with `bash sed` -> pi-condense pruned those reads into two-sentence summaries (its `**/skills/**/*.md` protection keys on a string `path` argument, `pi-condense/src/protected.ts:49-56`; a `bash` call has none) -> six hours later the human approved and the main loop ran the aftermath from memory: it re-`init`ed `plan_tracker` with four completed tasks flipped to `in_progress` and then dispatched seven repair waves without a single `plan_tracker` call -> `complete verify` rejected with `unfinished tasks: 0, 3, 4, 7 (in_progress)` after the conformance audit had already reported `CONFORMS`. The widget read `Plan: 4/8 done (4 in progress)` for the final 90 session lines.

Two defects, one in text and one in runtime signal:

1. **The aftermath prescribes a phase move that contradicts the rest of the flow.** `amendment-surface.md:106` says a task reopened during `verify`/`ship` triggers `phase_tracker skip <current>` then `start implement force: true`, and the batch card renders `restarts implement, then verify` (`:96`). Phases are a one-way lane: the two existing verify-phase repair loops already reopen tasks in place with no phase call (`skills/subagent-driven-development/SKILL.md:224`; `skills/verification-before-completion/reference/conformance-check.md:131-133,178`), and even the sanctioned sequence (skip verify, then `start implement force: true`) regresses that lane and reruns verify from the start. The session's runtime behavior - verify stayed in progress, repairs counted as fix rounds, `complete verify` refused - was the correct contract; the skill text was wrong, and it was also gone.
2. **Nothing tells the main loop to close a reopened task until the last possible moment.** `applyPlanActivity` only auto-completes `implement` (`phase-tracker.ts:405-414`); `observeFixWave` counts rounds without reading tasks (`:351-363`); the completion backstop (`:987-1021`) is the only closure check and fires after every round has run.

## Acceptance criteria

none - no ticket

## Design

Three changes, each at the boundary that already owns the thing. No new settings key, no new guard, no new error path, no new session state.

### 1. Skill resources are loaded with `read`

Rule, stated once where the flow begins and once where the incident's procedure lives; every amendment entry point routes through the second:

- `skills/brainstorming/SKILL.md` § Amending an approved spec gains one sentence before the classify paragraph: "Every skill resource in this flow (a `SKILL.md` or a `reference/*.md`) is loaded with the `read` tool at its absolute path under `skills/`, never with a shell command - pruning protection keys on `read`'s `path`." Line `:151` "Amend -> load `reference/amendment-surface.md` and follow it" becomes "Amend -> `read` `reference/amendment-surface.md` and follow it". The red flag at `:169` is unchanged.
- `skills/brainstorming/reference/amendment-surface.md:3` "Load from `skills/brainstorming/SKILL.md` § Amending an approved spec" becomes "`read` this file (the `read` tool at its absolute path, never a shell command) from `skills/brainstorming/SKILL.md` § Amending an approved spec". This covers the direct entry points that name the file without a load verb: `skills/subagent-driven-development/SKILL.md:68` and `skills/finishing-a-development-branch/SKILL.md:97`; each of those two gains the verb `read` before the file reference (one word each).
- `amendment-surface.md` section 5 opens with one added sentence: "Before the aftermath, `read` this section again; never run it from memory." The approval reply and the aftermath can be turns apart (six hours in the incident), so the apply-time re-read is what puts the closure steps back in context.

A sweep of every other skill's reference-load wording is not part of this change (see Out of scope).

### 2. Aftermath: reopen in place, close on acceptance

`amendment-surface.md` section 5, aftermath paragraph, last sentence - before:

> A task reopened while `verify` or `ship` is in progress: `phase_tracker({ action: "skip", phase: "<current>", reason: "amendment reopened Task N" })`, then `phase_tracker({ action: "start", phase: "implement", force: true })`; later phases re-enter with `force: true` and rerun in full.

after:

> A task reopened while `verify` or `ship` is in progress stays in that phase - no `phase_tracker` call. Repair it through the current phase's fix loop and `plan_tracker({ action: "update", index: N, status: "complete" })` it once that repair's review or re-audit accepts; open tasks block `complete verify`, and in `ship` nothing checks them, so close them explicitly.

Batch card (`:80`): the header slot `<phase consequence | no phase change>` becomes the literal `no phase change`. The clause at `:96` "then `; restarts implement, then verify` when a reopen lands in `verify`/`ship`, else `; no phase change`" becomes "then `; no phase change`". The example at `:146` already renders `no phase change` and is unchanged. Everything else in the aftermath (`add`, object-form re-`init`, `plan_check` until it passes, spec + plan in one commit) stays as written.

### 3. Open-task nudge after a repair wave

Owner: `extensions/phase-tracker.ts`, the `tool_result` handler for `subagent` (`:704-716`), where `observeFixWave` already runs.

- **Snapshot source.** Extract the backstop's branch scan (`:993-1006`: newest-first over `ctx.sessionManager.getBranch()`, first `plan_tracker` result with neither `isError` nor `details.error`, its `details.tasks`; both checks preserved verbatim) into a module-level helper `latestPlanSnapshot(ctx): Task[]`, and the unfinished-line formatting (`:1007-1011`) into `unfinishedTaskLines(tasks): string[]`. The backstop calls both; the nudge calls both. Every `plan_tracker` result carries the full task array (`extensions/plan-tracker.ts:128-247`), so a mid-list reopen is seen regardless of position, and the scan reads session entries, not model context, so pruning cannot hide it.
- **Condition**, all true: not a subagent child; `gauntletEntered`; `phases.verify.status === "in_progress"`; `isImplementerWave(event.details, event.isError)` (the same predicate as fix-round counting); `loadGauntletSettings(ctx.cwd)` returns no `errors` and `resolveFlowGuards(...).enforce` is true; `unfinishedTaskLines(latestPlanSnapshot(ctx))` is non-empty. Not gated on `conformanceDispatched`: a whole-diff-review repair before the audit gets the nudge too. Not during `implement`: open tasks after a wave are normal there until the wave commit. Not during `ship`: no task backstop exists there and this spec adds none; the skill text tells the main loop to close ship-phase repairs explicitly.
- **Delivery.** Hoist `addGuardWarning` from the `tool_call` handler (`:522-525`) to extension scope beside `pendingGuardWarnings` (`:384`); the `tool_result` handler calls it for `event.toolCallId` before the existing stash read at `:708`, so the nudge joins any stashed warning and rides the existing prepend at `:709-712`. Precedent for an advisory delivered this way: the closure-model mismatch warning. `observeFixWave` runs unchanged before it. Text:

  ```
  Plan tasks still open after this repair wave:
  0: <name> (in_progress)
  3: <name> (in_progress)
  Once this wave's repair is integrated and its re-review or re-audit accepts it, close that task: plan_tracker({ action: "update", index: N, status: "complete" }). Leave unaccepted repairs in_progress. A pending row is a task still to run, not to close. Open tasks block complete verify.
  ```

- **Behavior.** Advisory only: it never blocks, never changes `fixRounds`, credits, cadence, or `conformanceDispatched`, never sets phase state. Fires on every qualifying wave, not once: each wave precedes a closure point. Nothing to persist and nothing to replay in `reconstruct`.

### Guards left untouched

Lone-implementer block and fix-round cap (`:548-561`), closure-model match, `applyPlanActivity` implement auto-complete, `start implement` plan-check stamp check (`:915-931`), completion backstop semantics (same indices, same statuses, same error), `reset` behavior.

## Errors and edge cases

- No `plan_tracker` result on the branch, or the latest is a `clear` (empty array): no nudge, no backstop rejection - unchanged.
- The latest `plan_tracker` result is a rejected `update`: skipped by the scan's `details.error` check (the tool never sets `isError`), as today; the previous successful snapshot is used.
- `isError` dispatch, management-mode call, async handle (`results: []`): not an implementer wave, no nudge - same as fix-round counting.
- `flowGuards.enforce: false`: no nudge, matching the backstop it previews. `closureReview.enforce: false` does not affect it.
- Settings load degraded (`loadGauntletSettings(...).errors` non-empty - the loader never throws): the nudge is skipped for that result; no warning is added (`tool_result` has no `settingsErrorWarning` path and gains none), and `observeFixWave` keeps ignoring `errors` as today.
- A reopen during `ship` (finish-gate council-edit revert): skill text says stay in `ship` and close each task explicitly on acceptance; the nudge does not fire there; `complete ship` has no task backstop today and this spec adds none.
- The batch card no longer varies its phase slot, so the amendment-review dispatch and the `amend:` commit body need no change.

## Tests

`extensions/phase-tracker.test.ts`, mirroring the `tool_result` warning assertions at `:223-300` and the backstop fixtures at `:420-541`:

- Nudge fires: brainstorming-entered flow, verify in progress, branch holds a `plan_tracker` snapshot with index 3 of 8 `in_progress`, implementer-wave result -> result content starts with the nudge block naming `3: <name> (in_progress)`, the acceptance condition ("re-review or re-audit accepts"), the `pending` clause, and the `update` call; `fixRounds` unchanged by the nudge itself; a stashed `tool_call` warning for the same id is preserved ahead of it.
- Silent when: phase is `implement` or `ship`; snapshot has only `complete`/`skipped`; no snapshot on the branch; `flowGuards.enforce: false`; `loadGauntletSettings` reports `errors`; `isError` result; subagent child session.
- Backstop regression: existing completion-backstop tests pass unchanged against the extracted helpers.
- Skill text: `npm test` skill lint; the conformance audit verifies each edit in Design 1-2 against this spec: brainstorming SKILL.md rule sentence and `:151`; amendment-surface `:3`, section 5 opening sentence, aftermath last sentence, header slot `:80`, clause `:96`; SDD `:68` and finishing `:97` verbs.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - the phase-tracker section gains the open-task nudge next to the completion backstop it previews (operations / tunable parameters: it rides `flowGuards.enforce`); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none

Guideline: `reference/documentation-impact.md`. Skill bodies and `amendment-surface.md` are implementation surface, tracked in the plan's file list.

## Out of scope

- Sweeping every skill's reference-load wording (or the standard "Project overrides" trailer in all 20 skills) to restate the `read` rule; the rule is stated at the flow's entry and at the amendment procedure, and a follow-up can sweep if a pruned reference recurs elsewhere.
- pi-condense inferring paths from `bash` commands - a sibling-repo contract; the default `**/skills/**/*.md` protection already covers `read`.
- A dispatch guard that blocks implementer waves while tasks are open; a phase auto-flip on reopen; rejecting reopen snapshots - all considered and rejected in the questionary (harsher surface, or phase regression).
- `skills/subagent-driven-development/SKILL.md` and `conformance-check.md`: already state reopen-in-place and close-on-acceptance; no change.
- A task backstop on `complete ship`.

## Open questions

none
