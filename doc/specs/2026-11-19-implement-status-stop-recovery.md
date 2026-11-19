# Restart an implementation turn that stops on a progress summary

**Goal:** When a main-session turn settles during the implement phase with a progress summary instead of a marked stop, the phase tracker sends one restart message so the next wave or row starts without a human turn.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Date:** 2026-11-19
**Predecessor:** `doc/specs/2026-07-30-automatic-transition-recovery.md` - supersedes the rule in `## Non-goals` and `## Recovery eligibility` that an in-progress implement phase is never restarted; the brainstorm, plan, verify and ship protections and both handoff restarts stay live.

## Problem

Request (anonymized): a colleague working in a consumer repo reports that the main session "keeps pausing after each wave", twice, costing over an hour; the engine (task-plan or loop) is not known. The requester adds that a wave/loop run also asked a needless question despite a standing amend grant, and asks whether the fix "might be deterministic".

During implement, continuing to the next wave or row rests only on skill wording ("Do not pause to check in with the user between tasks" in `skills/subagent-driven-development/SKILL.md`; the ordered table in `skills/loop-implementation/SKILL.md`). When the model ends its turn with a progress summary, nothing restarts the work: the phase tracker's settle restart covers only the two phase handoffs and skips any phase that is `in_progress`.

Framing: kept

### Checked claims

Held:

- `recoverableEdge` returns only `plan-implement` or `verify-ship` and rejects every phase map with an `in_progress` phase (`extensions/lib/phase-tracker-helpers.ts:21-27`). Run on `implement=in_progress` during triage: result `undefined`.
- The `agent_settled` handler requires `gauntletEntered`, a latest assistant stop reason other than `aborted`, a `recoverableEdge(phases)` result, an unspent edge, and `ctx.isIdle()`; it then sends one displayed custom message (`pi-gauntlet-transition-recovery`, `details.piGauntletRecoveryEdge`) with `{ triggerTurn: true }` (`extensions/phase-tracker.ts:642-657`). It has no settings gate and no subagent-child check.
- Abort is read from the branch's latest assistant stop reason (`branchLatestAssistantStopReason`, `extensions/phase-tracker.ts:527`). `StopReason` is `"pending" | "stop" | "length" | "toolUse" | "error" | "aborted" | "deferred"` (installed Pi 1.5.2 `pi-ai/dist/types.d.ts:321`).
- `recoveryEdgeFromDetails` returns an edge only for the values `plan-implement` and `verify-ship` (`extensions/phase-tracker.ts:184-188`), and `reconstructState` adds only those to `attemptedRecoveryEdges`; a third value on the same custom type is ignored by the once-per-edge set.
- `latestPlanSnapshot` reads task lists from successful `plan_tracker` tool results on the session branch (`extensions/phase-tracker.ts:112-130`); absent -> `[]`.
- `applyPlanActivity` completes `implement` only when every task is `complete` or `skipped` (`extensions/phase-tracker.ts:515-525`), so `implement=in_progress` with a task list means at least one task is not `complete` or `skipped`. That does not prove authorized work remains (see Corrected).
- `isSubagentChild` (`PI_SUBAGENT_DEPTH > 0`) exists because forked children replay the parent's phase state (`extensions/phase-tracker.ts:505-507`).
- Work requested from `agent_settled` starts after every settled handler finishes, and `ctx.isIdle()` is true there (Pi 1.5.2 `docs/extensions.md`, "agent_start / agent_end / agent_before_settle / agent_settled"). `isIdle()` is not a queue check (see Corrected). `sendMessage(message, options?: { triggerTurn?: boolean; deliverAs?: "steer" | "followUp" | "nextTurn" })` (`types.d.ts:1302-1306`).
- The first-line grammar is `gauntlet: gate=<skill>/<id>[ recommended=<token>]`, `gauntlet: question`, `gauntlet: done <outcome>`, `gauntlet: stuck <reason>`; ordinary answers, gates invented outside skill templates, and intermediate reports followed by automatic continuation carry no marker (`skills/brainstorming/reference/menu-layout.md`, "First-line rule"). `doc/gate-contract.md` has drivers read the first line of the last user-facing assistant message at `agent_settled`.
- Documented human stops in both engines start with a marker line (`skills/subagent-driven-development/stop-note.md` template; `skills/loop-implementation/SKILL.md` `## Human stop`).
- No extension helper tests for a waiting marker; the only marker regex matches `done|stuck` for telemetry (`extensions/lib/telemetry-leg.ts:42,124`).
- The predecessor protected in-progress phases on purpose (`doc/specs/2026-07-30-automatic-transition-recovery.md` `## Non-goals`; `## Recovery eligibility` line 69 "No phase has status `in_progress`", line 81 "`implement=in_progress` - implementation work"). `doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md:160-162` lists "an `agent_settled` runtime nudge when a turn lacks the line" as out of scope for that spec.
- The existing handoff restart is documented in `README.md:72`; `doc/configuration.md` has no entry for it.
- Existing settle tests use `harness({ branch })`, `enteredBranch(state, [...])`, `assistant(stopReason?)`, `settle(h)` and `h.sent` (`extensions/phase-tracker.test.ts:234-330`); the test `active phases, non-idleness, and earlier competing handlers do not spend recovery` (line 299) asserts no send for every in-progress phase, including implement, on a branch with no task list.
- Both extension test files ran during recon: 288 passed.

Corrected:

- Triage proposed "open tasks remain" through the pending/in_progress predicate (`unfinishedTaskLines`, `extensions/phase-tracker.ts:132-135`). A failed loop row is `failed`, not pending (`extensions/plan-tracker.ts:137-142`). The rule keys on `implement=in_progress` instead.
- Triage and the first design message reported "76 of 269" implement stops as silent status stops. That figure came from a text heuristic and mixed three kinds of stop. A replay of the earlier draft's rule (endpoint name/status comparison, boundary on human and restart messages only, no settlement-abort check) over the requester's saved sessions since 2026-10-29 (a stop = settled assistant turn with stop reason `stop` during implement, followed by a human message, with at least one pending, in_progress or failed task) counts 279 stops: 185 carry a `gauntlet:` first line, 94 do not. Of the 94: 34 made no tool call since the previous human message, 41 made tool calls but moved no task since the previous human message, 19 moved a task since the previous human message. That earlier rule restarts those 19 (17 before 2026-11-10, 2 from 2026-11-10 on; loop 11, task-plan 6, engine unknown 2). By reading their final paragraphs, most are progress summaries the human answered with "continue"; about four were waiting on the human with the marker left off. The counts were not recalculated for the rule in this spec and the 41-stop bucket is not broken down by engine, so they are results of the earlier predicate, not evidence for the revised task-movement rule (see `## Open questions`).
- An earlier design message placed the doc edits in `doc/configuration.md`; the owning paragraph is `README.md:72`.
- The draft read an interrupt only from the latest assistant stop reason. Pi 1.5.2 can emit `agent_settled` with `aborted: true` while that stop reason stays `stop` (council probe: `AgentSession.abort`, `_runBeforeSettleBoundary` and `_emitAgentSettled` run with an in-memory boundary handler). The new branch requires a non-aborted settlement event and stop reason exactly `stop`.
- The draft compared the name/status pairs of two endpoint task lists. A repeated loop failure keeps name `row N` and status `failed` and changes only `label`, which carries `<attempts>/<allowance>` (`extensions/plan-tracker.ts:134-166`); a retry can also move a row `failed -> in_progress -> failed` (`extensions/plan-tracker.test.ts:424`). Both leave the endpoints equal. The rule compares consecutive snapshots on `(name, status, label)` instead.
- The draft treated `failed` under `implement=in_progress` as remaining work. The task-plan engine uses `failed` only for a human-decided terminal failure (`skills/subagent-driven-development/SKILL.md`, "Lifecycle per task"); the loop engine redispatches failed rows under allowance. The restart message no longer says tasks remain.
- The draft tested "the message's text". Assistant `content` is an array of `text`, `thinking` and `toolCall` blocks (Pi 1.5.2 `pi-ai/dist/types.d.ts`, `AssistantMessage`); `textOf` joins only `text` blocks with newlines (`extensions/lib/telemetry-collect.ts:58-59`); the settle fixture `assistant()` sets no content (`extensions/phase-tracker.test.ts:61`).
- The draft's boundary ignored runs started by another extension's custom message. An idle custom message with `triggerTurn` starts a run without a user-role entry (council probe: Pi 1.5.2 `dist/core/agent-session.js:1938-1972,809-820`), so an unmarked reply could reuse task movement from before a marked stop. An earlier marked assistant message is now a boundary.
- The draft relied on `ctx.isIdle()` to keep the restart from racing other work. `isIdle()` stays true after another settled handler has requested a turn, and both requested runs start in order (council probe: Pi 1.5.2 `_emitAgentSettled`, `sendCustomMessage` and the `isIdle` getter with two in-memory handlers). See `### Delivery`.
- Row 4 said an aborted settlement receives no `implement-continue` message. Pi 1.5.2 `_runBeforeSettleBoundary` commits boundary drafts (`dist/core/agent-session.js:1637`) before it reads `_abortDuringBeforeSettle` (`:1640`), and the real-host case in `scripts/phase-tracker-host.test.mjs` observed one persisted entry, an aborted settlement and zero provider requests after the boundary. Row 4 now separates a run aborted before the boundary from an abort raised at it.
- Rows 2-5 of the draft acceptance criteria said "no restart message" under conditions the unchanged handoff accepts: the current handler sends `plan-implement` on a subagent-child branch with stop reason `error`, a `gauntlet: question` line and no tasks (council probe through the repo's Pi stubs). Those rows now constrain only `implement-continue`.

Not checked:

- The colleague's session transcript: not on this machine. The design rests on the same stop shape in the requester's saved sessions.
- Whether the unexpected-async-handle stop, the loop unsupported-ledger stop and a workflow-warning stop render a `gauntlet:` line: their wording does not say. The design does not depend on it (see "Errors and edge cases").
- A scripted reproduction of a no-marker status stop in a real engine run: model behavior, no deterministic harness. Tests simulate the settle event in the extension harness.
- Stops never followed by a human message are outside the replay.
- The model's response to the restart message (restating an unmarked real stop and ending the turn, versus proceeding): no test or eval covers it.
- `agent_before_settle` behavior was read from Pi 1.5.2 docs only (`types.d.ts:816-819`, `docs/extensions.md:665`), not exercised.
- The pi runtime package does not resolve from inside the worktree; API facts come from the installed 1.5.2 declarations and docs.

## Acceptance criteria

Rows 1-5 and 8 constrain only the `implement-continue` restart; the `plan-implement` and `verify-ship` handoff restarts stay governed by row 9. "Boundary", "task movement" and "visible text" are defined in `### Eligibility`.

Drafted from the design, no ticket rows:

- [ ] With implement in progress, a main-session turn whose settlement is not aborted, that ends with stop reason `stop`, has no `gauntlet:` marker line in the visible text of its last assistant message, and follows task movement since the boundary receives one `implement-continue` restart message that requests a new turn.
  in-scope
- [ ] A settled turn whose last assistant message has a `gauntlet:` marker line at the start of any line of its visible text receives no `implement-continue` message.
  in-scope
- [ ] A settled turn with no task movement since the boundary receives no `implement-continue` message.
  in-scope
- [ ] A turn whose run is aborted before the pre-settlement boundary, or whose final stop reason is `pending`, `length`, `toolUse`, `error`, `aborted` or `deferred`, receives no `implement-continue` message; a turn that a later handler aborts at that boundary starts no restart turn, and at most one displayed `implement-continue` message stays in the transcript.
  in-scope
- [ ] A settled turn in a subagent session receives no `implement-continue` message.
  in-scope
- [ ] At the pre-settlement boundary, already pending work or a continuation already requested by another handler receives no additional `implement-continue` request.
  in-scope
- [ ] After a session reload or fork, the restart decision equals the decision computed from the same history before it.
  in-scope
- [ ] With implement in progress and every unfinished task a retryable `failed` loop row, an otherwise eligible turn receives the `implement-continue` message.
  in-scope
- [ ] The plan-to-implement and verify-to-ship handoff restarts send the same messages under the same conditions as before this change.
  in-scope
- [ ] A settled turn with brainstorm, plan, verify or ship in progress receives no restart message.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: implement-status-stop-recovery
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); npm run build:bins after an edit under extensions/lib/, committing any regenerated bin/ bundle
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10
design: owns every path in Design; observable outcomes are the ten AC rows above

## Design

supersedes `doc/specs/2026-07-30-automatic-transition-recovery.md`, the implement-phase rule in `## Non-goals` and `## Recovery eligibility`

Use `agent_before_settle` only for `implement-continue`. Both handoff restarts remain on `agent_settled`; no fallback queues a turn there. No setting, skill or persona change.

### Eligibility

The handler keeps its current order: return when the gauntlet was not entered or the latest assistant stop reason is `aborted`; send the handoff restart when `recoverableEdge(phases)` returns an edge. `recoverableEdge` returns nothing while any phase is in progress, so the new branch and the handoff branch never both apply. The handoff branch keeps its predicate and messages unchanged: it gains none of the settlement-abort, marker, task-movement or subagent conditions below.

The new branch sends the restart message when every condition holds:

| # | Condition | Source |
|---|---|---|
| 1 | The gauntlet was entered | `gauntletEntered` |
| 2 | `implement` has status `in_progress` | `phases` |
| 3 | The session is not a subagent child | `isSubagentChild` |
| 4 | The run is not aborted before the boundary | Pi skips the pre-settlement hook for aborted runs; verify against host ordering. An abort raised by a later handler at the boundary is outside the tracker's view (`## Errors and edge cases`) |
| 5 | The latest assistant message on the branch has stop reason exactly `stop` | `branchLatestAssistantStopReason` |
| 6 | That message's visible text has no marker line | visible text and marker test below |
| 7 | A task moved since the boundary | boundary and task movement below |
| 8 | No other work is pending and no continuation has already been requested at this boundary | Use Pi boundary state and pending work, not `ctx.isIdle()`: the host control proves it is false inside a valid pre-settlement turn. |

Visible text: the message's `text` content blocks joined with newlines, as `textOf` does (`extensions/lib/telemetry-collect.ts`). `thinking` and `toolCall` blocks are not read. A message with no `text` block has empty visible text and no marker line.

Marker test: `/^gauntlet: (?:gate=|(?:question|done|stuck)\b)/m` over the visible text - a match at column zero of any line, not only line one. A line ending in CRLF and a line inside a code fence both match. `gauntlet: questionable`, `gauntlet:` in the middle of a line and the `/gauntlet:` slash-command prefix do not match.

Line one stays the only protocol marker (`doc/gate-contract.md`). The any-line test is a restart veto only: it leaves a stop alone when a marker sits below a preamble, and it gives a later-line marker no meaning for a driver.

Boundary: the latest branch entry before the settled (latest) assistant message that is one of:

- a user-role message;
- a custom message of type `pi-gauntlet-transition-recovery` (any `piGauntletRecoveryEdge` value);
- an earlier assistant message whose visible text has a marker line.

The settled assistant message is never its own boundary; its marker is condition 6. Other custom messages are not boundaries (display-only custom entries exist); the marked-stop boundary is what keeps a run triggered by a foreign custom message from reusing task movement from before a marked human stop.

Task movement: take the successful `plan_tracker` snapshots on the branch in order, starting with the last one before the boundary (the predecessor, possibly absent) and continuing with every one after the boundary. A task moved when at least one snapshot after the boundary either differs from the snapshot just before it in that sequence in its ordered `(name, status, label)` tuples, a missing `label` read as empty, or is non-empty and has no predecessor. A refresh that repeats the snapshot before it does not count. No snapshot after the boundary means no movement, and an empty final snapshot means no movement whatever came before it.

### Message

At the pre-settlement boundary append one displayed custom message of type `pi-gauntlet-transition-recovery`, with `details: { piGauntletRecoveryEdge: "implement-continue" }`, preserving existing entries, and request the single boundary continuation. Do not separately enqueue a provider turn. Content:

```text
Your last message ended the turn during the implementation phase without a `gauntlet:` marker line. If the user asked you to stop, or a decision is still unresolved, restate it and end the turn; start with a `gauntlet:` line only where a skill already prescribes one for that stop, and do not invent a gate, `done` or `stuck` line. Otherwise continue only work that is already authorized; do not reopen a task the user settled as a terminal failure.
```

The text reports only that no marker was found. It does not say the wait was unnecessary or that tasks remain: a `failed` task is a retryable row in the loop engine and a human-decided terminal failure in the task-plan engine, so `failed` status is not proof that authorized work remains. The text names no engine; the running session knows which one it is in. It changes no skill and adds nothing to the first-line grammar: an improvised stop is restated unmarked, moves no task, and is not restarted again.

### Bound

No counter and no new stored state. The restart message is a branch entry and becomes the next boundary, so a restarted turn that moves no task is not restarted again. A human message is a boundary too, so a turn that only answers the human is not restarted. An earlier marked assistant stop is a boundary, so task movement from before it never justifies a restart after it. The decision is recomputed from branch history on every settle, so reload, switch, fork and tree navigation need no reconstruction code. `implement-continue` is never added to `attemptedRecoveryEdges`.

### Data flow

`agent_before_settle` -> eligibility and branch history -> one boundary continuation with the restart entry or no change.

### Delivery

`ctx.isIdle()` is not a queue check. It stays true after another settled handler has requested a turn, and Pi starts both requested runs in order, so an earlier queued run can end in a marked human stop before the `implement-continue` run starts.

Invariant: an implementation restart cannot run past a newer marked human stop. First test the earlier boundary against real host ordering, including a competing extension, a later marked question, and a positive control showing the restart actually runs when eligible. Wire production delivery only on proof; otherwise leave implementation restart disabled and report the evidence. Never change either handoff restart.

### Remove

Nothing.

### Add

- `extensions/lib/phase-tracker-helpers.ts`: `hasGauntletMarkerLine(text)` implementing the marker test; `taskListMoved(predecessor, after)` implementing task movement as a pure function, where `after` is the ordered list of snapshots after the boundary.
- `extensions/phase-tracker.ts`: implementation-only pre-settlement handler, restart message and branch walk over assistant visible text and ordered task snapshots.
- `scripts/phase-tracker-host.test.mjs`: the real-host delivery regression, with positive control, final marked-stop assertion and implement handler coverage. Include in CI via `scripts/ci.mjs` as needed.
- `extensions/lib/phase-tracker-helpers.test.ts` and `extensions/phase-tracker.test.ts`: the tests in `## Tests`.
- `README.md`: the handoff-restart paragraph in the flow section also describes the implement restart and its conditions.
- `doc/gate-contract.md`: line one stays the only protocol marker; the tracker's any-line test is a restart veto, not a driver command. An unmarked first line is neither permission to answer nor a promise of another turn. A driver waits for another settle only when an automatic continuation is actually scheduled; the `pi-gauntlet-transition-recovery` custom message with `piGauntletRecoveryEdge: "implement-continue"` is the recovery request, not by itself proof that a run starts. When no continuation follows, the driver surfaces the existing stop to the operator.
- `CHANGELOG.md`: one `## Unreleased` entry.
- `doc/specs/2026-07-30-automatic-transition-recovery.md`: the supersession banner.
- `bin/*.mjs`: regenerated by `npm run build:bins` when the helper edit changes a bundle; never hand-edited.

### Named actions

No paid or external action is needed. Implementation and verification run `npm test` and `npm run build:bins` in the worktree. Approving this spec authorizes both for the whole flow, across seed, rows, repairs and finish, without per-step permission prompts.

## Errors and edge cases

- Stop reasons `aborted`, `error`, `length`, `pending`, `toolUse` and `deferred` never restart; only `stop` qualifies.
- An aborted run never starts a restart turn, even when the latest assistant stop reason is `stop` (an Escape after the assistant finished): Pi skips the pre-settlement boundary for a run aborted before it. The handoff restarts keep their existing predicate.
- An abort raised by a later handler at the pre-settlement boundary arrives after the tracker returned its draft, and the tracker cannot observe it. Pi 1.5.2 commits boundary drafts before it reads that abort, so one displayed `implement-continue` message stays in the transcript, the settlement is aborted and no provider request runs. That message is the next boundary for task movement, so it can only suppress a later restart, never add one.
- A marker line that appears only in a `thinking` block does not suppress the restart; a marker line in a `text` block does, including with a CRLF ending or inside a code fence.
- A loop retry that changes only a failed row's attempt label, or moves a row `failed -> in_progress -> failed`, counts as task movement. A refresh that repeats the previous snapshot does not.
- A marked human stop, then a run triggered by another extension's custom message, then an unmarked reply with no tracker activity: no restart, because the marked stop is the boundary.
- A task the human settled as a terminal failure in the task-plan engine is `failed` with implement still in progress, and recording it is task movement, so an unmarked settle after it receives the message. The message asks only for already-authorized work and tells the session not to reopen that task.
- Another settled handler requests a turn first and that run ends in a marked human stop: the `implement-continue` request must not start a run after it (`### Delivery`). `ctx.isIdle()` does not detect this ordering.
- A real stop with a short preamble before its marker line is left alone, because the marker test reads every line.
- A branch with no task list never restarts.
- A human steers mid-run with "stop after this wave", the wave completes, and the session stops without a marker: the restart fires once. The message tells the session to restate the stop and end the turn; a restated stop moves no task and stands.
- A real stop that omits its marker (the three unverified stops under "Not checked", an improvised decision question the grammar leaves unmarked, or any other) is restarted once by the same path. The message asks the session to restate it and end the turn, but a model can still proceed past the stop. This is a residual risk, not a one-extra-turn guarantee: the replay under the earlier predicate found about four genuine waits among its 19 restarted stops, and nothing in `## Tests` covers the model's response.
- A session that summarizes after every wave is restarted after every wave. Each restart needs a `plan_tracker` snapshot that differs from the one before it, after the previous restart.
- A failed boundary delivery is not recorded as successful movement or retried through a post-settlement send.
- A user-role message injected by another extension counts as a boundary. It can only suppress a restart, never add one.
- A program driving the gauntlet reads line one only. An unmarked first line is neither permission to answer nor a promise of continuation: the tracker also stays silent on a marker below a preamble and on every other failed eligibility condition. The driver waits for another settle only when an automatic continuation is actually scheduled; the `implement-continue` custom message is the recovery request, not proof that a run starts. With no continuation, the driver surfaces the existing stop to the operator.
- A Pi host without `agent_settled` keeps today's behavior.
- No pre-settlement hook: no implementation restart. Do not fall back to a queued post-settlement send.

## Tests

`extensions/phase-tracker.test.ts`:

Assistant fixtures in the new tests carry `content` as a block array, the shape Pi delivers; the existing `assistant()` helper sets none.

- Eligible unmarked normal stop appends one displayed `implement-continue` message and requests one boundary continuation.
- A `gauntlet:` line on line one of a `text` block sends nothing - "agent_settled leaves a marked implement stop alone".
- A `gauntlet:` line after a preamble sends nothing - same test, second case.
- A `gauntlet: question` line in a `thinking` block above unmarked visible text restarts; the identical line in a `text` block sends nothing - "agent_settled reads the implement marker from visible text only".
- No task movement since the last human message sends nothing - "agent_settled leaves an implement reply that moved no task alone".
- A second settle after a restart with no further movement sends nothing; with movement, sends again - "agent_settled restarts implement once per task movement".
- A failed retry that changes only the row's attempt label restarts; a `failed -> in_progress -> failed` round trip restarts; a refresh that repeats the previous snapshot sends nothing; a marked exhaustion stop sends nothing - "agent_settled restarts implement after a loop retry".
- After a marked stop, a reply to a foreign custom-triggered run with no tracker activity sends nothing, on the live session and on a branch rebuilt from the same history - "agent_settled does not carry task movement across a marked stop".
- Stop reasons `pending`, `length`, `toolUse`, `error`, `aborted` and `deferred` send nothing - "agent_settled skips implement restart for abnormal stops".
- A settlement event with `aborted: true` on an otherwise eligible history ending in `stop` sends nothing - "agent_settled skips implement restart for an aborted settlement".
- Host ordering: exercise competing continuation requests and an intervening marked human stop on the host. Assert a real eligible continuation, no implementation continuation after the mark, and unchanged handoff behavior.
- Host late abort: a later `agent_before_settle` handler aborts after the tracker returned its draft. Assert an aborted settlement and no provider request after the boundary; the persisted `implement-continue` entry is expected and is not asserted absent.
- A subagent child sends nothing - "agent_settled skips implement restart in a subagent child".
- An already requested continuation or queued work suppresses implement recovery at the earlier boundary - exercise both cases.
- No task list on the branch sends nothing - the existing test `active phases, non-idleness, and earlier competing handlers do not spend recovery`, unchanged.
- A branch rebuilt from history that already holds an `implement-continue` message gives the same decision as the live session - "agent_settled implement restart is recomputed from branch history".
- Implement in progress with only retryable `failed` loop rows unfinished still restarts, and the message text does not say tasks remain - "agent_settled restarts implement with only failed loop rows open".
- Brainstorm, plan, verify or ship in progress with a moved task list sends nothing - "agent_settled restarts only the implement phase".
- Both handoff restarts behave as before - the existing tests at lines 234-330, unchanged.
- An unsuccessful boundary delivery schedules no fallback - implementation delivery regression.
- A user-role message between the task movement and the settle suppresses the restart - covered by "agent_settled leaves an implement reply that moved no task alone".

`extensions/lib/phase-tracker-helpers.test.ts`:

- `hasGauntletMarkerLine` accepts `gate=`, `question`, `done` and `stuck` at the start of any line, with CRLF line endings and inside a code fence; rejects `gauntlet: questionable`, `gauntlet:` mid-line, the `/gauntlet:` prefix and empty text - "hasGauntletMarkerLine".
- `taskListMoved` reports a status change, an added task, a label-only change, a `failed -> in_progress -> failed` round trip across consecutive snapshots and a non-empty first snapshot with no predecessor as movement; a snapshot equal to its predecessor (a missing label equal to an empty one), no snapshot after the boundary and an empty final snapshot as none - "taskListMoved".

Not testable:

- A model ending its turn early in a real engine run - none: model behavior; the harness simulates the settle event.
- A model restating an unmarked real stop instead of proceeding after the restart message - none: model behavior.
- A Pi host without `agent_settled` - none: the handler is never called there.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (flow section, handoff-restart paragraph; major procedures / conventions), `doc/gate-contract.md` (automatic continuations; communication contracts / integrations), `CHANGELOG.md` (`## Unreleased` entry; major procedures / conventions - release history)
- Derived / memory docs invalidated: none

The materiality bar is `reference/documentation-impact.md`.

## Out of scope

- Questions that are not decisions (a stop whose options reduce to repair-or-stop). The requester's words: "just make sure loop engine don't ask if it 'should fix what is broken' as this is its main job! so hard escalation to human are ok but asking if problem should be fixed is procrastination!" The main session files this as its own ticket through `/skill:shape-ticket` after this spec's review gate, seeded with the stop counts from triage.
- The loop engine routing a row to "unreachable" when it only needs a later row built first.
- Restarting brainstorm, plan, verify or ship.
- A `piGauntlet` setting to disable or tune the restart.
- Skill or persona wording changes; marker lines on stops that lack one.
- Moving either existing phase-handoff restart to `agent_before_settle`.

## Open questions

- The colleague's two stalls are not confirmed against a transcript; the fix targets the same stop shape found in the requester's sessions.
- Whether the unexpected-async-handle, unsupported-ledger and workflow-warning stops carry a marker line. Unmarked ones are restarted once under this design; whether the session then restates the stop or proceeds past it is model behavior (residual risk in `## Errors and edge cases`).
- The seed reproduced unsafe post-settlement delivery. The earlier boundary is approved only conditional on the host-ordering proof above.
- The replay counts under "Corrected" are results of the earlier endpoint predicate. They were not recalculated for consecutive-snapshot task movement, and the 41-stop no-movement bucket is not broken down by engine, so how many loop retry stops the revised rule reaches is unmeasured.
