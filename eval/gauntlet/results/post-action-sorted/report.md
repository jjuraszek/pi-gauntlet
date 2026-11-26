# eval report: gauntlet (partial run: post-action-sorted)

for: 3d7454537b84f928bf924616459ed97b217ba48955a87657fe5c254e2432609f

wall: 31s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Apply the existing ownership question and no-member stop only to groups with surviving acceptance rows. When all rows move to Integration, draft acceptance rows from the design without an ownership question. `group-all-rows-sorted` checks the ownership decision before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | improved | 6254 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: holds -> holds (held); entry: fails -> holds (unplanned improvement) |
| post-action-sorted | github-copilot/gpt-6.1-sol | improved | 6354 | f1: fails -> holds (intended change); f2: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged); drain: fails -> holds (unplanned improvement); entry: fails -> holds (unplanned improvement) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: After moved f1 and f2 by building `## Integration` from three sources: the DEPLOY_TOKEN step now appears as its own Integration item with the staging secret-store instruction indented beneath it (Before put it in a `**Post-deployment housekeeping.**` paragraph inside Design, merged into one sentence), and the scan-time note is now an Integration entry (Before omitted it from the spec entirely, so it was not an Integration entry). The release-script changelog behavior stayed in Acceptance criteria, Design and Tests in both, the two ticket rows are copied verbatim with `in-scope` dispositions and the Ticket ABC-204 header in both, and neither output puts the queue drain in Acceptance criteria, Design or Tests, so f3, f4 and drain are unchanged. To keep these stable, keep the wording that says design commitments fulfilled outside the delivered files become Integration entries in the design's words with their detail lines indented under the entry, and that script-produced PR text stays a criterion. Two things in After are worth tightening although they moved no fact here: Design lists the same work twice (bolded bullets and then a `Remove:`/`Add:` recap), and an empty `## Errors and edge cases` placeholder with a stage note was emitted; wording that asks for one imperative list and omits sections with no content would avoid that drift.
- post-action-sorted / github-copilot/gpt-6.1-sol: After moved f1, f2 and drain by rendering a real `## Integration` section: the ticket's drain entry is carried first with the pause/resume lines nested under it, the DEPLOY_TOKEN step is its own item with the secret-store instruction indented beneath, and the scan-time note is an Integration entry rather than being dropped (Before omitted it entirely, put the drain procedure under a Design `Staging preparation` subsection, and folded the secret step into a Design housekeeping paragraph with the store instruction merged into the same sentence). f3 and f4 held in both: the two ticket rows are copied character-for-character with `in-scope` and the ABC-204 provenance line, no row is added, no scope-cut question is asked, and Design plus Tests keep the release-script changelog behavior and the fixture comparison. To keep this stable, keep wording that tells the writer to route operator and post-merge steps and delivery-note PR text to Integration as separate items with their supporting lines nested, while leaving ticket rows verbatim and script-generated PR text in Design and Tests. One point to watch: After adds a Tests line for the preserved parser entry point and error format, a proposed test beyond the chosen tests; it breaks no fact here, but wording that limits Tests to the chosen proofs, or labels additions as proposed, would prevent drift.

exit: 0
