# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-160-gatekeep-reject-approach.md`
base: bae599d7e7dd4f864cb8f8a23ab11221f54717da
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 4be4174d90d61655d77a55b80d4c8af5ce0f2d11

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 30 node --test scripts/gatekeep-reject.test.mjs; 1 test failed; review-baseline.md lacks the Approach grounds section |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | cut | 0 | deviates: an approach conflict the developer does not reject is a blocker - assess posts it and a delivery course repairs it, so it withholds merge until repaired or overruled by the developer |
| 5 | open | 0 | |
| 6 | cut | 0 | deviates: the request replaces the immediate post with a previewed note, then post and close on the last menu |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: define approach grounds and validate first-report conflicts
