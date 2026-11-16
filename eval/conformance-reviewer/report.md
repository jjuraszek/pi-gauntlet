# eval report: conformance-reviewer (partial run: ci-step-is-the-change)

for: 4e80239a3805cbe8b793e11ac1f5a4f5d7ef49014f35ffbb77a26e6bbfdeba6e

wall: 0s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no prompt-origin requirement, drift entry or skip note for it. The ci-step-is-the-change regression sample keeps the unchanged audit behavior for an undeleted browser-install step and a missing regenerated bundle on a leg verification line. Its four facts must hold on both arms; no movement is intended for them. Keep the spec's file clause as the origin when the prompt repeats it, so a leg verification line's missing file deliverable stays visible as spec coverage. Coverage is limited to these five samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ci-step-is-the-change | anthropic/claude-opus-5-5 | unchanged | 5752 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |
| ci-step-is-the-change | github-copilot/gpt-6.1-sol | unchanged | 12063 | f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- ci-step-is-the-change / anthropic/claude-opus-5-5: No fact moved on this regression sample: After still reports the undeleted browser-install step as a MISSING implementation requirement with the spec's Design sentence quoted as origin, still reports the stale bundle as MISSING with an origin quoting "regenerated bundles committed" from the leg verification line, and both gaps keep recommended: fix with no waiver or rescoping. The After wording did shift two details that are close to the edge of these facts: the gap blocks now say `evidence: absent` instead of citing `.github/workflows/ci.yml:8` and `bin/label.mjs:2`, so the identification of the unchanged bundle as not regenerated from the modified source survives only in the coverage line's `searched:` text, and the origin quote now carries a `[...]` elision marker in front of the file clause. To keep f4 robust while still excluding delivery-stage clauses, word the rule so that a MISSING file deliverable's gap block cites the stale file and line as evidence (not `absent`) and so that the file clause split off a verification line is quoted verbatim on its own, stating explicitly that a file deliverable on a verification line and a workflow-file edit that is itself the requested change are implementation requirements, never excluded stage proof.
- ci-step-is-the-change / github-copilot/gpt-6.1-sol: No fact moved on this regression sample, which is the intended outcome. Both outputs report the leftover browser-install step (.github/workflows/ci.yml:8-9) as a MISSING requirement and gap with the spec's Design sentence as origin, and both gaps carry recommended: fix with nothing waived or rescoped. Both also report the unregenerated bin/label.mjs as MISSING against the leg verification line's "regenerated bundles committed". f4 is the closest call in Before: its coverage line quotes the spec clause alongside the prompt, but its G2 gap block gives only the prompt as origin, so I counted it as holding on the coverage line. After removes that ambiguity by using the spec leg clause as the origin in both the coverage line and the gap block, so the wording that keeps the spec's file clause as origin when the prompt repeats it is doing its job and should stay. After also drops Before's R2 (the `node --test` command as a delivered requirement), which matches the stage-clause exclusion and costs none of these facts. To keep this stable, keep explicit wording that the exclusion applies only to the stage half of a verification line, that a file deliverable on that line stays a requirement, and that editing a CI workflow file is implementation behaviour, not stage proof, when the spec asks for it.

exit: 0
