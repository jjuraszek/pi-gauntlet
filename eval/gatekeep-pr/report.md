# eval report: gatekeep-pr (partial run: final-row-one)

for: 99a9d6055d02cdfd5b91b7bfefc20850b38d6bc2f440e61189c5fcf507d5e382

wall: 39s

## Change

Recommend merge on the final menu whenever it is available, on either author's PR and through either the ordinary or eligible admin-override path. Recommend approve only when merge is unavailable and approval is available. Keep availability and numeric-pick authority unchanged.

Select only final-row-one for this increment. Its four states cover own-PR merge, another author's merge with approve available, eligible bypass merge with approve available, and approval without merge permission. Retain gate-line-first, pr-body-false-claim and action-row-one results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| final-row-one | anthropic/claude-opus-5-5 | improved | 15780 | own: holds -> holds (held); other: fails -> holds (intended change); bypass: fails -> holds (intended change); approve: holds -> holds (held); authority: fails -> holds (intended change) |
| final-row-one | github-copilot/gpt-6.1-sol | improved | 18653 | own: holds -> holds (held); other: fails -> holds (intended change); bypass: fails -> holds (intended change); approve: holds -> holds (held); authority: fails -> holds (intended change) |

## Feedback

- final-row-one / anthropic/claude-opus-5-5: After moves exactly the three intended facts and regresses none. Cases B and C now put the [recommended] tag on merge at row 1 with recommended=1 in the gate line, Case C's merge consequence names the ruleset bypass while stating that CI evidence stands (no separate bypass action, no claim that CI is bypassed), and every case gains a one-line prose reason immediately above 'Pick one' that ties the recommendation to the case's state (preconditions hold, bypass eligible, WRITE missing). Cases A and D are unchanged in substance, stop stays last, evidence remains hint-only, and no pick or action is simulated. One small tightening to consider: the Case A and B reasons both read 'every merge precondition holds' and are identical; naming the distinguishing state explicitly (e.g. 'you are the author, so approve is not offered' for A, 'merge_state_status CLEAN and reviewDecision APPROVED on robin's PR' for B) would make the 'names the case's state' requirement unambiguous without altering any menu row or the recommendation ordering.
- final-row-one / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: Cases B and C now put merge on row 1 with the only [recommended] tag and recommended=1 in the gate line, Case C's merge row carries the bypass consequence without a separate bypass action or any claim that CI is bypassed, Case D keeps approve on row 1 with merge omitted and now states the WRITE-permission reason in prose, and every report has a recommendation sentence immediately above Pick one with stop last and show evidence hint-only. Nothing that Before kept was lost. Two things to tighten: the reason sentence in Cases A and B is identical ("all merge prerequisites hold"), so it names the readiness state but not what distinguishes the case; wording like "Merge is recommended because the viewer can merge and all merge prerequisites hold (own PR; approve not offered)" for A and "...another author's ready PR, so merge outranks approve" for B would make the state-naming unambiguous. Also, After silently rewrote the Delivers line from the imperative "Make the health endpoint respond..." to "The health endpoint responds..." and moved the "Not offered" line below the menu in A and D; neither affects a fact here, but those are unrequested drifts the Change did not ask for and should be reverted or made deliberate.

exit: 0
