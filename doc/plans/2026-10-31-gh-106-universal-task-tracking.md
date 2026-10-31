# Universal task tracking Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Derive loop task tracking from the ledger and expose comparable run measurements.
**Architecture:** Add explicit refresh to the existing snapshot tracker, not a second lifecycle. Keep dispatch admission in the driver, put the full gate at verify step 1, and extend existing telemetry reducers and CLI output.
**Tech Stack:** TypeScript, Node test runner, Markdown skills/evals, YAML, esbuild.
**Spec:** `doc/specs/2026-10-31-gh-106-universal-task-tracking.md`
**Verification:** `npm test`; `node eval/run.mjs loop-implementation`; `node eval/run.mjs gauntlet-resume`; `node eval/run.mjs gauntlet-handoff`; `node eval/run.mjs brainstorming` - includes the loop-ledger-amend bypass fact
**Ticket:** `jjuraszek/pi-gauntlet#106`
**Baseline policy:** implement-local
Baseline jjuraszek/pi-gauntlet: 5135218e

Baseline provenance: HEAD 5135218e; initial porcelain empty. Every subsequent inventory contains only the untracked plan, an admitted workflow file; no source changes or generated artifacts. Task 1 executed 431 tests, Task 2 executed 111, Task 3 executed 19, Task 4 executed 7, Task 5 executed 1, Task 6 executed 91, all exit 0. Initial Task 1/2 commands without the CI loader failed on missing host Pi packages (204 tests/2 failures and 26 tests/1 failure). Recon of scripts/ci.mjs:452-479 identified the pi-stubs loader; both corrected commands were executed successfully at the same HEAD, resolving those failures. Unchanged commands retain their directly executed evidence at HEAD, not inferred evidence. A subsequent git diff --quiet 5135218e 5135218e excluding doc/specs/ and doc/plans/ exited 0; no evidence SHA changed.

Baseline provenance: implement-local amendment at home jjuraszek/pi-gauntlet revision b4fb5e44; initial porcelain empty. Retain all six unchanged task command groups and their measured 5135218e evidence, including the original declaration and failure/resolution history above. No changed, added, missing or invalid task-command evidence requires execution. No endpoint-tree equivalence or baseline rerun performed. Admit only doc/specs/2026-10-31-gh-106-universal-task-tracking.md and doc/plans/2026-10-31-gh-106-universal-task-tracking.md for these workflow edits; do not describe the amended working tree as clean HEAD.

Baseline provenance: implement-local retry at home jjuraszek/pi-gauntlet revision b4fb5e44; initial porcelain contains only unstaged changes to doc/plans/2026-10-31-gh-106-universal-task-tracking.md and doc/specs/2026-10-31-gh-106-universal-task-tracking.md, both explicitly admitted. Retain all six command groups byte-for-byte against the first apply report's original inventory; no command or evidence changed, so no task tests or endpoint-tree equivalence run. Execution tree is b4fb5e44 plus these workflow edits, not clean HEAD.

Baseline provenance: implement-local verify amendment at home jjuraszek/pi-gauntlet revision 860db823c2c272005b2550c8acfc4fdc24c2716e; initial porcelain empty, In-flight none. The owning checkout is the supplied gh-106-universal-task-tracking worktree. Admit only doc/specs/2026-10-31-gh-106-universal-task-tracking.md and doc/plans/2026-10-31-gh-106-universal-task-tracking.md. Retain all six unchanged command groups and their measured 5135218e evidence byte-for-byte; no changed, added, missing or invalid command evidence requires execution. No tests, endpoint-tree equivalence or rerun-all sweep run. The amended tree is the identified revision plus these workflow edits, not clean HEAD. Original task inventory and anchored obligation text are retained in the saved verify-amend-apply report.

Baseline provenance: implement-local second verify amendment at home jjuraszek/pi-gauntlet revision 4e66666107f53f75ce24002b6755ab4b2949c338; initial porcelain empty, In-flight none. Read committed home plan/spec originals at their home-relative paths before editing. The owning checkout is the supplied gh-106-universal-task-tracking worktree; admitted changes are only doc/specs/2026-10-31-gh-106-universal-task-tracking.md and doc/plans/2026-10-31-gh-106-universal-task-tracking.md. Retain the original declaration and all six unchanged command groups with their measured 5135218e evidence byte-for-byte. No changed, added, missing or invalid command evidence requires execution; no tests, endpoint-tree equivalence or rerun-all sweep run. The amended tree is the identified revision plus these workflow edits, not clean HEAD.

**Verification ownership:** The parent runs the complete header command set at verify step 1 in the integrated home worktree, not in implementation workers or between-wave gates. The parent records each full target's command, actual exit and result and commits the resulting `eval/<target>/report.md` and required eval records. Before whole-diff review and finish, require improved or unchanged results under the runner's exit-code classification for every fact this change touches: the superseded table rows, the new ledger-tracker samples, and the `loop-ledger-amend` bypass fact. This gate replaces the requirement that every non-superseded fact hold; improved or unchanged is a comparative result, not a claim that every candidate fact holds. Record provider refusals and fails -> fails cells whose facts this diff does not touch in the committed report; they do not block and do not turn an actual nonzero target exit into exit 0. For an inconclusive cell on a touched fact, rerun its sample once with `node eval/run.mjs <target> <sample> --refresh-judgments`, then run the full target to commit its integrated report; a refresh does not itself count as acceptance. A remaining regressed, inconclusive or error result on a touched fact, except a recorded provider refusal, or an interrupted run blocks verification. Route repairs to Task 4 for loop behavior or Task 5 for restoration/handoff/amendment behavior, then rerun affected full targets without widening approved fact replacements or the scoped-command restriction. Task completion attests only its manifest-supplied deterministic scoped tests, not model-eval success.

---

## Files

**Modify - runtime:** `extensions/plan-tracker.ts`, `extensions/plan-tracker.test.ts`, `extensions/phase-tracker.test.ts`, `extensions/lib/plan-check.ts`, `extensions/lib/plan-check.test.ts`, `extensions/lib/telemetry-collect.ts`, `extensions/lib/telemetry-collect.test.ts`, `extensions/lib/telemetry-record.ts`, `extensions/lib/telemetry-record.test.ts`, `extensions/telemetry.ts`, `extensions/telemetry.test.ts`, `src/bins/gauntlet-performance.mjs`, `src/bins/performance/runs.mjs`, `bin/gauntlet-performance.test.mjs`.

**Modify - loop:** `skills/loop-implementation/SKILL.md`, `skills/loop-implementation/reference/coordinated-legs.md`, `agents/loop-implementer.md`, `scripts/loop-engine-contract.test.mjs`, `eval/loop-implementation/intent.md`, `eval/loop-implementation/samples/verify-lifecycle/case.md`, `eval/loop-implementation/samples/verify-lifecycle/expected.md`, `eval/loop-implementation/samples/escalated-row-attempt/expected.md`, `eval/loop-implementation/samples/cap-and-exit-verification/expected.md`, `eval/loop-implementation/samples/gate-line-first/expected.md`.

**Modify - restore:** `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/reconstruction.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `skills/gauntlet-handoff/SKILL.md`, `skills/brainstorming/reference/amendment-surface.md`, `scripts/brief-contract-lint.test.mjs`, the three target intent files and six expected-fact files enumerated in Task 5.

**Parent verification outputs:** `eval/loop-implementation/report.md`, `eval/gauntlet-resume/report.md`, `eval/gauntlet-handoff/report.md`, `eval/brainstorming/report.md` and required records under each target's results directory. The parent generates and commits these at verify step 1; they are not implementation-worker file ownership.

**Create:** Task 4's tracker-refresh, tracker-boundary and tracker-verify case.md/expected.md pairs; Task 5's ledger-tracker-recovery and ledger-task-list pairs. Exact paths appear in their ownership blocks.

**Regenerate:** `bin/gauntlet-performance.mjs`, `bin/gauntlet-telemetry-seal.mjs`, `bin/gauntlet-spec-index.mjs`.

**Modify - docs:** `doc/configuration.md`, `doc/implement-engines.md`, `README.md`, `CHANGELOG.md`.

**Preserve:** `doc/specs/2026-10-23-gh-68-loop-implement-engine.md:4` already has the required scoped supersession banner. Delete no file; remove superseded clauses and the index-based reducer in place.

## Execution conventions

Single member, home-owned spec and plan; every command runs in the caller's worktree. Read the spec's Rules list plus `skills/forge-skill/SKILL.md`; no extra nested AGENTS.md or CLAUDE.md was found. Keep persona frontmatter byte-identical. No deployment topology or Happy path table exists. Keep this one plan.

CI uses `--experimental-loader ./extensions/test-support/pi-stubs.mjs` for extension tests. There is no separate scoped formatter/linter in package.json: preserve neighboring style and run `git diff --check` for owned files. Full CI bundles style, bin freshness and deterministic tests, not model evals. Use OS-temp fixtures. Wave 1 tests own independent scratch roots; Wave 2 tasks own different instructions, samples and intent files. Model runs and their reports/records belong only to parent verification after integration.

Preserve `skills/subagent-driven-development/` and `skills/writing-plans/`. At verify require `git diff --stat 5135218e..HEAD -- skills/subagent-driven-development skills/writing-plans` empty. The first real loop-run observation belongs to the post-merge venue, not a nested flow during implementation; do not post or close #106 without that observation and explicit comment-text approval.

## Wave 1 - Runtime foundations

### Task 1: Add atomic ledger refresh and home-pending admission
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Modifying tested code - existing tests first.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L25, § "Acceptance criteria" L27, § "Acceptance criteria" L29, § "Acceptance criteria" L33, § "Acceptance criteria" L39, § "Design" L89, § "The `refresh` action" L93, § "The `refresh` action" L95-L103, § "The `refresh` action" L105, § "The `refresh` action" L107-L116, § "The `refresh` action" L118, § "The `refresh` action" L120, § "Resume, handoff, amendment, coordinated legs" L144, § "Errors and edge cases" L188, § "Errors and edge cases" L189, § "Errors and edge cases" L190, § "Errors and edge cases" L193, § "Errors and edge cases" L194, § "Errors and edge cases" L195, § "Errors and edge cases" L200, § "Errors and edge cases" L201, § "Out of scope" L241

**Files:**
- Modify: `extensions/plan-tracker.ts`
- Modify: `extensions/plan-tracker.test.ts`
- Modify: `extensions/phase-tracker.test.ts`
- Modify: `extensions/lib/plan-check.ts:1227-1237`
- Modify: `extensions/lib/plan-check.test.ts:1280-1300`
- Test: `extensions/plan-tracker.test.ts`
- Test: `extensions/phase-tracker.test.ts`
- Test: `extensions/lib/plan-check.test.ts`

**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts extensions/phase-tracker.test.ts extensions/lib/plan-check.test.ts`
- baseline: 5135218e pass
- via: `plan_tracker`, `validateSnapshot`, `applyPlanActivity`, `homePending`

Decision: use the existing tool-error convention without a successful snapshot or completion; resolve relative path against execute context cwd, absolute unchanged. Existing consumers ignore error details. `PlanTrackerDetails`, `latestPlanSnapshot` and widget replay remain the transport. Keep `init`, `add`, `update`, `status`, `clear` behavior unchanged.

Verification ownership: `npm test` is the parent-only header gate for these unchanged regression assertions; this task runs only its scoped Tests commands.

- [ ] Run the scoped tests. Add temp-file cases to the existing harness and confirm red: cut, baseline done, dispatched done, failed with/without pending, open with pending, stale pending on done/cut, `pending: seed`, all-cut, no-cap, mapped home/companion, out-of-order row 3 before row 2, and retained pending/started/finished Gn tasks.
- [ ] Implement local parser/projection inside `extensions/plan-tracker.ts`, not a registry. Require line 1 `# Ledger - loop engine`; parse the row table, `## Decisions`, optional `## Leg mapping` and `pending:`. Use the existing grammar in `reference/coordinated-legs.md` (`coordinated-legs.md:43`). Ignore `cap:`/`iterations:` for projection and treat every mapping entry as live. Respect escaped evidence pipes and section boundaries. The spec displays the header as `\| row \| status \| attempts \| evidence \|` and allowed statuses as `open\|done\|failed\|cut`.
- [ ] Add `action: "refresh"` and optional path. Read and validate everything before replacing tasks. Test missing/unreadable path, non-ledger line 1, wrong table, nonnumeric row, bad status, pending absent row and mapping absent row; current list/phase stay exact on every rejection. Instantiate the spec's errors with real path/line/row: `refresh: cannot read <path>: <reason>`, `refresh: <path> line 1 is "<observed>", not a loop ledger`, `refresh: <path> row table malformed at line <n>`, `refresh: <path> pending: names row <n> which is absent`, `refresh: <path> leg mapping names row <n> which is absent`.
- [ ] Project cut and baseline-closed done to skipped; done with a row-done decision to complete; failed without numeric pending to failed; open/failed named by pending to `in_progress`; other open to pending. Done/cut override stale tuples, seed marks no row. Use row-number names or repo-qualified mapped names. Replace only whole-name ledger shapes; order non-pending ledger, kept non-pending, pending ledger, kept pending. Validate the final snapshot and test `plan_tracker status`, widget counts and replay.
- [ ] At `extensions/lib/plan-check.ts:1230`, replace `legs.slice(1)` admission with all `## Legs`, including `legs[0]`; preserve `pairs[n-1].leg === repo`. Flip `homePending` at `extensions/lib/plan-check.test.ts:1286`; add wrong-mapping rejection. Single-member home tuples remain outside `coordinatedMetadata`. Run these through `plan_check`'s ledger checker, without widening scope grammar.
- [ ] Add actual refresh-result phase tests: `loop: seed ledger` -> `start implement` -> refresh all-cut -> complete -> `start verify`; before-start refresh completes nothing, failed/in_progress block completion. No production phase change or `phase_tracker complete implement` is required. Task 4 removes `## Exit verification` from `skills/loop-implementation/SKILL.md` and starts verify only after completion, including after each admitted `loop:` result and the all-cut `## After the loop` continuation.
- [ ] Keep appended Gn tasks open across refresh; Task 5 restores their saved statuses. Preserve all old assertions, including `extensions/telemetry.test.ts` as a cross-task regression contract. Keep `skills/subagent-driven-development/` and `skills/writing-plans/` byte-unchanged.
- [ ] Rerun green and `git diff --check` on owned files. Commit `Add ledger-derived tracker refresh (ref #106)`.

### Task 2: Count name-based reopens and durable verification runs
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Modifying tested code - existing tests first.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L37, § "Acceptance criteria" L39, § "Acceptance criteria" L41, § "Acceptance criteria" L43, § "Acceptance criteria" L53-L54, § "Telemetry" L152, § "Telemetry" L153, § "Errors and edge cases" L197, § "Errors and edge cases" L202, § "Errors and edge cases" L203, § "Errors and edge cases" L204

**Files:**
- Modify: `extensions/lib/telemetry-collect.ts:62-76`
- Modify: `extensions/lib/telemetry-collect.test.ts`
- Modify: `extensions/lib/telemetry-record.ts:87-137`
- Modify: `extensions/lib/telemetry-record.test.ts`
- Modify: `extensions/telemetry.ts`
- Modify: `extensions/telemetry.test.ts`
- Test: `extensions/lib/telemetry-collect.test.ts`
- Test: `extensions/lib/telemetry-record.test.ts`
- Test: `extensions/telemetry.test.ts`

**Tests:**
- `node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/telemetry-collect.test.ts extensions/lib/telemetry-record.test.ts extensions/telemetry.test.ts`
- baseline: 5135218e pass
- via: `hasReopen`, `onPlanTracker`, `matchTestStatement`, `derive`

Decision: replace boolean `hasReopen` with `countReopens(prev, next): number`, retaining optional string names in `lastPlanTasks` at extensions/telemetry.ts:632 and calling it on any successful `plan_tracker` snapshot at :725-739. Two distinct names reopening must count twice. Existing dispatch-result collection at :688-722 and implement plan-total capture stay unchanged.

Verification ownership: `npm test` is the parent-only header gate for these unchanged regression assertions; this task runs only its scoped Tests commands.

- [ ] Run existing tests, then replace only index-based cases at `extensions/lib/telemetry-collect.test.ts:35-39`. Add named transition tests: `complete -> failed`, `complete -> in_progress`, two names, reorder, `failed -> in_progress`, `complete -> skipped`, `complete -> pending`, absent and nameless tasks. Add any-action collector cases and confirm red.
- [ ] Count each matching string name once per transition; increment `task_reopens` by the count and emit one existing gate event per transition. Remove update-only gating; repeated refresh never recounts. Preserve `extensions/telemetry.test.ts:1144-1154` unchanged. A `done -> cut` amendment and done-to-open (`reopened by amendment`) are not reopens; the latter's verify stop belongs to Tasks 4/5.
- [ ] Add counter cases before implement, in implement, two in verify, in ship, unmatched command, failed command, unbound/child sessions, loaded record, flush and seal. Add derive/YAML round-trip coverage; confirm red before implementation.
- [ ] Add optional verification_runs beside tests; `derive()` at `extensions/lib/telemetry-record.ts:131` copies `verification_runs: rec.derived.verification_runs`. Initialize for a new run at `phase_tracker start implement`, preserve loaded count, and use retained implement-start history to recognize the open window without a second durable flag. Legacy absence remains legal.
- [ ] In the parent bash tool_call hook use `snap.testCommands ?? DEFAULT_TEST_COMMANDS`: count each matcher hit once from start through seal and flush it. A ledger `verification:` text the matcher misses contributes zero. Keep the existing latest `tests` verify/ship-only result window, child/bound/frozen guards and no-record no-op. No #109 gate-set implementation.
- [ ] Add a sealed-loop fixture with `engine: loop`, `iterations` matching loop-implementer results and plan totals from cut/baseline skips plus dispatched closes. Also retain waves `init`/`add`/`update`/`status`/`clear` and existing `extensions/plan-tracker.test.ts`/`extensions/phase-tracker.test.ts` assertions; preserve `skills/subagent-driven-development/` and `skills/writing-plans/`. Fixture `pending:` covers `in_progress`; inspect done/cut transitions by name.
- [ ] Rerun green and `git diff --check`; leave bins to Task 6. This enables the `venue:` observation of tasks minus skipped, dispatches, verification_runs and ratio with `events_dropped` zero, not a claim of a real run. Commit `Measure tracker reopens and verification calls (ref #106)`.

### Task 3: Expose comparable dispatch ratios in the performance digest
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Modifying tested code - existing tests first.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L45, § "Acceptance criteria" L47, § "Acceptance criteria" L53-L54, § "Telemetry" L154, § "Errors and edge cases" L205

**Files:**
- Modify: `src/bins/gauntlet-performance.mjs:84-167`
- Modify: `src/bins/performance/runs.mjs`
- Modify: `bin/gauntlet-performance.test.mjs`
- Test: `bin/gauntlet-performance.test.mjs`

**Tests:**
- `node --test bin/gauntlet-performance.test.mjs`
- baseline: 5135218e pass
- via: `gauntlet-performance`, `loadRecord`, `renderText`

Decision: follow loadRecord's numeric/null JSON convention with `dispatches_per_task` and boolean `coordinated`; keep unrounded JSON, print two decimals for available ratios. Existing `dispatches` and iterations retain their meanings.

- [ ] Run tests, then add a source-CLI harness alongside shipped tests. Add three `dispatch` result events with `phase: implement`, one verify result, tasks 4/skipped 2 -> 1.5, for both engines. Add no-plan, zero denominator, `events_dropped > 0`, zero dispatches, legacy record and empty/nonempty `legs:` cases. Confirm new source assertions red.
- [ ] Divide implement result count by `plan.tasks - plan.skipped`; null when plan is absent, denominator zero or events were dropped. Render `disp/task` as number or `n/a`. Derive `coord` only from sealed legs, rendering `yes`/`no`; no pre-seal inference. Keep JSON filterable.
- [ ] Run source and existing shipped cases green; new behavior assertions use source until Task 6 integrates regenerated `bin/*.mjs` through `npm run build:bins`. Do not leave this task's scoped command failing or modify bundles in parallel.
- [ ] Run `git diff --check`, commit `Show dispatches per in-scope task (ref #106)`. Together with Task 2's `verification_runs`, this enables the post-merge `venue:` report with `events_dropped` zero, without authorizing a comment.

## Wave 2 - Loop and restoration protocols

Depends on Wave 1: refresh, admission and measurements exist. Tasks 4/5 own disjoint instructions, samples and intent files; the spec fixes their shared protocol. Parent verification owns model-target execution and outputs after integration.

### Task 4: Route loop dispatch and verification through the tracker lifecycle
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Tested instruction change - deterministic red/green; model evals belong to parent verify step 1.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L25, § "Acceptance criteria" L27, § "Acceptance criteria" L29, § "Acceptance criteria" L31, § "Acceptance criteria" L33, § "Acceptance criteria" L35, § "Acceptance criteria" L51, § "Design" L89, § "The loop driver" L126, § "The loop driver" L127, § "The loop driver" L128, § "The loop driver" L129, § "The loop driver" L130, § "The loop driver" L131, § "The loop driver" L132, § "The loop driver" L133, § "Verification at verify step 1" L137, § "Verification at verify step 1" L139, § "Resume, handoff, amendment, coordinated legs" L147, § "Resume, handoff, amendment, coordinated legs" L148, § "Docs and evals" L161, § "Superseded eval facts and contract assertions" L165, § "Superseded eval facts and contract assertions" L175-L176, § "Superseded eval facts and contract assertions" L177, § "Superseded eval facts and contract assertions" L179, § "Superseded eval facts and contract assertions" L181, § "Errors and edge cases" L189, § "Errors and edge cases" L190, § "Errors and edge cases" L191, § "Errors and edge cases" L192, § "Errors and edge cases" L196, § "Errors and edge cases" L197, § "Errors and edge cases" L198, § "Errors and edge cases" L201, § "Tests" L230, § "Out of scope" L243, § "Out of scope" L246

**Files:**
- Modify: `skills/loop-implementation/SKILL.md`
- Modify: `skills/loop-implementation/reference/coordinated-legs.md`
- Modify: `agents/loop-implementer.md`
- Modify: `scripts/loop-engine-contract.test.mjs`
- Modify: `eval/loop-implementation/intent.md`
- Modify: `eval/loop-implementation/samples/verify-lifecycle/case.md`
- Modify: `eval/loop-implementation/samples/verify-lifecycle/expected.md`
- Modify: `eval/loop-implementation/samples/escalated-row-attempt/expected.md`
- Modify: `eval/loop-implementation/samples/cap-and-exit-verification/expected.md`
- Modify: `eval/loop-implementation/samples/gate-line-first/expected.md`
- Create: `eval/loop-implementation/samples/tracker-refresh/case.md`
- Create: `eval/loop-implementation/samples/tracker-refresh/expected.md`
- Create: `eval/loop-implementation/samples/tracker-boundary/case.md`
- Create: `eval/loop-implementation/samples/tracker-boundary/expected.md`
- Create: `eval/loop-implementation/samples/tracker-verify/case.md`
- Create: `eval/loop-implementation/samples/tracker-verify/expected.md`
- Test: `scripts/loop-engine-contract.test.mjs`

**Tests:**
- `node --test scripts/loop-engine-contract.test.mjs`
- baseline: 5135218e pass
- via: `plan_tracker refresh`, `loop-implementer`, `loop: repair verification`

Decision: keep targeting, validation and human stops inside the driver. Reduce physical lines below 150 by deletion and concise affected paragraphs, not moving those responsibilities. The old completion ordering assertion passes on absent-call index -1; leave it unchanged. Preserve unrelated contract tokens while relocating verify behavior.

- [ ] Run the contract test, add new refresh/pending/admission/verify assertions and confirm red. Change only the named old assertions: remove Exit verification from two headings lists, replace its reference slice with whole-reference checks, remove its dispatch-read reference and replace `assert.doesNotMatch(driver, /pending:|companion-return-shell|## Leg mapping/)` with a positive Dispatch pending assertion. Keep `companion-return-shell` and `## Leg mapping` excluded from the driver, and pending excluded from the legacy seed skeleton. Keep every other existing assertion intact.
- [ ] Add tracker-refresh scenarios: all-cut/baseline seed, out-of-order close, in-flight retry, cut after dispatch, completion via refresh. Add tracker-boundary scenarios: allowance failed, dirty/commit boundary in_progress, cap with no active row; done+dirty and two commits at immediate stop and resume. Add tracker-verify: per-leg gate, once-per-flow repair, restricted failure menu and authorized re-bound closure. Keep raw row-status explanations in expected facts, never in the skill.
- [ ] Rewrite only `verify-lifecycle` `contract`, `escalated-row-attempt` `ledger-prepare-local`, the closed-row half of `cap-and-exit-verification` `contract`, and the tree-untouched clause of `gate-line-first` `preserved`, recording `holds -> replaced` in intent. For cap-and-exit-verification preserve the cap-stop half verbatim; replace the closed-row expectation with "Closed rows run the ledger gate once at verify step 1; failure quotes output, never reopens/reruns, keeps verify active and implement complete, and offers amend or stop only". For gate-line-first replace "leaves implement active and tree untouched" with "leaves implement active; the only tree write is the restored target cells and `pending:` tuple in the working ledger, nothing discarded or reset"; preserve attempts, consumed iterations/cap and no done or stuck terminal marker clauses. Update verify-lifecycle input to remove its already-passed exit premise. Preserve all other facts. Task 5 owns `eval/gauntlet-handoff` and `eval/gauntlet-resume` and their intent.md changes. Retain ownership of the loop instruction changes, samples, expected facts and intent file; leave full-target execution, reports and required records to parent verification under the header contract.
- [ ] Entry step 5: `plan_check`, commit `loop: seed ledger`, `phase_tracker({ action: "start", phase: "implement" })`, then `plan_tracker({ action: "refresh", path: <absolute ledger path> })`. All-cut needs this after `start implement`. Rule 1 becomes `No open or failed row | Refresh; require implement complete; continue at ## After the loop step 0. All-cut and baseline-complete ledgers exit here.` Do not start verify when a refresh leaves implement active.
- [ ] In `## Dispatch`, take the home saved ledger before iterations bump/tuple write. Persist the consumed count and tuple before every home/companion dispatch, then refresh with absolute path only. Use home for zero/one `## Legs`; actual member for coordinated. Preserve companion SAVED_LEDGER's post-bump/pending meaning. No extra commit. The extension, not skill prose, maps `open`, `failed`, `done`, `cut`, `pending`, `in_progress`, `complete`, `skipped`.
- [ ] In the persona add removal of pending in the home commit and its header-preservation exception, leaving companion body attribution and frontmatter unchanged. In `## Validate the return`, permit only iterations+1 and tuple removal alongside existing row/decision rules; a tuple left in an admitted clean single commit is an ordinary miss. Clear it in failed-row repair. Retry/cut/amend/raise-cap/escalate do not clear it. Home `loop: row ...` and `loop: seed evidence` commits remove it only on a valid return; validate both seed and ordinary paths.
- [ ] Boundary rejection restores pre-dispatch target cells and the saved tuple to the working ledger, not other child changes or commits. The before-image supplies cells and the separately recorded dispatch identity supplies the tuple. Preserve consumed count. Refresh before discard/reset stop; never project terminal child results before clean/exactly-one-commit admission. Refresh once after every admitted `loop:` child/parent commit. Companion `loop: record` clears pending only on accepted return; rejection keeps it.
- [ ] Delete `## Exit verification` in both driver and coordinated reference; remove `phase_tracker({ action: "complete", phase: "implement" })` and `phase_tracker complete implement`, passing-exit reuse and `without plan_tracker initialization or lifecycle updates`. Keep no implement reviewers and no ledger plan-writer/plan_check aftermath. No `init`, `add`, `update` calls in the driver. `applyPlanActivity` at `phase-tracker.ts:517-527` owns completion.
- [ ] Fold verification into `## After the loop` step 1: single-member uses ledger `verification:`; coordinated uses each `contract:` `- verification:` in its own checkout. Keep the reference's existing command-source and once-per-flow/all-legs tokens in a pointer paragraph, not a second gate section. Failure requires amend permission, `iterations < cap`, `escalationLoop.implModel`, one implementer in failing leg, `loop: repair verification`, clean/exactly-one-commit/rows-unchanged validation and one failing-leg rerun. Keep verified HEAD/clean-state evidence. Without permission or after spending the identity, stop.
- [ ] Verify failure prints `Stopped: verification failed with every row closed`, keeps verify active and implement complete, offers amend/stop only, not `Retry with hint` or `cap +N`. Limit `## Human stop`'s implement-active and row/cap offers to implement stops. Preserve raw output handling; do not implement #109's gate set, selective checks or `loop: regress row <m>`. Task 7 updates `doc/implement-engines.md` compatibly.
- [ ] Drop tracker exclusions from the conformance continuation and use normal Gn tasks. A done-to-open `reopened by amendment` triggers `Stopped: row <n> reopened by amendment during verify`: authorize row return or stop. On approval use normal Dispatch/Validate/refresh with verify still active, no phase reset; close on disk and rerun step 1. `phase-tracker.ts:1227-1243` blocks `complete verify` until closure, not a `plan_tracker update` workaround. Verify `done -> cut` projects `complete -> skipped` and a re-bound projects `complete -> pending`, neither a telemetry reopen.
- [ ] Check coordination naming and pending semantics with `plan_tracker status`; `# Ledger - loop engine`, `## Decisions` and mapped row naming remain owned by the extension. Task 5 updates `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/reconstruction.md`, `skills/gauntlet-resume/reference/brief-contract.md`, `skills/gauntlet-handoff/SKILL.md`, `skills/brainstorming/reference/amendment-surface.md`; the brief keeps `## Process state`, `Ledger:` and `Last decision:`. Check `/skill:gauntlet-handoff` and `/skill:gauntlet-resume` continuation against that contract. Use `rg -n -i "tracker|initiali"` on the touched loop reference to find remaining carve-outs; do not alter Task 5's owned files here.
- [ ] Rerun only the manifest-supplied deterministic scoped tests; completion does not attest `node eval/run.mjs` success. Leave model runs to parent verify step 1, not a between-wave gate. Repair loop findings routed back by the parent without changing other facts; the parent reruns the affected full target. Run `git diff --check`, inspect driver below 150 lines and record before/after counts in PR body. Commit `Drive loop lifecycle with ledger refresh (ref #106)` as a behavior-changing instruction edit.

### Task 5: Restore ledger task views and preserve conformance tasks
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Tested instruction change - deterministic red/green; model evals belong to parent verify step 1.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L31, § "Acceptance criteria" L33, § "Acceptance criteria" L35, § "Acceptance criteria" L51, § "Resume, handoff, amendment, coordinated legs" L143, § "Resume, handoff, amendment, coordinated legs" L145, § "Resume, handoff, amendment, coordinated legs" L146, § "Resume, handoff, amendment, coordinated legs" L147, § "Docs and evals" L161, § "Superseded eval facts and contract assertions" L165, § "Superseded eval facts and contract assertions" L169-L174, § "Superseded eval facts and contract assertions" L178, § "Errors and edge cases" L191, § "Errors and edge cases" L193, § "Errors and edge cases" L195, § "Errors and edge cases" L197, § "Errors and edge cases" L199, § "Tests" L230

**Files:**
- Modify: `skills/gauntlet-resume/SKILL.md`
- Modify: `skills/gauntlet-resume/reference/reconstruction.md`
- Modify: `skills/gauntlet-resume/reference/brief-contract.md`
- Modify: `skills/gauntlet-handoff/SKILL.md`
- Modify: `skills/brainstorming/reference/amendment-surface.md`
- Modify: `scripts/brief-contract-lint.test.mjs`
- Modify: `eval/gauntlet-resume/intent.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-worktree/expected.md`
- Modify: `eval/gauntlet-resume/samples/loop-ledger-brief/expected.md`
- Modify: `eval/gauntlet-resume/samples/durable-cap/expected.md`
- Modify: `eval/gauntlet-resume/samples/legacy-cap-brief/expected.md`
- Modify: `eval/gauntlet-resume/samples/loop-no-ledger/expected.md`
- Modify: `eval/gauntlet-handoff/intent.md`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/samples/loop-ledger-amend/expected.md`
- Create: `eval/gauntlet-resume/samples/ledger-tracker-recovery/case.md`
- Create: `eval/gauntlet-resume/samples/ledger-tracker-recovery/expected.md`
- Create: `eval/gauntlet-handoff/samples/ledger-task-list/case.md`
- Create: `eval/gauntlet-handoff/samples/ledger-task-list/expected.md`
- Test: `scripts/brief-contract-lint.test.mjs`

**Tests:**
- `node --test scripts/brief-contract-lint.test.mjs`
- baseline: 5135218e pass
- via: `gauntlet-resume`, `gauntlet-handoff`, `plan_tracker refresh`

Decision: keep grammar centralized in `skills/gauntlet-resume/reference/brief-contract.md`, retain producer's read-only tracker behavior, and preserve human approval/entry checks and fresh conformance. The existing no-ledger static token in scripts/brief-contract-lint.test.mjs:104 can remain as `no writing-plans body or task tracker initialization; refresh ...`; it prohibits init, not refresh. A ledger list must never enter task-plan repair.

- [ ] Run existing contract fixtures, then add fixtures for ledger+task rows and both phase restore orders; confirm red. Add ledger-tracker-recovery cases for a valid home pending return, dirty done child, two commits, legacy No plan active, implement restore without init, verify/ship restore with mixed Gn states, and a re-bound row requiring authorization. Add ledger-task-list cases for implement and verify handoff, retaining both tracker outputs and ledger fields; include rejection of mixed Active task and Ledger fields.
- [ ] In the brief contract permit ledger fields with task rows and emit tracker status verbatim with `Ledger:` and `Last decision:`. Remove blanket task-row rejection and no-tracker claim, retain ledger precedence over `No plan active.`, gate-history warning, PR and coordinated grammar. `/skill:gauntlet-handoff` remains read-only and appends exactly this grammar to `## Process state`; it never refreshes itself. `/skill:gauntlet-resume` consumes it through the ledger branch.
- [ ] Keep legacy path-only admission, grant validation, plan_check and legal arming. Implement restore does `start implement` then refresh by ledger path before dirty checks/dispatch, never init a derived list. Approved-loop-without-ledger enters driver seed/start/refresh, not writing-plans. Verify/ship restores saved full mixed statuses via the existing init snapshot after verify starts, then refresh replaces only ledger entries; legacy brief without tasks goes directly to refresh. Never start implement or invent completed Gn tasks on verify restore.
- [ ] Recover home pending before general dirt check: compare HEAD from tuple, require clean exactly one attributed commit and valid bounded row/decision result, then remove pending via admitted close/repair. Zero, unrelated or multiple commits stop without redispatch or double count. Restore pre-dispatch target and tuple before refresh on rejected terminal child state; preserve other child changes and consumed iterations. Apply `skills/loop-implementation/reference/coordinated-legs.md` `## Resume` only for actual multi-member companion protocol, and the home driver's `## Validate the return` for home. Do not weaken parent/spec identity checks or legacy missing-cap stop.
- [ ] Remove no-task-tracker clauses at each owning sentence in resume SKILL, reconstruction and contract. Keep `plan_tracker init` allowed only to restore a saved verify/ship mixed list. Refresh on restore must keep all non-ledger names/statuses; output `plan_tracker status` is exact observed state, not inferred state. Keep failed row allowance, boundary in_progress and cap no-active-row distinctions.
- [ ] In the ledger aftermath now at :224 (spec citation `skills/brainstorming/reference/amendment-surface.md:172`), retain no `plan-writer` and no `plan_check`, reconcile/cut/reopen, commit `loop: amend` or the existing cut subject, then refresh. No task-plan add/update/init lifecycle. Keep attempts/iterations/cap. Replace exclusions in loop restore without touching waves. A re-bound row in verify stops with `Stopped: row <n> reopened by amendment during verify`, no automatic implement rewind and no `plan_tracker update` closure; approved row return invokes `loop-implementer` through Task 4's `## Dispatch` and `## Validate the return`, changes the ledger on disk and reruns the gate. A `done -> cut` maps `complete -> skipped`; a re-bound maps `complete -> pending`, neither a reopen counter increment.
- [ ] Replace only authorized facts: loop-ledger-worktree `restore`; durable-cap `route`; loop-ledger-brief `consumer` and `verify-ledger`; legacy-cap-brief `continue`; loop-no-ledger `route`; loop-ledger-amend `bypass`. Preserve all other facts byte-for-byte; intent entries mark each old fact `holds -> replaced`. Task 4 owns verify-lifecycle and escalated-row-attempt replacements. Record new sample must-hold facts in resume/handoff intent files.
- [ ] Retain ownership of restoration, handoff and amendment instruction changes, samples, expected facts and intent files. Run only the manifest-supplied deterministic scoped tests; completion does not attest model-eval success. Leave all three full-target runs, reports and required records to parent verify step 1 under the header contract, not implementation workers or between-wave gates. Repair findings routed back by the parent without widening approved fact replacements; the parent reruns affected full targets. Run `git diff --check`; no Markdown formatter is configured. Commit `Restore ledger-backed task snapshots (ref #106)` as a behavior-changing instruction edit.

Contract literal cross-references for these restore edits: `skills/loop-implementation/SKILL.md`, `phase_tracker complete implement`, `phase_tracker complete verify`, `phase-tracker.ts:1227-1243`, `row 0 done`, `loop: seed evidence`, `pending:`, `in_progress`, `failed`, `done`, `open`, `cut`, `reopened by amendment`, `## After the loop`, `start verify`, `start implement`, `init`, `refresh`, `verify`, `ship`, `eval/loop-implementation`, `eval/gauntlet-resume`, `eval/gauntlet-handoff`, `intent.md`, `node eval/run.mjs`, `eval/brainstorming`, `loop-ledger-worktree`, `restore`, `durable-cap`, `route`, `loop-ledger-brief`, `consumer`, `verify-ledger`, `legacy-cap-brief`, `continue`, `loop-no-ledger`, `loop-ledger-amend`, `bypass`. They identify the existing routing and facts above, not new runtime fields.

## Wave 3 - Generated integration

Depends on Waves 1-2: shared telemetry libraries and CLI source are final; all generated bin writes have one owner.

### Task 6: Regenerate shipped bins and validate integration
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Generated code integration - run before and after the build.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Tests" L225

**Files:**
- Modify: `bin/gauntlet-performance.mjs`
- Modify: `bin/gauntlet-telemetry-seal.mjs`
- Modify: `bin/gauntlet-spec-index.mjs`
- Modify: `bin/gauntlet-performance.test.mjs`
- Test: `bin/gauntlet-performance.test.mjs`
- Test: `bin/gauntlet-telemetry-seal.test.mjs`
- Test: `bin/gauntlet-spec-index.test.mjs`

**Tests:**
- `node --test bin/gauntlet-performance.test.mjs bin/gauntlet-telemetry-seal.test.mjs bin/gauntlet-spec-index.test.mjs`
- baseline: 5135218e pass
- via: `gauntlet-performance`, `gauntlet-telemetry-seal`, `gauntlet-spec-index`

Verification ownership: `npm test` is the parent-only header gate for bundle freshness through `scripts/ci.mjs`; this task runs only its scoped Tests commands and the build below.

- [ ] Run baseline tests, extend Task 3's new source behavior assertions to shipped CLI and confirm red before regeneration.
- [ ] Run `npm run build:bins`, the `scripts/build-bins.mjs` source owner. Do not hand-edit `bin/*.mjs`. Rerun scoped tests: all cases pass, new derived counter survives seal and ratios match source. Repeat build and require no further generated differences.
- [ ] Run `git diff --check`; retain only generated changes and the shipped-harness extension. Header verification at verify covers the existing `scripts/ci.mjs` bundle-freshness check; do not run the full suite in this task. Commit `Regenerate telemetry and performance bundles (ref #106)`.

## Wave 4 - Public documentation

Depends on Waves 1-3: documentation names the implemented lifecycle and released measurement shape.

### Task 7: Document ledger tracking and the post-merge evidence venue
Leg: jjuraszek/pi-gauntlet
**TDD scenario:** Documentation-only change - manual source/link check.
**Spec:** doc/specs/2026-10-31-gh-106-universal-task-tracking.md § "Acceptance criteria" L49, § "Acceptance criteria" L53-L54, § "Docs and evals" L158, § "Docs and evals" L159, § "Docs and evals" L160, § "Documentation impact" L234, § "Documentation impact" L235, § "Out of scope" L243, § "Out of scope" L247

**Files:**
- Modify: `doc/configuration.md`
- Modify: `doc/implement-engines.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Tests:**
- none: public documentation; no Markdown formatter configured

- [ ] Update configuration's `plan_tracker` action enum with `"refresh"`/path and ledger-after-start completion. Explain name-based `task_reopens`, counting `complete -> failed` and `complete -> in_progress` but not `complete -> skipped`/`complete -> pending`; describe `verification_runs`, matcher coverage and legacy absence, `disp/task` formula `plan.tasks - plan.skipped`, null/`n/a` conditions including `events_dropped`, and `coord` from `legs:` only.
- [ ] Replace engine guide's no-tracker, implement-exit gate and passing-exit reuse with `plan_tracker refresh` completion and per-leg gate at verify step 1. Preserve plan-writer/`plan_check` bypass and no implement reviewers. Describe restore refresh, saved Gn tasks and verify failure/re-bound gates. Leave #109's gate set and `loop: regress row <m>` implementation outside this change.
- [ ] Keep README's performance overview in sync with disp/task and coord, link definitions rather than duplicate protocol. Add Unreleased #106 entry without version bump; the documentation-impact annotation `CHANGELOG.md - deferred: release` does not override Design's explicit entry requirement.
- [ ] Verify the existing `doc/specs/2026-10-23-gh-68-loop-implement-engine.md:4` banner cites this spec with relative href and scope limited to no-task-tracker/exit verification; it already follows `brainstorming/reference/superseding.md`. Do not append a duplicate or rewrite historical requirements.
- [ ] Document the `venue:` recipe: post-merge approved loop run on this repo, sealed engine loop, iterations equal loop-implementer results, tasks minus skipped at implement completion, verification_runs, dispatches and printed ratio from the same zero-events_dropped record. Follow `## Issue tracker` exact-text confirmation before posting the first-run comment; keep #106 open until the observation. Do not perform that write in this task.
- [ ] Check links, ASCII punctuation and compact tables; commit `Document universal tracking and run metrics (ref #106)`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L25 | Seed projection and mapped task view | Task 1, Task 4 |
| § "Acceptance criteria" L27 | Path-only refresh, durable pending, whole-file rejection | Task 1, Task 4 |
| § "Acceptance criteria" L29 | Tracker completion and verify-only per-leg gate | Task 1, Task 4 |
| § "Acceptance criteria" L31 | Allowance, boundary and cap stop views | Task 4, Task 5 |
| § "Acceptance criteria" L33 | Gn lifecycle and verify restoration | Task 1, Task 4, Task 5 |
| § "Acceptance criteria" L35 | Ledger briefs/restores and removed carve-outs | Task 4, Task 5 |
| § "Acceptance criteria" L37 | Named reopen transitions once | Task 2 |
| § "Acceptance criteria" L39 | Waves bytes and old assertions preserved; ledger cases added | Task 1, Task 2 |
| § "Acceptance criteria" L41 | Sealed loop engine, iterations and plan totals | Task 2 |
| § "Acceptance criteria" L43 | Durable parent verification counter | Task 2 |
| § "Acceptance criteria" L45 | Comparable ratio and unavailable conditions | Task 3 |
| § "Acceptance criteria" L47 | Sealed coordination flag | Task 3 |
| § "Acceptance criteria" L49 | Configuration/engine docs and predecessor banner | Task 7 |
| § "Acceptance criteria" L51 | Model samples, retained facts and intents; execution belongs to Tests ownership below | Task 4, Task 5 |
| § "Acceptance criteria" L53-L54 | Enable gated post-merge observation | Task 2, Task 3, Task 7 |
| § "Design" L89 | Explicit refresh, not watcher or parser registry | Task 1, Task 4 |
| § "The `refresh` action" L93 | Path boundary and existing actions | Task 1 |
| § "The `refresh` action" L95-L103 | Five whole-file error cases | Task 1 |
| § "The `refresh` action" L105 | Parser inputs and legacy cap independence | Task 1 |
| § "The `refresh` action" L107-L116 | Six row status mappings | Task 1 |
| § "The `refresh` action" L118 | Numeric pending precedence and seed behavior | Task 1 |
| § "The `refresh` action" L120 | Replacement, retained tasks, ordering and replay | Task 1 |
| § "The loop driver" L126 | Seed check/commit/start/refresh order | Task 4 |
| § "The loop driver" L127 | Rule 1 requires completion before verify | Task 4 |
| § "The loop driver" L128 | Pending every dispatch, saved copy and persona removal | Task 4 |
| § "The loop driver" L129 | Admission before refresh; rejected target restore | Task 4 |
| § "The loop driver" L130 | Only closing return/repair clears pending | Task 4 |
| § "The loop driver" L131 | Refresh each admitted loop commit | Task 4 |
| § "The loop driver" L132 | Delete lifecycle duplication and keep reviewer boundary | Task 4 |
| § "The loop driver" L133 | Driver under 150 lines; PR reports both counts | Task 4 |
| § "Verification at verify step 1" L137 | Per-leg gate and repair identity move to verify | Task 4 |
| § "Verification at verify step 1" L139 | Bounded repair and verify-only amend/stop menu | Task 4 |
| § "Resume, handoff, amendment, coordinated legs" L143 | Task lines coexist with ledger pointers | Task 5 |
| § "Resume, handoff, amendment, coordinated legs" L144 | Admit home member without weakening mapping | Task 1 |
| § "Resume, handoff, amendment, coordinated legs" L145 | Recovery then refresh before dirt; verify saved list | Task 5 |
| § "Resume, handoff, amendment, coordinated legs" L146 | Keep ledger amendment bypass and refresh | Task 5 |
| § "Resume, handoff, amendment, coordinated legs" L147 | Verify re-bound gate and on-disk closure | Task 4, Task 5 |
| § "Resume, handoff, amendment, coordinated legs" L148 | Home pending and companion return protocol | Task 4 |
| § "Telemetry" L152 | Name-based reopen on every successful snapshot | Task 2 |
| § "Telemetry" L153 | Matcher window, counter persistence and schema | Task 2 |
| § "Telemetry" L154 | Ratio, coordination and generated release surface | Task 3 |
| § "Docs and evals" L158 | Configuration enum, aftermath and metrics | Task 7 |
| § "Docs and evals" L159 | Engine guide completion, gate and restoration | Task 7 |
| § "Docs and evals" L160 | Predecessor scoped supersession | Task 7 |
| § "Docs and evals" L161 | New samples and intents; parent runs full targets under Tests ownership below | Task 4, Task 5 |
| § "Superseded eval facts and contract assertions" L165 | Preserve facts except named replacements | Task 4, Task 5 |
| § "Superseded eval facts and contract assertions" L169-L174 | Six resume replacements | Task 5 |
| § "Superseded eval facts and contract assertions" L175-L176 | Two loop replacements | Task 4 |
| § "Superseded eval facts and contract assertions" L177 | Replace only the closed-row half of `cap-and-exit-verification` `contract`: gate once at verify step 1, quote failure output, never reopen/rerun, keep verify active and implement complete, offer amend or stop only; preserve cap-stop half and record `holds -> replaced` in `intent.md` | Task 4 |
| § "Superseded eval facts and contract assertions" L178 | Brainstorm bypass replacement | Task 5 |
| § "Superseded eval facts and contract assertions" L179 | Replace only the tree-untouched clause of `gate-line-first` `preserved`: implement stays active; only target cells and `pending:` tuple are restored in the working ledger, nothing discarded or reset; preserve the fact's other clauses and record the replacement in intent | Task 4 |
| § "Superseded eval facts and contract assertions" L181 | Only named old loop assertions change | Task 4 |
| § "Errors and edge cases" L188 | Atomic rejection | Task 1 |
| § "Errors and edge cases" L189 | All-cut completion after start | Task 1, Task 4 |
| § "Errors and edge cases" L190 | Retry tuple overrides failed | Task 1, Task 4 |
| § "Errors and edge cases" L191 | Rejected done result retains tuple and child changes | Task 4, Task 5 |
| § "Errors and edge cases" L192 | Only bump/removal header changes | Task 4 |
| § "Errors and edge cases" L193 | Home recovery ordering and admission | Task 1, Task 5 |
| § "Errors and edge cases" L194 | Out-of-order closure | Task 1 |
| § "Errors and edge cases" L195 | Gn preservation and verify guard | Task 1, Task 5 |
| § "Errors and edge cases" L196 | Three stop states | Task 4 |
| § "Errors and edge cases" L197 | Cut/re-bound not reopens; disk closure at verify | Task 2, Task 4, Task 5 |
| § "Errors and edge cases" L198 | Verify failure preserves phase and menu | Task 4 |
| § "Errors and edge cases" L199 | Implement and verify restoration differ | Task 5 |
| § "Errors and edge cases" L200 | Legacy no-cap accepted | Task 1 |
| § "Errors and edge cases" L201 | Single-member home tuple and mapped names | Task 1, Task 4 |
| § "Errors and edge cases" L202 | Reopen once per named transition | Task 2 |
| § "Errors and edge cases" L203 | Counter persistence, misses, children and unbound runs | Task 2 |
| § "Errors and edge cases" L204 | Nameless snapshots never match | Task 2 |
| § "Errors and edge cases" L205 | Dropped events make ratio unavailable | Task 3 |
| § "Tests" L225 | Fresh generated bundles | Task 6 |
| § "Tests" L230 | Parent runs all full model targets at integrated verify step 1 and commits reports/records with actual exits; require improved or unchanged results for touched facts, not universal holds; record nonblocking provider refusals and untouched fails-to-fails without masking exits; refresh touched inconclusive samples once then integrate through full target; remaining touched regressions/inconclusive/errors except recorded provider refusals, or interruption, block; route repairs and rerun before review/finish; workers keep scoped tests only | Verification |
| § "Documentation impact" L234 | Public docs and changelog | Task 7 |
| § "Documentation impact" L235 | Existing scoped banner remains accurate | Task 7 |
| § "Out of scope" L241 | Preserve waves source and omit waves parser | Task 1 |
| § "Out of scope" L242 | No automatic tool-end refresh | waived: out of scope per spec |
| § "Out of scope" L243 | Gate-set design stays with #109 | Task 4, Task 7 |
| § "Out of scope" L244 | Budget unification and multi-row closure | waived: out of scope per spec |
| § "Out of scope" L245 | No timing, ratio target, historical denominator or live identification | waived: out of scope per spec |
| § "Out of scope" L246 | Targeting, validation and stops remain in driver | Task 4 |
| § "Out of scope" L247 | Exact-text approval for first-run comment | Task 7 |
