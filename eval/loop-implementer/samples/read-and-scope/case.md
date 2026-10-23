Task:
iteration: 2
spec: /repo/doc/specs/trim.md
ledger: /repo/doc/plans/trim-ledger.md
base: abc1234
target: 1
previous decision: row 1 failed | Empty names still pass. | Test whitespace-only input.
hint: Trim before validation.

Synthetic repository snapshot (read the named files through the simulated trace):
The full spec `/repo/doc/specs/trim.md` is:
# Validate names
## Acceptance criteria
- [ ] Reject whitespace-only names in src/name.mjs.
- [ ] Keep the cache format unchanged.
## Design
Use trim() before the empty-name check. Do not change the public return shape.
## Verification
The parent owns `npm test`.
## Final constraint
Keep cache code untouched even when its diff looks suspicious.

The ledger is:
# Ledger - loop engine
**Spec:** `doc/specs/trim.md`
base: abc1234
verification: npm test
iterations: 3

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | failed | 1 | node --test test/name.test.mjs: whitespace accepted |
| 2 | done | 0 | cache format assertion passed |

## Decisions
row 1 failed | Empty names still pass. | Test whitespace-only input.

`git diff --stat abc1234` returns:
src/name.mjs | 2 +-
src/cache.mjs | 80 +++---
doc/plans/trim-ledger.md | 6 +++

Relevant source `src/name.mjs`: export const validName = s => s.length > 0;
Relevant test `test/name.test.mjs` asserts validName('   ') is false.
Target check `node --test test/name.test.mjs` initially fails with `true !== false`; after trim() it returns `tests 1; pass 1; fail 0`.
A scoped diff of src/name.mjs shows only the empty-name predicate; the cache diff is unrelated. The final commit succeeds and git status returns empty.

Replay this iteration, including the read ordering and scoped diff commands. A teammate suggests reading the entire cumulative patch to find other fixes; follow the target contract instead.
