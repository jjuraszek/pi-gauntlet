# eval report: check-delivery-batch (partial run: batch-ac-conflict-reading)

for: cc6bdf6c0b74887a557f4709f17fca5d7a43c1ed07b698349aaf56417346f743

wall: 21s

## Change

Add set-mode parent turns after one fresh parallel delivery-checker child per explicit ticket. Preserve each report and confirmation gate while showing only the current ticket, one marker and one gate per message in supplied order. Keep handoff metadata and child result lines private. The batch-one-gate-per-turn sample covers the first of three REPORT tickets. batch-decline-isolates checks that declining ticket 12 still presents ticket 15's unchanged report and independent gate. batch-approved-after-decline checks that ticket 15's completed approved write advances to ticket 18's gate with a plain delivered outcome. batch-ac-conflict-row checks the recovery marker, quoted conflicting rows and retry/skip menu without asking for a reading. batch-ac-conflict-reading checks that retry opens a separate question and waits for the typed reading. The AC-conflict reading question names its ticket with a `#### <ref>` heading. batch-closing-marker checks the final delivered=2,declined=1 marker and roster-ordered outcomes. These text samples take tool observations as inputs; they do not observe actual dispatch, reading transfer to a retry task, re-fetch, tracker writes, or cleanup.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| batch-ac-conflict-reading | anthropic/claude-opus-5-5 | improved | 16080 | wait-for-reading: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (unplanned improvement); reading-prompt: fails -> holds (unplanned improvement) |
| batch-ac-conflict-reading | github-copilot/gpt-6.1-sol | improved | 18417 | wait-for-reading: holds -> holds (held); first-line: holds -> holds (held); one-marker: holds -> holds (held); ticket-heading: fails -> holds (unplanned improvement); reading-prompt: fails -> holds (unplanned improvement) |

## Feedback

- batch-ac-conflict-reading / anthropic/claude-opus-5-5: Both outputs keep wait-for-reading: each is a separate `question` turn that asks for the reading, dispatches nothing, shows no gate, and claims no write. After tightened this further by dropping Before's lettered A/B/C options (which skirted the no-menu intent, since A and B were pre-formed readings even if not numeric) and now plainly asks the operator to type the reading under the required `#### acme/widget#12` heading, which is the right shape. Two small wording risks in After: "or skip" re-offers a menu-style choice the operator already made by replying `1`, and it drops Before's explicit assurance that no retry has been dispatched and no tracker write has occurred. Consider "Type the AC reading the retry should check against. Nothing has been dispatched or written yet." — that keeps the heading and single question turn, avoids reintroducing any option list, and still states the holding state without mentioning ticket 15 or its gate.
- batch-ac-conflict-reading / github-copilot/gpt-6.1-sol: Both outputs satisfy the fact as written, so nothing moved. Before asks which reading governs without inventing one, claiming a retry, showing a gate, or claiming a write, and its A/B/C list is lettered rather than numeric, though it edges toward a menu (and lightly paraphrases 'preserves twelve rows' as 'preserves all twelve rows'), which the Change explicitly wants to avoid in favor of a typed reading. After delivers the Change cleanly: a `#### acme/widget#12` heading, a single open question for the typed reading, no options, no sibling ticket, no status claims. If you want to keep Before's reassurance that nothing has been dispatched or written, add one neutral line such as 'Retry selected; no retry sent and no tracker write made until you supply the reading.' — that preserves the fact while keeping the question open-ended and free of any lettered or numbered list.

exit: 0
