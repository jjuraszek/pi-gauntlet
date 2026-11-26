# eval report: spec-council-applier (partial run: placement-keeps-leg-scope)

for: 9633b5b696e1cb261f0f0fe6a2ff57380dc53a78f6bafc0245cb478d849043b7

wall: 30s

## Change

For grounded-hypothesis-over-spec, judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No behavior movement is expected for that sample.

For pr-description-finding, put the requested operator instruction under Integration. Correct the two flagged ticket placements verbatim, applying the shared definition without a question. Preserve and never grade the other entries.

For placement-keeps-leg-scope, move the flagged person step verbatim to Integration without a question. Rewrite every leg's scope in the same edit so each still owns its original functionality rows at their new positions.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| placement-keeps-leg-scope | anthropic/claude-opus-5-5 | improved | 14165 | placement: fails -> holds (intended change); ownership: holds -> holds (intended but unchanged); no-question: holds -> holds (held) |
| placement-keeps-leg-scope | github-copilot/gpt-6.1-sol | improved | 6361 | placement: fails -> holds (intended change); ownership: holds -> holds (intended but unchanged); no-question: holds -> holds (held) |

## Feedback

- placement-keeps-leg-scope / anthropic/claude-opus-5-5: Only placement moved. After writes the Integration entry as a list item in the ticket's exact words, with a separate marker line (`ticket row, not an acceptance criterion: person step`). Before folds a bare kind label into the item (`- person step: the operator starts the cutover`), so the item is not purely the source's words and nothing marks it as a ticket row. I read that as failing the 'ticket marker' clause, though it is a close call: Before does move the text verbatim and labels it a person step, so a looser reading would pass it. Ownership did not move as you expected: Before already renumbered both legs correctly (orchard/importer to `scope: AC 1`, orchard/reports to `scope: AC 2`), so it holds on both sides and the scope-rewrite wording shows no gain on this sample. No-question holds in both: neither spec nor audit asks anything, and both audits apply the chair's cluster with its grounding citation. To keep all three, keep the instruction that the moved row stays an unprefixed verbatim list item with the ticket/person-step marker on its own line, and keep the same-edit rule that every leg's scope is renumbered to its original functionality rows. One difference to check against the unchanged audit contract: After drops the per-line `Applied:` prefix that Before used inside the Applied section, so state the audit line format explicitly if that prefix is required.
- placement-keeps-leg-scope / github-copilot/gpt-6.1-sol: After moved placement from fails to holds: the Integration entry now carries the continuation line `ticket row, not an acceptance criterion: person step`, which is the ticket marker for a person step that Before lacked (Before moved the row verbatim but left it as a bare list item, with the person-step label only in the audit). The two functionality rows remain verbatim and in order in both outputs. Ownership held in both: Before already renumbered orchard/importer to `scope: AC 1` and orchard/reports to `scope: AC 2`, so the expected fails -> holds movement for ownership did not show on this sample; the scope-rewrite wording is not what changed the result here, though it is harmless and the audit now states the renumbering explicitly. No-question held in both: neither spec nor audit asks a placement or ownership question, and the audit applies the chair's cluster with Deferred and Rejected as none. To keep all three, retain the wording that requires the marker on the moved entry itself in the spec (not only in the audit), keep the instruction to rewrite every leg's scope in the same edit, and keep the 'without a question' phrasing; consider fixing the exact marker text so the entry stays one list item in the source's words with a consistent annotation.

exit: 0
