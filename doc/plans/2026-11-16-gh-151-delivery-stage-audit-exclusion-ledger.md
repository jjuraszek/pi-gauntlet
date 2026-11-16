# Ledger - loop engine
**Spec:** `doc/specs/2026-11-16-gh-151-delivery-stage-audit-exclusion.md`
base: 3171d0e124e361836d163217ff976af02c86cf2f
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | ab9bfd89947dac9c5c95f0661a91fc53db77be52

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test eval/conformance-reviewer/legs-verification-line.test.mjs; 1 passed, 0 failed; selected model eval legs-verification-line improved on both replay models; file and behavior clauses DELIVERED without PR-gate or ship-evidence gaps |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | timeout -k 30 60 node --test scripts/brainstorming-contract.test.mjs; 66 passed, 1 failed; workflow-stage gate lacks a pull request's title, body, state or review |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 6: reuse scripts/brainstorming-contract.test.mjs to widen the ticket gate and drafting rules
row 1 done | The audit drops delivery-stage clauses while retaining delivered file and behavior requirements on the same leg line. | Reuse eval/conformance-reviewer and its legs-verification-line fixture and cached replay check to test the remaining audit exclusions.
