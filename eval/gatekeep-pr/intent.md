for: a0ac2a67ee89c9d14f536848e29cb0f4dabc961cabd6c562d2deb0dad0bca17d

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Show the two wordings and explain the choice in three sentences. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` checks whether the first report distinguishes a stale spec from a blocker. The simulated reports cover ticket-backed departures, necessary additions and independent defects; the handoff case executes no worker. Unselected samples retain historical results.

## Expected to move

- contract-row-judged/ticket: fails -> holds - Follow the reread over the stale copy even when email delivery still works.
- contract-row-judged/necessary: fails -> holds - Recommend changing a requirement that makes the intended outcome impossible.
- contract-row-judged/fallback: fails -> holds - Keep the decisive step-2 copy when the reread fails.
- contract-row-judged/message: fails -> holds - Explain the pick in three sentences without a second argument elsewhere.
- spec-stale-nit/backed: fails -> holds - Offer merge and show the stale wording beside the ticket-backed change.
- spec-stale-nit/addition: fails -> holds - Draft a missing Design clause for an addition the outcome needs.
- consent-contract-change-stop/f2: fails -> holds - Show the PR's own promise beside the proposal when there is no spec to quote.
