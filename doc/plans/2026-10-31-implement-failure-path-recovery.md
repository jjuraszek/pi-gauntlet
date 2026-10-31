# Implement Failure-Path Recovery Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Recover structured failure-path results from original artifacts, derive amendment deltas from committed originals, and reject PR-sourced requirements in both critique routes.

**Architecture:** Keep the existing wave engine, attempt counters and amendment gate. Give implementer results dispatched identity and read missing results from capture envelopes before diagnosis; replace report-carried amendment inventory with two home-HEAD reads. Keep PR-source checking in the existing council and worker owners.

**Tech Stack:** Markdown skills/personas, Node.js node:test and native TypeScript stripping, installed pi-cohort sources, scratch git repositories, text-eval harness.

**Spec:** `doc/specs/2026-10-31-implement-failure-path-recovery.md`

**Verification:** `npm test && node eval/run.mjs implementer && node eval/run.mjs subagent-driven-development && node eval/run.mjs writing-plans && node eval/run.mjs spec-council-member && node eval/run.mjs brainstorming`

**Baseline policy:** implement-local

Baseline jjuraszek/pi-gauntlet: 7efcae89

---

Baseline provenance: home jjuraszek/pi-gauntlet, checkout .worktrees/fix-implement-failure-paths, HEAD 7efcae89. Initial porcelain inventory: only `?? doc/plans/2026-10-31-implement-failure-path-recovery.md`; admit that exact plan path and the dispatched spec path, no In-flight paths. Task 1 derived command executed 18 tests, Task 2 exact command 54 tests, Task 3 derived command 7 tests; all exited 0. HEAD and inventory were unchanged after each run; no artifacts or contamination. The created runtime test does not yet exist, so mixed-anchor baseline commands drop only that token. All three commands were executed again after correcting the header separator; the same counts, exits and clean-source inventory held.

Baseline provenance: implement-local amendment on home jjuraszek/pi-gauntlet, checkout .worktrees/fix-implement-failure-paths, observed HEAD 6939cd7e. Retain all three unchanged Tests commands and their 7efcae89 evidence byte-for-byte, including both pass-via suffixes; these are historical measurements, not passes on the current tree. No tree-equivalence claim, SHA rewrite, dependency installation or test execution occurs during this amendment. Initial staged inventory exactly matches parent In-flight: `M  agents/spec-council-member.md`, `M  eval/brainstorming/intent.md`, `A  eval/brainstorming/samples/worker-critique-pr-source/case.md`, `A  eval/brainstorming/samples/worker-critique-pr-source/expected.md`, `M  eval/spec-council-member/intent.md`, `A  eval/spec-council-member/samples/pr-rework-design-sourced/case.md`, `A  eval/spec-council-member/samples/pr-rework-design-sourced/expected.md`, `A  eval/spec-council-member/samples/pr-sourced-clause/case.md`, `A  eval/spec-council-member/samples/pr-sourced-clause/expected.md`, `M  scripts/brainstorming-contract.test.mjs`, `M  skills/brainstorming/reference/spec-finalization.md`. Admit those exact paths plus the dispatched spec and plan; preserve staged source. No unknown dirty path or missing/invalid baseline evidence was observed. Task 1 owns the new dependency prerequisite and the unchanged runtime command's implementation-time verification; parent stamp, task gates, review and final verification remain required.

## Files

The task Files blocks enumerate all exact Create paths and existing Modify paths/globs, grouped here by component. No source deletion is planned.

**Create:**
- Runtime test: `scripts/implement-failure-paths.test.mjs`.
- `case.md` and `expected.md` at each new sample directory explicitly enumerated under Tasks 1-3: artifact-status-read, batch-anchors-recovery, needs-context-no-edit, blocked-no-edit, pr-sourced-clause, pr-rework-design-sourced, worker-critique-pr-source, implement-amend-from-head, implement-amend-plan-untracked, handoff-plan-commit, amend-baseline-missing-stop, uncommitted-plan-at-entry.

**Modify:**
- Return/recovery: `agents/implementer.md`, `skills/forge-skill/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/implementer-prompt.md`, `skills/subagent-driven-development/reference/dispatch-contract.md`.
- Amendment originals: `agents/plan-writer.md`, `skills/writing-plans/SKILL.md`, `skills/writing-plans/reference/plan-contract.md`, `skills/subagent-driven-development/reference/implement-amendments.md`, `skills/brainstorming/reference/amendment-surface.md`.
- Critique: `agents/spec-council-member.md`, `skills/brainstorming/reference/spec-finalization.md`.
- Tests/CI: `scripts/anchored-task.test.mjs`, `scripts/brainstorming-contract.test.mjs`, `scripts/implement-amendment.test.mjs`, `scripts/ci.mjs`.
- Runtime-test development dependency: `package.json` (Task 1).
- Existing eval case/expected pairs and intents: exact paths/globs in Tasks 1-3.
- Documentation: `doc/personas.md`, `doc/implement-engines.md`, `CHANGELOG.md`.

**Generated at verification:** the five affected targets' existing `report.md` and `results/` records. Let the runner generate real evidence and commit it during verification; do not manufacture records. No bin-source, shared-extension, production-dependency or peer-floor change is needed; Task 1 adds only the granted typebox development dependency and keeps package-lock.json ignored.

## Recon and execution conventions

- This is one home leg and one release concern. The overrides have no Happy path table or deployment topology requiring a split. Root AGENTS.md is the applicable ancestor; unrelated eval-fixture AGENTS files do not govern these paths, and no CLAUDE file exists. Combine home-spec Rules with task Rules.
- `scripts/ci.mjs:433-478` runs native TypeScript resolver tests and an explicit shell-fixture list. Add the new test there. Full verification bundles instruction lint, eval structure/hygiene, runtime tests, bundle freshness and package checks. No configured formatter or file-scoped Markdown linter exists. Use `node --check` on changed JavaScript and existing `node scripts/skill-size-lint.mjs` / `node scripts/model-literal-lint.mjs` for instruction lint; retain compact tables and ASCII.
- `scripts/anchored-task.test.mjs:7-29` pins implementer frontmatter. Assert the new false guard and normalize only this approved byte change before the old hash comparison; preserve the wave-reviewer pin.
- Installed runtime definitions: `node_modules/pi-cohort/src/runs/shared/structured-output.ts:27-39,80-109` exports `createStructuredOutputRuntime(schema, baseDir)` and `readStructuredOutput(runtime)` returning `{ value }` or `{ error }`. `completion-guard.ts:66-69,105-119` exports `blockedLine(output)` and `expectsImplementationMutation(agent, task)`. Tests import these, not copied implementations.
- Runtime fixtures allocate unique OS-temp directories with mkdtempSync, following scripts/wave-review.test.mjs. Wave 1 tasks have disjoint writes and no shared mutable runtime resource. Model evals run after all instruction changes, so parallel tasks never contend on result records.
- New text cases declare `bundle-` subsets and `bundle+` for needed existing references outside default target slices. Preserve target.json, replay contracts, word caps and unrelated accepted variance. The implementer no-edit cases also bundle forge-skill's supporting guard exception, keeping this change within the spec's five existing targets.
- Model evaluation is verification-owned because its CLI takes target names rather than file-addressable task anchors. Update intents during implementation, run the complete header set at verification, and commit generated reports/results. Deterministic passes prove fixture/runtime behavior, not model compliance. Commit bodies identify instruction edits as behavior changes.

## Wave 1 - Return recovery and independent critique

### Task 1: Recover identity-matched implementer results before diagnosis
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - existing tests first, then runtime fixtures and failing contract assertions.

**Spec:** doc/specs/2026-10-31-implement-failure-path-recovery.md § "Acceptance criteria" L28-L37, § "1. Implementer return carries identity; guard off" L72-L85, § "2. Failed-chain recovery reads the original" L89-L98, § "Errors and edge cases" L129-L134, § "Tests" L143-L149, § "Tests" L156-L158, § "Tests" L160, § "Out of scope" L170, § "Out of scope" L172

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `agents/implementer.md`
- Modify: `skills/forge-skill/SKILL.md`
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/implementer-prompt.md`
- Modify: `skills/subagent-driven-development/reference/dispatch-contract.md`
- Modify: `scripts/anchored-task.test.mjs`
- Modify: `scripts/ci.mjs`
- Modify: `package.json`
- Create: `scripts/implement-failure-paths.test.mjs`
- Create: `eval/subagent-driven-development/samples/artifact-status-read/case.md`
- Create: `eval/subagent-driven-development/samples/artifact-status-read/expected.md`
- Create: `eval/subagent-driven-development/samples/batch-anchors-recovery/case.md`
- Create: `eval/subagent-driven-development/samples/batch-anchors-recovery/expected.md`
- Create: `eval/implementer/samples/needs-context-no-edit/case.md`
- Create: `eval/implementer/samples/needs-context-no-edit/expected.md`
- Create: `eval/implementer/samples/blocked-no-edit/case.md`
- Create: `eval/implementer/samples/blocked-no-edit/expected.md`
- Modify: `eval/implementer/samples/anchored-task/*.md`
- Modify: `eval/implementer/samples/heavy-json-fixture/*.md`
- Modify: `eval/subagent-driven-development/samples/chain-error-diagnosis/*.md`
- Modify: `eval/subagent-driven-development/samples/empty-delta-attempt/*.md`
- Modify: `eval/subagent-driven-development/samples/direct-report-read/*.md`
- Modify: `eval/subagent-driven-development/samples/no-plan-read-wave/*.md`
- Modify: `eval/implementer/intent.md`
- Modify: `eval/subagent-driven-development/intent.md`
- Test: `scripts/implement-failure-paths.test.mjs`
- Test: `scripts/anchored-task.test.mjs`
- Test: `scripts/wave-review.test.mjs`

**Tests:**
- `node --test scripts/implement-failure-paths.test.mjs scripts/anchored-task.test.mjs scripts/wave-review.test.mjs`
- baseline: 7efcae89 pass via `node --test scripts/anchored-task.test.mjs scripts/wave-review.test.mjs`
- via: `readStructuredOutput`, `blockedLine`, `expectsImplementationMutation`, `IMPLEMENTER_STATUS_SCHEMA`

Decision: parse the existing schema declaration in dispatch-contract.md for runtime assertions, as wave-review.test.mjs does for the reviewer schema; do not create a test-owned schema. Exactly one identity is enforced by `oneOf: [{ required: ["anchor"] }, { required: ["anchors"] }]`, with `additionalProperties: false` unchanged. The persona copies an `anchor:` or `anchors:` dispatch, including `### Task N:` identity; inline non-wave callers are not assigned invented identities.

Decision: supply `"typebox": "^1.3.11"` through this repository's `package.json` devDependencies, matching node_modules/pi-cohort/package.json's development range and optional peer declaration. Its structured-output.ts:4 imports `typebox/compile`; the home development install lacks node_modules/typebox/package.json. Keep production dependencies, the pi-cohort peer floor and .gitignore's package-lock.json convention unchanged.

- [ ] **Step 0: Supply the runtime-test development dependency.** Add only `"typebox": "^1.3.11"` to `package.json` devDependencies, then install development dependencies with `npm install --include=dev` in the task's owning checkout before the required peer-source runtime tests. Do not stage the ignored package-lock.json or change production dependencies or the pi-cohort peer floor. After the runtime file exists, verify the existing Tests command unchanged; import the real peer source and do not replace these required tests with mocks or skipped tests.
- [ ] **Step 1: Run existing tests, then add red runtime fixtures.** Run the Tests command without the new failure-path file before creation. Create that file with node:test and unique temp capture directories. Import `node_modules/pi-cohort/src/runs/shared/completion-guard.ts` and `structured-output.ts`. Extract `IMPLEMENTER_STATUS_SCHEMA` and write `{"status":"success","value":{"status":"NEEDS_CONTEXT","question":"q","reasoning":"r","anchor":"### Task 5:"}}`; assert readStructuredOutput returns the value. Add rejection rows for neither/both identities, missing `question`/`concerns`, invalid status, missing `value`, malformed JSON and error envelopes; add a valid batch `anchors` row. Assert blockedLine detects a `BLOCKED: ...` first line but not `Status: BLOCKED` followed by `Reasoning:`. Pin implementer false and `agents/plan-writer.md` true.
- [ ] **Step 2: Add original-state fixtures.** In the same new runtime file, allocate a unique temp git repository with fixture-local git identity. Commit relative plan/spec paths, dirty both working files, and assert relative HEAD reads still return originals. Assert absolute paths after HEAD and an untracked plan fail. Parse unchanged APPLY_SCHEMA and assert readStructuredOutput can recover a success capture carrying passed:false and a baseline-read failLines marker. These runtime facts already hold; Task 3 adds their instruction contract assertions.
- [ ] **Step 3: Add carrier/patch contract assertions and confirm red.** Extract the actual sequential carrier, assert `agent: "delegate"` and `Do not edit any file.`, and call expectsImplementationMutation with delegate and that text; require false. Pin read-first ordering, duplicate-identity stopping, bounded reads, the initial-patch failure row and unchanged nonempty apply-failure stop. Run Tests; expect failures on old guard/schema/carrier wording, not import errors.
- [ ] **Step 4: Change return identity and the named guard pin.** Set `completionGuard: false` only in implementer frontmatter, preserving other bytes. Keep `NEEDS_CONTEXT`, `BLOCKED`, `DONE`, `DONE_WITH_CONCERNS` and existing conditional fields. Copy dispatched identity in every status, including unreadable anchors. Prohibit the `BLOCKED:` opening; use structured `status: BLOCKED` and report `Reasoning:`. Update dispatch-contract and implementer-prompt.md together, auditing embedded schema copies. Amend forge-skill's Persona rules so an implementing persona retains its guard except for a caller-owned equivalent edit-less-completion check named in doc/personas.md. Update anchored-task.test.mjs's authorized guard normalization; leave the wave-reviewer pin unchanged.
- [ ] **Step 5: Replace failed-chain recovery at its owner.** Keep accepted siblings and matched `## Stop` precedence. For every task absent from `## Outputs` or `## Stop`, list capture paths and bounded-read each once. Accept a closed `{"status":"success","value":{...}}` envelope only with an allowed `value.status`, matching `value.anchor` or set-equal `value.anchors`, and required question/concerns. Route `value.status: NEEDS_CONTEXT` and BLOCKED to the decision ladder; route DONE/concerns through patch admission. Rejected, stale, malformed, unmatched or truncated captures count as absent. Duplicate matching identities stop naming both paths. Reconcile recovered siblings in plan index order and print existing task observations; batch identity routes once per task. Repairs use this same recovery.
- [ ] **Step 6: Keep permissions narrow and address fallback diagnosis.** In `## Orchestrator holds`, admit capture listing and `test -s` only for this path, plus direct capture reads with `limit: 300`, no offset or pagination. Capture JSON is the second source after result text, not permission for saved prose reports. Only a task with no accepted capture dispatches the same sequential diagnosis shape with `agent: "delegate"` and `Do not edit any file.`. Remove the agent-omission sentence and preserve identity-matched artifact diagnosis and the no-report-relay boundary.
- [ ] **Step 7: Count absent initial patches without integration.** Before isolated DONE/concerns integration, check the `Artifacts:` patch with test -s. Missing path/zero bytes adds `+1` failed attempt, applies nothing, retains siblings, and starts current-tree repair with `your work produced no patch`. Keep nonempty `git apply --index` failure a hard stop, and the empty repair-delta rule. In-place `delta none applied n/a` still reaches gate/review; add no `diff --stat` emptiness detector. Do not harden `gatekeep-pr`, `chase-bug/reference/hotfix.md`, `chase-bug` hotfix, finishing fix-minors or pr-head repair.
- [ ] **Step 8: Add/update named replays.** artifact-status-read supplies task 4 DONE and task 5 NEEDS_CONTEXT, requiring task 4 accepted/integrated before task 5's ladder and no diagnosis. batch-anchors-recovery matches a multi-task set and routes once per member. Both implementer no-edit cases require identity, no write, no BLOCKED opening and mirrored JSON. Extend empty-delta-attempt with missing/zero-byte initial patches while retaining empty repair-delta counting. Change chain-error-diagnosis to artifact listing before addressed diagnosis. Keep direct-report-read's 340-line report bound and no-plan-read-wave's delegated source boundary. Update anchored-task and heavy-json-fixture schema/return expectations. Every case.md declares bundle- subsets per eval/README.md; add forge-skill only to the new guard samples.
- [ ] **Step 9: Wire CI, intent, green and lint.** Add the runtime file to scripts/ci.mjs's explicit list. Update both intents with expected fact movements, not invented model results. Run Tests, `node --check scripts/implement-failure-paths.test.mjs`, `node --check scripts/anchored-task.test.mjs`, `node --check scripts/ci.mjs`, `node scripts/skill-size-lint.mjs`, `node scripts/model-literal-lint.mjs`; expect executed tests and no failures. Check imperative voice, ASCII and compact tables.
- [ ] **Step 10: Commit task-owned files.** Stage only owned files and use `git commit -m "fix: recover structured implementer returns before diagnosis" -m "Behavior-changing instructions; runtime tests and eval samples cover identity, no-edit returns and initial patch failures."`.

Source-literal cross-check: `mkdtemp` and `structured-output.ts:34` explain random capture paths; `dispatch-contract.md:10`, `doc/implement-engines.md:24`, `implementer-prompt.md` and eval `case.md` carry schema consumers. The guard call is `agent.completionGuard !== false` at `attempt-finalization.ts:249`; the sentinel is `attempt-finalization.ts:214-217`; implementer references `:23`, `:61` and forge `:55` are source citations. Keep `completionGuard: true` for plan-writer. Integration citations: `SKILL.md:120`, `:199`, `SKILL.md:125`, `SKILL.md:22`, `SKILL.md:199`; suppression: `chain-execution.ts:477-480`, `:759-786`, `formatters.ts` `buildChainSummary`. Capture serialization: `JSON.stringify` at `subagent-prompt-runtime.ts:231`; patch behavior: `worktree.ts:535-536`, `:552-554`, `:574-577`. `EXPLICIT_NO_EDIT_PATTERNS` in `completion-guard.ts:20-25` exempts `delegate` despite its `edit`/`write` tools and `.patch` task text (`agents/delegate.md:6`, `implement-amendments.md` step 1). `cleanupStructuredOutputRuntime` does not remove rejected captures here. Preserve `status: DONE` patch admission and the `output.json` read bound. `scripts/ci.mjs:433` supplies `npm test` coverage. Related contract assertions in `scripts/implement-amendment.test.mjs`, `plan-writer.md`, `amendment-surface.md`, `writing-plans/SKILL.md` and `plan-contract.md` are updated by Task 3. Existing `delegated-amendment` and `local-amend-revalidation` fixtures are also Task 3's; `case.md`/`expected.md` remain the format (`expected.md:1` is the retired agent-omitted expectation).

### Task 2: Reject PR-sourced commitments in both critique routes
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - existing contract tests first, then failing critique assertions.

**Spec:** doc/specs/2026-10-31-implement-failure-path-recovery.md § "Acceptance criteria" L42-L43, § "4. Critique direction check" L115-L117, § "Errors and edge cases" L139, § "Tests" L153-L155

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `agents/spec-council-member.md`
- Modify: `skills/brainstorming/reference/spec-finalization.md`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Create: `eval/spec-council-member/samples/pr-sourced-clause/case.md`
- Create: `eval/spec-council-member/samples/pr-sourced-clause/expected.md`
- Create: `eval/spec-council-member/samples/pr-rework-design-sourced/case.md`
- Create: `eval/spec-council-member/samples/pr-rework-design-sourced/expected.md`
- Create: `eval/brainstorming/samples/worker-critique-pr-source/case.md`
- Create: `eval/brainstorming/samples/worker-critique-pr-source/expected.md`
- Modify: `eval/spec-council-member/intent.md`
- Modify: `eval/brainstorming/intent.md`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 7efcae89 pass
- via: `agents/spec-council-member.md` axis 2 and `skills/brainstorming/reference/spec-finalization.md` worker critique

Decision: `pr-source` is finding text under existing `gap` kind with severity `major`, not a new output enum or routing prefix - spec component 4 and the member Output format settle this. Keep member frontmatter byte-identical.

- [ ] **Step 1: Run existing tests and add red assertions.** Run Tests, then extend that file to require both predicates, gap/major vocabulary, provenance exemptions and re-source-or-ask behavior. Keep ticket-row integrity tests. Rerun and confirm failures because PR-source checking is absent.
- [ ] **Step 2: Add the council check to axis 2.** Flag only a requirement, AC row or Design clause justified by a PR title/body, including PR rework. Emit pr-source in the finding text with major gap fields. Re-source from approved human input or agreed design; absent evidence, ask for the user's Design scope decision before cutting a commitment or drafted row. Never replace rows with `none` or draft rows. Keep `external-ref`, `external-ref:` and `over-spec:` routing/vocabulary unchanged (`:60` is the kind vocabulary citation).
- [ ] **Step 3: Add the worker's third check.** Update the scope-plus-ambiguity instruction and actual dispatch payload in `spec-finalization.md:77-94` with the same predicate, severity/kind, exemptions and correction rule. Preserve main-loop drafting and integrity recovery. Exempt `supersedes`, `## Rework record`, `## Problem` thread lists, `## PR under rework`, other PR-number provenance and rework rows sourced from agreed design. Apply regardless of `specCouncil.members`.
- [ ] **Step 4: Add three tool-free cases and update intents.** pr-sourced-clause requires a major gap and re-source-or-ask. pr-rework-design-sourced passes design-derived rows and PR provenance. worker-critique-pr-source checks both controls on the no-council route. Use bundle subsets, adding full spec-finalization to the worker case because the default target includes only its gate slice. Preserve unrelated target config and record intended fact movements in both intents.
- [ ] **Step 5: Run green, lint and commit.** Run Tests, `node --check scripts/brainstorming-contract.test.mjs`, `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`; expect no failures. Review prose under forge-skill, stage owned files and use `git commit -m "fix: check requirement sources in both spec critique routes" -m "Behavior-changing critique instructions; council and worker replays distinguish commitments from provenance."`.

## Wave 2 - Committed amendment originals

Depends on Wave 1: Task 3 consumes Task 1's runtime fixtures and extends its recovery contract, SDD intent and schema reference.

### Task 3: Read amendment originals from home HEAD and preserve failure routing
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - replace report-inventory assertions, then exercise committed-original/runtime fixtures.

**Spec:** doc/specs/2026-10-31-implement-failure-path-recovery.md § "Acceptance criteria" L38-L41, § "3. Amend-apply derives the inventory from the committed originals" L102-L111, § "Errors and edge cases" L135-L138, § "Tests" L150-L152, § "Tests" L156-L158

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `agents/plan-writer.md`
- Modify: `skills/writing-plans/SKILL.md`
- Modify: `skills/writing-plans/reference/plan-contract.md`
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/reference/dispatch-contract.md`
- Modify: `skills/subagent-driven-development/reference/implement-amendments.md`
- Modify: `skills/brainstorming/reference/amendment-surface.md`
- Modify: `scripts/implement-amendment.test.mjs`
- Create: `eval/writing-plans/samples/implement-amend-from-head/case.md`
- Create: `eval/writing-plans/samples/implement-amend-from-head/expected.md`
- Create: `eval/writing-plans/samples/implement-amend-plan-untracked/case.md`
- Create: `eval/writing-plans/samples/implement-amend-plan-untracked/expected.md`
- Create: `eval/writing-plans/samples/handoff-plan-commit/case.md`
- Create: `eval/writing-plans/samples/handoff-plan-commit/expected.md`
- Create: `eval/subagent-driven-development/samples/amend-baseline-missing-stop/case.md`
- Create: `eval/subagent-driven-development/samples/amend-baseline-missing-stop/expected.md`
- Create: `eval/subagent-driven-development/samples/uncommitted-plan-at-entry/case.md`
- Create: `eval/subagent-driven-development/samples/uncommitted-plan-at-entry/expected.md`
- Modify: `eval/subagent-driven-development/samples/delegated-amendment/*.md`
- Modify: `eval/subagent-driven-development/samples/local-amend-revalidation/*.md`
- Modify: `eval/writing-plans/samples/implement-amend-historical-baseline/*.md`
- Modify: `eval/writing-plans/samples/implement-amend-changed-command/*.md`
- Modify: `eval/writing-plans/intent.md`
- Modify: `eval/subagent-driven-development/intent.md`
- Test: `scripts/implement-amendment.test.mjs`
- Test: `scripts/implement-failure-paths.test.mjs`

**Tests:**
- `node --test scripts/implement-amendment.test.mjs scripts/implement-failure-paths.test.mjs`
- baseline: 7efcae89 pass via `node --test scripts/implement-amendment.test.mjs`
- via: `Amend-apply:`, `APPLY_SCHEMA`, `git show`, `readStructuredOutput`

Decision: use only committed home plan/spec originals; `HEAD:` takes home-relative paths. `previousApplyReport` carries findings only. Keep the existing apply schema and implement-local historical evidence policy; add no sidecar or alternate VCS implementation (spec component 3).

- [ ] **Step 1: Run current tests and replace inventory assertions.** Run Tests. Replace scripts/implement-amendment.test.mjs:58-69's report-copy assertions with both committed reads at every binding site, pre-edit write-free failure, findings-only retry reports, semantic delta comparison and marker-specific no-retry. Keep prepare no-edit, redraw, grant and parent-stamp tests.
- [ ] **Step 2: Add apply-recovery contract assertions and confirm red.** In implement-amendment.test.mjs pin one-file APPLY_SCHEMA admission, zero/two-file stopping, exact-marker bypass, normal one-retry behavior, handoff ordering and path-scoped commit. Task 1 already supplies scratch HEAD-read and captured-apply runtime fixtures; run them unchanged with Tests. Expect red only on current instruction wording.
- [ ] **Step 3: Establish committed originals at handoff and entry.** In writing-plans `## Execution Handoff`, after parent `plan_check` PASS and before `plan_tracker` init, stage the home-relative plan and commit it on the worktree branch with the specified plan subject. Point the `:39` Boundary sentence to that step. In SDD Prerequisites, before the first wave check porcelain for exactly plan and spec; if nonempty, stage/commit those paths before dispatch. Add path-scoped staging to coordination permissions. Never stage unrelated source or use dirty worktree content as retry baseline.
- [ ] **Step 4: Read both originals before editing in Amend-apply.** Derive home-relative paths as baseline path inventory does (`:303`); read both HEAD texts before the first edit. Use original task numbers/titles/waves, bodies, Tests and committed anchored obligations for `tasksAdded`, `tasksAnchorChanged`, `tasksRemoved` and `amendedSections`; pure offsets or meaning-preserving rewording do not reopen tasks. Limit the bash exception to these two home-relative HEAD reads, preserving all other shell bans and ordinary output. Either failed read writes nothing and returns `passed: false` with `failLines[0]` beginning `baseline read failed: git -C `, the exact command and first stderr line. A successful one-bullet edit returns `passed: true`. jj-only without git HEAD fails closed. Preserve the actual stderr, including the spec's diagnostic form `fatal: path '...' exists on disk, but not in 'HEAD'`; do not replace the real path with that illustrative ellipsis.
- [ ] **Step 5: Replace all binding copy requirements atomically.** Update implement-amendments steps 3-4, dispatch-contract's semantic paragraph, writing-plans implement-local Baseline/patch paragraphs, amendment-surface maintenance/apply sections and plan-contract historical skip evidence. Each names committed plan/spec originals. Match retained skipped evidence against the committed plan; preserve local-only patching, historical suffixes, original leg declarations, staged repair admission, identified execution trees and nonzero test counts. `previousApplyReport` holds prior findings/failLines only; retries reread HEAD and apply granted edits idempotently.
- [ ] **Step 6: Recover suppressed apply JSON and route exact failures.** Keep plan-writer `completionGuard: true`. With no structured apply result, read the sole capture for that one-task dispatch at the existing bound, require a success envelope satisfying `APPLY_SCHEMA`, and route `passed`/`failLines` like printed JSON. Zero/two files stops naming paths; malformed value stops. Only a failLines entry beginning `baseline read failed: git -C ` bypasses the parent's single retry and quotes the failure in a stop note. Every other passed:false retains one fresh retry. Keep parent PASS before tracker changes and the single `amend:` audit commit. Do not recover from prose reports or disable the guard.
- [ ] **Step 7: Add five named replays.** implement-amend-from-head covers a one-bullet success and a partial retry whose only semantic change is the anchored spec obligation, requiring the correct tasksAnchorChanged. implement-amend-plan-untracked requires no writes and the exact marker. amend-baseline-missing-stop covers guard-suppressed return, one-file recovery, no retry and zero/two-file controls. handoff-plan-commit and uncommitted-plan-at-entry require path-scoped commit before initialization/dispatch. Use sample-local bundles.
- [ ] **Step 8: Update existing fixtures and intent.** Replace report-copy observations in delegated-amendment and local-amend-revalidation with committed-original reads. Update writing-plans' historical/changed-command cases without weakening evidence retention, staged repair or dirty-run rules. Keep previous findings in the retry report. Preserve Task 1's schema/read-boundary work and record expected movements in both intents without invented model evidence.
- [ ] **Step 9: Run green, lint and commit.** Run Tests, `node --check scripts/implement-amendment.test.mjs`, `node scripts/skill-size-lint.mjs` and `node scripts/model-literal-lint.mjs`; expect no failures. Confirm removed copy obligations do not remove failure history or parent gates. Stage owned files and use `git commit -m "fix: derive implement amendment deltas from committed originals" -m "Behavior-changing instructions; runtime tests and replays cover dirty retries, missing originals and handoff commits."`.

Contract-literal cross-check: `bash` admits the two `git show` reads and no general content loading; an absolute path after `HEAD:` fails. `evaluateCompletionMutationGuard` with a granted `edit` produces `triggered: true`, so `plan-writer` may suppress `## Outputs` while `output.json` still exists. Do not change `APPLY_SCHEMA`. Remove copies at `dispatch-contract.md:18`, `skills/writing-plans/SKILL.md:297`, `:301`, `:330`, `skills/brainstorming/reference/amendment-surface.md:43`, `:156`, `skills/writing-plans/reference/plan-contract.md:47` and `scripts/implement-amendment.test.mjs:58-69`. The old filenames `plan-writer.md`, `amendment-surface.md`, `implement-amendments.md`, `writing-plans/SKILL.md`, `plan-contract.md` refer to owned files. Runtime tests import `node_modules/pi-cohort/src/runs/shared/completion-guard.ts` and `structured-output.ts` through `scripts/ci.mjs:433`. Preserve the fixture `{"status":"success","value":{"status":"NEEDS_CONTEXT","question":"q","reasoning":"r","anchor":"### Task 5:"}}`, `readStructuredOutput`, `blockedLine`, `Reasoning:`, `BLOCKED: ...`, `IMPLEMENTER_STATUS_SCHEMA`, `agents/implementer.md` with `completionGuard: false`, `agent: "delegate"`, `Do not edit any file.` and `expectsImplementationMutation` in Task 1's runtime checks. Existing replay inventory includes `eval/implementer/samples/anchored-task`, `heavy-json-fixture`, `eval/subagent-driven-development/samples/direct-report-read`, `no-plan-read-wave`, `delegated-amendment`, `local-amend-revalidation`, and `case.md`/`expected.md`; this task changes only its declared amendment fixtures. Full `npm test` remains verification-owned.

## Wave 3 - Public contract documentation

Depends on Waves 1 and 2: docs describe the final guard, recovery and committed-original contract. One trailing task owns shared hub files.

### Task 4: Document failure recovery and the guard exception
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Trivial change - documentation review against the implemented contract.

**Spec:** doc/specs/2026-10-31-implement-failure-path-recovery.md § "Documentation rows" L121-L123, § "Documentation impact" L164-L165, § "Out of scope" L173

**Files:**
- Modify: `doc/personas.md`
- Modify: `doc/implement-engines.md`
- Modify: `CHANGELOG.md`

**Tests:**
- none: docs - no configured Markdown formatter

- [ ] **Step 1: Update persona knobs and roster.** Set the documented `completionGuard` value to `false` for `implementer`, remove its stale completion-guarded roster description, and explain why isolated-wave patch requirements reject edit-less `DONE` while the guard hid structured `NEEDS_CONTEXT`/`BLOCKED`. In-place and non-wave callers retain gate/review coverage, not a new patch detector. Keep the plan-writer true pin and unrelated knobs.
- [ ] **Step 2: Replace engine diagnosis-first wording.** At `doc/implement-engines.md:26`, state identity-matched `output.json` capture recovery first, then addressed read-only `delegate` diagnosis. Keep report-body recovery forbidden. Describe absent initial patches as failed attempts, not nonempty apply failures as automatic rebuilds.
- [ ] **Step 3: Add unreleased rationale without releasing.** Add `## Unreleased` above v8.0.0, one entry per component: implementer identity/guard, artifact-first recovery/addressed carrier, committed-original inventory/plan handoff, PR-source critique direction. Do not promote the heading or change the package version.
- [ ] **Step 4: Review and commit.** Compare changed doc units with actual instructions, check ASCII and compact tables, stage these files and use `git commit -m "docs: explain implement recovery and committed amendment originals"`.

Excluded triage stays excluded: do not change `~/.pi/agent/agents/*.md`, `.worktrees/gh-107-coordinated-legs-reference`, `.pi/agents/`, `code-reviewer.md`, `spec-reviewer.md` or `wave-reviewer.md` consumer installations. The spec's `/skill:shape-ticket` suggestion is follow-up, not a task in this plan.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L28-L37 | AC1: matching NEEDS_CONTEXT capture routes without diagnosis | Task 1 |
| § "Acceptance criteria" L28-L37 | AC2: no capture uses addressed read-only delegate | Task 1 |
| § "Acceptance criteria" L28-L37 | AC3: no-edit statuses survive without BLOCKED opening | Task 1 |
| § "Acceptance criteria" L28-L37 | AC4: absent initial patch fails, never integrates | Task 1 |
| § "Acceptance criteria" L28-L37 | AC5: every anchored return copies dispatched identity | Task 1 |
| § "Acceptance criteria" L38-L41 | AC6: successful amend uses committed plan/spec, no report copy | Task 3 |
| § "Acceptance criteria" L38-L41 | AC7: missing original fails before writes and parent retry | Task 3 |
| § "Acceptance criteria" L42-L43 | AC8: both critiques reject PR-source and exempt provenance | Task 2 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Match randomized capture directories with dispatched identity | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Exactly one schema identity, all embedded consumers updated | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Copy identity in every status | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Block through status/Reasoning, never first-line sentinel | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Explicit false guard pin, not omission | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Forge exception names caller-owned equivalent check in persona docs | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Preserve statuses and conditional fields | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | Isolated integration requires nonempty patch | Task 1 |
| § "1. Implementer return carries identity; guard off" L72-L85 | In-place and non-wave detection remain gate/review-owned | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Reconcile every missing result including suppressed siblings | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Retain accepted siblings and matched Stop precedence | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Bound/validate captures; route matches and batch members with observations | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Narrow capture-only primary exception; no prose-report relay | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Empty initial patch adds one failure and current-tree repair | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Addressed read-only diagnosis only after no accepted capture | Task 1 |
| § "2. Failed-chain recovery reads the original" L89-L98 | Repairs use the same identity-matched read | Task 1 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | HEAD holds pre-amend originals throughout each batch | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Commit plan after parent PASS and before tracker init | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Commit dirty workflow originals before first wave, path-scoped | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Two relative HEAD reads before edits; semantic obligation/work deltas | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Only the two reads extend writer shell permissions | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Write-free read failure uses exact marker, skips only its retry | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Keep planner guard; recover sole apply capture; zero/two stop | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Remove all copy obligations; retry report holds findings only; schema unchanged | Task 3 |
| § "3. Amend-apply derives the inventory from the committed originals" L102-L111 | Preserve parent stamp and single amendment commit | Task 3 |
| § "4. Critique direction check" L115-L117 | Council predicate and major gap; approved source or scope question before cutting | Task 2 |
| § "4. Critique direction check" L115-L117 | Exempt provenance/design-sourced rework; no new kind or prefix | Task 2 |
| § "4. Critique direction check" L115-L117 | Worker third check has identical predicate and correction rule | Task 2 |
| § "Documentation rows" L121-L123 | Persona guard row and rationale, including detection limitations | Task 4 |
| § "Documentation rows" L121-L123 | Replace engine diagnosis-first sentence | Task 4 |
| § "Documentation rows" L121-L123 | One Unreleased entry per component | Task 4 |
| § "Errors and edge cases" L129-L134 | No capture invokes addressed read-only diagnosis | Task 1 |
| § "Errors and edge cases" L129-L134 | Invalid, stale or incomplete capture counts as absent | Task 1 |
| § "Errors and edge cases" L129-L134 | Duplicate identity stops naming both paths | Task 1 |
| § "Errors and edge cases" L129-L134 | Suppressed DONE sibling integrates in plan order, no redispatch | Task 1 |
| § "Errors and edge cases" L129-L134 | Empty initial patch repairs, retains siblings, applies nothing | Task 1 |
| § "Errors and edge cases" L129-L134 | Nonempty initial apply failure still hard-stops | Task 1 |
| § "Errors and edge cases" L135-L138 | Commit uncommitted workflow originals before dispatch | Task 3 |
| § "Errors and edge cases" L135-L138 | Missing HEAD original: no writes, capture recovery, no retry | Task 3 |
| § "Errors and edge cases" L135-L138 | Dirty half-applied files do not replace originals | Task 3 |
| § "Errors and edge cases" L135-L138 | jj-only fails closed at missing git originals | Task 3 |
| § "Errors and edge cases" L139 | Provenance mentions never trigger PR-source critique | Task 2 |
| § "Tests" L143-L149 | Tool-free narration versus deterministic proof; bundle subsets | Task 1 |
| § "Tests" L143-L149 | artifact-status-read sample | Task 1 |
| § "Tests" L143-L149 | chain-error-diagnosis update | Task 1 |
| § "Tests" L143-L149 | empty-delta-attempt extension | Task 1 |
| § "Tests" L143-L149 | batch-anchors-recovery sample | Task 1 |
| § "Tests" L143-L149 | Both no-edit implementer samples | Task 1 |
| § "Tests" L150-L152 | Committed-original success and semantic retry sample | Task 3 |
| § "Tests" L150-L152 | Missing original child and parent samples | Task 3 |
| § "Tests" L150-L152 | Handoff and resumed-entry commit samples | Task 3 |
| § "Tests" L153-L155 | Council PR-source positive sample | Task 2 |
| § "Tests" L153-L155 | Council design-source/provenance negative sample | Task 2 |
| § "Tests" L153-L155 | Worker positive/negative controls | Task 2 |
| § "Tests" L156-L158 | Update schema/read-boundary and inventory replays | Task 1, Task 3 |
| § "Tests" L156-L158 | Duplicate identity stays skill-text covered, no model sample | Task 1 |
| § "Tests" L156-L158 | Peer runtime fixtures, scratch HEAD reads, CI and amendment assertions | Task 1, Task 3 |
| § "Tests" L160 | Add `"typebox": "^1.3.11"` to `package.json` devDependencies for the peer's `typebox/compile` import | Task 1 |
| § "Tests" L160 | Install development dependencies and verify the unchanged scoped runtime-test command with real peer imports, no mocks or skipped tests | Task 1 |
| § "Tests" L160 | Preserve production dependencies, pi-cohort peer floor and ignored package-lock.json convention | Task 1 |
| § "Documentation impact" L164-L165 | Unreleased rationale; heading promotion deferred to release | Task 4 |
| § "Documentation impact" L164-L165 | Persona and engine derived documentation | Task 4 |
| § "Out of scope" L169 | No cross-repo status-aware guard implementation | waived: excluded by spec |
| § "Out of scope" L170 | Identity avoids peer directory-naming change | Task 1 |
| § "Out of scope" L171 | No jj-only inventory implementation | waived: excluded by spec |
| § "Out of scope" L172 | No new edit-less detector for in-place/non-wave callers | Task 1 |
| § "Out of scope" L173 | No local persona symlink or stale consumer cleanup | Task 4 |
