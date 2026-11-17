# Plan contract

The grammar `plan_check` enforces. Each section names its check(s). Findings resolve in this file's `## Self-review (before handoff)`: fix, re-run.

Read and execute this contract only as the `plan-writer` child, never in the main loop.

Assume the engineer is skilled but has zero context for this codebase and limited taste - document file paths, exact commands, expected output, and test design.

## File structure

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

If you can't list the files, the spec isn't ready: amend or redraw per brainstorming's [Amending an approved spec](../../brainstorming/SKILL.md#amending-an-approved-spec).

## Legs (`leg-unknown`)

Read the home spec's `## Legs` using [the leg contract](../../brainstorming/reference/legs.md) before recon. Write `Leg: <repo>` immediately after each task heading, before `**Files:**`; absence means home. Keep the plan and its `**Spec:**` header at home, citing the home spec. Repair a `leg-unknown` task in the plan, never by adding spec membership.

Write one `Baseline <repo>: <sha>` header per member. Match each task's baseline bullets to its own leg's SHA; require equality within a leg, not across legs. Resolve `Modify:`/`Create:`/`Test:`/`Delete:` paths and globs against the admitted leg checkout from [Locate a leg tree](../../brainstorming/reference/legs.md#locate-a-leg-tree), keeping home at the session's home worktree; admit task ownership through `plan_check`, never from `design:` prose. Stop plan writing on a failed lookup and report its reason; create no plan against a guessed checkout. Key file overlap and cross-task created anchors on `(leg, path)`.

Split mixed waves into consecutive leg-homogeneous waves, preserving dependencies. Re-walk each task's `Files:` under its leg using the leg contract's Gather rules procedure. Append task `Rules:` for files missing from the spec list; resolve `Rules: root only - paths unresolved`; retain missing-link evidence. Read the combined lists before execution and review.

Run Baseline independently in each owning checkout. Apply every provenance, dirty-tree, tree-equivalence, created-anchor, selector, contamination, artifact and blocked-command rule below within that repo. Qualify provenance notes, dirty/global/Open Questions and blocked evidence by repo; compare and retain SHAs only within the same leg. Write one `Baseline <repo>: <sha>` per member and execute each task's `Tests:` at that leg's root. Preserve all evidence rules and keep full verification for verify.

## Waves and tasks

Group tasks into **waves** so the executor can parallelize independent work (see `subagent-driven-development` wave loop). A wave is a maximal set of tasks that (a) have no ordering dependency on each other, (b) own **pairwise-disjoint files**, and (c) contend on **no shared mutable runtime resource** (same DB/schema, port, fixture file, external service, shared temp path).

- Group independent tasks into the same wave by default.
- Group a pure dependency chain into one task per wave.
- Each wave after the first states its dependency on prior waves.

**Test contract.** Every task that creates or modifies code declares a `Test:` path and an executable `**Tests:**` command anchored to it (grammar: [Tests](#tests-tests-block)); `- none: <category>` only when no tests apply. Anchoring is presence, not coverage. When the anchored spec names the thing under test, the task carries `- via:` naming it; a fixture path the spec names goes under `Create:`. Prefer the existing test file for the behavior as `Test:`; a new test file is declared as both `Create:` and `Test:`.

**Runtime-resource disjointness.** File-disjoint is necessary but not sufficient: two tasks with disjoint files that both mutate the same DB, bind the same port, or share a fixture are **not** parallel-safe and must land in different waves. Use this grouping as the parallel-safety guarantee for every multi-task wave. No new mandatory per-task syntax; when a shared runtime resource is the reason two file-disjoint tasks sit in different waves, record it in an inline note on the later wave.

**Doc tasks.** Doc updates are real plan tasks, not an afterthought. Task-local docs (a doc that only describes the file(s) a task already touches) ride with that task. Cross-cutting or index docs (README, `AGENTS.md`, topic guides, taxonomy indexes) sequence into a dedicated trailing doc-only wave - last wave by convention, file-disjoint from every code task so the pairwise-disjoint wave contract holds.

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

Each step is **one action, 2-5 minutes**:

- "Write the failing test" - step
- "Run it, confirm it fails" - step
- "Implement minimal code to pass" - step
- "Run tests, confirm green" - step
- "Format & lint the task's files" - step
- "Commit" - step

- Tasks nest under `## Wave N — <label>` headers; `### Task N` headers sit inside a wave.
- Write an optional single-line `Orchestrator: <instruction>` in a task body only for coordination the orchestrator must perform between waves; the first line matching `^Orchestrator: (.+)$` wins. Keep all other task prose worker-only. Route spec or plan persistence through the approved amendment procedure.

## Files (`wave-file-disjointness`, `paths-exist`, `files-block`)

**File-ownership contract.** The per-task `**Files:**` block *is* the ownership declaration — no new syntax. Rule: **within a wave, the union of every task's declared paths must be pairwise disjoint.** Globs are allowed for `Modify` when exact paths are unknown, but must not overlap another same-wave task's paths. A task that must touch another's file belongs in a later wave.

Treat `Create`, `Modify`, and `Delete` as writers and `Test:` entries as run anchors, not ownership. Allow `Test`/`Test` on the same path across same-wave tasks; reject every other same-path pair. Require `Modify:` paths to exist. Declare `Delete:` as write ownership with a literal path and no existence requirement. List a file the task removes as `Delete:` in exactly one task, never also as `Modify:`. Treat any other `- <token>:` line in the Files list as a `files-block` finding.

## Plan header

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

## Header-only entrypoint (`header-entrypoint`)

The `**Verification:**` line is the **only** place the full verification entrypoint may appear - never in any task or wave step. The verify phase reads it from the plan instead of re-deriving it; execution runs scoped commands only. Execution runs it in the worktree via the subshell form `(cd "<abs worktree path>" && <command>)`; the process cwd stays in the primary checkout, and dispatch `cwd` is the worktree path.

The header value's backtick spans (else the raw value) are split on `&&`, `||`, `;`, `,` into segments. No `Run:` step payload segment and no `Tests:` bullet segment may equal a header segment; prose inside waves may not contain the whole header value.

The optional `**Happy path:**` line's backticked command is a second header entrypoint under the same rule: its segments join the header segment set, and its whole command may not appear in wave prose.

## Happy path line (`header-happy-path`)

Optional: present only when `## File structure` selected a row, with the row label, the row's command in backticks, and the row's `Timeout` as `(~<duration>)` (omit the suffix when the cell is absent or malformed). When present, the header line reads `**Happy path:** <label> - \`<command>\`` with an optional ` (~<duration>)` suffix, `<duration>` matching `\d+(s|m|h)`. A present line that does not parse is a finding; absence is never a finding. The label names the row of the overrides file's `## Happy path` table the plan selected; the verify phase reads the line from the plan and re-derives the row from the real diff.

## PR-subject verification

Detect this specialization only from `## Rework record` in the approved spec. Put only the overrides' documented lint and format commands in `**Verification:**`, or the literal `none - PR subject, scoped` when neither is documented. Treat the sentinel as no header command. Keep scoped tests in task `Tests:` blocks, never copy them into the header or change their spelling to evade `header-entrypoint` or `tests-block` rejection. Keep the original spelling; resolve duplication by separating the task tests from header lint/format, not by disguising commands. Retain baseline evidence and all existing checker grammar. At verify, run the union of every task's `Tests:` commands plus the header's lint/format commands; omit `none:` entries and the sentinel from executable commands. This policy specializes the command set, not freshness, conformance or phase gates. Without the record, keep the ordinary full verification entrypoint.

## Task structure

Each task uses `- [ ]` checkbox steps so execution tools (and humans) can track progress.

**PR-subject tasks.** Read the approved spec's `## Rework record`; select Task 1 by its recorded form:
| Record | Task 1 |
|---|---|
| `merge: unresolved` | Merge the named base and resolve the listed files; preserve the original commits. |
| `sync: unresolved - <files>` | Run `git rebase --no-rebase-merges origin/<base>` and resolve `<files>`. |
| `Member replay: #<N> unresolved - <files>` | Replay #<N> onto home and resolve `<files>`. |
Place a rebase-form Task 1 alone in Wave 1 marked `in-place`; keep the merge-form Task 1 as an ordinary wave task. In both forms, keep Task 1 alone in Wave 1 and place every thread fix task in Wave 2 or later, behind Task 1.
For both rebase forms, consume every `pending` member in listed order, run `git update-ref refs/gauntlet/rework-base/pr-<home> HEAD`, and persist `Rework base: <sha>` plus final `Member replay:` outcomes through the existing [amendment path](../../brainstorming/SKILL.md#amending-an-approved-spec) before finishing. Use [pr-head's sync and helper contract](../../using-git-worktrees/reference/pr-head.md), including replay commands, conflict checks, continuation and abort assertions; do not duplicate it. Make each `fix` thread exactly one task whose title carries that thread id. Name the thread's request in its `Tests:` block through the scoped command and `via:` seam that exercises it. Keep `keep open` and `decline: <reason>` as recorded dispositions, not repair tasks. Apply the existing file-disjoint wave, spec-anchor, baseline and checker rules to these tasks without changing executor or spec-commit mechanics.

```markdown
### Task N: [Component Name]

**TDD scenario:** [New feature — full TDD cycle | Modifying tested code — run existing tests first | Trivial change — use judgment]

**Spec:** doc/specs/<file>.md § "<heading>" L<start>-L<end>

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Delete: `exact/path/to/removed.py`
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

  Read `<absolute wording reference>`: Subject, Body and Word sources. Compose
  the message from this task heading and the bound ticket; send it on stdin.

  ```bash
  git add tests/path/test.py src/path/file.py
  git commit -F -
  ```
```

Every code task carries this step (red -> green -> fmt/lint -> commit). Doc-only tasks omit it unless the project formats Markdown.

Read [the commit-message reference](../../finishing-a-development-branch/reference/commit-message.md) now. Resolve its absolute path into every task's Commit step and bind the ticket through Word sources. Use bare `git` in task commit steps: the orchestrator commits each wave after code review accepts; a task's own commit step runs inside its nested worktree and is captured as its patch.

## Spec anchors (`anchor-resolution`)

**Anchor rules.** The task's `**Spec:**` line cites the plan header's spec path; multiple anchors sit comma-separated on one line (`§ "A" L10-L18, § "C" L40-L44`). Checks key on the `§` marker, so the header's path-only `**Spec:**` line is never matched. Anchors are captured against the gated spec at plan-writing time; a change to the approved spec follows brainstorming's [Amending an approved spec](../../brainstorming/SKILL.md#amending-an-approved-spec), executed in place. A task with no anchorable requirement (pure-mechanics chore) omits the `**Spec:**` line entirely (never `**Spec:** none`) and carries a mechanical-task row in `## Spec coverage` — silence is never valid.

## Tests (`tests-block`)

Every `### Task N` carries a `**Tests:**` block: the bare line `**Tests:**` directly after the last `Files:` entry (blank lines allowed). Use command groups or the no-tests form:

- `- ` + backtick + command + backtick - one scoped test command; directly after it exactly one `- baseline:` bullet, then zero or more `- via: <entry point>` bullets naming the seam tests call (function, route, CLI, module).
- `- none: <category>` - the task runs no tests; `<category>` is free text derived from the project (docs, config, fixtures, generated assets, ...); exactly one, and no `- Test:` path in `Files:`

Absence is never valid. A `- [ ]` step or any non-bullet line ends the block. `via:` and `none:` are unchecked beyond form.

Baseline forms (`baseline-line`): `- baseline: <sha> pass`, `- baseline: <sha> pass via `<base command>`` (both allow ` - artifacts: <path>[, <path>]`), or `- baseline: <sha> skipped - <path>[, <path>] created by this task`. Use 7-40 lowercase hex characters for `<sha>`; every baseline SHA within the same leg must match (plan-wide for legacy home-only plans). Never put a baseline under `none:`. `skipped` is valid only when every command anchor is a listed `Create:` path and every listed path is one of those anchors. Every segment of a `pass via` base command must anchor an existing `Test:` path of the task and no `Create:` path. Obtain evidence through this file's `## Self-review (before handoff)` Baseline, never by editing evidence to satisfy a finding.

Commands are written repo-relative and run in the worktree via `(cd "<abs worktree path>" && <command>)` - the checker never runs them; Baseline and the executor do. Each command is split into segments on `&&`, `||`, `;`, `|`; every segment must contain, as a whitespace-delimited token, a `Test:` path of the same task (the path alone, or followed by `::`, `#`, or `:` and a filter). A `Test:` value containing `*`, `?`, `[` or ending in `/` never anchors; any other argument token with those shapes is a broadening selector and fails. `cd `, `sh -c`, `bash -c`, `eval `, `$(` are unsupported. Each `Test:` path must exist or be a `Create:` path of some task. A segment equal to a header `**Verification:**` or `**Happy path:**` segment is a full-suite command and fails. Runners with no file-addressable form are out of scope (`go test ./pkg -run X`, `mvn -Dtest=`).

### Implement-only historical evidence

Write the optional header `**Baseline policy:** implement-local` only from implement-phase `Amend-apply:`. Reject duplicate, misplaced, empty or unknown policy values. Absence preserves ordinary uniform-SHA checks. In local mode retain one valid original `Baseline <repo>: <sha>` declaration per admitted leg; allow genuinely evidenced mixed per-command revisions within that leg without implying freshness at current HEAD. Keep syntax, adjacency, leg ownership and anchor checks unchanged.

Count an existing Test path still declared Create as existing for new derived evidence; create new skipped evidence only for truly absent all-created anchors. Retain historical skipped evidence even when its anchors now exist only with matching original evidence in the committed plan from the committed home plan/spec originals and existing provenance note: `Baseline provenance: retained <leg or home> | <exact command> | <exact baseline value>`. The value is the whole text after `- baseline: `, including suffixes. The checker matches this note by leg, exact command and value; the writer owns validating the historical observation against the committed plan original, reread via `git -C "<abs home worktree>" show HEAD:<home-relative plan path>` before edits and on every retry; use previousApplyReport for prior findings only. Preserve pass-via and artifact suffixes byte-identically on retention. Explicit full refresh executes all commands and restores ordinary uniform evidence; never infer mode from mixed SHAs.

## Spec coverage table (`table-closure`, `waiver-literal`)

Every plan ends with a `## Spec coverage` section (grammar and example: [Spec coverage table](#spec-coverage-table-table-closure-waiver-literal)). Build it extraction-first: walk the spec top to bottom and write one row per normative requirement **before** assigning owners - every Design imperative (Add/Remove/Keep/Replace-style directives, not any fixed lexical form), every Edge-cases rule, every Acceptance criterion, every Out-of-scope entry, and every non-none Documentation-impact entry. Then assign owners, then re-walk the spec once: every normative clause has a row. From the spec's `## Acceptance criteria`, table only `in-scope` and `venue:` rows (a `venue:` row's owner is the task delivering its named enabling change); `deviates:`, `deferred:`, `elsewhere:`, and `none` rows get no table row - their disposition is the record, and any obligation a `deviates:` reason adopts is already a Design clause with its own row.

A `Post-deployment housekeeping` paragraph, any other step a person performs that no file delivers (before merge, after merge or after deploy), commit message text, and a clause whose sole observable is a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run get no table row and no task, unless that text or result is itself a behavior of the change (a workflow file, a pull-request template, code that writes pull-request text), which is tabled as any requirement. Keep every mixed row or clause that joins a behavior with an excluded clause: table the behavior alone, assign its owning task, and cite the mixed row's anchor in that task's Spec line; never omit the whole row. When the anchored spec line of such a mixed row carries an inline code span in its excluded half, repeat that literal exactly once, only in the owning task on a line opening `Excluded citation (not work, not an acceptance condition):`, and in no step, acceptance condition or table cell.

Two row kinds:

- **Requirement rows:** a cross-cutting requirement (decided in more than one task) lists **every** deciding task as owner, not the first. `waived: <reason>` is only for requirements the spec marks out of scope **and** that exclude work from the change. A requirement whose text carries an inline code span (`` `literal` ``) names concrete behaviour and is never waivable - it maps to a task or `Verification`. A waiver on an in-scope normative requirement is a Self-Review failure - there is no human plan-review gate to catch it downstream.
- `Happy path` is never an owner. Coverage by the happy-path run is inferred by the conformance reviewer at audit time, never declared in the plan; the checker rejects the cell under the owner-grammar reason.
- The table is plan-authoring-time only - never passed to implementer or reviewer dispatches.

Every plan ends with a `## Spec coverage` section — authored last, placed after all Task sections (owner IDs do not exist earlier). Closure both ways: every `### Task N` appears as an owner in some row; every row's owner task exists.

```markdown
## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Design" L34-L37 | anchor line in task template | Task 2 |
| § "Edge cases" L120 | stale anchor = blocking SR finding | Task 4, Task 5 |
| § "Testing" L84 | checker fixtures: `node --test extensions/lib/plan-check.test.ts` | Task 3 |
| § "Acceptance" L88 | full suite passes: `npm test` | Verification |
| § "Out of scope" L131 | fix-round anchoring | waived: out of scope per spec |
| - | mechanical: release commit | Task 7 |
```

**Requirement rows:** anchor + short requirement + owner = task-ID list, or `Verification`, or `waived: <reason>`. A `waived:` row whose requirement cell contains an inline code span fails `waiver-literal`.

**`Verification` owner:** use for a requirement the header `**Verification:**` command proves. Write the exact string `Verification`, alone. Quote only literals contained in that header. Anchor the single requirement line. Keep scoped commands task-owned.

**Mechanical-task rows:** anchor `-`, requirement `mechanical: <short>`, owner = the task ID. One such row per anchor-less task.

## Placeholders and quote integrity (`placeholder-scan`, `quote-integrity`)

Every plan failure mode:

- ❌ `# TODO: add validation` - implementer can't infer "validation" of what, against what schema, with what error message.
- ❌ `# Implement the rest of the function` - incomplete code is invalid code.
- ❌ "Add tests for edge cases" - name the edge cases.
- ❌ "Wire it up to the existing system" - give file paths and call sites.
- ❌ "Similar to Task N" - repeat the code. Implementers (and subagents with fresh context) may read tasks out of order; pointing at a sibling task is not a substitute for showing the code.
- ❌ References to types, functions, methods, or fields not defined in any task in this plan. If it shows up in Task 5, it must be introduced by Task 1-4 or already exist in the codebase (with a file:line citation).
- ❌ "Probably also need to update the docs" - either yes (which doc) or no. Docs are named plan tasks, sourced from the spec's Documentation impact section (materiality bar in `brainstorming/reference/documentation-impact.md`).

If a decision is genuinely open, put it in an explicit **Open Questions** section at the top and resolve before execution starts.

- ❌ "timeout/gtimeout ladder" when the spec fixes the literal `timeout 30` — never paraphrase an exact-string requirement (setting keys, error messages, banner/format strings, command names and invocations, API shapes); transcribe it as a backtick-quoted spec literal: `timeout 30`. Spec-side backtick spans containing `<placeholder>` segments are templates the plan instantiates, not exact-string requirements — exempt from quote integrity.
- ❌ `[fill in]`, `<example>`, `xxx` markers anywhere in the doc.

The banned token list is `BANNED_TOKENS` in `extensions/lib/plan-check.ts`; a token inside a literal the anchored spec requires is exempt.

## Open Questions (`open-questions`)

Bound the section from `## Open Questions` to the next `## ` heading or EOF. Use `- ` rows with indented continuations (`ran:`, `blocked:`, fenced output). The empty sentinel is exactly one line `- none`; an absent section also passes. Every substantive row produces one finding quoting its first line. Prose and tables are malformed: normalize them to rows without changing substantive content.

Baseline failure: `- Task N: `<command>` fails on <sha> (exit <n>): <one-line result summary>`, quoting the original Tests command. Derived runs add an indented `ran: `<base command>`` continuation. Under every failure row, below the `ran:` line when one is present, add a fenced block containing the last 20 output lines (or all output when shorter). Contamination: `- Task N: `<command>` dirtied tracked source on <sha>: <paths>` or `- Task N: `<command>` moved HEAD to <sha>`. Global rows: `- Baseline: worktree dirty on <sha>: <paths>` and `- Baseline: in-flight source edits on <sha>: <paths>`. Add indented `blocked: Task M `<command>`` continuations for every command each contamination/global row blocked.

Keep failure output verbatim. Only fenced output continuing a well-formed row is exempt from `placeholder-scan` (verbatim tails can contain `TODO` or `etc.`). Row first lines, `ran:`/`blocked:` and authored task prose remain scanned.

## Self-review (before handoff)

The plan-writer runs Baseline, the deterministic checker, then the judgment checks before replying.

- **Implement-local Baseline (`Amend-apply:` only).** Use this branch instead of ordinary Baseline steps 1-4 during implement; keep initial planning and ordinary Findings/Amend below unchanged. Write `**Baseline policy:** implement-local` only in this mode. Preserve original per-leg declarations and valid unchanged command bullets at their measured revisions, including derived-pass, skipped and artifact suffixes; perform no endpoint-tree equivalence or rerun-all sweep. Read both committed home plan/spec originals before editing using the two home-relative HEAD reads in plan-writer's `Amend-apply:`; use the committed plan for historical evidence. For retained skipped evidence whose anchors now exist, copy its exact leg, command and bullet value into the existing provenance note as `Baseline provenance: retained <leg or home> | <exact command> | <exact baseline value>`; require matching evidence in the committed plan original, never invent a skip or execution.
  1. Inventory status using ordinary step 1 before maintenance and before/after each run. Admit only explicit parent `In-flight:` paths, spec/plan and eligible recorded artifacts. Unknown dirty paths block. With no test execution needed, preserve declared staged repairs without committing, restoring or discarding them.
  2. Run only changed/added commands or missing/invalid evidence, exact or documented derived scoped commands by the ordinary selector procedure. Count already-created anchors as existing; create new skipped evidence only when all anchors are truly absent at the execution revision. Retained historical skips describe their recorded revision, not current existence.
  3. Require an identified execution tree: current or retained implementation with revision and admitted changes identified, or an existing parent-owned committed snapshot. Never label a dirty run as clean HEAD. Stop on unidentified trees; create no snapshot, source edit or restoration yourself. Record leg, checkout, revision, admitted changes, exact/derived command, exit and nonzero executed-test count in the existing provenance and saved report. Exit 0 with zero tests fails. Apply ordinary contamination/artifact rules, stop on unknown dirty paths or moved test revision, and retain failed revision/output plus subsequent resolving evidence.
  4. Match retained failures by failing command, assertion or path plus corresponding repair evidence, never task membership. Return outstanding repairs to the existing task gate loop; keep unrelated regressions substantive blockers. Preserve failure history in the report while removing only resolved Open Questions rows. Keep parent stamp, integrated gate, review and final verification mandatory. Explicit `Findings: rerun baseline` overrides this branch: execute all commands, remove the implement-local header and restore ordinary uniform evidence; preserve prior failure findings in the report.
- **Baseline.** Execute the numbered procedure below for task `Tests:` commands only; leave header `**Verification:**` to verify. Never author baseline evidence without execution or a recorded tree-equivalence.
  1. Read provenance: `BASE=$(git -C "<abs worktree path>" rev-parse --short HEAD)` and `git -C "<abs worktree path>" status --porcelain --untracked-files=all`. Match every `XY <path>` entry (including `??`) against the worktree-relative plan and spec paths, plus only the parent-supplied `In-flight:` paths on an `Amend:` re-dispatch; never infer that set. Also allow untracked paths already recorded in existing baseline bullets' ` - artifacts:` suffixes in the plan at the plan path, excluding every plan `Create:` or `Test:` path. Keep those suffixes on retained bullets. Any other entry blocks all commands: collect `- Baseline: worktree dirty on <BASE>: <paths>`. Allowed in-flight paths outside the spec and plan directories are source edits: collect `- Baseline: in-flight source edits on <BASE>: <paths>` and run nothing. Allow doc-only workflow edits. For plain jj (no `.git`, VCS kind `jj`), use `BASE=$(jj -R "<abs worktree path>" log -r @- --no-graph -T 'commit_id.short()')` and `jj -R "<abs worktree path>" diff --summary`; classify one-letter status and relative paths identically (`A` includes new files). Never revert or clean anything. Record a short baseline provenance note with the initial per-file inventory, BASE, and which exact paths were admitted before running commands; retain it even when a later run is contaminated or blocked.
  2. On Findings/Amend, before any command runs, use step 1's BASE and prove endpoint-tree equivalence once per distinct recorded SHA in the plan. Derive `<spec dir>` and `<plan dir>` as the worktree-relative directories of the dispatched spec and plan paths. Run `git -C "<abs worktree path>" diff --quiet <recorded> <BASE> -- . ':!<spec dir>/' ':!<plan dir>/'`; only exit 0 proves equivalence. Keep the trailing `/` directory boundaries. For plain jj, run `jj -R "<abs worktree path>" diff --from <recorded> --to <BASE> --summary`: require exit 0 and empty stdout after dropping entries whose paths all lie under `<spec dir>/` or `<plan dir>/`. Reject entries that do not parse as `<status> <path>`; exclude stderr from filtered evidence. Prove every recorded SHA before rewriting any bullet; retention is all-or-nothing.

     | Proof outcome | Baseline action |
     |---|---|
     | Every proof holds and every admitted in-flight path lies within those directories | Retain valid evidence for unchanged command text, even when task steps changed; rewrite its SHA to BASE, preserving `skipped`, `pass via`, and ` - artifacts:` forms. Append `retained <n> bullets: <recorded> -> <BASE>, tree-equivalent outside <spec dir>, <plan dir>` once per distinct re-stamped SHA to the existing step-1 provenance note, the sole record. |
     | Any proof fails: missing/unresolvable SHA, git/jj error, nonzero exit, nonempty outside-directory diff, or admitted doc-only in-flight path outside both directories | Rerun every command and retain nothing. Emit no retained-provenance line or Open Questions finding for proof failure. |

     `Findings: rerun baseline` overrides retention, reruns all commands and re-stamps nothing. Never rewrite recorded SHAs without execution or a recorded tree-equivalence. For each command, split on the contract's separators (`&&`, `||`, `;`, `|`) and classify anchor tokens (a `Test:` path alone or with `::`/`#`/`:` filters) and selectors independently:

     | Command anchors/selectors | Baseline action |
     |---|---|
     | Changed command text or missing/invalid evidence on re-dispatch | Rerun regardless of equivalence through the anchor/selector procedure below. |
     | Every anchor in every segment is a `Create:` path of some task | Append `- baseline: <BASE> skipped - <path>[, <path>] created by this task`, one path per created anchor. Only all-created anchors skip. |
     | No segment has a created anchor or introduced selector | Run `(cd "<abs worktree path>" && <command>)` unchanged. |
     | Mixed anchors or introduced selectors | Derive per segment: drop each created-anchor token; strip an introduced attached filter to its path; drop an introduced flag selector and its value. Drop a segment with no existing `Test:` anchor of this task. Join surviving segments with their original separators. Keep at least one segment, each anchored to an existing `Test:` path of this task and no `Create:` path; otherwise skip only for all-created anchors as above. Run the derived base command. |

     An introduced selector is an attached filter or flag/value pair (`-k <expr>`, `-t <name>`, `-e <name>`, `-n <name>`, `--grep <name>`, `--test-name-pattern <name>`) whose filter/name appears verbatim in a test name the task's steps say they add. Keep selectors the steps do not name and run unchanged. Pass requires exit 0 and a runner summary reporting at least one test executed. Append `- baseline: <BASE> pass` for unchanged runs or `- baseline: <BASE> pass via `<base command>`` for derived runs. Treat non-zero exits, host allowlist/runtime errors, and exit-0 summaries with zero tests as failures; collect task, original command, exit code, summary and last 20 output lines, plus the derived command when used. Record a zero-test result as `exit <n>, no tests ran`, never a harmless skip. `- none:` tasks get no baseline.
  3. After each run reread status and BASE with step 1's commands. New tracked status outside the allowed set, a new `??` (jj `A`) at any plan `Create:` or `Test:` path, or moved BASE contaminates the run: collect the task, original command and `dirtied tracked source: <paths>` or `HEAD moved to <sha>`; stop further runs and record every unrun command. Any other new untracked entry is a disposable generated artifact: keep the result and append ` - artifacts: <path>[, <path>]` to its `pass` or `pass via` bullet. For each rerun (changed command text, missing/invalid bullet, failed equivalence proof, or `Findings: rerun baseline`), carry its recorded artifact paths still present as untracked onto the replacement bullet's ` - artifacts:` suffix, merged with new untracked entries from that run and excluding every plan `Create:` or `Test:` path. Record artifacts, never delete them. Do not give a contaminated command a passing bullet.
  4. Regenerate every baseline-form Open Questions row from this pass's collection; resolved rows disappear and `blocked:` lines are recomputed. Preserve unresolved contract rows until Findings answers them. Put `## Open Questions` at the top when any rows remain; omit it otherwise. Use the exact row forms in [Open Questions](#open-questions-open-questions).

     With substantive rows remaining reply `OPEN QUESTIONS <abs plan path>` immediately; do not spend repair rounds on them.
- **Implement-local patch (`Amend-apply:` only).** Derive original task numbers, titles, anchors, anchored obligation text, task bodies, Tests and wave positions from both committed home plan/spec originals using home-relative HEAD reads before any edit and on every retry. Use `previousApplyReport` for prior findings only, not baseline copies. Patch affected entries, coverage and shifted anchors only, preserving unaffected text, state and evidence. Compare semantic obligations/work, ignoring line shifts and meaning-preserving rewording; return no completed task in `tasksAnchorChanged` for a pure offset move. Keep full-file write mechanics, idempotent retry, write-free failed original reads and parent stamping.
- **Deterministic checker.** Run `plan_check({ planPath: "<abs plan path>" })` on the saved plan. Repair every `baseline-line` finding (missing, malformed, misplaced, invalid skipped/pass via or differing SHAs) and substantive baseline `open-questions` finding only through Baseline, never by authoring `pass`/`skipped` evidence or deleting/rewording a row. Normalize `## Open Questions malformed` into `- ` rows without changing substantive text. Fix every other finding yourself and rerun. With substantive rows remaining, reply `OPEN QUESTIONS <abs plan path>` without a passing check. Apply the 3-round budget only to ordinary findings: convert a finding surviving 3 rounds to an Open Questions row and stop. A child pass validates; the parent's call writes the execution stamp. Omit an empty questions section and reply `PLAN WRITTEN <abs plan path>` after all checks pass. Findings are defined in [this contract](#plan-contract).
- **Contract decisions.** For every task crossing a boundary the spec leaves unsettled (a host-forwarded value, a caller's error type), derive the decision from code, the harness contract, or a sibling task. State `Decision: <what> - <caller/contract/sibling task cited>` in the task text. Ask only when the spec is silent or wrong and no source settles it; put that unresolved contract in Open Questions. Add no per-task `Decisions:` field.
- **Code-vs-anchor sanity.** For each task-owned requirement row, re-read the anchored spec lines and confirm the owner tasks' bodies do what they say - mechanism present, not just the quoted literal. For each `Verification` row, confirm the header command exercises the anchored requirement. Fix the task, don't annotate.
- **Type / API consistency.** Function signatures and field names that appear in multiple tasks must match exactly. The plan is its own contract - internal contradictions surface as bugs during execution.
- **Runtime-resource disjointness.** For every multi-task wave, confirm no two tasks contend on a shared mutable runtime resource (DB/schema, port, fixture, external service, shared temp path) - `Files:` overlap is checked mechanically, resource contention is not. Contention = mis-grouped wave; split or re-order before handoff.
- **Verification-ownership authorization.** `Verification` on a requirement no header command exercises is a Self-Review failure.
- **Documentation-impact mapping.** Each Documentation impact entry maps to a plan task (or explicit "none").

Fix what this review finds before handoff.
