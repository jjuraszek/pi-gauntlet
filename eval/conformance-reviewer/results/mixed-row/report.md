# eval report: conformance-reviewer (partial run: mixed-row)

for: 4274619d09ee78ed26770bee585aed1179dff054a70822197747fe1b93d7483c

wall: 32s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| mixed-row | anthropic/claude-opus-5-5 | unchanged | 11589 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| mixed-row | github-copilot/gpt-6.1-sol | unchanged | 10048 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- mixed-row / anthropic/claude-opus-5-5: Neither fact moved: both outputs give each mixed acceptance row exactly one DELIVERED requirement (R3/R4 in Before, R4/R5 in After), quote only the behavior clause truncated with [...], and never mention the PR description, the slow job, or the standalone stage sentences from Design, Errors and edge cases, and Tests. So the expected fails -> holds movement for mixed-row/f1 and f2 does not show on this sample, because Before already held. After differs in two ways worth watching. It adds a Goal-derived R3 ('prevent tracked legacy files from returning'), which is harmless to these facts but duplicates R2 and R5. It also drops the diff citation from the `git ls-files legacy/` row: Before cited the deletion of `legacy/old.mjs:1`, while After's R4 cites only the supplied output and the tracked list. I counted that as holding for f1, but a strict reading of 'with diff evidence' could fail it. To keep f1 safe, tell the auditor to cite a diff or file:line location on every delivered acceptance row, and not to restate Goal sentences as separate requirements when a Design or acceptance row already covers them. Keep the current handling of the stage clauses as is: truncate the origin quote and add no skip note or drift entry.
- mixed-row / github-copilot/gpt-6.1-sol: Neither fact moved on this sample: both outputs report CONFORMS and both hold f1 and f2, so the expected fails -> holds movement for mixed-row does not appear because Before already held. In both, each acceptance row maps to exactly one DELIVERED requirement (R3, R4) with diff evidence, its origin quote is cut to the behavior clause with [...], and no row, gap, drift line or skip note mentions the PR description, slow job, ci, title, approval, merge, scan time, npm test or release workflow. The only visible difference is that After adds a verbatim "Supplied local check output" block between coverage and drift; it is harmless here because it carries no stage text, but it is an extra report section the Change does not ask for. If it is unintended, add wording that keeps the report to the verdict, coverage, drift and parallel-safe sections and cites check output only inside evidence fields. Both outputs also carry Design-origin R1/R2 that restate the acceptance behaviors in R3/R4; if you want exactly one requirement per behavior, say that a Design sentence restated by an acceptance row should be folded into that row's requirement rather than listed separately.

exit: 0
