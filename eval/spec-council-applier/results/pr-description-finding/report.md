# eval report: spec-council-applier (partial run: pr-description-finding)

for: 9633b5b696e1cb261f0f0fe6a2ff57380dc53a78f6bafc0245cb478d849043b7

wall: 36s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

For placement-keeps-leg-scope, move the flagged person step verbatim to Integration without a question. Rewrite every leg's scope in the same edit so each still owns its original functionality rows at their new positions.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | improved | 10360 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 11100 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: Only f1 moved. Before paraphrased the ops/cutover.md instruction (lower-cased, period dropped) and appended "carried in the pull-request description", which makes PR text a requirement; After carries the instruction as its own Integration list item in the exact source words with no PR, merge or comment deliverable, so f1 now holds. f2 and f4 were expected to move from fails to holds, but on the text Before already satisfies them: both acceptance rows are verbatim and in-scope with no other ticket row added, the comment row sits verbatim under Integration with its tracker update marker, the line-number entry and its environment state marker are gone, and the five original entries are untouched. f3 holds in both: three Applied dispositions with original severity and raised-by, and no question. To keep this, hold on to the wording that makes the instruction be copied verbatim as a bare Integration item without naming a delivery channel, and that moves the two flagged rows verbatim while leaving the other entries alone. One thing to tighten: After's audit adds an out-of-place note about "no ## Legs ... scope: lines", which looks like leakage from the placement-keeps-leg-scope wording; scope that instruction to specs that actually have legs so it does not add noise to audits here.
- pr-description-finding / github-copilot/gpt-6.1-sol: Only f1 moved. Both outputs put the exact ops/cutover.md sentence under Integration as a list item, but Before annotated it "to carry in the pull-request description; person step", which makes PR text something the spec requires; After leaves the item bare, so no PR text, merge or comment is a deliverable. f2, f3 and f4 hold in both outputs, so the expected fails -> holds movement for f2 and f4 does not show in this sample. Before already had exactly the missing-id and line-number rows verbatim and in-scope under Acceptance criteria. It also already had the comment row verbatim under Integration with its tracker update marker, the erroneous line-number entry removed, and the five original entries untouched. Both audits record three Applied dispositions with the original severity and raised-by and ask no question. To keep this, hold the After wording that places the operator instruction under Integration in its source's words with no destination note about the PR description, and keep the instruction to move the two flagged rows verbatim while leaving the other entries unedited and ungraded. If you want a kind marker on the new instruction entry, word it as a bare kind such as "person step" without naming the pull request, so f1 is not put at risk.

exit: 0
