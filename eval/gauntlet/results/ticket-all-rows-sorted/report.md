# eval report: gauntlet (partial run: ticket-all-rows-sorted)

for: 26d1c1f3e56ec9aa53ab90ddeed921b06ff3c19296da7ff12b5341e3cd1f9b91

wall: 12s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| ticket-all-rows-sorted | anthropic/claude-opus-5-5 | unchanged | 4351 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |
| ticket-all-rows-sorted | github-copilot/gpt-6.1-sol | unchanged | 3927 | drafted: holds -> holds (held); provenance: holds -> holds (held); moved: holds -> holds (held) |

## Feedback

- ticket-all-rows-sorted / anthropic/claude-opus-5-5: Nothing moved on the one fact: both outputs draft a single unchecked in-scope row stating that the importer names the missing required header, keep the cutover row out of Acceptance criteria (it sits under Integration as a person step), and use the 'Drafted from the design, ticket #58 has no acceptance criteria' header rather than a ticket-rows-verbatim header. After's row adds an inline example ('a file without the `id` header reports `id`'), which still reads as the observable diagnostic, but it edges fixture-specific proof into the criterion; Before kept that in Tests. To stay safe while delivering the Change, keep the wording that when all ticket rows move to Integration the acceptance rows are drafted from the design with no ownership question or stop, and state that the drafted row describes the observable behaviour only, with fixture details left to Tests, so the row cannot drift into a proof description or tempt a second row per malformed-input scenario.
- ticket-all-rows-sorted / github-copilot/gpt-6.1-sol: The fact holds in both outputs: each drafts a single unchecked, in-scope acceptance row stating that the importer names the missing required header (with the `id` fixture as the example), neither places a cutover row under Acceptance criteria (the cutover appears only under Integration as a person step), and neither uses a ticket-rows-verbatim header, instead using the 'Drafted from the design' lead-in. The After wording changed only the phrasing of the row ('names the missing column in its diagnostic' versus 'reports the missing column by name'), which moved nothing. To keep this fact stable while delivering the Change, keep the rule that when all ticket rows move to Integration the acceptance rows are drafted from the design under the drafted header without an ownership question, and keep the moved row out of the Acceptance criteria section entirely.

exit: 0
