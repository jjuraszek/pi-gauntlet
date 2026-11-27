for: 4f221c154ce607533679a79d188b55f323b8d7c88f72a701b24e9bacfc7c8691

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Never back dropping the intended outcome itself. Show the two wordings and explain the choice only in the three sentences, without a standing report or tracker IDs. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` checks whether the first report distinguishes a stale spec from a blocker. The simulated reports cover ticket-backed departures, necessary additions and independent defects; the handoff case executes no worker. Unselected samples retain historical results.

## Expected to move

- contract-row-judged/ticket: fails -> holds - Follow the reread over the stale copy even when email delivery still works.
- contract-row-judged/necessary: fails -> holds - Recommend changing a requirement that makes the intended outcome impossible.
- contract-row-judged/fallback: fails -> holds - Keep the decisive step-2 copy when the reread fails.
- contract-row-judged/message: fails -> holds - Explain the pick in three plain sentences without tracker IDs or a second argument elsewhere.
- action-row-one/contract: fails -> holds - Show only the pending decision in Case G, with no standing prose or argument outside the three sentences.
- spec-stale-nit/backed: fails -> holds - Offer merge and show the stale wording beside the ticket-backed change.
- spec-stale-nit/handoff: fails -> holds - Require the displayed edit and adopt the new wording only after confirming it at the pushed head.
- spec-stale-nit/addition: fails -> holds - Draft a missing Design clause for an addition the outcome needs.
- consent-contract-change-stop/f2: fails -> holds - Show the PR's own promise beside the proposal when there is no spec to quote.
