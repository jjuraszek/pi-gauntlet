# Writing-plans dispatch eval

This target tests the parent side of the plan phase: one fresh `plan-writer` dispatch that carries the spec, plan, and worktree paths, the parent's own stamping `plan_check`, a single read before `plan_tracker` init, and the one re-dispatch on a parent FAIL.

| Skill file | Slice |
|---|---|
| `skills/writing-plans/SKILL.md` | `## Boundaries` through `## Author the plan` (the baseline arm holds `## Recon (mandatory)` in that span) |
| `skills/writing-plans/SKILL.md` | `## Execution Handoff` |

| Sample | Must hold |
|---|---|
| fresh-child-authors-plan | Exactly one `plan-writer` dispatch with `context: "fresh"`, `async: false`, the acceptance line, and the three paths in its task; `plan_check` run by the parent after the reply; the plan read once; `plan_tracker` init with the three titles in wave order; no scout dispatch and no plan body text. |
| parent-fail-redispatches-once | After `PLAN WRITTEN` and a parent FAIL, one re-dispatch carrying the verbatim FAIL lines as a `Findings:` block; no parent write or edit of the plan; the second identical FAIL stops for the human with the FAIL lines and no `plan_tracker` init. |

Process, commands, and record schema: eval/README.md.
