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
