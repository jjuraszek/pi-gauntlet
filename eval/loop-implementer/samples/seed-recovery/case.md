Task:
iteration: 1
spec: /repo/doc/specs/labels.md
ledger: /repo/doc/plans/labels-ledger.md
base: abc1234
target: seed
previous decision: none
hint: Human authorized discarding the interrupted seed and retrying seeding; keep the interrupted dispatch counted. Seed only rows 1 and 2 in this return; leave row 3 unreached.

Full spec /repo/doc/specs/labels.md:
# Labels
## Acceptance criteria
- [ ] Export 'ready' from src/label.mjs.
- [ ] Export 'active' from src/state.mjs.
- [ ] Export 'queued' from src/queue.mjs.
## Design
The first two exports already exist. Use node --test test/label.test.mjs and node --test test/state.test.mjs as the respective baseline checks. The parent runs npm test later.

Ledger /repo/doc/plans/labels-ledger.md:
# Ledger - loop engine
**Spec:** `doc/specs/labels.md`
base: abc1234
verification: npm test
checks: commands
iterations: 2
allowance: 4
pending: seed | home | abc1234

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | open | 0 | |
| 3 | open | 0 | |

## Decisions

The first seed dispatch was interrupted before committing. The human authorized discarding its uncommitted edits. No seed-evidence commit or seed decision survives. The parent retained the consumed dispatch and bumped iterations to 2 before this dispatch. The working tree contains only that header bump and pending tuple. Row 3 is outside this partial seed return; no queue source read or check result is supplied. The diff stat names only the ledger. Reading src/label.mjs shows export const label = 'ready'; reading src/state.mjs shows export const state = 'active'. Each named test passes with tests 1; pass 1; fail 0. Staging and the single commit succeed; final git status is empty.

Replay the complete seed recovery, including resulting ledger cells, exact staging and commit commands, and final reply. Do not turn it into an ordinary row iteration merely because iteration is 1.
