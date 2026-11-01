# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`
base: c0d120bfe50a26056af5cfca0e4855de9278b2f4
verification: npm test
checks: commands
iterations: 1
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 1; FAIL missing Acceptance criteria section in handoff |
| 2 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 2; FAIL step 4 lacks loop-implementer |
| 3 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 3; FAIL missing loop: seed evidence commit contract |
| 4 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 4; FAIL missing maxIterationsPerRow and shared attempt budget |
| 5 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 5; FAIL step 6 lacks closureReview resolution |
| 6 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 6; FAIL step 6 explicitly says no second audit |
| 7 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 7; FAIL no Decisions ledger reporting contract |
| 8 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 8; PASS protected blocks byte-identical; FAIL AC8 shipped allowlist excludes current loop ledger; Recheck after parent strips ledger at finish |
| 9 | open | 0 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 9; PASS scoped instruction-size and gh-36 binding assertions; AC9 requires npm test but loop workers forbid full verification; Full-suite result unproven and row remains open |

## Decisions

row 0 done | seeded 9 rows, closed 0 on baseline | 1
