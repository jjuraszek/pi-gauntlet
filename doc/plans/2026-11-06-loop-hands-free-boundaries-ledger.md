# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-loop-hands-free-boundaries.md`
base: 82cc2b80e5c9c5216f8a55817628ca9532381a99
verification: npm test
checks: commands
iterations: 3
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | node eval/run.mjs loop-implementation interrupted-child-redispatch --base 82cc2b80e5c9c5216f8a55817628ca9532381a99; 2 model cells improved; 16 candidate facts hold; partial narrated recovery coverage |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | rg --quiet --fixed-strings 'Name every paid or external action' skills/brainstorming/SKILL.md; exit 1; round 2 lacks the paid or external action Design clause |
| 10 | open | 0 | |
| 11 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 9: add the round-2 bounded paid or external action clause and its selected eval sample
row 1 failed | Scratch checks failed: PGID equality accepts a reused leader, and reset/clean deletes unrelated post-dispatch work. | Recommend amendment Ownership-fenced recovery: require process identity and exclusive checkout provenance, or stop; do not implement PGID-only kills or blanket reset/clean.
row 1 done | Added ownership-fenced interrupted recovery for home, companion and seed returns, preserving uncertain work. | Reuse skills/loop-implementation/SKILL.md's recovery procedure and the interrupted-child-redispatch eval sample for later boundary changes.
