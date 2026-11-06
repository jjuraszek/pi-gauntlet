# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-gh-124-telemetry-branch-leg-records.md`
base: d04aa00576eaaf802b8cdde8d8ab1917d0118f68
verification: npm test
checks: commands
iterations: 13
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --test src/bins/gauntlet-telemetry-seal-branch.test.mjs; 2 passed; 0 failed; PR and squash preserve feature HEAD and index while publishing orphan records |
| 2 | done | 1 | node --test src/bins/gauntlet-telemetry-invariance.test.mjs; 9 passed, 0 failed, 0 skipped; seal and leg publisher preserve index, checkout bytes and worktree list in git, linked and jj-colocated workspaces; temporary indexes removed after successful and rejected pushes |
| 3 | done | 1 | node --test src/bins/gauntlet-telemetry-concurrency.test.mjs; 6 passed, 0 failed; shared-tip and orphan races retry once without force; stranded records survive rejection and recover through refresh, seal or leg publication |
| 4 | done | 1 | node -e 'require("node:assert/strict").deepEqual(require("yaml").parse(require("node:fs").readFileSync(".github/workflows/test.yml", "utf8")).on.push, {"branches-ignore":["gauntlet/telemetry"]})'; assertion passed; push excludes gauntlet/telemetry with no branches key; consumer CI exclusion and telemetry.remote guidance documented |
| 5 | done | 1 | node -e '((fs,yaml,assert) => assert.deepEqual([yaml.parse(fs.readFileSync(".github/workflows/test.yml","utf8")).on.push,yaml.parse(fs.readFileSync(".github/workflows/release.yml","utf8")).on.push,...["Exclude `gauntlet/telemetry` from every push-triggered workflow","set `piGauntlet.telemetry.remote` to a separate repository URL"].map(text => fs.readFileSync("doc/configuration.md","utf8").includes(text))],[{"branches-ignore":["gauntlet/telemetry"]},{tags:["v[0-9]+.[0-9]+.[0-9]+"]},true,true]))(require("node:fs"),require("yaml"),require("node:assert/strict"))'; assertions passed; test workflow excludes telemetry and release workflow is tag-only; consumer exclusion and remote alternative documented |
| 6 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test src/bins/gauntlet-telemetry-readers.test.mjs extensions/telemetry.test.ts; 100 passed, 0 failed; readers refresh origin or configured remote and serve fetched refs offline; pending records retry, guard caches per session, timeout and bare-dir checks pass |
| 7 | done | 1 | node --test src/bins/gauntlet-telemetry-migration.test.mjs; 5 passed, 0 failed; repeat migration adds no commit and disabled or rejected pushes preserve sources; 108 committed records plus one fixture retain byte-identical files columns and legacy records group under unknown repo |
| 8 | done | 0 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test src/bins/gauntlet-telemetry-readers.test.mjs extensions/telemetry.test.ts; 100 passed, 0 failed; brainstorm writes to shipped specs block from refreshed or cached refs with the guard reason; absent refs allow writes with one guard-unavailable notice |
| 9 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry.test.ts extensions/lib/gauntlet-settings.test.ts src/bins/gauntlet-telemetry-seal-branch.test.mjs src/bins/gauntlet-telemetry-jj.test.mjs src/bins/gauntlet-telemetry-invariance.test.mjs src/bins/gauntlet-telemetry-concurrency.test.mjs; 141 passed; 0 failed |
| 10 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-leg.test.ts extensions/telemetry.test.ts; 94 passed; 0 failed; final done or stuck settlements publish one record after follow-on work without changing checkout or index |
| 11 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-leg-fields.test.ts; 4 passed; 0 failed |
| 12 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-settlement-contract.test.ts; 5 passed, 0 failed; six selected eval replies parse with observed ticket refs and assessed PR heads; per-ref-settlement improved for all three skills |
| 13 | done | 0 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-leg-fields.test.ts; 5 passed; 0 failed |
| 14 | done | 0 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-leg-fields.test.ts; 8 passed; 0 failed |
| 15 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/telemetry-leg-rounds.test.ts; 2 passed; 0 failed; repeated legs retained and grouped into chronological rounds |
| 16 | open | 0 | |
| 17 | open | 0 | |
| 18 | open | 0 | |
| 19 | open | 0 | |
| 20 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1 using src/bins/gauntlet-telemetry-seal-branch.test.mjs beside its bin-test siblings
row 1 done | Sealing publishes common-dir records to an orphan telemetry branch without changing feature HEAD, index, or the squash-delivered tree. | Reuse extensions/lib/telemetry-branch.ts for common-dir lookup and plumbing-based record publication; extend its sync helper for retries.
row 2 done | Verified checkout and index byte invariance for seals and leg publication in git, linked worktrees and jj-colocated workspaces, including rejected pushes. | Reuse src/bins/gauntlet-telemetry-invariance.test.mjs to check publisher isolation and temporary-index cleanup when extending sync behavior.
row 3 done | Replay resolves shared-tip and orphan races, retains stranded records after a second rejection, and prints nonblocking seal failures. | Reuse syncTelemetryBranch in extensions/lib/telemetry-branch.ts with an empty map to push pending commits during reader refreshes.
row 4 done | Excluded telemetry pushes from CI and documented consumer workflow exclusions and the remote alternative. | scripts/ci.mjs pins telemetry push exclusion; reuse doc/configuration.md's CI snippet for consumer setup.
row 5 done | Confirmed telemetry branch pushes match neither workflow and consumer docs describe exclusion and the remote alternative. | nothing new to build on
row 6 done | Readers refresh telemetry refs, retry pending pushes and serve cached records with bounded warnings; explicit directories stay offline. | Reuse readTelemetryBranch in extensions/lib/telemetry-branch.ts; its src/bins/gauntlet-telemetry-readers.test.mjs fixtures sit beside the bin-test siblings.
row 8 done | Confirmed brainstorm writes block from refreshed or cached shipped records and pass with one unavailable notice when no fetched ref exists. | nothing new to build on
row 7 done | Added idempotent corpus migration, origin repo stamps and unknown-repo grouping, preserving files output for all 108 committed records. | Reuse --migrate in src/bins/gauntlet-telemetry-seal.mjs and src/bins/gauntlet-telemetry-migration.test.mjs to retire the tracked corpus.
row 9 done | Moved recorder state into Git or jj metadata, retired telemetry.dir with a warning and made plain-jj sealing return the unsupported-store notice. | Reuse extensions/telemetry.ts metadata binding and src/bins/gauntlet-telemetry-jj.test.mjs to test local-only jj sealing.
row 10 done | Added session-leg publication for all three skills at final done or stuck settlement, after follow-on work. | Extend extensions/lib/telemetry-leg.ts for record fields; reuse extensions/telemetry-leg.test.ts beside its extension-test siblings for lifecycle checks.
row 11 done | Leg records now carry observed author, version, models, tokens and cost, plus parsed item identities and outcomes. | Reuse telemetry-leg.ts settlementItems and accumulator accessor; telemetry-leg-fields.test.ts checks measured fields against forged assistant claims.
row 13 done | Verified that council member usage and models enter shape-ticket totals once through the existing dispatch reducer. | Reuse the council usage fixture in extensions/telemetry-leg-fields.test.ts for parent and child cost conservation checks.
row 14 done | Verified one record per batch for all three skills with every settled ref and conserved parent plus child costs. | Extend the batch cases in extensions/telemetry-leg-fields.test.ts to exercise additional item and accounting combinations.
row 12 done | Standardized per-ref settlement rows across all three skills, documented tokens and verified six model replies parse correctly. | Reuse extensions/telemetry-settlement-contract.test.ts and each skill's per-ref-settlement eval fixtures to check settlement grammar and item identities.
row 15 done | Retained subsecond leg timestamps and added chronological ticket/PR rounds, with sibling regression tests covering repeated sessions and source/bundle parity. | Reuse src/bins/performance/leg-rounds.mjs groupRounds and itemKey for ticket/PR totals and run joins.
