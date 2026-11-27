# eval report: gatekeep-pr (partial run: consent-contract-change-stop)

for: f51296d6976610f197abf2302ecf7e753c805a73983040cb1144f78d5db6d4c5

wall: 53s

## Change

Judge a proposed contract change from the reread ticket, or from whether the PR can deliver its goal under the current wording. Show the two wordings and explain the choice in three sentences. `contract-row-judged` simulates ticket reads and stops at the menu: a text assertion alone cannot tell whether the gate separates the intended outcome from a proposed means. `action-row-one` and `consent-contract-change-stop` cover the surrounding menu and consent rules; `spec-stale-nit` covers the same judgment in assessment. Unselected samples retain historical results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| consent-contract-change-stop | anthropic/claude-opus-5-5 | improved | 11967 | f1: holds -> holds (held); f2: fails -> holds (intended change); f3: holds -> holds (held) |
| consent-contract-change-stop | github-copilot/gpt-6.1-sol | improved | 11477 | f1: holds -> holds (held); f2: fails -> holds (intended change); f3: holds -> holds (held) |

## Feedback

- consent-contract-change-stop / anthropic/claude-opus-5-5: f2 moved because After's menu now prints the PR's own sentence ("Compare signatures in constant time.") as the current wording, directly beside the proposal to remove it. Before only paraphrased the promise inside a prose sentence and never showed the two wordings side by side. After also keeps both contract choices with exactly one recommended, a stop row, and a preserve row that resumes the rebase without dropping the requirement. f1 holds in both: the helper's contract exception routes to the contract decision, with no commit, no push and no automatic contract-changing repair. f3 holds in both, but After sits closer to the edge. Its row 2 and its "Proposed wording" line describe the amendment as removing a sentence from the PR description, which a reader could take as a description edit standing in for the contract decision. To keep f3 safe, word row 2 as amending the PR's contract by dropping the constant-time requirement, with the description updated only as a consequence of that accepted amendment, and keep the narration's statement that the stored scope baseline is unchanged until a pick. The side-by-side wording lines and the three-sentence explanation deliver the Change and should stay as they are.
- consent-contract-change-stop / github-copilot/gpt-6.1-sol: f2 moved because After states the two wordings side by side: it quotes the PR's own line "Compare signatures in constant time" as the current requirement and sets a concrete proposed wording against it, where Before only paraphrased the conflict as dropping "that requirement" and never showed a current wording. After keeps the rest of f2: both contract choices, exactly one marked recommended, then stop, with option 1 resuming only work that preserves the requirement. f1 and f3 hold in both outputs: each pauses delivery at the menu with nothing committed, and neither offers a description rewrite in place of an amendment; After's "invoke the scope-amendment process ... resume delivery only after the amendment completes" is in fact more explicit on f3 than Before's "after the contract change is completed". To make this robust, say the current wording comes from the PR description, so a reader does not take the quoted line for a spec or ticket. Keep the three-sentence shape (current wording, proposed wording, reason for the pick) and the explicit amendment step in option 2. Consider trimming the worktree-removal detail from the stop option: it is cleanup the facts do not ask for and it could be read as a side effect beyond stopping.

exit: 0
