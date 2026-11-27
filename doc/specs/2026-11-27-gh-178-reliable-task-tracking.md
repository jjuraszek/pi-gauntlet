# Reliable task tracking: the tracker updates its own list in both implement engines

**Goal:** The progress list of an implementation run moves without the main session remembering a tracker call: `plan_tracker` redraws a loop run's list from the ledger at each worker dispatch, each human stop and verify start, starts a waves run's tasks when their worker is dispatched, and refuses a later wave while an earlier wave's tasks are open; every instruction that told the main session to do those things is deleted, except the one seed call ticket row 12 keeps.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #178
**Predecessor:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md, every tracker refresh point of "The loop driver" except the seed (before each dispatch, after each admitted commit, rule 1) and the restore refresh in "Resume, handoff, amendment, coordinated legs"; the seed refresh call, the `refresh` action, task names and identity stay live

## Problem

A gauntlet run implements a spec through one of two engines. The loop engine dispatches one worker per round to close rows of an acceptance-criteria checklist kept in a file (the ledger). The waves engine hands a task plan to workers in groups. In both, the progress list moves only when the main session (the model conversation that dispatches the workers) calls `plan_tracker`. The same list decides whether the implement phase can close.

Ticket #178 reports a loop run on 2026-11-26 whose list stood at "27/52 done (25 pending, 27 skipped)" after the 07:49 UTC refresh while 16 workers were dispatched and all 25 pending rows closed, then showed "52/52 done (27 skipped)" at the 09:23 UTC refresh. It also reports, from local logs of 129 loop sessions across six repositories, no update in 43 of 1,343 consecutive dispatch pairs (42 of 165 under the two newest main-session models, 1 of 1,132 under the earlier model). Both figures describe the reported input; the ticket attaches no source for either (`source: observed run - none`, `source: skip counts - none`), so neither was re-checked and neither is a target. No count exists for waves.

Reporter notes on the ticket, carried as requirements:

- The change blends into the current code; a main-session dependency is a bad fit for a long-running job.
- Of the two directions the note raises, this spec takes "change explicit task tracking with implicit tool responsibility". The other, moving orchestration from the main session into the tracker, is excluded by the ticket body and by the user.

User decisions made during design (2026-11-27), each binding:

- No general auto-tracking layer. The change makes the existing `plan_tracker` tool do more.
- The loop list moves once per round, at dispatch time.
- Reliable tracking is required in both engines. This overrides the ticket's Out of scope / Follow-up deferral of waves. Ticket rows stay verbatim and loop-scoped; waves behavior is in Design.
- A wave's tasks are closed by the main session; the tracker refuses a later wave's dispatch while an earlier wave's tasks are open, and never marks a waves task done on inference.
- The tracker stores its own lists behind one shared reader (approach A of three).
- The stored list holds only what the list needs and stays small: no ticket text, no ledger evidence, no decisions.
- One mechanism per list change: where the tool makes a change, no instruction file tells the main session to make it or restates how it happens.
- `gauntlet-handoff` and every `gauntlet-resume` route keep working, and the list can be recreated after a reload and in a fresh session.
- gatekeep-pr's list is a separate problem with its own ticket. check-delivery already initializes four stage rows plus one row per acceptance criterion once and needs no change.

Framing: pivoted to both implement engines in this spec, gatekeep-pr's list in its own ticket - gatekeep-pr's rows grow by design, a different cause than skipped updates, which a dispatch-time update cannot fix.

Split test recorded at the framing question:

    root cause: the list moves only when the main session remembers a tracker call, so it stands still while workers finish rows
    outcome: a person watching an implementation run sees the list move every round
    axis: Different actor or user journey

    root cause: gatekeep-pr adds a row per claim and per stage as it finds them, so done/total never says how far the gate is
    outcome: a reviewer gating a pull request sees a total fixed at the start, or no list
    axis: Genuinely different problem statements sharing code

### Checked claims

Checked in the worktree at `1add9a73` (Release 9.1.0). Line numbers in this spec refer to that commit.

| Claim | Lookup | Result |
|---|---|---|
| The loop list moves only on an explicit tracker call | `skills/gauntlet/implement/loop/loop.md:3,40,77,105,109,142` | held - refresh is instructed at seed, after the tuple write, after admitted commits, repairs and amendments; nothing enforces it |
| The tracker does not remember the ledger path | `extensions/plan-tracker.ts:22,247-279` | held - result details are `{ action, tasks, error? }` |
| At a loop dispatch the on-disk ledger holds only admitted results plus the dispatched row | `loop.md:77,87-109` | held - the driver validates or repairs the previous return before it writes the next `pending:` tuple |
| A worker's commit is not admission and no ledger field marks admission | `loop.md:89-91` | held - the child commit sets `returned:` before the parent validates |
| A `pending:` tuple hides a child-written `done` | `extensions/plan-tracker.ts:134-140` | corrected - `done` with a matching decision line projects `complete` even when `pending:` names the row, so a redraw between a child commit and validation would show unjudged results |
| The projection shows the dispatched row in progress | `extensions/plan-tracker.ts:103-139` | held - `pending: <row> \| <repo> \| <sha>` maps that row to `in_progress`; a seed dispatch maps no row |
| List state lives in `plan_tracker` tool results and three extensions each parse it | `extensions/plan-tracker.ts:205-216`, `extensions/phase-tracker.ts:145-160`, `extensions/telemetry.ts:210-213,995-1016` | held |
| An extension can see and refuse a `subagent` or `phase_tracker` call before it runs | pi `dist/core/extensions/types.d.ts:1109-1112`; `extensions/phase-tracker.ts:730-788` | held - `tool_call` handlers return `{ block, reason }` and all run before the tool executes |
| An extension can issue a real `plan_tracker` call from a hook | pi `types.d.ts:274-300,1224,1266`; `docs/extensions.md:1165,2792` | not found - `executeTool` exists only inside a tool's own `execute()`, and nested calls stay out of the transcript; an automatic update cannot be an ordinary tracker result |
| An extension can write its own session entry that replays with the branch and stays out of model context | pi `types.d.ts:1317`, `docs/extensions.md:1629,1683-1689`, `dist/core/agent-session.js:2879-2880`; `extensions/telemetry.ts:407,814` | held - `pi.appendEntry(customType, data)` writes synchronously; telemetry already uses one |
| A human stop can be told from an aborted turn | pi `types.d.ts:820-826` | held - `agent_settled` carries `aborted: boolean` |
| An extension-to-extension event channel is in use | `rg "pi\.events" extensions` | not found - the design adds none; consumers read session entries as they do today |
| Only the gauntlet loop dispatches a worker with a loop ledger | `skills/gatekeep-pr/reference/fix-wave.md:56,120-136` | corrected - gatekeep-pr's fix wave dispatches `loop-implementer` on a real loop ledger while its list holds stage and claim rows, so a dispatch never teaches the tracker a ledger path |
| Every route into the loop passes the ledger to `plan_check` before the first dispatch | `loop.md:40`, `skills/gauntlet-resume/reference/restore-loop.md:33`, `skills/gauntlet-resume/reference/reconstruction.md:72` | held - so the seed `refresh` call is not needed to learn the ledger |
| A passing `plan_check` result carries the path and replays from the branch | `extensions/phase-tracker.ts:991`; `extensions/telemetry.test.ts:252,275-277,368` | held - details are `{ status, specPath, planPath, ... }` |
| Starting verify has no task check today | `extensions/phase-tracker.ts:1173-1211` | corrected - `start` refuses any phase while another is `in_progress`; a loop run passes today only because the rule-1 refresh auto-completes implement first |
| `start implement` can move after pending recovery | `extensions/phase-tracker.ts:1214-1232` | not viable - it requires a current `plan_check` stamp over the ledger bytes, which recovery's repair commit changes |
| Waves relies on the main session to update the list | `skills/gauntlet/implement/waves/waves.md:103-111,125` | held |
| A waves dispatch identifies its plan tasks | `waves.md:191`, `skills/gauntlet/implement/waves/dispatch-contract.md:29,38`, `skills/gauntlet/plan/plan.md:76-83`, `skills/gauntlet/plan/plan-contract.md:61-83,143` | held - implementer tasks carry `planPath: <absolute plan>; anchor: ### Task N:`; list rows are named `W<k>: <title>` in plan order |
| A wave's acceptance has a durable per-task marker | `waves.md:125` | not found - one commit per wave composed in the main session; nothing maps a commit to tasks. Inference from a moved HEAD is possible but can mark a human-failed task done; the user chose not to infer |
| What a stored list holds | `extensions/plan-tracker.ts:21-22,78-82,161` | held - per task `{ name, status, label? }`; a ledger row's label is an attempts prefix, the criterion text cut to 80 characters and the owner |
| Worker sessions can be told from the main session | `extensions/phase-tracker.ts:564`, `extensions/telemetry.ts:238` | held - `PI_SUBAGENT_DEPTH > 0` |
| Handoff reads the list without changing it | `skills/gauntlet-handoff/SKILL.md:80`, `skills/gauntlet-resume/reference/brief-contract.md:27,36` | held - only `plan_tracker status`, copied verbatim |
| Waves resume recreates the list from the brief | `skills/gauntlet-resume/reference/restore-plan.md:17-21` | held - one `init` with names, order and statuses verbatim |
| Loop verify and ship resume recreates the list | `restore-loop.md:35,44-46` | held - one `init` with the saved mixed list, including `Gn:` tasks no file holds |
| Telemetry sets plan totals only when implement auto-completes from a tracker call | `extensions/telemetry.ts:995-1016` | held - a list changed without a tracker call never reaches it today |
| The predecessor rejected an automatic refresh | `doc/specs/2026-10-31-gh-106-universal-task-tracking.md:92` | held - "no tool result to replay from, deviates from AC 2's explicit refresh points"; the stored entry answers the first reason and this ticket replaces the second |
| Existing eval facts assert the refresh calls | `rg -c -i refresh eval/<target>/samples/*/expected.md` | held - 34 fact lines in 21 `loop` samples, 22 in 9 `gauntlet-resume` samples, 13 in 9 `ship` samples, 2 in 2 `gauntlet` samples; some use "refresh" in another sense |
| gatekeep-pr adds rows throughout a run | `skills/gatekeep-pr/SKILL.md:38` | held |
| check-delivery tracks acceptance criteria | `skills/check-delivery/SKILL.md:134-143` | held - one `init`, four stage rows plus one row per criterion, no later `add` |
| The ticket's skip counts and the 2026-11-26 run | ticket body `source:` lines | not checkable - local session logs, no source attached |
| A child can clear `pending:` before the parent judges its return | `loop.md:94-95`; `extensions/phase-tracker.ts:938-947` | held - the child commit replaces `pending:` with `returned:`; a list showing its `done` rows lets any successful tracker call, including handoff's `status`, auto-complete implement |
| The ledger records a parent's judgment only when the parent writes | `loop.md:105,109,131-132,142`, `interrupted-recovery.md:7`, `restore-loop.md:54-56` | held - a repair, retry, `rows +N`, escalation or amendment appends a parent decision; a clean admission writes nothing |
| A failed row can be re-dispatched with no stop in between | `loop.md:69,77,109`; `extensions/plan-tracker.ts:134-140` | held - the failed row is selected again and its new tuple projects `in_progress`, so one projection per dispatch never shows `failed` |
| Pi runs every `tool_call` handler of one assistant message before any call of that message executes | pi `agent-core/dist/agent-loop.js:374,417-466`; `extensions/plan-tracker.ts:245` | held - only a batch holding an `executionMode: "sequential"` tool runs one call at a time; `plan_tracker` is such a tool and `subagent`, `bash` and `edit` are not |
| An extension sees an assistant message's tool calls before they run | pi `types.d.ts:867-871,1260`; `agent-loop.js:338,170` | held - `message_end` carries the message and fires before `executeToolCalls` |
| A blocked dispatch still leaves a `subagent` result | `extensions/phase-tracker.ts:756-768`; pi `dist/core/extensions/runner.js:965-978`, `agent-loop.js:646-650` | held - the first blocking handler ends preflight; the result is an error with empty details |
| A waves list position equals the plan position | `extensions/plan-tracker.ts:332`; `skills/gauntlet/implement/waves/implement-amendments.md:5-11` | corrected - `add` appends an amendment's new task at the list end while its plan heading can sit in an earlier wave |
| Plan wave headings and anchors have one spelling | `plan-contract.md:61-83`; `dispatch-contract.md:29,38`; `waves.md:191` | corrected - wave headings carry a label after the number; anchors appear as `anchor: ### Task N:`, `anchor: "### Task N:"` and `anchors: [<prefixes>]` |
| A waves restore can hold two waves in progress | `skills/gauntlet-resume/reference/restore-plan.md:17-21` | held - the brief's statuses are restored verbatim |
| Other skills start a list with `clear` | `skills/gatekeep-pr/SKILL.md:38`, `skills/check-delivery/SKILL.md:134` | corrected - both start with `init` |
| One `start` result records one phase transition in telemetry | `extensions/lib/telemetry-record.ts:15-19` | corrected - every phase the result changes gets the result's action |
| Telemetry's reopen count ignores a row that passes through `pending` | `extensions/lib/telemetry-collect.ts:74-77` | held - it counts `complete -> failed` and `complete -> in_progress` between two lists, by name |
| Extension tests run from a glob | `scripts/ci.mjs:486-512` | corrected - an explicit file list |
| CI asserts the refresh instructions | `scripts/loop-engine-contract.test.mjs:320-337`, `scripts/brief-contract-lint.test.mjs:144-149`, `scripts/resume-routes.test.mjs:177`; `scripts/ci.mjs:568,579,587` | held |
| The resume read-trace check runs in CI | `scripts/resume-read-traces.test.mjs:14,71-91`; `eval/gauntlet-resume/tool-traces/README.md` | corrected - a local check; it binds committed captures to instruction hashes and requires a restore `refresh` call; a recapture is a tool-enabled model session |
| A task name has a maximum length | `extensions/plan-tracker.ts:25-32,78-82,260-278` | not found - `init` and `add` accept any name and the projection keeps non-ledger tasks whole |
| A redraw keeps list indexes | `extensions/plan-tracker.ts:261-267` | corrected - the order is projected non-pending, kept non-pending, projected pending, kept pending |

## Acceptance criteria

Ticket #178, checkbox list, rows verbatim:

- [ ] In a loop run whose main session makes no tracker call after the ledger is seeded, the progress list shows the dispatched row as in progress while its worker runs.
  in-scope
- [ ] In that run, after each admitted worker return the list shows the ledger's row statuses as of that return before the next worker is dispatched.
  in-scope
- [ ] In that run, while a worker's return is not yet admitted, the list shows no row status that return wrote to the ledger.
  in-scope
- [ ] In that run, after the run rejects a worker return and records the repair in the ledger, the list shows the dispatched row as the repaired ledger records it (failed for a numbered row; a rejected seed changes no row) and every other row with the status it had before that return, before the next worker is dispatched.
  in-scope
- [ ] In that run, when the main session stops for a human decision, the list shows the ledger's row statuses as of that stop.
  in-scope
- [ ] In that run, once the ledger has no open or failed row, the implementation phase shows complete when the main session starts verify, with no tracker call from the main session.
  in-scope
- [ ] Reloading or resuming the session mid-run shows the list the ledger describes, with no tracker call from the main session.
  in-scope
- [ ] A session that makes explicit tracker calls (init, add, update, status, clear, refresh) sees each call return the task list it returns today for the same inputs.
  in-scope
- [ ] After an automatic update, an explicit status call shows the updated list without duplicating tasks or reverting their statuses.
  in-scope
- [ ] After an automatic update, the check that refuses to complete implement or verify while tasks are unfinished judges the updated list, not the list from the last explicit tracker call.
  in-scope
- [ ] The sealed telemetry record of a loop run whose main session makes no tracker call after the ledger is seeded reports the plan totals of the final list.
  in-scope
- [ ] The loop engine's instructions, including its recovery and resume references, tell the main session to call the tracker for the ledger list only where the ledger is seeded; no step refreshes the list after a ledger commit, before a dispatch, or on resume.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-178-reliable-task-tracking
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
design: owns every path named in Design D1-D9 under `extensions/`, `skills/`, `scripts/`, `eval/`, `doc/`, `README.md` and `CHANGELOG.md`; the observable outcomes are the in-scope rows above and the clauses of Design and Errors and edge cases.

## Design

supersedes doc/specs/2026-10-31-gh-106-universal-task-tracking.md, every tracker refresh point of "The loop driver" except the seed (before each dispatch, after each admitted commit, rule 1) and the restore refresh in "Resume, handoff, amendment, coordinated legs". Its seed refresh call, `refresh` action, task names and identity stay live.

Terms used below:

- **List**: the tracker's ordered tasks, each `{ name, status, label? }`.
- **Stored list**: a list the tracker saved itself as a session entry, without a tool call.
- **Newest list**: the latest list on the current session branch, whether from a successful `plan_tracker` result or a stored list.
- **Bound ledger**: the file a loop run's list is redrawn from (D2).
- **Redraw**: project the bound ledger, merge it with the non-ledger tasks, and store the result when the admission rule (D3) allows it and it differs from the newest list.
- **Judged return**: a worker return the parent has admitted or repaired. Admission stays in the main session; the tracker reads evidence of it and never validates a return.
- **Main session**: a session with `PI_SUBAGENT_DEPTH` unset or `0`.

Responsibilities: the tracker owns every list change, automatic or called. One shared reader returns the newest list to the tracker, the phase tool and telemetry. The phase tool decides implement completion at verify start. No event channel is added between extensions.

### D1 Shared reader

Add: `extensions/lib/plan-snapshot.ts`, exporting the custom entry type name `plan-tracker-snapshot`, `planSnapshot(entry)` and `latestPlanSnapshot(branch)`.

- `planSnapshot(entry)` returns the list carried by a session entry: the `details.tasks` of a successful, error-free `plan_tracker` tool result, or the `tasks` of a `plan-tracker-snapshot` custom entry. Any other entry returns nothing.
- `latestPlanSnapshot(branch)` returns the newest list on the branch, or an empty list.

Remove: the private `planSnapshot` and `latestPlanSnapshot` in `extensions/phase-tracker.ts` (`:145-160`), the inline `plan_tracker` result parsing in `extensions/telemetry.ts` `replayBranch` (`:210-215`), and the inline branch walk in `extensions/plan-tracker.ts` `reconstructState` (`:206-216`). Each call site uses the shared reader.

The tracker's state after session start, switch, fork and tree is the newest list of that branch. When a ledger is bound on that branch, the branch-activation redraw (D3 point 4) then reconciles that list with the ledger when the branch ends in a marked stop.

Add: `extensions/lib/plan-snapshot.test.ts`, registered in the explicit extension test list of `scripts/ci.mjs` (`:486-512`) so `npm test` runs it.

### D2 Bound ledger

The bound ledger is the `planPath` of the newest passing `plan_check` result on the branch that comes after the last successful `plan_tracker` `clear` or `init`. An `init` is how another skill takes the list over (gatekeep-pr and check-delivery start with `init`, not `clear`), so it ends the binding like `clear`; the result an explicit `init` returns is unchanged (row 8). A loop restore that restores tasks with `init` issues it before its `plan_check` (D8), so the restore's binding survives. A relative `planPath` resolves against the session cwd, as the `refresh` action resolves its path. The binding is computed from the branch each time it is needed; nothing is kept in memory and no path is written to a stored list.

The tracker is not bound, and every loop redraw point does nothing, when no such result exists, when the file is missing, or when line 1 of the file is not `# Ledger - loop engine` (a task plan).

A worker dispatch never binds a ledger, and neither does the `refresh` action. gatekeep-pr's entry `init` ends any binding an earlier loop run left on the branch, and its fix wave dispatches a loop worker on its own ledger without calling `plan_check` on it, so its list never gains ledger rows.

### D3 Loop redraw

Add, in `extensions/plan-tracker.ts`, four redraw points, active only in the main session and only while a ledger is bound:

1. **Dispatch.** Before any `subagent` tool call executes.
2. **Stop.** When a turn settles for the human (`agent_settled` with `aborted: false`). An aborted turn redraws nothing.
3. **Verify start.** Before a `phase_tracker` call with `action: "start"` and `phase: "verify"` executes.
4. **Branch activation.** On session start, switch, fork and tree, after the newest list of that branch is loaded (D1).

A redraw uses the projection the `refresh` action uses today: ledger rows replace the list's ledger entries, non-ledger tasks (for example `Gn:` conformance tasks) keep their names and statuses, non-pending tasks sort first, and the result passes the pending-suffix rule. Extract that body of the `refresh` action into one function both callers use; the `refresh` action's results stay byte-identical.

A redraw stores the list with `pi.appendEntry("plan-tracker-snapshot", { tasks })` only when the admission rule below allows it and the list differs from the newest list in any task's name, status or label, then updates the tracker's memory and widget. An unchanged list writes nothing.

**Admission rule.** A redraw stores row statuses only when the latest worker return is a judged return. It applies at every redraw point; there is no exception for a stop that falls between a return and its judgment. The tracker reads one of two kinds of evidence, both acts of the main session. Ledger text is never evidence: the worker writes the same file, so a worker can append any decision line the parent writes.

| Evidence | Holds when | Applies at |
|---|---|---|
| Parent act | The redraw point is a dispatch, or a verify start while the phase state on the branch has implement `in_progress` (the ordered table's rule 1). The driver reaches both only after it validated or repaired the previous return (`loop.md:54,94-109`). A dispatch that an earlier handler blocked is still a parent act and ran no worker: its `subagent` result is an error with empty details (the predicate `isNonDispatchResult` of `extensions/phase-tracker.ts:500` reads). | Dispatch; verify start from rule 1; the stop whose newest `subagent` result on the branch is such a blocked call |
| Stop marker | The newest assistant message on the branch opens with the line `gauntlet: question` or a `gauntlet: gate=<id>` line (`doc/gate-contract.md`), and no `subagent` result on the branch is newer than that message. The driver opens every human stop with that line and renders a stop only after it validated or repaired the return (`loop.md` `## Human stop`); a restore resolves its pending-recovery question before the `plan_check` that binds (`restore-loop.md` step 1), so a marked stop in a bound session follows recovery. A worker cannot write the main session's message. | Stop; branch activation |

With neither kind, judgment is unknown: the redraw stores nothing and the newest list stands. That list was stored at the last judged point, so it shows the dispatched row `in_progress` and no status the unjudged return wrote. A restore's `start verify` precedes pending recovery and is neither kind: it stores nothing and still blocks on an unprojectable ledger. A turn that ends without the marker (an ordinary answer, a `gauntlet: stuck` or `gauntlet: done` turn) and a reload whose branch does not end in a marked stop are unknown too; the next dispatch or marked stop redraws. The tracker stores no record of a dispatch: `plan-tracker-snapshot` stays its only entry type, and a dispatch whose lists equal the newest list appends nothing.

**Dispatch alone in its batch.** Pi runs the `tool_call` handlers of every call in one assistant message before any of those calls executes (Checked claims), so a dispatch batched with the tuple write or a repair commit would redraw from the ledger as it was before that write. While a ledger is bound, the tracker blocks a `subagent` call that shares its assistant message with any other tool call. It learns the batch from the `message_end` event that carries the message. The reason says the ledger write must finish first and tells the main session to issue the dispatch again, alone in its own message. A blocked call redraws nothing.

**Two lists per dispatch.** The dispatch redraw stores up to two lists, in this order, before the call executes:

1. The return state: the projection with the on-disk `pending:` tuple left out. It shows the previous return as admitted or repaired, so a row that failed shows `failed` and a row re-bound by an amendment shows `pending`.
2. The start state: the full projection, with the tuple's row `in_progress`.

Each is stored only when it differs from the list before it. The list still moves once per round, at dispatch time; a row that is retried at once shows `failed`, then `in_progress`.

**Resume boundary.** A fresh-session restore binds at its `plan_check` and reaches its first redraw point after pending recovery: `restore-loop.md` step 9 hands to the driver's ordered table (implement) or `## After the loop` step 1 (verify, ship), and every outcome there is a dispatch, a human stop or verify start. No earlier point after recovery exists: the restore's phase calls come before pending recovery, and `start implement` cannot move after it (Checked claims).

Why these points satisfy the ticket rows:

- At a dispatch the driver has already validated or repaired the previous return and written the next `pending:` tuple, and the dispatch runs alone after that write, so the ledger on disk holds judged results plus the dispatched row. The return state shows the previous return's statuses and the start state shows the new row `in_progress`, both before the worker starts (rows 1, 2, 4).
- While a worker runs and until its return is a judged return, every redraw point stores nothing: no parent act has happened and no marked stop follows the dispatch (row 3).
- At a human stop the stop redraw shows the ledger as of that stop when the turn's final message opens with the stop marker or the stop follows a blocked dispatch (row 5). That covers the stop that directly follows a clean admission.
- On a reload the branch-activation redraw brings a stored list up to the ledger when the branch ends in a marked stop, for example after a repair committed since the last stored list (row 7).

Reading of row 2: "before the next worker is dispatched" means the list is current by the time the next worker starts. Reading of row 3: it binds every redraw point. Reading of row 7: after a reload the list is the newest stored list of the branch, reconciled with the ledger when the branch ends in a marked stop; in a fresh session it is drawn at the resume boundary, and until then it holds the tasks the restore's `init` restored, or nothing.

### D4 Stored list contents

A stored list entry is exactly `{ tasks: [{ name, status, label? }] }`. It carries no ledger path, evidence cell, decision line, spec text or ticket text. A ledger row's name is `row <n>` or `row <n> (<repo>)`; its label is today's label (attempts prefix, criterion text cut to 80 characters, owner). The entry is a custom session entry and never enters model context.

**Size limit.** The field list and the 80-character cut do not bound an entry, because a carried non-ledger task keeps its whole name and `init` and `add` accept any name (Checked claims). An automatic store is therefore measured: the UTF-8 byte length of `JSON.stringify({ tasks })` must not exceed `MAX_STORED_LIST_BYTES`, a constant in `extensions/lib/plan-snapshot.ts` with the value `32768`.

- Over the limit: the automatic update is not applied. No entry is written, the tracker's memory and widget keep the newest list, and one UI warning per distinct overflow names the measured size and the limit.
- Names are never cut or dropped to fit: `status`, `update`, handoff and resume replay names as identity.
- Explicit calls are not measured and return what they return today (row 8).

### D5 Waves start and refusal

Add, in the same `subagent` handler of `extensions/plan-tracker.ts`, active only in the main session:

**Dispatched tasks.** Items are read from the call's `task`, `tasks[]`, `chain[]` and `chain[].parallel[]` shapes. An item counts when its agent is `implementer` and its task text carries `planPath: <path>` and an `anchor:` or `anchors:` field. The tracker takes every `### Task <n>:` prefix in that field's value. All three spellings the contracts show parse: `anchor: ### Task N:`, `anchor: "### Task N:"` and `anchors: [<prefixes>]` (`dispatch-contract.md:29,38`, `waves.md:191`). `### Task 4:` never matches `### Task 40:`.

**Identity.** The tracker reads the plan at `planPath`. For each named prefix it finds the `### Task <n>: <title>` heading and the nearest `## Wave <k>` heading above it; the label after the wave number (`plan-contract.md:61-83`) is ignored. The task's list entry is the one named exactly `W<k>: <title>`, wherever it sits in the list. Position is not identity: an amendment appends its new task with `add` while the plan places it inside a wave (Checked claims). A task resolves when exactly one entry carries that name.

**Known waves run.** The newest list holds at least one entry named `W<digits>: ...` and the item counts as above. The refusals below apply only then; every other `subagent` call is left alone.

In a known waves run the tracker checks in this order and blocks at the first miss. A blocked call starts nothing.

1. **Unresolved task.** The plan is unreadable, a named prefix has no heading, or a name matches no entry or several. The reason lists each as `### Task <n>: expected "W<k>: <title>", found <count>` and names the fix: `add` the missing task, or re-`init` with `{name, status}[]` keeping every task and its true status. A silent pass here would lose both the start and the wave guard.
2. **Earlier wave open.** For each resolved task, in wave `k`: an entry whose `W<j>:` prefix has `j < k` is `pending` or `in_progress`. This holds whether or not the dispatch would start anything, so a restored list with a `W1:` and a `W2:` task both `in_progress` refuses the `W2:` dispatch. The reason lists each open entry as `<index>: <name> (<status>)` and names the fix: `plan_tracker({ action: "update", index, status })` with the task's true status. Entries of the same wave never trigger it, so a repair or re-dispatch inside a wave stays legal.
3. **Start order.** Starting the resolved `pending` tasks would leave a `pending` entry ahead of a started one, which the pending-suffix rule forbids. This is list order, not wave order, and it applies inside one wave too: tasks of a split wave start in increasing index order. The reason lists the earlier `pending` entries as `<index>: <name> (pending)` and names the fixes today's `update` rejection names.

When no check blocks:

- **Start.** Every resolved task that is `pending` becomes `in_progress`, and the list is stored as in D3, within the D4 limit.
- **No-op.** A dispatch whose resolved tasks are all `in_progress`, `complete`, `failed` or `skipped` changes nothing.

The automatic start moves `pending` to `in_progress` only. Closing a wave's tasks after its commit, recording a human ruling of `failed` or `skipped`, and reopening a completed task for fix work stay `plan_tracker update` calls by the main session.

### D6 Verify start completes implement

Change, in `extensions/phase-tracker.ts`, the `start` branch that refuses a phase while another is `in_progress` (`:1173-1211`), for `phase: "verify"` while implement is `in_progress`:

- The newest list is non-empty and every task is `complete` or `skipped`: complete implement with the same state change the tracker-call auto-completion makes, then start verify.
- Otherwise: refuse with today's sentence. When the list has unfinished tasks, append `unfinished tasks:` and one `<index>: <name> (<status>)` line per `pending` or `in_progress` task.

The D3 verify-start redraw runs before this branch executes, so a loop run whose ledger has no open or failed row completes implement at verify start with no tracker call (row 6). The same branch serves waves. The existing auto-completion on a `plan_tracker` call is unchanged. A stored list never completes implement by itself, neither in the phase tool nor in telemetry's mirror of it.

The completion refusal (`:1304-1313`) and the verify-phase open-task nudge (`:927`) read the newest list through D1, so both judge stored lists (row 10).

### D7 Telemetry

Change, in `extensions/telemetry.ts`:

- `replayBranch` and the live handlers read lists through D1. A stored list updates telemetry's last-seen list and never changes its phase mirror.
- When telemetry handles a `plan_tracker` or `phase_tracker` tool end, it first consumes every list on the branch it has not yet seen, in order, applying today's reopen comparison to each consecutive pair, so a reopen that appeared only in stored lists is counted exactly once.
- When telemetry observes implement becoming complete, whether from a tracker call or from the `phase_tracker` result of D6, it sets the record's plan totals from the newest list.
- D6's result changes two phases under one `start` action, and `diffPhases` gives every changed phase the result's action (Checked claims), which would record a second implement start. For that result telemetry emits `complete implement`, then `start verify`, in that order.
- A row re-bound by a granted amendment is not a reopen (`amendment-surface.md:171`). The dispatch redraw's return-state list (D3) shows that row `pending` before the start-state list shows it `in_progress`, so the consecutive-pair comparison sees `complete -> pending -> in_progress`, and `countReopens` counts only `complete -> failed` and `complete -> in_progress`. A row that goes from `complete` straight to `in_progress` or `failed` between two consecutive lists is a reopen and is counted.

Reading of row 11: in a run with no tracker call the final list is the list when implement completes; it is re-set whenever implement completes again. Tasks added during verify stay outside the totals, as today.

### D8 Instruction files

One mechanism per list change: every instruction below is deleted, not reworded into a description of the tool.

Rule: remove every sentence, step or parenthetical that tells the main session to refresh the tracker's ledger list, or that restates such a refresh, in the loop engine files, `skills/gauntlet/amendment-surface.md` and the two resume references, except the one seed call. The line list below is the inventory at `1add9a73`; the rule decides a site the list misses.

Remove:

- `skills/gauntlet/implement/loop/loop.md`: the three `plan_tracker` refresh sentences in the opening paragraph (`:3`); "before refresh" in the resume paragraph (`:42`); the refresh in rule 1 of the ordered table (`:58`); the refresh after the tuple write (`:77`), after the seed repair commit (`:105`) and after the row repair commit (`:109`); in the dirty-tree discard sequence (`:127`) both the parenthetical that restates step 5 and the restore refresh; the refresh after the amendment commit (`:142`) and after the verification repair marker (`:168`); both refreshes in the reopened-row paragraph (`:173`), the one before the stop and the one in "Dispatch, Validate the return and refresh".
- `skills/gauntlet/implement/loop/interrupted-recovery.md`: both refresh steps (`:7`).
- `skills/gauntlet/implement/loop/coordinated-legs.md`: the pre-dispatch refresh (`:23`) and "Refresh and return to the driver's ordered table" (`:35`).
- `skills/gauntlet/amendment-surface.md`: the driver's next ledger-path refresh and both refreshes in the `(tuple, refresh, admission, refresh)` parenthetical (`:171`); the status mapping and "count neither as a reopen" stay as statements about the ledger.
- `skills/gauntlet-resume/reference/restore-loop.md`: "Restore tasks through refresh" (`:34`), both "before refresh" mentions (`:37`), the whole refresh step and its `plan_tracker status` report (`:38`), "completes implement through refresh" (`:41`), and the post-restore refresh clause of "Ledger task names" (`:46`).
- `skills/gauntlet-resume/reference/reconstruction.md`: the refresh mention (`:72`).
- `skills/gauntlet/implement/waves/waves.md`: the sentence that `plan_tracker` auto-completes implement once every task is done (`:103`); the "Wave fan-out -> `in_progress`" bullet (`:108`); the `pending -> in_progress (wave fan-out)` half of the lifecycle bullet.

Change:

- `loop.md` rule 1 reads: no `open` or `failed` row - continue at After the loop step 0. The sentence at `:65` reads: when `start verify` is refused at rule 1, take the matching human stop.
- `loop.md` `## After the loop` step 3: before an index-based `plan_tracker update` in verify, read `plan_tracker status` when a dispatch or a stop came since the index was read. A redraw can reorder a mixed list (Checked claims) and a stored list never enters model context. This reads the list, not the ledger.
- `restore-loop.md` step 4, implement brief or worktree: `start implement`, with no tracker call.
- `restore-loop.md` step 4, verify or ship brief: `plan_tracker init` restores only the brief's non-ledger tasks, names and statuses verbatim, and is issued before step 3's `plan_check`; a brief with no such task makes no `init`. Brief rows that match the "Ledger task names" pattern are not restored; the tracker draws them from the ledger and merges them with the restored tasks. "Ledger task names" keeps the pattern for recognizing those rows and for the saved-snapshot comparison of `## Pending recovery`.
- `restore-loop.md` step 9 reads: an all-closed ledger takes After the loop step 0. It also keeps today's stop on a projection failure: when a dispatch or `start verify` is refused with a ledger projection error, stop with its findings.

Keep, each stated once in the file that owns the step:

- `loop.md` Entry step 5 (`:40`): the one seed call, `plan_tracker({ action: "refresh", path: <absolute ledger path> })` after `start implement`. Ticket row 12 keeps it, and no scope decision cut it.
- `skills/gauntlet/plan/plan.md`: the one `init` from the plan's task list.
- `waves.md`: mark a wave's tasks `complete` after its commit; record `failed` and `skipped` rulings.
- `skills/gauntlet/implement/waves/parallel-agents.md`: reopen an existing index for fix work.
- `skills/gauntlet-resume/reference/restore-plan.md`: the `init` from the brief.
- `skills/gauntlet-handoff/SKILL.md`: unchanged.

Reading of row 12: "only where the ledger is seeded" is the one seed call in `loop.md` Entry step 5. The verify and ship restore `init` carries no ledger row, so it is not a call for the ledger list. The `status` read in `## After the loop` step 3 and in handoff reads the list and refreshes nothing.

The `refresh` action stays in the tool (row 8). The seed call is the only instruction that calls it.

Add: `scripts/tracker-refresh-instructions.test.mjs`, wired into `scripts/ci.mjs`. It fails when:

- `action: "refresh"` or `plan_tracker refresh` occurs in any file under `skills/` or `agents/` other than once, in `loop.md` Entry step 5 after `start implement`; or that one seed call is missing.
- The word `refresh`, in any letter case, occurs anywhere else in the loop engine files, `amendment-surface.md`, `restore-loop.md` or `reconstruction.md` outside an allowlist of exact phrases that use it in another sense. The allowlist at `1add9a73`: "refresh the held row dispositions" (`loop.md:140`), "never refresh it inside the loop" (`restore-loop.md:36`), "Refresh held state" (`unreachable-returns.md:12`), and "repeated baseline refreshes" and "a refresh trigger" (`amendment-surface.md:47`).

Change, in the tests that assert today's refresh instructions (`scripts/ci.mjs:568,579,587` runs them):

- `scripts/loop-engine-contract.test.mjs` (`:320-337`): keep the seed sequence assertion; replace the rule-1, post-commit and post-tuple refresh assertions with the new rule-1 and `:65` sentences and the dispatch ordering that remains.
- `scripts/brief-contract-lint.test.mjs` (`:144-149`) and `scripts/resume-routes.test.mjs` (`:177`): assert the restore order without a refresh - pending recovery after phase restoration and before any dispatch, the verify and ship `init` before `plan_check`, and no `plan_tracker` refresh call.

These are behavior-changing skill edits under `AGENTS.md` "Change process". Each edited file meets the authoring rules of `skills/forge-skill/SKILL.md` (imperative voice, low conditionality, minimal diff).

### D9 Evals and paid actions

Change: every `expected.md` fact, and every fixture step, under `eval/loop`, `eval/gauntlet-resume`, `eval/ship` and `eval/gauntlet` that asserts or shows a tracker refresh the instructions no longer take. A fact that uses "refresh" in another sense stays. Update each touched target's `intent.md` where it names the refresh.

Add: `eval/waves/samples/tracker-auto-start`, whose must-hold facts are that the main session dispatches a wave without first marking its tasks in progress, and marks them complete after the wave commit.

Paid actions, run with `node eval/run.mjs <target> <sample>` by the implementing session:

| Target | Samples |
|---|---|
| `loop` | `tracker-refresh`, `tracker-boundary`, `tracker-verify` |
| `gauntlet-resume` | `ledger-tracker-recovery`, `ledger-tracker-verify`, `loop-ledger-brief`, `loop-ledger-worktree` |
| `gauntlet` | `loop-ledger-amend` |
| `waves` | `tracker-auto-start` |

Approving this spec authorizes every action in this table for the whole flow, across seed, rows, repairs and finish, without per-step permission prompts. No target-wide sweep is run. Rewritten facts in samples outside this table are not model-tested; `eval/<target>/report.md` names the tested samples and that partial coverage.

Read-trace evidence: `scripts/resume-read-traces.test.mjs` is a local check outside `scripts/ci.mjs`. Its ledger assertion (`:89-91`) changes from requiring a `plan_tracker` `refresh` call to requiring the passing `plan_check` that binds the ledger and no `plan_tracker` refresh call. The committed captures under `eval/gauntlet-resume/tool-traces/results/` are bound to the hashes of `restore-loop.md` and `reconstruction.md`, which D8 edits, so that check fails on the hash binding until the captures are retaken per `eval/gauntlet-resume/tool-traces/README.md`. A recapture is a paid tool-enabled session outside the table above; approving this spec does not authorize it, and this flow does not run it. `npm test` does not run that check.

After editing `extensions/lib/`, run `npm run build:bins` and commit any regenerated bundle.

## Integration

- A ticket for gatekeep-pr's growing task list is filed through `/skill:shape-ticket`.
- The D8 skill edits follow `/skill:forge-skill`.
- The commit body says the D8 skill edits are behavior-changing skill edits under `AGENTS.md` "Change process".
- The commit body names the tested samples and that partial coverage.
- Obtain approval before any paid capture outside the listed samples, including a recapture of the resume read traces.

## Errors and edge cases

- **Unjudged return at a stop or reload.** A turn that ends, or a session that reloads, while the latest return is unjudged (the driver stopped mid-validation, or a restore stopped before pending recovery finished) stores nothing under the admission rule (D3). The newest list stands, so a later `status` call, handoff's included, returns the last judged list and cannot complete implement from an unjudged `done`.
- **Batched dispatch.** A `subagent` call that shares its assistant message with another tool call while a ledger is bound is blocked and redraws nothing (D3). The other calls of that message still run.
- **Blocked dispatch, then a stop.** A dispatch another handler blocked ran no worker. The stop that follows redraws from the ledger as a parent act (D3).
- **Same row retried at once.** The dispatch redraw stores the row `failed`, then `in_progress` (D3).
- **Oversized list.** An automatic update over the D4 limit is not applied; the newest list stands and one warning is shown.
- **Missing ledger.** A bound path whose file is gone (after ship strips the plan directory, or after a redraw deletes the ledger) changes nothing and reports nothing.
- **Unprojectable ledger.** A bound file that carries the ledger header but fails projection (malformed table, missing spec reference, a row without criterion text, a pending-suffix violation) leaves the list unchanged and shows one UI warning per distinct error. At a dispatch and at verify start the tracker blocks the call with that error as the reason, as a failed pre-dispatch refresh stops the driver today; a stop and a branch activation only warn.
- **Binding end.** The binding lasts until `plan_tracker clear` or `init` (D2). A session that leaves a loop run while its ledger still exists and starts another list with either call is unbound, so that ledger's rows are not merged into the new list. `/skill:gauntlet` entry and redraw both call `clear`; gatekeep-pr and check-delivery start with `init`.
- **Fresh-session loop restore in implement.** The list is empty until the resume boundary (D3): the first dispatch, stop or verify start of the restoring turn. Each comes after the restore's pending recovery, and the restore's `plan_check` supplies the binding. A marked stop there follows recovery; an unmarked one stores nothing.
- **Verify and ship restore.** The `init` restores only the brief's non-ledger tasks and precedes the `plan_check` (D8). The restore's `start verify` stores nothing (D3); the ledger rows appear at the resume boundary, after pending recovery, and merge into the restored list there. A projection failure at either point stops the restore with its findings (D8, Unprojectable ledger).
- **Reload or fork mid-run.** The list is the newest list on that branch and the binding is recomputed from that branch. When that branch ends in a marked stop with no later `subagent` result, the branch-activation redraw stores the reconciled list; otherwise it stores nothing. A branch forked from before the `plan_check` is unbound.
- **Worker sessions.** No redraw, start or refusal runs when `PI_SUBAGENT_DEPTH` is above `0`.
- **Seed dispatch.** The ledger names no row in progress, so the list shows none.
- **All-cut ledger.** Every row projects `skipped`; verify start completes implement.
- **Empty list at verify start.** The phase tool refuses with today's sentence and no task lines.
- **Split waves.** The earlier-wave check compares plan wave numbers only, so tasks of one plan wave are never refused against each other by it. The start-order check still applies inside the wave: its tasks start in increasing index order (D5).
- **Restored `in_progress` task in waves.** Its own wave's dispatches are no-ops; a later wave's dispatch is refused until it is closed, also when that later wave's tasks are already `in_progress`.
- **Amended waves list.** A task an amendment appended with `add` resolves by its `W<k>: <title>` name, not its position. A dispatched plan task with no matching entry, or several, is refused with the reason of D5 check 1.
- **Dispatch outside a known waves run.** A list with no `W<k>:` entry, or an item that is not an `implementer` task with `planPath` and an anchor field, is never blocked or changed by D5.
- **Explicit call after an automatic update.** `status`, `add` and `update` operate on the newest list, so no task is duplicated and no status reverts (row 9).

## Tests

- Row 1: a dispatch stores the start-state list with the tuple's row `in_progress` before the call executes; a dispatch whose lists equal the newest list, or exceed the D4 limit, appends no session entry of any type - `extensions/plan-tracker.test.ts`
- Row 2: the dispatch redraw stores the return-state list with the admitted ledger statuses before the start-state list; an admitted `failed` row dispatched again at once stores `failed`, then `in_progress`, with no tracker call - `extensions/plan-tracker.test.ts`
- Row 3: after a child commit that replaces `pending:` with `returned:`, a ledger read followed by an unmarked stop, a reload and an aborted turn each store nothing, including when the worker appended a copy of a parent decision line (`row <n> retry`, `repair row <n>`); a `status` call after that stop returns the last judged list and implement stays `in_progress` - `extensions/plan-tracker.test.ts`, `extensions/phase-tracker.test.ts`
- Row 4: a repaired ledger shows the numbered target `failed` and other rows unchanged; a repaired seed changes no row; a `repair row <n>` followed at once by a dispatch of the same row stores `failed`, then `in_progress`, with no tracker call - `extensions/plan-tracker.test.ts`
- Row 5: a non-aborted turn whose final message opens with `gauntlet: question` or `gauntlet: gate=<id>` redraws from the ledger, including directly after a cleanly admitted `failed` return with no dispatch in between; the same turn without the marker stores nothing; a stop that follows a blocked dispatch redraws and shows a reopened row - `extensions/plan-tracker.test.ts`
- Row 6: `start verify` completes implement from a stored all-done list with no tracker call - `extensions/phase-tracker.test.ts`
- Row 7: session start, fork and tree replay the newest stored list; a ledger changed after that list was stored is reconciled on branch activation when the branch ends in a marked stop, and a branch whose newest `subagent` result follows its last marked stop stores nothing there; a fresh session binds from a `plan_check` result and redraws at its first dispatch; a restore with no `init` (ledger-only brief) and one whose `init` holds only `Gn:` tasks (mixed brief) each end with the merged list, and a projection failure blocks with its findings - `extensions/plan-tracker.test.ts`, `extensions/lib/plan-snapshot.test.ts`; `eval/gauntlet-resume` `loop-ledger-brief`, `loop-ledger-worktree`, `ledger-tracker-verify`
- Row 8: `init`, `add`, `update`, `status`, `clear` and `refresh` return today's results for today's inputs - the existing cases of `extensions/plan-tracker.test.ts`, unchanged
- Row 9: `status` after an automatic update shows the stored list once - `extensions/plan-tracker.test.ts`
- Row 10: `complete implement` and `complete verify` refuse on an unfinished stored list - `extensions/phase-tracker.test.ts`
- Row 11: the sealed record of a run with no tracker call after the seed carries the final list's plan totals - `extensions/telemetry.test.ts`
- Row 12: the seed call is the only tracker refresh instruction, and no listed file uses `refresh` for the ledger list outside the allowlist - `scripts/tracker-refresh-instructions.test.mjs`, `scripts/loop-engine-contract.test.mjs`, `scripts/brief-contract-lint.test.mjs`, `scripts/resume-routes.test.mjs`; `eval/loop` `tracker-refresh`, `tracker-boundary`, `tracker-verify`; `eval/gauntlet-resume` `ledger-tracker-recovery`, `ledger-tracker-verify`; `eval/gauntlet` `loop-ledger-amend`
- D1: the newest of a tracker result and a stored entry wins; `clear` and fork are honored - `extensions/lib/plan-snapshot.test.ts`
- D2: no binding without a passing `plan_check`, after `clear` or `init`, for a task plan, or from a dispatch naming a ledger; a gatekeep-shaped dispatch after an `init` replaced a bound loop list adds no ledger row; an `init` issued before the `plan_check` leaves the restore bound - `extensions/plan-tracker.test.ts`
- D3: an unchanged redraw writes no entry - `extensions/plan-tracker.test.ts`
- D3 batch: a `subagent` call that shares its assistant message with a ledger write is blocked with the retry reason and stores nothing; the same call alone in its message passes - `extensions/plan-tracker.test.ts`
- D4: a stored entry holds only `name`, `status` and `label` per task; an oversized carried name and an oversized total payload each write no entry, keep the newest list and warn once; an explicit call with the same name returns today's result - `extensions/plan-tracker.test.ts`
- D5 start: an `implementer` dispatch naming pending plan tasks starts them - `extensions/plan-tracker.test.ts`
- D5 identity: a labeled wave heading and each of the three anchor spellings resolve; a task appended by `add` resolves by name; `### Task 4:` does not match `### Task 40:` - `extensions/plan-tracker.test.ts`
- D5 refusal: in a known waves run a dispatched task with no matching entry is blocked with the unresolved-task reason; a later wave's dispatch is blocked while an earlier wave's task is `pending` or `in_progress`, including a restored list with a `W1:` and a `W2:` task both `in_progress`; a same-wave start that would leave an earlier `pending` entry is blocked with the start-order reason; each reason names the entries - `extensions/plan-tracker.test.ts`
- D5 no-op: a repair dispatch inside a wave, a reviewer dispatch, and any dispatch while the list has no `W<k>:` entry change nothing and are not blocked - `extensions/plan-tracker.test.ts`
- D5 instructions: the main session dispatches a wave without marking it in progress and closes it after the commit - `eval/waves` `tracker-auto-start`
- D6 refusal: `start verify` with unfinished tasks refuses and lists them; an empty list refuses with today's sentence - `extensions/phase-tracker.test.ts`
- D7 reopens: a reopen visible only in stored lists is counted once; a row re-bound by an amendment (`complete`, then `pending`, then `in_progress` across the two dispatch lists) counts none - `extensions/telemetry.test.ts`
- D7 events: the D6 result records `complete implement`, then `start verify`, and no second implement start, in the sealed record - `extensions/telemetry.test.ts`
- D8 index read: a `status` read precedes an index-based `update` in verify after a dispatch or a stop - `eval/loop` `tracker-verify`
- Unjudged return at a stop or reload: the Row 3 and Row 7 cases
- Missing ledger: no change, no warning - `extensions/plan-tracker.test.ts`
- Unprojectable ledger: list unchanged, one warning, a dispatch and verify start each blocked with the error - `extensions/plan-tracker.test.ts`
- Binding end: `clear` and `init` each unbind - `extensions/plan-tracker.test.ts`
- Verify and ship restore: a redraw after an `init` of non-ledger tasks keeps the `Gn:` tasks and adds the ledger rows - `extensions/plan-tracker.test.ts`; `eval/gauntlet-resume` `ledger-tracker-verify`
- Worker sessions: no automatic update with `PI_SUBAGENT_DEPTH=1` - `extensions/plan-tracker.test.ts`
- Seed dispatch and all-cut ledger - `extensions/plan-tracker.test.ts`, `extensions/phase-tracker.test.ts`
- Batched dispatch, blocked dispatch then a stop, same row retried at once, oversized list: the D3 batch, Row 5, Rows 2 and 4, and D4 cases
- Split waves, restored `in_progress` task, amended waves list, dispatch outside a known waves run: the D5 cases - `extensions/plan-tracker.test.ts`

## Documentation impact

Bar and template: `documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (operations: the tracker's automatic updates, the stored list entry, the dispatch refusal, and verify start completing implement); `doc/implement-engines.md` (communication contract: the loop task view and resume recovery no longer use a refresh call, and what an engine author's dispatch must carry for the waves start); `CHANGELOG.md` (Unreleased entry)
- Derived / memory docs invalidated: `README.md` loop paragraph ("Ledger refresh completes implement when every row is closed", `:42`) and extensions bullet ("while loop calls `plan_tracker refresh` to project ledger rows and preserve conformance tasks", `:134`)

## Out of scope

- gatekeep-pr's task list, including whether to remove it. It gets its own ticket.
- check-delivery's task list. It needs no change.
- Moving worker selection, return admission or dispatch out of the main session.
- A general auto-tracking layer for arbitrary skills.
- Inferring that a wave was accepted, or closing waves tasks automatically.
- The widget showing only the first in-progress task name.
- Plan totals that include tasks added during verify.
- Measuring how often waves runs skip updates.

## Open questions

- The ticket's skip counts and the 2026-11-26 run cannot be re-checked: the ticket attaches no source. The design assumes both engines skip updates at an unknown rate and does not depend on the rate.
