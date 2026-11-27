# eval report: gatekeep-pr (partial run: contract-row-judged)

for: 38009ce972dcb872b591ea57db2019f7e2175028d6b871de3fe5c4a1952c67f0

wall: 65s

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Show the two wordings and explain the choice in three sentences. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` covers the same judgment in assessment. Unselected samples retain historical results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| contract-row-judged | anthropic/claude-opus-5-5 | improved | 16648 | ticket: fails -> holds (intended change); necessary: fails -> holds (intended change); viable: holds -> holds (held); unknown: holds -> holds (held); fallback: fails -> holds (intended change); veto: holds -> holds (held); message: fails -> fails (intended but unchanged) |
| contract-row-judged | github-copilot/gpt-6.1-sol | improved | 20807 | ticket: fails -> holds (intended change); necessary: fails -> holds (intended change); viable: holds -> holds (held); unknown: fails -> holds (unplanned improvement); fallback: fails -> holds (intended change); veto: holds -> holds (held); message: fails -> holds (intended change) |

## Feedback

- contract-row-judged / anthropic/claude-opus-5-5: The After wording moved ticket, necessary and fallback as intended: A now follows the successful reread of BILL-12 over the stale email copy, B accepts the change because the hosted index cannot work offline, and E falls back to the step-2 copy when the reread fails. C, D and F keep their preserve picks with the right reasons. The message fact still fails in After, for two reasons. First, E puts four sentences above "Pick one:" because the provenance note ("This rests on the copy read at the start of the run, because the fresh read failed.") is a separate sentence. Second, D renders the message twice: the first menu has no [recommended] tag on any row, then a "Correction to the row above" prose line and a full re-render follow, so D is not one clean message. To fix this, say that the three-sentence limit is hard and that a failed-reread or stale-copy caveat must be folded into the second sentence (for example "...which is what ticket 33, as read at the start of the run, asks for"), never added as a fourth. Also say that the message is rendered exactly once, with [recommended] on row 1 checked before output, and that no correction or re-render is emitted. Keep the pre-message narration that carries the ticket command and the judgment, since it sits outside the message and supports the ticket, fallback and unknown facts without breaking the message shape.
- contract-row-judged / github-copilot/gpt-6.1-sol: After moves ticket, necessary and fallback because row 1 now follows the reread ticket (A), the impossibility of the goal under the current wording (B) and the retained step-2 copy when the reread fails (E); Before recommended preserve in all three "until you explicitly authorize" the amendment. Message moves because After quotes both wordings verbatim, keeps exactly three sentences above Pick one, and strips the arguing clauses from the row descriptions (Before had "the offline-search goal remains blocked" and "retain the obstacle to offline opening", and paraphrased the wordings). Viable and veto hold in both outputs, so nothing Before kept was lost. Unknown also moved, though it was not on the expected list: Before's recommendation sentence in D only said "until you explicitly settle the conflicting color requirements", while After's says the intended outcome independent of the color could not be determined. That sentence is still thin, because the failed ticket read appears only in the narration; have the last sentence state both gaps (for example "because neither a ticket nor a separate goal shows why green is needed"). Two other spots are fragile: C's second sentence does not name BILL-31, and E's calls the retained copy "ticket #33" without saying it is the step-2 copy until the third sentence. Requiring the second sentence to name the ticket and which copy was used whenever one was read would harden message without costing the three-sentence form.

exit: 0
