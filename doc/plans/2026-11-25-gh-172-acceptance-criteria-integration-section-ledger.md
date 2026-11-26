# Ledger - loop engine
**Spec:** `doc/specs/2026-11-25-gh-172-acceptance-criteria-integration-section.md`
base: 5c70b98905dc9d0bbd84b43e8f41208ab8525490
verification: npm test
checks: commands
iterations: 2
allowance: 10
returned: 2 | home | 0393ac5f252b90c33c44ec943bce9bd37bab52d9

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | cut | 0 | deviates: the shared definition ships in other words - no ticket-comment clause, no required entry details, no merge-gate exception sentence; the four named places point to the one file that holds it |
| 2 | done | 1 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs conformance-reviewer post-merge-action; 2 passed; the selected eval covered only importer rejection on both models |
| 3 | open | 0 | |
| 4 | open | 0 | timeout -k 30 30 node --test scripts/ac-definition-owner.test.mjs; no shipped file contains the definition; 11 files use retired sorting terms; the delivery check does not reference ac-classes.md |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | cut | 0 | deviates: an entry is one list item in its source's words with no required details |
| 9 | cut | 0 | deviates: entries keep their source order; no timing sort |
| 10 | cut | 0 | deviates: no `not stated` placeholder; the entry reads as the source wrote it |
| 11 | cut | 0 | deviates: with no required details the gate has nothing to name |
| 12 | cut | 0 | deviates: no step reads the old heading as a second section name; an old-heading ticket section is raw input whose entries the first ticket check carries to the spec's `Integration` |
| 13 | cut | 0 | deviates: neither the pull request offer nor the merge-gate report lists entries |
| 14 | open | 0 | |
| 15 | open | 0 | |
| 16 | open | 0 | |
| 17 | cut | 0 | deviates: a note in the repository stays an acceptance row; a comment on the ticket is a tracker update and moves to `Integration` |
| 18 | cut | 0 | deviates: the row moves to `Integration` like every tracker update; the gate carries no sentence about comments |
| 19 | cut | 0 | deviates: no sample-data requirement and no not-ready filing for it |
| 20 | open | 0 | |
| 21 | open | 0 | |
| 22 | open | 0 | |
| 23 | cut | 0 | deviates: the ticket row stays word for word as the in-scope row with no environment tag and is proved by a check in the checkout; the row is also copied to `Integration` as a live check |
| 24 | cut | 0 | deviates: brainstorming asks no data question |
| 25 | cut | 0 | deviates: the row is a tracker update and moves to `Integration` |
| 26 | open | 0 | |
| 27 | open | 0 | |
| 28 | open | 0 | |
| 29 | cut | 0 | deviates: the entry is one line in the design's own words with no required details; it is written in `Integration` and not in the design text |
| 30 | cut | 0 | deviates: a ticket comment is an `Integration` entry; no step drafts, shows, posts or judges it |
| 31 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the run posts nothing |
| 32 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the review gives it no verdict |
| 33 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the merge gate reads no ticket for it |
| 34 | cut | 0 | deviates: a ticket comment is an `Integration` entry; the delivery check lists it without a verdict |
| 35 | open | 0 | |
| 36 | done | 0 | timeout -k 30 30 node scripts/delivery-stage-authoring.test.mjs conformance-reviewer post-merge-action; 2 passed; both replay models gave none of the six Integration entries a verdict or blocker |
| 37 | open | 0 | |
| 38 | open | 0 | |
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
