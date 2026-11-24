# Ledger - loop engine
**Spec:** `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`
base: ba5be45f1d17c8856e24c4b50c6ffee02ac52692
verification: npm test
checks: commands
iterations: 12
allowance: 10
returned: 38 | home | adcd9f96505a882c68cee1706240be41e0495d5c

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
| 25 | done | 1 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; 12 passed, 0 failed; checked seven shared sections and caller scope in all 22 overrides paragraphs |
| 26 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; all five phases apply the run-wide text and their own phase section; both engines apply implement |
| 27 | done | 1 | timeout -k 30 30 node --test extensions/lib/overrides.test.ts scripts/gauntlet-tree-lint.test.mjs; 15 passed; shared settings are scoped to the first file and gate configuration stays at the merge base |
| 28 | done | 1 | timeout -k 30 60 node --test scripts/gauntlet-tree-lint.test.mjs eval/housekeeping/overrides-rule-cited.test.mjs; 16 passed; skill-private settings and sample excerpts follow their owning blocks |
| 29 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; 12 passed, 0 failed; no shipped instruction or guide applies the retired wording sections |
| 30 | done | 0 | timeout -k 30 30 node --test scripts/loop-verification-command.test.mjs; the only command sources are the shared verification key and project test entrypoint discovery |
| 31 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; repo tracker and cleanup settings resolve under shared and the release rule under gauntlet/ship; 10 passed |
| 32 | done | 0 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs extensions/lib/overrides.test.ts; 15 passed; all skill entries name the same three locations in the order used by the shared reader |
| 33 | done | 0 | timeout -k 30 60 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/lib/overrides.test.ts extensions/verify-before-ship.test.ts; 37 passed; tracker lookup ignores the retired file and foreign blocks, and sibling and index sections stop at block boundaries |
| 34 | done | 1 | timeout -k 30 300 node --test src/bins/gauntlet-telemetry-ref-migration.test.mjs bin/gauntlet-performance.test.mjs bin/gauntlet-spec-index.test.mjs bin/gauntlet-telemetry-seal.test.mjs; 115 passed; 0 failed |
| 35 | done | 1 | timeout -k 30 120 node --test eval/lib/prepare.test.mjs; all samples of 28 targets prepared on both arms; 28 passed, 0 failed model-free |
| 36 | done | 0 | timeout -k 30 120 node --test eval/lib/run.test.mjs; neither arm generates a retired step command and candidate instructions contain none; 129 passed, 0 failed |
| 37 | done | 1 | timeout -k 30 90 node --test scripts/entry-phase-evals.test.mjs; 3 passed, 0 failed across both replay models; handoff-follows-pointer returned the fixture token and overrides-own-block-only used the shared command without the foreign suffix; ordinary-request-no-run held after a judgment-only refresh distinguished project configuration from step instructions |
| 38 | done | 1 | timeout -k 30 30 node --test scripts/gauntlet-tree-lint.test.mjs; checked the entry, 11 step files, 19 renamed IDs, overrides migrations and both upgrade warnings before and after release heading promotion; 16 passed, 0 failed |

## Decisions
row 0 done | seeded 20 rows, closed 19 on baseline | row 21
row 21 done | Wave reviews, re-reviews and conformance-fix reviews now check each finding against the assigned diff before selecting repairs. | Reuse the review-point table in scripts/wave-review.test.mjs to check link resolution and ordering at both repair sites.
row 22 done | Both review sites require the orchestrator to cite the contrary hunk and make no edit for a disproved finding. | nothing new to build on
row 23 done | Verified the rendering sites for 23 gate and question rows and six ship endings, and made the lint reject unlisted gate IDs inside those sites. | Use the inventory in scripts/gate-contract-lint.test.mjs to check the renamed IDs and ship endings.
row 24 done | Replaced the flat README settings table with an outline that names each block, its sections and their readers, and updated the worked examples. | Reuse the block and section inventory in scripts/gauntlet-tree-lint.mjs to check overrides files against the documented layout.
row 31 done | Moved the repo's tracker and cleanup settings into shared sections and its release instructions into the ship section of the run block. | Pass overrides fixture text to lintOverridesFile in scripts/gauntlet-tree-lint.mjs to detect unknown blocks or misplaced sections.
row 25 done | Updated all 22 overrides paragraphs to apply the seven shared sections and only the caller's own scope, reusing reads only for the same repository and trusted revision. | Reuse the caller table in scripts/gauntlet-tree-lint.test.mjs to check phase, helper and retained-skill scopes.
row 26 done | Verified that each phase applies run-wide text and its own phase section and that both implementation engines apply the implement section. | nothing new to build on
row 29 done | Removed instructions to apply the retired wording sections and directed commit writers to the repo's agent instructions for subject conventions. | Run scripts/gauntlet-tree-lint.test.mjs to catch retired wording sections in skills, personas and guides.
row 30 done | Changed the loop to discover the project's test entrypoint when shared verification has no command instead of taking a backticked command from phase prose. | Run scripts/loop-verification-command.test.mjs to check the loop's two command sources independently.
row 27 done | Routed the five code readers through one shared-section lookup and updated skill instructions to read tracker, sibling, deployment and verification settings from the shared block. | Use readSharedSection in extensions/lib/overrides.ts with a repository root and section name to read its first overrides file.
row 32 done | Verified that all skill entries name the same three gauntlet.md locations that the extension and bin reader checks, in first-found order. | nothing new to build on
row 33 done | Verified tracker selection with both filenames, the retired filename alone and a tracker under another block, plus sibling and spec-index section boundaries. | Extend the originless membership cases in extensions/verify-before-ship.test.ts to check which repository supplies the ship policy.
row 28 done | Scoped private settings to the skill that reads them and migrated sample overrides to the same outline. | Use the overrides-outline checks in scripts/gauntlet-tree-lint.test.mjs to validate skill readers and sample file excerpts.
row 34 done | The report and index omit earlier run records until the seal command moves them to the gauntlet key without changing their bytes. | Reuse the bare-remote fixture in src/bins/gauntlet-telemetry-ref-migration.test.mjs to check migration conflicts and concurrent pushes.
row 35 done | CI prepares every eval sample against the merge-base and working tree without calling a model. | Use prepareTarget in eval/run.mjs to inspect each sample's baseline and candidate prompts without changing its saved results.
row 36 done | A regression test checks both generated prompts and candidate instructions for retired skill commands while exempting verbatim baseline instructions. | Run eval/lib/run.test.mjs to check the command boundary against every sample.
row 37 done | Both models followed the handoff pointer, kept an ordinary request outside the run, and applied only shared and gate-specific overrides. | Run scripts/entry-phase-evals.test.mjs to check the three saved samples without calling a model.
row 38 done | The upgrade notes map the entry command, 11 retired steps, 19 gate IDs and project settings, and explain how to finish interrupted runs and migrate earlier records. | Use lintReleaseNotes in scripts/gauntlet-tree-lint.mjs to check the migration tables before and after release promotion.
repair verification | home 424eb14 | iteration 12
amended | 1 item(s) | Reference check coverage
amended | 1 item(s) | Reference check forms
