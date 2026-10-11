# Minimal spec design and proof

**Goal:** Prevent unnecessary implementation and verification machinery from becoming approved scope by correcting the existing council simplicity rule.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

## Problem

Spec authors can turn a small behavior change into a separate verification project. The council's current over-spec predicate requires a clause to be outside the stated problem, so an unnecessarily elaborate in-scope solution can survive review and become mandatory implementation scope.

Framing: kept - traced authoring, member review, chair synthesis, spec application, the worker fallback, and the shared ticket caller. Existing cut/shrink findings already carry the correction; another review step is unnecessary.

Supersedes [doc/specs/2026-09-06-subtractive-review-pass.md](./2026-09-06-subtractive-review-pass.md), D1-D2 council-side over-spec eligibility and the corresponding predicate in acceptance criterion 1 only. Closure/conformance policy is not superseded.

## Acceptance criteria

none - no ticket

## Design

### Council review

Revise the existing over-spec predicate in `agents/spec-council-member.md` to admit either an unrelated extra or an in-scope clause with a named, simpler replacement that preserves the requirements. Apply this to implementation and proof alike. A finding names the replacement and why it remains sufficient; cost or stylistic preference alone is not evidence.

Protect explicit human choices of mechanism or proof technique in the supplied verbatim human input. A requested outcome does not require an agent's chosen mechanism. Assess necessity after the proposed cut or replacement: retain required behavior, coverage, and safety constraints. Missing human input or an unproven alternative cannot justify a cut.

Replace the predicate's deletion-only necessity wording: a needed clause without a sufficient replacement is not a finding. Keep the current `over-spec` finding grammar and `lean:` output. Keep `adds:` and severity anchored to the original clause's surface; explain what remains uncovered after the proposed action in `unprotected:` and name the smaller replacement in `shrink to`. The chair already keeps shrink findings and requires evidence that the quoted clause is needed; `roasting-the-spec` already applies shrink suggestions. Reuse those paths without changing dispatch or application. The shared ticket caller retains its human-input and acceptance-criteria protections.

Apply forge-skill through sentence-level replacements, removing superseded or duplicate wording. Persona frontmatter remains byte-identical.

## Errors and edge cases

A smaller check that cannot prove a required boundary is not sufficient. For example, a text-only recommendation case cannot replace proof of actual tracker writes. A necessary larger design remains valid without an adequate simpler alternative. Explicitly requested machinery remains protected even when a cheaper option exists. Unrelated extras remain eligible for removal.

## Tests

Use the existing text-eval harness and add one sample:

- `eval/spec-council-member/samples/in-scope-excess/`: one critique flags reducible in-scope implementation/proof with a sufficient replacement, preserves an explicit human choice and indispensable safety coverage, and still cuts an unrelated extra. Emit the existing finding and `lean:` format.

Write the target's `intent.md` and commit its records and report under the existing eval policy. Run the focused sample first, then the target comparison and package checks from the worktree:

Commands:
- `node eval/run.mjs spec-council-member in-scope-excess`
- `node eval/run.mjs spec-council-member`
- `npm test`

Use the records to check the stated behaviors; report unrelated existing failures rather than expanding this change to fix them. These fixed-input checks do not establish a speedup across live sessions.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - replace the existing Key concepts council definition; `CHANGELOG.md` - record the changed behavior (both: Major procedures / conventions)
- Derived / memory docs invalidated: `doc/personas.md` - correct the existing council-member description that limits excess to outside-scope clauses

Apply `reference/documentation-impact.md`, the pi-gauntlet materiality guideline. Amend the existing entries rather than add a guide or duplicate the rubric.

## Out of scope

Authoring-rule changes and their evals; eval-policy changes, new harnesses, review stages, personas, settings, runtime enforcement, and downstream conformance changes.

## Open questions

None.
