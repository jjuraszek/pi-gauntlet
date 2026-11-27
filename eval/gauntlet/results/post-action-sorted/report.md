# eval report: gauntlet (partial run: post-action-sorted)

for: 3191f38ab378b94b1d2b9a3ae80c903ca709ebdda14ab2e3f63e6706a8d8f696

wall: 34s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow. Treat the pull request body's `## Integration` block as provenance only during rework scouting, without judging its entries against the diff or sorting them into keeps, changes, or dropped claims.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | unchanged | 5447 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: holds -> holds (held) |
| post-action-sorted | github-copilot/gpt-6.1-sol | unchanged | 5466 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: holds -> holds (held) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: No fact moved on this sample: both outputs copy the two ABC-204 rows character-for-character with their in-scope dispositions and provenance header, ask no scope-cut question, keep the release script's changelog-into-PR-body behavior in Design with a fixture-comparison Tests line, place the DEPLOY_TOKEN admin step as one Integration item with the secret-store instruction indented beneath it, place the scan-time note as an Integration entry only, and keep the queue drain out of Acceptance criteria, Design and Tests. After's Design adds a line stating no paid or external action is needed and uses Remove:/Add: prefixes; neither introduces the drain, the secret step or the scan time as an obligation, so they are harmless here. To keep these facts stable, preserve the wording that sends person steps and delivery-note PR text to Integration with nested lines intact while keeping script-produced PR text as a criterion, and avoid any Design phrasing that names Integration actions (even negatively, e.g. listing the drain or secret step as 'not needed') since that could be read as a Design mention of them.
- post-action-sorted / github-copilot/gpt-6.1-sol: Nothing in After moved a fact: both outputs copy the two ABC-204 rows verbatim with in-scope dispositions and provenance, add no row and ask no scope question, keep the DEPLOY_TOKEN step as one Integration item with the secret-store line nested beneath it, keep the scan-time note in Integration only, keep the release-script changelog behavior in Design with a fixture comparison in Tests, and keep the queue drain out of Acceptance criteria, Design and Tests. After differs only in adding two 'Verify ...' bullets to Design that restate the tests and in dropping the Tests line for the parser-compatibility constraint, moving that gap into narration instead; neither touches a listed fact. To keep it that way, keep the wording that says moving entries to Integration is not a scope cut, that carried Integration entries retain their nested lines verbatim, and that script-generated PR text stays a Design and Tests behavior while delivery-note PR text does not. Consider telling the writer to keep test-procedure sentences in Tests rather than as Design imperatives, and to record an uncovered Design constraint as a Tests line rather than only in narration.

exit: 0
