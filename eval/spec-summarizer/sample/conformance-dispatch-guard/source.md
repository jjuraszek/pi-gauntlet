# Conformance fix-loop dispatch guard

> **Superseded by:** [doc/specs/2026-09-14-fix-round-human-overrule.md](./2026-09-14-fix-round-human-overrule.md) - cap-block escalation paths only (Decisions row "Switch", 3.2 table row 2 block text, section 4 final bullet on documented escapes)

**Goal:** Enforce at runtime, in `extensions/phase-tracker.ts`, the two conformance-loop rules that `doc/specs/2026-09-13-lean-conformance-loop.md` currently states only in prose: after the first conformance audit, implementers are dispatched only as a `tasks` wave, and the number of waves is bounded by `piGauntlet.closureReview.maxFixRounds`. Default `maxFixRounds` moves from 2 to 3.

Amends `doc/specs/2026-09-13-lean-conformance-loop.md` (adds enforcement; does not change the loop shape). Supersedes: none.

## 1. Problem

The lean conformance loop (pi-gauntlet 5.5.2, commit 87a3141) cut each remediation round to "one parallel implementer `tasks` wave -> integrate -> scoped tests -> delta re-audit". The cut reduced the number of prose places that can drift; it enforces nothing. Pre-5.5.2 evidence across 66 consumer sessions (recorded in the lean-loop spec's Problem section): 414 lone `agent: "implementer"` dispatches vs 32 `tasks` waves inside the loop, and 23 conformance re-audits with no fix between them. Source and method: session logs under `~/.pi/agent.balanced/sessions/**/*.jsonl`; per file, count assistant `toolCall` blocks named `subagent` whose `arguments.agent === "implementer"` (lone), whose `arguments.tasks[]` has an implementer entry (wave), and whose `arguments.agent === "conformance-reviewer"` (audit); restrict to files containing `"conformance-reviewer"`.

Two facts sharpen the case:

- **No post-5.5.2 data exists.** 5.5.2 published 2026-09-13T08:27Z. Sessions touched since: 12; with a conformance-reviewer dispatch: 2 - one started 2026-09-12 on the old skills (17 lone / 3 waves), one is the session that built 5.5.2. The prose-only effect cannot be measured; the guard is designed on the pre-5.5.2 evidence.
- **The lone shape is broken, not merely off-script.** In pi-cohort 6.1.0, `params.worktree` is read only on the `tasks` paths (`src/runs/foreground/subagent-executor.ts:1532-1660` foreground, `963-1010` async) and on chain parallel steps; `runSinglePath` (line 1802) never reads it. A lone `agent: "implementer"` runs unisolated in the conformance worktree and produces no `worktree-diffs` patch, so the loop's `git apply` integrate step has nothing to apply.

## 2. Decisions

| Decision | Value |
|---|---|
| Shape guard | **Block** a top-level `agent: "implementer"` dispatch inside the guarded window (section 3.2), regardless of `async` |
| Cap guard | **Block** a dispatch containing an implementer entry when `fixRounds >= maxFixRounds` inside the guarded window; `maxFixRounds: 0` blocks the first wave |
| Phase scope | `verify` only. No `implement`-phase guard |
| Switch | Existing `piGauntlet.closureReview.enforce` (default `true`). `enforce: false` disables both new checks together with the closure-model gate. No new settings key |
| Round unit | One implementer wave = one non-error `subagent` result whose `details.results[]` contains an implementer entry, observed inside the guarded window. Counted at `tool_result`, never at `tool_call` |
| Default cap | `maxFixRounds` 2 -> 3 |
| Reset | `fixRounds` resets exactly where `conformanceDispatched` resets: `phase_tracker start implement` (any form, including `force: true`) and `reset`. `start verify --force` alone keeps both |
| Dispatch metadata | None added. No `phase:` tag; no pi-cohort contract change |

## 3. Design

All runtime changes live in `extensions/phase-tracker.ts`, extending the existing closure ledger. No new hook, extension, or state machine. `GUARD_PHASES` (`["brainstorm", "plan", "implement"]`, line 144) is **unchanged**: the new checks read `phases.verify.status === "in_progress"` directly, never `activeGuardPhase()`, so the bash and branch-switch guards keyed on `GUARD_PHASES` are not armed during verify.

### 3.1 State

`state.fixRounds: number`, sibling of `conformanceDispatched`. Initialised to 0; reset in the two places the latch resets; reconstructed from session history in the same replay pass that reconstructs the latch, using the **same predicate** as the live increment (section 3.3) evaluated against the replayed phase state and latch at that point in history.

### 3.2 Guarded window and `tool_call` guard

**Guarded window** = `gauntletEntered && resolveClosureReview().enforce && phases.verify.status === "in_progress" && conformanceDispatched`.

The checks sit in the existing outer arm `event.toolName === "subagent" && gauntletEntered && closureEnforced()` (line 494), **before** the inner `if (model && !hasAction)` model-omission check, so they run whether or not `closureReview.model` is set. Management calls (`input.action` present) are skipped, exactly as the model guard does. `async` is **not** a bypass: the existing guard has no async check, and an `async: true` lone implementer has the same unisolated defect.

Implementer detection generalises the `conformanceModels` walker (lines 176-192) into `collectAgents(input, name)` returning the matching nodes across `tasks`/`chain`/`parallel` recursion; `conformanceModels` becomes a call to it.

| Input shape | Condition | Outcome |
|---|---|---|
| top-level `agent === "implementer"` | always | block: `Conformance fix loop: dispatch implementers as a one-task tasks wave (tasks: [{ agent: "implementer", worktree: true, ... }]); a lone agent call runs unisolated and produces no worktree diff. To disable this gate, set piGauntlet.closureReview.enforce: false.` |
| `collectAgents(input, "implementer")` non-empty (tasks, chain, parallel) | `fixRounds >= maxFixRounds` | block: `Conformance fix loop: fix round ${fixRounds} of ${maxFixRounds} already used; escalate to the human with the verdict trail instead of re-looping. To disable this gate, set piGauntlet.closureReview.enforce: false.` |
| anything else | - | pass |

The first matching block wins. A nested single-step `chain: [{ agent: "implementer" }]` is not the lone shape (it passes the shape check) but is cap-checked and counted like any other wave.

### 3.3 `tool_result` increment

Predicate (shared with replay): `subagent` result, `isError !== true`, `details.results` is a non-empty array containing an entry with `agent === "implementer"`, and the guarded window holds at that moment. Then `fixRounds += 1`. Mode is irrelevant (`details.mode` is not read), so a chain result increments the same as a `tasks` result. An individual implementer with non-zero `exitCode` still counts - the round happened; the retry is the next round. A dispatch pi-cohort refused (dirty tree, schema error) is `isError: true` or has empty `results` and does not count.

### 3.4 Settings

`extensions/lib/gauntlet-settings.ts` `resolveClosureReview`: default `maxFixRounds` 2 -> 3. Test in `gauntlet-settings.test.ts` updated. No new key; `scripts/ci.mjs` probes are unchanged.

### 3.5 Prose

- `skills/verification-before-completion/reference/conformance-check.md`: line 176 `default \`2\``/`coerces non-integers to \`2\`` -> `3`; the cap sentence names the runtime block ("the phase tracker blocks the wave after the cap"); the retry/conflict-rerun path inside the loop (lines 154-162) states the shape explicitly: a one-task `tasks` wave, which counts as a wave against the cap.
- `skills/dispatching-parallel-agents/SKILL.md` "Review and Integrate": the retry line gains "inside the conformance loop the retry is a one-task `tasks` wave".

### 3.6 Why the distinction needs no metadata

| Shape | Phase | Entered | Latch | Guard |
|---|---|---|---|---|
| SDD sequential task, SR/CR fix re-dispatch, escalation with model override, failure retry | implement | yes | any | pass |
| Verify step 2 whole-diff CR fix rounds and their escalations (`/skill:requesting-code-review`) | verify | yes | unset (run before R0 audit) | pass |
| Conformance fix wave, convergence repair, retry inside the loop | verify | yes | set | `tasks` shape - pass until cap |
| Cap reached | verify | yes | set | escalation goes to the human, no implementer dispatch - nothing to pass |
| Finish-gate fix-now concern projection | ship | yes | any | pass |
| `maxFixRounds: 0` | verify | yes | set | any implementer wave blocked - this is the documented "skip remediation" contract |
| `gatekeep-pr` lone implementer in the shared PR `cwd` (its contract forbids `worktree: true`) | any | - | - | pass in its own session (gatekeep-pr never calls `phase_tracker`, so `gauntletEntered` is false). Precondition: it is not invoked inside a gauntlet session whose verify is in progress with the latch set; if it is, the block is accepted and the operator finishes or skips verify first |
| Ad-hoc implementer in a session that never entered brainstorming (including one that called `start verify` cold) | any | no | - | dormant |

## 4. Edge cases

- Blocked calls never increment `fixRounds` (block at `tool_call`, count at `tool_result`).
- Mixed waves (implementer plus other agents) count as one round.
- `async: true`: shape and cap blocks apply unchanged. An async result carries `results: []` and therefore never increments (same as today's latch), so an async wave that slips past the cap check is not a budget source either.
- Subagent children (`PI_SUBAGENT_DEPTH`) keep the existing no-op behaviour.
- Session fork/resume: replay applies the section 3.3 predicate against replayed state, so a resumed session enforces the same budget as the live one.
- `enforce: false`: both checks off; the closure-model gate is off as today.
- Verify re-entered with `force: true` without passing through `start implement`: latch and counter survive, so `skip verify` + `start verify --force` cannot reset the budget.
- The guard adds no dispatch, pass, or gate to a compliant run; a round-1 convergence still stops at round 1. `fixRounds` is not exposed in `phase_tracker status`; the block message reports `N of M`, and the documented escapes are `start implement`, `reset`, or `enforce: false`.

## 5. Testing

`extensions/phase-tracker.test.ts`, existing mocked-`ExtensionAPI` harness:

- lone implementer: blocked when entered + verify + latch, with and without `closureReview.model` set, with `async: true` and without; passes pre-latch in verify, in implement, in ship
- dormancy: a session that never entered brainstorming, `start verify` called cold, latch set - every shape passes
- implementer wave: passes at rounds 1..3 with defaults, blocked at 4; `maxFixRounds: 0` blocks the first wave; `maxFixRounds: 1` blocks the second; a `chain` containing an implementer is cap-checked and counted
- counter: a blocked call does not increment; `isError: true` does not increment; empty `results` does not increment; a wave with a non-zero implementer exit increments; a non-implementer wave does not increment; a ship-phase implementer wave with the latch set does not increment
- reset: `start implement` and `reset` zero the counter; `start verify --force` does not
- reconstruction: replaying a history with a conformance result followed by two implementer waves in verify yields `fixRounds === 2`; the same history with the waves in ship yields 0
- `closureReview.enforce: false`: every shape passes

`extensions/lib/gauntlet-settings.test.ts`: `resolveClosureReview({}).maxFixRounds === 3`.

## 6. Out of scope

- Implement-phase dispatch-shape guards (serial implementers inside a multi-task SDD wave).
- A `phase:` tag or any other dispatch metadata contract with pi-cohort.
- Making single-agent `worktree: true` isolated in pi-cohort.
- Re-measuring the 414:32 ratio; no post-5.5.2 consumer data exists.
- Detecting a conformance re-audit with no fix wave between (the 23-event class). This spec enforces the two rules the user asked for - lone shape and wave cap; a re-audit guard would need its own block/warn decision and is separate work.
- Exposing `fixRounds` in `phase_tracker status`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs:
  - `doc/configuration.md`: line 12 and line 23 default `2` -> `3`; line 23's closing sentence "Enforced by the protocol prose in ..., not by the phase-tracker extension." rewritten to describe the runtime shape block and cap block and the `enforce: false` switch; the closure-review paragraph at line 19 gains the two new blocks; the "Six guards" list (lines 81-88) becomes eight and names them
  - `skills/verification-before-completion/reference/settings-precedence.md` line 25: `maxFixRounds` 2 -> 3
  - `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: none

Materiality bar per `reference/documentation-impact.md`. Skill-body edits (section 3.5) are implementation surface, not doc-impact entries.
