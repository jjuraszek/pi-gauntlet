# eval report: gauntlet-resume (selected samples only)

No replay was run on the merged prompt.

## Earlier main replay: resume restoration

Both replay models met every candidate must-hold in the four selected samples. These are text replays of supplied observations, not live tracker evidence. The saved C1 ledger and plan read traces still bind to older resume instructions.

This is sample-scoped coverage, not a target-wide pass. The unselected samples, including `returned-line-recovery`, keep historical saved replies that this run did not rerun; they are not current passes.

| Sample | Observed behavior |
|---|---|
| [ledger-tracker-recovery](results/ledger-tracker-recovery/report.md) | Both replies used the supplied admission answer and read the recovered rows from disk without a tracker call. |
| [loop-ledger-brief](results/loop-ledger-brief/report.md) | Both replies showed the allowance on verify and ship restore before continuing verification. |
| [ledger-tracker-verify](results/ledger-tracker-verify/report.md) | Both replies preserved non-ledger tasks and handled pending verification. |
| [loop-ledger-worktree](results/loop-ledger-worktree/report.md) | Both replies paired the ledger with its spec and preserved its counters. |

## Earlier PR replay: loop-moving-row-at-allowance

This evidence predates the merged prompt.

for: 1bde0b9d65d9b6b011b3846f66169ef782a79c21dd5fef07b835193e787cdcd1

wall: 28s

This report is historical. The shared commit wording now records stand-ins; no resume sample was rerun for that change.

The saved rows below predate the commit-body wording change and were not rerun.

## Change

Compare the last two rounds at a spent counter. The selected snapshots distinguish a changed assertion or converging review from a repeated failure; they replay instructions, not live repairs.

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before tracker refresh without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations against 09c9f4e1; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| loop-moving-row-at-allowance | anthropic/claude-opus-5-5 | improved | 5124 | moving: fails -> holds (intended change) |
| loop-moving-row-at-allowance | github-copilot/gpt-6.1-sol | improved | 5033 | moving: fails -> holds (intended change) |

## Feedback

- loop-moving-row-at-allowance / anthropic/claude-opus-5-5: The spent-counter progress test in After moved the fact: After applies rule 2 at 4 of 4, compares the last two rounds, finds the evidence changed from expected header FF to expected length 3, prints the extra-attempt line for row 2, and dispatches loop-implementer with no grant, no retry decision, no allowance change, no attempt reset and no model override because the escalated marker is already spent. Before treated 4 >= 4 as an unconditional human stop and dispatched nothing, so the fact failed there. Before kept no fact that After lost, so nothing needs restoring. To keep this stable, keep the wording explicit that the changed-evidence comparison is part of rule 2 itself, that the extra attempt writes no retry decision and leaves the header allowance untouched, and that a spent escalation means the model override is omitted. One small thing to tighten: After prints the extra-attempt line with its own phrasing of the moved evidence; if the driver has an exact output format for that line, state it verbatim in the wording so the printed line does not drift.
- loop-moving-row-at-allowance / github-copilot/gpt-6.1-sol: After moved the fact by applying rule 2 at the spent counter: it prints `extra attempt for row 2: evidence changed from expected header FF to expected length 3`, dispatches the loop-implementer directly without a retry grant, `rows +N` or human stop, keeps the effective allowance at 4, leaves attempts un-reset (the child moves 4 to 5), and omits `model` because the escalated round is already spent. Before instead stopped with a `gauntlet: question`, offered retry/rows options and declared the allowance stop takes precedence over stagnation checks, so the fact failed there. To keep this result, retain wording that makes the spent-counter progress test run before the allowance stop, and that states explicitly that a moved round neither resets attempts, raises allowance, nor re-spends escalation. The After output hedges on unsupplied paths and SHAs with angle-bracket placeholders; that does not affect the fact, but if the wording can say the placeholders stand for existing run values without implying live reads were performed, it stays consistent with the Change's note that snapshots replay instructions, not live repairs.

exit: 0
