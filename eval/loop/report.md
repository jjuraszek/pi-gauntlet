# eval report: loop (selected samples only)

No replay was run on the merged prompt. Both replay models met every candidate must-hold in the four listed samples. These are text replays of supplied observations, not live dispatch or tracker evidence.

| Sample | Observed behavior |
|---|---|
| [tracker-boundary](results/tracker-boundary/report.md) | Both replies repaired rejected returns without a tracker call, including on resume. |
| [tracker-refresh](results/tracker-refresh/report.md) | Both replies kept the one seed call and projected the returned row before retry. |
| [tracker-verify](results/tracker-verify/report.md) | Both replies handled repair, conformance and reopened rows without an extra ledger list call. |
| [seed-dispositions](results/seed-dispositions/report.md) | Both replies seeded the acceptance rows without assigning Integration entries. |

## Earlier PR replay: spent-allowance-moving-or-stalled

This evidence predates the merged prompt.

for: 9d7fc1bb98dfbcf1cc36033c7fb72979c27265533fe21f2637b49671cfed7ac3

wall: 61s

## Change

Use the spent-allowance-moving-or-stalled snapshots to distinguish a below-allowance failure from a spent row whose contradiction has a named correction. Only the latter takes the amendment surface, following approval's permission.

Retry a failed row below allowance and dispatch a row reopened during verify without seeking a second authorization. The two selected replays narrate routing, not live execution.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spent-allowance-moving-or-stalled | anthropic/claude-opus-5-5 | unchanged | 16055 | below: holds -> holds (intended but unchanged); contradiction: holds -> holds (intended but unchanged) |
| spent-allowance-moving-or-stalled | github-copilot/gpt-6.1-sol | improved | 11168 | below: holds -> holds (intended but unchanged); contradiction: fails -> holds (intended change) |

## Feedback

- spent-allowance-moving-or-stalled / anthropic/claude-opus-5-5: Neither fact moved on this case: both outputs redispatch row 2 in the same turn at attempt 1 of 4 and explicitly refuse to treat the worker's request for a human spec call as a stop, and both handle the spent row by applying the named label correction through amendment-surface section 5 under amend permission and by asking the human with an Amend option and an amend recommendation when no permission is held. The Before output already did this, so the expected fails -> holds movement is not visible here. What After did add is clearer framing: it says outright that the driver takes the amendment surface instead of retrying, and in the no-permission stop it lists the correction as an explicit amendment item, puts Amend first and calls it the amendment menu, where Before showed the generic rule-2 stop with retry listed first and the correction only in the recommendation line. That makes the contradiction fact hold more plainly, and is worth keeping. To protect both facts, keep the explicit statement that a failed row below its effective allowance never stops and that evidence is read only for the unreachable marker, and keep the no-free-retry and repeat-guard wording after the auto-applied amendment, so the amendment route is never read as licence for another attempt.
- spent-allowance-moving-or-stalled / github-copilot/gpt-6.1-sol: Only `contradiction` moved, and only on the no-permission branch. Before made no writes and presented the correction at the ordinary allowance stop (Retry, `rows +N`, Amend, Stop, with an Amend recommendation), which is not asking through the amendment menu; After says to prepare the named amendment through the amendment surface and show its approval menu, with no edit, commit, attempt grant or dispatch. Both outputs already apply the correction through the amendment surface under auto-apply permission and then stop again without funding another attempt. `below` did not move as expected: Before already dispatched row 2 in the same turn and said the worker's request for a human spec call creates no stop, so the wording change is not what produces that behaviour here. To keep both facts, keep the explicit statement that a spent row with a named, unapplied correction goes to the amendment surface in both permission modes (apply when granted, amendment approval menu when not), and keep the plain statement that a worker's request for a spec call below allowance is not a stop. One thing to tighten: After's no-permission branch says to retain the applicable exhausted-row offers alongside the amendment menu; say the amendment surface's menu is the primary ask, so it cannot drift back to Before's allowance-stop menu with Amend as one option.

exit: 0
