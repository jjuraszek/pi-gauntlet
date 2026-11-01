for: 4568cf0a7ab8e6e2c751eb96701d64f2116b8f19d2ed327cd3906c4c5971b484

## Change
Allow partial seed coverage with at least one evidenced non-cut row and one counted seed decision; preserve unreached rows and zero attempts. Serialize only the evidenced mapped subset for a companion. Extend seed-recovery with an unreached third row, retaining consumed iteration and commit attribution. Run only seed-recovery here; this is partial synthetic worker coverage, not live execution or companion serialization.

Make done decisions hand off reusable artifacts and say what later rows can build on, explicitly saying nothing new to build on when no reusable artifact was added. Keep failed decisions as retry guidance and the seed decision grammar unchanged. Add done-handoff and failed-handoff facts to the existing row-and-evidence sample without changing its prior facts or scenarios.

Let a worker finish its target first, then prove same-leg open extras one at a time in the files or helper it just changed. Each extra keeps its attempts and carries its own command-first evidence and decision, target first; unfinished extras are reverted before the single commit. Extend row-and-evidence with a supplied-fixture success case that closes the shared-label extra, retaining the missing-fixture failed-target case separately.

Preserve frontmatter, spec-first reads, selective checks, RED/GREEN/REFACTOR, test economy, commit attribution and seed behavior. A failed target permits no extras. Home and companion ordinary results carry one decision per changed row, while seed retains its single row 0 decision.

## Expected to move
- seed-recovery/multirow-seed: fails -> holds - Seed the reached rows without forcing evidence onto the unreached third row.
- seed-recovery/seed-commit: fails -> holds - Count only reached rows and name the unreached row as next while preserving seed attribution.
- row-and-evidence/done-handoff: fails -> holds - Name the shared label artifact for the target and explicitly report no new artifact for the check-only extra.
- row-and-evidence/target-and-extra: fails -> holds - Prove and close the shared-label extra after the target passes, without incrementing extra attempts.
- row-and-evidence/multirow-output: fails -> holds - Emit the target and extra decisions in order under one target-named commit.

## Preserve
- row-and-evidence/failed-handoff: retain missing-fixture retry guidance on failed decisions.
- row-and-evidence/failure-scope and failure-decision: retain target-only failure even with a hint to close an extra.
- row-and-evidence/bounded-evidence and verification-boundary: retain command-first bounded evidence without full verification or out-of-scope writes.
- row-and-evidence/seed-exception and seed-commit: retain baseline closures with zero attempts and one seed decision and commit.

## Coverage
Run only row-and-evidence here. This is partial synthetic coverage of ordinary home returns, not live execution, companion serialization, unfinished-extra rollback or the partial-seed contract. Other samples retain their stored results and are not rerun by this change.
