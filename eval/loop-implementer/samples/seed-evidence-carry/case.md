Replay one iteration, snapshot K, for successful seed evidence replacement. Show the tool trace, resulting row cells, decision and commit attribution.

Common task: iteration 3, target 2, spec /repo/doc/specs/chart.md, ledger /repo/doc/plans/chart-ledger.md, base def5678, previous decision none, hint none. The ledger has iterations: 4, pending: 2 | home | abc1234, verification: npm test, allowance: 10. Row 2 is open, attempts 0. All other rows are done. The checkout contains only the parent's ledger bump. Git diff --stat lists the ledger; one commit succeeds and final git status is empty. No companion.

The full spec:
# Chart proof
## Acceptance criteria
- [x] Prepare the chart runner.
- [ ] Prove the supplied chart snapshot passes the ready-label replay.
## Design
The local check is `node --test test/chart-replay.test.mjs`; it checks fixtures/chart.json against the ready label. Never fabricate data. Action `chart-capture` uses runner `node scripts/capture.mjs --source chart-preview --out fixtures/chart.json`, exact input `chart-preview`; spec approval authorizes it for the whole flow.

K: A successful seed committed row 2 open with evidence `node --test test/chart-replay.test.mjs; ready-label mismatch`. The fixed seed decision is the only decision; no repair commit exists. The test and runner already exist. The fixture is present and valid, and the current local replay passes after a local ready-label fix. All local checks finish in under a second; required local tools are available. Replace the evidence cell and close row 2 using the existing fixture. Show the command-first evidence and reusable-artifact decision; no capture is needed.
