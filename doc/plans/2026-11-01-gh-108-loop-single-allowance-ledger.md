# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md`
base: 4cb3a8891e40a8c0749de9905ca62571bd42c3da
verification: npm test
iterations: 3
cap: 49

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | fresh ledger seeds / coordinated ledger budget header / loop approval allowance suffix; 20 targeted tests pass; five affected eval samples improved; both eval structures pass and build:bins leaves bundles unchanged |
| 2 | done | 1 | effective-allowance / ledger-label checks; tracker and telemetry 6 pass, contract 2 pass, brief lint pass; effective-allowance eval improved and ledger-tracker-verify eval unchanged, both models pass; build:bins pass with unchanged bundles |
| 3 | open | 0 | last-attempt-escalation file assertion - skills/loop-implementation/SKILL.md Before each dispatch; FAIL: escalation requires amend permission and starts after allowance exhaustion |
| 4 | open | 0 | spent-escalation file assertion - skills/loop-implementation/SKILL.md; PASS: retry and resume retain spent identity and ordinary model rule; FAIL: rows +N handling is absent |
| 5 | open | 0 | option4-verification-repair file assertion - skills/loop-implementation/SKILL.md After the loop; FAIL: exit repair requires amend permission and iterations below cap |
| 6 | open | 0 | retired-budget file assertion - skills/loop-implementation/SKILL.md; FAIL: funded rounds, spent-funding arithmetic, cap grants and total-cap stop remain |
| 7 | open | 0 | row-budget-actions file assertion - skills/loop-implementation/SKILL.md Human stop; FAIL: menu offers cap +N and retry based on attempts + 1, not rows +N |
| 8 | open | 0 | human-stop-counts file assertion - skills/loop-implementation/SKILL.md Human stop; FAIL: stops omit the attempts of effective allowance row list |
| 9 | open | 0 | resume-migration file assertion - skills/gauntlet-resume/reference/reconstruction.md Spec with ledger; FAIL: restores cap and funding with no allowance migration commit |
| 10 | done | 0 | stagnation-boundaries file assertion - skills/loop-implementation/SKILL.md and reference/coordinated-legs.md; PASS: two ledger-only child commits without status change stop independently of funding; PASS: two consecutive validation misses stop and conforming returns reset misses; PASS: child-only counting and retry windows retained |
| 11 | open | 0 | configuration-allowance file assertion - doc/configuration.md Escalation loop; FAIL: loop escalation is documented as amend-gated within a durable cap |
| 12 | open | 0 | eval-allowance-contract file assertion - eval/loop-implementation/samples/scaled-cap-grant/expected.md; FAIL: expected facts require a total-cap stop and cap +N; model eval not run |

## Decisions
row 0 done | seeded 12 rows, closed 1 on baseline | row 1: replace fresh cap headers with allowance without migrating this active ledger
row 1 done | Fresh ledgers seed unscaled allowance and accept run-only gate overrides; coordinated validation and all five affected eval samples pass. | Keep this active ledger's cap; take row 2's effective allowance counting next without redoing seeding.
row 2 done | Effective allowances count retries; ledger labels preserve task names, and scoped tracker, contract and eval checks pass. | Take row 3's last-attempt escalation next; keep the active ledger cap and do not redo allowance counting or label projection.
