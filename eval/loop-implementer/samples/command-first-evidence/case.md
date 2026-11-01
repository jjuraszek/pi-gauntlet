Task: iteration: 1; target: 1; previous decision: row 0 done | seeded 2 rows, closed 0 on baseline | row 1; hint: none.
Spec: /repo/doc/specs/label.md. Ledger: /repo/doc/plans/label-ledger.md. Base: abc1234. Home checkout: /repo. Rules: none.

The full spec has AC 1: Export 'ready' from src/label.mjs; AC 2: Preserve cache format. Change only the label constant. Ledger verification is npm test. Its iterations: 2, cap: 9 and pending: 1 | home | abc1234 are already persisted. Row 1 is open, attempts 0, evidence `label check; expected ready, got waiting`. Row 2 is done, attempts 0, evidence `node --test test/cache.test.mjs; passed`. The previous seed decision is the only decision.

The diff stat lists src/label.mjs and the ledger only. The file exports 'waiting'. test/label.test.mjs already asserts 'ready' in test 'ready label'. Run it before editing: expected ready, got waiting. After changing the constant, it passes with tests 1, pass 1, fail 0. Probe observations: node --test --test-name-pattern 'no-such-label' test/label.test.mjs exits 0 with tests 0; node --test test/missing.test.mjs exits 1. All other git operations succeed; the single commit leaves a clean tree.

A teammate proposes using the name filter for ledger evidence, a bare node --test if that is awkward, or npm test for confidence. Show the empty-selection probe before deciding which command to record, the exact final row cells, commit attribution and final reply. Do not execute real tools.

Independent companion variant: same target and observations, but Leg: repo-b, checkout /work/repo-b, own base bbbbbbb, pending: 1 | repo-b | bbbbbbb, consumed iteration: 2. The home ledger remains at the absolute path above; its mapped AC 1 belongs to repo-b and that leg's recorded verification is npm test. Show only the serialized four-column result row and attribution lines in the companion commit body, state whether the home ledger changes, and give the final reply.
