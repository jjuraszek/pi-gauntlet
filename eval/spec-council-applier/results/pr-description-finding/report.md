# eval report: spec-council-applier (partial run: pr-description-finding)

for: a1d221625a7b1fbf329c3326389d0d0cf5821860f9d01591bc37a3e7c0f8bd7f

wall: 35s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

For placement-keeps-leg-scope, move the flagged person step verbatim to Integration without a question. Rewrite every leg's scope in the same edit so each still owns its original functionality rows at their new positions.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | improved | 8970 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 9664 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: Only f1 moved. Before paraphrased the ops/cutover.md instruction (lowercased, period dropped, parenthetical appended) and added "carried in the pull-request description", which makes PR text a deliverable; After puts the sentence "Before merging, a repository admin creates the DEPLOY_TOKEN secret." under Integration as its own list item with only a source note beneath it and no PR, merge or comment requirement. f2 and f4 were expected to move from fails to holds, but they already held in Before: both outputs swap the comment row into Integration verbatim with the tracker update marker, move the line-number row into Acceptance criteria as in-scope, drop its erroneous environment-state entry, and leave the five original Integration entries untouched. f3 holds in both, with three Applied dispositions carrying the original severity and raised-by and no question asked. To keep this, retain the wording that tells the skill to copy the source instruction character-for-character as the list item and to put any provenance on a separate marker line, never naming the PR description as a carrier. The After audit's "no scope: lines to rewrite" notes are harmless here, but keep them from turning into a scope or placement question, which would break f3.
- pr-description-finding / github-copilot/gpt-6.1-sol: Only f1 moved. Before put the exact ops/cutover.md sentence under Integration but annotated it "to carry in the pull-request description; person step", which makes PR text something the spec asks for. After leaves the sentence as a bare list item with no PR-description annotation, so f1 now holds. f2 and f4 were expected to move but already held in Before: its Acceptance criteria held exactly the two file-checkable rows as in-scope, the comment row sat verbatim under Integration with its tracker update marker, the line-number entry and its environment state marker were gone, and the five original entries were untouched. After keeps all of that. f3 holds in both: three Applied lines with original severity and raised-by, Deferred and Rejected none, and no scope or placement question. To keep this result, keep the wording that the operator instruction goes under Integration in its source's words with no annotation naming the pull-request description, a merge or a comment as a carrier, and keep the instruction to move the two flagged rows verbatim while leaving the other entries unedited and ungraded. If you want a kind marker on the cutover instruction, limit it to a bare kind such as "person step" with no mention of where the text is published.

exit: 0
