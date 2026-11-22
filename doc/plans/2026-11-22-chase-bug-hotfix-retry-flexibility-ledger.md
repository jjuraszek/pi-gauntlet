# Ledger - loop engine
**Spec:** `doc/specs/2026-11-22-chase-bug-hotfix-retry-flexibility.md`
base: c8c978b00af58e95954159235f04ae558961898c
verification: npm test
checks: commands
iterations: 5
allowance: 10
returned: 3 | home | 4e178448fbb2470e350b7a75f96d21fc57d0ce29

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | timeout -k 30 120 node --test scripts/loop-outside-return.test.mjs; 20 passed; hotfix-return-file and hotfix-seed-file-observation both improved on both replay models |
| 2 | done | 1 | timeout -k 30 30 jq -e '[.judge[].facts["seed-budget"].after] == ["holds","holds"]' eval/chase-bug/results/hotfix-seed-retry/candidate.json; true; both replay models retried the third seed miss and aborted pre-land on the fourth without another dispatch |
| 3 | done | 1 | timeout -k 30 30 jq -e '[.judge[].facts.hint.after] == ["holds","holds"]' eval/chase-bug/results/hotfix-two-miss-hint/candidate.json; true; both replay models retried consecutive misses with the latest reason and stopped at the row allowance |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | 1
repair row 1 | interrupted - dispatch error: github-copilot API error (429): 429 quota exceeded | iteration 2
row 1 done | A missed hotfix seed now records the reason and retries with that hint without spending a row attempt. | Extend skills/chase-bug/reference/attempt-budget.md for later budgets; the eval target already loads it.
row 2 done | A hotfix stops before landing on its last allowed seed miss and reports the count without starting another attempt. | Reuse the hotfix-seed-retry sample and saved judgments for the inline seed boundary and the seed exhaustion report.
row 3 done | Two consecutive malformed row returns now send the latest miss in the next permitted retry's hint instead of aborting. | Apply the two-miss rule in skills/chase-bug/reference/attempt-budget.md after any stage-specific repair hints.
