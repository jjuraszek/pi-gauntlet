# eval report: gatekeep-pr (partial run: action-row-one)

for: 4882b38efa143d6388f8e5febf4fdc1af53e796628f5d4efb64092cd77c34dc4

wall: 51s

## Change

Choose obstacle recommendations from available progress rather than a blanket stop default. Recommend deliver for a pending binding check or flaky failure when continuation can make progress. Pin stop before authorship and pending-check defaults when no available non-stop action can change the outcome, including an unchanged failed prerequisite at the cap.

Select only action-row-one for this increment. Its three obstacle cases cover a pending binding check, BLOCKED without bypass, and an unchanged missing workflow approval at the cap. Retain the prior gate-line-first and pr-body-false-claim results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. The other action-row-one scenarios remain outside this increment's coverage.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| action-row-one | anthropic/claude-opus-5-5 | improved | 17173 | pending: holds -> holds (intended but unchanged); blocked: fails -> holds (unplanned improvement); cap: fails -> holds (unplanned improvement); authority: fails -> holds (intended change) |
| action-row-one | github-copilot/gpt-6.1-sol | improved | 17283 | pending: fails -> holds (intended change); blocked: fails -> holds (unplanned improvement); cap: fails -> holds (unplanned improvement); authority: fails -> holds (intended change) |

## Feedback

- action-row-one / anthropic/claude-opus-5-5: Nothing regressed: After keeps Case A's deliver-on-row-1 with one watch window, no cap extension and no round charged, and it fixes Cases B and C by putting stop at row 1 with recommended=1 and a single prose reason above Pick one, which is what the authority and blocked/cap facts needed (Before had recommended=3 with stop at row 3, so row 1 was deliver). Two small risks to watch in the After wording: the blank line between the reason sentence and Pick one, and the trailing note about no Sync: line being rendered after Case C — both are outside any row and do not simulate a pick or action, so they pass here, but keeping the reason as the line directly above Pick one and dropping report-external commentary would make the gate-line-first and reason-adjacency properties unambiguous. Also keep the explicit 'neither cap extended' and 'retries only after the failed prerequisite changes' phrasing in Cases A and B respectively; those words are what keep pending and blocked holding.
- action-row-one / github-copilot/gpt-6.1-sol: After moves every fact to holds: Before put the [recommended] marker on row 3 (stop) in all three cases with recommended=3, so pending, blocked, cap and authority all failed, while After places the single recommended row at position 1 with recommended=1 on the first line and keeps one prose reason directly above Pick one in each case. Case A now recommends deliver with exactly one additional watch window and no cap extension, Case B and C pin stop and keep deliver only as a retry after the prerequisite changes, and approve workflow run is withheld for lack of permission. Two small wording tightenings would make the facts more unambiguous without changing the behaviour: in Case A's deliver row add 'no round charged' alongside 'without extending either cap' so the reader need not infer it, and in Case B's reason name the specific blocker ('because BLOCKED has no bypass actor and the required independent review is missing') rather than the generic 'no available non-stop action can change the blocked outcome', so the reason itself, not just the PR-comment line, carries the REVIEW_REQUIRED/bypass justification.

exit: 0
