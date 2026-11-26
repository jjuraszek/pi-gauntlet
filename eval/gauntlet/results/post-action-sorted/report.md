# eval report: gauntlet (partial run: post-action-sorted)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 37s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 10256 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 6964 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: After moved f1 and f2 by sorting every externally fulfilled design commitment into `## Integration` in the design's own words. The `DEPLOY_TOKEN` step is now a single Integration item with the secret-store instruction indented beneath it, where Before put it in a Design `**Post-deployment housekeeping.**` paragraph. The scan-time delivery note is now an Integration entry, where Before dropped it from the spec. Nothing Before kept was lost: the two ticket rows are still copied character-for-character with `in-scope` and the `Ticket ABC-204, Acceptance Criteria, rows verbatim:` header, no row is added and no scope-cut question is asked. The release script's changelog behavior stays in Design and is tested against the fixture, and the queue drain appears only in Integration. To keep this stable, keep the wording explicit on three points: person steps, environment state and delivery notes go to Integration as separate items with sub-instructions nested under their parent; script-generated PR text stays a criterion with its Design and Tests lines; and carried ticket Integration entries come first, verbatim. One point to watch: After dropped Before's `Ticket ABC-204 entries, verbatim:` label over the carried Integration entry and paraphrased the Tests row labels instead of quoting the ticket rows. No fact here keys on either, but if you want provenance and verbatim row text to survive, say so in the wording.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section: the carried ticket entry comes first with the pause/backout lines nested beneath it, the DEPLOY_TOKEN step is one item with the secret-store instruction indented under it, and the scan-time note is an Integration entry rather than being omitted. Before failed these because it put the queue pause/drain procedure and the secret step under Design (a staging-preparation subsection and a housekeeping paragraph), declared no Integration section, and dropped the scan-time note entirely. f3 and f4 held in both: the two ticket rows are copied verbatim with in-scope dispositions and ABC-204 provenance, no row is added, no scope-cut question is asked, and Design plus Tests keep the release-script changelog behavior with the fixture comparison. To keep these, preserve the wording that sends externally fulfilled or delivery-note steps to Integration as separate items with their own nested lines intact, while leaving ticket rows untouched and generated PR-body text in Design and Tests. One thing to watch: After's Tests line for the unchanged parser entry point uses a `none:` fallback with review-only proof, where Before proposed regression tests; no fact here keys on it, but wording that states when `none` is allowed for a Design keep-unchanged constraint would stop that from drifting.

exit: 0
