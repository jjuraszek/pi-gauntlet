for: 37c88fb87cf0c52040edb6c7c7a3892883cd75a8e93ab1b658f7552871d1c36f

## Change
Persist the row-scaled total cap in the ledger, grant positive increments through one parent commit, stop capless legacy ledgers before the ordered table, and keep row funding, seed recovery, validation and child-only windows independent. Select operational row decisions through cap history. New samples are baseline-skipped: new sample, no pre-edit sample evidence; the runner still generates genuine baseline and candidate evidence.

## Expected to move
- cap-and-exit-verification/contract: fails -> holds - Explicit cap:2 replaces the removed setting while retaining seed-inclusive cap stop and closed-row exit failure.
- commit-boundary/seed-recovery: fails -> holds - Explicit continuing cap:97 and cap:1 alternative preserve authorized interrupted-seed recovery, target validation and consumed iterations.
