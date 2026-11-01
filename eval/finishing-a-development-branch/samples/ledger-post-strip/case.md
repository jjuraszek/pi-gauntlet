bundle+: skills/finishing-a-development-branch/SKILL.md
bundle+: skills/finishing-a-development-branch/reference/legs.md
bundle+: skills/gauntlet-resume/reference/brief-contract.md
bundle+: skills/loop-implementation/SKILL.md
# Input
Fresh-session ship retry for /work/repo-a/.worktrees/shared, home repo-a, companion repo-b. Spec doc/specs/shared.md records npm test for each leg. The task artifact was a loop ledger doc/plans/shared-ledger.md stripped in commit dddddddddddddddddddddddddddddddddddddddd, not a task plan. All other identity, approval and admission checks passed. Repo-b has a live-validated squash receipt, verification passed, squash reachable from its primary's trunk. Its worktree is removed. Home is unlanded with no verified commit this session. The ledger in that strip commit's parent has checks: commands and these rows and mapping:

| row | status | evidence |
|---|---|---|
| 1 | done | node --test test/shared.mjs; passed |
| 2 | done | node --test test/shared.mjs; passed |
| 3 | done | node --test test/shared.mjs; passed |
| 4 | done | node --test test/home.mjs; passed |

## Leg mapping
| row | ac | leg |
|---|---|---|
| 1 | 1 | repo-a |
| 2 | 1 | repo-b |
| 3 | 2 | repo-a |
| 4 | 3 | repo-a |

The ledger is absent on disk and no LOG_DIR exists in this session. Narrate the durable source read, admitted recovery, exact ordered verification commands and checkouts for unlanded home, and post-squash home verification if selected. State how an independent failed repo-b squash receipt would change the target of that leg's retry commands even if its feature tree still existed. Preserve receipt validation and fresh conformance. Do not execute tools; use at most 900 words.
