# Assume direct-only `subagent` dispatch: bump the pi-cohort floor, remove the dead scripted-dispatch guard, rewrite the codemode guidance

**Ticket:** jjuraszek/pi-gauntlet#135
**Goal:** With pi-cohort 7.7.0 registering both `subagent` tools `exposure: "model-only"`, raise the peer floor to that release, delete the flow-scoped scripted-dispatch guard and nested-result exclusion that #136 added (now unreachable), and make `doc/configuration.md` describe direct-only dispatch under codemode `on` and `only`.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md` - superseded for its Design's scripted-dispatch guard, nested-result exclusion, and codemode-mode guidance; its warning-result paragraphs were already superseded in practice by `doc/specs/2026-11-08-gh-133-guard-warnings-keep-structured-result.md`, which stays live.

## Problem

pi-cohort 7.7.0 (npm latest, installed) registers both `subagent` tools with `exposure: "model-only"` (`src/extension/index.ts:406`, `src/extension/fanout-child.ts:141`; pi-cohort CHANGELOG 7.7.0, #49). Under pi 1.5.0, a model-only tool is declared to the model while active and never callable through another tool (`dist/core/extensions/types.d.ts:404-414`); codemode `only` mode hides only `direct` declarations (`dist/extensions/codemode/tool.js:262-263`), so direct `subagent` dispatch stays reachable in both modes and a codemode script cannot dispatch in either.

pi-gauntlet still carries the pre-7.7.0 picture. The ticket body was written when #132 and #134 were open; both closed through PR #136 (merge `4540e7ab`), which added to `extensions/phase-tracker.ts` a `nestedDispatchBlockReason` string (`:263-268`) and a `tool_call` branch that blocks a `subagent` call carrying `parentToolCallId` without `action` in an entered flow (`:690-692`), wrapped the `tool_result` observers (fix wave, closure latch, cadence, open-task nudge) in `if (!event.parentToolCallId)` (`:855`), added eleven tests for those branches (`extensions/phase-tracker.test.ts:1641-1786`, `:1922-2008`), three codemode paragraphs in `doc/configuration.md:185-189` stating that `only` is unsupported in an entered flow, a ninth flow guard "Scripted dispatch (blocks)" (`:265`), the nine/three counts (`:251`), and the `closureReview.enforce` clause naming the scripted-dispatch block (`:23`). Every one of those branches exists to catch a call pi-cohort 7.7.0 makes impossible, so they are dead code and the paragraphs are wrong. The peer floor (`package.json:65`, `README.md:145`) is `>=7.6.8`, a release on which a script can still dispatch.

The reporter's note on the ticket (scripted councils lose the per-child progress view; fear of the same loss during implementation and review) is motivation; its session observations are unverified and this spec promises no whole-flow evidence beyond upstream's two-mode integration test.

Implicit dependencies: `node scripts/pi-cohort-floor-lint.mjs` run bare prints nothing and exits 0 - the module only exports `lintPiCohortFloor`, which `scripts/ci.mjs:602` calls; the user settled AC 1's "reports them equal" as `lintPiCohortFloor(root)` returning `[]` under `npm test`. Nothing at runtime checks the installed pi-cohort version; the floor is declarative and, per the ticket's Out of scope, validation lives once at pi-cohort's boundary. `extensions/lib/` is untouched, so no bin bundle rebuild is needed.

Framing: kept - checked the #136 and #137 diffs hunk by hunk, pi-cohort 7.7.0's two registrations, pi's codemode loadout, the floor lint entrypoint and its CI caller, and the state of #132/#133/#134.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#135, Acceptance Criteria, rows verbatim:

- [ ] Given upstream verification that both the main and child-safe `subagent` registrations use `exposure: model-only`, `package.json`'s peer floor and the README floor name that verified release, and `node scripts/pi-cohort-floor-lint.mjs` reports them equal.
  in-scope
- [ ] The codemode paragraph in `doc/configuration.md` states that `subagent` dispatch is direct-only because both pi-cohort registrations are model-only, that direct dispatch remains available under codemode `on` and `only` because model-only tools stay declared in `only`, and that literal `subagent({...})` examples describe direct tool calls whose surrounding JavaScript is illustration rather than a script to execute; it links to pi's codemode documentation.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-135-direct-only-dispatch
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`: floor lint, extension tests, pack and install smokes); scoped `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts` for the hook change (the bare `node --test` fails with `ERR_MODULE_NOT_FOUND` for `@earendil-works/pi-ai`; the loader matches `scripts/ci.mjs:480-492`)
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2
design: owns `package.json`, `package-lock.json` (root `peerDependencies` mirror), `README.md`, `doc/configuration.md`, `CHANGELOG.md`, `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts`, and the predecessor spec banner; observable outcomes are the two AC rows plus the guard removal and eight-guard inventory below.

## Design

Supersedes `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md`, scope: Design's scripted-dispatch guard, nested-result exclusion, and codemode-mode guidance.

### Floor

- `package.json:65` peerDependencies `pi-cohort`: `">=7.6.8"` -> `">=7.7.0"`.
- `package-lock.json:33` root `peerDependencies` `pi-cohort`: `">=7.6.8"` -> `">=7.7.0"` (the lockfile mirrors `package.json`; `npm install` rewrites it but CI does not fail on a stale mirror).
- `README.md:145` requirements bullet: `>= 7.6.8` -> `>= 7.7.0`; the version token only, no added rationale (the reason lives in `doc/configuration.md`).
- AC 1's "reports them equal" is satisfied when `lintPiCohortFloor(root)` (`scripts/pi-cohort-floor-lint.mjs`) returns `[]`, observed through `npm test` (`scripts/ci.mjs:602`) and `scripts/pi-cohort-floor-lint.test.mjs`. No CLI entry is added to the lint module.

### Guard removal in `extensions/phase-tracker.ts`

Remove:
- the `nestedDispatchBlockReason` function (`:263-268`) and every call to it;
- the `tool_call` branch `if (event.parentToolCallId && !hasAction) return { block: true, reason: nestedDispatchBlockReason() }` (`:690-692`); `hasAction` stays because the fix-loop shape and fix-round cap guards still use it;
- the `if (!event.parentToolCallId)` wrapper around the `tool_result` observers (`:855`), dedenting its body so `observeFixWave`, the closure latch, `observeCadence`, and the open-task nudge run on every `subagent` result, as before #136.

Add: none. After the change nothing in the hook branches on `parentToolCallId` for `subagent` events; the only remaining `parentToolCallId` readers are the warning re-keying in `extensions/lib/tool-result-warnings.ts:25-26` and its callers, which stay as they are because `bash`, `write`, and `edit` remain script-callable. `finishDispatch`, `createPendingWarnings`, and `extensions/test-support/merge-tool-result.mjs` are untouched.

Data flow after the change: model -> direct `subagent` call -> `tool_call` hook (fix-loop shape, fix-round cap, model guards) -> `tool_result` hook (wave, latch, cadence, nudge) -> transcript replay in `reconstructState`. No nested branch exists at any step.

### Tests

Remove from `extensions/phase-tracker.test.ts`:
- the `nestedCall` helper (`:1641`) and the complete scripted-dispatch block at `:1643-1786`: the `for (const phase of PHASES)` loop of block tests, the `blockedNestedDispatchFixture` (`:1663`) and `assertBlockedNestedStateUntouched` (`:1683`) helpers, and the remaining tests through the `enforce: false` dormancy test closing at `:1786` (state unchanged after the block; replay-mirrored state; child follows flow entry; allowed without entry; management call passes; dormant when `closureReview.enforce` is false);
- the complete nested-result block at `:1922-2008`: the `for (const isError ...) for (const enforce ...)` loops opening at `:1922-1923` with their three `nested results` tests, and the open-task nudge skip test at `:1997-2008`.

Retain the shape-guard test that begins at `:1788` (`for (const agent of ["implementer", "loop-implementer"])`) and the test that follows `:2008` (`interrupted implementer waves ...`); the deletions end on the blank lines before them. After the deletion `rg 'nestedCall|blockedNestedDispatchFixture|assertBlockedNestedStateUntouched|parentToolCallId: "script"' extensions/phase-tracker.test.ts` matches only the nested `bash`/`write`/`edit` warning tests below.

Keep the nested `bash`/`write`/`edit` warning tests at `:397`, `:440`, `:477`, and the nested tests in `extensions/verify-before-ship.test.ts:87,112` and `extensions/telemetry.test.ts:1228`: they exercise the live #137 re-keying path. Keep every lone-implementer, fix-round cap, and model guard test.

### Docs

- `doc/configuration.md:185-189`: replace the three codemode paragraphs. The current lead sentence "Codemode `on` (pi defaults to this mode) supports an entered gauntlet flow" (`:185`) is dropped, not kept or widened; the both-modes statement below replaces it. The new text states, in this order: `phase_tracker`, `plan_check`, and `plan_tracker` are model-only because session reconstruction reads their transcript tool results (unchanged sentence); `subagent` dispatch is direct-only because both pi-cohort registrations are model-only (pi-cohort >= 7.7.0); direct dispatch remains available under codemode `on` and `only` because model-only tools stay declared in `only`; `gauntlet_setting` keeps its default exposure and is the one gauntlet tool a script may call; the literal `subagent({...})` examples in skills name the direct tool call and its argument object - the surrounding JavaScript is illustration, not a script to execute; link to pi's codemode documentation (the existing URL). No sentence says `only` is unsupported, and `closureReview.enforce: false` is not offered as a workaround.
- `doc/configuration.md:251`: "Nine guards" -> "Eight guards"; "the three closure guards (fix-loop shape, fix-round cap, scripted dispatch)" -> "the two closure guards (fix-loop shape, fix-round cap)"; "all nine" -> "all eight".
- `doc/configuration.md:265`: delete the **Scripted dispatch (blocks)** bullet.
- `doc/configuration.md:23`: drop "and the scripted-dispatch block in every entered phase" from the `closureReview.enforce` description.
- `CHANGELOG.md`: `## Unreleased` entry citing #135, written in this change: floor `>=7.7.0`, scripted-dispatch guard and nested-result exclusion removed as unreachable, codemode guidance rewritten. Promotion of `## Unreleased` to a versioned heading is the release's job, not this change's.
- `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md`: the supersession banner is already present at line 3 and names this spec with the scope in the header; verify it, do not insert a second one (`reference/superseding.md` is append-only with no dedup).

### Actions

No paid or external action is required for implementation or verification: the flow runs `npm test` and the scoped `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts` locally and dispatches its implementer, reviewer, and conformance children through direct `subagent` calls. The loop treats any action not named here as unreachable; adding one needs separate explicit authorization.

## Errors and edge cases

- A consumer running pi-cohort < 7.7.0 beside this pi-gauntlet regains a script-callable `subagent` with no gauntlet-side block. The floor line is the only signal; by the ticket's Out of scope decision, exposure validation lives once in pi-cohort's own test and no gauntlet test or runtime probe is added.
- `subagent({ action: ... })` management calls flow through the `tool_call` hook unchanged (`hasAction` short-circuits the shape and cap guards) and through the `tool_result` observers exactly as before #136, which already ignore management results.
- Replay is unchanged: nested calls were never transcript `toolResult` messages (only the parent codemode result persists), so `reconstructState` (`extensions/phase-tracker.ts:599-612`, which reads only `toolResult` entries and never `parentToolCallId`) saw none before #136 and sees none now. The removed `if (!event.parentToolCallId)` wrapper gated the live `tool_result` hook only (`:855`); its removal restores live observation of an event 7.7.0 cannot emit.
- `closureReview.enforce: false` keeps disabling the two remaining closure guards (fix-loop shape, fix-round cap). Its other readers stay and keep their behavior: the conformance model guard (`extensions/phase-tracker.ts:676-686`), `observeFixWave`'s round accounting (`:476`), the complete-verify gate (`:1217`), and `grant_fix_rounds` (`:1353`). None of them is dead code under this spec; only the two #136 branches named in Design are removed.

## Tests

- floors equal at 7.7.0 (AC 1) - `scripts/pi-cohort-floor-lint.test.mjs`, existing; `lintPiCohortFloor` returns `[]`; observed through `npm test`. The "upstream verification" the row presupposes is pi-cohort 7.7.0's (#49, PR #52) `doc/specs/2026-11-08-gh-49-subagent-model-only-exposure.md` and offline integration test `test/integration/subagent-model-only.test.ts`, both named by the 7.7.0 CHANGELOG entry as "Upstream verification for pi-gauntlet#135"; its result: both the main (`src/extension/index.ts:406`) and child-safe fanout (`src/extension/fanout-child.ts:141`) `subagent` registrations carry `exposure: "model-only"`, pi refuses `ctx.executeTool("subagent", ...)` for every caller, and the active tool stays declared under codemode `on` and `only`. The reviewer reads these in the installed `node_modules/pi-cohort` package; no gauntlet test asserts them (ticket Out of scope)
- codemode paragraph states direct-only, both modes, illustration, pi link (AC 2) - none: prose; the conformance reviewer checks the clauses in Design "Docs" against `doc/configuration.md`
- `subagent` `tool_call` with `parentToolCallId` and no `action` is not blocked in an entered flow - deletion of the scripted-dispatch block at `extensions/phase-tracker.test.ts:1641-1786` (helpers included); the surviving lone-implementer, cap, and model guard tests show the hook still fires where it should
- `subagent` result observed regardless of `parentToolCallId` - deletion of the nested-result block at `:1922-2008`; the existing direct-result tests for `observeFixWave`, latch, cadence, and nudge are the contract
- #137 re-keying unaffected - existing nested `bash`/`write`/`edit` tests (`extensions/phase-tracker.test.ts:397,440,477`, `extensions/verify-before-ship.test.ts:87,112`, `extensions/telemetry.test.ts:1228`) stay green
- management calls unchanged - existing management-call tests in `extensions/phase-tracker.test.ts` stay green
- guard inventory reads eight / two - none: prose, read by the conformance reviewer
- predecessor banner on the #132 spec present once (already at line 3) - none: checked by spec self-review and the conformance reviewer

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - the codemode paragraphs under "Extensions" (communication contract: which gauntlet tools a script may call and why `subagent` is not one) and the flow-guard inventory (tunable parameters: eight guards, two under `closureReview.enforce`); `README.md` Requirements - pi-cohort floor `>= 7.7.0` (version token only); `CHANGELOG.md` - `## Unreleased` entry citing #135, written in this change
- Derived / memory docs invalidated: `CHANGELOG.md` - deferred: release (promotion of `## Unreleased` to a versioned heading only); `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md` - supersession banner already present at line 3, scope: Design's scripted-dispatch guard, nested-result exclusion, and codemode-mode guidance

Materiality bar: `reference/documentation-impact.md`. The `doc/specs/2026-11-08-gh-133-guard-warnings-keep-structured-result.md` candidate is dropped: its warning re-keying stays live and nothing it says becomes wrong.

## Out of scope

- Any gauntlet test or runtime probe of the installed pi-cohort's `subagent` exposure (ticket Out of scope: validation once at pi-cohort's boundary).
- Removing or changing `extensions/lib/tool-result-warnings.ts`, its callers in `verify-before-ship.ts` and `telemetry.ts`, or their nested tests (#137's contract; `bash`/`write`/`edit` remain script-callable).
- Tracker writes: #132 and #134 are already closed as delivered by #136; the ticket's "close #132 as superseded" and "repair #134" follow-ups have no open target. Any comment linking this spec from them is a gated human-channel write, not part of this flow.
- Historical transcript handling and pi-cohort #47's fork-context stripping (excluded by pi-cohort #49).
- Skill, persona, or prompt edits: the literal `subagent({...})` examples stay as they are; no eval obligation arises.
- Rewriting the v8.4.4 and v8.4.5 CHANGELOG entries: history stays; the Unreleased entry records the reversal.

## Open questions

none
