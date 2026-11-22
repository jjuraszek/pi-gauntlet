# Ledger - loop engine
**Spec:** `doc/specs/2026-11-22-chase-bug-hotfix-retry-flexibility.md`
base: c8c978b00af58e95954159235f04ae558961898c
verification: npm test
checks: commands
iterations: 6
allowance: 10
returned: 4 | home | a43ad55a14a805a5a922c37c26a5799316a4acca

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 2 | timeout -k 30 120 node --test scripts/loop-outside-return.test.mjs; 20 passed; hotfix-return-file and hotfix-seed-file-observation both improved on both replay models |
| 2 | done | 1 | timeout -k 30 30 jq -e '[.judge[].facts["seed-budget"].after] == ["holds","holds"]' eval/chase-bug/results/hotfix-seed-retry/candidate.json; true; both replay models retried the third seed miss and aborted pre-land on the fourth without another dispatch |
| 3 | done | 1 | timeout -k 30 30 jq -e '[.judge[].facts.hint.after] == ["holds","holds"]' eval/chase-bug/results/hotfix-two-miss-hint/candidate.json; true; both replay models retried consecutive misses with the latest reason and stopped at the row allowance |
| 4 | done | 1 | timeout -k 30 30 jq -e '[.judge[].facts.budget.after] == ["holds","holds"]' eval/chase-bug/results/hotfix-repair-budget/candidate.json; true; both replay models kept the first pass at 3, permitted the fourth repair and stopped before a fifth |
| 5 | done | 0 | timeout -k 30 30 jq -e '[.judge[].facts.budget.after] == ["holds","holds"]' eval/chase-bug/results/hotfix-repair-budget/candidate.json; true; both replay models selected repair-model at attempts 6 and omitted the model for the first repair and the seed |
| 6 | done | 0 | timeout -k 30 30 jq -e '[.judge[].facts.budget.after] == ["holds","holds"]' eval/chase-bug/results/hotfix-repair-budget/candidate.json; true; both exhaustion reports quoted seed 0 of 4, attempts 7, repairs 4 of 4 and all decisions in order through the final reopen |
| 7 | done | 0 | timeout -k 30 30 jq -Rse --slurpfile s eval/chase-bug/results/hotfix-seed-retry/candidate.json 'contains("write `allowance: 4`") and contains("Apply the [seed, row and repair budgets](reference/attempt-budget.md) inline") and ([$s[0].judge[].facts["seed-budget"].after] == ["holds","holds"])' skills/chase-bug/hotfix.md; true; both saved inline seed retries passed and the fallback explicitly applies all three budgets at allowance 4 |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | 1
repair row 1 | interrupted - dispatch error: github-copilot API error (429): 429 quota exceeded | iteration 2
row 1 done | A missed hotfix seed now records the reason and retries with that hint without spending a row attempt. | Extend skills/chase-bug/reference/attempt-budget.md for later budgets; the eval target already loads it.
row 2 done | A hotfix stops before landing on its last allowed seed miss and reports the count without starting another attempt. | Reuse the hotfix-seed-retry sample and saved judgments for the inline seed boundary and the seed exhaustion report.
row 3 done | Two consecutive malformed row returns now send the latest miss in the next permitted retry's hint instead of aborting. | Apply the two-miss rule in skills/chase-bug/reference/attempt-budget.md after any stage-specific repair hints.
row 4 done | A hotfix that first passes on attempt three can spend four more attempts on repairs and stops before dispatching a fifth. | Reuse the hotfix-repair-budget sample to check the first-pass marker, final repair dispatch and exhaustion report.
row 5 done | Both replay models selected the escalation model for the last permitted repair and omitted it for the first repair and seed. | nothing new to build on
row 6 done | Both exhaustion reports showed seed misses, row attempts, repairs used and every decision in ledger order through the final reopen. | nothing new to build on
row 7 done | The inline fallback retries missed seeds and applies a separate allowance of four to repairs after the first pass. | nothing new to build on
