bundle+: skills/gatekeep-pr/reference/batch.md
bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gatekeep-pr/reference/menus.md
bundle-: skills/gatekeep-pr/reference/findings.md
bundle-: skills/gatekeep-pr/reference/post-selection-loop.md
bundle-: skills/gatekeep-pr/reference/cleanup.md
bundle-: skills/gatekeep-pr/reference/fix-wave.md
bundle-: skills/gatekeep-pr/reference/report.md
bundle-: skills/gatekeep-pr/reference/reject.md
bundle-: skills/brainstorming/reference/menu-layout.md
bundle-: skills/finishing-a-development-branch/reference/commit-message.md
## Arguments

Run A: `18`. Run B: no arguments. Run C: `18`. Treat the runs independently.

## Digest

Each run is on pi in the primary checkout of `acme/widgets`, at the first provisioning step. All preceding commands succeeded. The worktrees do not exist; both PRs are in-repo on different branches. Viewer `alex` has no teams. Each PR requests review from `alex`, names no ticket, and has no closing references or body. The gathered PR fields and resolved ticket displays are in memory:

| PR | Author | Size | Title | URL |
|---|---|---|---|---|
| 18 | robin | +9 -2 | Show column labels | https://github.com/acme/widgets/pull/18 |
| 35 | pat | +2 -1 | Trim blank labels | https://github.com/acme/widgets/pull/35 |

A: The single-PR digest is ready. The only earlier assistant reply text in view is `Reading the PR.` The shell output showed the gather result.

B: The set parent has admitted the discovered roster in order 35, 18. The earlier assistant reply text in view is `discovered, smallest first: 35, 18`; the two PR links appear only in shell output.

C: Same single-PR digest as A. An earlier assistant reply visible in this run reads:

**PR to gate:**
- [#18](https://github.com/acme/widgets/pull/18) +9 -2, by robin, requested from you, no ticket - show column labels

## Entry

Start each run immediately before its first provisioning command. For A, B and C, write the reply the user sees at this step, followed by the command it carries. Stop at that command; do not execute it, narrate earlier steps or continue to assessment.
