# Ledger - loop engine
**Spec:** `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`
base: aa54901a8a18d84894a1a5683b3a8b287ea5952f
verification: npm test
checks: commands
iterations: 6
allowance: 10
returned: 8 | home | 49433d2f476ce81d4feaafc863ff87dcdc093b49

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 90 node --test scripts/packed-install-smoke.test.mjs; pi loads exactly five model-visible and six hidden skills including the hidden gauntlet entry; 8 passed, 0 failed |
| 2 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; the entry's start call puts brainstorm in progress and verify refuses completion without a conformance review; 262 passed, 0 failed |
| 3 | cut | 1 | deferred: #174 - live proof only; the two-engine behavior remains required |
| 4 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; exactly five phase directories and no unrecognized subdirectories; missing and unexpected path fixtures pass |
| 5 | done | 1 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; the guide owns placement and AGENTS.md links to it; missing-rule, missing-link and duplicate-wording fixtures pass; 4 passed, 0 failed |
| 6 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; CI's tree check reports the full path of an extra directory or nested SKILL.md; 2 passed, 0 failed |
| 7 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; all eleven step files contain their instructions without skill frontmatter; 3 passed, 0 failed |
| 8 | done | 1 | timeout -k 30 20 bash -c 'grep -e "^rename to " -e "\[-" -e "{+" <(git diff -M --word-diff=plain --diff-filter=R aa54901a8a18d84894a1a5683b3a8b287ea5952f -- skills/)'; reviewed all 52 moves against the base; 40 files are byte-identical, 11 lost only their skill headers, and only the skill name and two command references changed in the entry |
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
row 3 failed | This worker has no interactive session to observe the gate order or the selected ship action on either engine. | Start one live pi run per engine with the changed package and record the prompts, the person's ship choice and its effect.
amended | cut row 3 | Defer live operator proof only
row 5 done | The authoring guide places files shared across phases beside the entry and directs outside skills to link without moving them. | Read the anchor table in skills/forge-skill/SKILL.md for fixed locations and call lintPlacementRule(root) to check that the guide owns the rule.
row 8 done | Compared all 52 moved files with the base: only the entry name, two references to its command and eleven skill headers changed. | nothing new to build on
