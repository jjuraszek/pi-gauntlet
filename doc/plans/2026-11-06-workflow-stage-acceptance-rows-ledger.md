# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md`
base: f7eff9832cab2266fded0d7e4f4cd34cda9d7388
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs shape-ticket workflow-stage-proof; 2 replay models improved; all 6 candidate facts hold in both models; sample-scoped coverage only |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | node --test scripts/brainstorming-contract.test.mjs; 56 passed; 1 failed: shape-ticket integrity table lacks Workflow-stage proof |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Shape-ticket drops stage proof, preserves behavior bytes, retains retired text, and recovers empty AC lists. | Reuse shape-ticket's AC integrity table as the class owner and eval/shape-ticket/samples/workflow-stage-proof for repair checks.
