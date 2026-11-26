# eval report: spec-council-applier (partial run: pr-description-finding)

for: 9f17000509d054c5ea27f8e5ac3c4424a799a26b913fcbe465946ea40d45c1d9

wall: 49s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-description-finding | anthropic/claude-opus-5-5 | improved | 9672 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |
| pr-description-finding | github-copilot/gpt-6.1-sol | improved | 9858 | f1: fails -> holds (intended change); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-description-finding / anthropic/claude-opus-5-5: Only f1 moved. Before paraphrased the ops/cutover.md instruction (lowercased, no period) and appended "carried in the pull-request description", which makes PR text a deliverable. After adds the source sentence exactly as its own Integration list item with no PR, merge or comment requirement, so keep the wording that puts the instruction under Integration in its source's words with nothing appended. f2 and f4 were expected to move but already held in Before: it had exactly the two verbatim in-scope acceptance rows, the comment row under Integration with the tracker update marker, the line-number entry and its environment state marker removed, and the five original entries untouched. After keeps all of that, and f3 holds in both, since each audit has one Applied line per cluster with original severity and raised-by and no question. One thing to consider: After's cutover entry has no kind marker while Before's had "person step". No fact here grades that, but if you want consistency with the other entries, say whether a non-ticket Integration entry should name its nearest kind, without reintroducing a delivery-channel parenthetical.
- pr-description-finding / github-copilot/gpt-6.1-sol: Only f1 moved: Before put the ops/cutover.md sentence under Integration as an exact list item but annotated it "to carry in the pull-request description; person step", which makes PR text a requirement of the spec, while After carries the bare verbatim item with no PR-description, merge or comment deliverable. f2 and f4 were expected to move from fails to holds, but they already hold in Before: both outputs leave exactly the missing-id and line-number rows as verbatim in-scope checkboxes, move the comment row verbatim to Integration with the tracker update marker, drop the line-number entry and its environment state marker, and leave the five original Integration entries untouched. f3 holds in both, with three Applied lines carrying the original severity and raised-by and no scope or placement question. To keep all of this, keep the wording that says the operator instruction goes under Integration as one list item in its source's words with no added delivery channel, and keep the instruction to correct the two flagged placements verbatim without asking and to leave the other entries unedited. One side effect to watch, outside the facts: After added a "No introduced or amended feature docs." line to Documentation impact; if that is not wanted, say that sections other than Acceptance criteria and Integration are left as they are unless a cluster names them.

exit: 0
