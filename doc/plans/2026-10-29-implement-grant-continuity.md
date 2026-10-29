# Implement grant continuity implementation plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Continue grant-authorized implementation decisions and spend one bounded escalated execution round before non-hard-stop failures reach the human.

**Architecture:** Keep consent in `**Amend-grant:**` and resolve `escalationLoop.implModel` through the existing settings tool. Put waves execution-stop policy in its existing fix-loop reference, and update the loop driver's existing ledger decisions and parent commits. Keep planning and amendment routing consistent without a new runtime setting, persona, or state file.

**Tech Stack:** Markdown workflow instructions, Node.js `node:test` contract tests, existing text-replay eval harness.

**Spec:** `doc/specs/2026-10-29-implement-grant-continuity.md`

**Verification:** `npm test; node eval/run.mjs subagent-driven-development; node eval/run.mjs loop-implementation; node eval/run.mjs writing-plans` - includes instruction-size checking for skills/subagent-driven-development/SKILL.md.

Baseline jjuraszek/pi-gauntlet: c95dcb57

---

Baseline provenance (jjuraszek/pi-gauntlet): initial HEAD b3d55006; initial porcelain inventory was only `?? doc/plans/2026-10-29-implement-grant-continuity.md`. Admitted exactly the dispatched spec and plan paths; only the plan was dirty. Executed all three task commands unchanged: Task 1 executed 52 tests, Task 2 executed 15 tests, Task 3 executed 5 tests, all exit 0. After each command HEAD remained b3d55006 and porcelain remained that one plan path. No generated repository artifacts or source contamination. Reran every command after plan repair with the same results and unchanged per-command provenance; no SHA restamping or tree-equivalence claim was needed.

Amendment baseline provenance (jjuraszek/pi-gauntlet): BASE c95dcb57; initial per-file inventory was only ` M doc/specs/2026-10-29-implement-grant-continuity.md`. Admitted exactly `doc/specs/2026-10-29-implement-grant-continuity.md` and `doc/plans/2026-10-29-implement-grant-continuity.md`, the dispatched and supplied In-flight paths. The endpoint-tree proof `git diff --quiet b3d55006 HEAD -- . ':!doc/specs/' ':!doc/plans/'` exited 1, so retained no bullets and reran all three unchanged task commands. Task 1 executed 53 tests, Task 2 executed 17 tests, Task 3 executed 6 tests, all exit 0 with no failures. After each command HEAD remained c95dcb57 and porcelain remained the one spec path. No generated repository artifacts or source contamination. The replacement baseline bullets below come from these executions, not a tree-equivalence restamp.

## Files

**Shared amendment and planning policy - modify:**
- `skills/brainstorming/SKILL.md`
- `skills/brainstorming/reference/amendment-surface.md`
- `skills/writing-plans/SKILL.md`
- `scripts/brainstorming-contract.test.mjs`
- `eval/writing-plans/intent.md`
- `eval/writing-plans/report.md` (generated at verification)

**Writing-plans evals - create:**
- `eval/writing-plans/samples/baseline-menu-under-grant/case.md`
- `eval/writing-plans/samples/baseline-menu-under-grant/expected.md`
- `eval/writing-plans/samples/baseline-menu-aftermath/case.md`
- `eval/writing-plans/samples/baseline-menu-aftermath/expected.md`

**Waves policy - modify:**
- `skills/subagent-driven-development/SKILL.md`
- `skills/subagent-driven-development/reference/fix-loop.md`
- `skills/subagent-driven-development/stop-note.md`
- `scripts/wave-review.test.mjs`
- `eval/subagent-driven-development/target.json`
- `eval/subagent-driven-development/intent.md`
- `eval/subagent-driven-development/report.md` (generated at verification)

**Waves evals - create:**
- `eval/subagent-driven-development/samples/blocked-decision-auto-taken/case.md`
- `eval/subagent-driven-development/samples/blocked-decision-auto-taken/expected.md`
- `eval/subagent-driven-development/samples/third-attempt-escalated/case.md`
- `eval/subagent-driven-development/samples/third-attempt-escalated/expected.md`
- `eval/subagent-driven-development/samples/ac-row-correction-amend/case.md`
- `eval/subagent-driven-development/samples/ac-row-correction-amend/expected.md`

**Loop policy - modify:**
- `skills/loop-implementation/SKILL.md`
- `scripts/loop-engine-contract.test.mjs`
- `eval/loop-implementation/intent.md`
- `eval/loop-implementation/report.md` (generated at verification)

**Loop evals - create:**
- `eval/loop-implementation/samples/escalated-row-attempt/case.md`
- `eval/loop-implementation/samples/escalated-row-attempt/expected.md`
- `eval/loop-implementation/samples/exit-verification-escalates/case.md`
- `eval/loop-implementation/samples/exit-verification-escalates/expected.md`

**Cross-cutting docs - modify:**
- `README.md`
- `doc/configuration.md`
- `doc/implement-engines.md`

**Delete:** none. Keep `CHANGELOG.md` deferred to release as the spec directs. No runtime or bin source changes, so no bundle regeneration is needed.

## Recon and execution conventions

- One admitted leg: `jjuraszek/pi-gauntlet`, branch `grant-continuity`, owning checkout supplied with this plan. All commands and paths resolve there. No companion loop or new membership. Keep the recorded create/destroy/home contracts in the spec authoritative.
- The touched-directory walk found no nested AGENTS.md or CLAUDE.md. Task Rules below supplement the spec's Rules with root-linked documents and the routed authoring skill. Apply forge-skill Authoring rules: imperative voice, compact tables, minimal owning-clause edits, no provider/model literals. SDD's expanded procedure belongs in its existing reference, not its nearly full SKILL.md.
- `package.json` supplies the verification entrypoint; `scripts/ci.mjs:530-568` bundles instruction-size, model-literal and eval structural lint, alongside the contract tests. No formatter or standalone repo-wide format command is configured. Scoped syntax checking uses `node --check` on each owned test script. Use `lintTarget` from `eval/lib/lint.mjs` and existing lint functions for scoped assertions in those tests. Review changed Markdown manually for ASCII punctuation and compact tables; do not mass-format untouched text.
- Settings truth: `extensions/lib/gauntlet-settings.ts:106-119` resolves the configured escalation model or the main-loop fallback, and `extensions/lib/gauntlet-settings.test.ts:91-114` tests it. Reuse it without changing runtime APIs.
- Eval `case.md` holds synthetic input and `expected.md` holds `## Must-hold` facts (`###` ids). Use `bundle+` for additional instruction owners and `bundle-` only for irrelevant slices, per `eval/README.md`. `intent.md` requires a real pre-edit commit SHA on its `for:` line, `## Change` and `## Expected to move` with sample/fact transitions (`eval/lib/intent.mjs:5-30`). The header runs all three complete targets once at verification and generates existing reports; inspect and commit those outputs, do not hand-author reports or weaken must-hold facts to hide regressions.

## Wave 1 - Shared amendment and baseline policy

### Task 1: Honor evidenced row corrections and baseline recommendations
Leg: jjuraszek/pi-gauntlet
Rules: README.md
Rules: doc/gate-contract.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-29-implement-grant-continuity.md § "Acceptance criteria" L39, § "Acceptance criteria" L41, § "Design" L71, § "Design" L74, § "Design" L76, § "Design" L78, § "Design" L80, § "Design" L90, § "Design" L97, § "Design" L98, § "Design" L101, § "Design" L102, § "Errors and edge cases" L112, § "Errors and edge cases" L114, § "Tests" L122, § "Tests" L130

**Files:**
- Modify: `skills/brainstorming/SKILL.md:194-203`
- Modify: `skills/brainstorming/reference/amendment-surface.md:3-56`
- Modify: `skills/brainstorming/reference/amendment-surface.md:160-205`
- Modify: `skills/writing-plans/SKILL.md:69-88`
- Modify: `scripts/brainstorming-contract.test.mjs:129-135`
- Create: `eval/writing-plans/samples/baseline-menu-under-grant/case.md`
- Create: `eval/writing-plans/samples/baseline-menu-under-grant/expected.md`
- Create: `eval/writing-plans/samples/baseline-menu-aftermath/case.md`
- Create: `eval/writing-plans/samples/baseline-menu-aftermath/expected.md`
- Modify: `eval/writing-plans/intent.md`
- Modify: `eval/writing-plans/report.md`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: c95dcb57 pass
- via: `skills/writing-plans/SKILL.md` step 6 and `skills/brainstorming/reference/amendment-surface.md` section 5

Decision: Amend permission from `**Amend-grant:**` remains the non-budget remainder after the existing structural predicate and Value decoding in `amendment-surface.md`; `2 more fix rounds`, `none`, or absent gives no auto-take permission. Do not broaden the decoder or change approval at spec finalization.

Cross-owner boundaries: the spec's `brainstorming/SKILL.md:196` (also `skills/brainstorming/SKILL.md:196`), `amendment-surface.md:3` and ledger `:160`/`amendment-surface.md:160` change here; Task 2 changes `subagent-driven-development/SKILL.md` (`skills/subagent-driven-development/SKILL.md`). Preserve `amendment-surface.md:171` evidence handling while Tasks 2-3 add per-task `file:line` and per-row comparisons. The `Recommendation:` carrier never supplies `cap +N`, and `escalationLoop.implModel` being `undefined` remains a stop in the engine owners.

The coordinated additions are Task 2's `fix-loop.md` `## Implementer-failure stops` and `stop-note.md`, Task 3's `loop: repair verification`, and this task's `intent.md` plus amendment clauses. The spec's removal citations `loop-implementation/SKILL.md:92`, `:181`, `:175` belong to Task 3; `writing-plans/SKILL.md:79`/`:79` and aftermath `:169-171` belong here. Preserve all boundaries while replacing the unconditional waits.

- [ ] **Step 1: Run the existing contract test.** Run the Tests command and confirm all current cases pass.
- [ ] **Step 2: Write failing policy assertions.** Replace the blanket drafted-AC-redraw assertion at scripts/brainstorming-contract.test.mjs:129-135 with assertions distinguishing an implementer's quoted test/assertion/code-line correction from ticket-row edits, row additions/removals, reviewer-only/taste objections, problem changes and component-boundary changes. Assert the correction appears in both brainstorm entry and ledger aftermath, preserving the grant audit. Add baseline-menu assertions for concrete `narrow <filter>`, `amend`, `fix-first`, and `Recommendation: none`, with amend permission checked before waiting and no auto-clean of dirt.
- [ ] **Step 3: Confirm red.** Run the Tests command; expect the new carve-out and recommendation assertions to fail against the current unconditional redraw/wait clauses.
- [ ] **Step 4: Correct the amendment owners.** In `skills/brainstorming/SKILL.md` and `amendment-surface.md` classify only drafted AC text corrections backed by evidence in a `BLOCKED`/`NEEDS_CONTEXT` implementer return as amend items. Keep ticket rows, row add/remove, problem statements and component boundaries redraws. Make the ledger aftermath accept this text correction without treating it as an automatic disposition change: preserve row identity, attempts, iterations and cap; retain existing reopen/cut rules. Keep `amend:` audit records, including `granted`, so finishing's digest exposes the correction.
- [ ] **Step 5: Correct baseline recommendation routing.** In writing-plans step 6 render a recommendation with a concrete filter for narrow. Under amend permission take it immediately: print `took recommendation: narrow`, send `Task N Tests: narrow to hook-config` when the recommendation is `narrow hook-config`; route `amend` through section 5 and `fix-first` through `/skill:shape-ticket` to that skill's own write gate. `Recommendation: none` and a narrow option without a concrete filter wait. Without permission retain the existing three-route menu. Preserve baseline execution/provenance and parent-only writing boundaries.
- [ ] **Step 6: Keep amendment aftermath consistent.** Replace its unconditional pause when rendering unchanged-command or writer-only step-6 failures with the same grant-aware recommendation path. Keep the two-item limit, repeated already-applied evidence route, unrelated-failure partition and protected dirty-path handling unchanged. No recommendation authorizes restoration or a redraw.
- [ ] **Step 7: Add the split baseline evals.** Keep `eval/writing-plans/samples/parent-offers-fix-first-narrow-amend/case.md` and `expected.md` unchanged as the no-grant control. Create `eval/writing-plans/samples/baseline-menu-under-grant` for `narrow hook-config`, `amend`, `fix-first`, `none`, and narrow without a concrete filter; create `eval/writing-plans/samples/baseline-menu-aftermath` for an unchanged-command failure during an amendment batch, with protected dirty-path, repeated-evidence and third-item contrasts. Both samples already exist at amendment HEAD; retain their split instead of extending the control. Keep each replay below the target's 1000-word cap. In each new `case.md`, retain `bundle-: skills/writing-plans/reference/plan-contract.md` and `bundle+: skills/brainstorming/reference/amendment-surface.md`. Put must-hold facts in the adjacent `expected.md`, using `eval/README.md`'s stable fact-line format: under-grant ids `grant-narrow`, `grant-amend`, `grant-fix-first`, `grant-wait` cover exact filter, acknowledgment, writer re-dispatch, ticket write-gate wait and none/missing-filter wait; aftermath id `aftermath` covers the continuation with unchanged dirty-path protections, two-item limit and attempt/iteration/cap budgets. Update writing-plans intent to name these two sample paths and their fact ids rather than adding facts to the unchanged control; bind its `for:` to the current candidate assembly per `eval/README.md`. Keep the `lintTarget` assertions for this target in the owned contract test.
- [ ] **Step 8: Confirm green and check style.** Run the Tests command, then `node --check scripts/brainstorming-contract.test.mjs`. Expect passing tests and exit 0. Read changed instruction clauses for forge-skill compliance; preserve existing frontmatter and Project overrides blocks.
- [ ] **Step 9: Commit.** Stage only this task's changed policy, test, sample and intent files, then `git commit -m "Honor grant-authorized baseline and AC corrections" -m "Behavior-changing instruction edit; eval intent records the expected movement."`. Leave generated reports to the header verification run.

## Wave 2 - Implementer failure paths

Depends on Wave 1: both engines consume the narrowed amendment classification and grant-aware aftermath. Tasks 2 and 3 own disjoint files. Their deterministic tests use distinct scratch directories and no shared ports, databases or fixtures; they may run concurrently. Model eval runs remain serialized at verification through the header.

### Task 2: Extend waves execution stops without changing review funding
Leg: jjuraszek/pi-gauntlet
Rules: README.md
Rules: doc/gate-contract.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-29-implement-grant-continuity.md § "Acceptance criteria" L35, § "Acceptance criteria" L37, § "Acceptance criteria" L39, § "Acceptance criteria" L43, § "Acceptance criteria" L45, § "Design" L71, § "Design" L73, § "Design" L74, § "Design" L75, § "Design" L76, § "Design" L78, § "Design" L80, § "Design" L82, § "Design" L84, § "Design" L88, § "Design" L89, § "Design" L90, § "Design" L91, § "Design" L92, § "Design" L99, § "Design" L102, § "Errors and edge cases" L108, § "Errors and edge cases" L111, § "Errors and edge cases" L112, § "Errors and edge cases" L113, § "Errors and edge cases" L114, § "Errors and edge cases" L117, § "Errors and edge cases" L118, § "Tests" L122, § "Tests" L127, § "Tests" L128, § "Tests" L129, § "Out of scope" L140, § "Out of scope" L141, § "Out of scope" L142

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md:115-124`
- Modify: `skills/subagent-driven-development/SKILL.md:375-395`
- Modify: `skills/subagent-driven-development/reference/fix-loop.md`
- Modify: `skills/subagent-driven-development/stop-note.md`
- Modify: `scripts/wave-review.test.mjs:315-354`
- Modify: `eval/subagent-driven-development/target.json:4`
- Modify: `eval/subagent-driven-development/intent.md`
- Modify: `eval/subagent-driven-development/report.md`
- Create: `eval/subagent-driven-development/samples/blocked-decision-auto-taken/case.md`
- Create: `eval/subagent-driven-development/samples/blocked-decision-auto-taken/expected.md`
- Create: `eval/subagent-driven-development/samples/third-attempt-escalated/case.md`
- Create: `eval/subagent-driven-development/samples/third-attempt-escalated/expected.md`
- Create: `eval/subagent-driven-development/samples/ac-row-correction-amend/case.md`
- Create: `eval/subagent-driven-development/samples/ac-row-correction-amend/expected.md`
- Test: `scripts/wave-review.test.mjs`

**Tests:**
- `node --test scripts/wave-review.test.mjs`
- baseline: c95dcb57 pass
- via: `skills/subagent-driven-development/SKILL.md` Implementer Status and When a Subagent Fails; `skills/subagent-driven-development/reference/fix-loop.md`

Decision: An execution-failure escalation is distinct from the review loop's existing escalation/funded ledger. Preserve the latter's `STAGNANT`, `REJECT`, `fund N`, `grant_fix_rounds` and budget stop behavior, and use the existing re-dispatch isolation for the failing task. Source: fix-loop.md:3-27 and SDD SKILL.md Fix-Loop Rounds, Chain stopped or failed. `closureReview.maxFixRounds` and `piGauntlet.escalationLoop.autonomy` receive no implementation changes.

Cross-owner boundaries: Task 1 owns `brainstorming/SKILL.md:196` (`skills/brainstorming/SKILL.md:196`), `amendment-surface.md:3`, ledger `:160`/`amendment-surface.md:160`, and aftermath `:169-171`; keep this task's classification consistent and retain the `amend:` audit. Preserve `amendment-surface.md:171` rather than replacing its batch-repeat rule. Task 3 owns loop `## Human stop` and recovery through `loop: repair verification`; neither that commit nor this task's transcript identity re-arms the other site. Budget-only `2 more fix rounds` authorizes no implicit escalation, and `cap +N` remains human-owned. Missing `implModel` is named in `Problem:`.

- [ ] **Step 1: Run the existing contract test.** Run the Tests command; expect green.
- [ ] **Step 2: Add red assertions.** Assert a referenced `## Implementer-failure stops` section; hard stops before grant dispatch; authorized named decisions before escalation; ordinary attempt consumption for taken `BLOCKED` decisions; one third attempt after two failures; exact model/context/async knobs; transcript-only recovery and fail-closed missing history. Replace the old whole-stop-note SHA assertion at scripts/wave-review.test.mjs:353 with focused template and funding-placement assertions plus the final recommendation-line check, rather than retaining a hash that forbids this approved change. Keep the existing review-funding tests.
- [ ] **Step 3: Confirm red.** Run the Tests command; expect missing-section and missing-recommendation failures.
- [ ] **Step 4: Implement the owning reference.** Add `## Implementer-failure stops` in `reference/fix-loop.md`. Decode `**Amend-grant:**` through `amendment-surface.md` Value decoding at each stop. Order hard stops, takeable decision, execution escalation, resulting decision. A named change inside remaining attempts re-dispatches with `took recommendation: use bounded parser for task 3`; a spec change enters the existing amendment route. `Recommendation: none - no named repair`, extra budget/consent, separate changes and redraws stop. Normalize whitespace in the quoted `file:line` finding or failing command plus assertion; compare only auto-resolved evidence for that task and print `Recommendation: none - evidence repeats task 3` on repetition. Do not add a new evidence file. When a decision is amend-shaped, use Task 1's `amend` route; `fix-first` goes through `/skill:shape-ticket`, not an automatic unrelated repair.
- [ ] **Step 5: Implement escalation identity and dispatch.** Before attempt 3 call `gauntlet_setting({ key: "escalationLoop" })` for `escalationLoop.implModel`, stop on tool failure or `implModel` being `undefined`, and print `escalated round for task 3 after 2 failed attempts`. Re-dispatch one implementer with `model: <implModel>`, `context: "fresh"`, `async: false`, same payload and isolation knobs, prior patch, spec anchors, status protocol, `SCOPED_TEST_COMMANDS` and complete prior report. Count dispatch errors and non-`DONE` outcomes spent; run decision handling on the resulting stop, not a fourth unnamed repair. Recover site `task 3 after 2 failed attempts` only from its exact transcript line; unavailable history is spent, and a grant or retry never re-arms it. Do not alter the review-loop convergence exception or funding recovery.
- [ ] **Step 6: Wire the small call sites and stop template.** Replace the NEEDS_CONTEXT/BLOCKED decision clauses and `After 2 failed attempts: STOP` with `fix-loop.md` reference calls under amend permission, retaining existing no-permission behavior and fact lookup order. Apply Task 1's implementer-evidenced drafted-row exception in Implementer Status, with the remaining redraw classes explicit. Tighten touched clauses so SDD `SKILL.md` remains below 50,000 bytes and at most 500 lines; the procedure stays in the existing reference. Add `Recommendation: <option> - <why>` at the end of the `stop-note.md` template and concrete example, using `Recommendation: none - <why>` when no concrete option is recommended. Preserve the first-line `gauntlet: question` marker and funded budget placement.
- [ ] **Step 7: Write the decision eval.** `eval/subagent-driven-development/samples/blocked-decision-auto-taken` checks named repair taken with `took recommendation:`, `Recommendation: none` stopped, repeat evidence on a second turn, budget-only/absent permission and hard-stop precedence. Add the amendment reference when an amend is exercised. Follow `eval/README.md` with `case.md` and `expected.md`, using `bundle-`/`bundle+` only to select needed owners.
- [ ] **Step 8: Write the escalation eval.** `eval/subagent-driven-development/samples/third-attempt-escalated` checks the announcement, one resolved-model dispatch, post-failure amend taken versus none/budget wait, transcript recovery, missing recovery and missing model. Include a successful escalated implementation that still goes through the unchanged review gate.
- [ ] **Step 9: Write the row-correction eval.** `eval/subagent-driven-development/samples/ac-row-correction-amend` enters through brainstorming's amendment route and checks quoted implementer evidence, granted `amend:` audit body, and redraw controls for ticket rows, reviewer-only objections, row add/remove, problem and component changes. Add `bundle+: skills/brainstorming/SKILL.md` and `bundle+: skills/brainstorming/reference/amendment-surface.md` to the AC sample. Keep existing `redraw-under-grant` expectations unchanged.
- [ ] **Step 10: Assemble and lint.** Set the first target slice's `sliceTo` to `## After All Tasks Complete`, so `## When a Subagent Fails` is included. Update `intent.md` with actual pre-edit SHA and the new sample/fact movements. Add target structural lint and owned skill-size assertions to the contract test using existing `lintTarget` and `lintSkillSizes` helpers; reject any SDD size overflow rather than extracting an unrelated section. Run the Tests command and `node --check scripts/wave-review.test.mjs`; expect green and exit 0. Review instruction formatting and literal model ban.
- [ ] **Step 11: Commit.** Stage this task's changed files except generated reports and run `git commit -m "Continue authorized waves execution failures" -m "Behavior-changing instruction edit; eval intent records the expected movement."`.

### Task 3: Add bounded loop row and exit-verification escalation
Leg: jjuraszek/pi-gauntlet
Rules: README.md
Rules: doc/gate-contract.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: skills/forge-skill/SKILL.md

**TDD scenario:** Modifying tested code - run existing tests first.

**Spec:** doc/specs/2026-10-29-implement-grant-continuity.md § "Acceptance criteria" L31, § "Acceptance criteria" L33, § "Acceptance criteria" L43, § "Acceptance criteria" L45, § "Design" L71, § "Design" L73, § "Design" L74, § "Design" L75, § "Design" L76, § "Design" L78, § "Design" L80, § "Design" L82, § "Design" L93, § "Design" L94, § "Design" L95, § "Design" L96, § "Design" L101, § "Design" L102, § "Errors and edge cases" L108, § "Errors and edge cases" L109, § "Errors and edge cases" L110, § "Errors and edge cases" L111, § "Errors and edge cases" L112, § "Errors and edge cases" L113, § "Errors and edge cases" L115, § "Errors and edge cases" L116, § "Errors and edge cases" L117, § "Errors and edge cases" L118, § "Tests" L122, § "Tests" L124, § "Tests" L125, § "Tests" L126, § "Out of scope" L140, § "Out of scope" L141, § "Out of scope" L142

**Files:**
- Modify: `skills/loop-implementation/SKILL.md:63-104`
- Modify: `skills/loop-implementation/SKILL.md:236-276`
- Modify: `scripts/loop-engine-contract.test.mjs`
- Modify: `eval/loop-implementation/intent.md`
- Modify: `eval/loop-implementation/report.md`
- Create: `eval/loop-implementation/samples/escalated-row-attempt/case.md`
- Create: `eval/loop-implementation/samples/escalated-row-attempt/expected.md`
- Create: `eval/loop-implementation/samples/exit-verification-escalates/case.md`
- Create: `eval/loop-implementation/samples/exit-verification-escalates/expected.md`
- Test: `scripts/loop-engine-contract.test.mjs`

**Tests:**
- `node --test scripts/loop-engine-contract.test.mjs`
- baseline: c95dcb57 pass
- via: `skills/loop-implementation/SKILL.md` Before each dispatch, Dispatch, Exit verification and Human stop

Decision: The row escalation uses `loop-implementer` with the existing target/ledger validation contract; the exit repair uses `implementer` because all ledger rows stay closed. Source: loop driver Dispatch/Validate the return and spec Design's exit repair row. No persona changes are needed.

Decision: Exit repair's clean-tree/one-child-commit boundary applies in the failing leg. For home-only repair, the worker's sole commit includes the already-bumped home ledger while leaving all rows unchanged; the parent then records `loop: repair verification` with an empty marker commit if nothing remains to stage. For a companion repair the worker commits only that leg, and the parent commits the home iterations bump with `loop: repair verification`, preserving mappings and other rows. Source: existing home Dispatch bump, coordinated home-ledger ownership, and the spec's distinct parent-marker requirement. This marker identifies one exit-repair site for the flow, not a new allowance per failing leg. An interrupted dispatch with unrecoverable identity is spent; never add a second carrier or fabricate a successful boundary.

Cross-owner boundaries: preserve `STAGNANT`, `REJECT`, `closureReview.maxFixRounds`, `grant_fix_rounds`, and the absence of `piGauntlet.escalationLoop.autonomy`; `fund N` does not create an execution escalation. Task 2 owns `fix-loop.md` `## Implementer-failure stops` and `stop-note.md`; Task 1 owns `skills/brainstorming/SKILL.md:196`, `amendment-surface.md:160`, aftermath `:169-171` and `writing-plans/SKILL.md:79`. Keep their `amend:`/`Recommendation:` contract aligned. Preserve the aftermath's `amendment-surface.md:171` rule; waves uses `file:line` evidence, this task uses row evidence. The spec's historical site labels `:70`, `:92`/`loop-implementation/SKILL.md:92`, `:175`, `:181` resolve to the current Before each dispatch, Dispatch, Exit verification and `## Human stop` sections, respectively. Shared decision policy also binds `BLOCKED`/`NEEDS_CONTEXT` repair decisions: a `fix-first` recommendation enters `/skill:shape-ticket` through its own gate, never an automatic separate repair.

- [ ] **Step 1: Run the existing loop contract test.** Run the Tests command; expect green including companion return fixtures.
- [ ] **Step 2: Add failing contract assertions.** Replace the blanket `model:` prohibition in scripts/loop-engine-contract.test.mjs:32 with assertions that only amend-permission escalation sets the override and ordinary/funded dispatch omits it. Narrow the unconditional exit no-rerun assertion to no-permission/spent cases. Add assertions for `attempts >= allowance`, parent subjects, spent funding clamp, escalation identity, cap/stagnation priority, row preservation, final recommendation and exactly one exit rerun. Keep cap grant, retry-window, companion admission and persona assertions intact.
- [ ] **Step 3: Confirm red.** Run the Tests command; expect failure on the missing escalation clauses and accounting formula.
- [ ] **Step 4: Implement row escalation.** In rule 2 test `attempts >= allowance`. Before granting a round, decode `**Amend-grant:**` with `amendment-surface.md`, require rules 3-4 not to stop (`iterations >= cap` or stagnant children) and no durable `row 2 escalated` decision. Resolve `escalationLoop.implModel` with `gauntlet_setting({ key: "escalationLoop" })`, stopping when `implModel` is `undefined`. Append `row 2 escalated | implModel round | allowed attempts 6` for attempts 5, commit `loop: escalate row 2`, and print `escalated round for row 2`. Dispatch that row once with `model: <implModel>` using the ordinary iteration bump and row validation. Keep its `allowed attempts` usable for the authorized dispatch without repeatedly matching the old ordinary limit. Exclude the parent escalation commit from child stagnation counting and start no new window; retry/grant changes never erase the identity.
- [ ] **Step 5: Correct funding and dispatch policy.** Use `max(0, min(attempts, 3 + N) - 3)` for spent funding. With `fund 2`, attempts 4 and 5 are paid, attempt 6 is the escalated round, and paid spending stays 2. Retain `Funding buys neither cap bypass nor empty-commit bypass nor an escalated model`; state the amend-permission escalated round is the only `implModel` dispatch. Omit the override otherwise. Preserve prospective grants, iterations, cap and attempt counts; budget-only `2 more fix rounds` buys no escalation.
- [ ] **Step 6: Implement exit repair.** After the failing leg's exit command fails, enforce hard boundaries and `iterations < cap`, amend permission, available `implModel`, and an unspent `loop: repair verification` site. Bump iterations exactly once, record `HEAD_BEFORE`, and dispatch one `model: <implModel>`, `context: "fresh"`, `async: false` `implementer` in that leg carrying failing output, absolute home spec path and that leg's exact `verification:` command. Require clean tree and exactly one child commit; stop with the existing dirty/zero/multiple-commit diagnostics otherwise, preserving consumed iteration. Persist the parent marker as described in the Decision, rerun that command exactly once, and leave every ledger row unchanged. On second failure use `Stopped: verification failed with every row closed` plus `escalated round spent`, then apply the stop recommendation. No repair at cap, no other leg's verification substituted, and no verify-phase budget extension. Dispatch errors and non-`DONE` returns consume the escalation before the resulting stop is handled.
- [ ] **Step 7: Update human stops and resume accounting.** End every stop with `Recommendation: <option> - <why>` or `Recommendation: none - <why>`. Show missing model in `Problem:` and spent escalation when applicable. Under amend permission take a named `amend`, print `took recommendation: amend for row 2`, follow section 5 and return through the ordered table after `loop: amend` or `loop: cut row 2`. Compare the row's whitespace-normalized evidence cell against already auto-resolved evidence; same evidence yields `Recommendation: none - evidence repeats row 2`. `Recommendation: none` also covers unnamed repair. Retry, `cap +N`, more attempts and redraw remain human choices. Recover row escalation from ledger decisions and exit repair from the parent commit; missing recovery is spent. Preserve the first-line marker and `budget:`/`budget: <spent> of <N> spent` behavior.
- [ ] **Step 8: Add the row escalation eval.** `eval/loop-implementation/samples/escalated-row-attempt` covers attempts 5/fund 2 -> one attempt 6, attempts already above allowance, cap and stagnant-child stops, ledger resume, prospective grant, explicit retry not re-arming, missing model, repeated evidence and a taken amend that cuts or leaves the row unresolved. Add `bundle+: skills/brainstorming/reference/amendment-surface.md` where section 5 is exercised. Follow `eval/README.md` for `case.md`, `expected.md`, and `bundle-`/`bundle+` selection.
- [ ] **Step 9: Add the exit repair eval.** `eval/loop-implementation/samples/exit-verification-escalates` covers one repair/marker/rerun, second failure with recommendation, cap refusal, dirty/extra-commit refusal, coordinated failing-leg isolation and parent-marker resume. Keep `eval/loop-implementation/samples/funding` unchanged as the budget-only/no-grant control. Update `intent.md` with actual pre-edit SHA and the new expected fact transitions; add `lintTarget` assertions for this target.
- [ ] **Step 10: Confirm green and check style.** Run the Tests command and `node --check scripts/loop-engine-contract.test.mjs`; expect green and exit 0. Keep the driver below 500 lines and existing instruction limits through concise owning-clause edits. Read back all stop branches for a terminal Recommendation line and no new persona, runtime key or ledger header.
- [ ] **Step 11: Commit.** Stage this task's changed driver, tests, samples and intent, then `git commit -m "Bound loop implementation escalation under amend permission" -m "Behavior-changing instruction edit; eval intent records the expected movement."`.

## Wave 3 - User-facing contract

Depends on Wave 2: document the final behavior of both engines and the shared planning/amendment policy. Keep all cross-cutting docs in this trailing wave.

### Task 4: Document grant-authorized execution continuation
Leg: jjuraszek/pi-gauntlet
Rules: README.md
Rules: doc/gate-contract.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md

**TDD scenario:** Trivial change - documentation, use judgment.

**Spec:** doc/specs/2026-10-29-implement-grant-continuity.md § "Documentation impact" L134, § "Documentation impact" L135, § "Documentation impact" L136, § "Out of scope" L140, § "Out of scope" L141, § "Out of scope" L142, § "Out of scope" L143

**Files:**
- Modify: `README.md:33-44`
- Modify: `doc/configuration.md:47-60`
- Modify: `doc/configuration.md:106-119`
- Modify: `doc/implement-engines.md`

**Tests:**
- none: documentation-only; no Markdown formatter is configured

- [ ] **Step 1: Update operations guidance.** Amend `doc/configuration.md` "Escalation loop" to include `implModel` at both engines' execution-failure sites under amend permission, distinct from existing review escalation. Correct the loop funding paragraph (the spec's `:118` citation): budget-only rounds keep the ordinary model; amend permission supplies bounded escalation. Explain missing model, cap, stagnation and boundary refusal, and one-shot recovery without a new setting.
- [ ] **Step 2: Update the workflow overview.** Amend `README.md` gate-2/option-5 explanation with one concrete authorized continuation example and distinguish recommendations from grants of extra budget or consent. Keep `/skill:shape-ticket`'s write gate and redraw approval explicit where discussing baseline decisions.
- [ ] **Step 3: Correct engine comparison.** Update `doc/implement-engines.md` loop stop/model paragraphs so row and exit-verification escalation, ledger/commit identity and terminal Recommendation lines agree with the drivers. Keep ordinary dispatch inheritance, artifacts, planless lifecycle, and verify-phase conformance limits unchanged.
- [ ] **Step 4: Review changed units.** Check doc links, commands and model names against Tasks 1-3 and settings source. Preserve `closureReview.maxFixRounds` and `grant_fix_rounds` as separate verify budgets; add no `piGauntlet.escalationLoop.autonomy` switch or new feature guide. Record no unrelated triage bugs. Leave `CHANGELOG.md - deferred: release` as the spec's release-owned decision, not an implementation edit.
- [ ] **Step 5: Commit.** `git add README.md doc/configuration.md doc/implement-engines.md` then `git commit -m "Document implement grant continuity"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L31 | Loop allowance exhaustion receives one authorized model round | Task 3 |
| § "Acceptance criteria" L33 | Exit failure repairs only the failing leg and reruns once | Task 3 |
| § "Acceptance criteria" L35 | Waves decisions take authorized recommendations within attempts | Task 2 |
| § "Acceptance criteria" L37 | Waves third attempt escalates once and then evaluates recommendation | Task 2 |
| § "Acceptance criteria" L39 | Evidenced drafted AC correction amends in every owner with audit | Task 1, Task 2 |
| § "Acceptance criteria" L41 | Baseline recommendation continues through narrow/amend/ticket gate | Task 1 |
| § "Acceptance criteria" L43 | All implement stops terminate with Recommendation or none | Task 2, Task 3 |
| § "Acceptance criteria" L45 | Hard stops and budget/consent boundaries remain | Task 2, Task 3 |
| § "Acceptance criteria" L47 | `npm test` passes, including instruction-size lint | Verification |
| § "Design" L71 | Inline reuse-only policy and amend-permission decoding | Task 1, Task 2, Task 3 |
| § "Design" L73 | Hard stops win before continuation | Task 2, Task 3 |
| § "Design" L74 | Authorized decisions continue without prior escalation | Task 1, Task 2, Task 3 |
| § "Design" L75 | Execution failures spend the one resolved-model round first | Task 2, Task 3 |
| § "Design" L76 | None, budget/consent and repeat evidence stop | Task 1, Task 2, Task 3 |
| § "Design" L78 | Reuse grant, model, recommendation and audit carriers; no unnamed repair | Task 1, Task 2, Task 3 |
| § "Design" L80 | Per-task/row repeat key with whitespace normalization; aftermath unchanged | Task 1, Task 2, Task 3 |
| § "Design" L82 | Site-specific recovery, unrecoverable spent, no retry/grant reset | Task 2, Task 3 |
| § "Design" L84 | Keep SDD body small and procedure in its existing reference | Task 2 |
| § "Design" L88 | NEEDS_CONTEXT and BLOCKED route through execution-stop reference | Task 2 |
| § "Design" L89 | Third attempt escalation; taken decisions consume ordinary attempts | Task 2 |
| § "Design" L90 | Narrow four AC-row classification sites and preserve granted audit | Task 1, Task 2 |
| § "Design" L91 | Reference owns execution-stop ordering, dispatch and identities | Task 2 |
| § "Design" L92 | Stop template gains final recommendation | Task 2 |
| § "Design" L93 | Loop rule 2, durable decision, parent subject and funding clamp | Task 3 |
| § "Design" L94 | Ordinary dispatch omits override; escalation supplies resolved model | Task 3 |
| § "Design" L95 | Exit repair consumes iteration, validates commit, marks and reruns | Task 3 |
| § "Design" L96 | Loop stop names spent round, takes amend, waits for budget | Task 3 |
| § "Design" L97 | Baseline narrow/filter, amend and fix-first dispatch without extra wait | Task 1 |
| § "Design" L98 | Aftermath uses same recommendation rule without loosening safety | Task 1 |
| § "Design" L99 | Widen first waves eval slice to include failure handler | Task 2 |
| § "Design" L101 | Remove unconditional loop override/omission/stop and baseline wait clauses | Task 1, Task 3 |
| § "Design" L102 | Add reference, site clauses, recommendations, identities, samples and intents | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L108 | Failed escalation is spent; preserve review funding/stagnation handling | Task 2, Task 3 |
| § "Errors and edge cases" L109 | Row cap/stagnation and exit cap prevent escalation | Task 3 |
| § "Errors and edge cases" L110 | Funding attempts 4/5 versus escalation 6; prospective grants | Task 3 |
| § "Errors and edge cases" L111 | Repeat evidence produces none recommendation | Task 2, Task 3 |
| § "Errors and edge cases" L112 | Budget-only, none and absent do not authorize; malformed stops | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L113 | Missing model stops with diagnostic | Task 2, Task 3 |
| § "Errors and edge cases" L114 | Only implementer evidence qualifies; ticket/problem/component stays redraw | Task 1, Task 2 |
| § "Errors and edge cases" L115 | Exit dirty/extra commits stop and coordinated rerun stays local | Task 3 |
| § "Errors and edge cases" L116 | Taken amend re-enters ordered table, preserving retry budget | Task 3 |
| § "Errors and edge cases" L117 | Resume consumes transcript/ledger/commit identity conservatively | Task 2, Task 3 |
| § "Errors and edge cases" L118 | All listed hard stops remain | Task 2, Task 3 |
| § "Tests" L122 | Samples use case/expected and selective amendment bundles | Task 1, Task 2, Task 3 |
| § "Tests" L124 | Loop row escalation, cap and resume eval | Task 3 |
| § "Tests" L125 | Loop exit repair, repeat failure and cap eval | Task 3 |
| § "Tests" L126 | Retain unchanged funding eval as no-permission control | Task 3 |
| § "Tests" L127 | BLOCKED decision, none and repeated-evidence eval | Task 2 |
| § "Tests" L128 | Third attempt, post-failure decision and transcript resume eval | Task 2 |
| § "Tests" L129 | Drafted-row amend/audit eval and retained redraw control | Task 2 |
| § "Tests" L130 | Add baseline-menu-under-grant and baseline-menu-aftermath; retain parent-offers-fix-first-narrow-amend unchanged | Task 1 |
| § "Tests" L131 | `npm test` proves byte-limit, skill and model-literal lint | Verification |
| § "Documentation impact" L134 | No new feature guide | Task 4 |
| § "Documentation impact" L135 | Amend configuration/README; leave changelog for release | Task 4 |
| § "Documentation impact" L136 | Refresh engine comparison | Task 4 |
| § "Out of scope" L140 | Keep separate verify budgets unchanged | Task 2, Task 3, Task 4 |
| § "Out of scope" L141 | No autonomy setting; grant is sole consent | Task 2, Task 3, Task 4 |
| § "Out of scope" L142 | No unnamed cap/stagnation/boundary budget | Task 2, Task 3, Task 4 |
| § "Out of scope" L143 | No unrelated triage bug work | Task 4 |
