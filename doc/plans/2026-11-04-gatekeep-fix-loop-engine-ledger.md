# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-gatekeep-fix-loop-engine.md`
base: 5cfd9d352303f7c18191c644bbe6195f2d870253
verification: npm test
checks: commands
iterations: 5
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --test scripts/gatekeep-fix-loop-contract.test.mjs; 1 passed, 0 failed; selected loop-worker eval improved on both replay models |
| 2 | done | 1 | node --test scripts/gatekeep-fix-loop-contract.test.mjs; 2 passed, 0 failed; nit-batch-row eval improved on both replay models; initialization coverage only |
| 3 | done | 0 | node eval/run.mjs gatekeep-pr nit-batch-row; both replay models hold n4; artifact paths are external record siblings and never staged; selected initialization coverage only |
| 4 | done | 1 | node --test scripts/gatekeep-fix-loop-contract.test.mjs; 3 passed, 0 failed; reviewer-row-reopen eval holds r1-r7 on both replay models; selected narration coverage only |
| 5 | done | 1 | node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test scripts/gatekeep-fix-loop-contract.test.mjs extensions/phase-tracker.test.ts; 215 passed, 0 failed; row-exhaustion eval holds r1-r9 on both replay models; selected narration and verify guard coverage |
| 6 | done | 0 | node eval/run.mjs gatekeep-pr nit-batch-row; both replay models hold n6; description compare-and-swap and claim recheck stay outside rows; replies remain explicitly selected |
| 7 | done | 0 | node eval/run.mjs gatekeep-pr loop-worker; both replay models improved; shared context and separate pi/native tails held; partial coverage only |
| 8 | done | 0 | git diff --exit-code 5cfd9d352303f7c18191c644bbe6195f2d870253 -- agents/loop-implementer.md skills/chase-bug/hotfix.md; exit 0; both files byte-identical to base |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 2 rows, closed 1 on baseline | row 1: use scripts/gatekeep-fix-loop-contract.test.mjs to replace the file-finding dispatch.
row 1 done | Routed pi file findings and carried retries through companion loop workers with commit admission, retaining native and sync helpers. | Extend fix-wave.md Row dispatch and Admission plus eval/gatekeep-pr/samples/loop-worker for ledger creation and retry policies.
row 7 done | The selected loop-worker eval proves common worktree and scope context with separate pi and Claude Code solution and commit tails. | nothing new to build on
row 2 done | Added finding-derived ACs and ledger initialization with one row per blocker and one complete selected nit batch. | Reuse fix-wave.md Finding artifacts and the nit-batch-row eval fixture for row mapping, scoped commands and initial ledger state.
row 3 done | The selected nit-batch-row check confirms external record-sibling artifact paths and no staging or PR-branch commit. | nothing new to build on
row 6 done | The selected nit-batch-row check keeps description repair and explicit reply picks unchanged and outside finding rows. | nothing new to build on
row 4 done | Aggregated reviewer closures per row, reopening open or missing ids once without charging attempts and skipping fully resolved rows. | Reuse fix-wave.md closure aggregation and reviewer-row-reopen fixtures for contributor, nit-batch and counted-false retry checks.
row 5 done | Bounded finding retries by allowance, validation misses and wave caps, added one-shot escalation, and extended verify guards to loop workers. | Reuse fix-wave.md Budgets, row-exhaustion fixtures and phase-tracker tests for bounded retry and guard checks.
