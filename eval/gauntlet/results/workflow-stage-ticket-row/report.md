# eval report: gauntlet (partial run: workflow-stage-ticket-row)

for: 6c5b9b6650905ee558b7feb3d651614cf90d00fc72a6c655a45600a5d52f9b60

wall: 28s

## Change

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| workflow-stage-ticket-row | anthropic/claude-opus-5-5 | improved | 10327 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |
| workflow-stage-ticket-row | github-copilot/gpt-6.1-sol | improved | 11074 | criteria: fails -> holds (intended change); moved: fails -> holds (intended change); kinds: fails -> holds (intended change); mixed: fails -> holds (intended change); carried: fails -> holds (intended change); no-question: fails -> holds (intended change) |

## Feedback

- workflow-stage-ticket-row / anthropic/claude-opus-5-5: Before wrote no sections at all: it stopped on a lettered question about the GitHub CI row and recommended a ticket repair, so every fact fails there, including no-question. After sorts without asking and delivers all six facts. Acceptance criteria holds exactly the missing-id row, the whole `on staging, the importer names the offending row in its error` row and the make-ci complexity row, each verbatim with `in-scope`. Integration opens with the carried drain-the-queue entry and its nested `Read the queue length again after the final batch.` line, with no marker. The seven externally fulfilled rows follow in ticket order as separate plain items without checkboxes, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the right kind. The mixed row contributes only a bare `on staging` entry with no marker. Before held none of these facts, so there is nothing to preserve from it. To keep After stable, keep the wording that says the sort applies the class definition without a question when the reporter supplied no cuts and the checkout contradicts no row, that a pipeline-result row is moved rather than raised for repair, that a mixed row stays whole under criteria while only its external clause is copied unmarked, and that an existing Integration entry is carried first with its nested lines. The trailing `How the rows were sorted` explanation is not required by any fact and runs past the requested stopping point; consider wording that ends the output at the authored sections.
- workflow-stage-ticket-row / github-copilot/gpt-6.1-sol: Before stopped at a scope-decision question about the vendor-confirmation row and recommended a ticket repair, so it wrote neither section and every fact fails there. After sorts the rows without asking, and that moves all six facts to holds. It keeps only the missing-id row, the whole mixed staging/error row and the make-ci row under Acceptance criteria, each verbatim with `in-scope`. Integration opens with the existing drain-the-queue entry and its nested `Read the queue length again after the final batch.` line, unmarked. The seven externally fulfilled rows follow as separate plain items in ticket order, checkbox removed, each with its own indented `ticket row, not an acceptance criterion: <kind>` line and the correct kind. The mixed row contributes only a bare `on staging` entry with no marker. Before held no fact, so nothing was lost. To keep the After result stable, the wording should keep saying explicitly that workflow-stage rows are sorted rather than questioned or repaired. It should also keep saying that a mixed row stays whole under Acceptance criteria while only its external clause is copied unmarked, that existing Integration entries come first with nested lines intact, and that moved rows drop the checkbox but keep exact text and ticket order. One fragile spot: the bare `on staging` item sits between marked rows with nothing tying it to its source row. If the wording later adds an annotation there, it would break the 'plain entry, without a marker' fact, so it should state that this clause is copied with nothing added.

exit: 0
