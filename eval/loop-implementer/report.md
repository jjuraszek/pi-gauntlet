# eval report: loop-implementer (partial run: reading-picked)

for: 948ef034af9551acd5bf41564f6f41114950c3f2e39d32c297391b61975fccd9

wall: 47s

## Change

Select reading-picked to check the choice between two permitted labels and what reaches the row commit. Design's recommendation takes precedence over the size of the change; with no preference, choose the smaller edit. This is a replay of the choice, not a live commit.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| reading-picked | anthropic/claude-opus-5-5 | improved | 5445 | reading: holds -> holds (intended but unchanged); choice: fails -> holds (intended change) |
| reading-picked | github-copilot/gpt-6.1-sol | improved | 10001 | reading: holds -> holds (intended but unchanged); choice: fails -> holds (intended change) |

## Feedback

- reading-picked / anthropic/claude-opus-5-5: The 'reading' fact already held in Before: both snapshots picked the kind-specific label when Design recommended it and the generic constant otherwise, without asking or failing the row, so the expected fails -> holds movement did not occur there; After keeps it, now with the precedence rule stated explicitly ('A reading that Design states wins over the smaller change'). The 'choice' fact moved as intended: Before's commit bodies were plain prose with no `- choice | what | why` line, while After's bodies each contain exactly one such line naming the selected label and its reason, with no row or task numbers. To keep this stable, keep the wording that requires a single `- choice | what | why` line in the row commit body whenever a reading was picked among permitted ones, and that states Design's recommendation outranks edit size with the smaller edit as fallback. Two side effects to watch: After's commit body dropped the prose outcome description entirely and the trace became vaguer (commit described as 'planned', no decision-line/returned/status steps shown), so if you want the outcome paragraph and the full closing steps preserved, say that the choice line is added to the body rather than replacing it, and that the replay should still show the commit sequence as in a live run.
- reading-picked / github-copilot/gpt-6.1-sol: In both Before and After the output picks the kind-specific label in snapshot A because Design recommends it and the generic constant in snapshot B, without asking the user or failing the row, so the reading fact held already and did not move. What moved is the choice fact: Before wrote the commit bodies as free prose with the selection and rationale embedded in sentences, while After emits exactly one '- choice | what | why' line per commit body, naming the selected label and its reason (Design's recommendation in A, smaller in-spec change in B) with no row or task numbers. To keep both facts, retain the wording that tells the worker to record the selected reading as a single '- choice | what | why' line in the row commit body and to let Design's recommendation outrank change size, falling back to the smaller edit when Design is silent; consider also stating that the line should name the concrete label (e.g. 'Unnamed plant' or 'Unnamed') and that row or task numbers stay out of the body, since After satisfies those only implicitly and a future rewording could let them slip.

exit: 0
