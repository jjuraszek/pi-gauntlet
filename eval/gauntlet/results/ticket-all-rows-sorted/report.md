# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 16s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | unchanged | 6584 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | unchanged | 4071 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: The fact did not move: both outputs draft one unchecked in-scope row saying the import names the missing required column, both keep the cutover row out of Acceptance criteria (it sits in Integration with its person-step marker), and both use the drafted-from-design header rather than a ticket-rows-verbatim one. After differs in two ways. It appends an `id` example sentence to the row, which is harmless here but edges toward putting the fixture proof in the acceptance row; keep the row to the observable behaviour and leave the fixture to Tests. It also adds trailing placement and sorting notes after the authored sections; these do not break the fact, but the continuation asked only for the sections, so wording such as 'emit only the authored sections, with no rationale or placement commentary' would keep the output tight. The all-rows-move-to-Integration behaviour (draft from the design, no ownership question, no stop) is delivered in After and was already present in Before.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: Both outputs satisfy `drafted`: each Acceptance criteria section has a single unchecked, in-scope row stating that the importer names the missing required header, has no cutover row (the cutover appears only under Integration), and uses a drafted-from-design lead-in instead of a ticket-rows-verbatim header. The only difference in After is the added clause tying the row to the local fixture ("including `id` when the fixture omits the `id` header"); this does not move the fact, but it folds a test fixture detail into the observable outcome. To keep the fact safely held, keep the wording that when all ticket rows move to Integration the acceptance rows are drafted from the design with no ownership question or stop, and consider saying that fixture specifics belong in Tests rather than in the drafted row, so the row stays a plain statement of the design's observable diagnostic.

exit: 0
