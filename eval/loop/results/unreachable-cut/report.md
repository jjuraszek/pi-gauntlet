# eval report: loop (partial run: unreachable-cut)

for: 3d9af025ff6726499fc1b0e805dbed3a6c17a9d91d3ee6a462b5f28228050d41

wall: 137s

## Change

Select unreachable-cut to check whether a valid marker on an admitted failed target leads to an amendment, including when an older spec has no recognized disposition. A wording pin cannot show whether the driver instead redispatches the failed row. This replay narrates routing; it does not run a worker.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| unreachable-cut | anthropic/claude-opus-5-5 | unchanged | 23724 | cut: holds -> holds (held); audit: holds -> holds (held); closure: holds -> holds (held); permission: holds -> holds (held); default-row: holds -> holds (intended but unchanged); answered-marker: holds -> holds (held); spent: holds -> holds (held); matching: holds -> holds (held); companion: holds -> holds (held) |
| unreachable-cut | github-copilot/gpt-6.1-sol | unchanged | 23559 | cut: holds -> holds (held); audit: holds -> holds (held); closure: holds -> holds (held); permission: holds -> holds (held); default-row: holds -> holds (intended but unchanged); answered-marker: holds -> holds (held); spent: holds -> holds (held); matching: holds -> holds (held); companion: holds -> holds (held) |

## Feedback

- unreachable-cut / anthropic/claude-opus-5-5: No fact moved on this case: every fact holds in both outputs, including default-row, which was expected to go from fails to holds. Before already routed the older spec's defaulted row 3 through the same deviates cut, kept its attempts and went on to row 4 without redispatching row 3. The only visible difference there is that Before folded the indented `venue:` line into the Out of scope entry, while After uses only the row line; the fact as written does not test that. If that entry is what the Change is meant to fix, the fact needs to name the expected entry text, or the case needs a snapshot where the defaulted row would otherwise be redispatched. Three places in After hold only by implication and could be made explicit without losing the Change. Snapshot 1 says sections 2-4 are skipped but never names section 5 as the one that applies the cut. The `rows +2` branch never states that the spent escalation is preserved. The retry and `rows +2` branches state the post-dispatch bump but not that iterations stay 8 until then. Separately, the dirty-return recovery in After sends `previous decision: none`, where Before sent the latest admitted row 3 line; no fact tests this, but it is a drift to check.
- unreachable-cut / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs satisfy all nine facts, including default-row, which was expected to go from fails to holds. Before already routes the older spec's defaulted row through snapshot 1's granted cut with the same disposition, Out of scope entry, audit and row4 continuation, so this replay does not show the regression the Change is meant to catch. The other two expected movers (seed-dispositions/entries, returned-line-admission/missing-line) are not among this case's facts and cannot be judged here. After is slightly more explicit in a few places and that wording is worth keeping: the stated 'No plan_check or plan-writer', routing 'before allowance checking', and the retry and rows +2 answers each 'resolving that admission' without re-firing the unchanged marker. After is slightly weaker in three places that the facts still tolerate: the companion artifact aftermath is conditional ('If AC2's carried text appears...'), where Before states it outright; the dirty-return branch says only 'continue to row3 through the ordered table', where Before spells out that the next dispatch carries 8 and consumes 9; and the closure line uses an em dash where the surrounding format uses a hyphen. To keep every fact safe, state the companion aftermath unconditionally as surface-required, say the same-turn row3 redispatch explicitly after repair, and keep the single spec+ledger amendment commit with the 'granted' audit and the verbatim grant sentence.

exit: 0
