# eval report: spec-council-applier (partial run: placement-keeps-leg-scope)

for: a1d221625a7b1fbf329c3326389d0d0cf5821860f9d01591bc37a3e7c0f8bd7f

wall: 23s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

For placement-keeps-leg-scope, move the flagged person step verbatim to Integration without a question. Rewrite every leg's scope in the same edit so each still owns its original functionality rows at their new positions.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| placement-keeps-leg-scope | anthropic/claude-opus-5-5 | improved | 10754 | placement: fails -> holds (intended change); ownership: holds -> holds (intended but unchanged); no-question: holds -> holds (held) |
| placement-keeps-leg-scope | github-copilot/gpt-6.1-sol | improved | 5469 | placement: fails -> holds (intended change); ownership: holds -> holds (intended but unchanged); no-question: holds -> holds (held) |

## Feedback

- placement-keeps-leg-scope / anthropic/claude-opus-5-5: The only fact After moved is placement: it now keeps `the operator starts the cutover` as a list item purely in the ticket's words under Integration, with the line `ticket row, not an acceptance criterion: person step` beneath it. Before instead wrote `- person step: the operator starts the cutover`, which folds a kind label into the entry and carries no marker tying it to the ticket, so I read it as failing on the marker (a close call, since the row text itself was intact). Ownership did not move as expected, because Before already renumbered both legs correctly (orchard/importer `scope: AC 1`, orchard/reports `scope: AC 2`); this sample therefore gives no evidence that the new scope-rewrite wording caused anything. No-question held in both: neither the spec nor the audit asks a placement or ownership question, and both audits apply the chair's cutover-placement cluster. To keep all three facts, retain the instruction to put the source words alone on the list item with the ticket/person-step marker on a separate line, and retain the same-edit rewrite of every leg's scope to the rows' new positions; nothing in After lost a fact that Before kept.
- placement-keeps-leg-scope / github-copilot/gpt-6.1-sol: The After wording moved placement from fails to holds: the Integration entry now carries the line `ticket row, not an acceptance criterion: person step`, whereas Before moved the row verbatim but left it as a bare list item with no marker in the spec (the audit mentioned 'person step', but the spec did not). Ownership did not move as predicted because Before already renumbered both legs to `scope: AC 1` and `scope: AC 2`, so each leg kept its original functionality row in both outputs; the scope-rewrite instruction is therefore harmless but not shown to be load-bearing on this sample. No-question holds in both: neither the spec nor the audit asks anything, and both apply the chair's cluster. One thing to watch: the After audit line dropped the chair's `grounded:` token from the cluster citation (`[blocker] cutover-placement` instead of `[blocker] grounded: cutover-placement`), though it still keeps the trailing `(grounded: ...)` evidence; if the audit contract expects the cluster quoted as the chair wrote it, add wording that the Applied line reproduces the chair's cluster label verbatim, while keeping the instructions to mark the moved row as a person step under Integration and to rewrite every leg's scope in the same edit.

exit: 0
