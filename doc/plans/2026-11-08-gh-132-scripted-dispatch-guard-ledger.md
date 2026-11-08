# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md`
base: 53894d66119fe8dbd40107b5add28f6c66d58fb7
verification: npm test
checks: commands
iterations: 4
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 221 passed, 0 failed; nested dispatch blocked before latch, counter, cadence, or liveDispatch mutation; no paid/external actions or background jobs launched |
| 2 | done | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 222 passed, 0 failed; nested dispatch allowed without flow entry in parent and child sessions; no paid/external actions or background jobs launched |
| 3 | done | 1 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 228 passed, 0 failed; nested results preserve closure latch, rounds, credits, and cadence while live dispatch cleanup still runs; no paid/external actions or background jobs launched |
| 4 | done | 1 | timeout -k 30 10 python3 -c 'assert all(term in __import__("pathlib").Path("doc/configuration.md").read_text().split("## Extensions\n", 1)[1].split("\n### ", 1)[0] for term in ("subagent", "direct-only", "`only`", "unsupported", "entered")), "codemode paragraph lacks direct-only dispatch and only-mode entered-flow restriction"'; passed: direct-only dispatch and entered-flow only-mode restriction match the block reason; no paid/external actions or background jobs launched |
| 5 | done | 0 | timeout -k 30 10 python3 -c 'assert all(term in __import__("pathlib").Path("doc/configuration.md").read_text().split("## Extensions\n", 1)[1].split("\n### ", 1)[0] for term in ("Codemode `on` (pi defaults to this mode) supports an entered gauntlet flow", "`phase_tracker`, `plan_check`, and `plan_tracker` are model-only", "`subagent` and `gauntlet_setting` keep their default exposure", "direct declaration plus", "Codemode `only` is unsupported while a flow is entered", "reachable only through", "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md")), "codemode paragraph lacks per-mode support, exposure, or upstream link"'; passed: both modes explain support and exposure with the upstream link; no paid/external actions or background jobs launched |
| 6 | done | 0 | timeout -k 30 10 python3 -c 'assert all(term in __import__("pathlib").Path("doc/configuration.md").read_text().split("## Extensions\n", 1)[1].split("\n### ", 1)[0] for term in ("literal `subagent({...})` examples in skills", "direct tool call", "name and argument object", "not JavaScript to run through codemode", "Under `on`, the model issues that call directly")), "codemode paragraph lacks literal-example interpretation"'; passed: literal examples identify direct tool names and arguments, not codemode JavaScript; no paid/external actions or background jobs launched |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Blocked scripted dispatch before state mutation in every entered phase; 221 hook tests passed. | Reuse nestedCall and the phase/state cases in extensions/phase-tracker.test.ts for nested-result and compatibility checks.
row 2 done | Confirmed nested dispatch stays allowed without flow entry; 222 hook tests passed. | Reuse the no-flow parent and child cases in extensions/phase-tracker.test.ts as compatibility checks.
row 3 done | Excluded nested results from replay-mirrored state updates; 228 hook tests passed. | Reuse the nested-result cases in extensions/phase-tracker.test.ts to check latch, round, credit, cadence, and live-dispatch behavior.
row 4 done | Documented direct-only dispatch, the only-mode restriction, and nested-result exclusion; the paragraph assertion passed. | Extend doc/configuration.md's Extensions paragraph for mode support and example interpretation.
row 5 done | Explained support and tool exposure for both codemode modes and linked pi's docs; the mode assertion passed. | Reuse doc/configuration.md's per-mode support statement when interpreting skill dispatch examples.
row 6 done | Clarified that literal skill examples name direct calls rather than codemode JavaScript; the example assertion passed. | Reuse doc/configuration.md's example-reading guidance for direct dispatch under codemode on.
