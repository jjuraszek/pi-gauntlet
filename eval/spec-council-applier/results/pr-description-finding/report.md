# eval report: spec-council-applier (partial run: pr-description-finding)

for: 6f18ebc26d74cbe1e37c1dde7863bad80ceb7c7f1c827a7d701decc3c9b36ec5

wall: 38s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | improved | 9860 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 10164 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: Only f1 moved, and it moved as intended. After puts the ops/cutover.md sentence under Integration as an exact, unadorned list item. Before lowercased it, appended a parenthetical and said it was "carried in the pull-request description", which made PR text a spec requirement. f2 and f4 were expected to go from fails to holds, but they already hold in Before: its Acceptance criteria has exactly the missing-id and line-number rows, both in-scope, the comment row sits verbatim under Integration with the tracker update marker, the erroneous line-number entry is gone, and the five original entries are untouched. So the new wording gets no credit for those two; if they are meant to discriminate, the Before sample or the facts need revisiting. f3 holds in both: three Applied dispositions with original severity and raised-by, and no question asked. To keep all of this, keep the wording that says to copy the operator instruction in its source's words as a plain Integration list item with no delivery-channel note (PR description, merge, comment), and keep the instruction to move the two flagged rows verbatim while leaving the other entries unedited and ungraded. One thing to decide: After's instruction entry has no kind marker, unlike the other Integration entries. No fact tests this, but if you want a marker such as "person step" there, say so explicitly without reintroducing any PR-description language.
- pr-description-finding / github-copilot/gpt-6.1-sol: Only f1 moved. Both outputs put the exact ops/cutover.md sentence under Integration as a list item, but Before added the sub-line "to carry in the pull-request description; person step", which makes PR text a required output; After leaves the item bare, so f1 holds. f2 and f4 were expected to move but already hold in Before: its Acceptance criteria has only the missing-id and line-number rows verbatim and in-scope, the comment row sits under Integration with the tracker update marker, the erroneous line-number entry is gone, and the five original entries are untouched. Those two expectations therefore show no movement on this sample, and After keeps them. f3 holds in both: three Applied lines with original severity and raised-by, and no question asked. To keep this result, keep the wording that places the operator instruction under Integration in its source's words with no destination annotation (no PR description, merge or comment), and keep the instruction to move the two flagged rows verbatim while leaving the other entries as they are. After also adds "No introduced or amended feature docs." under Documentation impact; this touches no fact here, but if it is unintended, limit the wording to the placements the chair flagged.

exit: 0
