# eval report: check-delivery-batch (partial run: batch-approved-after-decline)

for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

wall: 17s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. batch-ac-conflict-row checks the recovery marker, quoted conflicting rows and retry/skip menu without asking for a reading. batch-ac-conflict-reading checks that retry opens a separate question and waits for the typed reading. batch-closing-marker checks the final delivered=2,declined=1 marker and roster-ordered outcomes. These text samples take tool observations as inputs; they do not observe actual dispatch, reading transfer to a retry task, re-fetch, tracker writes, or cleanup.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-approved-after-decline | anthropic/claude-opus-5-5 | improved | 14404 | report-verbatim: fails -> holds (unplanned improvement); independent-approval: holds -> holds (held); exact-halves: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); delivered-outcome: fails -> holds (unplanned improvement); outcome-before-next: fails -> holds (unplanned improvement); private-handoff: holds -> holds (held) |
| batch-approved-after-decline | github-copilot/gpt-6.1-sol | improved | 16528 | report-verbatim: fails -> holds (unplanned improvement); independent-approval: holds -> holds (held); exact-halves: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); delivered-outcome: fails -> holds (unplanned improvement); outcome-before-next: fails -> holds (unplanned improvement); private-handoff: holds -> holds (held) |

## Feedback

- batch-approved-after-decline / anthropic/claude-opus-5-5: After fixes the one fact Before failed: Before re-rendered ticket 18's Report with bold labels, a bulleted Stages list, reworded reviewer-script and write-about-to-happen lines, and an added re-fetch promise, so it was not the child's Report unchanged; After reproduces the Report block verbatim under its own `#### acme/widget#18` heading, so report-verbatim now holds. Both facts Before kept are still kept: ticket 15 is shown as delivered in its own heading with no gate, no status advance, body edit, or ticket-12 write is claimed, and only ticket 18 receives the approve/decline menu with no settlement line. The After wording delivers the Change cleanly; if you want to retain a little of Before's reassurance without reintroducing rewriting, you could expand the 15 line to something like `acme/widget#15: delivered (evidence comment posted; no status advance or body edit)` while leaving the 18 Report block untouched and the gate as the only menu.
- batch-approved-after-decline / github-copilot/gpt-6.1-sol: After moved report-verbatim from fails to holds: Before rewrote ticket 18's Report into a bold-label layout, added backticks inside the AC table, capitalized the reviewer script, and replaced the child's 'Write about to happen' line with a new 'Exact write proposed' paragraph plus a re-fetch promise, so a careful reader would not call it unchanged; After reproduces the saved Report block byte-for-byte (header, stages line, table, reviewer script, write line, fenced comment) under its own ticket heading, preceded by a one-line plain delivered outcome for ticket 15, which is exactly what the Change asked for. Both outputs keep independent-approval and exact-halves: neither claims a body edit or status advance for 15, a write for 12, or a settlement, and only ticket 18 receives the approve/decline menu. The After wording needs no fixes for this case; if you want to preserve Before's explicit reminder that 12 was declined without a write, it could be folded into the ticket 15 outcome line without touching the verbatim Report, but it is not required by any fact here.

exit: 0
