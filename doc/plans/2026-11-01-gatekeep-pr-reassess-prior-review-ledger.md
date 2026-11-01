# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gatekeep-pr-reassess-prior-review.md`
base: b5a2fb0fb8533150bca997f066ebeb997976bc0a
verification: npm test
iterations: 3
cap: 29

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-delta --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: both replay models improved and all 14 candidate facts hold; ancestor-dispatch contract PASS: wave boundary and merge commands preserved; 7 touched skill files below 500 lines and 50000 bytes |
| 2 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-delta --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: all 22 candidate facts hold across both replay models; stable R-to-P mapping, missing-closure diagnostic and represented inline reply suppression pass; touched skill files below 500 lines and 50000 bytes |
| 3 | open | 0 | step4-outside-delta file assertion; FAIL: findings.md maps every Moderate to blocker without outside-delta exception; fix-wave.md already limits its own carried set but step 4 does not |
| 4 | open | 0 | nonancestor-fallback file assertion; FAIL: assessment.md has no --is-ancestor check; report.md has no reason-bearing nonancestor fallback line |
| 5 | done | 0 | no-prior-review baseline file assertion; PASS: verification-brief.md retains full gh pr diff and unreadable viewer handling; assessment.md retains ordinary step-4 reviewer and report.md has no Prior review line; git diff against base confirms skills/gatekeep-pr unchanged |
| 6 | open | 0 | own-comment-baseline file assertion; FAIL: verification-brief.md has no COMMENTED prior-review selection; findings.md has no prior_review.state closure-severity rule |
| 7 | open | 0 | same-head-empty-delta file assertion; FAIL: assessment.md has no no-code-diff dispatch; report.md has no no-commits-since addressed-count suffix |

## Decisions
row 0 done | seeded 7 rows, closed 1 on baseline | take row 1: select the viewer's prior review and dispatch the ancestor delta
row 1 done | Added viewer-review selection, ancestor delta tasks on both harnesses, and addressed counts; all 14 targeted eval facts pass. | Take row 2 to map R-item closure and suppress duplicate replies; do not redo selection or delta wiring.
row 2 done | Mapped R-item closures to stable findings and made represented inline comments non-replyable; all 22 targeted eval facts pass. | Take row 3 for outside-delta severity; preserve the closure mapping and re-triage state.
