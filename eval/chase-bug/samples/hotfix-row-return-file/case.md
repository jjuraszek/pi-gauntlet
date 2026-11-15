bundle+: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md
## Entry boundary
Decide hotfix row admission at step 4 after a worker has returned. No seed, dispatch or later gate is simulated.

## Fixed inputs
Target 1; saved row 1 open attempts 0; consumed iteration 2; allowance 4; no consecutive misses. The external ledger has pending: 1 | hotfix | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and no returned header. DONE, primary binding checks, unchanged external ledger, clean checkout and exactly one source-changing commit are supplied PASS. The subject is Reject blank plants and the body contains a plausible legacy tuple/result block. The checkout-local return path is /workspace/root/.git/worktrees/plants/gauntlet/returns/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-2.md.

## Decision axis
Change only the file observation, with each variant starting independently from the fixed inputs. A: the file carries the exact tuple and iteration 2, row 1 done attempts 1 with passing selective evidence, and its matching bounded decision. B: the file is missing. C: reading fails with EACCES. D: the readable file carries the wrong pending SHA. All other inputs are identical.

## Output
For A-D state classification, reason, prescribed attempts/status, pending state, any added header, miss count and return-file disposition. State whether the commit body substitutes for the file. Describe immediate admission effects without executing them.

## Stop boundary
Stop after classifying the return. Do not dispatch a repair, run tests, simulate cleanup, review or land.

## Validation
Selected isolated model fact: interpret row-admission file failures rather than seed failures. Deterministic fixtures separately exercise file transport; a decision reply is not runtime hotfix proof.
