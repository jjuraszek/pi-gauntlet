# Test economy in TDD, implementer, and code review

**Goal:** Make the dispatched implementer and code-reviewer personas, their dispatch templates, and the TDD skill behind direct use treat test cost as a design input - extend before add, parametrize equivalent cases, minimal synthetic input, narrow setup, the repo's tier convention - as declinable defaults, and measure the change with persona-level eval samples.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

**Ticket:** none

## Problem

The gauntlet's testing guidance only ever asks for more tests. Three lines actively push toward sprawl: the TDD skill's RED rule "if the name contains 'and', split it" (`skills/test-driven-development/SKILL.md:67`), its checklist row "Every new function/method has a test" (`:177`, repeated at `reference/when-stuck.md:16`), and anti-pattern 4's "Mock the COMPLETE data structure ... If uncertain: Include all documented fields" (`skills/test-driven-development/testing-anti-patterns.md:197,225`). The reuse paragraph #49 added at `SKILL.md:63` is the only counterweight, and it never reaches a dispatched persona: both `agents/implementer.md` and `agents/code-reviewer.md` carry `inheritSkills: false`, and neither persona, the SDD implementer prompt (`skills/subagent-driven-development/implementer-prompt.md`, whose self-review asks "Are tests comprehensive?"), nor the requesting-code-review template (`skills/requesting-code-review/code-reviewer.md`, "Edge cases covered? Integration tests where needed?") says anything about extending an existing test, parametrizing, synthetic input, setup cost, or test tiers.

Observed in consumer repos: one change produced three test functions each running the same expensive document conversion to assert one field apiece (later consolidated by hand to one call with nine assertions), and a module whose every test rebuilt a document from a corpus fixture (later moved wholesale to a slow tier). The same shape appears without any external runtime: a large JSON fixture loaded and parsed inside every test function. The rate of growth was not remeasured; the pattern was.

Framing: kept - the fix is guidance where the dispatched personas and their dispatch templates see it, with the contradicting lines amended, not outvoted.

Tests are supporting constructs for code and docs. The rules below are defaults a competent engineer follows and a reviewer may decline; the only Critical finding is demonstrated lost behavioral coverage.

## Acceptance criteria

none - no ticket

## Design

### Test-economy rules (canonical list, derived views)

The canonical wording is the compact list in the TDD skill's RED step (below). The implementer persona carries an imperative view and the reviewer persona a check view, both derived from it; a wording change starts at the canonical list. Personas cannot load a `reference/` file, so the shared-rule-set flavor is this ownership rule, not a runtime include. Any future long-form material (worked examples) goes to `skills/test-driven-development/reference/test-economy.md` beside `examples.md`, read by direct TDD users only.

1. **Extend before add.** Read the existing test file for the behavior before writing RED. Prefer a new parameter row or a stronger assertion in an existing test; add a new test function for a distinct scenario, not for every function or statement.
2. **One scenario per test.** Several assertions on one operation's result are one scenario. A name containing "and" is not by itself a split signal; different setup or a different operation is.
3. **Parametrize equivalent cases.** Near-identical cases with the same setup and assertion shape are one table with named rows; rows that need different setup or a different assertion are separate tests. Prefer the few rows that cover the distinct outcomes over the full product of inputs. Parametrization removes duplication, not run time.
4. **Minimal synthetic input.** Test input is the smallest hand-built value the tested behavior and its contract need - never a copied production sample, never a fixture the test does not read. A mock standing in for an external API response mirrors that response's shape (anti-pattern 4, rescoped); a field that contract requires is never "oversized".
5. **Setup is measured in work, not lines.** Share an expensive immutable artifact (a parsed file, a built document, a loaded corpus) at the narrowest scope the repo's harness offers instead of rebuilding it per example; a test that mutates the artifact keeps its own copy. Readability and isolation may justify a rebuild - say so.
6. **Right tier, honestly.** Test at the cheapest layer that proves the behavior: a behavior a unit or request-level test proves does not get a browser or end-to-end test, and a higher-layer test asserts what only that layer owns (rendering, navigation, a real boundary). Cost and dependency are separate axes: unavoidably expensive work goes in the repo's slow tier, a real external boundary in its integration tier, each by the convention `AGENTS.md`, the overrides file, or the task text names. Never relabel a slow pure-logic test as integration to hide its cost. When no convention is named or discoverable, place the test beside its siblings and report that.

### `agents/implementer.md`

Add a `## Test economy` block after `## Three-scenario TDD` and before `## Hard rules`, carrying rules 1-6 in imperative form, worded as defaults (no "delete and start over" register). A test that must stay heavy because the behavior genuinely needs the full input, or a rebuild kept for isolation, is reported under the persona's existing deviations item of `## Report back` with the reason; SDD's template maps that to `DONE_WITH_CONCERNS`. Frontmatter byte-identical. Edited under `/skill:forge-skill` persona rules, with one stated yield: the human's defaults-first instruction takes precedence over forge-skill's low-conditionality and no-nuance wording constraints for these rules; every other forge-skill and persona rule binds.

### `skills/subagent-driven-development/implementer-prompt.md`

The self-review "Testing" block replaces "Are tests comprehensive?" with "Does each added test earn its run - extends an existing test where one covers the behavior, minimal synthetic input, shared expensive setup, right tier?". The status protocol is unchanged.

### `agents/code-reviewer.md`

Priority 2 "Tests" becomes a check view of the six rules applied to added **and changed** tests: new behavior covered and meaningful (kept); missing behavior worth a test named concretely rather than a reflexive "add edge cases" (replaces "Are negative cases tested?"); several new tests repeating one setup and operation with split assertions -> one test, several assertions, tagged `shrink:`; a test that repeats an existing test's assertions -> `delete:`; equivalent cases that should be rows -> `shrink:`; input or setup larger than the tested behavior and its contract need -> `shrink:` naming the fields or records the path reads, with the external-API-response exception stated; expensive artifact rebuilt per test -> `shrink:` naming the shared scope; a slow pure-logic test labeled integration -> finding naming the repo's tier; a test written at a higher layer than the one that proves the behavior (a browser test asserting a model rule, a request test asserting a pure function) -> `shrink:` naming the lower layer that owns it; a consolidation whose combined assertions no longer cover a behavior the removed tests covered -> Critical (lost coverage - judged by behavior, not by assertion count). Economy findings are **Minor** (declinable; Moderate means FIX_FIRST, which the human's defaults-first instruction rules out). No new tag, no output-format change. Frontmatter byte-identical. Edited under `/skill:forge-skill` persona rules with the same stated yield as the implementer. ASCII exception: the rewritten priority-2 line keeps the em-dash separator its sibling list items 1 and 3-6 use; the file's list stays uniform.

### `skills/requesting-code-review/code-reviewer.md`

Testing block: replace "Edge cases covered?" and "Integration tests where needed?" with "Each added or changed test earns its run: no repeat of an existing test's setup and operation, input no larger than the behavior and its contract need (external-API mocks keep their shape), expensive setup shared, right tier?". "Tests actually test logic (not mocks)?" and the scoped-commands line stay.

### `skills/test-driven-development/SKILL.md`, `testing-anti-patterns.md`, `reference/when-stuck.md`

- RED step: the #49 paragraph (`:63`) becomes the canonical six-rule compact list (no new H2). #49's three instructions (look for an existing helper, extend before creating, table-drive near-identical cases) survive inside rules 1, 3, and 5.
- `:66` "One behavior per test" -> "One scenario per test".
- `:67` "Clear name describing behavior (if the name contains "and", split it)" -> "Clear name describing the scenario".
- `:177` "Every new function/method has a test" -> "Every new behavior is covered - by an extended existing test or a new one"; the same sentence replaces `reference/when-stuck.md:16`.
- `:184` "Edge cases and errors covered" -> "Edge cases and errors covered - as rows or assertions where they share setup"; the same sentence replaces `reference/when-stuck.md:23`.
- `testing-anti-patterns.md` anti-pattern 4: scoped in its first sentence to "a mock standing in for an external API response"; one added sentence: internal inputs follow rule 4's minimal-synthetic default. `:197`/`:225` wording kept inside that scope.

Edited under `/skill:forge-skill` authoring rules. The #49 spec (`doc/specs/2026-09-23-gh-49-red-test-setup-reuse.md`) already carries its partial supersession banner (line 3, committed with this spec): `supersedes doc/specs/2026-09-23-gh-49-red-test-setup-reuse.md, "RED paragraph" only`; implementation verifies it, adds nothing.

### `skills/writing-plans/SKILL.md`

- Test contract paragraph (`:108`) gains: "Prefer the existing test file for the behavior as `Test:`; a new test file is declared as both `Create:` and `Test:`." ASCII exception: the paragraph keeps its existing `plan-contract.md § Tests` link label, the section-marker form every such link in the file uses.
- Self-review "Test contract" bullet (`:265`) gains the same sentence.
- Task Structure Step 1 example shows a row added to an existing parametrized test (`CASES`) rather than a new `def test_specific_behavior()`; Steps 2-4 commands unchanged.

### Eval: `eval/implementer/` and `eval/code-reviewer/`

Both `kind: text`, `assembly: headed`, per `eval/README.md` and `eval/_template`. Each target's `skillFiles` carries the persona body **and** its dispatch template, so both arms version the template with the persona and the replay text stays neutral. `replay.md` is the target-level lead-in the harness prepends to every sample; per-sample content (task, contract, synthetic module, diff) lives in `samples/<name>/case.md`:

| Target | `skillFiles` | `replay.md` (target-level) | `case.md` (per sample) | `wordCap` |
|---|---|---|---|---|
| `eval/implementer` | `agents/implementer.md` (`body: true`), `skills/subagent-driven-development/implementer-prompt.md` | "You have no tools and cannot run commands; do not claim to have run any. Reply with only the added or changed test code for the task below - no report, no status line." | SDD-shaped task text, `SCOPED_TEST_COMMANDS`, `TEST_CONTRACT`, the synthetic module and existing test file inlined | provisional `600` committed with the target; dry-counted against a valid reply at the first run and adjusted, the count recorded in the target `README.md`; the template's `git diff` block is not part of the replay |
| `eval/code-reviewer` | `agents/code-reviewer.md` (`body: true`), `skills/requesting-code-review/code-reviewer.md` | "You have no tools; the diff is inlined below; do not run git or tests." | the review request with the synthetic diff inlined, `SCOPED_TEST_COMMANDS: none` | provisional `700`, dry-counted the same way |

Five samples in a fictional "ledger import" domain (records with `account`, `amount`, `posted_on`, `memo`): four in Python (`importer.py`, `importer_test.py`) and one in Ruby on Rails with RSpec, so the rules are shown language-neutral. Facts are judged on the emitted code or review; mechanical checks are whole-output `contains`/`lacks`/`matches` only, so no body-scoped or guessed-name mechanical facts:

| Sample | Input | Must-hold facts |
|---|---|---|
| `implementer/extend-existing-test` | `importer_test.py` has a `CASES` table and one `test_parses_amount` over it; task: amounts with a thousands separator | judged: the change is a new `CASES` row, not a new test function; judged: the new row asserts the separator is parsed to the right amount; judged: existing rows are kept |
| `implementer/heavy-json-fixture` | `importer_test.py` shows three test functions each calling `json.load` on `fixtures/ledger_400.json` (call sites and the record keys shown, corpus not inlined); task: reject a record whose `posted_on` is in the future | judged: the new test builds its one record by hand (or reads a once-loaded shared value only when the task's behavior needs the corpus - it does not); judged: the test asserts the rejection, not just construction; judged: no new per-test `json.load` |
| `code-reviewer/duplicate-tests-diff` | diff adds `test_import_sets_account`, `test_import_sets_amount`, `test_import_sets_posted_on`, each calling `import_record` on the same input and asserting one field | judged: a `shrink:` finding proposing one test with the three assertions; judged: the finding is Minor; judged: no finding asks for more edge-case tests of the same operation |
| `code-reviewer/oversized-fixture-diff` | diff adds a test loading the full 400-record fixture to assert on record 7's `memo`, and replaces two tests with one whose assertions no longer cover `posted_on` | judged: a `shrink:` finding naming the one record and field the test reads; judged: a Critical finding on the lost `posted_on` coverage |
| `code-reviewer/wrong-layer-rspec` | Rails diff adds `spec/system/ledger_imports_spec.rb` with three browser examples (Capybara, `js: true`) that submit the import form with an empty `account`, a negative `amount`, and a future `posted_on`, each asserting through `LedgerImport.count` and the model's error message; `spec/models/ledger_import_spec.rb` already validates all three rules and `spec/requests/ledger_imports_spec.rb` covers the form's rejected-submission response | judged: a `shrink:` finding naming the model or request layer as the owner of the three rules and proposing one browser example at most for what only the browser proves (the form rendering its error); judged: the finding does not ask to delete request or model coverage; judged: no finding asks for more browser examples |

Harness labels are used unchanged: a fact that holds in both arms is `held` and stays in `expected.md` as a preservation check; `intent.md`'s `## Expected to move` lists only facts that fail at baseline. A sample whose economy facts all hold at baseline measures nothing and is reworked (harder input or sharper fact) before the persona edit lands. Target `denylist` regexes ban the two consumer product names and their customer nouns: both targets copy the `denylist` array of `eval/brainstorming/target.json` verbatim (values live in `target.json`, never in this spec).

Flow: `node eval/run.mjs implementer --baseline-only` and `... code-reviewer --baseline-only` before the edits; edit; `intent.md` with the printed SHA and `## Expected to move`; full run; commit records and `report.md` per target.

### Escalation path (recorded, not built)

If the candidate run leaves the baseline-failing facts unmoved after one wording round, the next step is a conformance-time check - the conformance reviewer treats test economy as an origin concern over the whole diff - in a follow-up spec. Stronger persona wording is not the next step.

## Errors and edge cases

- Consolidation that loses behavioral coverage: the reviewer's one Critical; judged by what the combined assertions cover, not by assertion count.
- Economy findings never block: Minor only; the implementer may decline with a reason.
- Parametrization stops where rows need different setup or assertion shape: separate tests.
- Minimal-input default yields for mocks of external API responses and for fields a contract requires; reviewer and template carry the same exception.
- Share-the-artifact default yields when a test mutates it, or when isolation or readability justify a rebuild (stated in the report).
- No tier convention named in `AGENTS.md`, the overrides file, or the task text: place beside siblings, state it; never invent a marker.
- Layer choice is generic ("the cheapest layer that proves it"); layer names, drivers, and browser-specific mechanics (driver flakiness, settle rules) stay repo-owned and are never named in a skill or persona.
- Behavior genuinely needs the full input: keep it, report it under deviations with the reason.
- Eval `kind: text` output is chat text: no tools, no execution claims; facts are judged on the text; over-cap replies are cell errors, so caps are dry-counted.
- Baseline already holds a fact: label `held`, keep as preservation, exclude from `Expected to move`.
- Hygiene scan hit on a consumer name: the run refuses; fix the sample, never the denylist.

## Tests

- `npm test`: eval structural lint on both targets, hygiene scan with the extended denylists, skill/agent lint (frontmatter unchanged on both personas), stage-skill lint, `model-literal-lint`, AGENTS core check.
- Manual, model-calling: `--baseline-only` on current wording for both targets, then the full run after the edits; `report.md` and `results/` committed per target. The commit body states the edit is behavior-changing.
- Byte-identical frontmatter on both personas verified by `git diff` of the frontmatter range.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `doc/personas.md` - implementer and code-reviewer roster rows gain one phrase each naming test economy (drift, class 3)

Skill and persona bodies, the two dispatch templates, the TDD reference file, and the writing-plans edits are implementation surface (plan file list), not doc-impact entries (`reference/documentation-impact.md`).

## Out of scope

- A numeric test-count or LOC gate in SDD or the eval lib.
- An `edit`-kind TDD target with a fixture repo.
- A conformance-time test-economy check (the recorded escalation path).
- Framework or marker names for tiers; consumer-specific conventions belong in overrides files.
- Reading or anonymizing private session transcripts.
- Remeasuring the growth rate in consumer repos.
- Adding the two targets as examples to `eval/README.md`.

## Open questions

none
