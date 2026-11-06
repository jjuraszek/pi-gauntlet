# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-loop-hands-free-boundaries.md`
base: 82cc2b80e5c9c5216f8a55817628ca9532381a99
verification: npm test
checks: commands
iterations: 5
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | node eval/run.mjs loop-implementation interrupted-child-redispatch --base 82cc2b80e5c9c5216f8a55817628ca9532381a99; 2 model cells improved; 16 candidate facts hold; partial narrated recovery coverage |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 45 passed; stagnation-and-retry and amend-resets-windows evals improved with 18 candidate facts holding; partial narrated routing coverage |
| 3 | done | 1 | node --test scripts/loop-verification-repair.test.mjs; 2 passed; 4 selected verification-repair evals with 30 candidate facts holding; partial narrated repair coverage |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | done | 0 | rg --quiet 'Inside the implement loop, end a turn only with a stop header from ## Human stop.*follow every intermediate report with the next ordered-table action in the same turn' skills/loop-implementation/SKILL.md; exit 0; same-turn-continuation eval improved with 6 candidate facts holding; partial narrated continuation coverage |
| 9 | open | 0 | rg --quiet --fixed-strings 'Name every paid or external action' skills/brainstorming/SKILL.md; exit 1; round 2 lacks the paid or external action Design clause |
| 10 | open | 0 | |
| 11 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 9: add the round-2 bounded paid or external action clause and its selected eval sample
row 1 failed | Scratch checks failed: PGID equality accepts a reused leader, and reset/clean deletes unrelated post-dispatch work. | Recommend amendment Ownership-fenced recovery: require process identity and exclusive checkout provenance, or stop; do not implement PGID-only kills or blanket reset/clean.
row 1 done | Added ownership-fenced interrupted recovery for home, companion and seed returns, preserving uncertain work. | Reuse skills/loop-implementation/SKILL.md's recovery procedure and the interrupted-child-redispatch eval sample for later boundary changes.
row 2 done | Replaced stagnation stops with row-local hints and reset both windows on admitted amendments without resetting counters or escalation. | Reuse skills/loop-implementation/SKILL.md's window rule and the stagnation-and-retry and amend-resets-windows samples for boundary checks.
row 8 done | Required intermediate implement reports to continue to the next ordered action in the same turn and end only at a human stop. | Reuse eval/loop-implementation/samples/same-turn-continuation to check progress reports, hint dispatches and exhausted-row stops.
row 3 done | Bound verification repairs by allowance with durable reservations and ownership-fenced recovery across legs and resume. | Reuse scripts/loop-verification-repair.test.mjs and verify-repair-count for repair-count, pending admission and recovery checks.
