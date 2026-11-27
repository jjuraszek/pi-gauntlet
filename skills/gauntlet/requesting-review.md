> **Related skills:** Before requesting review, verify with `verify/verify.md` that tests pass.

# Requesting Code Review

Dispatch a subagent with the wave-reviewer prompt template to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- Dispatch one integrated wave review per green wave in subagent-driven development, including doc-only waves, over the integrated wave diff
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Select the review source.** For an integrated uncommitted wave, use its recorded base as `BASE_SHA` and the literal `WORKTREE` as `HEAD_SHA`; stage new deliverables before dispatch, per `wave-reviewer.md`. For the whole-diff review only, use the committed range:
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch wave-reviewer subagent:**

Fill the template at `wave-reviewer.md` in this skill directory, then dispatch a subagent with it.

**How to dispatch:**

Use the `subagent` tool with the wave-reviewer template filled in. This foreground dispatch must return a terminal result before acting on review feedback:

```ts
subagent({ agent: "wave-reviewer", async: false, task: "... filled template ..." })
```

**Placeholders:**
- `{WHAT_WAS_IMPLEMENTED}` - What you just built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit, or `WORKTREE` for an integrated uncommitted wave
- `{DESCRIPTION}` - Brief summary
- `{SCOPED_TEST_COMMANDS}` - the scoped verification commands the reviewer may run, or `none`

**Fix rounds.** A `FIX_FIRST` report triggers a fix round. A `SHIP` report dispatches nothing and ends the loop, whatever Minors it lists. `REJECT` is neither: stop and report (in the waves engine, per `implement/waves/stop-note.md`); no fix round. When dispatched from an orchestrating skill, fixes go to `implementer` subagents (per the orchestrator's no-self-coding rule), fanned out per `implement/waves/parallel-agents.md` "Fix fan-out" when the review's `Parallel-safe:` line certifies a `disjoint` group of ≥ 2 Critical/Moderate findings. Apply `implement/waves/parallel-agents.md` "Fix fan-out" source precondition first: an integrated wave before its accepted-wave commit gets one in-place repair worker, not fan-out; keep the commit after acceptance. Before fanning out, validate the review's `Parallel-safe:` line with the structural probe in `implement/waves/parallel-agents.md` § Fix fan-out (exactly-one-line grammar check, one re-ask, then explicit sequential fallback). Sequential round (one task): the task carries the whole report; every Minor rides. Fan-out: the certificate partitions the Critical and Moderate findings; each Minor attaches once to the first task, in `Fn` order, whose ownership boundary - the union of its findings' `touched-files:` - already contains the Minor's `touched-files:`; a Minor no boundary contains is not dispatched this round, and a boundary never grows for a Minor. The implementer fixes its Minors or declines one with a stated reason. After integration and the project's test command, re-dispatch the reviewer once on the integrated delta in the foreground with top-level `async: false`; await its terminal result. For every whole-diff re-review use the same whole diff, not just the integrated delta, and pass `## Previous review report (re-review trigger)` with the prior report path or, if unsaved, its text. A `FIX_FIRST` re-review buys one more fix round and one more foreground re-review. For each further `FIX_FIRST`: At this spent counter take one more round when the last round moved, and stop when it stalled; when the round before is not recoverable, take one round. Stall on an empty integrated fix diff or a re-review whose `TRAJECTORY:` is not `CONVERGING`. Stop through the calling engine (waves stop note or loop Human stop), quoting the residual findings under `Problem:` and naming the unblocking input under `Needs:`; no options. A `SHIP` report's Minors are not carried, with one exception: the whole-diff review's Minor finding lines go verbatim into the closure block's `whole-diff minors:` section (`conformance-check.md` "Closure / conformance").

Worked example: a `FIX_FIRST` report with 1 Moderate and 3 Minors -> one implementer task holding all four findings (one actionable ID, no fan-out). A `SHIP` report with 4 Minors -> no dispatch; the loop ends.

Take the recipient stance from `receiving-review.md`: verify each finding, answer a wrong finding with evidence.

## Integration with Workflows

**Subagent-Driven Development:**
- Dispatch one integrated wave review per green wave over the integrated wave diff, including doc-only waves
- Fix and re-review before the accepted-wave commit and before moving to the next wave

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Moderate issues
- Argue with valid technical feedback

See template at: `wave-reviewer.md` in this skill directory

## Project overrides

If `gauntlet.md` exists - checked in order: `.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`; first found wins - read it. Skip the read only when the file from the same repository at the same trusted revision is already in context. Apply, without a relevance judgment, these sections of `# shared`: `## issue-tracker`, `## worktrees`, `## verification`, `## cleanup`, `## siblings`, `## deployment`, `## spec-index`. Apply the block of the skill that invoked this file: inside a run the text directly under `# gauntlet`; from another skill, that skill's block. Apply nothing else from the file: no other block, no text directly under `# shared`, no other section of `# shared`.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
