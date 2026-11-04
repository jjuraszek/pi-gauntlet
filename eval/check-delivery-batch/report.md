# eval report: check-delivery-batch (partial run: batch-one-gate-per-turn)

for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

wall: 28s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets; it does not observe dispatch, fetch, tracker calls, later approvals, recovery, or settlement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-one-gate-per-turn | anthropic/claude-opus-5-5 | improved | 9588 | report-verbatim: fails -> holds (intended change); one-gate: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (intended change); no-second-ticket: fails -> holds (intended change); no-third-ticket: fails -> holds (intended change); private-handoff: holds -> holds (held); private-result: holds -> holds (held) |
| batch-one-gate-per-turn | github-copilot/gpt-6.1-sol | improved | 11205 | report-verbatim: fails -> holds (intended change); one-gate: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (intended change); no-second-ticket: fails -> holds (intended change); no-third-ticket: fails -> holds (intended change); private-handoff: holds -> holds (held); private-result: holds -> holds (held) |

## Feedback

- batch-one-gate-per-turn / anthropic/claude-opus-5-5: After moved report-verbatim from fails to holds: it reproduces ticket 12's Report block as the child wrote it (Shipped SHA, Deliverable, the one-line Stages, the AC table with the original evidence wording, reviewer script, write line, and the exact fenced comment) under a single acme/widget#12 heading, with no #15 or #18 content and no handoff metadata or REPORT sentinel leaking through; Before failed because it rewrote the report into bullets, paraphrased the evidence cells, and stacked all three sibling reports into one message. one-gate held in both: each ends with a separated two-choice 'approve the write / decline' prompt and claims no write. The only drift in After is cosmetic — the gate options lost the fenced text block Before used; keeping the choices in a ```text fence as in Before would make the gate separation unambiguous while preserving everything else After now delivers.
- batch-one-gate-per-turn / github-copilot/gpt-6.1-sol: After moved report-verbatim from fails to holds by dropping the #15 and #18 sections and pasting File 01's Report block as-is (shipped SHA, deliverable, stages with the original parenthetical, the AC table, reviewer script, 'Write about to happen' line and the exact fenced comment), whereas Before restyled every field with bold labels and backticks, rewrote the stages punctuation, and interleaved all three sibling reports under one approval. one-gate holds in both: each ends with a separated two-choice 'approve the write / decline' gate and neither claims a write occurred. Nothing regressed. One small polish point that would not change any fact: the pasted '## Report' heading outranks the '#### acme/widget#12' ticket heading, so the ticket reads as nested under the report rather than the reverse; either drop the child's '## Report' label when displaying or make the ticket heading the higher level so the current-ticket identification stays visually primary.

exit: 0
