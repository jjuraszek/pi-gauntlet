# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-110-loop-multi-row-close.md`
base: 407680b9c98894fdcc16aedd0feb6ac2c28b2215
verification: npm test
checks: commands
iterations: 13
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs loop-implementation multi-row-return; exit 0 improved; all 6 candidate facts hold on both replay models; partial coverage of home return admission |
| 2 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; 35 passed; 0 failed; zero-attempt child extra is complete without a budget prefix and baseline remains skipped |
| 3 | done | 0 | node -e '((a,f)=>(a.ok(f.readFileSync("skills/loop-implementation/SKILL.md","utf8").includes("Run the complete set at verify step 1")),a.doesNotMatch(f.readFileSync("skills/loop-implementation/SKILL.md","utf8"),/loop: regress/),a.doesNotMatch(f.readFileSync("skills/loop-implementation/SKILL.md","utf8").split("## Validate the return\n")[1].split("## Human stop\n")[0],/\b[Rr]un\b/),a.ok(f.readFileSync("skills/gauntlet-resume/reference/reconstruction.md","utf8").includes("never rerun the recovered row"))))(require("node:assert/strict"),require("node:fs"))'; exit 0; gate-set timing and read-only return admission hold on baseline |
| 4 | done | 1 | node eval/run.mjs loop-implementer row-and-evidence; exit 0 improved; all 8 candidate facts hold on both replay models; partial synthetic coverage of target-first extras and failed-target isolation |
| 5 | done | 1 | node eval/run.mjs loop-implementer row-and-evidence; exit 0 improved; all 10 candidate facts hold on both replay models; partial synthetic coverage of artifact handoffs and preserved retry guidance |
| 6 | done | 1 | node eval/run.mjs loop-implementation companion-multi-row; exit 0 improved; all 6 candidate facts hold on both replay models; partial companion admission and pending recovery coverage |
| 7 | done | 1 | node eval/run.mjs loop-implementation partial-seed; exit 0 improved; all 6 candidate facts hold on both replay models; partial home and companion seed admission coverage |
| 8 | done | 1 | node eval/run.mjs loop-implementer empty-evidence-row; exit 0 improved; all 4 candidate facts hold on both replay models; partial synthetic coverage of ordinary home success after partial seeding |
| 9 | done | 1 | node eval/run.mjs loop-implementation seed-retry; exit 0 improved; all 6 candidate facts hold on both replay models; partial synthetic coverage of home and companion seed repair and one retry |
| 10 | done | 1 | node eval/run.mjs loop-implementation seed-selection; exit 0 improved; all 5 candidate facts hold on both replay models; partial synthetic coverage of partial and legacy seeds, reset and coordinated continuation |
| 11 | done | 1 | node -e '[["doc/specs/2026-10-23-gh-68-loop-implement-engine.md",["#110","every row names its evidence","at most one ledger row changed status","successor wins"]],["doc/implement-engines.md",["extra `open` rows of its leg","each with its own command-first evidence and decision line","may leave other rows `open` with empty evidence","baseline closures and child-closed extras alike"]],["doc/configuration.md",["at least one non-cut row","one line per row, target first","what later rows can build on","second consecutive seed miss stops","not until every row has evidence"]],["CHANGELOG.md",["## Unreleased","(#110)"]]].forEach(([file,tokens])=>tokens.forEach(token=>require("node:assert/strict").ok(require("node:fs").readFileSync(file,"utf8").includes(token),file+": "+token))),require("node:child_process").execFileSync("git",["diff","--exit-code","407680b9c98894fdcc16aedd0feb6ac2c28b2215","--","skills/subagent-driven-development/"]),console.log("4 documentation checks passed, waves skills unchanged")'; 4 documentation checks passed; waves skills unchanged |
| 12 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 43 passed, 0 failed; row-and-evidence and seed-retry selected replays improved on both models; all 10 worker and 6 retry candidate facts hold, partial synthetic coverage |

## Decisions
row 0 done | seeded 12 rows, closed 1 on baseline | row 1
row 1 done | Home admission accepts evidenced same-leg extras and restores rejected changes before refresh. | Do not redo home admission; extend multi-row-return for later validation work.
row 2 done | Added tracker coverage proving child-closed extras complete without a budget prefix while baseline rows stay skipped. | Do not redo admission; reuse the zero-attempt extra refresh case and leave worker emission to row 4.
row 4 done | Enabled target-first same-leg extras with unchanged attempts and per-row evidence and decisions; both selected eval models pass. | Reuse the expanded row-and-evidence sample; leave artifact-oriented decisions and partial seeding to their own rows.
row 5 done | Done decisions now name reusable artifacts or explicitly report none, while failed decisions retain retry guidance. | Reuse the two handoff facts in row-and-evidence; do not redo decision wording when changing seed behavior.
row 6 done | Companion admission now accepts same-leg extras with matching decisions and records every admitted row during recovery. | Reuse companion-multi-row; leave partial seed to row 7 and repair the two stale home-boundary test assertions during conformance work.
row 7 done | Seed admission now accepts evidenced subsets at home and in companions while preserving zero attempts and unreached rows. | Reuse partial-seed and seed-recovery; leave empty-evidence guidance, seed retry and selection changes to rows 8-10.
row 8 done | Empty evidence is now normal after partial seeding, and workers create a first check before closing or failing the row. | Reuse empty-evidence-row for ordinary follow-up coverage; leave automatic seed retry and selection to rows 9-10.
row 9 done | Seed validation misses now repair and retry once at home and in companions, with the second miss stopping and valid seeds resetting the window. | Reuse seed-retry for repair coverage; leave validated partial-seed selection to row 10.
row 10 done | Validated partial seeds now select ordinary rows from committed seed state instead of demanding evidence on every non-cut row. | Reuse seed-selection for partial, legacy, reset and coordinated continuation coverage; leave supersession docs and conformance to rows 11-12.
row 11 done | Documented multi-row returns, partial seeding and seed retry in the engine guide, configuration, changelog and predecessor note. | Do not redo the documentation; row 12 retains eval conformance work and waves skills remain unchanged.
row 12 done | Updated boundary assertions and verified multi-row and seed-retry replays; 43 contract tests pass and both selected samples improve. | Reuse the sample-scoped reports; leave full verification and live-run coverage to the parent.
