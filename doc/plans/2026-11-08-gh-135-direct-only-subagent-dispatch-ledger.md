# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-135-direct-only-subagent-dispatch.md`
base: df94dadf7e4f53c516eb685ae00c0416b74e0ea4
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 30 node --input-type=commonjs -e 'import("./scripts/pi-cohort-floor-lint.mjs").then(({lintPiCohortFloor}) => require("node:assert/strict").deepEqual([require("./package.json").peerDependencies["pi-cohort"], require("./package-lock.json").packages[""].peerDependencies["pi-cohort"], lintPiCohortFloor(process.cwd())], [">=7.7.0", ">=7.7.0", []]))'; exit 0: package and lock floors are 7.7.0; lintPiCohortFloor returns [] for the matching README floor; no paid or external action launched |
| 2 | open | 0 | |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Raised package and README floors plus the ignored local lock mirror to 7.7.0; the seeded assertion passes; no paid or external action launched. | package.json and README.md declare the 7.7.0 floor for row 2's direct-only guidance.
