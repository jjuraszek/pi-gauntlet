# eval report: gauntlet-resume (selected samples only)

Both replay models met every candidate must-hold in the four selected samples. These are text replays of supplied observations, not live tracker evidence. The saved C1 ledger and plan read traces still bind to older resume instructions.

| Sample | Observed behavior |
|---|---|
| [ledger-tracker-recovery](results/ledger-tracker-recovery/report.md) | Both replies used the supplied admission answer and read the recovered rows from disk without a tracker call. |
| [loop-ledger-brief](results/loop-ledger-brief/report.md) | Both replies showed the allowance on verify and ship restore before continuing verification. |
| [ledger-tracker-verify](results/ledger-tracker-verify/report.md) | Both replies preserved non-ledger tasks and handled pending verification. |
| [loop-ledger-worktree](results/loop-ledger-worktree/report.md) | Both replies paired the ledger with its spec and preserved its counters. |
