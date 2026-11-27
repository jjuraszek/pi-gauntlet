# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-170-hands-free-implementation.md`
base: a734d890b0228aacb2ab38a18278394bf77d89b1
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 1 | home | 563117584d4f3d11f905638907b61b87a5064417

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --test scripts/loop-engine-contract.test.mjs; 53 passed, 0 failed; selected waves replays improved on helper-interrupted-redispatch and worker-decision-taken; selected loop replays improved on verify-repair-count and held below-allowance retry on spent-allowance-moving-or-stalled |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Waves retries identified interruptions and takes in-spec recommendations; loop retries below allowance and returns approved reopened rows to implementation without asking again. | Extend the spent-allowance-moving-or-stalled loop fixture with spent-row snapshots and reuse worker-decision-taken to check the wave choice record.
