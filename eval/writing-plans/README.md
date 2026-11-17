# Writing-plans dispatch eval

This target replays planning instructions: a fresh `plan-writer` dispatch with four paths, the parent's stamping `plan_check`, one finished-plan read before `plan_tracker` init, and recovery after a parent FAIL. Child-side samples exercise the plan contract; parent-side samples drop that contract.

| Skill file | Slice |
|---|---|
| `skills/writing-plans/SKILL.md` | `## Boundaries` through (excluding) `## Red Flags` |
| `skills/writing-plans/reference/plan-contract.md` | Whole file |
| `skills/writing-plans/reference/open-questions.md` | Whole file, candidate-only |
| `skills/finishing-a-development-branch/reference/commit-message.md` | Whole file |

| Sample | Must hold |
|---|---|
| leg-checkout-by-branch | Resolve all four task path kinds and baseline commands in the companion found by branch; keep the home plan and stop when no tree holds the branch. Bundles the full writing-plans skill and shared leg reference; covers omitted and literal recorded home. |
| all-singleton-plan | Three singleton waves without Solo lines pass the parent check; ordered tracker initialization leads directly to execution without mode selection. |
| fresh-child-authors-plan | Exactly one `plan-writer` dispatch with `context: "fresh"`, `async: false`, the acceptance line, and only worktree, spec, plan and plan-contract paths; parent `plan_check` after the reply; one finished-plan read; ordered tracker init and execution handoff; no scout, plan body text or parent read of either reference. |
| parent-offers-fix-first-narrow-amend | Read `open-questions.md` before the recovery menu; name the baseline failure, offer fix-first/narrow/amend and retain the paused plan state. |
| gate-line-first | Start the user-facing recovery question with `gauntlet: question` alone on line one; retain the failure, menu and pause. |
| parent-fail-redispatches-once | After `PLAN WRITTEN` and a parent wave-file-disjointness FAIL naming tasks 1 and 2 modifying src/shared.ts at line 40, one re-dispatch carrying the verbatim FAIL lines as a `Findings:` block; no parent write or edit of the plan; the second identical FAIL stops for the human with the FAIL lines and no `plan_tracker` init. |

All inputs are synthetic. Process, commands, and record schema: eval/README.md.
