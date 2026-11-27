# eval report: loop (partial run: seed-dispositions)

for: 6a099150775b5ff06474a688f58c8d0d00589bcdd9cda1a8bd99640e85aa92bd

wall: 53s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

After an interrupted return, read the repaired rows from the ledger and continue without a tracker call, including on resume. Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 7261 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 6741 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: No fact moved between Before and After: both show the same six-row skeleton (rows 1, 2, 6 open with empty evidence and zero attempts, rows 3-5 cut with their disposition text, no sandbox prerequisite on row 6), both commit the skeleton before starting implement and dispatch seed to a fresh foreground loop-implementer in the worktree with file-only output, acceptance level none and no model override, and both admit A (next target row 2), admit B (exit to after-the-loop), and repair and redispatch seed for C, D and E. The expected fails -> holds move for seed-dispositions/entries did not appear here because Before already stated that all Integration entries get no row and no worker; After states it as 'no rows, no workers and no checks', which is slightly more complete, but neither output names the release tag entry individually or explicitly says the entries are never blockers or next targets - the fact holds by the blanket statement and by absence from the ledger and target selection. To make this robust, keep the wording that produces the explicit blanket exclusion of every Integration entry (ideally also saying they are never blockers or targets, including pre-merge and after-merge ones), and keep the wording that drives the explicit 'no model field', the skeleton commit preceding phase start, and the closing statement that C-E involve no human stop; After dropped the explicit plan_tracker refresh before the seed dispatch and after returns, which does not affect these facts but could matter for other samples if the automatic-projection wording is read as removing the initial seeding refresh.
- seed-dispositions / github-copilot/gpt-6.1-sol: Neither output moved a fact: both show the same six-row skeleton (AC1 and AC2 open with empty evidence, three cut rows carrying their deviates/deferred/elsewhere reasons, AC6 open with no sandbox prerequisite, all attempts 0), both commit the stamped skeleton before starting implement and dispatch the seed to a fresh foreground loop-implementer in the home worktree with file-only output, acceptance none and no model override, and both admit A (target row 2) and B (exit to After the loop) while routing C, D and E to seed repair and seed redispatch at 1 of 4. The expected fails -> holds move on entries is not visible here because Before already stated that none of the six Integration entries receives a ledger row, worker, prerequisite gate or added requirement, and never used one as a blocker or target. After's statement is slightly narrower ('no rows, workers, or implementation requirements') and it drops Before's explicit 'do not turn Integration entries into gates' in return B; it still holds because no entry, including the release tag, appears anywhere as a row, assignment, seed check, blocker or target, but to keep this fact robust the wording should keep prompting an explicit sentence that Integration entries are never rows, worker assignments, seed checks, gates/blockers or next targets. After also omits the explicit plan_tracker refresh after the pending bump and after seed admission, consistent with the Change's reliance on automatic projection, and that does not affect any listed fact.

exit: 0
