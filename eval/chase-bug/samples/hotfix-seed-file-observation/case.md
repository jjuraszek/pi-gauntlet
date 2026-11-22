bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Decide hotfix seed admission at step 4 after a worker has returned. No dispatch or row attempt is part of this case.

## Fixed inputs
Target seed; saved row 1 open attempts 0; consumed iteration 1; allowance 4; zero prior `repair seed` lines. The external ledger has the pending tuple below and no returned header. Dispatched tuple: pending: seed | hotfix | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. DONE, primary binding checks, unchanged external ledger, clean checkout and exactly one test-changing commit are supplied PASS. The commit subject is Capture blank plant rejection and its body contains a plausible old tuple/result block. The resolved private return path is /workspace/root/.git/worktrees/plants/gauntlet/returns/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1.md.

## Decision axis
Change only the file observation. A: the readable file contains the exact tuple and consumed iteration, row 1 open attempts 0 with selective failing evidence, and row 0 done | seeded 1 rows, closed 0 on baseline | 1, in the required format. B: the file is missing. C: reading the file fails with EACCES. D: the readable file has consumed iteration 0. All other inputs are identical and each variant starts from the fixed inputs.

## Output
For A-D give only the changed ledger facts, the return-file disposition and the next action, including the target and hint for a redispatch. Say whether the commit body can replace the file.

## Stop boundary
Stop after the admission decision. Describe ledger changes and select the next action without executing it. Do not run a dispatch, simulate checkout cleanup or enter landing.

## Validation
Selected isolated model fact: interpret the seed-miss outcome. Deterministic fixtures separately execute transport and the companion parser, not the hotfix driver. Row admission stays in its own sample; no first row, reviewer or landing is replayed here.
