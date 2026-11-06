# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md`
base: f7eff9832cab2266fded0d7e4f4cd34cda9d7388
verification: npm test
checks: commands
iterations: 3
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs shape-ticket workflow-stage-proof; 2 replay models improved; all 6 candidate facts hold in both models; sample-scoped coverage only |
| 2 | done | 1 | node eval/run.mjs brainstorming workflow-stage-ticket-row; 2 replay models improved; all 7 candidate facts hold in both models; sample-scoped coverage only |
| 3 | done | 0 | node eval/run.mjs brainstorming workflow-stage-drafted-row; 2 replay models unchanged; all 4 candidate facts hold in both models; baseline already satisfies the behavior |
| 4 | done | 0 | node --test scripts/brainstorming-contract.test.mjs; 57 passed; 0 failed; both instruction files meet byte and line caps |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Shape-ticket drops stage proof, preserves behavior bytes, retains retired text, and recovers empty AC lists. | Reuse shape-ticket's AC integrity table as the class owner and eval/shape-ticket/samples/workflow-stage-proof for repair checks.
row 2 done | Brainstorming screens stage-only and bundled ticket rows before ordinary questions and recommends repair without promoting retired proof. | Reuse ticket-acceptance.md's trigger table and eval/brainstorming/samples/workflow-stage-ticket-row to check ticket screening.
row 3 done | The drafted-row replay preserves both behaviors, excludes stage proof, and keeps full verification in Tests without a cut question. | Reuse eval/brainstorming/samples/workflow-stage-drafted-row to check ticketless drafting from suite-proof sketches.
row 4 done | Added the drafting class reference and passed the existing structural test for both tables, the trigger, example, and size caps. | Reuse ticket-acceptance.md's drafting class to exclude stage proof before drafting and preserve existing Design commitments.
