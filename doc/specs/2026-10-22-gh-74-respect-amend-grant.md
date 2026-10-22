# Respect the amend grant and fund fix rounds in implement

**Goal:** The implement orchestrator stops only for approvals the human has not already given: an amend-class question under an active `**Amend-grant:**` applies its recommended edit in the same turn, and a fix-round budget on the same grant line continues a stalled loop past the escalated round until the budget is spent. The header line stays the single grant carrier; a phase-tracker mirror ships in this gauntlet only if the eval shows the prose fix is not followed.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Ticket: jjuraszek/pi-gauntlet#74. Framing: kept.

## Problem

Three sentences in `skills/subagent-driven-development/SKILL.md` contradict the grant semantics that `skills/brainstorming/reference/amendment-surface.md` already defines. Line 48 routes spec-defect findings to the amendment path "it reviews first, stops only on escalation or redraw" but never names the grant; line 109 classifies "scope choices, option choices, and another-round approval" as decisions, which is the stop-and-ask path; line 341 exempts "a spec amendment" from the no-pause rule without a grant qualifier. The surface (`## Standing grants`, section 1 line 57) says an active grant skips steps 2-4, applies every item, prints `amended the spec: <title> - <what>`, and records `granted`. The orchestrator reads the SDD sentences first and stops with an option menu that acknowledges the grant it is ignoring ("Under your amend grant I'll record this as a spec amendment ... Objection?" in the ticket's examples). The ticket reports 5 of 25 implement-phase stops and 374 wait minutes in the last 15 consumer runs from this class; those figures are consumer telemetry and not checkable here, and the design does not depend on them.

The second class is fix-loop exhaustion: after the escalated round the loop stops with a stop note and the human replies "one more round" (6 of 25 stops, 707 minutes by the ticket's count). No standing budget exists; `grant_fix_rounds` is verify-phase only (`extensions/phase-tracker.ts:1208-1218`, per `doc/specs/2026-09-14-fix-round-human-overrule.md`) and the implement loop counts rounds by prose, not by tool. The stop-note line `budget: <spent> of <N> spent` named by the ticket does not exist yet.

Premises verified: the contradiction above (read SDD lines 44-50, 96-112, 336-348 and the surface lines 1-60); the grant lives only on the header line and no extension reads it (`rg Amend-grant extensions/` is empty); the orchestrator's stop is an assistant turn end with no tool call, and `agent_settled` (`extensions/phase-tracker.ts:587-602`) fires only recovery-edge messages, so no deterministic hook observes the stop itself. The eval target `eval/subagent-driven-development/target.json` slices SDD at `## Fix-Loop Rounds`..`## When a Subagent Fails` (includes `## Implementer Status` and the classify line) and `## After All Tasks Complete`..`## Red Flags` (excludes the Red Flags list); `stop-note.md` is bundled whole; line 48 is outside both slices. Implicit dependencies: `gh issue view 74` - found, no comments; section 5 aftermath in the surface - found; STAGNANT verdict line - found at SDD 60-67; the wave commit - found in the Status table `DONE` row; the budget stop-note line - not found, added by this spec.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#74, checkbox list, rows verbatim:

- [ ] `skills/subagent-driven-development/SKILL.md` defines a question whose candidate answers are each an edit to the spec, the plan, or an approved rule as an amendment batch handled per `brainstorming/reference/amendment-surface.md`, distinct from a decision; the "Classify each question" sentence and the `NEEDS_CONTEXT` / `BLOCKED` rows name that route, and the same place states the amend-vs-redraw test in one sentence quoting the grant's redraw definition (changed problem statement; component added, removed, or re-bounded).
  in-scope
- [ ] With the spec's `**Amend-grant:**` line active, the orchestrator applies each amend-class item's `recommended` alternative in the same turn - no option menu, no "Objection?" turn end - prints `amended the spec: <title> - <what>`, and runs the amendment surface's section 5 aftermath (plan-writer amend dispatch, `plan_check`, tracker update, one `amend:` commit).
  in-scope
- [ ] The Red Flags pausing exemption keeps its existing list (`NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation, a workflow warning) and replaces only "a spec amendment" with "a redraw, or an amend with no standing grant".
  in-scope
- [ ] `eval/subagent-driven-development/samples/` gains two samples: (a) grant active, a review finding needs a spec rule change with three candidate edits inside one component - must-hold: the transcript ends with the amend applied and the plan-writer dispatch, no question to the human; (b) grant active, the candidate edits add a component - must-hold: the orchestrator stops as a redraw and does not auto-apply. `node eval/run.mjs subagent-driven-development` reports both holding and no previously holding fact moved to fails.
  in-scope
- [ ] `skills/brainstorming/reference/spec-finalization.md` gate option 2 and `skills/brainstorming/reference/amendment-surface.md` "Standing grants" accept a fix-round budget in the granting sentence in exactly these forms - `fund N fix rounds` or `N more fix rounds`, N a positive integer - carried on the same `**Amend-grant:**` line and read through the existing predicate; the gate menu shows the form; a sentence without a budget behaves as today, and a grant already written without one is not reinterpreted.
  in-scope
- [ ] `skills/subagent-driven-development/SKILL.md` "Fix-Loop Rounds": with a budget of N, an issue-bearing re-review after the escalated round consumes one budgeted round (same fix payload, same review gate) instead of stopping; the budget is per task, resets at each task's loop, and is independent of the escalated round; a `STAGNANT` trajectory verdict (the existing reviewer-emitted line) at any budgeted re-review still stops; after N rounds the stop note carries `budget: <N> of <N> spent`.
  in-scope
- [ ] `eval/subagent-driven-development/samples/` gains samples for: budget 2 with a clean second budgeted re-review - must-hold: no human stop, the task completes at the wave commit (the existing commit that closes a wave); budget 1 exhausted with issues remaining - must-hold: stop note with `budget: 1 of 1 spent`; `STAGNANT` at the first budgeted re-review - must-hold: stop; grant without a budget - must-hold: today's stop after the escalated round. `node eval/run.mjs subagent-driven-development` reports all holding and no previously holding fact moved to fails.
  in-scope
- [ ] CHANGELOG entry naming both phases.
  in-scope

Cut question asked at step 3 (phase 2 rows and the CHANGELOG row): the user chose A, all rows in-scope.

## Design

### Grant carrier and value decoding

The grant stays one physical line in the spec header, `**Amend-grant:** <value>`, read through the surface's existing structural predicate, which does not change: exactly one line, trimmed value `none` means no grant, any other non-empty single-line value is active, two lines or a continued value is malformed. `skills/gauntlet-resume/SKILL.md` check 6 keeps that predicate and prints the value verbatim; it never decodes or acts on it. `scripts/ci.mjs` `tokenChecks` and the `scripts/brainstorming-contract.test.mjs` markers stay satisfied.

`## Standing grants` in `amendment-surface.md` gains one paragraph, **Value decoding**, that every consumer of an active value runs (surface section 1 at each batch boundary for the amend capability; SDD "Fix-Loop Rounds" at each funded dispatch for the fix-round capability; `spec-finalization.md` once before it writes the value):

| Step | Rule |
|---|---|
| Budget token | match `fund N fix rounds` or `N more fix rounds` anywhere on the line, N matching `[1-9][0-9]*`; exactly one match -> funded rounds = N; no match -> no funded rounds |
| Malformed budget | two or more matches, or a token-shaped phrase whose N is not a positive integer (`fund 0 fix rounds`, `fund three fix rounds`, `-2 more fix rounds`) -> malformed value: stop and quote the line, the same handling as a malformed line; the consumer stops before any item applies or any round is funded |
| Amend permission | the value with the budget token and its separators (`; `, `, `) removed; non-empty remainder -> amend permission under the existing wording-agnostic rule (the gate's digit-2 description, `auto-apply amends`, `apply spec fixes without asking`, or the same intent in other words); empty remainder -> budget-only value, no amend permission |

Examples: the digit-2 description alone -> amend permission, no funded rounds (a grant written before this change decodes exactly as today and is not reinterpreted); `auto-apply amends; fund 3 fix rounds` -> both; `2 more fix rounds` -> budget-only, amend batches present their menu as today. The budget is non-retroactive: rounds spent before the line was written do not count against or toward it. Revocation (`revoke auto-apply amends` and the existing forms) sets the value to `none` and removes both capabilities; a human who wants funded rounds without amend permission hand-edits the value to the budget token alone.

Section 1's "grant active" sentence becomes: active with amend permission -> skip steps 2-4, apply every item at its `recommended` value (`accept` or the named `alt-n`, never `accept` by default), print one line each `amended the spec: <title> - <what>`, record `granted`; a budget-only value takes the ordinary steps 2-4.

### Gate option 2 and the written value

The option-2 label `2 - approve, auto-apply amends:` and its description stay byte-identical (the CI token check and the digit-2 substitution anchor in `spec-finalization.md` and `amendment-surface.md` depend on it). One line is added directly under the three rows of the gate menu:

```
Add "; fund N fix rounds" (or "N more fix rounds") to 1 or 2 to fund N implement fix rounds past the escalated round.
```

The "Wait for the user" paragraph gains the reply rules:

| Reply | Written value |
|---|---|
| bare `2` | today's description, no budget |
| `2` + budget token (`2; fund 3 fix rounds`, `2, fund 3 fix rounds`) | today's description + `; fund 3 fix rounds`; the suffix is not a change request |
| `1` + budget token | `fund 3 fix rounds` alone (budget-only: funded rounds, no amend permission) |
| approve prose + budget token | the prose verbatim, collapsed to one line as today |
| budget token alone (`fund 3 fix rounds`) | not an approval and not a grant; re-present the gate asking for `1` or `2` |
| budget token with malformed N | a change request is not implied; re-present the gate quoting the token |

The gate runs value decoding before the `edit` and the `--amend`; a malformed token never reaches the header line.

### SDD routing (phase 1)

Edits to `skills/subagent-driven-development/SKILL.md`, in place, each a reworded sentence:

| Site | Today | After |
|---|---|---|
| Prerequisites, line 48 | "read and execute brainstorming's amendment path in place (it reviews first, stops only on escalation or redraw)" | "... in place (it reviews first; with amend permission on the `**Amend-grant:**` line it applies amends without a stop and still stops on a redraw; without permission it stops on escalation or redraw)" |
| Implementer Status, classify sentence line 109 | "scope choices, option choices, and another-round approval are decisions" | a new first clause: a question whose candidate answers are each an edit to the spec, the plan, or an approved rule is an amendment batch per `../brainstorming/reference/amendment-surface.md`, never a decision; the amend-vs-redraw test in one sentence quoting the surface's redraw definition (changed problem statement; component added, removed, or re-bounded); then the existing fact/decision split for what remains, with "another-round approval" a decision only when no funded round remains |
| `NEEDS_CONTEXT` / `BLOCKED` rows | name fact ask vs decision | each row names the amendment route for a spec-defect citation before its existing text |
| Red Flags, line 341 | "... a workflow warning, or a spec amendment" | "... a workflow warning, a redraw, or an amend with no standing grant" |

With amend permission the orchestrator applies each amend-class item's `recommended` alternative in the same turn (section 1's grant-active path above), then runs section 5 (plan-writer amend dispatch when a plan exists, `plan_check`, tracker update, one `amend:` commit). A redraw stops exactly as today regardless of grant. Without permission the amendment path presents its menu as today.

### Funded rounds (phase 2)

The allowance is called **funded rounds** (the grant budget) everywhere in SDD; the existing uses of "budget" for the ordinary review 1-4 sequence ("counts as **one** fix against this budget", "earlier than the ordinary budget") are unchanged and ordinary fan-out counting is unchanged.

The three existing stop sites are reworded in place, so no later rule contradicts them:

| Site | Today | After |
|---|---|---|
| Continuous Execution, line 33 | "An escalated round fails (stop note per Fix-Loop Rounds)" | "An escalated round fails with no funded round left (stop note per Fix-Loop Rounds)" |
| Escalate paragraph, line 71 | "Any review with issues, a non-`DONE` status, or a dispatch error -> stop note per `stop-note.md`; no second dispatch." | "A non-`DONE` status or a dispatch error -> stop note per `stop-note.md`. A review with issues -> a funded round while one remains for the task (below), otherwise stop note; no other second dispatch." |
| `reference/fix-loop.md` "Funded rounds" | (no text) | "Emit the task's stop note for the funded-stop outcomes above (including `STAGNANT`) and an escalated-round failure with no funded round left." |
| Red Flags, line 347 | "continuing past `STAGNANT` instead of escalating" | "continuing past `STAGNANT` instead of escalating (or, on a funded re-review, stopping)" |

The Escalate paragraph then gains the funded-round rule:

- **Dispatch.** A funded round repeats the escalated round's dispatch exactly: same fix payload shape, same isolation knobs, the prior report verbatim, `model: <implModel>` from `escalationLoop`, `context: "fresh"`, `async: false`, one implementer, no fan-out; then the same review gate (SR then CR on `Behaviour-change: yes`, else the triggering reviewer with the re-review marker). `implModel` undefined stops before any escalated round as today; funding never stands in for the model setting.
- **Spending.** Before each funded dispatch the orchestrator prints `funded round <k> of <N> for task <n>` and decodes the current header value (a value changed mid-loop takes effect at this read). An issue-bearing re-review after the escalated round consumes one funded round instead of stopping. A funded dispatch that errors or returns non-`DONE` stops and counts as spent. A `STAGNANT` trajectory verdict at any funded re-review stops, whatever remains. After N rounds are spent, an issue-bearing re-review stops. The review-3 convergence exception still fires at most once per loop; funding does not re-arm it.
- **Ledger.** One ledger per plan task, starting at 0 when that task first enters Fix-Loop Rounds, carried across its SR loop, the behaviour-change reroute, and wave repairs that re-enter its SR; the SR-to-CR transition does not reset it and the wave holds no allowance of its own. A CR fix in a multi-task wave spends from every task whose files the fix touches (the same owner rule the SR re-review targeting already uses); a touched task with nothing left stops the wave with that task's stop note.
- **Resume.** The header line is restored by `2026-10-04-resume-restores-amend-grant.md`; the spent count is recovered from this task's `funded round <k> of <N>` lines in the restored transcript. When none is recoverable the ledger is treated as exhausted: the next issue-bearing re-review stops with `budget: <N> of <N> spent (not recovered on resume)`, and the human refunds by writing a new budget token on the line. A resume never renews a task's funding on its own.

The budget never feeds `grant_fix_rounds` or the verify-phase conformance cap; `doc/specs/2026-09-14-fix-round-human-overrule.md` is unchanged.

### Stop note

`stop-note.md` stays byte-identical to its pre-change text; `reference/fix-loop.md` "Funded rounds" owns the budget line, `budget: <spent> of <N> spent`, which every stop note places directly after the `Problem:` line and its `Searched:` lines and before the `<file:line>` line. Rules: the line is required on every stop note while the header value carries a budget token (including a pre-escalation stop, `implModel` undefined, or a fact-ask exhaustion, where `<spent>` is 0) and omitted when no token exists; it is the one exception to `stop-note.md`'s "No trajectory verdicts, round history, review counts" rule. Why not edit `stop-note.md`: with the rule edited into its template, `chain-wave-dispatch` answers dropped the stop-and-retain clause from the replacement-snapshot step (`snapshot-rereview` failed on 3 of 4 fresh Opus replays); with `stop-note.md` at its base text and every other edit kept, it held on 3 of 4, and the one miss did not survive its confirmation replay.

### Size constraint

`skills/subagent-driven-development/SKILL.md` is 46,400 bytes / 369 lines against the `npm test` instruction-size lint limit of 50,000 bytes / 2,000 lines. The edits above are rewordings plus the funded-round rule and are budgeted to fit. If the implementation lands the file at or over 49,000 bytes, the same task extracts the Escalate paragraph and the funded-round rule to `skills/subagent-driven-development/reference/fix-loop.md` per forge-skill's oversized-skill extraction, with SDD keeping the round table and a `read` pointer. The extraction is a preparatory commit that moves the pre-change text verbatim (no behavior change) and adds the new file to `eval/subagent-driven-development/target.json` `skillFiles`, in the same way `intent.md` records preparatory baseline `557b2a3`; the behavior-changing edits land after it and the eval comparison runs with `--base <preparatory commit>` so both arms assemble the reference (a file with no version at the baseline refuses the run, per `eval/README.md`). `intent.md` names the preparatory commit.

### Mechanical fallback, in this gauntlet

The fallback is approach 3 from the brainstorm: the grant mirrored into phase-tracker state. The plan carries it as the last task with a trigger condition: it runs only when, after the prose tasks, `node eval/run.mjs subagent-driven-development` still reports the `amend-under-grant` or `budget-continues` fact failing. When the samples pass, the task is recorded `skipped` in `plan_tracker` and the reason `not needed: samples pass` is written into the plan task's text and `eval/subagent-driven-development/report.md`'s change note (`plan_tracker` tasks carry only `{ name, status }`); the verify conformance check reads it there. The post-release ten-run re-measure named by the ticket is outside this gauntlet and gates nothing here.

Contract when it runs:

| Item | Rule |
|---|---|
| Action | `phase_tracker({ action: "grant_amends", amends: <boolean>, rounds: <N or 0> })`; the caller decodes the header value per Standing grants and passes the two capabilities; details echo `{ action, amends, rounds }` |
| State | `amendGrant = { amends, rounds }` beside `fixRoundCredits`; cleared on `start implement`, `complete implement`, and `reset`; `reconstructState` replays the last `grant_amends` details and the same clears, as it does for `grant_fix_rounds` |
| Delivery | parent only (`!isSubagentChild`), while `implement` is `in_progress`; stashed at `tool_call` through `addGuardWarning` and prepended at `tool_result` on the four tools that flush the stash today (`subagent`, `bash`, `write`, `edit`); nothing observes a turn that ends with no tool call |
| Reminder text | `amends: true` -> `amend grant active: apply each amend item's recommended edit in this turn, do not ask`; `rounds > 0` -> `funded rounds active: <N> per task past the escalated round, continue instead of stopping`; both when both |
| Synchronization | the implement skill's prerequisites call the action at implement start and again after every `amend:` commit and every revocation (the surface's batch boundaries); a revoked grant calls it with `amends: false, rounds: 0`, which invalidates the mirror; `skills/gauntlet-resume/SKILL.md` calls it after check 6 when the resumed phase is implement (a skill edit with its own `eval/gauntlet-resume/` sample) |
| Source of truth | the header line; the mirror is never written to the spec or the squash, and a header value that changed by hand is re-mirrored at the next batch boundary |
| Tests | `extensions/phase-tracker.test.ts`: decode-free action storage, both reminder strings, parent-only delivery on the four tools, clears, and `reconstructState` replay |
| Docs | `doc/configuration.md` gains the `grant_amends` row only when this task runs |

Proof seam: the text eval runs with `--no-tools` and `--no-extensions`, so it cannot receive the extension's output. The unit tests pin the two reminder strings and their delivery conditions; two samples, `amend-under-grant-reminder` and `budget-continues-reminder`, carry in `case.md` the prior dispatch's tool result prefixed with those exact strings (the same text the unit test asserts), so the replay receives the reminder the extension would deliver. The pass bar after the fallback is a fresh full-target run reporting those two facts and the original six holding with no regression; if either still fails, the pass bar is unmet and the finish stops with that as a blocker rather than claiming the fallback works.

Contract tests: `scripts/brainstorming-contract.test.mjs:119-134` asserts marker strings in `amendment-surface.md`; the value-decoding paragraph adds matching asserts (`fund N fix rounds`, `N more fix rounds`, `budget-only`, the non-retroactive sentence).

## Errors and edge cases

| Case | Behavior |
|---|---|
| Budget token with N = 0, negative, or non-integer | malformed value; the consumer stops quoting the line before any item applies or round is funded |
| Two budget tokens on one line | malformed; same stop |
| Budget token alone, no amend wording | valid budget-only value; amend batches present their menu; the fix loop uses the funded rounds |
| Budget written mid-loop at round k | decoded at the next funded dispatch read; funds rounds k+1 .. k+N; `spent` starts at 0 |
| `STAGNANT` at any funded re-review | stop; stop note carries `budget: <spent> of <N> spent` |
| Funded dispatch errors or returns non-`DONE` | stop; that round counts as spent |
| `implModel` undefined with a budget | today's stop before any escalated round; `budget: 0 of <N> spent` |
| Review-3 convergence exception under funding | fires at most once per loop as today; funding does not re-arm it |
| CR fix in a multi-task wave | spends one round from each touched task's ledger; a touched task with none left stops |
| Redraw with amend permission (component added, removed, re-bounded; problem statement changed) | stop as today, no auto-apply |
| Amend with permission and a `recommended` of `alt-n` | `alt-n` applies, not `accept` |
| Grant line absent or `none` | every path behaves as today |
| Resume mid-implement | header line restored; `spent` recovered from `funded round <k> of <N>` lines, otherwise treated as exhausted with `(not recovered on resume)` in the stop note; no new handoff grammar |
| Fallback mirror after revocation | `grant_amends` with `amends: false, rounds: 0` at the batch boundary; no reminder is delivered afterwards |
| SDD at or over 49,000 bytes after edits | extraction per Size constraint via the preparatory commit |

## Tests

`npm test` (`scripts/ci.mjs`) covers the instruction-size lint, the contract markers in `scripts/brainstorming-contract.test.mjs`, the `2 - approve, auto-apply amends:` token check, and the eval structural lint. If the fallback runs, `extensions/phase-tracker.test.ts` gains the cases in the contract table.

Eval, `eval/subagent-driven-development/samples/`: new samples, each a `case.md` with any `bundle+`/`bundle-` lines and an `expected.md`, shaped like the existing `lookup-before-ask` sample. The two grant samples carry `bundle+: skills/brainstorming/reference/amendment-surface.md` (present at the baseline) because the text replay follows no `read` pointer and the apply/aftermath procedure lives in the surface; the classify clause, the Red Flags row, and both budget forms sit inside the bundled SDD slices (`## Fix-Loop Rounds`..`## When a Subagent Fails`) or `stop-note.md`, so the funded-round samples need no extra bundle. Line 48 stays outside the slices; its reword is covered by the classify clause carrying the same rule.

| Sample | Scenario | Must hold |
|---|---|---|
| `amend-under-grant` | amend permission; review finding needs a spec rule change with three candidate edits inside one component, `recommended` is `alt-2` | transcript ends with `amended the spec: ...` applying `alt-2` and the plan-writer dispatch; no question to the human |
| `redraw-under-grant` | amend permission; candidate edits add a component | orchestrator stops as a redraw, does not auto-apply |
| `budget-continues` | `fund 2 fix rounds`; escalated round has issues; second funded re-review is clean | no human stop; task completes at the wave commit |
| `budget-exhausted` | `fund 1 fix rounds`; issues remain after the funded round | stop note with `budget: 1 of 1 spent` placed after `Problem:` |
| `stagnant-under-budget` | `fund 2 fix rounds`; `STAGNANT` at the first funded re-review | stop |
| `grant-no-budget` | `auto-apply amends` only; escalated round has issues | today's stop after the escalated round, no `budget:` line |
| `budget-only-value` | `2 more fix rounds`; a review finding needs a spec rule change | the amendment menu is presented (no auto-apply); the fix loop later continues past the escalated round |
| `multi-task-wave-ledger` | `fund 1 fix rounds`; a two-task wave's CR fix touches both tasks' files twice | the second fix stops with one task's stop note at `budget: 1 of 1 spent`; no wave-level allowance |
| `exhausted-on-resume` | `fund 2 fix rounds`; resumed mid-loop with no `funded round` line in the transcript; escalated round has issues | stop note with `budget: 2 of 2 spent (not recovered on resume)` |
| `amend-under-grant-reminder` (fallback only) | as `amend-under-grant`, prior tool result prefixed with the amend reminder string | as `amend-under-grant` |
| `budget-continues-reminder` (fallback only) | as `budget-continues`, prior tool result prefixed with the funded-rounds reminder string | as `budget-continues` |

`eval/brainstorming/samples/` gains `grant-budget-reply` with `bundle+: skills/brainstorming/reference/spec-finalization.md` (present at the baseline): reply `2; fund 3 fix rounds` at the gate - must hold: the written value is the option-2 description plus `; fund 3 fix rounds`, no change-request round; reply `fund 3 fix rounds` alone - must hold: the gate re-presents, nothing is written.

Maintenance, in the same change as the skill edits: run `node eval/run.mjs <target> --baseline-only` once after adding samples or changing any `bundle+`/`bundle-` line (new sample directories have no baseline record); every `bundle+` path must exist at the merge-base; refresh each target's `intent.md` `for:` to the new bundle-free assembly SHA and list each new fact as `fails -> holds`; review `wordCap` (1100 here) against the expected reply length of the amend-aftermath samples (amend line, plan-writer dispatch, `plan_check`, commit), not against bundle growth - raising it is a Design clause of the plan, not a new decision.

Pass bar: `node eval/run.mjs subagent-driven-development` and `node eval/run.mjs brainstorming` report every new fact holding and no previously holding fact moved to fails, with each `report.md` committed before the finish.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` `## Unreleased` entry naming both phases (major procedures / conventions - the ticket's own row); `README.md#configuring-the-gates` only if it quotes the gate option 2 sentence (communication contract) - checked at plan-writing, dropped if it does not
- Derived / memory docs invalidated: none - `doc/configuration.md` documents `grant_fix_rounds` as verify-phase and that stays true; the budget is a spec-header token, not a settings key; `grant_amends` is documented there only if the fallback task fires

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- Mid-implement context handoffs, worker environment repair, and the rejected Google sign-in blocker (ticket Out of scope).
- Telemetry classification of stops; the ticket's re-measure is by session text after release.
- Any change to `grant_fix_rounds` or the verify-phase conformance cap.
- The tool-result reminder nudge without tracker state (dropped at step 4 in favor of approach 3).
- A `spent` carrier in the handoff brief or resume grammar; recovery reads the transcript only.

## Open questions

none
