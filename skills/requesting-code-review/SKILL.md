---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

> **Related skills:** Before requesting review, verify with `/skill:verification-before-completion` that tests pass.

# Requesting Code Review

Dispatch a subagent with the code-reviewer prompt template to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code-reviewer subagent:**

Fill the template at `code-reviewer.md` in this skill directory, then dispatch a subagent with it.

**How to dispatch:**

Use the `subagent` tool with the code-reviewer template filled in. This foreground dispatch must return a terminal result before acting on review feedback:

```ts
subagent({ agent: "code-reviewer", async: false, task: "... filled template ..." })
```

**Placeholders:**
- `{WHAT_WAS_IMPLEMENTED}` - What you just built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit
- `{DESCRIPTION}` - Brief summary
- `{SCOPED_TEST_COMMANDS}` - the scoped verification commands the reviewer may run, or `none`

**Fix rounds.** A `FIX_FIRST` report triggers a fix round. A `SHIP` report dispatches nothing and ends the loop, whatever Minors it lists. `REJECT` is neither: stop and report (in SDD, per its `stop-note.md`); no fix round. When dispatched from an orchestrating skill, fixes go to `implementer` subagents (per the orchestrator's no-self-coding rule), fanned out per `dispatching-parallel-agents` "Fix fan-out" when the review's `Parallel-safe:` line certifies a `disjoint` group of ≥ 2 Critical/Moderate findings. Before fanning out, validate the review's `Parallel-safe:` line with the structural probe in `dispatching-parallel-agents` § Fix fan-out (exactly-one-line grammar check, one re-ask, then explicit sequential fallback). Sequential round (one task): the task carries the whole report; every Minor rides. Fan-out: the certificate partitions the Critical and Moderate findings; each Minor attaches once to the first task, in `Fn` order, whose ownership boundary - the union of its findings' `touched-files:` - already contains the Minor's `touched-files:`; a Minor no boundary contains is not dispatched this round, and a boundary never grows for a Minor. The implementer fixes its Minors or declines one with a stated reason. After integration and the project's test command, re-dispatch the reviewer once on the integrated delta in the foreground with top-level `async: false`; await its terminal result. A `FIX_FIRST` re-review buys one more fix round and one more foreground re-review; still `FIX_FIRST` -> escalate to the user. A `SHIP` report's Minors are not carried, with one exception: the whole-diff review's Minor finding lines go verbatim into the closure block's `whole-diff minors:` section (`verification-before-completion/reference/conformance-check.md` "Closure / conformance").

Worked example: a `FIX_FIRST` report with 1 Moderate and 3 Minors -> one implementer task holding all four findings (one actionable ID, no fan-out). A `SHIP` report with 4 Minors -> no dispatch; the loop ends.

Take the recipient stance from `receiving-code-review`: verify each finding, answer a wrong finding with evidence.

## Integration with Workflows

**Subagent-Driven Development:**
- Review after EACH task
- Catch issues before they compound
- Fix before moving to next task

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Moderate issues
- Argue with valid technical feedback

See template at: `code-reviewer.md` in this skill directory

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
