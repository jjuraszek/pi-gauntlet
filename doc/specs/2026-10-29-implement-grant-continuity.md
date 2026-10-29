# Implement-phase grant continuity: escalated rounds and recommended paths in both engines

**Goal:** Under an active amend grant, every implement-phase execution failure that is not a hard stop first spends one escalated-model round, every stop whose `Recommendation:` names work the grant already authorizes is taken, and the human is called only when no authorized recommended way forward exists.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** `doc/specs/2026-10-22-gh-74-respect-amend-grant.md` - extended, not superseded: that spec pushed the grant into the waves review fix loop; this one covers the implementer-failure stops in both engines.

## Problem

Six implement-phase stops in recent runs fired under an active grant (bare `2` or `5` at the spec gate, some with `fund N fix rounds`), and every human reply was a variant of "continue, don't ask":

| # | Engine | Stop | Governing text |
|---|---|---|---|
| 1 | loop | `Stopped: verification failed with every row closed` (one stale assertion), `fund 50 fix rounds` on the grant line | `skills/loop-implementation/SKILL.md:175` "Further work requires a human decision"; no funding clause |
| 2 | loop | same stop with funded rounds left; the human had earlier named an escalation model | `skills/loop-implementation/SKILL.md:70` "Funding buys neither ... nor an escalated model"; `rg escalationLoop skills/loop-implementation agents/loop-implementer.md` returns nothing |
| 3 | waves | `BLOCKED`: scoped tests pass, a type check rejects a function as too complex; options A) another repair B) separate change | `skills/subagent-driven-development/SKILL.md` Implementer Status `BLOCKED` row: "For decisions, stop and diagnose ... or escalate to the user" |
| 4 | waves | workers returned incomplete work twice | `skills/subagent-driven-development/SKILL.md` When a Subagent Fails: "After 2 failed attempts: STOP"; no escalated model, no funded round |
| 5 | waves | implementer found an off-by-one in an approved drafted AC row (`>` vs `>=`) | `skills/brainstorming/reference/amendment-surface.md:3` and its twin `skills/brainstorming/SKILL.md:196` - a text change to an approved drafted AC row is a redraw; `amendment-surface.md:160` "Never auto-edit ticket or approved drafted AC row texts" on the ledger path |
| 6 | waves | mid-amendment plan baseline fails at an intermediate commit; menu fix-first / narrow / amend with a recommendation | `skills/writing-plans/SKILL.md:79` step-6 menu waits; `amendment-surface.md:169-171` renders the same menu for unchanged-command and writer-only failures "then pause" |

Root cause: the grant line carries amend permission (spec text, redraws excluded) and `fund N` (waves: review-fix rounds inside Fix-Loop Rounds; loop: per-row attempts), and `escalationLoop.implModel` fires only inside the waves review loop (`skills/subagent-driven-development/reference/fix-loop.md:3`). Stops 1-4 and 6 are implementer-execution failures outside both capabilities and the escalation point; no spec edit resolves them. Stop 5 is the redraw exclusion applied to an evidenced one-token correction.

Premises: the governing clauses are unchanged since v7.37.0 (`git log v7.37.0..HEAD` on the five files touches other sections), so the incidents describe current source. `escalationLoop.implModel` resolves whenever the session has a model: `extensions/lib/gauntlet-settings.ts:115-118` falls back to the main-loop model, and `mainLoopModel` (`:143-148`) returns `undefined` without `ctx.model` (pinned by `gauntlet-settings.test.ts:92`), so the existing missing-model stop stays. The package version behind the Oct 25-28 runs is not recoverable from transcripts; unverified and non-blocking.

Framing: pivoted to the grant as the implement-phase autonomy budget in both engines - the ask named spec amendment as the lever, but five of six stops are not amend-shaped. User additions: amend permission implicitly grants one escalated-model round before any human stop; a stop carrying a `Recommendation:` is taken, never asked. Stop-survival decision: stops with no recommendation, and redraws of the problem statement or a component boundary, still stop; an evidenced AC row text correction auto-applies.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] Loop engine: a row whose attempts reach its allowance (3 + funded N, or the retry's `allowed attempts`) under amend permission, when rules 3-4 of the ordered table would not stop, gets one escalated dispatch with `model: <implModel>` after the parent appends `row <n> escalated | implModel round | allowed attempts <attempts + 1>`, commits `loop: escalate row <n>`, and prints `escalated round for row <n>`; the human stop fires when that dispatch also leaves the row unresolved and the stop's `Recommendation:` is `none` or budget-shaped. One escalated decision per row ever; with a budget-only or absent grant the row stops at its allowance as today, and funding alone never changes the model.
  in-scope
- [ ] Loop engine: exit verification failure under amend permission, with `iterations < cap`, dispatches one `implementer` repair on `implModel` in the failing leg's checkout carrying the failing output, the absolute spec path, and that leg's verification command; the parent bumps iterations once, requires a clean tree and exactly one commit, commits `loop: repair verification`, reruns that command once, and on the second failure stops with `Stopped: verification failed with every row closed` plus `escalated round spent` unless the stop's `Recommendation:` names a takeable `amend`.
  in-scope
- [ ] Waves: an implementer `BLOCKED` or `NEEDS_CONTEXT` decision under amend permission that the orchestrator would present with `Recommendation: <option> - <why>` naming a concrete change within the task's remaining attempts re-dispatches with that option after printing `took recommendation: <option> for task <n>`; the stop renders for `Recommendation: none - <why>`, for a recommendation that spends budget or consent, or when the stop's evidence repeats one already auto-resolved on the same task.
  in-scope
- [ ] Waves: after two failed implementer attempts on a task under amend permission, a third attempt runs with `model: <implModel>`, `context: "fresh"`, same payload, after `escalated round for task <n> after 2 failed attempts`; the stop fires only when it also fails and its `Recommendation:` is `none` or budget-shaped.
  in-scope
- [ ] A text correction to an approved drafted acceptance-criteria row backed by implementer evidence (a quoted test, assertion, or code line) is an amend item in every owning clause (`subagent-driven-development/SKILL.md` classification, `brainstorming/SKILL.md:196`, `amendment-surface.md:3` and its ledger aftermath sentence at `:160`): under amend permission it applies without a stop and lands in the `amend:` commit audit body; ticket rows, row add/remove, and a change to the problem statement or a component boundary still stop as a redraw.
  in-scope
- [ ] Plan baseline failure menu (writing-plans step 6, and the amendment aftermath's rendering of it) under amend permission takes its `Recommendation:` without waiting: `narrow <filter>` re-dispatches with that filter, `amend` runs section 5, `fix-first` enters `/skill:shape-ticket` whose own gate is the only remaining stop; `Recommendation: none` waits.
  in-scope
- [ ] Every implement-phase stop note, including the loop `## Human stop`, ends with `Recommendation: <option> - <why>` or `Recommendation: none - <why>`; a stop without a recommendation line is a contract miss.
  in-scope
- [ ] Hard stops are unchanged under any grant: iteration cap, funded re-review `STAGNANT`, empty-commit stagnation, dirty-tree or commit-boundary returns, `REJECT`, malformed grant line, missing `implModel`, and any recommendation that spends consent or budget (`cap +N`, more rounds or attempts beyond the one escalated round, a redraw).
  in-scope
- [ ] `npm test` passes after the edits, including the instruction-size lint (`skills/subagent-driven-development/SKILL.md` under 50,000 bytes).
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: grant-continuity
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; node eval/run.mjs subagent-driven-development; node eval/run.mjs loop-implementation; node eval/run.mjs writing-plans
Rules: AGENTS.md
Rules: doc/configuration.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
scope: none
design: owns every path under `skills/`, `eval/`, `doc/`, `README.md`, and `CHANGELOG.md` named in Design.

## Design

One ordered procedure, written as one clause at each stop site (approach 1: inline, reuse-only; no new file, setting, or persona). Amend permission is the `**Amend-grant:**` line decoded per `amendment-surface.md` Value decoding; budget-only, `none`, or absent gives nothing here.

> 1. Hard stops win and stop first: iteration cap, funded re-review `STAGNANT`, empty-commit stagnation, dirty-tree or commit-boundary returns, `REJECT`, malformed grant line, missing `implModel`.
> 2. A decision stop (`BLOCKED`/`NEEDS_CONTEXT` decision, the baseline menu, the loop human stop) whose `Recommendation: <option>` names work the grant already authorizes - an amend item, a re-dispatch with a named change inside the task's remaining attempts, a `narrow <filter>`, a `fix-first` ticket through `/skill:shape-ticket`'s own gate - is taken: print `took recommendation: <option> for task <n>` / `for row <n>` and continue. No escalated round precedes a decision.
> 3. An execution failure (two failed waves attempts, a loop row at its allowance, a loop exit verification failure) first spends one escalated round on `escalationLoop.implModel` (`gauntlet_setting({ key: "escalationLoop" })`); when it fails, the resulting stop goes through step 2.
> 4. Call the human for `Recommendation: none - <why>`, a recommendation that spends budget or consent (`cap +N`, another attempt beyond the escalated round, a redraw, a separate change), or evidence repeating one already auto-resolved on the same task or row.

Carriers reused: the grant line, `escalationLoop.implModel` (resolves whenever the session has a model; `undefined` keeps today's stop), the `Recommendation:` line every menu renders (the loop human stop gains it), and the `amend:` audit body. Budget never self-issues: "another repair" with no named change is `Recommendation: none`.

Repeat-evidence key: loop - the row's evidence cell text (check name plus result lines) equal, after whitespace normalization, to one already auto-resolved on that row; waves - the quoted `file:line` finding or failing command plus assertion in the implementer return equal to one already auto-resolved on that task. This is a per-task/row implementer check; the aftermath's "evidence repeating an already-applied item" route (`amendment-surface.md:171`) stays as written.

Escalated-round identity: one per task or row per site. Waves: site `task <n> after 2 failed attempts`, recovered on resume only from the `escalated round for task <n> after 2 failed attempts` transcript line, as funded rounds. Loop row: the durable `row <n> escalated` decision line in the ledger. Loop exit verification: the parent `loop: repair verification` commit on the branch. Unrecoverable means spent; a mid-loop grant or an explicit retry never grants a second one.

Site edits (each touched paragraph is also tightened; SDD `SKILL.md` has 728 bytes of headroom, so its edits are clauses and the procedure text lives in `reference/fix-loop.md`):

| Site | Edit |
|---|---|
| `skills/subagent-driven-development/SKILL.md` Implementer Status `NEEDS_CONTEXT` / `BLOCKED` rows | Replace "For decisions, answer and re-dispatch ... or escalate to the user" and "stop and diagnose ... or escalate to the user" with: under amend permission take an authorized `Recommendation:` per `reference/fix-loop.md` "Implementer-failure stops"; otherwise as today. |
| `skills/subagent-driven-development/SKILL.md` "When a Subagent Fails" `After 2 failed attempts: STOP` | Under amend permission, attempt 3 is the escalated round (`fix-loop.md`), then step 2 on the resulting stop; otherwise STOP as today. A taken `BLOCKED` recommendation that re-dispatches counts as an ordinary attempt under this limit. |
| `skills/subagent-driven-development/SKILL.md` Implementer Status classification sentence ("Stop for a redraw"), `skills/brainstorming/SKILL.md:196`, `amendment-surface.md:3`, and `amendment-surface.md:160` ("Never auto-edit ticket or approved drafted AC row texts") | Narrow the redraw class in all four: a drafted AC row text correction with implementer evidence (quoted test, assertion, or code line in the `BLOCKED`/`NEEDS_CONTEXT` return) is an amend item; ticket rows, row add/remove, problem statement, and component boundary stay redraws. The applied correction is recorded in the `amend:` audit body as any item (`<handle> \| <title> \| <what> \| granted \| ...`), so finishing's digest surfaces it. |
| `skills/subagent-driven-development/reference/fix-loop.md` | Add section `## Implementer-failure stops`: the procedure above, the repeat-evidence key, the identity rule, and the dispatch shape - same payload and isolation knobs as the escalated review round, `model: <implModel>`, `context: "fresh"`, `async: false`, one implementer; print `escalated round for task <n> after 2 failed attempts` before dispatch and `took recommendation: <option> for task <n>` when a recommendation is taken. Keep the "`implModel` undefined -> stop note" branch. |
| `skills/subagent-driven-development/stop-note.md` | Template gains a final `Recommendation: <option> - <why>` line, `Recommendation: none - <why>` when no option is recommended. |
| `skills/loop-implementation/SKILL.md` ordered table rule 2 and the funding paragraph (`:70`) | Rule 2 predicate `attempts >= allowance`. Under amend permission, when no `row <n> escalated` decision exists for the row and rules 3-4 would not stop: append `row <n> escalated \| implModel round \| allowed attempts <attempts + 1>`, commit parent `loop: escalate row <n>` (excluded from child-commit counting; starts no new window), print `escalated round for row <n>`, dispatch with `model: <implModel>`; otherwise human stop. Spent funding `max(0, min(attempts, 3 + N) - 3)`, so the escalated attempt is never a paid round. Keep "Funding buys neither cap bypass nor empty-commit bypass nor an escalated model"; add "the amend-permission escalated round is the only `implModel` dispatch". |
| `skills/loop-implementation/SKILL.md` dispatch (`:92` "Omit the model override") | "Omit the model override except on an escalated round (`model: <implModel>`)." |
| `skills/loop-implementation/SKILL.md` exit verification (`:175`) | Under amend permission and `iterations < cap`: bump iterations once, record `HEAD_BEFORE`, dispatch one `implementer` (the SDD step-5 repair shape) in the failing leg's checkout with the failing output, absolute spec path, and that leg's `verification:` command; require a clean tree and exactly one commit after `HEAD_BEFORE` (otherwise the existing boundary stops), commit `loop: repair verification` as a parent commit, rerun that command once; second failure stops with the existing header plus `escalated round spent`. Ledger rows unchanged. |
| `skills/loop-implementation/SKILL.md` human stop (`:181`) | Drop "model escalation" from the omission list; the stop names the escalated round it spent, as funded stops name `budget:`, and ends with `Recommendation: <option> - <why>`. Under amend permission a recommended `amend` naming the spec item is taken through the Amend row (section 5 under the grant), then the ordered table reruns; `cap +N` and retry spend budget, so they render as advice and the stop waits. |
| `skills/writing-plans/SKILL.md` step 6 baseline row (`:79`) | Recommendation form `Recommendation: <option>[ <filter>] - <reason>`. Under amend permission take it at once and print `took recommendation: <option>`: `narrow` re-dispatches with `Task N Tests: narrow to <filter>` copied from the recommendation; `amend` runs section 5 of `amendment-surface.md`; `fix-first` enters `/skill:shape-ticket`, whose write gate is the stop. `none` waits. Applies at initial planning and at amendment re-entry alike. |
| `skills/brainstorming/reference/amendment-surface.md` aftermath routing (`:169-171` "then pause") | Honor the same step-2 rule when rendering the step-6 branch for unchanged-command and writer-only failures; keep the two-item limit, the repeated-evidence route, and the dirty-path handling unchanged. |
| `eval/subagent-driven-development/target.json` | First slice `sliceTo` becomes `## After All Tasks Complete`, so `## When a Subagent Fails` is assembled. |

Removes: `loop-implementation/SKILL.md:92` unconditional "Omit the model override"; `:181` "model escalation" omission; `:175` "Further work requires a human decision"; `writing-plans/SKILL.md:79` "then wait" after the recommendation.
Adds: `fix-loop.md` `## Implementer-failure stops`; one clause at each site above, including `skills/brainstorming/SKILL.md:196` and `amendment-surface.md:160` and `:169-171`; `Recommendation:` line in `stop-note.md` and the loop human stop; the `row <n> escalated` decision and `loop: escalate row <n>` / `loop: repair verification` parent subjects; eval samples listed under Tests; `intent.md` updates for the three eval targets.

Pattern: follows `doc/specs/2026-10-22-gh-74-respect-amend-grant.md`, which edited the owning sentences to push the grant into the review fix loop; cuts across nothing.

## Errors and edge cases

- Escalated round fails (dispatch error, non-`DONE`, failed row, verification still failing): count it spent, then step 2 on the resulting stop; never a second escalated round at the same site for the same task or row. `fund N` extends only where funding already applies (waves Fix-Loop Rounds, loop row allowance); funded re-review `STAGNANT` or an exhausted budget stops with `budget: <spent> of <N> spent` as today. Ordinary review-2/3 `STAGNANT` keeps its existing escalation.
- Loop row at allowance with `iterations >= cap`, or the last two child commits stagnant: rules 3-4 stop as today; no escalated dispatch. Loop exit verification failure at cap: cap stop, no repair dispatch.
- Loop allowance arithmetic: `fund 2` -> attempts 4 and 5 are funded rounds 1 and 2; attempt 6 is the escalated round and is never counted as spent funding; a mid-loop grant applies prospectively and the `row <n> escalated` decision survives it.
- Same evidence twice: per the repeat-evidence key in Design; the stop renders `Recommendation: none - evidence repeats <where>`.
- Budget-only grant (`2 more fix rounds` alone): rounds are bought, no decisions are auto-taken, no implicit escalated round. `none` or absent: today's behavior. Malformed line: stop quoting it (unchanged).
- `implModel` undefined (no session model): today's stop note; the loop human stop names the missing model in `Problem:`.
- AC row carve-out: a reviewer-only or taste objection to a row stays a redraw; only implementer evidence qualifies. Ticket rows, problem statement, and component boundary always stop.
- Loop exit repair: a dirty tree or extra commits after the repair hit the existing boundary stops; verification reruns exactly once; coordinated exit repairs and reruns only the failing leg.
- Loop `amend` taken from a stop: after the `loop: amend` / `loop: cut row <n>` commit the ordered table reruns; a cut row exits the stop; a row still at its allowance stops again with the repeat-evidence rule, since retry spends budget.
- Resume: waves recovers a spent escalated round from the `escalated round for task <n> after 2 failed attempts` line; loop recovers it from the ledger decision or the `loop: repair verification` commit; unrecoverable means spent, so a resumed session never grants a second one.
- Hard stops unchanged: cap, empty-commit stagnation, dirty/commit boundary, funded re-review `STAGNANT`, `REJECT`, redraw (as narrowed), malformed grant, missing `implModel`.

## Tests

Eval samples per `eval/README.md` (`case.md` + `expected.md`; `bundle-`/`bundle+` lines restrict or extend each sample's slices; loop and writing-plans samples below add `bundle+: skills/brainstorming/reference/amendment-surface.md` where section 5 or the aftermath is exercised):

- Loop allowance exhausted under amend permission appends `row <n> escalated`, commits `loop: escalate row <n>`, dispatches with `model: <implModel>` and prints `escalated round for row <n>`; the same row at `iterations >= cap` takes the cap stop instead; a resume turn recovers the spent round from the ledger - `eval/loop-implementation/samples/escalated-row-attempt`
- Loop exit verification failure under amend permission runs one escalated repair, commits `loop: repair verification`, reruns verification; a second failure stops naming the round with a `Recommendation:` line; at cap the cap stop fires with no repair - `eval/loop-implementation/samples/exit-verification-escalates`
- Loop stop with budget-only or no grant behaves as today, including "never escalates model" - existing `eval/loop-implementation/samples/funding`, unchanged
- SDD `BLOCKED` decision with a recommendation under amend permission re-dispatches with it and prints `took recommendation:`; `Recommendation: none` stops with a stop note ending in that line; a second turn with repeated evidence stops - `eval/subagent-driven-development/samples/blocked-decision-auto-taken`
- SDD third attempt on `implModel` after two failures; its failure followed by a takeable recommendation continues, followed by `none` stops; a resume turn recovers the spent round from the transcript line - `eval/subagent-driven-development/samples/third-attempt-escalated`
- Evidenced drafted AC row correction entering through brainstorming's amendment route applies as an `amend:` item with the existing audit body; a problem-statement change still stops - `eval/subagent-driven-development/samples/ac-row-correction-amend`; existing `redraw-under-grant` keeps passing
- Baseline menu takes `narrow <filter>`, `amend`, and `fix-first` under grant and waits on `none`; a second turn covers an unchanged-command failure during an amendment batch - extend `eval/writing-plans/samples/parent-offers-fix-first-narrow-amend`
- Byte limit and lint - `npm test` (instruction-size lint, skill lint, model-literal lint)

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` "Escalation loop" (operations: `implModel` now also fires at implementer-failure stops in both engines under amend permission) and its loop paragraph (`:118`) that says the loop never runs escalated-model rounds; `README.md` gate-2 paragraph (major procedure: what the grant now covers); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `doc/implement-engines.md` engine comparison rows describing the loop's stop and escalation behavior

## Out of scope

- Verify-phase funding (`closureReview.maxFixRounds`, `grant_fix_rounds`) - separate runtime-enforced cap.
- A settings switch for autonomy (`piGauntlet.escalationLoop.autonomy`) - the grant line stays the single consent carrier.
- Cap, stagnation, and boundary stops - the grant never buys budget it did not name.
- Extra bugs noticed in triage: none filed.

## Open questions

- none
