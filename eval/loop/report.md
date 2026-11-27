# eval report: loop (partial run: clean-dispatch-skips-stop-rules)

for: 1fd2513427d334ae0d7674d346227b8258cc94a8c3df2a2885e2df4a707d740b

wall: 40s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| clean-dispatch-skips-stop-rules | anthropic/claude-opus-5-5 | unchanged | 4639 | dispatch: holds -> holds (held); reads: holds -> holds (held) |
| clean-dispatch-skips-stop-rules | github-copilot/gpt-6.1-sol | unchanged | 4677 | dispatch: holds -> holds (held); reads: holds -> holds (held) |

## Feedback

- clean-dispatch-skips-stop-rules / anthropic/claude-opus-5-5: Neither fact moved: both outputs dispatch row 1 with no model override, send iteration: 1 in the task, bump the ledger to iterations: 2, and write pending: 1 | home | the full supplied HEAD, and both reach the dispatch with no read of human-stop.md, no human ask and no missing-rule report. The After wording therefore delivers the Change for clean dispatch without costing anything here. One difference to be aware of: After no longer narrates the reads of driver-holds.md and empty-child-stagnation.md that Before listed, and its status line abbreviates the HEAD to seven characters (the durable pending write still uses the full SHA). Neither affects these facts, but if other samples check narrated reads or the exact HEAD in human-facing output, keep wording that says which procedure files are read before dispatch and print the full supplied HEAD, while continuing to restrict human-stop.md to stops and ledger amendments.
- clean-dispatch-skips-stop-rules / github-copilot/gpt-6.1-sol: Neither fact moved: both outputs dispatch row 1 with no model override, task iteration 1, ledger iterations bumped to 2, and pending set to `1 | home | aaaaaaaa...`, and both reach the dispatch with no read of human-stop.md, no human ask and no missing-rule report (Before's 'No human stop or approval menu is required' is a statement, not a read or ask). The After wording delivers the Change for this case without loss. Two side differences worth noting, though they do not affect these facts: After drops the narrated full reads of driver-holds.md, empty-child-stagnation.md, unreachable-returns.md and interrupted-recovery.md that Before listed, and adds a return-history `git log -G'^returned: '` accounting step plus committed-snapshot reads that Before did not perform; if the clean-dispatch path is meant to keep those pre-dispatch holds and avoid extra history reads, say explicitly which references must be held before a clean dispatch and that return-history accounting is only needed when prior ordinary attempts exist, while keeping the rule that human-stop.md is loaded only before a stop or ledger amendment.

exit: 0
