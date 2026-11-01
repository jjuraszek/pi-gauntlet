# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`
base: c0d120bfe50a26056af5cfca0e4855de9278b2f4
verification: npm test
checks: commands
iterations: 3
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 1; PASS row 1 text assertions; One AC row with invariants and fenced report |
| 2 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 2; PASS row 2 text assertions; PASS companion fields and binding/protected blocks |
| 3 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 3; FAIL missing loop: seed evidence commit contract |
| 4 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 4; FAIL missing maxIterationsPerRow and shared attempt budget |
| 5 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 5; FAIL step 6 lacks closureReview resolution |
| 6 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 6; FAIL step 6 explicitly says no second audit |
| 7 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 7; FAIL no Decisions ledger reporting contract |
| 8 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 8; PASS protected blocks byte-identical; FAIL AC8 shipped allowlist excludes current loop ledger; Recheck after parent strips ledger at finish |
| 9 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 9; PASS scoped instruction-size and gh-36 binding assertions; AC9 requires npm test but loop workers forbid full verification; Full-suite result unproven and row remains open |

## Decisions

row 0 done | seeded 9 rows, closed 0 on baseline | 1
row 1 done | Added the single-AC handoff template, R2/R3 invariants, fenced verbatim report, and dependency evidence command. | Keep the handoff template and implement seed-then-row dispatch next.
row 2 done | Replaced step 4 with fresh companion seed-then-row dispatches and added the parent-owned ledger, mapping, Rules, and seed hints. | Keep dispatch and binding text; add exact commit admission checks next.
