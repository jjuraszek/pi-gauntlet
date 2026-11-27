# eval report: loop (partial run: tracker-refresh)

for: 05dffaf811f9b5333628ba334e68529d62cf43938b71bd895fb89186c6bc2303

wall: 95s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-refresh | anthropic/claude-opus-5-5 | improved | 16777 | seed: holds -> holds (held); baseline: fails -> holds (unplanned improvement); retry-order: fails -> holds (unplanned improvement); cut-completion: fails -> holds (unplanned improvement) |
| tracker-refresh | github-copilot/gpt-6.1-sol | improved | 16429 | seed: holds -> holds (held); baseline: fails -> holds (unplanned improvement); retry-order: fails -> holds (unplanned improvement); cut-completion: fails -> holds (unplanned improvement) |

## Feedback

- tracker-refresh / anthropic/claude-opus-5-5: No fact that Before kept was lost in After. The seed fact holds in both: plan_check, the skeleton commit, start implement, one path-only plan_tracker refresh, no seed dispatch, start verify, and `gate set empty - every row cut` with `make ci` not run. The other three facts moved from fails to holds because After drops the driver's extra refresh calls. Before refreshed after writing the pending tuple, after each return admission, after the amendment commit and again at rule 1, which contradicts the 'without a tracker write', 'needs no driver tracker call' and 'no post-commit tracker call' clauses. After seeds the list once at entry and treats in_progress, skipped and implement complete as extension projections, which matches the Change's 'seed once, rely on automatic projection' wording. These three moves are not on the Expected to move list, though they follow from the Change. To keep them stable, keep the explicit wording that the single entry refresh is the only plan_tracker call and that the tuple write, return admission and amendment commit need none. Two things in After are thinner than they could be: the row 3 in_progress projection appears only in the ownership preamble, and the row 1 and row 3 skipped projection is a single line after the row 2 task fields. Stating each observation at its own dispatch step would make them harder to lose in a later rewording. Also keep the explicit statements that attempts, iterations, allowance and history are unchanged by the cut, and that reviewers and gates run only in verify.
- tracker-refresh / github-copilot/gpt-6.1-sol: The 'seed the list once, then rely on automatic projection' wording is what moved three facts: Before issued a plan_tracker refresh after every pending-tuple write, after each return admission, after the amendment commit and again at rule 1, so baseline, retry-order and cut-completion failed there, while After makes only the single post-implement-start refresh and treats skipped/in_progress/complete states as extension projections. The seed fact held in both, since each runs plan_check, commits the stamped ledger, starts implement, refreshes with only the absolute ledger path, dispatches nothing, and prints 'gate set empty - every row cut' without running make ci. No fact that Before kept was lost. To keep it that way, state explicitly that the one seed refresh at entry step 5 remains mandatory even for an all-cut ledger, so 'rely on automatic projection' is not read as removing it. In scenario 2 After says it 'records and saves' HEAD and only later mentions a 'saved before-image'; wording that explicitly requires saving the ledger before the iteration bump (as After's scenario 3 does) would make the baseline fact unambiguous. After's amendment step says the driver 'refreshes held dispositions, membership, paths, and Rules', which could be misread as a tracker refresh; a verb like 're-decodes' would avoid that.

exit: 0
