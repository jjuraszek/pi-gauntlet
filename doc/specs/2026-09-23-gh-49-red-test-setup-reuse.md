# Reuse test setup during RED

**Goal:** Prompt test authors to reuse existing setup and consolidate near-identical cases before writing the failing test.

## Problem

The RED step in `skills/test-driven-development/SKILL.md` instructs authors to write one minimal test but does not direct them to find existing setup infrastructure or consolidate data-only variants. REFACTOR addresses duplication and helper extraction only after GREEN. This is an instructional gap; the ticket's illustrative example is not evidence of measured duplication rates.

## Acceptance criteria

Ticket #49, Acceptance criteria, rows verbatim:

- [ ] A reviewer reading the RED step of `skills/test-driven-development/SKILL.md` after the change finds one paragraph that instructs the author to (a) look for an existing helper, fixture, or factory before writing setup, (b) extend a suitable existing one before creating another, and (c) write near-identical cases as one parametrized or table-driven example. All three present in that paragraph, and the paragraph sits between the RED heading and the GREEN heading.
  in-scope
- [ ] The diff against its base revision touches only `skills/test-driven-development/SKILL.md` and `CHANGELOG.md`, adds no heading of any level, adds no template key or plan-contract change, and adds exactly one paragraph to the skill (`rg -c '^#+ '` on the skill file unchanged).
  deviates: user approved required spec/telemetry artifacts and the Unreleased changelog heading; Design preserves the remaining minimal-diff constraints.
- [ ] The new paragraph names no consumer-specific directory or framework call: `rg -n 'spec/support|factories|conftest|parametrize\(' skills/test-driven-development/SKILL.md` returns nothing.
  in-scope

## Design

Insert exactly this paragraph immediately after `Write one minimal test showing what should happen.` in the existing RED step:

> Before writing setup, look for an existing helper, fixture, or factory. Extend a suitable existing one before creating another. Write near-identical cases for the same behavior as one parametrized or table-driven example.

Use the existing skill as the sole in-scope instructional surface. Add exactly one paragraph, with no new skill headings, examples, template keys, or plan-contract changes. Leave all existing skill text unchanged. The short imperative sentences match the established TDD style; retain the ticket-mandated suitability and near-identical-case wording.

"Suitable" limits extension to relevant existing setup infrastructure; it does not require adapting an unrelated helper. With no suitable existing infrastructure, the paragraph does not prohibit new setup. "For the same behavior" preserves RED's one-behavior-per-test requirement rather than combining unrelated assertions. Existing minimalism and post-GREEN refactoring rules continue to apply.

Limit the shipped diff to `skills/test-driven-development/SKILL.md`, `CHANGELOG.md`, this spec, and its workflow-generated telemetry record. The implementation plan is a temporary workflow artifact stripped before landing. Add one concise CHANGELOG bullet referencing #49 under the top `## Unreleased` heading, creating that heading above the current version heading only when absent; add no other headings to either implementation file. Keep the paragraph language-agnostic, without consumer paths or framework calls.

No predecessor spec is superseded. Existing test-command-scope and task-test-contract designs remain unchanged.

## Verification

After spec approval, follow `writing-skills` RED-GREEN discipline: run a fresh-agent pressure scenario against the unchanged skill, capture the baseline choices verbatim, then rerun the same scenario with the added paragraph. Provide the relevant RED-step text explicitly in each task (base text for the baseline, edited text for the second run), rather than relying on the installed skill. Exercise lookup before setup, extension of a suitable helper, and same-behavior data variants. Record both runs' observed choices in the verify-phase summary. A complying baseline or non-complying second run does not establish improvement: report it and escalate rather than silently changing the approved paragraph or declaring behavioral verification passed. Keep scenario fixtures and transcripts outside the repository in temporary storage.

Check the exact one-paragraph insertion and placement against the base revision, unchanged skill headings and existing text, and the allowed shipped file set. Run the ticket's forbidden-term scan (no matches is success), inspect the wording against the authoring rules, and run the repository's existing `npm test` verification. Do not add a persistent test framework or repository test file for this text-only change.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: CHANGELOG.md
- Derived / memory docs invalidated: none

Apply `reference/documentation-impact.md`. The CHANGELOG records the changed authoring convention; the skill itself is implementation surface, not a separate documentation entry.

## Out of scope

Changes to other skills, templates, planning contracts, runtime guards, consumer overrides, existing test suites, and broader TDD cleanup are excluded. In particular, `agents/implementer.md` supplies separate RED instructions and sets `inheritSkills: false`; this change does not automatically deliver the new guidance to SDD-dispatched implementers. No new abstractions or shared helpers are introduced by this change.

## Open questions

None. Agent behavior improvement remains an empirical verification outcome, not a guaranteed effect of the wording.
