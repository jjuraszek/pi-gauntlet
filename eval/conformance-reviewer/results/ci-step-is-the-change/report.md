# eval report: conformance-reviewer (partial run: ci-step-is-the-change)

for: 4274619d09ee78ed26770bee585aed1179dff054a70822197747fe1b93d7483c

wall: 22s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no requirement, drift entry or skip note for that sentence, while a dropped prompt-only lowercase behavior and a missing Tests-file clause remain gaps with prompt and spec origins respectively; only the Tests line's suite-run clause is excluded from coverage, origin, remediation and touched files. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. The post-merge-action sample leaves out the after-merge admin secret-creation step and commit-message text without a row, drift or skip note, while delivered trimming still yields CONFORMS. Coverage is limited to these six samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ci-step-is-the-change | anthropic/claude-opus-5-5 | unchanged | 5275 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |
| ci-step-is-the-change | github-copilot/gpt-6.1-sol | unchanged | 5330 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- ci-step-is-the-change / anthropic/claude-opus-5-5: No fact moved on this regression sample: After, like Before, reports GAPS with a MISSING row and gap for the browser-install step still at .github/workflows/ci.yml:8-9 (origin quoting the spec's Design sentence, treated as an implementation requirement rather than an excluded stage proof), a MISSING row and gap whose origin quotes "regenerated bundles committed" from the leg verification line with evidence that bin/label.mjs:2 is stale against src/label.mjs:2, and recommended: fix on both. The only differences are cosmetic (After cites file:line as gap evidence instead of "absent", and words the G2 title slightly differently). To keep this stable while delivering the Change, keep the wording that separates a spec instruction to edit a workflow file (a file deliverable) from delivery-stage evidence such as CI runs or PR gates, and keep the explicit rule that a file clause on a leg verification line stays in coverage with the spec as its origin even when the prompt repeats it; avoid any phrasing that excludes by keyword such as 'CI' or 'verification' rather than by whether the clause describes a change to tracked files.
- ci-step-is-the-change / github-copilot/gpt-6.1-sol: No fact moved on this regression sample, which is the intended outcome: After still reports the undeleted browser-install step as a MISSING requirement and gap with the spec's Design sentence as origin, still reports the stale bin/label.mjs as a non-DELIVERED requirement and gap with the origin quoting "regenerated bundles committed" from the leg verification line, and both gaps keep recommended: fix with no waiver or rescoping. The only differences are cosmetic: G2 went from PARTIAL to MISSING and its evidence now cites bin/label.mjs:2 plus the complete diff rather than both src and bin lines; it still makes clear the bundle was not regenerated from the modified source. To keep these facts stable, retain the wording that distinguishes a workflow-file edit that is itself the requested change from a delivery-stage proof, and the wording that keeps a file-deliverable clause on a leg verification line in coverage with the spec clause as origin even when the prompt repeats it; consider keeping an explicit reference to the modified src/label.mjs in the bundle gap's evidence or remediation so the 'not regenerated from the changed source' link stays explicit.

exit: 0
