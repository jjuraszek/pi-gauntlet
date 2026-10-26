# Selective baseline rerun on amend Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Retain unchanged baseline results across planning-only commits after proving endpoint tree equivalence outside the flow's spec and plan directories.

**Architecture:** Keep the decision in the writer's Baseline procedure and align the persona's body and shell allowance with it. Preserve the checker and baseline grammar; exercise the behavioral change through the existing text eval target and run the unchanged checker regression tests.

**Tech Stack:** Markdown instructions, Node.js built-in test runner, existing pi text-eval harness, Git and plain jj provenance commands.

**Spec:** `doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md`

**Verification:** `npm test`

---

## Files

**Modify - writer instructions:**
- `skills/writing-plans/SKILL.md` - Baseline introduction, step 2, and step 3's rerun reasons.
- `agents/plan-writer.md` - procedure step 5 and shell-scope sentence only.

**Create - text eval:**
- `eval/writing-plans/samples/baseline-equivalent-restamp/case.md`
- `eval/writing-plans/samples/baseline-equivalent-restamp/expected.md`
- `eval/writing-plans/results/baseline-equivalent-restamp/baseline.json` - generated evidence.
- `eval/writing-plans/results/baseline-equivalent-restamp/candidate.json` - generated evidence.

**Modify - target-local eval documentation and evidence:**
- `eval/writing-plans/samples/fresh-child-authors-plan/case.md` - extend only the narration endpoint to match the existing immediate-handoff fact.
- `eval/writing-plans/samples/pr-subject-threads/expected.md` - clarify only header-style-only command segmentation without weakening the fact.
- `eval/writing-plans/intent.md`
- `eval/writing-plans/report.md`
- `eval/writing-plans/results/*/baseline.json` and `eval/writing-plans/results/*/candidate.json` - existing generated records changed by target-wide replay; sample membership determines the changed subset. This includes both arms for fresh-child-authors-plan and judgment recovery in pr-subject-threads/candidate.json.

**Delete:** None.

The predecessor banner already exists verbatim at `doc/specs/2026-10-19-gh-72-settle-facts-before-implement.md:3`; preserve it and the predecessor body. No new hub documentation is required. The spec defers CHANGELOG.md to release.

## Recon and verification conventions

- `skills/writing-plans/SKILL.md:280-304` owns Baseline; `agents/plan-writer.md:35,41` repeats retention and limits shell operations. Apply `/skill:forge-skill` authoring and persona rules to changed lines: imperative voice, two observable branches, minimal diff, byte-identical persona frontmatter. The skill is 352 lines, below the 500-line extraction threshold.
- `extensions/lib/plan-check.ts:562-609` checks baseline forms and uniform SHAs without a VCS port. `extensions/lib/plan-check.test.ts:1114-1175` already tests passing forms, artifact suffixes, skips, derived runs, and mixed-SHA rejection. Run this file directly with Node's test runner; leave source and tests unchanged.
- `skills/subagent-driven-development/SKILL.md:46` and `skills/subagent-driven-development/implementer-prompt.md:21-23` forward baseline metadata as contract text, not commands. No consumer change is required.
- `eval/writing-plans/target.json:1-28` includes Self-Review and the plan contract, not the persona. `eval/writing-plans/replay.md:1-3` treats supplied observations as evidence in child mode. `eval/writing-plans/samples/baseline-artifact-rerun/case.md:1-9` is the neighboring two-scenario pattern; its expected facts distinguish retained evidence from forced reruns.
- `eval/README.md:5-16,45-55,127-148` documents sample-scoped replay, target-wide replay, generated records, and the candidate assembly hash on the intent's first line. The eval CLI accepts target and sample names, not test-file paths; use it as explicit implementation validation, not as a fabricated file-addressable baseline command.
- `eval/writing-plans/samples/fresh-child-authors-plan/case.md:15` stops narration at tracker init, while `expected.md:6` requires immediate SDD invocation. Keep that fact and override the generic endpoint in `eval/writing-plans/replay.md:3` only in this case. `eval/writing-plans/samples/pr-subject-threads/expected.md:4` owns header-style-only; `extensions/lib/plan-check.ts:476-490` splits compound commands. `eval/README.md:17-35` documents single-sample judgment refresh and its reusable-reply prerequisite; `eval/run.mjs:163-223` separates expected facts from replay input hashing.
- The header command invokes `scripts/ci.mjs`; it bundles instruction/frontmatter lint, instruction-size lint, model-literal lint, eval structure/hygiene, deterministic tests, and package checks. No repository Markdown formatter or standalone format command is configured in `package.json` or the overrides. Scoped instruction checks can call the existing lint functions shown in the task. Compact Markdown tables and ASCII punctuation are manual checks. The overrides have no Happy path table.

## Baseline provenance

BASE: `a603cdad`. Initial per-file inventory: ` M doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md`. Admitted exactly that approved spec path, also named by the parent's `In-flight:` block; the plan had no status entry. No other tracked or untracked paths were present. Reran Task 1's unchanged scoped command because the saved evidence was on `c2ab1c70`: exit 0, 143 tests, 143 passed, 0 failed. Post-run BASE and per-file inventory were identical; no artifacts or contamination occurred. This is execution evidence, not tree-equivalence retention.

## Wave 1 - Writer retention and replay evidence

### Task 1: Prove planning-tree equivalence before retaining baseline evidence

**TDD scenario:** Modifying tested instructions - run the existing checker regression file first, seed the new behavioral replay before changing instructions, then compare candidate output against the must-hold facts.

**Spec:** doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md § "Acceptance criteria" L25, § "Acceptance criteria" L27, § "Acceptance criteria" L29, § "Acceptance criteria" L31, § "Acceptance criteria" L33, § "Acceptance criteria" L35, § "Design" L40, § "Design" L44, § "Design" L50, § "Design" L56, § "Design" L58, § "Design" L62, § "Design" L63, § "Design" L67, § "Design" L71, § "Design" L75, § "Design" L79, § "Design" L80, § "Design" L81, § "Design" L82, § "Design" L83, § "Errors and edge cases" L91, § "Errors and edge cases" L92, § "Errors and edge cases" L93, § "Errors and edge cases" L94, § "Errors and edge cases" L95, § "Errors and edge cases" L96, § "Errors and edge cases" L97, § "Errors and edge cases" L98, § "Tests" L102, § "Tests" L104, § "Tests" L106, § "Tests" L107, § "Tests" L109, § "Tests" L111, § "Documentation impact" L115, § "Documentation impact" L118, § "Out of scope" L122, § "Out of scope" L123, § "Out of scope" L124, § "Out of scope" L125, § "Out of scope" L126, § "Out of scope" L127

**Files:**
- Modify: `skills/writing-plans/SKILL.md:280-293`
- Modify: `agents/plan-writer.md:35-41`
- Create: `eval/writing-plans/samples/baseline-equivalent-restamp/case.md`
- Create: `eval/writing-plans/samples/baseline-equivalent-restamp/expected.md`
- Modify: `eval/writing-plans/samples/fresh-child-authors-plan/case.md:15`
- Modify: `eval/writing-plans/samples/pr-subject-threads/expected.md:4`
- Modify: `eval/writing-plans/intent.md`
- Modify: `eval/writing-plans/report.md`
- Modify: `eval/writing-plans/results/*/baseline.json`
- Modify: `eval/writing-plans/results/*/candidate.json`
- Create: `eval/writing-plans/results/baseline-equivalent-restamp/baseline.json`
- Create: `eval/writing-plans/results/baseline-equivalent-restamp/candidate.json`
- Test: `extensions/lib/plan-check.test.ts`

**Tests:**
- `node --test extensions/lib/plan-check.test.ts`
- baseline: a603cdad pass
- via: `checkPlan` through the existing baseline-line fixtures; the `plan_check` contract remains unchanged.

Decision: Keep the predecessor banner without adding a duplicate - the exact successor banner is already present at `doc/specs/2026-10-19-gh-72-settle-facts-before-implement.md:3`, satisfying the spec's supersession requirement before implementation.

Decision: Use the existing `kind: text` target without widening its bundle - `eval/writing-plans/target.json` includes the changed Self-Review slice but does not load `agents/plan-writer.md`. The eval judges supplied observations, not real checkout operations or persona shell admission; review the persona allowance directly.

Decision: Repair the two sample contracts, not production handoff or header behavior - fresh-child-authors-plan/expected.md:6 already requires direct invocation, and `extensions/lib/plan-check.ts:476-490` extracts the same lint/format commands from an `&&`-joined header. Refresh judgments only on reusable replies per `eval/README.md:17-35`; a changed case needs new replay input on both arms.

- [ ] **Step 1: Confirm the unchanged checker contract**

  Run: `node --test extensions/lib/plan-check.test.ts`

  Expected: exit 0 with nonzero passing tests, including rejection of mixed SHAs. Do not add a git port, relax `baseline SHAs differ`, or change the baseline regex.

- [ ] **Step 2: Write the two-scenario replay input**

  Create `eval/writing-plans/samples/baseline-equivalent-restamp/case.md`, beginning with `Role: plan-writer` and no `bundle-` lines. Follow `baseline-artifact-rerun`, using synthetic worktree `/work/app`, spec `/work/app/doc/specs/hook.md`, and plan `/work/app/doc/plans/hook.md`. State that each scenario is independent and requires its own written plan and final reply; the second starts from the original saved plan, not the first scenario's output.

  Give the saved plan one existing task modifying `src/hook.ts` and `tests/hook.test.ts`, with command `node --test tests/hook.test.ts` and `- baseline: abc1234 pass`. Supply a matching synthetic spec requirement and file-existence observations. The `Amend:` changes that task's steps to name an existing validation helper but leaves its command unchanged, and adds a second task modifying existing `src/other.ts` and `tests/other.test.ts` with command `node --test tests/other.test.ts`. Both test files exist at the base; the added task has no evidence yet.

  Supply HEAD `def5678` after a `plan:` commit and an `amend:` commit, initial status containing only the admitted spec path, and `In-flight:` listing that path only. In scenario 1 the endpoint diff exits 0 and the added command exits 0 with `tests 1, pass 1, fail 0`; all post-run statuses and HEAD remain unchanged. In scenario 2 the diff exits 1 because a `src/` path changed, and both commands are observed to pass on `def5678` with that same nonzero-test summary. State that all other checks pass. Treat these as observations, not instructions to execute tools.

- [ ] **Step 3: Define scenario-scoped facts and seed the baseline**

  Create `expected.md` in the new sample directory with these judged facts, each prefixed by its stable id:

  - `restamp`: In scenario 1, retain the existing unchanged command's evidence without rerunning it and rewrite its bullet to def5678 even though the task's steps changed.
  - `provenance`: In scenario 1, append `retained 1 bullets: abc1234 -> def5678, tree-equivalent outside doc/specs, doc/plans` to the baseline provenance note, not to a task or a new audit field.
  - `fresh-evidence`: In scenario 1, run the added task's command using the supplied observation and give it fresh passing evidence at def5678.
  - `one-sha`: In scenario 1, every written baseline bullet uses def5678 and the plan ends with PLAN WRITTEN.
  - `rerun-all`: In scenario 2, rerun both commands and write their passing evidence at def5678.
  - `no-retained`: In scenario 2, write no retained-provenance line and do not report failed equivalence as an Open Questions finding.

  Use judged checks for scenario-local absence so the first scenario's provenance cannot falsely fail the second. Run: `node eval/run.mjs writing-plans baseline-equivalent-restamp --baseline-only`. Expected: baseline records are generated; inspect their outputs for the old same-base-only behavior. This is observed behavioral red evidence, not an assumed deterministic failure.

- [ ] **Step 4: Replace the Baseline retention decision**

  Edit the step-2 opening in `skills/writing-plans/SKILL.md`, not the surrounding workflow. Apply to both `Findings:` and `Amend:`. Before running any command, use the step-1 BASE and prove equivalence once per distinct recorded SHA. Use the spec's Git and jj command templates:

  ```text
  git -C "<abs worktree path>" diff --quiet <recorded> <BASE> -- . ':!<spec dir>/' ':!<plan dir>/'
  jj -R "<abs worktree path>" diff --from <recorded> --to <BASE> --summary
  ```

  Derive the worktree-relative spec and plan directories from the dispatched paths. Keep the trailing `/` directory boundary in each git exclusion. For Git, only exit 0 proves equivalence. For plain jj, require exit 0 and empty stdout after dropping summary entries whose paths all lie under the spec or plan directory. Reject an entry that does not parse as `<status> <path>`; do not include stderr in the filtered evidence. No `gauntlet_setting` call is needed.

  Keep two branches: every proof holds and every admitted in-flight path lies within those directories -> retain valid unchanged-command evidence and rewrite its SHA to BASE; any proof fails -> rerun every command and retain nothing. Missing/unresolvable SHAs, git or jj errors, nonempty outside-directory diffs, and admitted doc-only in-flight paths outside the directories fail the proof. Compare endpoint trees, not history: a source change exactly reverted by BASE is equivalent. Prove all recorded SHAs before rewriting any bullet; partial retention is forbidden.

  Preserve step 1's source in-flight block (`in-flight source edits`): no command runs when that block applies. Keep step 3's post-command HEAD/status contamination checks and do not re-evaluate equivalence mid-run. `Findings: rerun baseline` overrides retention and re-stamps nothing.

- [ ] **Step 5: Preserve evidence forms and repair dependent wording**

  Add the table row for changed command text or missing/invalid evidence: rerun regardless of equivalence through the existing command-anchor/selector procedure. Retain `skipped`, `pass via`, and ` - artifacts:` forms when keeping valid evidence. Task-step-only changes do not invalidate an unchanged command.

  Append `retained <n> bullets: <recorded> -> <BASE>, tree-equivalent outside <spec dir>, <plan dir>` once per distinct recorded SHA re-stamped to the existing step-1 provenance note. That note, already commonly a `## Baseline provenance` block, is the sole record; add no section or commit-body audit field. Emit no `retained` line on proof failure and no new Open Questions row form for it.

  Change the Baseline introduction to permit evidence from execution or a recorded tree-equivalence. In step 3's rerun reasons replace different base with failed equivalence proof, preserving artifact merging and contamination handling. Keep all other baseline mechanics unchanged. The accepted blind spot remains: tests reading spec or plan directories do not trigger reruns; do not broaden exclusions or add machinery to inspect test dependencies.

- [ ] **Step 6: Align the persona body and inspect the unchanged boundaries**

  In `agents/plan-writer.md` procedure step 5, retain evidence for unchanged commands whose recorded SHA is BASE or proven tree-equivalent per the skill's Baseline step 2. Rerun missing, invalid, or changed-command evidence, all commands on any proof failure, and all commands for the explicit override. Permit rewriting SHAs only after execution or recorded tree-equivalence. Leave step 6's phrase `only by Baseline execution` intact: a re-stamp is a Baseline outcome.

  Add `git diff --quiet` and the jj `diff --from/--to --summary` form to the shell-scope sentence at line 41, alongside the existing `git rev-parse` and `git status --porcelain` allowance, spelling out the actual jj command form consistently with step 2. Keep frontmatter byte-identical, including all tools and completion guard settings. Apply the existing mutation prohibitions without expanding permissions beyond provenance.

  Preserve these boundaries: `extensions/lib/plan-check.ts:607` and its tests; `skills/writing-plans/reference/plan-contract.md:30` and `plan-contract.md` grammar; `skills/brainstorming/reference/amendment-surface.md` section 5; `skills/gauntlet-resume/reference/brief-contract.md:170-186` forced rerun after rebase/merge; `doc/configuration.md:177`. Keep flow commit timing unchanged. Never exclude `AGENTS.md`, `CHANGELOG.md`, `README.md`, or other docs outside the spec and plan directories.

  Confirm the predecessor still carries exactly this banner, without editing its body:

  ```markdown
  > **Superseded by:** [doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md](./2026-10-26-selective-baseline-rerun-on-amend.md) - D2 "same base" retention condition (retain rule, rows 157/171, dependent execution-only statements) only
  ```

  This meets `reference/superseding.md` without duplicating an existing mark. Leave `doc/implement-engines.md` unchanged: the scout's `Docs touched:` candidate states no retention rule, so `reference/documentation-impact.md` provides no material documentation obligation there. Feature and derived docs are none, and CHANGELOG.md remains deferred to release.

- [ ] **Step 7: Describe the intended behavior in target-local documentation**

  Append a paragraph to `eval/writing-plans/intent.md` under Change describing all-or-nothing endpoint equivalence, unchanged-command retention, the forced-rerun override, and the two supplied-observation scenarios. Preserve unrelated intent. Add `## Expected to move` entries for `baseline-equivalent-restamp/restamp` and `baseline-equivalent-restamp/provenance`, both fails -> holds, explaining retention across planning-only commits. Keep the remaining new facts as invariants; do not add moves merely to silence regressions.

  Update the first `for:` line to the current candidate assembly hash using the existing runner's mismatch diagnostic. The hash identifies assembled instructions, not Git HEAD. Do not change `target.json`, `replay.md`, slices, or word cap; the sample stays within the existing replay contract and does not pretend to test persona admission.

- [ ] **Step 8: Run the behavioral candidate and checker regression**

  Run: `node eval/run.mjs writing-plans baseline-equivalent-restamp`

  Expected: exit 0, new candidate facts hold, and output reports improved or unchanged. Inspect `results/baseline-equivalent-restamp/candidate.json` for both scenarios rather than inferring success from a report label. Resolve genuine regressions within the approved rule; do not broaden intended variance. A stale-intent refusal supplies the assembly hash for Step 7 and requires a corrected intent before this comparison can run.

  Run: `node --test extensions/lib/plan-check.test.ts`

  Expected: exit 0 and the uniform-SHA rejection contract remains green without modifying checker files.

- [ ] **Step 9: Repair the two eval-contract ambiguities**

  In `eval/writing-plans/samples/fresh-child-authors-plan/case.md`, replace only the last sentence with: "Narrate what you do from the start of the plan phase through the `plan_tracker` init and the immediate `/skill:subagent-driven-development` invocation. This case overrides the generic replay endpoint at tracker init." Keep `expected.md` unchanged, especially `f6`: read once, initialize the same three tasks in order, and invoke SDD directly without choosing an execution mode. Leave the production handoff rule and generic replay file unchanged.

  In `eval/writing-plans/samples/pr-subject-threads/expected.md`, append only to the existing `header-style-only` fact: "Checker-valid command segmentation, including `&&` between the two unchanged lint/format commands, satisfies this fact; joining those commands is not an alternate-spelling disguise." Keep the id and every existing restriction: only documented lint and format commands in the header, no full-suite or task-test command there, no command-spelling workaround, and baseline/checker contracts preserved. Leave the remaining facts and production header rules unchanged. Add no accepted-variance entries for either repair and hand-edit no generated verdicts.

- [ ] **Step 10: Regenerate both arms for the changed narration case**

  Run: `node eval/run.mjs writing-plans fresh-child-authors-plan --baseline-only`

  Expected: exit 0 and refreshed baseline replies for the changed case on both configured replay models. The changed case input hash invalidates the saved primary replies; a judgment-only refresh cannot repair this input change.

  Run: `node eval/run.mjs writing-plans fresh-child-authors-plan`

  Expected: exit 0, regenerated candidate replies, and current paired judgments. Inspect both `results/fresh-child-authors-plan/baseline.json` and `results/fresh-child-authors-plan/candidate.json`: replies reach immediate SDD invocation and fact `f6` retains its required outcome. Do not weaken the fact or production handoff to repair a regression. These are partial runs, not final target-wide evidence.

- [ ] **Step 11: Refresh the clarified header fact on reusable replies**

  Run: `node eval/run.mjs writing-plans pr-subject-threads --refresh-judgments`

  Expected: exit 0 with improved or unchanged verdict, a partial report, and a candidate `refresh` audit for each configured replay-model pair. Inspect `results/pr-subject-threads/candidate.json` for the `header-style-only` fact and the previous/refreshed judgments. The refresh leaves primary replies and `baseline.json` unchanged; normal bounded confirmation may run on regression.

  A refusal for missing, failed, or stale replies means the reusable-reply prerequisite is unmet. Run `node eval/run.mjs writing-plans pr-subject-threads` once to obtain current successful replies under the final instruction assembly, then run `node eval/run.mjs writing-plans pr-subject-threads --refresh-judgments` for the documented recovery audit. Resolve any stale-intent refusal through Step 7. A completed refresh is not proof of a pass: inspect its exit, per-fact outcomes, and persisted audit. Do not loop refresh until green, change production behavior, or add accepted variance to silence a surviving failure.

- [ ] **Step 12: Lint the changed instruction and eval surfaces**

  Run: `node --input-type=module -e 'import { lintStageSkillDirs } from "./scripts/stage-skill-lint.mjs"; import { lintModelLiterals } from "./scripts/model-literal-lint.mjs"; import { lintSkillSizes } from "./scripts/skill-size-lint.mjs"; import { lintTarget } from "./eval/lib/lint.mjs"; const owned = new Set(["skills/writing-plans/SKILL.md", "agents/plan-writer.md"]); const errors = [...lintStageSkillDirs(process.cwd(), ["skills/writing-plans"]), ...lintModelLiterals(process.cwd()).filter(x => owned.has(x.path)), ...lintSkillSizes(process.cwd()), ...lintTarget("eval/writing-plans")]; console.log(JSON.stringify(errors)); process.exit(errors.length ? 1 : 0);'`

  Expected: `[]`, exit 0. The imported functions are defined in `scripts/stage-skill-lint.mjs:65-87`, `scripts/model-literal-lint.mjs:20-41`, `scripts/skill-size-lint.mjs:13-27`, and `eval/lib/lint.mjs:9-56`. No formatter is configured; inspect changed Markdown for ASCII punctuation, compact tables, and unchanged persona frontmatter.

- [ ] **Step 13: Produce final target-wide eval evidence**

  Run: `node eval/run.mjs writing-plans`

  Expected: exit 0, target-wide rather than partial `eval/writing-plans/report.md`, and successful candidate facts. The full run reuses fresh sample cells and refreshes only stale cells. Commit the new sample's `baseline.json` and `candidate.json`, both regenerated arms for fresh-child-authors-plan, the pr-subject-threads candidate refresh audit, the report, and any existing records the runner actually changed. Do not hand-author generated results. This command may take longer than a task editing step; wait for its completion before treating its report as final.

- [ ] **Step 14: Commit the instruction change and its evidence**

  Review the diff for the two instruction edits, new sample, two existing sample-contract repairs, intent, and generated evidence only. Keep `extensions/lib/plan-check.ts` and its tests untouched, so no bin rebuild is needed. Use bare git in the task worktree:

  ```bash
  git add skills/writing-plans/SKILL.md agents/plan-writer.md eval/writing-plans/samples/baseline-equivalent-restamp/case.md eval/writing-plans/samples/baseline-equivalent-restamp/expected.md eval/writing-plans/samples/fresh-child-authors-plan/case.md eval/writing-plans/samples/pr-subject-threads/expected.md eval/writing-plans/intent.md eval/writing-plans/report.md eval/writing-plans/results
  git commit -m "Retain equivalent planning baselines" -m "Behavior-changing instruction edit; add two-scenario retention replay, clarify two existing eval contracts without changing their required outcomes, and commit target-wide conformance evidence."
  ```

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L25 | Retain unchanged evidence across equivalent planning commits and keep one SHA | Task 1 |
| § "Acceptance criteria" L27 | An outside-directory change reruns all commands | Task 1 |
| § "Acceptance criteria" L29 | Unavailable proof reruns all without retained provenance | Task 1 |
| § "Acceptance criteria" L31 | Changed, missing, invalid, or explicitly forced evidence reruns | Task 1 |
| § "Acceptance criteria" L33 | Record retention count and SHA transition per distinct recorded SHA | Task 1 |
| § "Acceptance criteria" L35 | Add two-scenario sample, intent, and target-wide eval run | Task 1 |
| § "Design" L40 | Writer-side decision; checker, grammar, and regex unchanged | Task 1 |
| § "Design" L44 | Same rule for Findings and Amend; forced rerun overrides it | Task 1 |
| § "Design" L50 | Prove every distinct SHA before commands; retain all eligible evidence or rerun all | Task 1 |
| § "Design" L56 | Changed or missing/invalid evidence reruns while retained forms survive | Task 1 |
| § "Design" L58 | Derive directory-boundary exclusions from dispatched paths; filter stdout only; proof failure is not a question | Task 1 |
| § "Design" L62 | Baseline introduction permits recorded tree-equivalence evidence | Task 1 |
| § "Design" L63 | Rerun reasons use failed proof rather than changed base | Task 1 |
| § "Design" L67 | Existing provenance note is the sole retention record; grammar unchanged | Task 1 |
| § "Design" L71 | Persona body-only retention and shell allowance; preserve frontmatter and step 6 | Task 1 |
| § "Design" L75 | Preserve the already-present exact partial-supersession banner and predecessor text | Task 1 |
| § "Design" L79 | Preserve checker and test one-SHA invariant | Task 1 |
| § "Design" L80 | Preserve baseline grammar's one-SHA contract | Task 1 |
| § "Design" L81 | Preserve amendment dispatch contract | Task 1 |
| § "Design" L82 | Preserve forced rerun after rebase/merge | Task 1 |
| § "Design" L83 | Preserve accurate configuration finding documentation | Task 1 |
| § "Errors and edge cases" L91 | Proof precedes commands; post-run contamination remains and proof is not repeated mid-run | Task 1 |
| § "Errors and edge cases" L92 | Multiple recorded SHAs require unanimous proof | Task 1 |
| § "Errors and edge cases" L93 | Unresolvable short SHA reruns all | Task 1 |
| § "Errors and edge cases" L94 | Endpoint diff includes other docs and allows exactly reverted changes | Task 1 |
| § "Errors and edge cases" L95 | Outside-directory admitted docs invalidate proof; source in-flight work still blocks | Task 1 |
| § "Errors and edge cases" L96 | jj outside paths, malformed summaries, and nonzero exit fail proof | Task 1 |
| § "Errors and edge cases" L97 | Explicit rerun never re-stamps | Task 1 |
| § "Errors and edge cases" L98 | Accept the spec/plan input blind spot without new machinery | Task 1 |
| § "Tests" L102 | Text replay judges observations and does not widen the bundle to test persona admission | Task 1 |
| § "Tests" L104 | New sample has one case with two separately answered scenarios and default slices | Task 1 |
| § "Tests" L106 | Equivalent scenario proves retention, fresh added-task evidence, and uniform SHA | Task 1 |
| § "Tests" L107 | Changed-source scenario proves rerun-all without retention provenance | Task 1 |
| § "Tests" L109 | Intent, expected moves, target-wide execution, committed report, and bundled lint | Task 1 |
| § "Tests" L111 | Repair only the two eval contracts; preserve facts and production rules; regenerate changed-case arms, refresh clarified-fact judgments on reusable replies, then run the full target without variance or verdict edits | Task 1 |
| § "Documentation impact" L115 | Leave release-deferred changelog work to release | Task 1 |
| § "Documentation impact" L118 | Instructions are implementation; preserve existing banner without engine-guide churn | Task 1 |
| § "Out of scope" L122 | No per-task or per-file equivalence key | Task 1 |
| § "Out of scope" L123 | No partial retention across disagreeing proofs | Task 1 |
| § "Out of scope" L124 | No checker VCS port or acceptance of mixed SHAs | Task 1 |
| § "Out of scope" L125 | No change to flow commit timing | Task 1 |
| § "Out of scope" L126 | No exclusion of other docs | Task 1 |
| § "Out of scope" L127 | No audit field beyond the existing provenance note | Task 1 |
