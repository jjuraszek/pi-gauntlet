# Ledger - loop engine
**Spec:** `doc/specs/2026-11-18-gh-157-skill-read-telemetry.md`
base: d6305a3c9efa1e2e2c4b26b1b148753bbd2df104
verification: npm test
checks: commands
iterations: 1
allowance: 10
returned: seed | home | 67f44c975128dd3f414068eafac7bc1b6d7d01f9

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry.test.ts; 97 passed, 1 failed; brainstorm and verify had no read lists instead of the expected 10-byte skill and 14-byte reference; cached Pi 1.5.0 sources confirm final result and isError for direct and nested tool_execution_end (agent-loop.js:604-635,652-660, agent-session.js:361-425,986-997, nested-tool-calls.js:137-164) |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
