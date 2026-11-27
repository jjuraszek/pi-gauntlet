for: 38009ce972dcb872b591ea57db2019f7e2175028d6b871de3fe5c4a1952c67f0

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Show the two wordings and explain the choice in three sentences. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` covers the same judgment in assessment. Unselected samples retain historical results.

## Expected to move

- contract-row-judged/ticket: fails -> holds - Follow the reread over the stale copy even when email delivery still works.
- contract-row-judged/necessary: fails -> holds - Recommend changing a requirement that makes the intended outcome impossible.
- contract-row-judged/fallback: fails -> holds - Keep the decisive step-2 copy when the reread fails.
- contract-row-judged/message: fails -> holds - Explain the pick in three sentences without a second argument elsewhere.
