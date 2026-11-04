for: e1168838fb6fa50d4e26c2cb5f42e029e06fee5f268b0a3173087adea30031f1

## Change
Retain assessment-only runs without finding artifacts and the viewer's newest posted review as the bounded review baseline on a second run. Refresh prior-review-delta's delivery fixture to use loop row result commits, including P2's admitted failed attempt, instead of native open returns. No instruction behavior changes in this iteration; prior-review selection and ancestry sources remain unchanged. Selected model coverage is prior-review-delta only, including explicit no-ledger checkpoints and failed-result narration, not live admission or lifecycle recovery. Preserve earlier selected sample records and partial reports.

## Expected to move
- prior-review-delta/d23: fails -> holds - Admit the failed loop row commit instead of requiring a native open return without a commit.
