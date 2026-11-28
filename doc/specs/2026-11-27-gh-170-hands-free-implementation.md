# Hands-free implementation: a step asks only when it has stalled

**Goal:** After spec approval both implementation engines deliver without "act or stop?" questions. Inside its budget a failed step is retried or routed, never asked about; at a spent budget the run takes one more round at a time while the step is still moving and stops only when it has stalled; a stop says what blocks and what input unblocks it, with no options menu. The choices the run took and the stand-ins it built are told once, in one list above the ship menu. Every counter, reply and setting stays; the change removes the instruction text that makes the run ask, plus message strings in one extension.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #170
**Predecessor:** doc/specs/2026-11-06-loop-hands-free-boundaries.md, Design "One bound" as a stop condition (a spent allowance now stops only a stalled row, seed or verification repair), the conformance funding acceptance row (`rounds: <allowance - used>` under amend permission) with its Driver clause, and "data not present" in the `unreachable:` acceptance row and persona clause
**Predecessor:** doc/specs/2026-11-01-gh-108-loop-single-allowance.md, the stop clause of the acceptance row "A row whose attempts reach its effective allowance stops for a human under option 4 and option 5 alike"
**Predecessor:** doc/specs/2026-10-22-gh-74-respect-amend-grant.md, the stop outcome "an escalated-round failure with no funded round left" in Design "Funded rounds (phase 2)" and "`stop-note.md` stays byte-identical" in Design "Stop note"
**Predecessor:** doc/specs/2026-09-19-readable-amendment-gates.md, Design "Finish-time digest": the `Amendments auto-applied (N):` heading and its amendments-only content
**Predecessor:** doc/specs/2026-11-14-spec-gate-four-row-menu.md, the description text of the `--fund-rounds=N` and `--allowance=N` flag lines

## Problem

A run that has an approved spec still ends turns on questions whose only alternative is stopping. The human answers with a bare pick, almost always the recommendation, and the wait is the cost.

Evidence read on 2026-11-27: every assistant message starting `gauntlet: question` while the phase was implement or verify, in two consumer repos' session folders, files newer than 2026-11-19 (103 files). 56 messages (49 implement, 7 verify) in 10 sessions; the run's reasoning before each was read. Counts are by reading and approximate; they describe the input and are not targets.

| Cause | About | What the instructions say | Example |
|---|---|---|---|
| A stop is reachable before the budget is spent | 27 of 56 | The waves stop note is a menu by template (`Fix options: a) b) c)`, `Pick one, or give another fix`); the decision ladder ends "everything else emits the stop note ... and waits" (`skills/gauntlet/implement/waves/waves.md` "Escalation and funding"); the loop's `## Human stop` describes row-failure stops without tying them to rule 2, so the driver judges a failed row's evidence | Loop questions came at `2 of 10`, `4 of 10`, `5 of 10`, `9 of 13` attempts, none at a spent allowance; the run's words: "The child agent is asking for a spec call, which means a human needs to step in here" |
| The run can tell the human something only by stopping | 7 of 56 | Nothing between a step's commit and the ship menu carries a note; `skills/gauntlet/ship/ship.md` Step 4 prints only auto-applied amendments | "V1) continue to verify, then the ship menu V2) stop here" |
| Small fixed budgets that only a human reply extends | 17 of 56 | Waves: two attempts, one escalated round, funded rounds only under a prepaid grant, else stop note. Whole-diff review: "still `FIX_FIRST` -> escalate to the user" (`skills/gauntlet/requesting-review.md` "Fix rounds") | One task asked "authorize one more repair round, or leave it paused?" six times in a row; each reply was `a` |

The remaining 5: an amendment helper that failed twice, a fact the run could have looked up, one real `STAGNANT` stop, one answer to a follow-up.

Checked claims (source - lookup - result):

- Request: "implementation should never stop in either engine except ticket was bad or council hasn't done its job" - ticket rows 4, 5 and 8; `loop.md` `## Before each dispatch` and `## Human stop`; `waves.md` "Escalation and funding" - corrected. The ticket keeps four waiting questions (discard of uncommitted work, a redraw, a spec correction under per-correction review, an unnamed paid or outside-repository action) and the stalled stop; both engines also stop on a broken setup (`Problem: escalationLoop.implModel unavailable`, an unreadable reference, a ledger without `allowance:` or `checks:`). The design keeps these.
- Ticket row 3, "the engine's existing stagnation check ... is the only bound" - `loop.md` ordered table rules 2-4 and `skills/gauntlet/implement/loop/empty-child-stagnation.md` - corrected for the loop. Rule 3 only sets `hint:`; only rule 2 (attempts at effective allowance) stops. The design makes the stall test the stop condition at a spent allowance.
- Request, first reading: the attempt-limit machinery is deleted - overridden by the user ("there is still budget per ledger step, right? ... this is not about rebuilding turn budgeting"). Allowance, attempt counting, the escalated round, funded rounds, `retry` and `rows +N` stay.
- Ticket, "a helper step was interrupted (recover and continue or stop)" - `skills/gauntlet/implement/loop/interrupted-recovery.md`; `waves.md` `### Recovery`; the delegated-failure sentences in `waves.md`, `stop-note.md` and `dispatch-contract.md` - held for waves only; the loop already recovers without a human turn. Waves stops on every interruption: Recovery says "never infer integration or redispatch interrupted workers" and a delegated failure stops. The design recovers an interruption whose base, identity and absence of writes are established (D1) and keeps the stop for the rest.
- Ticket row 8 pointer, the worker turns missing data into a scope cut - `agents/loop-implementer.md` step 5 table, `skills/gauntlet/implement/loop/unreachable-returns.md`, `skills/gauntlet/implement/tdd.md` test-economy rule 4 - held. Missing credential, environment or data all record `unreachable:`; the driver cuts the row under amend permission, otherwise asks.
- Ticket rows 6, 7 and 9 pointers - `ship.md` Step 4 (digest from amendment audit rows in commit bodies), `skills/chase-bug/reference/verdict-report.md` "Register" (180-word cap), `ship.md` Option 1 PR body template - held. No carrier exists for a non-amendment choice or a stand-in.
- Ticket `source: stop counts - none` - session-log scan above - held in kind. The ticket's 133 question turns and 85 hours come from a different classifier and are not reproduced; they describe the input.
- Ticket `source: S1-S9 reply - none` - searched session logs for "what is s1-s9" - held: found in two consumer sessions of 2026-11-09 and 2026-11-10.
- `phase_tracker({ action: "grant_fix_rounds" })` - `extensions/phase-tracker.ts` grant branch - held: it rejects only a missing `rounds`, an empty `reason`, no active cap block, or unused granted rounds; its description and messages say "human explicitly approved".
- `skills/gauntlet/commit-message.md` "Body" - held: it allows record lines only for the council audit and the amendment audit rows, so it owns any new record line.
- #178 (open) rewrites the same `loop.md` paragraphs for the tracker refresh.

Implicit dependencies not met or not checkable:

- The three paths in the ticket's first reporter note (`skills/subagent-driven-development/stop-note.md`, `skills/loop-implementation/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md`) - `test -e` - not found; retired. The ticket body names the live files, which exist.
- Settings tool and escalation model at run time - static read of `extensions/phase-tracker.ts` - not checkable ahead of a run; the existing missing-model stop stays.
- Whether the questions disappear - not checkable until the selected eval samples in Tests run after the change.

Framing: kept - no concern with a named alternative; the scout's objection (removing the allowance leaves the loop unbounded) is the corrected row-3 premise above.

Reporter notes on the ticket are provenance: the first snapshots retired paths, the second records that the worker's own finding (not a spec annotation) triggers a stand-in and that #177's check before work starts was dropped. #177 is closed as not planned; this spec adds no readiness check.

## Acceptance criteria

Ticket #170, checkbox list, rows verbatim:

- [ ] In both implementation engines (task plan and loop), when the run reaches a point with one available action and no alternative except stopping or pausing - an interrupted helper step it can recover, a repair the review already named - it takes the action in the same turn and does not end the turn on a question.
  in-scope
- [ ] When the run has two or more ways forward inside the approved spec, or inside the spec-correction permission given at approval, and recommends one, it takes its recommendation and continues without a human reply.
  in-scope
- [ ] When a task's or row's attempt allowance runs out and the engine's existing stagnation check has not fired, the run dispatches further attempts without a human reply; the stagnation check is the only bound.
  in-scope
- [ ] When the stagnation check fires, or the run can name no way forward, the run stops and its message states in everyday words what blocks delivery and what input would unblock it.
  in-scope
- [ ] Each of these still ends the turn on a question: confirming the discard of uncommitted work; a redraw; a spec correction under an approval that chose to review each correction; an action that spends money or acts outside the repository and that the spec did not name.
  in-scope
- [ ] The ship menu of a run that took its own recommendation between two or more ways forward, or auto-applied a spec correction, shows above its options one list with one line per such choice: what the run chose and why. Auto-applied spec corrections appear in that list, not in a second one; recovered steps and extra attempts are not listed.
  in-scope
- [ ] That list follows the "Register" rules of `skills/chase-bug/reference/verdict-report.md` - everyday words, no commit hashes, no row, task or finding numbers - and is under 180 words, the cap that file sets for a report.
  deviates: when shortened ordinary choices and their reasons still exceed 180 words the cap yields; every choice keeps its line and its reason
- [ ] Given an approved spec that lists a row as in scope (for example "the importer accepts the file the customer sent on Monday" with no file, in a repository whose fixtures show the format the importer reads), when a run under either implementation engine (task plan or loop) reaches that row and its worker finds that it cannot obtain the input data the row names from the checkout or from material supplied with the spec or the source ticket, that finding alone triggers this row, whether or not the spec says the data is missing: if the worker can build a stand-in input from the row and the format the repository shows, it writes the row's code test-first against that stand-in, the row closes or fails on that check's result as any other row does, and the run neither stops for the human nor cuts the row from scope because that data is missing. If the worker cannot build a stand-in (for example, nothing in the row or the repository shows the format the importer reads), the missing data is handled as it is today: the run stops to ask, or cuts the row when the human allowed spec corrections at approval. A missing prerequisite that is not the row's input data (a credential, a tool, a deployed environment) is handled as it is today.
  in-scope
- [ ] The ship menu of a run that closed a row on a stand-in (previous row) shows above its options, in the same list as the run's choices and also when it is that list's only line, one line for that row that names the missing data and the stand-in and says the row is not proven on the data the ticket meant; the pull request body the run proposes carries the same line.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-170-hands-free-implementation
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: doc/personas.md
Rules: .pi/gauntlet.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/forge-skill/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/gauntlet/legs.md
Rules: skills/gauntlet/ship/legs.md
scope: none
design: owns every path named in Design D1-D8 under `skills/`, `agents/`, `extensions/`, `scripts/`, `eval/`, `README.md`, `doc/configuration.md`, `doc/gate-contract.md`, `doc/implement-engines.md` and `CHANGELOG.md`; the observable outcomes are the in-scope rows above and the clauses of Design and Errors and edge cases.

## Design

Approach: edit each instruction that tells the run to ask. No new file, setting, reply, counter, ledger line or decision kind. Rejected: one shared stops file read by both engines (moves the loop's longest paragraphs while #178 rewrites them and adds a file to load); an extension that bounces implementation questions (the instructions would still say "ask" and code would overrule them).

Every edit follows `/skill:forge-skill`. Section names and the quoted strings, not line numbers, locate each edit in the checkout used for implementation.

Three rules, used below by name:

- **No ask inside the budget.** Before a counter is spent, a failed step is retried or routed by a fixed rule. The run never judges whether a failure needs a human.
- **One more round while moving.** At a spent counter the run tests the last round against the round before it (D2). Moving: take exactly one more round, then test again. Stalled: stop.
- **A stop names the block and the unblocking input.** No options menu, no offered `Stop`.

Chosen reading of ticket rows 3 and 4: "the engine's existing stagnation check" is the stall test of D2, built only from signals the engines already compute; "attempt allowance" covers all seven counters in D2, including the verify-phase ones.

Chosen reading of ticket rows 7 and 9, approved in design round 2: a stand-in line is never dropped or collapsed to meet row 7's 180-word cap, and stand-in lines that alone pass the cap are all printed (D5); the conformance check reads row 7 with this precedence. Row 7 carries `deviates:` for ordinary-choice overflow, the user's answer at the ship gate; D5 states the rule.

### D1 - No ask inside the budget

`skills/gauntlet/implement/waves/waves.md`:

- Remove: "otherwise answer and re-dispatch or escalate to the user" (`NEEDS_CONTEXT` row) and "otherwise diagnose and re-dispatch or escalate to the user" (`BLOCKED` row) in the implementer status table, and the "under amend permission" condition on following the decision ladder for decisions.
- Remove: "and another-round approval as a decision only with no funded round left" in the question-classification paragraph. Another round is D2's rule, never a question.
- Remove: "everything else emits the stop note ending in `Recommendation: <option> - <why>` and waits" in the "Takeable decision" bullet.
- Add, in that bullet: for a decision whose options all lie inside the approved spec, take the recommended option with or without amend permission, print `took recommendation: <option> for task <n>`, answer the worker with it, and hold one `choice` line (D4) for the wave commit. Never take an option that discards uncommitted work, is a redraw, or runs a paid or outside-repository action the spec does not name; those keep their existing stops. With no option to recommend, emit the stop note.
- Replace with a pointer to the takeable-decision ladder and D2's stall rule, restating no pause of their own: the two `## Continuous Execution` pause bullets ("A subagent returns `NEEDS_CONTEXT` or `BLOCKED`", "An escalated round fails with no funded round left"); "pending the human's decision" in the `plan_tracker` "Lifecycle per task" bullet and "Keep `in_progress` pending the human decision" in "When a Subagent Fails" step 3 (a task stays `in_progress` until its wave commits or its stop note is emitted); "`NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation" in the `## Red Flags - STOP` pause line.
- Add, for an interrupted step the run can recover (ticket row 1), in `### Recovery` (today "never infer integration or redispatch interrupted workers") and at the delegated-failure sentences (`waves.md` primary-shell paragraph "stop on delegated failure" and "Chain stopped or failed" "Missing/ambiguous artifacts or delegated failure stop"; `stop-note.md` "Stop on a delegated failure."; `dispatch-contract.md` "A delegated failure stops"): a read-only helper (the answer/evidence lookup, `Amend-prepare:`, the diagnosis step) or an isolated-wave worker dispatch that was interrupted before it returned a result is dispatched again in the same turn with its retained payload. A worker goes through the transition table's dispatch-error row and counts once on `failed[n]`; a helper is repeated once, and a second failure takes the existing stop. Keep the existing stop when the wave base, a repair's `applied` status, a review's outcome, the dispatch identity, or whether the interrupted step wrote to the checkout cannot be established from the printed observations (an in-place worker, `Amend-apply:` outside its own step-4 retry, two captures for one identity). Never recursively diagnose.
- Unchanged: fact asks go to the delegated lookup; a spec-defect citation goes to the amendment surface (applied under amend permission, its menu without); the repeated-evidence comparison; `fix-first` entering `/skill:shape-ticket`.

`skills/gauntlet/implement/loop/loop.md`:

- Add, in `## Human stop`: below its effective allowance a failed row is never a human stop; rule 2 of `## Before each dispatch` is the only route to a row stop. Below allowance the driver reads a failed row's evidence only for the `unreachable:` marker in `## Unreachable returns` and never to decide whether a human must rule on it.
- Remove, in `## After the loop` step 3: "Without amend permission, refresh and stop with `Stopped: row <n> reopened by amendment during verify`; offer authorize the row's return to ledger implementation or stop." The approved amendment already determines the action: the reopened row returns to ledger implementation without a second authorization, with or without amend permission.

`agents/loop-implementer.md` (ticket row 2 in the loop):

- Add, in Procedure step 4: when the row or Design admits two or more readings that each fit the approved spec, implement the recommended one - a reading Design states wins, otherwise the one that needs the smaller change - and write the `choice` line (D4). Never fail the row to ask which reading applies.
- Unchanged: a spec-vs-code contradiction that no reading inside the approved spec resolves is recorded as the failure cause in step 5. Below allowance it is an ordinary failed attempt; D2 site 3 routes it to the amendment surface at a spent allowance.

Kept question, unnamed action (ticket row 5) - `agents/loop-implementer.md` step 5 action table and `skills/gauntlet/implement/loop/unreachable-returns.md`:

- Add: for "action the spec does not name" the worker writes the existing marker as `unreachable: unnamed action <the action> - <where it can run>`. A `<what>` starting `unnamed action ` takes the amendment surface's human batch before any write or dispatch, with or without amend permission; the question asks whether to name the action in the spec or cut the row. The driver never auto-applies that cut.
- Unchanged: a missing credential, tool or environment, and input data with no buildable stand-in (D6), keep the ordinary `unreachable:` routing: cut under amend permission, the human batch without.

`skills/gauntlet/conformance-check.md`:

- Remove: "A `BLOCKED`/`NEEDS_CONTEXT` return surfaces to the user" in fix-loop step 3.
- Add: such a return is a failed agent under that step's existing failure handling (retry with fresh context, counted as a wave); a spec-defect citation goes to the amendment surface.

### D2 - One more round while moving

One sentence, added at each site below: "At this spent counter take one more round when the last round moved, and stop when it stalled; when the round before is not recoverable, take one round." The stall test per site:

| # | Counter | File and site | Stalled when |
|---|---|---|---|
| 1 | Waves task rounds: two attempts, the escalated round, every funded round | `waves.md` transition table rows "Escalated round fails" and "Funded round fails"; "When a Subagent Fails" step 3; the "Hard stops" bullet | A round that ended in a completed re-review: its `TRAJECTORY:` is not `CONVERGING` (a missing or malformed line on a completed re-review counts as not converging); no single finding's location is compared. A round with no re-review due or run (dispatch error, non-`DONE`, red gate, empty delta): the round's delta is empty, or the failing command plus assertion equals the round before under the ladder's existing whitespace-normalized comparison |
| 2 | Waves re-review cap (`4 + N` per wave) | `waves.md` transition table last row | Same as 1 |
| 3 | Loop row attempts at effective allowance | `loop.md` ordered table rule 2 | Rule 3's condition holds in the row's window; or the row's evidence cell is equal, whitespace-normalized, in the last two child row commits of that window; or the row's last two attempts in that window are both parent `repair row <n>` lines whose second cell starts `interrupted - ` (recorded attempts that changed nothing, not lost history); or the last admitted evidence states a spec-vs-code contradiction that no reading inside the approved spec resolves |
| 4 | Loop seed repairs at allowance | `loop.md` `## Validate the return` seed count | The second cell of the last two `repair seed` lines is equal |
| 5 | Loop verification repairs at allowance | `loop.md` `## After the loop` step 1 | The last repair marker is `interrupted - `; or the failing test names or assertion lines in the driver's existing `tail -n 20` excerpt of the failing gate log, held from the failure before the last admitted repair, equal those after it (timings ignored). The gate index and exit code alone never decide |
| 6 | Whole-diff review fix rounds | `requesting-review.md` "Fix rounds" | The re-review's `TRAJECTORY:` is not `CONVERGING`; or the fix round's integrated diff is empty |
| 7 | Conformance fix rounds at `closureReview.maxFixRounds` | `conformance-check.md` fix-loop step 6 and Convergence step c | The last round closed no item: no gap newly `DELIVERED`, no failing command newly passing, no Critical or Moderate finding gone |

Per site:

- Sites 1-2. Remove: the unconditional "else stop note" after the escalated and funded rounds and the unconditional hard stop at the re-review cap. Add: an extra round repeats the funded-round payload (`model: <implModel>`, same tree, same anchors) and prints `extra round for task <n>: <what moved>`. Unchanged inside the budget: every transition-table row, including `STAGNANT` escalating at once and a funded `STAGNANT` stopping; `REJECT` and `anchorUnreadable` stop at any time.
- Site 3. Rule 2 becomes: attempts at or above effective allowance and the row stalled -> human stop; not stalled -> rule 4 dispatches, printing `extra attempt for row <n>: <what moved>`. The attempts cell keeps counting past the allowance (`row 2: 6 of 4`); nothing is written to grant the attempt. Below allowance rule 3 still only sets the hint. The escalation threshold and the once-per-row escalated round are unchanged. Parent `repair row` lines are read from the ledger's `## Decisions`; no counter is added. A stalled row whose evidence states a spec-vs-code contradiction takes the stop's existing amend rule ("Under amend permission take only a named authorized amend"): the correction is applied in the same turn under amend permission, and the amendment surface's menu asks without it.
- Site 4. At allowance, dispatch seed again while the last two repair reasons differ.
- Site 5. At `repairs >= allowance`, dispatch another repair while moving.
- Site 6. Remove: "still `FIX_FIRST` -> escalate to the user". Add: each further `FIX_FIRST` re-review buys one more fix round while moving; every whole-diff re-review dispatch carries the existing `## Previous review report (re-review trigger)` heading with the prior report's path, or its text when no file was saved, and reviews the same whole diff, so the reviewer's existing `TRAJECTORY:` line is emitted. Stalled -> the D3 stop.
- Site 7. Remove: "Under the loop engine with amend permission, apply the loop driver's After the loop step 3 funding up to the ledger allowance before this ask; ask the human only when it declines" in `conformance-check.md` step 6, and the whole allowance-funding paragraph (`rounds: <allowance - used>`) in `loop.md` `## After the loop` step 3. Add, in step 6, for both engines with or without amend permission: at the cap while moving, call `phase_tracker({ action: "grant_fix_rounds", rounds: 1, reason: "<what the last round closed>" })` when the block is live, or continue without a call when `closureReview.enforce` is false; stalled -> the step-6 stop in its D3 shape. `maxFixRounds: 0` stays the audit-only opt-out. Remove also the earlier bulk-funding sentence "After the loop step 3 funds conformance rounds from the allowance" in `loop.md` `## Before each dispatch`. Reword to admit the one-round grant: `waves.md` After All Tasks step 3 "it never calls `phase_tracker`"; `conformance-check.md` "the only `phase_tracker` call inside the loop is the human-approval `grant_fix_rounds`" and step 6 "without that approval, escalation stays terminal" (a stalled cap stays terminal without a human grant).

Sentences that restate a bound as an unconditional stop become pointers to the owning rule (rule 2, or the seed count in `## Validate the return`) with no bound of their own: `loop.md` `## Before each dispatch` "A row already at or above its effective allowance is exhausted."; `loop.md` `## Human stop` "an unresolved row at allowance stops again, not a free retry"; `loop.md` `## After the loop` step 3 "including exhausted-row rule 2"; `skills/gauntlet/implement/loop/interrupted-recovery.md` step 3 "rule 2 stops a repaired row at allowance"; `skills/gauntlet-resume/reference/restore-loop.md` "stops under rule 2 without an attempt; keep an allowance-stopped row `failed`"; `skills/gauntlet/implement/loop/coordinated-legs.md` "retry this leg below allowance or stop at allowance". A resumed session dispatches a moving row at or above its allowance.

`extensions/phase-tracker.ts`, strings only, no logic: the cap-block reason ("escalate to the human ... If the human explicitly approves more rounds ... `<their words>`"), the `reason` and `rounds` parameter descriptions, and the reject text `grant_fix_rounds requires reason: the human's approval, quoted` are reworded so a grant's reason is either what the last round closed or the human's words. The four reject conditions are unchanged.

`skills/gauntlet/brainstorm/spec-finalization.md`, the two flag lines of the gate template: `--fund-rounds=N` reads "(default: none; past the escalated round the run continues only while the review reports progress)"; `--allowance=N` reads "attempts per row before the loop stops a row that has stopped making progress (default: <n>)". Flag parsing and persistence are unchanged.

### D3 - A stop names the block and the unblocking input

`skills/gauntlet/implement/waves/stop-note.md`:

- Remove, from the stalled or no-way-forward note (template and example): the `Fix options:` block, `Pick one, or give another fix.` and the final `Recommendation: <option> - <why>` line; the rules "End every note with `Recommendation: ...`" (its takeable-decision-ladder sentence stays), "Options are actionable edits ..." and "Never offer 'skip the task' ..."; the offer list in the fact-ask rule ("offer supplying the artifact or access, or amending the spec or plan task to drop the requirement"); "including extra-round approval" in the `Searched:` rule.
- Add: one line after the findings, `Needs: <the input that unblocks delivery, in everyday words>`. For a fact ask it names the missing artifact or access. A reason that today rides `Recommendation: none - <why>` (the ladder's repeated-evidence stop) moves into `Problem:`. The "Emit when" paragraph names D2's stalled condition in place of "its one escalated round and any funded rounds fail".
- Unchanged: the first-line marker, `Problem:`, `Searched:`, `budget:`, the delegated lookup, and "Never ask the human where the artifact is." A note that asks one of the four kept questions (D1's never-take list) keeps its options and its `Recommendation:` line as today.

`skills/gauntlet/implement/loop/loop.md` `## Human stop`:

- Remove: `Stop` as a reply at row stops, seed exhaustion and the verification-failure stop, and the `Stop` row of the human-choice table.
- Remove, at stalled and no-way-forward stops, the printed offer list - "Offer retry and `rows +N` only at row stops (allowance or missing-model) or seed exhaustion, alongside Amend and Stop"; "the retry/`rows +N` menu" at seed exhaustion in `## Validate the return`; "offer amend or stop only" and "the same restricted menu" at the verification-failure stop in `## After the loop` step 1 - and the footer "End every stop with `Recommendation: <option> - <why>` or `Recommendation: none - <why>`".
- Add: every implement-phase and verification stop prints `Needs: <the input that unblocks delivery>` after `Problem:`. The replies stay accepted where they are today without being rendered: `retry <n> | <hint>` and `rows +N` at row stops and seed exhaustion, an amendment request at every stop, an amendment request only at the verification-failure stop; a malformed reply still prints the accepted forms once. A repeated-evidence reason (`Recommendation: none - evidence repeats row <n>`) moves into `Problem:`.
- Unchanged: the first-line marker, the human-choice table's `rows +N`, retry and Amend rows, the row count lines, `Preserve every row's attempts.`, the amend-under-permission auto-take (`took recommendation: amend for row <n>`) with its repeated-evidence comparison, the amendment surface's own menus, the dirty-tree stop (its `discard` question is one the ticket keeps), and the `checks:` stop.

`skills/gauntlet/requesting-review.md` "Fix rounds":

- Add: a stalled whole-diff review (D2 site 6) stops through the calling engine's stop (the waves stop note, the loop's `## Human stop`) with `Problem:` quoting the last report's residual findings and `Needs:`; no options.

`skills/gauntlet/conformance-check.md` fix-loop step 6 and Convergence step c:

- Remove: "ask for explicit funding of additional rounds" as the stalled stop's text.
- Add: the stalled stop keeps its `gauntlet: gate=verify/step-6` marker and the per-gap round-by-round trail, states `Problem:` and `Needs:`, and prints no funding menu. A human reply that grants N rounds is still recorded with `grant_fix_rounds` and their words.

Every stop keeps the first-line marker its owner uses today; none gains wording that invites an option pick.

### D4 - Two commit-body lines

`skills/gauntlet/commit-message.md` "Body" gains two record lines, allowed on worker, wave and repair commits:

```text
- choice | <what the run chose> | <why>
- stand-in | <missing data> | <what stood in>
```

Writers follow the "Register" rules of `skills/chase-bug/reference/verdict-report.md`: everyday words, no commit hashes, no row, task or finding numbers. Each cell is one physical line with no `|`.

| Writer | Writes |
|---|---|
| `waves.md` step 7 wave commit | One `choice` line per recommendation taken under D1 for that wave's tasks; one `stand-in` line per task that closed on a stand-in (its implementer `concerns` entry starting `stand-in:`) |
| `agents/loop-implementer.md` row commit | One `choice` line per reading it picks under D1; one `stand-in` line in the commit that closes a row on a stand-in |

Each line is written once, at the choice or the row closure it records. Two choices or two closed rows with the same wording write two lines. Auto-applied spec corrections keep their existing amendment audit rows; no `choice` line duplicates them. Recovered steps and extra rounds write no line.

### D5 - One list above the ship menu

`skills/gauntlet/ship/ship.md` Step 4:

- Remove: the `Amendments auto-applied (N):` block.
- Add: one block built from the same `git log <base-branch>..HEAD --format=%b` read, run in every participating checkout's feature range: the home worktree, and in a coordinated run each companion leg's checkout against its own base. Aggregate once at the home menu, home first, then companions in `## Legs` order. Sources: amendment audit rows of kind `auto-apply` or `granted` (unchanged match), lines matching `^- choice \| [^|]+ \| .+$`, and lines matching `^- stand-in \| [^|]+ \| .+$`. Every matching line is one entry; lines with the same wording are never merged.
- Mapping: an amendment audit row (`<handle> | <title> | <what> | <kind> | <reviewer line or reason> | <evidence>`, the grammar in `skills/gauntlet/amendment-surface.md`) renders `<what>` from its `title` and `what` cells (`<title>: <what changed>`) and `<why>` from its `evidence` cell in everyday words; when that cell is `none`, from its fifth cell. A `choice` line maps its two cells in order.

```
What the run decided on its own (N):
- <what> - <why>
- <missing data> was not available, so <what stood in> stood in; this is not proven on the data the ticket meant.
```

- Order: commit order within a checkout, oldest first. Omit the block when N = 0. A stand-in line renders even when it is the only line.
- Register: ship restates a line that carries a commit hash or a row, task or finding number without it.
- Cap: the block, heading included, targets under 180 words. When shortened ordinary choices and their reasons still exceed it, the cap yields: every choice keeps its line and its reason, and nothing is dropped or combined. Over the cap, ship shortens the wording of lines while each keeps its choice and its reason, and each stand-in line keeps its missing data, its stand-in and the not-proven clause. No line, reason or stand-in is dropped or collapsed. Stand-in lines that alone pass the cap are all printed (approved in design round 2).
- Add: each stand-in line, in the list's wording, in every pull request body the run proposes or edits, limited to the stand-ins recorded in that pull request's own range. Option 1 template and every body written from it, companion bodies included: a `## Summary` bullet. Header-linked route (`skills/gauntlet/ship/spec-pr.md`): written in the same reconcile edit as the Integration block, the one exception to "Preserve the home PR body byte-for-byte outside its Integration block". Rework route: inside the appended `## Rework` block.
- Unchanged: Step 3.5, the menu rows, the first-line marker.

### D6 - Stand-in for missing row data

`agents/loop-implementer.md` step 5 action table:

- Remove: "data" from "credential, environment or data not present" in the `unreachable:` row.
- Add one row: the input data the row names cannot be obtained from the checkout or from material supplied with the spec or ticket, and the row plus a format the repository shows (a fixture, a parser, a schema) are enough to build one -> build the smallest hand-built stand-in, write the row's code test-first against it, close or fail the row on that check as any other, add the `stand-in` line (D4). When nothing shows the format, record `unreachable:` as today.

`agents/implementer.md` (test-input rule) and `skills/gauntlet/implement/tdd.md` (test-economy rule 4) gain one sentence each with the same rule, scoped to a task-plan wave dispatch (a wave task or its repair inside The Wave Loop), the only caller that writes the `stand-in` line: the `waves.md` step 2 and step 6 payloads carry the sentence's trigger, and the persona applies the rule only when its dispatch carries it. There the implementer reports `stand-in: <missing data> - <what stood in>` as a `concerns` entry with `DONE_WITH_CONCERNS`, which the orchestrator accepts without a fix dispatch. Every other caller of the persona (the loop's verification repair, whole-diff and conformance fix rounds, `fix minors`, gatekeep) keeps its completion contract and builds no stand-in.

When the wave implementer cannot build one it returns `NEEDS_CONTEXT` naming the missing data. After the delegated lookup misses, the orchestrator forms one amend item through the delegated amendment route with the loop's unreachable disposition (`deviates: unreachable in this checkout - <what>`): the row is cut under amend permission, and the amendment menu asks without it. This return never enters the takeable-decision ladder as a decision and never becomes a stalled stop note.

A missing credential, tool or deployed environment is handled as today in both engines.

### D7 - Product docs

Rewrite to the rules above: `README.md` (the loop stop table and the "between gate 1 and gate 2" paragraph); `doc/configuration.md` ("Escalation loop" - the "still wait" sentence and the `allowance - used` funding sentence; "Loop stop boundaries"; the fix-round cap paragraphs under `closureReview` and "phase-tracker"); `doc/implement-engines.md` "Stops, models and telemetry" (bound wording, stop table, the `Recommendation:` paragraph); `doc/gate-contract.md` (the free/question reply row and the loop-stop paragraphs and table); `CHANGELOG.md` `## Unreleased` entry referencing `#170`.

### D8 - Evals and the paid action

Each touched eval target (`eval/waves`, `eval/loop`, `eval/loop-implementer`, `eval/implementer`, `eval/ship`, `eval/gauntlet-resume`) gets the samples in Tests, an updated `intent.md`, and a committed sample-scoped `report.md` per `eval/README.md` "Iterating on a skill edit".

Paid action: `node eval/run.mjs <target> <sample>`, run by the implementing agent from the worktree root, inputs the sample names listed in Tests (model calls). Approving this spec authorizes every such run for the whole flow across seed, rows, repairs and finish, without per-step permission prompts; no count applies. No target-wide or cross-target sweep runs.

## Integration

- This change merges after #178 (reliable task tracking) merges; the branch is rebased onto it first.

## Errors and edge cases

- Stall is recomputed from history at every spent counter; no grant, flag or counter is stored. A resumed loop decides the same way from the ledger's commits. A resumed waves run that cannot recover the previous round takes one round and lets the fresh review decide.
- Accepted unbounded case: a loop row whose worker changes files and reports a different failure every round is never stalled and runs until the human interrupts. The ticket makes the stall test the only bound, and no bound on moving rounds is added. Two cases are not this one and stall at a spent allowance (D2 site 3): a row whose last two attempts were interrupted and changed nothing, and a row whose evidence states a spec-vs-code contradiction, which goes to the amendment surface.
- A human `retry` at a stalled row stop starts a new window, so the row gets at least two attempts before it can stall on repeated results; a first new attempt that shows the spec contradicting the code is routed to the amendment surface at once, as D2 states; `rows +N` resets no window.
- A waves interruption is recoverable when the printed observations establish the wave base, the dispatch identity and that the interrupted step wrote nothing to the checkout; it is repeated in the same turn (D1). An interruption that leaves any of those unknown, and a helper that fails a second time, take the existing stop, which carries `Needs:`.
- No way forward and no stall signal (for example a delegated lookup that failed twice): the existing stop applies and carries `Needs:`.
- A rebase onto #178 that conflicts in an edited paragraph: reapply that section's D1-D3 rule by section name and rerun the Tests entries that name the file.
- Without amend permission a worker-evidenced spec defect renders the amendment menu; that is the per-correction review the ticket keeps.
- A stand-in whose check fails is an ordinary failed attempt. A stand-in line written for a row that is later cut still appears in the list beside the cut.
- A waves `choice` held for the wave commit is lost when the session ends before that commit and the transcript line is not recoverable; the list then omits it.
- Stand-in lines that alone pass 180 words are all printed; the disclosure outranks the cap.
- `agents/loop-implementer.md` is shared with outside-ledger callers; their drivers ignore the two body lines.
- `closureReview.enforce: false`: site 7 continues without a `grant_fix_rounds` call, on the same stall test.
- A `grant_fix_rounds` error reply at site 7 takes the step-6 stop.

## Tests

Eval samples run with the paid action in D8; `npm test` runs the rest. Paid runs cover the new and rewritten samples named here and the two samples marked `replayed control` under AC 8; an audited sample runs only when its `expected.md` changed. Paid runs also cover replays of each sample whose saved result no longer matches the instruction files this change edits: `eval/gauntlet/samples/workflow-stage-ticket-row`, `legs-integration-sorted`, `drafted-row-scenarios`, `tree-wide-drafted-row`, `workflow-stage-drafted-row`, `ticket-all-rows-sorted`, `pr-body-drafted-row` and `post-action-sorted`; `eval/gatekeep-pr/samples/plain-report`; `eval/spec-gate/samples/scope-cuts-listed`; `eval/ship/samples/pr-body-integration`; `eval/loop/samples/seed-dispositions`; `eval/plan/samples/post-action-no-task`. Their sample files stay unchanged.

- AC 1, waves: a worker's in-spec decision is taken with no question, with and without amend permission - new `eval/waves/samples/worker-decision-taken`
- AC 1, waves recovery: a read-only `Amend-prepare:` helper interrupted before it returns is dispatched again in the same turn; an in-place worker interrupted with its writes unknown keeps the stop - new `eval/waves/samples/helper-interrupted-redispatch`
- AC 1, loop: a row below allowance whose evidence asks for a spec call is dispatched again - new `eval/loop/samples/spent-allowance-moving-or-stalled` (snapshot 1); a row reopened by an approved amendment during verify returns to ledger implementation with no second offer - rewritten `eval/loop/samples/verify-repair-count` (its `reopened` fact)
- AC 2, waves: `took recommendation:` printed and a `choice` line held - `eval/waves/samples/worker-decision-taken`; rewritten `eval/waves/samples/blocked-decision-auto-taken` (its `controls` fact, "budget-only, absent grant and more-attempt recommendations do not authorize an automatic decision", becomes the D1 rule)
- AC 2, loop: the row worker picks between two readings that fit the spec and writes the `choice` line - new `eval/loop-implementer/samples/reading-picked`; a contradiction no approved reading resolves stalls the row at a spent allowance and goes to the amendment surface, applied under amend permission and asked without it - `eval/loop/samples/spent-allowance-moving-or-stalled` (snapshot 5)
- AC 3, waves: a task past its escalated round with a `CONVERGING` re-review takes an extra round while one finding stays at the same location, and a spent task whose red gate shows a different failing assertion with a non-empty delta takes one with no review run - new `eval/waves/samples/extra-round-while-converging`; rewritten `eval/waves/samples/budget-exhausted`
- AC 3, loop: a row at allowance with new evidence dispatches - `eval/loop/samples/spent-allowance-moving-or-stalled` (snapshot 2); a row at allowance whose last two attempts are `interrupted - ` repair lines stops, and one with a single interruption dispatches (snapshot 4); a resumed session dispatches a moving row at its allowance - new `eval/gauntlet-resume/samples/loop-moving-row-at-allowance`; a verification repair that fixes one failing test behind the same gate and exit code takes another repair - rewritten `eval/loop/samples/verify-repair-count`; rewritten `eval/loop/samples/stagnation-and-retry`, `eval/loop/samples/cap-and-exit-verification`
- AC 3, review and conformance: a third `FIX_FIRST` with `CONVERGING` takes a fix round, its re-review dispatch carrying `## Previous review report (re-review trigger)` - new `eval/waves/samples/review-third-fix-round`; one round granted at the cap while a gap closed - rewritten `eval/loop/samples/conformance-grant`, `scripts/loop-conformance-grant.test.mjs`
- AC 4: a stalled row stops with `Needs:` and no `Stop` offer - `eval/loop/samples/spent-allowance-moving-or-stalled` (snapshot 3); rewritten `eval/loop/samples/human-stop-counts`, `eval/loop/samples/row-budget-actions`; a waves stop shows `Needs:`, no options and no `Recommendation:` footer, and a fact-ask stop names the missing artifact without asking where it is - new `eval/waves/samples/stop-needs-no-menu`; a stalled whole-diff review stops with `Problem:` and `Needs:` - `eval/waves/samples/review-third-fix-round` (second case); a stalled conformance cap stops with `Problem:` and `Needs:` and no funding menu - `eval/loop/samples/conformance-grant` (second case); with two open gaps that stop shows each gap's verdict for each round - new `eval/conformance-check/samples/stalled-per-gap-trail`
- AC 5: each kept question still ends the turn. Discard - unchanged `scripts/loop-dirty-tree-stop.test.mjs`. Redraw - unchanged `eval/waves/samples/redraw-under-grant`. Per-correction review - a spec defect without amend permission renders the amendment menu, `eval/loop/samples/spent-allowance-moving-or-stalled` (snapshot 5). Unnamed action - under amend permission the driver asks and cuts nothing - new `eval/loop/samples/unnamed-action-asks`, with the `unreachable: unnamed action` marker in `scripts/loop-implementer-actions.test.mjs` and `scripts/loop-unreachable-cut.test.mjs`. The never-take list in `eval/waves/samples/worker-decision-taken`; a missing credential still cuts under permission - unchanged `eval/loop/samples/unreachable-cut`
- AC 6, AC 7, AC 9: one list from amendment rows, `choice` and `stand-in` lines; two rows closed on the same missing input and stand-in render two lines; register applied; over the cap every stand-in line survives with its three facts and no choice or reason is dropped; stand-in bullet in the Option 1 PR body - new `eval/ship/samples/choices-list`; a companion checkout's lines join the one home list and its PR body carries its own stand-ins - new `eval/ship/samples/choices-list-legs`; the header-linked and rework bodies carry the line - new `eval/ship/samples/stand-in-linked-and-rework-body`; rewritten `eval/ship/samples/digest-from-record-lines`; `scripts/finish-amendment-digest.test.mjs` asserts the new heading, the audit-row mapping and the absence of a merge rule
- AC 8: the loop worker builds a stand-in and writes the line - new `eval/loop-implementer/samples/stand-in-built`; it cannot and records `unreachable:` - new `eval/loop-implementer/samples/stand-in-not-buildable`; the task-plan worker reports `stand-in:` in `concerns` - new `eval/implementer/samples/stand-in-reported`; a dispatch without the wave trigger builds none - replayed control `eval/implementer/samples/needs-context-no-edit`, its files unchanged; a wave task whose input cannot be stood in for is cut under amend permission and asked through the amendment menu without it - new `eval/waves/samples/stand-in-not-buildable`; a missing credential stays `unreachable:` - replayed control `eval/loop-implementer/samples/silence-bound-and-unreachable`; its `expected.md` names the job file under the Git-owned scratch folder the worker's instructions name, replacing the OS temp folder, and the sample is replayed once after that correction
- Inside-budget stall rules unchanged - unchanged `eval/waves/samples/stagnant-under-budget`, `eval/waves/samples/funded-failure-stop`, `eval/loop/samples/seed-retry`, `eval/implementer/samples/heavy-json-fixture`; rewritten for the D3 stop shape only, still a hard stop - `eval/waves/samples/reject-stop` (its "stop-note Recommendation footer" fact)
- Reworded `grant_fix_rounds` strings, same reject conditions - `extensions/phase-tracker.test.ts`
- Pinned text the design removes is rewritten, located by the quoted string, each pin replaced by an assertion of the new sentence:
  - `scripts/loop-engine-contract.test.mjs`: `attempts >= effective allowance | Human stop with or without amend permission` -> rule 2 stops only a stalled row; `rule 2 stops a repaired row at allowance` -> the pointer to rule 2; `amend or stop only` and `alongside Amend and Stop` -> the `Needs:` line and the accepted, unrendered replies; the `--allowance=N` "stops and asks" line -> the D2 flag line
  - `scripts/loop-implementer-actions.test.mjs`: `credential, environment or data not present` -> the row without "data", the stand-in row and the `unnamed action` marker
  - `scripts/brainstorming-contract.test.mjs`: `stop and ask there` -> the D2 flag lines
  - `scripts/ci.mjs`: the `["skills/gauntlet/ship/ship.md", "Amendments auto-applied", true]` pin -> `What the run decided on its own`; the `--allowance=N` line pin -> the D2 flag line
  - `scripts/brief-contract-lint.test.mjs`: `at or above its effective allowance stops under rule 2 without an attempt` -> the `restore-loop.md` pointer to rule 2
- Other contract tests keep passing against the edited text, updated only where an edited sentence is pinned - `scripts/loop-repair-counts.test.mjs`, `scripts/loop-verification-repair.test.mjs`, `scripts/loop-unreachable-cut.test.mjs`, `scripts/commit-message-contract.test.mjs`, `scripts/wave-review.test.mjs`
- Loop samples audited for removed behavior (an unconditional stop at allowance, "amend/stop only", the retry/`rows +N`/amend/stop menu) - `eval/loop/samples/retired-budgets`, `scaled-cap-grant`, `funding`, `exit-verification-escalates`, `exit-repair-capability`, `gate-set-failure`, `verify-repair-count`, `seed-interrupted-count`: each obsolete must-hold fact is rewritten to the D2 or D3 rule; a fact that still holds stays, and the commit body says why
- Seed and verification-repair stall tests (sites 4-5), the latter comparing failure evidence and never the gate index and exit code alone - `scripts/loop-repair-counts.test.mjs`, `scripts/loop-verification-repair.test.mjs`
- Unbounded loop case - none: accepted behavior, no stop to assert
- Waves `choice` lost across a session break - none: depends on a lost transcript
- Product docs match the rules - none: read at the conformance check

## Documentation impact

Per `documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - loop stop table and between-gates paragraph (major procedures); `doc/configuration.md` - "Escalation loop", "Loop stop boundaries", fix-round cap (operations / tunable parameters); `doc/implement-engines.md` - "Stops, models and telemetry" (communication contracts); `doc/gate-contract.md` - reply table and loop-stop paragraphs (communication contracts); `CHANGELOG.md` - `## Unreleased` entry (major procedures)
- Derived / memory docs invalidated: none

## Out of scope

- Counting: allowance, attempts, the escalation threshold, funded rounds, the re-review cap and `maxFixRounds` keep their arithmetic, settings and grammar.
- The replies `retry <n> | <hint>`, `rows +N`, `--fund-rounds=N`, `--allowance=N` and a human's N-round conformance grant.
- The four questions the ticket keeps, broken-setup stops, `REJECT`, `anchorUnreadable`, malformed grants.
- Brainstorm, plan and ship gates; the plan baseline menu; ship Step 3.5; `/skill:shape-ticket`'s gate behind `fix-first`.
- Any check before work starts for data a row needs (#177, closed).
- The restart of a quiet run from #169 and any logic change in `extensions/phase-tracker.ts`.
- Gatekeep and hotfix loop drivers.
- That list follows the "Register" rules of `skills/chase-bug/ - holding the 180-word cap when ordinary choices alone exceed it; the cap yields and no line or reason is dropped

## Open questions

- Not blocking: the ticket's 133 question turns and 85 hours were not reproduced and are treated as a description of the input.
