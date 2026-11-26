# eval report: gauntlet (partial run: post-action-sorted)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 11s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 9085 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 10772 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: The After wording moved f1 and f2 by routing every person-performed or non-file-produced commitment into `## Integration`. The `DEPLOY_TOKEN` step is now a single Integration item with the secret-store line indented beneath it, where Before put it in a `**Post-deployment housekeeping.**` paragraph inside Design. The scan-time note is now an Integration entry, where Before left it out of the spec entirely. Nothing Before held was lost: the two ABC-204 rows are still copied character-for-character with `in-scope` and the ticket header, no row is added and no cut question is asked, Design and Tests still carry the release script's changelog behaviour with the fixture comparison, and the queue drain appears only under Integration. To keep this stable, keep three things explicit in the wording: script-produced pull-request text stays a whole in-scope criterion; design detail for an existing Integration entry is indented under that entry, not restated as a Design imperative; and delivery-note PR text becomes an Integration entry, not a criterion, Design line or Tests line. One wording risk: the Tests lines in After paraphrase the ticket rows ("contains no files", "carries the changelog section verbatim") where Before quoted them, so if a later fact keys on Tests quoting row text, say whether Tests lines should restate the row verbatim.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section. The ticket's drain entry is carried verbatim first with the pause and resume instructions nested beneath it, the DEPLOY_TOKEN step is its own item with the secret-store line indented under it, and the scan-time note is an Integration entry. Before had put the drain and secret steps in Design and dropped the scan-time note altogether. f3 and f4 are kept: both ticket rows are copied character-for-character with `in-scope` and the ABC-204 provenance line, no row is added, no scope question is asked, and the release-script changelog behaviour stays in Design with a fixture comparison in Tests. The one fragile spot is the Design bullet "The scan-time note is a delivery obligation, not an additional output requirement...". It is a disclaimer rather than an imperative, so f2 still holds, but it puts an Integration item back into Design and a stricter reader could count it. The wording should say that a moved entry is mentioned only under `## Integration` and that Design carries no sentence about it, not even a negative one. Keep the current wording that preserves existing Integration entries first with nested lines intact and leaves ticket rows verbatim.

exit: 0
