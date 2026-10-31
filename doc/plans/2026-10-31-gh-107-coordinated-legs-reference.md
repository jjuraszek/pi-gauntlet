# Coordinated loop reference implementation plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Extract coordinated loop instructions without changing ledger admission, recovery, repair or verification behavior.

**Architecture:** Keep the home-only loop driver and shared continuation in place. Move the coordinated contract and executable admission recipe to one reference, loaded by exactly two membership-gated instructions. Repoint structural tests and select the reference only for coordinated eval samples.

**Tech Stack:** Markdown instructions, Node.js node:test, existing eval text-replay harness.

**Spec:** `doc/specs/2026-10-31-gh-107-coordinated-legs-reference.md`

**Verification:** `npm test`

**Ticket:** `#107`

Baseline jjuraszek/pi-gauntlet: da10c24b

---

## Recon and execution boundaries

One member: `jjuraszek/pi-gauntlet`, branch `gh-107-coordinated-legs-reference`; all tasks are home-owned and cite the home spec. `scope: none` defaults all six ACs home. No companion setup or artifacts apply. Use the caller-supplied worktree as each command's cwd.

Rules walk: root AGENTS.md is the only applicable ancestor rules file; there are no CLAUDE.md files or nested rules on these task paths. Apply all spec Rules. Additional one-hop documents and authoring rules are recorded on the affected tasks. Runtime API documentation links under node_modules are absent in this checkout; no runtime API changes depend on them.

Read seams:
- `skills/loop-implementation/SKILL.md:21-56,80-106,120-185,206-216`: extraction sites, mixed shared/coordinated exit repair and retained verify fan-out.
- `scripts/loop-engine-contract.test.mjs:10-63,86-106,109-165`: shared assertions, coordinated assertions, executable recipe extraction, real scratch-repository admission tests and cap slicing.
- `skills/gauntlet-resume/reference/reconstruction.md:96-99`: full-driver read before dirty checks and pending recovery; keep this caller unchanged.
- `eval/lib/lint.mjs:33-75`, `eval/lib/lint.test.mjs:30-45,91-131`: declared-new and bundle-selection validation, including committed-target lint.
- `eval/README.md:44-78,116-124`: baseline reseeding after subset changes, candidate-only entries and assembly-bound intent.

The manifest has no formatter or standalone general lint command. Scoped structural/style coverage uses the contract test, its existing lintStageSkillDirs check, and eval structural tests. Review changed Markdown against forge-skill authoring rules; preserve existing JavaScript formatting. The header's repository verification bundles instruction-size, stage-skill, model-literal, eval structure/hygiene and packaging checks. No extra format tool is introduced. There is no Happy path table in the overrides. The recorded leg contract also requires the full model target; Task 2 delivers and runs that evidence, separately from deterministic baseline tests.

Baseline provenance: jjuraszek/pi-gauntlet revision da10c24b; initial porcelain inventory was `?? doc/plans/2026-10-31-gh-107-coordinated-legs-reference.md`, admitted as the dispatched plan. The dispatched spec was clean. No source changes, in-flight paths or generated artifacts were admitted. The caller requested a full baseline rerun; no prior evidence was retained or re-stamped by equivalence. Both exact Tests commands ran in the supplied home worktree: Task 1 exited 0 with 6 tests executed and passed; Task 2 exited 0 with 15 tests executed and passed. After each run, HEAD remained da10c24b and porcelain contained only the same untracked plan. No contamination or blocked commands.

## Files

**Driver and executable contract - create:**
- `skills/loop-implementation/reference/coordinated-legs.md`

**Driver and executable contract - modify:**
- `skills/loop-implementation/SKILL.md`
- `scripts/loop-engine-contract.test.mjs`

**Eval - create:**
- `eval/loop-implementation/samples/leg-resume/case.md`
- `eval/loop-implementation/samples/leg-resume/expected.md`
- `eval/loop-implementation/results/leg-resume/baseline.json`
- `eval/loop-implementation/results/leg-resume/candidate.json`

**Eval - modify:**
- `eval/loop-implementation/target.json`
- `eval/loop-implementation/intent.md`
- `eval/loop-implementation/samples/cap-and-exit-verification/case.md`
- `eval/loop-implementation/samples/commit-boundary/case.md`
- `eval/loop-implementation/samples/decision-repair/case.md`
- `eval/loop-implementation/samples/escalated-row-attempt/case.md`
- `eval/loop-implementation/samples/funding/case.md`
- `eval/loop-implementation/samples/gate-line-first/case.md`
- `eval/loop-implementation/samples/legacy-cap/case.md`
- `eval/loop-implementation/samples/row-progress/case.md`
- `eval/loop-implementation/samples/scaled-cap-grant/case.md`
- `eval/loop-implementation/samples/seed-dispositions/case.md`
- `eval/loop-implementation/samples/stagnation-and-retry/case.md`
- `eval/loop-implementation/samples/verification-resolution/case.md`
- `eval/loop-implementation/samples/verify-lifecycle/case.md`
- `eval/loop-implementation/results/*/baseline.json` (existing fifteen sample records)
- `eval/loop-implementation/results/*/candidate.json` (existing fifteen sample records)
- `eval/loop-implementation/report.md`

**Release notes - modify:**
- `CHANGELOG.md`

**Delete:** none.

## Wave 1 - Extract the instruction owner

### Task 1: Extract coordinated instructions and repoint contract assertions
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - run existing tests first; add structural assertions before moving instructions.

**Spec:** doc/specs/2026-10-31-gh-107-coordinated-legs-reference.md § "Acceptance criteria" L23-L24, § "Acceptance criteria" L25-L26, § "Acceptance criteria" L27-L27, § "Acceptance criteria" L33-L36, § "Driver: `skills/loop-implementation/SKILL.md`" L71-L71, § "Driver: `skills/loop-implementation/SKILL.md`" L73-L73, § "Driver: `skills/loop-implementation/SKILL.md`" L75-L78, § "Driver: `skills/loop-implementation/SKILL.md`" L80-L80, § "Reference: `skills/loop-implementation/reference/coordinated-legs.md` (new)" L84-L94, § "Reference: `skills/loop-implementation/reference/coordinated-legs.md` (new)" L96-L96, § "Authoring constraints (driver and reference)" L100-L100, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L104-L104, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L108-L108, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L109-L110, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L111-L111, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L112-L112, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L116-L116, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L117-L117, § "Contract test: `scripts/loop-engine-contract.test.mjs`" L118-L119, § "Untouched by design" L130-L130, § "Errors and edge cases" L134-L134, § "Errors and edge cases" L135-L135, § "Errors and edge cases" L136-L136, § "Errors and edge cases" L137-L137, § "Errors and edge cases" L138-L138, § "Errors and edge cases" L139-L139, § "Errors and edge cases" L140-L140, § "Errors and edge cases" L142-L142, § "Tests" L146-L148, § "Tests" L151-L155, § "Out of scope" L166-L166, § "Out of scope" L167-L167, § "Out of scope" L168-L168

**Files:**
- Create: `skills/loop-implementation/reference/coordinated-legs.md`
- Modify: `skills/loop-implementation/SKILL.md:21-216`
- Modify: `scripts/loop-engine-contract.test.mjs:10-165`
- Test: `scripts/loop-engine-contract.test.mjs`

**Tests:**
- `node --test scripts/loop-engine-contract.test.mjs`
- baseline: da10c24b pass
- via: `companionFixture`, `validateCompanion`, `<!-- companion-return-shell -->`

Rules: skills/forge-skill/SKILL.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: missing: node_modules/@earendil-works/pi-coding-agent/docs/packages.md
Rules: missing: node_modules/@earendil-works/pi-coding-agent/docs/skills.md

Decision: Keep the extraction, assertions and admission-source changes in one task - the existing executable fixture extracts its script from the Markdown owner, so these changes must land together (scripts/loop-engine-contract.test.mjs:86-106).

Decision: Locate driver sections by heading lines, not inline mentions - the approved Contract test amendment at spec L108 and L112 prescribes heading-aware ordering, Entry slicing and absent-section regexes. No contract question remains.

Orchestrator: Retain the measured driver line counts for the finish PR body.

- [ ] **Step 1: Establish the existing contract baseline.** Run the Tests command; expect the six existing tests to pass, including interrupted ordinary/seed recovery and rejection of zero, unrelated, multiple or unattributed commits. Read the entire driver, fixture and forge-skill authoring rules before editing.
- [ ] **Step 2: Add extraction regressions.** Keep every existing assertion under its post-move owner, not a wholesale replacement. Add the exactly-two path occurrences, membership condition, first-sentence placement before rule 1, restore applicability and stop-clause checks prescribed below. Both read sentences must contain `stop on an unreadable reference`; the first must contain `on every ledger restore` and `## Resume`; the second applies operational sections and says never apply `## Entry` here. Check absent coordinated section definitions with multiline heading regexes, not substring absence. Check absent `pending:`, `companion-return-shell` and `## Leg mapping`. Run the Tests command and confirm red on missing reference or still-inlined rules.
- [ ] **Step 3: Move entry, recovery and dispatch text.** Create the reference with one consumer sentence and exact ordered headings `## Entry`, `## Resume`, `## Targeting and dispatch`, `## Companion return validation`, `### Companion commit admission`, `## Exit verification`, `## Amendments`. Move driver lines 48,50,52,54 into Entry, 56 into Resume, 80/84 into Targeting and dispatch, 102-104 and the second sentence of 106 into Companion return validation, and 206 into Amendments. Keep scope parsing, original AC/membership order, per-member `base repo-x:` / `seeded repo-x:` fields, cap 14 example, all-cut cap 1, expected-dirt admission and iteration accounting verbatim. This is the first file under `skills/loop-implementation/reference/`; follow `brainstorming/reference/` and `gauntlet-resume/reference/` naming.
- [ ] **Step 4: Move the executable admission recipe without altering it.** Move original lines 120-177, including `<!-- companion-return-shell -->` and its bash fence. Preserve the script bytes and argv/stdout contract. Rebase `../brainstorming/reference/legs.md#scope-grammar-and-validation` to `../../brainstorming/reference/legs.md#scope-grammar-and-validation`; rebase `../brainstorming/reference/amendment-surface.md` likewise only where moved text uses it. Change only the cross-file evidence pointer to the driver's `## Validate the return` table. Keep reference-internal below/above references and omit `## Project overrides` from the reference.
- [ ] **Step 5: Split mixed exit clauses.** Preserve the first sentence of original line 106 and the legacy/single-member exit sentence byte-for-byte. Use the exact retained payloads below for original lines 183 and 185. Move coordinated substitutions into the reference's `## Exit verification`, retaining `once per flow, not per failing leg` and `Success only after every leg passes`. Preserve shared repair limits, clean/exactly-one-commit boundaries, empty parent marker, and no verify-credit spending.
- [ ] **Step 6: Install exactly the two approved reads.** Use the exact Entry and Before each dispatch sentences below without paraphrase. Replace original line 21 and remove the old coordinated Entry section. Keep the public shared headings and After the loop fan-out paragraph byte-for-byte; add no third read and make no changes to resume/handoff/finish/persona callers. Single-member and legless specs never load the reference, including on restore.
- [ ] **Step 7: Complete test-owner routing.** Apply the assertion-by-assertion map below. Read the reference in companionFixture and validateCompanion, preserve the extraction regex and change its failure message to `reference must supply executable companion commit admission`. Keep fixture cases at original lines 109-150 unchanged. Preserve all remaining assertion meanings, applying only the approved heading-aware correction.
- [ ] **Step 8: Run green and review style.** Run the Tests command again; expect all existing fixtures and new structural assertions to pass, including the existing scoped stage-skill lint assertion. Review only the changed instruction units against `/skill:forge-skill` `## Authoring rules`: imperative voice, low conditionality, minimal diff, no history, recipe over prohibition, no nuance clauses, one example, ASCII and compact `|---|` tables. Compare the moved script bytes and shared instructions against the pre-edit source. Keep both instruction files below 50,000 bytes and 2,000 lines; header verification runs `scripts/skill-size-lint.mjs`. No standalone formatter is configured.
- [ ] **Step 9: Record size and commit.** Measure `git show 9bb6b398:skills/loop-implementation/SKILL.md | wc -l` and `wc -l skills/loop-implementation/SKILL.md`; preserve both actual values for the finish PR body (baseline expected 229, candidate roughly 130, not a hard equality). Commit only owned files with subject `Extract coordinated loop reference (ref #107)`. State that read timing is instructional behavior with eval evidence following; name all eight approved mixed-line rewordings and the cross-file pointer change in the commit body.

**Exact edit payloads and preserved boundaries:**

Remove `## Coordinated Entry and resume`, coordinated targeting/dispatch, `pending:` persistence, companion return validation and the parent `loop: record` commit from the driver. Remove the `### Companion commit admission` definition and recipe, coordinated exit clauses and amendment reconciliation. Keep `verification:` for the legacy/single-member path. The tuple rules now live solely in the reference; the `After the loop` paragraph names neither the tuple nor `reference/coordinated-legs.md`.

Post-split line 183: `Apply hard boundaries first; at cap use the cap stop without repair. With amend permission, `iterations < cap`, resolved `escalationLoop.implModel` and no spent `loop: repair verification` identity, bump iterations once and record `HEAD_BEFORE`. Dispatch exactly one `implementer` with `model: <implModel>`, `context: "fresh"`, `async: false`, the implementation worktree as cwd and its Rules, failing output, absolute spec path and the exact verification command. Require a clean tree and exactly one commit after HEAD_BEFORE; dirty/zero/multiple commits use existing boundary stops preserving count and state. Require all ledger rows unchanged, preserving cap and prior decisions. The child's sole commit includes the already-bumped ledger; after validation parent commits `loop: repair verification`, using an empty parent marker when no dirt remains. This marker is once per flow.`

Post-split line 185: `Rerun that command once. Never spend verify-phase credits. A second failure retains the original header plus `escalated round spent`, then goes through Human stop. Dispatch error or non-DONE consumes the round before a decision; preserve the consumed count and stop. Recover spent identity from the parent commit on resume; interrupted or unrecoverable identity is spent, never add a carrier or fabricate success. With no permission or spent identity: no reopening and no automatic rerun. Missing settings/model stops with the capability in Problem. On success record verified HEAD and clean status; call `phase_tracker({ action: "complete", phase: "implement" })`, then continue immediately below.`

Name these eight rewordings in the commit body and preserve their coordinated meaning in the reference:
- `bump home iterations once and record `HEAD_BEFORE` in the failing leg` -> `bump iterations once and record `HEAD_BEFORE``.
- `that leg's cwd/Rules` -> `the implementation worktree as cwd and its Rules`.
- `absolute home spec path and exact leg verification command` -> `absolute spec path and the exact verification command`.
- `preserving mapping, cap and prior decisions` -> `preserving cap and prior decisions`.
- `The home child's sole commit includes the already-bumped home ledger` -> `The child's sole commit includes the already-bumped ledger`.
- `This marker is once per flow, not per failing leg.` -> `This marker is once per flow.`.
- `Rerun that command once in the failing leg only. Never spend another leg's verification or verify-phase credits.` -> `Rerun that command once. Never spend verify-phase credits.`.
- `Success only after every leg passes: record` -> `On success record`.

Preserve the complete coordinated substitution set. The moved coordinated clauses ("in the failing leg", "that leg's cwd/Rules", "absolute home spec path and exact leg verification command", "preserving mapping", "The home child's sole commit includes the already-bumped home ledger", "A companion child commits its leg only; parent commits the bumped home ledger as `loop: repair verification`, preserving rows and mapping.", "not per failing leg", "in the failing leg only", "Never spend another leg's verification", "Success only after every leg passes") land in the reference's `## Exit verification` as the coordinated substitutions for the same repair.

Keep the coordinated companion-child clause in the reference: A companion child commits its leg only; parent commits the bumped home ledger as `loop: repair verification`, preserving rows and mapping. Retarget line 102's evidence/decision bounds to the driver's `## Validate the return` table. Retain `Recover pending companion work` before targeting and the reference-internal below/above pointers. All moved paragraphs retain their wording except the approved split and retargeting. The two read sentences and opening consumer sentence are the only new prose.

Entry replacement (spec L77): `On fresh entry and on every ledger restore, for a spec whose `## Legs` section has more than one `### Leg:` block, read `reference/coordinated-legs.md` IN FULL now with read; stop on an unreadable reference naming its path, never reconstruct it. On fresh entry apply its `## Entry` section instead of the home-only skeleton and cap calculation below. On a restore apply its `## Resume` section before the dirty-tree stop and before any pending recovery. Keep legacy and single-member ledger bytes unchanged, with no coordinated metadata.`

First sentence of Before each dispatch (spec L78): `For a spec whose `## Legs` section has more than one `### Leg:` block, read `reference/coordinated-legs.md` IN FULL now with read; stop on an unreadable reference naming its path, never reconstruct it. Apply its `## Resume`, `## Targeting and dispatch`, `## Companion return validation`, `### Companion commit admission`, `## Exit verification` and `## Amendments` sections together with this driver; never apply `## Entry` here.`

Keep `## Before each dispatch`, `## Human stop`, `## Exit verification`, `## After the loop` public headings and the fan-out paragraph from line 216, including `legs:` and `--leg`. Keep `doc/gate-contract.md:24-25` and `doc/implement-engines.md:40` citations valid. Preserve the caller files `skills/gauntlet-handoff/SKILL.md`, `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/{brief-contract,reconstruction}.md`, `doc/implement-engines.md`, `doc/gate-contract.md`, `README.md`, `agents/loop-implementer.md`, and `skills/finishing-a-development-branch/**`. This excludes edits to `gauntlet-handoff`, `gauntlet-resume` and `finishing-a-development-branch` themselves. Preserve the ledger bytes, tuple grammar, parent-commit subjects, script argv/stdout and cap formula.

Resume boundary: `reconstruction.md` step 4 reads the driver in full, so its Entry read loads `## Resume` and admission before the dirty stop and pending recovery; step 5 continues at `Before each dispatch`. Verify/ship restore also loads those rules before `brief-contract.md:200` recovery and continues at `After the loop` step 1 with unchanged fan-out. The expected-dirt exception remains before recovery without a resume-source edit. Exit and amendment rules are already loaded before reaching the ordered-table continuation; unreadable references stop naming their path, never trigger reconstruction or a third read.

**Assertion migration map (original test line numbers):**
- `:10-35` retains dispatch/ledger tests, `action: "complete", phase: "implement"` order at `:21`, and `< 500` at `:34`. Change only `:18-19` to order `steps` by `driver.indexOf('\n' + step + '\n')`. At `:155`, slice Entry as `driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0]`; keep the `:156` `## Human stop` / `## After the loop` substring split because neither occurs in the read sentences.
- Keep `:42-45` and `:47-48`: `Rerun that command once`, `exactly one commit`, `rows unchanged`, `loop: repair verification`, `empty parent marker`, and the `no permission or spent identity` sentence. Change `:46` to `assert.match(driver, /This marker is once per flow\./)`; add `the implementation worktree as cwd and its Rules`, `absolute spec path and the exact verification command`, and `On success record verified HEAD and clean status` assertions.
- From `:54`, keep `legacy and single-member ledger bytes unchanged` against driver; keep `:55` persona tokens, `:60-61` legacy skeleton exclusion, and `:62` fan-out. Route the other `:54` tokens and `:56` / `:57` regexes to the new reference test. Route `:58` `doesNotMatch` to the reference. Replace `:59` by reference-internal ordering: Entry before Resume, pending recovery before Targeting and dispatch, admission after Companion return validation. Do not retarget `:51-63` wholesale.
- Assert exactly two `reference/coordinated-legs.md` occurrences, one in Entry and the other as the first sentence after Before each dispatch and before the ordered table. Assert each containing sentence's membership gate and unreadable stop, the first's restore clause, and the second's operational apply clauses without applying Entry. Assert absent heading lines with `^## Coordinated Entry and resume$` and `^### Companion commit admission$` using multiline regexes; inline mentions are legal. Assert no `pending:`, `companion-return-shell`, or `## Leg mapping` in the driver.
- Assert reference heading order, `once per flow, not per failing leg` and `Success only after every leg passes` under its Exit verification. At `:86-87`, `companionFixture` reads the reference for `After persisting the bump and pending tuple, bind `SAVED_LEDGER` to the durable home ledger`. At `:101-106`, `validateCompanion` extracts the same marker and regex from the reference and uses `reference must supply executable companion commit admission`. Preserve `:109-150` fixture cases.

## Wave 2 - Preserve replay coverage

Depends on Wave 1: the candidate-only bundle entry requires the new reference; replay evidence must use the final extracted driver and reference.

### Task 2: Scope eval bundles and add interrupted-resume coverage
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested fixtures - preserve existing facts and add the new resume scenario before running candidate replay.

**Spec:** doc/specs/2026-10-31-gh-107-coordinated-legs-reference.md § "Acceptance criteria" L29-L30, § "Acceptance criteria" L31-L31, § "Eval: `eval/loop-implementation/`" L123-L123, § "Eval: `eval/loop-implementation/`" L124-L124, § "Eval: `eval/loop-implementation/`" L125-L125, § "Eval: `eval/loop-implementation/`" L126-L126, § "Errors and edge cases" L135-L135, § "Errors and edge cases" L136-L136, § "Errors and edge cases" L137-L137, § "Errors and edge cases" L138-L138, § "Errors and edge cases" L141-L141, § "Errors and edge cases" L142-L142, § "Tests" L149-L150, § "Out of scope" L169-L169, § "Out of scope" L170-L170

**Files:**
- Create: `eval/loop-implementation/samples/leg-resume/case.md`
- Create: `eval/loop-implementation/samples/leg-resume/expected.md`
- Create: `eval/loop-implementation/results/leg-resume/baseline.json`
- Create: `eval/loop-implementation/results/leg-resume/candidate.json`
- Modify: `eval/loop-implementation/target.json`
- Modify: `eval/loop-implementation/intent.md`
- Modify: `eval/loop-implementation/samples/cap-and-exit-verification/case.md`
- Modify: `eval/loop-implementation/samples/commit-boundary/case.md`
- Modify: `eval/loop-implementation/samples/decision-repair/case.md`
- Modify: `eval/loop-implementation/samples/escalated-row-attempt/case.md`
- Modify: `eval/loop-implementation/samples/funding/case.md`
- Modify: `eval/loop-implementation/samples/gate-line-first/case.md`
- Modify: `eval/loop-implementation/samples/legacy-cap/case.md`
- Modify: `eval/loop-implementation/samples/row-progress/case.md`
- Modify: `eval/loop-implementation/samples/scaled-cap-grant/case.md`
- Modify: `eval/loop-implementation/samples/seed-dispositions/case.md`
- Modify: `eval/loop-implementation/samples/stagnation-and-retry/case.md`
- Modify: `eval/loop-implementation/samples/verification-resolution/case.md`
- Modify: `eval/loop-implementation/samples/verify-lifecycle/case.md`
- Modify: `eval/loop-implementation/results/*/baseline.json`
- Modify: `eval/loop-implementation/results/*/candidate.json`
- Modify: `eval/loop-implementation/report.md`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: da10c24b pass
- via: `lintTarget`, `lintAll`, `eval/loop-implementation/target.json`

Decision: Use the existing committed-target structural test without editing the eval harness - eval/lib/lint.test.mjs:91-94 already lints all real targets. Model replay delivers the spec-required report during execution, not baseline planning; never fabricate deterministic evidence for model facts.

Orchestrator: After fixture and baseline preparation, require the full model-target run on the final candidate and commit its current report and generated records before finish; require all sixteen samples and both replay models, not a partial report.

- [ ] **Step 1: Confirm structural baseline.** Run the Tests command; expect fifteen tests and zero failures. Read target.json, intent.md and the existing leg-iteration and exit-verification-escalates cases/facts. Do not edit any existing expected.md fact.
- [ ] **Step 2: Add bundle exclusions first and confirm red.** Prepend `bundle-: skills/loop-implementation/reference/coordinated-legs.md` to the thirteen explicitly owned single-repo case files. Keep any existing bundle+ declaration, including escalated-row-attempt's amendment surface. Run the Tests command; expect structural failure because the dropped path is not yet a skillFiles entry.
- [ ] **Step 3: Declare the candidate-only reference.** In `target.json`, add `{ "path": "skills/loop-implementation/reference/coordinated-legs.md", "new": true }` to `skillFiles`. Keep `wordCap` 2600. Keep the reference in `leg-iteration` and `exit-verification-escalates`, which are both coordinated; do not touch their case text. Inspect baseline availability rather than dropping `new: true` to silence lint. The baseline intentionally has no reference.
- [ ] **Step 4: Add the resume input and facts.** Create `samples/leg-resume/{case.md,expected.md}` under `eval/loop-implementation/` with bundle+ lines for `skills/brainstorming/reference/legs.md` and `skills/gauntlet-resume/reference/reconstruction.md`. Start explicitly at Spec with ledger step 4, implement stage, with two members, stable mapping, both seeds validated, home HEAD aaaaaaa, companion pre-dispatch HEAD bbbbbbb, iterations already 3, cap 14, row 2 open attempts 0, and durable `pending: 2 | repo-b | bbbbbbb`. State that `M <ledger>` is the only dirt and matches exactly the iteration bump and tuple against committed home ledger. Supply one clean attributed companion commit ddddddd, subject loop: row 2 done, exact tuple and `iteration:` 3 in its body, row 2 done attempts 1 with bounded parser-check evidence, and one bounded decision. Instruct replay to narrate supplied observations, not execute tools. Add four judged facts: read-before-recovery-and-dirty-stop, expected-dirt admission, exactly-once parent recording, and preserved continuation. Require a single `loop: record repo-b row 2` commit recording ddddddd, clearing `pending:`, adding no new dispatch/iteration/attempt, then continuing at `Before each dispatch`.
- [ ] **Step 5: Update intent and reseed.** Add a `leg-resume` paragraph under Change in `intent.md` explaining the restored read timing and preserved recovery. Preserve every existing must-hold fact and movement declaration. Run `node eval/run.mjs loop-implementation --baseline-only` once after the subset changes; expect baseline seeded/fresh, not a comparison report. Use the candidate runner's mismatch-refusal SHA to replace the `for:` line, never a Git SHA. Keep wordCap unchanged unless measured coordinated reply length exceeds it and that measured value and reason are recorded in intent.md.
- [ ] **Step 6: Check green and scoped candidate replay.** Run the Tests command again; expect no structural errors. Run `node eval/run.mjs loop-implementation leg-resume` for the targeted replay, updating only the reported assembly hash before retrying an intent mismatch. Expect all four new facts to hold on both models; no discard authorization, reseeding or duplicate dispatch. Preserve existing `eval/loop-implementation/samples/leg-iteration/expected.md` `reject` coverage for two commits; do not add a second resume variant or manual live coordinated run.
- [ ] **Step 7: Review data and commit.** Check compact Markdown, valid JSON, no machine-local personal paths, and no changes to existing fact files. Run the full target `node eval/run.mjs loop-implementation`, then commit fixture/config/intent and generated records with subject `Cover coordinated loop resume after reference extraction (ref #107)`. Require the current full `report.md` and `eval/loop-implementation/report.md`, not a partial report. All sixteen samples replay after the driver change, including `escalated-row-attempt`, `exit-verification-escalates`, `cap-and-exit-verification` and `commit-boundary`; retain every existing fact.

**Bundle and restore contracts:**

Follow `eval/README.md`, `eval/lib/lint.mjs:47-49` and `eval/README.md:118`: the new reference entry belongs in `skillFiles`; the existing `brainstorming/reference/legs.md` and reconstruction bundles need no `new:` entry. `eval/run.mjs:130` bounds reply words, not assembled text. Never raise wordCap for bundle growth. Refuse an entry already present at baseline, a `bundle-` path outside skillFiles, a sample both adding and dropping one path, or stale intent hash; repair the actual declaration/hash, not the lint rules. The committed target structural test exercises these declarations and `eval/loop-implementation/samples/leg-resume/`.

Single-member (`### Leg:` once) and legacy (no `## Legs`) samples exclude the reference at both fresh and restore reads; their ledger bytes stay unchanged. `reconstruction.md` step 4 loads the full driver and thus `## Resume` and `### Companion commit admission` before pending recovery and the dirty stop. The new input exercises that expected-dirt exception; do not change `gauntlet-resume` source. Preserve verify/ship `brief-contract.md:200` pending recovery before `After the loop` fan-out, and keep `## Exit verification` and `## Human stop` semantics loaded before ordered-table continuation. No new sample variant is needed for two commits: the existing reject fact already stops preserving the tuple and state after interrupted restart.

## Wave 3 - Release-note documentation

Depends on Waves 1-2: describe the extracted implementation and its preserved resume behavior after both are established. This trailing doc-only wave owns the sole cross-cutting documentation edit.

### Task 3: Record the coordinated-reference change in release notes
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Trivial documentation change - inspect the resulting release-note unit.

**Spec:** doc/specs/2026-10-31-gh-107-coordinated-legs-reference.md § "Documentation impact" L160-L162

**Files:**
- Modify: `CHANGELOG.md:1-5`

**Tests:**
- none: release notes; no Markdown formatter is configured

Rules: .agents/skills/release/SKILL.md

- [ ] **Step 1: Add the release-note unit.** Insert `## Unreleased` before the current v8.0.0 heading and one concise bullet ending `(#107)` for `#107`: single-repo loops omit coordinated instructions; coordinated entry/resume loads the extracted reference before admission. Do not claim a runtime behavior change or add user-guide edits.
- [ ] **Step 2: Review scope.** Check that `README.md`, `doc/implement-engines.md`, `doc/gate-contract.md`, handoff/resume/finish instructions and the loop persona remain untouched. Their public heading and on-disk ledger contracts stay valid. Release notes are the only derived documentation change; no release/version bump is part of this task. The `Docs touched:` candidates also include `eval/README.md` Iterating on a skill edit, `brief-contract.md` Coordinated admission and finishing `legs.md` Activation and authority; their contracts stay valid. Skill bodies and the new reference remain implementation surface per `reference/documentation-impact.md`.
- [ ] **Step 3: Commit.** Commit `CHANGELOG.md` with subject `Document coordinated loop reference extraction (ref #107)`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L23-L24 | Move coordinated sections, tuple rules and admission recipe out of the driver | Task 1 |
| § "Acceptance criteria" L25-L26 | Exactly two membership-gated reads; single/legacy routes never read | Task 1 |
| § "Acceptance criteria" L27-L27 | Contract assertions, executable extraction and repository verification pass | Task 1 |
| § "Acceptance criteria" L29-L30 | New leg-resume replay admits one attributed commit | Task 2 |
| § "Acceptance criteria" L31-L31 | Coordinated-only bundles and all existing eval facts hold | Task 2 |
| § "Acceptance criteria" L33-L36 | Preserve shared rules; capture before/after driver size for PR body; count reads as specified | Task 1 |
| § "Driver: `skills/loop-implementation/SKILL.md`" L71-L71 | Remove every enumerated coordinated span, retaining shared sentences | Task 1 |
| § "Driver: `skills/loop-implementation/SKILL.md`" L73-L73 | Exact mixed exit split and eight documented rewordings | Task 1 |
| § "Driver: `skills/loop-implementation/SKILL.md`" L75-L78 | Two full conditional reads with unreadable stops and fresh/restore distinction | Task 1 |
| § "Driver: `skills/loop-implementation/SKILL.md`" L80-L80 | Shared headings and After the loop fan-out retained; measured line count recorded | Task 1 |
| § "Reference: `skills/loop-implementation/reference/coordinated-legs.md` (new)" L84-L94 | Consumer sentence, exact heading order and all moved clauses | Task 1 |
| § "Reference: `skills/loop-implementation/reference/coordinated-legs.md` (new)" L96-L96 | Rebase links, retarget cross-file bounds, preserve script and internal references; no overrides block | Task 1 |
| § "Authoring constraints (driver and reference)" L100-L100 | Forge authoring rules, minimal new prose, instruction-size limits | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L104-L104 | Route assertions individually by text owner | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L108-L108 | Preserve shared assertions; match heading lines for ordering and Entry slicing | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L109-L110 | Keep shared repair tokens, update marker and add payload assertions | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L111-L111 | Keep persona, legacy skeleton and fan-out checks | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L112-L112 | Read placement, membership, restore/stop clauses and absent moved heading definitions | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L116-L116 | Coordinated assertions and reference-internal order | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L117-L117 | Exit repair remains once per flow across legs | Task 1 |
| § "Contract test: `scripts/loop-engine-contract.test.mjs`" L118-L119 | Reference-backed fixture and extractor; existing admission cases unchanged | Task 1 |
| § "Eval: `eval/loop-implementation/`" L123-L123 | Declared-new reference; word cap changes require measured evidence | Task 2 |
| § "Eval: `eval/loop-implementation/`" L124-L124 | Thirteen single-repo drops; two existing coordinated samples retain reference | Task 2 |
| § "Eval: `eval/loop-implementation/`" L125-L125 | New resume case with membership/reconstruction bundles and exactly-once facts | Task 2 |
| § "Eval: `eval/loop-implementation/`" L126-L126 | Intent assembly hash, reseeded baselines and committed full report | Task 2 |
| § "Untouched by design" L130-L130 | Caller/persona/public-doc boundaries and byte-identical ledger/script contracts | Task 1 |
| § "Errors and edge cases" L134-L134 | Each unreadable reference stop names its path; no third read | Task 1 |
| § "Errors and edge cases" L135-L135 | Single/legacy routes preserve bytes and exclude reference from replay | Task 1, Task 2 |
| § "Errors and edge cases" L136-L136 | Implement restore loads recovery before dirt handling and rule 1 | Task 1, Task 2 |
| § "Errors and edge cases" L137-L137 | Verify/ship restore has admission context before retained fan-out | Task 1, Task 2 |
| § "Errors and edge cases" L138-L138 | Exit/amendment sections loaded before ordered-table continuation | Task 1, Task 2 |
| § "Errors and edge cases" L139-L139 | Clause split preserves shared text and documents rewordings | Task 1 |
| § "Errors and edge cases" L140-L140 | Detect left-behind content, wrong reads and empty recipe extraction | Task 1 |
| § "Errors and edge cases" L141-L141 | Respect eval lint and hash refusals; replay sixteen samples | Task 2 |
| § "Errors and edge cases" L142-L142 | Preserve expected-dirt exception without resume-source edits | Task 1, Task 2 |
| § "Tests" L146-L148 | Structural extraction/read checks and executable fixture coverage | Task 1 |
| § "Tests" L149-L150 | Resume replay, selective bundles and committed full report | Task 2 |
| § "Tests" L151-L155 | Size artifact, stop/restore clauses, shared repair payload and reference heading order | Task 1 |
| § "Documentation impact" L160-L162 | Unreleased note only; existing guide candidates remain unchanged | Task 3 |
| § "Out of scope" L166-L166 | No change to coordinated behavior or durable/executable contracts | Task 1 |
| § "Out of scope" L167-L167 | Keep excluded caller/persona/engine docs unchanged | Task 1 |
| § "Out of scope" L168-L168 | No third After the loop read | Task 1 |
| § "Out of scope" L169-L169 | Reuse existing multiple-commit rejection coverage; no second resume variant | Task 2 |
| § "Out of scope" L170-L170 | Synthetic replays, not a manual live coordinated run | Task 2 |
