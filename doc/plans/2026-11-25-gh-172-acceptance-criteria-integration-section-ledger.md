# Ledger - loop engine
**Spec:** `doc/specs/2026-11-25-gh-172-acceptance-criteria-integration-section.md`
base: 5c70b98905dc9d0bbd84b43e8f41208ab8525490
verification: npm test
checks: commands
iterations: 10
allowance: 10
returned: 26 | home | 5e71a3b01aeda3c9c839b05eea84e0fff03ae802

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | cut | 0 | deviates: the shared definition ships in other words - no ticket-comment clause, no required entry details, no merge-gate exception sentence; the four named places point to the one file that holds it |
| 2 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs conformance-reviewer post-merge-action; 2 passed; the selected eval covered only importer rejection on both models |
| 3 | done | 1 | timeout -k 30 30 node --import ./eval/spec-council-applier/pr-description-finding.test.mjs scripts/delivery-stage-authoring.test.mjs spec-council-member non-criterion-row-flagged; 3 passed; both selected council evals kept Integration entries out of acceptance criteria on both models |
| 4 | done | 1 | timeout -k 30 30 node --test scripts/ac-definition-owner.test.mjs; 3 passed; one shipped definition, no retired sorting terms, and all three sorters reference the owner |
| 5 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs shape-ticket venue-stripped; 2 passed; both selected replays kept the 2s target and 5s baseline without staging and quoted the original in the Reporter note |
| 6 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs shape-ticket integration-sort; 2 passed; both replays kept the deploy script's production rejection row word for word |
| 7 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs shape-ticket integration-sort; 2 passed; both replays placed all five external obligations only in Integration and quoted each original in the Reporter note |
| 8 | cut | 0 | deviates: an entry is one list item in its source's words with no required details |
| 9 | cut | 0 | deviates: entries keep their source order; no timing sort |
| 10 | cut | 0 | deviates: no `not stated` placeholder; the entry reads as the source wrote it |
| 11 | cut | 0 | deviates: with no required details the gate has nothing to name |
| 12 | cut | 0 | deviates: no step reads the old heading as a second section name; an old-heading ticket section is raw input whose entries the first ticket check carries to the spec's `Integration` |
| 13 | cut | 0 | deviates: neither the pull request offer nor the merge-gate report lists entries |
| 14 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gatekeep-pr-scope post-merge-menu; 2 passed; both replays offered tagging from Integration and guide publication from the PR body |
| 15 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs shape-ticket integration-sort; 2 passed; both replays replaced the housekeeping heading with Integration and preserved both entries |
| 16 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs shape-ticket integration-sort; 2 passed; both replays kept the migration script's behavior under Acceptance Criteria and its run on live orders under Integration |
| 17 | cut | 0 | deviates: a note in the repository stays an acceptance row; a comment on the ticket is a tracker update and moves to `Integration` |
| 18 | cut | 0 | deviates: the row moves to `Integration` like every tracker update; the gate carries no sentence about comments |
| 19 | cut | 0 | deviates: no sample-data requirement and no not-ready filing for it |
| 20 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gauntlet workflow-stage-ticket-row; both replays kept the file requirements and moved seven external rows to Integration without asking; all six facts held |
| 21 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs spec-gate scope-cuts-listed; 2 passed; both gate replays listed the four moved rows once with their kinds and asked no placement question; both cached workflow-stage-ticket-row replays passed |
| 22 | done | 1 | timeout -k 30 60 node scripts/delivery-stage-authoring.test.mjs gauntlet ticket-all-rows-sorted; 2 passed; selected eval improved on both models: design-drafted diagnostic, cutover kept as a marked person step |
| 23 | cut | 0 | deviates: the ticket row stays word for word as the in-scope row with no environment tag and is proved by a check in the checkout; the row is also copied to `Integration` as a live check |
| 24 | cut | 0 | deviates: brainstorming asks no data question |
| 25 | cut | 0 | deviates: the row is a tracker update and moves to `Integration` |
| 26 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gatekeep-pr-scope integration-not-judged; both replays reported only ticket row 3 as drift, not the In Review entry; cached spec-writing, approval, council-edit and conformance checks passed |
| 27 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gauntlet workflow-stage-ticket-row; both replays carried the queue-drain entry and its indented detail word for word |
| 28 | open | 0 | |
| 29 | cut | 0 | deviates: the entry is one line in the design's own words with no required details; it is written in `Integration` and not in the design text |
| 30 | cut | 0 | deviates: a ticket comment is an `Integration` entry; no step drafts, shows, posts or judges it |
| 31 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the run posts nothing |
| 32 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the review gives it no verdict |
| 33 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the merge gate reads no ticket for it |
| 34 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the delivery check lists it without a verdict |
| 35 | open | 0 | |
| 36 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs conformance-reviewer post-merge-action; 2 passed; both replay models gave none of the six Integration entries a verdict or blocker |
| 37 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gatekeep-pr-scope integration-not-judged; both replays gave none of the six Integration entries a verdict or blocker; the missing error line number remained a gap |
| 38 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs gatekeep-pr-scope post-merge-menu; 2 passed; both replays offered only tagging from the six Integration entries, ran it once on pick and ran nothing on stop |
| 39 | open | 0 | |
| 40 | cut | 0 | deviates: the pull request body carries the whole section; the offer lists nothing above its options |
| 41 | open | 0 | |
| 42 | cut | 0 | deviates: the merge-gate report lists no entries |
| 43 | open | 0 | |
| 44 | open | 0 | |
| 45 | open | 0 | |
| 46 | cut | 0 | deviates: the review reports the unknown disposition as today; the engines add no guard and run the row as in-scope, the default for a row with no recognized disposition |
| 47 | open | 0 | |
| 48 | cut | 0 | deviates: the delivery check reads no documentation for a target; without a configured target an observable row stays `unverified: no delivery target` |
| 49 | cut | 0 | deviates: the delivery check adds no stop for a missing or ambiguous target |
| 50 | cut | 0 | deviates: the delivery check adds no stop for a missing or ambiguous target |
| 51 | cut | 0 | deviates: no target discovery exists, so there is no stop to skip; the comment row is an `Integration` entry |
| 52 | cut | 0 | deviates: no sample-data handling in the delivery check |

## Decisions

row 0 done | seeded 1 rows, closed 0 on baseline | row 4
row 2 done | Both conformance replays judged only the importer's missing-id rejection and reported no missing ticket rows. | Pass the absolute path of skills/shape-ticket/reference/ac-classes.md as AC definition: to reuse the shared sorting rule.
row 36 done | Both conformance replays gave none of the six Integration entries a verdict or a blocker. | Reuse the six entries in eval/conformance-reviewer/samples/post-merge-action/case.md to check other readers.
row 3 done | Council review and edits corrected misplaced ticket rows without adding Integration entries to acceptance criteria or reporting them missing. | Reuse the pr-description-finding fixture to check verbatim moves, ticket markers, and in-scope dispositions.
row 4 done | Ticket shaping, brainstorming and delivery use one definition; planning and merge review judge only file-delivered functionality. | Run scripts/ac-definition-owner.test.mjs to check the definition's owner, its callers and retired sorting terms.
row 5 done | Ticket repair removed staging from the latency limit and kept the original row verbatim in the Reporter note on both replay models. | Reuse the venue-stripped sample to check that removing the measurement environment preserves the target and baseline.
row 6 done | Both repair drafts kept the deploy script's production target and confirmation requirement word for word. | Reuse eval/shape-ticket/samples/integration-sort to check which environment names belong to a requirement.
row 7 done | Both drafts moved the five external obligations to Integration and quoted their original rows in the Reporter note. | nothing new to build on
row 15 done | Both drafts replaced the old housekeeping heading with Integration and kept its archive and notification entries. | nothing new to build on
row 16 done | Both drafts kept the script's status conversion as a criterion and moved the operator's run on live orders to Integration. | nothing new to build on
row 14 done | Both merge-menu replays offered the release tag from Integration alongside the guide publication requested in the PR body. | Reuse the post-merge-menu fixture to compare a merger's selected actions with a stop that runs nothing.
row 20 done | Both spec-writing replays moved operational rows to Integration and kept the whole mixed row as a criterion, copying only its staging clause. | Reuse the workflow-stage-ticket-row fixture and its six cached facts to check extraction from an unrepaired ticket.
row 27 done | Both spec-writing replays kept the ticket's queue-drain entry and its nested instruction word for word. | nothing new to build on
row 38 done | Of the six Integration entries, both replays offered only tagging, ran it once when selected, and ran no post step when the merger chose stop. | nothing new to build on
row 21 done | The approval gate lists each moved ticket row once with its kind, separate from scope cuts, without asking about the move. | Reuse the scope-cuts-listed fixture to check that the gate lists marked Integration entries and omits unmarked ones.
row 22 done | Both spec writers drafted the import diagnostic from the design when the ticket's only row was an operator cutover, and kept that step under Integration. | Reuse the ticket-all-rows-sorted fixture to check the drafted header, diagnostic and marked person step.
row 26 done | The merge gate accounts for the marked In Review entry without judging it and still reports a ticket row whose wording changed. | Reuse the integration-not-judged fixture to check ticket drift, file-delivered coverage and nested PR body claims.
row 37 done | Both merge-gate replays left all six Integration entries without a verdict or blocker and flagged the missing error line number. | nothing new to build on
