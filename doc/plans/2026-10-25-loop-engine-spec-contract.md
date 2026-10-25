# Drafted Acceptance Criteria Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Give ticketless and fetched-without-AC brainstorms design-derived acceptance rows that the existing approval gate ratifies, without changing ticket-row fidelity.

**Architecture:** Keep row production in brainstorming's main-loop spec-writing step. Use the section's provenance header to distinguish editable pre-approval drafted rows from immutable ticket rows, and render drafted rows directly from the applied spec at the gate. Preserve the row-indexed loop engine and its ledger contract.

**Tech Stack:** Markdown skills and personas, Node.js node:test contract tests, existing text-replay eval harness.

**Spec:** `doc/specs/2026-10-25-loop-engine-spec-contract.md`

**Verification:** `npm test` && `node eval/run.mjs brainstorming` && `node eval/run.mjs spec-gate` - per AGENTS.md; the first command bundles repository lint and deterministic tests, the remaining commands write the required full-target replay reports.

---

## Files

**Modify - instruction owners and deterministic tests:**
- `skills/brainstorming/reference/ticket-acceptance.md`
- `skills/brainstorming/reference/spec-finalization.md`
- `skills/brainstorming/reference/pr-subject.md`
- `skills/brainstorming/reference/amendment-surface.md`
- `skills/brainstorming/SKILL.md`
- `skills/roasting-the-spec/SKILL.md`
- `agents/spec-council-applier.md`
- `scripts/brainstorming-contract.test.mjs`

**Create - replay inputs and generated records:**
- `eval/brainstorming/samples/drafted-ac-rows/case.md`
- `eval/brainstorming/samples/drafted-ac-rows/expected.md`
- `eval/spec-gate/samples/drafted-rows-block/case.md`
- `eval/spec-gate/samples/drafted-rows-block/expected.md`
- `eval/brainstorming/results/drafted-ac-rows/baseline.json`
- `eval/brainstorming/results/drafted-ac-rows/candidate.json`
- `eval/spec-gate/results/drafted-rows-block/baseline.json`
- `eval/spec-gate/results/drafted-rows-block/candidate.json`

**Modify - existing replay inputs, intent, and generated evidence:**
- `eval/brainstorming/samples/loop-gate/case.md`
- `eval/brainstorming/samples/loop-gate/expected.md`
- `eval/brainstorming/samples/pr-subject-resolution/case.md`
- `eval/brainstorming/samples/pr-subject-resolution/expected.md`
- `eval/brainstorming/samples/pr-subject-rule-added-later/case.md`
- `eval/brainstorming/samples/pr-subject-rule-added-later/expected.md`
- `eval/brainstorming/intent.md`
- `eval/spec-gate/intent.md`
- `eval/brainstorming/results/*/*.json` (existing records regenerated only when the harness changes them)
- `eval/spec-gate/results/*/*.json` (existing records regenerated only when the harness changes them)
- `eval/brainstorming/report.md`
- `eval/spec-gate/report.md`

**Modify - operations documentation:**
- `doc/configuration.md`

**Delete:** none.

## Recon and verification boundaries

- `skills/brainstorming/SKILL.md:51-64` already routes step 7 through spec-finalization; add drafting inside that reference's step 2 rather than introducing another step or a worker. The redraw classifier at `skills/brainstorming/SKILL.md:233-239` must recognize approved drafted-row identity changes before the generic inside-one-component amend rule.
- `ticket-acceptance.md:1-27` owns extraction, provenance, dispositions, and the cut question. `spec-finalization.md:5-52` owns write/lint order; `:111-181` owns gate rendering and reply handling.
- `scripts/brainstorming-contract.test.mjs:79-96` pins ticket markers and gate order; `:365-391` pins loop routing and ledger amendment ordering. Its existing node:test entrypoint is file-addressable. `eval/lib/lint.test.mjs:74-77` validates every committed target through lintAll/lintTarget.
- `package.json:63-69` exposes no standalone format or lint script. `scripts/ci.mjs:126-147, 504-551` owns repository instruction lint; no Markdown formatter is configured. Use manual Markdown format review and `node --check scripts/brainstorming-contract.test.mjs` for the changed JavaScript. Task tests exercise touched instruction contracts; full repository checks stay in the header.
- `eval/run.mjs:159-230` resolves the merge-base, validates structure/hygiene/intent, and assembles each sample. It accepts target/sample names, not file-addressed test inputs, so model replays belong to header verification. Commit generated records and reports after that verification; never fabricate them. Keep unrelated existing eval facts and accepted intent moves unchanged.
- The overrides contain no Happy path or Deployment table. This is one change with no independently deployable intermediate state. No happy-path header is selected.

## Baseline provenance

Initial inventory on `3e8425da`: `?? doc/plans/2026-10-25-loop-engine-spec-contract.md`. Admitted exactly that plan path and the approved spec path `doc/specs/2026-10-25-loop-engine-spec-contract.md`; the spec had no status entry. No other paths were dirty. Task 1 executed 29 tests and Task 2 executed 14 tests, all passing. After each command HEAD remained `3e8425da` and the inventory remained the single untracked plan; no generated artifacts or source contamination appeared.

## Wave 1 - Row ownership and ratification

### Task 1: Draft rows and ratify them at the existing gate

**TDD scenario:** Modifying tested code - run existing tests first, add failing contract assertions, then change the instruction owners.

**Spec:** doc/specs/2026-10-25-loop-engine-spec-contract.md § "Problem" L16, § "Row drafting at spec-writing (brainstorming step 7)" L30-L33, § "Row drafting at spec-writing (brainstorming step 7)" L35, § "Row drafting at spec-writing (brainstorming step 7)" L37, § "Row drafting at spec-writing (brainstorming step 7)" L39, § "Ownership and critique" L43, § "Ownership and critique" L45, § "Ownership and critique" L47, § "Gate rendering and routing" L51, § "Gate rendering and routing" L53, § "Gate rendering and routing" L55-L62, § "Gate rendering and routing" L64, § "Gate rendering and routing" L66, § "What does not change" L70, § "Tests" L81-L82, § "Out of scope" L90-L91, § "Out of scope" L94

**Files:**
- Modify: `skills/brainstorming/reference/ticket-acceptance.md:1-27`
- Modify: `skills/brainstorming/reference/spec-finalization.md:5-181`
- Modify: `skills/brainstorming/reference/pr-subject.md:15-17`
- Modify: `skills/brainstorming/reference/amendment-surface.md:3-7`
- Modify: `skills/brainstorming/reference/amendment-surface.md:145`
- Modify: `skills/brainstorming/SKILL.md:233-239`
- Modify: `skills/roasting-the-spec/SKILL.md:70-83`
- Modify: `skills/roasting-the-spec/SKILL.md:112-126`
- Modify: `skills/roasting-the-spec/SKILL.md:155-170`
- Modify: `agents/spec-council-applier.md:28-48`
- Modify: `scripts/brainstorming-contract.test.mjs:79-106`
- Modify: `scripts/brainstorming-contract.test.mjs:365-391`
- Test: `scripts/brainstorming-contract.test.mjs`

**Tests:**
- `node --test scripts/brainstorming-contract.test.mjs`
- baseline: 3e8425da pass
- via: `ticket-acceptance.md`, `spec-finalization.md`, `roasting-the-spec/SKILL.md`, `agents/spec-council-applier.md`, and `reference/amendment-surface.md` instruction contracts

Decision: Append a separate main-loop repair audit line after the existing commit-body audit, without altering its council cluster lines or counts - `spec-finalization.md:108-115` persists the returned audit verbatim and `agents/spec-council-applier.md:15-23` reserves its three labels for council dispositions. Use `Drafted AC repair: restored acceptance rows from the applied Design.` for a successful repair. On the worker path append it to the otherwise empty body. This implements the spec's audit requirement without fabricating a council finding.

- [ ] **Step 1: Run the existing scoped contract tests.**

  Run: `node --test scripts/brainstorming-contract.test.mjs`

  Expected: exit 0 and a nonzero passing test count before editing.

- [ ] **Step 2: Extend marker assertions and add ownership regressions.**

  In `scripts/brainstorming-contract.test.mjs:79`, retain `none - no ticket`, `none - ticket has no acceptance criteria`, `none - ticket not fetched (<reason>)`, and `Never author acceptance criteria`; require `Drafted from the design`. In the gate-template test at `scripts/brainstorming-contract.test.mjs:89-96`, assert strict order of `Spec written and committed to`, `Scope cuts:`, `Drafted acceptance criteria (approval ratifies):`, and `Council:`. In `scripts/brainstorming-contract.test.mjs:365`, replace the old `none -` gate marker with the exact phrase zero `- [ ]` rows, keep `render only options 1-3`, and require `Loop engine unavailable`.

  Add contract cases for three legal section forms, reapplying the whole body predicate after council, integrity preservation and clarification instead of empty drafting, drafted-only A/B/C cut handling, council deletion tied to the Design commitment, and approved drafted-row text/add/remove routing to redraw. Assert protections in the actual member/chair/applier task strings and applier body, not unrelated prose. Keep the existing frontmatter equality assertion and ticket repair markers intact.

- [ ] **Step 3: Confirm the new assertions fail on the old instructions.**

  Run: `node --test scripts/brainstorming-contract.test.mjs`

  Expected: drafted-provenance, ratification-block, legal-body, and ownership assertions fail; existing ticket contracts still pass.

- [ ] **Step 4: Branch row production in the ticket contract and spec-writing owner.**

  Scope the existing ticket-only sentences in `ticket-acceptance.md` to the `Ticket` provenance header: ticket rows still name the ticket contract only and never change text. Preserve extraction, dispositions, council snapshot, and the full A/B/C/D cut question including cancellation, re-fetch, and re-extraction. Keep "Never author acceptance criteria on the ticket's behalf" for that case.

  Add a four-row table keyed on the gathered result: extracted ticket rows remain unchanged; `none - ticket not fetched (<reason>)` stays unchanged with the paste-rows affordance; `none - no ticket` drafts under `Drafted from the design, no ticket rows:`; `none - ticket has no acceptance criteria` drafts under the ticket-specific header. For example, fetched ticket #42 without ACs uses `Drafted from the design, ticket #42 has no acceptance criteria:`. Pasted rows are ticket rows and never trigger drafting. Never append `## Spec contract` or Design-derived rows to a ticket-row section.

  In spec-finalization's step 2, after the mandatory draft read and before the full replacement write, apply this branch from the approved two-round design plus original prompt. Keep `## Acceptance criteria` after Problem, with one `- [ ]` row per observable outcome and default `in-scope`; retain environment-bound pre-production proof as a venue disposition. Spec, plan, changelog, and telemetry artifacts are never outcome rows.

- [ ] **Step 5: Add inline integrity recovery and the drafted cut question.**

  Apply the five classes from `skills/shape-ticket/SKILL.md:146-173` inline, without invoking ticket shaping. Rewrite wishful and tautological proof to the design's observable, using only design-sourced baseline, target, measurement, or enumerated set. Resolve unspecified-but-binding values from Design and record the resolution there. Ask for an external yardstick or missing value before writing; never invent values or silently remove an outcome. Preserve behavioral binary outcomes without demanding an invented numeric baseline.

  Rewrite post-deployment language to its pre-production observation when available; keep environment-bound `venue:` requirements. Move production-only observations to a tracked, non-blocking `Post-deployment housekeeping` Design clause, never an AC row. A user cut or clarification scope decision is the only route out of in-scope outcomes; record `deviates:`/`deferred:` and an `## Out of scope` entry so `Scope cuts:` discloses it. With no valid row remaining, stop for clarification or an explicit scope decision before writing; never emit a `none` fallback.

  Drafted rows use the existing questionary format with A) in-scope reading, B) deviation reason, C) deferred destination; omit D because there is no ticket contract or snapshot to repair. Recommend A, never B/C. Preserve the full question and answer in council `Human input`. Ticket rows keep their existing D option and repair procedure byte-for-byte.

- [ ] **Step 6: Narrow the unbound-PR rule and protect approved row identity.**

  In `reference/pr-subject.md`, keep title/body as stated intent, not invented ACs; retain the gather-time no-ticket result but send spec-writing to the drafted branch using the agreed rework design. Preserve bound-ticket extraction, PR filename, and Rework record grammar.

  In `skills/brainstorming/SKILL.md`'s classifier and `reference/amendment-surface.md`, classify changing approved drafted row text, adding a row, or removing one as redraw before any standing grant applies. Re-draft from the new design and ratify at the full gate; never reconcile these changes as a disposition amendment. Keep acceptance criteria human-owned. Disposition-only changes retain the cut question and amendment grammar: `deviates:`/`deferred:` maps to ledger `cut`; re-bounded done rows become `open`. Options 1/4 retain review and 2/5 retain auto-apply amendments, but neither grant authorizes a redraw. In the ledger aftermath generalize the ticket-only text freeze to both ticket and approved drafted rows; preserve attempts and iterations.

- [ ] **Step 7: Carry drafted-row ownership through council dispatch.**

  Keep drafted rows out of `Human input (verbatim; off-limits for over-spec)` in `spec-finalization.md` and `/skill:roasting-the-spec`; original prompt, ticket snapshot, existing PR input, and human scope answers retain today's transport. Add the drafted-row rule to member, chair, and applier task text in `roasting-the-spec/SKILL.md`, and to `agents/spec-council-applier.md`'s over-spec instructions. Drafted rows are spec requirements and can be rewritten pre-approval only for integrity. Delete a drafted row only after the Design commitment it observes was cut through the user's scope-decision procedure; quoting the row alone never permits deletion or replacing the section with `none`. The applier does not become a drafter.

  Follow forge-skill authoring/persona rules: imperative wording, smallest changed units, no provider/model literals, no added skill machinery in the persona, byte-identical persona frontmatter. Preserve `/skill:roasting-the-spec` dispatch shapes and audit contract.

- [ ] **Step 8: Replace the legal-body predicate and repair invalid council results.**

  Keep the pinned title `Ticket contract present` (`scripts/ci.mjs:260`); replace the predicate at `spec-finalization.md:49` with exactly three forms: ticket provenance with verbatim rows and dispositions; drafted provenance with at least one checkbox row and a disposition on every row; or the single not-fetched line. Reject `none - no ticket` and `none - ticket has no acceptance criteria` as final bodies.

  After critique, reapply the same whole-section predicate alongside placeholder/header checks; a correct header with zero rows still fails. The main loop repairs from the applied Design by re-drafting at least one valid row and appending its repair audit line. With no valid outcome, obtain clarification or an explicit scope decision before the gate. Keep the mandatory post-applier read and existing grant-header predicate ordering.

- [ ] **Step 9: Render ratification from the applied spec and preserve gate routes.**

  In `spec-finalization.md:143`, use zero `- [ ]` rows under `## Acceptance criteria` to render only options 1-3 and the exact explanation `Loop engine unavailable: this spec has no acceptance-criteria rows.` The only legal zero-row body is not-fetched. Render options 4/5 whenever rows exist; preserve worker-path omission of option 3.

  Add the drafted-only template slot after `Scope cuts:` and before `Council:`, headed `Drafted acceptance criteria (approval ratifies):`. Copy every row and disposition verbatim from the applied section, never from the summarizer. A fetched ticket without rows gets this block; a ticket with rows never does. Reply `3` reuses it verbatim with the briefing; a row-touching change request re-renders from the recommitted section; a redraw re-renders from the re-drafted section. Keep summarizer inputs and ticket gate rendering otherwise unchanged; add no pre-gate acceptance stop.

- [ ] **Step 10: Run scoped tests to green.**

  Run: `node --test scripts/brainstorming-contract.test.mjs`

  Expected: all contract cases pass, including old ticket markers and the full repair branch.

- [ ] **Step 11: Format and lint the owned files.**

  Run: `node --check scripts/brainstorming-contract.test.mjs`

  Expected: exit 0. Review compact Markdown tables, two-space disposition indentation, fences, and portable links. Use contract-test size checks; preserve standard Project overrides endings and persona frontmatter.

  Leave `extensions/lib/plan-check.ts` (`checkLedger`), ledger grammar, `skills/loop-implementation/SKILL.md`, `agents/loop-implementer.md`, `conformance-check.md`, and the finish skill's PR-body AC block unchanged. Header-agnostic readers need no provenance logic. Do not edit the predecessor spec or add a supersession banner.

- [ ] **Step 12: Commit the instruction and contract-test change.**

  Stage only this task's Modify paths with `git add`; use `git commit -m "Draft and ratify design acceptance rows"`. Record in the body that this changes agent behavior and that the named eval fixtures and final reports follow before finish.

## Wave 2 - Replay evidence

Depends on Wave 1: replay cases exercise the final generation, approval, and redraw contracts. Keep target/report writes in one task because each target run shares its intent and report files.

### Task 2: Add drafted-row replay cases and update ticketless regressions

**TDD scenario:** Trivial change - fixture and intent updates use structural tests; model comparisons run at verification.

**Spec:** doc/specs/2026-10-25-loop-engine-spec-contract.md § "Tests" L83-L84

**Files:**
- Create: `eval/brainstorming/samples/drafted-ac-rows/case.md`
- Create: `eval/brainstorming/samples/drafted-ac-rows/expected.md`
- Create: `eval/spec-gate/samples/drafted-rows-block/case.md`
- Create: `eval/spec-gate/samples/drafted-rows-block/expected.md`
- Create: `eval/brainstorming/results/drafted-ac-rows/baseline.json`
- Create: `eval/brainstorming/results/drafted-ac-rows/candidate.json`
- Create: `eval/spec-gate/results/drafted-rows-block/baseline.json`
- Create: `eval/spec-gate/results/drafted-rows-block/candidate.json`
- Modify: `eval/brainstorming/samples/loop-gate/case.md`
- Modify: `eval/brainstorming/samples/loop-gate/expected.md`
- Modify: `eval/brainstorming/samples/pr-subject-resolution/case.md`
- Modify: `eval/brainstorming/samples/pr-subject-resolution/expected.md`
- Modify: `eval/brainstorming/samples/pr-subject-rule-added-later/case.md`
- Modify: `eval/brainstorming/samples/pr-subject-rule-added-later/expected.md`
- Modify: `eval/brainstorming/intent.md`
- Modify: `eval/spec-gate/intent.md`
- Modify: `eval/brainstorming/results/*/*.json`
- Modify: `eval/spec-gate/results/*/*.json`
- Modify: `eval/brainstorming/report.md`
- Modify: `eval/spec-gate/report.md`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 3e8425da pass
- via: `lintTarget`/`lintAll` over `eval/brainstorming` and `eval/spec-gate`; text replay through the header's two target commands

Decision: Represent the spec's five cells as five independent labeled scenarios in one `drafted-ac-rows` case, with separate judged facts - `eval/brainstorming/samples/pr-subject-resolution/case.md:7-12` uses independent branches, and `eval/run.mjs` has no nested-cell schema. Add `bundle+: skills/brainstorming/reference/pr-subject.md` to the new case for its PR scenario; leave target.json and existing sample assembly drops unchanged.

- [ ] **Step 1: Run existing eval structure tests.**

  Run: `node --test eval/lib/lint.test.mjs`

  Expected: exit 0, including committed-target lint.

- [ ] **Step 2: Write five draft-source scenarios and facts.**

  Create `drafted-ac-rows` under `eval/brainstorming`. Use `replay: continuation` and `## Narrated read actions` to request labeled spec sections/actions from supplied observations without live tools. Each scenario has a complete approved design, no unresolved values, and one or two binary user-observable outcomes.

  Fixed cases: (a) no ticket, design says a repeated export request returns its existing download rather than creating another export; require `Drafted from the design, no ticket rows:`, at least one `- [ ]` outcome row, all `in-scope`, no mechanism-only row; (b) ticket #42 carries `- [ ] Retry delay stays bounded.` under Acceptance criteria, require exact ticket provenance/row and no drafted text; (c) whole-ticket fetch failed with reason permission denied, require `none - ticket not fetched (permission denied)` unchanged and no invented rows; (d) fetched ticket #43 has no AC section, with the approved export design, require `Drafted from the design, ticket #43 has no acceptance criteria:`, verbatim gate block and options 4/5; (e) unbound PR #61 has broad cache intent but agreed rework prevents cross-tenant cache results, require design-derived isolation rows under the no-ticket drafted header, not title/body-derived assertions. The not-fetched template remains `none - ticket not fetched (<reason>)`; never substitute the old `none - no ticket` case.

  Use separate judged fact IDs `free-text`, `ticket`, `not-fetched`, `empty-ticket`, and `unbound-pr`. Scope absence/presence to each labeled branch so one branch's drafted text cannot satisfy or fail another branch's fact.

- [ ] **Step 3: Replace the obsolete loop-gate no-ticket input.**

  Retain the ticket gate and reply-4 continuation in `loop-gate/case.md`. Replace the independent single no-ticket sentinel with two complete sections: a drafted-row spec with export outcome and disposition, and a not-fetched zero-row spec. Require the drafted block verbatim with five options for the first, and options 1-3 plus unavailable line for the second. Rewrite `loop-gate/no-ac` to name only not-fetched; add a `drafted` fact. Keep `menu` and `loop` assertions.

- [ ] **Step 4: Update unbound-PR facts without weakening ticket regression.**

  In `pr-subject-rule-added-later/case.md`, explicitly state the approved tenant-isolation observable implied by its cache-key repair. Replace `pr-subject-rule-added-later/no-ticket` (currently `mechanical: contains "none - no ticket"`) with a judged fact requiring drafted provenance and the design-derived isolation outcome.

  In `pr-subject-resolution/case.md`, supply agreed rework for Open: failed requests retry with a bounded delay; successful requests do not retry. Distinguish early classification from later spec-writing. Rewrite `pr-subject-resolution/open` (currently carries `none - no ticket` into ACs) to retain PR-head/filename/intent assertions and expect design-derived rows under `Drafted from the design, no ticket rows:`. Leave `pr-subject-resolution/issue` and its ticket row unchanged. Preserve Bound and all classification/foreign-repo facts.

- [ ] **Step 5: Add the paired gate-render sample.**

  Create `drafted-rows-block` under `eval/spec-gate`, using existing pre-read briefing, audit, spec-commit, and user-reply sections. Supply two labeled applied specs: drafted with two fully spelled-out export outcomes and `in-scope` dispositions, and ticket with verbatim rows. Request independent gates with reply 1; keep combined output within the existing 1200-word cap.

  Facts require exact drafted row/disposition copying under `Drafted acceptance criteria (approval ratifies):`, after `Scope cuts:` and before `Council:`, five options, and no drafted block for the ticket-row gate. Retain briefing and council-count expectations; use judged branch-scoped facts rather than a global lacks check across both gates.

- [ ] **Step 6: Update intent bindings and expected moves.**

  Add the drafted-row change to each `intent.md`; explicitly name `loop-gate/no-ac`, `pr-subject-rule-added-later/no-ticket`, and `pr-subject-resolution/open`. Retain prior accepted moves and unrelated rationale. Add new facts and the drafted loop-gate fact with intended fails-to-holds direction; never accept unplanned regressions. Compute each bundle-free `for:` hash using `assemble` and `sha256` from `eval/lib/replay.mjs` and `eval/lib/checks.mjs`, matching the per-file loop in `eval/run.mjs:190-211`; do not guess a SHA or use a Git commit SHA.

  The header model runs generate baseline/candidate files, refresh stale existing records, and write full reports. Retain and commit those outputs before finish. A nonzero replay result is a verification failure, not permission to widen intent or change unrelated samples. Text replay demonstrates supplied-observation behavior, not actual writes or live gate execution.

- [ ] **Step 7: Validate fixture structure and format.**

  Run: `node --test eval/lib/lint.test.mjs`

  Expected: exit 0 for all targets. Review stable unique IDs, exact rows, compact Markdown, synthetic names, no private paths, and valid leading bundle lines. Introduce no formatter or lint runner.

- [ ] **Step 8: Commit the authored replay changes.**

  Stage the listed sample and intent files with `git add`; use `git commit -m "Cover drafted acceptance rows in replay cases"`. Stage generated records/reports only after header verification produces them, never authored substitutes. Mark the final behavior-change commit with both committed report paths for conformance.

## Wave 3 - Operations documentation

Depends on Waves 1-2: document the implemented availability rule. This trailing doc task owns no instruction, sample, or report file.

### Task 3: Explain drafted-row loop availability

**TDD scenario:** Trivial change - documentation only.

**Spec:** doc/specs/2026-10-25-loop-engine-spec-contract.md § "Documentation impact" L74, § "Documentation impact" L77

**Files:**
- Modify: `doc/configuration.md:71-75`

**Tests:**
- none: operations documentation; no configured Markdown formatter

- [ ] **Step 1: Replace the stale availability sentence in Loop engine operations.**

  Replace "Specs without AC rows do not offer loop options" with the implemented rule: options 4/5 appear for ticket and drafted rows; ticketless and fetched-without-AC specs get design-derived rows, shown verbatim and ratified by approval; only not-fetched leaves the loop unavailable. State that approved drafted-row text/membership changes require redraw and full ratification while dispositions keep the amendment route. Preserve surrounding option/grant descriptions and the link to `doc/implement-engines.md`.

- [ ] **Step 2: Review the paragraph and exclusions.**

  Confirm its link resolves and examples match the gate's three legal forms. Keep `README.md` and `doc/implement-engines.md` unchanged because their workflow/ledger statements remain true. Leave `CHANGELOG.md` to release as directed. Add no guide, predecessor edit, or supersession banner.

- [ ] **Step 3: Commit the operations update.**

  Run `git add doc/configuration.md`, then `git commit -m "Explain loop availability for drafted acceptance rows"`.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Problem" L16 | Draft only without ticket rows; preserve ticket fidelity and omit drafted block for ticket rows | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L30-L33 | Extracted ticket rows and dispositions remain verbatim | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L30-L33 | Not-fetched body and paste-ticket-rows affordance remain unchanged | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L30-L33 | No-ticket result becomes design-drafted rows with provenance | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L30-L33 | Fetched-without-AC result becomes ticket-specific drafted provenance | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L35 | Derive one observable outcome per row from two-round design plus prompt; no mechanisms or workflow artifacts | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L35 | Default in-scope and preserve environment-bound pre-production proof and disposition grammar | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L35 | Drafted cuts use A/B/C only; ticket cuts retain D and re-fetch; carry full human question and answer | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | Apply five integrity classes inline and preserve committed outcomes when rewriting proof | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | Rewrite wishful/tautological proof only from design-grounded measurements | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | Resolve binding values in Design; clarify missing inputs before writing without inventing or dropping outcomes | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | Prefer pre-production observations; production-only housekeeping remains tracked and non-blocking | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | Cuts require user scope decisions, dispositions, out-of-scope recording and gate disclosure | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L37 | No valid drafted row means clarification/scope decision, never an empty fallback | Task 1 |
| § "Row drafting at spec-writing (brainstorming step 7)" L39 | Unbound PR rows come from rework design rather than title/body carry-over | Task 1 |
| § "Ownership and critique" L43 | Provenance header owns ticket immutability versus pre-approval integrity rewrites | Task 1 |
| § "Ownership and critique" L45 | Council critiques drafted content outside protected human input | Task 1 |
| § "Ownership and critique" L45 | Row-only over-spec cannot delete a draft; cut Design commitment through user scope procedure; never replace with none | Task 1 |
| § "Ownership and critique" L47 | Approved text is frozen; disposition-only changes retain review/grants and ledger reconciliation | Task 1 |
| § "Ownership and critique" L47 | Text/add/remove changes require redraw and full gate, outside every amendment grant | Task 1 |
| § "Gate rendering and routing" L51 | Zero-row not-fetched specs keep unavailable routing; all row-bearing specs offer loop | Task 1 |
| § "Gate rendering and routing" L53 | Draft block follows absence of ticket rows, not absence of ticket ref | Task 1 |
| § "Gate rendering and routing" L55-L62 | Main loop copies drafted rows/dispositions between Scope cuts and Council, after commit line | Task 1 |
| § "Gate rendering and routing" L64 | No ticket-row block; audit reply reuses it; changed/re-drafted rows re-render from committed spec | Task 1 |
| § "Gate rendering and routing" L66 | Keep lint title, replace predicate with three legal bodies and reject trigger sentinels | Task 1 |
| § "Gate rendering and routing" L66 | Recheck whole body after council; main-loop repair/audit or clarification precedes gate | Task 1 |
| § "What does not change" L70 | Preserve loop readers, ledger, finish block, ticket transport, predecessor and header-agnostic parsing | Task 1 |
| § "Documentation impact" L74 | Update operations doc; changelog remains release-deferred | Task 3 |
| § "Documentation impact" L77 | README and implement-engine guide remain unchanged | Task 3 |
| § "Tests" L81-L82 | Retain ticket markers; assert provenance, gate order, zero-row route and legal-body predicate | Task 1 |
| § "Tests" L83-L84 | Add five draft-source branches, rewrite loop and unbound-PR facts, retain ticket regression, update intents | Task 2 |
| § "Tests" L83-L84 | Add paired drafted/ticket gate sample with verbatim rows and required block order | Task 2 |
| § "Tests" L85 | Run both full replay targets and repository tests/style before finish under AGENTS policy | Verification |
| § "Out of scope" L89 | No mechanical derivation at ledger seeding | waived: excluded by spec |
| § "Out of scope" L90-L91 | No sibling contract section, no extra ticket rows, no not-fetched drafting | Task 1 |
| § "Out of scope" L92 | No dedicated pre-gate row-approval stop | waived: excluded by spec |
| § "Out of scope" L93 | No dispatched drafter or council-applier drafting | waived: excluded by spec |
| § "Out of scope" L94 | Preserve checkLedger, ledger grammar, loop driver and persona | Task 1 |
| § "Out of scope" L95 | Do not edit predecessor edge table | waived: excluded by spec |
