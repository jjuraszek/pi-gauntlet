bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Decide whether to admit, repeat or stop a hotfix seed from the supplied attempt results. Each letter is an independent snapshot.

## Fixed inputs
Allowance 4; row 1 starts open at attempts 0. Binding checks pass. On pi the worker returned DONE with a clean checkout and one test-changing commit. Unless a variant says otherwise, the readable file matches the saved tuple and consumed iteration, returns the open row at attempts 0 with selective failing evidence, and ends with the required seed decision. The record has no dependency exception.

## Decision axis
- A. Two prior `repair seed` decisions; consumed iteration 3. The worker left no return file.
- B. Three prior `repair seed` decisions; consumed iteration 4. The worker left no return file.
- C. No prior repairs. The file returns `done` on baseline and the test passed.
- D. No prior repairs. The worktree has an uncommitted change.
- E. One prior miss committed `test/blank-name.test.mjs`. This retry's commit changes no files. Its evidence command ran that test and failed. The path exists at this dispatch's `HEAD_BEFORE`, not at `BASE_SHA`.
- F. Inline instead: neither `subagent` nor `gauntlet_setting` exists. Observe two supplied results in order. First seed: no prior repairs, clean tree, zero commits at iteration 1. Next inline seed: exactly one new test-changing commit since its own `HEAD_BEFORE`, clean tree, open row at attempts 0 and a selective evidence command that ran and failed. There is no worker, return file or model.

## Output
For each variant give only changed ledger facts and the next action. For a budget stop, quote the exhausted counter line verbatim in the form the procedure defines, without a ledger transcript. For F classify both supplied observations; state what admits the second.

## Stop boundary
Stop at each decision. Do not execute a retry or row attempt, simulate cleanup, or enter a gate or landing.

## Validation
The replay checks how the parent interprets a seed return at the allowance boundary, including terminal failures and the inline equivalent. No worker or repository operation runs.
