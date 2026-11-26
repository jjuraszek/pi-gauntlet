# eval report: check-delivery-batch (partial run: zero-criteria-entries-listed)

for: 7e3fd0dcead696d7bd7331844de51d1aea670e26223566186241ec6cd515d287

wall: 10s

## Change

On a batch ticket's zero-criterion recovery turn, list the child's excluded rows once under Not acceptance criteria without a verdict. Keep the stop reason, retry and skip choices, and no-write rule unchanged. Preserve sibling outcomes and independent gates. The replay starts with saved child reports and tests message rendering, not child sorting, dispatch, or real tracker writes.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| zero-criteria-entries-listed | anthropic/claude-opus-5-5 | improved | 5350 | excluded-rows: fails -> holds (intended change); stop-unchanged: holds -> holds (held); no-write: holds -> holds (held); sibling-unchanged: holds -> holds (held) |
| zero-criteria-entries-listed | github-copilot/gpt-6.1-sol | unchanged | 5151 | excluded-rows: holds -> holds (intended but unchanged); stop-unchanged: holds -> holds (held); no-write: holds -> holds (held); sibling-unchanged: holds -> holds (held) |

## Feedback

- zero-criteria-entries-listed / anthropic/claude-opus-5-5: After moved excluded-rows as intended: the two rows now appear exactly once each under a "Not acceptance criteria:" heading, with their original (person step) and (live check) labels, no verdict, no request to perform them, and the stop reason still stated separately as the blocker. Nothing else moved: the gate line is still check-delivery/set-recovery, the stop reason text is verbatim, retry and skip remain the only options, no tracker write is offered or claimed, and ticket 12 still shows only its plain declined outcome without a reopened gate or re-rendered report. To keep this stable, keep the wording that places the excluded rows after the quoted STOPPED line and before the choices, copied verbatim from the child's report, and keep stating that the list is informational only so the rows are never framed as the reason for the stop or as actions for the user; avoid any wording that could invite a per-row verdict or a second listing of the rows elsewhere in the turn.
- zero-criteria-entries-listed / github-copilot/gpt-6.1-sol: Before and After are textually identical apart from a blank line after "Pick one:", so no fact moved between them. Both already list the two excluded rows exactly once under Not acceptance criteria with no verdict, no request to perform them, and the stop reason (not either row) as the blocker; both keep the single check-delivery/set-recovery gate with the unchanged stop reason and retry/skip options, offer or claim no tracker write, and carry ticket 12's plain declined outcome without reopening its gate or re-rendering its report. The expected fails -> holds move on excluded-rows did not appear because Before already satisfies it in this replay; if the wording change is meant to be what produces the rows, this case does not demonstrate it, so consider a case where the earlier wording actually drops the rows. Keep the current After wording as is: rows listed once beneath the stop line, no verdict language, and the sibling line left as a plain declined outcome.

exit: 0
