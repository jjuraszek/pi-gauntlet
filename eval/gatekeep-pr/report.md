# eval report: gatekeep-pr (partial run: action-row-one)

for: 38009ce972dcb872b591ea57db2019f7e2175028d6b871de3fe5c4a1952c67f0

wall: 89s

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Show the two wordings and explain the choice in three sentences. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` covers the same judgment in assessment. Unselected samples retain historical results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| action-row-one | anthropic/claude-opus-5-5 | improved | 24801 | pending: holds -> holds (held); blocked: holds -> holds (held); cap: holds -> holds (held); authority: fails -> holds (unplanned improvement); own: holds -> holds (held); body-only: holds -> holds (held); author-only: holds -> holds (held); contract: fails -> holds (unplanned improvement) |
| action-row-one | github-copilot/gpt-6.1-sol | improved | 17188 | pending: holds -> holds (held); blocked: holds -> holds (held); cap: holds -> holds (held); authority: fails -> holds (unplanned improvement); own: holds -> holds (held); body-only: holds -> holds (held); author-only: holds -> holds (held); contract: fails -> holds (unplanned improvement) |

## Feedback

- action-row-one / anthropic/claude-opus-5-5: The After wording moved two facts, contract and authority, both through Case G. Before argued the contract choice in a four-sentence problem paragraph and then put a single 'I recommend preserve contract because...' line above Pick one, so the three contract sentences were missing. After shows the Current and Proposed wordings and then puts exactly three sentences directly above Pick one: the current /health requirement, what moving to /status would mean for serving the version, and why the existing health handler still delivers the goal. Keep that shape, with the three sentences as the only argument and nothing between them and Pick one. No fact that Before kept was lost, but Case B is fragile in both outputs, and I passed it on a lenient reading. Before named the missing admin override but not the required review, while After names the required review and the absent approval but drops the lack of bypass. Say both in Case B, for example 'GitHub requires an independent review, no other reviewer has approved, and you have no admin or bypass right to override it', and keep the deliver row as a retry only after that changes. In Case A, 'without adding repair or sync attempts' covers the no-extension point only by implication for 'no round charged'; saying the extra window uses no repair attempt would make it explicit. The Current/Proposed lines in G and the arrow preview in E read as plain prose here, but do not let them grow into labelled fields.
- action-row-one / github-copilot/gpt-6.1-sol: The After wording moved `contract` and `authority` from fails to holds because Case G now shows the current and proposed wordings and puts three plain sentences directly above Pick one: the current /health requirement, what moving to /status would mean, and why /health can still deliver the goal. Before had only a single 'I recommend preserve contract because...' sentence there, with the rest of the argument in the paragraph above. No fact that Before kept was lost, but three drifts in After are worth tightening. In Case A the deliver row dropped 'exactly' from 'one additional window'; restore it, and consider saying that no repair round is charged. In Cases B and C the deliver row now says 'ten more repair attempts and ten more sync attempts', which edges toward the repair/sync counters the report is meant to keep out; the earlier 'extend the repair and sync allowances' is safer. In Case F a new standalone paragraph ('Delivery is unavailable... Posting the finding gives the author the concrete problem to fix') sits above the reason and reads like a second argument; fold it back into the findings paragraph so only one reason sentence precedes Pick one. In Case G, the second paragraph already says the /health handler can return the version without changing the spec, which duplicates the third contract sentence; drop it there so the three sentences are the only explanation of the pick.

exit: 0
