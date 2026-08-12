# Fix-loop convergence sentinel (issue #7)

Reference: [jjuraszek/pi-gauntlet#7](https://github.com/jjuraszek/pi-gauntlet/issues/7) - "subagent-driven-development: fix-loop escalation counts rounds, not convergence - rubber-stamp approval tax", as reshaped by its consolidated roast comment. Roast substance relied on here: the roast killed the originally filed three-clause orchestrator-graded exception as un-auditable self-grading ("Critical A") and ordered ownership-aware deferral split into its own issue because it collides with the wave test gate ("Critical B"); both reviewers endorsed keeping the no-config-knob constraint.

## Problem

`subagent-driven-development`'s per-task fix loops escalate to the user after 2 review rounds regardless of trajectory. Observed effect (issue evidence): three escalations in one session where the loop was converging on a single residual Moderate finding with a reviewer-named fix - each escalation a rubber-stamp "yes". The gate counts rounds, not progress. Conversely, "cannot resolve in two attempts" (Continuous Execution, `skills/subagent-driven-development/SKILL.md:31`) is ambiguous enough that orchestrators read it as "any finding still open after two rounds".

## Design decisions (fixed)

These were settled in brainstorming and are not open:

1. **The reviewer judges convergence, not the orchestrator.** On every re-review, the orchestrator pastes the complete prior review report verbatim into the reviewer's task under a fixed marker; the reviewer ends its report with one `TRAJECTORY:` line. The orchestrator's only job is pattern-matching that line - never diffing findings prose, never scanning the review body.
2. **Severity threshold binds to the existing scale.** The named agent SDD dispatches (`agents/code-reviewer.md`) emits **Critical / Moderate / Minor**. The issue's ">= Major" maps to **Critical**. The orchestrator's check is exactly: the `TRAJECTORY:` line does not contain `max severity Critical`. No new severity label is introduced anywhere.
3. **One uniform rule for both loops.** The spec-compliance loop and the code-quality loop (sequential and wave modes) carry the same sentinel and the same escalation rule. The spec reviewer has no severity vocabulary, so its `CONVERGING` form omits the severity parenthetical and `CONVERGING` alone qualifies - same rule, no branch.
4. **Sentinel appears only on re-reviews that find issues.** A first review has no prior report to compare against; a clean re-review ends the loop and needs no trajectory. No `FIRST_REVIEW`/`N/A` placeholder, no zero-findings grammar.
5. **Rule text lives in one place.** A new `## Fix-Loop Rounds` subsection in SKILL.md is the single source; every loop site (Process steps 4/6, wave steps 3/6, Continuous Execution) points at it instead of restating it. The re-review dispatch guidance lives inside that subsection too - no second location.
6. **Out of scope, dropped without follow-up:** ownership-aware deferral (roast Critical B; the user chose not to preserve it as a ticket). Also untouched: `When a Subagent Fails` (implementer-failure brake, a different gate), the conformance fix loop (owned by `verification-before-completion/reference/conformance-check.md` and its `maxFixRounds`), `requesting-code-review` (whole-diff review has no round cap), and the `agents/code-reviewer.md` persona. The pre-existing Critical/Important/Minor vs Critical/Moderate/Minor collision between `requesting-code-review/code-reviewer.md` and the named agent is not resolved globally, but the `TRAJECTORY:` line is insulated from it: the appended prompt block declares its own severity set authoritative for that line (see Changes 2).
7. **No config knob.** The bound is fixed prose. A per-review-round knob would duplicate the amortization `closureReview.maxFixRounds` already provides at deliverable granularity.
8. **Minimal conditionality.** The orchestrator rule must be executable by a small model as a single pattern-match on the sentinel line with no interpretive step, and the grant is imperative, not discretionary.

## Changes

### 1. `skills/subagent-driven-development/SKILL.md`

**New subsection `## Fix-Loop Rounds`**, placed immediately after `## The Process`. Content (normative; final wording may be lightly edited for flow, semantics fixed). The mechanics are **decision points at reviews**, not review+fix "rounds":

- The same rule governs the spec-compliance loop and the code-quality loop, in sequential and parallel-wave modes alike.
- **Re-review dispatch rule:** every re-review task includes the complete prior review report verbatim under the marker `## Previous review report (re-review trigger)`. The marker's presence is what obligates the reviewer to emit the `TRAJECTORY:` line (per the prompt templates); the orchestrator never selects or summarizes "findings".
- **The sequence** (each review that finds issues is a decision point; read the `TRAJECTORY:` line **before** dispatching anything; any clean review ends the loop):
  1. **Review 1** (first review - no sentinel). Issues -> dispatch fix 1.
  2. **Review 2** (re-review). Issues -> if `STAGNANT`, escalate now - no fix 2. Otherwise dispatch fix 2.
  3. **Review 3** (re-review; today's escalation point). Issues -> if the line reads `CONVERGING` and does not contain `max severity Critical` (spec reviews: `CONVERGING` alone), run the convergence exception: dispatch fix 3, then review 4. Any other outcome - `STAGNANT`, `DIVERGING`, a missing or malformed line, `max severity Critical` - escalate. Do not re-dispatch just to obtain the line.
  4. **Review 4** (re-review, only after the exception). Issues -> escalate, whatever the verdict. The exception fires at most once per loop; verdicts never chain into a second grant.
- Every dispatched fix is verified by a re-review before escalation or task progression - the loop only ever exits on a clean review or an escalation.
- **Escalation report**: when you stop, report reviews run per loop and the final `TRAJECTORY` verdict - report `TRAJECTORY: MISSING` if the line was absent, or quote the raw line if malformed. If the exception ran, say so explicitly: `fix 3 was the convergence exception (CONVERGING, no Critical)`.
- One worked example per trigger (pass/fail):
  - Review-2 verdict `TRAJECTORY: STAGNANT (repeat of: unchecked error path in parser)` -> escalate now, before fix 2 - earlier than the ordinary budget.
  - Review-3 verdict `TRAJECTORY: CONVERGING (3 -> 1, max severity Moderate)` -> dispatch fix 3; if review 4 still finds issues, escalate with the exception named in the report.
  - Review-3 verdict `TRAJECTORY: CONVERGING (3 -> 2, max severity Critical)` or `TRAJECTORY: DIVERGING` or no `TRAJECTORY:` line -> escalate.

**Continuous Execution** (line 31): the bullet "A reviewer finds issues the implementer cannot resolve in two attempts" is replaced with wording that (a) names stagnation-or-exhausted-budget rather than a bare attempt count and (b) points at `## Fix-Loop Rounds`, e.g. "A fix loop escalates per [Fix-Loop Rounds](#fix-loop-rounds) (stagnation, or budget exhausted without convergence)".

**Process steps 4 and 6** ("Loop until ✅"): each gains a pointer, e.g. "Loop until ✅, within [Fix-Loop Rounds](#fix-loop-rounds)". No rule restatement.

**Wave-mode steps 3 and 6**: one clause each - re-dispatch loops follow [Fix-Loop Rounds](#fix-loop-rounds), same as sequential. No rule restatement.

**Red Flags**: two additions -
- Dispatching fix 3 without a reviewer-emitted qualifying `CONVERGING` verdict at review 3
- Continuing past a `STAGNANT` verdict instead of escalating

### 2. `skills/subagent-driven-development/code-quality-reviewer-prompt.md`

This file is dispatch instructions, not a fenced prompt; add the block below as a new section, with one framing sentence making clear the block is part of the task text sent to the reviewer (the orchestrator includes it, plus the prior report under the marker, in every re-review dispatch):

```markdown
## Re-review: trajectory verdict

Include the following in the reviewer's task text on every re-review, after the
prior review report pasted verbatim under a `## Previous review report
(re-review trigger)` heading:

If your task contains a "Previous review report (re-review trigger)" section
and you found issues, end your report with exactly one line:

TRAJECTORY: CONVERGING (<n_prev> -> <n_now>, max severity <X>)
TRAJECTORY: DIVERGING
TRAJECTORY: STAGNANT (repeat of: <finding>)

Pick the first label that applies, in this order:

1. STAGNANT: a previous finding survives materially unchanged - name it.
   (e.g. the same unchecked error path flagged last round is still unchecked)
2. DIVERGING: <n_now> >= <n_prev>, or the fix introduced any new finding.
   (e.g. 3 findings fixed but the fix broke an import: DIVERGING, not CONVERGING)
3. CONVERGING: otherwise - the count fell, nothing new appeared, and every
   surviving finding was materially improved.

<n_prev>/<n_now> are finding counts; <X> is the highest remaining severity.
For this line the severity set is exactly Critical/Moderate/Minor, regardless
of the vocabulary used elsewhere in your report.

The orchestrator dispatches one extra fix only when this line says CONVERGING
without "max severity Critical" - be accurate, not generous.

If you found no issues, report success as usual and omit this line.
First reviews (no previous-report section) omit this line.
```

### 3. `skills/subagent-driven-development/spec-reviewer-prompt.md`

Same block with three deltas, inserted **inside the fenced `prompt: |` body** (immediately before the `Report:` section - the fence is the literal text the reviewer receives, so an appendix after it would never reach the reviewer), minus the framing sentence about task assembly (that lives once in the code-quality file and once in `## Fix-Loop Rounds`):

- The `CONVERGING` form is `TRAJECTORY: CONVERGING (<n_prev> -> <n_now>)` - no severity parenthetical, and the `<X>`/severity-set sentences are dropped (spec findings carry no severities).
- Rule 2 (`DIVERGING`) is unchanged; rule 3 drops the severity language accordingly.
- The grant sentence reads: "The orchestrator dispatches one extra fix only when this line says CONVERGING - be accurate, not generous."
- The example lines illustrating rules 1 and 2 are adapted to the spec-review domain (e.g. "the same missing requirement flagged last round is still missing" / "the fix drifted from the spec elsewhere" in place of the code-quality copy's "unchecked error path" / "broke an import"); this is a permitted divergence alongside the three deltas above.

## Semantics pinned (edge cases)

- The three verdicts are mutually exclusive by the pick-first-that-applies order: STAGNANT beats DIVERGING beats CONVERGING. A fix that resolves three findings but introduces one new one is DIVERGING (rule 2), closing the whack-a-mole loophole.
- `CONVERGING` therefore requires all of: `n_now < n_prev`, no new findings, no materially-unchanged survivor. A surviving finding that was materially improved (narrowed, partially fixed) does not block CONVERGING.
- Missing/malformed sentinel at a decision point = not-CONVERGING. No grant, no re-dispatch to fetch it.
- The orchestrator's grant check is a single pattern-match on the sentinel line (`CONVERGING` present, `max severity Critical` absent); it never reads the review body for severity words.
- The reviewer holds all convergence judgment (what counts as one finding, "materially unchanged", "materially improved"); the trigger for emitting the sentinel is the presence of the previous-report marker, not semantic recognition of findings.
- Budget comparison (for the spec record): today = reviews 1-3 with fixes 1-2, escalate at review 3 if issues remain; new = same, plus fix 3 + review 4 iff review 3 printed qualifying `CONVERGING`. `STAGNANT` at review 2 escalates before fix 2 - earlier than today.
- The two prompt-file blocks are identical except the three declared spec-reviewer deltas and the domain-adapted example lines in rules 1-2 (the only other permitted divergence).

## Testing / verification

No unit-testable code - prose-only surface. Verification set:

- `npm test` (`scripts/ci.mjs`) green.
- Generic-skill grep from AGENTS.md over `skills/` - zero matches.
- Consistency read: every loop site (Continuous Execution, Process 4/6, wave 3/6) points at `## Fix-Loop Rounds` and none restates the rule; the anchor `#fix-loop-rounds` resolves; the trajectory block sits inside the spec-reviewer fence and its three deltas match the declaration; sentinel grammar otherwise identical across the two prompt files.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

Skill bodies and prompt templates are implementation surface per `brainstorming/reference/documentation-impact.md`; README/CHANGELOG ride the release, not this change.

## Acceptance criteria

- [ ] `SKILL.md` has a `## Fix-Loop Rounds` subsection stating the full rule as review decision points (marker-based re-review dispatch rule, the four-step sequence, verdict-read-before-fix-dispatch, exception-never-chains, every-fix-verified invariant, escalation report format incl. MISSING/malformed forms, three worked examples).
- [ ] Continuous Execution's two-attempts bullet is replaced with stagnation-or-exhausted wording pointing at that subsection; `When a Subagent Fails` is unmodified.
- [ ] Process steps 4/6 and wave steps 3/6 reference the subsection; the rule is stated exactly once in the file.
- [ ] Both prompt templates carry the trajectory block with the pick-first precedence order; the spec-reviewer copy sits inside the fenced `prompt: |` body and differs only by the three declared deltas and the domain-adapted example lines in rules 1-2; the code-quality copy declares its severity set authoritative for the sentinel line.
- [ ] Severity vocabulary in changed text is Critical/Moderate/Minor; the words "Major" and "Important" appear nowhere in the changed text.
- [ ] Red Flags gains the two listed entries.
- [ ] No settings/config surface added; no changes outside the three named files.
- [ ] `npm test` green; generic-skill grep clean.
