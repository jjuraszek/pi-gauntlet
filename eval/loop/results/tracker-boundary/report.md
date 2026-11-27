# eval report: loop (partial run: tracker-boundary)

for: 05dffaf811f9b5333628ba334e68529d62cf43938b71bd895fb89186c6bc2303

wall: 115s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-boundary | anthropic/claude-opus-5-5 | unchanged | 27177 | attribution: holds -> holds (held); stops: holds -> holds (held); admission: holds -> holds (held); immediate: holds -> holds (held); resume: fails -> fails (pre-existing) |
| tracker-boundary | github-copilot/gpt-6.1-sol | improved | 17282 | attribution: holds -> holds (held); stops: holds -> holds (held); admission: holds -> holds (held); immediate: holds -> holds (held); resume: fails -> holds (unplanned improvement) |

## Feedback

- tracker-boundary / anthropic/claude-opus-5-5: No fact moved between Before and After. Attribution, stops, admission and immediate hold in both: the pending tuple is copied to returned: with the bumped count, the allowance stop prints the same counts and four-option menu, both rejected returns get the same interrupted repair, and row 2 is redispatched at 2 of 4 with iterations 4 and no proof demand. Resume fails in both for one reason: I read "calls the tracker for the ledger list" as covering a refresh on the ledger path, and both outputs narrate one after the repair commit (Before: "I commit R and refresh"; After: "Refresh the task list" and an explicit plan_tracker refresh in immediate recovery). If you meant only a list read, resume holds in both. The After wording's "rely on automatic projection" did not remove those refreshes, so say explicitly that interrupted recovery and fresh-session restore make no plan_tracker call and that the list follows the committed repair automatically. Two After drifts sit outside the facts but are worth pinning. It asserts a `row 2 escalated` decision the input never supplies and so prints "escalated round spent"; say to print that line only when the observations show the decision. It also sets the post-repair previous decision to the last admitted failed line where Before used `none`; state which one is meant. Finally, both outputs say "the shared Row repair sentence" rather than the literal `loop: repair row 2` subject, so naming the subject would make admission robust.
- tracker-boundary / github-copilot/gpt-6.1-sol: The only fact that moved is resume, and it moved in the right direction. Before proposed a plan_tracker refresh after the repair commit and repeated that "single refresh" in the fresh-session resume, which breaks the clause that neither restore nor repair calls the tracker for the ledger list. After drops every tracker call from recovery, resume and redispatch, consistent with the "rely on automatic projection" wording, so keep that wording as is. Everything else Before kept survives: the stop header, "row 2: 4 of 4", "Preserve every row's attempts.", the four-option menu, the iteration 10 and pending write before the stagnation dispatch, the no-proof and no-signal recovery, iterations 3 and allowance 4 retained, and returned: attribution with saved iterations +1. Two things to tighten. Neither output prints the literal repair commit subject "loop: repair row 2"; both defer to the shared Row repair sentence, which I read as satisfying admission, but wording that names the subject outright would make it unambiguous. After's Allowance recommendation says "retry 2 | inspect parser" while the last decision says "retry parser"; no fact turns on it, but the stop wording should tell the model to quote the last decision's hint verbatim.

exit: 0
