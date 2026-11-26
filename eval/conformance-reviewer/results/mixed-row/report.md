# eval report: conformance-reviewer (partial run: mixed-row)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 0s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, including a literal that defines its functionality, without requiring the external half. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| mixed-row | anthropic/claude-opus-5-5 | unchanged | 15625 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| mixed-row | github-copilot/gpt-6.1-sol | improved | 11821 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- mixed-row / anthropic/claude-opus-5-5: Neither fact moved on this sample: Before already gave each in-scope acceptance row exactly one DELIVERED requirement (R4 for the empty `git ls-files legacy/`, R5 for the test rejecting `legacy/` paths on the full tracked tree), judged on behaviour alone with no mention of the PR-description list or the `slow` job, so the expected fails -> holds movement for f1 and f2 is not visible here. After keeps the same shape, with the `legacy/` prefix literal in R5 and no gap, drift entry or skip note for the external halves. One fragility in After: R4's evidence now cites only the supplied `git ls-files legacy/` output and the tracked-file list, where Before also cited the diff's deletion of `legacy/old.mjs`. I counted that as holding, but a stricter reading of "with diff evidence" in f1 could fail it. To be safe, have the wording require each behaviour-half requirement to cite a diff hunk or file:line (for R4, the `legacy/old.mjs` deletion) alongside any check output. Keep the instruction that a mixed acceptance row yields one requirement quoting only its behaviour clause, including the defining literal, with nothing said about the excluded external clause.
- mixed-row / github-copilot/gpt-6.1-sol: After moved f1 by collapsing coverage to exactly two DELIVERED requirements, one per acceptance row, each quoting only the behavior half of the row and citing diff evidence. Before listed four: the Design sentences (R1, R2) and the acceptance rows (R3, R4) restated the same two behaviors, so each row was covered by two Rn rather than one. f2 did not move on the text. Before already judged both rows on functionality alone: it elided the PR-description and slow-job halves with "[...]", raised no gap or note for them, and kept the literal `legacy/` prefix in R4's quoted origin, so the expected fails -> holds is not visible in this sample. To keep both facts, keep the wording that merges a Design sentence and an acceptance row describing the same behavior into one requirement, and that quotes only the behavior clause of a mixed row, including any literal that defines it (here `legacy/`), with no mention, skip note or drift entry for the external half. After's R2 title also carries the literal prefix, which is sturdier than Before's R4, where it appeared only in the origin quote; an instruction to keep defining literals in the requirement statement itself would lock that in.

exit: 0
