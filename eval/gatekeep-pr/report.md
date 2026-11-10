# eval report: gatekeep-pr (partial run: post-menu-set-reply)

for: 3736c94b4b4424fa0885782867e6007f2b35451aaf8b6ffddea16273884053d8

wall: 85s

## Change

Collect terminal follow-ups in one post menu. Expand a comma-separated pick through the saved mapping, deduplicate its steps and run them in step order. Keep typed reply numbers distinct from menu row numbers. Evidence inspection changes no selection; invalid or mixed-stop picks run nothing, and a second invalid reply leaves the menu waiting without another question or question marker.

Select only post-menu-set-reply for this increment. It exercises seven independent input cases against a retained merged-PR menu: a subset, overlapping combination, typed reply, evidence inspection, stop, mixed stop and repeated out-of-range input. Only the second-invalid reply rule changes in this increment; the sample also checks the existing selection rules. Retain all other sample records as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. Batch scheduling and PR-named command resolution are not covered here.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-menu-set-reply | anthropic/claude-opus-5-5 | improved | 21419 | subset: fails -> holds (intended change); union: fails -> holds (intended change); typed-reply: holds -> holds (intended but unchanged); inspection: holds -> holds (intended but unchanged); stop: fails -> holds (intended change); mixed-stop: fails -> holds (intended change); out-of-range: fails -> holds (intended change) |
| post-menu-set-reply | github-copilot/gpt-6.1-sol | improved | 21451 | subset: fails -> holds (intended change); union: fails -> holds (intended change); typed-reply: holds -> holds (intended but unchanged); inspection: fails -> holds (intended change); stop: holds -> holds (intended but unchanged); mixed-stop: fails -> holds (intended change); out-of-range: fails -> holds (intended change) |

## Feedback

- post-menu-set-reply / anthropic/claude-opus-5-5: After delivers the Change: comma picks now settle to `gauntlet: done merged` instead of re-rendering a follow-up menu (A, B), the stop close reports the retained checkout plus every unposted payload with its command (E), the mixed-stop and first out-of-range replies each ask a single question, and the second `99` leaves the menu waiting with no new question or marker (G). Nothing that Before kept was lost: `reply 1` still selects the draft rather than row 1, and `show evidence` still re-renders the identical six-row menu with no selection change. One wording risk worth tightening: the fact asks the clarifying question to name 'the valid range 1-6', and F's question says 'rows 1-5 ... or 6 alone' rather than '1-6' literally; G's first question does say '1-6'. To make F unambiguous, phrase it as 'Reply with a row number from 1-6: one or more of rows 1-5 separated by commas, or 6 alone to stop.' Also, A and C currently show the orchestrator persisting `picked: true` and running teardown without a per-write freshness line under each step; the shared re-entry section covers it, but if a reader expects the read narrated per post, a one-line 'freshness read passes' before each command would keep that visible without adding another menu.
- post-menu-set-reply / github-copilot/gpt-6.1-sol: After moves every target fact in the intended direction and loses none that Before kept. Subset and union now expand comma picks through the saved mapping, collapse the duplicate cleanup, and run in step order before settling with no second menu; inspection re-renders the identical six-row mapping instead of swapping in the own-merge three-row template; mixed-stop and the first out-of-range reply now name the full 1-6 range; and the second 99 produces no question marker while stating the menu remains open. Note that typed-reply and stop already held in Before (Before C posted only reply 1 to thread 81, and Before E settled merged with the worktree retained), so those are preserved rather than moved. Two small refinements if you revise: in F the question 'Which option or options from 1-6 do you choose, with 6 selected only by itself?' is clear, but keeping it as a single sentence avoids any reading of two questions; and in E/A/C the 'could run now' phrasing after 'gauntlet: done merged' is fine for reporting retained payloads, but make sure it never reads as an offer or menu, e.g. 'retained payload: /tmp/gate-reply-2.md (not posted)' would keep the stop fact unambiguous while still delivering the Change.

exit: 0
