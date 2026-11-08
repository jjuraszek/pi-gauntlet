# Ledger - loop engine
**Spec:** `doc/specs/2026-11-08-gh-132-scripted-dispatch-guard.md`
base: 53894d66119fe8dbd40107b5add28f6c66d58fb7
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 221 passed, 0 failed; nested dispatch blocked before latch, counter, cadence, or liveDispatch mutation; no paid/external actions or background jobs launched |
| 2 | done | 0 | timeout -k 30 120 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test extensions/phase-tracker.test.ts; 222 passed, 0 failed; nested dispatch allowed without flow entry in parent and child sessions; no paid/external actions or background jobs launched |
| 3 | open | 0 | |
| 4 | open | 0 | timeout -k 30 10 python3 -c 'assert all(term in __import__("pathlib").Path("doc/configuration.md").read_text().split("## Extensions\n", 1)[1].split("\n### ", 1)[0] for term in ("subagent", "direct-only", "`only`", "unsupported", "entered")), "codemode paragraph lacks direct-only dispatch and only-mode entered-flow restriction"'; exit 1: codemode paragraph lacks direct-only dispatch and only-mode entered-flow restriction; no paid/external actions or background jobs launched |
| 5 | open | 0 | |
| 6 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Blocked scripted dispatch before state mutation in every entered phase; 221 hook tests passed. | Reuse nestedCall and the phase/state cases in extensions/phase-tracker.test.ts for nested-result and compatibility checks.
row 2 done | Confirmed nested dispatch stays allowed without flow entry; 222 hook tests passed. | Reuse the no-flow parent and child cases in extensions/phase-tracker.test.ts as compatibility checks.
