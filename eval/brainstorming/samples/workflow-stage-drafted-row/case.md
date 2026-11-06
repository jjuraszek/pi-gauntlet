bundle+: skills/shape-ticket/SKILL.md
replay: continuation

## Fixed observations
This is one ticketless spec-writing checkpoint at checklist step 7. Gather and both design approvals are complete. The draft, ticket-acceptance reference, and owning gate are available in context. There is no ticket and the gather sentinel is `none - no ticket`. No tools are available. No outcome has been cut and no scope question is outstanding.

The approved Design commits to exactly two behaviors:
1. The importer rejects a row without an id.
2. The importer names the offending row in its error.
The existing public `importRows` entry point stays. The existing importer error format stays; it gains the offending row's position. No baseline, target, or external yardstick is missing.

The gather draft's proof sketch for behavior 1 reads `npm test passes`; it is attached to missing-id rejection, not an independent Design commitment. The sketch for behavior 2 reads `the error names the offending row`. The draft has not authored an Acceptance criteria section yet.

The approved `## Tests` section reads:
- Full verification: `npm test`.
- Focused missing-id rejection and offending-row error cases in `test/importer.test.ts`.

Delivery notes name CI green on the PR head, pull request approval, and merge. Those are delivery stages, not additional Design commitments.

## Narrated read actions
Continue at spec-writing. Render the full `## Acceptance criteria` section you would write, including provenance and dispositions, followed by the `## Tests` section. Include any question the skill requires before writing. Do not claim live file writes or executed tests.
