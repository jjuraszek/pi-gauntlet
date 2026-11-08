# Block scripted `subagent` dispatch in an entered flow and document codemode mode support

**Goal:** Refuse a `subagent` dispatch made from inside a codemode script while a gauntlet flow is entered, keep nested results out of replay-mirrored state, and state in `doc/configuration.md` which codemode modes a flow supports and how to read the literal dispatch examples in skills.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Tickets:** jjuraszek/pi-gauntlet#132, jjuraszek/pi-gauntlet#134 (one spec, one PR, both closed together)

## Problem

`reconstructState` (`extensions/phase-tracker.ts:538-612`) rebuilds the closure-review latch (`conformanceDispatched`), the fix-round counter, and the implementer/reviewer cadence by replaying top-level `subagent` `toolResult` messages on `ctx.sessionManager.getBranch()`, plus the `pi-gauntlet-transition-recovery` `custom_message`. A `subagent` call made from inside a codemode script runs through the live `tool_call`/`tool_result` hooks with `parentToolCallId` set (`pi dist/core/agent-session.js:339-428`, `dist/core/nested-tool-calls.js:92-164`), so the live hooks advance those counters, but the call persists only as bounded metadata in the parent codemode result's `nestedCalls` (`nested-tool-calls.js:12-71`, no result `details`). A `/reload` or fork therefore resets the cap and latch: with a cap of 2, a script-wrapped conformance review and two script-wrapped fix dispatches replay as nothing, and a third fix round passes the guard that should block it. Both tickets derive this from source (`scenario: none`); no live session was captured.

Codemode `only` mode hides every direct declaration that a script can call (`pi dist/extensions/codemode/tool.js:234-266`), keeping only `exposure: "model-only"` tools, `codemode`, and `tool_search`. pi-cohort registers `subagent` without an exposure override (`node_modules/pi-cohort/src/extension/index.ts:470-472`), so under `only` every dispatch is nested. Nothing in the gauntlet docs says whether a flow works under `only`, and the skills spell dispatch as a literal `subagent({...})` call without saying whether that is syntax or illustration.

Corrected premises carried from the questionary:

- #134 says "which gauntlet tools stay direct": only `phase_tracker`, `plan_check`, and `plan_tracker` are model-only (`extensions/phase-tracker.ts:936,1092`, `extensions/plan-tracker.ts:240`). `gauntlet_setting` has pi's default direct exposure (`extensions/phase-tracker.ts:899-928`), so `only` hides it and a script reaches it as `tools.gauntlet_setting()`.
- #132 says "from the existing flow-scoped guard": the existing closure guard gates on `gauntletEntered && closureReview.enforce` (`extensions/phase-tracker.ts:662-723`), not flow entry alone. Design names that gate (user decision below).
- #132 AC3 names "the nested error `tool_result` of that blocked call": a blocked `beforeToolCall` short-circuits before `afterToolCall` (`pi-agent-core/dist/agent-loop.js:501-526`), so pi emits no `tool_result` for a blocked call (`tool_execution_end` still fires). The row is kept in-scope as the hook invariant in Design: a nested result that does reach the hook never moves replay-mirrored state.

Framing: kept (ticket #132). The reachable root-cause alternative - record each qualifying nested result through `pi.appendEntry` (a `custom` entry, synchronous, parent = current leaf, appended before the parent codemode result; `dist/core/session-manager.js:815-831,913-925`, `dist/core/agent-session.js:725-733`) and extend `reconstructState` with a `custom` branch - was presented and rejected by the user in favor of the block. It stays recorded here so it is not re-litigated: it would make `only` supported at the cost of a persistence, failure-mode, and concurrency contract (concurrent nested completions land in completion order), and it cannot repair sessions recorded before the change either.

Implicit dependencies: a live reload/fork repro is not checkable without a configured session, so every behavior claim is source-derived and the tests are hook unit tests; sessions recorded before this change hold nested results only in `nestedCalls`, which no approach reads, so this change prevents new corruption and repairs no history. The pi codemode doc link resolves (verified via the GitHub contents API).

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#132 and jjuraszek/pi-gauntlet#134, checkbox list, rows verbatim:

- [ ] Given a gauntlet flow entered with the closure-review latch on, the fix-round counter at the configured cap, and a non-default implementer/reviewer cadence, a `subagent` `tool_call` event carrying `parentToolCallId` is answered with `{ block: true, reason }`, the reason tells the model to call `subagent` directly and says codemode `only` mode is unsupported while a flow is entered, and the latch, counter, and cadence are unchanged after the call (unit test over the hook).
  in-scope
- [ ] The same `subagent` `tool_call` event with no flow entered is not blocked (unit test over the hook).
  in-scope
- [ ] Given the same entered-flow setup, the nested error `tool_result` of that blocked call (carrying `parentToolCallId`) leaves the latch, counter, and cadence unchanged (unit test over the hook).
  in-scope
- [ ] `doc/configuration.md`'s codemode paragraph (the one explaining the three model-only tools) states that `subagent` dispatch inside a gauntlet flow is direct-only and that codemode `only` mode is unsupported while a flow is entered, matching the block reason's meaning.
  in-scope
- [ ] `doc/configuration.md`'s codemode paragraph states, for each of codemode `on` and `only`, whether an entered gauntlet flow is supported, with the reason (which gauntlet tools stay direct and how dispatch is invoked in that mode), and links pi's codemode documentation.
  in-scope
- [ ] The same paragraph states how a reader interprets the literal `subagent({...})` call examples in skills under each supported mode.
  in-scope

Readings recorded as Design clauses (row text unchanged): AC 3's "nested error `tool_result` of that blocked call" is tested by feeding the `tool_result` hook a synthetic nested `subagent` error result carrying `parentToolCallId`, because the runtime emits no result event for a blocked call. AC 5's "which gauntlet tools stay direct" is answered with the three model-only trackers; `gauntlet_setting` is named as script-only under `only`.

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-132-scripted-dispatch-guard
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (full `scripts/ci.mjs`); focused: `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`; run against the worktree
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6
design: owns `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts`, `doc/configuration.md`, `CHANGELOG.md`; observable outcomes are the six rows above.

## Design

Approach: block in the existing closure guard family (reuse-only; axis refuse-vs-warn; the advisory variant was rejected because AC 1 says block).

### `extensions/phase-tracker.ts`

Remove: none.

Add: `nestedDispatchBlockReason()` beside `fixRoundCapBlockReason` (`:252`). The reason text: call `subagent` as a direct tool call, not from inside a codemode script; codemode `only` mode is unsupported while a gauntlet flow is entered, because a scripted dispatch's result is not replayed on reload or fork and the fix-round counter, closure-review latch, and cadence would reset. Both halves are required: AC 1 checks the "call directly" and "`only` unsupported" meanings, and AC 4 says the paragraph matches the reason. The reason also names the way through, like its siblings (`loneImplementerBlockReason` `:240-243`, `fixRoundCapBlockReason` `:252-259`): under `only` the direct declaration is hidden (`codemode/tool.js:261-264`), so the text says to switch `codemode.mode` to `on` and issue the call directly, and names the last-resort switch `piGauntlet.closureReview.enforce: false` (disables all closure guards).

Add: in the `tool_call` hook, inside the existing `event.toolName === "subagent" && gauntletEntered && closureEnforced()` block (`:682`), directly after `hasAction` is computed and before `fixLoopWindow`, `observeDispatch`, and the cap/lone-implementer/model checks:

```ts
if (event.parentToolCallId && !hasAction) {
  return { block: true, reason: nestedDispatchBlockReason() };
}
```

Placement before `fixLoopWindow` makes the block apply in every entered phase, not only verify, because the R0 conformance dispatch and implementer waves set the latch and cadence outside verify too. Placement before `observeDispatch` (`:720`) means a blocked call never registers a dispatch, so `liveDispatch` (`:432`), `dispatchCounts`, and the phase `substep` stay accurate when a script fires several `tools.subagent()` calls concurrently. Management calls (`action:` set) pass, matching the cap and lone-implementer guards. `closureEnforced()` is the gate switch: `closureReview.enforce: false` disables the nested-dispatch block together with the rest of the closure guard family, and the stuck-verify escape (`doc/configuration.md:247`) still works; the inventory sentences there are amended below. Subagent children: the condition carries no `!isSubagentChild` term (the user's chosen gate is `gauntletEntered && closureReview.enforce`, nothing else), so child behavior follows the child's branch. A fresh-context child (`defaultContext: fresh`) never replays a `start brainstorm`, `gauntletEntered` stays false, and the block is dormant there. A fork child (`agents/implementer.md:5` `defaultContext: fork`) replays the parent's branch, reconstruction restores `gauntletEntered` on `session_fork` (`:587,638`), and a scripted `subagent` call inside that child is blocked by the same rule; the sibling fix-loop guards stay child-dormant only through their own `!isSubagentChild` term (`:688`). This is acceptable because the child reads the same settings cwd, so `closureReview.enforce: false` disables the block there too, and the block's remedy (dispatch directly) applies in a child unchanged.

Add: in the `tool_result` hook (`:845`), `finishDispatch` still runs for every `subagent` result, then the three replay-mirrored mutations - `observeFixWave`, the `conformanceDispatched` latch, `observeCadence` - and the open-task nudge are skipped when `event.parentToolCallId` is set. The pending-warning prepend stays. This is the AC 3 invariant: whichever way a nested result reaches the hook (enforce off, no flow entered, or a future pi that emits a result for a blocked call), live state equals what `reconstructState` can rebuild.

Data flow, blocked case: script calls `tools.subagent({...})` -> `NestedToolCallRunner` emits `tool_call` with `parentToolCallId` -> hook returns `{ block: true, reason }` -> pi short-circuits before `afterToolCall`, no `tool_result` fires -> script receives the reason as the call's error string -> latch, counter, cadence, `liveDispatch`, and substep untouched. Release of `liveDispatch` happens only for an allowed nested call (enforce off, or no flow entered) whose `tool_call` ran `observeDispatch` and whose matching `tool_result` reaches `finishDispatch` (`:444`, id match required).

### `doc/configuration.md`

The `## Extensions` codemode paragraph (`:185`, currently the one model-only sentence) becomes the per-mode support statement, in this order:

1. `on` (pi's default): supported. `phase_tracker`, `plan_check`, and `plan_tracker` are model-only (not callable from scripts) because reconstruction reads their own transcript tool results, which nested calls do not persist; `subagent` and `gauntlet_setting` keep pi's default exposure (direct declaration plus `tools.<name>()` in a script). Exposure is not entered-flow support: inside an entered flow, `subagent` dispatch is direct-only - a scripted `tools.subagent()` call is blocked with the reason above while `closureReview.enforce` is on, and the model issues the call directly.
2. `only`: unsupported while a flow is entered. `subagent` and `gauntlet_setting` are reachable only as `tools.<name>()` inside a script, so every dispatch is scripted and the closure guard blocks it with the reason above (same meaning as the block text); the way out is `codemode.mode: on`, or `closureReview.enforce: false` as the last resort. Outside an entered flow nothing is blocked.
3. The literal `subagent({...})` examples in skills are the direct tool call's name and argument object, not JavaScript to run through codemode; under `on` the model issues that call directly.
4. Link: `https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md`.

The guard inventory in the same file goes stale with the new block and is amended in the same edit (`AGENTS.md` "Doc updates ride with the commit"):

- `:23` (`closureReview.enforce` setting): add that the same switch governs the scripted-dispatch block (every entered phase) alongside the `complete verify` gate.
- `:247` (**Flow guards** lead-in): "Eight guards" becomes nine; "the two fix-loop guards ride `piGauntlet.closureReview.enforce: false`" becomes the three closure guards (fix-loop shape, fix-round cap, scripted dispatch); "all eight stay dormant" becomes all nine.
- New bullet after **Fix-round cap (blocks)**: **Scripted dispatch (blocks).** In every entered phase, a `subagent` call made from inside a codemode script (`parentToolCallId` set, no `action:`) is blocked; the reason says to call `subagent` directly, that codemode `only` is unsupported while a flow is entered, and names `codemode.mode: on` and `closureReview.enforce: false` as the ways through. A nested `subagent` result never moves the closure latch, fix-round counter, or cadence. Governed by `piGauntlet.closureReview.enforce`.

`README.md:102`'s one-line model-only sentence stays unchanged; #134's reporter note names the configuration paragraph as the single delivery.

### `CHANGELOG.md`

One `## Unreleased` row describing the block, the `tool_result` exclusion, and the per-mode paragraph; closes #132 and #134. Both tickets' notes record a CHANGELOG AC as removed by the roast, so this is repo convention (`AGENTS.md` "Docs updates ride with the commit"), not a ticket row.

### Paid or external actions

None. Implementation and verification are local (`npm test`; focused `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`). The loop treats any action not named here as unreachable; adding one needs separate explicit authorization.

## Errors and edge cases

- Blocked nested call: `{ block: true, reason }` only; the block itself adds no warning. A settings-load warning that `closureEnforced()`'s loader already queued for the call's `toolCallId` (malformed `settings.json`, `:664-673`, `gauntlet-settings-loader.ts:17-27`) stays in `pendingGuardWarnings` until the next reconstruction clears it (`:550`), because no result follows a blocked call; this matches every existing blocked closure guard and no warning-cleanup machinery is added.
- Nested management call (`action:` set): passes.
- Nested `subagent` with `closureReview.enforce: false`: not blocked; its result still skips the three replay-mirrored mutations. In the parent session `observeDispatch` registers it and its matching result releases `liveDispatch`.
- Nested `subagent` outside an entered flow (never entered, or after `reset`): not blocked; result mutations skipped. Fresh-context children fall here.
- Nested `subagent` in a fork child with a replayed `start brainstorm`: blocked by the same rule (no child exemption); `observeDispatch` is already child-dormant (`:433`).
- Several `tools.subagent()` calls in flight from one script: each `tool_call` is blocked independently; `observeDispatch` never runs for them.
- Direct `subagent` call: unchanged; `parentToolCallId` is undefined on top-level calls.
- Sessions recorded before this change: not repaired; a nested dispatch already on the branch still vanishes on reload. See Out of scope.

## Tests

`extensions/phase-tracker.test.ts`, mirroring the shape-guard trio at `:1555-1596`; nested events carry `parentToolCallId` on the synthetic event object (the harness passes arbitrary event objects; `pi-stubs.mjs` needs no change).

None of latch, counter, cadence, or `liveDispatch` is directly readable; tests observe them the way the existing guard tests do: the counter through the `<used> fix round(s) used` count in a subsequent direct implementer dispatch's `fixRoundCapBlockReason` text (or that dispatch passing below the cap; `:1722-1760`), the latch through `complete verify` acceptance or rejection, cadence through the commit-time review-cadence warning (`:744-775`), and `liveDispatch`/substep through the widget text or `phase_tracker` `status` substep (`:2296-2377`).

- AC 1, phase independence: entered flow iterated over brainstorm, plan, implement, verify, and ship in progress; in each, a nested `subagent` `tool_call` returns `{ block: true, reason }`, and the reason contains the direct-call statement, the `only`-unsupported statement, `codemode.mode: on`, and `piGauntlet.closureReview.enforce: false` - `nested dispatch: blocked in brainstorm, plan, implement, verify, and ship; reason names direct call, only-mode, and the switches`
- AC 1, state preservation: verify in progress, latch on, counter at cap, non-default cadence; after the blocked nested call, a direct implementer wave is still blocked with the same `used` count, `complete verify` is still accepted on the latch, the commit-time cadence warning is unchanged, and the widget/substep shows no dispatch - `nested dispatch: latch, counter, cadence, and liveDispatch unchanged after a block`
- Errors (settings warning): the state-preservation setup with malformed `.pi/settings.json`; the nested call is still blocked (enforce defaults to true) and the next direct `subagent` result in the session carries no settings warning text, because the queued warning is keyed to the blocked call's `toolCallId` - `nested dispatch: a loader warning queued before the block is never prepended to another result`
- AC 2: same event with no flow entered is not blocked; direct call and nested management call pass in an entered flow - `nested dispatch: management, direct, and cold-start calls pass`
- Design (children): under `PI_SUBAGENT_DEPTH=1` (mirroring `:1761-1784`), a fork child whose branch replays `start brainstorm` blocks the nested call, and a fresh child whose branch has no entry marker passes it - `nested dispatch: blocked in an entered fork child, dormant in a fresh child`
- Design (gate switch): `closureReview.enforce: false` leaves the nested call unblocked - `nested dispatch: dormant when closureReview.enforce is false`
- AC 3, preservation: entered-flow setup; a synthetic nested `subagent` `tool_result` (error and success variants, `parentToolCallId` set, including a result whose details would otherwise qualify as a conformance dispatch, an implementer wave, and a cadence event) leaves latch, counter, and cadence unchanged by the observables above, and `liveDispatch`/substep untouched because no registration matched - `nested result: replay-mirrored state untouched`
- Design (release): with `closureReview.enforce: false` in the parent session, an allowed nested `tool_call` registers through `observeDispatch` (widget shows the substep), and its matching nested `tool_result` releases it (widget clears) while still skipping the three mutations - `nested result: liveDispatch released only for a registered nested call`
- AC 4, AC 5, AC 6: `doc/configuration.md` paragraph states `on` supported with direct-only dispatch in a flow, `only` unsupported in a flow with the reason, the example-reading sentence, and the codemode link; the Flow guards inventory counts nine guards, names the three closure guards, and carries the **Scripted dispatch (blocks)** bullet; `:23` names the block - none: documentation; the conformance pass checks the text against this spec.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - the `## Extensions` codemode paragraph becomes the per-mode support statement, the literal-example reading, and the upstream link (operations / tunable parameters: which mode a flow runs under is a setting no code location states); the same file's `closureReview.enforce` description (`:23`), the **Flow guards** lead-in counts and closure-guard set (`:247`), and a new **Scripted dispatch (blocks)** bullet (operations / tunable parameters: the inventory and the switch that disables the new block); `CHANGELOG.md` - `## Unreleased` row
- Derived / memory docs invalidated: none (`README.md:102` stays true; `AGENTS.md` has no codemode entry)

The materiality bar is `reference/documentation-impact.md`.

## Out of scope

- A mode-aware guard or durable record that lets `only` mode dispatch during a flow (#132 Out of scope; alternative recorded in Problem).
- Repairing sessions recorded before this change; `nestedCalls` carry no result details.
- Telemetry's branch replay of `write`/`edit` results made from a script (`extensions/telemetry.ts:165-206`); same root cause, separate ticket if it matters (#132 Out of scope).
- Any skill edit; the literal examples stay as they are (#134 Idea).
- A README edit beyond leaving `README.md:102` true (#134 reporter note).
- Refusing flow entry when `codemode.mode` is `only`: `on` still exposes `subagent` to scripts (exposure, not entered-flow support - the block applies under both modes), and reading a non-`piGauntlet` key from an extension is ruled out by `doc/configuration.md`.

## Open questions

None.
