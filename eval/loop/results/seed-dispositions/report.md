# eval report: loop (partial run: seed-dispositions)

for: 05dffaf811f9b5333628ba334e68529d62cf43938b71bd895fb89186c6bc2303

wall: 55s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 5841 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 10618 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: All four facts hold in both outputs, so the After wording moved nothing on this case, including seed-dispositions/entries, which was expected to go from fails to holds but already held in Before: Before's classification table says all Integration entries get no row and no worker, and no entry appears as a seed check, blocker or target anywhere in it. After is somewhat more explicit on that point (it adds 'They are not work or requirements' and 'The Integration items are not checked' in the gate set), which is the direction the Change intended, so keep that wording. To keep the other facts stable, preserve what both outputs share: the six-row skeleton with rows 1, 2 and 6 open with empty evidence and zero attempts and the venue marker treated as not a cut disposition with no sandbox prerequisite; the plan_check, skeleton commit, then implement start ordering; the fresh foreground loop-implementer dispatch in the same worktree with file-only output, acceptance level none and no model override; and the seed-miss repair and seed redispatch route for C, D and E with no ordinary worker and no human stop. If you want the entries fact to discriminate, the wording could also state explicitly that the release-tag entry in particular is never a blocker or next target, but nothing in After currently risks that fact.
- seed-dispositions / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs satisfy all four. The expected fails -> holds move on seed-dispositions/entries does not show, because Before already holds: it says none of the six Integration entries receives a ledger row, worker, prerequisite gate or additional implementation requirement, and repeats in return B that Integration entries are not turned into gates. After keeps the fact with a thinner statement ("Integration entries get no ledger rows and no workers") and never makes any entry, including the release tag, a seed check, blocker or next target; but it drops Before's explicit denial of gates and prerequisites. To make this robust, have the wording say outright that Integration entries are never ledger rows, worker assignments, seed checks, blockers or next targets. The duplicate-id row behaves as the Change intends in both outputs: the `venue:` row opens with empty evidence, zero attempts and no sandbox prerequisite. After also keeps the stamped skeleton commit before implement start, the fresh foreground file-only seed dispatch with `none` acceptance and no model override, and the A/B admissions. Consolidating C-E into one shared repair section still reads clearly as seed repair plus seed redispatch with no human stop or ordinary worker, so keep the per-return "Next route: seed repair, then seed redispatch" lines so each return states its route on its own.

exit: 0
