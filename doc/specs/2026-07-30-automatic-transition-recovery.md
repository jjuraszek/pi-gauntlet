# Automatic Transition Recovery

## Context

A completed automatic handoff can currently end with the model narrating the next action but not invoking it. GitHub issue [#3](https://github.com/jjuraszek/pi-gauntlet/issues/3) reproduces this at two boundaries:

- `plan=complete, implement=pending`
- `verify=complete, ship=pending`

Both incidents were normal settled stops, not provider or API failures. The workflow resumed only after a user nudge. The issue and its consolidated review authorize recovery only for these reproduced boundaries.

Pi emits `agent_settled` after retries, compaction, and queued continuations are exhausted. It also persists extension custom-message details in session history and exposes the selected branch ancestry through `SessionManager.getBranch()`. Those existing APIs are sufficient for a compact one-shot nudge inside `phase-tracker`.

## Goal

When a brainstorming-entered gauntlet flow settles at either authorized automatic boundary, inject at most one branch-local continuation message for that unchanged edge, without weakening human gates or claiming that continuation succeeded.

## Non-goals

- No recovery for `brainstorm -> plan` or `implement -> verify`.
- No generalized transition engine, scheduler, timer, queue, or separate extension.
- No automatic retry if the synthetic follow-up also settles without progress.
- No direct start or completion of any destination phase.
- No phase-revision schema or new settings key.
- No guarantee that `sendMessage` starts a provider turn or that the named skill runs successfully.
- No `agent_end` fallback or minimum-host enforcement for Pi versions without `agent_settled`.
- No behavior change for workflows not entered through brainstorming.

## Architecture

Recovery remains part of `extensions/phase-tracker.ts`, which already owns phase state and reconstructs it from active session ancestry. The implementation adds only:

1. A pure helper in `extensions/lib/phase-tracker-helpers.ts` that recognizes the two exact recoverable phase tuples.
2. A two-value in-memory set of recovery edges already attempted on the active branch.
3. Reconstruction of that set from Pi `custom_message` entries.
4. One `agent_settled` handler that applies the runtime guards and sends the nudge.

The helper has the structural contract `recoverableEdge(phases: PhaseMap): RecoveryEdge | undefined`, where `RecoveryEdge` is `"plan-implement" | "verify-ship"`. It takes reconstructed phase state only, performs no I/O, rejects every map containing an `in_progress` phase, and returns no edge if both partial tuples match. It does not encode a generic graph. The event handler owns flow-entry, abort, idleness, and one-shot checks.

The installed Pi contract is:

- `AgentSettledEvent` is `{ type: "agent_settled" }` and registers through `pi.on("agent_settled", handler)`.
- `ExtensionContext.isIdle(): boolean` reports whether another run owns progress.
- `pi.sendMessage(message, { triggerTurn?: boolean; deliverAs?: "steer" | "followUp" | "nextTurn" }): void` accepts `customType`, `content`, `display`, and `details` in `message`.
- persisted recovery entries have `type: "custom_message"`, plus `customType` and optional `details`.

Registration stays inline with the extension's existing handlers:

```ts
pi.on("agent_settled", (_event, ctx) => {
  // synchronous classify, final idle check, mark, and send
});
```

The recovery message uses `customType: "pi-gauntlet-transition-recovery"`. Its details are the minimal namespaced payload:

```ts
{ piGauntletRecoveryEdge: "plan-implement" | "verify-ship" }
```

Foreign or malformed custom-message details are ignored. The message is displayed so a failed synthetic follow-up leaves the workflow visibly actionable.

## Recovery eligibility

A recovery attempt is allowed only when every condition below is true at `agent_settled` handling time:

- `gauntletEntered` is true because the active flow entered through brainstorming.
- The latest assistant message in active ancestry does not have `stopReason: "aborted"`; an explicit user interrupt never triggers recovery or spends the attempt.
- No phase has status `in_progress`.
- Exactly one current tuple matches:
  - `plan=complete` and `implement=pending`; or
  - `verify=complete` and `ship=pending`.
- The active branch's reconstructed attempt set does not contain that edge.
- `ctx.isIdle()` is true immediately before message injection.

Other phase fields may retain their reconstructed values, but if both tuples match in an out-of-order map, neither edge is recoverable. Starting the destination phase naturally removes its tuple and requires no ledger revision.

The no-`in_progress` rule explicitly protects:

- `brainstorm=in_progress` - specification review and approval;
- `implement=in_progress` - implementation work;
- `verify=in_progress` - conformance and disposition work;
- `ship=in_progress` - final squash, PR, keep, or discard choice.

## Event flow

On `agent_settled`:

1. Reject flows that did not enter through brainstorming.
2. Find the latest assistant message in active ancestry; reject an `aborted` stop without spending an attempt.
3. Ask the pure helper for a recoverable edge. The helper returns none for every active phase and for a double match.
4. Reject if no edge matches or that edge is already in the attempt set.
5. Call `ctx.isIdle()` as the final check. If false, do nothing and do not spend the attempt.
6. Add the edge to the in-memory attempt set.
7. Call `pi.sendMessage` with `triggerTurn: true`, visible display, the recovery custom type, and persisted edge details.

Steps 1-7 are synchronous and contain no `await`, so no second settlement can interleave between the final idle check and set insertion. No mutex is added.

The messages are short and name the required skill:

- `plan-implement`: `Continue the approved workflow now. Invoke /skill:subagent-driven-development.`
- `verify-ship`: `Continue the approved workflow now. Invoke /skill:finishing-a-development-branch.`

The destination skill remains responsible for all existing prerequisite checks, phase updates, verification, and human gates. Recovery is a fire-and-forget nudge only.

If `ctx.isIdle()` is false because another handler or queued action owns progress, the handler does nothing. Once `sendMessage` is attempted, the edge is spent in memory even if the synchronous call throws or no provider turn begins; there is no rollback or automatic retry. Pi's existing extension error path surfaces a thrown call. Only persisted custom-message details survive reconstruction. No stronger delivery guarantee is introduced.

## Persistence and branch behavior

`reconstructState()` clears the in-memory attempt set and scans `ctx.sessionManager.getBranch()` alongside its existing phase reconstruction. It restores an edge only when `entry.type === "custom_message"`, `entry.customType === "pi-gauntlet-transition-recovery"`, and `entry.details.piGauntletRecoveryEdge` equals one of the two edge literals. Foreign, missing, non-object, or malformed details are ignored. Existing `session_start`, `session_switch`, `session_fork`, and `session_tree` handlers complete reconstruction before subsequent settled handling; `agent_settled` uses that in-memory state and does not rescan ancestry.

This deliberately follows Pi's active-ancestry semantics:

- A descendant branch containing the recovery message inherits the spent attempt.
- Tree navigation or a fork from before the recovery message permits a fresh attempt.
- Repeated settlement, session reload, session switching, or reconstruction on unchanged ancestry does not inject a second message.

`phase_tracker reset` does not introduce special recovery-ledger behavior. A second gauntlet run on ancestry that already contains both recovery messages gets no fresh attempts at those edges; this accepted limitation is the direct consequence of branch-local one-shot persistence without a phase-revision schema.

## Prompt cleanup

The runtime nudge complements two narrow skill edits:

- `skills/writing-plans/SKILL.md`: replace `Announce the selected mode in one line (transparency), then auto-invoke /skill:subagent-driven-development in this session.` with `Auto-invoke /skill:subagent-driven-development in this session.` Preserve automatic mode selection and the no-confirmation handoff.
- `skills/subagent-driven-development/SKILL.md`: remove `You hit the end of the plan (then stop and report - see After All Tasks)` from the list of pause conditions. Immediately after that list, state `Reaching the end of the plan is not a pause: continue through verification and invoke /skill:finishing-a-development-branch as defined in After All Tasks.` Preserve all legitimate STOP conditions and the finishing menu as the human gate.

No other skill transitions or gate language changes.

## Compatibility

On Pi hosts that emit `agent_settled`, recovery is active through normal extension event registration. Older hosts store the unknown event-name handler but never emit that event, so existing workflow behavior remains unchanged. There is no `agent_end` fallback, feature detection, or runtime version check.

Recovery deliberately has no settings toggle. It is a bounded liveness correction for the two machine-owned handoffs, not a tunable policy; existing `flowGuards.enforce` and `closureReview.enforce` retain their current independent meanings.

## Testing

### Pure helper tests

Extend `extensions/lib/phase-tracker-helpers.test.ts` to cover:

- the exact `plan=complete, implement=pending` match;
- the exact `verify=complete, ship=pending` match;
- source pending, in progress, or skipped;
- destination in progress, complete, or skipped;
- unrelated phase combinations;
- each protected `in_progress` state;
- a double match and other out-of-order states returning no edge.

### Event-level extension tests

Add `extensions/phase-tracker.test.ts` for the real extension registration using a minimal fake Pi API and captured handlers. Because CI does not install Pi's runtime packages, add a test-only ESM loader at `extensions/test-support/pi-stubs.mjs` that stubs the runtime exports imported from `@earendil-works/pi-ai`, `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`, and `@sinclair/typebox`. This keeps production code unchanged and adds no dependency. It must verify:

- each authorized settled, idle edge sends exactly one custom message and requests exactly one triggered turn;
- message text names the correct skill;
- `customType`, visible display, `triggerTurn: true`, and persisted edge details are correct;
- repeated settlement at an unchanged edge sends no second message;
- reconstruction from active branch custom-message details suppresses another attempt;
- malformed or foreign custom-message details do not suppress an attempt;
- a flow not entered through brainstorming sends nothing;
- an aborted latest assistant message sends nothing and does not spend the attempt;
- every protected `in_progress` state sends nothing;
- a false final `ctx.isIdle()` sends nothing and does not spend the attempt;
- competing-handler ordering is represented by idleness changing before this handler's final check;
- a throwing `sendMessage` leaves the in-memory attempt spent and does not cause a second send.

The harness is test-local. Production code gains no test-only dependency-injection layer. `scripts/ci.mjs` adds the loader and `extensions/phase-tracker.test.ts` to its existing test execution, equivalent to:

```bash
node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/gauntlet-settings.test.ts extensions/lib/phase-tracker-helpers.test.ts extensions/phase-tracker.test.ts
```

`npm test` remains the canonical full verification command.

## Acceptance criteria

- Only `plan -> implement` and `verify -> ship` receive automatic recovery.
- Eligibility requires brainstorming entry, a non-aborted stop, no active phase, exactly one authorized tuple, an unspent branch-local edge, and a final true `ctx.isIdle()` result.
- Recovery runs from `agent_settled`, never `agent_end`.
- Each unchanged edge receives at most one persisted recovery attempt on active ancestry.
- The custom message is visible, short, names the required skill, and uses `triggerTurn: true`.
- Recovery never mutates phase state directly and never retries itself.
- Human-gate and ad-hoc-flow behavior remains unchanged.
- Prompt cleanup removes the two competing stop/narration shapes without weakening legitimate STOP conditions.
- Pure and event-level tests cover classifier behavior, message count, reconstruction, protected states, and idle ordering.
- README documents the two recovered boundaries, fire-and-forget limit, preserved gates, branch-local one-shot behavior, and older-host no-op compatibility.
- `npm test` passes.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - automatic handoff behavior and compatibility
- Derived / memory docs invalidated: none
