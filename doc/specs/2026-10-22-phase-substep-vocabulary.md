# Derived phase substeps from observed dispatches

**Goal:** The phase-tracker widget shows which flow step is running inside a phase (`brainstorm(council)`, `verify(conformance #2)`) by deriving the label from the `subagent` and `plan_check` calls the extension already observes, with no skill edits.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

## Problem

`phase_tracker({ action: "substep" })` stores a free string on the in-progress phase; the only check is that the phase is `in_progress` (`extensions/lib/phase-tracker-helpers.ts:29-32`, `extensions/phase-tracker.ts:1148-1173`). Only two values exist anywhere: `gather` (`skills/brainstorming/gatherer.md:20`) and `plan-write` (`skills/writing-plans/SKILL.md:57`). Council, spec review, plan check, implementation waves, code review, and conformance rounds leave the widget at the bare phase name, so an operator watching a long verify phase cannot tell a conformance re-audit from a fix wave.

The ask as originally framed - explicit `substep` calls in every skill plus a per-phase allowlist - was pivoted. `Framing: pivoted to derived substeps` - the extension already hooks `tool_call`/`tool_result` for `subagent` and classifies dispatches by agent name (`isImplementerWave` and the conformance latch, `extensions/phase-tracker.ts:88-110`; `collectAgents`, `:213`), and every step the ask names is backed by a distinct dispatched persona or by the `plan_check` tool. Deriving the label from that observation keeps one owner, touches no skill (so no eval work), and closes the vocabulary by construction instead of validating it.

Premises the design rests on, all verified against the worktree: telemetry ignores substep transitions (`diffPhases` returns `[]` for the `substep` action, `extensions/lib/telemetry-record.ts:15-19`), so "visibility" today is the widget and the resume brief only; the only round state is conformance `fixRounds`/`fixRoundCredits`, counted from implementer waves and rebuilt on replay (`extensions/phase-tracker.ts:425-442, 511-547`); the resume brief renders `name(substep)` on the in-progress phase and replays `substep` "if the brief shows one" (`skills/gauntlet-resume/reference/brief-contract.md:84, 131-134`). The scout flagged `eval/verification-before-completion` as missing; the pivot edits no skill behavior, so no eval target is needed.

## Acceptance criteria

none - no ticket

## Design

### Owner and scope

`extensions/phase-tracker.ts` and `extensions/lib/phase-tracker-helpers.ts` are the only code surfaces. The explicit `substep` action keeps its schema and behavior; its two callers (`gather`, `plan-write`) are untouched. No settings key is added.

### Label vocabulary

A const `DISPATCH_LABELS` in `phase-tracker-helpers.ts` maps what the hook observes to a label:

| observed | label |
|---|---|
| `subagent` agent `scout` or `context-builder` | `gather` |
| `subagent` agent with prefix `spec-council-` | `council` |
| `subagent` agent `spec-reviewer` | `spec-review` |
| `subagent` agent `plan-writer` | `plan-write` |
| `plan_check` tool call | `plan-check` |
| `subagent` agent `implementer` | `implement` |
| `subagent` agent `code-reviewer` | `code-review` |
| `subagent` agent `conformance-reviewer` | `conformance` |
| `subagent` chain whose agents include both `implementer` and `spec-reviewer` | `implement+sr` |

A pure helper `dispatchLabel(toolName, input)` returns the label or `undefined`. For a `subagent` call it considers only execution mode (no `action` field). It walks the dispatch shape through a new helper `dispatchAgents(input): string[]` in `phase-tracker-helpers.ts` that returns every `agent` name in input order (`input.agent`, then `tasks[]`, `chain[]`, and `chain[].parallel[]` recursively, the same shape walk as `collectAgents` in `phase-tracker.ts:213`, which filters by one name and stays where it is). Precedence: when the name list contains both `implementer` and `spec-reviewer`, the label is `implement+sr` - this is the shipped implementation wave, one chain of an implementer `parallel` step followed by a spec-reviewer `parallel` step (`skills/subagent-driven-development/SKILL.md:238-266`), and a first-agent rule would label the whole span `implement` and hide its SR half. Otherwise the label is that of the first mapped name in order. Any other agent (`worker`, `spec-summarizer`, ad-hoc names) and any management action yield `undefined`. No within-chain progress tracking: `implement+sr` is one static label for the whole call.

### Data flow

On `tool_call` in the parent session (the existing `isSubagentChild` guard applies) for `subagent` or `plan_check`, after every blocking guard in the hook has returned without `{ block: true }` (the closure-review guards at `extensions/phase-tracker.ts:624-657` run first; a blocked call is never labeled or counted):

1. `label = dispatchLabel(...)`; if `undefined`, do nothing.
2. Find the single phase whose status is `in_progress`; if none, do nothing.
3. Set `phases[phase].substep = label`, increment `dispatchCounts[phase][label]`, record `liveDispatch = { toolCallId: event.toolCallId, phase, label }` (single slot, last dispatch wins; an older live dispatch is forgotten, never restored), and call `updateWidget(ctx)`.

The widget is a cached component: `updateWidget` (`extensions/phase-tracker.ts:569`) hands `setWidget` a factory that bakes `formatWidget(phases)` into a `Text` once, so mutating `phases` alone repaints nothing. Every derived assignment and every derived clear below ends with `updateWidget(ctx)`, the same call each `phase_tracker` action makes (`:1044, :1107, :1139, :1165`).

Terminal cleanup is keyed by id. On `tool_result` and on `tool_execution_end` for `subagent` or `plan_check`: if `liveDispatch` is set and `liveDispatch.toolCallId === event.toolCallId`, then clear `phases[liveDispatch.phase].substep` when it still equals `liveDispatch.label`, clear `liveDispatch`, and call `updateWidget(ctx)`. A result whose id does not match the slot is a no-op, so a stale result from an older overlapping dispatch cannot clear a newer label of the same name. Two hooks cover the two exit paths pi has: a blocked or rejected call gets an immediate error result and fires `tool_execution_end` without `tool_result` (`pi-agent-core/dist/agent-loop.js`, `prepareToolCall` -> `kind: "immediate"`), a normal or errored call fires both. The second hook finds the slot already empty and does nothing, so no double clear; the count moved at `tool_call`, so no double count. An errored dispatch takes the same path and never leaves a label. A terminal result that is `isError` with empty `details` (the `createErrorToolResult` shape, produced alike by a blocked, rejected, or thrown call) is a non-dispatch: the id-matched clear also decrements `dispatchCounts[phase][label]` by one, so a dispatch that produced no `results` leaves no ordinal behind. No runtime discriminator separates a blocked call from a thrown one, and none is needed - both are un-counted by the same predicate.

The explicit `substep` action writes the same field; the last writer wins. For the two existing callers the dispatch returns before the skill clears, so the sequence is set -> (derived set) -> (derived clear) -> explicit clear of an empty field, and `checkSubstep` still passes because the phase is `in_progress`. The pre-dispatch explicit label is not restored on completion (the chosen lifetime: set at `tool_call`, clear at terminal event).

A phase transition (`start`, `complete`, `skip`) drops `substep` as today and also clears `liveDispatch` when `liveDispatch.phase` is the transitioned phase, so a result arriving after its phase closed or restarted writes nothing; a transition of a different phase leaves the slot alone, and the dispatch's own terminal result clears its label. `reset` always clears `liveDispatch`. `applyPlanActivity` (`extensions/phase-tracker.ts:489-499`) completes `implement` from `plan_tracker` without any `phase_tracker` action; it clears `liveDispatch` too (live, from `tool_execution_end`), so a dispatch result arriving after the auto-complete cannot touch the next phase.

### Rendering

`phaseLabel(phase, substep, count?)` renders `name(substep)` when `count` is absent or `< 2` and `name(substep #count)` otherwise. Only `formatWidget` passes `count = dispatchCounts[phase][substep] ?? 0`; the `status` action and every `phase_tracker` tool-result render keep calling `phaseLabel(phase, substep)` and show the raw label, so the resume brief (built from `status`) carries `name(substep)` with no suffix and `skills/gauntlet-resume/reference/brief-contract.md` needs no edit. The `#n` suffix is widget-only. An explicitly set label with no derived count renders without a suffix. `#n` is the per-phase per-label dispatch ordinal ("the n-th `conformance-reviewer` dispatch in this `verify`"), not the conformance fix-round number; `fixRounds` stays the only round counter with meaning.

### State and replay

`dispatchCounts: Record<Phase, Record<string, number>>` and `liveDispatch` are module state beside `fixRounds`. Both reset on `reset`; `start` of a phase resets that phase's counts and clears `liveDispatch` only when that phase owns it.

`reconstructState` (`extensions/phase-tracker.ts:504-567`) rebuilds no dispatch state: `dispatchCounts` starts empty and `liveDispatch` unset after every reconstruction, so ordinals restart at the next dispatch after a reload. It also never restores a derived label. The walk keeps `phases = details.phases` from each `phase_tracker` result as today and additionally tracks `explicitSubstep: Partial<Record<Phase, string>>` from the same results: a successful `substep` action (`details.action === "substep"`) sets `explicitSubstep[phase]` to `details.phases[phase].substep` (absent when cleared); a successful `start`, `complete`, or `skip` of a phase, and a `plan_tracker` result whose `applyPlanActivity` auto-completes `implement`, deletes that phase's entry; `reset` empties the map. After the walk, every phase's `substep` is replaced, copy-on-write, by its `explicitSubstep` entry or removed when there is none. A derived label captured incidentally by a snapshot (a `status` call during a dispatch) is therefore dropped, and an explicit `gather` or `plan-write` set by its skill survives. No assistant `toolCall` blocks are read and no per-call map exists.

Live and replay ordinals agree only within one uninterrupted session; after a reload the widget's next `#n` counts from the reload. `dispatchCounts` is display-only; `fixRounds` keeps every enforcement role.

### Telemetry

Unchanged. `diffPhases` keeps returning `[]` for substep changes; per-subphase durations are a named follow-up, not part of this spec.

## Errors and edge cases

- The derivation raises nothing, blocks nothing, and returns no tool error. Unknown agent, management action, no in-progress phase, or a `tool_result` with no live dispatch: no-op.
- Nested dispatches: hooks run only in the parent session, so a child dispatching its own subagents never relabels.
- Parallel `tasks` with mixed agents: first mapped agent wins (gather's scout + context-builder batch reads `gather`). A batch with no mapped agent is unlabeled.
- Whole-diff code review repairs dispatch `implementer` (`skills/requesting-code-review/SKILL.md:54`), as do conformance fix waves (`skills/verification-before-completion/reference/conformance-check.md:149, 197`), so a repair shows `verify(implement)`.
- Task reopening through `plan_tracker` (a conformance gap reopening a task) is not a dispatch and leaves the label alone; the repair dispatch that follows shows `verify(implement)`.
- Two repair paths, each suffix set by the prior dispatches of that label in the phase. Pre-conformance whole-diff CR repair (conformance starts with the full-diff CR): `verify(code-review)` -> `verify(implement)` -> `verify(code-review #2)` -> `verify(conformance)`. Conformance fix with convergence CR: `verify(conformance)` -> `verify(implement)` -> `verify(conformance #2)` -> `verify(code-review)` (or `#2`/`#3` when a CR already ran in this `verify`).
- The shipped implementation wave (implementer step then spec-reviewer step in one chain) shows `implement(implement+sr)`; the separate CR call after integration shows `implement(code-review)`. A lone `implementer` or `spec-reviewer` dispatch (`skills/subagent-driven-development/SKILL.md:129-135`) shows `implement` / `spec-review`.
- Overlapping same-label dispatches (an `async: true` dispatch still running when a second one starts): the slot holds the newer id; the older result is a no-op and the newer result clears. No restoration of the older dispatch.
- A blocked dispatch (lone-implementer or fix-round-cap block) is neither labeled nor counted. An executed dispatch whose result is `isError` with empty `details` shows its label while running and is un-counted at its terminal event.
- `plan_check` replayed by resume outside the plan phase: labels whichever phase is `in_progress`, or no-op when none is.
- Session dies mid-dispatch: reconstruction ignores the dispatch and restores only explicit labels, so the resume brief never inherits an unfinished derived label and keeps a persisted explicit one. Ordinals restart after the reload.
- Explicit `substep` call while a derived dispatch is live: overwrites, no error.

## Tests

`extensions/lib/phase-tracker-helpers.test.ts`:
- `dispatchAgents` returns agent names in input order for the single, `tasks`, `chain`, and `chain[].parallel[]` shapes.
- `dispatchLabel` returns the table's label for each row, honors the `spec-council-` prefix, picks the first mapped agent in a parallel batch, returns `implement+sr` for the shipped two-step chain shape (implementer `parallel` step then spec-reviewer `parallel` step), and returns `undefined` for `worker`, a management action, and a non-`subagent`/`plan_check` tool.
- `phaseLabel` renders `verify(conformance)` with no count, at count 0, and at count 1, and `verify(conformance #2)` at count 2.

`extensions/phase-tracker.test.ts` (with `hasUI: true`, asserting the captured widget text, not only `status` output):
- A `subagent` tool_call for `conformance-reviewer` during `verify` renders `verify(conformance)` in the widget; its tool_result clears it and repaints.
- A second `conformance-reviewer` dispatch in the same phase renders `verify(conformance #2)`; `start` of a new phase resets the count. `status` output for the same state shows `verify(conformance)` with no suffix.
- A `plan_check` tool_call during `plan` sets `plan(plan-check)`.
- A `worker` dispatch leaves the label untouched.
- A dispatch the closure guard blocks (lone `implementer` in the fix-loop window) sets no label and no count; its `tool_execution_end` is a no-op.
- A `tool_result` with an unrelated `toolCallId` leaves a live label; two overlapping same-label dispatches whose results arrive out of order leave the label set after the older result and cleared after the newer one, with a count of 2.
- `tool_result` followed by `tool_execution_end` for the same id clears once and counts once.
- A dispatch whose `tool_result` is `isError` with empty `details` ends with the label cleared and the count back at its pre-dispatch value.
- `applyPlanActivity` auto-completing `implement` while a dispatch is live drops the slot; the later result does not touch the next phase's label.
- An explicit `substep` call while a derived label is live succeeds and overwrites.
- Reconstruction: a `status` snapshot taken during a dispatch ends with an empty label; an explicit `gather` snapshot followed by an unfinished scout dispatch ends with `gather`; an explicit label cleared by its `substep: null` call stays cleared; a `start`/`complete`/`skip` of a phase drops that phase's explicit label; after any reconstruction the next labeled dispatch renders without `#n` (counts empty).

All run under `npm test` via `scripts/ci.mjs:435-437`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` `### phase-tracker` substep paragraph - the derived-label table and the widget-only `#n` display rule (operations / tunable parameters: tells an operator what the widget label means without reading the hook); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none - `status` output and the resume brief keep rendering `name(substep)` unchanged, so `skills/gauntlet-resume/reference/brief-contract.md` stays as is.

Bar: `reference/documentation-impact.md`.

## Out of scope

- Validation or rejection of explicit `substep` values.
- Renaming `plan-write` or `gather`.
- Telemetry events, `gauntlet-performance` reporting, or seal changes for substeps.
- Mapping `worker` or any ad-hoc agent.
- Within-chain progress (which step of a chain is running).
- Restoring an older or pre-dispatch label after a dispatch ends.
- Rebuilding dispatch ordinals across a session reload.
- Any skill, persona, or eval edit.

## Open questions

none
