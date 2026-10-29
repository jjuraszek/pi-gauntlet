# Handoff brief contract (gauntlet-resume + gauntlet-handoff supplementary)

Consumed by `gauntlet-resume/SKILL.md` (consumer) and `gauntlet-handoff/SKILL.md`
(producer). Grammar lives only here; both skills cite this file and inline none of it
(`scripts/ci.mjs` drift lint). Coupled to pi-cohort's `handoff` skill (pi-cohort >= 7.1.0, #18)
for exactly six headings - `# Handoff:`, `## Intent`, `## Repo state`, `## Decisions`,
`## Open questions`, `## Skills loaded` - and the `## Repo state` fields. `## Process
state` grammar and its consumer rules are owned here. Cohort drift is reconciled here
and nowhere else.

## Brief grammar

Headings, fixed order. A consumer keys on headings, never prose.

```markdown
# Handoff: <one line>
## Intent
## Repo state
## Decisions
## Open questions
## Skills loaded
## Process state
```

| Section | Content | Presence |
|---|---|---|
| `## Repo state` | one field per line: `toplevel`, `worktree: yes <path>` or `worktree: no`, `branch` (`detached` when none), `HEAD`, `base` (`unknown` when no remote resolves), `dirty: <porcelain>` or `dirty: clean`, `diff-stat` (`unavailable` when base unknown), `test cmd`; any field `unavailable` when its command failed; heading `## Repo state: not a git repo` outside git | always |
| `## Decisions` | bullets; rejected alternatives marked `rejected:` | always |
| `## Skills loaded` | frontmatter `name`s; `## Skills loaded: none` when none | always |
| `## Process state` | `phase_tracker status` then `plan_tracker status` verbatim; `Active task: <name|none>`; optional one or more consecutive `PR: <owner/repo#N>` / `Pre-rework head: <40-char sha>` pairs, one per record group, home first, in record order, only for a PR subject; optional single `Rework base: <40-char sha>` after all PR pairs; the line `Gate history not restored - re-validate before advancing.` | only when a phase is `in_progress` and no hotfix flow is in context |

For a loop ledger (line 1 exactly `# Ledger - loop engine`), replace `Active task` with these two fields, retaining both tracker status outputs and the gate-history line:

```text
Ledger: <path>
Last decision: <line>
```

Use the ledger path relative to the worktree and the last physical decision line, or `none` for an empty Decisions section. Read the ledger on disk; the brief is a pointer, not a second state carrier. Reject a block mixing these fields with `Active task`, missing either loop field, or carrying task rows with a ledger. Never initialize a task tracker for a ledger.

Consumer rules: process state absent -> plain handoff (the consumer starts its
own process from `## Intent`). Give valid ledger fields precedence over `No plan active.` and run ledger admission. Restore phase-only state for `No plan active.` only with no `Ledger` field. Load named skills as the consumer.

A brief is any text whose first line starts `# Handoff:` - a file on disk or pasted
inline. `## Repo state` is matched by prefix: `## Repo state` or
`## Repo state: not a git repo`.

## Producers

`gauntlet-handoff` is the only writer of `## Process state`; it appends to the file
cohort's `handoff` skill wrote, which ends at `## Skills loaded`. Layout, byte-exact:
one blank line, the heading on its own line, a blank line, the `phase_tracker status`
output verbatim, a blank line, the `plan_tracker status` output verbatim, a blank line,
`Active task: <name|none>`, then, only for a PR subject, one or more consecutive
`PR: <owner/repo#N>` / `Pre-rework head: <40-char sha>` pairs, one per record group,
home first, in record order, then optional single `Rework base: <40-char sha>` after all PR pairs and before the gate-history line -
unfenced, nothing after.
For a task plan, set `Active task` to the first `→` task name, else `none` (also for `No plan active.`). For a line-1 ledger, read its path and last decision and use the loop alternative above, retaining the optional PR pairs and rework base before the gate-history line. Copy the full rework base only from the top-level record when present; never invent a boundary for incomplete sync. Copy only top-level record pairs, without titles; `Threads:` and record `### PR #<N>` subsections are not brief fields. For N=1 emit one pair; without a Rework record use the ordinary layout.

Example appended block (the fence is documentation; the brief carries no fence):

```text

## Process state

Phases:
  ⊘ brainstorm (resume: <spec path>)
  ⊘ plan (resume: pasted brief)
  → implement(W2)
  ○ verify
  ○ ship

Plan: 1/3 done (1 in progress, 1 pending)

  ✓ [0] W1: contract
  → [1] W2: producer
  ○ [2] W2: consumer

Active task: W2: producer
Gate history not restored - re-validate before advancing.
```

## Tracker output grammar

Must match `formatStatus` in the phase-tracker and plan-tracker extensions.

```
Phases:
  ✓ brainstorm
  → implement(W2)
  ○ verify (reason)
```

Glyphs `✓` complete, `→` in_progress, `⊘` skipped, `○` pending; `(reason)` suffix when
set; `name(substep)` only on the in-progress phase.

```
Plan: 2/5 done (1 in progress, 2 pending)

  ✓ [0] <name>
  → [1] <name>
```

or `No plan active.`. Task glyphs `✓` complete, `→` in_progress, `✗` failed, `⊘` skipped,
`○` pending, mapping 1:1 onto `plan_tracker init` `{name, status}` statuses.

Parse stops (print the offending line, make no tracker call):

- a task line not matching `^\s*[✓→✗⊘○] \[\d+\] .+$` - the "unparsable process-state
  task line" stop;
- a process-state section whose phase block shows all `○` - contradictory (the producer
  emits the section only with an in-progress phase);
- a phase block with more than one `→` line - contradictory (the tracker holds one active
  phase; print both lines).

## Process-state restore

Before any tracker write, read the optional ordered PR pairs. Fetch branch identity
from the first pair only (home) with
`gh pr view <N> --repo <owner/repo> --json headRefName`. Compare `headRefName` with
`git -C <worktree> branch --show-current`. A mismatch stops with
`brief names PR #N on <headRefName>, worktree is on <branch>`, substituting the observed PR number and both actual branch names, never literal placeholders; a failed fetch stops
with its error. Do not fetch later pairs' branches for this identity check.
Read the worktree spec's `## Rework record` and compare its top-level `PR:` identities
(without titles) with the brief identities in order. A mismatch stops with
`brief lists <brief order>, record lists <record order>`, substituting both observed
ordered lists, before any tracker call. Resolve the spec through reconstruction's
candidate rules below before this comparison; artifact presence supplies no approval.
Carry all paired full pre-rework heads downstream in their original order.
Carry the optional full rework base downstream; reconstruction prefers it over the first pair's head as its scan base. Without optional pairs,
retain ordinary restoration.
Preserve the entry checks, standing-grant validation, plan repair, and task snapshot;
PR identity implies no approval or gate evidence.

Facts that fix the order (from the extensions):

- Arming happens only on `start brainstorm`; `reset` disarms; `skip` and `complete`
  preserve it.
- `plan_check` stamps only inside an armed flow; unarmed it returns
  `PASS (no flow to stamp)`.
- `start implement` is rejected without a current `plan_check` stamp.
- `skip` has no state precondition and takes a `reason`; one phase is active at a time.
- `complete verify` is blocked without a fresh `conformance-reviewer` dispatch when
  closure review is enforced.
- `plan_tracker init` on an in-progress implement with every task `complete`/`skipped`
  auto-completes implement.

Per-stage call table, keyed by the brief's active phase (`→`). Use
`R = resume: <brief file or "pasted brief">` for plan/implement/verify skips and
`S = resume: <spec path>` for brainstorm skips. Resolve `<spec path>` as
`reconstruction.md` "Candidates" does, to an absolute path under the worktree: the single
`*.md` spec added after the candidate base under `flowGuards.specDirs`, or a spec tracked from that base when
a plan added after base pairs with it by basename. Zero specs -> stop; more than one ->
human picks. The consumer carries this path to its entry check 6 and its post-restore
announcement without re-resolving it.

Honor SKILL.md entry check 6's deferred stop before any process-state arming call below; carry the resolved spec path without re-discovery. For brainstorm-stage briefs, resolve any existing spec through these candidate rules and run entry check 6's deferred-header admission before `start brainstorm`; with zero specs, restore brainstorm without a spec. Keep grant decoding exempt for this stage. A handoff after option 6's push succeeded but PR creation failed still has brainstorm in_progress; its deferred header stops restoration, not the ordinary gate.

| Active | Calls, in order |
|---|---|
| brainstorm | `start brainstorm`; `substep` if the brief shows one |
| plan | `start brainstorm`; `skip brainstorm S`; `start plan`; `substep` if shown |
| implement with ledger | Read ledger line 1; resolve its path-only `**Spec:**` header; run entry checks 1-6, naming check 6 (Grant field); `start brainstorm`; `skip brainstorm` reason `resume: <spec path>`; `start plan`; `plan_check` on the absolute ledger path; on PASS `skip plan` reason `resume: <spec> (loop engine)` using the resolved absolute spec path as `<spec>`; `start implement`; no `plan_tracker init`; apply the shared cap boundary in `reconstruction.md` "Spec with ledger" step 4 before continuation; render cap, rows and decisions; continue at loop step 5. Follow `reconstruction.md` "Spec with ledger" for this self-contained ordered restore. On FAIL stop with findings, never `## Plan repair` or writing-plans. |
| implement with task plan | `start brainstorm`; `skip brainstorm S`; `start plan`; `plan_check({ planPath })`; on FAIL run `## Plan repair`; on PASS `skip plan R`; `start implement`; `substep` if shown; `plan_tracker init` |
| verify | `start brainstorm`; `skip brainstorm S`; `start plan`; `plan_check({ planPath })`; on FAIL run `## Plan repair`; on PASS `skip plan R`, then `skip implement R`; `start verify`; `substep` if shown; `plan_tracker init`. Never call `start implement`. |
| ship | as verify. Restoration stops at verify in_progress: `complete verify` needs a fresh conformance dispatch and `skip verify` would bypass a real gate. Announce that the closure review re-runs before ship |

For a ledger brief, pair by the ledger's path-only `**Spec:**` header, not basename; require the resolved spec under `flowGuards.specDirs` and the ledger under its sibling plans directory. Keep same-repository binding and human confirmation. For every ledger brief apply the shared cap boundary in `reconstruction.md` "Spec with ledger" step 4 before dispatch or verification, retaining its legacy stop and original-phase grant continuation. For verify/ship ledger briefs, use the ledger restore sequence through `skip plan`, then `skip implement R`; `start verify`, with no task tracker. Continue verify/ship ledger briefs in `/skill:loop-implementation` `After the loop` from step 1 (full ledger verification), after the already-restored `start verify`, retaining whole-diff code review, happy path when triggered, fresh conformance review and finishing without task-tracker calls. Ship still stops at verify for fresh conformance.

`planPath` (task-plan implement onward): the brief carries none. Resolve as reconstruction does
(`reconstruction.md`, "Candidates", including its `flowGuards.specDirs` resolution): the
single plan added after the candidate base, paired with `<specDir>/<same basename>` whether that
spec was added after base or tracked from base (`reconstruction.md` "Candidates");
resolve the selected plan to an absolute path under the worktree before `plan_check`.
Zero pairs -> stop; more than one -> human picks.

## Plan repair

Entered from the call table's `implement` row and from `reconstruction.md` "Spec with plan" step 2 when `plan_check` returns FAIL. Inputs: the findings, and the task list with statuses (the brief's, or the confirmed reconstruction snapshot) - read it for evidence, never rewrite it.

Before citation-table classification, route `baseline-line` and substantive `open-questions` findings through the continuation below. Keep the brief's or confirmed reconstruction's task snapshot (names, order, statuses) verbatim throughout; never take writing-plans step 7's fresh-plan initialization.

### Baseline continuation

On `baseline-line` or a substantive baseline-form `open-questions` finding, bring a landed fix named by the brief or human into the worktree through `/skill:using-git-worktrees` "the base branch advances" (rebase, or merge for a shared branch). Without a named fix, proceed directly to the rerun. Dispatch `plan-writer` per `/skill:writing-plans` "Author the plan" step 3: `agent: "plan-writer"`, `context: "fresh"`, `async: false`, `cwd: <absolute worktree>`, `phase: "plan-write"`, `acceptance: { level: "none", reason: "the parent plan_check owns acceptance" }`. Fill its fixed task template with the five absolute paths (worktree, spec, plan, writing-plans SKILL.md, its reference/plan-contract.md), then append `Findings: rerun baseline`. Let the writer run Baseline and regenerate its rows; never synthesize evidence or SHAs. On dispatch error, async handle, or missing/empty plan, stop and report without a parent-authored fallback.

Run `plan_check({ planPath })` in the parent after either child reply. Route the result:

| Result / substantive row | Continuation |
|---|---|
| `PLAN WRITTEN` + `PASS`, section absent or exactly `- none` | Return to the originating restore's remaining steps: call table from `skip plan R` through the appropriate implement/verify continuation (ship restores at verify), or reconstruction step 3. Initialize `plan_tracker` only from the saved task snapshot, never the generated fresh-plan list. |
| `- Task N: ... fails on <sha>` | Present the task, command, base SHA and exit code, then writing-plans step 6's three options, one per line: **fix-first** - `/skill:shape-ticket` for the base failure (its gate applies), then pause; **narrow** - human supplies filter or path text, re-dispatch with `Findings: Task N Tests: narrow to <text>`; **amend** - brainstorming's `reference/amendment-surface.md` section 5. Print a `Recommendation:` line and wait for selection. |
| Global or contamination rows (`Baseline: worktree dirty`, `Baseline: in-flight source edits`, `dirtied tracked source`, `moved HEAD`) | Take writing-plans step 6's restore-and-rerun path, not the menu. Name paths and causes; the parent's own in-flight work uses its own commit step (doc-only paths can be listed under `In-flight:`); ask the human to commit, discard, or move other paths and test-produced dirt. Never clean automatically. After restoration re-dispatch with `Findings: rerun baseline`, then parent check. |
| Other substantive `open-questions` rows (contract questions) | Present the rows, wait for answers, re-dispatch per step 3 with answers in `Findings:`, then parent check and this same return route. |
| Other checks | Use the citation table and its three-round rollback below. |

End a turn awaiting selection, restoration, or answers with phase `plan` retained in_progress and no tracker initialization of any kind. Keep the snapshot for the eventual return. Resolved failure rows disappear only through the writer's Baseline rerun; resume writes no Open Questions rows. Plans without `baseline:` bullets intentionally enter this continuation on their `baseline-line` finding.

### Citation repair

Record the plan's state before any write: tracked and clean when `git -C <worktree> ls-files --error-unmatch -- <plan path>` exits 0 and `git -C <worktree> status --porcelain -- <plan path>` prints nothing (index and working copy both match HEAD; a staged edit alone makes it dirty); otherwise copy the file to a temp path outside the repository before citation repair writes anything. Any non-empty porcelain output, including staged-only `M  <plan path>`, takes this copy path even when tracked and the working copy equals HEAD. Never substitute `git checkout` for the dirty or untracked plan's snapshot or saved-copy restore.

Classify every finding against the table by its `check` and `reason`, gathering the row's evidence first. One finding with no row -> stop (below) before any write.

| Finding (`check`, `reason`) | Evidence | Edit |
|---|---|---|
| `anchor-resolution`, range outside section or line shift | the anchor's heading string matches exactly one current spec heading | set the `**Spec:**` `L<n>-L<m>` range to the current span of that section that holds the task body's existing literals |
| `quote-integrity`, task-owned row | the row's anchor already resolves (repair anchors first) | add the missing backtick literal to the owning task's body; never replace or remove task text |
| `quote-integrity`, `Verification`-owned row | as above | add the missing literal to the header `**Verification:**` line |
| `table-closure`, row anchor not in the owner's `**Spec:**` set | the owner cell names an existing task whose body does the row's requirement | move the row's anchor together with that same owner's `**Spec:**` anchor; the owner cell never changes |
| `paths-exist`, `Modify: path "<p>" does not exist` | the owning task is `complete` or `skipped` in the task list, and `git -C <worktree> log --diff-filter=D --format=%h -1 -- <p>` is non-empty | drop that `Modify:` row |
| `paths-exist` or `tests-block`, a `Test:` path that does not exist or a `Tests:` segment not anchored | `git -C <worktree> log --diff-filter=R --format= --name-status -M -1 -- <old> <new>` shows the rename `<old>` -> `<new>` | substitute `<new>` for `<old>` in the `Test:` line and in the `Tests:` command; nothing else in the command changes |

Every other `check` (`input`, `placeholder-scan`, `header-entrypoint`, `header-happy-path`, `waiver-literal`, `wave-file-disjointness`, `internal`) and every reason not listed (a missing `Files:` block, an invalid or empty glob, a missing or ambiguous heading, a `pending`/`in_progress` owner of a dead `Modify:` row, a command broadening) has no row. Task names, count, order, wave membership, `Solo:` lines, the owner column, and task text beyond an added literal or a substituted path never change.

Loop: write every classified edit, re-run `plan_check({ planPath })`, classify any new finding the same way; at most 3 rounds.

PASS with the plan tracked and clean before the loop -> commit the plan alone:

```bash
git -C <worktree> add -- <plan path> && git -C <worktree> commit -q -m "resume: plan citation repair - <n> findings" -- <plan path>
```

The subject is not `amend:`, so `finishing-a-development-branch` Step 4's digest ignores it; a failed commit stops with git's output. PASS with the plan untracked or dirty before the loop -> leave the repair in the working copy; it lands with the next task commit. Then continue the originating route: the call table from `skip plan R`, or reconstruction step 3.

Stop (a finding with no row, or a finding surviving the third round): when a round wrote the plan, restore its pre-loop bytes (`git -C <worktree> checkout -- <plan path>` when tracked and clean, else the saved copy) - a stop before the first write runs no git command; print the findings (a dead `Modify:` row prefixed with its owning task, e.g. `Task 5:`), leave `plan` in_progress with no `init`, and print one line:

- no row: `Repair stopped: <check> - <reason> is outside citation repair; the plan file is unchanged. Edit the plan (task changes allowed), then re-run /skill:gauntlet-resume.`
- third round: `Repair stopped: <check> - <reason> survived 3 rounds. Edit the plan, then re-run /skill:gauntlet-resume.`

Resume never edits the spec or writes an Open Question itself; the dispatched plan-writer owns generated baseline rows.

"Exact" restoration binds: the active phase identity and substep, and the plan task list
(names, order, statuses) verbatim. Prior phases show `⊘ (resume: ...)` regardless of the
brief's glyph - skip-arming is the mechanism and completing priors would fabricate gated
history. `No plan active.` -> no `init` call.

Before `init`, validate feasibility against the tracker's own rules:

- pending-suffix order - every `○` task must trail every non-pending task;
- the implement auto-complete edge - an implement brief whose tasks are all
  complete/skipped is infeasible as stated; propose verify as the target and ask.

Every restore ends with:

```
Gate history not restored; re-validating `<task>` before any stage advance
```

For a ledger, use `ledger rows` as `<task>` and render the current rows and last decision from disk.

For a task plan, `<task>` is the brief's `Active task`, else the first in-progress task, else `none`
(whole-deliverable re-validation). Gate history, closure-review evidence, and fix rounds
are never inferred or restored; a ship-stage brief resumes at verify.

A restore that ran `## Plan repair` prints `Repaired plan: <n> findings (<comma-separated check names, deduplicated>)` on its own line directly before the closing line; the `Standing grant` line (SKILL.md "Post-restore continuation") keeps its place after the closing line. A first-check PASS prints no receipt and makes no commit.
