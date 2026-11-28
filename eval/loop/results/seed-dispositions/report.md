# eval report: loop (partial run: seed-dispositions)

for: 70a64b2775e08c6dd314bbacbd93679960dcaa2163ec89b56480b73d48a2726a

wall: 67s

## Change

Defer closure at the conformance cap to step 6. The conformance-grant replay checks that closing one gap at the cap earns another round while a stalled round leaves verify incomplete.

Capture the bounded failure excerpt before a verification repair and reuse it at the stalled stop, without reading logs for diagnosis. Select verify-repair-count to check whether the driver continues when the failing assertion changes at the same gate and exit code. The replay supplies the before and after observations; it does not read or overwrite live logs.

The worker builds a stand-in when it knows the missing input's format. The loop-implementer samples cover the distinction; this driver was not replayed.

Select unnamed-action-asks to test whether the driver mistakes permission to amend the spec for permission to cut a row that needs an unnamed purchase. The replay stops at the user's question, without a live order or edit.

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

After an interrupted return, read the repaired rows from the ledger and continue without a tracker call, including on resume. Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Render the blocker and the input that would clear it. These selected text replays distinguish a stalled stop from an authorization question; they do not perform repairs.

Use the spent-allowance-moving-or-stalled snapshots to distinguish a below-allowance failure from a spent row whose contradiction has a named correction. Only the latter takes the amendment surface, following approval's permission. If the same contradiction returns after the correction, stop before another amendment even when the companion SHA differs.

Retry a failed row below allowance and dispatch a row reopened during verify without seeking a second authorization. The two selected replays narrate routing, not live execution.


Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

Compare the last two rounds at a spent counter. The selected snapshots distinguish a changed assertion or converging review from a repeated failure; they replay instructions, not live repairs.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 10734 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 10361 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: No fact moved on this case: both outputs hold all four. After produces the same six-row skeleton as Before, with rows 1, 2 and 6 open and empty, rows 3-5 cut with their reasons, and zero attempts throughout. It runs plan_check and commits the skeleton before starting the implement phase, and dispatches the seed to a fresh, non-async loop-implementer in the worktree with file-only output, level-none acceptance and no model override. It admits A to row 2, sends B out of the row loop into verify, and repairs and redispatches the seed for C, D and E with no human stop. After is slightly more explicit on two points: it says outright that the venue line is not a cut disposition, and that all six Integration entries get no row and no worker. However, it drops Before's 'no checks' for Integration entries, so the fact's 'seed check, blocker or next target' clause holds only by absence; wording that says Integration entries produce no rows, workers, checks, blockers or targets would make it robust. After also reuses `<HEAD sha>` for both the base and the post-skeleton HEAD_BEFORE and pending tuple, where Before distinguished `<HEAD0>` from `<HEAD1>`; keeping distinct placeholders would avoid a reader concluding the skeleton commit was not made before dispatch.
- seed-dispositions / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs show the same six-row skeleton (AC1, AC2 and AC6 open with empty evidence and zero attempts, AC3-5 cut with their deviates/deferred/elsewhere reasons, and the venue annotation neither cutting AC6 nor adding a prerequisite), both keep every Integration entry out of rows, workers, checks and targets, both stamp and commit the skeleton before starting implement and dispatch the seed to a fresh foreground loop-implementer in the same checkout with file-only output, none acceptance and no model override, and both admit A (next target row 2) and B (exit to verify) while routing C, D and E to seed repair and redispatch at 1 of 4 with no human stop. After is slightly more explicit on two points: it states that no Integration entry receives a 'check' and adds a consolidated redispatch section. One wording risk in After is defining `W` as `<scratch>` rather than the home implementation worktree; a reader could confuse the checkout with the scratch folder, so keep Before's 'absolute home implementation worktree' definition to protect the same-checkout part of the dispatch fact. Also keep the explicit statements that the venue annotation does not cut AC6 and that partial seeding is valid, since those carry the dispositions and admission facts.

exit: 0
