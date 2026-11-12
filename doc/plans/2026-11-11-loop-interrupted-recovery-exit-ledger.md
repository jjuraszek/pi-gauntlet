# Ledger - loop engine
**Spec:** `doc/specs/2026-11-11-loop-interrupted-recovery-exit.md`
base: 9dc95a5b124c06eb70dac4a7b4ec4c758970fa85
verification: npm test
checks: commands
iterations: 4
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 60 node --test scripts/loop-engine-contract.test.mjs; 45 passed; 0 failed; interrupted return shapes repair before allowance checks |
| 2 | done | 0 | timeout -k 30 10 node -e 'require("node:assert/strict").doesNotMatch(require("node:fs").readFileSync("skills/loop-implementation/reference/interrupted-recovery.md", "utf8"), /Establish exclusive checkout provenance/, "AC 2: interrupted recovery must not demand checkout ownership proof")'; exit 0; recovery demands no checkout provenance |
| 3 | done | 0 | timeout -k 30 10 node -e '["skip that job and continue recovery", "still alive after KILL and missing launch history do not block recovery", "Continue even when files remain after reset", "the next return is validated as usual"].forEach(text => require("node:assert/strict").ok(require("node:fs").readFileSync("skills/loop-implementation/reference/interrupted-recovery.md", "utf8").includes(text), text))'; exit 0; mismatched jobs skipped and residual jobs or files do not block |
| 4 | done | 0 | timeout -k 30 10 node -e '[["skills/loop-implementation/reference/interrupted-recovery.md", "For seed leave every row cell and decision unchanged, commit `loop: repair seed` with `seed interrupted: <reason>` in the body, refresh and apply the seed count"], ["skills/loop-implementation/SKILL.md", "Count seed attempts as `loop: repair seed` commits since ledger base, including interrupted and validation-miss repairs"]].forEach(([file, text]) => require("node:assert/strict").ok(require("node:fs").readFileSync(file, "utf8").includes(text), text))'; exit 0; seed repair preserves rows and spends one seed count |
| 5 | done | 1 | timeout -k 30 30 node --test scripts/loop-verification-repair.test.mjs; 3 passed; 0 failed; interrupted verification preserves rows and the reserved repair |
| 6 | done | 1 | timeout -k 30 30 node --test scripts/loop-companion-recovery.test.mjs; 3 passed; 0 failed; companion-only cleanup preserves home repair and clean-result admission |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Replaced interrupted-row recovery with unconditional cleanup, one failed attempt and same-turn continuation; 45 contract tests pass. | Reuse interrupted-recovery.md and interrupted-child-redispatch A-D/H for later recovery rows; model replay awaits companion/resume migration.
row 2 done | Rechecked the seeded ownership assertion after removing the proof gate; an absent jobs file now permits recovery. | nothing new to build on
row 3 done | Checked that mismatched jobs are skipped and lingering jobs or files do not stop recovery. | nothing new to build on
row 4 done | Checked that interrupted seeds use the same recovery, preserve every row and count one repair against the seed allowance. | nothing new to build on
row 5 done | Migrated verification repair cleanup and fixtures; 3 contract tests pass, model replay awaits companion/resume migration. | Reuse interrupted-recovery.md's failure pass and verify-repair-count snapshots 2-5 for coordinated and resume recovery.
row 6 done | Migrated companion recovery and fixtures; 3 contract tests pass, model replay awaits reconstruction migration. | Reuse coordinated-legs.md and companion-interrupted-recovery A-F for resume; scripts/loop-companion-recovery.test.mjs checks cleanup and admission separately.
