# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 9s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | unchanged | 3485 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | unchanged | 3724 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: Both outputs satisfy the fact: each Acceptance criteria section drafts a single unchecked `- [ ]` row marked in-scope stating that the importer names the missing required header, uses the drafted-from-design header rather than a ticket-rows-verbatim header, and places the cutover row only under Integration as a person step, not as an acceptance row. After did not move the fact; its differences are cosmetic (it drops the `id` fixture example and the trailing placement note, and stops cleanly at the authored sections, which matches the requested stop). To keep this stable, retain the wording that when all ticket rows move to Integration the acceptance rows are drafted from the design under the drafted header with no ownership question, and keep moved rows out of the Acceptance criteria section entirely.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: Both outputs draft a single unchecked in-scope acceptance row stating that the importer names the missing required header, place the cutover row only under Integration (marked as a person step), and use the drafted-from-design header rather than a ticket-rows-verbatim header, so the fact holds in both. After's row drops Before's concrete `id` example but still states the observable diagnostic ('reports the missing column by name'), which is enough for the fact. To keep this stable, retain wording that makes the all-rows-moved branch draft acceptance rows from the design's observable behavior under the drafted-from-design header, with no cutover row and no ownership question; consider encouraging the row to cite the design's concrete fixture (e.g. the omitted `id` header) so the diagnostic stays clearly tied to the committed design.

exit: 0
