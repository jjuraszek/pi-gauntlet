# Ledger - loop engine
**Spec:** `doc/specs/2026-11-06-loop-hands-free-boundaries.md`
base: 82cc2b80e5c9c5216f8a55817628ca9532381a99
verification: npm test
checks: commands
iterations: 9
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | node eval/run.mjs loop-implementation interrupted-child-redispatch --base 82cc2b80e5c9c5216f8a55817628ca9532381a99; 2 model cells improved; 16 candidate facts hold; partial narrated recovery coverage |
| 2 | done | 1 | node --test scripts/loop-engine-contract.test.mjs; 45 passed; stagnation-and-retry and amend-resets-windows evals improved with 18 candidate facts holding; partial narrated routing coverage |
| 3 | done | 1 | node --test scripts/loop-verification-repair.test.mjs; 2 passed; 4 selected verification-repair evals with 30 candidate facts holding; partial narrated repair coverage |
| 4 | done | 1 | node --test scripts/loop-conformance-grant.test.mjs; 2 passed; conformance-grant eval improved with 16 candidate facts holding; partial narrated funding coverage |
| 5 | done | 1 | node --test scripts/loop-unreachable-cut.test.mjs; 2 passed; unreachable-cut eval improved with 16 candidate facts holding; partial narrated amendment coverage |
| 6 | done | 1 | timeout -k 30 60 node --test scripts/loop-implementer-actions.test.mjs; 7 passed; ran silence-bound-and-unreachable (1 of 1), 12 candidate facts hold; partial narrated action coverage |
| 7 | failed | 1 | timeout -k 30 60 bash -c 'command -v setsid'; exit 1: required setsid executable missing from PATH; scratch Python start_new_session=True proved pid=pgid=sid and timeout exit 124; leader and group absent after wait, log timed out after 2 s, jobs empty |
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
row 4 done | Funded loop conformance rounds up to allowance under amend permission, preserving cap stops, tool-error stops and runtime credits. | Reuse scripts/loop-conformance-grant.test.mjs and conformance-grant for cap funding, enforcement-off, permission and resume checks.
row 5 done | Routed admitted unreachable evidence through audited cuts, preserving venue failures, spent-bound stops and counters. | Reuse skills/loop-implementation/reference/unreachable-returns.md and unreachable-cut for marker routing and amendment integration.
row 6 done | Added bounded action authorization and local replay evidence; ran silence-bound-and-unreachable (1 of 1). | Reuse agents/loop-implementer.md and the silence-bound-and-unreachable sample for timeout coverage; scripts/loop-implementer-actions.test.mjs replays stored action facts locally.
row 7 failed | Required setsid is absent; scratch Python launch proved an owned session, timeout and empty jobs without changing the persona. | Recommend amendment Portable owned-session launch: preflight Python start_new_session=True with timeout and identity fences; do not retry absent setsid or install dependencies.
