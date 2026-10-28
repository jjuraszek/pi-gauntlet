# Gauntlet-resume plan repair and loop ledger eval

This target tests what resume does when `plan_check` fails during a restore: citation-only repair, the repair commit, the receipt line, the unchanged task list, and the two stop cases.

| Skill file | Slice |
|---|---|
| `skills/gauntlet-resume/SKILL.md` | `## Boundaries`, `## Post-restore continuation` |
| `skills/gauntlet-resume/reference/brief-contract.md` | `## Process-state restore` |
| `skills/gauntlet-resume/reference/reconstruction.md` | `## Candidates` onward |

Loop samples add the full resume, brief contract, and driver with `bundle+`; the brief sample also adds the handoff producer. Ledger checks stop on failure rather than entering task-plan repair.

| Sample | Must hold |
|---|---|
| quote-integrity-drift | Five `quote-integrity` literals are added to their task bodies, `plan_check` is re-run, the commit subject is `resume: plan citation repair - 5 findings`, then `skip plan`, `start implement`, `init` with the brief's list verbatim, and `Repaired plan: 5 findings (quote-integrity)` is printed. |
| verification-literal-drift | The `**Verification:**` header line gains the literal; no task body changes. |
| paths-exist-from-deleted-files | 400 dead `Modify:` rows of `complete` tasks are dropped and nothing else; no `Delete:` kind; task names and count unchanged. |
| pending-owner-stops | The reply prints `Repair stopped: paths-exist - ...` naming the `pending` owner task, states the plan is unchanged, no `init`, no commit. |
| absent-owner-stops | A `table-closure` row naming a task the plan lacks stops; no owner remap, no `init`, no commit. |
| clean-pass-unchanged | A first-check PASS prints no receipt, makes no commit, and restores as before. |
| staged-plan-stays-uncommitted | A plan with a staged edit is dirty before the loop; the repair is applied, no commit is made, the restore continues with the receipt. |

| loop-ledger-worktree | Pair by Spec header, prefer ledger, restore without task tracker, preserve iterations/retries, stop on FAIL or dirty tree. |
| loop-ledger-brief | Produce the contract-owned ledger/decision alternative and restore it without creating state. |
| loop-no-ledger | Prepare driver inputs and route Engine loop to ledger creation. |

Process, commands, and record schema: eval/README.md.

## Coordinated-flow coverage

Cover coordinated-flow membership, recorded per-leg contracts, checkout-local rules and dispatch, home-bound handoff/admission, receipt-validated delivery retries and single-member/legacy identity. Synthetic text replays narrate supplied file/tool observations; they do not prove live runtime execution. Preserve existing facts and accepted variance. New cases use per-sample bundle additions for full procedures omitted by legacy slices; legacy cases retain their original bundle selections. Runtime leg/baseline/wave validation remains in extensions/lib/plan-check.test.ts, brief drift in scripts/brief-contract-lint.test.mjs, and seal acceptance in the source and shipped CLI tests. Parent verification must run model comparisons for every affected target and gauntlet-handoff; no model evidence is generated here.

Assembly: target.json owns shared slices; new case.md files declare bundle+ selections without changing legacy cases. New coordinated cases retain the leg grammar. Full skill/procedure additions are limited to scenarios that need them. Each expected.md pins must-hold facts before replay. Run the full target at parent verification, not just new cases.
