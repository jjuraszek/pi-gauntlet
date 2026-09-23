---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

> **Related skills:** Reached via the auto-chain from `/skill:brainstorming`, or via `/skill:gauntlet-resume` when a restored flow lands at the plan stage — otherwise not a direct human entry point. On completion this skill auto-invokes `/skill:subagent-driven-development`.

# Writing Plans

## Overview

Translate an approved spec into bite-sized, ordered, TDD-shaped tasks. Assume the engineer is skilled but has zero context for this codebase and limited taste — document file paths, exact commands, expected output, and test design.

DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

Before drafting the plan, check `phase_tracker({ action: "status" })`. If `plan` is already `in_progress` (a flow restored by `/skill:gauntlet-resume` arrives this way), do **not** call `start` again - a repeat `start` on the in_progress phase resets its guard ledger. Otherwise call `phase_tracker({ action: "start", phase: "plan" })`.

**Input:** an approved spec in `<project>/doc/specs/<filename>.md` — produced by `/skill:brainstorming` in this session, or restored from another session by `/skill:gauntlet-resume`. Those two are the only entry points.

**Save plans to:** the sibling `doc/plans/` directory next to the spec. The plan filename matches the spec filename exactly — same date, same ticket ID (if any), same topic slug, no `-design` suffix. The plan path is absolute under the worktree (`<abs worktree path>/doc/plans/<filename>.md`, the path reported by `using-git-worktrees`), and `plan_check({ planPath })` receives that absolute path - the tool roots its checks at the plan's own checkout, not at the session cwd.

| Spec path | Plan path |
|---|---|
| `doc/specs/2025-05-26-foo.md` | `doc/plans/2025-05-26-foo.md` |
| `doc/specs/2025-05-26-PROJ-1234-foo.md` | `doc/plans/2025-05-26-PROJ-1234-foo.md` |
| `<service>/doc/specs/<name>.md` | `<service>/doc/plans/<name>.md` |

If no spec exists, send the work back to `/skill:brainstorming`. Do not invent a plan without a spec.

## Boundaries

- Read code and docs: yes
- Write the plan to the sibling `doc/plans/` of the spec: yes
- Edit or create any other files: no
- Write implementation code: never inside this skill. After Self-Review + `phase_tracker` complete, auto-invoke `/skill:subagent-driven-development` to execute.
- Land the plan on `main`: no — the plan commit goes on the worktree branch (same branch as the spec)
- Edit the approved spec: only via brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec)

## Scope Check

Before writing the plan, check the spec one more time:

- Does an intermediate state need to be **independently deployable**, under a deploy topology documented in the gauntlet overrides file's `## Deployment` section? Fail closed: undocumented or monolithic topology -> no deployment-driven split.
- Is there a **review-risk isolation** reason to land part separately (e.g. a large mechanical rename apart from the behavior change that motivated it)?

If yes, decompose into separate plans, executed in order, and state the split and its reason in the handoff message. No approval prompt.

Otherwise one plan. Service, contract, or schema count is not a split signal - one concern routinely spans several. The concern test itself lives in `../shape-ticket/reference/split-axes.md` (resolve the path against this skill's own directory) and was applied upstream at spec time; plans do not re-litigate it. A single plan should land in one PR worth of work.

## Recon (mandatory)

Before mapping files, dispatch a scout to build the implementation map. Foreground, no announcement, no user interaction. The task template below is fixed — fill exactly **one** variable, the absolute spec path; compose nothing else:

```
subagent({ agent: "scout", context: "fresh", async: false, cwd: "<abs worktree path>",
  phase: "plan-recon", output: "<abs plan path — same filename as the spec, per the table above>",
  task: <the fixed template below, with the spec path filled> })
```

> Recon for implementation planning. Read the approved spec at `<abs spec path>` - it is the single source of truth for what is being built. Also read the repo's `AGENTS.md` and, if present, the gauntlet overrides file (checked in order: `.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`, `doc/gauntlet-overrides.md` at the repo root) for conventions. Build an implementation map for the spec: exact file paths to create/modify/delete; existing call sites and tests with line ranges; conventions and patterns the plan must match; the project's test runner and the exact scoped-invocation form for running individual test files (derived from the repo's Makefile/bin/config and the overrides file); the style/lint and auto-format commands in both scoped per-file form and repo-wide form (same sources); separately, the full-suite verification entrypoint and whether it bundles style/format checks. When the overrides file has a `## Happy path` section, copy its table verbatim into your report under a `## Happy path` heading. Flag any spec claim that contradicts the code. Read-only recon: do not edit any file except writing your report to your output path. Start your report with the line `# CONTEXT DRAFT - NOT A PLAN - fully replaced at plan-writing` verbatim. End with an "Open questions that matter for the plan" section. Compact handoff, not a dump.

Consumption:

- `Read` the draft at the plan path before mapping files — the on-disk copy is canonical (prune-proof, restart-proof).
- The draft is a helper, not a fence: verify load-bearing claims against real code before planning against them.
- Plan-writing is a **full-replacement `write`** at the same path. Re-read the draft in the same turn immediately before the overwrite. After the write, confirm line 1 is no longer the draft marker before self-review and handoff.
- **Degradation:** the scout failed when its task errored or the output file is missing or empty. Proceed from your own reads with a one-line note; never block. If the file is absent, no marker check applies at the overwrite.
- **Re-entry:** re-dispatching recon overwrites whatever the plan path holds — including a committed prior plan (recoverable from git history) or an uncommitted one (destroyed). Re-planning is a deliberate overwrite.

## File Structure

**Before drafting tasks, map the files.**

List the files this implementation will create, modify, or delete. Group by component. This forces the design decisions out of the task list and into a single review surface.

**Happy-path row selection.** When the recon report carries a `## Happy path` table, match the union of every task's `Files:` paths against the table's `Paths` prefixes (a path is inside a row when it starts with one of the row's prefixes). Two or more non-`cross-cutting` rows matched, or a path inside the `cross-cutting` row's own `Paths` and inside no other row's -> the `cross-cutting` row (no such row -> no line); this takes precedence. Otherwise exactly one non-`cross-cutting` row matched -> that row. No row matched, or no table -> no line. The selected row becomes the header's `**Happy path:**` line (below); the parent re-derives the row from the real diff at verify time, so this is the plan-time default and the `plan_check` anchor.

```markdown
## Files

**Create:**
- `src/services/foo.py`
- `tests/services/test_foo.py`

**Modify:**
- `src/controllers/bar.rb` (add `create` action)
- `db/migrate/YYYYMMDDHHMMSS_add_baz.rb`

**Delete:**
- `src/services/legacy_foo.ts`
```

If you can't list the files, the spec isn't ready: amend or redraw per brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec).

## Wave Grouping

Group tasks into **waves** so the executor can parallelize independent work (see `subagent-driven-development` Parallel-Wave Mode). A wave is a maximal set of tasks that (a) have no ordering dependency on each other, (b) own **pairwise-disjoint files**, and (c) contend on **no shared mutable runtime resource** (same DB/schema, port, fixture file, external service, shared temp path).

- Group independent tasks into the same wave by default. A wave with one task is legal **only with a named-blocker justification**: a body line directly under the `## Wave N — <label>` header, `Solo: <reason>`, where the reason names the blocking task/wave, the contended runtime resource, or `lone remaining task` (reserved for the genuinely final unmatched task; doc-only trailing waves qualify). Category-only justifications ("dependency" with no named task) do not satisfy the rule.
- A pure dependency chain yields one task per wave — no parallelism, which is correct; each such wave carries its `Solo:` line naming the prior-wave dependency.
- Each wave after the first states its dependency on prior waves.

**File-ownership contract.** See [reference/plan-contract.md § Files](reference/plan-contract.md).

**Test contract.** Every task that creates or modifies code declares a `Test:` path and an executable `**Tests:**` command anchored to it (grammar: [reference/plan-contract.md § Tests](reference/plan-contract.md)); `- none: <category>` only when no tests apply. Anchoring is presence, not coverage. When the anchored spec names the thing under test, the task carries `- via:` naming it; a fixture path the spec names goes under `Create:`.

**Runtime-resource disjointness.** File-disjoint is necessary but not sufficient: two tasks with disjoint files that both mutate the same DB, bind the same port, or share a fixture are **not** parallel-safe and must land in different waves. The executor auto-selects parallel for *every* multi-task wave, so this grouping is the sole parallel-safety guarantee — there is no selection-time judgment downstream. No new mandatory per-task syntax; when a shared runtime resource is the reason two file-disjoint tasks sit in different waves, record it in an inline note on the later wave.

**Doc tasks.** Doc updates are real plan tasks, not an afterthought. Task-local docs (a doc that only describes the file(s) a task already touches) ride with that task. Cross-cutting or index docs (README, `AGENTS.md`, topic guides, taxonomy indexes) sequence into a dedicated trailing doc-only wave — last wave by convention, file-disjoint from every code task so the pairwise-disjoint wave contract holds.

**Doc-wave collision rule.** Amend-over-create (see `brainstorming/reference/documentation-impact.md`) concentrates edits into hub docs like README and `AGENTS.md`. A doc wave with ≥2 tasks auto-selects Parallel-Wave Mode, which requires pairwise-disjoint files — so doc tasks that land on the *same* file merge into one task rather than splitting. A single-task trailing doc wave is the expected shape, not a smell.

```markdown
## Wave 1 — Foundations

Parallel-safe: Tasks 1–3 own disjoint files (see each task's Files block).

### Task 1: ...
### Task 2: ...
### Task 3: ...

## Wave 2 — Wire-up

Solo: Task 4 depends on Wave 1 Task 1's API (named-blocker justification).

Depends on Wave 1: Task 4 consumes the API introduced by Task 1.

### Task 4: ...
```

## Bite-Sized Task Granularity

Each step is **one action, 2-5 minutes**:

- "Write the failing test" — step
- "Run it, confirm it fails" — step
- "Implement minimal code to pass" — step
- "Run tests, confirm green" — step
- "Format & lint the task's files" — step
- "Commit" — step

## Plan Document Header

```markdown
# [Feature Name] Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** [one sentence]

**Architecture:** [2-3 sentences]

**Tech Stack:** [key tech/libraries]

**Spec:** `<project>/doc/specs/<same-filename-as-this-plan>.md`

**Verification:** `<full verification command set — tests + style + format; a single bundling entrypoint, or the listed individual commands; from the recon report / project overrides>` - in a repo with per-service verification commands, list the command of every service the change affects (its own files or code it depends on; a repo-wide shared path such as root config, a lockfile, or a shared library affects every dependent service), taking the per-service commands from the overrides file or AGENTS.md when recon reports a single entrypoint
**Happy path:** <row label> - `<command from the selected row>` (~<Timeout from the row>)

**Ticket:** `<ticket-id>` (omit if none)

---
```

The full verification entrypoint appears only on the `**Verification:**` line — see [reference/plan-contract.md § Header-only entrypoint](reference/plan-contract.md). The verify phase reads it from the plan; execution runs `Tests:` commands only. Execution runs it in the worktree via the subshell form `(cd "<abs worktree path>" && <command>)`; the process cwd stays in the primary checkout, and dispatch `cwd` is the worktree path. The `**Happy path:**` line is optional: present only when File Structure selected a row, with the row label, the row's command in backticks, and the row's `Timeout` as `(~<duration>)` (omit the suffix when the cell is absent or malformed). Like `Verification`, the happy-path command appears only on this header line - never in a task's `Tests:` or `Run:` block and never as free text in wave scope; `plan_check` enforces both.

## Task Structure

Each task uses `- [ ]` checkbox steps so execution tools (and humans) can track progress.

```markdown
### Task N: [Component Name]

**TDD scenario:** [New feature — full TDD cycle | Modifying tested code — run existing tests first | Trivial change — use judgment]

**Spec:** doc/specs/<file>.md § "<heading>" L<start>-L<end>

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Tests:**
- `uv run pytest tests/exact/path/to/test.py`
- via: `function()`

- [ ] **Step 1: Write the failing test**

  ```python
  def test_specific_behavior():
      result = function(input)
      assert result == expected
  ```

- [ ] **Step 2: Run test, confirm failure**

  Run: `uv run pytest tests/path/test.py::test_name -v`
  Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

  ```python
  def function(input):
      return expected
  ```

- [ ] **Step 4: Run test, confirm pass**

  Run: `uv run pytest tests/path/test.py::test_name -v`
  Expected: PASS

- [ ] **Step 5: Format & lint the task's files**

  Run: `<scoped fmt/lint command from recon> exact/path/to/file.py tests/exact/path/to/test.py`
  Expected: no diff after re-run / 0 offenses

- [ ] **Step 6: Commit**

  ```bash
  git add tests/path/test.py src/path/file.py
  git commit -m "<imperative subject> (ref <ticket-id>)"
  ```
```

Every code task carries this step (red -> green -> fmt/lint -> commit). Doc-only tasks omit it unless the project formats Markdown.

Task commit steps use bare `git`: the implementer subagent runs with the checkout as its cwd (dispatch `cwd`, or its own worktree in Parallel-Wave Mode), so `git -C` would point at the wrong tree.

**Anchor rules.** See [reference/plan-contract.md § Spec anchors](reference/plan-contract.md). A task with no anchorable requirement omits the `**Spec:**` line and carries a mechanical-task row in `## Spec coverage` — silence is never valid.

## Spec Coverage Table

Every plan ends with a `## Spec coverage` section (grammar and example: [reference/plan-contract.md § Spec coverage table](reference/plan-contract.md)). Build it extraction-first: walk the spec top to bottom and write one row per normative requirement **before** assigning owners — every Design imperative (Add/Remove/Keep/Replace-style directives, not any fixed lexical form), every Edge-cases rule, every Acceptance criterion, every Out-of-scope entry, and every non-none Documentation-impact entry. Then assign owners, then re-walk the spec once: every normative clause has a row. From the spec's `## Acceptance criteria`, table only `in-scope` and `venue:` rows (a `venue:` row's owner is the task delivering its named enabling change); `deviates:`, `deferred:`, and `none` rows get no table row - their disposition is the record, and any obligation a `deviates:` reason adopts is already a Design clause with its own row. Two row kinds:

- **Requirement rows:** a cross-cutting requirement (decided in more than one task) lists **every** deciding task as owner, not the first. `waived: <reason>` is only for requirements the spec marks out of scope **and** that exclude work from the change. A requirement whose text carries an inline code span (`` `literal` ``) names concrete behaviour and is never waivable - it maps to a task or `Verification`. A waiver on an in-scope normative requirement is a Self-Review failure — there is no human plan-review gate to catch it downstream.
- **`Verification` owner:** only for a requirement the header command proves; grammar in the reference.
- `Happy path` is never an owner. Coverage by the happy-path run is inferred by the conformance reviewer at audit time, never declared in the plan; the checker rejects the cell under the owner-grammar reason.
- The table is plan-authoring-time only — never passed to implementer or reviewer dispatches.

## No Placeholders

Every plan failure mode:

- ❌ `# TODO: add validation` — implementer can't infer "validation" of what, against what schema, with what error message.
- ❌ `# Implement the rest of the function` — incomplete code is invalid code.
- ❌ "Add tests for edge cases" — name the edge cases.
- ❌ "Wire it up to the existing system" — give file paths and call sites.
- ❌ "Similar to Task N" — repeat the code. Implementers (and subagents with fresh context) may read tasks out of order; pointing at a sibling task is not a substitute for showing the code.
- ❌ References to types, functions, methods, or fields not defined in any task in this plan. If it shows up in Task 5, it must be introduced by Task 1–4 or already exist in the codebase (with a file:line citation).
- ❌ "Probably also need to update the docs" — either yes (which doc) or no. Docs are named plan tasks, sourced from the spec's Documentation impact section (materiality bar in `brainstorming/reference/documentation-impact.md`).
- Quote integrity and the banned-token list: [reference/plan-contract.md § Placeholders and quote integrity](reference/plan-contract.md).

If a decision is genuinely open, put it in an explicit **Open Questions** section at the top and resolve before execution starts.

## Self-Review (Before Handoff)

After drafting the plan and before announcing it complete, run the deterministic checker, then the judgment checks yourself — not a subagent dispatch.

- **Deterministic checker.** Run `plan_check({ planPath: "<abs plan path>" })` on the saved plan. Assess and fix every finding yourself (no human involvement), then re-run until it passes — a pass writes the execution stamp that implement-start verifies mechanically. If the same finding survives 3 fix rounds, convert it to an explicit Open Question and stop (the pre-existing Open-Questions halt, resolved by the human in-session — not a new gate). Findings are defined in [reference/plan-contract.md](reference/plan-contract.md).
- **Code-vs-anchor sanity.** For each task-owned requirement row, re-read the anchored spec lines and confirm the owner tasks' bodies do what they say - mechanism present, not just the quoted literal. For each `Verification` row, confirm the header command exercises the anchored requirement. Fix the task, don't annotate.
- **Type / API consistency.** Function signatures and field names that appear in multiple tasks must match exactly. The plan is its own contract — internal contradictions surface as bugs during execution.
- **Test contract.** Every code task's `Tests:` commands are anchored to its `Test:` path(s); `none:` only where no tests apply; a spec-named seam appears as `via:`, a spec-named fixture path as `Create:`.
- **Runtime-resource disjointness.** For every multi-task wave, confirm no two tasks contend on a shared mutable runtime resource (DB/schema, port, fixture, external service, shared temp path) — `Files:` overlap is checked mechanically, resource contention is not. Contention = mis-grouped wave; split or re-order before handoff.
- **Solo-reason validity.** Every single-task wave's `Solo:` line (presence is checked mechanically) must name its specific blocker — the blocking task/wave, the contended resource, or `lone remaining task`. Category-only justifications are under-justified; merge or justify before handoff.
- **Waiver authorization.** `waived: <reason>` is only for requirements the spec marks out of scope **and** that exclude work from the change. A requirement whose text carries an inline code span (`` `literal` ``) names concrete behaviour and is never waivable - it maps to a task or `Verification`. A waiver on an in-scope normative requirement is a Self-Review failure — there is no human plan-review gate to catch it downstream.
- **Verification-ownership authorization.** `Verification` on a requirement no header command exercises is a Self-Review failure.
- **Documentation-impact mapping.** Each Documentation impact entry maps to a plan task (or explicit "none").

Fix what this review finds before handoff.

## Remember

- Exact file paths always
- Complete code in plan (not "add validation")
- Plan code is guidance for the implementer, not review authority - reviewers judge the diff against the spec, never against plan snippets
- Exact commands with expected output
- Reference relevant skills
- DRY, YAGNI, TDD, frequent commits
- Group dependency-free, file-disjoint tasks into the same wave; order waves so each wave's dependencies are satisfied by earlier waves
- If the plan exceeds ~8 tasks, split into phases with checkpoints

## Execution Handoff

After saving the plan, mark the planning phase complete, then initialize `plan_tracker` once with every plan task in wave order. Name each entry `W<k>: <title>` using its containing wave and task title. This is the execution list: do not initialize it again on continuation.

```
phase_tracker({ action: "complete", phase: "plan" })
plan_tracker({ action: "init", tasks: ["W1: <title>", "W1: <title>", "W2: <title>"] })
```

Then auto-select the execution mode and proceed — no pause, no picker. The mode is a pure function of the plan's wave structure:

- **If any wave contains ≥2 tasks → Parallel-Wave Mode.** The strengthened Wave Grouping contract (files + runtime-resource disjoint) guarantees every multi-task wave is parallel-safe.
- **Otherwise (pure dependency chain, one task per wave) → Sequential Mode.**

Auto-invoke `/skill:subagent-driven-development` in this session. Do not wait for confirmation — the spec gate already happened, and the plan is a mechanical derivative. The only pauses from here are in-flight STOPs (`BLOCKED` / `NEEDS_CONTEXT`) and the end gate, both owned by the executor.

## Red Flags — STOP

- Plan contains TODO / TBD / placeholder text
- File structure section absent
- Task step is "5+ minutes of work" (split it)
- Step lists don't use `- [ ]` checkboxes
- Two tasks reference the same function with different signatures
- Self-review skipped
- About to start executing the plan yourself

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
