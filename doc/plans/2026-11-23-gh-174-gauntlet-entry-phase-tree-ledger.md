# Ledger - loop engine
**Spec:** `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`
base: ba5be45f1d17c8856e24c4b50c6ffee02ac52692
verification: npm test
checks: commands
iterations: 4
allowance: 10
returned: 24 | home | 5bab9d13a9fa49f66691b046fbf160d5813db8a2

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 0 | timeout -k 30 90 node --test scripts/packed-install-smoke.test.mjs; the packed install registers five model-visible and six hidden skills including gauntlet; 9 passed, 0 failed |
| 2 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; entry starts brainstorm and verify refuses completion without conformance review; 267 passed, 0 failed |
| 3 | cut | 0 | deferred: #174 - live proof only; the two-engine behavior remains required |
| 4 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; the tree has exactly five phase directories with only waves and loop nested under implement; 8 passed |
| 5 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; the authoring guide owns placement and the repository instructions link to it; duplicate and missing rule fixtures pass |
| 6 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; CI's tree check identifies the offending path for extra directories and nested skill entries; 8 passed |
| 7 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; all eleven retired steps have instruction files without skill frontmatter; 8 passed |
| 8 | done | 0 | timeout -k 30 20 bash -c 'grep -e "^rename to " -e "\[-" -e "{+" <(git diff -M10% --word-diff=plain --diff-filter=R aa54901a -- skills/)'; all 52 moved files matched against their originals; the redraw retains the audited instructions from d3190e9a |
| 9 | done | 0 | timeout -k 30 30 node --test scripts/retired-names.test.mjs; checkout scan found no retired names or target directories; scope and exception fixtures passed |
| 10 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; the README inventory matches all eleven registered skill directories; 8 passed |
| 11 | done | 0 | timeout -k 30 20 bash -c 'grep -E "^ok [0-9]+ - gauntlet/ordinary-request-no-run: cached authoring facts hold on both models$" <(node --test-reporter=tap scripts/delivery-stage-authoring.test.mjs gauntlet ordinary-request-no-run)'; reused recorded ordinary-request-no-run replays and judgments; all four sample facts held on both models |
| 12 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; advancing completions on both engines name the installed next-phase file; 267 passed |
| 13 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; status locates only the active or next phase of an entered parent run; 267 passed |
| 14 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; all five handoffs use tracker pointers rather than a second next-file instruction; 8 passed |
| 15 | done | 0 | timeout -k 30 90 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; the ship advisory, two recovery messages and both guards point to installed files; 267 passed |
| 16 | done | 0 | timeout -k 30 20 bash -c 'grep -E "^ok [0-9]+ - saved runs continue at the linked step, never the reset-bearing entry$" <(node --test --test-reporter=tap scripts/resume-routes.test.mjs)'; saved-run fixtures reach the next unfinished step at all seven continuation routes without resetting brainstorm |
| 17 | done | 0 | timeout -k 30 90 node --test scripts/gauntlet-tree-lint.test.mjs scripts/packed-install-smoke.test.mjs; references resolve in the packed install and missing targets fail in fixtures; 17 passed |
| 18 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; removing a cited heading fails even when its step number remains in prose; 8 passed |
| 19 | done | 0 | timeout -k 30 180 node scripts/claude-plugin-smoke.test.mjs; installed Claude plugin lists exactly seven skills and their relative references resolve; broken-link negative control passed |
| 20 | done | 0 | timeout -k 30 180 node scripts/claude-plugin-smoke.test.mjs; all three Claude-only callers read their installed commit rules; both linked cleanup recipes deleted a return file without pi |
| 21 | done | 1 | timeout -k 30 120 node --test scripts/wave-review.test.mjs; moved-text check confirms both whole-diff routes and one resolving pointer before repair at each changed review site; 17 passed, 0 failed |
| 22 | done | 0 | timeout -k 30 20 python3 -c 'assert all("cite the contrary hunk in the review outcome and select no edit for a disproved claim" in open(path).read() for path in ("skills/gauntlet/implement/waves/waves.md", "skills/gauntlet/conformance-check.md"))'; both changed sites require a citation and exclude the disproved claim from repairs; moved-text evidence, not a live review |
| 23 | done | 1 | timeout -k 30 30 node --test scripts/gate-contract-lint.test.mjs; 23 gate and question rows and six ship endings match their rendering sites; tracker and menu examples quote the renamed IDs; 9 passed, 0 failed |
| 24 | done | 1 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; README outline covers 12 blocks and 18 sections with named readers; 9 passed |
| 25 | open | 0 | |
| 26 | open | 0 | |
| 27 | open | 0 | |
| 28 | open | 0 | |
| 29 | open | 0 | |
| 30 | open | 0 | |
| 31 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; repo tracker and cleanup settings resolve under shared and the release rule under gauntlet/ship; 10 passed |
| 32 | open | 0 | |
| 33 | open | 0 | |
| 34 | open | 0 | |
| 35 | open | 0 | |
| 36 | open | 0 | |
| 37 | open | 0 | |
| 38 | open | 0 | |

## Decisions
row 0 done | seeded 20 rows, closed 19 on baseline | row 21
row 21 done | Wave reviews, re-reviews and conformance-fix reviews now check each finding against the assigned diff before selecting repairs. | Reuse the review-point table in scripts/wave-review.test.mjs to check link resolution and ordering at both repair sites.
row 22 done | Both review sites require the orchestrator to cite the contrary hunk and make no edit for a disproved finding. | nothing new to build on
row 23 done | Verified the rendering sites for 23 gate and question rows and six ship endings, and made the lint reject unlisted gate IDs inside those sites. | Use the inventory in scripts/gate-contract-lint.test.mjs to check the renamed IDs and ship endings.
row 24 done | Replaced the flat README settings table with an outline that names each block, its sections and their readers, and updated the worked examples. | Reuse the block and section inventory in scripts/gauntlet-tree-lint.mjs to check overrides files against the documented layout.
row 31 done | Moved the repo's tracker and cleanup settings into shared sections and its release instructions into the ship section of the run block. | Pass overrides fixture text to lintOverridesFile in scripts/gauntlet-tree-lint.mjs to detect unknown blocks or misplaced sections.
