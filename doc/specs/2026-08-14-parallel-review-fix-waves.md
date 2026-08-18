# Parallel review fix waves

Reviewer-partitioned parallel fix dispatch for SR/CR fix loops, the final whole-diff
code review, and the conformance fix loop - plus a `plan_tracker` `add` action so fix
sub-waves extend the task list instead of overwriting it.

## Problem

Session-log analysis (~30 orchestrator sessions under `~/.pi/agent*/sessions`, dispatch
shapes extracted from `subagent` tool calls) confirms:

- **Happy path works.** Parallel-wave mode fans out implementers and per-patch SRs
  correctly in most recent sessions.
- **Fix loops are serial - the dominant cost.** Every review round that finds issues
  dispatches exactly one fix implementer, even when findings span disjoint files.
  Worst observed: consecutive single-dispatch impl/CR chains of 23, 12, 11, 9, 7
  (a consumer repo, 2026-08-12). The whole-diff CR's fix handling has no parallel contract
  at all.
- **SR fan-out occasionally degrades** (sequential single SRs after a wave; SR +
  re-dispatch not co-scheduled) - real but secondary; the existing wave contract
  already mandates the fan-out, so this is drift, not a missing rule.
- **Conformance** already has reviewer-emitted partition metadata (`Parallel-safe:`
  line, `touched-files` per gap) but its dispatch prose reads "Per gap ... dispatch
  implementer ... -> dispatch spec-reviewer" - serial-leaning, and sessions show both
  shapes. Its `plan_tracker init` also wipes the implement phase's completed task
  list.

Root cause: no loop ever states *how* a multi-finding fix round is dispatched, and no
reviewer contract outside conformance certifies which findings are disjoint. The
orchestrator is forbidden from partitioning findings itself ("never select, summarize,
or diff findings yourself"), so absent a reviewer-emitted certificate, serial is the
only legal shape.

## Goals

- Fix rounds with reviewer-certified disjoint findings dispatch in one parallel
  fan-out, in: SDD task/wave SR and CR fix loops (both modes), the final whole-diff
  review (`requesting-code-review`), and the conformance fix loop.
- Fix sub-wave progress extends `plan_tracker` - completed task statuses survive.
- Minimal prose, followable by smaller models: one dispatch-shape rule defined once,
  one grammar copied where reviewers need it, sentinel pattern-matching only - no new
  orchestrator judgment, no new artifact, no settings key.

## Non-goals (out of scope, stated)

- No plan-file mutation and no transient fix-wave artifact - the reviewer's report
  (forwarded verbatim, as already required) is the dispatch source.
- No change to trajectory/escalation semantics or round budgets where they exist
  (SDD, conformance); `requesting-code-review` gains a minimal loop because it has
  none today (see Design 3).
- No change to serial integration, the one-cumulative-CR-per-round rule, or the
  re-audit shape.
- No cross-group ordering hints beyond the `conflicts` partial order, no per-finding
  retry budget distinct from the loop budget, no richer multi-task `plan_tracker`
  widget rendering.
- No change to plan-time wave grouping (`writing-plans` D5). The SDD wave-mode
  step order (integrate -> test -> quality review -> commit) is unchanged; a dirty
  integrated tree degrades the CR fix round to sequential in-place fixes (see
  Design 1, precondition).

## Design

### 1. Fix fan-out rule - defined once in `dispatching-parallel-agents`

A new short section ("Fix fan-out") in `skills/dispatching-parallel-agents/SKILL.md` -
phase-neutral home, already referenced by both SDD and conformance-check, so no phase
skill reads another phase skill. Semantics match the existing conformance convention
(`disjoint` IDs share one wave; `conflicts` pairs serialize):

> Reviewers certify fix concurrency with a `Parallel-safe:` line (see the reviewer's
> report contract). The fan-out trigger is a `disjoint` group naming **>= 2 finding
> IDs**: that group IS the parallel wave - dispatch **one `implementer` per finding
> ID in the group** (`context: "fresh"`, `worktree: true`, `cwd` = the current
> worktree; task = that finding's block **verbatim**, including its `touched-files`
> line as the ownership boundary). A finding named in any `conflicts` pair runs
> sequentially after every finding it names has integrated (chained `conflicts`
> define a partial order; remaining serial findings run in the line's order).
> Findings outside any >= 2-ID `disjoint` group run sequentially. Fan out per review
> line only - never merge or co-schedule groups from different `Parallel-safe:`
> lines; run those fan-outs serially.
>
> **Precondition:** a clean committed HEAD containing the code under review. When
> the reviewed change is an unintegrated patch (SDD wave-mode per-patch SR), each
> fix task branches from the wave's base HEAD and carries the prior patch verbatim
> in its task text - the existing SDD re-dispatch protocol. When the tree is dirty
> (SDD wave-mode post-integration CR, before the wave commit), the fan-out is
> unavailable: fix sequentially in place, as today.
>
> **Degradation:** missing, malformed, or ID-less `Parallel-safe:` line, or no
> `disjoint` group with >= 2 IDs -> fully sequential fixes, today's behavior.
>
> **After the fix wave:** integrate patches serially per "Review and Integrate";
> run the consuming loop's scoped test gate on the integrated tree; then one
> re-review of the integrated fix delta, per the consuming loop's own rules.

Failure handling (textual conflict despite `disjoint`, semantic conflict, failed or
`BLOCKED` member) is inherited unchanged from the existing "Review and Integrate"
mechanics - a mis-partition is self-healing: integrate the successes, re-run the
conflicting finding sequentially on integrated HEAD.

### 2. Finding IDs + `Parallel-safe:` grammar in reviewer contracts

Two additions to `skills/subagent-driven-development/spec-reviewer-prompt.md` and
`skills/requesting-code-review/code-reviewer.md` (the CR report contract;
`code-quality-reviewer-prompt.md` already delegates its format there and gains
exactly one line: "Emit finding IDs and the `Parallel-safe:` line per that
contract."):

1. **Global finding IDs + ownership.** Every finding gets a globally unique label
   `F1..Fn`, numbered across the whole report (no restart per severity section),
   plus a `touched-files:` line (files a fix would edit - not just the evidence
   location) and, when relevant, `touched-resources:` (DB/schema, port, fixture,
   external service, shared temp path). Empty value = literal `none`.
2. **The partition line**, exact conformance grammar with `F` IDs:

   ```
   Parallel-safe: <group>[; <group>]*
     <group> = <comma-separated finding-id list> " disjoint"
             | <finding-id> " conflicts " <finding-id> " (" <reason> ")"
   ```

   IDs inside a `disjoint` list are mutually parallel-safe (they co-run). Any file
   OR runtime-resource overlap between two findings' fixes forces `conflicts`.
   Runtime-resource disjointness is estimated over: DB/schema, port, fixture,
   external service, shared temp path (list inlined - reviewers run fresh with
   `inheritSkills: false` and cannot follow a `writing-plans` reference). Uncertain
   -> `conflicts` (conservative default = serial). Emitted on any issue-bearing
   review.

Each copy carries a drift-guard comment: "grammar identical to
`agents/conformance-reviewer.md` (modulo `G` vs `F` id prefix) - change them
together or not at all; `writing-plans`' plan-time `Parallel-safe:` line is a
deliberately different free-text form, do NOT unify." `agents/conformance-reviewer.md`
is amended in the same change to inline the resource list (replacing its dangling
`writing-plans` pointer), keeping the three copies truly identical. Duplication is
deliberate: prompt templates become the reviewer's actual prompt in a fresh context
and must be self-contained. The orchestrator-side rule is NOT duplicated - consumers
reference the `dispatching-parallel-agents` section by name.

(Ratified at the finish gate: the contract is additionally mirrored into the two
reviewer personas `agents/spec-reviewer.md` and `agents/code-reviewer.md` - under
`systemPromptMode: replace` the persona is the live output contract, and the
whole-diff review found the certificate reliably omitted when only the task
template carried it. Five drift-guarded copies total: conformance-reviewer
(G-form), the two templates, the two personas.)

### 3. Loop accounting - exact insertions per consumer

- `skills/subagent-driven-development/SKILL.md`, `Fix-Loop Rounds`, exact sentence:
  "When the triggering review's `Parallel-safe:` line certifies a `disjoint` group
  of >= 2 findings, dispatch that fix round per `dispatching-parallel-agents`
  'Fix fan-out'; the fan-out counts as **one** fix against this budget, its scoped
  test gate is the consuming task/wave's plan-declared commands, and one re-review
  of the integrated delta follows." Red flags gain: "dispatching fixes sequentially
  on a clean HEAD despite a >= 2-ID `disjoint` group in the review's
  `Parallel-safe:` line".
- `skills/requesting-code-review/SKILL.md` has **no fix loop today** ("fix
  Critical/Important, note Minor" - no re-review, no budget), so it gains a minimal
  one, exact text: "Critical and Moderate findings trigger a fix round; when
  dispatched from an orchestrating skill, fixes go to `implementer` subagents (per
  the orchestrator's no-self-coding rule), fanned out per
  `dispatching-parallel-agents` 'Fix fan-out' when the review's `Parallel-safe:`
  line certifies a `disjoint` group of >= 2 findings. After integration and the
  project's test command, re-dispatch the reviewer once on the integrated delta.
  If Critical or Moderate findings remain, run one more fix round and one more
  re-review; still failing -> escalate to the user." Minor findings never trigger
  the fan-out.

  (Deviation recorded during implementation: severity vocabulary unified on
  Critical/Moderate/Minor across the CR contract, persona, and consumer skills -
  review-driven; "Important" as a tier is retired.)
- `skills/verification-before-completion/reference/conformance-check.md` step 2:
  rephrased from "Per gap ... dispatch implementer -> dispatch spec-reviewer" to an
  explicit fan-out referencing the same section - a `disjoint` group of >= 2 gaps
  fixes in one parallel dispatch (one implementer per gap, gap block verbatim,
  `touched-files` as boundary), `conflicts` pairs serialized; per-gap SR re-reviews
  follow. Steps 3-6 (serial integrate, test gate, one cumulative CR, one re-audit)
  unchanged. The existing precondition rule is untouched: **no eligible worktree
  HEAD -> skip the loop and carry every `fix` gap OPEN** (not "sequential fix");
  sequential fallback applies only inside an eligible worktree when the partition
  line is absent/malformed or no `disjoint` group has >= 2 IDs.

### 4. `plan_tracker` `add` action - the only code change

`extensions/plan-tracker.ts` gains `add`:

- Appends the given tasks as `pending`; existing tasks and statuses untouched.
- No active plan -> creates one containing just the appended tasks (the ad-hoc
  finishing path runs conformance with no prior tracker; `add` must not error).
- **Full-list invariant:** the `add` toolResult's `details.tasks` carries the FULL
  merged post-add list, not just the appended tasks - `reconstructState` rebuilds
  tracker state wholesale from the latest toolResult's `details.tasks` on session
  events, and `phase-tracker.ts` `applyPlanActivity` reads it on every
  `tool_execution_end`.
- Mechanical touch-points: `PlanTrackerParams.action` `StringEnum` and
  `PlanTrackerDetails.action` union gain `"add"`; the `tasks` param description
  ("for init") is updated to "(for init and add)"; `renderCall`/`renderResult` gain
  an `add` branch; the tool description string enumerates
  `init | add | update | status | clear` (the description is the model-facing
  contract).

Consumers:

- Fix fan-outs `add` one task per fixed finding, named mechanically from the
  reviewer's report - `"<prefix>fix F<n>: <finding's first line verbatim>"`, where
  `<prefix>` is `"W<k>-"` inside an SDD wave and empty elsewhere (whole-diff CR,
  sequential mode). No orchestrator-authored summaries. Mark `in_progress` at
  dispatch, `complete` at integration.
- conformance-check.md step 1 switches from `init` to `add` (append the round's
  `Gn:` tasks, which already carry the gap requirement text); the now-obsolete
  "re-init **replaces** the implement phase's completed task list ... state-safe"
  caveat is deleted. Round 2+ appends new `Gn:` tasks; gap IDs are already stable
  across re-audits.

Uniform rule for small models: **fix/gap tasks always extend the tracker, never
re-init.**

## Error handling and edge cases

- Missing / malformed / ID-less `Parallel-safe:` line, or no >= 2-ID `disjoint`
  group -> sequential fix, silent degradation (costs parallelism, never
  correctness; no warning noise).
- Everything in `conflicts` pairs -> fully serial round in the line's order.
  Uncertain-means-conflicts stays the grammar's rule: false-serial is cheap,
  false-parallel corrupts.
- Chained `conflicts` (F3 conflicts F2, F2 conflicts F1) -> partial order: a
  finding runs after every finding it names has integrated.
- Multiple concurrent reviews (SDD wave-mode per-patch SRs) -> fan out per review
  line only; fan-outs from different lines run serially, never merged.
- Fan-out member returns `BLOCKED`/`NEEDS_CONTEXT` -> integrate the successful
  findings, handle the member per the existing Implementer Status matrix
  (integrate-successes/retry-failure is the established parallel-batch pattern).
- Patch fails to apply despite `disjoint` -> inherited `dispatching-parallel-agents`
  fallback (self-healing re-run on integrated HEAD).
- Post-integration re-review failure -> findings feed the consuming loop's normal
  sequence (trajectory sentinel, budget, escalation where they exist; the
  requesting-code-review minimal loop above where they don't); a fan-out grants no
  extra rounds.
- Dirty tree at fix time (SDD wave post-integration CR) -> sequential in-place fix,
  as today; fan-out requires a clean committed HEAD.
- Conformance without an eligible worktree HEAD -> skip the fix loop, carry `fix`
  gaps OPEN (existing rule, unchanged).
- `add` during any phase is legal; phase auto-completion semantics unchanged
  (`applyPlanActivity` auto-completes `implement` only while it is `in_progress`
  and all tasks are complete, so appended fix tasks hold the phase open; during
  verify it is a no-op).

## Testing approach

The repo has an extension unit harness: `scripts/ci.mjs` runs `node --test` over
`extensions/*.test.ts` via `extensions/test-support/pi-stubs.mjs` (in-process
extension registration). Use it:

- New `extensions/plan-tracker.test.ts`, registered in `scripts/ci.mjs`'s test list,
  covering: `add` appends and preserves existing statuses; `add` with no active plan
  creates one; `add`'s `details.tasks` carries the full merged list (reconstruction
  invariant); invalid/empty `tasks` input rejected.
- Skill/template edits: `/skill:writing-skills` verification checklist per file; the
  AGENTS.md placeholder grep over `skills/`; `npm test` green.
- Grammar drift: eyeball-diff the three `Parallel-safe:` copies (conformance-reviewer,
  spec-reviewer-prompt, code-reviewer contract) at review time; the drift-guard
  comments name both the identity requirement and the intentional `writing-plans`
  divergence.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (its `plan_tracker` action
  enum at ~line 49 - `init | update | status | clear` - gains `add` with one line of
  semantics; this file, not README, owns the action contract); CHANGELOG.md (minor
  release entry: new `add` action + fix fan-out contract). README.md is checked for
  an independent action enumeration but is not expected to need changes.
- Derived / memory docs invalidated: none (AGENTS.md extensions table unchanged -
  `plan-tracker.ts` stays non-configurable; no new settings key)

Materiality bar per `brainstorming/reference/documentation-impact.md`: skill bodies
and prompt templates are implementation surface, not doc-impact entries.

## Open questions

None.

## Evidence appendix (session-log analysis)

- Serial fix chains: a consumer repo, 2026-08-12T10-47 runs of 7, 7, 23, 11, 7, 7
  consecutive single impl/CR dispatches; 2026-08-12T09-18 runs of 11, 9, 12, 6.
- SR degradation: a consumer repo, 2026-08-12T09-18 (2 parallel SRs then 2 sequential
  singles); 2026-08-09T17-48 dispatch #6 (one SR while the other task's re-dispatch
  ran serially after).
- Conformance: both `P2:impl -> S1:conf` and serial `S1:impl -> S1:conf` chains
  observed, matching the serial-leaning "Per gap" prose.
- Happy path intact: pi-condense 2026-08-13 `P2:impl P2:spec`, `P3:impl P3:spec`.
