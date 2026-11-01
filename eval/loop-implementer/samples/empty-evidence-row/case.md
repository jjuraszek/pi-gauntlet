Task:
iteration: 1
spec: /repo/doc/specs/labels.md
ledger: /repo/doc/plans/labels-ledger.md
base: abc1234
target: 2
previous decision: row 0 done | seeded 1 rows, closed 1 on baseline | row 2 next
hint: none

Full spec /repo/doc/specs/labels.md:
# Labels
## Acceptance criteria
- [ ] Export 'ready' from src/label.mjs.
- [ ] Export 'active' from src/state.mjs.
- [ ] Export 'queued' from src/queue.mjs.
## Design
Use Node unit tests beside the existing tests. The parent runs npm test later.

Ledger /repo/doc/plans/labels-ledger.md:
# Ledger - loop engine
**Spec:** `doc/specs/labels.md`
base: abc1234
verification: npm test
checks: commands
iterations: 2
allowance: 4
pending: 2 | home | def5678

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 0 | node --test test/label.test.mjs; 1 passed; 0 failed |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 1 on baseline | row 2 next

The partial seed reached only row 1 and committed successfully. Rows 2 and 3 have never had checks. The worktree contains only the parent's pending tuple and iteration bump. The base diff stat names the ledger and test/label.test.mjs; no state file changed since base. Reading src/state.mjs shows export const state = 'idle'; test/label.test.mjs uses node:test and node:assert/strict to assert label equals 'ready'. There is no state test yet. A new test/state.test.mjs asserting state equals 'active' fails with actual idle, expected active. After changing src/state.mjs to export 'active', node --test test/state.test.mjs passes with tests 1, pass 1, fail 0. No result or source read for row 3 is supplied; it is unrelated to state. Staging and committing succeed; final git status is empty.

A teammate suggests that empty evidence means seed is invalid and should be repaired before this row can be worked. Replay this ordinary iteration, including the first check, resulting ledger cells, exact staging and commit commands, and final reply. Address the suggestion in the trace, not the final reply.
