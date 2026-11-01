# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-110-loop-multi-row-close.md`
base: 407680b9c98894fdcc16aedd0feb6ac2c28b2215
verification: npm test
checks: commands
iterations: 6
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs loop-implementation multi-row-return; exit 0 improved; all 6 candidate facts hold on both replay models; partial coverage of home return admission |
| 2 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/plan-tracker.test.ts; 35 passed; 0 failed; zero-attempt child extra is complete without a budget prefix and baseline remains skipped |
| 3 | done | 0 | node -e '((a,f)=>(a.ok(f.readFileSync("skills/loop-implementation/SKILL.md","utf8").includes("Run the complete set at verify step 1")),a.doesNotMatch(f.readFileSync("skills/loop-implementation/SKILL.md","utf8"),/loop: regress/),a.doesNotMatch(f.readFileSync("skills/loop-implementation/SKILL.md","utf8").split("## Validate the return\n")[1].split("## Human stop\n")[0],/\b[Rr]un\b/),a.ok(f.readFileSync("skills/gauntlet-resume/reference/reconstruction.md","utf8").includes("never rerun the recovered row"))))(require("node:assert/strict"),require("node:fs"))'; exit 0; gate-set timing and read-only return admission hold on baseline |
| 4 | done | 1 | node eval/run.mjs loop-implementer row-and-evidence; exit 0 improved; all 8 candidate facts hold on both replay models; partial synthetic coverage of target-first extras and failed-target isolation |
| 5 | done | 1 | node eval/run.mjs loop-implementer row-and-evidence; exit 0 improved; all 10 candidate facts hold on both replay models; partial synthetic coverage of artifact handoffs and preserved retry guidance |
| 6 | done | 1 | node eval/run.mjs loop-implementation companion-multi-row; exit 0 improved; all 6 candidate facts hold on both replay models; partial companion admission and pending recovery coverage |
| 7 | open | 0 | node -e 'require("node:assert/strict").ok(require("node:fs").readFileSync("skills/loop-implementation/SKILL.md","utf8").includes("at least one non-cut row"),"seed admission still requires evidence on every non-cut row")'; exit 1; seed admission still requires evidence on every non-cut row |
| 8 | open | 0 | node -e 'require("node:assert/strict").ok(require("node:fs").readFileSync("agents/loop-implementer.md","utf8").includes("normal state"),"persona does not describe empty evidence as normal for unreached rows")'; exit 1; persona does not describe empty evidence as normal for unreached rows |
| 9 | open | 0 | node -e 'require("node:assert/strict").ok(require("node:fs").readFileSync("skills/loop-implementation/SKILL.md","utf8").includes("loop: repair seed"),"seed validation misses still stop without automatic repair and retry")'; exit 1; seed validation misses still stop without automatic repair and retry |
| 10 | open | 0 | node -e 'require("node:assert/strict").ok(!require("node:fs").readFileSync("skills/loop-implementation/SKILL.md","utf8").includes("decision and evidence on every non-cut row survives"),"seed selection still requires evidence on every non-cut row")'; exit 1; seed selection still requires evidence on every non-cut row |
| 11 | open | 0 | node -e 'require("node:assert/strict").ok(require("node:fs").readFileSync("doc/specs/2026-10-23-gh-68-loop-implement-engine.md","utf8").includes("#110"),"predecessor lacks the multi-row and partial-seed supersession note")'; exit 1; predecessor lacks the multi-row and partial-seed supersession note |
| 12 | open | 0 | node -e 'require("node:assert/strict").ok(!require("node:fs").readFileSync("eval/loop-implementer/samples/row-and-evidence/expected.md","utf8").includes("row 2 stays open"),"snapshot A still forbids closing row 2")'; exit 1; snapshot A still forbids closing row 2 |

## Decisions
row 0 done | seeded 12 rows, closed 1 on baseline | row 1
row 1 done | Home admission accepts evidenced same-leg extras and restores rejected changes before refresh. | Do not redo home admission; extend multi-row-return for later validation work.
row 2 done | Added tracker coverage proving child-closed extras complete without a budget prefix while baseline rows stay skipped. | Do not redo admission; reuse the zero-attempt extra refresh case and leave worker emission to row 4.
row 4 done | Enabled target-first same-leg extras with unchanged attempts and per-row evidence and decisions; both selected eval models pass. | Reuse the expanded row-and-evidence sample; leave artifact-oriented decisions and partial seeding to their own rows.
row 5 done | Done decisions now name reusable artifacts or explicitly report none, while failed decisions retain retry guidance. | Reuse the two handoff facts in row-and-evidence; do not redo decision wording when changing seed behavior.
row 6 done | Companion admission now accepts same-leg extras with matching decisions and records every admitted row during recovery. | Reuse companion-multi-row; leave partial seed to row 7 and repair the two stale home-boundary test assertions during conformance work.
