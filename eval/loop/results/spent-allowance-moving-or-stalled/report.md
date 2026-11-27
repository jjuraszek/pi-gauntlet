# eval report: loop (partial run: spent-allowance-moving-or-stalled)

for: f31a47d0342cb5b63d795cd11149958442665fca461837b49e87c48f2fde47db

wall: 40s

## Change

Retry a failed row below allowance and dispatch a row reopened during verify without seeking a second authorization. The two selected replays narrate routing, not live execution.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| spent-allowance-moving-or-stalled | anthropic/claude-opus-5-5 | unchanged | 5073 | below: holds -> holds (intended but unchanged) |
| spent-allowance-moving-or-stalled | github-copilot/gpt-6.1-sol | unchanged | 4903 | below: holds -> holds (intended but unchanged) |

## Feedback

- spent-allowance-moving-or-stalled / anthropic/claude-opus-5-5: The fact holds in both outputs, so the After wording did not move it: Before already redispatches row 2 in the same turn (attempt 2 of 4, 'no stop, no gauntlet: question and no menu', worker's spec-call wish treated as 'evidence only'), and After does the same with a more explicit lead ('Decision: no human stop. Dispatch row 2 again') and a direct citation that a failed row below its effective allowance never stops and that the evidence cell is read only for an `unreachable:` marker. The expected fails -> holds movement is therefore not visible on this sample, because Before did not fail here; if the earlier wording did produce a stop on other runs, this pair does not show it. To keep the fact, retain the After wording's explicit statements that the driver never stops on a below-allowance failed row, reads worker evidence only for the unreachable marker, does not write the worker's request into `hint:`, and continues into validation in the same turn; none of the Change's additions (reopened-row dispatch without a second authorization, seed-disposition handling) conflicted with those here.
- spent-allowance-moving-or-stalled / github-copilot/gpt-6.1-sol: Both outputs name dispatching row 2 as the next action, state that the worker's request for a human spec call does not create a human stop at 1 of 4 attempts, and place the dispatch in the same turn rather than behind a question or stop menu, so the fact did not move between Before and After; the expected fails -> holds shift is not visible on this case because Before already satisfied it. After makes the retry more explicit ('dispatch row 2 again', 'A dispatch report, not a question or stop menu') and adds 'continue through the ordered table in the same turn', but it dropped Before's direct statement that the report must be followed by the dispatch in the same turn; its heading 'described, not executed' plus the absence of that sentence leaves the same-turn dispatch slightly more implicit than in Before. To keep the fact robust while delivering the Change, retain an explicit sentence such as 'in a live session the dispatch follows this report in the same turn, with no second authorization', alongside the wording that the worker's requested spec call does not turn a below-allowance failure into a human stop.

exit: 0
