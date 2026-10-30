# Slim Subagent Dispatch Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace SDD's separate spec and code reviews with one integrated wave review, bounded direct report reads, and repairs on the current tree.

**Architecture:** Keep manifest-driven task ownership and the existing verification and conformance gates. Merge the reviewer persona, migrate its callers, and replace SDD's implement-phase protocol with one wave loop that integrates before review and exports repair deltas from committed snapshots. Extend existing telemetry reducers and cadence bookkeeping without changing the sealed record schema or pi-cohort's dispatch API.

**Tech Stack:** Markdown skills and personas, Node.js native TypeScript tests, JSON-schema output contracts, esbuild bundles, and the existing model-eval harness.

**Spec:** `doc/specs/2026-10-30-slim-subagent-dispatch.md`

**Verification:** `npm test` && `node eval/run.mjs subagent-driven-development` && `node eval/run.mjs wave-reviewer`

Baseline jjuraszek/pi-gauntlet: 70baf9f0

---

## Baseline and reconnaissance

Initial provenance for this amendment: repo jjuraszek/pi-gauntlet, HEAD 70baf9f0; porcelain inventory empty, In-flight none. The only admitted workflow paths are `doc/specs/2026-10-30-slim-subagent-dispatch.md` and `doc/plans/2026-10-30-slim-subagent-dispatch.md`. Endpoint proof command: `git diff --quiet 78ddf553 70baf9f0 -- . ':!doc/specs/' ':!doc/plans/'`. All three unchanged Tests commands were freshly executed on 70baf9f0 rather than retaining prior evidence: Task 1 passed 334 tests, Task 2 passed 77 tests and Task 3 passed 20 tests. After each run HEAD remained 70baf9f0 and porcelain remained empty; no artifact suffixes exist. Baselines describe the unmodified implementation, not evidence that the new behavior exists.

The first extension command on the original baseline omitted the CI stub loader and failed on missing host-runtime packages. Recon of `scripts/ci.mjs:436-449` corrected the command to the file-addressable loader invocation below; its replacement run passed 334 tests.

The single admitted leg is jjuraszek/pi-gauntlet at the supplied checkout. No companion mapping is needed. Root-to-task-path walks found no additional AGENTS.md or CLAUDE.md governing these paths; AGENTS.md files under unrelated eval fixtures do not apply. Combine the spec's Rules list with the forge-skill rule explicitly carried by instruction-edit tasks. No Happy path table, standalone formatter, scoped style CLI, or separate lint script is configured in the overrides/package scripts. The header's first command bundles style/size/model-literal checks, structural tests, package checks and bundle freshness; leave it to verify. Scoped test assertions and manual compact-table/ASCII review cover task-local instruction formatting.

Source seams: `extensions/lib/telemetry-collect.ts:32-57` owns reviewer recognition and tag counts; `extensions/telemetry.ts:678-721` consumes per-child results and findings; `extensions/phase-tracker.ts:139-147,811-816` owns cadence identities and the explicit comparison; `extensions/lib/phase-tracker-helpers.ts:33-74` owns dispatch labels. pi-cohort's installed `src/shared/formatters.ts:56-100` renders `## Outputs`, per-task headings and fenced JSON with a nested `structured` object, separately from `## Stop`. Keep parser fixtures faithful to that observed format.

The change is one non-deployable package change, not separately deployable stages. Wave 1's tasks own disjoint files and run independent temp-directory test fixtures. Wave 2 consumes the merged persona and extension identities. Wave 3 owns cross-cutting docs only. Intermediate commits need their scoped tests green; the final package gate runs after all waves. The cross-task migration inventories below transcribe shared spec-line literals; each worker edits only its own Files, not every path in those inventories.

## Files

**Extension integration - modify:** `extensions/lib/telemetry-collect.ts`, `extensions/lib/telemetry-collect.test.ts`, `extensions/telemetry.ts`, `extensions/telemetry.test.ts`, `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts`, `extensions/lib/phase-tracker-helpers.ts`, `extensions/lib/phase-tracker-helpers.test.ts`; regenerate the three committed bundles declared by Task 1.

**Reviewer and callers - create:** `agents/wave-reviewer.md`, `skills/requesting-code-review/wave-reviewer.md`, and the `eval/wave-reviewer/` files enumerated by Task 2. Modify the eight caller/template surfaces, three deterministic tests and four downstream eval expectations listed there, plus only the assembly-hash lines in `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md`. Delete the two old personas, the old requesting-code-review template, and both old reviewer eval targets.

**SDD protocol - modify:** `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/reference/dispatch-contract.md`, `skills/subagent-driven-development/stop-note.md`, `scripts/wave-review.test.mjs`, the SDD assertions in `scripts/anchored-task.test.mjs`, `scripts/ci.mjs`, and the SDD eval target metadata, retained samples and results. Create the merged SDD prompt and eleven sample pairs enumerated by Task 3. Delete both old SDD reviewer prompts, `reference/fix-loop.md`, and the four superseded sample/result directories.

**Cross-cutting docs - modify:** `doc/personas.md`, `doc/implement-engines.md`, `doc/configuration.md`, `README.md`, `CHANGELOG.md` with an Unreleased entry now, and the predecessor spec only if its already-present supersession banner needs correction. Do not edit the approved current spec during implementation except through amendment.

## Wave 1 - Reviewer and extension foundations

### Task 1: Credit merged reviews in telemetry and cadence
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-30-slim-subagent-dispatch.md § "Acceptance criteria" L52, § "Extensions" L184, § "Extensions" L185, § "Extensions" L186, § "Extensions" L187, § "Removals and additions" L195, § "Removals and additions" L196, § "Removals and additions" L200, § "Errors and edge cases" L223, § "Tests" L243, § "Tests" L244

**Files:**
- Modify: `extensions/lib/telemetry-collect.ts:32-57`
- Modify: `extensions/lib/telemetry-collect.test.ts`
- Modify: `extensions/telemetry.ts:678-721`
- Modify: `extensions/telemetry.test.ts:749-802`
- Modify: `extensions/phase-tracker.ts:139-147`
- Modify: `extensions/phase-tracker.test.ts`
- Modify: `extensions/lib/phase-tracker-helpers.ts:33-74`
- Modify: `extensions/lib/phase-tracker-helpers.test.ts:135-152`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/telemetry-collect.test.ts`
- Test: `extensions/lib/phase-tracker-helpers.test.ts`
- Test: `extensions/phase-tracker.test.ts`
- Test: `extensions/telemetry.test.ts`

**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/telemetry-collect.test.ts extensions/lib/phase-tracker-helpers.test.ts extensions/phase-tracker.test.ts extensions/telemetry.test.ts`
- baseline: 70baf9f0 pass
- via: `countStructuredFindings(text)`, `countFindings`, `REVIEWER_AGENTS`, `dispatchLabel`, `CADENCE_AGENTS`, Guard 5 and the telemetry subagent tool-result handler

Decision: use the CI stub loader for extension integration tests, not an installed host-runtime dependency - `scripts/ci.mjs:436-449`. Keep `countFindings` tag parsing and the historical sealed schema unchanged; active collection and historical interpretation are separate concerns.

- [ ] **Step 1: Confirm the existing extension tests pass.** Run the Tests command; expected all tests pass, with nonzero test count.
- [ ] **Step 2: Add structured telemetry fixtures.** In the existing reducer tests, feed a real file-only carrier containing `## Outputs`, a fenced JSON object with `structured.findings: { critical: 1, moderate: 2, minor: 3 }`, and an `Output saved to:` pointer. Expect `{ blocker: 1, major: 2, minor: 3 }`. Add zero-count, absent/malformed structured object, unrelated fenced JSON outside Outputs, and repeated Stop-summary cases; valid zero counts must not fall through to tag parsing. Keep a separate historical tag fixture naming `spec-reviewer` / `code-reviewer`.
- [ ] **Step 3: Add integration and cadence regressions.** Change live reviewer fixtures in `extensions/telemetry.test.ts:749-802` to `wave-reviewer` and assert file-only findings reach derived totals without counting the same structured result and inline tags twice. Table-test code and documentation commits with no reviewer, a stale reviewer and a newer completed reviewer. Update label tests to expect `wave-review` and no `implement+sr` special case. Run Tests and confirm the new cases fail against the old identities/parser.
- [ ] **Step 4: Implement the reducer and its consumer.** Export `countStructuredFindings(text)` from `telemetry-collect`, returning usable counts only for a valid structured `findings` payload; use the existing `{ blocker, major, minor }` accumulator shape. At `extensions/telemetry.ts:698` prefer that result, otherwise call `countFindings(text)`. Set `REVIEWER_AGENTS` at `extensions/lib/telemetry-collect.ts:33` to `{"wave-reviewer", "conformance-reviewer"}` without rewriting stored historical records. Do not add a record version, event type or name-normalization migration.
- [ ] **Step 5: Implement cadence and labels.** In `phase-tracker`, set `CADENCE_AGENTS` at `extensions/phase-tracker.ts:139` to `["implementer", "wave-reviewer"]`; change Guard 5's actual condition at `extensions/phase-tracker.ts:815-816` to `cadenceLastSeen.implementer > cadenceLastSeen["wave-reviewer"]`, not merely the array. Update `REVIEW_CADENCE_WARNING` to one wave review after the last `implementer` for both code and docs. At `extensions/lib/phase-tracker-helpers.ts:38,68,70`, map `wave-reviewer` to `wave-review`; remove the two retired dispatch-label entries and the fused-label branch.
- [ ] **Step 6: Run Tests, format locally, regenerate bundles.** Preserve surrounding TypeScript style; run Tests until green. Run `npm run build:bins` and keep any generated changes in the three declared bundles; never hand-edit them. Recheck the scoped tests. Full bundle freshness/style remains the header gate.
- [ ] **Step 7: Commit the extension change.** Stage only this task's source, tests and regenerated bundles; use bare `git add` and `git commit -m "Credit merged wave reviews in telemetry and cadence"` in the worker checkout.

Shared removal inventory (the extension slice belongs here; callers and instruction slices belong to Tasks 2-3): `agents/spec-reviewer.md`, `agents/code-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, `skills/subagent-driven-development/reference/fix-loop.md`, `SKILL.md`, `## Fix-Loop Rounds`, `## Spec-review snapshots`, `## Dispatch`, `reference/dispatch-contract.md`, `SPEC_VERDICT_SCHEMA`, `CODE_VERDICT_SCHEMA`, `WAVE_VERDICT_SCHEMA`, `## Orchestrator holds`, `phase-tracker-helpers.ts`, `eval/spec-reviewer/`, `eval/code-reviewer/`, `chain-wave-dispatch`, `report-by-path-fix`, `patch-review-snapshot`, `test-gate-repair`, `requesting-code-review/SKILL.md:10,28,34,36,40,43,78`, `code-reviewer.md`, `wave-reviewer.md`, `loop-implementation/SKILL.md:220`, `chase-bug/hotfix.md:123`, `verification-before-completion/reference/conformance-check.md:196`, `gatekeep-pr/SKILL.md:42`, `gatekeep-pr/reference/assessment.md:88`, `gatekeep-pr/reference/sync.md:56`, `finishing-a-development-branch/reference/disposition-protocol.md:46`, `## After All Tasks Complete`, `dispatching-parallel-agents/SKILL.md:131`, `:194`, `scripts/ci.mjs:192-195`, `spec-reviewer-prompt.md`, `Behaviour-change:`, and the `never default to \`no\`` pin at `ci.mjs:196`.

Shared additions inventory (do not edit sibling-owned files): `agents/wave-reviewer.md`, `skills/subagent-driven-development/wave-reviewer-prompt.md`, `## The Wave Loop`, `repair-base-shell`, `WAVE_VERDICT_SCHEMA`, `countStructuredFindings`, `scripts/ci.mjs`, `skills/**/*.md`, `agents/*.md`, `agent: "spec-reviewer"`, `agent: "code-reviewer"`, `extensions/`, `Superseded by`, `eval/wave-reviewer/`, `with-anchor`, `without-anchor`, `unreadable-anchor`, `partial-wave-ship`, `SHIP`, `one-review-per-wave`, `direct-report-read`, `repair-on-top`, `gate-repair-before-review`, `empty-delta-attempt`, `apply-failure-rebuild`, `escalation-same-tree`, `failed[n] == 2`, `implModel`, `convergence-exception`, `funded-failure-stop`, `reject-stop`, `blocked-resume-tree`, `eval/subagent-driven-development/intent.md`, `eval/wave-reviewer/intent.md`, `doc/personas.md`, `doc/implement-engines.md`, `doc/configuration.md`, `README.md`, `subagents.agentOverrides.code-reviewer`, `.spec-reviewer`, `agentOverrides.wave-reviewer`, `doc/personas.md:32-35`, `doc/configuration.md:69`, `## Unreleased`. The companion migration is `skills/subagent-driven-development/stop-note.md` at `:3-11` and `:36-44`, including its `reference/fix-loop.md` link; Task 3 owns that text, this task owns the telemetry integration assertions. Task 2 owns the `for:`-only refreshes in `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md` after reviewer-reference migration, preserving bodies, expected moves and gates.

### Task 2: Merge the reviewer persona and retarget other callers
Leg: jjuraszek/pi-gauntlet
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested instruction behavior - update deterministic assertions before the persona and callers.

**Spec:** doc/specs/2026-10-30-slim-subagent-dispatch.md § "Acceptance criteria" L48, § "Acceptance criteria" L50, § "Acceptance criteria" L54, § "The merged persona" L171, § "The merged persona" L173, § "The merged persona" L174, § "The merged persona" L175, § "The merged persona" L176, § "The merged persona" L178, § "The merged persona" L180, § "Removals and additions" L195, § "Removals and additions" L196, § "Removals and additions" L198, § "Removals and additions" L200, § "Removals and additions" L202, § "Errors and edge cases" L224, § "Tests" L240, § "Tests" L241, § "Out of scope" L258, § "Out of scope" L259, § "Out of scope" L260, § "Out of scope" L261

**Files:**
- Create: `agents/wave-reviewer.md`
- Create: `skills/requesting-code-review/wave-reviewer.md`
- Modify: `skills/requesting-code-review/SKILL.md:10-79`
- Modify: `skills/loop-implementation/SKILL.md`
- Modify: `skills/verification-before-completion/reference/conformance-check.md`
- Modify: `skills/chase-bug/hotfix.md`
- Modify: `skills/gatekeep-pr/SKILL.md`
- Modify: `skills/gatekeep-pr/reference/assessment.md`
- Modify: `skills/gatekeep-pr/reference/sync.md`
- Modify: `skills/finishing-a-development-branch/reference/disposition-protocol.md`
- Modify: `skills/dispatching-parallel-agents/SKILL.md`
- Modify: `scripts/anchored-task.test.mjs`
- Modify: `scripts/loop-engine-contract.test.mjs`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Modify: `eval/gatekeep-pr/intent.md`
- Modify: `eval/gatekeep-pr-scope/intent.md`
- Modify: `eval/gatekeep-pr/samples/conflict-free-sync/expected.md`
- Modify: `eval/gatekeep-pr/samples/conflicting-file-sync/expected.md`
- Modify: `eval/gatekeep-pr/samples/scoped-test-red-sync/expected.md`
- Modify: `eval/loop-implementation/samples/verify-lifecycle/expected.md`
- Create: `eval/wave-reviewer/target.json`
- Create: `eval/wave-reviewer/README.md`
- Create: `eval/wave-reviewer/replay.md`
- Create: `eval/wave-reviewer/intent.md`
- Create: `eval/wave-reviewer/report.md`
- Create: `eval/wave-reviewer/results/`
- Create: `eval/wave-reviewer/samples/with-anchor/case.md`
- Create: `eval/wave-reviewer/samples/with-anchor/expected.md`
- Create: `eval/wave-reviewer/samples/without-anchor/case.md`
- Create: `eval/wave-reviewer/samples/without-anchor/expected.md`
- Create: `eval/wave-reviewer/samples/unreadable-anchor/case.md`
- Create: `eval/wave-reviewer/samples/unreadable-anchor/expected.md`
- Create: `eval/wave-reviewer/samples/partial-wave-ship/case.md`
- Create: `eval/wave-reviewer/samples/partial-wave-ship/expected.md`
- Test: `scripts/anchored-task.test.mjs`
- Test: `scripts/loop-engine-contract.test.mjs`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`
- Delete: `agents/code-reviewer.md`
- Delete: `agents/spec-reviewer.md`
- Delete: `skills/requesting-code-review/code-reviewer.md`
- Delete: `eval/code-reviewer/`
- Delete: `eval/spec-reviewer/`

**Tests:**
- `node --test scripts/anchored-task.test.mjs scripts/loop-engine-contract.test.mjs scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 70baf9f0 pass
- via: `wave-reviewer`, anchored task selection, loop verification and gatekeep sync dispatch contracts

Decision: preserve the old code-reviewer's frontmatter byte-for-byte except the explicitly authorized `name:` and routing-label `description:`. Its existing tool profile already supports read-only scoped tests; do not introduce a model or thinking pin. Existing deterministic frontmatter hashes in anchored-task.test.mjs must become field-aware comparisons for those two allowed edits, rather than accepting arbitrary frontmatter drift. Leave that test's SDD template assertions on the existing templates in this wave; Task 3 migrates those assertions with the SDD prompt.

Decision: compute each gatekeep intent's `for:` as `sha256(assemble(config, read))` using its own target.json bundle-free assembly after reviewer-reference migration, not a commit SHA - `scripts/gatekeep-comment-reconcile.test.mjs:41-58`, `eval/lib/intent.mjs` and `eval/README.md:118`. Keep both intent bodies and expected moves byte-identical; only their first-line hashes change. The two targets' differing assembly modes and file order require separate hashes.

- [ ] **Step 1: Run Tests and add the renamed persona assertions.** Retain exact task-prefix selection (`### Task 4:` must not select Task 40), unreadable-anchor identity, selected Rules/Leg merging and task Tests metadata checks. Assert the new name and absence of old persona files, preserving the implementer and conformance contracts. Change downstream caller-name checks only, then run Tests to see failures before renaming.
- [ ] **Step 2: Author the merged persona.** Base it on code-reviewer.md's whole prompt, not a reference loader. Set `name: wave-reviewer` and the spec's routing-label `description:`. Preserve `tools`, `defaultContext`, `inheritProjectContext`, `inheritSkills`, `systemPromptMode`, `completionGuard: false` and absence of `thinking:`. When `anchors` and `Spec:` are supplied, read only the selected tasks' cited spec ranges, decompose their union and emit a clause table before findings. Use `met | unmet | out-of-scope` with `file:line` or test evidence. Omitted later-wave clauses are not failures; missing in-slice requirements remain failures even if task prose dropped them. Unreadable anchors return `REJECT` and `anchorUnreadable`.
- [ ] **Step 3: Preserve reviewer judgments and footer semantics.** Keep `[Critical]`, `[Moderate]`, `[Minor]` findings with spec-observable test requirements, `Rules:` / `Leg:` loading, whole-file reads and repair-only `## Fix delta` scope. Any `unmet` / `out-of-scope` row forces at least `FIX_FIRST`; Minor-only findings mean `SHIP`. Without spec anchors, omit the clause table. Emit `SHIP | FIX_FIRST | REJECT`, unchanged `Parallel-safe:` grammar and re-review-only `TRAJECTORY:`; remove `Behaviour-change:` and `behaviourChange`. Mirror `verdict`, `reasoning`, `findingCount` and nonnegative `findings` (`{ critical, moderate, minor }`); optional `maxSeverity` (`Critical | Moderate | Minor`), `parallelSafe`, `touchedTasks`, `trajectory` (`{ verdict, line }`), `anchorUnreadable`, `clauses` (array of `{ clause, status: met | unmet | out-of-scope, evidence }`). Task 3's `WAVE_VERDICT_SCHEMA` sets `additionalProperties: false` and must match this persona.
- [ ] **Step 4: Retarget the non-SDD callers.** Rename requesting-code-review's template to wave-reviewer.md and update its links, mandatory-wave description and dispatch. Retarget `loop-implementation`, `verification-before-completion`, `chase-bug`, `gatekeep-pr` skill/assessment/sync and `finishing-a-development-branch` disposition-protocol to `wave-reviewer`, without supplying spec anchors or changing their gates. Change `dispatching-parallel-agents`' structural probe and agent-choice line to the merged reviewer and remove its obsolete SR-only finding category. Keep `conformance-reviewer` behavior and `/skill:loop-implementation` protocol unchanged. Keep builtin `scout` / `delegate`, pi-cohort spawn mechanics, settings and dispatch API unchanged. Delete both retired persona files only after all declared callers are migrated. Route unlisted moving parts through `reference/amendment-surface.md`.
- [ ] **Step 5: Build the merged eval target.** Follow eval/_template and the existing reviewer target's assembly conventions. `with-anchor` proves an unmet in-slice clause blocks shipping; `partial-wave-ship` supplies a two-wave spec and verifies the first wave ships without rows for the second wave; `unreadable-anchor` rejects with exact identity; `without-anchor` verifies findings-only reporting, Minor-only SHIP and no Behaviour-change line. Reuse the old anchored-task fixture's Task 4/Task 40 decoy and quality-test calibration in these scenarios. Write target README, replay and intent; remove old target directories and their stale results. Use the eval harness's `new: true` declaration for candidate-only files absent at the baseline, per eval/README.md; do not invent baseline records.
- [ ] **Step 6: Retarget the four downstream eval expectations, refresh intent hashes and run Tests.** Change only reviewer references in `eval/gatekeep-pr/samples/{conflict-free-sync,conflicting-file-sync,scoped-test-red-sync}/expected.md` and `eval/loop-implementation/samples/verify-lifecycle/expected.md`. After the approved reviewer-reference migrations, compute each target's candidate assembly hash with the existing `assemble` and `sha256` helpers used by `scripts/gatekeep-comment-reconcile.test.mjs`; replace only `for:` in `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md`. Preserve their intent bodies, expected moves and gatekeep-pr gate semantics; do not rewrite target configurations or fabricate model results. Rerun this task's exact scoped Tests command before committing; expected green, including the course replay assembly assertions for both targets. Model-generated report and results paths are task-owned outputs of the full target run at verification, not fabricated evidence. Verification owns `npm test`, `node eval/run.mjs subagent-driven-development`, and `node eval/run.mjs wave-reviewer`; commit the real reports produced there.
- [ ] **Step 7: Review formatting and commit.** Follow forge-skill's imperative/minimal-diff rules, compact tables and ASCII punctuation. Preserve untouched persona frontmatter. Stage this task's paths and use `git commit -m "Merge spec and code review into wave-reviewer"`; describe this as a behavior-changing instruction edit in the commit body. Commit real eval reports when verification produces them.

Shared removal inventory (caller/persona slice here, protocol slice in Task 3, extension slice in Task 1): `agents/spec-reviewer.md`, `agents/code-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, `skills/subagent-driven-development/reference/fix-loop.md`, `SKILL.md`, `## Fix-Loop Rounds`, `## Spec-review snapshots`, `## Dispatch`, `reference/dispatch-contract.md`, `SPEC_VERDICT_SCHEMA`, `CODE_VERDICT_SCHEMA`, `WAVE_VERDICT_SCHEMA`, `## Orchestrator holds`, `implement+sr`, `phase-tracker-helpers.ts`, `spec-reviewer`, `code-reviewer`, `CADENCE_AGENTS`, `REVIEWER_AGENTS`, `eval/spec-reviewer/`, `eval/code-reviewer/`, `chain-wave-dispatch`, `report-by-path-fix`, `patch-review-snapshot`, `test-gate-repair`, `requesting-code-review/SKILL.md:10,28,34,36,40,43,78`, `code-reviewer.md`, `wave-reviewer.md`, `loop-implementation/SKILL.md:220`, `chase-bug/hotfix.md:123`, `verification-before-completion/reference/conformance-check.md:196`, `gatekeep-pr/SKILL.md:42`, `gatekeep-pr/reference/assessment.md:88`, `gatekeep-pr/reference/sync.md:56`, `finishing-a-development-branch/reference/disposition-protocol.md:46`, `## After All Tasks Complete`, `dispatching-parallel-agents/SKILL.md:131`, `:194`, `scripts/ci.mjs:192-195`, `spec-reviewer-prompt.md`, `Behaviour-change:`, and the `never default to \`no\`` pin at `ci.mjs:196`.

Shared migration inventory: Task 3 owns `skills/subagent-driven-development/stop-note.md` at `:3-11` and `:36-44`, removing its `reference/fix-loop.md` link and preserving human-facing grammar. Task 1 owns `extensions/telemetry.test.ts:749-802` active-review assertions. This task owns only the two gatekeep intent `for:` hash refreshes from the amended migration paragraph.

Shared additions inventory (only edit this task's Files): `agents/wave-reviewer.md`, `skills/subagent-driven-development/wave-reviewer-prompt.md`, `## The Wave Loop`, `repair-base-shell`, `WAVE_VERDICT_SCHEMA`, `wave-review`, `countStructuredFindings`, `scripts/ci.mjs`, `skills/**/*.md`, `agents/*.md`, `agent: "spec-reviewer"`, `agent: "code-reviewer"`, `extensions/`, `skills/`, `agents/`, `Superseded by`, `eval/wave-reviewer/`, `one-review-per-wave`, `direct-report-read`, `repair-on-top`, `gate-repair-before-review`, `empty-delta-attempt`, `apply-failure-rebuild`, `escalation-same-tree`, `failed[n] == 2`, `implModel`, `convergence-exception`, `funded-failure-stop`, `reject-stop`, `blocked-resume-tree`, `eval/subagent-driven-development/intent.md`, `eval/wave-reviewer/intent.md`, `doc/personas.md`, `doc/implement-engines.md`, `doc/configuration.md`, `README.md`, `subagents.agentOverrides.code-reviewer`, `.spec-reviewer`, `agentOverrides.wave-reviewer`, `doc/personas.md:32-35`, `doc/configuration.md:69`, `## Unreleased`.

Shared eval migration inventory: retain/rewrite `expected.md` scenarios `delegated-source-investigation`, `repair-compaction-recovery`, `leg-cwd`, `integrated-wave-repair`, `all-singleton-waves`, `singleton-apply-failure`, `snapshot-apply-failure`, `stagnant-under-budget`, `third-attempt-escalated`, `multi-task-wave-ledger`, `budget-*`, `chain-stop-blocked`, `no-plan-read-wave`; keep `delegated-amendment` unchanged. Task 3 owns `scripts/wave-review.test.mjs`, `fix-loop.md`, `spec-review-snapshot-shell`, `fix-delta-tree-shell`, `implementer`, and `eval/subagent-driven-development/target.json` migration: `skillFiles` lose `reference/fix-loop.md` and `code-quality-reviewer-prompt.md`, gain `wave-reviewer-prompt.md`. This task owns the four clause scenarios at `eval/wave-reviewer/samples/{with-anchor,partial-wave-ship,unreadable-anchor,without-anchor}` and the non-SDD caller tests.

## Wave 2 - Integrated review and repair protocol

Depends on Wave 1: the protocol dispatches the new reviewer identity, and final CI expects the renamed callers and extension contracts. One task owns both protocol text and its coupled deterministic/eval assertions; the later edit to anchored-task.test.mjs migrates only its SDD template assertions.

### Task 3: Replace SDD chains with the integrated wave loop
Leg: jjuraszek/pi-gauntlet
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested instruction behavior - add the new structural and shell-fixture assertions before replacing the protocol.

**Spec:** doc/specs/2026-10-30-slim-subagent-dispatch.md § "Problem" L20, § "Acceptance criteria" L38, § "Acceptance criteria" L40, § "Acceptance criteria" L42, § "Acceptance criteria" L44, § "Acceptance criteria" L46, § "Acceptance criteria" L48, § "Acceptance criteria" L50, § "Acceptance criteria" L54, § "Acceptance criteria" L56, § "Acceptance criteria" L58, § "Orchestrator frame (kept)" L96, § "Orchestrator frame (kept)" L98, § "The wave loop (rewritten)" L102-L104, § "The wave loop (rewritten)" L105, § "The wave loop (rewritten)" L106, § "The wave loop (rewritten)" L107, § "The wave loop (rewritten)" L108, § "The wave loop (rewritten)" L109, § "The wave loop (rewritten)" L110, § "The wave loop (rewritten)" L111, § "The wave loop (rewritten)" L113, § "The wave loop (rewritten)" L114-L116, § "The wave loop (rewritten)" L118-L134, § "The wave loop (rewritten)" L136, § "The wave loop (rewritten)" L140, § "The wave loop (rewritten)" L141, § "The wave loop (rewritten)" L142, § "The wave loop (rewritten)" L143, § "The wave loop (rewritten)" L144-L145, § "The wave loop (rewritten)" L146, § "The wave loop (rewritten)" L147, § "The wave loop (rewritten)" L148, § "The wave loop (rewritten)" L149-L150, § "The wave loop (rewritten)" L151-L152, § "The wave loop (rewritten)" L154, § "Rebuild (the one automatic path)" L158, § "Escalation and funding (folded in, semantics kept)" L162, § "Escalation and funding (folded in, semantics kept)" L163, § "Escalation and funding (folded in, semantics kept)" L164, § "Escalation and funding (folded in, semantics kept)" L165-L167, § "The merged persona" L178, § "The merged persona" L180, § "Transcript lines and recovery" L191, § "Removals and additions" L195, § "Removals and additions" L196, § "Removals and additions" L198, § "Removals and additions" L200, § "Removals and additions" L202, § "Errors and edge cases" L208-L213, § "Errors and edge cases" L214-L219, § "Errors and edge cases" L220-L222, § "Tests" L228, § "Tests" L229, § "Tests" L230, § "Tests" L231, § "Tests" L232, § "Tests" L233, § "Tests" L234, § "Tests" L235, § "Tests" L236, § "Tests" L237, § "Tests" L238, § "Tests" L239, § "Tests" L241, § "Tests" L242, § "Tests" L245, § "Tests" L246, § "Out of scope" L258, § "Out of scope" L260, § "Out of scope" L263

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/reference/dispatch-contract.md`
- Modify: `skills/subagent-driven-development/stop-note.md`
- Create: `skills/subagent-driven-development/wave-reviewer-prompt.md`
- Modify: `scripts/wave-review.test.mjs`
- Modify: `scripts/anchored-task.test.mjs`
- Modify: `scripts/ci.mjs`
- Modify: `eval/subagent-driven-development/target.json`
- Modify: `eval/subagent-driven-development/README.md`
- Modify: `eval/subagent-driven-development/replay.md`
- Modify: `eval/subagent-driven-development/intent.md`
- Modify: `eval/subagent-driven-development/report.md`
- Modify: `eval/subagent-driven-development/results/**`
- Modify: `eval/subagent-driven-development/samples/*/case.md`
- Modify: `eval/subagent-driven-development/samples/*/expected.md`
- Create: `eval/subagent-driven-development/samples/one-review-per-wave/case.md`
- Create: `eval/subagent-driven-development/samples/one-review-per-wave/expected.md`
- Create: `eval/subagent-driven-development/samples/direct-report-read/case.md`
- Create: `eval/subagent-driven-development/samples/direct-report-read/expected.md`
- Create: `eval/subagent-driven-development/samples/repair-on-top/case.md`
- Create: `eval/subagent-driven-development/samples/repair-on-top/expected.md`
- Create: `eval/subagent-driven-development/samples/gate-repair-before-review/case.md`
- Create: `eval/subagent-driven-development/samples/gate-repair-before-review/expected.md`
- Create: `eval/subagent-driven-development/samples/empty-delta-attempt/case.md`
- Create: `eval/subagent-driven-development/samples/empty-delta-attempt/expected.md`
- Create: `eval/subagent-driven-development/samples/apply-failure-rebuild/case.md`
- Create: `eval/subagent-driven-development/samples/apply-failure-rebuild/expected.md`
- Create: `eval/subagent-driven-development/samples/escalation-same-tree/case.md`
- Create: `eval/subagent-driven-development/samples/escalation-same-tree/expected.md`
- Create: `eval/subagent-driven-development/samples/convergence-exception/case.md`
- Create: `eval/subagent-driven-development/samples/convergence-exception/expected.md`
- Create: `eval/subagent-driven-development/samples/funded-failure-stop/case.md`
- Create: `eval/subagent-driven-development/samples/funded-failure-stop/expected.md`
- Create: `eval/subagent-driven-development/samples/reject-stop/case.md`
- Create: `eval/subagent-driven-development/samples/reject-stop/expected.md`
- Create: `eval/subagent-driven-development/samples/blocked-resume-tree/case.md`
- Create: `eval/subagent-driven-development/samples/blocked-resume-tree/expected.md`
- Test: `scripts/wave-review.test.mjs`
- Test: `scripts/anchored-task.test.mjs`
- Delete: `skills/subagent-driven-development/spec-reviewer-prompt.md`
- Delete: `skills/subagent-driven-development/code-quality-reviewer-prompt.md`
- Delete: `skills/subagent-driven-development/reference/fix-loop.md`
- Delete: `eval/subagent-driven-development/samples/chain-wave-dispatch/`
- Delete: `eval/subagent-driven-development/samples/report-by-path-fix/`
- Delete: `eval/subagent-driven-development/samples/patch-review-snapshot/`
- Delete: `eval/subagent-driven-development/samples/test-gate-repair/`
- Delete: `eval/subagent-driven-development/results/chain-wave-dispatch/`
- Delete: `eval/subagent-driven-development/results/report-by-path-fix/`
- Delete: `eval/subagent-driven-development/results/patch-review-snapshot/`
- Delete: `eval/subagent-driven-development/results/test-gate-repair/`

**Tests:**
- `node --test scripts/wave-review.test.mjs`
- baseline: 70baf9f0 pass
- via: `## The Wave Loop`, `repair-base-shell`, `fix-delta-tree-shell`, `WAVE_VERDICT_SCHEMA`, direct report reading and transcript recovery

Decision: use a one-step chain, not top-level tasks, because the installed pi-cohort carrier exposes item outputSchema and `## Outputs` through step-level stopOn. Preserve the existing diagnosis and amendment carriers; this task changes report relays, not delegated source/spec reads. The existing predecessor banner already resolves to the current spec; add a CI assertion rather than manufacture a second banner. The deterministic scoped file exercises protocol and schema changes; the header gate also runs the migrated anchored-template assertions.

- [ ] **Step 1: Run Tests and replace obsolete assertions.** Migrate old SR-chain, spec-review-snapshot-shell and fix-loop-file assertions into implementer-only dispatch, post-gate wave review and current-tree repair assertions. Keep actual `fix-delta-tree-shell` execution coverage and runtime peer-floor fixtures. Change the Rules sentence check to implementer, wave-reviewer and conformance-reviewer. Assert deletion of the retired personas/prompts/samples, the new sample inventory, and retained diagnosis/amendment behavior. Update the SDD-template cases in anchored-task.test.mjs when replacing their prompts. Expected red until the new protocol exists.
- [ ] **Step 2: Add executable snapshot and delta fixtures.** Reuse wave-review.test.mjs's mkdtemp/git helpers. Create a base, sibling patch and task patch containing both additions and edits; execute the spec's `repair-base-shell`, require a clean committed RP_TREE with both siblings present, commit a repair there and apply only its delta to the integrated tree once. Verify siblings and additions survive, branch HEAD stays at WAVE_BASE_SHA until the accepted-wave commit, and scratch tree capture does not mutate live staging. Add a rebuild partition fixture proving a new `Test`/`Create` path is removed rather than restored and sibling paths survive; deduplicate existing `Modify`/`Test` paths after excluding all Create paths. Fixtures use isolated temp directories and no shared runtime port.
- [ ] **Step 3: Rewrite the orchestrator read boundary.** Preserve preflight, mode selection, `plan_tracker` lifecycle, `## Implementer Status` and `## Leg routing`. Keep plan/spec/source reads delegated and `planPath`/heading anchors manifest-driven through `plan_check`. Consume structured `status`, `verdict`, `maxSeverity`, `findingCount`, `findings`, `touchedTasks`, `trajectory`, `concerns`, `question`, `anchorUnreadable` first. Allow one `read` with `limit: 300` per printed report-path observation only when `DONE_WITH_CONCERNS` concerns, `BLOCKED` / `NEEDS_CONTEXT` question evidence or `FIX_FIRST`/`REJECT` findings are needed. Never paginate beyond the bound. If the `Verdict`/`TRAJECTORY:` footer is not reached, re-dispatch the same reviewer once with `Compact report: findings and footer only, at most 150 lines`; a second oversized report stops. Remove report-relay wording from both owning files. Migrate stop-note.md's delegated-report-read mandate at `:3-11`, removed `reference/fix-loop.md` link and unavailable-settings-tool exemption at `:36-44`, preserving its human-facing template. Do not dispatch `scout` or `delegate` to read child reports; retain their source-fact lookup role.
- [ ] **Step 4: Replace initial dispatch and integration.** Keep the independence check over manifest `files`, fixed `WAVE_BASE_SHA` and increasing tracker-index starts. Dispatch only implementers in one `parallel` chain step: invocation `async: false`, `context: "fresh"`, owning checkout `cwd`; step `worktree: true`, concurrency 4 and status `stopOn`; item `IMPLEMENTER_STATUS_SCHEMA`, as/output/file-only/task metadata. Top-level `tasks` is not the carrier. Isolated workers get only their own manifest `tests` as `SCOPED_TEST_COMMANDS`; `"mode":"in-place"` workers get the wave union and no `worktree:` flag. Integrate `DONE`/`DONE_WITH_CONCERNS` patches in plan order with `git apply --index`. Initial `apply failed` retains staged siblings and stops; it does not rebuild or split a new wave. In-place workers require no apply.
- [ ] **Step 5: Move the gate before one review.** Run wave-union commands separately into gate logs and print each exit. Red gates attribute owners from manifest tests and enter repair before any review, even for DONE. Green code and doc waves each dispatch exactly one initial `wave-reviewer`, fresh/read-only/foreground, after staging deliverables, over `BASE_SHA: WAVE_BASE_SHA` and `HEAD_SHA: WORKTREE`. Pass wave `anchors`, absolute home `Spec:`, wave scoped tests or `none` (`SCOPED_TEST_COMMANDS: none` for docs), `WAVE_VERDICT_SCHEMA`, and `stopOn: { path: "/verdict", in: ["FIX_FIRST", "REJECT"] }`. Record the review tree using the existing scratch-index recipe. SHIP commits; FIX_FIRST repairs; REJECT stops.
- [ ] **Step 6: Replace reviewer schemas and the SDD prompt.** In dispatch-contract replace `SPEC_VERDICT_SCHEMA` and `CODE_VERDICT_SCHEMA` with WAVE_VERDICT_SCHEMA: required `verdict` (`SHIP | FIX_FIRST | REJECT`), `reasoning`, `findingCount`, `findings` (`{ critical, moderate, minor }` nonnegative integers); optional `maxSeverity` (`Critical | Moderate | Minor`), `parallelSafe`, `touchedTasks`, `trajectory` (`{ verdict, line }`), `anchorUnreadable`, `clauses` (array of `{ clause, status: met | unmet | out-of-scope, evidence }`); `additionalProperties: false`; no `behaviourChange`. Keep IMPLEMENTER_STATUS_SCHEMA, diagnosis, answer and amendment schemas unchanged. Create wave-reviewer-prompt.md with the anchored wave union and saved report paths, then the existing re-review marker, trajectory grammar and Fix delta tree-pair instructions. Delete the two old SDD review prompts and behavior-change rerouting. Keep source fact lookup delegation, not report relay delegation.
- [ ] **Step 7: Implement repair-on-top.** Attribute each finding to its manifest file owner, falling back to structured touchedTasks; preserve every finding. Unowned findings stop with `Recommendation: spec/plan amendment` through `reference/implement-amendments.md`. For isolated waves, embed the repair-base-shell block below exactly: stage integrated deliverables, redirect the binary cached diff to RP_DIR/integrated.patch, create a detached base checkout, apply that file and commit the snapshot with the specified local identity. Never read the patch in the primary. Dispatch one implementer per attributed task from clean RP_TREE with worktree isolation, findings or gate log, task anchors, prior report under `## Previous review report` and task tests, without a fresh-context override or prior-patch path. Apply its `Artifacts:` delta to the integrated tree and remove the successful snapshot. In-place repairs edit the branch directly, use wave tests, and print `delta none applied n/a` without snapshot or apply.

  Copy this marked recipe into the owning skill; the writer does not execute it:

<!-- repair-base-shell -->
```bash
RP_ROOT={{WORKTREE}}
RP_BASE={{BASE_SHA}}
RP_DIR=$(mktemp -d) || exit 1
RP_TREE="$RP_DIR/tree"
git -C "$RP_ROOT" add -A || exit 1
git -C "$RP_ROOT" diff --binary --cached "$RP_BASE" > "$RP_DIR/integrated.patch" || exit 1
git -C "$RP_ROOT" worktree add --detach "$RP_TREE" "$RP_BASE" || exit 1
if [ -s "$RP_DIR/integrated.patch" ]; then git -C "$RP_TREE" apply --index "$RP_DIR/integrated.patch" || exit 1; fi
git -C "$RP_TREE" -c user.name=gauntlet -c user.email=gauntlet@local commit -q --allow-empty -m "wave integrated snapshot" || exit 1
printf 'repair-base: %s %s\n' "$RP_TREE" "$(git -C "$RP_TREE" rev-parse HEAD)"
```

The redirected `diff --binary --cached` writes a file and loads nothing into the orchestrator's context; the orchestrator never reads `integrated.patch`.

- [ ] **Step 8: Implement post-repair and rebuild transitions.** Stage, compare against the pre-repair tree with `diff --stat`, count an empty delta as a failed attempt and resend "your fix changed no tracked file" without review. Run touched-task tests; only green results get one wave re-review with `## Previous review report (re-review trigger)` and `## Fix delta` tree pair, keeping original `BASE_SHA`. A repair-delta apply failure alone automatically rebuilds: print `rebuild: task 3 - delta apply failed` for task 3, consume an attempt, remove every Create path first with `git -C <worktree> rm -q -f --ignore-unmatch -- <paths>`, then restore only pre-existing Modify/Test paths, deduplicated and excluding every Create path, with `git -C <worktree> restore --source="$WAVE_BASE_SHA" --staged --worktree -- <paths>`. Snapshot the remaining sibling-integrated tree and dispatch the original payload at the next counter-authorized attempt. A failed rebuild patch hard-stops; a successful rebuilt task rejoins the same union gate, re-review and single wave commit. The human may request this same recipe at a stop; BLOCKED/NEEDS_CONTEXT never automatically triggers it.
- [ ] **Step 9: Fold the complete transition table into The Wave Loop.** Track `failed[n]`, `escalated[n]`, `converged[n]` and per-task funded spending. Red gate, dispatch/error recovery (diagnosis `repair`), empty delta, failed delta apply and attributed FIX_FIRST increment the appropriate task counters. `TRAJECTORY: STAGNANT` or malformed/missing re-review trajectory sets `failed[n] = 2`; funded `STAGNANT` stops. `TRAJECTORY: CONVERGING` or `DIVERGING` repairs while `failed[n] < 2`. At `failed[n] == 2` allow the one-time `CONVERGING` exception only without `max severity Critical`; a further FIX_FIRST escalates regardless of trajectory (`> 2` after the exception). Otherwise run the once-per-task escalation independent of `**Amend-grant:**`. Resolve `gauntlet_setting({ key: "escalationLoop" })` at runtime, stop on missing `implModel`/settings, and use that model on the current tree with unchanged payload. Funding adds rounds only after escalation, spends on failures, never supplies a model, and retains exact funded/budget transcript strings and placement. Decode through `reference/amendment-surface.md#standing-grants`; place budget after `Problem:` and `Searched:` and before findings; no token means no budget line. Recover spent from `funded round` observations only, otherwise exhausted with `(not recovered on resume)`. Hard-stop REJECT, unreadable review anchors, dirty boundaries, empty commit, malformed grants, apply failures specified above, compact-report overflow, redraws and more than `4 + N` re-reviews (`N` is the maximum grant in the wave). Delete reference/fix-loop.md and the old Fix-Loop Rounds and Spec-review snapshots sections.
- [ ] **Step 10: Preserve decisions, commits and recovery.** Keep takeable-decision evidence deduplication by whitespace-normalized `file:line` or failing command plus assertion, amendment permission, `fix-first` -> `/skill:shape-ticket` gate and Recommendation footer. Update `## When a Subagent Fails`' third step to the integrated escalation/funding table. Commit isolated waves only after green gate and latest SHIP, folding at the original base; in-place waves make a descendant commit without amend/`reset --soft`. Mark all original indices `complete` together and execute manifest `orchestrator` instructions. Keep `## After All Tasks Complete`'s full verification, whole-diff review, conformance and finishing order; retarget only its former reviewer to wave-reviewer without anchors. Print base, worker report/patch, integration, gate exit, review verdict/report/tree, repair status/delta/applied, rebuild, escalation, funded and repair-base observations in the spec's order. `### Recovery` uses only those observations; stop for missing base, `applied` status or terminal outcome, retaining funding spent. An `in_progress` wave needs its base; continuing after a repair needs a terminal review after `applied yes` or a green gate after the last repair. Old tree-only review lines do not authorize continuation. Preserve `### Chain stopped or failed` diagnosis, but remove its SR fan-out and snapshot reconstruction.
- [ ] **Step 11: Create the eleven replacement scenarios.** Use paired case.md/expected.md files and relevant bundle sections. `one-review-per-wave`: code and doc waves each get one review after the gate. `direct-report-read`: bounded direct reads, one compact retry and stop on second overflow. `repair-on-top`: clean isolated snapshot/delta versus direct in-place edit. `gate-repair-before-review`: DONE with red gate consumes an attempt. `empty-delta-attempt`: no unchanged-tree re-review. `apply-failure-rebuild`: only repair-delta failure rebuilds into the original wave; initial failure stops. `escalation-same-tree`: no grant required at two failures and missing model stops. `convergence-exception`: one exception then escalation. `funded-failure-stop`: spending and budget suffixes. `reject-stop`: no repair. `blocked-resume-tree`: answered question preserves the current tree. Write must-hold assertions in expected.md rather than approving report prose by resemblance.
- [ ] **Step 12: Migrate retained evals and assembly.** Delete chain-wave-dispatch, report-by-path-fix, patch-review-snapshot and test-gate-repair samples and results. Rewrite `delegated-source-investigation`, `repair-compaction-recovery`, `leg-cwd`, `integrated-wave-repair`, `all-singleton-waves`, `singleton-apply-failure`, `snapshot-apply-failure`, `stagnant-under-budget`, `third-attempt-escalated`, `multi-task-wave-ledger`, every `budget-*` sample, `chain-stop-blocked` and `no-plan-read-wave`. Inspect remaining cases for the same obsolete assumptions; keep `delegated-amendment` byte-identical. Update `skillFiles`/slices to drop `fix-loop.md` and `code-quality-reviewer-prompt.md` and include `wave-reviewer-prompt.md` with renamed-heading slices. Declare candidate-only files with the existing new-file assembly option from eval/README.md. Update replay, README and intent to identify expected behavior shifts, preserving historical fixtures only as explicit compatibility cases.
- [ ] **Step 13: Migrate CI assertions and add the two checks.** Remove pins on the old personas/prompts, Behaviour-change and never-default-to-no text; pin the actual replacement contract. Scan dispatch lines only under `skills/**/*.md` and `agents/*.md` for `agent: "spec-reviewer"` and `agent: "code-reviewer"`; exclude `extensions/` and historical test fixtures. Validate that the predecessor's `Superseded by` href resolves to the current spec, with missing/wrong-target fixture cases in wave-review.test.mjs. Keep all other CI checks.
- [ ] **Step 14: Run Tests, format and commit.** Re-run the scoped test file to green. Read changed instruction blocks against forge-skill, keep the current skill under the extraction threshold, and retain standard overrides blocks. Stage only owned files and use `git commit -m "Review integrated waves and repair on the current tree"`, identifying the behavior change in the body. Verification owns `npm test`, `node eval/run.mjs subagent-driven-development`, and `node eval/run.mjs wave-reviewer`, producing and committing the model-eval target reports and result files; never manufacture those outputs.

Transcript templates to transcribe: `wave <w> base <sha>`, `wave <w> task <n> <status> report <path> patch <path>`, `wave <w> integrated task <n>`, `wave <w> task <n> apply failed`, `wave <w> gate <i> exit <code>`, `wave <w> review <k> verdict <value> report <path> tree <sha>`, `wave <w> repair <k> task <n> <status> report <path> delta <path> applied <yes|no>`, `rebuild: task <n> - delta apply failed`, `escalated round for task <n> after 2 failed attempts`, `funded round <k> of <N> for task <n>`, `repair-base: <path> <sha>`, `budget: <spent> of <N> spent`, `Recommendation: none - evidence repeats task <n>`, `took recommendation: <option> for task <n>`, `Recommendation: <option> - <why>`. Keep `budget:` in funded stops and the `stop-note.md` grammar. `diff --binary --cached` writes `integrated.patch` under `RP_DIR` and never loads it in the primary.

Shared persona/caller contract: `agents/wave-reviewer.md`, `name: wave-reviewer`, `description:`, `agents/code-reviewer.md`, `agents/spec-reviewer.md`, `requesting-code-review`, `code-reviewer.md`, `loop-implementation`, `verification-before-completion`, `chase-bug`, `gatekeep-pr`, `finishing-a-development-branch`, `dispatching-parallel-agents`, `Parallel-safe:`, `TRAJECTORY:`, `Behaviour-change:`, `met | unmet | out-of-scope`, `unmet`, `out-of-scope`. Task 2 owns the persona and non-SDD sites; this task owns their SDD consumer and unified schema. Do not change `conformance-reviewer` or builtin scout/delegate mechanics. No new session-log analysis script under `scripts/`.

Shared removal-site inventory: `SKILL.md`, `## Fix-Loop Rounds`, `## Spec-review snapshots`, `## Dispatch`, `reference/dispatch-contract.md`, `## Orchestrator holds`, `implement+sr`, `phase-tracker-helpers.ts`, `spec-reviewer`, `code-reviewer`, `CADENCE_AGENTS`, `REVIEWER_AGENTS`, `eval/spec-reviewer/`, `eval/code-reviewer/`, `requesting-code-review/SKILL.md:10,28,34,36,40,43,78`, `wave-reviewer.md`, `loop-implementation/SKILL.md:220`, `chase-bug/hotfix.md:123`, `verification-before-completion/reference/conformance-check.md:196`, `gatekeep-pr/SKILL.md:42`, `gatekeep-pr/reference/assessment.md:88`, `gatekeep-pr/reference/sync.md:56`, `finishing-a-development-branch/reference/disposition-protocol.md:46`, `dispatching-parallel-agents/SKILL.md:131`, `:194`, `scripts/ci.mjs:192-195`, `spec-reviewer-prompt.md`, and the `never default to \`no\`` pin at `ci.mjs:196`. The authorized integration-test migration at `extensions/telemetry.test.ts:749-802` belongs to Task 1. Task 2 owns the `for:`-only refreshes in `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md` after reviewer-reference migration, preserving bodies, expected moves and gates.

Shared addition/documentation inventory: `wave-review`, `countStructuredFindings`, `eval/wave-reviewer/`, `with-anchor`, `without-anchor`, `unreadable-anchor`, `partial-wave-ship`, `eval/wave-reviewer/intent.md`, `doc/personas.md`, `doc/implement-engines.md`, `doc/configuration.md`, `README.md`, `subagents.agentOverrides.code-reviewer`, `.spec-reviewer`, `agentOverrides.wave-reviewer`, `doc/personas.md:32-35`, `doc/configuration.md:69`, `## Unreleased`. Tasks 1, 2 and 4 own those companion edits. Task 2 owns the `eval/gatekeep-pr/samples/{conflict-free-sync,conflicting-file-sync,scoped-test-red-sync}/expected.md` and `eval/loop-implementation/samples/verify-lifecycle/expected.md` retargeting and `scripts/loop-engine-contract.test.mjs` / `scripts/gatekeep-comment-reconcile.test.mjs`; this task owns final CI integration across `skills/` and `agents/`. Unlisted moving parts route through `reference/amendment-surface.md`.

Sample path literals in Tests are relative to the SDD target: `eval/subagent-driven-development/samples/one-review-per-wave`, `samples/direct-report-read`, `samples/delegated-source-investigation`, `samples/delegated-amendment`, `samples/repair-on-top`, `samples/gate-repair-before-review`, `samples/empty-delta-attempt`, `samples/apply-failure-rebuild`, `samples/escalation-same-tree`, `samples/funded-failure-stop`, `samples/convergence-exception`, `samples/reject-stop`, `samples/blocked-resume-tree`, `samples/repair-compaction-recovery`, `samples/leg-cwd`. Keep the predecessor `doc/specs/2026-10-29-orchestrator-delegation-guard.md` banner targeted at section 2; Task 4 owns its doc text.

Orchestrator: observed-value forwarding - retain this run's implement `phase` start/complete observations and unique `plan_tracker` indices that reached `in_progress`; carry them to finishing with the request to report one `kind: "dispatch"` event per `details.results` child of `subagent`, divided by attempted tasks, beside 6.14 from `## Problem`. Report incomparable for `events_dropped > 0` or missing phase endpoints. Do not add a session-log analysis script or make the ratio a pass threshold.

## Wave 3 - Public migration documentation

Depends on Waves 1-2: describe the delivered identities and protocol, not an intermediate mixture. This trailing doc-only wave owns the shared hub documents once.

### Task 4: Document the reviewer migration and supersession
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Documentation-only change - check published contract against the accepted implementation.

**Spec:** doc/specs/2026-10-30-slim-subagent-dispatch.md § "Acceptance criteria" L56, § "Removals and additions" L200, § "Documentation impact" L250, § "Documentation impact" L251

**Files:**
- Modify: `doc/personas.md`
- Modify: `doc/implement-engines.md`
- Modify: `doc/configuration.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `doc/specs/2026-10-29-orchestrator-delegation-guard.md:3`

**Tests:**
- none: cross-cutting documentation; repository doc and supersession checks run at verification

- [ ] **Step 1: Update persona and operator guidance.** Replace two roster rows with wave-reviewer, describe clause-table versus findings-only dispatch, and preserve the frontmatter knob guidance. Update the `agentOverrides` example pins at `doc/personas.md:32-35`: `subagents.agentOverrides.code-reviewer` and `.spec-reviewer` move to `agentOverrides.wave-reviewer`; remove old example keys rather than silently keeping two ineffective settings.
- [ ] **Step 2: Update execution and cadence docs.** In doc/implement-engines.md describe one integrated review per wave and point to The Wave Loop instead of the deleted fix-loop reference. In doc/configuration.md update the wave-review label, code/doc cadence reminder and pin migration note, including `doc/configuration.md:69`. Do not change settings keys or the loop engine protocol.
- [ ] **Step 3: Update the package definition and changelog.** Change README's persona count from 11 to 10 and update overlapping persona descriptions. Write the `CHANGELOG.md` `## Unreleased` entry in this change, naming removed personas, operator pin migration and the pi-cohort pairing note: no dispatch-shape change, so sibling docs need no update.
- [ ] **Step 4: Check the predecessor banner.** The current header already names this spec and section 2. Keep that valid single `Superseded by` banner rather than duplicate it; edit only if the final link-resolution check reveals drift. Do not alter the predecessor's preserved historical design body.
- [ ] **Step 5: Review and commit.** Check compact Markdown tables, ASCII punctuation, existing links and present-tense wording. Use bare git to stage only the documentation edits and `git commit -m "Document the wave-reviewer migration"`.

Shared additions inventory for accurate documentation (implementation belongs to Tasks 1-3): `agents/wave-reviewer.md`, `skills/subagent-driven-development/wave-reviewer-prompt.md`, `## The Wave Loop`, `repair-base-shell`, `WAVE_VERDICT_SCHEMA`, `wave-reviewer`, `wave-review`, `countStructuredFindings`, `scripts/ci.mjs`, `skills/**/*.md`, `agents/*.md`, `agent: "spec-reviewer"`, `agent: "code-reviewer"`, `extensions/`, `eval/wave-reviewer/`, `with-anchor`, `without-anchor`, `unreadable-anchor`, `partial-wave-ship`, `SHIP`, `one-review-per-wave`, `direct-report-read`, `repair-on-top`, `gate-repair-before-review`, `empty-delta-attempt`, `apply-failure-rebuild`, `escalation-same-tree`, `failed[n] == 2`, `implModel`, `convergence-exception`, `funded-failure-stop`, `reject-stop`, `blocked-resume-tree`, `eval/subagent-driven-development/intent.md`, `eval/wave-reviewer/intent.md`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Problem" L20 | Per-child dispatch numerator, attempted-task denominator, complete implement window and incomplete-record exclusion | Task 3 |
| § "Acceptance criteria" L38 | Exactly one post-gate integrated initial review for code and docs; no per-task SR chain | Task 3 |
| § "Acceptance criteria" L40 | Bounded direct child-report reads, no relay, plan/spec/source still delegated | Task 3 |
| § "Acceptance criteria" L42 | Current-tree isolated repair deltas and direct in-place repair | Task 3 |
| § "Acceptance criteria" L44 | Delta-only rebuild trigger rejoins the original wave | Task 3 |
| § "Acceptance criteria" L46 | Two-attempt escalation and preserved funded/stop-note lines | Task 3 |
| § "Acceptance criteria" L48 | Merged persona identity, byte-preserved knobs and migrated dispatch sites | Task 2, Task 3 |
| § "Acceptance criteria" L50 | Anchored clause table, findings-only fallback and verdict/footer rules | Task 2, Task 3 |
| § "Acceptance criteria" L52 | Structured severity counts, cadence credit and historical compatibility | Task 1 |
| § "Acceptance criteria" L54 | Full repository and target verification, migrated eval targets and committed reports | Task 2, Task 3 |
| § "Acceptance criteria" L56 | Predecessor banner names the current spec and section 2 | Task 3, Task 4 |
| § "Acceptance criteria" L58 | Venue: report this implementing run's comparable ratio beside 6.14 | Task 3 |
| § "Orchestrator frame (kept)" L96 | Keep orchestration frame and remove report relay/SR machinery | Task 3 |
| § "Orchestrator frame (kept)" L98 | Structured-first report reads, per-path bound and one compact retry | Task 3 |
| § "The wave loop (rewritten)" L102-L104 | One wave-loop owner; independence and fixed base | Task 3 |
| § "The wave loop (rewritten)" L105 | Initial implementer-only item-schema carrier; per-mode scoped commands | Task 3 |
| § "The wave loop (rewritten)" L106 | Ordered patch integration, retained siblings and initial-apply stop | Task 3 |
| § "The wave loop (rewritten)" L107 | Separate command logs; test ownership; no review on red gate | Task 3 |
| § "The wave loop (rewritten)" L108 | One read-only review of the staged integrated tree for every wave | Task 3 |
| § "The wave loop (rewritten)" L109 | Finding ownership with touchedTasks fallback; unowned findings stop | Task 3 |
| § "The wave loop (rewritten)" L110 | Committed isolated repair snapshot, delta integration and cleanup | Task 3 |
| § "The wave loop (rewritten)" L111 | In-place direct edits without snapshots or patch application | Task 3 |
| § "The wave loop (rewritten)" L113 | Empty-delta handling, scoped gates and tree-pair re-review | Task 3 |
| § "The wave loop (rewritten)" L114-L116 | Gate plus SHIP before one commit and completion; fixed wave base | Task 3 |
| § "The wave loop (rewritten)" L118-L134 | Exact repair-base shell, clean committed root, redirected patch never opened | Task 3 |
| § "The wave loop (rewritten)" L136 | Per-task attempt counters and once-per-wave flags | Task 3 |
| § "The wave loop (rewritten)" L140 | Red gate consumes each owning task's attempt | Task 3 |
| § "The wave loop (rewritten)" L141 | Errors and answered questions consume attempts on the same tree | Task 3 |
| § "The wave loop (rewritten)" L142 | Empty repair consumes an attempt without re-review | Task 3 |
| § "The wave loop (rewritten)" L143 | Failed repair-delta apply consumes an attempt and rebuilds | Task 3 |
| § "The wave loop (rewritten)" L144-L145 | Attributed first/re-review issues increment task counters | Task 3 |
| § "The wave loop (rewritten)" L146 | Stagnant or malformed trajectory exhausts ordinary attempts; funded stop | Task 3 |
| § "The wave loop (rewritten)" L147 | One noncritical convergence exception only | Task 3 |
| § "The wave loop (rewritten)" L148 | One configured-model escalation per task | Task 3 |
| § "The wave loop (rewritten)" L149-L150 | Escalated/funded failure spending and funded stagnation stop | Task 3 |
| § "The wave loop (rewritten)" L151-L152 | Green plus SHIP commits; reject/unreadable/cap hard-stop | Task 3 |
| § "The wave loop (rewritten)" L154 | Execution escalation independent of grants; failure wording updated | Task 3 |
| § "Rebuild (the one automatic path)" L158 | Remove all Create paths first; restore deduplicated pre-existing Modify/Test paths excluding Create; one rebuilt patch preserves siblings and original-wave commit | Task 3 |
| § "Escalation and funding (folded in, semantics kept)" L162 | Runtime escalation model on current tree; missing configuration stop | Task 3 |
| § "Escalation and funding (folded in, semantics kept)" L163 | Grant decoding, per-task spend, budget placement and fail-closed resume | Task 3 |
| § "Escalation and funding (folded in, semantics kept)" L164 | Evidence-deduplicated takeable decision ladder | Task 3 |
| § "Escalation and funding (folded in, semantics kept)" L165-L167 | Hard-stop inventory and merged-review trajectory/stop-note grammar | Task 3 |
| § "The merged persona" L171 | Replacement persona identity and preserved frontmatter | Task 2 |
| § "The merged persona" L173 | Union-of-wave clause table, spec authority and unreadable-anchor rejection | Task 2 |
| § "The merged persona" L174 | Severity findings, spec-observable tests, rules and fix-delta scope | Task 2 |
| § "The merged persona" L175 | Clause failures block shipping; Minor-only findings do not | Task 2 |
| § "The merged persona" L176 | Parallel-safe and trajectory footer mirroring | Task 2 |
| § "The merged persona" L178 | Unified structured schema and removed behavior-change field | Task 2, Task 3 |
| § "The merged persona" L180 | New SDD prompt and findings-only non-SDD calls | Task 2, Task 3 |
| § "Extensions" L184 | Cadence identity, actual guard comparison and code/doc commit tests | Task 1 |
| § "Extensions" L185 | Wave-review label and removal of fused label | Task 1 |
| § "Extensions" L186 | Structured file-only findings with unchanged historical tag fallback | Task 1 |
| § "Extensions" L187 | Regenerated committed bin bundles | Task 1 |
| § "Transcript lines and recovery" L191 | Exact observations, dynamic-state proof and old-brief missing-state stop | Task 3 |
| § "Removals and additions" L195 | Remove retired personas, prompts, protocol references, active names, evals and pins | Task 1, Task 2, Task 3 |
| § "Removals and additions" L196 | Migrate stop-note report reads/settings failure and telemetry active-review assertions; Task 2 owns both gatekeep intent hash-only refreshes and scoped rerun, preserving bodies, moves and gates | Task 1, Task 2, Task 3 |
| § "Removals and additions" L198 | Rewrite retained samples, preserve delegated-amendment, migrate test/target references | Task 2, Task 3 |
| § "Removals and additions" L200 | Add merged persona/protocol, CI guards, sample suites, docs and pin migration | Task 1, Task 2, Task 3, Task 4 |
| § "Removals and additions" L202 | Unlisted moving parts require approved amendment | Task 2, Task 3 |
| § "Errors and edge cases" L208-L213 | Gate/apply/empty-delta edge outcomes | Task 3 |
| § "Errors and edge cases" L214-L219 | Reject, blocked, escalation, funding, unowned finding and oversized report stops | Task 3 |
| § "Errors and edge cases" L220-L222 | Missing-output diagnosis, doc-only review and transcript-only resume | Task 3 |
| § "Errors and edge cases" L223 | Historical reviewer records still parse | Task 1 |
| § "Errors and edge cases" L224 | Non-SDD calls remain findings-only | Task 2 |
| § "Tests" L228 | Code/doc one-review scenario | Task 3 |
| § "Tests" L229 | Report-bound, delegated-source and unchanged amendment scenarios | Task 3 |
| § "Tests" L230 | Isolated delta and in-place repair scenario | Task 3 |
| § "Tests" L231 | Red gate before review scenario | Task 3 |
| § "Tests" L232 | Empty-delta attempt scenario | Task 3 |
| § "Tests" L233 | Rebuild and initial apply failure scenario | Task 3 |
| § "Tests" L234 | Same-tree escalation and funded failure scenarios | Task 3 |
| § "Tests" L235 | One convergence exception scenario | Task 3 |
| § "Tests" L236 | Reject hard-stop scenario | Task 3 |
| § "Tests" L237 | Blocked same-tree resume scenario | Task 3 |
| § "Tests" L238 | Mid-wave recovery scenario | Task 3 |
| § "Tests" L239 | Leg-owned implementer dispatch | Task 3 |
| § "Tests" L240 | Merged reviewer clause scenarios | Task 2 |
| § "Tests" L241 | Non-SDD caller migration and retired-dispatch CI check | Task 2, Task 3 |
| § "Tests" L242 | One-step carrier deterministic assertions | Task 3 |
| § "Tests" L243 | File-only structured findings and historical-name tests | Task 1 |
| § "Tests" L244 | Cadence and label tests | Task 1 |
| § "Tests" L245 | Supersession link CI check | Task 3 |
| § "Tests" L246 | Runtime ratio observation, not a target threshold | Task 3 |
| § "Documentation impact" L250 | Roster, knobs, execution guide, cadence, README count and Unreleased entry now | Task 4 |
| § "Documentation impact" L251 | Predecessor's section-2 supersession banner | Task 4 |
| § "Out of scope" L257 | No persona-body slimming project | waived: out of scope per spec |
| § "Out of scope" L258 | Keep pi-cohort mechanics, builtin personas and settings/API unchanged | Task 2, Task 3 |
| § "Out of scope" L259 | Loop protocol unchanged except reviewer rename | Task 2 |
| § "Out of scope" L260 | Verify conformance reviewer unchanged | Task 2, Task 3 |
| § "Out of scope" L261 | Gatekeep semantics unchanged except persona reference | Task 2 |
| § "Out of scope" L262 | No pi-condense cache-rewrite project | waived: out of scope per spec |
| § "Out of scope" L263 | No shippable session-log analysis script | Task 3 |
