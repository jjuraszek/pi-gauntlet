# Resume repairs plan citation drift instead of stopping

**Goal:** `/skill:gauntlet-resume` continues an interrupted flow automatically when `plan_check` fails on citation drift, by repairing the plan's citations and re-checking, and stops only when a finding needs a task renamed, reordered, added, or removed.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

supersedes `doc/specs/2026-09-17-gh-31-gauntlet-resume.md`, the `plan_check` FAIL handling in the process-state restore table and the reconstruction "Spec with plan" route only.

## Problem

Resume runs `plan_check` before `start implement` (and before `verify`/`ship` restores, which inherit the implement row) and on FAIL prints the findings and stops with `plan` in_progress and no `plan_tracker init` (`skills/gauntlet-resume/reference/brief-contract.md:133`, `skills/gauntlet-resume/reference/reconstruction.md:97`). The stop cannot be bypassed by skipping the check: `start implement` is rejected without a stamp whose plan+spec sha256 pair matches the current files (`extensions/phase-tracker.ts` 963-977, `doc/configuration.md:102`).

`plan_check` has no spec-to-plan completeness check (`extensions/lib/plan-check.ts` 566-760): a requirement added to the spec with no coverage row passes silently. What fails after a spec edit is drift in what the plan cites - `anchor-resolution` (heading or line range moved), `quote-integrity` (a backtick literal in anchored spec lines changed), `table-closure` (coverage row anchor not in the owner's `**Spec:**` set). A second, larger source is execution progress: `paths-exist` on `Modify:`/`Test:` paths that completed tasks deleted or moved, and `tests-block` on a moved `Test:` directory.

Session evidence (pi sessions 2026-10-04 to 2026-10-08): two resume stops, both repaired by hand after the human said to fix the plan, both restoring the task list verbatim. One stop was 8 `quote-integrity` findings after a spec amendment (six-line plan repair, 21 completed + 2 in_progress tasks restored exactly). The other was 417 findings - about 405 `paths-exist` on `Modify:` rows of completed tasks, 5 `quote-integrity`, 2 `tests-block` - repaired by dropping dead rows, fixing two test lines, and adding the literal; 24 tasks restored verbatim. Neither repair renamed, reordered, added, or removed a task. The stop costs a session and a question and buys nothing.

Framing: pivoted to resume running a citation-only repair loop on FAIL instead of stopping. The amend aftermath (`skills/brainstorming/reference/amendment-surface.md` section 5) is not reused: it reopens, adds, and removes tasks and assumes an initialized tracker, which is the mid-execution break the human forbade. The ask's alternative, "allow the gap", is unreachable without `flowGuards.enforce: false`. `gauntlet-handoff` is not changed: its boundary is "never any other repository file" (`skills/gauntlet-handoff/SKILL.md:27`), it runs when context is nearly full, and it covers only the brief route - the reconstruction route has no handoff and drifts the same way.

## Acceptance criteria

none - no ticket

## Design

### Owner section: `## Plan repair` in `brief-contract.md`

A new section `## Plan repair` is added to `skills/gauntlet-resume/reference/brief-contract.md`, directly after the per-stage call table it serves (before "Exact" restoration binds ...). It is the only place the repair rules live; `reconstruction.md` and the call table link to it.

Inputs: the findings list from the `plan_check` FAIL, and the task list with statuses (the brief's, or the confirmed reconstruction snapshot) read-only - it is never rewritten.

**Classify before writing.** Every finding is matched to one row of the table below by its `check` and `reason`, with the row's evidence gathered first. One finding with no row -> stop (below) with the plan file unchanged. Only when every finding has a row does the loop write.

| Finding (`check`, `reason`) | Evidence | Edit |
|---|---|---|
| `anchor-resolution`, range outside section or line shift | the anchor's heading string matches exactly one current spec heading | set the `**Spec:**` `L<n>-L<m>` range to the current span of that section that holds the task body's existing literals |
| `quote-integrity`, task-owned row | the row's anchor already resolves (repair anchors first) | add the missing backtick literal to the owning task's body; never replace or remove task text |
| `quote-integrity`, `Verification`-owned row | as above | add the missing literal to the header `**Verification:**` line |
| `table-closure`, row anchor not in the owner's `**Spec:**` set | the owner cell names an existing task | move the row's anchor together with that same owner's `**Spec:**` anchor; the owner cell never changes |
| `paths-exist`, `Modify: path "<p>" does not exist` | the owning task is `complete` or `skipped` in the task list, and `git -C <worktree> log --diff-filter=D --format=%h -1 -- <p>` is non-empty | drop that `Modify:` row |
| `paths-exist` or `tests-block`, a `Test:` path that does not exist or a `Tests:` segment not anchored | `git -C <worktree> log --diff-filter=R --format= --name-status -M -1 -- <old> <new>` shows the rename `<old>` -> `<new>` | substitute `<new>` for `<old>` in the `Test:` line and in the `Tests:` command; nothing else in the command changes |

Every other `check` (`input`, `placeholder-scan`, `header-entrypoint`, `header-happy-path`, `waiver-literal`, `wave-file-disjointness`, `solo-line`, `internal`) and every reason not listed (a missing `Files:` block, an invalid or empty glob, a missing or ambiguous heading, a `pending`/`in_progress` owner of a dead `Modify:` row, a command broadening) has no row and stops. Task names, count, order, wave membership, `Solo:` lines, the owner column, and task text beyond an added literal or a substituted path are never changed.

Loop: write every classified edit, re-run `plan_check({ planPath })`; a new finding is classified the same way; at most 3 rounds.

Before the first write record whether the plan is tracked and clean: `git -C <worktree> ls-files --error-unmatch -- <plan path>` exits 0 and `git -C <worktree> status --porcelain -- <plan path>` prints nothing (index and working copy both match HEAD; a staged edit alone makes it dirty). PASS -> when both held, commit the plan alone:

```bash
git -C <worktree> add -- <plan path> && git -C <worktree> commit -q -m "resume: plan citation repair - <n> findings" -- <plan path>
```

The subject is deliberately not `amend:`, so `finishing-a-development-branch` Step 4's digest ignores it. A failed commit stops with git's output. When the plan was untracked or dirty before the loop, the repair stays in the working copy and no commit is made; it lands with the next task commit. Then continue the originating route's PASS path: the call table from `skip plan R`, or reconstruction step 3.

Stop (every case): when a round wrote the plan, restore the plan file to its pre-loop bytes (`git checkout -- <plan path>` when it was tracked and clean, else the saved copy) - a stop before the first write runs no git command; print the findings, leave `plan` in_progress with no `init` (today's stop), and print one line naming the cause:

- a finding with no row: `Repair stopped: <check> - <reason> is outside citation repair; the plan file is unchanged. Edit the plan (task changes allowed), then re-run /skill:gauntlet-resume.`
- a finding surviving the third round: `Repair stopped: <check> - <reason> survived 3 rounds. Edit the plan, then re-run /skill:gauntlet-resume.`

No Open Question is written: resume never edits the spec.

### Reconstruction evidence

Dropping a dead `Modify:` row removes a path reconstruction step 1 queries for task evidence (`reconstruction.md` "Spec with plan", `git log <plan-commit>..HEAD -- <path>` over the task's `Files:` block). Step 1 therefore queries the union of the task's `Files:` paths in the working copy and in `git -C <worktree> show <plan-commit>:<plan path relative to the worktree>` (an object path inside the repository, never the absolute `planPath`); a `complete` proposal survives the repair.

### Receipt line

A restore that ran a repair prints, directly before the standard closing line `Gate history not restored; re-validating ...`:

```
Repaired plan: <n> findings (<comma-separated check names, deduplicated>)
```

The standard closing line and the `Standing grant` line keep their position and order. A first-check PASS prints no receipt, makes no commit, and is byte-identical to today's restore.

### Call-site edits

- `brief-contract.md` call table, `implement` row: "on FAIL print findings and stop with plan in_progress, no init" -> "on FAIL run `## Plan repair`". `verify` and `ship` rows inherit through "as implement".
- `reconstruction.md` "Spec with plan" step 2: "FAIL -> print the findings, stop with plan in_progress, no `init`" -> "FAIL -> run `brief-contract.md` `## Plan repair`"; step 1 gains the union clause from "Reconstruction evidence".
- `SKILL.md` Boundaries, "Writes:" bullet gains one clause: "the plan file, only through `reference/brief-contract.md` `## Plan repair`". The "Never ... a spec copy, rename, or marker commit" clause stays.

### Task list

`plan_tracker init` receives the brief's or the confirmed task list verbatim; the repair reads its statuses for the `paths-exist` evidence and never rewrites it. "Exact" restoration in `brief-contract.md` stays true.

### Unchanged

`plan_check`, the stamp gate in `extensions/phase-tracker.ts`, `writing-plans` Self-Review, `amendment-surface.md`, and `gauntlet-handoff`. No extension or bin change; `flowGuards` settings unchanged.

## Errors and edge cases

- Scope test is observable: a finding closes only by the row whose `check`, `reason`, and evidence match; the stop fires before any write, so a stopped resume leaves the plan byte-identical to its pre-loop state.
- A dead `Modify:` row owned by a `pending` or `in_progress` task is a task that must change: stop, naming the task.
- A plan dirty before the loop (hand edits in progress) is repaired in place and never swept into a commit.
- A `table-closure` reason that names a task absent from the plan, or a row no existing task's work covers, stops: the owner cell is never remapped to pass closure.
- `verify`/`ship` briefs: the repair runs identically; a ship-stage brief still stops at `verify` in_progress as today.
- Resume's entry checks and the reconstruction confirmation run before the repair, so the human-confirmed statuses exist when the repair classifies and when `init` fires.

## Tests

No extension changes; `npm test` covers skill lint and the brief-grammar validator (no duplicated grammar line under `skills/`).

Per `AGENTS.md` "Change process", the edit changes what the agent does, so a new eval target `eval/gauntlet-resume/` is created from `eval/_template` (kind `text`; skill files `skills/gauntlet-resume/SKILL.md`, `reference/brief-contract.md`, `reference/reconstruction.md`) with `intent.md` and these samples; `node eval/run.mjs gauntlet-resume` runs before the finish:

| Sample | Input | Must hold |
|---|---|---|
| `quote-integrity-drift` | implement brief; `plan_check` FAIL with 5 `quote-integrity` findings on task-owned rows | the reply states each literal added to the named task body, the `plan_check` re-run, the commit command with subject `resume: plan citation repair - 5 findings`, then `skip plan`, `start implement`, `init` with the brief's list verbatim, and the line `Repaired plan: 5 findings (quote-integrity)` |
| `verification-literal-drift` | one `quote-integrity` finding on a `Verification`-owned row | the reply edits the header `**Verification:**` line, no task body; continues |
| `paths-exist-from-deleted-files` | 400 `paths-exist` "does not exist" findings on `Modify:` rows of `complete` tasks, deletion evidence present | the reply drops those rows and names no other edit; task names and count unchanged; no `Delete:` kind; receipt printed |
| `pending-owner-stops` | one `paths-exist` finding whose `Modify:` row belongs to a `pending` task | the reply prints `Repair stopped: paths-exist - ...` naming the task, states the plan is unchanged, no `init`, no commit |
| `absent-owner-stops` | a `table-closure` reason naming Task 3 while the plan has Tasks 1-2 | stop line; no owner remap; no `init`; no commit |
| `clean-pass-unchanged` | first `plan_check` PASS | no receipt line, no commit, restore as today |
| `staged-plan-stays-uncommitted` | the quote-integrity-drift input with `git status --porcelain -- <plan path>` printing `M  <plan path>` (a staged edit; working copy equals HEAD) | plan classified dirty before the loop and a copy saved outside the worktree; after the PASS no `git add` and no commit, the repair stays in the working copy; `skip plan`, `start implement`, `init` with the brief's list unchanged; receipt printed |

Text-kind samples judge the reply, not a filesystem; must-holds are reply facts (the named edit, the command, the unchanged task snapshot, the tracker sequence).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "Handoff and resume" - one sentence: resume repairs plan citation drift and stops only when a task must change (major procedure); `doc/configuration.md:75` - the `plan_check` before implement-or-later clause gains "repairing plan citations on FAIL" (major procedure); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none (`AGENTS.md:139` routing row stays correct)

Materiality bar: `../brainstorming/reference/documentation-impact.md`.

## Out of scope

- A spec-to-plan completeness check in `plan_check`.
- A tolerant stamp or any `flowGuards` change.
- `gauntlet-handoff` running `plan_check` or recording findings in the brief.
- Reopening completed tasks on a changed literal; the verify-phase conformance review audits code against the spec.
- A `Delete:` kind in the task `Files:` grammar.

## Open questions

none
