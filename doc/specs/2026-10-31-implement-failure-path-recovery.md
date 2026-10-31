# Implement failure-path recovery: read the originals

**Goal:** Make an implement run survive an implementer returning `NEEDS_CONTEXT`/`BLOCKED` and an amend batch applying, by deleting the three second copies that break today - the agent-less diagnosis carrier, the report-carried plan inventory, and the implementer completion guard - and reading the original state each already has (the structured-output capture file, the committed plan and spec, the wave loop's own patch check); add a spec-council check that no spec requirement is sourced from a PR title or body.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.; fund 2 fix rounds
**Engine:** waves
**Supersedes:** `doc/specs/2026-10-30-slim-subagent-dispatch.md`, scope: "Chain stopped or failed" under The wave loop; the report-carried original inventory under Implement-local plan maintenance.

## Problem

Since 7.42.0 (`dc754a29`, #102) and 8.0.0 (`9bb6b398`, #105) every autonomous implement run stops the first time an implementer does not return `DONE`, and every amendment batch fails to apply. Three defects, each verified:

1. **Diagnosis carrier is unaddressable.** `skills/subagent-driven-development/SKILL.md` "Chain stopped or failed" says "Omit agent on this sequential step". pi-cohort types a sequential step as `agent: string` (`src/shared/settings.ts:45`) and the executor rejects an unresolved name (`src/runs/foreground/subagent-executor.ts:771-780`, validation present since 2026-04-30, `8be73bd`), so the dispatch returns `Unknown agent: undefined (step 1)`. Reproduced in this session with a bare `chain: [{ task, outputSchema, stopOn }]`. Four sessions hit it since 2026-10-30 14:13; zero succeeded. The 7.42.0 spec read the flattened tool schema (`schemas.ts:206`, optional because of union flattening) as runtime permission.
2. **A structured `NEEDS_CONTEXT` never reaches the orchestrator.** The child's structured-output tool validates the value against the schema and writes a capture envelope `{"status":"success","value":<Implementer Status>}` to `<Artifacts>/structured-output/pi-subagent-structured-<rand>/output.json` (`src/runs/shared/subagent-prompt-runtime.ts:226-231`); finalization reads and unwraps it (`attempt-finalization.ts:218-231`, `structured-output.ts:80-105`), then the completion guard (`agents/implementer.md:9` pins `completionGuard: true`; evaluated as `agent.completionGuard !== false` at `attempt-finalization.ts:249`) overwrites the result with exit 1 and "Subagent completed without making edits" (`:249-262`) when `expectsImplementationMutation` (`completion-guard.ts:105`) matches a word from `GENERAL_IMPLEMENTATION_PATTERNS` (`completion-guard.ts:49-55`: `implement`, `fix`, `edit`, `modify`, `patch`, `refactor`, `apply the changes`, ...) in the task text. The initial dispatch task (`SKILL.md:193`) carries the plan and spec paths and the status protocol; which word matched in the failed session is not verified, only that the guard fired. `stop-conditions.ts:78` skips exit-1 tasks and `formatters.ts:88-91` renders only the error, so the chain result carries neither `## Outputs` nor `## Stop`; the orchestrator falls into defect 1. Observed in the 2026-10-31 06:44 session: `output.json` holds `{"status":"success","value":{"status":"NEEDS_CONTEXT", ...}}` beside a 0-byte patch. The guard trigger has existed since May; #102 unmasked it by removing the orchestrator's direct report read.
3. **Amend-apply cannot build its inventory.** 8.0.0 told `plan-writer` to "capture anchored obligation text, task bodies and Tests" of the original plan inside its saved apply report before the first edit, with no sidecar and `bash` limited to provenance and Tests commands (`agents/plan-writer.md:39`, `implement-amendments.md` steps 3-4, `dispatch-contract.md:18`). Since that wording went live at 06:21, 0 of 16 Amend-apply dispatches passed (14 cite the inventory, output budget, or bash allowlist); 10 of 16 passed in the 12 hours before. The committed plan is the original the report copy tried to preserve - but today nothing commits it: `skills/writing-plans/SKILL.md:39` states "the plan commit goes on the worktree branch" without an operative step, `## Execution Handoff` (`:354-363`) completes the phase, initializes `plan_tracker` and invokes implement with no commit, and `:259` is the task-template `git commit` of source files. The spec is committed at the brainstorm gate (`brainstorming/reference/spec-finalization.md:100`) and every amend batch lands as one `amend:` commit (`amendment-surface.md:200-209`), so once the plan is committed before implement, `git -C <home> show HEAD:<plan>` and `HEAD:<spec>` hold the originals for every batch.

Each defect is a second store or a second detector beside one that works: the artifact file beside a relay dispatch, the committed plan beside a report copy, the wave loop's own patch check beside the guard.

Fourth item, added by the user: the spec produces the PR, never the reverse. The flow already says so for the one route where a PR is an input - the existing-PR rework subject binds the ticket from the title and first body line only (`pr-subject.md:56-60`) and drafts rows from the agreed design, not raw title/body (`ticket-acceptance.md:39`) - but neither critique route checks it: the council's `external-ref` axis flags only references the spec does not inline (`agents/spec-council-member.md:34`), and the worker critique (`spec-finalization.md:77-94`, the route when `specCouncil.members` is absent or empty, `extensions/lib/gauntlet-settings.ts:41-73`) applies scope and ambiguity checks only.

Corrected premise: the failures did not start today - defect 1 since 2026-10-30 afternoon, defect 3 since 2026-10-31 morning, defect 2 latent since May.

Framing: pivoted to reuse-only - read `output.json` before any diagnosis dispatch; derive the amend inventory from the committed plan and spec; drop `completionGuard` on `implementer` because the wave loop already rejects a `DONE` without a patch. The user chose the pivot; the as-framed alternative (patch each construct in place) keeps all three copies.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A failed implement chain whose task wrote an `output.json` capture `{"status":"success","value":{...}}` with `value.status: NEEDS_CONTEXT` and a matching `value.anchor` routes that status through the Implementer Status table without dispatching a diagnosis child.
  in-scope
- [ ] A failed implement chain whose task wrote no `output.json` dispatches the diagnosis carrier with `agent: "delegate"` and the literal sentence `Do not edit any file.` in its task, and that dispatch is accepted by pi-cohort and returns its structured JSON.
  in-scope
- [ ] An implementer that returns `NEEDS_CONTEXT` or `BLOCKED` without editing any file is not converted into a "completed without making edits" failure and never opens its final message with `BLOCKED:`; its structured return reaches the chain result.
  in-scope
- [ ] A `DONE` return with a missing or zero-byte initial patch is counted as a failed attempt through the transition table and never integrated.
  in-scope
- [ ] Every implementer structured return carries the dispatched identity: `anchor` (the `### Task N:` heading) for a single-task dispatch, `anchors` (the dispatched headings) for a multi-task repair.
  in-scope
- [ ] An Amend-apply dispatch with a one-bullet granted edit returns `passed: true` and reports deltas computed against `git -C <abs home checkout> show HEAD:<home-relative plan path>` and `HEAD:<home-relative spec path>`, with no copy of the original plan in its report.
  in-scope
- [ ] An Amend-apply dispatch whose plan is not at HEAD returns `passed: false` with a `failLines` entry starting `baseline read failed: git -C ` quoting the failed command, and the parent stops without its single retry.
  in-scope
- [ ] A spec critique - council member or worker - reviewing a spec whose requirement, AC row, or Design clause cites a PR title or body as its source reports it as a `major` `gap`; a rework spec whose rows cite the agreed design, and any `supersedes`, `## Rework record`, or provenance mention of a PR number, produces no such finding.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: fix-implement-failure-paths
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; node eval/run.mjs <target> per touched eval target; /skill:release is the only ship path
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: doc/implement-engines.md
Rules: .pi/gauntlet-overrides.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8
design: owns `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/reference/dispatch-contract.md`, `skills/subagent-driven-development/reference/implement-amendments.md`, `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `skills/brainstorming/reference/amendment-surface.md`, `skills/brainstorming/reference/spec-finalization.md`, `skills/forge-skill/SKILL.md`, `agents/implementer.md`, `agents/plan-writer.md`, `agents/spec-council-member.md`, `doc/personas.md`, `doc/implement-engines.md`, `CHANGELOG.md`, `scripts/implement-amendment.test.mjs`, the new deterministic test under `scripts/`, and the five eval targets; every observable outcome above is observed through `node eval/run.mjs <target>` replays, the deterministic tests, and `npm test`.

## Design

Four components. Each removes one construct and adds one small thing in its place.

### 1. Implementer return carries identity; guard off

pi-cohort names each task's structured-output directory with `mkdtemp` (`structured-output.ts:34`), so with two failed tasks in one wave the files cannot be told apart by path. The implementer's return therefore identifies itself with the same form its dispatch used.

- Extend `IMPLEMENTER_STATUS_SCHEMA` (`dispatch-contract.md:10`) with two optional properties, `anchor` (string) and `anchors` (array of strings), and a `oneOf: [{ required: ["anchor"] }, { required: ["anchors"] }]` so exactly one is present. `anchor` is the `### Task N:` heading copied verbatim from an `anchor:` payload; `anchors` is the dispatched heading list copied verbatim from an `anchors:` payload (multi-task repairs, `doc/implement-engines.md:24`). `additionalProperties: false` stays. Every embedded copy of the schema literal (the skill, `implementer-prompt.md`, eval `case.md` fixtures) changes together.
- Add to `agents/implementer.md` the return rule: copy the dispatched `anchor` or `anchors` into the structured return, in every status.
- Add to `agents/implementer.md` Hard rules: never open the final message with `BLOCKED:`; report a blocked state through `status: BLOCKED` and the report's `Reasoning:` line. pi-cohort's `blockedLine` detector (`attempt-finalization.ts:214-217`) runs before the structured read and would otherwise fail the task on that first line; no such rule exists today (`agents/implementer.md` mentions `BLOCKED` only as a status at `:23` and `:61`).
- Change `agents/implementer.md` frontmatter `completionGuard: true` to `completionGuard: false`. pi-cohort evaluates the pin as `agent.completionGuard !== false` (`attempt-finalization.ts:249`), so only an explicit `false` disables it; an omitted key would inherit the preset.
- Amend `skills/forge-skill/SKILL.md` Persona rules ("an implementing persona keeps the guard", `:55`) to: an implementing persona keeps the guard unless its caller owns an equivalent edit-less-completion check named in `doc/personas.md`; `implementer` is that exception (the wave loop's patch requirement below). Without this the next persona edit restores the pin.
- Remove nothing else from the implementer; its status vocabulary and the `question`/`concerns` conditionals are unchanged.

Detection after the guard is off:

- Isolated waves: step 3 requires accepted statuses and a patch before integration (`SKILL.md:120`, `:199`), and the new empty-patch row in component 2 counts a missing or zero-byte initial patch as a failed attempt. This is the only path where the guard's detection is fully replaced.
- In-place waves: no patch exists (`SKILL.md:125` prints `delta none applied n/a`), so an edit-less `DONE` reaches the test gate and one `wave-reviewer` dispatch before it fails. Accepted: the gate and review already own in-place correctness; this spec adds no `diff --stat` emptiness check there.
- Non-wave `implementer` callers (`gatekeep-pr`, `chase-bug/reference/hotfix.md`, finishing's fix-minors wave, pr-head conflict repair) consume the child's report and tree without a patch check. Accepted as uncovered by this change; hardening those callers is a separate task.

### 2. Failed-chain recovery reads the original

A chain failure without a matched `## Stop` suppresses the whole `## Outputs` section (`chain-execution.ts:477-480`, `:759-786`; `formatters.ts` `buildChainSummary`), including siblings that returned `DONE`. Recovery therefore reconciles every dispatched task whose structured result is missing, not only the failed one.

Replace "Chain stopped or failed" in `skills/subagent-driven-development/SKILL.md` with:

- Retain accepted siblings; never repeat the initial chain or redispatch a task whose result was already accepted. A matched `## Stop` still precedes sibling-error checking.
- For each dispatched task without a structured result in `## Outputs` or `## Stop`: list `<Artifacts>/structured-output/*/output.json` with the one listing command added to the `## Orchestrator holds` shell coordination list (`ls <Artifacts>/structured-output/*/output.json`), `read` each file with `limit: 300` (the file is one line: `JSON.stringify` without indentation, `subagent-prompt-runtime.ts:231`), and accept it only when all of these hold: the envelope is `{"status":"success","value":{...}}`; `value.status` is in the Implementer Status enum; `value.anchor` equals the task's dispatched anchor, or `value.anchors` equals the batch's dispatched heading list as a set; the conditional fields are present (`question` for `NEEDS_CONTEXT`, `concerns` for `DONE_WITH_CONCERNS`). An error envelope, a missing `value`, a value outside the enum, a missing conditional field, a missing or unmatched identity, or a read that does not reach the closing brace within the bound is treated as absent; never paginate. On a match, route `value.status` through the Implementer Status table and the transition table exactly as a `## Stop` entry: `NEEDS_CONTEXT`/`BLOCKED` to the takeable-decision ladder, `DONE`/`DONE_WITH_CONCERNS` to the patch requirement in step 3 (a recovered `DONE` sibling is accepted and integrated in plan index order like an observed one). A batch artifact matched by `anchors` routes its status once for every task in the batch. Print the existing `wave <w> task <n> <status> report <path> patch <path>` line per task.
- Amend `## Orchestrator holds`: the direct-read sentence (`SKILL.md:22`) admits `<Artifacts>/structured-output/*/output.json` for a dispatched task without a structured result, one file per read, `limit: 300`, no offset; the consume-from-result-text sentence (`SKILL.md:199`) admits the capture file as the second source after result text. Saved prose reports stay outside this exception; the read is an identity-matched artifact read, distinct from the forbidden report relay.
- Empty initial patch. Before integrating a `DONE`/`DONE_WITH_CONCERNS` task, check its `Artifacts:` patch with `test -s <patch>` (added to the shell coordination list). pi-cohort writes a zero-byte patch for a clean worktree (`worktree.ts:535-536`, `:552-554`) and omits the path from later steps (`:574-577`). A missing or zero-byte initial patch is a new transition-table row: `+1` for task n, next operation a repair round for that task on the current tree with "your work produced no patch" appended, siblings retained, nothing applied. A nonempty patch that fails `git apply --index` keeps today's hard stop (`SKILL.md:120`); the two are never confused.
- Only a task with no accepted file dispatches the diagnosis carrier. The carrier keeps its shape and gains `agent: "delegate"` and the literal sentence `Do not edit any file.` in its task text (the same sentence `implement-amendments.md` step 1 mandates for Amend-prepare; it matches `EXPLICIT_NO_EDIT_PATTERNS`, `completion-guard.ts:20-25`). `delegate` ships with pi-cohort with `edit`/`write` tools and no guard pin (`agents/delegate.md:6`), so without that sentence the carrier's own `.patch` paths would trigger the mutation guard on a read-only child. "Omit agent on this sequential step; use no parallel item" is removed. Diagnosis inspects identity-matched artifacts, which is distinct from the forbidden report relay in `## Orchestrator holds`.
- Repair rounds use the same read; a one-step carrier has one task, and the identity match is still required.

### 3. Amend-apply derives the inventory from the committed originals

Baseline invariant: the plan and spec at the home checkout's HEAD are the pre-amend originals from implement start through every batch.

- `skills/writing-plans/SKILL.md` `## Execution Handoff`: after the parent `plan_check` passes and before `plan_tracker` init, commit the plan on the worktree branch: `git -C <abs home checkout> add -- <home-relative plan path> && git -C <abs home checkout> commit -q -m "plan: <spec title>"`. Rewrite the `:39` boundary sentence to name this step. The spec is already committed at the brainstorm gate.
- `skills/subagent-driven-development/SKILL.md` Prerequisites: before the first wave, run `git -C <abs home checkout> status --porcelain -- <home-relative plan path> <home-relative spec path>`; a nonempty result (direct recovery or a resumed flow with an uncommitted plan) commits those paths the same way before dispatch. `git add -- <paths>` joins the shell coordination list. A dirty worktree is never the retry baseline.
- `agents/plan-writer.md` Amend-apply: remove "capture original task numbers, titles, spec anchors, and wave positions in the existing saved apply report", "no sidecar", and "Also capture anchored obligation text, task bodies and Tests". Replace with: derive the home-relative plan and spec paths as the implement-local Baseline step already does (`:303` matches porcelain entries against the worktree-relative plan and spec paths); before the first edit read `git -C <abs home checkout> show HEAD:<home-relative plan path>` and `git -C <abs home checkout> show HEAD:<home-relative spec path>`; compute `tasksAdded`, `tasksAnchorChanged`, `tasksRemoved` and `amendedSections` against those two texts. The committed spec is required because plans carry anchors and short coverage summaries, not the obligation text (`plan-contract.md` "Spec anchors", "Spec coverage table"), so `tasksAnchorChanged` keeps its semantic meaning (obligation or work changes, never line offsets or meaning-preserving rewording) even after a partial attempt edited the working spec. An absolute path after `HEAD:` fails (`fatal: path '...' exists on disk, but not in 'HEAD'`).
- `agents/plan-writer.md` Rules: the `bash` allowlist admits exactly `git -C <abs home checkout> show HEAD:<home-relative plan path>` and `git -C <abs home checkout> show HEAD:<home-relative spec path>` in addition to Baseline provenance commands and the plan's Tests. The existing bans on `git show` for anything else, commits, and jj mutation stay.
- Baseline-read failure: when either `git show` fails, return `passed: false` with `failLines[0]` = `baseline read failed: <exact command> - <first stderr line>` and write nothing. The parent (`implement-amendments.md` step 4) skips its single retry only when a `failLines` entry starts with `baseline read failed: git -C ` and emits a stop note quoting it; every other `passed: false` retries once as today.
- Nonmutating failure survives finalization: `plan-writer` keeps `completionGuard: true` (its ordinary apply mutates the spec and plan), and an Amend-apply task text containing a granted `edit` matches the mutation heuristic (probed: `evaluateCompletionMutationGuard` with an Amend-apply item and no messages returns `triggered: true`), so a baseline-read failure that writes nothing is flipped to exit 1 and its `## Outputs` suppressed. The parent then applies the component 2 read to the dispatch's `<Artifacts>/structured-output/*/output.json`: a one-task carrier has one file; accept a `success` envelope whose `value` satisfies `APPLY_SCHEMA` and route `passed`/`failLines` as if returned; two files or no file stop with a note naming the paths. Ordinary planner mutation acceptance is unchanged.
- Remove the report-copy requirement everywhere it binds, in the same change: `implement-amendments.md` steps 3-4 ("Before the first apply, require original task numbers ... Add no sidecar", "Require the retry to read original inventory ... Missing original inventory fails the retry"), `dispatch-contract.md:18` ("Preserve original inventory in the saved apply report through failures and idempotent retry"), `skills/writing-plans/SKILL.md:297` ("Capture original evidence in the saved apply report before editing"; retained-skipped evidence matches against the committed original plan), `:301` ("preserve the historical inventory in the report" -> the committed plan is the history), `:330` ("Capture original task numbers ... read it from `previousApplyReport` on retry", "missing-original-inventory failure"), `skills/brainstorming/reference/amendment-surface.md:43` and `:156` (capture, sidecar, read-from-report and missing-inventory sentences), `skills/writing-plans/reference/plan-contract.md:47` ("matching original evidence in the saved apply inventory" -> the committed original plan). Each site states the `git -C <abs home checkout> show HEAD:<home-relative path>` source instead. The retry in a fresh child keeps `previousApplyReport` only for the prior attempt's findings and `failLines`, and reads the originals from HEAD; `APPLY_SCHEMA` is unchanged. `scripts/implement-amendment.test.mjs:58-69` asserts the new sentences instead of the report-copy ones.
- The orchestrator's `plan_check` after child success and the single `amend:` commit per batch are unchanged, which is what keeps HEAD equal to the pre-amend plan and spec for the next batch.

### 4. Critique direction check

`agents/spec-council-member.md` axis 2 (logical gaps) gains a `pr-source` predicate beside `external-ref`, reported with the existing kind `gap` at severity `major` (the `<kind>` vocabulary at `:60` and the synthesizer/applier prefix routing for `external-ref:`/`over-spec:` are unchanged; `pr-source` is named only in the axis-2 prose and the finding text): a requirement, acceptance-criteria row, or Design clause whose stated source is a PR title or body ("per the PR description", "as the PR title says") is a gap, in every brainstorm including the PR-rework route - the spec produces the PR, never the reverse. The suggested edit re-sources the clause from the approved human input or the agreed design; when no such source exists, it asks for the user's Design scope decision before the commitment or its drafted row is cut, never replaces rows with `none`, and never drafts rows. A `supersedes` line, `## Rework record`, `## Problem` thread list, `## PR under rework` block, or any other provenance mention of a PR number is not a finding. A rework spec whose rows cite the agreed design passes.

The worker critique route (`spec-finalization.md:77-94`) gains the same predicate as its third check, with the same exemptions and the same re-source-or-ask edit rule, so the check runs in every brainstorm regardless of `specCouncil.members`.

### Documentation rows

- `doc/personas.md`: the `completionGuard` row shows `false` for `implementer`, with the reason in the "why each pin" bullet (the wave loop's patch requirement rejects an edit-less `DONE` in isolated waves; the guard hid structured `NEEDS_CONTEXT`/`BLOCKED` returns; in-place and non-wave callers rely on gate and review).
- `doc/implement-engines.md:26`: replace "Missing or invalid structured results go to delegated diagnosis, never report-body recovery" with: a missing structured result is first recovered from the task's identity-matched `output.json` capture, then goes to delegated read-only diagnosis addressed to `delegate`; report-body recovery stays forbidden. Unconditional - the sentence today contradicts the read-first path.
- `CHANGELOG.md` `## Unreleased`: one entry per component.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Dispatched task with no `output.json` (child died before structured output) | Dispatch the diagnosis carrier with `agent: "delegate"` and `Do not edit any file.`; its JSON routes through the transition table as today. |
| `output.json` present but not acceptable: error envelope, missing `value`, `value.status` outside the enum, missing `question`/`concerns`, identity missing or matching no dispatched task or batch, or object not closed within `limit: 300` | Treated as absent: diagnosis carrier. pi-cohort never removes the file (`cleanupStructuredOutputRuntime` has no callers), so a stale or rejected capture can sit beside a failed task. |
| Two `output.json` files claim the same identity | Stop note naming both paths; never guess. |
| `DONE` sibling of a failed task whose `## Outputs` was suppressed | Recovered from its capture, accepted, and integrated in plan index order; never redispatched. |
| `status: DONE` with a missing or 0-byte initial patch | New transition row: failed attempt, repair round with "your work produced no patch", siblings retained, nothing applied. |
| Nonempty initial patch fails `git apply --index` | Existing hard stop, unchanged. |
| Plan or spec uncommitted at implement entry (direct recovery, resumed flow) | Prerequisite commit before the first wave. |
| `git -C <home> show HEAD:<plan>` or `HEAD:<spec>` fails (path untracked, HEAD elsewhere) | Amend-apply writes nothing and returns `passed: false` with `failLines[0]` = `baseline read failed: <command> - <stderr>`; the guard suppresses the result, the parent recovers it from the dispatch's capture file, skips the retry on that marker, and emits a stop note quoting it. |
| Working plan or spec dirty from an earlier half-applied attempt | Harmless: HEAD still holds the pre-amend plan and spec, which are the inventory. |
| jj-only workspace (no git HEAD) | Out of scope; plan-writer fails closed as above. |
| Critique `pr-source` on provenance mentions | Not a finding: `supersedes`, `## Rework record`, thread lists, `## PR under rework`. Fires only on a requirement, row, or clause that gives a PR title or body as its justification. |

## Tests

Eval samples, one per observable; existing targets. Each sample's `case.md` declares its `bundle-` subset per `eval/README.md`. Replays are tool-free text and prove the prescribed narration; the deterministic tests below prove the runtime facts the narration relies on.

- Failed chain with suppressed `## Outputs`, capture envelopes with `NEEDS_CONTEXT` + `anchor` for task 5 and `DONE` + `anchor` for task 4: task 4 recovered, accepted and integrated before any other action, task 5 routed to the ladder, no diagnosis dispatch - `eval/subagent-driven-development/samples/artifact-status-read`
- Failed chain with no `output.json`: diagnosis dispatch carries `agent: "delegate"` and `Do not edit any file.`, returns its JSON - `eval/subagent-driven-development/samples/chain-error-diagnosis` (updated: `expected.md:1` drops "agent omitted"; the primary lists artifacts first)
- `DONE` with a missing or zero-byte initial patch and a `DONE` repair with an empty delta: both counted failed, nothing applied, siblings retained - `eval/subagent-driven-development/samples/empty-delta-attempt` (extended to initial integration)
- Multi-task repair batch returning `anchors`: matched as one batch, status routed once per task - `eval/subagent-driven-development/samples/batch-anchors-recovery`
- Implementer returns `anchor` and `NEEDS_CONTEXT` without any write - `eval/implementer/samples/needs-context-no-edit`; returns `anchor` and `BLOCKED` without any write and without a `BLOCKED:` first line - `eval/implementer/samples/blocked-no-edit`
- Amend-apply reads `git -C <home> show HEAD:<plan>` and `HEAD:<spec>`, never copies the plan into its report, `passed: true` on a one-bullet grant; retry after a partial attempt that changed only an anchored spec obligation reports that task in `tasksAnchorChanged` - `eval/writing-plans/samples/implement-amend-from-head`
- Amend-apply with the plan not at HEAD: writes nothing, `passed: false`, `failLines[0]` starts `baseline read failed: git -C ` - `eval/writing-plans/samples/implement-amend-plan-untracked`; parent recovers the result from the capture file and stops without retry - `eval/subagent-driven-development/samples/amend-baseline-missing-stop`
- Handoff commits the plan; implement entry commits an uncommitted plan or spec before the first wave - `eval/writing-plans/samples/handoff-plan-commit`, `eval/subagent-driven-development/samples/uncommitted-plan-at-entry`
- Council flags "per PR body" as a `major` `gap` - `eval/spec-council-member/samples/pr-sourced-clause`
- Council passes a rework spec citing the agreed design and a `supersedes` line naming a PR - `eval/spec-council-member/samples/pr-rework-design-sourced`
- Worker critique route flags the same clause and leaves provenance mentions alone - `eval/brainstorming/samples/worker-critique-pr-source`
- Existing samples re-run because their embedded schema, read boundary or amendment expectations change: `eval/implementer/samples/anchored-task`, `heavy-json-fixture`; `eval/subagent-driven-development/samples/direct-report-read`, `no-plan-read-wave`, `delegated-amendment`, `local-amend-revalidation` (their `case.md`/`expected.md` drop the report-copy inventory and name the committed-original read)
- Duplicate-identity stop - none: a stop note with no model judgment beyond reading two paths; covered by the SKILL text.
- Deterministic tests (`npm test`): `scripts/implement-amendment.test.mjs` asserts the committed-original sentences in `plan-writer.md`, `amendment-surface.md`, `implement-amendments.md`, `writing-plans/SKILL.md` and `plan-contract.md` and the absence of the report-copy ones; a new `scripts/implement-failure-paths.test.mjs` imports the installed peer's source (`node_modules/pi-cohort/src/runs/shared/completion-guard.ts` and `structured-output.ts`, loadable under Node's type stripping that `scripts/ci.mjs:433` already uses) and asserts: `agents/implementer.md` pins `completionGuard: false` and `agents/plan-writer.md` keeps `true`; the SKILL carrier literal names `agent: "delegate"` and `Do not edit any file.`, and `expectsImplementationMutation("delegate", <that carrier text>)` is `false`; `blockedLine` rejects a first line `BLOCKED: ...` and accepts a report whose `Reasoning:` line carries it; `readStructuredOutput` over a fixture `{"status":"success","value":{"status":"NEEDS_CONTEXT","question":"q","reasoning":"r","anchor":"### Task 5:"}}` returns the value under the new `IMPLEMENTER_STATUS_SCHEMA` and rejects a value with neither or both identity fields; in a temp git repo with a committed plan and spec and dirty working copies, `git -C <repo> show HEAD:<relative>` returns the originals and `HEAD:<absolute>` fails. Frontmatter and schema changes also pass the skill/agent lint, eval structural lint and `dispatch-contract` consumers in `npm test`.

For the deterministic runtime tests that import pi-cohort's structured-output source, add `"typebox": "^1.3.11"` to this repository's `package.json` devDependencies, matching pi-cohort's declared development range and explicitly supplying its optional peer's `typebox/compile` module during development installs. Task 1 owns this package.json change and verifies its existing scoped runtime-test command after installing development dependencies; keep production dependencies and the pi-cohort peer floor unchanged, retain the repository's ignored package-lock.json convention, and do not replace the required peer-runtime tests with mocks or skipped tests.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` entry (non-obvious rationale: why the guard, the carrier, and the inventory copy were removed, and why the plan is now committed at handoff); `CHANGELOG.md` heading promotion - deferred: release
- Derived / memory docs invalidated: `doc/personas.md` - `completionGuard` row for `implementer` and the "why each pin" bullet; `doc/implement-engines.md:26` - the missing-structured-result sentence (artifact-first, then addressed read-only diagnosis)

## Out of scope

- Moving status-aware guard logic into pi-cohort (approach 3): a cross-repo release that would teach the coordination layer gauntlet's status words.
- pi-cohort naming structured-output directories by task index: would need a pi-cohort release; the `anchor`/`anchors` field covers identity without it.
- jj-only workspaces for Amend-apply inventory.
- An edit-less-completion check for in-place waves and for non-wave `implementer` callers (`gatekeep-pr`, `chase-bug` hotfix, finishing fix-minors, pr-head conflict repair): gate and review own those paths; hardening them is a separate task.
- Noticed during triage, not fixed: `~/.pi/agent/agents/*.md` symlinks point at the `.worktrees/gh-107-coordinated-legs-reference` checkout rather than main, and the customer-ops `.pi/agents/` still carries stale `code-reviewer.md`/`spec-reviewer.md` beside `wave-reviewer.md`. Candidate for `/skill:shape-ticket`.

## Open questions

- jj workspaces: whether the plan-writer should read the plan and spec through `jj file show` when no git HEAD exists is deferred until a jj-only consumer hits the fail-closed path.
