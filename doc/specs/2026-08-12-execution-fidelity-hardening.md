# Execution Fidelity Hardening

**Goal:** Close three gaps where the execution pipeline improvises against (or violates) written skill contracts: plan-time recon is uncodified, the SR/CR review cadence is prose-only and was violated in practice, and test-scope wording drives full-CI runs per wave instead of once at verify.

**Evidence (session traces):**

- Plan-time scout improvised: a consumer repo session `2026-08-12T10-47-56` dispatched an unprescribed scout at plan start (L1967) with a main-loop-composed prompt. Useful behavior, but non-deterministic - nothing in `writing-plans` or consumer overrides mandates it.
- Review cadence violated: pi-condense session `2026-08-12T11-44-13` integrated a batch without spec-review or code-review; the user had to force remediation (user messages L524, L547, L561, L571). Existing SDD text (SKILL.md:151 "Both gates required before the wave commits", Red Flags :198-210) was defeated by prose alone.
- Full suite per wave: consumer-repo E-2770 session ran `mise x -- script/ci` + `make ci` during implement (implement started L360; verify never started); E-1686 sessions ran `script/ci` 3-4x with 35-minute timeouts. Implementer children ran scoped `bin/rspec spec/...` correctly throughout - the failure is orchestrator-level. Drivers: SDD:147 "Run the suite on the integrated tree" (unscoped), VBC's "FULL command" / "Partial proves nothing" wording, and `verify-before-ship` warning on every `git commit` while consumer overrides narrow recognised commands to full-CI entrypoints.

## Scope

Three changes in one release (minor):

1. **Codify plan-time recon** in `skills/writing-plans/SKILL.md` - a mandatory scout dispatch whose task derives from the written spec, not a main-loop-composed prompt.
2. **Harden review cadence** - minimal prose fixes in `skills/subagent-driven-development/SKILL.md` plus a presence-only advisory flow guard in `extensions/phase-tracker.ts`.
3. **Test-scope tiering** - scoped tests per wave (from plan-declared commands), full suite exactly once **within the verify phase** before conformance; wording fixes in SDD, `agents/implementer.md`, `skills/verification-before-completion/SKILL.md`; drop `git commit` from `extensions/verify-before-ship.ts`'s watched set.

**Out of scope:**

- Consumer-side `.pi/gauntlet-overrides.md` edits (a consumer repo's Verification-column clarification runs in a separate session; a prompt was handed to the user during brainstorming). The skill-side tiering is self-sufficient against sparse consumer tables.
- Mechanical CR-after-SR *ordering* enforcement (prose Red Flag only; guard checks presence, not order).
- A durable review-verdict data model (tracker fields, output-file ledgers). The guard observes dispatch completion only.
- `skills/test-driven-development/SKILL.md` changes. Its "all other tests still pass" GREEN language is implementer-child guidance; children already behave correctly.
- pi-cohort contract changes. All dispatch shapes used are existing ones.
- `skills/finishing-a-development-branch/SKILL.md`. Its Step-1 re-run of the project's canonical verification target at ship time is unchanged: the "run once" contract is scoped to the verify phase (it kills the per-wave repetition); one additional full run at the ship gate is accepted and stays out of scope.

## Change 1: Plan-time recon in writing-plans

### Design

A new mandatory **Recon** section in `skills/writing-plans/SKILL.md`, placed after the Scope Check and before File Structure. Structural mirror of `skills/brainstorming/gatherer.md`, with one deliberate difference: **no temp dir**. The scout writes directly to the plan path, which plan-writing later replaces - the same draft-at-final-path pattern brainstorming uses for the spec.

Dispatch (foreground, no announcement, no user interaction):

```
subagent({ agent: "scout", context: "fresh", cwd: "<abs worktree path>",
  phase: "plan-recon", output: "<abs plan path per the spec->plan filename table>",
  task: <fixed template below with the single variable filled> })
```

Fixed task template - exactly **one variable**, the absolute spec path. The main-loop model fills the path and nothing else:

> Recon for implementation planning. Read the approved spec at `<abs spec path>` - it is the single source of truth for what is being built. Also read the repo's `AGENTS.md` and, if present, `.pi/gauntlet-overrides.md` for conventions. Build an implementation map for the spec: exact file paths to create/modify/delete; existing call sites and tests with line ranges; conventions and patterns the plan must match; the project's test runner and the exact scoped-invocation form for running individual test files (derived from the repo's Makefile/bin/config and the overrides file); the style/lint and auto-format commands in both scoped per-file form and repo-wide form (same sources); separately, the full-suite verification entrypoint and whether it bundles style/format checks. Flag any spec claim that contradicts the code. Read-only recon: do not edit any file except writing your report to your output path. Start your report with the line `# CONTEXT DRAFT - NOT A PLAN - fully replaced at plan-writing` verbatim. End with an "Open questions that matter for the plan" section. Compact handoff, not a dump.

Consumption mirrors brainstorming's draft rules:

- The orchestrator `read`s the draft at the plan path before mapping files; the on-disk copy is canonical (prune-proof, restart-proof).
- The draft is a helper, not a fence - the orchestrator still verifies load-bearing claims against real code.
- Plan-writing is a **full-replacement `write`** at the same path, re-reading the draft in the same turn immediately before the overwrite.
- After the write, confirm line 1 is no longer the draft marker before self-review and handoff.
- Nothing extra is ever committed: the plan commit happens after replacement.

**Degradation (mirrors gatherer):** the scout failed when its task errored or the output file is missing or empty. Proceed to plan-writing from the orchestrator's own reads with a one-line note in the session; never block. If the file is absent, no marker check applies at the overwrite.

**Re-entry:** re-dispatching recon overwrites whatever the plan path holds - including a real prior plan, and it does so at **recon-dispatch time**, not at plan-write. Between recon and plan-writing the path holds a draft; a prior plan survives only in git history if it was committed. Re-planning is therefore a deliberate overwrite with a wider destruction window than today's plan-write-time replacement.

**Marker backstop:** the plan draft marker is protected by the prose checks only (line-1 check before handoff). The mechanical commit guard that blocks `NOT A SPEC` markers (`findMarkerFile`, scoped to `flowGuards.specDirs` during brainstorm) is **not** extended to the plan phase - a deliberate decision: the plan is an ephemeral worktree artifact stripped before landing (`finishing-a-development-branch`), so an accidentally committed draft never reaches `main`.

**Resume path:** the "Resuming with a spec in hand" flow runs recon identically, after its arming sequence.

The "structural mirror of `gatherer.md`" is presentational only (dispatch-then-consume shape, degradation posture); every load-bearing mechanic - dispatch shape, task template, consumption rules, degradation, re-entry - is fully stated above and does not require reading `gatherer.md`.

### Why the recon feeds the existing contract

`writing-plans` already mandates exact paths, line citations, and exact per-step test commands (No Placeholders; Task Structure). The recon supplies the two inputs previously guessed: real test-file paths for the code being touched, and the correct scoped-runner invocation form. The task->files->scoped-command binding is fixed at **plan-write time**; the executor derives nothing at wave-gate time.

Four additions to the plan contract, one sentence each in `writing-plans`:

- **Plan header records the full verification command set** (a `**Verification:**` line, value from the recon report / project overrides): tests + style + format. A single bundling entrypoint (`script/ci`, `make ci`) satisfies it alone; otherwise the discovered individual commands are listed. The verify phase reads it from the plan instead of re-deriving it.
- **Every code task carries a format-and-lint step**: a fixed task-template step before Commit - "Format & lint the task's files" with the exact scoped commands from recon. The TDD cycle in plans becomes red -> green -> fmt/lint -> commit. Doc-only tasks omit it unless the project formats Markdown.
- **Every code-touching wave declares at least one scoped test command.** A vacuous wave gate is legal only when every task's `Files:` block is documentation-only (the trailing doc-only wave writing-plans already defines). Added to the plan Self-Review checklist (wave-disjointness bullet's sibling), closing the "Trivial change - use judgment" loophole at the wave level.
- **The full verification entrypoint appears only in the plan header's `**Verification:**` line - never in any task or wave step.** Recon delivers that command for the header, and a plan-writing model could otherwise paste it into a task's test step, making an obedient implementer run full CI at task scope. Added as a plan Self-Review bullet; mechanically checkable (the command string is known from the header - grep the task body for it, expect zero hits).

## Change 2: Review-cadence hardening

### Cadence contract (confirmed, mostly existing)

- **SR per task**: one `spec-reviewer` per accepted patch (existing, SDD:145).
- **CR per wave**: one `code-reviewer` on the integrated wave diff, dispatched only after all of the wave's SR verdicts land (existing, SDD:148, :151).
- **NEW - doc-only exemption**: a wave whose tasks touch only documentation (the trailing doc-only wave already defined in `writing-plans`' Wave Grouping section - classification by the tasks' `Files:` blocks) gets SR per task; the wave CR gate does not apply (there is no code to review). One sentence added to the wave lifecycle, citing that convention.

### Prose edits (`skills/subagent-driven-development/SKILL.md`) - minimal by mandate

1. Reword the wave-commit precondition sentence (:151 area) to state the cadence as an explicit commit precondition including the doc-only exemption: a wave commit requires one SR verdict per accepted task, plus one CR verdict on the integrated diff for waves that touch code.
2. Two new Red Flags: dispatching `code-reviewer` before all of the wave's spec-review verdicts have landed (including fusing SR+CR into one parallel call); running the full verification entrypoint during the implement phase (scoped, plan-declared commands only - the full set belongs to verify).

No other prose additions. The no-unsanctioned-stop policy (:26-36) already covers mid-run stops; the guard below is its backstop.

### Advisory flow guard (`extensions/phase-tracker.ts`)

- **Observation:** phase-tracker already observes subagent results (it recognizes `conformance-reviewer` completions). Extend the ledger to record the most recent completed `implementer`, `spec-reviewer`, and `code-reviewer` dispatches, reconstructed on session replay like existing state.
- **Completed** = a subagent `results[]` entry with `exitCode === 0` (the file's existing `qualifiesAsClosureDispatch` convention). A reviewer agent with no completed dispatch in the session counts as never observed - i.e. stale - so the guard fires on the zero-reviews incident shape.
- **Trigger:** during an entered flow's implement phase, on a parent-session `git commit`, if an `implementer` dispatch completed more recently than **both** the last completed `spec-reviewer` **and** the last completed `code-reviewer` dispatch, inject one advisory line into the tool result (AND-logic, so a compliant doc-only wave - fresh SR, no CR - stays silent; the zero-review incident, where neither existed, still fires):

  > Reminder: no spec-reviewer [and/or code-reviewer] observed since the last implementer. SR is required per task; CR per wave for code waves (doc-only waves are SR-only).

- **Presence-only:** completion of a dispatch, not its verdict. CR-after-SR ordering is not checked.
- **Advisory, never blocks.** Honors the existing `piGauntlet.flowGuards.enforce` toggle; silent when off. **No new settings key.**
- **Known blind spots (accepted):** implementer children commit inside their own sessions - invisible to the guard, and correctly so (parent integration/fix commits are the target surface). Manual user hotfix commits mid-implement will trip the reminder - acceptable for one advisory line. SR+CR fusion passes the guard (prose-only concern). A code wave with fresh SR but no CR is indistinguishable from a compliant doc-only wave under AND-logic - the guard cannot classify waves; the prose commit precondition owns that half (prose-only concern).

## Change 3: Test-scope tiering

### The tiering

| Tier | What runs | When | Who defines it |
|---|---|---|---|
| Task (TDD) | The task's declared test commands, then its scoped format/lint step (red -> green -> fmt/lint -> commit) | Inside each implementer child | Plan task steps |
| Wave gate | Union of the wave's tasks' declared test commands (tests only - formatting already ran inside each task, and wave-level re-formatting would touch other tasks' files) | After integration, before wave CR/commit | Plan (fixed at plan-write time from recon) |
| Verify | The plan header's full verification set - tests + style + format (one bundling entrypoint, or the listed individual commands) - run once within the verify phase | Verify phase, after the whole-diff code review, **before the conformance dispatch**; re-run after conformance fix rounds before re-dispatching the gate | Plan header's `**Verification:**` line (sourced from recon / project overrides' Verification entry) |

A vacuous wave gate is legal **only** for a doc-only wave (every task's `Files:` block documentation-only); every code-touching wave declares at least one scoped test command (plan Self-Review enforces this).

**Hard tier boundary: the execution phase never runs the full verification set.** No full test suite, no repo-wide style/format check, at any task or wave gate - scoped commands only. The full set runs **exactly once**, as the sanity check at verify before the conformance dispatch (re-run only after conformance fix rounds). Change 2's second Red Flag enforces the wording ("About to run the full verification entrypoint during the implement phase") - the same flag, not an additional one. The ship-time re-run in `finishing-a-development-branch` is out of scope and unchanged.

### Edits

- **`skills/subagent-driven-development/SKILL.md`**: reword the wave test-gate sentence (:147) to "run the union of the wave's tasks' declared test commands on the integrated tree - the full suite is the verify phase's job, run once", **and** the stale step-3 parenthetical at :145 ("the wave test gate in step 5 runs the suite") in the same pass. In After All Tasks, **insert** a full-verification step between the whole-diff CR and the conformance dispatch (today CR goes straight to conformance): the full verification set - tests + style + format, read from the plan header's `**Verification:**` line - run once, green, before dispatching `conformance-reviewer`.
- **`agents/implementer.md`**: reword line 19's REFACTOR step from "Run the full relevant test suite" to running the tests the task declares (its `Test:` files and stated commands).
- **`skills/verification-before-completion/SKILL.md`** (~5 lines net): add an evidence-proportionality sentence at the Gate Function's IDENTIFY step - a task/wave claim is proven by the commands the plan declares for it (a scoped run is *complete* evidence for a scoped claim); phase-completion and ship claims require the project's full verification entrypoint, run once at verify before conformance. Gloss the RUN step's "Execute the FULL command" as *the full command for the claim identified in step 1* (scoped claim -> scoped command) - the bare "FULL" is a named driver of the per-wave-full-suite behavior and must not survive unqualified. Adjust the "Partial check is enough" rationalization row so "partial" means *running less than the claim requires*, not *running a scoped command*. Update the Enforcement section's watched-command list (commit dropped, see below).
- **`extensions/verify-before-ship.ts`**: remove `git commit` from the watched command set; keep `git push` and `gh pr create`. Rationale: local wave commits are not ship events, and warning on them - combined with consumer overrides that narrow recognised commands to full-CI entrypoints - mechanically trains per-wave full-suite runs. The review-cadence guard (Change 2) takes over commit-time advisories. This is a behavior change; every doc stating the watched set updates in the same commit: the extension's own header comment (:4-5), `README.md`, `doc/configuration.md:70`, `skills/writing-skills/SKILL.md` (:186 enumerates the watched set; :69 references the extension - check both, only :186 states commands), and `skills/verification-before-completion/SKILL.md`'s Enforcement section (:155), plus the CHANGELOG note.

## Components summary

| Component | Change |
|---|---|
| `skills/writing-plans/SKILL.md` | New Recon section (~25 lines: dispatch shape, fixed template incl. style/fmt discovery, draft-at-plan-path mechanics, degradation); one sentence in "Resuming with a spec in hand"; overwrite/marker safeguards in the plan-writing step; plan-header `**Verification:**` set (test+style+fmt); fixed format-and-lint task step; code-wave-declares-tests rule + header-only-entrypoint rule, each with a Self-Review bullet |
| `skills/subagent-driven-development/SKILL.md` | Reword wave test-gate sentence; commit-precondition sentence with doc-only exemption; two Red Flags (SR+CR fusion; full verification during implement); one verify-ordering sentence |
| `agents/implementer.md` | Reword REFACTOR test-suite line to task-declared tests |
| `skills/verification-before-completion/SKILL.md` | Evidence-proportionality sentence at IDENTIFY; RUN-step "FULL command" gloss; "Partial" row adjustment; Enforcement watched-set update |
| `extensions/phase-tracker.ts` | New presence-only advisory flow guard (implement-phase commit vs implementer/SR/CR ledger); rides `flowGuards.enforce` |
| `extensions/verify-before-ship.ts` | Watched set: drop `git commit`, keep `git push` + `gh pr create`; header comment updated |
| `extensions/verify-before-ship.test.ts` | **New** test file: commit is silent, push/PR still warn (before and after a recognised passing run) |
| `scripts/ci.mjs` | Register the new test file in the explicit test list |
| `doc/configuration.md` | Watched-set claim updated (:70) |
| `skills/writing-skills/SKILL.md` | Watched-set claim updated (:186; :69 checked, reference-only) |
| `README.md` | Flow-guard row for the review-cadence reminder; verify-before-ship watched-set change |
| `CHANGELOG.md` | Minor release entry with the verify-before-ship behavior-change note |

No new settings keys, no new agents, no pi-cohort contract changes. Semver: **minor**.

## Error handling and edge cases

- **Scout failure at plan recon** -> degrade (proceed from own reads, one-line note); never blocks.
- **Guard false positives** (manual hotfix commits, recovery flows) -> accepted; one advisory line, never a block.
- **Guard blind spot** (child-session commits) -> intended; parent-session integration commits are the target.
- **Wave with zero declared test commands** -> legal only when doc-only (all `Files:` documentation); otherwise a plan Self-Review failure caught before handoff.
- **Consumer overrides listing only full-CI commands** -> tiering language defines the Verification entry as verify-phase-only, so a sparse table no longer causes per-wave CI.
- **Conformance fix rounds** -> full suite re-runs after fixes land, before re-dispatching the gate (the fix loop's per-round `code-reviewer` in `conformance-check.md` is unchanged).
- **Session replay** -> the guard's dispatch ledger reconstructs from the session like existing phase-tracker state.

## Testing approach

- `npm test` (`scripts/ci.mjs`) validates repo structure and version/CHANGELOG pairing.
- Guard logic: unit coverage in the existing `extensions/phase-tracker.test.ts` / `extensions/lib/phase-tracker-helpers.test.ts` pattern - ledger updates on observed dispatch results, warning emission on implement-phase commit with stale SR/CR, silence when `flowGuards.enforce` is off, silence outside implement, replay reconstruction.
- `verify-before-ship.ts`: **new** `extensions/verify-before-ship.test.ts` (none exists today - `scripts/ci.mjs`'s explicit list has no entry for it), registered in `scripts/ci.mjs`: commit no longer warns; push/PR warn until a recognised command passes, then clear.
- Skill/agent prose: the repo's shipped grep, run as `rg -ni "<your-company>|jjuraszek|/Users/[^/]+|<your-org-name>|<consumer>" skills/` (per AGENTS.md; expected zero matches), plus the placeholder scan terms (`TODO|TBD|xxx|fill in`).

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (review-cadence guard row; verify-before-ship watched-set change), `doc/configuration.md` (watched-set claim), `CHANGELOG.md` (minor entry with behavior-change note)
- Derived / memory docs invalidated: `AGENTS.md` extensions table if it describes verify-before-ship's watched commands (verify at implementation; update in the same commit if so); `skills/writing-skills/SKILL.md` watched-set mentions (:69, :186) - implementation surface here, updated as components above
