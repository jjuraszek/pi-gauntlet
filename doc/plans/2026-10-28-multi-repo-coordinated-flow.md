# Multi-repo coordinated flow Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Carry one approved home spec through selected repository legs, with leg-local execution and receipt-backed coordinated delivery.
**Architecture:** Keep portable membership and resolved contracts in the home spec, machine-local locations in the brief, and the plan or ledger at home. Extend the existing checker, engines, brief contract, advisory, and seal; do not add another orchestrator or settings surface. This implementation is itself a home-only pi-gauntlet change.
**Tech Stack:** Markdown instructions, TypeScript/JavaScript, Node test runner, YAML telemetry, esbuild, frozen replay evals.
**Spec:** `doc/specs/2026-10-28-multi-repo-coordinated-flow.md`
**Verification:** `npm test` and `node --input-type=module -e 'import {readdirSync,existsSync} from "node:fs"; import {execFileSync} from "node:child_process"; for (const d of readdirSync("eval",{withFileTypes:true})) if(d.isDirectory() && d.name!=="_template" && existsSync("eval/"+d.name+"/target.json")) execFileSync(process.execPath,["eval/run.mjs",d.name],{stdio:"inherit"});'`

---

## Files

The task Files blocks below enumerate the authoritative paths. No deletions. Grouped change map:

| Component | Create | Modify |
|---|---|---|
| Membership | skills/brainstorming/reference/legs.md | brainstorming skill/gatherer/finalization/amendments/ticket acceptance, worktree skill, contract tests |
| Checker | none | extensions/lib/plan-check.ts and tests, phase-tracker port and tests |
| Ship runtime | src/bins/gauntlet-telemetry-seal.test.mjs | advisory/tests, telemetry record/tests, seal source |
| Execution | none | writer skill/contract, SDD, loop driver, five personas, wave/loop contract tests |
| Restore | none | handoff/resume, brief grammar, reconstruction/seed, brief lint/tests |
| Finish | skills/finishing-a-development-branch/reference/legs.md | finish skill and contract tests |
| Integration | explicit eval files below | CI, eval assemblies/intents/expectations, three generated bundles |
| Docs | none | README.md, doc/configuration.md, AGENTS.md |

No deployment split: the overrides supply neither Deployment topology nor Happy path table. No peer-floor or release change.

## Recon and execution conventions

- Read `skills/forge-skill/SKILL.md` before instruction edits. Preserve persona frontmatter byte-for-byte, use imperative rules and compact tables, and keep one grammar owner. Keep touched skills under 500 lines by moving coordinated mechanics to the approved legs references; link them at the owning step.
- Current seams: `extensions/lib/plan-check.ts:507-612` tests/baselines; `extensions/phase-tracker.ts:934-1013` filesystem port; `extensions/verify-before-ship.ts:58-130` verified state; `extensions/lib/telemetry-record.ts:99-110,158-185` record model/serialization; `src/bins/gauntlet-telemetry-seal.mjs:1-240` CLI validation, retry, write and rollback. Existing CLI regression tests live in `bin/gauntlet-telemetry-seal.test.mjs`, not src.
- `loadGauntletSettings(cwd)` in `extensions/lib/gauntlet-settings-loader.ts` already accepts a checkout path; reuse its preset/repo merge and `planDirsFor` in `extensions/lib/gauntlet-settings.ts`. Do not add a derived-directory settings input.
- Scoped extension tests require the loader in `scripts/ci.mjs:425-449`: `--experimental-loader ./extensions/test-support/pi-stubs.mjs`. Script tests use plain `node --test`. No configured formatter or standalone lint npm script exists; preserve neighboring formatting, run `node --check` on changed JS/TS, and review instruction edits against forge-skill. The header entrypoint bundles repo-wide style, instruction-size, model-literal, stage-skill, eval-structure and package checks.
- Task 7 owns eval fixtures/intents; model runs and generated reports/results belong to header verification. Commit instruction changes with a body stating behavior changed and naming the eval targets. Existing expected facts change only for the approved single-member spec-section addition. Never hand-edit bin bundles.

## Baseline provenance

Initial execution BASE `0ff9be58`. Initial inventory before drafting: empty. After drafting and after every command the inventory was exactly `?? doc/plans/2026-10-28-multi-repo-coordinated-flow.md`, admitted as the dispatched plan path; the spec remained clean. HEAD never moved; no source or generated artifacts changed. Task 1 ran 40 tests; Task 2 ran 305; Task 3's derived existing-anchor command ran 52; Tasks 4, 5, 6, 7 ran 16, 1, 37, 45 respectively, all exit 0. Task 2's first plain-node command lacked the CI stub loader and failed to import pi-ai; the corrected same-scope command below was executed successfully. No baseline failure remains. Header verification was not run. Subsequent prose/anchor repairs retained these executed, unchanged commands at that BASE.

Amendment provenance: BASE `b00359ff`; initial per-file inventory ` M doc/specs/2026-10-28-multi-repo-coordinated-flow.md`, admitted as the dispatched spec and the sole parent-supplied In-flight path. The plan path is also admitted. No source edits are present; the pending Wave 1 patches are outside this checkout. Before retaining evidence, `git -C "/Users/jacek/repos/pi-gauntlet/.worktrees/multi-repo-flow" diff --quiet 0ff9be58 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 0 with HEAD read as `b00359ff`. All seven task commands are unchanged and retain valid evidence, including Task 3's derived command; no header command ran. Retained 7 bullets: `0ff9be58` -> `b00359ff`, tree-equivalent outside `doc/specs`, `doc/plans`. After the amendment write and during anchor repairs, HEAD remained `b00359ff` and status held only the admitted modified plan and spec; retain the unchanged commands at BASE.

## Wave 1 - Independent foundations

Tasks own disjoint files and independently allocated temporary repositories. Shared bin outputs are rebuilt only in Task 7.

### Task 1: Define membership, leg artifacts, and rooted provisioning

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Problem" L22, § "Acceptance criteria" L28-L37, § "Acceptance criteria" L48-L49, § "Design" L57-L64, § "Configuration" L68-L85, § "Brainstorming" L89-L93, § "Errors and edge cases" L129-L137
**Files:**
- Create: `skills/brainstorming/reference/legs.md`
- Modify: `skills/brainstorming/SKILL.md:69-99`
- Modify: `skills/brainstorming/gatherer.md:7-141`
- Modify: `skills/brainstorming/reference/spec-finalization.md:5-43`
- Modify: `skills/brainstorming/reference/amendment-surface.md:211-245`
- Modify: `skills/brainstorming/reference/ticket-acceptance.md`
- Modify: `skills/using-git-worktrees/SKILL.md:18-240`
- Modify: `scripts/brainstorming-contract.test.mjs`
- Test: `scripts/brainstorming-contract.test.mjs`
**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: b00359ff pass
- via: `/skill:using-git-worktrees`, Worktree First, gather, spec-writing, amendments

Decision: use the new reference as the sole portable leg grammar; retain existing tracker and dispatch APIs. Match shape-ticket's identity rule in `repo-audit.md:81` and its existing ticket-group handling in `reference/ticket-acceptance.md`.

- [ ] Run the scoped command to establish existing contract behavior.
- [ ] Add failing contract cases for selected/unselected siblings, ambiguous basename and bad selected path; run red.
- [ ] Add creation cases for collisions, dirty-primary decline and wrapper branch mismatch, asserting caller roots and mandatory branch read-back.
- [ ] Define `repo`, `primary`, `worktree`, `branch`, `name`, `Rules:` in the reference. Derive `owner/name` from origin with `.git` stripped, else documented repo name; compare case-insensitively. Carry the same identifier in `repo:` brief fields. Keep machine paths out of committed blocks, using synthetic `repo-a`, `repo-b`, `repo-a/pkg-x` examples.
- [ ] Define activation: only ask/ticket matches to `## shape-ticket` `- sibling:` declarations, identifier before basename. Ask once on ambiguity before creation; home first, siblings in declared order. Validate only selected paths (missing, nonrepo or home-equal stop). An existing PR alone never activates membership.
- [ ] Define per-primary config reads: first `.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`, `doc/gauntlet-overrides.md`; `.pi/settings.json` by file with existing preset rules in `extensions/lib/gauntlet-settings.ts`. Home `.pi/settings.json#piGauntlet` owns flow policy; never use `gauntlet_setting` for companions or add a `piGauntlet.*` key.
- [ ] Define portable `contract:` create/destroy/`home:`/spec-dir/plan-dir/verification templates, not expanded absolute paths. Use `flowGuards.specDirs` and `planDirsFor` (`extensions/lib/gauntlet-settings.ts:175`), never input `planDirs`. Missing configuration uses defaults.
- [ ] Record destroy precedence: `## cleanup` worktree line, `destroy:`, owned built-in plus configured `subagents.worktreeTeardownHook`. Never bypass a wrapper with `git worktree remove`. Verification uses `## verification-before-completion`, `## PR gate`, and `piGauntlet.verifyBeforeShip`.
- [ ] Extend `/skill:using-git-worktrees` caller `$ROOT`/`$BRANCH`; root Step 0, clean-base, `## using-git-worktrees`, keyed `home:`/`create:` and discovery in `$ROOT`. Derive shared `NAME` from `BRANCH` using `/` -> `-`; ask once for unresolved other wrapper tokens from that leg's touched directory.
- [ ] Add rooted `worktree list` and exact branch read-back after creation; carry every `Worktree ready` result home first. Never reuse session isolation as another leg, suffix a collision, or branch session cwd on sandbox failure. Stop naming repo/branch and list preserved created legs. PR home retains `reference/pr-head.md`.
- [ ] Extend gather to one scout per leg with that leg's `cwd`. Walk root and touched directories for `AGENTS.md`/`CLAUDE.md`; follow one hop of local doc links in prose/bullets/tables, dedupe by `realpath`, omit untouched packages. Emit `Rules: root only - paths unresolved` or missing-link Rules entries; linked docs contribute no further links. Exercise `repo-a/pkg-x/AGENTS.md`, exclude pkg-y.
- [ ] In `reference/spec-finalization.md`, place `## Legs` after `## Acceptance criteria` and optional `## Rework record`. Each `### Leg:` carries `branch:`, `contract:`, `Rules:`, scope/AC ownership and design.
- [ ] Define companion writes: commit home, then each companion file with `git -C`: `**Home:**` tuple, copied `## Problem`, `## Decisions` from shared Design/Errors/Out-of-scope and clauses binding that repo, own block verbatim. Member ticket groups become `in-scope`; unmatched groups retain `this repo / elsewhere / repair`; `elsewhere:` creates no leg.
- [ ] Update `reference/amendment-surface.md` to rewrite affected companion artifacts in the same amendment. Record authority change against `skills/finishing-a-development-branch/SKILL.md:383`: section-bearing specs use recorded contracts; legacy no-section specs reread. Single-member runs add one block only, no companion artifact, `legs:` brief, `--leg`, receipt or loop.
- [ ] Run scoped tests green and check changed instructions against forge-skill.
- [ ] Commit as `Define coordinated legs and rooted worktree provisioning`.

### Task 2: Make plan and ledger admission leg-aware

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L48-L49, § "Writing-plans and plan_check" L97-L98, § "Implement engines" L104, § "Errors and edge cases" L141-L142, § "Tests" L162
**Files:**
- Modify: `extensions/lib/plan-check.ts`
- Modify: `extensions/lib/plan-check.test.ts`
- Modify: `extensions/phase-tracker.ts:934-1013`
- Modify: `extensions/phase-tracker.test.ts`
- Test: `extensions/lib/plan-check.test.ts`
- Test: `extensions/phase-tracker.test.ts`
**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/plan-check.test.ts extensions/phase-tracker.test.ts`
- baseline: b00359ff pass
- via: `plan_check`, `checkPlan`, `FsPort`, ledger admission

Decision: extend `FsPort.exists(path, leg?)` and `FsPort.glob(pattern, leg?)` with an optional normalized repo argument, retaining one-argument callers. Parse membership in the pure checker, resolve roots only in the phase-tracker port, and preserve `checkPlan(planText, specText, fs)`.

Decision: extend `checkLedger` in `extensions/lib/plan-check.ts:1140-1185` only when the spec has multiple members. Keep legacy admission, including its missing-cap fixture in `extensions/lib/plan-check.test.ts:15-21`, unchanged. Validate coordinated metadata structurally here; Task 4's `/skill:loop-implementation` and `agents/loop-implementer.md` own cap computation from `maxIterationsPerRow` and git-backed pending-result validation. The pure checker neither loads settings nor infers commit evidence.

- [ ] Run scoped tests; add red fixtures for distinct valid leg SHAs, wrong-leg SHA, unknown leg, mixed wave, case-insensitive IDs and absent Leg default.
- [ ] Add red fixtures for identical relative paths across repos, cross-leg Create/Test leakage and legacy specs.
- [ ] Parse first task line `Leg:` against `## Legs`; absent means home. Emit `leg-unknown` without probing arbitrary roots. Parse per-leg Baseline declarations and compare each bullet to its own leg SHA. Keep evidence requirements and `**Tests:**` directly after `Files:`/`**Files:**`; reject mixed waves. Plan and `**Spec:**` stay home-owned.
- [ ] Thread leg into `Modify:`/`Create:`/`Test:` existence and glob resolution. Key created paths and overlap by `(leg, path)`, preserving Test/Test non-ownership. The writer fills `Rules:`/`root only - paths unresolved` and runs `cwd`/`git -C` at the same leg root.
- [ ] Resolve roots in the port from selected sibling paths and recorded `home:` pattern with `NAME`. Test distinct temporary primaries, patterns and resolution failure; fail with input findings. Keep home flow settings and legacy root behavior.
- [ ] Add red coordinated-ledger fixtures retaining `row | status | attempts | evidence` with contiguous numeric entry IDs: one shared AC expands in membership order, an unowned AC defaults home, and each entry maps exactly once in `## Leg mapping` with columns `row | ac | leg`. Reject missing/duplicate mapping entries or AC/leg pairs, unknown legs, nonexistent original ACs, wrong order and disposition mismatches; retain escaped-pipe evidence tests. Keep original one-based AC numbering, including cut ACs, distinct from expanded entry IDs.
- [ ] Parse the mapping to validate one entry per owned AC/leg pair against the spec's `### Leg:` scope; apply status/disposition and attempts/evidence checks to the original AC through that mapping, not through the expanded row number. Retain the four-column table; do not add a ledger module or alter legacy/single-member ledger bytes.
- [ ] Validate coordinated headers: `base:` remains home's base; exactly one per-member base SHA and seeded header, initially `seeded repo-a: no` and `seeded repo-b: no`, accepting only `no` or `yes`. Require home base equality and reject missing/duplicate/foreign member headers, malformed SHAs, invalid iterations and nonpositive/noninteger cap. Permit later cap grants and closed/cut rows without recomputing cap from current non-cut count; Task 4 sets the initial formula and preserves it thereafter.
- [ ] Add pending-tuple fixtures for `pending: 2 | repo-b | abc1234` and `pending: seed | repo-b | abc1234`. Admit at most one tuple with a valid pre-dispatch SHA, known companion and numeric target belonging to that leg or `seed`; reject duplicate/malformed tuples, foreign targets and home pending tuples. Do not mark a leg seeded from tuple presence or invent result evidence. Assert coordinated skeleton, partial-seed and recovered-ledger admission; prove single-member/legacy fixtures remain unchanged.
- [ ] Run scoped tests green, `node --check extensions/lib/plan-check.ts`, and `node --check extensions/phase-tracker.ts`. Single-member behavior still adds no leg file, `legs:` brief, `--leg` or companion loop.
- [ ] Commit as `Validate plans and ledgers against leg-local roots`.

### Task 3: Scope verification advisory and telemetry seals by leg

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L46-L49, § "Finishing" L113, § "Finishing" L119, § "Errors and edge cases" L148-L149, § "Tests" L169
**Files:**
- Modify: `extensions/verify-before-ship.ts`
- Modify: `extensions/verify-before-ship.test.ts`
- Modify: `extensions/lib/telemetry-record.ts`
- Modify: `extensions/lib/telemetry-record.test.ts`
- Modify: `src/bins/gauntlet-telemetry-seal.mjs`
- Create: `src/bins/gauntlet-telemetry-seal.test.mjs`
- Test: `extensions/verify-before-ship.test.ts`
- Test: `extensions/lib/telemetry-record.test.ts`
- Test: `bin/gauntlet-telemetry-seal.test.mjs`
- Test: `src/bins/gauntlet-telemetry-seal.test.mjs`
**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts extensions/lib/telemetry-record.test.ts bin/gauntlet-telemetry-seal.test.mjs src/bins/gauntlet-telemetry-seal.test.mjs`
- baseline: b00359ff pass via `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/verify-before-ship.test.ts extensions/lib/telemetry-record.test.ts bin/gauntlet-telemetry-seal.test.mjs`
- via: `serializeRecord`, `parseRecord`, `--leg`, seal retry, advisory

Decision: add source-CLI cases at the named src path and retain bundled regressions in bin. Add optional top-level `legs` to schema 1, not a schema version. New tests invoke source; Task 7 rebuilds bundles.

- [ ] Run existing anchors, then add red round-trip/CLI cases for `{ repo, sha }`, `{ repo, pr }`, repeated arguments, empty repo/result and malformed stored data.
- [ ] Add retry tests for equal reordered sets, differing sets and omitted arguments; assert no companion `.pi/gauntlet/telemetry/` write.
- [ ] Accept repeated `--leg` values split at the first equals sign, requiring repo plus SHA or PR URL. Validate `legs:` entries in parseRecord and before writes. Compare normalized repo/result sets on retry; equal complete sets reuse, differences stop naming them. Preserve clean legacy retries and restore-on-commit-failure.
- [ ] Add two-checkout advisory tests with different `piGauntlet.verifyBeforeShip`: home tests cannot verify companion, companion source edits invalidate only companion, failed tests never verify and interleaved call IDs retain ownership.
- [ ] Test `git -C`, subshell `cwd`, primary post-squash verification, chained test/ship and quoted non-command mentions.
- [ ] Replace one verified bit with checkout-keyed state and call-ID-to-target sets. Resolve source paths/command directories before `loadGauntletSettings(target)`; use that checkout's merged policy. Preserve warning wording/settings errors; unsupported targeting cannot grant foreign evidence. Keep independent worktree/primary state.
- [ ] Run scoped tests green and `node --check` on advisory, record and source CLI. Do not rebuild shared bundles yet. Single-member `## Legs`/`### Leg:` or legacy paths have no companion loop, leg file, `legs:` brief or seal argument.
- [ ] Commit as `Bind ship evidence and seals to repository legs`.

## Wave 2 - Consumers of the foundations

Depends on Wave 1: consume Task 1's grammar, Task 2's admission model and Task 3's seal/advisory. Tasks own disjoint files and unique temporary test resources.

### Task 4: Route planning and both implementation engines through legs

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L38-L39, § "Acceptance criteria" L48-L49, § "Writing-plans and plan_check" L97-L98, § "Implement engines" L102-L104, § "Implement engines" L104, § "Errors and edge cases" L136, § "Errors and edge cases" L141-L143, § "Tests" L163-L164
**Files:**
- Modify: `skills/writing-plans/SKILL.md`
- Modify: `skills/writing-plans/reference/plan-contract.md`
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/loop-implementation/SKILL.md`
- Modify: `agents/plan-writer.md`
- Modify: `agents/implementer.md`
- Modify: `agents/loop-implementer.md`
- Modify: `agents/spec-reviewer.md`
- Modify: `agents/code-reviewer.md`
- Modify: `scripts/wave-review.test.mjs`
- Modify: `scripts/loop-engine-contract.test.mjs`
- Test: `scripts/wave-review.test.mjs`
- Test: `scripts/loop-engine-contract.test.mjs`
**Tests:**
- `node --test scripts/wave-review.test.mjs scripts/loop-engine-contract.test.mjs`
- baseline: b00359ff pass
- via: `/skill:subagent-driven-development`, `/skill:loop-implementation`, writer and loop personas

Decision: keep flat tracker and numeric ledger entry IDs; implement the coordinated grammar from spec L104 and Task 2 in the loop driver's Entry, Dispatch and Validate the return sections. Preserve `agents/loop-implementer.md:14-63` one-commit child boundary and bounded result format: for companions the child's commit carries the result and the parent alone writes the home ledger. Keep legacy/single-member bytes and persona frontmatter byte-identical; Rules inputs are additive.

Decision: reuse the driver's existing `target` and `iteration` inputs and the persona's `loop: row` / `loop: seed evidence` subjects for attributed companion commits. Put the exact dispatched `pending:` tuple and `iteration:` in the commit body, followed by the resulting four-column target row (or all non-cut rows for that leg's seed) and existing bounded decision line. This carries the pending head, target, consumed iteration and result in the commit itself, not in a new sidecar or trusted transcript. Seed evidence retains the persona's zero-attempt and baseline-closure rules.

- [ ] Add red checks for `Leg:` immediately after heading/before `**Files:**`, home `**Spec:**`, per-leg baselines, rule re-walk, homogeneous waves and companion recovery.
- [ ] Update writer/contract/Baseline: read `## Legs`, emit task leg and one Baseline per repo, execute `Tests:` in owning checkout, qualify dirty/provenance/tree-equivalence/created-anchor/blocked evidence by repo. Preserve all evidence rules.
- [ ] Re-walk `Files:` to append extra `Rules:` and resolve `Rules: root only - paths unresolved`. Align `Modify:`/`Create:`/`Test:`, `(leg, path)`, `home:`/`NAME` and `leg-unknown` with `extensions/lib/plan-check.ts` and `extensions/phase-tracker.ts`; repair plan, not membership.
- [ ] Split mixed waves into consecutive single-leg waves without violating dependencies. Select root before `WAVE_BASE_SHA`, isolation, child/reviewer `cwd`, `git -C`, snapshots, integration, tests, repair and commit. Keep authoritative spec reads at home.
- [ ] Require implementer, spec-reviewer and code-reviewer to read combined spec/task Rules before acting. Extend `eval/subagent-driven-development/samples/leg-cwd` through Task 7 without changing existing dispatch/acceptance shapes.
- [ ] Add red loop contract cases for shared-AC expansion, unowned-home default, stable numeric IDs, duplicate/missing mapping, per-leg seed selection and all-cut exit. Retain the existing legacy cap and seed assertions in `scripts/loop-engine-contract.test.mjs:1-57`; add coordinated assertions rather than replacing legacy facts.
- [ ] Map each original one-based AC to the owning `### Leg:` scope or home. Assign numeric entries in original AC order then membership order for shared ACs, leaving spec rows untouched. Retain `row | status | attempts | evidence` and add `## Leg mapping` with `row | ac | leg`, each entry exactly once. Carry cut dispositions to each expanded entry. Keep `base:` as home base and record one `base repo-a: abc1234` / `seeded repo-a: no` pair per member using its actual repo and base, including home.
- [ ] Compute initial coordinated cap as non-cut entry count times `maxIterationsPerRow` plus one seed dispatch per leg with non-cut entries. Example: one AC shared by home/companion plus one home-only AC gives three non-cut entries and two seed dispatches, cap 14 at default 4; a wholly cut third leg adds no seed. All-cut cap stays 1 and exits without seed. Preserve cap after cuts, reopens, amendments and funding; only an explicit existing cap grant raises it. Keep iterations, attempts, funding, retry and stagnation semantics.
- [ ] Select the next unseeded leg with non-cut entries in membership order before ordinary row targeting. Dispatch seed or numeric entry with its mapped original AC, leg worktree as `cwd`/`git -C`, per-leg base, `Leg:` and Rules, reading the home spec/ledger by absolute path. Validate every non-cut entry in that leg before setting its seeded value to `yes`; preserve all attempts during seed and retain proven baseline closures. Never mark other legs seeded or change foreign entries.
- [ ] Capture home and selected companion heads and the saved ledger before dispatch. Bump iterations once and, before every companion dispatch including seed, persist `pending: 2 | repo-b | abc1234` or `pending: seed | repo-b | abc1234` in the home ledger using the actual target and pre-dispatch HEAD. Keep that known pre-dispatch ledger update durable on disk for recovery before generic dirty checks; admit only the expected bump/tuple changes, stopping on other dirt. Home iterations retain the existing single child commit, with parent validation of home-only rows and seeded state.
- [ ] In the companion persona path, commit code/tests exactly once in the companion and leave home ledger untouched. Serialize the attributed body per the Decision above: exact tuple, consumed iteration, bounded evidence rows and one bounded decision; retain check name plus at most three semicolon-separated result lines and escaped pipes. Seed serializes only that leg's non-cut entries, with attempts unchanged; an ordinary return serializes only its target entry with attempts +1 and status done/failed. Return the existing bounded decision line, not a second result protocol.
- [ ] Validate a companion return from its commit, not the reply: clean companion, exactly one commit after recorded HEAD, matching pending tuple/iteration/subject, correct target or leg seed rows, bounded result evidence and decision. Reject wrong target, foreign entry, header changes, fabricated counts or malformed evidence under the existing stop/repair rules; apply ordinary repair only to the target and keep seed validation misses a human stop. Parent updates only that leg's seeded state or target entry, records companion SHA in evidence, retains the consumed iteration and prior decisions, and removes `pending:` in the home-ledger commit. Exclude parent ledger commits from child-only empty-commit stagnation.
- [ ] Before any new dispatch on resume, recover pending companion work only when exactly one new commit matches that tuple and its recorded result. Reapply the same return validation, record SHA/evidence and clear pending in the home-ledger commit without another attempt or iteration bump; do not rerun the row or seed. Stop preserving state on zero commits, unrelated movement, multiple commits or attribution/result mismatch rather than inventing evidence. After successful parent commit, a subsequent resume has no pending tuple and cannot duplicate the update.
- [ ] Add executable temporary-git fixtures to `scripts/loop-engine-contract.test.mjs` for interrupted ordinary and seed returns, a resumed clear-pending ledger, wrong tuple/iteration, unrelated one-commit movement, multiple commits and foreign-row evidence. Couple the assertions to the driver/persona body grammar. Assert companion code is one commit, home update is one commit, attempts/iterations are consumed once, seed changes only its leg and zero attempts, cap survives recovery/funding/cuts, and legacy/single-member ledger output gains no coordinated metadata. Run scoped tests red before implementing these instructions and green afterward.
- [ ] Reconcile amendments through original AC/leg mapping without resetting attempts, iterations or cap. Exercise the detailed grammar and interrupted two-commit boundary through Task 7's `eval/loop-implementation/samples/leg-iteration`; require its existing case and expected facts to show numeric mapping, per-leg seeds/bases, cap including seeds, attributed pending recovery and no repeated row dispatch. Task 7 retains ownership of the eval files.
- [ ] Route end-of-engine verification/reviews to every leg/owned AC with home flow policy, then coordinated finish once. Single-member/legacy paths add no leg file, `legs:` brief, `--leg` or companion loop.
- [ ] Run scoped tests green and forge-skill checks; commit as `Dispatch plan waves and loop rows in their owning legs`.

### Task 5: Produce and restore one home-bound multi-leg brief

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L40-L43, § "Acceptance criteria" L48-L49, § "Handoff and resume" L108-L109, § "Errors and edge cases" L138-L140, § "Errors and edge cases" L143-L145, § "Tests" L165-L166
**Files:**
- Modify: `skills/gauntlet-handoff/SKILL.md`
- Modify: `skills/gauntlet-resume/SKILL.md`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md`
- Modify: `skills/gauntlet-resume/reference/seed.md`
- Modify: `scripts/brief-contract-lint.mjs`
- Modify: `scripts/brief-contract-lint.test.mjs`
- Test: `scripts/brief-contract-lint.test.mjs`
**Tests:**
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: b00359ff pass
- via: `/skill:gauntlet-handoff`, `/skill:gauntlet-resume`, `legs:`, entry checks 3/3b/4

Decision: extend only the existing brief contract, not cohort's six-heading core. Receipt transport is not proof; Task 6's live validation governs. Recover Task 4's pending loop boundary before dispatch.

- [ ] Add red drift-lint fixtures for ordered fields, placement, missing tree and optional receipts; require citations instead of duplicated grammar. Keep PR-pair checks.
- [ ] Pin cohort's snapshot to home's explicit Run worktree through told-to-work-in, not most-recently-used or `Also seen:`. Append `legs:` only for multiple members to `## Process state`, after `PR:`/`Pre-rework head:` pairs and before gate-history line.
- [ ] Define `repo:`, `worktree:`, `branch:`, `HEAD:`, `dirty:`, `receipt:` only in the contract; missing trees emit `worktree: missing`. Keep `## Repo state` grammar unchanged and home-bound; distinguish PR home from run home.
- [ ] Resolve home spec without inferring approval; compare ordered membership against `### Leg:`. Preserve check 3 binding, add home/restart text for member-primary entry. Before tracker writes 3b checks declared primary common dir, shared branch and full `**Home:**` tuple, resolving missing location from recorded `home:`/NAME. Name offending leg and tuple.
- [ ] Admit missing tree only on live-validated receipt; announce per-leg `HEAD`/dirty drift without stopping. Refuse seed leg file naming home repo/branch/spec. Preserve approval/grant/arming and task snapshots.
- [ ] Admit stripped-plan ship retry only when every companion receipt validates. Restore at verify without fabricated conformance, re-validate unlanded home from recorded contracts/scoped ACs, then finish. Preserve receipts on seal/home failure; do not replace correctly stripped plan. Recover interrupted companion code commit through ledger boundary before dispatch.
- [ ] Task 7 supplies `eval/gauntlet-handoff/samples/multi-repo` and `eval/gauntlet-resume/samples/legs-ok`, `legs-missing`, `legs-wrong-primary`, `legs-home-mismatch`, `legs-membership`, `legs-wrong-repo`, `legs-receipt`, `legs-seed-file`. Single-member/legacy has no leg file, `legs:` block, `--leg` or loop; only new one-block `## Legs` changes spec.
- [ ] Run green, `node --check scripts/brief-contract-lint.mjs`, and forge-skill checks. Commit as `Restore coordinated runs from one home-bound brief`.

### Task 6: Fan out one finish choice with validated receipts

**TDD scenario:** Modifying tested code - run existing tests first.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L30-L31, § "Acceptance criteria" L44-L45, § "Acceptance criteria" L48-L49, § "Configuration" L85, § "Finishing" L113, § "Finishing" L114-L120, § "Errors and edge cases" L146-L151, § "Tests" L158, § "Tests" L167-L168
**Files:**
- Create: `skills/finishing-a-development-branch/reference/legs.md`
- Modify: `skills/finishing-a-development-branch/SKILL.md`
- Modify: `scripts/finish-verification.test.mjs`
- Test: `scripts/finish-verification.test.mjs`
**Tests:**
- `node --test scripts/finish-verification.test.mjs`
- baseline: b00359ff pass
- via: finish Steps 1/3.5/4/5/6, receipts, home strip-and-seal

Decision: new finish reference owns coordinated mechanics; gate calls it once. `## Legs` uses recorded `contract:` lines; legacy no-section retains rereading. Receipts are untracked flow artifacts, not telemetry or approval evidence.

- [ ] Add red assertions for all-leg verification before menu, companion-first delivery, single discard confirmation, recorded cleanup and receipt/stripped-plan retry.
- [ ] Verify each leg's recorded commands, then conformance in that `cwd` against owned ACs. Retain audited head/tree per member; re-verify/re-review changed legs before delivery. Route fixes with `git -C`, home review/menu policy and leg-local `piGauntlet.verifyBeforeShip` evidence.
- [ ] Define home-owned receipt files under .pi/gauntlet/receipts nested by full spec filename and repo; exclude via local git metadata. Write attempted head, delivered PR URL/head or squash SHA, and verification status after delivery, including post-squash failure. Use `verification: passed` for success.
- [ ] Validate open PR head against attempted head; stale PR re-pushes and updates existing PR, not duplicate create. Validate squash only on passed verification and squash SHA reachable from primary default branch. Failed verification reruns verification, not squash. Never use feature-head ancestry as proof.
- [ ] Deliver PR/draft/squash companions in order then home using `gh pr create` and `--draft` as selected. Skip only validated receipts; collect complete results, strip home plan, seal with repeated `--leg`, then deliver home. Never seal partial results. Compare `legs:` entries `{ repo, sha }` or `{ repo, pr }` to existing seal; differences stop. Never write companion `.pi/gauntlet/telemetry/`.
- [ ] Put portable Home tuple in companion bodies/messages; list every companion PR URL in home PR and every SHA in home squash. Compose PR-subject actions with supported existing home action and confirmations. Preserve every PR/draft/keep worktree.
- [ ] Preserve receipts on failure and print actual Shipped/Not shipped repo/results. Fresh-session retry validates rather than infers delivery; no rollback.
- [ ] Discard lists each branch/commit count/worktree before one typed `discard`. Apply recorded `## cleanup`, `destroy:`, hook or owned built-in from each primary, never `git worktree remove` past wrapper. Refusal leaves tree intact, emits `failed`, and continues remaining report lines. Remove receipts only after home delivery/cleanup succeed.
- [ ] Replace Step 6 reread only for recorded contracts (`skills/finishing-a-development-branch/SKILL.md:383`). Single-member keeps one `### Leg:` only, no companion artifact, `legs:` brief, receipt, `--leg` or loop. Task 7 cases: `eval/finishing-a-development-branch/samples/legs-teardown`, `legs-discard`, `legs-keep`, `legs-draft`, `eval/finishing-a-development-branch/samples/legs-verify`, `eval/finishing-a-development-branch/samples/legs-pr`, `legs-squash-fail`, `legs-rerun`, `legs-stale-pr`, `legs-seal-fail`.
- [ ] Run green and forge-skill checks, keeping finish under 500 lines. Commit as `Deliver coordinated legs with durable completion receipts`.

## Wave 3 - Integrated regression evidence

Depends on Waves 1-2: all behavior surfaces exist. This task alone owns eval assemblies and shared bin outputs. Model calls stay in header verification.

### Task 7: Add coordinated-flow eval coverage and regenerate bundles

**TDD scenario:** New feature - red/green structural fixtures, unchanged legacy facts.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Acceptance criteria" L48-L49, § "Documentation and evals" L124-L125, § "Tests" L155-L171, § "Errors and edge cases" L151, § "Out of scope" L180-L186
**Files:**
- Modify: `scripts/ci.mjs`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Modify: `eval/*/target.json`
- Modify: `eval/*/intent.md`
- Modify: `eval/*/README.md`
- Modify: `eval/*/samples/*/case.md`
- Modify: `eval/*/samples/*/expected.md`
- Create: `eval/gauntlet-handoff/target.json`
- Create: `eval/gauntlet-handoff/replay.md`
- Create: `eval/gauntlet-handoff/intent.md`
- Create: `eval/gauntlet-handoff/README.md`
- Create: `eval/gauntlet-handoff/samples/multi-repo/case.md`
- Create: `eval/gauntlet-handoff/samples/multi-repo/expected.md`
- Create: `eval/brainstorming/samples/multi-repo-legs/case.md`
- Create: `eval/brainstorming/samples/multi-repo-legs/expected.md`
- Create: `eval/brainstorming/samples/multi-repo-activation/case.md`
- Create: `eval/brainstorming/samples/multi-repo-activation/expected.md`
- Create: `eval/brainstorming/samples/multi-repo-branch-mismatch/case.md`
- Create: `eval/brainstorming/samples/multi-repo-branch-mismatch/expected.md`
- Create: `eval/brainstorming/samples/nested-rules/case.md`
- Create: `eval/brainstorming/samples/nested-rules/expected.md`
- Create: `eval/brainstorming/samples/multi-repo-bad-sibling/case.md`
- Create: `eval/brainstorming/samples/multi-repo-bad-sibling/expected.md`
- Create: `eval/subagent-driven-development/samples/leg-cwd/case.md`
- Create: `eval/subagent-driven-development/samples/leg-cwd/expected.md`
- Create: `eval/loop-implementation/samples/leg-iteration/case.md`
- Create: `eval/loop-implementation/samples/leg-iteration/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-ok/case.md`
- Create: `eval/gauntlet-resume/samples/legs-ok/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-missing/case.md`
- Create: `eval/gauntlet-resume/samples/legs-missing/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-wrong-primary/case.md`
- Create: `eval/gauntlet-resume/samples/legs-wrong-primary/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-home-mismatch/case.md`
- Create: `eval/gauntlet-resume/samples/legs-home-mismatch/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-membership/case.md`
- Create: `eval/gauntlet-resume/samples/legs-membership/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-wrong-repo/case.md`
- Create: `eval/gauntlet-resume/samples/legs-wrong-repo/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-receipt/case.md`
- Create: `eval/gauntlet-resume/samples/legs-receipt/expected.md`
- Create: `eval/gauntlet-resume/samples/legs-seed-file/case.md`
- Create: `eval/gauntlet-resume/samples/legs-seed-file/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-teardown/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-teardown/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-discard/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-discard/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-keep/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-keep/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-draft/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-draft/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-verify/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-verify/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-pr/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-pr/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-squash-fail/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-squash-fail/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-rerun/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-rerun/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-stale-pr/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-stale-pr/expected.md`
- Create: `eval/finishing-a-development-branch/samples/legs-seal-fail/case.md`
- Create: `eval/finishing-a-development-branch/samples/legs-seal-fail/expected.md`
- Test: `eval/lib/lint.test.mjs`
- Test: `bin/gauntlet-telemetry-seal.test.mjs`
**Tests:**
- `node --test eval/lib/lint.test.mjs bin/gauntlet-telemetry-seal.test.mjs`
- baseline: b00359ff pass
- via: `lintAll`, `plan_check`, changed instruction assemblies, built CLI

Decision: use text replay cases with embedded synthetic file/tool observations as existing targets do, not another harness. Broad Modify globs permit only needed assembly/intent repairs and single-member spec-body expectation changes from the all-target run.

- [ ] Run scoped tests; add new target without required case and observe lint red. Fill target/replay/README/intent and samples from eval/_template patterns. Pin must-hold facts before accepting output.
- [ ] Populate provisioning cases: `repo-a` keyed `home:`/`create:`, `repo-b` wrapper, `repo-c` defaults; no/basename activation, linked session, mismatch, collision, dirty decline, ambiguity and bad/matching-home sibling.
- [ ] Populate nested rules: `Rules:`, `pkg-x/AGENTS.md`, bullet link `pkg-x/doc/conventions.md`, table links, untouched `pkg-y/AGENTS.md`, `CLAUDE.md -> AGENTS.md`, dedupe/no second hop. Leg-file facts require portable `**Home:**`, Problem/Decisions and own block only.
- [ ] Populate engine cases: `Leg:` before `Files:`/valid `Tests:`, `leg-unknown`, `(leg, path)`, distinct baselines, `cwd`/`Rules:` by wave, dependency, split AC seeds/bases and interrupted two-commit recovery. Runtime matrix remains `extensions/lib/plan-check.test.ts`, not eval prose.
- [ ] Populate brief cases: unchanged `## Repo state` names home after companion-last dispatch; `legs:` follows PR pairs/precedes gate, home first, `worktree: missing` and receipt admission. Resume cases cover drift, wrong primary/repo/branch/header/membership, stripped-plan retry, interrupted code commit and seed refusal. Keep drift lint in `scripts/brief-contract-lint.test.mjs`.
- [ ] Populate finish cases: contract teardown/refusal, discard/keep/draft, fresh verification/audit, body links, partial failure before seal, failed squash verification-only retry, stale PR re-push, fresh-session skips, seal mismatch and home failure.
- [ ] Assert single-member/legacy identity: `## Legs` one `### Leg:` only, no leg file, `legs:` brief, `--leg`, receipt or companion loop. Existing expected facts change only for new spec section. Rollback is absent by decision.
- [ ] Audit assemblies for all moving parts: `skills/brainstorming/reference/legs.md`, `skills/brainstorming/reference/spec-finalization.md`, `skills/brainstorming/gatherer.md`, `skills/using-git-worktrees/SKILL.md` (`$ROOT`, `$BRANCH`), `skills/writing-plans/reference/plan-contract.md`, `extensions/lib/plan-check.ts`, `extensions/phase-tracker.ts`, `skills/subagent-driven-development/SKILL.md`, `skills/loop-implementation/SKILL.md`, `agents/implementer.md`, `agents/loop-implementer.md`, `agents/code-reviewer.md`, `agents/spec-reviewer.md`, `agents/plan-writer.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `scripts/brief-contract-lint.mjs`, `skills/finishing-a-development-branch/reference/legs.md`, `extensions/verify-before-ship.ts`, `extensions/lib/telemetry-record.ts`, `src/bins/gauntlet-telemetry-seal.mjs`, `src/bins/gauntlet-telemetry-seal.test.mjs`, rebuilt `bin/`, `doc/configuration.md`, and all spec `## Tests` samples. No additional orchestrator, cohort `handoff` grammar, `## Repo state` fields, multi-home, companion-home resume, all-repo rule scan, per-companion telemetry or automatic fan-out is introduced.
- [ ] Update affected CI assertions and add source CLI test to its deterministic command. Run `npm run build:bins`; stage actual generated changes together.
- [ ] Run scoped tests green and `node --check scripts/ci.mjs`. Record intents for every changed target and per-sample bundle selection. Header verification runs every target plus gauntlet-handoff; credentials/regression failures block it. Commit generated eval evidence before finish.
- [ ] Commit as `Cover coordinated flow and rebuild shipped command bundles`.

## Wave 4 - Documentation

Depends on Waves 1-3: document implemented contracts. Cross-cutting docs are deliberately last.

### Task 8: Document multi-repo operation and contract authority

**TDD scenario:** Trivial change - documentation review.
**Spec:** doc/specs/2026-10-28-multi-repo-coordinated-flow.md § "Documentation impact" L175-L176
**Files:**
- Modify: `README.md:59-94`
- Modify: `README.md:315-345`
- Modify: `doc/configuration.md:172-176`
- Modify: `doc/configuration.md:210-250`
- Modify: `AGENTS.md:191-214`
**Tests:**
- none: cross-cutting documentation; no Markdown formatter configured

- [ ] Add README Multi-repo runs under workflow overview: explicit selection, shared branch, artifacts, home-only resume, ordered delivery and receipt-backed recovery.
- [ ] Update `## shape-ticket` sibling readers in README/doc/configuration.md; explain home policy versus settings-by-file, defaults, recorded contracts and legacy exception.
- [ ] Document telemetry `legs:`, repeatable seal arguments/mismatch refusal, and cross-repo Process in primary, work by path. Add legs grammar pointer to AGENTS.md routing outside shared core. Leave CHANGELOG.md deferred to release.
- [ ] Validate changed links against source; preserve compact tables/ASCII. Commit as `Document coordinated repository runs`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Problem" L22 | Synthetic examples and portable committed identifiers | Task 1 |
| § "Acceptance criteria" L28-L37 | Selected membership/rooted shared-name provisioning | Task 1 |
| § "Acceptance criteria" L28-L37 | Portable spec leg blocks including one member | Task 1 |
| § "Acceptance criteria" L28-L37 | Rules root/path/one-hop walk and dedupe | Task 1 |
| § "Acceptance criteria" L28-L37 | Companion content and amendment refresh | Task 1 |
| § "Acceptance criteria" L30-L31 | Recorded teardown without wrapper bypass | Task 6 |
| § "Acceptance criteria" L38-L39 | Leg validation and rooted dispatch/rules | Task 2, Task 4 |
| § "Acceptance criteria" L40-L43 | Ordered home-bound multi-leg brief | Task 5 |
| § "Acceptance criteria" L40-L43 | Home-only restore, identity, receipts and drift | Task 5 |
| § "Acceptance criteria" L44-L45 | One menu choice, links, failure inventory and retry | Task 6 |
| § "Acceptance criteria" L46-L49 | Home telemetry validation and single-member absence | Task 3 |
| § "Acceptance criteria" L48-L49 | Single-member/legacy identity and eval preservation | Task 1, Task 2, Task 4, Task 5, Task 6, Task 7 |
| § "Design" L57-L64 | Portable case-insensitive repo identity | Task 1 |
| § "Design" L57-L64 | Local primary stays outside committed blocks | Task 1 |
| § "Design" L57-L64 | Local worktree transported/re-resolved | Task 1 |
| § "Design" L57-L64 | Shared branch in every leg | Task 1 |
| § "Design" L57-L64 | Derived shared name | Task 1 |
| § "Design" L57-L64 | Repo-relative Rules | Task 1 |
| § "Design" L57-L64 | Explicit selection, ambiguity ask and selected-only validation | Task 1 |
| § "Configuration" L68-L85 | Reuse sibling config without new heading/key | Task 1 |
| § "Configuration" L68-L85 | Home flow policy | Task 1 |
| § "Configuration" L68-L85 | Leg checkout settings/preset policy | Task 1 |
| § "Configuration" L68-L85 | Create resolution and wrapper-token asks | Task 1 |
| § "Configuration" L68-L85 | Destroy precedence and hook capture | Task 1 |
| § "Configuration" L68-L85 | Spec dirs, derived plan dirs and home plan | Task 1 |
| § "Configuration" L68-L85 | Per-leg verification | Task 1 |
| § "Configuration" L68-L85 | Absent-config defaults | Task 1 |
| § "Configuration" L85 | Recorded authority and legacy reread exception | Task 6 |
| § "Brainstorming" L89-L93 | ROOT/BRANCH, readback and preserved failed creations | Task 1 |
| § "Brainstorming" L89-L93 | One scout per leg and bounded Rules walk | Task 1 |
| § "Brainstorming" L89-L93 | Section order/committed leg artifact fields | Task 1 |
| § "Brainstorming" L89-L93 | Member ticket ownership/unmatched question | Task 1 |
| § "Brainstorming" L89-L93 | Amendment synchronization | Task 1 |
| § "Writing-plans and plan_check" L97-L98 | Leg placement, per-leg provenance and Rules re-walk | Task 2, Task 4 |
| § "Writing-plans and plan_check" L97-L98 | Unknown leg and per-leg baseline equality | Task 2, Task 4 |
| § "Writing-plans and plan_check" L97-L98 | Task roots, created anchors and qualified ownership | Task 2, Task 4 |
| § "Implement engines" L102-L104 | Homogeneous dependency-preserving waves | Task 4 |
| § "Implement engines" L102-L104 | SDD isolation/review/integration/commit follow leg | Task 4 |
| § "Implement engines" L104 | Original AC ownership defaults home; shared AC entries ordered by AC then membership | Task 2, Task 4 |
| § "Implement engines" L104 | Numeric four-column entries plus unique original AC/repo mapping in `## Leg mapping` | Task 2, Task 4 |
| § "Implement engines" L104 | Home `base:` and per-member base/seeded headers; seed only its leg before marking `yes` | Task 2, Task 4 |
| § "Implement engines" L104 | Initial cap counts non-cut entries and per-active-leg seeds; all-cut cap 1 | Task 4 |
| § "Implement engines" L104 | Preserve iteration, attempts, cut, funding and cap rules; seed never changes attempts | Task 4 |
| § "Implement engines" L104 | Leg-local seed/row dispatch with base, Rules and home-owned spec/ledger | Task 4 |
| § "Implement engines" L104 | Persist `pending:` tuple before companion dispatch and validate its shape | Task 2, Task 4 |
| § "Implement engines" L104 | Attributed companion commit carries tuple, consumed iteration and bounded result evidence | Task 4 |
| § "Implement engines" L104 | Parent records SHA, updates only leg seed/target, removes pending in home-ledger commit | Task 4 |
| § "Implement engines" L104 | Recover exactly one matching pending commit/result before dispatch; stop unrelated movement | Task 4 |
| § "Implement engines" L104 | Legacy and single-member ledger bytes unchanged | Task 2, Task 4 |
| § "Handoff and resume" L108-L109 | Pinned home snapshot/ordered grammar | Task 5 |
| § "Handoff and resume" L108-L109 | Identity/membership admission before tracker writes | Task 5 |
| § "Handoff and resume" L108-L109 | Drift/receipt admission/leg seed refusal | Task 5 |
| § "Finishing" L113 | Per-leg verification/conformance/advisory freshness | Task 3, Task 6 |
| § "Finishing" L114-L120 | Every menu row spans run including PR rework | Task 6 |
| § "Finishing" L114-L120 | Companion barrier before strip/seal/delivery | Task 6 |
| § "Finishing" L114-L120 | Receipt persistence and PR/squash validation | Task 6 |
| § "Finishing" L114-L120 | Portable delivery links | Task 6 |
| § "Finishing" L114-L120 | Failure inventory/retry without rollback | Task 6 |
| § "Finishing" L119 | Home-only telemetry and complete-set retry | Task 3 |
| § "Finishing" L114-L120 | Recorded teardown and receipt retention | Task 6 |
| § "Documentation and evals" L124-L125 | Assemble approved surfaces/evals; remove nothing | Task 7 |
| § "Errors and edge cases" L129-L137 | Bad selected path stops, unselected untouched | Task 1 |
| § "Errors and edge cases" L129-L137 | Ambiguous token asks before creation | Task 1 |
| § "Errors and edge cases" L129-L137 | Dirty decline preserves created legs | Task 1 |
| § "Errors and edge cases" L129-L137 | Collision stops without suffix | Task 1 |
| § "Errors and edge cases" L129-L137 | Wrapper mismatch names branch | Task 1 |
| § "Errors and edge cases" L129-L137 | Linked session never substitutes a leg | Task 1 |
| § "Errors and edge cases" L129-L137 | Unresolved wrapper argument asks per leg | Task 1 |
| § "Errors and edge cases" L129-L137 | Unknown touched paths explicit | Task 1 |
| § "Errors and edge cases" L129-L137 | Missing links explicit; no second hop | Task 1 |
| § "Errors and edge cases" L136 | Planner fills unresolved rule paths | Task 4 |
| § "Errors and edge cases" L138-L140 | Home tuple mismatch stops | Task 5 |
| § "Errors and edge cases" L138-L140 | Membership mismatch stops | Task 5 |
| § "Errors and edge cases" L138-L140 | Common-dir mismatch stops | Task 5 |
| § "Errors and edge cases" L141-L142 | Unknown leg/wrong SHA rejected | Task 2 |
| § "Errors and edge cases" L141-L142 | Mixed wave rejected | Task 2 |
| § "Errors and edge cases" L141-L143 | Writer repairs wave; engine recovers code commit | Task 4 |
| § "Errors and edge cases" L143-L145 | Resume re-records interrupted commit | Task 5 |
| § "Errors and edge cases" L143-L145 | Home-only entry, identity stops and drift notices | Task 5 |
| § "Errors and edge cases" L143-L145 | Missing tree needs receipt | Task 5 |
| § "Errors and edge cases" L146-L151 | Partial failure and proven retry | Task 6 |
| § "Errors and edge cases" L146-L151 | Stale PR re-push/squash verification-only retry | Task 6 |
| § "Errors and edge cases" L148-L149 | Malformed CLI or differing sealed set fails | Task 3 |
| § "Errors and edge cases" L146-L151 | Seal failure preserves delivered receipts | Task 6 |
| § "Errors and edge cases" L146-L151 | Discard confirmation/refusal reporting | Task 6 |
| § "Errors and edge cases" L151 | Single-member/legacy artifact identity | Task 7 |
| § "Tests" L155-L171 | N worktrees/contracts/unselected sibling | Task 7 |
| § "Tests" L155-L171 | Activation/basename/linked-session fixtures | Task 7 |
| § "Tests" L155-L171 | Branch mismatch fixture | Task 7 |
| § "Tests" L155-L171 | Teardown/discard/keep/draft fixtures | Task 7 |
| § "Tests" L155-L171 | Nested Rules fixtures | Task 7 |
| § "Tests" L155-L171 | Leg-file content facts | Task 7 |
| § "Tests" L155-L171 | Bad sibling fixture | Task 7 |
| § "Tests" L162 | Checker deterministic matrix | Task 2 |
| § "Tests" L163-L164 | Engine contract tests | Task 4 |
| § "Tests" L155-L171 | SDD leg-routing eval | Task 7 |
| § "Tests" L155-L171 | Loop interrupted-iteration eval | Task 7 |
| § "Tests" L165-L166 | Brief drift lint/restore scenarios | Task 5 |
| § "Tests" L155-L171 | Handoff grammar eval | Task 7 |
| § "Tests" L155-L171 | Resume admission evals | Task 7 |
| § "Tests" L158 | Teardown/discard/keep/draft scenarios | Task 6 |
| § "Tests" L167-L168 | Verification freshness/delivery scenarios | Task 6 |
| § "Tests" L155-L171 | Finish freshness eval | Task 7 |
| § "Tests" L155-L171 | Delivery/receipt retry evals | Task 7 |
| § "Tests" L169 | Source CLI input/record/retry matrix | Task 3 |
| § "Tests" L155-L171 | All existing targets preserve approved facts | Task 7 |
| § "Tests" L155-L171 | No rollback test by decision | Task 7 |
| § "Documentation impact" L175-L176 | README workflow/reader row | Task 8 |
| § "Documentation impact" L175-L176 | Configuration authority/settings/telemetry | Task 8 |
| § "Documentation impact" L175-L176 | AGENTS routing; changelog deferred to release | Task 8 |
| § "Out of scope" L180-L186 | Preserve cohort handoff/core grammar | Task 7 |
| § "Out of scope" L180-L186 | No companion-primary resume | Task 7 |
| § "Out of scope" L180-L186 | No rollback/compensation | Task 7 |
| § "Out of scope" L180-L186 | No whole-repo Rules scan | Task 7 |
| § "Out of scope" L180-L186 | No companion telemetry | Task 7 |
| § "Out of scope" L180-L186 | No multi-home | Task 7 |
| § "Out of scope" L180-L186 | No automatic unselected fan-out | Task 7 |
