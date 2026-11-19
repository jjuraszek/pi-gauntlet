# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-gatekeep-visible-roster.md`
base: 087d02da19b45c841a9c9c6b73819d9ace93c35e
verification: npm test
checks: commands
iterations: 3
allowance: 10
returned: 6 | home | 82c9734f03f689f9daa8a2cd77716ee44a431571

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including case-insensitive re-requests to every requester; no-arg-discovery-answered replay listed and routed #19 on both models |
| 2 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including later commit and equal instants in different zones; no-arg-discovery-answered replay listed #27 on both models |
| 3 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including later plain comment and split signals; no-arg-discovery-answered replay excluded #22 from the list and set on both models |
| 4 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including exit 7 with empty stdout and preserved stderr; no-arg-discovery-answered replay stopped on the first gh error line without a list on both models |
| 5 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including missing connections, dates, and malformed JSON; no-arg-discovery-answered replay named the malformed lookup for #19 without a list on both models |
| 6 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed, including all four bold headings across the three list rules; both typed-list-note replies showed bold single and set headings |
| 7 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed, including visible reply text beside the next tool call at all three sites; both typed-list-note replies showed the single PR before CI, diff and comment reads |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |

## Decisions
row 0 done | seeded 5 rows, closed 0 on baseline | row 1
row 1 done | Discovery lists a changes-requested PR when every outstanding requester has a pending user request. | Reuse the Review lookup fence and the no-arg-discovery-answered fixture to check verdicts and routing.
row 2 done | Discovery lists a PR whose last commit follows the latest outstanding change request, even without a re-request. | nothing new to build on
row 3 done | Discovery excludes an unanswered PR from both the list and the gated set even after the requester comments. | nothing new to build on
row 4 done | A failed review lookup stops discovery before the list and reports the first GitHub error line. | nothing new to build on
row 5 done | An unreadable review lookup stops discovery before the list and identifies the affected PR. | nothing new to build on
row 6 done | Discovered and typed PR lists use bold headings for both one PR and a set. | Reuse the four heading checks in gatekeep-comment-reconcile.test.mjs when changing list placement.
row 7 done | All three list rules put the list in visible reply text beside the next tool call. | Reuse the typed-list-note sample to check that a single PR appears before CI, diff and comment reads.
