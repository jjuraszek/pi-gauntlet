# eval report: conformance-reviewer (partial run: ci-step-is-the-change)

for: 072adbf4d8fbc9c97539bf42bebc8788375e70de47abecfc15c6bacf794e1cda

wall: 20s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ci-step-is-the-change | anthropic/claude-opus-5-5 | unchanged | 4720 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |
| ci-step-is-the-change | github-copilot/gpt-6.1-sol | unchanged | 5664 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- ci-step-is-the-change / anthropic/claude-opus-5-5: No fact moved on this regression sample, which matches the intent: After still reports the undeleted browser-install step as a MISSING requirement with the spec's Design sentence as its origin, still reports the unchanged bin/label.mjs as a MISSING requirement whose origin quotes "regenerated bundles committed" from the leg verification line with evidence that it is stale against src/label.mjs, and still recommends fix for both without waiving or rescoping either. The only differences are cosmetic (the G2 origin now includes the "verification:" prefix, and the gap blocks cite file lines as evidence instead of "absent"). To keep this stable while delivering the Change, keep the wording explicit that a CI workflow edit named by the spec as the change itself is an implementation requirement rather than a delivery-stage clause, and that a file-deliverable clause on a leg verification line stays in coverage with the spec clause as origin even when the test-run clause beside it is excluded and the prompt repeats the ask.
- ci-step-is-the-change / github-copilot/gpt-6.1-sol: No fact moved on this regression sample, which matches the intent: both outputs report the undeleted browser-install step as a MISSING requirement with the spec Design sentence as origin and a fix recommendation, and both keep the stale bin/label.mjs as a non-DELIVERED gap whose origin quotes "regenerated bundles committed" from the leg verification line, also with recommended: fix. The only differences in After are cosmetic: G2 shifted from PARTIAL to MISSING and its evidence now cites only bin/label.mjs:2 plus the diff rather than also citing src/label.mjs:2, though the remediation still says to regenerate from the updated source. To keep these facts stable while delivering the Change, keep the wording explicit that a file deliverable clause on a leg verification line remains a spec-origin requirement even when the command clause on the same line is excluded, and that a CI workflow edit named in Design is an implementation requirement rather than a delivery-stage clause; consider also asking that the stale-bundle evidence name both the generated file and its modified source so the 'not regenerated from source' link stays visible.

exit: 0
