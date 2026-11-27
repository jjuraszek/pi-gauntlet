# Ledger - loop engine
**Spec:** `doc/specs/2026-11-27-gh-170-hands-free-implementation.md`
base: a734d890b0228aacb2ab38a18278394bf77d89b1
verification: npm test
checks: commands
iterations: 5
allowance: 10
returned: 4 | home | feb6f53f988b518d3fc00470e2fe2fa9c54b4d13

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 120 node --test scripts/loop-engine-contract.test.mjs; 53 passed, 0 failed; selected waves replays improved on helper-interrupted-redispatch and worker-decision-taken; selected loop replays improved on verify-repair-count and held below-allowance retry on spent-allowance-moving-or-stalled |
| 2 | done | 1 | timeout -k 30 120 node --test scripts/commit-message-contract.test.mjs; 56 passed, 0 failed; selected reading-picked, blocked-decision-auto-taken and worker-decision-taken replays improved; both spent-allowance-moving-or-stalled candidate replies routed the contradiction by permission |
| 3 | done | 1 | timeout -k 30 30 node --test scripts/loop-conformance-grant.test.mjs; 2 passed, 0 failed; selected loop, resume and waves replays distinguished progress from a stall at spent counters; verify-repair-count, scaled-cap-grant and exit-repair-capability were inconclusive on marker wording, reply parsing and blocking-call details |
| 4 | done | 1 | timeout -k 30 60 node --test scripts/loop-engine-contract.test.mjs; 54 passed, 0 failed; both models named the missing input without a menu in stop-needs-no-menu and human-stop-counts; retired-budgets and scaled-cap-grant were inconclusive on legacy wording and reply parsing |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Waves retries identified interruptions and takes in-spec recommendations; loop retries below allowance and returns approved reopened rows to implementation without asking again. | Extend the spent-allowance-moving-or-stalled loop fixture with spent-row snapshots and reuse worker-decision-taken to check the wave choice record.
row 2 done | Both engines take and record recommended in-spec choices, and loop routes an unresolved contradiction at a spent allowance through the amendment surface. | Read the choice lines defined in commit-message.md for the ship summary and extend the spent-allowance-moving-or-stalled snapshots to check retry limits.
row 3 done | Both engines now grant one more attempt at a spent counter when the failure changes or the review converges, and stop when progress stalls. | Reuse the moving and stalled snapshots in spent-allowance-moving-or-stalled and extra-round-while-converging to check what the stop tells the user.
row 4 done | When delivery stalls, both engines name the blocker and the input that would clear it without offering choices. | Reuse stop-needs-no-menu for a missing artifact and human-stop-counts to distinguish a stalled stop from a discard question.
