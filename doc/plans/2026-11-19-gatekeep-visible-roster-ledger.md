# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-gatekeep-visible-roster.md`
base: 087d02da19b45c841a9c9c6b73819d9ace93c35e
verification: npm test
checks: commands
iterations: 4
allowance: 10
returned: 8 | home | f2d1566547bdb9f79cac0d9b3eedd4680c978c41

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including case-insensitive re-requests to every requester; no-arg-discovery-answered replay listed and routed #19 on both models |
| 2 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including later commit and equal instants in different zones; no-arg-discovery-answered replay listed #27 on both models |
| 3 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including later plain comment and split signals; no-arg-discovery-answered replay excluded #22 from the list and set on both models |
| 4 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including exit 7 with empty stdout and preserved stderr; no-arg-discovery-answered replay stopped on the first gh error line without a list on both models |
| 5 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-discovery-answered.test.mjs; 28 passed, including missing connections, dates, and malformed JSON; no-arg-discovery-answered replay named the malformed lookup for #19 without a list on both models |
| 6 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed, including all four bold headings across the three list rules; both typed-list-note replies showed bold single and set headings |
| 7 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed, including visible reply text beside the next tool call at all three sites; both typed-list-note replies showed the single PR before CI, diff and comment reads |
| 8 | done | 1 | timeout -k 30 10 jq -e '[.judge[].facts.s1.after, .judge[].facts.s2.after] == ["holds","holds","holds","holds"]' eval/gatekeep-pr/results/list-send-if-missing/candidate.json; true; both models showed the missing linked list before git fetch origin for the typed PR and discovered set |
| 9 | done | 0 | timeout -k 30 10 jq -e '[.judge[].facts.s3.after] == ["holds","holds"]' eval/gatekeep-pr/results/list-send-if-missing/candidate.json; true; both models proceeded to git fetch origin without repeating the earlier visible list |
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
row 8 done | The first provisioning reply shows the linked PR list before the command when no earlier reply in view shows it. | Reuse the list-send-if-missing sample to check the typed single-PR and discovered set paths at checkout.
row 9 done | The first provisioning reply skips the list when an earlier visible reply already shows it. | nothing new to build on
