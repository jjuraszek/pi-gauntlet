# Ledger - loop engine
**Spec:** `doc/specs/2026-11-17-gh-161-per-gauntlet-temp-space.md`
base: 170b94508654b3e0944554816ec28920f9b4450a
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 2 | home | d92693c57ea847bee59055046ba0e79bcdf9545a

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/gate-teardown.test.mjs; 9 passed; separate gate runs and child retirement preserve sibling progress; teardown-own-run-folder model replay: 2 cells improved, 5 facts hold each |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/stage-skill-lint.test.mjs; 1 passed; stage-local scratch and all scoped temp-path fixtures pass; ended run artifacts are removed and named kept drafts survive |
| 3 | done | 0 | timeout -k 30 60 node --test scripts/stage-skill-lint.test.mjs; 1 passed; named reply and coverage drafts retain their bytes after a different gate run ends |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Added owned gate folders and a checked teardown block that preserves sibling progress. | Reuse gate-teardown-shell in post-selection-loop.md and scripts/gate-teardown.test.mjs for the remaining scratch relocation.
row 2 done | Relocated stage and gate scratch, aligned worker recovery paths, and added temp-path lint and storage docs. | Reuse return-file.md's stage-scratch-shell and scripts/stage-skill-lint.test.mjs to check checkout-local storage and gate artifact lifetimes.
row 3 done | Checked that kept reply and coverage drafts survive another gate run's teardown. | nothing new to build on
amended | 1 item(s) | Description file location
amended | 2 item(s) | Brainstorming samples made stale by the summary path
