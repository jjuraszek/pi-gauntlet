# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-gatekeep-fix-loop-engine.md`
base: 5cfd9d352303f7c18191c644bbe6195f2d870253
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node --test scripts/gatekeep-fix-loop-contract.test.mjs; 1 passed, 0 failed; selected loop-worker eval improved on both replay models |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | open | 0 | |
| 7 | done | 0 | node eval/run.mjs gatekeep-pr loop-worker; both replay models improved; shared context and separate pi/native tails held; partial coverage only |
| 8 | done | 0 | git diff --exit-code 5cfd9d352303f7c18191c644bbe6195f2d870253 -- agents/loop-implementer.md skills/chase-bug/hotfix.md; exit 0; both files byte-identical to base |
| 9 | open | 0 | |

## Decisions
row 0 done | seeded 2 rows, closed 1 on baseline | row 1: use scripts/gatekeep-fix-loop-contract.test.mjs to replace the file-finding dispatch.
row 1 done | Routed pi file findings and carried retries through companion loop workers with commit admission, retaining native and sync helpers. | Extend fix-wave.md Row dispatch and Admission plus eval/gatekeep-pr/samples/loop-worker for ledger creation and retry policies.
row 7 done | The selected loop-worker eval proves common worktree and scope context with separate pi and Claude Code solution and commit tails. | nothing new to build on
