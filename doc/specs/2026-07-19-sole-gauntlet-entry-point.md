# Brainstorming as the sole gauntlet entry point

**Issue:** jjuraszek/pi-gauntlet#2
**Status:** spec (awaiting approval)

## Problem

The phase-tracker enforcement surfaces bind to *phase state*, not to *flow entry*. An
agent that reflexively drives `phase_tracker start verify` on a one-line fix - without ever
entering brainstorming - trips the closure gate on `complete verify`, is forced into a
spurious `conformance-reviewer` dispatch, and gets blocked on work the gauntlet was never
meant to govern. The incident in #2 is exactly this: enforcement leaked onto ad-hoc work.

The gauntlet is opt-in by design. Enforcement must be dormant unless the flow was **entered
through brainstorming**, and fully live once it was.

## Goal

Introduce one flow-scoped fact - "did brainstorming start this flow?" - and gate every
enforcement surface on it. No enforcement outside a brainstorming-entered flow; unchanged
enforcement inside one. Phase *tracking* (the widget, the `start`/`complete` calls in
downstream skills) is untouched; only *enforcement* becomes conditional.

## Approach

Derive a `gauntletEntered` marker in `reconstructState` - the exact mechanism the existing
`conformanceDispatched` marker already uses - and gate the three enforcement surfaces on it.
No new session plumbing: the marker is replayed from the durable session branch, so it
survives pi-condense pruning and session fork/switch.

The only viable alternative, caller-provenance detection ("is a skill calling me?"), was
killed in the issue roast: a tool cannot observe its caller. The single observable fact -
brainstorm started this flow - is sufficient and already reconstructable.

### 1. Marker derivation (pure helper)

New exported helper in `extensions/lib/phase-tracker-helpers.ts`:

```ts
// prev = running marker; action = phase_tracker action;
// brainstormStatus = phases.brainstorm.status AFTER the action is applied
export function nextGauntletEntered(prev: boolean, action: string, brainstormStatus: string): boolean {
  if (action === "reset") return false;
  if (action === "start" && brainstormStatus === "in_progress") return true;
  return prev;
}
```

Rationale for the two conditions:

- `action === "start"` with `brainstorm.status === "in_progress"` uniquely identifies a
  `start brainstorm`: exactly one phase is `in_progress` at a time, and the `start` target
  is not stored in `PhaseTrackerDetails`, but is inferable from which phase is now active.
- `reset -> false` implements the decided reset semantics (Q1): a `reset` disarms; only a
  subsequent `start brainstorm` re-arms. Brainstorming's own `reset -> start brainstorm`
  entry ends armed (start runs after reset); a bare `reset` with no following
  `start brainstorm` is an abandon/restart and leaves the flow dormant, matching the
  incident's intent.
- Any other action (`start plan`, `start implement`, `complete`, `skip`, `substep`) returns
  `prev` unchanged, so the marker set at brainstorm entry survives the whole flow to
  `complete verify`.

Errored `phase_tracker` results never reach this helper: the existing `!details.error`
guard in `reconstructState` skips them, so a blocked/errored `start brainstorm` never arms.

### 2. Wiring (extension)

Add a module-level `let gauntletEntered = false;` beside `conformanceDispatched`. Maintain
it in the two places `conformanceDispatched` is already maintained, routing **both** through
the single `nextGauntletEntered` transition function so there is no hand-mirrored copy of
the arming logic:

- **`reconstructState` replay loop:** in the non-error `phase_tracker` branch, thread
  `gauntletEntered = nextGauntletEntered(gauntletEntered, details.action, details.phases.brainstorm.status)`.
  Initialize to `false` at the top of the reconstruction with the other reset state.
- **Live `phase_tracker` tool handler:** call the **same** `nextGauntletEntered` on the
  **success path only** (beside the `phases = ...` mutation, after the action has been
  applied and its error branches - already-complete/skipped without `force`, another phase
  in_progress - have returned). This mirrors the replay path's `!details.error` guard: a
  blocked `start` must not arm the marker. Do not set the flag at case entry.

Bind the three enforcement surfaces to the marker, with `gauntletEntered` as the **first
conjunct** so a dormant (out-of-flow) session short-circuits before any settings load:

1. **Closure completion gate** (`complete verify`): make `gauntletEntered` the leading
   conjunct, *before* the `resolveClosureReview(...)` read -
   `params.phase === "verify" && gauntletEntered && closureReview.enforce && !conformanceDispatched`.
   This is the incident fix - a cold-session `start verify` leaves the marker dormant and
   the gate never arms; ordering it first also means the dormant session never pays the
   settings read.
2. **Closure-model guard** (`subagent` dispatch of `conformance-reviewer`): make
   `gauntletEntered` the leading conjunct, *before* `closureEnforced()` -
   `event.toolName === "subagent" && gauntletEntered && closureEnforced()` (Q2). Ordering
   matters beyond cost: `closureEnforced()` calls `loadGauntletSettings()`, which can enqueue
   a `settingsErrorWarning(...)` that `tool_result` would prepend to an **ad-hoc** subagent
   result even though the guard is meant to be dormant out-of-flow. Marker-first keeps the
   out-of-flow path from touching settings at all.
3. **Flow guards** (cheap in-memory gate in the `tool_call` handler): fold `&& gauntletEntered`
   into both `guardableWrite` and `guardableBash`, preserving the existing "cheap in-memory
   gate before settings load" invariant. Kills the real creep vector - a reflexive
   `start implement` with no brainstorm would otherwise arm the branch-op-in-place guard.

Consistency: `brainstormActive` always implies `gauntletEntered` (the same `start brainstorm`
result sets both `brainstorm.status = in_progress` and arms the marker), so the in-flow
spec-confinement and marker-commit guards behave identically inside a flow. The marker only
*subtracts* enforcement from out-of-flow sessions; it never adds any.

### 3. Test surface

The extension file imports the pi runtime and cannot be imported under `node --test`
(`scripts/ci.mjs` registers only `extensions/lib/*.test.ts`). Coverage therefore lives on
pure helpers, and to make the enforcement decisions themselves testable (not just the marker
transition) the three gate-enable checks are extracted as pure predicates in
`extensions/lib/phase-tracker-helpers.ts` alongside the existing `markerGuardApplies`, e.g.:

```ts
export function closureGateBlocks(phase: string, enforce: boolean, conformanceDispatched: boolean, gauntletEntered: boolean): boolean;
export function closureModelGuardApplies(gauntletEntered: boolean, closureEnforced: boolean): boolean;
export function flowGuardApplies(phaseActive: boolean, gauntletEntered: boolean): boolean;
```

The extension consumes each predicate so a unit test proves the exact enforcement contract
the acceptance criteria assert: cold `start verify` -> `complete verify` does not block
(`closureGateBlocks(... gauntletEntered=false) === false`); in-flow it still blocks;
out-of-flow implement does not arm the flow guard; in/out-of-flow closure-model dispatch
(`closureModelGuardApplies`). `flowGuardApplies` is **called** directly (both its inputs are
in-memory booleans). The two settings-dependent surfaces - the closure completion gate
(`closureGateBlocks`) and the closure-model guard (`closureModelGuardApplies`) - are
**inline-matched** rather than called: their predicate is defined and tested here, and the
extension repeats the identical conjunct sequence at the call site with a `gating contract:`
cross-ref comment (the pre-existing `markerGuardApplies` convention). This is deliberate -
calling them would force eager evaluation of the `closureEnforced()` / `resolveClosureReview`
settings read, violating the marker-first "dormant session never pays the settings read"
mandate in section 2. This closes the gap that testing only `nextGauntletEntered` would leave

- the marker transition and all three enforcement decisions are covered, and marker-first
ordering keeps the dormant branch free of any settings read.

Append cases to `extensions/lib/phase-tracker-helpers.test.ts` (existing `node:test` +
`assert/strict` conventions). For `nextGauntletEntered`, cover the full state table:

| prev | action | brainstormStatus | expected |
| --- | --- | --- | --- |
| false | start | in_progress | true (arm at brainstorm entry) |
| true | reset | (any) | false (Q1 disarm) |
| false | reset | (any) | false |
| true | start | in_progress | true (re-arm, idempotent) |
| true | start | complete (start plan/impl) | true (survives downstream starts) |
| true | complete | complete | true (survives complete) |
| false | start | complete | false (a non-brainstorm start never arms) |
| false | start | skipped | false (non-brainstorm start never arms) |

The last two rows are the crux: the helper arms **only** when brainstorm goes `in_progress`,
so a cold-session `start verify`/`start implement` stays `false`. The extracted enable
predicates get their own cases (entered vs not-entered x each surface). No new test file, no
CI wiring change (`scripts/ci.mjs` already runs the helper test); `npm test` stays green.

## Data flow

`session_start|switch|fork|tree` -> `reconstructState` replays `sessionManager.getBranch()`
(the durable branch, not the pi-condense window) -> per non-error `phase_tracker` result,
`nextGauntletEntered` updates the running marker alongside `phases` and `conformanceDispatched`
-> module-level `gauntletEntered` holds the reconstructed value. Live `phase_tracker` calls
update it inline. Every enforcement decision reads the module-level marker.

## Error handling and edge cases

- **Cold session `start verify`** (the incident): brainstorm never `in_progress` ->
  `gauntletEntered = false` -> closure gate dormant, no forced conformance dispatch.
- **Reflexive `start implement`** with no brainstorm: marker dormant -> flow guards dormant.
- **Abandon + restart** (`reset` mid-flow): disarms; a fresh `start brainstorm` re-arms.
- **Errored/blocked `start brainstorm`**: `!details.error` guard skips it -> never arms.
- **pi-condense pruning / session fork**: `reconstructState` replays the full session branch;
  same durability as `conformanceDispatched`.
- **Resumed flow in a fresh session** (DECIDED - accept per-session semantics): the marker is
  reconstructed from the session branch, exactly like `conformanceDispatched`. A brand-new
  session that has no `start brainstorm` in its branch reconstructs `gauntletEntered = false`
  - but such a session also reconstructs **all phases pending**, so it cannot reach
  `complete verify` in a meaningful flow state without re-running the phase sequence anyway.
  We accept this and do not add a durable cross-session marker: a worktree-side marker file
  reintroduces the second lifecycle the design deliberately avoided (see Q1), and the
  realistic path auto-chains brainstorm -> plan -> implement -> verify in one session. Note
  the asymmetry vs `conformanceDispatched`: on session loss that marker fails *closed*
  (re-demands a dispatch) whereas `gauntletEntered` fails *open* (enforcement silently off).
  Surfaced at the user gate for ratification.
- **Ad-hoc conformance-reviewer dispatch** outside a flow: closure-model guard dormant (Q2).
- **In-flow enforcement**: `complete verify` still blocks until a `conformance-reviewer`
  dispatch is observed; all three flow guards fire during their phases. Unchanged.

## Testing approach

Unit tests on `nextGauntletEntered` (table above) are the enforcement contract: entered flow
arms; non-entered flow stays dormant; `reset` disarms and re-arm works. The extension wiring
is a mechanical read of the marker, exercised end-to-end by the implementation itself riding
the gauntlet (AGENTS.md change-process mandate).

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (the "opinionated" paragraph ~line 69; **plus**
  README.md:42 "This gate is machine-blocked from being skipped" and the README.md:75
  key-concepts Gate row "`complete verify` is blocked until conformance review has run. Not a
  suggestion." - both assert *unconditional* blocking that the change makes conditional);
  `doc/configuration.md` (closure-review gate line 59, flow guards line 61, and the
  closure-model guard note lines 17-21 - all gain the brainstorming-entered condition);
  `AGENTS.md:88` ("the phase-tracker guard blocks a dispatch that omits `model:`") and
  `skills/verification-before-completion/reference/conformance-check.md:172-174` ("The
  phase-tracker closure guard blocks a dispatch that omits `model:`...") - both gain the
  "inside a brainstorming-entered flow" qualifier; `phase_tracker` tool description in
  `extensions/phase-tracker.ts`
- Derived / memory docs invalidated: none - `AGENTS.md:110` ("the runtime flow-guards enforce
  this once a gauntlet run is entered, but they cannot force entry in the first place")
  already matches the new model; the change makes that sentence true rather than aspirational

Edit detail:

- **`README.md`** opinionated paragraph: current text asserts *"There's no separate 'just
  edit a file and commit' path... Reach for a shortcut and a gate stops you."* Reword so gates
  fire **inside a brainstorming-entered flow**; a change made without entering the flow is not
  gated - reconciling with the adjacent "When NOT to use" section, which already tells users
  not to gauntlet one-liners/typos/spikes.
- **`doc/configuration.md`**: the closure-review gate paragraph gains "and only inside a
  brainstorming-entered flow" beside the existing "since the last `reset`" clause; the flow
  guards preamble gains the same condition (all three already key off phase `in_progress`);
  the closure-model guard note (lines 17-21) gains it too, so "Disabling `closureReview.enforce`
  disables this guard" extends to "outside a brainstorming-entered flow it is also dormant".
- **`phase_tracker` tool description**: add a one-line carve mirroring `gauntlet_setting`'s
  "Not for ad-hoc use" - the tracker drives gauntlet-flow enforcement entered via
  brainstorming; ad-hoc `start verify`/`start implement` calls do not arm the gates.
- **`README.md:42` / `README.md:75`**: qualify the unconditional "machine-blocked" / "Not a
  suggestion" claims about the conformance gate with "inside a brainstorming-entered flow".
- **`AGENTS.md:88` and `conformance-check.md:172-174`**: qualify the closure-model guard's
  "blocks a dispatch that omits `model:`" statements with the same in-flow condition (the
  guard is now dormant for ad-hoc, out-of-flow conformance dispatches per Q2).

## Out of scope

- Caller-provenance detection (roast-killed: a tool cannot see its caller).
- Forcing flow *entry* - runtime cannot compel it; that is the AGENTS.md prose mandate's job.
- Any change to `conformanceDispatched`, the marker-commit guard, or `verify-before-ship`.
- A durable cross-session flow marker: cross-session enforcement is bounded to whatever the
  existing `conformanceDispatched` replay already provides (see the resumed-flow edge case);
  strengthening it is a separate change.
- Skill *SKILL.md body* edits: the docs the change falsifies are all descriptive prose in
  `README.md`, `AGENTS.md`, `doc/configuration.md`, and one skill **reference** doc
  (`conformance-check.md`), all listed under Documentation impact. No skill's runtime
  methodology (the SKILL.md body a skill executes) changes.

## Acceptance criteria (from issue #2)

- Outside a brainstorming-entered flow, `start verify` + `complete verify` does not block and
  forces no conformance dispatch (the incident).
- Inside a brainstorming-entered flow, `complete verify` still blocks until a
  `conformance-reviewer` dispatch is observed (no regression).
- Flow guards bind only inside a brainstorming-entered flow.
- brainstorming is the only skill that arms the flow; verify/implement/tdd/sdd/finishing do
  not enter it standalone.
- `extensions/lib/*.test.ts` covers: entered flow enforces, non-entered flow does not, marker
  persistence/disarm across `reset`.
- `README.md` reworded (opinionated paragraph + the two unconditional-blocking claims at
  README.md:42 and :75); `phase_tracker` tool description updated; the closure-model guard
  statements in `AGENTS.md:88` and `conformance-check.md:172-174` qualified with the in-flow
  condition; new marker behavior documented under `closureReview.enforce` / `flowGuards.enforce`.
- Implementation rides the gauntlet (AGENTS.md:110 change-process mandate).
