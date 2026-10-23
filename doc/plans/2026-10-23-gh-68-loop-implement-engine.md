# Loop Implement Engine Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add the experimental loop engine without changing the default waves engine.

**Architecture:** Admit a ledger through the existing plan-artifact header and hash stamp. A model-free fresh persona commits each iteration in the implementation worktree; the main-session driver validates effects and handles human stops, then runs the whole-diff review and conformance continuation. Engine selection lives in the spec, progress in the ledger, and measurements in telemetry, not phase state.

**Tech Stack:** Markdown instructions, TypeScript extensions, Node.js >=24.15.0 node:test, YAML telemetry, esbuild bundles, pi-cohort dispatch, existing eval runner.

**Spec:** `doc/specs/2026-10-23-gh-68-loop-implement-engine.md`

**Verification:** `npm test`

**Ticket:** `#68`

---

## Files

- Admission/settings: modify `extensions/lib/plan-check.ts`, `extensions/lib/plan-check.test.ts`, `extensions/lib/gauntlet-settings.ts`, `extensions/lib/gauntlet-settings.test.ts`, `extensions/phase-tracker.ts`, `extensions/phase-tracker.test.ts`.
- Iteration: create `agents/loop-implementer.md`, `skills/loop-implementation/SKILL.md`, `scripts/loop-engine-contract.test.mjs`; modify `scripts/stage-skill-lint.mjs`, `scripts/stage-skill-lint.test.mjs`, `scripts/ci.mjs`.
- Measurement: modify `extensions/lib/telemetry-record.ts`, `extensions/lib/telemetry-record.test.ts`, `extensions/telemetry.ts`, `extensions/telemetry.test.ts`, `src/bins/gauntlet-performance.mjs`, `src/bins/performance/runs.mjs`, `bin/gauntlet-performance.test.mjs`.
- Generated: rebuild `bin/gauntlet-performance.mjs`, `bin/gauntlet-telemetry-seal.mjs`, `bin/gauntlet-spec-index.mjs` in Tasks 1 and 3; never hand-edit them.
- Approval: modify `skills/brainstorming/SKILL.md`, `skills/brainstorming/reference/spec-finalization.md`, `skills/brainstorming/reference/amendment-surface.md`, `scripts/brainstorming-contract.test.mjs`.
- Consumers: modify `skills/finishing-a-development-branch/SKILL.md`, `skills/gauntlet-handoff/SKILL.md`, `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/reconstruction.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `scripts/finish-verification.test.mjs`, `scripts/brief-contract-lint.mjs`, `scripts/brief-contract-lint.test.mjs`.
- Evals: create new loop-implementer and loop-implementation targets; extend brainstorming, gauntlet-resume and finishing-a-development-branch targets. Exact metadata, sample pairs and reports are declared in their owning tasks below.
- Docs: create `doc/implement-engines.md`; modify `doc/configuration.md`, `doc/personas.md`, `README.md`, `AGENTS.md`. Delete no source files. Defer CHANGELOG work to release.

## Recon and execution rules

- Read the full instruction file before editing; apply forge-skill Authoring rules and Persona rules. Keep the new skill/persona below 500 lines, generic, ASCII and compact-table formatted. Append the standard Project overrides block to the new skill. Preserve unrelated rules.
- Existing admission is `checkPlan`/`parsePlan` in `extensions/lib/plan-check.ts:192-284,1137-1170`; handler spec resolution is `extensions/phase-tracker.ts:961-970`, implement-start stamp comparison is `1069-1085`. Keep that guard unchanged.
- Pure settings interfaces/resolvers are `extensions/lib/gauntlet-settings.ts:8-25,92-113`; gauntlet_setting enum/handler is `extensions/phase-tracker.ts:889-944`. Follow existing warning composition, not a second settings reader.
- Scoped extension integration tests need the CI loader: `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test exact/path`. Pure helpers use `node --test exact/path`. The loader is configured by `scripts/ci.mjs:425-453`; without it phase-tracker imports an unavailable host package.
- Scoped/repository style checks are the exported functions in `scripts/stage-skill-lint.mjs`, `scripts/model-literal-lint.mjs`, and `scripts/skill-size-lint.mjs`; their fixture commands are `node --test scripts/stage-skill-lint.test.mjs`, `node --test scripts/model-literal-lint.test.mjs`, `node --test scripts/skill-size-lint.test.mjs`. Run relevant lints on changed instructions, preserving surrounding layout; package.json defines no formatter, ESLint or Prettier command. scripts/ci.mjs bundles repository tests, instruction/style/structural lints, bin freshness, packaging and packed-install smoke checks.
- File-addressed model commands below call the existing `runTarget` export (`eval/run.mjs:156`). The case argument selects its target; each command runs that entire target, not just one sample. New targets use base HEAD after their initial instruction/fixture commit because the default baseline lacks the new source. Existing targets retain the default base and bundle cache. Require must-hold facts to hold, not just exit 0; commit report.md and records.jsonl. Do not add a runner or scripted driver.
- The overrides file has no Happy path table, so this plan has no happy-path header. Consumer loop runs must still support their own tables.

## Wave 1 - Ledger admission and iteration persona

Tasks 1 and 2 own disjoint files and use per-test scratch directories or their own eval target records; no shared port, database, fixture or mutable service. Task 2's model eval reads only its persona.

### Task 1: Admit ledger artifacts and resolve loop settings

**TDD scenario:** Modifying tested code - run existing tests, add red cases, implement the ledger branch.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L69-L70, § "Components" L78, § "Ledger" L103, § "Ledger" L121, § "Ledger" L125, § "Settings and telemetry" L181, § "Tests" L232-L234, § "Out of scope" L259

**Files:**
- Modify: `extensions/lib/plan-check.ts:192-284`
- Modify: `extensions/lib/plan-check.test.ts`
- Modify: `extensions/lib/gauntlet-settings.ts:8-25`
- Modify: `extensions/lib/gauntlet-settings.test.ts`
- Modify: `extensions/phase-tracker.ts:889-1000`
- Modify: `extensions/phase-tracker.test.ts:855-1030`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/plan-check.test.ts`
- Test: `extensions/lib/gauntlet-settings.test.ts`
- Test: `extensions/phase-tracker.test.ts`

**Tests:**
- `node --test extensions/lib/plan-check.test.ts`
- baseline: f3e0df8 pass
- via: `checkPlan(planText, specText, fs)`
- `node --test extensions/lib/gauntlet-settings.test.ts`
- baseline: f3e0df8 pass
- via: `resolveLoopEngine`
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`
- baseline: f3e0df8 pass
- via: `gauntlet_setting`, `plan_check`, `phase_tracker`

Decision: the existing handler resolves `**Spec:**` before `checkPlan`; stamp admission, not an engine bypass, permits implement. Add no phase-state `engine` or `piGauntlet.loopEngine.model`. Only ledger line 1 and spec `**Engine:**` discriminate the approved new branches; any other added consumer discriminator is a `Pattern:` violation. Keep the implement-start guard and verify reviewers untouched.

Decision: floor integer values below 1 to 1, matching resolveClosureReview's lower-bound normalization at `gauntlet-settings.ts:92-113`; a non-integer warns and falls back to 30. Return `{ maxIterations, warning }` from `resolveLoopEngine`. The public key is `piGauntlet.loopEngine.maxIterations`; model pin `subagents.agentOverrides.loop-implementer.model` remains pi-cohort-owned. The enum site is `extensions/phase-tracker.ts:892`.

- [ ] Run the three Tests commands; expect existing tests green.
- [ ] Add fixture tables for every AC disposition (absent means `in-scope`), missing/extra/duplicate/out-of-order indices, bad status, `cut` on `in-scope`/`venue:`, and `open`/`done`/`failed` on `deviates:`/`deferred:`/`elsewhere:`. Add task-plan non-regression fixtures.
- [ ] Add evidence tests rejecting `<...>`, `TODO`, `TBD`, `etc.`, `probably`, and empty non-open evidence; empty `open` evidence passes. Run the checker suite red before implementation.
- [ ] Branch at `checkPlan` entry before task parsing on exact `# Ledger - loop engine` (`^# Ledger - loop engine$`). Parse the table's `row`, `status`, `attempts`, `evidence` columns against checklist rows in spec `## Acceptance criteria`, with following dispositions/default in-scope. Validate count/order/status/disposition/evidence using pre-resolved `specText`; return normal findings and skip only task-plan checks/`checkPlaceholderScan`. Preserve task-plan behavior. Do not copy AC text into the ledger.
- [ ] Test `loopEngine.maxIterations` absent ->30, positive override, integer <=0 ->1, fractional/string ->warning and30. Add `loopEngine?: { maxIterations?: unknown }`, `resolveLoopEngine`, and tool enum `loopEngine` in `gauntlet_setting`; preserve settings-load warning composition.
- [ ] Extend the phase-tracker harness with an actual ledger carrying path-only `**Spec:**`, `base:`, `verification:`, `iterations:`, and `## Decisions`. Assert ledger admission/stamp and implement-start succeed after legal brainstorm/plan arming and skip. Keep stale task-plan stamp tests. No per-iteration restamping is added. In ledger state, parent-only cuts and child-only done closures remain distinct; attempts never reset, evidence is check name plus at most three result lines, and the parent's pre-dispatch iterations bump lands in the child's commit. Child decisions and parent retry decisions share the Decisions section.
- [ ] Rerun all Tests commands green. Run `npm run build:bins`, inspect all three bundles, and check changed-file style/syntax; never hand-edit bundles.
- [ ] Commit declared files with `git add` and `git commit -m "Admit loop ledgers through plan checks (ref #68)"`.

### Task 2: Add the fresh loop-implementer persona and behavior eval

**TDD scenario:** New feature - encode expected iteration facts before writing the persona.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L66, § "Persona `agents/loop-implementer.md`" L82-L99, § "Acceptance criteria" L38-L39, § "Tests" L240

**Files:**
- Create: `agents/loop-implementer.md`
- Create: `eval/loop-implementer/target.json`
- Create: `eval/loop-implementer/replay.md`
- Create: `eval/loop-implementer/intent.md`
- Create: `eval/loop-implementer/README.md`
- Create: `eval/loop-implementer/records.jsonl`
- Create: `eval/loop-implementer/report.md`
- Create: `eval/loop-implementer/samples/read-and-scope/case.md`
- Create: `eval/loop-implementer/samples/read-and-scope/expected.md`
- Create: `eval/loop-implementer/samples/row-and-evidence/case.md`
- Create: `eval/loop-implementer/samples/row-and-evidence/expected.md`
- Create: `eval/loop-implementer/samples/commit-contract/case.md`
- Create: `eval/loop-implementer/samples/commit-contract/expected.md`
- Test: `eval/lib/lint.test.mjs`
- Test: `eval/loop-implementer/samples/read-and-scope/case.md`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: f3e0df8 pass
- via: `lintTarget`, `lintAll`
- `node --input-type=module -e 'import("./eval/run.mjs").then(m=>m.runTarget({root:process.cwd(),target:process.argv.at(1).split("/").at(1),base:"HEAD"})).then(r=>(console.log(r.message),process.exitCode=r.exit))' eval/loop-implementer/samples/read-and-scope/case.md`
- baseline: f3e0df8 skipped - eval/loop-implementer/samples/read-and-scope/case.md created by this task
- via: `agents/loop-implementer.md`, `runTarget`

Decision: do not copy implementer's fork context or structured-review output. A model-free persona resolves `subagents.agentOverrides.loop-implementer.model`, else the main loop; the caller passes no model. The driver in Task 4 validates the one-line result through ledger effects.

- [ ] Create text-target metadata, replay and three case/expected pairs using eval/_template and eval/implementer neighbors. Record intent and must-hold facts: spec-before-code and row-scoped diff; target-only/bounded edits plus seed exceptions; one clean commit and decision-only reply. Structural lint is red while the instruction source is absent.
- [ ] Create the persona with `tools: read, write, edit, bash`, `defaultContext: fresh`, `inheritProjectContext: true`, `inheritSkills: false`, `systemPromptMode: replace`, `completionGuard: true`, no `model`, no `thinking`. Use exactly the spec's routing description: "One loop-engine iteration: closes one acceptance-criteria ledger row with evidence, commits once, appends one decision line."
- [ ] Put the output contract first. Accept `iteration:`, `spec:`, `ledger:`, `base:`, `target:`, `previous decision:`, `hint:`. Read the full spec then ledger, use `git diff --stat <base>` and only target-file hunks. Implement target only, run only its evidence check, never full verification/main/spec/foreign-row/other-plan-dir writes.
- [ ] Define status `done`/`failed`, `attempts` +1, `evidence` as check name plus <=3 result lines and a concrete failure cause. Append one line in `## Decisions` with `row <n> <done|failed> | <one sentence: what was done> | <one sentence: what the next iteration should not redo or should try differently>`, <=200 characters per sentence. `git add` changes and ledger; commit once `loop: row <n> <status>`; leave clean and reply only that line.
- [ ] Define `target: seed`: every `open` row gets a failing test/named check or passing baseline evidence and `status: done`; all attempts stay0, never seed failed. Preserve cuts, append `row 0 done | seeded <k> rows, closed <m> on baseline | <first row to take>`, commit `loop: seed evidence`.
- [ ] Run deterministic structural/model/size lints; commit initial persona/fixtures with `git commit -m "Add a fresh loop iteration persona (ref #68)"` so HEAD contains the new eval source.
- [ ] Run the model Tests command (equivalent to `node eval/run.mjs loop-implementer --base HEAD`), inspect each must-hold fact, repair the owning instruction and rerun the full target after the last edit. Commit reports/records and repairs with `git commit -m "Record loop persona behavior checks (ref #68)"`.

## Wave 2 - Telemetry and main-session driver

Depends on Wave 1: the driver consumes admission/settings/persona. Task 3 alone owns this wave's generated bundles. Task 4's model eval and source-contract tests do not share mutable paths with telemetry tests.

### Task 3: Record engine selection and print loop iterations

**TDD scenario:** Modifying tested code - red event/replay/performance cases after existing suites.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L73, § "Acceptance criteria" L32-L33, § "Acceptance criteria" L44-L45, § "Settings and telemetry" L185, § "Tests" L235-L236

**Files:**
- Modify: `extensions/lib/telemetry-record.ts:25-41`
- Modify: `extensions/lib/telemetry-record.test.ts`
- Modify: `extensions/telemetry.ts:426-479`
- Modify: `extensions/telemetry.test.ts`
- Modify: `src/bins/gauntlet-performance.mjs:75-145`
- Modify: `src/bins/performance/runs.mjs:9-50`
- Modify: `bin/gauntlet-performance.test.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/telemetry-record.test.ts`
- Test: `extensions/telemetry.test.ts`
- Test: `bin/gauntlet-performance.test.mjs`

**Tests:**
- `node --test extensions/lib/telemetry-record.test.ts`
- baseline: f3e0df8 pass
- via: `derive`, `serializeRecord`, `parseRecord`
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry.test.ts`
- baseline: f3e0df8 pass
- via: `registerTelemetry`, `replayBranch`, `applyPhaseDetails`
- `node --test bin/gauntlet-performance.test.mjs`
- baseline: f3e0df8 pass
- via: `gauntlet-performance`

Decision: add to the existing phase mirror (`applyPhaseDetails` at telemetry.ts:426-479), used by live recording and replay, not phase state or a second recorder. Keep additive schema1 compatibility. Task 5 handles approval options and `; fund N fix rounds`; this task records `engine: loop`/`engine: waves` from `**Engine:**`, whose placement Task 7 documents in `doc/configuration.md`.

- [ ] Run existing Tests commands. Add derived cases for loop, later waves event, absent event default waves, dispatch-count iterations and absent-persona iterations; round-trip through YAML. Add live brainstorm-complete and resumed-skip tests reading the bound spec's Engine header, absent-header waves and no unrelated-phase event. Run red.
- [ ] Extend `TelemetryEvent` with `{ kind: "engine", engine: "loop" | "waves" }` and `Derived` with engine/optional iterations. In `derive`, last engine event wins, else `waves`; iterations is `personas["loop-implementer"].dispatches`, else absent. On brainstorm transition to `complete` or `skip`, read the bound spec header and push the event through the existing path; no transcript/grant inference.
- [ ] Add old/new performance fixtures. Extend run JSON mapping and text columns so `gauntlet-performance` prints `engine: <value>` and `iterations: <n | empty>` for every run; old records print `engine: waves` with empty `iterations`. Preserve aggregation/order/council behavior.
- [ ] Run `npm run build:bins`, then all Tests commands green, inspect generated bundles and changed-source style. Commit with `git commit -m "Report loop engine selection and iterations (ref #68)"`.

### Task 4: Implement the main-session ledger loop and its stop gates

**TDD scenario:** New feature - failure/lifecycle facts and source-contract tests before instructions.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L67, § "Components" L76-L78, § "Components" L78, § "Acceptance criteria" L34-L43, § "Acceptance criteria" L38-L39, § "Acceptance criteria" L53-L58, § "Driver skill `skills/loop-implementation/SKILL.md`" L129-L150, § "After the loop: verify continuation" L154-L165, § "Stop note" L169, § "Stagnation and funding" L173, § "Errors and edge cases" L214-L224, § "Tests" L237, § "Tests" L239, § "Out of scope" L253-L259, § "Out of scope" L259

**Files:**
- Create: `skills/loop-implementation/SKILL.md`
- Create: `scripts/loop-engine-contract.test.mjs`
- Modify: `scripts/stage-skill-lint.mjs:7-14`
- Modify: `scripts/stage-skill-lint.test.mjs:23-32`
- Modify: `scripts/ci.mjs:425-465`
- Create: `eval/loop-implementation/target.json`
- Create: `eval/loop-implementation/replay.md`
- Create: `eval/loop-implementation/intent.md`
- Create: `eval/loop-implementation/README.md`
- Create: `eval/loop-implementation/records.jsonl`
- Create: `eval/loop-implementation/report.md`
- Create: `eval/loop-implementation/samples/seed-dispositions/case.md`
- Create: `eval/loop-implementation/samples/seed-dispositions/expected.md`
- Create: `eval/loop-implementation/samples/verification-resolution/case.md`
- Create: `eval/loop-implementation/samples/verification-resolution/expected.md`
- Create: `eval/loop-implementation/samples/row-progress/case.md`
- Create: `eval/loop-implementation/samples/row-progress/expected.md`
- Create: `eval/loop-implementation/samples/stagnation-and-retry/case.md`
- Create: `eval/loop-implementation/samples/stagnation-and-retry/expected.md`
- Create: `eval/loop-implementation/samples/cap-and-exit-verification/case.md`
- Create: `eval/loop-implementation/samples/cap-and-exit-verification/expected.md`
- Create: `eval/loop-implementation/samples/commit-boundary/case.md`
- Create: `eval/loop-implementation/samples/commit-boundary/expected.md`
- Create: `eval/loop-implementation/samples/decision-repair/case.md`
- Create: `eval/loop-implementation/samples/decision-repair/expected.md`
- Create: `eval/loop-implementation/samples/funding/case.md`
- Create: `eval/loop-implementation/samples/funding/expected.md`
- Create: `eval/loop-implementation/samples/verify-lifecycle/case.md`
- Create: `eval/loop-implementation/samples/verify-lifecycle/expected.md`
- Test: `scripts/loop-engine-contract.test.mjs`
- Test: `scripts/stage-skill-lint.test.mjs`
- Test: `eval/loop-implementation/samples/seed-dispositions/case.md`

**Tests:**
- `node --test scripts/loop-engine-contract.test.mjs`
- baseline: f3e0df8 skipped - scripts/loop-engine-contract.test.mjs created by this task
- via: `skills/loop-implementation/SKILL.md`
- `node --test scripts/stage-skill-lint.test.mjs`
- baseline: f3e0df8 pass
- via: `STAGE_SKILL_DIRS`, `lintStageSkills`
- `node --input-type=module -e 'import("./eval/run.mjs").then(m=>m.runTarget({root:process.cwd(),target:process.argv.at(1).split("/").at(1),base:"HEAD"})).then(r=>(console.log(r.message),process.exitCode=r.exit))' eval/loop-implementation/samples/seed-dispositions/case.md`
- baseline: f3e0df8 skipped - eval/loop-implementation/samples/seed-dispositions/case.md created by this task
- via: `eval/loop-implementation`, `runTarget`

Decision: author a pi main-session skill, not a scripted/parallel/best-of-N driver or task generator; keep waves default. Ledger admission from Task1 feeds the unchanged implement-start guard. No phase-state `engine`, `piGauntlet.loopEngine.model`, escalated-model stagnation round, or implement-phase spec/code review. `checkPlan` and spec `**Engine:**`/ledger line1 are the approved discriminants; any added consumer discriminator is a `Pattern:` violation. The cap `piGauntlet.loopEngine.maxIterations` and ledger path are documented by Task7 in `doc/configuration.md`.

Decision: dispatch in the implementation worktree without nested `worktree: true`, per the spec's HEAD/commit validation boundary. Use `acceptance: { level: "none", reason: "the parent validates the ledger and the commit" }`; pi-cohort otherwise expects structured output incompatible with a decision-only reply. Keep `completionGuard: true` because every iteration edits the ledger. Model resolution remains `subagents.agentOverrides.loop-implementer.model`, else main loop, with no dispatch model override.

- [ ] Create the nine fixture pairs and target metadata/intent. `seed-dispositions` covers `deviates:`, `deferred:`, `elsewhere:`, `venue:`, absent default, partial/complete baseline closure and illegal seed changes. `verification-resolution` covers PR gate, exactly-one prose command, discovery, zero/several prose commands and no dispatch on configuration failure.
- [ ] Add `row-progress` (third-attempt success, all-cut exit, target precedence); `stagnation-and-retry` (three unresolved attempts, two ledger-only/no-status-change child commits, evidence-based cause/no round history, human retry once, cutting an exhausted row). Include an empty-commit stop followed by explicit human retry: count only child commits after the committed `loop: retry row <n>`, permit the next eligible dispatch, preserve attempts and iterations, and still stop at the total cap; two new empty child commits stop again. `cap-and-exit-verification` covers seed-inclusive cap before verification and failed exit without reopening/rerun.
- [ ] Add `commit-boundary` (0/2 commits, dirty return, error/async handle, interrupted count after human cleanup), `decision-repair` (foreign/wrong target, missing/malformed/new-line requirement, bounded evidence, second consecutive miss). Extend `decision-repair` with a human retry after two misses: the first miss after the retry commit repairs without stopping for the earlier misses; the second new consecutive miss stops, and attempts never reset. `funding` covers durable per-row spend, prospective grant, no empty-stop/cap bypass and no reset of either consecutive-stagnation window from funding alone; `funded round k of N` must hold. `verify-lifecycle` covers zero reviewers in implement, both reviews after complete implement/start verify.
- [ ] Add node:test source-contract assertions in `scripts/loop-engine-contract.test.mjs`, reading actual driver/persona text for dispatch keys, acceptance reason, ledger grammar, validation order, no tracker init and verify lifecycle. Assert the explicit-human-retry commit boundary resets only the empty-child-commit and validation-miss windows, with attempts/iterations/cap preserved and no funding-only reset. Run red before authoring; add it to the existing scripts CI test list. This test is not an iteration driver.
- [ ] Author entry steps: `gauntlet_setting({ key: "loopEngine" })` -> `maxIterations`; resolve verification once from overrides `## PR gate` `- verification command:`, else `## verification-before-completion` with exactly one backticked command, else test discovery. Print `verification command: <command> (<source>)`; zero/ambiguous stops before iteration0. Use worktree-qualified paths/`git -C`, unchanged process cwd.
- [ ] Skip plan with `phase_tracker({ action: "skip", phase: "plan", reason: "loop engine" })`. Create `<resolved plan dir>/<spec stem>-ledger.md`: `# Ledger - loop engine`, path-only `**Spec:**`, `base:` from HEAD before skeleton commit, resolved `verification:`, `iterations: 0`, every indexed `## Acceptance criteria` row and empty `## Decisions`. Open in-scope/absent/venue (default rule: `ticket-acceptance.md:20`); cut only deviates/deferred/elsewhere with disposition evidence. `plan_check({ planPath })` finding stops as configuration error; commit `loop: seed ledger`; `phase_tracker({ action: "start", phase: "implement" })`. Seed evidence comes from one fresh child, not a parent baseline claim.
- [ ] Author pre-dispatch checks in order: exit when no `open`/`failed`; unresolved allowance 3+funded N or larger latest `row <n> retry` `allowed attempts <m>`; two ledger-only/no-row-status-change child commits (`loop: row ...`); total `iterations` cap including0; target. Exclude parent `loop: seed ledger`, `loop: repair ...`, `loop: retry ...`, `loop: cut ...` commits from child-commit stagnation. After an explicit human retry, consider only child commits after that `loop: retry row <n>` commit; funding alone never resets the consecutive window. Done/cut rows never stagnate. Target seed at0, eligible human hint, previous failed row, first failed, first open; durable status outranks the hint.
- [ ] Save `HEAD_BEFORE` and ledger copy; bump iterations uncommitted. Dispatch once with `agent: "loop-implementer"`, `context: "fresh"`, `async: false`, absolute `cwd`, unique absolute temp `output:`, `outputMode: "file-only"`, exact acceptance object, task fields `iteration:`, `spec:`, `ledger:`, `base:`, `target:`, `previous decision:`, `hint:`. Pass no `model:`/diff text. Never read a child transcript, poll or relaunch after error/async handle.
- [ ] Validate commit boundary first: `git -C <worktree> status --porcelain` empty and `git rev-list HEAD_BEFORE..HEAD --count`=1, else preserve changes and stop. Read ledger from HEAD. Seed validation: attempts all0, only open->done, every non-cut row evidenced, exactly one new `row 0 done | ... | ...` decision; miss stops without automatic retry.
- [ ] Ordinary validation against saved copy: target only, status done/failed, attempts+1, nonempty bounded evidence, exactly one new line matching `^row <target> (done|failed) \| .{1,200} \| .{1,200}$`. An older valid line is insufficient. On miss restore foreign rows, mark target failed at saved attempts+1 with `iteration <i>: <miss>`, preserve iterations, commit `loop: repair row <n>` and carry previous decision none. Two consecutive misses stop; after an explicit human retry, count only misses after that `loop: retry row <n>` commit, not pre-retry misses. Funding alone never resets this window.
- [ ] Author the SDD stop-note wording contract from `skills/subagent-driven-development/stop-note.md`: row text, concrete evidence cause in `Problem:`, quoted last decision, one screen/no round history. Headers are `Stopped on row <n> (<row text>)`, `Stopped: iteration cap <N> reached with rows <list> open`, `Stopped: verification failed with every row closed`, `Stopped: iteration <i> left the tree dirty`, `Stopped: iteration <i> added <k> commits`. Offer retry hint/amend/stop, never skip row. Amend follows `brainstorming/reference/amendment-surface.md`. Retry appends `row <n> retry | <hint> | allowed attempts <attempts + 1>`, commits `loop: retry row <n>`, resumes step5 with `hint:` set and starts a new consecutive-stagnation window at that commit for both empty child commits and validation misses. Preserve every row's attempts, run-wide iterations and total cap; funding alone never resets either window. Dirty/extra-commit retry needs human cleanup; set iterations to HEAD+1 before next bump so interruption remains consumed. No automatic reset/clean.
- [ ] Decode `; fund N fix rounds` on4/5 through `amendment-surface.md#standing-grants`. Allow3+N per row; prior attempts>=3 prints `funded round <k> of <N> for row <n>` before dispatch, spent=`attempts - 3` durable on resume. Stops add `budget: <spent> of <N> spent`, the sole history exception (`fix-loop.md:21`). Mid-loop grants are prospective; funding never bypasses cap/empty-commit stop or buys an escalation model. Stops retain implement; resume only after human decision.
- [ ] Exit once every row is done/cut: run ledger `verification:` once foreground. Failure stops with `Stopped: verification failed with every row closed` and quoted output, no reopen/rerun. Success `phase_tracker({ action: "complete", phase: "implement" })`, then start verify.
- [ ] Read SDD After All Tasks Complete (`subagent-driven-development/SKILL.md:327-336`), happy-path-run.md, and conformance-check.md in full. Its `conformance-check.md:193-197` covers fix changes, not the required initial whole-diff review. Author `## After the loop` using ledger `verification:` instead of plan `**Verification:**`; reuse successful exit only under clean-commit/no-change skip rule, repairs rerun. Dispatch whole-diff `code-reviewer` per requesting-code-review and retain `whole-diff minors:`.
- [ ] Continue with existing happy-path procedure selected by `## Happy path` overrides/diff without plan header, separate `conformance-reviewer`, unchanged fix rounds/`complete verify` criterion and canonical `## Closure / conformance`. No plan-task reopen or awaited plan_tracker state; no call into waves just for continuation. Summarize rows closed/iterations, then immediately `/skill:finishing-a-development-branch <abs worktree path>`.
- [ ] Add `skills/loop-implementation` to `scripts/stage-skill-lint.mjs` `STAGE_SKILL_DIRS` and exact-list test. Run deterministic Tests and structural/stage/model/size lints; commit instructions/fixtures with `git commit -m "Add the main-session loop engine (ref #68)"`.
- [ ] Run model Tests (equivalent to `node eval/run.mjs loop-implementation --base HEAD`), inspect each fact, repair owning instructions and rerun full target after last edit. Commit reports with `git commit -m "Record loop lifecycle and stop-gate evals (ref #68)"`.

## Wave 3 - Approval and amendments

Depends on Wave2's driver. Model evals remain serialized across waves, avoiding shared provider contention.

### Task 5: Route loop approvals and reconcile ledger amendments

**TDD scenario:** Modifying tested instructions - preserve gate/grant facts, then add loop fixtures.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Acceptance criteria" L32-L35, § "Acceptance criteria" L32-L33, § "Acceptance criteria" L46-L49, § "Components" L71-L72, § "Ledger amendments" L177, § "Settings and telemetry" L183, § "Approval menu and routing sites" L192-L193, § "Approval menu and routing sites" L196, § "Errors and edge cases" L225-L227, § "Tests" L238

**Files:**
- Modify: `skills/brainstorming/SKILL.md`
- Modify: `skills/brainstorming/reference/spec-finalization.md:119-210`
- Modify: `skills/brainstorming/reference/amendment-surface.md`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Modify: `eval/brainstorming/target.json`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/README.md`
- Create: `eval/brainstorming/records.jsonl`
- Modify: `eval/brainstorming/report.md`
- Create: `eval/brainstorming/samples/loop-gate/case.md`
- Create: `eval/brainstorming/samples/loop-gate/expected.md`
- Create: `eval/brainstorming/samples/engine-waves/case.md`
- Create: `eval/brainstorming/samples/engine-waves/expected.md`
- Create: `eval/brainstorming/samples/loop-funded-reply/case.md`
- Create: `eval/brainstorming/samples/loop-funded-reply/expected.md`
- Create: `eval/brainstorming/samples/loop-ledger-amend/case.md`
- Create: `eval/brainstorming/samples/loop-ledger-amend/expected.md`
- Test: `scripts/brainstorming-contract.test.mjs`
- Test: `eval/lib/lint.test.mjs`
- Test: `eval/brainstorming/samples/loop-gate/case.md`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: f3e0df8 pass
- via: `skills/brainstorming/reference/spec-finalization.md`, `skills/brainstorming/reference/amendment-surface.md`
- `node --test eval/lib/lint.test.mjs`
- baseline: f3e0df8 pass
- via: `eval/brainstorming`
- `node --input-type=module -e 'import("./eval/run.mjs").then(m=>m.runTarget({root:process.cwd(),target:process.argv.at(1).split("/").at(1)})).then(r=>(console.log(r.message),process.exitCode=r.exit))' eval/brainstorming/samples/loop-gate/case.md`
- baseline: f3e0df8 skipped - eval/brainstorming/samples/loop-gate/case.md created by this task
- via: `runTarget`

Decision: spec-finalization's existing approval commit and Standing grants predicate own persistence; a following `**Key:**` line already terminates a grant field. Write Engine below grant, read both back from HEAD before completing brainstorm; no new consent carrier. Task7 documents `piGauntlet.loopEngine.*` and links `README.md#configuring-the-gates`; do not move that cross-cutting doc work into this task.

- [ ] Run deterministic Tests. Add fixtures for five-option gate +4, waves1/2 and AC-less three-option fallback, `5; fund 2 fix rounds`/funded4/budget-only/malformed/3-mixed/change-mixed replies, and ledger cuts/factual preservation/rebound done row/option4 review/option5 grant/redraw.
- [ ] Extend eval target to assemble spec-finalization's owning gate/persistence slices, using per-sample bundle subsets so old questionary cases remain scoped. Update intent/README; keep old expected facts. Add source-contract assertions for exact menu, Engine placement and transition; run red.
- [ ] Add the two menu lines exactly:

  ```text
  4 - approve, loop engine (experimental): skip the plan; iterate a fresh loop-implementer over the acceptance-criteria ledger; amendments stop for your review as under 1.
  5 - approve, loop engine, auto-apply amends: as 4 with option 2's amendment grant.
  ```

  No AC rows (`none - ...`) -> three options and explanation.

- [ ] Apply this routing-site inventory from the approved spec, using grep/read to locate every listed site:

  Every site that names `1`/`2` or routes to `writing-plans` changes together (the plan enumerates them with `rg -n 'writing-plans|1 or 2|1/2|`1`' skills/brainstorming`): the fund sentence ("to 1, 2, 4, or 5"); the funded-reply table (rows for bare `5`, `5; fund N`, `4` with a budget token, mirroring `2`, `2; fund N`, `1`); the budget-token re-prompt ("asking for 1, 2, 4, or 5"); the `3` rules (`3` plus `4`/`5` prints and re-presents; a reply carrying `3` never grants); mixed replies stay change requests; the approval paragraph (`4` approves without a grant, `5` approves and grants; both persist `**Engine:** loop`); the transition ("proceed immediately to `/skill:writing-plans`" becomes "to `/skill:writing-plans` on 1/2, `/skill:loop-implementation` on 4/5"); `brainstorming/SKILL.md:56` step 13 and the gate checklist. A spec with `none - ...` in `## Acceptance criteria` renders three options and the menu says why.

  Also update amendment-surface's gate-digit/value-decoding references and redraw cleanup. Preserve the option2 grant sentence and CI occurrence counts.

- [ ] All approving replies write `**Engine:** loop` on4/5 or `**Engine:** waves` on1/2 immediately below `**Amend-grant:**`; absent Engine means waves. Option4 leaves `**Amend-grant:** none`;5 grants as2; `; fund N fix rounds` uses identical validation/persistence. Replace plain-approval commit-untouched wording: all approvals `git add` plus `commit --amend --no-edit`, then verify both HEAD fields. This supplies `engine: loop`/`engine: waves` telemetry selection; Task7 documents placement in `doc/configuration.md`.
- [ ] Complete brainstorm with `phase_tracker` after persistence then route1/2 to `/skill:writing-plans`,4/5 to `/skill:loop-implementation`; latter skips task planning with reason loop engine. Keep3 non-approving. Add ledger clause before section5 Plan exists: no `plan-writer`, `plan_check`, `plan_tracker`; approved `deviates:`/`deferred:`/`elsewhere:` ->cut/evidence disposition, factual edits preserve rows, rebound done ->open/`reopened by amendment`. Preserve attempts/iterations; commit spec+ledger as `loop: cut row <n>` or `loop: amend`, retaining amendment audit records in the body. Redraw deletes ledger where task plan is deleted and always re-gates.
- [ ] Run deterministic Tests and scoped instruction/structural lints; commit with `git commit -m "Select loop approvals and reconcile ledger amendments (ref #68)"`.
- [ ] Run model Tests, equivalent to `node eval/run.mjs brainstorming`; require new/old facts green, rerun full target after final edit and commit report/records with `git commit -m "Record loop approval and amendment evals (ref #68)"`.

## Wave 4 - Artifact consumers

Depends on Wave3's persisted selection/amendments. Retain all waves routes; run this wave's model targets serially.

### Task 6: Make finish and resume consume ledger artifacts

**TDD scenario:** Modifying tested instructions - finish/brief regression tests plus new ledger cases.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L74-L75, § "Ledger" L123, § "Resume" L200-L204, § "Errors and edge cases" L228, § "Tests" L241

**Files:**
- Modify: `skills/finishing-a-development-branch/SKILL.md:33-57`
- Modify: `skills/gauntlet-handoff/SKILL.md:84-100`
- Modify: `skills/gauntlet-resume/SKILL.md`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md`
- Modify: `scripts/finish-verification.test.mjs`
- Modify: `scripts/brief-contract-lint.mjs`
- Modify: `scripts/brief-contract-lint.test.mjs`
- Modify: `eval/gauntlet-resume/target.json`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/gauntlet-resume/README.md`
- Create: `eval/gauntlet-resume/records.jsonl`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/finishing-a-development-branch/target.json`
- Modify: `eval/finishing-a-development-branch/intent.md`
- Modify: `eval/finishing-a-development-branch/README.md`
- Create: `eval/finishing-a-development-branch/records.jsonl`
- Modify: `eval/finishing-a-development-branch/report.md`
- Create: `eval/gauntlet-resume/samples/loop-ledger-worktree/case.md`
- Create: `eval/gauntlet-resume/samples/loop-ledger-worktree/expected.md`
- Create: `eval/gauntlet-resume/samples/loop-ledger-brief/case.md`
- Create: `eval/gauntlet-resume/samples/loop-ledger-brief/expected.md`
- Create: `eval/gauntlet-resume/samples/loop-no-ledger/case.md`
- Create: `eval/gauntlet-resume/samples/loop-no-ledger/expected.md`
- Create: `eval/finishing-a-development-branch/samples/loop-ledger/case.md`
- Create: `eval/finishing-a-development-branch/samples/loop-ledger/expected.md`
- Test: `scripts/finish-verification.test.mjs`
- Test: `scripts/brief-contract-lint.test.mjs`
- Test: `eval/gauntlet-resume/samples/loop-ledger-worktree/case.md`
- Test: `eval/finishing-a-development-branch/samples/loop-ledger/case.md`

**Tests:**
- `node --test scripts/finish-verification.test.mjs`
- baseline: f3e0df8 pass
- via: `skills/finishing-a-development-branch/SKILL.md`
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: f3e0df8 pass
- via: `skills/gauntlet-resume/reference/brief-contract.md`
- `node --input-type=module -e 'import("./eval/run.mjs").then(m=>m.runTarget({root:process.cwd(),target:process.argv.at(1).split("/").at(1)})).then(r=>(console.log(r.message),process.exitCode=r.exit))' eval/gauntlet-resume/samples/loop-ledger-worktree/case.md`
- baseline: f3e0df8 skipped - eval/gauntlet-resume/samples/loop-ledger-worktree/case.md created by this task
- via: `runTarget`, `eval/gauntlet-resume`
- `node --input-type=module -e 'import("./eval/run.mjs").then(m=>m.runTarget({root:process.cwd(),target:process.argv.at(1).split("/").at(1)})).then(r=>(console.log(r.message),process.exitCode=r.exit))' eval/finishing-a-development-branch/samples/loop-ledger/case.md`
- baseline: f3e0df8 skipped - eval/finishing-a-development-branch/samples/loop-ledger/case.md created by this task
- via: `runTarget`, `eval/finishing-a-development-branch`

Decision: brief grammar remains solely in brief-contract.md, enforced by brief-contract-lint.mjs; producer/consumer cite it. No task snapshot or approval inferred from artifacts. For a loop spec without ledger, prepare the driver's step1 resolved inputs before its prescribed step2 creation continuation; restored ledgers reuse recorded verification/iterations, not new guesses.

- [ ] Run deterministic Tests. Add worktree/brief/no-ledger eval fixtures with modified ledger, dirty tree and checker-failure variants. Require rows/last decision rendered, durable iteration/funding, legal arming, no plan repair/writer/tracker init. Add finish fixture covering both candidate paths, verification source, stripping and seal-spec propagation.
- [ ] Extend finish source/Git fixture tests for the marker, `verification:` vs `**Verification:**`, both tracked removals and preserved spec/telemetry; keep existing skip-rule/telemetry exclusions unchanged. Extend brief-contract lint tests for exclusive field ownership; run red.
- [ ] Update finish hard gate by ledger line1; read path-only `**Spec:**` before removal and pass `--spec` to sealing. Enumerate `PLAN_PATH` candidates: basename task plan and `<sibling plans dir>/<spec stem>-ledger.md`; `rm` and commit each tracked candidate, retain plain-jj counterpart, preserve spec+telemetry and all landing/conformance gates. Ledger uses `verification:` instead of task-plan `**Verification:**`.
- [ ] Update reconstruction Candidates: line1 ledger pairs by `**Spec:**`, not basename. Add Spec with ledger ahead of Spec with plan, preserve human confirmation/same-repo/entry checks. Restore: entry check6, `start brainstorm`, `skip brainstorm resume: <spec>`, `start plan`, `plan_check` ledger; FAIL stops with findings, never `## Plan repair` or writing-plans. PASS -> `skip plan` with `resume: <spec> (loop engine)`, `start implement`, no `plan_tracker init`. Dirty tree stops before dispatch. Render rows and last decision, continue loop step5 with ledger iterations/retry data.
- [ ] Route Spec without plan + `**Engine:** loop` to loop step2 with resolver prerequisites. Define `Ledger: <path>` and `Last decision: <line>` instead of `Active task` only in brief-contract.md, use same ledger implement restore in its call table and preserve fresh verify/conformance later-stage restoration. Update handoff producer and resume post-restore route through that owner; no extra state/budget carrier, second file or tracker init.
- [ ] Extend target slices using sample bundles: finish ledger sample receives Step1/strip, old cleanup samples keep Step6; resume brief sample receives gauntlet-handoff body so production and consumption are tested. Update intents/READMEs. Run deterministic Tests and scoped brief/stage/model/size/structural lints; commit with `git commit -m "Resume and finish loop ledger runs (ref #68)"`.
- [ ] Run model Tests serially, equivalent to `node eval/run.mjs gauntlet-resume` and `node eval/run.mjs finishing-a-development-branch`; inspect facts, rerun full targets after final edits and commit reports with `git commit -m "Record ledger resume and finish evals (ref #68)"`.

## Wave 5 - User and engine-author documentation

Depends on Waves1-4's implemented contracts. This trailing doc-only wave owns all cross-cutting guides/indexes.

### Task 7: Document engine authoring, operations, and routing

**TDD scenario:** Trivial change - check documentation against shipped sources and reports.

**Spec:** doc/specs/2026-10-23-gh-68-loop-implement-engine.md § "Components" L68, § "Acceptance criteria" L46-L47, § "Settings and telemetry" L181-L183, § "Engine contract `doc/implement-engines.md`" L208, § "Tests" L242, § "Documentation impact" L245-L247

**Files:**
- Create: `doc/implement-engines.md`
- Modify: `doc/configuration.md:45-100`
- Modify: `doc/personas.md:1-45`
- Modify: `README.md:60-85`
- Modify: `AGENTS.md:169-195`

**Tests:**
- none: documentation; header verification owns repository roster/link/style assertions

Decision: amend existing hubs and add only the engine-author guide. `CHANGELOG.md - deferred: release` stays deferred; do not change CHANGELOG.md, AGENTS.core.md or the shared core block.

- [ ] Write `doc/implement-engines.md`: waves/task and loop instances, plan-dir hashed-file admission, path-only `**Spec:**`, line1 `plan_check` selection, unchanged guard, verify order, finish strip/`verification:`, resume, amendments, stop notes, model pin and telemetry `engine` event. Spec+telemetry ship; artifact is stripped. Explain the unbuilt upgrade boundary for a non-hashed-file artifact (phase-state engine field).
- [ ] Add operations in `doc/configuration.md`: experimental4/5 vs default/legacy waves; `**Engine:** loop`/`**Engine:** waves` directly below `**Amend-grant:**`; option4 retains `**Amend-grant:** none`; ledger path/grammar/status/disposition/evidence/decisions/attempts/iterations, verification resolution and stop/retry/amend semantics. Document `piGauntlet.loopEngine.maxIterations` integer>=1/default30, flooring and non-integer warning/fallback in `gauntlet-settings.ts`; `resolveLoopEngine`/`gauntlet_setting` `loopEngine`. No other `piGauntlet.loopEngine.*` key.
- [ ] Add one dispatch-model precedence row for `subagents.agentOverrides.loop-implementer.model`, inherited main-loop/phase model otherwise, no dispatch `model:`. Explain funded approvals as extra row attempts, not escalated-model rounds or cap extensions. Document that every approval now uses `git add` plus `commit --amend --no-edit` and HEAD-checks Engine/grant.
- [ ] Update `doc/personas.md` count9->10 and roster for loop-implementer: tools, fresh context, unset model/thinking and guarded implementation. Update README procedure with loop options and planless ledger alternative, `README.md#configuring-the-gates` link and one engine-author routing row. Add one AGENTS.md routing row to the guide only.
- [ ] Check touched links/commands/current-tense wording against sources and `eval/brainstorming` `report.md` from Task5's `node eval/run.mjs brainstorming`. Ensure size/stage/model/bin and roster expectations match the header gate. Check ASCII/compact tables; no formatter is configured.
- [ ] Commit with `git add` on declared files and `git commit -m "Document loop engine operations and contracts (ref #68)"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Components" L69-L70 | Existing admission/settings seams | Task 1 |
| § "Components" L78 | Only approved discriminants; unchanged guard/reviews | Task 1, Task 4 |
| § "Ledger" L103 | Plan-dir ledger location and grammar | Task 1 |
| § "Ledger" L121 | Marker/header, bounded durable state and decision ownership | Task 1 |
| § "Ledger" L125 | AC order/dispositions/status/evidence checks; preserve task-plan checks | Task 1 |
| § "Settings and telemetry" L181 | Cap setting/resolver/enum/default/warning | Task 1 |
| § "Tests" L232-L234 | Ledger checker, stamp and setting cases | Task 1 |
| § "Out of scope" L259 | No separate model setting or phase engine state | Task 1, Task 4 |
| § "Components" L66 | Loop persona | Task 2 |
| § "Persona `agents/loop-implementer.md`" L82-L99 | Fresh model-free frontmatter and task fields | Task 2 |
| § "Persona `agents/loop-implementer.md`" L82-L99 | Spec-first, row-only, scoped diff/check, bounded evidence/decision | Task 2 |
| § "Persona `agents/loop-implementer.md`" L82-L99 | One clean commit/reply and seed exception/hard boundaries | Task 2 |
| § "Acceptance criteria" L38-L39 | Child/parent iteration effects and model contract | Task 2, Task 4 |
| § "Tests" L240 | Persona behavior evals | Task 2 |
| § "Components" L73 | Recorder/derive/printer | Task 3 |
| § "Acceptance criteria" L32-L33 | Five options and persisted/recorded selection | Task 3, Task 5 |
| § "Acceptance criteria" L44-L45 | Engine/iterations and legacy display | Task 3 |
| § "Settings and telemetry" L185 | Selection event on approval/resume, derivation and rebuild | Task 3 |
| § "Tests" L235-L236 | Recorder/replay/round-trip/performance tests | Task 3 |
| § "Components" L67 | Main-session stage skill | Task 4 |
| § "Components" L76-L78 | Stage lint enrollment and limited branching | Task 4 |
| § "Acceptance criteria" L34-L43 | Plan skip, evidence seed and validated single-dispatch iterations | Task 4 |
| § "Acceptance criteria" L34-L43 | Exit/verify reviews, stagnation and cap | Task 4 |
| § "Acceptance criteria" L53-L58 | Funded suffix, ledger reading, dispositions and baseline evidence | Task 4 |
| § "Acceptance criteria" L53-L58 | Diff access/model/commit reading and literal verification stop | Task 4 |
| § "Driver skill `skills/loop-implementation/SKILL.md`" L129-L150 | Resolve inputs; create/check/commit ledger; start implement | Task 4 |
| § "Driver skill `skills/loop-implementation/SKILL.md`" L129-L150 | Ordered exit/allowance/empty/cap/target gates | Task 4 |
| § "Driver skill `skills/loop-implementation/SKILL.md`" L129-L150 | Exact foreground file-only dispatch/no transcript | Task 4 |
| § "Driver skill `skills/loop-implementation/SKILL.md`" L129-L150 | Boundary/seed/ordinary validation, repairs, counted attempts and human stops | Task 4 |
| § "After the loop: verify continuation" L154-L165 | Verify ordering, full run reuse/repair and whole-diff review | Task 4 |
| § "After the loop: verify continuation" L154-L165 | Happy path/conformance/fix rounds/closure/immediate finish | Task 4 |
| § "Stop note" L169 | Evidence cause, decision/budget and human retry/amend/stop; explicit retry commit resets consecutive empty-child-commit/validation-miss windows only, preserving attempts/iterations/cap; funding alone does not reset | Task 4 |
| § "Stagnation and funding" L173 | Durable per-row prospective spend; no bypass/escalation | Task 4 |
| § "Errors and edge cases" L214-L224 | Unresolved allowance stops; third-attempt success and empty commits | Task 4 |
| § "Errors and edge cases" L214-L224 | Cap, dirty/commit stops, repair/seed/verification/configuration errors | Task 4 |
| § "Tests" L237 | Stage-skill regression | Task 4 |
| § "Tests" L239 | Full driver behavior matrix | Task 4 |
| § "Out of scope" L253-L259 | Preserve default; no comparison/scripted/parallel/reviewer/escalation/reopen machinery | Task 4 |
| § "Acceptance criteria" L32-L35 | Gate semantics, Engine persistence and planless route | Task 5 |
| § "Acceptance criteria" L46-L49 | Gate eval/report and option5 semantics | Task 5 |
| § "Components" L71-L72 | Approval sites and amendment aftermath | Task 5 |
| § "Ledger amendments" L177 | Cut/preserve/reopen/reconcile without task machinery; redraw cleanup | Task 5 |
| § "Settings and telemetry" L183 | Engine placement/all-approval persistence/HEAD check/legacy default | Task 5 |
| § "Approval menu and routing sites" L192-L193 | Exact options 4/5 | Task 5 |
| § "Approval menu and routing sites" L196 | Funding/mixed3/change replies, all routing sites and AC-less fallback | Task 5 |
| § "Errors and edge cases" L225-L227 | AC-less menu, cut and factual amendments | Task 5 |
| § "Tests" L238 | Gate4/waves1/funded5 samples | Task 5 |
| § "Components" L74-L75 | Finish/discovery/brief consumers | Task 6 |
| § "Ledger" L123 | Verification source, strip both artifacts, retain spec+telemetry | Task 6 |
| § "Resume" L200-L204 | Header pairing, arming/failure/no-tracker route and missing-ledger handling | Task 6 |
| § "Errors and edge cases" L228 | Disk/branch resume state | Task 6 |
| § "Tests" L241 | Worktree/brief/no-ledger evals | Task 6 |
| § "Components" L68 | Engine-author guide | Task 7 |
| § "Acceptance criteria" L46-L47 | Operations/menu/ledger/key docs and README link | Task 7 |
| § "Settings and telemetry" L181-L183 | Setting, model pin, Engine placement and funding docs | Task 7 |
| § "Engine contract `doc/implement-engines.md`" L208 | All artifact consumers, shipped surfaces and future boundary | Task 7 |
| § "Tests" L242 | Roster and final lint/bin expectations | Task 7 |
| § "Documentation impact" L245-L247 | Architecture/operations/index docs; release-only changelog | Task 7 |
