# eval report: gauntlet (partial run: post-action-sorted)

for: 7ed4b14c1c62dd2647376b36c81faca71bb3dc34334b58ef1d8128301e26fdb8

wall: 11s

## Change

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 10900 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 6695 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: After moved f1 and f2 by sorting every design commitment that files cannot deliver into `## Integration`. The `DEPLOY_TOKEN` step became its own item with the secret-store instruction indented beneath it, where Before put it in a Design `**Post-deployment housekeeping.**` paragraph. The scan-time note became a plain Integration entry, where Before left it out of the spec entirely. The wording that seems to drive this is the rule that design commitments sorting as person steps or pipeline results are added in the design's words, with each added detail indented under the entry it describes; keep that. Nothing Before kept was lost: the ticket rows are still copied character-for-character under the `Ticket ABC-204, Acceptance Criteria, rows verbatim:` header with `in-scope` dispositions, no row is added, no scope-cut question is asked, Design still states the release script writes the changelog section, Tests still compares the generated body to the fixture, and the drain stays out of Acceptance criteria, Design and Tests. Two things to watch. First, After's Tests lines paraphrase the row text ("after the obsolete tests are removed", "generated pull request body contains the changelog section verbatim") rather than quoting the rows; if a later fact keys on Tests lines repeating the row verbatim, say so explicitly in the wording. Second, keep the explicit statements that a script-produced PR body is a file-delivered criterion and that Integration entries get no Tests lines, since those protect f4 and drain.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section: the carried ticket entry comes first with the pause/drain and backout lines nested under it, the `DEPLOY_TOKEN` step is a single item with the secret-store instruction indented beneath it, and the scan-time note is an Integration entry rather than being dropped (Before omitted it entirely, so f2 failed there, and Before put the drain and the secret step inside Design, failing drain and f1). f3 and f4 held in both: the two ticket rows are copied verbatim with `in-scope` and the ABC-204 provenance line, no row is added, no scope-cut question is asked, and the release-script changelog behavior stays in Design with a fixture comparison in Tests. To keep these, retain the wording that sends operator and delivery steps to Integration with their nested lines intact and that keeps script-generated PR text as a Design and Tests behavior. Two things to watch: After's Design lists test artifacts as `Add:` imperatives (the fixture test and the directory check), which blurs Design and Tests, and After dropped the entry-point and error-format regression tests that Before proposed, leaving the gap to self-review; if that coverage matters, say explicitly whether preserved-behavior Design lines need a Tests line.

exit: 0
