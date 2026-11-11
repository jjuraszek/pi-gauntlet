# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-gh-140-plan-check-delete-entries.md`
base: 196d5abb0ac05f8336839944fed72c5ae2e928bb
verification: npm test
checks: commands
iterations: 4
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
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
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
