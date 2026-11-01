# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-109-loop-gate-set-driver-holds.md`
base: 2a946c1c088c59bbc990c2dacb1bef2cb89a3b14
verification: npm test
iterations: 1
cap: 33

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | rg -n -F 'first unescaped semicolon' agents/loop-implementer.md; exit 1; command-first evidence rule absent, worker records a check name |
| 2 | open | 0 | rg -n '^## Gate set$' skills/loop-implementation/SKILL.md; exit 1; gate-set definition absent, verify still invokes full verification |
| 3 | open | 0 | test -f skills/finishing-a-development-branch/reference/verification-set.md; exit 1; gate-set and skip-rule reference absent |
| 4 | open | 0 | rg -n 'task.*log path' skills/loop-implementation/SKILL.md; exit 1; repair dispatch carries failing output rather than a log path |
| 5 | open | 0 | rg -n '^## Driver holds$' skills/loop-implementation/SKILL.md; exit 1; driver read boundary section absent |
| 6 | open | 0 | rg -n -F 'tail -n 20' skills/loop-implementation/SKILL.md; exit 1; bounded human-stop log excerpt absent |
| 7 | open | 0 | rg -n -i 'gate set' doc/implement-engines.md; exit 1; engine documentation still describes the full ledger command |
| 8 | open | 0 | test -f eval/loop-implementation/samples/gate-set-verify-step-1/case.md; exit 1; required gate-set verify sample absent, model evals not run |

## Decisions
row 0 done | seeded 8 rows, closed 0 on baseline | row 1
