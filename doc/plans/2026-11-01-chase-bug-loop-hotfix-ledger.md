# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`
base: c0d120bfe50a26056af5cfca0e4855de9278b2f4
verification: npm test
checks: commands
iterations: 12
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 1; PASS row 1 text assertions; One AC row with invariants and fenced report |
| 2 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 2; PASS row 2 text assertions; PASS companion fields and binding/protected blocks |
| 3 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 3; PASS row 3 text assertions; PASS admission contracts and protected blocks |
| 4 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 4; PASS shared budget and last-attempt escalation; PASS exhaustion guards and protected blocks |
| 5 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 5; PASS model, origin and failure routing; PASS protected blocks byte-identical; PASS row 5 text assertions |
| 6 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 6; PASS shared-budget re-audit on pi and inline paths; PASS protected blocks byte-identical; PASS row 6 text assertions |
| 7 | done | 1 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 7; PASS exhaustive budget report before ledger teardown; PASS protected blocks byte-identical; PASS row 7 text assertions |
| 8 | done | 2 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 8; PASS protected blocks and README/configuration/CHANGELOG commitments; PASS amended source and telemetry allowlist with transient ledger excluded at finish; PASS active ledger retained and shared machinery unchanged |
| 9 | done | 2 | python3 /tmp/chase-bug-seed.yi7eP9/assert-row.py 9; PASS scoped instruction-size, binding and hotfix bundle references after RED ledger.md failure; Parent-verified npm test exit 0 PASS at b71aef9df95518b6161365a571b36188b6a98b9f, not rerun by worker; Inspected parent log /var/folders/ww/xlm_qdzd2vn1k7gb4gs8kh8w0000gn/T/tmp.8w9tZ46B6N/npm-test-fixed.log ends PASS: repo valid |

## Decisions

row 0 done | seeded 9 rows, closed 0 on baseline | 1
row 1 done | Added the single-AC handoff template, R2/R3 invariants, fenced verbatim report, and dependency evidence command. | Keep the handoff template and implement seed-then-row dispatch next.
row 2 done | Replaced step 4 with fresh companion seed-then-row dispatches and added the parent-owned ledger, mapping, Rules, and seed hints. | Keep dispatch and binding text; add exact commit admission checks next.
row 3 done | Added ordered seed and row commit admission, bounded evidence checks, empty-diff rules, and validation-miss accounting. | Keep admission and protected blocks unchanged; implement the shared attempt budget next.
row 4 done | Unified steps 4-7 under one attempt budget with reopening, last-attempt escalation, exhaustion guards, bounded hints, and fresh gates. | Keep the shared budget and protected blocks; implement mandatory conformance model and origin handling next.
row 5 done | Made conformance mandatory with resolved model injection, inline prompt-only origin, and one redispatch before abort. | Keep model and origin handling; check the shared-budget re-audit path next.
row 6 done | Confirmed the pi re-audit path and gave inline hotfix repairs the same budget, gate rerun, and fresh audit. | Keep both re-audit paths and protected blocks; add the budget-exhausted ledger report next.
row 7 done | Added verbatim attempts and all ledger decisions to budget-exhausted reports before teardown on both harness paths. | Keep the report and protected blocks unchanged; address the shipped-file scope next.
row 8 failed | Updated README, configuration and changelog; AC8 excludes the telemetry record that standard finish must ship. | Resolve the telemetry allowlist contradiction before retrying; the active ledger is transient and must not be stripped now.
row 8 done | Updated the scratch scope assertion for amended AC8 and confirmed docs, protected blocks, and the telemetry allowlist pass. | Keep the active ledger until standard finish strips it; preserve the telemetry allowance and shared machinery.
row 9 failed | Fixed all three ledger filename references and passed scoped checks; worker instructions prohibit npm test. | Parent must rerun npm test on the fixed skill; keep the filename fix and protected blocks unchanged.
row 9 done | Passed row 9 assertions and inspected the parent's passing npm test log for the unchanged source revision. | Preserve source and protected blocks; do not repeat verification for this ledger-only closure.
