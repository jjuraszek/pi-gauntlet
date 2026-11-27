# eval report: loop (partial run: seed-dispositions)

for: 1fd2513427d334ae0d7674d346227b8258cc94a8c3df2a2885e2df4a707d740b

wall: 69s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 10990 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 6622 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: No fact moved: both outputs satisfy all four facts, so the expected fails -> holds on seed-dispositions/entries does not show up in this pair. Before already says the six Integration entries get no row and no worker and that the `not stated` entry triggers no stop, and After says the same in its classification table. Both outputs build the same six-row skeleton, with rows 1, 2 and 6 open and empty, rows 3-5 cut with their reasons, all attempts at 0, and no sandbox prerequisite on row 6. Both run plan_check and commit the skeleton before starting implement, and both dispatch the seed to a fresh, foreground loop-implementer in the worktree with file-only output, acceptance level none and no model override. Both admit A and target row 2, admit B and leave the row loop for verify, and repair and redispatch the seed for C, D and E without a human stop. To keep these facts while delivering the Change, keep the explicit statement that `venue:` is not a cut disposition and so opens like an unmarked criterion, and keep the explicit exclusion of all Integration entries; naming the release tag entry and saying the entries are also never a seed check, blocker or next target would make that fact more robust. After's new conditional in B ('if implement is still active, take a human stop') does not break the admission fact, but keep it clearly conditional so it is not read as a stop on the clean path.
- seed-dispositions / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both show the six-row skeleton (AC1, AC2 and AC6 open with empty evidence and zero attempts, AC3-AC5 cut with their deviates/deferred/elsewhere reasons, no sandbox prerequisite on AC6), both stamp and commit the skeleton before starting implement and dispatch a fresh foreground loop-implementer in the home worktree with file-only output, acceptance level none and no model override, and both admit A (next target row 2), admit B (exit to verification), and route C, D and E to seed repair plus seed redispatch with no human stop. On the expected seed-dispositions/entries move, Before already held: it states the six Integration entries produce no ledger rows, workers or additional requirements, and nothing in its row table, dispatch task, seed checks or next targets references them, so the result here is holds -> holds, not fails -> holds. After strengthens this slightly by adding 'prerequisite gate' to the exclusion list and 'Do not turn Integration entries into gates' in B; keep that explicit wording, since it is what makes the release-tag entry visibly excluded from blockers and verification gates. One thing to watch: After's Return B now mentions 'use the prescribed human-stop procedure' if implement remains active; this is a conditional branch and does not break admission, but keep it clearly conditional so the B route stays read as exiting the row loop, and keep the C-E closing sentence that these are validation repairs, not human stops or interrupted recovery.

exit: 0
