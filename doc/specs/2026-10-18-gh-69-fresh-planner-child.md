# Fresh planner child for writing-plans

**Goal:** The plan phase authors, checks, and repairs the implementation plan inside one fresh `plan-writer` child, so the parent's transcript holds only the dispatch, one stamping `plan_check`, one read of the finished plan, and the phase bookkeeping.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** #69
**Supersedes:** `doc/specs/2026-08-12-execution-fidelity-hardening.md`, "Change 1: Plan-time recon in writing-plans" only (the `scout` recon dispatch, the `# CONTEXT DRAFT - NOT A PLAN` marker, and the parent's read-then-full-replacement write).

## Problem

Today `skills/writing-plans/SKILL.md` has the main loop do the whole plan: dispatch a fresh `scout` whose draft lands at the plan path (`SKILL.md:53-71`), read it, write the plan with a full-replacement `write`, then run `plan_check` and fix every finding in the parent until it passes (`SKILL.md:260-275`). Every draft, rewrite, and fix round is a parent message, so the implement phase inherits the authoring history. The ticket reports a median 206k tokens at approval and 245k after the plan, with 11 fix rounds on one run; those figures are motivation from the telemetry corpus and were not reproduced here.

Premises checked against the source:

- The parent still reads the plan during implement: `skills/subagent-driven-development/SKILL.md:60` has the orchestrator pass the full task text and `:298` lists making the implementer re-read the plan as a red flag. This change removes the authoring rounds from the parent, not the plan's single read.
- `plan_check` reaches a child only when the persona's `tools:` names it: pi-cohort `src/runs/shared/pi-args.ts:131-140` lets a child inherit extension discovery, and the host pi's `docs/cli.md:120` says the `--tools` allowlist pi-cohort emits from `tools:` "Replaces the default selection with a comma-separated allowlist of built-in, extension, or custom tools". The stamp is parent-only state: `extensions/phase-tracker.ts:886-895` writes `planCheckStamp` only under the parent's `gauntletEntered` flag; a child call returns `PASS (no flow to stamp)` with the same findings list on failure (`phase-tracker.ts:829-836`). Implement-start rejects a missing or stale stamp (`phase-tracker.ts:961-977`).
- Today's round bound is "If the same finding survives 3 fix rounds, convert it to an explicit Open Question and stop" (`skills/writing-plans/SKILL.md:264`). There is no cap on total checker calls.
- Per-phase `peak_context` and `compactions` are already recorded (`extensions/telemetry.ts:780-783`, `extensions/lib/telemetry-record.ts:51`), so the ticket's context bound is measurable with no extension change.
- A fork is a full-history branch of the parent session, "not a lighter context" (pi-cohort `skills/pi-cohort/SKILL.md:38`); a forked planner would carry the brainstorm into every child turn.
- pi-cohort `resume` always revives a child as a new asynchronous run with a new run id (`src/runs/foreground/subagent-executor.ts:579-677`, "Revived run"). A foreground fix round therefore cannot use `resume`; the questionary's "resume the same run" answer is carried as "a fresh foreground re-dispatch that hands the child the plan it wrote plus the findings" (see Design), and the user may overrule at the gate.

Framing: kept (ticket #69 - `context: "fresh"` adopted; the plan derives from the committed spec, which carries every brainstorm decision, and the conformance reviewer judges the diff against the spec, never against brainstorm chat).

## Acceptance criteria

Ticket #69, "Acceptance criteria", rows verbatim:

- [ ] After approval, the plan phase's parent transcript contains the planner dispatch call(s), the `plan_check` call(s), and the phase bookkeeping, and no parent message writes plan content: the plan file's author is the child (its dispatch `output` or a write inside the child's session).
  in-scope
- [ ] The dispatched planner child runs with `context: "fresh"` (the dispatch call names it) and receives the spec path, the plan path, and the absolute worktree path in its task.
  in-scope
- [ ] A failed `plan_check` re-dispatches the child with the check's report appended to the task; the round limit equals the one `writing-plans` documents today, and exceeding it surfaces to the human exactly as it does today.
  in-scope
- [ ] The resulting plan passes `plan_check` and the implement phase under the `waves` engine runs on it unchanged (same anchors, same `plan_tracker` init).
  in-scope
- [ ] The plan-phase telemetry record shows a parent peak context no larger than at approval plus 10k tokens on a fixture spec in this repo (baseline: median 206k at approval, 245k after plan in the cleanup-menu run), and the plan-phase parent cost on that fixture is tabulated in the PR against the same fixture's pre-change run.
  venue: local gauntlet run on this repo - two scratch-worktree runs (pre-change and post-change) on the fixture spec `doc/specs/2026-06-15-auto-proceed-spec-to-execution.md`, measured per Tests
- [ ] `eval/writing-plans/` gains a sample whose must-hold facts are: child dispatch is fresh, plan content is not written by the parent, `plan_check` runs in the parent; `node eval/run.mjs writing-plans` is run and its `report.md` committed.
  in-scope
- [ ] `doc/configuration.md` or the skill documents which persona writes the plan and how to override its model through the existing `agentOverrides` knob.
  in-scope

Readings adopted as Design clauses: AC1's "the plan file's author is the child" is satisfied by a `write` inside the child's session (no dispatch `output:`), and the parent's single read of the finished plan is not a write; AC3's "re-dispatches the child with the check's report appended to the task" is satisfied by a fresh foreground `plan-writer` dispatch whose task is the fixed template plus the verbatim findings block; AC5's cost table lands in the PR body that `/skill:finishing-a-development-branch` creates, with the same pair copied into the eval `report.md`.

## Design

### Components

| Component | Change |
|---|---|
| `agents/plan-writer.md` | New persona. Frontmatter: `name: plan-writer`, a routing-label `description`, `tools: read, grep, find, ls, write, plan_check`, `inheritProjectContext: false` (the body reads `AGENTS.md` itself), `inheritSkills: false`, `completionGuard: true` (it writes a file), `systemPromptMode: replace`; no `model:`, `thinking:`, or `defaultContext:`. Body is a whole-prompt planner (below). |
| `skills/writing-plans/SKILL.md` | The parent procedure replaces `## Recon (mandatory)` with `## Author the plan` (dispatch + stamp + read + handoff). The authoring sections (`## File Structure` through `## Self-Review`) stay in place under a one-line note that the child executes them and the main loop never does; their recon-report wording is retargeted (below). |
| `skills/brainstorming/reference/amendment-surface.md` | The plan-aftermath step's plan-text edit becomes an amend-mode `plan-writer` dispatch; the step's tracker surgery, phase stability, and commit rules stay. |
| `doc/personas.md`, `doc/configuration.md`, `doc/install-internals.md`, `README.md` | Per Documentation impact. |
| `eval/writing-plans/` | New target per Tests. |
| `CHANGELOG.md` | `## Unreleased` entry under Changed, `(#69)`. |

Nothing under `extensions/` changes.

### `plan-writer` persona

The body instructs, in order:

1. Read the task's inputs: absolute worktree path, absolute spec path, absolute plan path, and the absolute paths of `skills/writing-plans/SKILL.md` and `skills/writing-plans/reference/plan-contract.md` (the parent resolves both from the loaded skill's envelope, the same way `gatherer.md` resolves `<SPEC_INDEX>`). A task may also carry a `Findings:` block (a verbatim parent `plan_check` FAIL output) or an `Amend:` block (see Re-planning and amendment).
2. Read the repo's `AGENTS.md` and the gauntlet overrides file (ladder: `.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`, `doc/gauntlet-overrides.md`) for conventions, verification commands, and the `## Happy path` table.
3. Read `SKILL.md` from `## File Structure` through `## Self-Review` and all of `plan-contract.md`; that text is the plan contract and is not restated in the persona.
4. Do the recon today's scout task prescribes (file map, call sites and tests with line ranges, scoped test and lint commands, full verification entrypoint) by reading the code directly; no nested dispatch. With a `Findings:` block, read the existing plan at the plan path first and keep everything the findings do not touch.
5. Write the plan at the plan path with `write` (full replacement). The only file the child writes is the plan path.
6. Repair loop, the only loop in the persona: run `plan_check({ planPath })`; any result starting `PASS` is a pass (`PASS (no flow to stamp)` is the expected child-side text). On `FAIL`, fix every finding and re-run. Then run the judgment self-review checks named in `## Self-Review` (code-vs-anchor sanity, type/API consistency, test contract, runtime-resource disjointness, solo-reason validity, waiver authorization, verification-ownership authorization, documentation-impact mapping); any edit they cause returns to the top of this step. The loop ends only on a `plan_check` pass with no further edits, or when the same finding has survived 3 fix rounds: then write it under an `## Open Questions` section at the top of the plan and stop. A `Findings:` block's rows count as that finding's rounds continuing; the child has one 3-round budget per finding, and the parent keeps no counter.
7. Reply with exactly one line: `PLAN WRITTEN <abs plan path>` or `OPEN QUESTIONS <abs plan path>`. No plan content, no summary.

Persona rules per `/skill:forge-skill`: whole-prompt body, narrow tools, no skill machinery (no `phase_tracker`, no `plan_tracker`, no `subagent`).

### Parent procedure (`## Author the plan`)

1. `phase_tracker({ action: "start", phase: "plan" })` (or skip when already `in_progress`, as today), then `phase_tracker({ action: "substep", phase: "plan", substep: "plan-write" })`.
2. Resolve the plan path per the existing spec->plan table, the overrides file path, and the two absolute skill paths.
3. Entry branch: when a plan file already exists at the path and the phase was restored by `/skill:gauntlet-resume`, skip to step 5 (the existing plan is checked before anything overwrites it). Otherwise dispatch, foreground:

   ```
   subagent({ agent: "plan-writer", context: "fresh", async: false, cwd: "<abs worktree path>",
     phase: "plan-write",
     acceptance: { level: "none", reason: "the parent plan_check owns acceptance" },
     task: <fixed template: worktree path, spec path, plan path, SKILL.md path, plan-contract.md path> })
   ```

   No `output:`, no `model:`. The task template is fixed with those five variables, plus the optional `Findings:` block in step 6. The `acceptance` line is required: without it pi-cohort appends a structured-report contract that the one-line reply would fail (`src/runs/shared/acceptance.ts:125-131` accepts `level: "none"` with a reason).
4. If the dispatch errors, returns an async handle, or the plan file is missing or empty afterwards: stop and report. There is no parent-authored fallback.
5. `plan_check({ planPath: "<abs plan path>" })` in the parent. This is the stamping call and runs unconditionally.
6. Branch on the pair (child reply, parent check):
   - `PLAN WRITTEN` + `PASS` -> step 7.
   - `OPEN QUESTIONS` + any result -> the existing Open-Questions halt: present the plan's `## Open Questions` section to the human before any `plan_tracker` init; after the answers, re-dispatch per step 3 with the answers as the `Findings:` block, then step 5.
   - `PLAN WRITTEN` + `FAIL` (the child's check and the parent's disagree, for example because the spec changed in between) -> re-dispatch per step 3 with the verbatim `FAIL (...)` output as the `Findings:` block, then step 5. The parent does this at most once for a given verbatim FAIL output; the same FAIL a second time is presented to the human as an open question (the FAIL lines, verbatim), exactly as an exhausted finding is today.
7. Clear the substep. Read the plan once. `phase_tracker({ action: "complete", phase: "plan" })`, `plan_tracker({ action: "init", ... })` from the `W<k>: <title>` list, select the mode from the wave structure, auto-invoke `/skill:subagent-driven-development` - unchanged from today's `## Execution Handoff`.

The parent never calls `write` or `edit` on the plan path; the `## Boundaries` bullet "Write the plan to the sibling `plans/` dir" becomes "Dispatch `plan-writer` to write the plan ...; the main loop never writes it". The parent holds no run id and never calls `resume` or `status`; every dispatch in this skill is `async: false`.

Deleted from `SKILL.md`: the `scout` dispatch and its `plan-recon` phase label, the `# CONTEXT DRAFT - NOT A PLAN` marker and its consumption/degradation/re-entry rules, and the Self-Review sentence "run the deterministic checker, then the judgment checks yourself - not a subagent dispatch" (the section keeps its checks; its framing becomes "the plan-writer runs these before replying"). Reworded in the retained sections: "When the recon report carries a `## Happy path` table" (`SKILL.md:77`) becomes "When the overrides file carries a `## Happy path` table"; "from the recon report / project overrides" (`:160`) becomes "from your recon / the overrides file"; "a pass writes the execution stamp that implement-start verifies mechanically" (`:264`) becomes "a pass in the child validates the plan; the parent's own `plan_check` writes the execution stamp".

### Re-planning and amendment

Re-entering `## Author the plan` fresh (no restored plan) with an existing plan at the path is a deliberate overwrite, as today's re-entry rule says.

`amendment-surface.md`'s plan-aftermath step keeps its phase stability (no `start`/`complete` of `plan`), its `plan_tracker` surgery (reopen anchor-changed tasks, `add` new ones, the status-carrying re-`init`), and its spec-plus-plan commit rule. Only the plan-text edit changes owner: the parent dispatches `plan-writer` per step 3 with an `Amend:` block naming the amended spec sections and the rule "preserve every task title and wave position the amendment does not touch; edit only affected anchors and tasks", then runs the stamping `plan_check` (step 5 and the step 6 branches), then reads the amended plan once (step 7's read, without its phase completion or `plan_tracker` init) so the tracker surgery acts on what the child wrote. The child's step 4 reads the existing plan first under an `Amend:` block as it does under `Findings:`.

### Telemetry

The dispatch carries `phase: "plan-write"`; the only consumer of the old `plan-recon` label is `SKILL.md` itself (`rg plan-recon` outside `doc/specs/` hits one line). `peak_context`, `compactions`, dispatch, and `plan_check` events are recorded by the existing hooks; the `plan-writer` persona accumulates under `personas.plan-writer`.

## Errors and edge cases

- The dispatch returns an async handle, errors, or the plan file is missing or empty on return: step 4, stop and report.
- The child replies `OPEN QUESTIONS` and the parent `plan_check` passes (the section is valid plan text): still the halt of step 6; `plan_tracker` init waits for the answers.
- The child replies `PLAN WRITTEN` and the parent check fails: step 6's one re-dispatch, then the human.
- `agentOverrides.plan-writer` unset: the child inherits the main-loop model, the same as `spec-summarizer`.
- `/skill:gauntlet-resume` lands at the plan stage with a plan file: the step 3 entry branch checks it first; a FAIL takes the step 6 re-dispatch, which overwrites the plan with a repaired one. No plan file: a normal dispatch.
- The child writes a file other than the plan: the persona forbids it; a stray file surfaces in `git status` at the finish gate as it would today.
- The findings block carries an `## Open Questions` section's answers rather than checker lines: the child treats each answer as the resolution of the matching open question, removes the section when every question is answered, and continues its loop.

## Tests

- `npm test` (`scripts/ci.mjs`): persona lint on `agents/plan-writer.md`, skill lint, model-literal lint, eval structural lint and hygiene scan on the new target, `pi.settings` ban. The skill path scan `rg -ni "jjuraszek|/Users/[^/]+" skills/` stays at zero matches.
- `eval/writing-plans/` (new, from `eval/_template`): `kind: text`, `skillFiles: skills/writing-plans/SKILL.md`. Two samples, each a `case.md` carrying an approved spec path and worktree path and judged on the narrated reply (the harness replays text targets with `--no-tools`, `eval/lib/replay.mjs:59`): sample 1, the success path - must-hold facts are that the reply names exactly one `plan-writer` dispatch with `context: "fresh"`, `async: false`, the `acceptance` line, and the spec, plan, and worktree paths in its task; names `plan_check` as the parent's own next step; names reading the finished plan once before `plan_tracker` init; and contains no plan body text and no scout dispatch. Sample 2, a parent `FAIL` after `PLAN WRITTEN` - must-hold facts are one re-dispatch carrying the verbatim findings, no parent `write`/`edit` of the plan, and the second identical FAIL going to the human. `node eval/run.mjs writing-plans` is run and `report.md` committed.
- Runtime evidence (AC4, AC5), on the fixture `doc/specs/2026-06-15-auto-proceed-spec-to-execution.md`: two scratch worktrees, one on `main` before this change and one on this branch, each running brainstorm-approval (restored via the fixture's existing spec) and the plan phase, discarded afterwards. From each run's telemetry YAML: baseline = `phases.brainstorm.peak_context`, valid only when `phases.brainstorm.compactions` is 0 or absent (a compaction would make the peak exceed the context at approval; rerun with a smaller brainstorm when it is not); bound = `phases.plan.peak_context <= baseline + 10000`, with the parent's finished-plan read inside that peak. Parent-only plan cost = `phases.plan.tokens` minus the sum over personas of (`personas.<p>.tokens` after the plan phase minus the same field in a copy of the YAML taken at approval); the record flushes continuously, so the copy is a `cp` at the gate. The pre/post pair is tabulated in the PR body and copied into `eval/writing-plans/report.md`. The post-change run's plan is then executed through implement-start to show the `waves` engine accepts the stamp and the `plan_tracker` init unchanged (AC4).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/personas.md` - roster row, knob-table column, and the persona count ("seven" -> eight) for `plan-writer` (operations / tunable parameters); `doc/configuration.md` - `agentOverrides.plan-writer` beside `spec-summarizer` under dispatch model precedence, and the `plan_check` paragraph's "findings are returned for the main loop to fix autonomously" (`doc/configuration.md:89`) retargeted to the child (operations / tunable parameters); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `README.md:81` persona count and roster list; `doc/install-internals.md:11-12` "seven agent files"; `AGENTS.md` routing is unchanged (persona and knob rows already route to `doc/personas.md`)

Materiality bar: `reference/documentation-impact.md`. Skill and persona bodies are implementation surface, not doc-impact entries.

## Out of scope

- Issue #68's `loop` engine; this spec touches only the `waves` plan phase.
- Any change under `extensions/` (telemetry schema, flow guards, `plan_check` grammar, an approval-context snapshot).
- Changing pi-cohort's builtin `planner` or shadowing its name; any use of pi-cohort `resume` or `status` from this skill.
- Splitting `writing-plans/SKILL.md` into a dispatcher skill and an authoring reference; the authoring sections stay where every citation points.

## Open questions

none
