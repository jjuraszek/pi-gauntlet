Task:
iteration: 1
spec: /repo/doc/specs/label.md
ledger: /repo/doc/plans/label-ledger.md
base: fed4321
target: 1
previous decision: row 0 done | seeded 1 rows, closed 0 on baseline | row 1
hint: none

Full spec /repo/doc/specs/label.md:
# Ready label
## Acceptance criteria
- [ ] Export 'ready' from src/label.mjs.
## Design
Change the constant only. Use node --test test/label.test.mjs for row evidence. The parent runs npm test later.

Ledger /repo/doc/plans/label-ledger.md:
# Ledger - loop engine
**Spec:** `doc/specs/label.md`
base: fed4321
verification: npm test
iterations: 2

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | node --test test/label.test.mjs: expected ready, got waiting |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1

The tree begins with only the parent's uncommitted iterations header bump. `git diff --stat fed4321` names test/label.test.mjs and the ledger. src/label.mjs exports 'waiting'. The existing row test fails with `expected ready, got waiting`. After the constant edit the same targeted test passes: `tests 1; pass 1; fail 0`. The only resulting modified files are src/label.mjs and the ledger. Stage succeeds, commit succeeds, and `git status --porcelain` returns empty.

Replay the complete iteration. A teammate suggests a separate code commit followed by a ledger commit and a helpful prose summary in the reply. Follow the single-commit output contract instead. Include the exact staging command, commit subject, clean-tree check, resulting target cells, appended decision, and final reply.
