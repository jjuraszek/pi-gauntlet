# Loop-engine scaled iteration cap Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Persist a row-scaled loop cap, support durable human grants and settings-free resume, and split drafted tree-wide acceptance rows before ledger creation.

**Architecture:** Keep enforcement in the loop driver's instructions; the TypeScript resolver supplies only the per-row multiplier. Seed one durable ledger cap, preserve it across row changes, and route every ledger restore through one cap admission boundary. Keep drafted-row splitting in brainstorming rather than changing ledger row validation.

**Tech Stack:** TypeScript, Node.js 24 strip-types and test runner, Markdown skills, esbuild bundles, text eval harness.

**Spec:** `doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md`

**Verification:** `npm test`; `node eval/run.mjs loop-implementation`; `node eval/run.mjs gauntlet-resume`; `node eval/run.mjs brainstorming` - the first command bundles syntax, skill/style, instruction-size, eval-structure and hygiene checks, including bundle freshness through npm run build:bins. The three full-target runs prove the new cap +N, cap: restore and drafted-split samples; commit each fresh report.md and changed result records. No separate formatter is configured.

---

## Files

### Settings and generated bundles

Modify:
- `extensions/lib/gauntlet-settings.ts`
- `extensions/lib/gauntlet-settings.test.ts`
- `extensions/phase-tracker.test.ts`
- `bin/gauntlet-telemetry-seal.mjs`, `bin/gauntlet-performance.mjs`, `bin/gauntlet-spec-index.mjs` - generated only; commit changed outputs, not unchanged files.

### Ledger driver and resume

Modify:
- `skills/loop-implementation/SKILL.md`
- `skills/gauntlet-resume/SKILL.md`
- `skills/gauntlet-resume/reference/reconstruction.md`
- `skills/gauntlet-resume/reference/brief-contract.md`
- `scripts/loop-engine-contract.test.mjs`
- `scripts/brief-contract-lint.test.mjs`
- `extensions/lib/plan-check.test.ts`
- `eval/loop-implementation/samples/cap-and-exit-verification/case.md`
- `eval/loop-implementation/samples/cap-and-exit-verification/expected.md`
- `eval/loop-implementation/samples/commit-boundary/case.md`
- `eval/loop-implementation/samples/commit-boundary/expected.md`
- `eval/gauntlet-resume/samples/loop-no-ledger/case.md`
- `eval/gauntlet-resume/samples/loop-no-ledger/expected.md`
- `eval/gauntlet-resume/samples/loop-ledger-worktree/case.md`
- `eval/gauntlet-resume/samples/loop-ledger-worktree/expected.md`
- `eval/gauntlet-resume/samples/loop-ledger-brief/case.md`
- `eval/gauntlet-resume/samples/loop-ledger-brief/expected.md`
- `eval/loop-implementation/intent.md`, `eval/loop-implementation/report.md`
- `eval/gauntlet-resume/intent.md`, `eval/gauntlet-resume/report.md`
- Existing generated `eval/loop-implementation/results/**/*.json` and `eval/gauntlet-resume/results/**/*.json`; the runner determines which cached records change.

Create:
- `eval/loop-implementation/samples/scaled-cap-grant/case.md`
- `eval/loop-implementation/samples/scaled-cap-grant/expected.md`
- `eval/loop-implementation/samples/legacy-cap/case.md`
- `eval/loop-implementation/samples/legacy-cap/expected.md`
- `eval/gauntlet-resume/samples/durable-cap/case.md`
- `eval/gauntlet-resume/samples/durable-cap/expected.md`
- `eval/gauntlet-resume/samples/legacy-cap-brief/case.md`
- `eval/gauntlet-resume/samples/legacy-cap-brief/expected.md`
- `eval/loop-implementation/results/scaled-cap-grant/baseline.json`
- `eval/loop-implementation/results/scaled-cap-grant/candidate.json`
- `eval/loop-implementation/results/legacy-cap/baseline.json`
- `eval/loop-implementation/results/legacy-cap/candidate.json`
- `eval/gauntlet-resume/results/durable-cap/baseline.json`
- `eval/gauntlet-resume/results/durable-cap/candidate.json`
- `eval/gauntlet-resume/results/legacy-cap-brief/baseline.json`
- `eval/gauntlet-resume/results/legacy-cap-brief/candidate.json`

### Drafted-row integrity

Modify:
- `skills/brainstorming/reference/ticket-acceptance.md`
- `scripts/brainstorming-contract.test.mjs`
- `eval/brainstorming/intent.md`, `eval/brainstorming/report.md`
- Existing generated `eval/brainstorming/results/**/*.json`.

Create:
- `eval/brainstorming/samples/tree-wide-drafted-row/case.md`
- `eval/brainstorming/samples/tree-wide-drafted-row/expected.md`
- `eval/brainstorming/results/tree-wide-drafted-row/baseline.json`
- `eval/brainstorming/results/tree-wide-drafted-row/candidate.json`

### Cross-cutting documentation

Modify:
- `doc/configuration.md`
- `doc/implement-engines.md`
- `CHANGELOG.md`

Delete: none. Keep `extensions/phase-tracker.ts` and `extensions/lib/plan-check.ts` unchanged: the former already spreads the resolver output and the latter already ignores unrecognized ledger headers.

## Recon and execution conventions

- Read the loaded `/skill:forge-skill` authoring rules for every instruction edit: imperative voice, observed-state tables, minimal edits at the owning rule, unchanged frontmatter, generic examples and compact Markdown tables. The affected instruction files are below 500 lines; keep the loop driver below its existing 500-line contract assertion.
- Existing seams: `resolveLoopEngine` at `extensions/lib/gauntlet-settings.ts:96-101`; tool payload spread at `extensions/phase-tracker.ts:904-912`; wrapper tests at `extensions/phase-tracker.test.ts:1406-1422`; ledger admission at `extensions/lib/plan-check.ts:1137-1173` and fixtures at `extensions/lib/plan-check.test.ts:23-65`.
- Driver entry, ordered stops and parent repair are in `skills/loop-implementation/SKILL.md:11-129`. Resume restore is in `reference/reconstruction.md:74-86`, `reference/brief-contract.md:162-170`, and the route rows in `skills/gauntlet-resume/SKILL.md:160-170`. Draft integrity is in `skills/brainstorming/reference/ticket-acceptance.md:63-75`.
- The full entrypoints belong only to the header. Task commands below are file-scoped deterministic tests; partial eval commands are implementation checks, not plan-time Baseline commands. At verify, run all full targets and commit their refreshed reports/records, including records reused from partial runs.
- No override Happy path table or per-service verification exists. The package has no standalone formatter or general lint CLI. Use Node syntax checks and the exported scoped lint functions below; preserve neighboring whitespace and compact tables rather than introducing tooling.
- Decision: mark newly authored eval cases `baseline-skipped: new sample, no pre-edit sample evidence` in case prose and intent rationale; do not add an eval runner flag or invent baseline records. `eval/run.mjs:323-362` always obtains both comparison arms, and `eval/README.md` documents no runtime skip option. This mark describes missing pre-edit sample evidence; normal partial/full evals still generate genuine baseline and candidate records.
- Bind each changed `intent.md` to the actual bundle-free assembly SHA printed by the runner's stale-intent refusal. Keep every moved existing fact under `## Expected to move`; do not weaken a fact merely to get a passing report.

## Baseline provenance

BASE: `a5056f62`. Initial inventory before plan creation: clean. Pre-command inventory: `?? doc/plans/2026-10-26-loop-engine-scaled-iteration-cap.md`. Admitted paths: only `doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md` and `doc/plans/2026-10-26-loop-engine-scaled-iteration-cap.md`. All six commands below executed unchanged, exit 0, with respectively 32, 162, 1, 1, 143 and 32 tests passing. After each command HEAD remained `a5056f62` and the inventory contained only the admitted untracked plan; no generated artifacts or source changes appeared. Ordinary citation repair retains these unchanged-command results at the same BASE.

## Wave 1 - Behavior contracts

Tasks own disjoint files and mutate no shared runtime resource. Unit tests use private temporary fixture directories; eval runs write separate target result directories. The loop/resume task uses the approved settings shape directly in its text fixtures, so it does not depend on the resolver implementation landing first.

### Task 1: Resolve the per-row setting

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md § "Acceptance criteria" L28, § "Settings resolver" L51, § "Errors and edge cases" L99, § "Errors and edge cases" L100, § "Errors and edge cases" L101, § "Tests" L115, § "Tests" L116

**Files:**
- Modify: `extensions/lib/gauntlet-settings.ts:13-18`
- Modify: `extensions/lib/gauntlet-settings.ts:96-101`
- Modify: `extensions/lib/gauntlet-settings.test.ts:25-41`
- Modify: `extensions/phase-tracker.test.ts:1406-1422`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Test: `extensions/lib/gauntlet-settings.test.ts`
- Test: `extensions/phase-tracker.test.ts`

**Tests:**
- `node --experimental-strip-types --test extensions/lib/gauntlet-settings.test.ts`
- baseline: a5056f62 pass
- via: `resolveLoopEngine`
- `node --experimental-strip-types --loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts`
- baseline: a5056f62 pass
- via: `gauntlet_setting({ key: "loopEngine" })`

- [ ] **Step 1: Run the two existing scoped commands.** Confirm both are green before modifying the current table and tool tests.
- [ ] **Step 2: Extend the resolver matrix.** Assert `{ maxIterationsPerRow: 4, warning: undefined }` for an absent `piGauntlet.loopEngine` block. Cover a valid 7, `maxIterationsPerRow: 0`, negative integers, `maxIterationsPerRow: "4"`, `4.5`, booleans and null. Missing/undefined new value uses default 4; all present non-integers use 4 and the exact integer warning. Cover `maxIterations` alone, beside a valid new key, beside a malformed new key, and present with undefined/null/false values; its value never contributes to the result.
- [ ] **Step 3: Migrate both wrapper tests.** Keep the names `gauntlet_setting loopEngine resolves the key` and `gauntlet_setting loopEngine composes settings load warnings`. Use `.pi/settings.json` fixtures, read `details.maxIterationsPerRow`, assert `key`, `errors`, the removed old result field, no loopEngine warning on defaults, and continued settings-load warning composition. Add a loaded legacy-key fixture so both resolver warnings survive the tool wrapper.
- [ ] **Step 4: Run both scoped commands for red.** Expected: new-shape/default/warning assertions fail against the old `{ maxIterations, warning }` output.
- [ ] **Step 5: Implement the resolver at its existing seam.** Change the configuration shape to accept `maxIterationsPerRow?: unknown` while retaining `maxIterations?: unknown` solely for removed-key diagnostics. Resolve `piGauntlet.loopEngine.maxIterationsPerRow` to integer >=1, floor integers below 1, and default to 4 for absent or invalid values. Detect the old key by own-property presence, not truthiness. Return `{ maxIterationsPerRow, warning }`; join warnings in removed-key-first order with `; `:

  ```ts
  export function resolveLoopEngine(g: PiGauntlet): { maxIterationsPerRow: number; warning: string | undefined } {
    const loop = g.loopEngine;
    const raw = loop?.maxIterationsPerRow;
    const valid = typeof raw === "number" && Number.isInteger(raw);
    const warnings: string[] = [];
    if (loop && Object.hasOwn(loop, "maxIterations")) {
      warnings.push("loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow");
    }
    if (raw !== undefined && !valid) {
      warnings.push("loopEngine.maxIterationsPerRow must be an integer; using default 4");
    }
    return {
      maxIterationsPerRow: valid ? Math.max(1, raw) : 4,
      warning: warnings.length ? warnings.join("; ") : undefined,
    };
  }
  ```

  Decision: keep `extensions/phase-tracker.ts` unchanged. Its existing `{ key: "loopEngine", ...loop, warning, errors }` spread already forwards the renamed field and combines settings-load warnings (`extensions/phase-tracker.ts:904-912`).
- [ ] **Step 6: Re-run both scoped commands for green.** Require the exact warnings `loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow` and `loopEngine.maxIterationsPerRow must be an integer; using default 4`, including their joined order.
- [ ] **Step 7: Regenerate shipped artifacts.** Run: `npm run build:bins`. Commit only changed bundles; never hand-edit generated output.
- [ ] **Step 8: Format and lint the changed source.** Match local two-space TypeScript style. Run: `node --experimental-strip-types --check extensions/lib/gauntlet-settings.ts` and `node --experimental-strip-types --check extensions/phase-tracker.test.ts`. Expected: exit 0; no formatter is configured.
- [ ] **Step 9: Commit.** Stage the declared source/tests and changed bundles; commit with `git commit -m "Replace loop total setting with per-row multiplier"`.

### Task 2: Persist and restore the ledger cap

**TDD scenario:** Modifying tested instructions - run existing contracts first, add red assertions and eval cases, then change instructions.

**Spec:** doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md § "Acceptance criteria" L30, § "Acceptance criteria" L32, § "Acceptance criteria" L34, § "Acceptance criteria" L36, § "Acceptance criteria" L38, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L55, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L57, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L59, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L63, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L65, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L67, § "Loop driver (`skills/loop-implementation/SKILL.md`)" L69, § "Resume (`skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`)" L73, § "Documentation" L87, § "Evals" L91, § "Evals" L93, § "Errors and edge cases" L102, § "Errors and edge cases" L103, § "Errors and edge cases" L104, § "Errors and edge cases" L105, § "Errors and edge cases" L106, § "Errors and edge cases" L107, § "Errors and edge cases" L108, § "Errors and edge cases" L109, § "Tests" L117, § "Out of scope" L130, § "Out of scope" L131, § "Out of scope" L132, § "Out of scope" L134

**Files:**
- Modify: `skills/loop-implementation/SKILL.md:11-129`
- Modify: `skills/gauntlet-resume/SKILL.md:160-170`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md:74-86`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md:162-170`
- Modify: `scripts/loop-engine-contract.test.mjs`
- Modify: `scripts/brief-contract-lint.test.mjs`
- Modify: `extensions/lib/plan-check.test.ts:23-65`
- Modify: `eval/loop-implementation/samples/cap-and-exit-verification/case.md`
- Modify: `eval/loop-implementation/samples/cap-and-exit-verification/expected.md`
- Modify: `eval/loop-implementation/samples/commit-boundary/case.md`
- Modify: `eval/loop-implementation/samples/commit-boundary/expected.md`
- Modify: `eval/gauntlet-resume/samples/loop-no-ledger/case.md`
- Modify: `eval/gauntlet-resume/samples/loop-no-ledger/expected.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-worktree/case.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-worktree/expected.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-brief/case.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-brief/expected.md`
- Modify: `eval/loop-implementation/intent.md`
- Modify: `eval/loop-implementation/report.md`
- Modify: `eval/loop-implementation/results/**/*.json`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/gauntlet-resume/report.md`
- Modify: `eval/gauntlet-resume/results/**/*.json`
- Create: `eval/loop-implementation/samples/scaled-cap-grant/case.md`
- Create: `eval/loop-implementation/samples/scaled-cap-grant/expected.md`
- Create: `eval/loop-implementation/samples/legacy-cap/case.md`
- Create: `eval/loop-implementation/samples/legacy-cap/expected.md`
- Create: `eval/gauntlet-resume/samples/durable-cap/case.md`
- Create: `eval/gauntlet-resume/samples/durable-cap/expected.md`
- Create: `eval/gauntlet-resume/samples/legacy-cap-brief/case.md`
- Create: `eval/gauntlet-resume/samples/legacy-cap-brief/expected.md`
- Create: `eval/loop-implementation/results/scaled-cap-grant/baseline.json`
- Create: `eval/loop-implementation/results/scaled-cap-grant/candidate.json`
- Create: `eval/loop-implementation/results/legacy-cap/baseline.json`
- Create: `eval/loop-implementation/results/legacy-cap/candidate.json`
- Create: `eval/gauntlet-resume/results/durable-cap/baseline.json`
- Create: `eval/gauntlet-resume/results/durable-cap/candidate.json`
- Create: `eval/gauntlet-resume/results/legacy-cap-brief/baseline.json`
- Create: `eval/gauntlet-resume/results/legacy-cap-brief/candidate.json`
- Test: `scripts/loop-engine-contract.test.mjs`
- Test: `scripts/brief-contract-lint.test.mjs`
- Test: `extensions/lib/plan-check.test.ts`

**Tests:**
- `node --test scripts/loop-engine-contract.test.mjs`
- baseline: a5056f62 pass
- via: `skills/loop-implementation/SKILL.md` Entry, ordered stop table and Human stop
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: a5056f62 pass
- via: `skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`
- `node --experimental-strip-types --test extensions/lib/plan-check.test.ts`
- baseline: a5056f62 pass
- via: `checkPlan` ledger admission, `plan_check`

- [ ] **Step 1: Run all three scoped contracts.** Preserve the existing `SKILL.md` token and step-order assertions; they protect seed recovery, funding, child commit validation and review ordering.
- [ ] **Step 2: Add deterministic cap-contract assertions.** In `scripts/loop-engine-contract.test.mjs`, require `cap:` directly after `iterations: 0` in the grammar, `maxIterationsPerRow`, `iterations >= cap`, `loop: raise cap`, the missing-header stop and the existing preserve sentence. Assert grant exclusion at dirty/boundary stops, unchanged-header validation including cap, and selection of the latest operational row decision. Keep the existing adjacent assertion text `Preserve every row's attempts and the total iteration cap.` intact.
- [ ] **Step 3: Add resume/admission assertions.** Extend `scripts/brief-contract-lint.test.mjs` to read the real reconstruction and resume routes and require their shared cap boundary before implement or verify continuation; require no settings re-resolution in the ledger path. In `extensions/lib/plan-check.test.ts`, add an admission case for a ledger with `cap: 97`; keep the legacy cap-less fixture passing. Decision: no production checker change - `checkLedger` ignores headers today (`extensions/lib/plan-check.ts:1137-1173`), and `plan_check` validation of the `cap:` value is expressly excluded.
- [ ] **Step 4: Run the three scoped contracts for red.** Expected: missing cap grammar, grant and restore instructions; ledger-header admission alone already passes.
- [ ] **Step 5: Migrate the existing loop eval fixtures before adding new ones.** In `eval/loop-implementation/samples/cap-and-exit-verification`, replace `maxIterations=2` with ledger `cap: 2`, keeping seed-inclusive stopping and the closed-row exit-verification failure. In `commit-boundary`, replace `if maxIterations is 1` with explicit `cap: 1` and add cap headers to continuing fixtures. Retain authorized discard/reset, consumed interrupted seed, target-based seed recovery, and no automatic cleaning. Re-derive each `expected.md` and list moved `contract` and `seed-recovery` facts in `intent.md`.
- [ ] **Step 6: Migrate existing resume fixtures.** In `eval/gauntlet-resume/samples/loop-no-ledger`, replace `loopEngine maxIterations is 12` and fact `resolves maxIterations 12` with fresh-seed `maxIterationsPerRow: 12`, retaining verification discovery and all arming calls. Give `loop-ledger-worktree` at `iterations 7` and `loop-ledger-brief` at `5` explicit cap headers. Preserve pairing by Spec header, retry allowance 4, clean-tree stops and verify/ship continuation. Re-derive each `expected.md`; list changed `inputs`, `restore`, `continuation` and `verify-ledger` facts under `## Expected to move`.
- [ ] **Step 7: Add the new cap-grant eval.** Create `scaled-cap-grant` with a 24-row ledger at `iterations: 97`, `cap: 97`, 23 done rows and one `open` row at attempts 1. Require the stop to name `cap 97`, that row and attempts, and offer `cap +N`. Require `cap +50` to append `cap +50 |` under `## Decisions`, change only the header to `cap: 147`, and create one `loop: raise cap` commit. Add separate prompted branches for a trimmed reason with optional pipe separator, `cap +0`, `cap +x`, `cap -5`, and a second invalid reply; all invalid replies commit nothing. Include a both-limits branch and a cap grant after two empty child commits to prove grants reset no stop window.
- [ ] **Step 8: Add legacy and durable-resume evals.** Create loop `legacy-cap` with line 1 `# Ledger - loop engine`, consumed iterations 7 and no header: expect `ledger has no cap: line - seeded under the old loopEngine contract`, no `gauntlet_setting` recompute, and `cap +5` yielding `cap: 12`. Cover a completed legacy ledger as well. Create resume `durable-cap` with `cap: 97` and no usable loopEngine settings tool; expect it rendered with iterations/attempts and no `gauntlet_setting({ key: "loopEngine" })` call. Create `legacy-cap-brief` with implement, verify and ship branches; the missing header stops all three before dispatch or verification, and a grant resumes the original phase-specific path. Add an explicit-cap verify/ship branch to `loop-ledger-brief` so it renders cap and continues at `After the loop` step 1. Mark new cases baseline-skipped as defined above.
- [ ] **Step 9: Change fresh entry only.** Retain `maxIterationsPerRow` default 4 instead of `maxIterations` in Entry step 1. In step 4 compute `n = (rows not initialized cut) * maxIterationsPerRow + 1`, write the result after `iterations: 0`, and keep the `+ 1` seed allowance. Count every initialized non-`cut` row, including venue rows; `deviates:`/`deferred:`/`elsewhere:` remain cut. A 24-row all-in-scope seed writes `cap: 97`; an all-cut seed writes `cap: 1` and exits by rule 1 without seed dispatch. State that later cuts, reopening and requirement-preserving amendments leave the cap unchanged; redraw deletes the ledger and recomputes on reseed.
- [ ] **Step 10: Change ordered checks and decision selection.** Read mandatory `cap:` before applying the table, including before rule 1. Replace rule 4 with `iterations >= cap`; stop before dispatch and before verification, naming the value and every `open` or `failed` row with attempts. Keep seed and interrupted dispatch accounting. Select the latest operational `row <n> ...` decision for row selection and the child's `previous decision:` input, skipping cap-history rows. Keep all decision history visible. Include `Preserve every row's attempts and the total iteration cap.` in every stop note, without breaking its existing pre-dispatch occurrence.
- [ ] **Step 11: Add one Human stop table row for grants.** Offer `cap +N` only on a clean cap stop or clean legacy stop. Parse an anchored `cap +<n>` token with `[1-9][0-9]*`, followed by a token boundary and optional remainder; reject numeric-looking prefixes such as `cap +50x` rather than accepting a partial number. Trim the remainder and its optional `|` separator into the words cell. Append the cap decision and raise the prior cap by N in one `loop: raise cap` parent commit, leaving `iterations:` and attempts untouched. Bare `cap +50` writes `cap +50 |`. Ask once on invalid input; a second invalid reply stays stopped with no commit. Resume at the ordered table after a valid ordinary grant.
- [ ] **Step 12: Preserve independent stop contracts.** At a stop satisfying both rule 2 and rule 4, list both funding and cap offers despite rule 2's earlier priority; require separate replies and no combined syntax. Funding continues through the spec's `**Amend-grant:**` contract. Keep `Funding buys neither cap bypass nor empty-commit bypass nor an escalated model`; `cap +N` alone extends the total. A `loop: raise cap` parent commit is not a `loop: row ...` child commit and resets neither empty-commit nor validation-miss windows; only `loop: retry row <n>` starts those windows. Preserve the per-row allowance 3 and the `fund N fix rounds` grammar; do not rename it to match `closureReview.maxFixRounds` or add a runtime `phase_tracker` counter.
- [ ] **Step 13: Implement legacy admission and header repair.** At the driver's initial ledger read, missing `cap:` emits the exact legacy stop before the ordered table. The legacy grant derives the new header only from durable iterations plus N, never from settings; commit the same decision grammar. On a dirty tree, retain the discard-authorization path and offer no grant. Treat child edits to `cap:` as changed-header validation misses: ordinary return repair restores the saved cap, retains consumed iterations and uses the existing failed-target/repair-commit path; seed validation misses keep their existing human-stop path.
- [ ] **Step 14: Make resume use one shared boundary.** Own the ledger cap-read/render/legacy-stop procedure in reconstruction's `Spec with ledger` section; cite it from the brief-contract `implement with ledger` row, its verify/ship ledger paragraph, and the skill's `implement with line-1 ledger` and verify route rows. Place admission before any phase-specific continuation. Skip the driver's Entry step 1 entirely for admitted ledgers; settings availability remains a fresh-seed requirement only. Restore base, verification, iterations, cap, attempts, funding and retry allowances, render cap and cap decisions, and keep the operational row decision separate from the final physical history line. Keep grant checks, pairing, arming, `resume: <spec> (loop engine)`, and absence of task-tracker initialization intact. After legacy grant, implement continues at `Before each dispatch`; verify/ship continues at `After the loop` step 1. Do not reseed either route.

  Decision: keep the brief's `Last decision` as the last physical history line. `reference/brief-contract.md:35-44` makes the brief a pointer, not a state carrier; the driver reads its operational row decision from the ledger, so cap history requires no new handoff field or producer change.
- [ ] **Step 15: Update target intents and run partial evals.** In `eval/loop-implementation` and `eval/gauntlet-resume`, record all changed old facts and the new cap/grant/legacy/resume contracts in `intent.md`; bind the actual `for:` SHA. Run: `node eval/run.mjs loop-implementation scaled-cap-grant`, `node eval/run.mjs loop-implementation legacy-cap`, `node eval/run.mjs gauntlet-resume durable-cap`, and `node eval/run.mjs gauntlet-resume legacy-cap-brief`. Expected: exit 0, no reproduced regression, and every new must-hold fact holds. Generate records through the harness; commit `report.md` after the full-target verify run named in the header. Task 3 independently supplies `eval/brainstorming` coverage; all three reports are required.
- [ ] **Step 16: Re-run deterministic contracts and scoped lint.** Run the three Tests commands. Run: `node --check scripts/loop-engine-contract.test.mjs` and `node --check scripts/brief-contract-lint.test.mjs`. Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import { lintStageSkillDirs } from "./scripts/stage-skill-lint.mjs"; import { lintTarget } from "./eval/lib/lint.mjs"; assert.deepEqual(lintStageSkillDirs(process.cwd(), ["skills/loop-implementation"]), []); for (const name of ["loop-implementation", "gauntlet-resume"]) assert.deepEqual(lintTarget("eval/" + name), []);'`. Expected: exit 0; preserve compact tables and existing frontmatter, no Markdown formatter.
- [ ] **Step 17: Commit.** Stage the declared instruction/tests/eval changes and generated records; commit with `git commit -m "Persist loop cap grants and restore the ledger cap"`. This changes instruction behavior, not wording alone; say so in the commit body. Task 4 updates `doc/configuration.md`, `doc/implement-engines.md`, and `CHANGELOG.md` `## Unreleased`. Its `Restore base, verification, iterations, attempts, funding and retry allowances` guide list gains `cap`, matching this task's `ledger iterations/retry data` route update.

### Task 3: Split drafted tree-wide rows

**TDD scenario:** Modifying tested instructions - run existing contracts first, then add the integrity case and its regression sample.

**Spec:** doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md § "Acceptance criteria" L40, § "Brainstorming drafted-row integrity (`skills/brainstorming/reference/ticket-acceptance.md`)" L77-L81, § "Brainstorming drafted-row integrity (`skills/brainstorming/reference/ticket-acceptance.md`)" L83, § "Evals" L93, § "Errors and edge cases" L110, § "Errors and edge cases" L111, § "Out of scope" L133

**Files:**
- Modify: `skills/brainstorming/reference/ticket-acceptance.md:63-75`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/brainstorming/results/**/*.json`
- Create: `eval/brainstorming/samples/tree-wide-drafted-row/case.md`
- Create: `eval/brainstorming/samples/tree-wide-drafted-row/expected.md`
- Create: `eval/brainstorming/results/tree-wide-drafted-row/baseline.json`
- Create: `eval/brainstorming/results/tree-wide-drafted-row/candidate.json`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: a5056f62 pass
- via: `skills/brainstorming/reference/ticket-acceptance.md` Row production at spec-writing

- [ ] **Step 1: Run the existing scoped contract.** Keep the current drafted-row preservation and ticket-verbatim assertions.
- [ ] **Step 2: Add a failing integrity-table assertion.** Extend the existing drafted-contract test to require a `Tree-wide` row that names complete Design enumeration, family-specific observables, absent/partial/unrelated stops, and application only to drafted rows. Run the Tests command; expect a missing Tree-wide-row assertion failure.
- [ ] **Step 3: Add the new text sample.** Create `tree-wide-drafted-row/case.md` with the ticket-acceptance reference included using the existing `bundle+` convention. Use a drafted row `zero prose, renderer and size findings across the tree` and an explicit Design list `recipe prose`, `renderer routing`, `file-size`. Require exactly three rows with `zero findings in recipe prose`, `zero findings in renderer routing`, and `zero findings in file-size`, default in-scope dispositions and all original outcomes retained. Add a set-wide single-kind branch `no lint findings anywhere in src/` whose Design supplies the complete family split. Keep the fixture synthetic and mark it baseline-skipped as defined above.
- [ ] **Step 4: Add negative and ticket branches to the same sample.** Use separate absent, partial and unrelated Design enumerations, requiring a stop before writing with the original row quoted and a request for the complete enumeration in Design. A ticket carrying the identical broad row must remain one verbatim row; splitting requires human ticket repair through `/skill:shape-ticket` before approval. Name stable expected fact IDs `split`, `set-wide`, `missing`, `partial`, `unrelated`, `ticket` in `expected.md`.
- [ ] **Step 5: Add the integrity-table rule at its owner.** Add one `Tree-wide` row under Row production at spec-writing: identify zero/no-findings observables over a tree or set, split only on the explicit complete Design family list, give each resulting row its own observable, and preserve the full union of committed outcomes. Stop for absent, partial or unrelated lists. Keep the adjacent drafted-only scope and ticket-verbatim rule; do not invent families, split ticket rows, add ledger-side splitting, or change approved-row amendment rules.

  Decision: keep the existing post-approval freeze and redraw routing untouched. `ticket-acceptance.md` ends by freezing approved drafted row identity; this change applies only before spec-writing completes, so it does not reconcile already-created ledger rows.
- [ ] **Step 6: Update intent and run the new sample.** Bind `eval/brainstorming/intent.md` to its actual assembly SHA; name the Tree-wide contract and the sample's expected moves. Run: `node eval/run.mjs brainstorming tree-wide-drafted-row`. Expected: exit 0 and all six candidate facts hold. The full-target command in the header produces the final committed `report.md`.

  Shared eval requirement: Task 2 supplies `eval/loop-implementation` and `eval/gauntlet-resume`, including `iterations: 97`, `cap: 97`, the `cap 97` stop, `cap +N`/`cap +50`, `cap: 147`, `loop: raise cap`, `cap:`-less legacy fixtures without `gauntlet_setting` recompute, and `After the loop` resume. This task supplies `eval/brainstorming`; each target's `intent.md` and `report.md` accompany its changed behavior.
- [ ] **Step 7: Re-run the scoped contract and lint.** Run the Tests command and `node --check scripts/brainstorming-contract.test.mjs`. Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import { lintTarget } from "./eval/lib/lint.mjs"; assert.deepEqual(lintTarget("eval/brainstorming"), []);'`. Expected: exit 0; retain imperative instructions and compact table syntax, no configured formatter.
- [ ] **Step 8: Commit.** Stage the declared reference, test, sample, intent and generated records; commit with `git commit -m "Split tree-wide drafted acceptance rows by Design family"`. State in the body that this changes instruction behavior.

## Wave 2 - Cross-cutting documentation

Depends on Wave 1: document the resolver, durable cap/grant and shared restore boundary that Tasks 1-3 establish. One task owns both guides and the changelog to avoid concurrent hub edits.

### Task 4: Document the breaking setting and durable cap

**TDD scenario:** Trivial change - documentation review against the implemented contracts.

**Spec:** doc/specs/2026-10-26-loop-engine-scaled-iteration-cap.md § "Acceptance criteria" L42, § "Documentation" L87, § "Documentation impact" L123

**Files:**
- Modify: `doc/configuration.md:83-127`
- Modify: `doc/implement-engines.md:36-43`
- Modify: `CHANGELOG.md:1-5`

**Tests:**
- none: cross-cutting documentation; no Markdown formatter is configured

- [ ] **Step 1: Replace the settings paragraph.** In `doc/configuration.md` Loop engine operations, replace active `maxIterations` documentation with `maxIterationsPerRow`, default 4, integer floor 1 and non-integer fallback. Spell `loopEngine.maxIterationsPerRow must be an integer; using default 4` and `loopEngine.maxIterations is removed; set loopEngine.maxIterationsPerRow` exactly; document removed-key-first joined warnings. `loopEngine.maxIterations` appears only as the removed key, not as an alias.
- [ ] **Step 2: Update the ledger grammar and operations.** Put a concrete `cap: 97` immediately after `iterations: 0` in the grammar example. Explain non-cut row count times multiplier plus seed 1, fixed across cuts and reopenings, recomputed only on redraw. Document `cap +N`, the bare `cap +50 |` decision under Decisions and `loop: raise cap`, attempts/iterations preservation, invalid-token behavior, clean-tree restriction, and legacy missing-header grant from iterations rather than settings.
- [ ] **Step 3: Update the engine guide.** In `doc/implement-engines.md`, describe the row-scaled durable `cap:` where it names the total iteration bound. Expand `Restore base, verification, iterations, attempts, funding and retry allowances` with cap and settings-free restoration. Match `skills/gauntlet-resume/SKILL.md`'s `implement with line-1 ledger` route and its restored `ledger iterations/retry data`; keep these routing descriptions current without copying the shared restore algorithm.
- [ ] **Step 4: Add the breaking-change entry.** Add `## Unreleased` in `CHANGELOG.md` and record the key removal, durable cap/grants and drafted-row split. Decision: interpret Documentation impact's `deferred: release` as release promotion, not permission to omit the explicitly required Unreleased entry (Design Documentation L87). Do not bump package version or create a release.
- [ ] **Step 5: Review and commit.** Check that both guides mention the old key only as removed, that grammar matches the driver, that Markdown uses compact tables and ASCII punctuation, and that all touched links resolve. Stage only these three docs and commit with `git commit -m "Document row-scaled loop caps and the breaking setting rename"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L28 | Default, validation, removed-key warning and tool wrapper behavior | Task 1 |
| § "Acceptance criteria" L30 | Seed row-scaled cap, admit ledger and preserve on cuts | Task 2 |
| § "Acceptance criteria" L32 | Cap stop names every unresolved row and offers grant | Task 2 |
| § "Acceptance criteria" L34 | Durable valid grant and two-invalid-reply behavior | Task 2 |
| § "Acceptance criteria" L36 | Legacy driver and resume stop without settings fallback | Task 2 |
| § "Acceptance criteria" L38 | Render durable cap without settings call on resume | Task 2 |
| § "Acceptance criteria" L40 | Complete drafted family split and ticket preservation | Task 3 |
| § "Acceptance criteria" L42 | Current configuration and engine documentation | Task 4 |
| § "Acceptance criteria" L44 | Full tests and all target evals pass with fresh reports and new cases | Verification |
| § "Settings resolver" L51 | Per-row default, integer validation, removed-key presence and ordered warnings | Task 1 |
| § "Settings resolver" L51 | Preserve tool payload spread and regenerate bundles | Task 1 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L55 | Compute cap once after iterations, include seed and keep grammar current | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L55 | Cuts and reopening preserve cap; redraw reseeds | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L57 | Read header for rule 4, count consumed dispatches and preserve stop sentence | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L59 | Grant available only at clean cap and legacy stops | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L63 | Anchored positive-integer token, trimmed optional words and atomic parent commit | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L63 | Ask once on malformed input, then remain stopped without commit | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L65 | Funding and cap independent, both offers with separate replies | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L65 | Parent grant changes no child stagnation or validation-miss window | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L65 | Operational row selection skips cap decisions, history retained | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L67 | Missing-header stop before ordered table and grant from consumed count | Task 2 |
| § "Loop driver (`skills/loop-implementation/SKILL.md`)" L69 | Preserve funding bypass prohibition; only grant extends total | Task 2 |
| § "Resume (`skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`)" L73 | Shared restore boundary renders header and avoids Entry settings | Task 2 |
| § "Resume (`skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`)" L73 | Legacy implement, verify, ship and completed ledgers stop before continuation | Task 2 |
| § "Resume (`skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md`)" L73 | Grant resumes original phase path | Task 2 |
| § "Brainstorming drafted-row integrity (`skills/brainstorming/reference/ticket-acceptance.md`)" L77-L81 | Add Tree-wide class with complete family enumeration and preserved outcomes | Task 3 |
| § "Brainstorming drafted-row integrity (`skills/brainstorming/reference/ticket-acceptance.md`)" L83 | Drafted rows only; human repairs ticket to split | Task 3 |
| § "Documentation" L87 | Configuration, engine guide and resume route all name durable cap | Task 2, Task 4 |
| § "Documentation" L87 | Unreleased entry records breaking rename | Task 4 |
| § "Evals" L91 | Migrate existing loop and resume fixtures while preserving original facts | Task 2 |
| § "Evals" L91 | Re-derive expectations and list every moved fact in intent | Task 2 |
| § "Evals" L93 | New cap stop/grant and legacy samples, explicit resume cap and legacy brief coverage | Task 2 |
| § "Evals" L93 | New drafted split sample; all three target intents and reports | Task 2, Task 3 |
| § "Errors and edge cases" L99 | Non-integers fall back with warning | Task 1 |
| § "Errors and edge cases" L100 | Integers below one clamp without warning | Task 1 |
| § "Errors and edge cases" L101 | Old key always ignored and warned once | Task 1 |
| § "Errors and edge cases" L102 | All-cut seed gets one and exits without seed dispatch | Task 2 |
| § "Errors and edge cases" L103 | Cutting after seed does not shrink cap | Task 2 |
| § "Errors and edge cases" L104 | Redraw deletes ledger and recomputes | Task 2 |
| § "Errors and edge cases" L105 | Invalid cap input retries once with no commit | Task 2 |
| § "Errors and edge cases" L106 | Dirty/boundary stop keeps discard authorization first | Task 2 |
| § "Errors and edge cases" L107 | Both limits expose independent offers | Task 2 |
| § "Errors and edge cases" L108 | Legacy grant derives from iterations only | Task 2 |
| § "Errors and edge cases" L109 | Child header mutation follows existing parent repair | Task 2 |
| § "Errors and edge cases" L110 | Missing, partial and unrelated enumeration stop before writing | Task 3 |
| § "Errors and edge cases" L111 | Ticket row unchanged pending explicit repair | Task 3 |
| § "Tests" L115 | Resolver matrix covers shape, defaults, bounds and joined warnings | Task 1 |
| § "Tests" L116 | Both wrapper tests migrate with warning composition intact | Task 1 |
| § "Tests" L117 | Existing driver assertions plus cap grammar and grant commit assertion | Task 2 |
| § "Tests" L118 | Bundled verification includes generated-bin freshness and instruction lint | Verification |
| § "Tests" L119 | Model evals run outside deterministic suite | Verification |
| § "Documentation impact" L123 | Amend existing configuration and architecture guides; record release-facing change | Task 4 |
| § "Out of scope" L130 | Keep skill enforcement, no runtime counter or phase guard | Task 2 |
| § "Out of scope" L131 | Preserve row-funding phrase and separate closure-review setting | Task 2 |
| § "Out of scope" L132 | Preserve per-row allowance, funding and retry grammar | Task 2 |
| § "Out of scope" L133 | Preserve verbatim ticket rows | Task 3 |
| § "Out of scope" L134 | Do not validate cap values in plan checker | Task 2 |
