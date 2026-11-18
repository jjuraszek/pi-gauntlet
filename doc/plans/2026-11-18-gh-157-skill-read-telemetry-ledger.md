# Ledger - loop engine
**Spec:** `doc/specs/2026-11-18-gh-157-skill-read-telemetry.md`
base: d6305a3c9efa1e2e2c4b26b1b148753bbd2df104
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 6 | home | 658e3bc181d5b5bc25b43f687cacaa81ee13bf02

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry.test.ts; 103 passed, 0 failed; brainstorm retained the 10-byte skill and verify the 14-byte reference; 56 companion path, record and shipped-seal tests passed |
| 2 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/telemetry.test.ts; between-phase read appears once under unphased and not under brainstorm |
| 3 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/telemetry.test.ts; 1 direct byte and 2 nested bytes in plan after brainstorm calls, no failed or binary-only entries or script echo; Pi 1.5.0 agent-loop.js:604-660 and nested-tool-calls.js:137-164 emit final content and isError |
| 4 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/telemetry.test.ts; a ranged read counted the two-byte character and returned continuation notice without counting the image or file on disk |
| 5 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test --test-reporter=dot extensions/telemetry.test.ts; two successful calls for the same skill in plan produced separate entries of 1 and 2 bytes in completion order |
| 6 | done | 1 | timeout -k 30 90 node --test bin/gauntlet-performance.test.mjs; 21 passed, 0 failed; text and JSON ranked 5, 2 and 2 bytes across phases and packages, including unphased; recurring-skill-reads and isolated-skill-reads improved, gate-line-first unchanged in selected evals |
| 7 | done | 0 | timeout -k 30 90 node --test --test-reporter=dot bin/gauntlet-performance.test.mjs; 22 passed, 0 failed; adding coverage to one of two legacy runs changed only its file block and JSON field |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Records now retain each skill read's portable path and returned bytes in its completion phase through resume and seal. | Use derived.phases[phase].skill_reads and derived.skill_read_coverage to report measured runs without treating legacy records as zero.
row 2 done | Confirmed that a read between phases is stored under unphased, not the preceding phase. | nothing new to build on
row 3 done | Confirmed that nested and direct reads count final text once in their completion phase, excluding errors and script output. | Reuse the direct and nested event fixture in extensions/telemetry.test.ts to exercise final-result replacements.
row 4 done | Confirmed that a ranged read counts the returned UTF-8 bytes and continuation notice, without charging for images or the rest of the file. | Reuse the ranged-read fixture in extensions/telemetry.test.ts to check mixed final content.
row 5 done | Confirmed that two reads of the same skill in one phase keep separate byte counts in completion order. | nothing new to build on
row 6 done | The digest ranks every measured run's files by returned bytes, and the skill cites comparable runs when their rankings support tuning. | Use the optional skill_reads run field for totals and rankings, and the three sample reports under eval/gauntlet-performance/results to check advice.
row 7 done | Verified that adding coverage to one run leaves every legacy run's text and JSON unchanged, with no file section. | Reuse the mixed-corpus compatibility test in bin/gauntlet-performance.test.mjs to check optional report fields.
