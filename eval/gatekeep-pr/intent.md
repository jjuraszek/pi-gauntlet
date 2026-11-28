for: fefe8b3b051e1a03e6761ca3139f664a4b1d5f3d546d6da39d30e57a059fe447

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Never back dropping the intended outcome itself. Show the exact endpoint paths in the two wordings and explain the choice only in the three sentences, without a standing report, tracker IDs or endpoint paths in the explanation. Case G of `action-row-one` checks that the explanation says the existing address can already serve the build version; a deterministic check alone cannot establish that the recommendation explains the consequence. When a linked ticket could not be read and nothing else decides, name the failed read in the third menu sentence or the report item's one reason. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules, including that accepting changes the requirement rather than the PR description; `spec-stale-nit` checks whether the first report distinguishes a stale spec from a blocker. The simulated handoffs show what each worker receives: the blocker gets no spec edit and its sibling gets the selected wording. A pushed spec with an extra change cannot replace the stored rows and Design text used to judge and dispatch the next repair. No worker actually runs. Unselected samples retain historical results.

## Expected to move

- contract-row-judged/ticket: fails -> holds - Follow the reread over the stale copy even when email delivery still works.
- contract-row-judged/necessary: fails -> holds - Recommend changing a requirement that makes the intended outcome impossible.
- contract-row-judged/unknown: fails -> holds - Name the unreadable linked ticket in the displayed Case D recommendation, not just in the fetch narration.
- contract-row-judged/fallback: fails -> holds - Keep the decisive step-2 copy when the reread fails.
- contract-row-judged/message: fails -> holds - Explain the pick in three plain sentences without tracker IDs or a second argument elsewhere.
- action-row-one/contract: fails -> holds - Show only the pending decision in Case G, with the exact endpoints in the wording pair and a separate, path-free explanation of why the existing address can already serve the build version.
- spec-stale-nit/backed: fails -> holds - Offer merge and show the stale wording beside the ticket-backed change.
- spec-stale-nit/handoff: fails -> holds - Require the displayed edit and adopt the new wording only after confirming it at the pushed head.
- spec-stale-nit/addition: fails -> holds - Draft a missing Design clause for an addition the outcome needs.
- spec-stale-nit/dispatch: fails -> holds - Give each worker only its own selected edits and review the full selection.
- spec-stale-nit/retained: fails -> holds - Keep the prior baseline and the selected point open after a mixed scope change.
- spec-stale-nit/worker: fails -> holds - Give the next repair the prior rows and Design, not the live spec as its contract.
- consent-contract-change-stop/f2: fails -> holds - Show the PR's own promise beside the proposal when there is no spec to quote.
