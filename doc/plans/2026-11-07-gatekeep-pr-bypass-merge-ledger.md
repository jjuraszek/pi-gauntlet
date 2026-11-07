# Ledger - loop engine
**Spec:** `doc/specs/2026-11-07-gatekeep-pr-bypass-merge.md`
base: b9dd8f39286fdf8d13eb84a612885b2b835e617c
verification: npm test
checks: commands
iterations: 9
allowance: 10
pending: verify | home | bf038aa2d9efa100e96cfd5a556b370e32eb417e

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 3 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 68 passed, 0 failed including exact menu and Evidence strings plus saved replay checks; ran bypass-eligible-green-ci (1 of 2); both replay cells improved, child reaped and controller exited, no live GitHub probes or merges |
| 2 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 69 passed, 0 failed including pending bypass replay and independent merge withholds; bound spent: bypass-eligible-check-pending (1 of 2), ran bypass-eligible-check-pending (1 of 2); both candidate replay cells hold every fact, child reaped and controller exited, no live GitHub probes or merges |
| 3 | done | 1 | timeout -k 30 120 node --test scripts/gatekeep-comment-reconcile.test.mjs; 70 passed, 0 failed including false and unreadable fail-closed pins; bound spent: bound-viewer-green-ci (1 of 2), ran bound-viewer-green-ci (1 of 2); both replay cells hold every fact, child reaped and controller exited, no live GitHub probes or merges |
| 4 | done | 1 | timeout -k 30 60 node --test scripts/gatekeep-bypass-pick.test.mjs; 4 passed, 0 failed including bypass-only flag, refusal routing, revocation and saved replay facts; ran bypass-merge-pick-refused (1 of 2), ran bypass-merge-pick-revoked (1 of 2), ran bypass-merge-pick-refused (2 of 2); both selected samples hold every fact in both cells, all children reaped and controllers exited, no live GitHub probes or merges |
| 5 | done | 0 | timeout -k 30 60 node --test scripts/gatekeep-comment-reconcile.test.mjs; 68 passed, 0 failed; no-attribution pins and saved bypass-eligible-green-ci f5 hold in both replay cells; offline recheck only, no new action spend |
| 6 | done | 1 | timeout -k 30 20 python3 -c 'assert (lambda r, c: all(s in r for s in ("ruleset bypass actor", "ordinary `merge` row", "CI evidence still binding", "all other merge preconditions unchanged", "live non-admin bypass behavior remains unverified")) and "every other merge precondition still withhold" not in r and c.startswith("# Changelog\n\n## Unreleased\n") and "ruleset bypass" in c.split("\n## ")[1])(*(__import__("pathlib").Path(p).read_text() for p in ("README.md", "CHANGELOG.md"))), "README bypass contract or Unreleased entry missing"'; exit 0: README contract and Unreleased entry pass; non-admin live behavior explicitly unverified; no paid or external actions ran and no background jobs launched |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 6
row 1 failed | Confirmed the missing bypass menu clause but could not settle its eligibility source without non-admin observations; no paid or external actions ran. | Supply anonymized non-admin GraphQL observations for always and pull_request modes from an authorized GitHub venue before source edits; do not infer eligibility from synthetic fixtures.
row 1 failed | Unlisted replay ran and exact AC strings fail; child jobs reaped; bound spent: bypass-eligible-blocked (1 of 2); ran bypass-eligible-blocked (1 of 2). | Use bypass_eligible, the exact consequence/Evidence text, and authorized bypass-eligible-green-ci; preserve spend records and never rerun bypass-eligible-blocked.
row 1 done | Fixed bypass contract; bound spent: bypass-eligible-blocked (1 of 2); ran bypass-eligible-blocked (1 of 2); ran bypass-eligible-green-ci (1 of 2). | Reuse bypass-eligible-green-ci fixtures and saved results through scripts/gatekeep-comment-reconcile.test.mjs for offline checks.
row 5 done | Confirmed no named-rule attribution or admin identity using existing pins and saved replay outputs without further edits. | nothing new to build on
row 2 done | Proved pending CI still withholds; bound spent: bypass-eligible-check-pending (1 of 2); ran bypass-eligible-check-pending (1 of 2). | Reuse bypass-eligible-check-pending fixtures and saved results via scripts/gatekeep-comment-reconcile.test.mjs for offline gates.
row 3 done | Proved false/unreadable bypass stays closed; bound spent: bound-viewer-green-ci (1 of 2); ran bound-viewer-green-ci (1 of 2). | Reuse scripts/gatekeep-comment-reconcile.test.mjs offline; retained job/no-launch provenance: $TMPDIR/loop-b9dd8f39286fdf8d13eb84a612885b2b835e617c-5.jobs.
row 4 done | Proved post-pick safety; ran bypass-merge-pick-refused (1 of 2); ran bypass-merge-pick-revoked (1 of 2); ran bypass-merge-pick-refused (2 of 2). | Reuse scripts/gatekeep-bypass-pick.test.mjs offline; old replay SHA pins need parent repair; jobs $TMPDIR/loop-b9dd8f39286fdf8d13eb84a612885b2b835e617c-6.jobs are reaped.
row 6 done | Updated README and Unreleased bypass docs; offline assertions pass; no paid or external actions ran and no background jobs launched. | Reuse row 6's recorded Python assertion to check README.md and CHANGELOG.md offline.
