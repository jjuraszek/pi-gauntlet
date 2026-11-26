# eval report: check-delivery-batch (partial run: zero-criteria-entries-listed)

for: ae596b80d43487cd831cc5f1b33dfe81570338b921fe817b2c22602c167c334a

wall: 11s

## Change

On a batch ticket's zero-criterion recovery turn, copy both informational lists from the child's report when present, once each under their original headings, without verdicts. Keep the stop reason, retry and skip choices, and no-write rule unchanged. Preserve sibling outcomes and independent gates. The replay starts with saved child reports and tests message rendering, not child sorting, dispatch, or real tracker writes.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| zero-criteria-entries-listed | anthropic/claude-opus-5-5 | improved | 5490 | excluded-rows: fails -> holds (unplanned improvement); integration-entries: fails -> holds (intended change); stop-unchanged: holds -> holds (held); no-write: holds -> holds (held); sibling-unchanged: holds -> holds (held) |
| zero-criteria-entries-listed | github-copilot/gpt-6.1-sol | improved | 5438 | excluded-rows: fails -> holds (unplanned improvement); integration-entries: fails -> holds (intended change); stop-unchanged: holds -> holds (held); no-write: holds -> holds (held); sibling-unchanged: holds -> holds (held) |

## Feedback

- zero-criteria-entries-listed / anthropic/claude-opus-5-5: After moved integration-entries from fails to holds as intended, and also moved excluded-rows from fails to holds: Before showed only the stop reason and the retry/skip options for ticket 15, with neither informational list, while After copies both the queue-clearing row (with its person-step label) and the live-orders dashboard entry once each under their original headings, with no verdicts, no request to perform them, and the stop reason still presented as the sole blocker. Nothing Before kept was lost: the gate is still check-delivery/set-recovery with the same stop reason and the same two options, no tracker write is offered or claimed, and ticket 12 still shows only its plain declined outcome without a reopened gate or re-rendered report. To keep this stable, keep the wording that says the lists are copied verbatim under their original headings, placed after the stop line and before the choices, and that they are informational only; note that excluded-rows was not on the expected-to-move list, so if the Before wording was supposed to already list the excluded rows, the baseline did not show that and the expectation list should be updated to reflect that both list facts move.
- zero-criteria-entries-listed / github-copilot/gpt-6.1-sol: After now copies both informational lists from ticket 15's saved report, each exactly once under its original heading (`Not acceptance criteria:` with the person-step label, `Integration (not checked):` with the live-orders entry), with no verdicts, no request to perform them, and the stop reason still the sole blocker; this moved integration-entries from fails to holds as intended, and also moved excluded-rows from fails to holds, since Before rendered neither list. Everything Before kept is still kept: the single check-delivery/set-recovery gate with the unchanged stop reason and the retry/skip options, no tracker write offered or claimed, and ticket 12's plain `declined` line without a reopened gate or re-rendered report. To keep this stable, keep the wording that says the lists are copied verbatim, once each, placed between the stop line and the options, and explicitly informational (not verdicts, not actions, not the stop reason); the only cosmetic differences from Before are the dropped blank lines after the gate header and after `Pick one:`, so if that spacing matters, state it explicitly in the wording.

exit: 0
