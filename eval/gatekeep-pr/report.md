# eval report: gatekeep-pr (partial run: action-row-one)

for: 4f221c154ce607533679a79d188b55f323b8d7c88f72a701b24e9bacfc7c8691

wall: 69s

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Never back dropping the intended outcome itself. Show the two wordings and explain the choice only in the three sentences, without a standing report or tracker IDs. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` checks whether the first report distinguishes a stale spec from a blocker. The simulated reports cover ticket-backed departures, necessary additions and independent defects; the handoff case executes no worker. Unselected samples retain historical results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| action-row-one | anthropic/claude-opus-5-5 | improved | 18627 | pending: holds -> holds (held); blocked: holds -> holds (held); cap: holds -> holds (held); authority: fails -> holds (unplanned improvement); own: holds -> holds (held); body-only: holds -> holds (held); author-only: holds -> holds (held); contract: fails -> holds (intended change) |
| action-row-one | github-copilot/gpt-6.1-sol | improved | 20378 | pending: holds -> holds (held); blocked: holds -> holds (held); cap: holds -> holds (held); authority: holds -> holds (held); own: holds -> holds (held); body-only: holds -> holds (held); author-only: holds -> holds (held); contract: fails -> holds (intended change) |

## Feedback

- action-row-one / anthropic/claude-opus-5-5: Case G is what moved: After shows the current and proposed wordings and then exactly three plain sentences directly above Pick one (the current /health requirement, what moving to /status would mean, and why /health can still deliver the goal), with no standing or assessment prose. Before gave only two separated sentences and never showed the two wordings, so it failed both contract and the G clause of authority. No fact that Before kept was lost, but three After wordings sit close to the line and are worth tightening. In Case B the report paragraph dropped the explicit statements that a reviewer other than you must approve and that write access gives no admin override; the missing review now appears only in the recommendation reason, so restore the no-override sentence to keep blocked safe. In A to C, After swapped 'base-branch updates' for 'sync attempts' and introduced 'end the repair course'; these lean towards internal vocabulary, and Before's plainer phrasing ('base-branch updates', 'stop delivery') is safer for authority. In Case A, 'limits stay as they are' implies no cap extension, but neither wording states outright that no round is charged; saying so would make pending unambiguous. Keep the G layout as it is, with the two wording lines and the recommendation folded into the third sentence.
- action-row-one / github-copilot/gpt-6.1-sol: Only the contract fact moved, and it moved because Case G in After shows the current and proposed wordings as two labelled lines and puts all of the explanation into one three-sentence block directly above Pick one: the /health requirement, why moving to /status is unnecessary for serving the version, and why the goal is deliverable unchanged. Before named the endpoints only inside a summary sentence, split its reasoning across two paragraphs, and never said what the move would mean for serving the version. Two things in After are thin, though they did not flip a fact. First, the second G sentence says the change is "unnecessary" rather than stating what moving the endpoint would do, so wording that asks for the consequence of the move (the version would be served at /status instead of /health) would make that sentence safer. Second, Case B no longer says the viewer cannot bypass the review rule, and its deliver row now reads "continue delivery with ten additional repair attempts and ten additional sync attempts", which is closer to a sync promise than Before's "retry the merge prerequisites … cannot supply that review"; keeping the no-bypass clause and the retry-only phrasing would protect the blocked fact. Cases A and C–F kept their gate lines, single recommended row, reason directly above Pick one and plain prose, so the contract-menu wording did not disturb the other menus.

exit: 0
