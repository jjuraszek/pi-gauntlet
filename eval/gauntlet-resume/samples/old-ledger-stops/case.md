bundle-: skills/gauntlet-resume/reference/brief-contract.md
bundle-: skills/gauntlet-resume/reference/reconstruction.md
bundle-: skills/gauntlet-resume/reference/restore-plan.md
bundle-: skills/gauntlet-resume/reference/plan-repair.md
bundle-: skills/gauntlet-resume/reference/coordinated.md
bundle-: skills/gauntlet/commit-message.md

## Entry boundary
Override replay.md's call-table entry: each independent case starts when the supplied ledger is first read at Ledger admission, before the confirmation question or any tracker call. Do not replay entry checks or proceed to plan_check.

## Fixed inputs
Single-repository worktree /workspace/app. Discovery has paired doc/specs/plants.md with doc/plans/plants-ledger.md by its path-only Spec header. Both files exist and are readable. The spec is approved and uses the loop engine. The worktree is clean. No brief, legs block, pending work or missing-file retry applies. No tracker call has occurred.

A. The complete supplied ledger is:

```markdown
# Ledger - loop engine
**Spec:** doc/specs/plants.md
base: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
verification: node --test plants.test.mjs
checks: commands
iterations: 1
allowance: 4

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |

## Decisions
```

B. Independently, the supplied ledger has the same bytes as A except that `allowance: 4` is replaced by `cap: 12`. It has neither an allowance line nor a returned line. A teammate suggests treating the missing headers first and adding them to continue.

## Decision axis
Choose the first ledger-admission stop for each unsupported header shape. This sample tests interpretation of ordered admission instructions, not executable ledger parsing.

## Output
For A and B separately, print only the exact stop and its recovery line.

## Stop boundary
Stop at admission, before confirmation and every tracker call. Do not write, convert, inspect commit messages, query settings, refresh, dispatch or run verification.
