bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Decide hotfix seed admission at step 4 after a worker has returned. No dispatch or row attempt is part of this case.

## Fixed inputs
Target seed; saved row 1 open attempts 0; consumed iteration 1; allowance 4; zero prior `repair seed` lines. Dispatched tuple: pending: seed | hotfix | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. DONE, primary binding checks, unchanged external ledger, clean checkout and exactly one test-changing commit are supplied PASS. The commit subject is Capture blank plant rejection and its body contains a plausible old tuple/result block. The resolved private return path is /workspace/root/.git/worktrees/plants/gauntlet/returns/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1.md.

## Decision axis
Change only return-file presence. A: the readable file contains the exact tuple and consumed iteration, row 1 open attempts 0 with selective failing evidence, and row 0 done | seeded 1 rows, closed 0 on baseline | 1, in the required format. B: the file is missing. All other inputs are identical.

## Output
For each variant give only the changed ledger facts and the next action, including the target and hint for a redispatch. Say whether the commit body can replace the file.

## Stop boundary
Stop after the admission decision. Describe ledger changes and select the next action without executing it. Do not run a dispatch, simulate checkout cleanup or enter landing.

## Validation
Unselected model candidate for interpreting the seed-miss outcome. Deterministic checks cover the written return-file wiring and shared shell, not a full hotfix driver execution. Row admission is a separate boundary and is not exercised here. Prior seed-plus-row replies remain historical, including their errors.
