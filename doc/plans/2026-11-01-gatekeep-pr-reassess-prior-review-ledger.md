# Ledger - loop engine
**Spec:** `doc/specs/2026-11-01-gatekeep-pr-reassess-prior-review.md`
base: b5a2fb0fb8533150bca997f066ebeb997976bc0a
verification: npm test
iterations: 9
cap: 29

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-delta --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: both replay models improved and all 14 candidate facts hold; ancestor-dispatch contract PASS: wave boundary and merge commands preserved; 7 touched skill files below 500 lines and 50000 bytes |
| 2 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-delta --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: all 22 candidate facts hold across both replay models; stable R-to-P mapping, missing-closure diagnostic and represented inline reply suppression pass; touched skill files below 500 lines and 50000 bytes |
| 3 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-delta --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: all 30 candidate facts hold across both replay models; outside-delta Moderate and Minor evidence-only, Critical blocks, in-delta severity and whole-head doc drift preserved; findings.md 100 lines and 15561 bytes, shared wave unchanged |
| 4 | done | 1 | node eval/run.mjs gatekeep-pr prior-review-force-push --refresh-judgments --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: all 22 candidate facts hold across both replay models; force-push, missing-object and null-commit fallback reports preserve whole-diff review; report.md 112 lines and 9003 bytes |
| 5 | done | 0 | no-prior-review baseline file assertion; PASS: verification-brief.md retains full gh pr diff and unreadable viewer handling; assessment.md retains ordinary step-4 reviewer and report.md has no Prior review line; git diff against base confirms skills/gatekeep-pr unchanged |
| 6 | done | 1 | node eval/run.mjs gatekeep-pr SAMPLE --base b5a2fb0fb8533150bca997f066ebeb997976bc0a (prior-review-delta, course-assess-terminal, blockers-bare-fix); PASS: all 58 candidate facts hold across both replay models; own COMMENTED baseline preserves bounded closure and open blockers; pinned assess POST, response mismatch and no-prior scoped-delivery regressions pass |
| 7 | done | 1 | EVAL_CONCURRENCY=4 node eval/run.mjs gatekeep-pr prior-review-same-head --base b5a2fb0fb8533150bca997f066ebeb997976bc0a; PASS: all 12 candidate facts hold across both replay models; empty-delta dispatch and explicit closure preserve 1-of-2 and 2-of-2 same-head suffixes; report.md 112 lines and 9129 bytes, diff whitespace and skill hygiene pass |

## Decisions
row 0 done | seeded 7 rows, closed 1 on baseline | take row 1: select the viewer's prior review and dispatch the ancestor delta
row 1 done | Added viewer-review selection, ancestor delta tasks on both harnesses, and addressed counts; all 14 targeted eval facts pass. | Take row 2 to map R-item closure and suppress duplicate replies; do not redo selection or delta wiring.
row 2 done | Mapped R-item closures to stable findings and made represented inline comments non-replyable; all 22 targeted eval facts pass. | Take row 3 for outside-delta severity; preserve the closure mapping and re-triage state.
row 3 done | Made new outside-delta Moderate and Minor findings evidence-only while Critical blocks; all 30 targeted eval facts pass. | Take row 4 for nonancestor fallback; preserve closure mapping, whole-head contracts and the shared wave boundary.
row 4 done | Added reason-bearing whole-diff fallback reports for force-push, missing-object and null baselines; all 22 targeted eval facts pass. | Take row 6 for own-comment baselines; preserve scheduled ancestry checks, closure mapping and the shared wave boundary.
row 6 done | Verified own COMMENTED baselines and pinned assess posts with response provenance; all 58 targeted eval facts pass. | Take row 7 for same-head closure; preserve pinned posting, zero-blocker no-post behavior and the shared wave boundary.
row 7 retry | Discarded interrupted uncommitted attempt with human approval; run only same-head eval with parallel cells, add no broad sweep. | allowed attempts 1
row 7 done | Added same-head addressed-count suffixes and verified empty-delta closure; all 12 targeted eval facts pass. | Preserve explicit closure and zero-item wording; do not rerun other model samples or add a broad sweep.
