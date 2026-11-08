# Guard warnings keep the structured tool result and reach the codemode parent

**Goal:** An advisory warning prepended by a gauntlet `tool_result` hook never drops the tool's `structuredContent`, and a warning raised by a call a codemode script made is delivered once on the script's own (parent) result instead of being lost or corrupting the script's value.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #133
**Date:** 2026-11-08

## Problem

Four gauntlet hooks replace a `tool_result`'s `content` to prepend an advisory: the phase-tracker guard and review-cadence warnings (`extensions/phase-tracker.ts:875`), the phase-tracker subagent settings warning and open-task nudge (`:866`), the verify-before-ship ship warning (`extensions/verify-before-ship.ts:281`), and the telemetry shipped-spec write warning (`extensions/telemetry.ts:880`). Each returns `{ content: [warning, ...event.content] }` without `structuredContent`. Pi's extension runner deletes `structuredContent` when a handler returns `content` alone (`dist/core/extensions/runner.js:910-914`; `ToolResultEventBase` doc: "replacing content alone drops it"). Codemode resolves a nested call's value from `structuredContent` for tools that declare an `outputSchema` - bash and read in pi 1.5.0 - and otherwise from text (`dist/extensions/codemode/execute.js:417-424`), so a script's `const r = await tools.bash({...})` on a guarded call receives `"<warning>\n<output>"` instead of `{ output, exit_code, ... }` and `r.exit_code` is `undefined`. The two sites that touch write, edit, subagent and codemode results drop nothing observable today because those tools declare no schema, but they share the pattern and regress the day pi adds one.

Nested calls (`tool_call`/`tool_result` events with `parentToolCallId`, ids `<parent id>/<n>`) are absent from the transcript; only the parent codemode result is. If the fix only preserved `structuredContent` and skipped the prepend on nested results, an agent that does its work through codemode would never see the spec-confinement or implement-write advisory - and because `firedGuards` is latched at call time (`phase-tracker.ts:745, 750, 836`), the warn-once advisory would be spent without being read. The ticket body proposes discarding the nested pending entry and leaving the latch unset so the next direct call re-fires. This spec pivots: the nested warning is re-keyed to its `parentToolCallId` and delivered once on the parent result, which has no `outputSchema` and lands in the transcript; the latch stays set because the advisory was delivered.

Framing: pivoted to re-keying a nested call's pending warning to its `parentToolCallId` so it is prepended once to the parent (codemode) result, with the warn-once latch left set - as framed, the nested advisory is discarded and an agent working through codemode never sees it. User chose this at the framing question.

Premises: the runner deletion, the codemode `toScriptValue` rule, and the `parentToolCallId` fields were verified in the installed pi 1.5.0 runtime. The site count was corrected from three (ticket) to the five advisory sites the user selected (guard warnings, review cadence, subagent settings/open-task nudge, ship warning, shipped-spec write), served by four content-replacing returns: `phase-tracker.ts:866` (subagent), `phase-tracker.ts:876` (guard and cadence share this return), `verify-before-ship.ts:281`, `telemetry.ts:880`. The call-time latch is an implicit dependency the ticket skipped; it was traced and found. No live session has reproduced the failure; the ticket derives it from source, and so does this spec.

## Acceptance criteria

Ticket #133, Acceptance criteria, rows verbatim:

- [ ] At each of the three advisory sites (phase-tracker guard warnings, phase-tracker review-cadence warning, verify-before-ship ship warning), a direct `tool_result` event carrying `structuredContent` with the guard condition active (a queued warning for phase-tracker; an active ship-warning condition for verify-before-ship) returns content with the warning prepended and `structuredContent` deep-equal to the event's, for a `bash` event and for a synthetic `write`/`edit` event (unit tests over the hooks).
  in-scope
- [ ] At the same three sites, a `tool_result` event carrying `parentToolCallId` and `structuredContent` returns the event's content unchanged with `structuredContent` deep-equal to the event's (unit tests over the hooks).
  in-scope
- [ ] A scripted `write` `tool_result` (carrying `parentToolCallId`) that would fire a warn-once guard leaves that guard's fired flag unset and its pending entry absent; the next direct `write` in the same phase with the guard condition still true receives the advisory, and with the condition cleared receives none (unit test over the hook).
  deviates: the user chose delivery on the parent result over discard-and-re-fire; the fired flag stays set and the pending entry moves to the parent id (see Design, nested delivery) - the next direct `write` in the same phase receives no second advisory because it was delivered once on the parent

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-133-guard-warnings-keep-structured-result
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (runs scripts/ci.mjs: lint, bin freshness, extension unit tests, pack smoke); targeted: node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/<file>.test.ts
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: eval/README.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3
design: owns extensions/lib/tool-result-warnings.ts and its test, the scripts/ci.mjs test-list entry for that test, extensions/test-support/merge-tool-result.mjs, the call-site edits in extensions/phase-tracker.ts, extensions/verify-before-ship.ts and extensions/telemetry.ts, their test additions, the CHANGELOG.md Unreleased entry, and the doc/configuration.md sentences; observable: a guarded bash call from a codemode script yields `{ output, exit_code }` and the warning appears once on the codemode result.

## Design

### New module: `extensions/lib/tool-result-warnings.ts`

Placed beside `extensions/lib/phase-tracker-helpers.ts`; test at `extensions/lib/tool-result-warnings.test.ts`, added to the explicit `node --test` file list in `scripts/ci.mjs` (the list enumerates files; an unlisted suite never runs under `npm test`). No I/O, throws nothing. Two exports:

- `prependWarning(event, text)` returns `{ content: [{ type: "text", text }, ...(event.content ?? [])], structuredContent: event.structuredContent }`. This is the only place in the package that builds a content-replacing `tool_result` return; carrying `structuredContent` through is what keeps the runner from deleting it.
- `createPendingWarnings()` returns a store `{ add(id, text), take(id), deliver(event, text), clear() }` over a `Map<string, string>`:
  - `add` concatenates an existing entry with `"\n\n"` (today's behavior at `phase-tracker.ts:495-496` and `verify-before-ship.ts:240-241`).
  - `take(id)` returns and removes the entry, or `undefined`.
  - `deliver(event, text)`: when `event.parentToolCallId` is set, `add(event.parentToolCallId, text)` and return `undefined` (the nested result is returned to the runner untouched, so codemode hands the script its clean structured value or clean text); otherwise return `prependWarning(event, text)`.
  - `clear()` empties the map.

Nested delivery: a parent that is itself nested (`c1/0/2` -> `c1/0` -> `c1`) is re-keyed again at each level by the same rule; no id parsing. The parent result passes through the same `tool_result` hook, `take(parentId)` finds the text, `deliver` sees no `parentToolCallId` and prepends. The agent reads the warning once, above the script's output. Top-level calls behave as today, plus the structured value survives.

### Call sites

Remove: the raw `pendingGuardWarnings` `Map` (`phase-tracker.ts:493`) and `pendingShipWarnings` `Map` (`verify-before-ship.ts:217`); the inline get/delete/prepend blocks at `phase-tracker.ts:863-876` and `verify-before-ship.ts:277-283`; the inline `{ content: [warning, ...event.content] }` return in `onBoundSpecWrite` (`telemetry.ts:880`).

Add:
- `phase-tracker.ts`: one `createPendingWarnings()` store. The `tool_call` hooks keep calling `add(event.toolCallId, text)` where they set the map today; guard evaluation and the `firedGuards` latch (`:745, 750, 836`) are unchanged - a nested call still counts as warned-once because its text is delivered on the parent. The `tool_result` hook drains for every `toolName`, including `codemode`: the subagent branch keeps its bookkeeping (`finishDispatch`, `observeFixWave`, `qualifiesAsClosureDispatch`, `observeCadence`, the open-task nudge `add`) and then, instead of the per-branch `return undefined` at `:869` and `:878`, the hook falls through to one trailing `const text = store.take(event.toolCallId); return text ? store.deliver(event, text) : undefined;`. Today the hook returns `undefined` for any `toolName` outside `subagent`/`bash`/`write`/`edit`, so a `codemode` parent result would never reach `take(parentId)` and the re-keyed warning would be stranded with the latch already spent. The store is cleared in two places: `reconstructState` (`:550`, replaces `pendingGuardWarnings.clear()`; runs on `session_start`/`session_switch`/`session_fork`/`session_tree`) and the `phase_tracker reset` action (`:1339`, next to its `firedGuards.clear()` - today reset clears the latch but leaves pending warnings, so a deferred parent warning would outlive the reset). `start`, `complete`, and `skip` get no cleanup.
- `verify-before-ship.ts`: one store; `tool_call` uses `add`. The `tool_result` hook keeps `rememberPlan` first, then the `pendingTests` credit for `bash` results, then drains for every `toolName` (`take`-and-`deliver` on `event.toolCallId`) - the `if (event.toolName !== "bash") return undefined;` at `:271` moves below the drain or becomes a guard only around the `pendingTests` credit, so a `codemode` parent result delivers a ship warning raised by a nested bash call. There is no phase-reset path in this extension today and none is added.
- `telemetry.ts`: one store. The `tool_result` handler (`:546`) runs take-and-deliver as its first statement, before the early returns for `phase_tracker` and `subagent` and the `codemode` fall-through, so a deferred shipped-spec warning reaches the codemode parent result. `onSpecInteraction` (`:605`) and `onBoundSpecWrite` (`:658`) widen their `event` parameter from `{ input: unknown; content: unknown[] }` to the `tool_result` event type (at least `{ input, content, parentToolCallId?, structuredContent? }`) and pass the hook's event object through unchanged, never a rebuilt reduced object; `onBoundSpecWrite` routes its warning through `store.deliver(event, warning)` instead of building the return itself.
- A CHANGELOG `## Unreleased` entry referencing #133.

Blocking guards that return a fresh `isError` result (guard 2 and the verify-before-ship block) are untouched: they never carried `structuredContent`.

### Documentation

`doc/configuration.md`, `### phase-tracker` and `### verify-before-ship` advisory paragraphs each gain one sentence: a guard fired by a call a script made (codemode) surfaces once on the script's own result, and the tool's structured result passes through unchanged.

### Paid or external actions

None in implementation or verification. The loop treats any action not named here as unreachable; adding one requires separate explicit authorization.

## Errors and edge cases

1. Nested call with no pending warning: `take` returns `undefined`, the hook returns `undefined`, result untouched - same as today.
2. Parent result never arrives (codemode timeout, `exit()`, or abort before the parent `tool_result`): the re-keyed entry stays in the store until the next `clear()` (phase-tracker) or forever (verify-before-ship, telemetry). Bounded by one entry per abandoned parent; ids are unique per session so it never prepends to an unrelated call. No expiry machinery.
3. Several nested calls firing different guards under one parent: `add` concatenates with `"\n\n"`; the parent carries each once. The same warn-once guard twice under one parent fires once because the latch stops the second at call time (today's behavior). Recurring warnings (review cadence, ship) under one parent concatenate as many times as they fire.
4. Depth-two nesting: `deliver` re-keys to the immediate parent at each level.
5. `event.content` missing or empty: `prependWarning` spreads `event.content ?? []`.
6. Telemetry's handler returns early for `phase_tracker`/`subagent` and ignores `codemode`: take-and-deliver runs before those returns.
7. Blocking (`isError`) guards are not routed through the helper and are unchanged.

## Tests

Fake runner merge used by every structured case: one shared helper `extensions/test-support/merge-tool-result.mjs` exporting `mergeToolResult(event, ret)`. It returns the event unchanged when `ret` is `undefined`; on a return it applies the verified runner rules (`runner.js:910-914`): replace `content` with `ret.content`, set `structuredContent` to `ret.structuredContent` when present, delete it when the return lacks it. The three extension harnesses (`phase-tracker.test.ts:127`, `verify-before-ship.test.ts:27`, `telemetry.test.ts:85`) return raw handler values today; every structured assertion below runs on the merged result, not the raw hook return, so a site that forgets the pass-through fails the test.

- bash result keeps `{ output, exit_code }` after a brainstorm-write warning (AC 1) - `extensions/lib/tool-result-warnings.test.ts`; one structured case each in `extensions/phase-tracker.test.ts` (guard and cadence, bash and synthetic write/edit), `extensions/verify-before-ship.test.ts` (ship warning, bash and synthetic write/edit), `extensions/telemetry.test.ts` (shipped-spec write, asserting `structuredContent` deep-equal so a narrowed event type or cast cannot hide a dropped field)
- verify-before-ship synthetic write/edit (AC 1): the ship warning is produced only by the `bash` `tool_call` branch, so the test first queues one through the existing guarded bash `tool_call`, then emits a synthetic `write`/`edit` `tool_result` with the same `toolCallId` and a `structuredContent`; asserts warning prepended and structure preserved through the tool-independent drain. This is a synthetic result fixture, not a real write/edit ship-warning producer; no seed seam is added - `verify-before-ship.test.ts`
- nested result returned untouched (`undefined` return; merged event deep-equal to input), text re-keyed under the parent, latch still set (AC 2, AC 3 as deviated) - `tool-result-warnings.test.ts`; nested case in `phase-tracker.test.ts`, `verify-before-ship.test.ts`, `telemetry.test.ts`
- child-to-parent delivery through each registered hook: a nested call fires the warning, then a parent `tool_result` with `toolName: "codemode"` (no `parentToolCallId`, carrying its own `content` and `structuredContent`) receives the warning prepended exactly once, the store is empty afterwards, and the merged parent `structuredContent` is deep-equal to the input - `phase-tracker.test.ts` (guard warning; then the next direct write in the same phase gets no second advisory), `verify-before-ship.test.ts` (ship warning on nested bash), `telemetry.test.ts` (shipped-spec write under a parent)
- phase-tracker subagent return (`:866`): extend the existing subagent warning tests (`phase-tracker.test.ts:2182-2227`) with a direct structured pass-through case and a nested clean-result plus parent-delivery case over the merged result, keeping the existing queued-warning-before-nudge ordering and accounting assertions
- two nested guards under one parent both appear once, `"\n\n"`-joined - `tool-result-warnings.test.ts`
- depth-two re-key - `tool-result-warnings.test.ts`
- `event.content` undefined - `tool-result-warnings.test.ts`
- reset clears deferred entries: queue a nested warning (re-keyed to a parent id), call `phase_tracker({ action: "reset" })`, then emit the former parent's `tool_result` and assert it receives no advisory; a second case does the same through `reconstructState` by emitting `session_start` - `phase-tracker.test.ts`
- codemode parent abandoned before its result - none: bounded leak with no observable short of a timer
- end-to-end live smoke, run once during the verify phase, not a CI fixture or a sweep: in a scratch repo with an existing `src/` directory, a pi session with codemode enabled and `piGauntlet.flowGuards.enforce` on (the default); arm the guard with `phase_tracker start brainstorm` in that session (the brainstorm-write guard fires only while brainstorm is `in_progress` and the flow was entered via `start brainstorm` - `flowGuardApplies` at `extensions/lib/phase-tracker-helpers.ts:187`); run the codemode script `const r = await tools.bash({ command: "echo x > src/a.ts" }); return r.exit_code;`. Pass: script value `0`, and the codemode result text carries the brainstorm-write advisory exactly once. Outcome recorded under `## Verification note` below

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: doc/configuration.md - `### phase-tracker` and `### verify-before-ship` advisory paragraphs gain one sentence (nested-call delivery on the parent result; structured results pass through); CHANGELOG.md - `## Unreleased` entry referencing #133, written in this change (matches the Design commitment)
- Derived / memory docs invalidated: none

Template from `reference/documentation-impact.md`.

## Out of scope

- A machine-readable warning channel (`gauntletWarnings` or similar in `structuredContent`): the shape is owned by pi core's per-tool `outputSchema`, and only schema-declaring tools would carry it.
- Ticket AC 3's discard-and-re-fire behavior: replaced by parent delivery (disposition above).
- A pinned-runtime contract test importing pi's runner: couples `npm test` to unexported internals.
- Expiry or cleanup for re-keyed entries whose parent result never arrives (edge 2).
- `pathInSpecDirs` judging a linked-worktree path (`.worktrees/<name>/doc/specs/...`) as outside the spec dirs - observed during this brainstorm's gather; separate ticket.

## Verification note

Filled in during the verify phase with the live smoke outcome (Tests, end-to-end): the script value observed, the codemode result text with the advisory count, and the pi version used. Empty until then.

## Open questions

- None blocking. If pi later preserves `structuredContent` by default when a hook returns `content` alone, `prependWarning`'s pass-through becomes dead weight but stays correct.
