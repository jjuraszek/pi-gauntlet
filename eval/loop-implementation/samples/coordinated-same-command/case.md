baseline-skipped: new sample, no pre-edit sample evidence

Coordinated ledger at /work/home/doc/plans/change-ledger.md, checks: commands, verification: make ci, iterations: 4, cap: 17. Held checkouts: repo-a /work/home, repo-b /work/companion. Both seeds validated, trees clean, implement complete through refresh. Spec contracts use make ci and make check, respectively. All recorded checks pass. No gate run yet.

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --test shared.test.mjs; passed |
| 2 | done | 1 | node --test shared.test.mjs; passed |
| 3 | done | 0 | test -f doc/guide.md; baseline passed |
| 4 | done | 1 | node --test shared.test.mjs; passed |
| 5 | cut | 0 | deferred: later |

## Leg mapping
| row | ac | leg |
|---|---|---|
| 1 | 1 | repo-a |
| 2 | 1 | repo-b |
| 3 | 2 | repo-a |
| 4 | 3 | repo-a |
| 5 | 4 | repo-b |

Narrate verify step 0/1, the ordered gate pairs and shell calls with logs. Explain how shared AC 1 and duplicate row 4 affect membership and which source determines ownership. Stop before reviews; do not claim live execution.
