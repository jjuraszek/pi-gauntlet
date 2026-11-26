# eval report: loop (partial run: seed-dispositions)

for: 3d9af025ff6726499fc1b0e805dbed3a6c17a9d91d3ee6a462b5f28228050d41

wall: 0s

## Change

Select unreachable-cut to check whether a valid marker on an admitted failed target leads to an amendment, including when an older spec has no recognized disposition. A wording pin cannot show whether the driver instead redispatches the failed row. This replay narrates routing; it does not run a worker.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| seed-dispositions | anthropic/claude-opus-5-5 | unchanged | 11280 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |
| seed-dispositions | github-copilot/gpt-6.1-sol | unchanged | 11995 | dispositions: holds -> holds (held); entries: holds -> holds (intended but unchanged); dispatch: holds -> holds (held); admission: holds -> holds (held) |

## Feedback

- seed-dispositions / anthropic/claude-opus-5-5: No fact moved on this case: all four hold in both Before and After. Both outputs show the same five-row skeleton (rows 1 and 2 open with empty evidence, rows 3-5 cut with their deviates/deferred/elsewhere reasons, all attempts 0), keep every Integration entry out of the ledger, commit the skeleton before starting implement, dispatch the seed to a fresh, synchronous loop-implementer in the worktree with file-only output and acceptance level none, admit A (target row 2) and B (exit to verify), and route C, D and E to seed repair and redispatch. After is slightly more explicit in three places: it says the six Integration entries get no row, no worker and no gate pair; it states that no `model:` override is passed, where Before only omitted the parameter and noted that escalation does not apply to seed; and it calls the committed ledger the stamped skeleton. Keep those explicit sentences, since they make the entries and dispatch facts hold without relying on omission. Before already satisfied the entries fact here, so the expected fails-to-holds move for seed-dispositions/entries does not show on this case. The other two expected moves (unreachable-cut/default-row and returned-line-admission/missing-line) are not exercised by this seed-phase replay, so it gives no evidence on them either way.
- seed-dispositions / github-copilot/gpt-6.1-sol: None of the four facts moved: both outputs hold on all of them. On `entries`, Before only says that none of the six Integration bullets becomes a row, and it holds because nothing else in the text assigns, checks, blocks on or targets an Integration entry. After states this outright (no row, worker, attempt, evidence requirement or gate), which is the sturdier form, so keep that sentence. Two things in After are thinner than Before and could cost a fact on a different sample. First, After drops Before's explicit note that the `in-scope` line under AC2 leaves row 2 open without creating a row, and it never says AC1 is open by default because it has no disposition; `dispositions` now rests on the table alone. Second, After says "stage only the skeleton" where Before said "stage the stamped skeleton", so the stamping step is only implied by the `plan_check` call before the commit. Wording that names each row's disposition source and keeps the stamp, commit, then start-implement order explicit would protect `dispositions` and `dispatch`. This case does not exercise the unreachable-marker amendment route or the unsupported-ledger stop, so it shows nothing about whether the Change's intended behaviour was delivered.

exit: 0
