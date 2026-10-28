# Amendment aftermath retry Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Feed attributable amendment-aftermath failures back into the same bounded batch while preserving first-time planning stops and protected files.

**Architecture:** Change only the owning aftermath procedure in amendment-surface section 5; reuse its amendment items, grant predicate, plan-writer dispatch, and batch commit. Extend the existing text-eval target with the section-5 slice and four synthetic samples. Keep model replays in parent verification, outside task test commands and planning Baseline.

**Tech Stack:** Markdown instructions, JSON eval configuration, Node.js node:test, existing text replay and judge harness.

**Spec:** `doc/specs/2026-10-28-amendment-aftermath-retry.md`

**Verification:** `node eval/run.mjs brainstorming --baseline-only && node eval/run.mjs brainstorming && npm test`

---

## Files

**Modify - instruction owner:**
- `skills/brainstorming/reference/amendment-surface.md` (section 5 aftermath and commit explanation only).

**Modify - eval assembly and evidence:**
- `eval/brainstorming/target.json`.
- `eval/brainstorming/intent.md`.
- `eval/brainstorming/report.md` (parent-generated full-target report).
- `eval/brainstorming/results/*/baseline.json` and `eval/brainstorming/results/*/candidate.json` (existing sample records; parent-generated only).

**Create - replay inputs and must-hold facts:**
- `eval/brainstorming/samples/aftermath-retry-grant/case.md`.
- `eval/brainstorming/samples/aftermath-retry-grant/expected.md`.
- `eval/brainstorming/samples/aftermath-retry-no-grant/case.md`.
- `eval/brainstorming/samples/aftermath-retry-no-grant/expected.md`.
- `eval/brainstorming/samples/aftermath-unchanged-command/case.md`.
- `eval/brainstorming/samples/aftermath-unchanged-command/expected.md`.
- `eval/brainstorming/samples/aftermath-budget-exhausted/case.md`.
- `eval/brainstorming/samples/aftermath-budget-exhausted/expected.md`.

**Create - parent-generated records:**
- `eval/brainstorming/results/aftermath-retry-grant/baseline.json`.
- `eval/brainstorming/results/aftermath-retry-grant/candidate.json`.
- `eval/brainstorming/results/aftermath-retry-no-grant/baseline.json`.
- `eval/brainstorming/results/aftermath-retry-no-grant/candidate.json`.
- `eval/brainstorming/results/aftermath-unchanged-command/baseline.json`.
- `eval/brainstorming/results/aftermath-unchanged-command/candidate.json`.
- `eval/brainstorming/results/aftermath-budget-exhausted/baseline.json`.
- `eval/brainstorming/results/aftermath-budget-exhausted/candidate.json`.

**Modify - release documentation:**
- `CHANGELOG.md` (new Unreleased entry).

**Delete:** none.

The generated-record globs cover existing sample directories found during recon; the eight new record paths are listed separately. No source, test, or contract code changes are required. Do not modify `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `agents/plan-writer.md`, the `plan_check` implementation, or the implementer's `SCOPED_TEST_COMMANDS` contract.

## Recon and verification ownership

- `skills/brainstorming/reference/amendment-surface.md:5-64` owns grant decoding and item preparation; `:66-139` owns prefilter, reviewer, and human batch; `:141-160` owns aftermath and commit. `skills/brainstorming/SKILL.md:183-193` calls that reference for amendments and owns redraw resets. Preserve those call sites.
- `scripts/brainstorming-contract.test.mjs:170-220` checks standing grants and aftermath preservation; `:400-445` checks ledger bypass, ordering, counts, and audit. Run a single file with `node --test scripts/brainstorming-contract.test.mjs`.
- `eval/lib/lint.test.mjs:77-80` calls `lintAll` on the checkout's actual eval tree; it does not test only synthetic fixtures, contrary to the spec's parenthetical at L86. Its scoped command checks the new samples without model calls or generated-record writes. `eval/lib/lint.mjs:9-61` checks target and sample structure; `scripts/ci.mjs:546-553` also invokes that real-tree lint.
- `eval/brainstorming/replay.md:1-7` defines narrated operations and continuation modes. `eval/brainstorming/samples/amendment-menu-render/case.md:1-26` supplies a synthetic report-runner precedent; its `expected.md:1-6` demonstrates fact-line grammar. Text replay cannot prove actual git restoration or tracker execution.
- `eval/run.mjs:154-224` reads config and intent, assembles each arm, and applies path-based bundle drops; `:335-374` writes records and the report; `:377-393` accepts one target and at most one sample. `eval/lib/replay.mjs:37-48` defines the assembly used for the intent hash.
- The full verification entrypoint bundles repository lint and deterministic tests through `scripts/ci.mjs`. There is no configured Markdown/JSON formatter or standalone scoped lint CLI in `package.json`. Use the existing structural test for fixtures and manual compact-table/ASCII/JSON-format review for task-local style. Repository instruction-size and model-literal lint run in the header gate; do not add formatter dependencies.
- There is no Happy path table in the overrides and no Deployment topology requiring a split. Keep one plan with a dependency chain and a trailing cross-cutting documentation wave.

### Parent verification procedure

The parent, not an implementer limited to scoped test commands, runs the header command set after Task 2 has bound intent to the candidate assembly. Run its first segment once before any candidate replay to seed the changed baseline assembly. Run its second and third segments after any wording iteration, producing full-target evidence and checking deterministic tests and repository style against it. Require successful arms and a full-target report, not a partial report or a baseline-only success.

For wording iteration before the final full-target run, use one optional partial command per invocation, outside task execution:

- `node eval/run.mjs brainstorming aftermath-retry-grant`
- `node eval/run.mjs brainstorming aftermath-retry-no-grant`
- `node eval/run.mjs brainstorming aftermath-unchanged-command`
- `node eval/run.mjs brainstorming aftermath-budget-exhausted`

Batch wording repairs before another iteration. Commit the generated full-target report and all changed baseline/candidate records with this change; never manufacture or hand-edit replay evidence. Preserve existing intent variance without widening it to silence a new regression. Keep replay failures visible at verification. Do not introduce a `Replays:` task contract or change replay bundling to reduce the approved full-target scope.

## Baseline provenance

Initial inventory at BASE `3a8fad8c`: `git status --porcelain --untracked-files=all` returned no entries. The only admitted paths for the initial planning pass were `doc/specs/2026-10-28-amendment-aftermath-retry.md` and `doc/plans/2026-10-28-amendment-aftermath-retry.md`. No parent In-flight paths were supplied in that pass. Task 1 executed 40 tests, all passing; Task 2 executed 14 tests, all passing. After each run HEAD remained `3a8fad8c`, and the sole status entry was the admitted untracked plan path. No source contamination or generated artifacts occurred. Model replay commands are header/parent verification work, not Baseline commands.

Amendment pass inventory at BASE `3a8fad8c`: ` M doc/specs/2026-10-28-amendment-aftermath-retry.md` and `?? doc/plans/2026-10-28-amendment-aftermath-retry.md`. Admit exactly those spec and plan paths, also the parent's supplied `In-flight:` set. Both unchanged task commands have valid prior evidence. `git diff --quiet 3a8fad8c HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 0. Retained 2 bullets: `3a8fad8c` -> `3a8fad8c`, tree-equivalent outside `doc/specs`, `doc/plans`. No command rerun is needed; the amendment changes task prose and anchors, not command text.

## Wave 1 - Amend the owning aftermath procedure

### Task 1: Feed attributable aftermath outcomes into the current batch

**TDD scenario:** Modifying tested instruction text - run existing preservation tests first; use the Task 2 model facts for new behavior at parent verification.

**Spec:** doc/specs/2026-10-28-amendment-aftermath-retry.md § "Acceptance criteria" L23-L24, § "Acceptance criteria" L25-L26, § "Acceptance criteria" L27-L28, § "Acceptance criteria" L29-L30, § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Acceptance criteria" L35-L36, § "Design" L42-L44, § "Design" L46-L46, § "Design" L47-L47, § "Design" L48-L48, § "Design" L49-L49, § "Design" L50-L50, § "Design" L51-L51, § "Design" L53-L53, § "Design" L57-L57, § "Design" L60-L60, § "Design" L66-L66, § "Errors and edge cases" L70-L70, § "Errors and edge cases" L71-L71, § "Errors and edge cases" L72-L72, § "Errors and edge cases" L73-L73, § "Errors and edge cases" L74-L74, § "Errors and edge cases" L75-L75, § "Tests" L85-L85, § "Tests" L87-L87, § "Tests" L88-L88, § "Out of scope" L100-L100, § "Out of scope" L101-L101

**Files:**
- Modify: `skills/brainstorming/reference/amendment-surface.md:141-160`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 3a8fad8c pass
- via: `skills/brainstorming/reference/amendment-surface.md` section 5 and existing standing-grant/ledger preservation assertions

- [ ] **Step 1: Establish preservation behavior.** Run the task test command before editing. Expected: existing grant, redraw, ledger, and route assertions pass. Read the entire amendment reference and `skills/forge-skill/SKILL.md` Authoring rules before changing the owner sentence; apply `/skill:forge-skill` to the touched instructions.

- [ ] **Step 2: Insert the classification and attribution rule.** Split the existing long aftermath paragraph only at the parent steps-5-6 return point, and insert the new instruction there before plan reading and tracker updates. Treat the second identical `plan_check` `FAIL` after `writing-plans`' first `Findings:` repair, and the first `fails on <sha>` or `dirtied tracked source` row, as eligible human-facing outcome kinds. Classify attributable outcomes as amendment items independently of candidate answers and grant state. Own-aftermath items remain in this batch until its commit; section 1's later-finding rule still applies after commit.

  Compare the quoted plan text in each FAIL line or the baseline command with batch edits. Use the owning task's `Spec:` anchor to an amended section or changed `Tests:` text against HEAD's plan as attribution evidence. Preserve the requirement that unchanged text and writer-only defects (including a missing `baseline:` line) with no spec text behind them are not attributable. Neither a plan line number, task membership, nor retained baseline evidence proves attribution. Partition mixed output: only attributable lines become the item; unrelated lines keep their original step-6 exits.

- [ ] **Step 3: Add all-or-nothing restore admission.** Check every path in a `dirtied tracked source` row for tracked membership and against the spec, plan, and `In-flight:` set before restoring any path. A new `??` at a declared `Create:`/`Test:` path is ineligible even though it appears in that row. Restore only an entirely eligible row, one quoted path per command. Use the spec's `git checkout --` operation and plain-jj `root:` fileset form, targeting the explicit worktree; `-R` alone does not root a jj path. Preserve all `artifacts:` and `In-flight:` paths. Stop on any nonzero restore exit, with the shell error; do not continue restoration or re-dispatch.

  Concrete syntax to instantiate in the generic skill recipe, not execute during authoring:

  ```sh
  git -C /tmp/report-worktree ls-files -- "eval/report-runner/report.md"
  git -C /tmp/report-worktree checkout -- "eval/report-runner/report.md"
  jj -R /tmp/report-worktree restore -- "root:\"eval/report-runner/report.md\""
  ```

  Decision: only the orchestrating aftermath owns this narrow restore, never plan-writer or implementer - the spec's protected-file boundary and the unchanged plan-writer prohibition settle ownership. Do not broaden this into a general test-damage grant.

- [ ] **Step 4: Route the retry item through existing grant handling.** Record verbatim `evidence`, the correction's `recommended` choice (`accept` or named `alt-n`), and its amended-section `location`. Re-read the spec grant through section 1. Amend permission applies the recommendation and prints the existing `amended the spec:` acknowledgment. Budget-only, `none`, and absent grants run sections 2-4 and end the turn without re-dispatching. A human reply applies only that item's chosen edit; redirect or drop returns to the original step-6 exit rather than replanning an unfixed spec. A malformed grant stops with its offending lines.

- [ ] **Step 5: Bound re-dispatch and keep aftermath finalization single-shot.** Allow at most two applied aftermath items in the batch. Route the third human-facing outcome, or repeated evidence from an already-applied item, to step 6 and list each retry item with its evidence. Re-dispatch with only an `Amend:` block: name the item's sections, quote the FAIL lines or baseline row in its rule sentence, and include spec and plan in `In-flight:`. Keep unaffected task titles and wave positions. Use the parent steps 5-6 again; only on `PASS` read the plan, update the tracker, and commit once. Do not run writing-plans step 7's phase completion or tracker initialization.

- [ ] **Step 6: Preserve bypass and redraw paths.** Keep no-plan and ledger branches before the retry path so they cannot produce aftermath findings. Preserve the bypass judged by the existing `loop-ledger-amend` sample. A redraw-class outcome is never an amendment item: commit the batch as it stands, hand dirty paths to step 6 without automatic restoration, then take the existing SKILL redraw path. Keep the original working-tree invariant except for batch edits; do not treat a spec-and-plan commit as cleanup.

- [ ] **Step 7: Extend the existing commit explanation by one clause.** State that aftermath items join the same audit body with `granted` or `accepted`/`alt-n` and their evidence. Preserve the one `amend:` commit and existing `git revert` behavior. Do not add another ledger, retry counter setting, persona instruction, or public contract.

- [ ] **Step 8: Check preservation and instruction style.** Re-run the task test command; expect success. Trace seed, unrelated output, mixed output, ineligible restore, redraw, no-plan, and ledger cases against the edited paragraph. The seed starts with `OPEN QUESTIONS` plus FAIL and uses `checkout --` on exactly the three eligible paths before retry. Review the touched lines for imperative voice, observable branches, ASCII punctuation, and compact tables; keep the new mechanism in section 5 without duplicating section 1's grant procedure. Keep the file below the instruction size limit. Observe on the diff that `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `agents/plan-writer.md`, `plan_check`, `SCOPED_TEST_COMMANDS`, and orchestrator model choice are unchanged. Parent verification's `npm test` guards skill/eval lint; it is not a task command.

- [ ] **Step 9: Commit the instruction change.** Stage only the task-owned reference and commit with subject `Retry attributable amendment aftermath failures` and body `Behavior change: amendment aftermath reuses the current batch; text replays accompany the change.`

## Wave 2 - Supply replay inputs and bind evidence

Depends on Wave 1: the candidate assembly and intent SHA include Task 1's final instruction text. The existing target owns a shared report and records; only parent verification runs model replays, serially by invocation.

### Task 2: Add the four aftermath samples and section-5 assembly

**TDD scenario:** New eval fixtures - create fixed inputs, observe missing expected-file failures, add must-hold facts, and run deterministic structure checks; parent verification owns behavioral red/green replays.

**Spec:** doc/specs/2026-10-28-amendment-aftermath-retry.md § "Acceptance criteria" L23-L24, § "Acceptance criteria" L25-L26, § "Acceptance criteria" L27-L28, § "Acceptance criteria" L29-L30, § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Acceptance criteria" L37-L38, § "Design" L47-L47, § "Design" L48-L48, § "Design" L49-L49, § "Design" L50-L50, § "Design" L53-L53, § "Design" L55-L55, § "Design" L57-L57, § "Design" L61-L61, § "Design" L62-L62, § "Design" L63-L63, § "Errors and edge cases" L75-L75, § "Tests" L79-L79, § "Tests" L80-L80, § "Tests" L81-L81, § "Tests" L82-L82, § "Tests" L83-L84, § "Tests" L86-L86, § "Tests" L87-L87, § "Out of scope" L99-L99

**Files:**
- Modify: `eval/brainstorming/target.json:2-13`
- Modify: `eval/brainstorming/intent.md:1-154`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/brainstorming/results/*/baseline.json`
- Modify: `eval/brainstorming/results/*/candidate.json`
- Create: `eval/brainstorming/samples/aftermath-retry-grant/case.md`
- Create: `eval/brainstorming/samples/aftermath-retry-grant/expected.md`
- Create: `eval/brainstorming/samples/aftermath-retry-no-grant/case.md`
- Create: `eval/brainstorming/samples/aftermath-retry-no-grant/expected.md`
- Create: `eval/brainstorming/samples/aftermath-unchanged-command/case.md`
- Create: `eval/brainstorming/samples/aftermath-unchanged-command/expected.md`
- Create: `eval/brainstorming/samples/aftermath-budget-exhausted/case.md`
- Create: `eval/brainstorming/samples/aftermath-budget-exhausted/expected.md`
- Create: `eval/brainstorming/results/aftermath-retry-grant/baseline.json`
- Create: `eval/brainstorming/results/aftermath-retry-grant/candidate.json`
- Create: `eval/brainstorming/results/aftermath-retry-no-grant/baseline.json`
- Create: `eval/brainstorming/results/aftermath-retry-no-grant/candidate.json`
- Create: `eval/brainstorming/results/aftermath-unchanged-command/baseline.json`
- Create: `eval/brainstorming/results/aftermath-unchanged-command/candidate.json`
- Create: `eval/brainstorming/results/aftermath-budget-exhausted/baseline.json`
- Create: `eval/brainstorming/results/aftermath-budget-exhausted/candidate.json`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 3a8fad8c pass
- via: `lintAll` real-tree sample validation; behavior is judged by `eval/run.mjs` during parent verification

- [ ] **Step 1: Add the assembly entry and fixed-input files.** Keep existing entries and add immediately after the section-4 slice:

  ```json
  { "path": "skills/brainstorming/reference/amendment-surface.md", "slice": "## 5. Apply, aftermath, commit", "sliceTo": "## Conformance entry" }
  ```

  Preserve `assembly: headed`, `wordCap: 1400`, and denylist values. Keep existing `bundle-` drops unchanged; a path drop removes both slices from `skillFiles`, as `eval/run.mjs:203-212` specifies. Create the four `case.md` files with the fixed observations described in steps 3-6, using `## Narrated read actions` and no live tools. Follow the synthetic report-runner precedent in the existing `amendment-menu-*` samples. Leave expected-file creation for the next steps.

- [ ] **Step 2: Observe structural red.** Run the task test command. Expected: the real-tree assertion fails because the four new samples lack `expected.md`. This is structure-only red, not evidence that a model followed the old aftermath rule.

- [ ] **Step 3: Complete the grant replay.** Supply a synthetic report-runner spec and plan, active amend grant, the changed Task 1 `Tests:` text and HEAD version, owning `Spec:` anchors and `Amend:` sections, second identical `plan_check` FAIL after `writing-plans`' first `Findings:` retry, and an `OPEN QUESTIONS` `dirtied tracked source` row naming three tracked eval files. Name those files as `eval/report-runner/report.md`, `eval/report-runner/results/audit/baseline.json`, and `eval/report-runner/results/audit/candidate.json`. Supply tracked-membership results and an `In-flight:` set containing `doc/specs/report-runner.md` and `doc/plans/report-runner.md`; put a separate untracked `artifacts:` path outside the row. Supply successful restoration and a subsequent `PASS` as observations for the narrated continuation, not claims of real execution.

  Write stable judged facts `restore`, `grant`, `dispatch`, `commit`, and `protected`. Require exactly the three quoted, worktree-targeted `git checkout --` operations before apply; one `amended the spec:` acknowledgment and no human question; an `Amend:`-only re-dispatch quoting evidence, with spec and plan in `In-flight:`; and one audit-bearing `amend:` commit after plan read/tracker update. Include explicit independent admission variants where the row adds a new `??` at a `Create:`/`Test:` path or one protected path: each takes step 6 with no partial restore. Assert untouched artifact and parent-owned paths and the plain-jj equivalent using `root:` rather than relying on `-R` to root paths. Give the prepared item its verbatim `evidence`, correction `recommended` as `accept` or named `alt-n`, and amended-section `location`. The audit records `granted` under amend permission and `accepted`/`alt-n` after a human choice; one `git revert` undoes the whole batch. Keep the output compact enough for the unchanged cap.

- [ ] **Step 4: Complete the no-grant replay.** Supply the same attributed finding and eligible tracked row but `Amend-grant: none`. Supply an amendment reviewer `escalate` outcome for the proposed fix as a fixed observation, rather than inventing a prefilter rule for verification commands. Add judged facts `menu` and `pause`: use the amendment numbered-item/letter-choice menu, not commit/discard/move, and end the turn without a plan-writer re-dispatch or commit before a reply. State the existing prefilter/reviewer routing for budget-only and absent values as independent grant-state variants, not new grant semantics.

- [ ] **Step 5: Complete unchanged-command replay.** Supply three independent outcome kinds with an unchanged command and plan text, an owner anchor outside the amended sections, and matching HEAD `Tests:`. Include retained baseline evidence to ensure it does not imply attribution. Add judged facts `fail`, `baseline`, and `dirty`: the repeated FAIL returns verbatim FAIL lines, `fails on <sha>` uses fix-first/narrow/amend, and `dirtied tracked source` uses commit/discard/move without restore. Add `writer` for a missing `baseline:` bullet with no supporting spec edit and `mixed` for an output containing both attributable and unrelated lines; only the attributable lines may enter the batch. Do not use task membership or plan line numbers as attribution authority.

- [ ] **Step 6: Complete budget-exhausted replay.** Write two independent labeled traces inside one `# Input`, under `## Narrated read actions`, following `eval/brainstorming/samples/loop-ledger-amend/case.md:6-10` (the `loop-ledger-amend/case.md` shape). Trace A supplies two applied aftermath items with distinct verbatim evidence, then a third human-facing outcome. Keep judged facts `stop` and `evidence`: take that outcome's existing step-6 exit, list both retry items and their evidence, and neither apply a third item nor re-dispatch. Trace B resets to one applied aftermath item and supplies a second outcome with exactly the same evidence; it is below the two-item limit so only the repeated-evidence rule can stop it. Add judged facts `repeat-stop` and `repeat-evidence`: take that outcome's step-6 exit, list the one applied item and its evidence, and neither apply another item nor re-dispatch. State explicitly that the traces do not share batch state.

  Decision: cover both stops in the prescribed `aftermath-budget-exhausted` sample, with no fifth sample - amended spec Tests L82 settles coverage; `eval/brainstorming/replay.md:1` supports independent narrated traces. Bind both new repeated-evidence facts in intent along with the existing third-outcome facts.

- [ ] **Step 7: Check structure and fixed-input hygiene.** Run the task test command; expected: every target and the four new samples pass. Review each expected line against `eval/_template`'s `judged:`/`mechanical:` grammar and unique fact IDs. Use synthetic paths and observations; include no private paths, credentials, or owner handles. Keep existing sample inputs and expectations unchanged, including the `loop-ledger-amend` bypass coverage.

  Decision: use this existing real-tree assertion rather than modify linter code or claim its fixture tests cover model behavior - `eval/lib/lint.test.mjs:77-80` proves actual target structure. Parent verification's `npm test` also runs `scripts/ci.mjs`'s real-tree `lintAll`. Replays remain outside task `Tests:` because the runner's target/sample CLI cannot satisfy the plan-contract file-token rule, as the approved spec requires.

- [ ] **Step 8: Bind intent to the final candidate assembly.** Update the Change paragraph for the new retry behavior, accepted whole-target assembly cost, four new samples, and tool-free evidence limitation. Replace only the stale claim that the assembly includes section 4 alone; preserve all unrelated intent history and accepted variance. Add expected moves for the new fact IDs without weakening facts to match observed failures. Compute the bundle-free SHA using the existing exports, and write the actual emitted value to `for:`:

  ```js
  import { readFileSync } from 'node:fs';
  import { assemble, treeReader } from './eval/lib/replay.mjs';
  import { sha256 } from './eval/lib/checks.mjs';
  const target = JSON.parse(readFileSync('eval/brainstorming/target.json', 'utf8'));
  console.log(sha256(assemble(target, treeReader(process.cwd()))));
  ```

  Execute this read-only snippet with Node's module input mode in the task worktree. Its hash uses no sample bundle additions or drops, matching `eval/run.mjs:192-196`. Rebind after any later instruction change. Generated report and record paths belong to this task's deliverables but are materialized only by the parent verification procedure, never by this snippet or a task test command. The added `skillFiles` slice changes `skillSha` on both arms. Parent verification owns `node eval/run.mjs brainstorming --baseline-only` before candidate replay and `node eval/run.mjs brainstorming` for the final full-target evidence, per `eval/README.md`; the four new samples are not the full validation scope. Keep the replay-carrier follow-up out of this change.

- [ ] **Step 9: Commit authored eval inputs.** Stage target, intent, and the eight sample files; commit with subject `Cover amendment aftermath retry outcomes` and body `Behavior change: four text replays judge amendment retry routing; parent verification produces full-target records.` Parent verification appends the generated evidence commit before finish, including all changed existing samples, not just the four additions.

## Wave 3 - Document the user-visible behavior

Depends on Waves 1-2: describe the implemented attribution and bounded-retry contract; keep cross-cutting documentation in this trailing doc-only wave.

### Task 3: Record the bounded aftermath retry in the changelog

**TDD scenario:** Trivial documentation change - inspect the completed instruction and eval changes.

**Spec:** doc/specs/2026-10-28-amendment-aftermath-retry.md § "Design" L64-L64, § "Documentation impact" L92-L92, § "Documentation impact" L93-L93

**Files:**
- Modify: `CHANGELOG.md:1-5`

**Tests:**
- none: release documentation; repository version and style validation belongs to parent verification

- [ ] **Step 1: Add the Unreleased entry.** Insert `## Unreleased` and a `### Changed` bullet above v7.37.0. Explain that attributable amendment-aftermath failures become at most two retry items in the same batch; the amend grant controls automatic apply, and unrelated failures, protected paths, and exhausted/repeated evidence keep their stops. Name the narrow tracked-path restore without implying a general implement-phase cleanup grant.

- [ ] **Step 2: Review documentation scope.** Preserve released entries and package version. Keep `README.md` and `doc/configuration.md` unchanged because their existing grant-level contract stays correct. Review ASCII punctuation, heading order, and one present-tense user-facing change statement; no Markdown formatter is configured.

- [ ] **Step 3: Commit the release note.** Stage only CHANGELOG.md and commit with subject `Document amendment aftermath retries`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L23-L24 | Amend-permitted attributable outcomes restore eligible paths and replan without a question | Task 1, Task 2 |
| § "Acceptance criteria" L25-L26 | No amend permission uses amendment review/menu and ends the turn | Task 1, Task 2 |
| § "Acceptance criteria" L27-L28 | Unchanged or writer-only failures keep step 6; mixed output is partitioned | Task 1, Task 2 |
| § "Acceptance criteria" L29-L30 | Third outcome and repeated applied evidence stop with the retry audit | Task 1, Task 2 |
| § "Acceptance criteria" L31-L32 | Exact tracked unprotected row paths only; preserve `artifacts:` and `In-flight:` | Task 1, Task 2 |
| § "Acceptance criteria" L33-L34 | One `amend:` commit records retry evidence and one revert undoes it | Task 1, Task 2 |
| § "Acceptance criteria" L35-L36 | Preserve writing-plans, plan-contract, plan-writer, and `plan_check` | Task 1 |
| § "Acceptance criteria" L37-L38 | Section-5 slice, four named samples, full-target replay and shipped records | Task 2 |
| § "Design" L42-L44 | Keep the behavior change in the owning section-5 aftermath point | Task 1 |
| § "Design" L46-L46 | Second identical FAIL follows the first Findings repair; baseline row kinds qualify immediately | Task 1 |
| § "Design" L46-L46 | Classify attributable findings independent of answers/grant; current-batch membership lasts to commit | Task 1 |
| § "Design" L47-L47 | Compare quoted FAIL text or command using amended-section anchors or changed HEAD `Tests:` | Task 1, Task 2 |
| § "Design" L47-L47 | Reject line-number, task-only, or retained-baseline attribution | Task 1, Task 2 |
| § "Design" L47-L47 | Unrelated and writer-only defects take step 6; partition mixed evidence | Task 1, Task 2 |
| § "Design" L48-L48 | Admit entire tracked row before any restore; exclude spec, plan, and parent-owned paths | Task 1, Task 2 |
| § "Design" L48-L48 | Quote each restore path and use the plain-jj `root:` fileset | Task 1, Task 2 |
| § "Design" L48-L48 | Preserve artifacts; restore invariant; nonzero restore stops | Task 1 |
| § "Design" L49-L49 | Hold verbatim evidence, recommended correction and amended location | Task 1 |
| § "Design" L49-L49 | Re-read grant; apply with acknowledgment or route through sections 2-4 and wait | Task 1, Task 2 |
| § "Design" L49-L49 | Reply applies only chosen edit; drop/redirect returns original step-6 exit | Task 1 |
| § "Design" L49-L49 | One `Amend:` block quotes evidence and carries spec/plan In-flight paths | Task 1, Task 2 |
| § "Design" L49-L49 | Parent rechecks; read/tracker/commit once on PASS; no step-7 phase completion | Task 1, Task 2 |
| § "Design" L50-L50 | At most two aftermath items; repeated evidence and third outcome stop with audit | Task 1, Task 2 |
| § "Design" L51-L51 | Ledger bypass remains inert | Task 1 |
| § "Design" L53-L53 | Audit aftermath items as granted/accepted/alt-n with evidence in same reversible commit | Task 1, Task 2 |
| § "Design" L55-L55 | Partial replays only for iteration, full target before finish, never task Tests | Task 2 |
| § "Design" L55-L55 | Accept expanded assembly replay cost, keep bundling and ship full-target evidence | Task 2 |
| § "Design" L57-L57 | No removal deliverables | Task 1, Task 2 |
| § "Design" L60-L60 | Add aftermath rule and commit-body clause to section 5 | Task 1 |
| § "Design" L61-L61 | Add slice from `## 5. Apply, aftermath, commit` to `## Conformance entry` | Task 2 |
| § "Design" L62-L62 | Add case/expected pairs for all four synthetic report-runner samples | Task 2 |
| § "Design" L63-L63 | Update intent `for:` and seed baseline arm before candidate replay | Task 2 |
| § "Design" L64-L64 | Add `## Unreleased` entry | Task 3 |
| § "Design" L66-L66 | Follow forge-skill imperative, minimal-diff authoring rules | Task 1 |
| § "Errors and edge cases" L70-L70 | Nonzero restore exits with shell error | Task 1 |
| § "Errors and edge cases" L71-L71 | Redraw commits batch, hands dirty paths to step 6, then takes redraw; no restore | Task 1 |
| § "Errors and edge cases" L72-L72 | Malformed grant stops and prints offending lines | Task 1 |
| § "Errors and edge cases" L73-L73 | No plan means no aftermath dispatch | Task 1 |
| § "Errors and edge cases" L74-L74 | Ledger means no checker outcome | Task 1 |
| § "Errors and edge cases" L75-L75 | Seed three-file restore, amendment re-dispatch, PASS and single commit without question | Task 1, Task 2 |
| § "Tests" L79-L79 | Grant-active replay judges restore, acknowledgment, dispatch, and no question | Task 2 |
| § "Tests" L80-L80 | No-grant replay judges amendment menu and turn-ending pause | Task 2 |
| § "Tests" L81-L81 | Unchanged-command expected facts distinguish all three step-6 exits | Task 2 |
| § "Tests" L82-L82 | Two independent labeled traces in one Input judge third-outcome and repeated-evidence stops with each trace's retry audit | Task 2 |
| § "Tests" L83-L84 | Grant facts cover protected/untracked admission and single commit audit | Task 2 |
| § "Tests" L85-L85 | Observe excluded contract files unchanged on diff | Task 1 |
| § "Tests" L86-L86 | Four samples satisfy real-tree eval structural lint | Task 2 |
| § "Tests" L87-L87 | Existing ledger sample continues to guard bypass | Task 1, Task 2 |
| § "Tests" L88-L88 | Shell error stop remains explicit without another model sample | Task 1 |
| § "Documentation impact" L92-L92 | Changelog records the changed aftermath procedure | Task 3 |
| § "Documentation impact" L93-L93 | Grant-level README and configuration descriptions remain valid | Task 3 |
| § "Out of scope" L99-L99 | No new carrier contract for replay commands outside `Tests:` | Task 2 |
| § "Out of scope" L100-L100 | No general restore grant beyond eligible `dirtied tracked source` rows | Task 1 |
| § "Out of scope" L101-L101 | Preserve writing-plans, checker, persona and `SCOPED_TEST_COMMANDS` contracts | Task 1 |
| § "Out of scope" L102-L102 | Orchestrator model selection | waived: explicitly out of scope; no model changes |
