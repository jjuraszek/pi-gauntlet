# eval report: loop (partial run: clean-dispatch-skips-stop-rules)

for: af8ffbdf2772799f1fc3fc20c005dc66195cd7bbd672ec627c4ce4c371d51449

wall: 39s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| clean-dispatch-skips-stop-rules | anthropic/claude-opus-5-5 | unchanged | 5338 | dispatch: holds -> holds (held); reads: holds -> holds (held) |
| clean-dispatch-skips-stop-rules | github-copilot/gpt-6.1-sol | unchanged | 5190 | dispatch: holds -> holds (held); reads: holds -> holds (held) |

## Feedback

- clean-dispatch-skips-stop-rules / anthropic/claude-opus-5-5: Neither fact moved on this case. Both outputs dispatch row 1 with no model override, task iteration 1, ledger iterations bumped to 2 and pending set to `1 | home | aaaa…`, and both reach the dispatch without reading human-stop.md, asking the human or reporting a missing rule. After's wording delivers the Change here: the narrated reads are limited to the ledger and the scratch-folder section of return-file.md, and it explicitly states there is no stop header. One difference worth noting, though it does not affect these facts: After no longer narrates reading `driver-holds.md` or `empty-child-stagnation.md`, which Before read before the ordered table. If those reads are still intended on a clean dispatch, state explicitly that only the human-stop procedure is deferred to a stop or amendment and that the other pre-dispatch reads remain unconditional. Also keep the full 40-character HEAD in the pending line, as After does in the ledger edit; the abbreviated `aaaaaaa` in the status line is harmless only because the full value appears above it.
- clean-dispatch-skips-stop-rules / github-copilot/gpt-6.1-sol: Neither fact moved on this case: both outputs dispatch row 1 with no model override, task iteration 1, ledger iterations bumped to 2 and pending set to `1 | home | aaaa…`, and both reach the dispatch with no read of human-stop.md, no human ask and no missing-rule report. That matches the intent of the Change (no human-stop load on clean dispatch). Minor drift worth noting, though it does not affect the listed facts: After no longer narrates the reads of driver-holds.md, empty-child-stagnation.md, unreachable-returns.md and interrupted-recovery.md that Before listed, adds a conditional `git log -G'^returned: '` history inspection and a `git status --porcelain` check, and reports "attempt 1 of 4" where Before said attempts remain 0 of 4 until return admission. If those pre-dispatch reference reads are still required, keep wording that states them explicitly as held-before-dispatch while restricting only human-stop.md to stops and ledger amendments, and keep the attempt-count phrasing tied to return admission so the report cannot be read as an attempt increment at dispatch.

exit: 0
