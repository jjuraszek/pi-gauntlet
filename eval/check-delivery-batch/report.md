# eval report: check-delivery-batch (partial run: batch-one-gate-per-turn)

for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

wall: 12s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. batch-ac-conflict-row checks the recovery marker, quoted conflicting rows and retry/skip menu without asking for a reading. batch-ac-conflict-reading checks that retry opens a separate question and waits for the typed reading. batch-closing-marker checks the final delivered=2,declined=1 marker and roster-ordered outcomes. These text samples take tool observations as inputs; they do not observe actual dispatch, reading transfer to a retry task, re-fetch, tracker writes, or cleanup.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-one-gate-per-turn | anthropic/claude-opus-5-5 | improved | 11403 | report-verbatim: fails -> holds (intended change); one-gate: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (intended change); no-second-ticket: fails -> holds (intended change); no-third-ticket: fails -> holds (intended change); private-handoff: holds -> holds (held); private-result: holds -> holds (held) |
| batch-one-gate-per-turn | github-copilot/gpt-6.1-sol | improved | 9304 | report-verbatim: fails -> holds (intended change); one-gate: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (intended change); no-second-ticket: fails -> holds (intended change); no-third-ticket: fails -> holds (intended change); private-handoff: holds -> holds (held); private-result: holds -> holds (held) |

## Feedback

- batch-one-gate-per-turn / anthropic/claude-opus-5-5: After moved report-verbatim from fails to holds: it reproduces File 01's Report section word-for-word (SHA, deliverable, stages line, AC table with the original 'fixture-only contract' evidence wording, reviewer script, write line, and the exact fenced comment) under its own ticket heading, and omits #15 and #18 entirely, whereas Before reformatted the report into bullets, reworded the evidence cell, and appended both sibling reports plus rebuilt comments. one-gate held in both: After still ends with a single two-choice approve/decline menu and makes no write claim. One small regression risk worth guarding in the wording: Before separated the gate with a `---` rule and a fenced `text` block, while After drops both and uses a bare numbered list after a blank line; a stricter reader of 'separated' could balk. Keep the current verbatim-report and current-ticket-only instructions, and add that the gate is rendered in its own fenced block (or after a horizontal rule) exactly as the single-ticket sample does, so the separation Before had is preserved alongside the new per-ticket turn behavior.
- batch-one-gate-per-turn / github-copilot/gpt-6.1-sol: After moved report-verbatim to holds by pasting ticket 12's Report block exactly as saved (same labels, same parenthetical stage note, same table cells and fenced comment) and by omitting #15 and #18 entirely; Before failed because it restyled the fields (bold labels, backticks, colon instead of parentheses) and interleaved all three sibling reports under one approval. After keeps one-gate as Before did: the message closes on a separated 'Pick one' with exactly approve/decline and asserts no write. To keep both facts while delivering the Change, keep the current pattern: one ticket heading, the Report body copied unchanged (including the 'Write about to happen' line and the fenced comment), then the two-choice gate; one small cleanup would be to drop the literal '## Report' sub-heading beneath the ticket heading, since it is a file section label rather than report content and reads as leaked handoff structure, though its presence does not break either fact.

exit: 0
