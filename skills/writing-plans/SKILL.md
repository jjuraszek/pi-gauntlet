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

**Input:** an approved spec in a resolved spec dir from `gauntlet_setting({ key: "flowGuards" })` - produced by `/skill:brainstorming` in this session, or restored from another session by `/skill:gauntlet-resume`. Those two are the only entry points.

**Save plans to:** the sibling `plans/` directory next to the spec's resolved dir (`doc/specs` -> `doc/plans`, `docs/specs` -> `docs/plans`). The plan filename matches the spec filename exactly - same date, same ticket ID (if any), same topic slug, no `-design` suffix. Use the absolute plan path under the worktree (`<abs worktree path>/<sibling plans dir>/<filename>.md`, using the path reported by `using-git-worktrees`), and `plan_check({ planPath })` receives that absolute path - the tool roots its checks at the plan's own checkout, not at the session cwd.

| Spec path | Plan path |
|---|---|
| `doc/specs/2025-05-26-foo.md` | `doc/plans/2025-05-26-foo.md` |
| `docs/specs/2025-05-26-foo.md` | `docs/plans/2025-05-26-foo.md` |
| `doc/specs/2025-05-26-PROJ-1234-foo.md` | `doc/plans/2025-05-26-PROJ-1234-foo.md` |
| `<service>/doc/specs/<name>.md` | `<service>/doc/plans/<name>.md` |

If no spec exists, recommend `/skill:brainstorming` and await the user's explicit choice before invoking [`/skill:brainstorming`](../brainstorming/SKILL.md). Do not invent a plan without a spec.

## Boundaries

- Read code and docs: yes
- Dispatch `plan-writer` to write the plan to the sibling `plans/` dir of the spec: yes; the main loop never writes it
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

## Author the plan

The main loop never writes the plan. One fresh `plan-writer` child does the recon, writes the plan at the plan path, runs `plan_check` itself, and repairs its own findings; the parent dispatches it, runs the stamping `plan_check`, and reads the finished plan once. Foreground, no announcement, no user interaction.

1. The Overview already ran `phase_tracker({ action: "start", phase: "plan" })`, or skipped it because `plan` was `in_progress`. Set the substep: `phase_tracker({ action: "substep", phase: "plan", substep: "plan-write" })`.
2. Resolve five absolute paths: the worktree (the `using-git-worktrees` Step 4 value), the spec, the plan (table above), this `SKILL.md`, and `reference/plan-contract.md` beside it - the last two from the loaded skill's path in the command's skill envelope or the absolute path used to read it.
3. Entry branch. A plan file already at the plan path in a flow restored by `/skill:gauntlet-resume` is checked before anything overwrites it: skip to step 5. Otherwise dispatch:

   ```
   subagent({ agent: "plan-writer", context: "fresh", async: false, cwd: "<abs worktree path>",
     phase: "plan-write",
     acceptance: { level: "none", reason: "the parent plan_check owns acceptance" },
     task: <the fixed template below, with the five paths filled> })
   ```

   > Write the implementation plan for the approved spec. Worktree: `<abs worktree path>`. Spec: `<abs spec path>`. Plan path: `<abs plan path>`. Plan skill: `<abs path to this SKILL.md>`. Plan contract: `<abs path to reference/plan-contract.md>`.

   No `output:`, no `model:` (`subagents.agentOverrides.plan-writer.model` applies when set, else the child inherits the main loop). The `acceptance` line is required: without it pi-cohort appends a structured-report contract that the child's one-line reply would fail. Fill the five paths and, when step 6 or an amendment supplies one, append a `Findings:` or `Amend:` block after the template; compose nothing else.
4. The dispatch errored, returned an async handle, or left the plan path missing or empty: stop and report. There is no parent-authored fallback.
5. `plan_check({ planPath: "<abs plan path>" })` in the parent. This is the stamping call; run it whichever line the child replied with.
6. Branch on the pair (child reply, parent check):
   - `PLAN WRITTEN` + `PASS` -> step 7.
   - `OPEN QUESTIONS` + any result -> read the section; absent or exactly `- none` takes the `PLAN WRITTEN` branch. For substantive rows, use the table below. On a pause retain phase `plan` as `in_progress` and its substep; no stamp or `plan_tracker` init.

     | Row form | Parent handling |
     |---|---|
     | `- Task N: ... fails on <sha>` | Name task, original command, SHA, exit and summary. Present three options, one per line: `fix-first` - run `/skill:shape-ticket` for the base failure (its own gate applies), then report the plan paused and end the turn; `narrow` - the human supplies filter or path text; `amend` - use brainstorming's `reference/amendment-surface.md` section 5. Follow with `Recommendation: <option> - <reason>`, then wait. After fix-first lands, bring the advanced base into the worktree through `/skill:using-git-worktrees`' existing advanced-base procedure (rebase, or merge for a shared branch), re-dispatch per step 3 with `Findings: rerun baseline`, then step 5; after a session break use `/skill:gauntlet-resume`'s baseline continuation. For narrow, re-dispatch with a Findings row `Task N Tests: narrow to `<text>``; for amend, use section 5. Both run Baseline's rerun rule before step 5. |
     | `- Baseline: worktree dirty`, `- Baseline: in-flight source edits`, `dirtied tracked source`, `moved HEAD` | Restore-and-rerun, not the menu: name paths and cause. Clear the parent's own wave/amendment source work through its own commit step; list doc-only work under `In-flight:` before re-dispatch. Take every other path, including every test-dirtied path, to the human to commit, discard, or move; never clean automatically. Once restored, re-dispatch per step 3 with `Findings: rerun baseline`, then step 5. Bullet `artifacts:` need no action. |
     | Other substantive rows (contract questions) | Present the rows, wait for answers, re-dispatch per step 3 with the answers as the `Findings:` block, then step 5. |
   - `PLAN WRITTEN` + `FAIL` -> re-dispatch per step 3 with the verbatim `FAIL (...)` output as the `Findings:` block, then step 5. Once per verbatim FAIL output: the same FAIL a second time goes to the user as an open question (the FAIL lines, verbatim), as an exhausted finding does.
   - No child reply (the step 3 entry branch on a restored plan) -> read the result as if the reply were `OPEN QUESTIONS` when the plan carries substantive Open Questions rows, else `PLAN WRITTEN` (section absent or exactly `- none`), and take that reply's branch above; a `FAIL` re-dispatch overwrites the restored plan with a repaired one.
7. Clear the substep (`phase_tracker({ action: "substep", phase: "plan", substep: null })`). Read the plan once, then `## Execution Handoff` as written below: `phase_tracker({ action: "complete", phase: "plan" })`, `plan_tracker({ action: "init", ... })` from the `W<k>: <title>` list, `/skill:subagent-driven-development`.

The parent holds no run id and never calls `resume` or `status`; every dispatch here is `async: false`. Re-entering this section without a restored plan overwrites whatever the plan path holds - a committed prior plan (recoverable from git history) or an uncommitted one (destroyed); re-planning is a deliberate overwrite. An amendment of the approved spec after the plan exists re-enters at step 3 with an `Amend:` block (brainstorming's `reference/amendment-surface.md` section 5 owns that call).

The sections from `## File Structure` through `## Self-Review` are the plan contract: `plan-writer` reads and executes them; the main loop never does.

## File Structure

**Before drafting tasks, map the files.**

List the files this implementation will create, modify, or delete. Group by component. This forces the design decisions out of the task list and into a single review surface.

**Happy-path row selection.** When the overrides file carries a `## Happy path` table, match the union of every task's `Files:` paths against the table's `Paths` prefixes (a path is inside a row when it starts with one of the row's prefixes). Two or more non-`cross-cutting` rows matched, or a path inside the `cross-cutting` row's own `Paths` and inside no other row's -> the `cross-cutting` row (no such row -> no line); this takes precedence. Otherwise exactly one non-`cross-cutting` row matched -> that row. No row matched, or no table -> no line. The selected row becomes the header's `**Happy path:**` line (below); the parent re-derives the row from the real diff at verify time, so this is the plan-time default and the `plan_check` anchor.

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

Group tasks into **waves** so the executor can parallelize independent work (see `subagent-driven-development` wave loop). A wave is a maximal set of tasks that (a) have no ordering dependency on each other, (b) own **pairwise-disjoint files**, and (c) contend on **no shared mutable runtime resource** (same DB/schema, port, fixture file, external service, shared temp path).

- Group independent tasks into the same wave by default.
- Group a pure dependency chain into one task per wave.
- Each wave after the first states its dependency on prior waves.

**File-ownership contract.** See [reference/plan-contract.md § Files](reference/plan-contract.md).

**Test contract.** Every task that creates or modifies code declares a `Test:` path and an executable `**Tests:**` command anchored to it (grammar: [reference/plan-contract.md § Tests](reference/plan-contract.md)); `- none: <category>` only when no tests apply. Anchoring is presence, not coverage. When the anchored spec names the thing under test, the task carries `- via:` naming it; a fixture path the spec names goes under `Create:`. Prefer the existing test file for the behavior as `Test:`; a new test file is declared as both `Create:` and `Test:`.

**Runtime-resource disjointness.** File-disjoint is necessary but not sufficient: two tasks with disjoint files that both mutate the same DB, bind the same port, or share a fixture are **not** parallel-safe and must land in different waves. Use this grouping as the parallel-safety guarantee for every multi-task wave. No new mandatory per-task syntax; when a shared runtime resource is the reason two file-disjoint tasks sit in different waves, record it in an inline note on the later wave.

**Doc tasks.** Doc updates are real plan tasks, not an afterthought. Task-local docs (a doc that only describes the file(s) a task already touches) ride with that task. Cross-cutting or index docs (README, `AGENTS.md`, topic guides, taxonomy indexes) sequence into a dedicated trailing doc-only wave — last wave by convention, file-disjoint from every code task so the pairwise-disjoint wave contract holds.

**Doc-wave collision rule.** Amend-over-create (see `brainstorming/reference/documentation-impact.md`) concentrates edits into hub docs like README and `AGENTS.md`. Run a multi-task doc wave's tasks concurrently with pairwise-disjoint files; merge doc tasks that land on the *same* file into one task rather than splitting. A single-task trailing doc wave is the expected shape, not a smell.

```markdown
## Wave 1 — Foundations

### Task 1: ...
### Task 2: ...
### Task 3: ...

## Wave 2 — Wire-up

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

**Verification:** `<full verification command set - tests + style + format; a single bundling entrypoint, or the listed individual commands; from your recon / the overrides file>` - in a repo with per-service verification commands, list the command of every service the change affects (its own files or code it depends on; a repo-wide shared path such as root config, a lockfile, or a shared library affects every dependent service), taking the per-service commands from the overrides file or AGENTS.md when recon reports a single entrypoint
**Happy path:** <row label> - `<command from the selected row>` (~<Timeout from the row>)

**Ticket:** `<ticket-id>` (omit if none)

---
```

**PR-subject header.** Detect a PR subject only from `## Rework record` in the approved spec. For that subject, replace the header's full verification command set with only the overrides' documented lint and format commands. With neither documented, write `**Verification:** none - PR subject, scoped`; this sentinel is not a command. Keep every task's `Tests:` command out of the header: copying it there makes it a full-suite duplicate rejected by `plan_check`. Keep the original spelling; resolve duplication by separating the task tests from header lint/format, not by disguising commands. Read the PR specialization in [reference/plan-contract.md](reference/plan-contract.md#pr-subject-verification).

The full verification entrypoint appears only on the `**Verification:**` line — see [reference/plan-contract.md § Header-only entrypoint](reference/plan-contract.md). The verify phase reads it from the plan; execution runs `Tests:` commands only. Execution runs it in the worktree via the subshell form `(cd "<abs worktree path>" && <command>)`; the process cwd stays in the primary checkout, and dispatch `cwd` is the worktree path. The `**Happy path:**` line is optional: present only when File Structure selected a row, with the row label, the row's command in backticks, and the row's `Timeout` as `(~<duration>)` (omit the suffix when the cell is absent or malformed). Like `Verification`, the happy-path command appears only on this header line - never in a task's `Tests:` or `Run:` block and never as free text in wave scope; `plan_check` enforces both.

## Task Structure

Each task uses `- [ ]` checkbox steps so execution tools (and humans) can track progress.

**PR-subject tasks.** Read the approved spec's `## Rework record`. When its base merge is `unresolved`, make merging the named base and resolving the listed files Task 1, before thread fixes; preserve the original commits. Make each `fix` thread exactly one task whose title carries that thread id. Name the thread's request in its `Tests:` block through the scoped command and `via:` seam that exercises it. Keep `keep open` and `decline: <reason>` as recorded dispositions, not repair tasks. Apply the existing file-disjoint wave, spec-anchor, baseline and checker rules to these tasks without changing executor or spec-commit mechanics.

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
- baseline: abc1234 pass
- via: `function()`

- [ ] **Step 1: Write the failing test**

  ```python
  # add a row to the existing table when one covers the behavior
  CASES = [
      ("existing", input, expected),
      ("new_behavior", new_input, new_expected),
  ]
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

Use bare `git` in task commit steps: the orchestrator commits each wave after code review accepts; a task's own commit step runs inside its nested worktree and is captured as its patch.

**Anchor rules.** See [reference/plan-contract.md § Spec anchors](reference/plan-contract.md). A task with no anchorable requirement omits the `**Spec:**` line and carries a mechanical-task row in `## Spec coverage` — silence is never valid.

## Spec Coverage Table

Every plan ends with a `## Spec coverage` section (grammar and example: [reference/plan-contract.md § Spec coverage table](reference/plan-contract.md)). Build it extraction-first: walk the spec top to bottom and write one row per normative requirement **before** assigning owners — every Design imperative (Add/Remove/Keep/Replace-style directives, not any fixed lexical form), every Edge-cases rule, every Acceptance criterion, every Out-of-scope entry, and every non-none Documentation-impact entry. Then assign owners, then re-walk the spec once: every normative clause has a row. From the spec's `## Acceptance criteria`, table only `in-scope` and `venue:` rows (a `venue:` row's owner is the task delivering its named enabling change); `deviates:`, `deferred:`, `elsewhere:`, and `none` rows get no table row - their disposition is the record, and any obligation a `deviates:` reason adopts is already a Design clause with its own row. Two row kinds:

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

The plan-writer runs Baseline, the deterministic checker, then the judgment checks before replying.

- **Baseline.** Execute the numbered procedure below for task `Tests:` commands only; leave header `**Verification:**` to verify. Never author baseline evidence without execution or a recorded tree-equivalence.
  1. Read provenance: `BASE=$(git -C "<abs worktree path>" rev-parse --short HEAD)` and `git -C "<abs worktree path>" status --porcelain --untracked-files=all`. Match every `XY <path>` entry (including `??`) against the worktree-relative plan and spec paths, plus only the parent-supplied `In-flight:` paths on an `Amend:` re-dispatch; never infer that set. Also allow untracked paths already recorded in existing baseline bullets' ` - artifacts:` suffixes in the plan at the plan path, excluding every plan `Create:` or `Test:` path. Keep those suffixes on retained bullets. Any other entry blocks all commands: collect `- Baseline: worktree dirty on <BASE>: <paths>`. Allowed in-flight paths outside the spec and plan directories are source edits: collect `- Baseline: in-flight source edits on <BASE>: <paths>` and run nothing. Allow doc-only workflow edits. For plain jj (no `.git`, VCS kind `jj`), use `BASE=$(jj -R "<abs worktree path>" log -r @- --no-graph -T 'commit_id.short()')` and `jj -R "<abs worktree path>" diff --summary`; classify one-letter status and relative paths identically (`A` includes new files). Never revert or clean anything. Record a short baseline provenance note with the initial per-file inventory, BASE, and which exact paths were admitted before running commands; retain it even when a later run is contaminated or blocked.
  2. On Findings/Amend, before any command runs, use step 1's BASE and prove endpoint-tree equivalence once per distinct recorded SHA in the plan. Derive `<spec dir>` and `<plan dir>` as the worktree-relative directories of the dispatched spec and plan paths. Run `git -C "<abs worktree path>" diff --quiet <recorded> <BASE> -- . ':!<spec dir>/' ':!<plan dir>/'`; only exit 0 proves equivalence. Keep the trailing `/` directory boundaries. For plain jj, run `jj -R "<abs worktree path>" diff --from <recorded> --to <BASE> --summary`: require exit 0 and empty stdout after dropping entries whose paths all lie under `<spec dir>/` or `<plan dir>/`. Reject entries that do not parse as `<status> <path>`; exclude stderr from filtered evidence. Compare endpoint trees, not history: a source change exactly reverted by BASE is equivalent. Prove every recorded SHA before rewriting any bullet; retention is all-or-nothing.

     | Proof outcome | Baseline action |
     |---|---|
     | Every proof holds and every admitted in-flight path lies within those directories | Retain valid evidence for unchanged command text, even when task steps changed; rewrite its SHA to BASE, preserving `skipped`, `pass via`, and ` - artifacts:` forms. Append `retained <n> bullets: <recorded> -> <BASE>, tree-equivalent outside <spec dir>, <plan dir>` once per distinct re-stamped SHA to the existing step-1 provenance note, the sole record. |
     | Any proof fails: missing/unresolvable SHA, git/jj error, nonzero exit, nonempty outside-directory diff, or admitted doc-only in-flight path outside both directories | Rerun every command and retain nothing. Emit no retained-provenance line or Open Questions finding for proof failure. |

     Preserve step 1's in-flight source block: run nothing when it applies. `Findings: rerun baseline` overrides retention, reruns all commands and re-stamps nothing. Never rewrite recorded SHAs without execution or a recorded tree-equivalence. Keep step 3's contamination checks; do not re-evaluate equivalence mid-run. For each command, split on the contract's separators (`&&`, `||`, `;`, `|`) and classify anchor tokens (a `Test:` path alone or with `::`/`#`/`:` filters) and selectors independently:

     | Command anchors/selectors | Baseline action |
     |---|---|
     | Changed command text or missing/invalid evidence on re-dispatch | Rerun regardless of equivalence through the anchor/selector procedure below. |
     | Every anchor in every segment is a `Create:` path of some task | Append `- baseline: <BASE> skipped - <path>[, <path>] created by this task`, one path per created anchor. Only all-created anchors skip. |
     | No segment has a created anchor or introduced selector | Run `(cd "<abs worktree path>" && <command>)` unchanged. |
     | Mixed anchors or introduced selectors | Derive per segment: drop each created-anchor token; strip an introduced attached filter to its path; drop an introduced flag selector and its value. Drop a segment with no existing `Test:` anchor of this task. Join surviving segments with their original separators. Keep at least one segment, each anchored to an existing `Test:` path of this task and no `Create:` path; otherwise skip only for all-created anchors as above. Run the derived base command. |

     An introduced selector is an attached filter or flag/value pair (`-k <expr>`, `-t <name>`, `-e <name>`, `-n <name>`, `--grep <name>`, `--test-name-pattern <name>`) whose filter/name appears verbatim in a test name the task's steps say they add. Keep selectors the steps do not name and run unchanged. Pass requires exit 0 and a runner summary reporting at least one test executed. Append `- baseline: <BASE> pass` for unchanged runs or `- baseline: <BASE> pass via `<base command>`` for derived runs. Treat non-zero exits, host allowlist/runtime errors, and exit-0 summaries with zero tests as failures; collect task, original command, exit code, summary and last 20 output lines, plus the derived command when used. Record a zero-test result as `exit <n>, no tests ran`, never a harmless skip. `- none:` tasks get no baseline.
  3. After each run reread status and BASE with step 1's commands. New tracked status outside the allowed set, a new `??` (jj `A`) at any plan `Create:` or `Test:` path, or moved BASE contaminates the run: collect the task, original command and `dirtied tracked source: <paths>` or `HEAD moved to <sha>`; stop further runs and record every unrun command. Any other new untracked entry is a disposable generated artifact: keep the result and append ` - artifacts: <path>[, <path>]` to its `pass` or `pass via` bullet. For each rerun (changed command text, missing/invalid bullet, failed equivalence proof, or `Findings: rerun baseline`), carry its recorded artifact paths still present as untracked onto the replacement bullet's ` - artifacts:` suffix, merged with new untracked entries from that run and excluding every plan `Create:` or `Test:` path. Record artifacts, never delete them. Do not give a contaminated command a passing bullet.
  4. Regenerate every baseline-form Open Questions row from this pass's collection; resolved rows disappear and `blocked:` lines are recomputed. Preserve unresolved contract rows until Findings answers them. Put `## Open Questions` at the top when any rows remain; omit it otherwise. Use these exact forms:

     - Failure: `- Task N: `<command>` fails on <BASE> (exit <n>): <one-line result summary>`, quoting the original Tests command. Indent a `ran: `<base command>`` continuation for a derived run, then a fenced block containing the last 20 output lines (or all output when shorter).
     - Contamination: `- Task N: `<command>` dirtied tracked source on <BASE>: <paths>` or `- Task N: `<command>` moved HEAD to <sha>`.
     - Global: `- Baseline: worktree dirty on <BASE>: <paths>` or `- Baseline: in-flight source edits on <BASE>: <paths>`.
     - Under each contamination/global row indent `blocked: Task M `<command>`` for every command it blocked. Keep failure output verbatim, including `TODO` or `etc.` inside valid continuation fences; only those evidence fences are exempt from placeholder scanning.

     With substantive rows remaining reply `OPEN QUESTIONS <abs plan path>` immediately; do not spend repair rounds on them.
- **Deterministic checker.** Run `plan_check({ planPath: "<abs plan path>" })` on the saved plan. Repair every `baseline-line` finding (missing, malformed, misplaced, invalid skipped/pass via or differing SHAs) and substantive baseline `open-questions` finding only through Baseline, never by authoring `pass`/`skipped` evidence or deleting/rewording a row. Normalize `## Open Questions malformed` into `- ` rows without changing substantive text. Fix every other finding yourself and rerun. With substantive rows remaining, reply `OPEN QUESTIONS <abs plan path>` without a passing check. Apply the 3-round budget only to ordinary findings: convert a finding surviving 3 rounds to an Open Questions row and stop. A child pass validates; the parent's call writes the execution stamp. Omit an empty questions section and reply `PLAN WRITTEN <abs plan path>` after all checks pass. Findings are defined in [reference/plan-contract.md](reference/plan-contract.md).
- **Contract decisions.** For every task crossing a boundary the spec leaves unsettled (a host-forwarded value, a caller's error type), derive the decision from code, the harness contract, or a sibling task. State `Decision: <what> - <caller/contract/sibling task cited>` in the task text. Ask only when the spec is silent or wrong and no source settles it; put that unresolved contract in Open Questions. Add no per-task `Decisions:` field.
- **Code-vs-anchor sanity.** For each task-owned requirement row, re-read the anchored spec lines and confirm the owner tasks' bodies do what they say - mechanism present, not just the quoted literal. For each `Verification` row, confirm the header command exercises the anchored requirement. Fix the task, don't annotate.
- **Type / API consistency.** Function signatures and field names that appear in multiple tasks must match exactly. The plan is its own contract — internal contradictions surface as bugs during execution.
- **Test contract.** Every code task's `Tests:` commands are anchored to its `Test:` path(s); `none:` only where no tests apply; a spec-named seam appears as `via:`, a spec-named fixture path as `Create:`. Prefer the existing test file for the behavior as `Test:`; a new test file is declared as both `Create:` and `Test:`.
- **Runtime-resource disjointness.** For every multi-task wave, confirm no two tasks contend on a shared mutable runtime resource (DB/schema, port, fixture, external service, shared temp path) — `Files:` overlap is checked mechanically, resource contention is not. Contention = mis-grouped wave; split or re-order before handoff.
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

After the parent `plan_check` passes and the plan has been read once (`## Author the plan` step 7), mark the planning phase complete, then initialize `plan_tracker` once with every plan task in wave order. Name each entry `W<k>: <title>` using its containing wave and task title. This is the execution list: do not initialize it again on continuation.

```
phase_tracker({ action: "complete", phase: "plan" })
plan_tracker({ action: "init", tasks: ["W1: <title>", "W1: <title>", "W2: <title>"] })
```

Auto-invoke `/skill:subagent-driven-development` in this session. Do not wait for confirmation — the spec gate already happened, and the plan is a mechanical derivative. The only pauses from here are in-flight STOPs (`BLOCKED` / `NEEDS_CONTEXT`) and the end gate, both owned by the executor.

## Red Flags — STOP

- Plan contains TODO / TBD / placeholder text
- File structure section absent
- Task step is "5+ minutes of work" (split it)
- Step lists don't use `- [ ]` checkboxes
- Two tasks reference the same function with different signatures
- Self-review skipped
- About to start executing the plan yourself
- A `scout` recon dispatch, or a parent `write`/`edit` on the plan path

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
