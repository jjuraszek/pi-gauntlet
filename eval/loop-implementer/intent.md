for: 6ebd3ec6c50d66b81e550839d5cf690473d7dd7e24b30e24aff8d1797ae6f7ea

## Change
Complete multi-row conformance with the existing row-and-evidence sample: A closes the target and a shared-label extra, B preserves seed baseline behavior, and C keeps a failed target single-row. Retain the partial-seed and empty-evidence samples and their stored results. This iteration reruns only row-and-evidence against the current persona; coverage is synthetic and sample-scoped, not a live implementation run.

Treat empty evidence on an unreached row as normal after partial seeding, not as a seed failure. Create the first check before implementing that row and close or fail it with command-first evidence through the ordinary row procedure. Add empty-evidence-row to exercise a later target with no seeded check and a teammate's suggestion to repeat seeding.

## Expected to move
- row-and-evidence/target-and-extra: fails -> holds - Close the proved shared-label extra after the target, preserving its attempts.
- row-and-evidence/multirow-output: fails -> holds - Emit target-first decisions for both changed rows in one target-named commit.
- row-and-evidence/done-handoff: fails -> holds - Name reusable artifacts for the target and explicitly report none for the baseline extra.

- empty-evidence-row/normal-state: fails -> holds - Proceed with the ordinary row rather than repair valid partial seeding.

## Preserve
- empty-evidence-row/first-check: retain spec-first reads and RED before production edits, then GREEN with the same selective file command.
- empty-evidence-row/bounded-result: retain target attempt arithmetic, bounded command-first evidence, unrelated rows and the full-verification boundary.
- empty-evidence-row/ordinary-commit: retain one target-named commit, pending attribution, consumed iteration, clean status and a reusable-artifact decision.

## Coverage
Current conformance run: row-and-evidence only. Earlier row-specific run: empty-evidence-row. This is partial synthetic coverage of an ordinary home success after partial seeding, not live execution, failure-path execution or companion serialization. Preserve stored results for every other sample without rerunning them.
