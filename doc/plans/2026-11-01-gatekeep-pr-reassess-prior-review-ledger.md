# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gatekeep-pr-reassess-prior-review.md`
base: b5a2fb0fb8533150bca997f066ebeb997976bc0a
verification: npm test
iterations: 1
cap: 29

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | ancestor-dispatch file assertion; FAIL: verification-brief.md has no prior_review selection; assessment.md has no ancestor dispatch; report.md has no Prior review line |
| 2 | open | 0 | prior-item-closure file assertion; FAIL: findings.md has no R-item closure mapping or missing-closure rule; represented by R inline-comment state absent |
| 3 | open | 0 | step4-outside-delta file assertion; FAIL: findings.md maps every Moderate to blocker without outside-delta exception; fix-wave.md already limits its own carried set but step 4 does not |
| 4 | open | 0 | nonancestor-fallback file assertion; FAIL: assessment.md has no --is-ancestor check; report.md has no reason-bearing nonancestor fallback line |
| 5 | done | 0 | no-prior-review baseline file assertion; PASS: verification-brief.md retains full gh pr diff and unreadable viewer handling; assessment.md retains ordinary step-4 reviewer and report.md has no Prior review line; git diff against base confirms skills/gatekeep-pr unchanged |
| 6 | open | 0 | own-comment-baseline file assertion; FAIL: verification-brief.md has no COMMENTED prior-review selection; findings.md has no prior_review.state closure-severity rule |
| 7 | open | 0 | same-head-empty-delta file assertion; FAIL: assessment.md has no no-code-diff dispatch; report.md has no no-commits-since addressed-count suffix |

## Decisions
row 0 done | seeded 7 rows, closed 1 on baseline | take row 1: select the viewer's prior review and dispatch the ancestor delta
