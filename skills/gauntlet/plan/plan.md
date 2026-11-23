
# Writing Plans

## Overview

Translate an approved spec into bite-sized, ordered, TDD-shaped tasks.

**Announce at start:** "I'm writing the implementation plan."

Before drafting the plan, check `phase_tracker({ action: "status" })`. If `plan` is already `in_progress` (a flow restored by `/skill:gauntlet-resume` arrives this way), do **not** call `start` again - a repeat `start` on the in_progress phase resets its guard ledger. Otherwise call `phase_tracker({ action: "start", phase: "plan" })`.

**Input:** an approved spec in a resolved spec dir from `gauntlet_setting({ key: "flowGuards" })` - produced by `/skill:gauntlet` in this session, or restored from another session by `/skill:gauntlet-resume`. Those two are the only entry points.

**Save plans to:** the sibling `plans/` directory next to the spec's resolved dir (`doc/specs` -> `doc/plans`, `docs/specs` -> `docs/plans`). The plan filename matches the spec filename exactly - same date, same ticket ID (if any), same topic slug, no `-design` suffix. Use the absolute plan path under the worktree (`<abs worktree path>/<sibling plans dir>/<filename>.md`, using the path reported by `../worktrees.md`), and `plan_check({ planPath })` receives that absolute path - the tool roots its checks at the plan's own checkout, not at the session cwd.

| Spec path | Plan path |
|---|---|
| `doc/specs/2025-05-26-foo.md` | `doc/plans/2025-05-26-foo.md` |
| `docs/specs/2025-05-26-foo.md` | `docs/plans/2025-05-26-foo.md` |
| `doc/specs/2025-05-26-PROJ-1234-foo.md` | `doc/plans/2025-05-26-PROJ-1234-foo.md` |
| `<service>/doc/specs/<name>.md` | `<service>/doc/plans/<name>.md` |

If no spec exists, recommend `/skill:gauntlet` and await the user's explicit choice before invoking [`/skill:gauntlet`](../SKILL.md). Do not invent a plan without a spec.

## Boundaries

- Read code and docs: yes
- Dispatch `plan-writer` to write the plan to the sibling `plans/` dir of the spec: yes; the main loop never writes it
- Edit or create any other files: no
- Write implementation code: never inside this skill.
- Commit the plan on the worktree branch (same branch as the spec) at Execution Handoff; never land it on `main`.
- Edit the approved spec: only via brainstorming's [Amending an approved spec](../SKILL.md#amending-an-approved-spec)

## Scope Check

Before writing the plan, check the spec one more time:

- Does an intermediate state need to be **independently deployable**, under a deploy topology documented in the gauntlet overrides file's `## Deployment` section? Fail closed: undocumented or monolithic topology -> no deployment-driven split.
- Is there a **review-risk isolation** reason to land part separately (e.g. a large mechanical rename apart from the behavior change that motivated it)?

If yes, decompose into separate plans, executed in order, and state the split and its reason in the handoff message. No approval prompt.

Otherwise one plan. Service, contract, or schema count is not a split signal - one concern routinely spans several. The concern test itself lives in `../../shape-ticket/reference/split-axes.md` (resolve the path against this skill's own directory) and was applied upstream at spec time; plans do not re-litigate it. A single plan should land in one PR worth of work.

## Author the plan

The main loop never writes the plan. One fresh `plan-writer` child does the recon, writes the plan at the plan path, runs `plan_check` itself, and repairs its own findings; the parent dispatches it, runs the stamping `plan_check`, and reads the finished plan once. Foreground, no announcement, no user interaction.

1. The Overview already ran `phase_tracker({ action: "start", phase: "plan" })`, or skipped it because `plan` was `in_progress`. Set the substep: `phase_tracker({ action: "substep", phase: "plan", substep: "plan-write" })`.
2. Resolve four absolute paths: the worktree (the `../worktrees.md` Step 4 value), the spec, the plan (table above), and `plan-contract.md` beside this skill - the last from the loaded skill's path in the command's skill envelope or the absolute path used to read it.
3. Entry branch. A plan file already at the plan path in a flow restored by `/skill:gauntlet-resume` is checked before anything overwrites it: skip to step 5. Otherwise dispatch:

   ```
   subagent({ agent: "plan-writer", context: "fresh", async: false, cwd: "<abs worktree path>",
     phase: "plan-write",
     acceptance: { level: "none", reason: "the parent plan_check owns acceptance" },
     task: <the fixed template below, with the four paths filled> })
   ```

   > Write the implementation plan for the approved spec. Worktree: `<abs worktree path>`. Spec: `<abs spec path>`. Plan path: `<abs plan path>`. Plan contract: `<abs path to plan-contract.md>`.

   No `output:`, no `model:` (`subagents.agentOverrides.plan-writer.model` applies when set, else the child inherits the main loop). The `acceptance` line is required: without it pi-cohort appends a structured-report contract that the child's one-line reply would fail. Fill the four paths and, when step 6 or an amendment supplies one, append a `Findings:` or `Amend:` block after the template; compose nothing else.
4. The dispatch errored, returned an async handle, or left the plan path missing or empty: stop and report. There is no parent-authored fallback.
5. `plan_check({ planPath: "<abs plan path>" })` in the parent. This is the stamping call; run it whichever line the child replied with.
6. Branch on the pair (child reply, parent check).
   - `PLAN WRITTEN` + `PASS` -> step 7.
   - `OPEN QUESTIONS` + any result -> read the section; absent or exactly `- none` takes the `PLAN WRITTEN` branch. For substantive rows, read `open-questions.md` now, before asking; unreadable -> stop with a blocking error, never reconstruct from memory.
   - `PLAN WRITTEN` + `FAIL` -> re-dispatch per step 3 with the verbatim `FAIL (...)` output as the `Findings:` block, then step 5. Once per verbatim FAIL output: the same FAIL a second time goes to the user as an open question; read `open-questions.md` now, before asking; unreadable -> stop with a blocking error, never reconstruct from memory.
   - No child reply (the step 3 entry branch on a restored plan) -> read the result as if the reply were `OPEN QUESTIONS` when the plan carries substantive Open Questions rows, else `PLAN WRITTEN` (section absent or exactly `- none`), and take that reply's branch above; a `FAIL` re-dispatch overwrites the restored plan with a repaired one.
7. Clear the substep (`phase_tracker({ action: "substep", phase: "plan", substep: null })`). Read the plan once, then `## Execution Handoff` as written below: `phase_tracker({ action: "complete", phase: "plan" })`, `plan_tracker({ action: "init", ... })` from the `W<k>: <title>` list.

The parent holds no run id and never calls `resume` or `status`; every dispatch here is `async: false`. Re-entering this section without a restored plan overwrites whatever the plan path holds - a committed prior plan (recoverable from git history) or an uncommitted one (destroyed); re-planning is a deliberate overwrite. An amendment of the approved spec after the plan exists re-enters at step 3 with an `Amend:` block (brainstorming's `reference/amendment-surface.md` section 5 owns that call).

Use `plan-contract.md` as the plan contract: `plan-writer` reads and executes it; the main loop never reads it.

## Execution Handoff

After the parent `plan_check` passes and the plan has been read once (`## Author the plan` step 7), check the plan-scoped status on the home worktree branch: `git -C "<abs home worktree>" status --porcelain -- "<home-relative plan path>"`. On empty output, skip staging and commit. On nonempty output, read [Subject, Body and Word sources](../commit-message.md), compose the plan message from the spec H1 and bound ticket, and stage and commit only the home-relative plan: `git -C "<abs home worktree>" add -- "<home-relative plan path>"` then `git -C "<abs home worktree>" commit -F - -- "<home-relative plan path>"`, supplying the composed message on stdin. Stop on any status, staging or commit failure; never stage unrelated source. Then mark the planning phase complete and initialize `plan_tracker` once with every plan task in wave order. Name each entry `W<k>: <title>` using its containing wave and task title. This is the execution list: do not initialize it again on continuation.

```
phase_tracker({ action: "complete", phase: "plan" })
plan_tracker({ action: "init", tasks: ["W1: <title>", "W1: <title>", "W2: <title>"] })
```

After `plan_tracker` initializes the tasks, read the file named by the phase tracker's `Instructions:` line. Do not wait for confirmation - the spec gate already happened, and the plan is a mechanical derivative. The only pauses from here are in-flight STOPs (`BLOCKED` / `NEEDS_CONTEXT`) and the end gate, both owned by the executor.

## Red Flags — STOP

- About to start executing the plan yourself
- A `scout` recon dispatch, or a parent `write`/`edit` on the plan path

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
