# eval report: loop-implementer (partial run: seed-recovery)

for: 4568cf0a7ab8e6e2c751eb96701d64f2116b8f19d2ed327cd3906c4c5971b484

wall: 39s

## Change

Allow partial seed coverage with at least one evidenced non-cut row and one counted seed decision; preserve unreached rows and zero attempts. Serialize only the evidenced mapped subset for a companion. Extend seed-recovery with an unreached third row, retaining consumed iteration and commit attribution. Run only seed-recovery here; this is partial synthetic worker coverage, not live execution or companion serialization.

Make done decisions hand off reusable artifacts and say what later rows can build on, explicitly saying nothing new to build on when no reusable artifact was added. Keep failed decisions as retry guidance and the seed decision grammar unchanged. Add done-handoff and failed-handoff facts to the existing row-and-evidence sample without changing its prior facts or scenarios.

Let a worker finish its target first, then prove same-leg open extras one at a time in the files or helper it just changed. Each extra keeps its attempts and carries its own command-first evidence and decision, target first; unfinished extras are reverted before the single commit. Extend row-and-evidence with a supplied-fixture success case that closes the shared-label extra, retaining the missing-fixture failed-target case separately.

Preserve frontmatter, spec-first reads, selective checks, RED/GREEN/REFACTOR, test economy, commit attribution and seed behavior. A failed target permits no extras. Home and companion ordinary results carry one decision per changed row, while seed retains its single row 0 decision.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-recovery | anthropic/claude-opus-5-5 | unchanged | 16597 | multirow-seed: holds -> holds (intended but unchanged); counted-recovery: holds -> holds (held); seed-boundary: holds -> holds (held); seed-commit: holds -> holds (intended but unchanged) |
| seed-recovery | github-copilot/gpt-6.1-sol | unchanged | 15543 | multirow-seed: holds -> holds (intended but unchanged); counted-recovery: holds -> holds (held); seed-boundary: holds -> holds (held); seed-commit: holds -> holds (intended but unchanged) |

## Feedback

- seed-recovery / anthropic/claude-opus-5-5: Both outputs already satisfy all four facts: rows 1 and 2 close done on their named baseline evidence with attempts 0, row 3 stays open and empty, iterations stays 2, only the two baseline checks run, only the ledger changes, and there is a single 'loop: seed evidence' commit carrying the pending tuple and iteration: 2 with a clean-tree check and a decision-only reply. The one thing After moved is the seed decision's third field: Before writes `row 0 done | seeded 2 rows, closed 2 on baseline | row 3`, while After writes `... | take row 3 next`. The fact as written ('with row 3 next') still reads as satisfied, but the Change explicitly says the seed decision grammar is unchanged, so this is drift the author did not intend; keep the terse `| row 3` third field (the next-row pointer) rather than prose like 'take row 3 next', so the seed decision stays machine-parseable and identical to the pre-change grammar while the partial-coverage counting ('seeded 2 rows, closed 2 on baseline') delivers the Change. Everything else in After (heredoc commit form, headers enumerated, explicit no-sidecar note) is fine and keeps every fact Before kept.
- seed-recovery / github-copilot/gpt-6.1-sol: Both outputs satisfy every seed-recovery fact: rows 1 and 2 close on their named baseline evidence with attempts 0, row 3 stays open and empty, iterations stays 2, only the two spec-named checks run, only the ledger changes, and a single 'loop: seed evidence' commit carries the pending tuple and iteration: 2 in its body before a clean-status check and a reply consisting only of the decision line. The one drift in After is the third cell of the seed decision: 'row 3 is the first row to take' instead of Before's bare 'row 3'. It still reads as naming row 3 next so seed-commit holds, but the Change paragraph says the seed decision grammar is unchanged, and this wording is a grammar change that a stricter fact (or a companion parser expecting `row N`) would fail. Keep the done-handoff prose for ordinary row decisions only, and have the seed row 0 decision end with the plain next-row reference `| row 3`, which delivers the partial-seed change while matching Before exactly on the seed grammar.

exit: 0
