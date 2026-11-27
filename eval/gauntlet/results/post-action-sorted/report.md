# eval report: gauntlet (partial run: post-action-sorted)

for: ddcbb009f7f1e1c9d3bb8b1185445141ea426e3415665e4d69479a9a0be23470

wall: 37s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | unchanged | 5896 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: holds -> holds (held) |
| post-action-sorted | github-copilot/gpt-6.1-sol | unchanged | 5424 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: holds -> holds (held) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: No fact moved on this sample: both outputs copy the two ABC-204 rows verbatim with in-scope dispositions and the provenance header, ask no question, keep the release-script changelog behavior in Design and Tests against the fixture, place the DEPLOY_TOKEN step as a single Integration item with the secret-store line nested beneath it, put the scan-time note in Integration only, and keep the queue drain out of Acceptance criteria, Design and Tests. The After wording kept this by carrying the existing Integration entry with its nested lines intact and sorting design person steps and delivery notes into Integration while leaving file-delivered PR-text behavior as a criterion; keep those explicit sorting sentences (rule 1 retaining script-generated pull-request text as a criterion, design person/environment steps and delivery notes going to Integration in the design's words with detail indented) as you extend the Change. One minor drift to watch: After rephrased the release-script Design line as 'Add: release-script behavior that writes...' and its Tests line restates the row instead of naming the verbatim comparison; both still satisfy f4, but wording that keeps the Design imperative close to the approved design sentence and the Tests line naming the fixture comparison would make that fact more robust.
- post-action-sorted / github-copilot/gpt-6.1-sol: No fact moved between Before and After. Both outputs copy the two ABC-204 rows verbatim with their in-scope dispositions and the ticket provenance line, add no row and ask no scope-cut question. Both keep the DEPLOY_TOKEN step as one Integration item with the secret-store instruction nested beneath it, and both place the scan-time note in Integration only. Both retain the release-script changelog behavior in Design and Tests against the fixture, and both keep the queue drain out of Acceptance criteria, Design and Tests. The After wording therefore delivers the sorting behavior without losing anything Before kept on this case. To keep it that way, preserve the explicit statement that a script-produced pull request body stays an acceptance row while delivery-note PR text moves to Integration, and keep the instruction that nested lines travel with their Integration entry. One shared weak spot is worth watching: both outputs put two 'Verify ...' lines in Design that describe test method, and both flag an unmapped compatibility constraint. Neither affects these facts, but wording that keeps proof method in Tests only would reduce the risk of an Integration or proof item leaking into Design on other samples.

exit: 0
