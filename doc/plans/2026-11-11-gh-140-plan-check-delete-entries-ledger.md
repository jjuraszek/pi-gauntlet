# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-gh-140-plan-check-delete-entries.md`
base: 196d5abb0ac05f8336839944fed72c5ae2e928bb
verification: npm test
checks: commands
iterations: 7
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 206 passed, 0 failed; Delete passes before and after removal |
| 2 | done | 0 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 207 passed, 0 failed; Manifest preserves Delete kind, suffix and later entries |
| 3 | done | 0 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 207 passed, 0 failed; Missing Modify after Delete reports its exact paths-exist finding |
| 4 | done | 0 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 207 passed, 0 failed; Missing Modify alone retains its paths-exist finding |
| 5 | done | 1 | timeout -k 30 120 node --test --test-reporter=tap extensions/lib/plan-check.test.ts; 208 passed, 0 failed; 64 cases cover all conflict kinds and Delete positions with absent paths and line suffixes |
| 6 | done | 1 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 209 passed, 0 failed; Unknown and empty-path Files entries fail without hiding later Modify findings |
| 7 | done | 0 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 210 passed, 0 failed; Tests none and kind-like bullets outside Files yield no files-block findings |
| 8 | done | 0 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 211 passed, 0 failed; Delete rejects four glob forms with and without line suffixes |
| 9 | done | 1 | timeout -k 30 30 node -e 'require("node:assert/strict").deepEqual(Object.values(require("./eval/writing-plans/results/maintenance-after-delete/candidate.json").judge).map(cell => Object.values(cell.facts).map(fact => fact.after)), Array(2).fill(Array(6).fill("holds")))'; 12 candidate facts hold across both maintenance modes; bound spent: maintenance-after-delete (1 of 4); ran maintenance-after-delete (1 of 4) |
| 10 | done | 1 | timeout -k 30 120 node --test --test-reporter=dot extensions/lib/plan-check.test.ts; 212 passed, 8 candidate facts hold, 2 authored plans pass checkPlan, bound spent: removal-lists-delete (1 of 4), ran removal-lists-delete (1 of 4); bound spent: removal-lists-delete (2 of 4), ran removal-lists-delete (2 of 4); bound spent: removal-lists-delete (3 of 4), ran removal-lists-delete (3 of 4) |
| 11 | done | 1 | timeout -k 30 120 node --test scripts/wave-review.test.mjs; 15 passed, 0 failed, 8 candidate facts hold; bound spent: removal-lists-delete (4 of 4); ran removal-lists-delete (4 of 4) |
| 12 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 3: reuse the parameterized missing-Modify test to keep scanning after Delete
row 1 done | Parsed Delete entries without requiring their paths to exist, with passing before/after removal checks. | Reuse the Delete fixture in extensions/lib/plan-check.test.ts for parser regressions.
row 2 done | Added the Delete manifest label and verified ordered later entries and the retained line suffix. | Reuse renderManifest in extensions/lib/plan-check.ts to emit Delete ownership.
row 3 done | Confirmed the seeded missing-Modify-after-Delete regression now passes. | nothing new to build on
row 4 done | Confirmed missing Modify paths still fail with the existing paths-exist finding. | nothing new to build on
row 5 done | Verified Delete ownership conflicts in 64 cases across all kinds, Files positions, existence states and line suffixes. | Reuse the parameterized Delete conflict test in extensions/lib/plan-check.test.ts for ownership regressions.
row 6 done | Unified the Files scan and rejected unknown kinds and empty paths while checking later entries. | Reuse checkFilesBlock and the single Files boundary in extensions/lib/plan-check.ts for Files validation.
row 7 done | Verified that none tests and kind-like bullets outside Files produce no unknown-kind findings. | Reuse the outside-Files cases in extensions/lib/plan-check.test.ts to protect scan boundaries.
row 8 done | Rejected Delete globs with entry-specific findings after stripping line suffixes. | Reuse the Delete glob cases in extensions/lib/plan-check.test.ts for literal-path validation.
row 9 done | Verified both maintenance modes; bound spent: maintenance-after-delete (1 of 4); ran maintenance-after-delete (1 of 4). | Reuse eval/writing-plans/samples/maintenance-after-delete and its result records to check Delete ownership without restoring source.
row 10 done | Required Delete ownership; ran removal-lists-delete (1 of 4); ran removal-lists-delete (2 of 4); bound spent: removal-lists-delete (3 of 4); ran removal-lists-delete (3 of 4). | Reuse the removal-only test in extensions/lib/plan-check.test.ts to replay both authored plans and their eval facts without model calls.
row 11 done | Added Delete template and contract assertions; bound spent: removal-lists-delete (4 of 4); ran removal-lists-delete (4 of 4). | Reuse scripts/wave-review.test.mjs to check Delete ownership wording in the task template and plan contract.
