# Ledger - loop engine
**Spec:** `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`
base: aa54901a8a18d84894a1a5683b3a8b287ea5952f
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 2 | home | 2400c11f63e1c62d7862a341dd21683c6a18acbc

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 90 node --test scripts/packed-install-smoke.test.mjs; pi loads exactly five model-visible and six hidden skills including the hidden gauntlet entry; 8 passed, 0 failed |
| 2 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; the entry's start call puts brainstorm in progress and verify refuses completion without a conformance review; 262 passed, 0 failed |
| 3 | open | 0 | |
| 4 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; exactly five phase directories and no unrecognized subdirectories; missing and unexpected path fixtures pass |
| 5 | open | 0 | |
| 6 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; CI's tree check reports the full path of an extra directory or nested SKILL.md; 2 passed, 0 failed |
| 7 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; all eleven step files contain their instructions without skill frontmatter; 3 passed, 0 failed |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |
| 19 | open | 0 | |
| 20 | open | 0 | |
| 21 | open | 0 | |
| 22 | open | 0 | |
| 23 | open | 0 | |
| 24 | open | 0 | |
| 25 | open | 0 | |
| 26 | open | 0 | |
| 27 | open | 0 | |
| 28 | open | 0 | |
| 29 | open | 0 | |
| 30 | open | 0 | |
| 31 | open | 0 | |
| 32 | open | 0 | |
| 33 | open | 0 | |
| 34 | open | 0 | |
| 35 | open | 0 | |
| 36 | open | 0 | |
| 37 | open | 0 | |
| 38 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Pi registers five model-visible skills and six hidden skills, including gauntlet. | Use skills/gauntlet/ as the installed root for phase files and scripts/packed-install-smoke.test.mjs to check the exact skill inventory.
row 4 done | The entry tree contains the five phase directories, with only waves and loop nested under implement. | Call lintTreeShape(root) in scripts/gauntlet-tree-lint.mjs to check a checkout or fixture.
row 6 done | CI now reports the offending path for an unexpected directory or a nested skill entry. | Extend the tree lint fixtures in scripts/gauntlet-tree-lint.test.mjs; CI runs them against the checkout and a temporary tree.
row 7 done | Each of the eleven retired steps has its own instruction file under the hidden entry, without a skill header. | Use the step-to-section table in scripts/gauntlet-tree-lint.test.mjs to check that each file still contains its procedure.
row 2 done | The entry's first tracker call to start a phase puts brainstorm in progress and blocks verify completion without a conformance review. | Use the fresh-entry test in extensions/phase-tracker.test.ts to check the entry instructions against live tracker status and guards.
