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

---

# eval report: check-delivery-batch (partial run: batch-decline-isolates)

for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

wall: 20s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. These text samples take tool observations as inputs; they do not observe actual dispatch, re-fetch or tracker writes, recovery, or settlement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-decline-isolates | anthropic/claude-opus-5-5 | improved | 13026 | report-verbatim: fails -> holds (unplanned improvement); approval-isolated: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); decline-outcome: fails -> holds (unplanned improvement); ticket-heading: fails -> holds (unplanned improvement); no-third-ticket: holds -> holds (held); private-handoff: holds -> holds (held) |
| batch-decline-isolates | github-copilot/gpt-6.1-sol | improved | 15612 | report-verbatim: fails -> holds (unplanned improvement); approval-isolated: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); decline-outcome: fails -> holds (unplanned improvement); ticket-heading: fails -> holds (unplanned improvement); no-third-ticket: holds -> holds (held); private-handoff: holds -> holds (held) |

## Feedback

- batch-decline-isolates / anthropic/claude-opus-5-5: After moved report-verbatim from fails to holds: Before reformatted the child's report (bold labels, 'there is no runtime surface' instead of 'no runtime surface', an expanded 'Write about to happen' paragraph about re-fetching), whereas After reproduces the Report block byte-for-byte including the AC table, reviewer script, and fenced comment, under the ticket's own heading, preceded by a plain 'acme/widget#12: declined' line. Both outputs keep approval-isolated: only ticket 15's approve/decline gate is offered, no write is claimed for either ticket, and 12's decline is reported as its own outcome without touching 15. Two small things to watch in the After wording: the options are now wrapped in a text code fence, which reads as a quoted block rather than a prompt — keeping the 'Pick one' options as plain numbered lines (as in Before) would be safer; and the ticket 12 line could keep Before's explicit 'nothing was written' phrasing so the no-write claim is stated rather than implied. Otherwise the After wording delivers the Change without losing anything Before kept.
- batch-decline-isolates / github-copilot/gpt-6.1-sol: After is the stronger output here: it reproduces ticket 15's Report section byte-for-byte (header line, stage summary line, AC table, reviewer script, 'Write about to happen' line, and the fenced comment) under its own ticket heading, preceded by a plain 'acme/widget#12: declined' outcome, and ends with only ticket 15's approve/decline gate while claiming no write for either ticket. Before failed report-verbatim because it rewrote the report rather than displaying it: 'Deliverable' became 'Deliverable set', the one-line Stages summary became a bullet list, backticks were added inside the AC table, 'Write about to happen' was replaced by an 'Exact write awaiting approval' block with invented 'Body edit' and 'Status advance' lines (handoff metadata that should stay private), and a re-fetch sentence was inserted between the report and the gate. The After wording's instruction to show the child's report without rewriting or combining it is what moved that fact; keep that rule explicit ('paste the Report section as written, add nothing between it and the gate'), keep the prior ticket's outcome to a single plain line, and keep the gate text identical to the first-turn gate so approval-isolated stays stable as further tickets are processed.

exit: 0

---

# eval report: check-delivery-batch (partial run: batch-approved-after-decline)

for: b85d91f9afdc5590718b8ad859a6214ed229205135ed16ceee1da91947ffc0cd

wall: 23s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. These text samples take tool observations as inputs; they do not observe actual dispatch, re-fetch or tracker writes, recovery, or settlement.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-approved-after-decline | anthropic/claude-opus-5-5 | improved | 12574 | report-verbatim: fails -> holds (unplanned improvement); independent-approval: holds -> holds (held); exact-halves: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); delivered-outcome: fails -> holds (unplanned improvement); outcome-before-next: fails -> holds (unplanned improvement); private-handoff: holds -> holds (held) |
| batch-approved-after-decline | github-copilot/gpt-6.1-sol | improved | 19225 | report-verbatim: fails -> holds (unplanned improvement); independent-approval: holds -> holds (held); exact-halves: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); delivered-outcome: fails -> holds (unplanned improvement); outcome-before-next: fails -> holds (unplanned improvement); private-handoff: holds -> holds (held) |

## Feedback

- batch-approved-after-decline / anthropic/claude-opus-5-5: After keeps every fact Before kept and fixes report-verbatim: Before reformatted ticket 18's Report (bold labels, bulleted stages, reworded reviewer script, an expanded write-about-to-happen with a re-fetch promise), so it was not the child's report unchanged, while After pastes the Report block as the child produced it, including the AC table, reviewer script line and exact comment. independent-approval and exact-halves hold in both: After's `acme/widget#15: delivered` line claims only the delivered outcome, makes no status-advance or body-edit claim for 15, says nothing about a write to 12, and asks for approval only on 18 with no settlement. One minor wording nit: the pasted `## Report` H2 sits under the `#### acme/widget#18` H4, which inverts heading levels; if the author wants cleaner structure, drop or demote the inner `## Report` line while keeping the body text byte-for-byte, which would still satisfy report-verbatim since the fact concerns the table, script and comment, not the heading.
- batch-approved-after-decline / github-copilot/gpt-6.1-sol: After moved report-verbatim from fails to holds: it reproduces ticket 18's Report block exactly (plain `Shipped SHA`/`Deliverable`/`Stages` lines, the unmodified AC table, the `Reviewer script` line, the `Write about to happen: comment only; no target state configured.` line and the identical fenced comment) under its own `#### acme/widget#18` heading, directly after a plain `acme/widget#15: delivered` outcome. Before failed this fact because it re-rendered the report with bold labels and backticks, renamed the write line to `Exact write proposed`, expanded it into prose, and appended an extra sentence about re-fetching, so the report was rewritten rather than displayed unchanged. Both outputs keep independent-approval and exact-halves: neither claims a status advance or body edit for ticket 15, neither claims a write for ticket 12, neither re-asks approval for 15, and only ticket 18 gets the 1/2 gate with no settlement. After's one-line `delivered` outcome for 15 is sufficient; it drops Before's explicit `#12 declined; no write ran` reminder, which is not required by any fact here but could be kept as an optional one-line prior-outcome note under its own heading without touching the verbatim report, if the author wants the decline visible in the same turn.

exit: 0
