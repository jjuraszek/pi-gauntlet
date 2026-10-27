# Brainstorming: shared-path reuse candidate, moving-parts contract, and test-per-observable bar

**Goal:** Make every gauntlet design name the shared code it changes instead of copying, disclose the moving parts each approach removes and adds, carry that disclosure into the spec as Design imperatives both implement engines already read, and give the code reviewer a citable bar for tests that prove no spec-named observable.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

## Problem

Framing: kept (user chose "as framed": extend the reuse-only candidate at `skills/brainstorming/SKILL.md` section 4; the edit is evaluated against the merge-base baseline with `node eval/run.mjs brainstorming`). The user then widened the intent: every feature the gauntlet produces actively reduces moving parts and generated code; removing code is as valuable as creating it; code, tests, and docs are liabilities to maintain.

Today the approaches step requires a "minimal reuse-only option (no new construct)" candidate and a `Pattern:` line per approach, and section 5 names YAGNI. Nothing asks whether a shared code path that nearly fits should be changed rather than copied beside the caller, nothing makes an approach state what it removes and what it adds, and the code reviewer's Tests priority has `shrink:`/`delete:` tags for test economy but no anchor tying a test to what the spec committed to. A field check over 13 shipped specs in two consumer repos (telemetry diff buckets, squash diffs, brainstorm session transcripts) found the pattern occurring in about half:

- The reuse-only candidate degenerates to a straw man or a letter-of-the-rule reading: one spec offered "run housekeeping per folder" as reuse-only while two existing modules already walked imports, then shipped 1,962 new lines importing neither; another declared reuse-only non-viable on a file-size cap alone and shipped a second editor for the same notes file beside the existing one.
- Logic is copied or inlined beside an existing shared helper: a path-sanitizing `replace` inlined three times next to a private helper doing the same; a 17-line upsert inlined next to an `upsert_file` function; a shell function copied from a sibling script.
- The approved approach grows between approval and PR: one spec was approved as "one branch in the existing retry loop" and shipped a dataclass, an exception class with one construction site, two helpers, and a keyword threaded through eight signatures.
- Deletion is never an approach of its own; the deletions that shipped were side effects of the chosen design.
- Test volume runs 2-6x code lines, 20x in one spec (768 test lines for 37 code lines).
- Counter-examples exist (two probes folded onto one `launch()` at +26/-12; "no new modules, no retry layer" at +37/-8), so the skill can produce the right answer; it does not force it.

Premises: supported in the narrow form - no instruction in shipped `skills/` or `agents/` asks the approaches step to change a shared path rather than copy it, and nothing makes an approach disclose what it removes and adds or gives the reviewer a bar to enforce it; `AGENTS.core.md` ("No new machinery if not essential": reuse an existing field, channel, or code path over a new sibling construct) already states the preference, so the gap is the missing approaches-step instruction and its disclosure/enforcement contract, not the absence of any reuse guidance. Corrected - "evaled against baseline" needs no new machinery: the eval runner already replays the merge-base skill text against the working tree on frozen models. Constraint the ask did not name - `scripts/brainstorming-contract.test.mjs` pins ten section-4 substrings (`(the axis)`, `reuse-only option (no new construct)`, `drops an assumption the ask makes`, `not viable -`, `does not count toward the 2-3`, `Pattern: <what it follows or cuts across, cited to a repo location>`, `sound engineering practice first, then repo rules`, `never recommend an approach that extends it`, `kept the ask as framed`, `the condition that would flip it`) and two section-5 substrings (`when the convention is the debt, say so and do not extend it`, `including supplied presentation details in the design recap`); the edit places new text so every marker survives verbatim and the contract test stays unchanged. Unverified - provider auth for the three frozen eval model ids; checkable only by running a cell. Implicit dependencies found: the `pi` CLI, `origin/main` as merge-base (`812d46fa`), the spec index binary, the `intent.md` `for:` SHA mechanism. Implicit dependency not found: a brainstorming eval fixture with a nearly-fitting shared helper; this spec authors one.

Scope answer: all three slices in one spec (the approaches step, a spec-carried moving-parts contract, a test bar), minimal diff, under `/skill:forge-skill` authoring rules. Test bar answer: one test per committed observable, no numeric ratio.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] In the brainstorming approaches step, when a shared code path nearly fits the ask, the reuse-only candidate names that path and its gap and proposes changing it; declining it still requires the `reuse-only: not viable - <evidence>` form with the gap named, so a size cap alone is not evidence.
  in-scope
- [ ] Every presented approach carries a `Removes:` line and an `Adds:` line (each a list of moving parts or `none`) directly before its `Pattern:` line, and the recommended approach never copies a nearly-fitting shared path beside the caller, cited or not, unless the framing reply or an adopted ticket decision kept the ask as framed and the duplication is named in its `Adds:` and `Pattern:` lines.
  in-scope
- [ ] Design round 1 carries the chosen approach's `Removes:`/`Adds:` content into the spec's Design as Remove/Add imperatives naming each moving part, and round 2 names one test per acceptance row and per Design edge or error clause as `<observable> - <test name or file>`.
  in-scope
- [ ] The code reviewer, after reading the spec's acceptance rows and Design clauses from the supplied context, reports a test that proves no observable they name as a `[Moderate]` `delete:` finding citing the spec section it searched; a test is exempt only when the task cites the acceptance row or Design clause (including a spec-named preservation obligation) it proves, and with no spec in the supplied context the reviewer reports the check as unverified and the existing test-economy checks stand.
  in-scope
- [ ] `npm test` passes with the section-4 contract substrings and the instruction-size lint unchanged.
  in-scope
- [ ] `node eval/run.mjs brainstorming` and `node eval/run.mjs code-reviewer`, each run against the merge-base baseline, report each new sample's facts holding and no existing sample regressed, with the committed `report.md` and `intent.md` for both targets reflecting this edit.
  in-scope

## Design

Four components, all edits inside existing files. No new reference file, no new reader downstream of the spec: `writing-plans`, `loop-implementation`, `conformance-check.md`, and `scripts/brainstorming-contract.test.mjs` stay untouched.

### 1. Approaches step - `skills/brainstorming/SKILL.md` sections 4 and 5

Add to the reuse-only candidate sentence in section 4, keeping the pinned substring `reuse-only option (no new construct)` verbatim: the reuse-only candidate is grounded in the shared-path evidence the gather step already verified (the draft's primary code and the paths it traced); when one of those paths already does the ask except for a behavior it lacks, the reuse-only candidate changes that path and cites the path and the missing behavior. A change to a cited shared path (a parameter, a branch, a discriminant) keeps the reuse-only label - the path is the existing construct - and shows under `Adds:` as a changed part, never as a new construct. No eligibility count: a path lacking more than one behavior is still the candidate when it fits. A moving part is a file, type, helper, signature, setting, test file, inline copy, or call site.

Add two lines every approach ends with, directly before `Pattern:`:

```text
Removes: <moving parts, or none>
Adds: <moving parts, or none>
Pattern: <...>
```

Add to section 5 one sentence, placed after the pinned `including supplied presentation details in the design recap` clause so both section-5 markers stay whole: removal is a design outcome equal to addition; recommend the viable reuse-only candidate unless the recommended approach names an approved requirement that candidate cannot meet, and never recommend an approach that copies a nearly-fitting shared path beside the caller, whether or not it cites that path - subject to the section-4 as-framed exception, under which the duplication is named in the approach's `Adds:` and `Pattern:` lines. The human-selected as-framed exception is preserved, never overridden.

The non-viable form stays `reuse-only: not viable - <evidence>`. When a shared path exists, the evidence names it and the behavior it lacks; when none exists, the evidence names the paths searched and why none fits the ask. A size cap or line count alone is never that evidence. A nearly-fitting path with other callers is still the reuse-only candidate; its blast radius goes into the trade-off prose and `Pattern:` line.

Example output the step produces:

```text
2 - Extend `lib/notify.ts#post` with a `channel` argument (reuse-only). The helper already formats and retries; it lacks only the channel override.
Removes: the inline `fetch` in `jobs/report.ts`
Adds: one optional parameter on `post`
Pattern: follows the single-post-path convention (`lib/notify.ts:12`)
```

Remove: nothing from section 4 or 5. Add: the clause on the reuse-only sentence, the `Removes:`/`Adds:` lines, the one section-5 sentence.

### 2. Design rounds - `skills/brainstorming/SKILL.md` section 6

Round 1 carries the chosen approach's `Removes:`/`Adds:` content into the spec's Design as Remove/Add imperatives naming each moving part (`Remove: the inline fetch in jobs/report.ts`, `Add: one optional parameter on post`). The inventory is exhaustive: the approved spec lists every moving part the change adds, and a moving part outside it goes through the existing amendment route (`reference/amendment-surface.md`) before it ships. Each imperative is a spec clause the closure conformance check reads as an `Rn` against the whole diff: an imperative the diff does not satisfy (a copy shipped where the cited path was to change, a listed removal still present) is `MISSING` or `DRIFTED`, and a construct the inventory does not name is `UNAUTHORIZED` with `origin: none (scope creep)` - ordinary conformance provenance, not the `(over-spec)` spec-clause exception. No engine edit.

Round 2 names one test per acceptance row and per Design edge or error clause, in the spec's `## Tests` section, as `<observable> - <test name or file>`. A spec with no testable observable writes `<observable> - none: <why>`, and the reviewer bullet in component 3 then applies to every added test.

Remove: nothing. Add: one sentence in the round-1 description, one in the round-2 description.

### 3. Reviewer - `agents/code-reviewer.md` Tests priority

Add one bullet to the Tests check list: before applying it, the reviewer locates and reads the spec's `## Acceptance criteria` and `## Design` sections from the supplied context (the task's requirements block or a spec path it names); a test that proves no observable those sections name -> `delete:`, citing the spec section searched. A test is exempt only when its justification cites the approved acceptance row or Design clause it proves, including a spec-named preservation obligation (a `Keep:` clause or an edge rule); a behavior the task summary merely names is not a commitment, and genuinely new behavior goes through the existing scope decision. When the supplied context carries no spec, the reviewer reports the check as `unverified: no spec supplied` and the existing economy checks above stand; a missing spec is never an empty observable set. The existing `delete:` exemption for a single smoke test or `assert`-based self-check stands. The bullet is `[Moderate]`, so an unmatched test lands in `FIX_FIRST` and gets removed, which is what the chosen one-test-per-committed-observable bar requires; a `[Minor]` bullet would ship with the extra tests.

Remove: nothing. Add: one bullet.

### 4. Evals - `eval/brainstorming/` and `eval/code-reviewer/`

Add one brainstorming sample: an ask that nearly fits an existing shared helper in the fixture files (a helper lacking one option), with a gather draft whose `Framing:` line holds, recorded answers through the framing reply, and `## Fixture files` stubs. Anonymized synthetic content. Facts, each `judged:`:

- `reuse-path`: the reuse-only candidate names the fixture helper and the behavior it lacks, and proposes changing it.
- `moving-parts`: every approach carries `Removes:` and `Adds:` lines before `Pattern:`.
- `no-copy`: the recommended approach does not add a copy of the helper beside the caller.

Add a second brainstorming sample, `replay: continuation` at checklist step 6 in the shape of `design-approval-return`: the recorded approach comparison carries the chosen approach's `Removes:`/`Adds:` lines, round 1 is presented and approved, round 2 is not. Facts, each `judged:`:

- `carry-forward`: round 1 states Remove/Add imperatives naming each moving part the chosen approach listed.
- `test-per-observable`: round 2 writes one `<observable> - <test name or file>` line per acceptance row and per Design edge or error clause.

Add one code-reviewer sample: a diff with a spec excerpt (acceptance rows plus a Design clause, one of them a preservation obligation), a test that proves an acceptance row, a test that proves the preservation clause, and a test whose behavior appears only in the task summary. Facts: the reviewer flags the third test `[Moderate]` `delete:` and cites the spec section; the first two tests get no `delete:`. Extend one existing no-spec reviewer sample (`duplicate-tests-diff`, `oversized-fixture-diff`, or `wrong-layer-rspec`, whose cases supply requirements text and no spec) with one fact: no `delete:` finding cites a spec section and the check reports unverified.

For both targets: update `intent.md` (`for:` SHA, `## Change`, `## Expected to move` with `fails -> holds` bullets for the new sample's facts), add a row to `eval/brainstorming/README.md`'s sample table, run `--baseline-only` to seed, then the full target against merge-base `812d46fa`; commit records, `report.md`, and `intent.md`. An existing sample that regresses on the longer approaches output (brainstorming `wordCap` 1400) is fixed by rewording the skill edit, never by widening `intent.md`.

Remove: nothing. Add: three sample directories, one fact on an existing reviewer sample, two `intent.md` updates, two README rows.

### Both engines

Waves (planning): `writing-plans` rows each Remove/Add imperative into `## Spec coverage` as a normative Design imperative. Plan task `Tests:` lines are commands whose anchoring is presence, not coverage, so they do not establish observable-to-test coverage; the round-2 `## Tests` list is the observable set the whole-diff `code-reviewer` reads. Loop (AC execution): the ledger indexes acceptance rows only and the `loop-implementer` works one target row at a time, so a Remove/Add imperative is not ledger work. Shared closure (verification under both engines): the `conformance-reviewer` reads every Remove/Add imperative as an `Rn` against the whole diff (`MISSING`/`DRIFTED` when unmet, `UNAUTHORIZED` scope creep for a construct outside the inventory) and the whole-diff `code-reviewer` applies the new bullet. Both engines share that closure, so the contract has the same teeth under either.

## Errors and edge cases

- `Removes: none` and `Adds: none` are valid; an approach is penalized only for adding what a cited shared path already provides, never for removing nothing.
- The reviewer's new bullet exempts a test only on a cited acceptance row or Design clause; a behavior named only in the task summary does not exempt it, and with no spec in the supplied context the check reports unverified rather than deleting.
- Redraw and amend are unchanged: `Removes:`/`Adds:` live in chat during approaches and become Design imperatives, which the amendment grammar already classifies (inside one component -> amend; boundary moved -> redraw).
- A PR subject runs the same approaches step against the rework diff; no PR-specific wording.
- `npm test` stays green: contract substrings kept verbatim, SKILL.md well under the 50,000-byte / 2,000-line lint.
- An existing-sample regression that the runner's confirmation replay does not reproduce (cell verdict `inconclusive`, both observations kept in the committed record) is not a regression for the acceptance row on eval results; the runner's exit 1 on that verdict is not re-rolled, and the row's "no existing sample regressed" reads against reproduced regressions only.

## Tests

- reuse-only candidate names the shared path and its gap - `eval/brainstorming/samples/<new sample>` fact `reuse-path`
- every approach carries `Removes:`/`Adds:` - same sample, fact `moving-parts`
- the recommendation adds no copy beside the caller - same sample, fact `no-copy`
- a test proving no spec-named observable gets `delete:` citing the spec section - `eval/code-reviewer/samples/<new sample>`
- pinned section-4 substrings and size lint intact - `npm test` (`scripts/brainstorming-contract.test.mjs`, `scripts/ci.mjs`)
- round-1 Remove/Add imperatives carried from the chosen approach - `eval/brainstorming/samples/<new continuation sample>` fact `carry-forward`
- round-2 `<observable> - <test>` line per acceptance row and Design edge clause - same sample, fact `test-per-observable`
- a test justified by a spec-named preservation clause gets no `delete:` - `eval/code-reviewer/samples/<new sample>`
- with no spec supplied the reviewer reports the check unverified and cites no spec section - the extended existing no-spec reviewer sample

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased`, Changed entry for the approaches contract and the reviewer test bullet (major procedures / conventions)
- Derived / memory docs invalidated: none

Candidates from the gather draft dropped: `eval/README.md` and `eval/brainstorming/README.md` describe a procedure this change follows, not one it amends (the README sample-table row is implementation surface under component 4). `README.md`'s "every approach ends with a `Pattern:` line" stays true.

Reference: `reference/documentation-impact.md`.

## Out of scope

- A separate deletion-only approach candidate; the `Removes:` line on every approach carries the removal-as-value intent.
- A numeric test-lines-to-code-lines ceiling.
- Edits to `writing-plans`, `loop-implementation`, `conformance-check.md`, `spec-council-member.md`, `test-driven-development`, or the contract test.
- Root causes of test volume inside the TDD skill; a second brainstorm if the reviewer bullet proves insufficient.
