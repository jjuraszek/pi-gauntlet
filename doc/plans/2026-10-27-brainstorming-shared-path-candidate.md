# Shared-path reuse and committed-observable review Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Prefer changes to nearly-fitting shared paths, carry moving-part inventories into approved Design clauses, and reject tests without a spec-named observable.

**Architecture:** Extend the existing brainstorming approach and design-round instructions and add one code-reviewer Tests bullet. Exercise the changed instructions through the existing text-eval targets; use the existing whole-diff conformance readers under both engines without changing them.

**Tech Stack:** Markdown instructions and synthetic text fixtures; Node.js node:test and the existing pi-backed eval runner.

**Spec:** `doc/specs/2026-10-27-brainstorming-shared-path-candidate.md`

**Verification:** `npm test && node eval/run.mjs brainstorming --baseline-only --base 812d46fa && node eval/run.mjs brainstorming --base 812d46fa && node eval/run.mjs code-reviewer --baseline-only --base 812d46fa && node eval/run.mjs code-reviewer --base 812d46fa`

---

No Happy path table exists in the selected `.pi/gauntlet-overrides.md`. No deployment split or review-risk split is needed.

## Files

### Brainstorming instructions and eval

**Modify:**
- `skills/brainstorming/SKILL.md` - sections 4, 5, and 6 only.
- `eval/brainstorming/intent.md` - candidate assembly SHA and this change's intended fact movements.
- `eval/brainstorming/results/*/baseline.json` - existing sample records refreshed by the runner when stale.
- `eval/brainstorming/results/*/candidate.json` - existing sample records refreshed by the runner when stale.
- `eval/brainstorming/report.md` - generated full-target comparison.

**Create:**
- `eval/brainstorming/samples/shared-helper-option/case.md`
- `eval/brainstorming/samples/shared-helper-option/expected.md`
- `eval/brainstorming/samples/moving-parts-design-return/case.md`
- `eval/brainstorming/samples/moving-parts-design-return/expected.md`
- `eval/brainstorming/results/shared-helper-option/baseline.json`
- `eval/brainstorming/results/shared-helper-option/candidate.json`
- `eval/brainstorming/results/moving-parts-design-return/baseline.json`
- `eval/brainstorming/results/moving-parts-design-return/candidate.json`

### Reviewer instruction and eval

**Modify:**
- `agents/code-reviewer.md` - one Tests bullet, retaining frontmatter byte-for-byte.
- `eval/code-reviewer/samples/duplicate-tests-diff/expected.md` - one no-spec fact.
- `eval/code-reviewer/intent.md` - candidate assembly SHA and this change's intended fact movements.
- `eval/code-reviewer/results/*/baseline.json` - existing sample records refreshed by the runner when stale.
- `eval/code-reviewer/results/*/candidate.json` - existing sample records refreshed by the runner when stale.
- `eval/code-reviewer/report.md` - generated full-target comparison.

**Create:**
- `eval/code-reviewer/samples/spec-observable-tests/case.md`
- `eval/code-reviewer/samples/spec-observable-tests/expected.md`
- `eval/code-reviewer/results/spec-observable-tests/baseline.json`
- `eval/code-reviewer/results/spec-observable-tests/candidate.json`

### Trailing documentation

**Modify:**
- `eval/brainstorming/README.md` - two sample-table rows.
- `CHANGELOG.md` - new Unreleased / Changed entry.

**Delete:** none.

Record globs describe runner-selected stale existing cells; the exact changed subset is determined by content hashes, not guessed in advance. All six new record files are named explicitly above. Generate records only through the runner, never by hand. No target configuration, replay harness, reference file, engine, contract test, root README, or eval procedure guide changes.

## Recon and execution boundaries

- `skills/brainstorming/SKILL.md:157-177` owns approaches, clarity, and both design rounds. `scripts/brainstorming-contract.test.mjs:363-392` pins the approach markers and checks target structure and instruction size; run the existing file unchanged.
- `agents/code-reviewer.md:17-35` owns Tests and the smoke/self-check deletion exemption. Its verdict and footer contract remains at lines 37-106. `skills/requesting-code-review/code-reviewer.md:26-40,75-78` supplies requirements and the existing test-economy question; no caller edit is needed.
- `eval/brainstorming/target.json:1-21` already assembles sections 4-6 and fixes `wordCap` at 1400. `eval/code-reviewer/target.json:1-10` assembles the persona body and review template with a 700-word cap.
- `eval/brainstorming/replay.md:3-5` returns only the next response for continuation cases. `eval/brainstorming/samples/design-approval-return/case.md:1-17` supplies completed round-one approval and a successful documentation-guideline read; `eval/brainstorming/samples/review-and-apply-containment/case.md:1-48` shows inline fixture stubs and recorded answers.
- `eval/lib/lint.mjs:8-61` validates both targets and rejects physical fixture directories for text targets. `eval/lib/lint.test.mjs:74-77` tests every committed target. `eval/lib/replay.mjs:36-58` owns assembly and bundle parsing; `eval/run.mjs:147-223` resolves the baseline, validates intent, and assembles both arms.
- `package.json:62-67` exposes only the bundled verification script, not separate lint/format scripts. `scripts/ci.mjs:123-143,465-469,514-552` owns instruction frontmatter, deterministic checks, size/model-literal lint, and eval structure. There is no configured Markdown formatter. Task-local format/lint consists of reading changed Markdown against forge-skill rules and the scoped deterministic checks below; the header owns repo-wide lint and all model runs.
- Model comparison produces tracked evidence, so it belongs to verification, not the plan-writer's read-only task baseline. Verification runs both seed commands before their paired full comparisons, inspects every new fact's actual after-value, and commits the generated records/reports with both updated intents before finish. A successful exit alone is not sufficient when a new fact remains pre-existing or intended-but-unchanged with after=fails.
- Provider/runtime failures stop verification with their actual error. Do not widen word caps, weaken facts, widen `intent.md`, or alter unrelated prompts to clear a regression. Reword only this edit's owning sentences, update the assembly SHA, and rerun the affected target through the header gate.

## Baseline provenance

Initial inventory on `eae67c51`: clean (no porcelain entries). Exact admitted workflow paths: `doc/specs/2026-10-27-brainstorming-shared-path-candidate.md` and `doc/plans/2026-10-27-brainstorming-shared-path-candidate.md`. Only the plan is written during planning. Header verification is deferred; task baselines use deterministic node:test files only. Executed Task 1: exit 0, 40 tests passed. Executed Task 2: exit 0, 14 tests passed. After each command, HEAD remained `eae67c51` and the only porcelain entry was `?? doc/plans/2026-10-27-brainstorming-shared-path-candidate.md`; neither run generated artifacts or dirtied source.

## Wave 1 - Instruction changes and their synthetic cases

Tasks own disjoint instruction and target files. Their deterministic tests use read-only repository input and unique scratch directories; model runs are serialized later by the header, not launched in this wave.

### Task 1: Prefer the shared path and carry its moving-part contract into design

**TDD scenario:** Modifying tested instructions - run the existing contract test first; add behavioral eval facts before editing the prompt, with red/green model evidence produced by the header's baseline/candidate comparison.

**Spec:** doc/specs/2026-10-27-brainstorming-shared-path-candidate.md § "Acceptance criteria" L28-L32, § "Acceptance criteria" L38-L38, § "Design" L43-L43, § "Design" L47-L47, § "Design" L49-L54, § "Design" L57-L57, § "Design" L59-L59, § "Design" L70-L70, § "Design" L74-L78, § "Design" L88-L97, § "Design" L101-L103, § "Design" L103-L103, § "Both engines" L107-L107, § "Errors and edge cases" L111-L111, § "Errors and edge cases" L113-L115, § "Tests" L119-L121, § "Tests" L123-L123, § "Tests" L124-L125, § "Out of scope" L140-L140, § "Out of scope" L142-L142

**Files:**
- Modify: `skills/brainstorming/SKILL.md:157-177`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/brainstorming/results/*/baseline.json`
- Modify: `eval/brainstorming/results/*/candidate.json`
- Modify: `eval/brainstorming/report.md`
- Create: `eval/brainstorming/samples/shared-helper-option/case.md`
- Create: `eval/brainstorming/samples/shared-helper-option/expected.md`
- Create: `eval/brainstorming/samples/moving-parts-design-return/case.md`
- Create: `eval/brainstorming/samples/moving-parts-design-return/expected.md`
- Create: `eval/brainstorming/results/shared-helper-option/baseline.json`
- Create: `eval/brainstorming/results/shared-helper-option/candidate.json`
- Create: `eval/brainstorming/results/moving-parts-design-return/baseline.json`
- Create: `eval/brainstorming/results/moving-parts-design-return/candidate.json`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: eae67c51 pass
- via: `skills/brainstorming/SKILL.md` sections 4-6; `eval/brainstorming/` target through its existing structure assertion.

Decision: Put synthetic helper code under `## Fixture files` inside each `case.md`, not in physical fixture directories - both targets are text targets and `eval/lib/lint.mjs:52-53` rejects physical fixtures for that kind.

Decision: Test continuation carry-forward on generated response text, not on the recorded transcript. End the approved round-one conversation with a request to recap the approved inventory before round two; do not supply Remove/Add imperative wording in that request. This respects the next-response contract in `eval/brainstorming/replay.md:3` while making the round-one inventory's carried form observable in the response.

- [ ] **Step 1: Establish the deterministic preservation check.** Run the task's Tests command. Expect the existing contract and structure checks to pass; do not edit `scripts/brainstorming-contract.test.mjs` or its runner `scripts/ci.mjs`.
- [ ] **Step 2: Add the shared-helper ask and facts.** Create `shared-helper-option/case.md`, following the existing gathered-draft shape. Use synthetic `lib/notify.ts#post`, `jobs/report.ts`, and one other existing caller. Show the helper owning formatting and retries but using a fixed channel, and show the report caller's inline copy. The ask adds a channel override while keeping retry behavior; recorded answers keep framing and permit a backward-compatible optional argument. Supply the traced callers and a `Framing:` holds statement; retain two genuinely distinct viable approaches, rather than making an unrelated workaround the reuse candidate. Add exactly these `judged:` facts to `expected.md`: `reuse-path` names the helper and missing override and proposes changing it; `moving-parts` requires every approach's `Removes:` and `Adds:` before `Pattern:`; `no-copy` forbids a recommended helper copy beside the caller.
- [ ] **Step 3: Add the continuation case and facts.** Create `moving-parts-design-return/case.md` with `replay: continuation`, checklist step 6, and the successful documentation-impact read plus bundled `skills/brainstorming/reference/documentation-impact.md` used by `design-approval-return`. Record the chosen comparison's `Removes: the inline fetch in jobs/report.ts` and `Adds: one optional parameter on post`, completed round-one architecture and approval, and pending round two. Supply acceptance rows for sending to a requested channel and preserving the default when omitted, plus a Design error clause that rejects an empty channel. The final approval asks for the approved inventory recap before round two. Add two `judged:` facts: `carry-forward` checks the response's recap uses `Remove: the inline fetch in jobs/report.ts` and `Add: one optional parameter on post`; `test-per-observable` checks one observable-to-test line for each supplied acceptance row and error clause. Use concrete test names `post_uses_requested_channel`, `post_keeps_default_channel`, and `post_rejects_empty_channel`; assertions inspect generated text, never facts copied solely from the input.
- [ ] **Step 4: Extend only the approach owner's sentences.** Apply `/skill:forge-skill` authoring rules. Preserve `reuse-only option (no new construct)` and every other pinned section-4/5 marker. Ground the reuse candidate in primary-code/caller evidence already gathered; name the path and missing behavior, propose changing it, and retain the reuse-only label for a parameter, branch, or discriminant on that existing construct. Define moving parts as files, types, helpers, signatures, settings, test files, inline copies, and call sites. List the changed part under `Adds:`, not as a new construct; do not impose a one-gap eligibility count. Insert `Removes:` then `Adds:` directly before the existing `Pattern:` line, allowing `Removes: none` and `Adds: none`. Keep the non-viable evidence form; existing-path evidence names its gap, absent-path evidence names paths searched and why none fits, never size/line count alone. Include other callers' blast radius in trade-offs and `Pattern:`.
- [ ] **Step 5: Add the clarity sentence.** Place one sentence after the intact `including supplied presentation details in the design recap` clause. Treat removal as equal in value to addition; recommend the viable reuse candidate unless a named approved requirement excludes it. Forbid copying a nearly-fitting path beside the caller even when cited, preserving the section-4 human/ticket as-framed exception and requiring the duplication in both `Adds:` and `Pattern:`. Remove nothing from either section. Do not introduce a separate deletion-only candidate or PR-specific wording.
- [ ] **Step 6: Add the two design-round sentences.** Round one carries the chosen inventory into Design as exhaustive Remove/Add imperatives; new moving parts outside it go through `reference/amendment-surface.md` before shipping. Round two writes the spec's `## Tests` list using one observable-to-test mapping per acceptance row and per Design edge/error clause; for no testable observable, give the observable followed by `none:` and its reason. Keep both existing approvals and the documentation-impact read.

  The shared closure already indexes these clauses as `Rn`: an unmet removal or substituted copy is `MISSING` or `DRIFTED`; an unlisted construct is `UNAUTHORIZED` with `origin: none (scope creep)`, not the `(over-spec)` exception. `agents/conformance-reviewer.md:33-46` settles this without new machinery. Preserve `writing-plans`, `loop-implementation`, `conformance-check.md`, `spec-council-member.md`, and `test-driven-development` untouched. Waves retain normative `## Spec coverage`; task `Tests:` anchoring is presence, not observable coverage. The `loop-implementer` ledger still indexes acceptance rows only; whole-diff `code-reviewer` and conformance closure enforce the Design contract for both engines.

- [ ] **Step 7: Bind eval intent to the edit.** Update `intent.md` with `## Change` describing this behavior, retaining prior accepted movements without widening them, and `## Expected to move` with `fails -> holds` entries for all five new facts. Compute `for:` using the existing bundle-free assembly, not git HEAD: load `target.json`, pass it and a UTF-8 file reader to `assemble` from `eval/lib/replay.mjs`, then hash with `sha256` from `eval/lib/checks.mjs`. The comparison CLIs are `node eval/run.mjs brainstorming` and `node eval/run.mjs code-reviewer`; the header supplies the seed flags and fixed merge-base `812d46fa`. Preserve `wordCap` 1400. The runner owns new and refreshed `report.md` and record content at verification; include those generated files and both updated intents in the final evidence commit. Task 3 owns the two `eval/brainstorming/README.md` rows.
- [ ] **Step 8: Run green and check instruction style.** Run the task's Tests command again, expecting all contract/structure tests to pass. Read the changed clauses against forge-skill: imperative voice, minimal diff, ASCII punctuation, no duplicated rules. Keep the skill below 500 lines and below the unchanged 50,000-byte / 2,000-line lint; no formatter or extraction is needed. The header-owned `npm test` checks the preserved markers and size limit through `scripts/ci.mjs`. Model red/green comes from real `--baseline-only` records followed by the paired comparison at verification, not fabricated evidence.
- [ ] **Step 9: Commit the owned source and fixture changes.** Stage only this task's instruction, sample, and intent files and commit with `git commit -m "Prefer shared-path changes and carry design inventories"`. Generated records are staged only after the header runs; never create their contents manually.

### Task 2: Enforce the spec-observable test bar in code review

**TDD scenario:** Modifying tested instructions - preserve target structure first; add behavioral facts before the persona bullet, with red/green model evidence produced by the header's baseline/candidate comparison.

**Spec:** doc/specs/2026-10-27-brainstorming-shared-path-candidate.md § "Acceptance criteria" L34-L34, § "Acceptance criteria" L38-L38, § "Design" L82-L84, § "Design" L99-L103, § "Design" L101-L103, § "Design" L103-L103, § "Errors and edge cases" L112-L112, § "Tests" L122-L122, § "Tests" L126-L127

**Files:**
- Modify: `agents/code-reviewer.md:17-27`
- Modify: `eval/code-reviewer/samples/duplicate-tests-diff/expected.md`
- Modify: `eval/code-reviewer/intent.md`
- Modify: `eval/code-reviewer/results/*/baseline.json`
- Modify: `eval/code-reviewer/results/*/candidate.json`
- Modify: `eval/code-reviewer/report.md`
- Create: `eval/code-reviewer/samples/spec-observable-tests/case.md`
- Create: `eval/code-reviewer/samples/spec-observable-tests/expected.md`
- Create: `eval/code-reviewer/results/spec-observable-tests/baseline.json`
- Create: `eval/code-reviewer/results/spec-observable-tests/candidate.json`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: eae67c51 pass
- via: `agents/code-reviewer.md` Tests priority; `eval/code-reviewer/` structure through `lintAll`.

Decision: Use `duplicate-tests-diff`, leaving `oversized-fixture-diff` and `wrong-layer-rspec` unchanged. Its `case.md:1-4` supplies requirements but no spec, and its existing `expected.md:1-5` already protects the Minor economy checks. Add only one fact to that expected file.

- [ ] **Step 1: Run existing structural tests.** Run the task's Tests command; expect every committed target to pass. Preserve all existing sample facts.
- [ ] **Step 2: Add the spec-backed reviewer fixture.** Create `spec-observable-tests/case.md` in the existing review-template shape with `SCOPED_TEST_COMMANDS: none` and synthetic Python diff text. Define `render_label(name)` returning a stripped nonempty label, preserving empty input as empty, with existing case preservation. Supply `## Acceptance criteria` committing the stripped-label result and `## Design` with `Keep:` preserving empty input. Add three tests: `test_label_trims_outer_space` cites the acceptance row; `test_label_keeps_empty` cites the preservation clause; `test_label_keeps_mixed_case` proves behavior mentioned only in DESCRIPTION, with no spec justification. Keep setups minimal and nonduplicated so only the third test triggers the new rule. Add three judged facts: `uncommitted-delete` requires a `[Moderate]` `delete:` finding for the third test citing the searched spec section; `acceptance-kept` forbids deleting the first; `preservation-kept` forbids deleting the second. Neither justified test is exempt from ordinary correctness/economy checks beyond the new spec-observable rule.
- [ ] **Step 3: Extend the no-spec expectation.** Append `no-spec-unverified` as one `judged:` fact to `duplicate-tests-diff/expected.md`: the report says `unverified: no spec supplied` and no `delete:` finding cites a spec section. Keep all existing Minor shrink/lost-coverage checks and smoke/self-check protection intact; absent spec is not an empty observable set.
- [ ] **Step 4: Add exactly one Tests bullet.** Apply forge-skill persona rules with frontmatter and unrelated lines byte-identical. Start the added bullet with explicit `[Moderate]` severity so it overrides the checklist's existing Minor default without moving the Critical lost-coverage bullet. Require reading the supplied spec's `## Acceptance criteria` and `## Design` first, through the requirements block or the spec path it supplies. Require `delete:` with a searched-section citation for a test proving none of their observables. Exempt only a justification citing its approved acceptance row or Design clause, including a preservation `Keep:` or edge rule; a task-summary behavior is not a commitment, and genuinely new behavior needs the existing scope decision. Without a spec report `unverified: no spec supplied`, retain the old economy checks, and keep the single smoke test or `assert` self-check deletion exemption. `[Moderate]` yields `FIX_FIRST`, not a declinable `[Minor]` suggestion. Remove nothing and add no skill invocation or reference-file machinery to the persona.
- [ ] **Step 5: Bind reviewer intent and evidence.** Update `intent.md`'s `for:` from the existing bundle-free `assemble`/`sha256` functions, preserving prior accepted facts, and add a `## Change` paragraph plus `## Expected to move` `fails -> holds` entries for the three new sample facts and `no-spec-unverified`. The comparison CLIs are `node eval/run.mjs brainstorming` and `node eval/run.mjs code-reviewer`; the header supplies `--baseline-only` and comparison against `812d46fa`. Inspect all after-values and existing-sample regressions, not just the exit label. Keep brainstorming's `wordCap` 1400 and its `eval/brainstorming/README.md` rows outside this task; no widening of `intent.md` is an allowed fix. Commit generated `report.md`, records, and both targets' intents after verification. No code-reviewer README change is required: the spec's two README rows are the two new brainstorming samples.
- [ ] **Step 6: Run green and check persona style.** Run the task's Tests command again; expect all tests to pass. Read the one added bullet against forge-skill's imperative, minimal-diff, and ASCII rules; confirm frontmatter, verdict parsing, `Behaviour-change:` footer, and the smoke/`assert` exemption remain intact. No configured Markdown format command exists.
- [ ] **Step 7: Commit the owned source and fixture changes.** Stage this persona, the new case and facts, the extended no-spec expected file, and intent. Commit with `git commit -m "Reject tests without a spec-committed observable"`; leave generated record content to the header's runner and final evidence commit.

## Wave 2 - Documentation

Depends on Wave 1: document the delivered rules and the exact sample names. Keep the hub-doc edits in this single trailing doc-only task.

### Task 3: Document the new contract and sample coverage

**TDD scenario:** Trivial documentation change - use judgment; no new tests.

**Spec:** doc/specs/2026-10-27-brainstorming-shared-path-candidate.md § "Design" L103-L103, § "Documentation impact" L131-L134

**Files:**
- Modify: `eval/brainstorming/README.md:12-28`
- Modify: `CHANGELOG.md:1-3`

**Tests:**
- none: documentation and sample index only; header verification owns repository checks.

- [ ] **Step 1: Add the two sample rows.** Add `shared-helper-option` for helper/gap reuse, moving-part line order, and no-copy recommendation, and `moving-parts-design-return` for carried Remove/Add imperatives and per-observable tests. Keep descriptions honest about tool-free next-response evidence, not actual spec writes. These are the only two README rows; the three new sample directories, one existing reviewer fact, and two `intent.md` updates belong to Tasks 1 and 2.
- [ ] **Step 2: Add the changelog entry.** Create `## Unreleased` and `### Changed` above the first release heading in `CHANGELOG.md`. Describe shared-path changes over copies, `Removes:`/`Adds:` becoming Design imperatives, and `[Moderate]` `delete:` for tests lacking a spec-named observable with no-spec unverified handling. Do not change the version or release headings.
- [ ] **Step 3: Review documentation scope.** Preserve `eval/README.md` and root `README.md`; their procedures and the statement that each approach ends in `Pattern:` remain true. The sample rows amend `eval/brainstorming/README.md` as implementation surface only, not its eval procedure. No introduced or invalidated memory docs are required.
- [ ] **Step 4: Commit.** Run `git add eval/brainstorming/README.md CHANGELOG.md` and `git commit -m "Document shared-path design and reviewer test economy"`. The verify phase then executes the header and includes generated eval records/reports in the final change before finish; mark the commit body as a behavior-changing instruction edit, not a wording-only exemption.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L28-L32 | Name the shared helper/gap; moving-part line order, no-copy recommendation with as-framed exception; round-one inventory and round-two tests | Task 1 |
| § "Acceptance criteria" L34-L34 | Read spec observables; Moderate delete with cited exemption and no-spec fallback | Task 2 |
| § "Acceptance criteria" L36-L36 | Bundled checks pass with preserved contract markers and size lint | Verification |
| § "Acceptance criteria" L38-L38 | Both full-target comparisons show new facts holding, no existing regression, and current committed evidence | Task 1, Task 2 |
| § "Design" L43-L43 | No new reference or downstream reader; engines and contract test stay untouched | Task 1 |
| § "Design" L47-L47 | Ground reuse in traced paths, name gap and changed part, no eligibility count; define every moving-part kind | Task 1 |
| § "Design" L49-L54 | Add ordered Removes/Adds lines before Pattern | Task 1 |
| § "Design" L57-L57 | Removal equals addition; prefer viable reuse; retain the human/ticket as-framed exception | Task 1 |
| § "Design" L59-L59 | Nonviability needs path/gap or searched paths, never size alone; include caller blast radius | Task 1 |
| § "Design" L70-L70 | Remove nothing; add the reuse clause, inventory lines, and one clarity sentence | Task 1 |
| § "Design" L74-L78 | Carry exhaustive Remove/Add inventory; amend unlisted moving parts; existing closure reports unmet and unauthorized constructs | Task 1 |
| § "Design" L74-L78 | One observable-to-test mapping per acceptance row and Design edge/error; no-test reason when none applies | Task 1 |
| § "Design" L74-L78 | Remove nothing; add one sentence per design round | Task 1 |
| § "Design" L82-L84 | Read acceptance and Design before deleting unmatched tests; cite section and spec-backed justification | Task 2 |
| § "Design" L82-L84 | Summary-only behavior is not a commitment; preserve no-spec, smoke/self-check, and Moderate FIX_FIRST rules | Task 2 |
| § "Design" L82-L84 | Remove nothing; add one reviewer bullet | Task 2 |
| § "Design" L88-L97 | Add synthetic gathered-helper sample with reuse-path, moving-parts, and no-copy judged facts | Task 1 |
| § "Design" L88-L97 | Add approved-round-one continuation sample with carry-forward and test-per-observable judged facts | Task 1 |
| § "Design" L99-L103 | Add spec-backed reviewer sample with justified acceptance/preservation tests and unjustified summary-only test; extend one no-spec fact | Task 2 |
| § "Design" L101-L103 | Update intent SHA and expected moves, seed and compare against the fixed merge-base, commit generated evidence, never widen intent for regressions | Task 1, Task 2 |
| § "Design" L103-L103 | Remove nothing; add three sample directories, one existing fact, two intents and two README rows | Task 1, Task 2, Task 3 |
| § "Both engines" L107-L107 | Planning inventories are normative clauses, loop ledger stays AC-only, shared whole-diff closure enforces both | Task 1 |
| § "Errors and edge cases" L111-L111 | Empty inventories are valid; no penalty for removing nothing | Task 1 |
| § "Errors and edge cases" L112-L112 | Spec-cited exemptions only; summary-only does not count; absent spec reports unverified | Task 2 |
| § "Errors and edge cases" L113-L115 | Existing amendment/redraw and PR behavior unchanged; preserve contract markers and size limits | Task 1 |
| § "Tests" L119-L121 | Shared-helper facts exercise path/gap, line order and recommendation | Task 1 |
| § "Tests" L122-L122 | Reviewer deletes a test lacking a named observable with a spec-section citation | Task 2 |
| § "Tests" L123-L123 | Contract and size checks remain green | Task 1 |
| § "Tests" L124-L125 | Continuation facts exercise inventory carry-forward and observable-to-test mappings | Task 1 |
| § "Tests" L126-L127 | Preservation tests survive; no-spec review is unverified without false citations | Task 2 |
| § "Documentation impact" L131-L134 | Unreleased Changed entry; no new user guide or memory docs; procedure/root README unchanged | Task 3 |
| § "Out of scope" L140-L140 | Removes line carries deletion value without a separate deletion-only candidate | Task 1 |
| § "Out of scope" L141-L141 | No numeric test/code ratio | waived: explicitly excluded by spec |
| § "Out of scope" L142-L142 | Leave planning, loop, conformance, council and TDD owners and the contract test unchanged | Task 1 |
| § "Out of scope" L143-L143 | TDD root-cause work requires a separate brainstorm | waived: explicitly excluded by spec |
