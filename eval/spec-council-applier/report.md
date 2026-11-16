# eval report: spec-council-applier (partial run: pr-description-finding)

for: d94d62313ea8cc8560dbb6a21cb15af52d877db09dc6acdb3f786bb275ad3be1

wall: 32s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, apply a request to carry an operator instruction in the PR description by writing the instruction itself in the targeted spec section. Retain the repository admin and before-merge timing; write no PR-body, CI-run or merge obligation on the implementation. Keep the audit grammar and dispositions unchanged. This sample requires a model to interpret a chair's wording and compose the resulting spec; literal pins alone cannot prove that classification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | improved | 8238 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (held); f4: fails -> holds (intended change) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 12013 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (held); f4: fails -> holds (intended change) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: After moved f1, f2 and f4 by writing the instruction directly in Errors and edge cases as "Operator step (cutover, from ops/cutover.md): Before merging, a repository admin creates the DEPLOY_TOKEN secret." Before only quoted the instruction inside a "the pull-request description must carry this instruction verbatim" sentence, which is a PR-body obligation on the implementation and not an operator step. After keeps the repository admin actor and the before-merging timing unchanged, and the resulting spec has no sentence obliging a PR body, CI run or merge. f3 held in both: the audit keeps Applied:/Deferred:/Rejected: with one disposition, and [major] and raised-by: [alpha-core] copied from the chair. To keep this stable, the wording should keep telling the model to translate a chair's "PR description must carry X" into X itself, stated as an operator step in the targeted section, with actor and timing verbatim from the cluster. It should also keep the Applied line copying the chair's cluster id, severity and raised-by exactly while describing what was actually written to the spec, as After does with "added operator step".
- pr-description-finding / github-copilot/gpt-6.1-sol: After moved f1, f2 and f4 by replacing Before's sentence "The pull-request description must carry this cutover instruction..." with the instruction itself, labelled as an operator step: "Before merging, a repository admin creates the DEPLOY_TOKEN secret." That keeps the repository admin and the before-merge timing and drops the "must carry" obligation on the implementation. f3 holds in both: the audit keeps Applied:/Deferred:/Rejected: with one disposition, and [major] and raised-by: [alpha-core] copied from the chair. The one fragile spot is the residual parenthetical "(for the pull-request description)" in the spec, echoed as "for the pull-request description" in the audit's Applied line. It is a label rather than an obligation, so f2 holds, but a stricter reader could take it as an implied PR-body deliverable. To make f2 robust, the wording should tell the model to drop the delivery vehicle entirely and write only something like "Operator step: Before merging, a repository admin creates the DEPLOY_TOKEN secret.", and to describe the application in the audit without naming the PR description as the destination. After also added "No feature docs are introduced or amended." to Documentation impact; this touches no fact here, but if it is not intended, the wording should confine the edit to the targeted section.

exit: 0
