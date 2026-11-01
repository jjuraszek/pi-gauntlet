# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md`
base: 4cb3a8891e40a8c0749de9905ca62571bd42c3da
verification: npm test
iterations: 6
cap: 49

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | fresh ledger seeds / coordinated ledger budget header / loop approval allowance suffix; 20 targeted tests pass; five affected eval samples improved; both eval structures pass and build:bins leaves bundles unchanged |
| 2 | done | 1 | effective-allowance / ledger-label checks; tracker and telemetry 6 pass, contract 2 pass, brief lint pass; effective-allowance eval improved and ledger-tracker-verify eval unchanged, both models pass; build:bins pass with unchanged bundles |
| 3 | done | 1 | last-attempt escalation contract and model evals; 2 targeted contract tests pass; escalated-row-attempt and last-attempt-model-boundary improve on both models with all 18 fact checks holding; fallback, missing-model, allowance1 and exhaustion checks pass |
| 4 | done | 1 | spent row escalation contract / spent-row-escalation eval; targeted contract test passes; both replay models improve with all 10 fact checks holding; retry, rows +N, resume and rejected-return recovery preserve spent identity |
| 5 | done | 1 | automatic exit verification repair / per-leg gate contract and four targeted eval samples; 2 contract tests pass; both models improve with all 22 fact checks holding; option parity, fallback, missing model, count, commit boundaries and spent recovery pass |
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
row 3 done | Last allowed attempts escalate under both options with resolved fallback models; missing-model stops and two targeted eval samples pass. | Take row 4's spent-escalation retry and rows +N behavior next; preserve the active ledger cap and do not redo last-attempt model resolution.
row 4 done | Spent escalation survives grants, resume and rejected returns; default-model continuation and admitted-miss exhaustion pass the targeted contract test and both eval models. | Take row 5's automatic exit-verification repair next; preserve the active ledger cap and do not redo spent-row identity.
row 5 done | Exit verification repairs once under both options without amend or cap gating; two contract tests and four eval samples pass on both models. | Take row 6's retired budget removal next; preserve active cap 49 and repair invariants, and leave full-target evals to final verification.
