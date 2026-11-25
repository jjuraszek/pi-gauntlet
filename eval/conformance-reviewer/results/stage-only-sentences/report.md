# eval report: conformance-reviewer (partial run: stage-only-sentences)

for: 4274619d09ee78ed26770bee585aed1179dff054a70822197747fe1b93d7483c

wall: 17s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| stage-only-sentences | anthropic/claude-opus-5-5 | unchanged | 8584 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| stage-only-sentences | github-copilot/gpt-6.1-sol | unchanged | 4065 | f1: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- stage-only-sentences / anthropic/claude-opus-5-5: Neither fact moved: both outputs report CONFORMS with only the two trimming requirements, quote none of the PR, CI, review, merge, suite or workflow sentences, give them no row, gap or drift line, and cite src/label.mjs as evidence for the delivered behavior. The one borderline spot in After is the confidence sentence "No checks were runnable, but none are needed to confirm the behavior." I read it as a remark about the auditor's own verification rather than a summary or explanation of skipped spec sentences, so f3 holds, but it sits close to the excluded `npm test` and CI clauses and a stricter reader could take it as an implicit skip note. To keep f3 safe, tell the skill that confidence text should cite only the file evidence (diff size, visible lines) and should not mention checks, suites, CI or anything not run when those belong only to excluded delivery-stage sentences. R2's aside that the prompt repeats the clause and the spec clause is quoted as origin is harmless here, but it is process narration that could be trimmed from the requirement line.
- stage-only-sentences / github-copilot/gpt-6.1-sol: Both outputs are effectively identical on these facts: each reports a single DELIVERED row for the trimming behavior with file evidence at src/label.mjs:2, quotes only the Design behavior sentence, and contains no coverage row, gap block, verdict text, drift line, confidence note or skip summary for any PR-title, PR-state, review, merge, CI, scan-time, full-suite or workflow sentence. Nothing in the After wording moved either fact; the only difference is the phrasing of the evidence text ("returns `value.trim()`" versus a parenthesized code quote). To keep this, continue to exclude standalone delivery-stage sentences silently (no skip note, no drift entry, no confidence caveat) while retaining the behavior requirement with its file:line evidence.

exit: 0
