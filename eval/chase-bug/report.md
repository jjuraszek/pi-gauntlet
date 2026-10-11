# eval report: chase-bug

for: 3e166d28f1e9cd0634670ce8f524fb4b80cd04b6563c400c90dd16f82b15ff89

## Change

Chase-bug cites the ticket link shape-ticket returned in both the addressable draft and the unaddressable summary, rather than assuming a newly created ticket. The completed handoff can return an existing ticket. Both baseline replay outputs already cite the supplied existing reference without claiming creation, so this sample expects those facts to remain held rather than forcing a movement.

## Cells

| sample | model | verdict | facts |
|---|---|---|---|
| returned-ticket-link | anthropic/claude-opus-5-5 | unchanged | returned-reference: holds -> holds (held); no-new-creation: holds -> holds (held) |
| returned-ticket-link | github-copilot/gpt-6.1-sol | unchanged | returned-reference: holds -> holds (held); no-new-creation: holds -> holds (held) |

## Feedback

- returned-ticket-link / anthropic/claude-opus-5-5: Both outputs cite the returned reference https://github.com/example/widgets/issues/42 as the next step and both explicitly state that no new ticket was created and the tracker was not changed, so neither fact moved. After is slightly terser (it drops the preamble explaining why there is no draft and no gate 2, and compresses the verdict explanation), but that does not affect either fact. The After wording already delivers the Change; if anything, keeping Before's brief note that shape-ticket found an existing ticket instead of creating one makes the no-creation point even more explicit, though After's phrasing 'it created no new ticket and made no tracker change' is sufficient.
- returned-ticket-link / github-copilot/gpt-6.1-sol: Before and After are textually identical: both cite the returned reference https://github.com/example/widgets/issues/42 under Next step and both state explicitly that no new ticket was created and no tracker mutation occurred, so neither fact moved. The After wording delivers the Change correctly for this existing-ticket case; nothing needs adjusting here, though if you want extra safety against future drift, keep the summary wording tied to the literal shape-ticket result text (e.g. 'Existing ticket ... covers this concern') rather than any template that defaults to 'Filed ticket'.

exit: 0
