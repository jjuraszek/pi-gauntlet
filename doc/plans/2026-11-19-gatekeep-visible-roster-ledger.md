# Ledger - loop engine
**Spec:** `doc/specs/2026-11-19-gatekeep-visible-roster.md`
base: 087d02da19b45c841a9c9c6b73819d9ace93c35e
verification: npm test
checks: commands
iterations: 5
allowance: 10
returned: 10 | home | eb4691b080122d0fc1685933e3d415cb009bae67

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
| 10 | done | 1 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed; both no-arg-discovery-single replies excluded the viewer's team-requested #85; all facts held in the single, note, over-cap, cc-multi, failed and under-cap discovery samples |
| 11 | done | 0 | timeout -k 30 30 node --test scripts/gatekeep-comment-reconcile.test.mjs; 87 passed; both no-arg-discovery-zero replies stopped with no open PRs awaiting @me's review in acme/widgets and no PR list |

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
row 10 done | No-argument discovery excludes the viewer's own PRs in the GitHub search, even when their team was asked to review. | Reuse the no-arg-discovery-single sample to check the search and handoff when the viewer's team has a review request on their own PR.
row 11 done | An empty review queue stops with the origin and viewer in the message, using @me when the login is unreadable. | Reuse the no-arg-discovery-zero sample to check the exact stop text and absence of a list.
amended | 1 item(s) | Instruction-file reads before the list
