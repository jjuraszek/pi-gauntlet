# Execution Latency: Review Scoping and Wave Density

**Goal:** Cut execution-phase latency by removing four text-contract defects that make reviewers and implementers do work outside their gate: spec-reviewer runs test suites it must not run, implementer/TDD wording licenses full-suite runs during implement, plans under-use wave grouping so code review fires per task instead of per wave, and conformance gaps lack an origin-evidence bar so fix loops churn on untraceable nits.

**Evidence (run-history + artifact corpus, 45-60d window):**

- SR tail: persona (`agents/spec-reviewer.md:19` "Run tests that exercise the spec'd behavior") contradicts SDD wave text ("test execution is not the reviewer's job here"); persona wins as the child system prompt. Observed SR runs of 869s, 1207s, 2598s dominated by whole-package pytest + pyright + ruff. 11/15 sampled SRs found nothing; 5/15 drifted into code-quality opinions (CR territory).
- Implement-phase full suites: `bin/rspec spec/services/ spec/presenters/ spec/views/ spec/helpers/` (4258 examples) and repo-wide `uv run pytest -q` (3741 tests) observed inside implement tasks. Text drivers: TDD "All other tests still pass" and implementer-prompt "Verify implementation works" (both unscoped). Attribution note: `agents/implementer.md` and `agents/code-reviewer.md` set `inheritSkills: false`, so the TDD skill body never reaches dispatched children - the child-visible drivers are the persona's three-scenario TDD text and the prompt templates; the TDD-skill rescope covers the main-session/direct-TDD surface. The 2026-08-12 spec fixed the orchestrator level but carved TDD out of scope on the assumption children behave correctly - disproven.
- Wave under-density: 215/265 implementer dispatches were single-task groups; CR fired ~per task (274 CR vs 287 SR dispatches / 30d) at ~307s median (grok-era), the largest single per-task latency tax.
- Conformance churn: 18/21 first-round audits returned GAPS (~85%), gap composition dominated by doc-sync nits and 1:1 plan-task requirements upstream review should have caught; each round costs a fix implementer + a 257-600s re-audit at xhigh.

## Decisions (questionary)

- **Fold all areas into one spec** (SR policy, CQ-drift exclusion, scoped-test contract, wave density, CR-wave binding, conformance origin-quote). Preset model swaps (CR -> `anthropic/claude-sonnet-5:medium`, balanced closure -> `github-copilot/gpt-5.6-sol`) are consumer `settings.json` config, already applied by the user - out of scope.
- **Q1 = A:** origin-quote requirement lands inside the existing `origin` field (locator + verbatim quote); no schema change, consumers keep parsing `origin` as an opaque string. Doc obligations traceable to code changes or explicit requests remain `fix`.
- **Q2 = A:** wave density is plan-side only; CR cadence semantics unchanged, but the CR-per-wave binding becomes an explicit guarantee in SDD.
- **Q3 = A:** SR never executes anything - no tests, linters, or type-checkers, in both modes.
- **Approach 1:** passive rule in child personas ("run only what your dispatch hands you"; SR: nothing) + active supply in orchestrator templates (dispatches must carry the plan-declared scoped commands). No mechanical enforcement extension (YAGNI; follow-up only if leaks persist).
- **Invariant (user):** SR narrows to spec-vs-diff *because* `conformance-reviewer` exclusively owns original-intent-vs-delivered. The origin-quote filter tightens evidence discipline without weakening conformance's intent-fidelity coverage on load-bearing matters. CR does not gain intent checking.
- **Style constraint (user):** child-facing rules (personas + prompt templates) are imperative, short, and unconditional wherever possible - written for smaller models. Conditionals only where a real branch exists.

## Scope

Five text areas, no new machinery, no schema changes, no dispatch-shape changes. `Parallel-safe:` grammar, `TRAJECTORY:` protocol, the conformance durable-concern schema and `## Closure / conformance` sentinel, and all pi-cohort dispatch shapes stay byte-compatible with consumers (`finishing-a-development-branch` Step 3.5, `gatekeep-pr`, `check-delivery`).

**Out of scope:**

- Consumer settings changes (already applied by the user).
- Sequential-mode CR cadence changes (per-task CR remains correct there: each task commits independently).
- Any change to D5's safety contract, wave integration order, fix-loop rounds, or mode auto-selection.
- Mechanical full-suite detection (extension guard) - deferred unless text fixes prove insufficient.
- Conformance `UNAUTHORIZED` semantics (surplus detection cites the diff hunk, not an origin quote - unchanged).
- `gatekeep-pr` / `check-delivery`: no conformance-check field parsing found; re-verify with a grep at implementation, expected no edits.

## Area A: Spec-reviewer - no execution, no CQ drift

Files: `agents/spec-reviewer.md`, `skills/subagent-driven-development/spec-reviewer-prompt.md`, `skills/subagent-driven-development/SKILL.md`.

- **Persona:** delete the run-tests step (line ~19) and all wording implying execution (also line ~12 "running checks yourself" and line ~84 "Quote real test output if you ran tests"). Replace with an unconditional prohibition (imperative form): *"Never run tests, linters, or type-checkers. Your evidence is the diff and the files you read. Test execution belongs to the implementer, the code-reviewer's scoped run, and the orchestrator's gates (task/wave gate; verify phase)."* The sentence is mode-neutral - sequential mode has no wave gate and the persona is shared.
- **Persona CQ-drift exclusion:** *"Do not report code-quality opinions - naming, design, complexity, test aesthetics, style. Those belong to code-reviewer. Report only spec-vs-implementation deltas."*
- **Prompt template (`spec-reviewer-prompt.md`):** state the same two rules in the task text; remove any implied test-running. The "Do Not Trust the Report / verify by reading code" framing stays.
- **SDD wave step 3:** drop the "here" qualifier from "test execution is not the reviewer's job here" - the rule is now unconditional across both modes; reference the persona rule instead of restating a mode-local exception.
- Unchanged: verdict vocabulary, `[MET]/[PARTIAL]/[MISSING]/[OUT_OF_SCOPE]` statuses, `Parallel-safe:` grammar (synchronized comment with `conformance-reviewer.md` untouched), `TRAJECTORY:` protocol.

## Area B: Scoped-test contract - implementer, code-reviewer, TDD

Files: `agents/implementer.md`, `agents/code-reviewer.md`, `skills/subagent-driven-development/implementer-prompt.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, `skills/requesting-code-review/code-reviewer.md`, `skills/subagent-driven-development/SKILL.md`, `skills/test-driven-development/SKILL.md`.

- **Passive rule (personas, imperative/short/unconditional):** implementer and code-reviewer each gain: *"Run ONLY the test commands your dispatch hands you. Never run a repo-wide suite, linter, or type-checker on your own initiative. Dispatch carries no test commands: say so in your report; run nothing."* Unconditional - children cannot see `phase_tracker`, so no phase qualifier. CR keeps its "quote actual verification output" duty - the quoted output is the scoped run.
- **Persona contradiction removal (same files, same pass):**
  - `agents/code-reviewer.md` line ~12 "You may run read-only verification commands (tests, type-checks, linters)" -> bound to dispatch-supplied commands only: *"You may run the verification commands your dispatch supplies (read-only) and quote their actual output."*
  - `agents/implementer.md` hard rule "Never claim a task is done without running tests and observing them pass" -> *"Never claim a task is done without running the dispatch-supplied scoped commands and observing them pass; if none were supplied, say so in your report - that is sufficient for DONE."* The three-scenario TDD's "if any test touches the surface, run it" clause is scoped the same way (dispatch-supplied only).
- **Active supply (templates + dispatch points):** `implementer-prompt.md` and the CR dispatch text gain a required field `SCOPED_TEST_COMMANDS: [<commands> | none]`, making a dispatch that omits it visibly incomplete. The CR field lands in `skills/requesting-code-review/code-reviewer.md` (the file `code-quality-reviewer-prompt.md` points at - the actual CR child text), whose boundary line "Read code, run tests, run git commands: yes" is rescoped to dispatch-supplied-only; `code-quality-reviewer-prompt.md`'s placeholder block adds the field. **Every** implementer/CR dispatch carries it: SDD step 1 (sequential implementer), the wave fan-out example (step 2), sequential CR (step 5), wave CR (step 6 - value = union of the wave's tasks' declared commands), fix-loop re-dispatches, and conformance fix-loop implementers (`conformance-check.md` fix loop: the dispatch adds the gap-relevant scoped commands to the gap block, or explicitly `none` with the round's test gate owning execution). The whole-diff verify-phase review passes `none` (the verify phase's full run is the orchestrator's, per the 2026-08-12 tiering).
- **Harvest rule:** values come from the task's plan-declared test commands (`writing-plans` per-task `Run:`/test lines); wave-level CR takes the union. Plan-declared fmt/lint commands that appear in a task's own steps still run as task steps - the field governs *verification* commands the child may execute.
- **TDD skill:** rescope the unscoped phrases: "All other tests still pass" (~line 120) -> *"the task's scoped commands pass (full-suite verification belongs to the verify phase)"*; "Other tests fail? Fix now" (~line 124) and the ~179-180 "All tests pass" wording align the same way. Implementer-prompt's "Verify implementation works" points at `SCOPED_TEST_COMMANDS`. RED-GREEN-REFACTOR discipline untouched - this changes which tests gate a task, not the cycle.
- **Edge case:** a task with no declared test command (doc-only): implementer reports "no scoped commands declared" (dispatch passed `none`), runs nothing, may report DONE - consistent with doc-only SR-only waves and the amended hard rule.

## Area C: Wave density (writing-plans)

File: `skills/writing-plans/SKILL.md`.

- **Density default (inverted burden):** *"Group independent tasks into the same wave by default. A single-task wave must carry a one-line justification naming the specific blocker."* Placement: the justification is a body line directly under the existing `## Wave N — <label>` header (beside the existing `Depends on Wave N:` / runtime-resource notes - the header format is untouched), of the form `Solo: <reason>` where the reason names the blocking task/wave, the contended resource, or `lone remaining task` (reserved for the genuinely final unmatched task; doc-only trailing waves qualify). Category-only justifications ("dependency" with no named task) do not satisfy the rule.
- **D5 unchanged:** density pressure applies only to tasks D5 already certifies file- and runtime-resource-disjoint. Never merge tasks D5 cannot certify.
- **Plan self-review:** add one checklist item: "any solo wave without a named-blocker justification?" Enforcement is planner self-review - the plan handoff is automatic with no human plan gate; consistent with the decided no-mechanical-enforcement stance.
- **Amend the existing "a wave with one task is legal" wording** to "legal only with a named-blocker justification".
- **Mode auto-selection unchanged:** >=2 tasks in any wave -> parallel mode; denser plans trigger it more often (intended effect).

## Area D: CR-wave binding (subagent-driven-development)

File: `skills/subagent-driven-development/SKILL.md`.

- Make the implicit per-wave CR cadence an explicit contract line: *"CR binds to the wave: exactly one **initial** code-review dispatch per code-touching wave, over the integrated wave diff - never per task within a wave, never batched across waves. Subsequent dispatches within the wave are re-reviews triggered only by findings, per Fix-Loop Rounds."* Placement: Parallel-Wave Mode section (sequential-mode text untouched).
- Add the inverse red flag: "Dispatching `code-reviewer` per task inside a wave."
- Sequential mode untouched (per-task CR remains correct: each task commits independently).

## Area E: Conformance origin-quote

Files: `agents/conformance-reviewer.md`, `skills/verification-before-completion/reference/conformance-check.md`.

- **Evidence contract:** *"Every gap's `origin` field carries a locator AND a verbatim quote: `origin: <file/section, 'prompt', or 'ticket'> - "<quoted clause>"`. No quotable origin clause = no gap. Do not derive implicit requirements. Do not flag wording preferences."* Origin sources are the spec (including its `## Documentation impact` section - docs-as-origin invariant, `2026-07-04-docs-as-origin-review-dedup.md`), the verbatim original prompt, and - on the no-spec fallback path per the existing source-of-truth table - the ticket (`origin: ticket "<quoted AC>"`). Long clauses may be truncated with `[...]` as long as the quoted fragment uniquely identifies the clause.
- **Reinterpretation rule (replaces the vague "superseded values" phrasing):** a deviation recorded in the spec wins over an older origin value; report it only if unrecorded - matching the persona's existing Process step 2 recorded-deviation language. Legitimate DRIFTED rows are unaffected.
- **Reconcile the "implicit notes" wording (same pass, both files):** `agents/conformance-reviewer.md` Process step 1 ("implicit notes (ticket body, comments)") and `conformance-check.md`'s coverage rule + checklist repetitions are rewritten to *"quotable notes only - written sentences you can quote verbatim; never derived inferences"*. Without this the persona stays self-contradictory and the churn survives.
- **Update `origin:` examples** in the persona's requirement-coverage table and `conformance-check.md`'s durable-concern example blocks to the locator + quote form.
- **Malformed-gap enforcement (orchestrator side):** extend `conformance-check.md`'s existing malformed-gap rule: for every non-`UNAUTHORIZED` gap (including re-audit blocks), an `origin` lacking a locator or a nonempty quoted fragment is malformed - triggers a fresh audit and never enters partition/fix. `UNAUTHORIZED` keeps `origin: none (scope creep)`.
- **Field name and schema shape unchanged** - enriching `origin`'s content is byte-compatible with all consumers.
- **What survives by construction:** doc updates traceable to code changes or explicit requests (Documentation impact entries and prompt sentences are quotable origin text) stay `recommended: fix`. What dies: doc polish, style opinions, re-derived "implicit" expectations with no origin sentence.
- **`UNAUTHORIZED` unchanged:** surplus work is present-in-diff/absent-from-origin; it cites the diff hunk, needs no origin quote. The rule constrains gaps (origin -> missing), not surplus detection.
- **Load-bearing coverage intact:** the filter changes what counts as evidence, not what conformance is allowed to examine - intent fidelity against spec + prompt remains full-strength.

## Supersession

`doc/specs/2026-08-12-execution-fidelity-hardening.md` is partially superseded: its out-of-scope carve-out for `skills/test-driven-development/SKILL.md` ("children already behave correctly") is reversed by Area B on new evidence. Its orchestrator-level tiering (scoped per wave, full set once at verify) is upheld and extended, not replaced. Banner scope: the TDD out-of-scope decision only.

`doc/specs/2026-07-06-parallel-wave-spec-reviewer-dispatch.md` is the precedent Area A generalizes (diff-based SR, no test execution) - upheld, not superseded.

## Testing approach

No executable code changes. Verification:

- `npm test` (`scripts/ci.mjs` repo validation).
- Consistency check - explicit forbidden-pattern list (case-insensitive), not a bare substring grep (the mandated prohibition sentence itself contains "run tests" and must not match):
  - `agents/spec-reviewer.md`: lines ~12/~19/~84 phrases ("running checks yourself", "Run tests that exercise", "if you ran tests") deleted; prohibition sentence present.
  - `skills/test-driven-development/SKILL.md`: ~120/~124/~179-180 unscoped "all (other) tests" phrases rescoped.
  - `agents/implementer.md`: unscoped hard rule and "if any test touches the surface" rescoped to dispatch-supplied.
  - `agents/code-reviewer.md`: line ~12 permission bounded to dispatch-supplied.
  - `skills/requesting-code-review/code-reviewer.md`: "run tests ... yes" boundary rescoped; "All tests passing?" checklist item rescoped; `SCOPED_TEST_COMMANDS` slot present.
  - `SCOPED_TEST_COMMANDS` present in `implementer-prompt.md` and `code-quality-reviewer-prompt.md`; CR-wave contract line present in SDD; solo-wave named-blocker rule present in writing-plans; "implicit notes" wording absent from `agents/conformance-reviewer.md` and `conformance-check.md`.
- Generic-skill grep from AGENTS.md (no project-specific content in `skills/`).
- Behavioral validation is longitudinal (out of band): first-round GAPS rate and SR duration tail in future run-history.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (skill/agent bodies are implementation surface, not doc-impact entries)
- Derived / memory docs invalidated: `AGENTS.md` knobs-table rationale paragraph - check at implementation whether persona wording changes touch it; expected none

## Open questions

None - all questionary items resolved above.
