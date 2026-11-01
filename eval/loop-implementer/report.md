# eval report: loop-implementer (partial run: row-and-evidence)

for: 52fc5e2f2876f69c1300638ca36077c295eb87588a9c230f195a64d83f2d9dbb

wall: 63s

## Change

Let a worker finish its target first, then prove same-leg open extras one at a time in the files or helper it just changed. Each extra keeps its attempts and carries its own command-first evidence and decision, target first; unfinished extras are reverted before the single commit. Extend row-and-evidence with a supplied-fixture success case that closes the shared-label extra, retaining the missing-fixture failed-target case separately.

Preserve frontmatter, spec-first reads, selective checks, RED/GREEN/REFACTOR, test economy, commit attribution and seed behavior. A failed target permits no extras. Home and companion ordinary results carry one decision per changed row, while seed retains its single row 0 decision.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| row-and-evidence | anthropic/claude-opus-5-5 | improved | 22628 | target-and-extra: fails -> holds (intended change); multirow-output: fails -> holds (intended change); failure-scope: holds -> holds (held); bounded-evidence: holds -> holds (held); failure-decision: holds -> holds (held); seed-exception: holds -> holds (held); seed-commit: holds -> holds (held); verification-boundary: holds -> holds (held) |
| row-and-evidence | github-copilot/gpt-6.1-sol | improved | 17048 | target-and-extra: fails -> holds (intended change); multirow-output: fails -> holds (intended change); failure-scope: holds -> holds (held); bounded-evidence: holds -> holds (held); failure-decision: holds -> holds (held); seed-exception: holds -> holds (held); seed-commit: holds -> holds (held); verification-boundary: holds -> holds (held) |

## Feedback

- row-and-evidence / anthropic/claude-opus-5-5: After delivers the Change cleanly: in A the worker finishes row 1 (done, attempts 3, command-first evidence), then runs only row 2's selective test, closes row 2 with attempts still 0 and its own evidence, appends row 1 then row 2 decisions, and commits once as `loop: row 1 done` with the pending tuple and iteration in the body, replying with exactly those two lines. Both expected facts moved from fails to holds, and nothing regressed: B still seeds with a single row 0 decision and no failed rows, C still fails only row 1 with bounded three-line evidence, declines the row 2 hint because a failed target permits no extras, and no snapshot runs npm test or touches the spec. Evidence cells across all three snapshots stay command-first, ≤3 semicolon-separated results, no pipes or angle brackets. One small polish: A step 13's 'Considered an extra under step 6' reads as a dangling cross-reference—word it as 'under the extras rule: row 2 is open, same leg, and lives in the file just changed' so the gating condition is visible in the trace itself, and keep the explicit 'did not run npm test or row 2's test until the target passed' note from Before to make the ordering guarantee legible.
- row-and-evidence / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: in A the target is finished first (RED on the unchanged label, GREEN after the one-line edit, row 1 done with attempts 3 and command-first evidence), then row 2 is proved as a same-leg extra via its own selective `node --test test/label.test.mjs`, closed with attempts still 0, given its own decision after the target's, and everything lands in one `loop: row 1 done` commit carrying the saved pending tuple and `iteration: 4`, with the reply being exactly the two decision lines in order. B keeps the single row 0 seed decision and C still refuses the hint, marks only row 1 failed with attempts 3 and bounded plain-word evidence, and emits a single failed decision, so nothing regressed and no trace runs `npm test`, touches the spec, main, or other plan files. The only cosmetic drift is that After's A step 3 drops the ledger from the scoped `git diff` list while still describing its stat; if you want the hunk-reading requirement to stay explicit, keep `doc/plans/chart-ledger.md` in that diff command as Before did.

exit: 0
