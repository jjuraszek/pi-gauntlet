# Always-read conventions in the overrides contract

**Ticket:** [jjuraszek/pi-gauntlet#48](https://github.com/jjuraszek/pi-gauntlet/issues/48)
**Goal:** Give authors one documented heading for shared rules that every active skill reads and applies without relevance filtering.

## Context

At base `343f0ba`, `README.md` "Project-specific overrides" and the closing "Project overrides" blocks in all 20 `skills/*/SKILL.md` files describe section selection by skill name, topic, or workflow convention. Skills interpret the file through instructions; this change does not add a runtime loader.

The ticket describes consumers inventing shared headings and relying on relevance judgments. The consumer file was not independently inspected. The verified gap is the missing always-read contract, not a demonstrated skipped rule. There is no existing global always-read guarantee for `## verification`.

## Problem

An author cannot designate a shared section that every skill must read. A broadly named section can fall outside the current relevance judgment even when its rules bind several skills. The contract needs an unconditional shared section plus a narrow conflict rule that preserves skill-specific behavior.

## Acceptance criteria

Ticket #48, Acceptance Criteria, rows verbatim:

- [ ] When reviewing the README's override contract, an author can find `## conventions` defined as the heading for repo-wide rules that bind more than one skill, a two-line example, the guarantee that every skill reads that section whenever present, and the rule that a skill-named section wins on conflict.
  in-scope
- [ ] When inspecting the closing "Project overrides" instructions in each of the 20 existing `skills/*/SKILL.md` files, every closing block explicitly requires reading `## conventions` whenever present, without relying on a relevance judgment.
  in-scope
- [ ] When reviewing the README's override contract, an author finds one sentence, without an inventory table, explaining that headings a skill reads by name are documented in their owning skills, while other headings retain topic/workflow-convention matching; the explanation does not classify `## conventions` or skill-named sections as topic-only matches.
  in-scope

## Design

### Shared section and precedence

Define `## conventions` as the heading for repo-wide rules that bind more than one skill. Each active skill reads and applies this section whenever it exists in the selected overrides file, without a relevance judgment.

The active skill's named section means the overrides section named for that skill, such as `## writing-plans`, not every heading the skill reads by name. That section takes precedence over conflicting conventions. Apply non-conflicting conventions alongside it. For example, `## writing-plans` can override a shared output-format rule during planning without displacing an unrelated scratch-file convention.

Other sections retain their existing named-reader or topic/workflow-convention matching rules. Do not introduce a precedence hierarchy for those headings. Preserve existing restrictions on skill-specific extension points.

In `skills/shape-ticket/SKILL.md` "Ticket wording", replace the rationale that relies on by-topic relevance excluding the contract: the always-read route makes that rationale stale. Preserve the existing explicit-ticket-wording restriction. State that a conventions rule can change the ticket-wording contract only when it explicitly addresses ticket wording; generic density/brevity rules still cannot weaken it. This is a rationale reconciliation, not a relaxation of the restriction.

### Instruction surface

Amend the owning section-selection sentence in every closing `## Project overrides` block in the 20 existing `skills/*/SKILL.md` files. Each block must directly instruct the reader to read and apply `## conventions` whenever present without relevance filtering, and give the active skill's named section precedence on conflict with conventions. Preserve the surrounding discovery instructions, AGENTS.md pointer, line-wrapping conventions, and per-skill extension text, including chase-bug's Response channels hook.

Replace the common section-selection sentence with this instruction verbatim in all 20 blocks, allowing existing line wrapping:

> Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above.

Keep the rule in each closing block rather than introducing a shared reference requiring another read. Use imperative instructions and minimal edits under writing-skills authoring rules. No affected skill currently exceeds 500 lines; do not introduce unrelated extraction or restructuring.

### README contract

Amend `README.md` "Project-specific overrides" in place, including the opening name/topic selection clause and the later claim that a section matters only while its matching skill is active. Replace those now-incomplete descriptions with the shared-rules definition, unconditional read/apply guarantee, and active-skill conflict rule. Retain existing named-section documentation below the general contract. Use "this skill's named section" for the precedence rule and explain it as the section named for the active skill, not another heading read by name. Include this two-line example:

```markdown
## conventions
Keep scratch files outside the repository.
```

Explain named readers and residual relevance matching with one sentence, not an inventory table:

> Beyond `## conventions` and skill-named sections, headings a skill reads by name are documented in their owning skills; other headings retain topic/workflow-convention matching.

Keep the explanation aligned with the existing statement that skills read the file through their instructions rather than through the Pi runtime.

### Discovery and edge cases

Preserve first-found discovery in this order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`. Do not merge files. A conventions section in a lower-priority file does not supplement the selected file.

Absent conventions leave existing section selection intact. Empty conventions add no rules. This change introduces no new file-reading fallback or error policy. The guarantee is a skill instruction, not mechanical runtime enforcement.

### Supersession

Supersedes `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md`, only the section-selection wording in its quoted standard "Project overrides" block under "Tracker abstraction and capability ladder". Its discovery ladder and other requirements remain unchanged. Add an append-only partial-supersession banner to that predecessor.

Also supersedes `doc/specs/2026-08-31-gh-18-self-contained-ticket-wording.md`, only the by-topic-relevance rationale in "SKILL.md edits" item 1. Preserve its explicit-ticket-wording restriction and add a narrowly scoped predecessor banner.

## Verification

Perform all proposed-change verification after spec approval.

- Inspect the actual closing `## Project overrides` block of every one of the 20 skills. Verify an unconditional conventions read/apply instruction and the narrow active-skill conflict rule in each block, not merely the heading's presence anywhere in the file. Compare edits to preserve existing extension text and discovery behavior.
- Follow writing-skills RED/GREEN discipline using fresh agents explicitly given the baseline or amended worktree instruction text, not the globally installed skill. Use representative behavioral runs for the common block and the shape-ticket restriction, plus direct read-back of all 20 closing blocks. Preserve baseline/amended prompts, exact source text, outputs, and outcome notes under an absolute temp directory outside the repository, with evidence paths in the implementation handoff.
- Observable scenario outcomes: a shared rule with no obvious topic match is obeyed; a conflicting active-skill rule wins while an unrelated convention is retained; a heading merely read by name is not mistaken for the active skill's own section. Absent conventions is a regression control, not an expected RED failure. Shape-ticket retains self-contained ticket prose despite a generic density convention; a convention explicitly addressing ticket wording uses the existing override allowance.
- Capture baseline failures before editing and rerun the same scenarios afterward. Record any already-compliant baseline honestly. If every baseline complies, stop for review rather than invent a RED failure. Do not claim the missing contract proves current agents skip a rule.
- Review the README against each verbatim ticket criterion: definition, two-line example, unconditional guarantee, precedence, and one-sentence named-reader explanation with no inventory table.
- Confirm no lower-priority file merging or new handling for empty/absent conventions is introduced. Inspect the predecessor banner's link and narrow scope.
- Run existing `npm test` and the repository's genericity check. Add no permanent CI sentence pin, runtime parser, or testing framework. Behavioral evidence establishes observed instruction compliance, not a runtime enforcement claim.

Documentation impact follows `reference/documentation-impact.md`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md - overrides contract (major procedures/conventions and major definitions); CHANGELOG.md - Unreleased contract-change entry (communication contract)
- Derived / memory docs invalidated: none

README owns this contract; no standalone guide is needed. AGENTS.md already routes authors to the README and requires copying an existing closing block. Skill bodies are implementation surface, not documentation-impact entries. The predecessor banner is spec maintenance.

## Out of scope

Runtime loading or enforcement, a shared rule-reference file, new settings, excluded-heading reports, consumer heading migrations, a README heading inventory, a new CI sentence pin, changes to other heading precedence, and unrelated skill restructuring.

## Open questions

None. The user confirmed narrow active-skill precedence and approved both design rounds. The consumer-specific risk remains unverified but does not block establishing the documented contract.
