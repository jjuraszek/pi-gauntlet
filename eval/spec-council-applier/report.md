# eval report: spec-council-applier (partial run: pr-description-finding)

for: d2afe149f267148f9f176ac8daa637cad11c73693baaa9247065e028dea4d2ba

wall: 29s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, apply a request to carry an operator instruction in the PR description by writing the instruction itself in the targeted spec section. Retain the repository admin and before-merge timing; write no PR-body, CI-run or merge obligation on the implementation. Keep the audit grammar and dispositions unchanged. This sample requires a model to interpret a chair's wording and compose the resulting spec; literal pins alone cannot prove that classification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | unchanged | 6333 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 12618 | f1: holds -> holds (intended but unchanged); f2: fails -> holds (intended change); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: No fact moved between Before and After on this sample: both outputs already place the instruction itself in Errors and edge cases as an operator step ('Before merging, a repository admin creates the DEPLOY_TOKEN secret'), keep the repository admin actor and before-merge timing, write no PR-body, CI-run or merge obligation, and produce an identical audit with pr-description-cutover under Applied: with [major] and raised-by: [alpha-core] plus Deferred: none and Rejected: none. The expected fails -> holds movement on f1, f2 and f4 therefore did not show, because Before did not fail them here; the Before wording already led the model to read the chair's 'pull-request description must carry' as an operator step rather than a deliverable. The only visible difference in After is the added parenthetical 'performed by a person, delivered by no file', which reinforces f2 and f4 by making the non-deliverable status explicit, and costs nothing on the other facts. To keep everything held, retain the wording that has the instruction written verbatim with its actor and timing in the targeted section, and leave the audit grammar untouched; if you want to demonstrate the change's effect, you need a sample or repeated runs where the Before wording actually produces a PR-description obligation, since this pair does not prove the classification improvement.
- pr-description-finding / github-copilot/gpt-6.1-sol: Only f2 moved; f1 and f4 did not move as expected because they already hold in Before. Before's spec already has the instruction itself in Errors and edge cases, labelled as an operator step with the repository admin and before-merging timing intact. Its one defect is the parenthetical "(for the pull-request description)", which still marks the step as destined for the PR body; I read that as a residual PR-body deliverable, so f2 fails there, though it is a close call because the parenthetical is not a full "must" sentence. After drops the parenthetical and writes plain "Operator step: Before merging, a repository admin creates the DEPLOY_TOKEN secret.", which clears f2 and keeps f1 and f4. The After audit keeps the Applied:/Deferred:/Rejected: grammar with [major] and raised-by: [alpha-core] and no longer mentions the PR description, so f3 holds in both. To keep this result, the wording should say explicitly that a chair request to carry an instruction in the PR description is satisfied by writing the instruction verbatim as an operator step in the targeted section, with no mention of the PR description, CI or merge as a destination or deliverable, not even parenthetically. It should also say to keep the source's actor and timing unchanged and leave the audit line format untouched.

exit: 0
