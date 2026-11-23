# Ledger - loop engine
**Spec:** `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`
base: aa54901a8a18d84894a1a5683b3a8b287ea5952f
verification: npm test
checks: commands
iterations: 15
allowance: 10
returned: 19 | home | cbf5b3971ad69ba403a5c38977baac48e6122218

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
| 9 | done | 2 | timeout -k 30 30 node --test scripts/retired-names.test.mjs; scope fixture passed; checkout scan found no retired names or eval target directories; 2 passed, 0 failed |
| 10 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; the README lists exactly the eleven directories with skill entries; 5 passed, 0 failed |
| 11 | done | 1 | timeout -k 30 20 node scripts/delivery-stage-authoring.test.mjs gauntlet ordinary-request-no-run; node eval/run.mjs gauntlet ordinary-request-no-run ran 4 replays and 2 judgments; all 4 facts held on both models; 2 local checks passed |
| 12 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 266 passed; both engines returned installed paths on their advancing completions |
| 13 | done | 1 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts scripts/brief-contract-lint.test.mjs scripts/resume-routes.test.mjs; 277 passed, 0 failed; status locates the active or next phase only in an entered parent run; handoff omits the locator and resume treats it as observational |
| 14 | done | 1 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; both engines use tracker pointers at all five handoffs and preserve wave initialization, loop allowance and ship worktree inputs; 6 passed, 0 failed |
| 15 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; both recovery messages, both guards and the ship advisory name installed files; 266 passed, 0 failed |
| 16 | done | 1 | timeout -k 30 20 node --test scripts/resume-routes.test.mjs; saved-run fixtures select all seven continuation routes; brainstorm skips pass the recorded engine; 10 passed, 0 failed |
| 17 | done | 1 | timeout -k 30 90 node --test scripts/gauntlet-tree-lint.test.mjs scripts/packed-install-smoke.test.mjs; 17 passed, 0 failed; references resolve in the npm tarball and missing targets fail in fixtures |
| 18 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; 8 passed, 0 failed; removing a cited step heading fails even when its number remains in prose |
| 19 | done | 1 | timeout -k 30 3600 node scripts/claude-plugin-smoke.test.mjs; Claude listed exactly seven gauntlet skills and no gauntlet agents; their file references resolved in the installed plugin; a broken link in the cached copy was detected |
| 20 | done | 0 | timeout -k 30 3600 node scripts/claude-plugin-smoke.test.mjs; hotfix, fix wave and housekeeping each read the expected commit recipe from the Claude plugin cache; both linked cleanup recipes deleted a return file without the pi tracker |
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
row 9 failed | Migrated direct file references, seven eval targets and gate IDs; the new checkout scan still finds retired names on 330 lines. | Use scripts/retired-names.test.mjs to find remaining lines; distinguish handoffs from procedure links and update their assertions together.
row 9 done | Replaced retired names in instructions, tracker messages, guides and eval inputs; the checkout scan now finds none. | Run scripts/retired-names.test.mjs after changing a caller or moving a procedure to catch retired references.
row 10 done | The README lists the eleven registered skills separately from their descriptions. | The inventory assertion in scripts/gauntlet-tree-lint.test.mjs compares the README names and count with the registered skill directories.
row 11 done | Both models handled the CSV export request without starting a phase, creating a worktree or loading step instructions. | Reuse the ordinary-request-no-run records for local checks and the rename lookup in eval/run.mjs to replay other moved instructions against their baseline.
row 12 done | Advancing completions append the installed file for the next phase on both engines, including after session replay. | Use instructionPath in extensions/phase-tracker.ts with the engine stored in phases.brainstorm.engine.
row 15 done | The ship advisory, recovery messages and guards name installed files, and the implement messages select the recorded engine. | Reuse gauntletFile in extensions/phase-tracker.ts to resolve instructions from the package rather than the caller's working directory.
row 13 done | Parent-run status names the active or next phase's file before Context; resume does not follow it and handoff omits it from the brief. | Extend the status cases in extensions/phase-tracker.test.ts to check phase selection and locator placement after session replay.
row 14 done | Only the tracker names the next file at the five handoffs; wave initialization, loop allowance and the retained ship worktree stay in order. | Run lintHandoffPointers in scripts/gauntlet-tree-lint.mjs against a skill tree to check both engines' handoffs.
row 16 done | Resume passes the saved engine when skipping brainstorm and links each restored phase to its next unfinished step without resetting the run. | Run scripts/resume-routes.test.mjs to check all seven continuation routes against saved-run fixtures.
row 17 done | Fixed package references so skills, personas and extension messages reach their targets from the installed caller. | Run lintReferences(root) from scripts/gauntlet-tree-lint.mjs against a checkout or unpacked package to find broken references.
row 18 done | Checked that numbered citations from retained skills name headings in the moved files, and linked plan repair to the handoff heading. | The missing-heading fixture in scripts/gauntlet-tree-lint.test.mjs distinguishes a step heading from a mention of the same step in prose.
row 19 done | Claude Code loaded exactly seven marketplace skills, and their file references resolved in the installed plugin checkout. | Pass the plugin cache path and allowlisted file globs to lintReferences in scripts/gauntlet-tree-lint.mjs to check installed links.
row 20 done | All three Claude-only callers found their commit rules, and both cleanup links led to recipes that deleted a return file without pi. | Extend the caller table in scripts/claude-plugin-smoke.test.mjs to exercise another shared recipe from an installed skill.
