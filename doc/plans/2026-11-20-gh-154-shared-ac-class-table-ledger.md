# Ledger - loop engine
**Spec:** `doc/specs/2026-11-20-gh-154-shared-ac-class-table.md`
base: 4ae8694131e79e0d0d729a51c8a6ee0932e422ec
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 3 | home | 5fcd408fd30b278a6cced10768736c84c43d3b71

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 70 passed; both brainstorming read instructions link to the shared class table |
| 2 | done | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 70 passed; shape-ticket/SKILL.md is 47,144 bytes; cmp confirmed the eight moved table lines match 09c9f4e1 byte for byte |
| 3 | done | 1 | timeout -k 30 60 node scripts/delivery-stage-authoring.test.mjs brainstorming workflow-stage-ticket-row workflow-stage-drafted-row pr-body-drafted-row post-action-sorted; both replay models kept the CI-only ticket row verbatim and recommended D; all four selected comparisons unchanged |
| 4 | done | 0 | timeout -k 30 60 node scripts/delivery-stage-authoring.test.mjs shape-ticket workflow-stage-proof-create workflow-stage-proof pr-body-proof; both models dropped CI-only proof in create and repair and labeled it in the Reporter note; all three selected comparisons unchanged |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Both brainstorming stage-proof instructions now read the shared class table at first use. | Use skills/shape-ticket/reference/ac-classes.md to assemble the six definitions for either skill's evals.
row 2 done | Replacing the inline table with a read reduced shape-ticket's main file from 48,627 to 47,144 bytes without changing any class row. | Run scripts/brainstorming-contract.test.mjs to check the six class names and all three read pointers.
row 3 done | Both replay models kept the CI-only ticket row verbatim and recommended D with the shared class table in context. | Pass a target and sample names to scripts/delivery-stage-authoring.test.mjs to check saved judgments without model calls.
row 4 done | Both replay models dropped CI-only proof in create and repair, preserved the surviving behavior, and labeled the retired proof in the Reporter note. | Reuse eval/shape-ticket/samples/workflow-stage-proof-create for a step-4 draft check without tools or tracker writes.
