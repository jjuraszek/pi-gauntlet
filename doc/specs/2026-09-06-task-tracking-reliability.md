# Reliable task tracking with minimal workflow changes

## Context and intent

Task circles in local gauntlet histories remain pending/in-progress after verification and shipping, or skip their start state. The observed omissions exist in persisted tracker results, not merely a renderer. Correct skill bookkeeping and add a narrow completion backstop without redesigning a working gauntlet.

Original request, verbatim:

> I've that very often for this machine gauntlet flow history tasks tracker is not updated correctly. some tasks don't check their circle at all, some circles are skipped. review full mechanism behind it to figure out what can we do to improve it and make it as reliable as phase tracking. in general tasks are generated at planning and during conformance. so it should be straight forward. execution phase fix loops are not independant tasks. first check why task tracking is not working. than show me possible way of addressing. ground it in actual sessions history

Follow-up constraints, verbatim:

> 1, but keep in mind that changes should be minimal and minimal on conditionality. gauntlet already works and tasks tracking is just nicety. regression risk is more important to me. on another hand, current state looks like half baked solution so we need to address it. just make sure changes are really minimal and not introducing extra human gates or complex conditionals

> no, make sure this change can actually works. skills should be uncoditional about keeping sync for tasks. moreover fix loop of the tasks is the SAME task. its not new one

Additional request, verbatim:

> one more thing gauntlet should use parallel agents where it can but not async ones, agree? there are few places where async impl or CR/SR or conformance or spec summary is spawned. but for gauntlet it is actually harmfull as it enable main loop to accept extra prompting for fixed contract. fold it in. ask if you are not sure. re-run council after

Final clarifications, verbatim:

> CR is single unit of work and SR is single unit of work. any CR testing commands (which should be narrowed down anyway to affected files only) should be CR sequential, right? what kind of parallel you're talking about?

> yes, SR for single wave stays parallel as they were. "parent full verification" is full test suite? if yes it should run before full diff CR, agree?

> exactly, stay minimal with your changes. its surgical strike anyway

The agreed order is parent full verification -> whole-diff CR -> conformance. Per-wave SR fan-out stays parallel. The user knows no predecessor spec to supersede. This is an incremental correction. The council must review the combined task-tracking and foreground-dispatch contract, not the earlier task-only draft.

## Evidence from actual sessions

Canonical local evidence lives under `~/.pi/agent/sessions/`, not its balanced/anthropic symlink views. The investigation scanned top-level project session JSONL files created from 2026-08-25 onward, followed each file's latest `parentId` ancestor chain, and compared successful tracker snapshots with phase transitions. Nested child files were excluded. Cross-file inherited history and interrupted runs preclude treating raw file counts as an incident rate; no percentage is claimed.

The following facts are inlined so understanding or implementing this spec does not require access to private logs. Paths below are relative to the canonical sessions directory; line numbers identify the original JSONL records.

| Case | Session file | Observed tracker/phase sequence |
|---|---|---|
| Missing conformance closure | `--Users-jacek-repos-pi-quiver--/2026-09-01T12-01-40-865Z_01a05cd8-b401-7934-a412-1a1e5fd65c4f.jsonl` | Line 424 adds three gaps after five completed tasks. Lines 426/428/430 start indices 5/6/7. No subsequent completion updates for those indices on the active branch. Verify completion succeeds at 464; ship completion at 497. Final tracker: 5/8 complete, three in_progress. |
| Never-started gap | `--Users-jacek-repos-gridstrong--/2026-08-28T18-23-43-307Z_01a0499d-08cb-7378-b2bd-764d77b52eb8.jsonl` | Line 417 adds G1-G6 after 15 completed tasks; 419-423 start only G1-G5. Verify/ship complete at 473/509. Final tracker: 15/21 complete, five in_progress, one pending. |
| Fix-task inflation | `--Users-jacek-repos-gridstrong-dashboard--/2026-09-02T15-39-26-635Z_01a062c6-6e2b-75d9-8f14-17030580e59d.jsonl` | Seven tasks at 397 become 24 through additional fixes, retries and gaps. Lines 1045/1047 add/start a conformance quality-fix wrapper task; verify/ship complete at 1060/1088 with it still in_progress. |
| Skipped start updates | `--Users-jacek-repos-gridstrong-excavation--/2026-08-29T14-09-35-770Z_01a04dda-bc1a-7364-aae1-e8211fc61b2b.jsonl` | Line 250 initializes 15 pending tasks. First-wave indices 0/1/2 go directly pending -> complete at 298-300; next-wave indices 3/4/5 correctly start at 302 onward. |
| Execution fix promoted to task | `--Users-jacek-repos-gridstrong-rule-bot--/2026-09-02T18-47-02-476Z_01a06372-2e4c-7bef-a11e-482a4e465461.jsonl` | Line 369 appends a W1-fix F1 task while planned W1 tasks are in_progress; 371 starts the extra index. This follows the shipped fix-fan-out instruction. |
| Healthy control | `--Users-jacek-repos-pi-gauntlet--/2026-08-31T16-28-05-327Z_01a058a6-3f4f-7f81-a635-c086ffdcef97.jsonl` | Three tasks initialized at 165; start/complete updates at 168/169/194/195/196/210. G1 added at 226, started at 228 and completed at 245. Verify/ship complete at 248/276. |

Source inspected at base commit `b8237da`; installed balanced plan/phase extension files matched it. Historical loaded package versions were not established. No observed successful completion update was shown to disappear during replay. The separate history renderer source was unavailable, so additional renderer defects are not ruled out; they are unnecessary to explain these cases.

## Diagnosis

- `extensions/plan-tracker.ts` owns a flat positional name/status list, persists full result snapshots and reconstructs the current branch. It accepts direct pending -> complete, additions, and replacement by init. No runtime association exists between its list and plan tasks or gap IDs.
- `extensions/phase-tracker.ts` consumes successful task activity to auto-complete an already-active implement phase when all tasks complete. Explicit implement/verify completion does not consult unfinished tasks. Conformance additions in verify therefore have no task-closure backstop.
- `skills/subagent-driven-development/SKILL.md` puts task completion in the sequential numbered loop, but explicit task start mainly in the later parallel section. Its verify handoff calls tracker use optional ("may"). Initialization currently lives in SDD's parallel-section instruction/prerequisite; writing-plans has no tracker handoff call.
- `skills/dispatching-parallel-agents/SKILL.md` explicitly appends a task per fix finding, including execution fixes.
- `skills/verification-before-completion/reference/conformance-check.md` says to add the round's gaps on every round. Completion is described indirectly in dispatch prose, not as an explicit action in the numbered integration/review flow.

These are bookkeeping omissions and conflicting instructions, not evidence for a new event bus, renderer rewrite or dispatch-to-task registry.

## Scope and non-goals

Preserve the tracker API, positional indices, statuses, serialized snapshots, widgets, settings schema, plan checker and existing phase transitions. Keep the current manual plan-to-tracker handoff. No automatic plan import, new persistent state, task IDs, dispatch hooks, new human gate or duplicate ship guard.

No runtime prohibition of pending -> complete: skills must record starts, but a missed start must not prevent recording a truthful completion. No runtime policing of init/add provenance; skills own the task list contract. No historical log repair, global corpus audit, mandatory missing-tracker blocker or unrelated extension refactor.

Standalone ad-hoc tracker checklists remain supported. An unrelated checklist must not replace an active gauntlet flow's list; use a separate session for that workflow. No nested-checklist support or changes to gatekeep-pr/check-delivery are introduced. The skill requirements below are unconditional in their gauntlet workflows; disabling a runtime guard does not make synchronization optional.

## Task identity and synchronization

### Planning and execution

1. Writing-plans' Execution Handoff initializes the tracker once, after `complete plan` and before entering SDD, with the complete plan task list in wave order using existing `W<k>: <title>` names. SDD consumes this list and preserves indices/progress on continuation; its existing init bullets become consume/do-not-reinit instructions. Direct SDD recovery without a tracker uses the existing full-plan initialization once before dispatch; never initialize over an existing list.
2. The parent records `in_progress` before dispatch for every task being worked on, sequentially or in a parallel wave. Every task reaches `complete` explicitly after its existing review/integration/commit acceptance point. A subagent exit alone is not acceptance.
3. A task's fix loop is the same task. Retries, spec-review fixes, quality-review fixes, conflict fallback and parallel fix fan-out keep the same tracker index and do not append entries. Tasks remain in_progress through their acceptance loop.
4. Whole-diff CR or full-verification repairs reopen existing indices by the plan's `Files:` ownership of the repair's touched files; multiple owners reopen all affected indices. Untraceable cross-cutting repairs stay in the review/verification report without inventing tracker tasks. Complete reopened indices after re-verification and the required re-review accept the fix. Conformance-derived findings use Gn indices, not plan-task indices. Do not reopen the implement phase solely to track work during verify.
5. In gauntlet execution/conformance, fix fan-out reuses the consuming workflow's indices. Parallel dispatch does not create task identities. Preserve the generic fan-out skill's existing append behavior for standalone non-flow consumers with no owning task; no standalone checklist redesign.
6. Finish and await tracker updates before phase completion. Missing updates are reconciled against actual accepted work, not filled in to obtain green circles. No mandatory extra status call; the runtime checks closure at the boundary. Never clear or re-init to evade rejection.

These requirements belong at the actual handoff/start/acceptance steps, not only in an optional progress paragraph. SDD's sequential, wave and verify paths must agree. Writing-plans owns initial handoff; SDD owns execution synchronization, including whole-diff repairs; the shared conformance reference owns gap synchronization, including finish-time remediation. Direct verification follows the same ordering. In an orchestrated task, TDD's green/committed cycle is not task acceptance: the parent retains tracker/phase ownership through required reviews. Finish-time repairs use the same synchronization instructions but gain no additional runtime completion guard.

### Conformance gaps and repeated rounds

The reviewer already supplies durable `Gn` IDs across re-audits (`agents/conformance-reviewer.md`). Reuse them; do not change the persona or add an ID system.

- Append a task only for a new gap actually entering this round's fix loop per the existing partition step, never for an inventory-only carried-OPEN gap. Retain `Gn: origin` naming. Find the existing task by its exact `Gn:` prefix and reuse its index even when origin wording changes. Repeated G1 is the existing G1 task; genuinely new G2 entering remediation adds one task.
- Start each gap's existing index before fix dispatch. Integration failures, test failures and round-level quality fixes remain work on those same gap tasks. No review-round wrapper or test-retry tasks.
- Make completion an explicit numbered action after the gap fixes are integrated and the round's existing test/code-review gate succeeds, before re-audit. This is completion of accepted fix work, not a claim that re-audit has proved every requirement delivered.
- Re-audit requiring further work reopens the same durable Gn index. Only genuinely new remediation gaps extend the list. Finish with all attempted fix work accurately reflected.
- Preserve the existing disposition contract. Gaps deferred without remediation remain in the Closure / conformance inventory, not tracker tasks. Re-audit may defer a still-open requirement after a successfully accepted fix round without leaving that finished round falsely in_progress. The existing positive-cap blocked/failed/exhausted-loop escalation remains non-completing; no task is marked complete to bypass it.

Concrete trace: plan `[T1,T2]` -> fix T1 twice, still `[T1,T2]` -> verification adds G1, `[T1,T2,G1]` -> re-audit retries G1 and discovers G2, `[T1,T2,G1,G2]`. Round code-review fixes do not change this list.

## Foreground dispatch policy

Flow-owned means the brainstorm-to-ship skills and supporting dispatches named in Implementation boundaries, not standalone shape-ticket/gatekeep-pr/writing-skills invocations. Their execution calls explicitly set top-level `async: false`: gather, critique/council, summary, implementation, SR/CR, conformance and retries. This overrides pi-cohort's async-preferred guidance/default, not its `forceTopLevelAsync` override. That configuration is incompatible with gauntlet foreground flows; it must remain unset/false (as on the audited machine). Link to [pi-cohort dispatch configuration](https://github.com/jjuraszek/pi-cohort/blob/main/doc/configuration.md) in the existing docs. An async run handle returned despite `async: false` is a configuration failure: stop and report, do not poll, relaunch duplicate work or advance the flow. No new settings, pi-cohort runtime changes or runtime async guard.

Keep independent work parallel through foreground `tasks` / chain parallel groups with existing isolation and ordering constraints. Foreground is not serial: independent implementation tasks, per-patch SRs and council members still fan out. Dependent SR -> CR -> conformance stages remain ordered; the summary waits for the final spec. Wait for each foreground result before accepting it or advancing its tracker/phase. No async launch/poll/end-turn/resume orchestration in the gauntlet flow.

This is an orchestration barrier, not an input lock or a guarantee that Pi cannot receive user steering. Pi-cohort can also detach a foreground run for intercom coordination; that is not a completed result. Existing blockers and user-directed scope changes remain legitimate, and unfinished children must not be treated as accepted work. No changes to Pi input handling or pi-cohort intercom behavior are in scope.

Local history confirms explicit async calls for the Sep 2 pi-quiver whole-diff CR (`--Users-jacek-repos-pi-quiver--/2026-09-02T19-10-24-205Z_01a06387-91cc-7f94-aed3-4a9c9832c22a.jsonl:396`), and Sep 6 customer-ops summary/implementation/SR (`--Users-jacek-repos-customer-ops--/2026-09-06T12-15-05-897Z_01a076a4-c8a9-7622-bb52-b6691a97debd.jsonl:431,646,675`). No explicit async conformance call was found in that bounded top-level active-branch scan; do not claim one was observed. SDD explicitly prescribes async whole-diff CR plus parent-side verification; other flow examples mostly omit async and can inherit general async guidance/defaults.

### Verification order

Replace SDD's async whole-diff CR / parent-verification overlap with one unconditional order:

```text
Per wave (unchanged):
parallel implementers -> parallel per-patch SRs -> integrate
-> scoped tests -> wave CR -> commit

Sequential mode (unchanged):
implementer -> SR -> task CR -> task accepted

After all tasks (either mode):
parent full verification -> whole-diff CR -> conformance
```

Full verification is the complete plan-header `Verification` command set: full test suite and any declared lint/type/format/build checks. The parent executes it; no new verification worker or event forwarding. A failed run must be fixed and rerun successfully before whole-diff CR. The parent commits verification-produced tracked changes before review, as it commits integrated wave changes. Use the resulting HEAD as the existing review template's `HEAD_SHA`; carry commands/results in existing task text (`DESCRIPTION`), with `SCOPED_TEST_COMMANDS: none`. Whole-diff CR does not repeat the full suite.

CR fixes invalidate that verification: rerun the full set before re-review or conformance. In the in-flow conformance loop, use the full plan-header Verification set at its existing post-integration test gate (step 4), before round CR and re-audit; do not add a duplicate run or another gate. When an ad-hoc conformance path has no plan-header Verification set, retain its existing canonical-test-command gate. This names where the existing full-verification invalidation rule is satisfied. No full suite moves into task/wave implementation checks or reviewer-owned testing.

Each CR is one unit: its supplied task/wave scoped commands run inside that CR before its verdict, not as separate agents/tasks. SR runs no tests. No new test-selection mechanism or review persona change: retain the existing scoped-command contract. Per-wave SRs remain one foreground parallel batch, never serialized or fused with wave CR.

Delete the superseded safe/unsafe concurrency classification, async status polling, end-turn join and serial fallback branches. No extra prompt, dispatch mode, worker or runtime async guard. This deliberately simplifies the final verification ordering rather than preserving an async optimization.

## Runtime completion backstop

Add one shared check to `phase_tracker`'s explicit complete path, before mutating phase state. It applies only to completion of implement or verify, when a gauntlet flow has been entered and existing `piGauntlet.flowGuards.enforce` is enabled.

Read the latest successful `plan_tracker` snapshot on `ctx.sessionManager.getBranch()`. Reuse recorded `details.tasks`; ignore errored results. No reset cutoff: phase reset does not clear the tracker. Init/clear supersede old snapshots, exactly as the widget already behaves. Do not cache another copy or introduce a persistence format. A successful clear provides an empty list; absent/empty lists preserve existing behavior.

Set `executionMode: "sequential"` on the registered `phase_tracker` tool, not on individual actions. Pi's default parallel tool batches persist results only after the batch returns; without this declaration, a same-message tracker update followed by phase completion reads an old snapshot. The existing per-tool sequential API orders and persists each call before the next; it does not serialize children within a foreground subagent fan-out. Verify against the installed Pi runtime, including the tool wrapper preserving the field. Runtime support for this field is required; use Pi 0.85.1 as the tested minimum in the existing README requirement, not a custom compatibility shim.

Only `pending` and `in_progress` block. Return the normal phase-tracker error shape, retaining the pre-call phase map; list each blocked zero-based index, name and status, and tell the parent to reconcile accepted work, update the same indices and retry. No new tasks, clearing, synthetic completion or additional human approval.

`failed` remains terminal-negative: never counted complete, but not unfinished for this bookkeeping check. Failure still follows existing STOP/escalation and disposition rules; setting failed does not authorize shipping. If the human at an existing escalation abandons attempted work, retain failed on its original index rather than inventing successful completion. No new disposition or approval gate.

Preserve error precedence: existing closure enforcement runs first; the task check runs next, before mutation. The new check uses flowGuards.enforce, independently of closureReview.enforce.

Preserve current all-tasks-complete implement auto-completion. Do not add start/dispatch/ship checks or alter skip/waiver semantics. Cold/ad-hoc sessions, disabled guards, other phases and absent/empty trackers retain existing behavior. Branch switches use the active branch; phase reset alone leaves the tracker intact. Brainstorming's existing reset-then-clear starts a fresh list.

This is a backstop, not proof work was done. Missing initialization and fabricated statuses remain protocol violations. Use the completion boundary, not an additional idle recovery nudge: it directly catches the observed missed closures without new recovery state.

## Implementation boundaries

Expected production change: the narrow check and tool-level sequential declaration in `extensions/phase-tracker.ts`; an existing helpers file may host a small pure helper if needed for the current test conventions, but no new subsystem. `plan-tracker.ts` behavior is unchanged.

Instruction changes are limited to tracking and dispatch/order clauses and their direct owners:

- `skills/writing-plans/SKILL.md`: once-only initialization with existing wave-prefixed names at Execution Handoff.
- `skills/subagent-driven-development/SKILL.md`: replace init bullets with consume/preserve instructions, retaining missing-list direct-entry recovery; unconditional start/acceptance synchronization; same indices for retries/whole-diff repairs; remove optional tracker wording.
- `skills/dispatching-parallel-agents/SKILL.md`: existing-index reuse in gauntlet loops; preserve standalone non-flow progress behavior.
- `skills/verification-before-completion/reference/conformance-check.md`: append only new gaps actually entering remediation, exact Gn-prefix reuse, explicit start/completion; existing step 4 runs the in-flow full Verification set.
- `skills/verification-before-completion/SKILL.md`: synchronization before completing the direct verify path.
- `skills/test-driven-development/SKILL.md`: its final phase-completion guidance must preserve parent-owned task/phase acceptance during an orchestrated review loop; green TDD alone does not finish the task.
- Foreground clauses and explicit `async: false` on execution examples in those owners plus `skills/brainstorming/SKILL.md`, `skills/brainstorming/gatherer.md`, `skills/roasting-the-spec/SKILL.md`, and `skills/requesting-code-review/SKILL.md`. Conformance dispatch prose in its existing reference also requires foreground. Management actions such as agent discovery are not execution examples.
- SDD's after-all-tasks section and its cross-references/red flags: full verification before whole-diff CR; delete all superseded concurrent-audit/classification/join wording, not just the dispatch example. Preserve failure repair rules and next-gate checks in the new order.

Apart from explicit foreground selection, final verification/CR ordering and the named conformance test-gate reconciliation, do not change dispatch shapes, isolation, review/test scope or cadence, loop budgets, scope disposition or phase ownership. Cross-repo runtime contracts do not change; link to pi-cohort's owning dispatch documentation rather than duplicating it. No paired pi-cohort release is needed. No unrelated standalone ticket/triage skill rewrite.

## Verification and acceptance criteria

Use existing extension tests and test harnesses. Tests must exercise registered tools/events and saved-state replay, not only a helper predicate. Do not commit private session logs or add a transcript-testing framework; reproduce minimal sanitized event shapes from the evidence above.

### Runtime regression evidence

- Reproduce the missing-close histories: an entered verify phase, successful conformance dispatch, completed implementation tasks plus pending/in_progress conformance tasks. Explicit verify completion rejects, lists those indices and leaves verify unchanged.
- Update those same indices to complete, persist the successful snapshots and retry. Verify now completes without user intervention or new tasks.
- Explicit implement completion with unfinished tasks also rejects. Existing all-complete task activity still auto-completes a started implement phase.
- Failed tasks stay terminal-negative: not complete, not blocked by this check. Existing workflow escalation is unchanged. An errored tracker result cannot replace the last successful snapshot.
- The healthy-control shape passes: planned tasks complete, G1 added/started/completed, then verify completes after the existing closure gate.
- Current-branch reconstruction excludes off-branch tasks. Successful tracker clear/init replaces old tasks; phase reset alone does not. Test reset with no tracker clear, then update, for consistent widget/backstop state.
- Exercise a real Pi tool batch containing tracker update followed by phase complete: sequential declaration is preserved through registration and the update is persisted before the check. Also retain registered-tool tests using a mutable branch fixture, not just a helper-only predicate.
- Cold/ad-hoc use, flowGuards.enforce false, no snapshot, empty snapshot and other phases remain unaffected. closureReview.enforce false does not disable this task check; passing it does not bypass closure enforcement. If both fail, the existing closure error wins. Existing skip behavior stays unchanged.
- Run the repository's `npm test` entrypoint, including existing plan-tracker tests, phase-tracker tests and CI checks. Do not claim runtime success from prose inspection.

### Skill behavior evidence

After approval, use a scratch-only Pi extension that registers a stub `subagent`: it records execution arguments, returns fixture outcomes in scenario order and makes no real child dispatch. Run fresh Pi sessions with automatic extensions/skills disabled, loading the stub and the real gauntlet tracker extensions explicitly. Supply old/new skill text plus sanitized plan/report fixtures; expose no project-writing tools. Fixtures simulate implementation, commits and reviewer results, not successful delivery. Read actual session JSONL tool calls/results for assertions on order, indices, count and error recovery.

The stub rejects omitted/true async on execution calls in the changed run (models a conflicting async default); management discovery remains available. This verifies the caller policy, not pi-cohort runtime behavior. Separately check a real foreground parallel read-only dispatch for terminal return rather than an async handle under the installed supported configuration, and record that forced-async configuration is unsupported.

Budget: one old-instruction baseline using the observed failure scenario; four changed-instruction runs grouping scenarios (1,2), (3,5), (4,8), (6,7), with at most one repair/retry per group and a 10-minute cap per run. Store stub, fixtures, traces and assertions only under a temp directory. No committed transcript harness, new test framework, consumer edits or repeated live implementer/reviewer fan-outs. Runtime/schema specifics must be checked against current Pi docs before creating the scratch extension.

Required diagnostic scenarios (target behavior; the accepted model-following limits below qualify the pass requirement):

1. Sequential T1 has two review-fix rounds. The trace starts T1 before first dispatch, retains its index/count through both rounds and completes it at acceptance.
2. Parallel W1 tasks receive a disjoint fix-fan-out. All original tasks start before dispatch, no fix entries appear, and completion follows the wave gate/commit.
3. Conformance G1 needs another round and G2 is new. Add G1 once, reuse it on retry, add G2 once; round-quality/test retries add nothing; explicit completion leaves no forgotten gap tasks.
4. A phase completion meets a missed tracker update. The agent reads the error, corrects the existing index based on supplied accepted-work evidence and retries without asking the human or clearing/reinitializing.
5. A valid deferred conformance decision follows accepted fix work. Preserve the closure inventory and existing finish handoff without creating a phantom task or treating the unresolved requirement as delivered.
6. Foreground orchestration despite generic async-preferred guidance/defaults: emitted execution calls explicitly set top-level async false; independent implementation/SR/council batches remain parallel. No task/phase acceptance while a child is outstanding. Include summary and conformance dispatches, not just implementers.
7. Final verification fails once, is repaired and passes before whole-diff CR is dispatched. CR receives its results without running the full suite again. A later review fix invalidates the old verification result; verify the new tree before the next gate. No asynchronous review join or verification worker is introduced.
8. Whole-diff CR/verification repairs span two plan-task Files blocks: reopen both existing indices, append none, and complete after acceptance. Unowned repair work remains in the report without fabricated tasks; conformance repairs use Gn.

Capture baseline and changed-instruction traces, preserving actual failures as well as passes. Repair demonstrated instruction ambiguity within scope and the authorized run budget; do not rerun until a favorable sample appears. Static CI checks do not substitute for executed behavior traces. The specifically accepted model-following failures below do not block delivery; unavailable runtime verification and unrecorded or unexplained failures still do.

### Acceptance summary

The deliverable is accepted when runtime regressions and full repository verification pass, shipped skills unconditionally require synchronization, same-task fix loops and foreground dispatch, executed diagnostic traces are reported accurately with the accepted limits below, and documentation reflects that contract. Do not claim all behavioral assertions passed or that model obedience is guaranteed. No new runtime machinery or unrelated workflow changes are authorized.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - operations and major definitions: completion rejection/recovery and terminal-negative handling under existing flowGuards, task identity and the obsolete claim that flow fix sub-waves extend the list; `README.md` - workflow/runtime contract: full verification before whole-diff CR, foreground parallel dispatch with a link to pi-cohort's incompatible forced-async setting, tested Pi minimum 0.85.1 for sequential tracker execution, and completion-backstop mention linking to the configuration owner; `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none

Apply the materiality bar in [documentation-impact.md](../../skills/brainstorming/reference/documentation-impact.md). Skill/reference edits above are implementation surface, not additional doc-impact entries. No new guide or AGENTS expansion is required.

## Risks and explicit limits

- A narrow blocker can expose old forgotten tasks on resumed flows. The error must support evidence-based repair of their existing indices; do not silently rewrite history or invent a completed task.
- Task completion and conformance verdict remain distinct. Preserve valid deferred-gap finish handoffs, and do not turn bookkeeping into a new disposition gate.
- Synchronization remains model-executed. The guard catches unfinished recorded tasks at explicit boundaries, not absent tasks, dishonest statuses or a missed intermediate start that was later truthfully completed.
- Historical session provenance is diagnostic evidence only. Tests use sanitized inlined shapes; private files are not build dependencies.
- Foreground final verification/review sacrifices their previous wall-clock overlap deliberately. Independent wave/SR/council batches stay parallel.
- Explicit async false does not override pi-cohort's forceTopLevelAsync configuration or prevent legitimate intercom detachment. No input-lock claim.
- The sequential tracker declaration needs a supporting Pi runtime. The documented tested floor avoids a custom legacy-runtime fallback.

## Accepted behavioral limits

After the authorized additional Group D run, the user agreed to keep the surgical implementation and revise behavioral acceptance rather than add stronger enforcement. This supersedes the original requirement for every changed-instruction trace to pass; it does not weaken the shipped skill instructions or the runtime regression requirements.

- G1: source instructions now require reopening before verification-repair dispatch and completion after accepting review. The extra diagnostic run still omitted reopening. A snapshot-only completion guard cannot detect repair work the model never recorded.
- G3: one diagnostic conformance call omitted `async: false`, was rejected by the enforcing stub, then corrected. Explicit foreground instructions are required; unconditional model compliance is not proven. The stub's rejection is not a shipped gauntlet runtime guard.
- G6: a diagnostic deferred-gap summary preserved the open gap but did not serialize the existing handoff contract exactly. Accept this observed model-formatting limit without changing that handoff contract or adding a serializer.

The final aggregate recorded 131 passing and 7 failing assertions; independent re-audit also found the G6 serialization defect that those assertions missed. Preserve these as failed diagnostic results, not successful fixes. G2 disjoint repair fan-out and G4 same-gap test/quality retries were demonstrated. The user authorized exactly one extra Group D run with a 10-minute cap; it and the permitted A/B retries were consumed. No further behavioral scenario runs are required by this acceptance revision. Real runtime batch proof and the full repository suite remain mandatory.

## Open questions

None. The original spec and this bounded acceptance revision were approved in-session; no additional runtime human gate is introduced.
