# eval report: conformance-reviewer (partial run: ci-step-is-the-change)

for: 92c653a9b42474087edddfcd073964356d6a2b68cd08b776a042750062b17e56

wall: 0s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, including a literal that defines its functionality, without requiring the external half. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample checks a fetched seven-row ticket against a spec that kept the ticket-comment row as a criterion. Only the importer's missing-id rejection is a requirement; the shared definition excludes the other six rows regardless of placement. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ci-step-is-the-change | anthropic/claude-opus-5-5 | unchanged | 5471 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |
| ci-step-is-the-change | github-copilot/gpt-6.1-sol | unchanged | 4540 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- ci-step-is-the-change / anthropic/claude-opus-5-5: No fact moved on this regression sample: After still reports the undeleted browser-install step as a MISSING requirement and gap with the spec Design sentence quoted as origin, still reports the stale bundle as a MISSING requirement and gap with origin quoting "regenerated bundles committed" from the leg verification line, and both gaps keep recommended: fix with no waiver or rescoping as a delivery-stage obligation. The only notable difference is that After's structured gap blocks say `evidence: absent` where Before cited `.github/workflows/ci.yml:8` and `bin/label.mjs:2`; f4 still holds because the coverage line for G2 identifies bin/label.mjs:2 as still `return value;` and not matching the modified src/label.mjs:2, but that margin is thinner than in Before. To keep these facts robust while delivering the Change, the wording should state that a workflow-file edit named by the spec is an implementation requirement rather than an excluded stage, that a file clause on a leg verification line stays in coverage with its spec origin even when the prompt repeats it, and that the gap block's evidence field should cite the file and line showing the unremoved step or stale bundle rather than `absent` when such a line exists.
- ci-step-is-the-change / github-copilot/gpt-6.1-sol: No fact moved on this regression sample: both Before and After report the undeleted browser-install step as MISSING with the spec Design sentence quoted as origin, report the unchanged bin/label.mjs as MISSING with the leg verification line's "regenerated bundles committed" quoted as origin and evidence that the bundle still returns the untrimmed value, and mark both gaps recommended: fix with no waiver or rescoping. The After wording correctly keeps a workflow-file edit as an implementation requirement rather than an excluded delivery-stage clause, and keeps the file-deliverable half of the verification line in coverage while silently dropping the test-run half. To keep this stable, preserve the explicit distinction that a spec instruction to edit a CI file is a file deliverable (not a stage proof), and that the file clause on a leg verification line stays a requirement with the spec as its origin even when the prompt repeats it; the differences between the outputs (wider line ranges, slightly more specific remediation text) are cosmetic.

exit: 0
