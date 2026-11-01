# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md`
base: 4cb3a8891e40a8c0749de9905ca62571bd42c3da
verification: npm test
iterations: 14
cap: 49

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | fresh ledger seeds / coordinated ledger budget header / loop approval allowance suffix; 20 targeted tests pass; five affected eval samples improved; both eval structures pass and build:bins leaves bundles unchanged |
| 2 | done | 2 | plan-tracker.test.ts + brief-contract-lint.test.mjs; 32 tracker tests pass for descriptions, stable identity, atomic errors and brief round trips; brief-contract fixtures pass; model checks deferred to parent per user |
| 3 | done | 1 | last-attempt escalation contract and model evals; 2 targeted contract tests pass; escalated-row-attempt and last-attempt-model-boundary improve on both models with all 18 fact checks holding; fallback, missing-model, allowance1 and exhaustion checks pass |
| 4 | done | 1 | spent row escalation contract / spent-row-escalation eval; targeted contract test passes; both replay models improve with all 10 fact checks holding; retry, rows +N, resume and rejected-return recovery preserve spent identity |
| 5 | done | 1 | automatic exit verification repair / per-leg gate contract and four targeted eval samples; 2 contract tests pass; both models improve with all 22 fact checks holding; option parity, fallback, missing model, count, commit boundaries and spent recovery pass |
| 6 | done | 1 | retired loop budgets contract / retired-budgets and loop-ledger-amend evals; 10 targeted contract tests pass; both models hold all 18 fact checks across the two samples; shared allowance replaces cap funding while waves decoding and amendment permission remain |
| 7 | done | 1 | row-budget-actions contract/eval; 3 targeted contract tests and gate-contract lint pass; both replay models hold all 12 fact checks; grants preserve counters and invalid replies write nothing |
| 8 | done | 1 | human stop counts contract / human-stop-counts and tracker-boundary evals; 5 targeted contract tests pass; both models hold all 18 fact checks; every stop preserves counts and recovery or verify menu boundaries |
| 9 | done | 1 | node scripts/brief-contract-lint.test.mjs PASS; node eval/run.mjs gauntlet-resume durable-cap, legacy-cap-brief, migration-recovery (separate runs) PASS; 28 candidate fact checks hold across both models; active ledger cap:49 preserved |
| 10 | done | 0 | stagnation-boundaries file assertion - skills/loop-implementation/SKILL.md and reference/coordinated-legs.md; PASS: two ledger-only child commits without status change stop independently of funding; PASS: two consecutive validation misses stop and conforming returns reset misses; PASS: child-only counting and retry windows retained |
| 11 | done | 2 | configuration-allowance and targeted approval/seed checks; PASS: 5 source tests; PASS: loop-gate and loop-funded-reply evals, 22 fact checks across both models; PASS: allowance-entry-carrier eval, 10 fact checks across both models |
| 12 | done | 1 | node --test --test-name-pattern=eval-allowance-contract scripts/loop-engine-contract.test.mjs; PASS: fixture inventory and six target lints; PASS: 88 original fact IDs retained; model checks deferred to parent per user |

## Decisions
row 0 done | seeded 12 rows, closed 1 on baseline | row 1: replace fresh cap headers with allowance without migrating this active ledger
row 1 done | Fresh ledgers seed unscaled allowance and accept run-only gate overrides; coordinated validation and all five affected eval samples pass. | Keep this active ledger's cap; take row 2's effective allowance counting next without redoing seeding.
row 2 done | Effective allowances count retries; ledger labels preserve task names, and scoped tracker, contract and eval checks pass. | Take row 3's last-attempt escalation next; keep the active ledger cap and do not redo allowance counting or label projection.
row 3 done | Last allowed attempts escalate under both options with resolved fallback models; missing-model stops and two targeted eval samples pass. | Take row 4's spent-escalation retry and rows +N behavior next; preserve the active ledger cap and do not redo last-attempt model resolution.
row 4 done | Spent escalation survives grants, resume and rejected returns; default-model continuation and admitted-miss exhaustion pass the targeted contract test and both eval models. | Take row 5's automatic exit-verification repair next; preserve the active ledger cap and do not redo spent-row identity.
row 5 done | Exit verification repairs once under both options without amend or cap gating; two contract tests and four eval samples pass on both models. | Take row 6's retired budget removal next; preserve active cap 49 and repair invariants, and leave full-target evals to final verification.
row 6 done | Removed total-cap and loop-funding rules while preserving waves decoding; ten contract tests and two eval samples pass on both models. | Take row 7's remaining reply grammar and boundary cases; reuse rows +N, preserve active cap 49 and leave full-target evals for the end.
row 7 done | Explicit retry replies and no-write invalid grants pass three contract tests, gate lint and all twelve model fact checks. | Take row 8's stop counts next; preserve active cap 49, reuse the tested reply grammar and leave full-target evals for the end.
row 8 done | Every human stop displays unresolved row counts without widening recovery or verify menus; five contract tests and all eighteen model fact checks pass. | Take row 9's resume migration next; preserve active cap 49 and the stop menus, and leave full-target evals for the end.
row 9 done | Resume recovers before header-only allowance migration; contract fixtures and 28 model fact checks pass. | Take row 11's docs next; preserve active cap 49 and leave remaining cap-based eval fixtures and full-target runs to row 12.
row 11 failed | Updated five binding docs; source checks expose missing gate allowance display, carrier and echoes, plus incorrect funding acceptance. | Align approval and entry instructions with the documented contract; preserve cap 49 and leave full-target evals to row 12.
row 11 done | Gate displays resolved allowances, rejects misplaced funding and carries overrides into entry source echoes; five source tests and 32 model fact checks pass. | Take row 12's remaining fixture migration and full-target evals; preserve active cap 49 and do not redo gate or carrier repairs.
row 12 done | Recovered eval artifacts and migrated allowance fixtures, including descriptive brief labels; deterministic checks pass. | Preserve recovered results and finish row 2 before selected parallel model checks.
row 2 done | Ledger labels now show normalized AC descriptions with stable identities; 32 tracker tests and brief fixtures pass. | Preserve cap 49 and recovered results; parent should run only gauntlet-resume/ledger-tracker-verify for this change.
