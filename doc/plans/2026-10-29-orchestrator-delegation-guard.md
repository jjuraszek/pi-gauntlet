# Orchestrator delegation Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Keep implement-phase orchestration on a derived manifest and compact structured results while workers own plan, spec, source, and report reads.

**Architecture:** Return the checker's normalized task plan to the runtime handler and render a bounded manifest before stamping. Move SDD workers to anchored task reads and file-only chain results, including repairs, recovery, investigations, and delegated amendments. Preserve inline callers and the loop engine.

**Tech Stack:** TypeScript with Node's native type stripping, node:test, Markdown instruction contracts, pi-cohort chains, and existing deterministic/model eval harnesses.

**Spec:** `doc/specs/2026-10-29-orchestrator-delegation-guard.md`

**Verification:** `npm test; node eval/run.mjs subagent-driven-development; node eval/run.mjs implementer; node eval/run.mjs spec-reviewer; node eval/run.mjs code-reviewer`

Baseline jjuraszek/pi-gauntlet: a265f923

---

## Files

All files belong to the single admitted leg `jjuraszek/pi-gauntlet`. The dispatched worktree is the recorded `.worktrees/<name>` checkout for branch `orchestrator-delegation`; there is no companion. Keep the plan and spec home-owned. The spec's Rules list applies to every task. The directory walk found no additional AGENTS.md or CLAUDE.md on touched paths. Instruction tasks add `skills/forge-skill/SKILL.md` as a rule. No Happy path table exists in the selected overrides file.

**Runtime - modify:**
- `extensions/lib/plan-check.ts`
- `extensions/lib/plan-check.test.ts`
- `extensions/phase-tracker.ts`
- `extensions/phase-tracker.test.ts`
- `skills/writing-plans/reference/plan-contract.md`
- `bin/gauntlet-telemetry-seal.mjs`
- `bin/gauntlet-performance.mjs`
- `bin/gauntlet-spec-index.mjs`

**Amendment worker - modify:**
- `agents/plan-writer.md`
- `skills/brainstorming/reference/amendment-surface.md`

**Amendment worker - create:**
- `scripts/implement-amendment.test.mjs`

**Anchored workers - modify:**
- `agents/implementer.md`
- `agents/spec-reviewer.md`
- `agents/code-reviewer.md`
- `skills/subagent-driven-development/implementer-prompt.md`
- `skills/subagent-driven-development/spec-reviewer-prompt.md`
- `skills/subagent-driven-development/code-quality-reviewer-prompt.md`
- `eval/implementer/replay.md`
- `eval/implementer/intent.md`
- `eval/code-reviewer/target.json`
- `eval/code-reviewer/replay.md`
- `eval/code-reviewer/intent.md`

**Anchored workers - create:**
- `scripts/anchored-task.test.mjs`
- `eval/implementer/samples/anchored-task/case.md`
- `eval/implementer/samples/anchored-task/expected.md`
- `eval/implementer/samples/unreadable-anchor/case.md`
- `eval/implementer/samples/unreadable-anchor/expected.md`
- `eval/code-reviewer/samples/anchored-task/case.md`
- `eval/code-reviewer/samples/anchored-task/expected.md`
- `eval/code-reviewer/samples/unreadable-anchor/case.md`
- `eval/code-reviewer/samples/unreadable-anchor/expected.md`
- `eval/spec-reviewer/target.json`
- `eval/spec-reviewer/README.md`
- `eval/spec-reviewer/replay.md`
- `eval/spec-reviewer/intent.md`
- `eval/spec-reviewer/samples/anchored-task/case.md`
- `eval/spec-reviewer/samples/anchored-task/expected.md`
- `eval/spec-reviewer/samples/unreadable-anchor/case.md`
- `eval/spec-reviewer/samples/unreadable-anchor/expected.md`

**SDD coordinator - modify:**
- `skills/subagent-driven-development/SKILL.md`
- `skills/subagent-driven-development/reference/fix-loop.md`
- `skills/subagent-driven-development/stop-note.md`
- `scripts/wave-review.test.mjs`
- `eval/subagent-driven-development/target.json`
- `eval/subagent-driven-development/intent.md`
- `eval/subagent-driven-development/samples/chain-wave-dispatch/case.md`
- `eval/subagent-driven-development/samples/chain-wave-dispatch/expected.md`
- `eval/subagent-driven-development/samples/test-gate-repair/case.md`
- `eval/subagent-driven-development/samples/test-gate-repair/expected.md`
- `eval/subagent-driven-development/samples/chain-stop-blocked/case.md`
- `eval/subagent-driven-development/samples/chain-stop-blocked/expected.md`
- `eval/subagent-driven-development/samples/integrated-wave-repair/case.md`
- `eval/subagent-driven-development/samples/integrated-wave-repair/expected.md`

**SDD coordinator - create:**
- `skills/subagent-driven-development/reference/dispatch-contract.md`
- `skills/subagent-driven-development/reference/implement-amendments.md`
- `eval/subagent-driven-development/samples/no-plan-read-wave/case.md`
- `eval/subagent-driven-development/samples/no-plan-read-wave/expected.md`
- `eval/subagent-driven-development/samples/delegated-source-investigation/case.md`
- `eval/subagent-driven-development/samples/delegated-source-investigation/expected.md`
- `eval/subagent-driven-development/samples/repair-compaction-recovery/case.md`
- `eval/subagent-driven-development/samples/repair-compaction-recovery/expected.md`
- `eval/subagent-driven-development/samples/report-by-path-fix/case.md`
- `eval/subagent-driven-development/samples/report-by-path-fix/expected.md`
- `eval/subagent-driven-development/samples/chain-error-diagnosis/case.md`
- `eval/subagent-driven-development/samples/chain-error-diagnosis/expected.md`
- `eval/subagent-driven-development/samples/delegated-amendment/case.md`
- `eval/subagent-driven-development/samples/delegated-amendment/expected.md`

**Cross-cutting docs - modify:**
- `doc/configuration.md`
- `doc/implement-engines.md`
- `README.md`

**Generated evidence:** The verification stage owns harness-generated `report.md` and `results/` under the four named eval targets. Commit actual generated results after the full-target runs; never hand-author reports. Regenerate bins and retain only actual bundle differences.

**Delete:** None. Remove superseded instruction sentences in their owning files rather than preserving alternate recipes. CHANGELOG release notes remain deferred to release.

## Recon and verification conventions

- Parser definitions: `extensions/lib/plan-check.ts:32-110`; heading/bullet parsing: `:142-321`; leg assignment and result return: `:1281-1359`. `extensions/phase-tracker.ts:1057-1078` is the sole production caller. Checker tests currently consume an array and must inspect `.findings` after the change.
- Runtime test harness: `extensions/phase-tracker.test.ts:1-146`. Registered-tool tests around `:1480-1700` and `:2170-2450` exercise stamps and coordinated roots. Runtime tests use `extensions/test-support/pi-stubs.mjs`; the pure checker needs no loader.
- SDD owners: `skills/subagent-driven-development/SKILL.md:20-48`, `:54-143`, `:159-350`. Cross-surface tests at `scripts/wave-review.test.mjs:14-141`, `:266-360` pin several instructions this change replaces. Preserve the executable snapshot and scratch-index tests at `:143-263`.
- Eval text targets replay supplied observations, not live filesystem access. `eval/implementer/replay.md` currently suppresses most status outputs; the SDD target's heading slice excludes the new top-level state contract. Update replay/assembly deliberately. `eval/spec-reviewer/` does not exist and must be created from template conventions.
- The repository verification entrypoint bundles extension parse checks, instruction lint, eval shape/hygiene, unit tests, bin freshness, and package smokes (`scripts/ci.mjs:405-514`). There is no configured formatter or standalone repository formatting command. Keep existing style rather than inventing one.
- Scoped syntax: `node --experimental-strip-types --check extensions/lib/plan-check.ts`, `node --experimental-strip-types --check extensions/phase-tracker.ts`, and `node --check` with each owned JavaScript test path.
- Scoped instruction lint uses exported `lintStageSkill` from `scripts/stage-skill-lint.mjs` on the owned Markdown files; reject hits. Use exported `lintModelLiterals` from `scripts/model-literal-lint.mjs` and filter its repo-relative results to owned files. Exported `lintTarget` from `eval/lib/lint.mjs` checks each owned target. These modules have no lint CLI. The header's repository entrypoint runs the complete lint set.
- No shared-core, setting, dependency floor, version, or membership change is needed. Apply forge-skill's imperative voice, minimal diff, byte-identical persona frontmatter, and oversized-skill extraction rules.

## Baseline provenance

Repo jjuraszek/pi-gauntlet, initial inventory at BASE `a265f923`: ` M doc/plans/2026-10-29-orchestrator-delegation-guard.md`; no other tracked or untracked changes. Admit only `doc/plans/2026-10-29-orchestrator-delegation-guard.md` and `doc/specs/2026-10-29-orchestrator-delegation-guard.md`; the caller supplied `In-flight: doc/plans/2026-10-29-orchestrator-delegation-guard.md` and owns its pending changes. Proof `git diff --quiet 57f33d2e a265f923 -- . ':!doc/specs/' ':!doc/plans/'` exited 1. Retain no prior evidence; the explicit `Findings: rerun baseline` also requires a fresh pass over every task command.

Executed at `a265f923`: Task 1 checker 194 passed; Task 1 runtime handler 202 passed; Task 2 existing brainstorming contract 52 passed; Task 3 eval structure 14 passed; Task 4 wave contract 15 passed; Task 4 eval structure 14 passed. Every command exited 0 with tests executed. After each run, HEAD remained `a265f923` and full porcelain status remained exactly the admitted plan modification. No commands were blocked, no source was dirtied, and no artifacts appeared. Regenerated the four all-created-anchor skip bullets under the contract, including Task 4's consumers of tests created in Wave 1. The previously failing wave-template assertion now passes, resolving its baseline question through execution. Model calls and header verification were not run.

## Wave 1 - Runtime and worker contracts

Tasks 1-3 own disjoint files. Their deterministic tests use independent temporary directories; the only shared test anchor is read-only. Task 4 later updates the legacy cross-surface SDD assertions after these producers exist.

### Task 1: Return and bound the normalized plan manifest
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - run existing tests first, then add manifest and handler boundary assertions.

**Spec:** doc/specs/2026-10-29-orchestrator-delegation-guard.md § "Acceptance criteria" L21-L22, § "Acceptance criteria" L23-L24, § "Acceptance criteria" L25-L26, § "Acceptance criteria" L27-L28, § "1. `plan_check` returns the manifest" L77-L84, § "1. `plan_check` returns the manifest" L86-L86, § "1. `plan_check` returns the manifest" L88-L91, § "Errors and edge cases" L142-L144, § "Errors and edge cases" L146-L146, § "Errors and edge cases" L147-L147, § "Errors and edge cases" L154-L155, § "Tests" L159-L162, § "Tests" L163-L164, § "Tests" L177-L177, § "Out of scope" L189-L190, § "Out of scope" L193-L193

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `extensions/lib/plan-check.ts`
- Modify: `extensions/lib/plan-check.test.ts`
- Modify: `extensions/phase-tracker.ts`
- Modify: `extensions/phase-tracker.test.ts`
- Modify: `skills/writing-plans/reference/plan-contract.md`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/plan-check.test.ts`
- Test: `extensions/phase-tracker.test.ts`

**Tests:**
- `node --test extensions/lib/plan-check.test.ts`
- baseline: a265f923 pass
- via: `checkPlan` and `renderManifest`
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`
- baseline: a265f923 pass
- via: registered `plan_check` tool

- [ ] **Step 1: Run the existing scoped tests.** Preserve all validation assertions while adapting calls to inspect `.findings`. Do not add a production compatibility shim returning the old array.
- [ ] **Step 2: Add failing parser/render tests.** Extend valid-plan fixtures with Tasks 4 and 9 and an in-place wave. Check fixed-key-order JSON lines, header counts/absolute paths, explicit/default/absent legs, every file kind, omitted ordinary mode, and no-tests `[]`. Add `Orchestrator: persist the measured value into Task 9` inside Task 4; check first match wins and absence omits the field. Pin two bullets as two commands and one semicolon/pipe-bearing bullet as one command. Round-trip ` | ` in a heading and quotes in paths/text through `JSON.parse`. Ordinary prose addressed to the primary remains undetected.
- [ ] **Step 3: Implement normalized results and rendering.** Export `ParsedPlan` and `renderManifest(parsed: ParsedPlan, planAbs: string, specAbs: string): string`. Return `{ findings: PlanCheckFinding[]; parsed?: ParsedPlan; ledger: boolean }` on every branch, including ownership errors, ledger validation, and exceptions. Return the same normalized `ParsedPlan` checked after assigning `Task.leg`, never parse twice. Add `orchestrator?: string` to Task from the first body line matching `^Orchestrator: (.+)$`. Render `JSON.stringify` lines in plan order with keys task, wave, optional mode, heading, files, tests, optional leg, optional orchestrator. Preserve each command bullet intact; omit optional fields rather than writing null.

  Decision: map internal lowercase `FileEntry.kind` values to public `Create`, `Modify`, and `Test` labels only at rendering - the approved example at spec L81 fixes the public shape; definitions at `extensions/lib/plan-check.ts:33-38` stay internal. Preserve parsed paths, including line suffixes, rather than filesystem-normalizing them.

- [ ] **Step 4: Add failing handler boundary tests.** Exercise stamped/no-flow pass, repeated pass, ordinary FAIL, and a valid line-1 `# Ledger - loop engine`. Use a long Orchestrator field in otherwise valid plans to reach total lengths 32,767, 32,768, and 32,769. Include multibyte characters to distinguish JS length from bytes. Check one finding/no manifest/no new stamp on oversize; keep existing hashing assertions.
- [ ] **Step 5: Render before stamping.** Consume the new result in the sole production caller. Compose the unchanged pass line, blank line, and manifest before setting the stamp. At complete-content length >=32,768 call the existing fail helper with check `manifest-size`, line 0, and the spec's exact measured-count reason. Preserve ordinary failure, both pass variants, repeated hashes, and ledger text. Add no read guard, byte budget, telemetry, FAIL capping, or loop change.
- [ ] **Step 6: Add optional task grammar.** Amend the task grammar in `skills/writing-plans/reference/plan-contract.md` to describe first-match single-line `Orchestrator:` for between-wave coordination only. Other task prose stays worker-only; spec/plan persistence goes through amendment. Keep planning-phase entry and normal planner behavior unchanged.
- [ ] **Step 7: Re-run tests, syntax-check, and regenerate bins.** Expect all existing and new assertions green. Run both scoped extension syntax checks from Recon, then `npm run build:bins`. Keep actual generated bundle changes; never hand-edit bundles.
- [ ] **Step 8: Commit.** Stage owned runtime/tests/grammar and changed bundles; run `git commit -m "Return a bounded task manifest from plan checks"`.

Exact rendering contract: `manifest:` header, `task`, `wave`, `mode` only for `in-place`, `heading`, `files`, `tests`, optional `leg`, optional `orchestrator`. Each `FileEntry` becomes `{kind, path}`. Each `Tests:` bullet stays intact even with `;` or `|`; no-tests serializes as `"tests":[]`. Preserve a path containing `"`. A fixture's value is `persist the measured value into Task 9`. Normalize `parsed` after explicit `Leg:` or the first spec leg; `ledger` discriminates `ledger: true`. Add `Task.orchestrator` on `Task`, not a second parser. Retain `PASS`, `FAIL`, `(no flow to stamp)`, `content`, and JavaScript `resultText.length` semantics. Keep `/skill:loop-implementation` untouched. The `plan-writer` and all other callers gain only the bounded result; add no `read` guard. Document `spillThreshold` in `doc/configuration.md` in Task 5.

Transcribe the L84 serialization contract:

`files` lists every `FileEntry` as `{kind, path}` in plan order; `tests` is the array of the task's `Tests:` bullet commands, each element one command verbatim (a command containing `;` or `|` stays one element; two bullets stay two elements), or `[]` for the no-tests form; `mode` is present only when the wave heading label carries the `in-place` marker that `writing-plans` writes for a rebase-form Task 1 (`skills/writing-plans/SKILL.md:199`); `leg` is present only when `Task.leg` is set; `orchestrator` is present only when the task body carries an `Orchestrator:` line. JSON encoding is the lossless rule: a heading, path, or `orchestrator` text containing `|`, `;`, quotes, or newlines round-trips unchanged, and the primary never joins or splits commands - it executes each `tests` element as its own `(cd "<worktree>" && <command>)` with its own failure boundary, as today's scoped gate does per bullet. Add `orchestrator?: string` to `Task`: a body line matching `^Orchestrator: (.+)$` (first match wins) sets it; the grammar is added to `skills/writing-plans/reference/plan-contract.md` as an optional task line, and `plan-writer` uses it only for an instruction the orchestrator must act on between waves. Everything else in a task body is for the implementer and reviewers and is invisible to the orchestrator by design.

Source anchor crosswalk from the approved spec: normalization `:1288-1293`, ledger `:1285`, wave marker `skills/writing-plans/SKILL.md:199`, pass branches `:1070-1076`, spill assumption `PRUNING.md:675-677`, planner tool `agents/plan-writer.md:5`. The `extensions/lib/` change requires regenerated bundles; the existing freshness check is in `npm test`, a component of header verification, not an implement-phase test command. These are provenance, not additional files to edit.

### Task 2: Add implement-only delegated amendment modes
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** New instruction behavior - pin preparation/apply boundaries, then implement the modes.

**Spec:** doc/specs/2026-10-29-orchestrator-delegation-guard.md § "4. Amendments mid-implement" L132-L132, § "Errors and edge cases" L145-L145, § "Tests" L171-L171, § "Out of scope" L188-L188

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `agents/plan-writer.md`
- Modify: `skills/brainstorming/reference/amendment-surface.md`
- Create: `scripts/implement-amendment.test.mjs`
- Test: `scripts/implement-amendment.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/implement-amendment.test.mjs`
- baseline: a265f923 skipped - scripts/implement-amendment.test.mjs created by this task
- via: implement-only `Amend-prepare:` and `Amend-apply:` persona modes
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: a265f923 pass
- via: `skills/brainstorming/reference/amendment-surface.md`

- [ ] **Step 1: Add failing contract assertions.** Create the Node test beside the existing brainstorming contract test. Assert read-only preparation, named/granted spec-section apply, normal plan-only five-path/Findings/Amend behavior, both return schemas, unaffected task preservation, baseline ownership, parent stamping, and the one-failure retry. Pin required items/redraws arrays, empty arrays, rejection of malformed preparation, redraw-only and mixed redraw/amend batches holding the whole batch before grants or sibling applies. Pin a first apply that changes anchors then fails self-check: the saved report retains original task numbers/titles/anchors/wave positions, and a fresh retry uses that inventory rather than the changed plan, returns the original anchor changes, and applies idempotently; missing inventory fails. Read instruction files in tests rather than implementing a second amendment engine.
- [ ] **Step 2: Add `Amend-prepare:`.** Route this explicit implement-only block before the ordinary procedure. Read spec/plan, classify evidence under the existing amendment surface, and return required `items` and `redraws` arrays, including when empty. Items carry `evidence`, `recommended`, `location`, and one-paragraph `edit`; redraws carry `location` and `reason` bounded to 300 characters, never appear in items, and hold the whole batch at the redraw gate before any grant evaluation or sibling amendment. Fail malformed output. Keep full supporting context in the saved report; return the object through injected structured output so the parent never opens that report to discover redraws. Preparation writes nothing and never silently ratifies a redraw.
- [ ] **Step 3: Add `Amend-apply:`.** This block alone authorizes applying granted items verbatim to named spec sections. Before first apply capture original task numbers, titles, spec anchors, and wave positions in the existing saved apply report, retaining that original inventory on every return including failures, with no sidecar. Regenerate the existing plan through the ordinary Amend preservation and Baseline procedure. Return `amendedSections`, `tasksAdded`, `tasksAnchorChanged`, `tasksRemoved`, `passed`, and `failLines` on failure. Derive deltas from pre-apply task numbers, not tracker positions. On retry read the original inventory from `previousApplyReport` before writing; fail if it is missing, apply granted edits idempotently without duplication, and compute deltas against that original inventory rather than the already-mutated plan. Preserve substantive baseline failures in failLines so the caller need not open the plan.
- [ ] **Step 4: Scope the surface exception.** Route only implement callers at preparation and section 5 aftermath to the new modes; leave planning callers unchanged. Preserve grant predicate, Value decoding, human gate, redraw handling, dirty-baseline safety, audit, and one-amend-commit semantics. Require both preparation arrays and stop the whole batch on any redraw before grants or sibling applies. Returned task numbers plus the fresh manifest drive add/reopen/removal behavior after parent PASS. A false apply result repeats once with failLines as the rule and previousApplyReport pointing to the first apply report; the second failure goes to the human. Keep the apply result schema, report artifact, and one-retry budget unchanged.

  Decision: keep `agents/plan-writer.md` frontmatter byte-identical. Its existing write tool supports full spec replacement; no new edit tool is needed. The mode-specific body exception limits that permission to granted apply, leaving normal output and shell restrictions intact (`agents/plan-writer.md:14-29`, `:46-52`). The accepted source at `57f33d2e` already carries the amended worker/surface instructions in `agents/plan-writer.md:31-43`, `skills/brainstorming/reference/amendment-surface.md:52-54`, and its section 5 implement-only paragraph, with assertions in `scripts/implement-amendment.test.mjs:33-61`; preserve that accepted implementation rather than duplicating it.

- [ ] **Step 5: Re-run tests and lint.** Expect both scoped commands green, including existing brainstorming gates. Use Recon's instruction lint exports and `node --check scripts/implement-amendment.test.mjs`. Task 4 supplies the caller schema and delegated-amendment eval consuming these exact fields, including redraw and retry-inventory cases.
- [ ] **Step 6: Commit.** Stage the two instruction files and test; run `git commit -m "Delegate implement-phase amendment preparation and apply"`. Record instruction behavior change in the commit body.

Exact preparation result: `{ items: [{ evidence, recommended: "accept" | "alt-<n>", location: "<spec section>", edit: string }], redraws: [{ location: "<spec section>", reason: string (max 300 characters) }] }`. Require `items` and `redraws` even when empty. Any redraw holds the whole batch; the parent never opens the preparation report to discover redraws.

Exact apply result: `{ amendedSections: string[], tasksAdded: number[], tasksAnchorChanged: number[], tasksRemoved: number[], passed: boolean, failLines?: string[] }`. Route `passed: false` once with `failLines` and `previousApplyReport` set to the first apply report path. The fresh child reads its original inventory and returns deltas against that original inventory; missing inventory fails the retry. On pass the parent invokes `plan_check` and `plan_tracker` `add` for `tasksAdded`, reopens completed `tasksAnchorChanged` as `in_progress`, and handles `tasksRemoved` through existing rules. Preserve `amendment-surface.md`, `Amend-grant:` decoding, the `Amend:` preservation entry and the structured `concerns`/`question` evidence. Caller provenance: `:48`, `agents/plan-writer.md:3`, `skills/writing-plans/SKILL.md:86`, `skills/brainstorming/reference/amendment-surface.md:180-186`. Task 4's `eval/subagent-driven-development/` case tests this boundary. No planning-phase `plan_tracker` initialization changes.

### Task 3: Teach workers to load anchored tasks and mirror report verdicts
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** New anchored-payload behavior - add contract tests and eval cases while retaining inline callers.

**Spec:** doc/specs/2026-10-29-orchestrator-delegation-guard.md § "Acceptance criteria" L37-L38, § "3. Dispatch shapes and the verdict carrier" L112-L112, § "3. Dispatch shapes and the verdict carrier" L114-L118, § "3. Dispatch shapes and the verdict carrier" L126-L128, § "5. Documentation and evals" L136-L136, § "Errors and edge cases" L149-L149, § "Tests" L173-L175

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `agents/implementer.md`
- Modify: `agents/spec-reviewer.md`
- Modify: `agents/code-reviewer.md`
- Modify: `skills/subagent-driven-development/implementer-prompt.md`
- Modify: `skills/subagent-driven-development/spec-reviewer-prompt.md`
- Modify: `skills/subagent-driven-development/code-quality-reviewer-prompt.md`
- Modify: `eval/implementer/replay.md`
- Modify: `eval/implementer/intent.md`
- Modify: `eval/code-reviewer/target.json`
- Modify: `eval/code-reviewer/replay.md`
- Modify: `eval/code-reviewer/intent.md`
- Create: `scripts/anchored-task.test.mjs`
- Create: `eval/implementer/samples/anchored-task/case.md`
- Create: `eval/implementer/samples/anchored-task/expected.md`
- Create: `eval/implementer/samples/unreadable-anchor/case.md`
- Create: `eval/implementer/samples/unreadable-anchor/expected.md`
- Create: `eval/code-reviewer/samples/anchored-task/case.md`
- Create: `eval/code-reviewer/samples/anchored-task/expected.md`
- Create: `eval/code-reviewer/samples/unreadable-anchor/case.md`
- Create: `eval/code-reviewer/samples/unreadable-anchor/expected.md`
- Create: `eval/spec-reviewer/target.json`
- Create: `eval/spec-reviewer/README.md`
- Create: `eval/spec-reviewer/replay.md`
- Create: `eval/spec-reviewer/intent.md`
- Create: `eval/spec-reviewer/samples/anchored-task/case.md`
- Create: `eval/spec-reviewer/samples/anchored-task/expected.md`
- Create: `eval/spec-reviewer/samples/unreadable-anchor/case.md`
- Create: `eval/spec-reviewer/samples/unreadable-anchor/expected.md`
- Test: `scripts/anchored-task.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/anchored-task.test.mjs`
- baseline: a265f923 skipped - scripts/anchored-task.test.mjs created by this task
- via: three worker personas and SDD-local templates
- `node --test eval/lib/lint.test.mjs`
- baseline: a265f923 pass
- via: `lintTarget` and `lintAll`

- [ ] **Step 1: Add failing anchor-contract tests.** Table the three personas and unreadable outcomes. Assert number-plus-colon matching, next level-2/3 boundary, anchor-list union, task/home-leg Rules derivation, report/structured mirroring, and inline compatibility. Pin unchanged frontmatter and path-based SDD template fields.
- [ ] **Step 2: Add conditional task loading.** With `planPath` and `anchor`/`anchors`, read selected task sections first. Match `### Task 4:` without matching Task 40; end at the next `^#{2,3}\s` line. For lists use the union. Read Spec anchors, Files and Tests, deriving Rules from the task plus its home-spec leg (explicit task Leg, otherwise first spec leg). Resolve Rules in the worker checkout. Without path fields retain inline requirements. Preserve spec authority and SR's no-test boundary.
- [ ] **Step 3: Add structured mirroring.** Keep existing reports unchanged. Implementer: status, one-sentence reasoning <=300 characters, conditional concerns/question, optional anchorUnreadable/measured. SR: verdict, optional PARTIAL/MISSING/SCOPE_CREEP maxSeverity, findingCount, parallelSafe, touchedTasks, trajectory, anchorUnreadable. CR: SHIP/FIX_FIRST/REJECT, required behaviourChange every time, optional severity/count/partition/owners/trajectory/anchorUnreadable. Unreadable plan/anchor yields BLOCKED/NEEDS_REWORK/REJECT respectively in report and JSON, with `anchorUnreadable` and the specified Reasoning line. Never review an unreadable section as successful.
- [ ] **Step 4: Rewrite SDD-local templates.** Carry planPath, anchor/list, absolute spec path, scoped command values, implementer report path, and prior review path. Children read task Tests/via/Create themselves. Keep trajectory and re-review marker semantics while making the child read the saved report. Keep the external requesting-code-review template unchanged and the SR persona/template authority clauses synchronized.
- [ ] **Step 5: Add the six worker eval cases.** Use synthetic `/workspace/project` file-read observations and Task 4/40 decoys. Include two CR task anchors, an inline implementer alternative, and SR's no-command boundary. Pin role-specific anchorUnreadable and report/JSON agreement; CR behaviourChange mirrors its footer. Text replays request the next read and consume supplied observations, never invent live tool access.
- [ ] **Step 6: Update assembly and intent.** Extend implementer replay routing for the new cases without changing its existing assembly. Add the local CR prompt to the headed target and adapt replay without changing legacy cases. Create the SR target from `eval/_template` conventions loading the persona and local template, plus README/replay/intent. Record each target's must-hold facts.
- [ ] **Step 7: Re-run scoped tests and lint.** Expect anchor-contract and real-target structural tests green. Run `node --check scripts/anchored-task.test.mjs` and Recon's instruction/target lint. Full-target model runs stay in header verification, not baseline; their reports/results are required evidence.
- [ ] **Step 8: Commit.** Stage listed worker/template/sample files; run `git commit -m "Load anchored tasks in implementer and review workers"`, recording instruction behavior change.

Exact anchor contract: `### Task 40:` is the negative control for Task 4. Read `Spec:`, `Files:`, `Tests:`, `Rules:` and the home `## Legs`; use task `Leg:` else first `### Leg:`. Pass `SCOPED_TEST_COMMANDS` independently. Keep `requesting-code-review` callers inline and one wave CR (`:183`). The local basenames are `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md`; report `Verdict:` and footers remain worker-owned. Emit `BLOCKED`, `NEEDS_REWORK`, or `REJECT` as specified; CR retains `SHIP`/`FIX_FIRST`/`REJECT`.

Copy the structured field contracts verbatim into role instructions, converting the type notation to the caller's outputSchema in Task 4:
- implementer: `{ status: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED, reasoning: string (one sentence, 300 chars), concerns?: string[] (required for DONE_WITH_CONCERNS, one line each), question?: string (required for NEEDS_CONTEXT), anchorUnreadable?: string, measured?: object (values an `orchestrator:` instruction consumes) }`.
- spec-reviewer: `{ verdict: COMPLIANT|NEEDS_REWORK|OUT_OF_SCOPE_CHANGES, reasoning: string (one sentence), maxSeverity?: PARTIAL|MISSING|SCOPE_CREEP, findingCount?: number, parallelSafe?: string (the `Parallel-safe:` line verbatim), touchedTasks?: number[], trajectory?: { verdict: CONVERGING|DIVERGING|STAGNANT, line: string (the `TRAJECTORY:` line verbatim) }, anchorUnreadable?: string }`.
- code-reviewer: `{ verdict: SHIP|FIX_FIRST|REJECT, reasoning: string (one sentence), maxSeverity?: Critical|Moderate|Minor, findingCount?: number, behaviourChange: boolean (every report, mirrors `Behaviour-change:`), parallelSafe?: string, touchedTasks?: number[], trajectory?: { verdict, line }, anchorUnreadable?: string }`.

Cross-task documentation/eval contract at L136: Task 5 updates `doc/configuration.md` for `plan_check`, `Orchestrator:`, `manifest-size`, `spillThreshold`, `doc/implement-engines.md` and `README.md`. Task 4 updates `eval/subagent-driven-development/` including `samples/chain-wave-dispatch/expected.md`, `samples/test-gate-repair/expected.md`, `samples/integrated-wave-repair/expected.md`, `samples/chain-stop-blocked/expected.md` and `intent.md`. This task owns the corresponding `eval/implementer/`, `eval/code-reviewer/`, and `eval/spec-reviewer/` contracts.

## Wave 2 - Manifest-driven orchestration

Depends on Wave 1: Task 4 consumes Task 1's manifest, Task 2's amendment modes, and Task 3's worker contracts. It updates the old cross-surface tests that assert the replaced payloads.

### Task 4: Coordinate waves, repairs, and recovery without opening artifacts
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested instruction code - update obsolete assertions, add scenarios, then rewrite the coordinator.

**Spec:** doc/specs/2026-10-29-orchestrator-delegation-guard.md § "Acceptance criteria" L29-L30, § "Acceptance criteria" L31-L32, § "Acceptance criteria" L33-L34, § "Acceptance criteria" L35-L36, § "Acceptance criteria" L37-L38, § "Acceptance criteria" L39-L40, § "2. The orchestrator's state during implement" L95-L95, § "2. The orchestrator's state during implement" L97-L97, § "2. The orchestrator's state during implement" L99-L99, § "2. The orchestrator's state during implement" L101-L101, § "2. The orchestrator's state during implement" L103-L103, § "3. Dispatch shapes and the verdict carrier" L107-L110, § "3. Dispatch shapes and the verdict carrier" L112-L112, § "3. Dispatch shapes and the verdict carrier" L114-L118, § "3. Dispatch shapes and the verdict carrier" L120-L120, § "3. Dispatch shapes and the verdict carrier" L122-L122, § "3. Dispatch shapes and the verdict carrier" L124-L124, § "4. Amendments mid-implement" L132-L132, § "5. Documentation and evals" L136-L136, § "Errors and edge cases" L145-L145, § "Errors and edge cases" L146-L146, § "Errors and edge cases" L147-L147, § "Errors and edge cases" L148-L148, § "Errors and edge cases" L149-L149, § "Errors and edge cases" L150-L151, § "Errors and edge cases" L152-L152, § "Errors and edge cases" L153-L153, § "Tests" L165-L172, § "Tests" L176-L176, § "Out of scope" L188-L188, § "Out of scope" L191-L191, § "Out of scope" L192-L192, § "Out of scope" L193-L193

Rules: skills/forge-skill/SKILL.md

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/reference/fix-loop.md`
- Modify: `skills/subagent-driven-development/stop-note.md`
- Create: `skills/subagent-driven-development/reference/dispatch-contract.md`
- Create: `skills/subagent-driven-development/reference/implement-amendments.md`
- Modify: `scripts/wave-review.test.mjs`
- Modify: `eval/subagent-driven-development/target.json`
- Modify: `eval/subagent-driven-development/intent.md`
- Modify: `eval/subagent-driven-development/samples/chain-wave-dispatch/case.md`
- Modify: `eval/subagent-driven-development/samples/chain-wave-dispatch/expected.md`
- Modify: `eval/subagent-driven-development/samples/test-gate-repair/case.md`
- Modify: `eval/subagent-driven-development/samples/test-gate-repair/expected.md`
- Modify: `eval/subagent-driven-development/samples/chain-stop-blocked/case.md`
- Modify: `eval/subagent-driven-development/samples/chain-stop-blocked/expected.md`
- Modify: `eval/subagent-driven-development/samples/integrated-wave-repair/case.md`
- Modify: `eval/subagent-driven-development/samples/integrated-wave-repair/expected.md`
- Create: `eval/subagent-driven-development/samples/no-plan-read-wave/case.md`
- Create: `eval/subagent-driven-development/samples/no-plan-read-wave/expected.md`
- Create: `eval/subagent-driven-development/samples/delegated-source-investigation/case.md`
- Create: `eval/subagent-driven-development/samples/delegated-source-investigation/expected.md`
- Create: `eval/subagent-driven-development/samples/repair-compaction-recovery/case.md`
- Create: `eval/subagent-driven-development/samples/repair-compaction-recovery/expected.md`
- Create: `eval/subagent-driven-development/samples/report-by-path-fix/case.md`
- Create: `eval/subagent-driven-development/samples/report-by-path-fix/expected.md`
- Create: `eval/subagent-driven-development/samples/chain-error-diagnosis/case.md`
- Create: `eval/subagent-driven-development/samples/chain-error-diagnosis/expected.md`
- Create: `eval/subagent-driven-development/samples/delegated-amendment/case.md`
- Create: `eval/subagent-driven-development/samples/delegated-amendment/expected.md`
- Test: `scripts/wave-review.test.mjs`
- Test: `scripts/implement-amendment.test.mjs`
- Test: `scripts/anchored-task.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/wave-review.test.mjs`
- baseline: a265f923 pass
- via: wave recipe, scratch-index capture, and review snapshot shell
- `node --test scripts/implement-amendment.test.mjs`
- baseline: a265f923 skipped - scripts/implement-amendment.test.mjs created by this task
- via: amendment caller/worker agreement
- `node --test scripts/anchored-task.test.mjs`
- baseline: a265f923 skipped - scripts/anchored-task.test.mjs created by this task
- via: path payload and persona agreement
- `node --test eval/lib/lint.test.mjs`
- baseline: a265f923 pass
- via: headed target assembly and sample structure

- [ ] **Step 1: Replace obsolete assertions with failing new checks.** Expect schemas on both wave steps; item-level output/file-only; path payloads; structured SR verdicts; exact new SR acceptance reason. Add one-step CR/repair/re-review/delegated-read assertions. Pin the diagnosis exception: one sequential step, omitted agent, no parallel item, invocation-level fresh context, decision stopOn, output and schema. Remove only full-task/report, schema-free SR, and blanket no-second-chain assertions; still forbid repeating the initial wave chain. Replace the stop-note file hash with assertions preserving its gate/format while permitting delegated prose. Keep executable snapshot/index tests. Add caller contract checks for required items/redraws arrays, malformed preparation rejection, redraw-only and mixed batches stopping before grants or sibling apply, and a failed first apply forwarding its report path to a fresh retry that returns original anchor changes.
- [ ] **Step 2: Define `## Orchestrator holds` near the top.** Enumerate manifest, tracker, absolute skill resources, structured JSON, Artifacts patch paths, coordination/scoped-gate output, Worktree ready values, and delegated essence. Prohibit parent plan/spec/task/report/source reads and content-loading shell commands. Invert the old red flag; a file-only pointer never authorizes opening a report. Scope the rule to implement, leaving other phases and the loop engine unchanged.
- [ ] **Step 3: Add dispatch-contract reference.** Put full outputSchema definitions and common one-step carrier in `reference/dispatch-contract.md`, with a read-now pointer. Match Task 3's field names and enums; bound reasoning, conditional concerns/question, measured values, partition/owners/trajectory and required CR behaviourChange. Add the Task 2 preparation schema with both arrays required, redraw entries carrying location/reason and reason maxLength 300, and the unchanged apply result schema. Apply output/file-only/schema to every item. Retain foreground/fresh semantics and runtime-selected models. Route from chain Outputs JSON, never details.

  Decision: delegated answer/items/apply carriers need stopOn to expose Outputs but no extra field in their approved schemas. Use carrier-only `stopOn: { path: "/status", in: ["BLOCKED"] }`: pi-cohort `src/runs/shared/stop-conditions.ts:32-79` requires a schema and treats an absent pointer as no match; `src/runs/foreground/chain-execution.ts:475-488` renders successful Outputs whenever a step has stopOn. Decision: the diagnosis child uses a one-step sequential chain with `agent` omitted, never a parallel item - amended spec L110/L122 and pi-cohort `src/extension/schemas.ts:172-206` settle that boundary. Keep invocation-level `context: "fresh"` and `async: false`.

- [ ] **Step 4: Rewrite initial wave dispatch and manifest consumers.** Use manifest files for independence, tests arrays for the scoped union without command splitting/joining, leg for the provisioned checkout, and mode for in-place behavior. Every worker gets absolute planPath, exact heading-prefix anchor/list, and manifest spec path. Dependent context is status line plus prior report path. Preserve isolated implementers, paired materialized SR trees, step concurrency and implementer-only stopOn, followed by one initial integrated CR as a one-step chain per code wave. Doc-only stays SR-only. Transcribe the chained-SR acceptance reason from spec L124 exactly.
- [ ] **Step 5: Preserve primary coordination.** Keep serial apply, conflict survivor handling, scoped union test gate, pre-review staging, fixed WAVE_BASE_SHA, HEAD_SHA WORKTREE, and commit-before-complete. Run each tests element separately with output redirected under REPORT_DIR and retain its exit status. Repairs receive failed-output paths. In-place waves skip nested worktrees and reset-soft folding.
- [ ] **Step 6: Rewrite repairs and failure diagnosis.** All repair implementers, SR fan-outs, re-reviews, escalated/funded rounds use one-step carriers, anchors, and saved prior report under `## Previous review report (re-review trigger)`. Workers read findings; the parent routes by status/concerns/question, trajectory, severity/count, behaviourChange, partition and touched owners. Missing trajectory escalates; absent partition serializes; absent multi-task owners means all dispatched tasks. Required-output failure marks only that task failed; accepted siblings remain valid. Missing Outputs delegates artifact diagnosis and consumes compact statuses plus retry/repair/stop. Use `chain: [{ task, output, outputMode: "file-only", outputSchema, stopOn }]`, no `parallel:`, with `stopOn: { path: "/decision", in: ["retry", "repair", "stop"] }` on the sequential step and `agent` omitted. Keep bounded retry and never rerun accepted siblings.
- [ ] **Step 7: Preserve fix-delta semantics without loading bytes.** Keep snapshots, scratch-index capture, tree-before/after, failed setup retention and tree lifetimes. Delegate producing/reading binary diff contents from the recorded trees under the existing `## Fix delta` contract; the parent does not run a content diff. Keep trajectory rules unchanged. Empty changes count as failed attempts under the existing two-attempt limit. Snapshot cleanup follows the structured terminal result, not a parent report read.
- [ ] **Step 8: Delegate remaining reads and stop-note text.** Source questions, provenance, task-content questions, and human escalation wording use answer/evidence carrier. Update stop-note and funded-round grant reads to delegated observations. Keep one-screen gate, budget line, lookup ordering and no guessed repair. A delegated failure stops instead of recursively diagnosing without bound.
- [ ] **Step 9: Add boundary actions and recovery.** Execute the manifest orchestrator instruction once after wave commit and before next dispatch, limited to tracker/settings/git/value-forwarding/delegated amendment. Measured values come from structured output; persistence uses Task 2. Unknown actions stop quoting their text. Print the spec's wave-base, status/verdict report/patch, review-tree, and funded-round transcript lines at the named events. Recovery gets static data from one plan_check and tracker status, dynamic data only from those transcript lines. In-progress with missing lines stops naming wave/facts; never infer integration, rerun workers, or reset spending.
- [ ] **Step 10: Wire delegated amendments.** In `reference/implement-amendments.md`, dispatch prepare with evidence and require items/redraws arrays, including empty arrays; fail malformed output. Inspect redraws in structured JSON first. A nonempty array holds the whole batch at the existing redraw gate before grant evaluation or any sibling apply; never open the preparation report to discover redraws. Only with no redraws obtain current grant/decoding via delegated answer/evidence, preserve malformed/no-permission/human gates, and apply granted items verbatim. Require first apply to capture original task numbers, titles, spec anchors, and wave positions in its existing saved report and retain them on every return, including failure. Retry false apply once with failLines as the rule and previousApplyReport set to that first apply report path; the fresh child reads original inventory, applies idempotently, and computes deltas against that inventory, not the mutated plan. Missing inventory fails retry; escalate the second failure. After child success and parent PASS consume deltas, replace manifest, reconcile task numbers, and make the existing audit commit. Keep the result schema and report artifact, add no sidecar, and keep the parent from opening spec/plan/report.
- [ ] **Step 11: Update eval cases.** Rewrite `chain-wave-dispatch`, `test-gate-repair`, `chain-stop-blocked`, and `integrated-wave-repair` to supply manifest/path observations and assert structured routing. Add six cases: no-read clean wave, delegated source question, active repair recovery with present/missing transcript alternatives, report-path behavior-changing fix, no-Outputs diagnosis including missing structured sibling, and delegated amendment with grant/no-grant/malformed/second-failure boundaries. Extend delegated-amendment with redraw-only and mixed redraw/amend observations requiring a whole-batch stop before grants or sibling edits; reject a missing array. Include first apply changing task anchors then failing self-check and a fresh retry consuming previousApplyReport, preserving the original inventory and returning those original anchor changes; missing inventory fails and granted edits are not duplicated. In `chain-error-diagnosis`, pin a one-step sequential chain, omitted agent, invocation-level fresh context, decision stopOn, output/file-only/schema and no parallel item. Cover in-place/leg routing in clean-wave variants and measured-value persistence in amendment. Pin zero content-loading commands, item/chain placement, no invented verdict and accepted-sibling retention.
- [ ] **Step 12: Update assembly and run scoped checks.** Include Orchestrator holds and the two references in the SDD target; keep sample bundle exclusions valid. Update intent, including whole-batch redraw gating and original-inventory retry. Run all four scoped Tests commands and `node --check scripts/wave-review.test.mjs`, then Recon instruction/target lint. Keep the skill below 500 lines by placing schemas and amendment mechanics in the references with read-now pointers, not unrelated extractions.
- [ ] **Step 13: Commit and retain live-session venue.** Run `git commit -m "Coordinate implement waves from manifests and structured results"`, recording instruction behavior change. This enables the local-pi-session venue at spec L39-L40: after loading the changed package, audit primary read/bash calls between implement start and completion for zero plan/spec/source reads and content-loading commands. Structural tests and synthetic evals do not claim live-session proof; keep that obligation for verification.

Exact coordination contract: read `plan_check({ planPath })` and `plan_tracker({ action: "status" })` for static recovery (`plan_tracker status` in the eval observation). Retain `WAVE_BASE_SHA`, `in_progress`, `Artifacts:`, `Worktree ready`, `content`, `structured`, `output:`, `outputMode: "file-only"`, `outputSchema`, `REPORT_DIR`, `stopOn`, `## Outputs`, and `## Stop` as the routing carriers. For a regular `ParallelStep`, `outputMode` belongs on each item; never allow the default `inline`. One-step diagnosis uses `chain: [{ task, ... }]` as the sequential form, not `tasks:` or a single `subagent()`. The `ParallelTaskSchema` requires `required: ["agent"]`; `ChainItem` makes `agent` optional. Required-output errors route as failed attempts; the primary never opens `single-output.ts:120-121` artifacts. Keep `/status` or `/verdict` stops for named verdict-bearing children and the decision stop for diagnosis.

Use anchored `planPath`, `anchor` or `anchors` (`### Task N:`), including the Task 4/40 boundary `### Task 4:`, `### Task 40:`, and `^#{2,3}\s`. Children read `Spec:`, `Files:`, `Tests:`, `Rules:`, `Leg:` and home `## Legs`/`### Leg:`. The parent unions `tests` into `SCOPED_TEST_COMMANDS`, checks `files`, routes `leg`, and selects `in-place` from `"mode":"in-place"`; preserve no `worktree: true` or `reset --soft` fold for in-place waves. At a completed-wave boundary consume only explicit `orchestrator` from `Orchestrator:`; allow `plan_tracker`, `phase_tracker`, `gauntlet_setting` and the named git operations. A `manifest-size` result stops for plan reduction. Ordinary primary-directed prose stays invisible.

Primary shell allowlist: `rev-parse`, `status --porcelain`, `diff --stat`, `apply`, `reset --soft`, `add -A`, `commit`, `update-ref`. Prohibit `read` of deliverable artifacts and content-loading `cat`, `sed -n`, `git diff` without `--stat`, and contextual `grep`/`rg` over source. The exact inverse red flag is "Pasting task text, spec excerpts, or report contents into a dispatch, or opening the plan, spec, a report, or a source file in the primary". Keep `phase_tracker start implement` through completion as the live `venue:` window; no read guard, transport change or loop change.

Exact delegated-read schema: `{ answer: string (one paragraph), evidence: string[] (path:line, each one line) }`. Exact diagnosis schema: `{ tasks: [{ task: number, status: string, reportPath: string, patchPath?: string, diagnostic: string (one sentence) }], decision: retry|repair|stop, diagnostic: string }`. Give both saved report paths. Retain terminal schema-bound `BLOCKED`, `NEEDS_REWORK`, `REJECT` and `anchorUnreadable` routing without parent inspection. The chained SR `acceptance` reason is `"the parent takes each SR verdict from the chain's ## Outputs structured JSON; review trees are staged by design"`.

Copy these type contracts to outputSchema and mirror the report, not independent verdict calculations:
- implementer: `{ status: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED, reasoning: string (one sentence, 300 chars), concerns?: string[] (required for DONE_WITH_CONCERNS, one line each), question?: string (required for NEEDS_CONTEXT), anchorUnreadable?: string, measured?: object (values an `orchestrator:` instruction consumes) }`.
- spec-reviewer: `{ verdict: COMPLIANT|NEEDS_REWORK|OUT_OF_SCOPE_CHANGES, reasoning: string (one sentence), maxSeverity?: PARTIAL|MISSING|SCOPE_CREEP, findingCount?: number, parallelSafe?: string (the `Parallel-safe:` line verbatim), touchedTasks?: number[], trajectory?: { verdict: CONVERGING|DIVERGING|STAGNANT, line: string (the `TRAJECTORY:` line verbatim) }, anchorUnreadable?: string }`.
- code-reviewer: `{ verdict: SHIP|FIX_FIRST|REJECT, reasoning: string (one sentence), maxSeverity?: Critical|Moderate|Minor, findingCount?: number, behaviourChange: boolean (every report, mirrors `Behaviour-change:`), parallelSafe?: string, touchedTasks?: number[], trajectory?: { verdict, line }, anchorUnreadable?: string }`.

Route `status`, `concerns`, `question`, `trajectory.verdict`, `maxSeverity`, `findingCount`, `behaviourChange`, `parallelSafe`, and `touchedTasks`. Preserve the `3 -> 1, max severity Moderate` comparison. Missing `trajectory` or `TRAJECTORY:` escalates, missing `Parallel-safe:` serializes, absent touched owners on a multi-task repair means all tasks. Prior `Verdict:` remains child-owned.

Amendment caller fields: `plan-writer`, `Amend-prepare:`, `Amend-apply:`, `Amend:`, `Amend-grant:`, `amendment-surface.md`. Preparation result: `{ items: [{ evidence, recommended: "accept" | "alt-<n>", location: "<spec section>", edit: string }], redraws: [{ location: "<spec section>", reason: string (max 300 characters) }] }`. Require `items` and `redraws` arrays and keep redraws out of items; fail malformed preparation. Any redraw holds the whole batch before grants or sibling applies. Apply result stays `{ amendedSections: string[], tasksAdded: number[], tasksAnchorChanged: number[], tasksRemoved: number[], passed: boolean, failLines?: string[] }`. Reconcile `tasksAdded` through `add`, completed `tasksAnchorChanged` through `in_progress`, and `tasksRemoved` by the existing path after parent PASS. Retry `passed: false` once with `failLines` and `previousApplyReport` pointing to the first apply report containing original task numbers, titles, spec anchors, and wave positions. The retry worker reads that inventory, applies granted edits idempotently, and computes original deltas; missing inventory fails. Keep the existing saved report and no sidecar.

Required transcript templates, instantiated from observed values only:
```text
wave <w> base <sha>
wave <w> task <n> <status|verdict> <value> report <path> patch <path>
wave <w> review <k> tree <path>
funded round <k> of <N> for task <n>
```

Source anchor crosswalk from the approved spec: `:20-26`, `:355`, `:137`, `:143`, `:258-271`, `:284`, `:123`, `:46`, `:48`, `:174`, `:183`, `:270`, `:282`, `reference/fix-loop.md:23`, `chain-execution.ts:475-488`, `formatters.ts:77-94`, `settings.ts:428`, `schemas.ts`, `schemas.ts:206`, `chain-execution.ts:1225`, `:1268`, `chain-execution.ts:480`, `failureSummaryOptions`, `stopRecord`, `agents/plan-writer.md:3`, `skills/writing-plans/SKILL.md:86`, `skills/brainstorming/reference/amendment-surface.md:180-186`. Preserve the mechanisms these citations identify; do not copy line numbers as operational instructions.

Cross-task documentation/eval contract at L136: Task 5 updates `doc/configuration.md` for `plan_check`, `Orchestrator:`, `manifest-size`, `spillThreshold`, plus `doc/implement-engines.md` and `README.md`. This task updates `eval/subagent-driven-development/` including `samples/chain-wave-dispatch/expected.md`, `samples/test-gate-repair/expected.md`, `samples/integrated-wave-repair/expected.md`, `samples/chain-stop-blocked/expected.md` and `intent.md`. Task 3 owns `eval/implementer/`, `eval/code-reviewer/`, and `eval/spec-reviewer/` from `eval/_template`.

## Wave 3 - User documentation

Depends on Wave 2: publish the implemented pass-output and coordination contracts after all consumers agree. This is the trailing documentation-only wave.

### Task 5: Document the manifest and delegated task-plan engine
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Documentation-only - verify the contract against implemented behavior and leave unrelated units intact.

**Spec:** doc/specs/2026-10-29-orchestrator-delegation-guard.md § "5. Documentation and evals" L136-L136, § "Documentation impact" L181-L182

**Files:**
- Modify: `doc/configuration.md`
- Modify: `doc/implement-engines.md`
- Modify: `README.md`

**Tests:**
- none: user documentation; no Markdown formatter is configured

- [ ] **Step 1: Amend the plan_check paragraph.** In `doc/configuration.md:192`, describe PASS plus manifest header/JSON lines, Orchestrator first-match grammar, intact command-array elements, ledger/no-flow behavior, inclusive 32,768 JS-character cap and no-stamp failure. State that pi-condense spillThreshold is at default 65,536 or above 32,768. The remedy is plan reduction, never opening a spilled manifest.
- [ ] **Step 2: Amend engine architecture.** In `doc/implement-engines.md`, describe compact manifest, delegated reads, anchored workers, file-only structured chains and transcript recovery. Retain loop engine, hash gate and selection semantics.
- [ ] **Step 3: Amend README runtime bullet.** State that plan_check stamps passing hashes and returns a bounded manifest. Link the configuration guide rather than repeating schemas; retain other runtime bullets.
- [ ] **Step 4: Review and commit.** Check touched paths/values against Tasks 1-4. Add no new guide/shared-core/change-history block; CHANGELOG remains deferred. Run `git commit -m "Document manifest-based implement orchestration"`.

Exact documentation terms: `plan_check`, `Orchestrator:`, `manifest-size`, `spillThreshold`; honor `CHANGELOG.md - deferred: release`. Check the guides against the companion eval evidence without taking ownership of it: `eval/subagent-driven-development/`, `samples/chain-wave-dispatch/expected.md`, `samples/test-gate-repair/expected.md`, `samples/integrated-wave-repair/expected.md`, `samples/chain-stop-blocked/expected.md`, `intent.md`; `eval/implementer/`, `eval/code-reviewer/`, `eval/spec-reviewer/` and `eval/_template`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L21-L22 | Manifest fields and unchanged stamping | Task 1 |
| § "Acceptance criteria" L23-L24 | Inclusive size rejection and no stamp | Task 1 |
| § "Acceptance criteria" L25-L26 | Ledger text unchanged | Task 1 |
| § "Acceptance criteria" L27-L28 | Task 4 Orchestrator fixture and absence | Task 1 |
| § "Acceptance criteria" L29-L30 | No primary file reads; workers get paths | Task 4 |
| § "Acceptance criteria" L31-L32 | Clean-wave JSON routing | Task 4 |
| § "Acceptance criteria" L33-L34 | Forward prior report by path | Task 4 |
| § "Acceptance criteria" L35-L36 | Recovery from static and transcript state or stop | Task 4 |
| § "Acceptance criteria" L37-L38 | Worker unreadable-anchor outcomes and routing | Task 3, Task 4 |
| § "Acceptance criteria" L39-L40 | Enable live-session zero-read venue | Task 4 |
| § "1. `plan_check` returns the manifest" L77-L84 | Normalized result, ordered JSON and optional fields | Task 1 |
| § "1. `plan_check` returns the manifest" L86-L86 | Both passes, cap, existing failure and ledger exemption | Task 1 |
| § "1. `plan_check` returns the manifest" L88-L91 | Bounded shape for all callers and optional task grammar | Task 1 |
| § "2. The orchestrator's state during implement" L95-L95 | Allowed state, forbidden reads and primary coordination | Task 4 |
| § "2. The orchestrator's state during implement" L97-L97 | Delegate investigations, content questions and escalation prose | Task 4 |
| § "2. The orchestrator's state during implement" L99-L99 | Remove parent task/spec/report read and write instructions | Task 4 |
| § "2. The orchestrator's state during implement" L101-L101 | Manifest tests/files/leg/mode and boundary actions | Task 4 |
| § "2. The orchestrator's state during implement" L103-L103 | Static recovery plus required dynamic transcript | Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L107-L110 | Two-step wave, named one-step parallel carriers, anonymous sequential diagnosis | Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L112-L112 | Anchors, unions, Rules and dependent path context | Task 3, Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L114-L118 | Structured role shapes mirror reports | Task 3, Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L120-L120 | Field-based routing and conservative absence defaults | Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L122-L122 | Missing-Outputs sequential diagnosis with accepted siblings retained | Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L124-L124 | Prior-report/failed-output paths, delta and SR acceptance | Task 4 |
| § "3. Dispatch shapes and the verdict carrier" L126-L128 | Templates and conditional persona paths, unchanged inline callers | Task 3 |
| § "4. Amendments mid-implement" L132-L132 | Delegate prepare/apply, gates, deltas, stamp, one retry | Task 2, Task 4 |
| § "4. Amendments mid-implement" L132-L132 | Require both preparation arrays, reject malformed output, hold redraw-only and mixed batches before grants or sibling applies without report reads | Task 2, Task 4 |
| § "4. Amendments mid-implement" L132-L132 | Save original task inventory in first apply report on every return; forward previousApplyReport for an idempotent retry deriving original deltas; missing inventory fails | Task 2, Task 4 |
| § "4. Amendments mid-implement" L132-L132 | Keep apply schema, report artifact, one-retry budget and no sidecar; test redraw batches and first-failed-apply anchor changes surviving a fresh retry | Task 2, Task 4 |
| § "5. Documentation and evals" L136-L136 | Guides and all four eval targets cover new contract | Task 3, Task 4, Task 5 |
| § "Errors and edge cases" L142-L144 | Ordinary failure, no-flow pass and repeated stamp | Task 1 |
| § "Errors and edge cases" L145-L145 | Amendment invalidates hashes and replaces manifest/tracker | Task 2, Task 4 |
| § "Errors and edge cases" L146-L146 | Oversize stop for plan reduction | Task 1, Task 4 |
| § "Errors and edge cases" L147-L147 | Unmarked body prose stays invisible | Task 1, Task 4 |
| § "Errors and edge cases" L148-L148 | Unsupported action stops quoting text | Task 4 |
| § "Errors and edge cases" L149-L149 | Unreadable anchor fails without a parent read | Task 3, Task 4 |
| § "Errors and edge cases" L150-L151 | Diagnose missing structured data and retain siblings | Task 4 |
| § "Errors and edge cases" L152-L152 | Missing repair transcript stops without re-dispatch | Task 4 |
| § "Errors and edge cases" L153-L153 | File-only paired with output path | Task 4 |
| § "Errors and edge cases" L154-L155 | Bounded outside-caller pass and no ledger manifest | Task 1 |
| § "Tests" L159-L162 | Pure rendering, commands, omission, normalized legs and ledger tests | Task 1 |
| § "Tests" L163-L164 | Registered-tool cap, pass/fail, repeated stamp and ledger tests | Task 1 |
| § "Tests" L165-L172 | SDD no-read carriers, repair, diagnosis, recovery and amendment cases | Task 4 |
| § "Tests" L173-L175 | Three worker targets test anchors, failures and inline compatibility | Task 3 |
| § "Tests" L176-L176 | Live-session evidence remains a venue | Task 4 |
| § "Tests" L177-L177 | Regenerate bin bundles after library edit | Task 1 |
| § "Documentation impact" L181-L182 | Existing guide units and deferred release notes | Task 5 |
| § "Out of scope" L188-L188 | Other phase authoring/resume/verification unchanged | Task 2, Task 4 |
| § "Out of scope" L189-L190 | No read guard, budget, telemetry or FAIL capping | Task 1 |
| § "Out of scope" L191-L191 | Integration/tests/commits remain primary-owned | Task 4 |
| § "Out of scope" L192-L192 | Existing pi-cohort transport without dependency changes | Task 4 |
| § "Out of scope" L193-L193 | Preserve loop engine | Task 1, Task 4 |

