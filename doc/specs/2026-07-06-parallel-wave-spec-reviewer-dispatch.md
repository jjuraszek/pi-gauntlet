# Parallel-Wave Mode: dispatch `spec-reviewer` per patch

## Context

`subagent-driven-development` runs two execution modes. Both promise a **two-stage review** per the skill's own line: *"spec review per task (pre-integration), quality review per wave (post-integration)."*

- **Sequential mode** (The Process, step 3): *"Dispatch spec reviewer."* -> the `spec-reviewer` agent fires per task.
- **Parallel-Wave mode** (Per-wave loop, step 3): *"spec-review each returned patch against its task (read-only, parallelizable)."* -> phrased as an **orchestrator activity** (verb, no agent), not an agent dispatch.

## Problem

The two modes use different verbs for the same gate. Sequential says **"Dispatch spec reviewer"**; wave says **"spec-review each returned patch"**. The wave verb reads as "do it yourself inline", so the orchestrator never dispatches the `spec-reviewer` agent - the per-task spec gate silently collapses into the orchestrator's own context. This wording delta is the primary, spec-internal evidence; it needs no external log to verify.

Session-log color (last 5 days, illustrative): a full wave run `gridstrong 2026-07-06T06-59` dispatched `implementer` x84, `conformance-reviewer` x7, `code-reviewer` x4, and **`spec-reviewer` x0**; across the window `spec-reviewer` fires at ~1/3 the `code-reviewer` rate, collapsing on wave-heavy days.

`code-reviewer` degrades less because it has a dispatch path that survives wave mode: the whole-PR review at "After All Tasks" step 1, which explicitly routes through `/skill:requesting-code-review` (this is why `code-reviewer` still fired x4 above). Per-task spec review has no such fallback.

This defeats the gauntlet's core premise. The same skill bans the orchestrator from reviewing **code** inline (*"Fix the subagent's work inline ... pollutes your context and defeats fresh-subagent isolation"*) yet its wave-mode wording invites exactly that for **spec** review: no fresh context, no skeptical read-only agent, no per-requirement table.

## Idea

Make wave-mode per-task spec review an explicit `spec-reviewer` **agent dispatch**, mirroring sequential mode. Granularity is unchanged and deliberate: spec review stays **per task, pre-integration** (gates what enters the tree, attributes each gap to a known task); code-quality review stays **per wave + whole-PR, post-integration** (judges the merged result). The bug is dispatch mechanism, not granularity.

Dispatch shape: **one parallel fan-out of N `spec-reviewer` tasks per wave**, one per accepted patch (option (a), chosen over a single batched reviewer to preserve per-patch isolation and gap attribution). N dispatches per wave is the restored gate, not a cost to dodge - no volume escape hatch. Inline verdict return is fine at normal wave sizes; large waves use the existing `output:`/`outputMode: "file-only"` pattern to keep verdicts out of the orchestrator's context.

### Reviewer operating model (pre-integration)

The wave patch is **not** integrated when it is reviewed (integration is step 4). So wave-mode spec review is **diff-based**, and this is sound:

- The reviewer receives the returned **patch diff**; diff hunks carry `file:line`, satisfying the `spec-reviewer` persona's citation requirement (the persona already accepts "a diff or the relevant files" - see `agents/spec-reviewer.md` / `reference/spec-reviewer-prompt.md`).
- **Test execution is not the reviewer's job here.** The persona runs tests only "when available"; pre-integration they are not. The wave's integrated **test gate (step 5)** already runs the suite on the merged tree, so deferring execution there is not a coverage loss.
- The review answers "does this patch implement its task and match the spec?" - a diff-vs-spec check, which is exactly what a pre-integration gate needs.

### Exact edits (all in `skills/subagent-driven-development/SKILL.md`)

Minimal added wording, no conditional expressions, no new code-example block (the existing implementer fan-out example + the sequential-mode one-line `spec-reviewer` call already fix the `tasks: []` shape). Each added clause below is load-bearing.

**Edit 1 - Per-wave loop, step 3.** Replace the inline verb with a dispatch. The new text must convey:

- Parse each status per [Implementer Status] **first** (unchanged ordering).
- **Dispatch a `spec-reviewer` per accepted patch** (`DONE`, or a `DONE_WITH_CONCERNS` the orchestrator proceeded with) in one parallel fan-out: `context: "fresh"`, `cwd: <worktree>`, **no `worktree` flag** (read-only). Each task is passed its task text, the returned **patch diff**, and the absolute spec path; review is diff-based (test execution stays with the step-5 gate). Parallelizable.
- **Re-dispatch** splits by cause: `BLOCKED`/`NEEDS_CONTEXT` per the status matrix; **spec gaps** re-dispatch the implementer (fresh, `worktree: true`) carrying the **prior patch + the reviewer's findings**, the new patch superseding the old at step-4 integration. Loop until accepted + spec ✅.

**Edit 2 - "Two-stage review is preserved" line.** Pin the mechanism:

- From: `spec review per task (pre-integration)`
- To: `spec review per task (pre-integration, dispatched `spec-reviewer` — not inline)`

**Edit 3 - Red Flags - STOP.** Add one bullet (after the "Letting implementer self-review replace external review" line):

- `- Spec-reviewing wave patches inline instead of dispatching `spec-reviewer` per patch — sequential mode's step 3 dispatches it; wave mode must too`

## Out of scope

- Sequential mode step 3 (already dispatches; unchanged).
- Code-quality review granularity - per-wave + whole-PR is deliberate; unchanged.
- **Step 6 wording** - wave step 6 ("Code-quality review on the integrated wave diff") uses the same dispatch-less "activity" phrasing and is a *possible* separate latent gap. It is **not** confirmed degraded (code-reviewer still fires via the whole-PR path) and is **not** fixed here; flagged as a follow-up to keep this change minimal and scoped to the confirmed `spec-reviewer` x0 regression.
- **Runtime enforcement guard** - `phase-tracker` already gates `complete verify` on an observed `conformance-reviewer` dispatch; an analogous wave-mode `spec-reviewer` dispatch guard is a plausible follow-up but out of proportion to a prose-parity fix (sequential mode is also prose-only). Deferred.
- `dispatching-parallel-agents` - fan-out/integration mechanic only; never described spec review; unchanged.
- README - line 33 already describes spec review as a `spec-reviewer` dispatch; accurate, unchanged.
- No new `subagent({ tasks: [...] })` example block for spec-reviewer (minimal-wording directive; the shape is fully determined by step-3 prose + the existing implementer example).

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (skill body is implementation surface, not a doc-impact entry per `reference/documentation-impact.md`; README needs no change - confirmed line 33 already correct)
- Derived / memory docs invalidated: none

## Acceptance criteria

1. Wave-mode step 3 mandates dispatching `spec-reviewer` per **accepted** patch (`DONE` or accepted `DONE_WITH_CONCERNS`), `context: "fresh"`, `cwd: <worktree>`, no `worktree` flag, passing task text + patch diff + absolute spec path; review is diff-based.
2. Step 3's re-dispatch clause splits status-driven re-dispatch (`BLOCKED`/`NEEDS_CONTEXT` per the status matrix) from spec-gap re-dispatch (carries prior patch + reviewer findings; new patch supersedes at integration); loop terminates on accepted + spec ✅.
3. "Two-stage review is preserved" line states spec review is a dispatched `spec-reviewer`, not inline.
4. A Red Flag forbids inline spec-review of wave patches.
5. No change to sequential mode, code-review granularity, step 6, `dispatching-parallel-agents`, or README; step 6 and the runtime guard are named in Out of scope.
6. Volume (N reviewers/wave) is acknowledged as the intended gate; large-wave output aggregation points at the existing `output:`/`file-only` pattern.
7. `npm test` passes; leakage grep over `skills/` is clean; wave step 3 is internally consistent with sequential step 3 and the two-stage line.
