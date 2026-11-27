# eval report: loop (partial run: tracker-boundary)

for: 6a099150775b5ff06474a688f58c8d0d00589bcdd9cda1a8bd99640e85aa92bd

wall: 98s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

After an interrupted return, read the repaired rows from the ledger and continue without a tracker call, including on resume. Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-boundary | anthropic/claude-opus-5-5 | improved | 16797 | attribution: holds -> holds (held); stops: holds -> holds (held); admission: holds -> holds (held); immediate: holds -> holds (held); resume: fails -> holds (unplanned improvement) |
| tracker-boundary | github-copilot/gpt-6.1-sol | improved | 15551 | attribution: holds -> holds (held); stops: holds -> holds (held); admission: holds -> holds (held); immediate: holds -> holds (held); resume: fails -> holds (unplanned improvement) |

## Feedback

- tracker-boundary / anthropic/claude-opus-5-5: The only fact that moved is resume, and it moved in the intended direction: Before ended both the immediate repair and the fresh-session repair with a tracker refresh ("Refresh. The list now shows row 2 failed at 2 of 4", "I commit R and refresh"), while After writes the repair commit, states "Make no tracker call", and goes straight back to the ordered table from the repaired ledger. The new wording about reading repaired rows from the ledger and continuing without a tracker call, including on resume, is what delivered this, so keep it. After states the no-tracker rule explicitly only in 3a; 3b and 4a/4b inherit it by reference ("the same repair commit as in 3a"), so wording that makes the resume path say outright that neither restore nor repair calls the tracker would make this more robust. The other four facts hold in both outputs: the stop block and its four options, the rule-3 hint and dispatch at iterations 10 with no override, the rejection of both returns with consumed iterations 3 and pending cleared, the redispatch at iterations 4 with no grant, and the returned:/bumped-iterations attribution with no sidecar. One shared soft spot: both outputs name the repair commit only as "the shared Row repair sentence" rather than printing `loop: repair row 2`; I counted that as holding in both, but wording that has the driver print the literal commit subject would remove the ambiguity. After also changed the post-recovery previous decision from Before's `none` to "the last admitted row 2 line"; no fact covers this, but confirm it is intended.
- tracker-boundary / github-copilot/gpt-6.1-sol: The only fact that moved is resume. Before ended both immediate and fresh-session recovery with a `plan_tracker` refresh after the repair commit ("single refresh"), which is a tracker call on the resume path. After states "No task-tracker call is made during recovery" and reads the repaired state (row 1 skipped, row 2 failed, attempts 2, iterations 3, pending absent) from the ledger before the next dispatch. The other four facts are unchanged: After keeps the allowance stop text and menu, the non-escalated stagnation dispatch with iteration 10 and pending, the cleanup-then-repair sequence with no proof demand or signals, and the `returned:` attribution with bumped iterations checked against saved +1. To keep this, hold the explicit sentence that recovery and resume read repaired rows from the ledger with no tracker call, and keep the human-stop reads confined to the Allowance stop, as After does. Two things to watch: neither output prints the literal `loop: repair row 2` commit subject (both leave the Row repair sentence symbolic), so I read admission as holding on the described repair commit; and After's stagnation dispatch passes the last decision as `previous decision` where Before passed `none`, which no fact here tests.

exit: 0
