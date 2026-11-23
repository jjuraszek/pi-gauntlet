# Plan repair (gauntlet-resume supplementary)

Read only after `plan_check` returns FAIL on a task plan. A ledger never enters this file.

## Plan repair

Entered from `restore-plan.md` when `plan_check` returns FAIL: its call table's implement, verify and ship rows, and `## Spec with plan` step 2. Inputs: the findings, and the task list with statuses (the brief's, or the confirmed reconstruction snapshot) - read it for evidence, never rewrite it.

Before citation-table classification, route `baseline-line` and substantive `open-questions` findings through the continuation below. Keep the brief's or confirmed reconstruction's task snapshot (names, order, statuses) verbatim throughout; never take writing-plans step 7's fresh-plan initialization.

### Baseline continuation

On `baseline-line` or a substantive baseline-form `open-questions` finding, bring a landed fix named by the brief or human into the worktree through `/skill:using-git-worktrees` "the base branch advances" (rebase, or merge for a shared branch). Without a named fix, proceed directly to the rerun. Dispatch `plan-writer` per `/skill:writing-plans` "Author the plan" step 3: `agent: "plan-writer"`, `context: "fresh"`, `async: false`, `cwd: <absolute worktree>`, `phase: "plan-write"`, `acceptance: { level: "none", reason: "the parent plan_check owns acceptance" }`. Fill its fixed task template with the four absolute paths (worktree, approved spec, plan, plan contract), then append `Findings: rerun baseline`. Let the writer run Baseline and regenerate its rows; never synthesize evidence or SHAs. On dispatch error, async handle, or missing/empty plan, stop and report without a parent-authored fallback.

Run `plan_check({ planPath })` in the parent after either child reply. Route the result:

| Result / substantive row | Continuation |
|---|---|
| `PLAN WRITTEN` + `PASS`, section absent or exactly `- none` | Return to the originating restore's remaining steps: the call table from `skip plan R` through the appropriate implement/verify continuation (ship restores at verify), or `## Spec with plan` step 3. Initialize `plan_tracker` only from the saved task snapshot, never the generated fresh-plan list. |
| `- Task N: ... fails on <sha>` | Present the task, command, base SHA and exit code, then `../../gauntlet/plan/open-questions.md`'s three options, one per line: **fix-first** - `/skill:shape-ticket` for the base failure (its gate applies), then pause; **narrow** - human supplies filter or path text, re-dispatch with `Findings: Task N Tests: narrow to <text>`; **amend** - brainstorming's `reference/amendment-surface.md` section 5. Print a `Recommendation:` line and wait for selection. |
| Global or contamination rows (`Baseline: worktree dirty`, `Baseline: in-flight source edits`, `dirtied tracked source`, `moved HEAD`) | Take `../../gauntlet/plan/open-questions.md`'s restore-and-rerun path, not the menu. Name paths and causes; the parent's own in-flight work uses its own commit step (doc-only paths can be listed under `In-flight:`); ask the human to commit, discard, or move other paths and test-produced dirt. Never clean automatically. After restoration re-dispatch with `Findings: rerun baseline`, then parent check. |
| Other substantive `open-questions` rows (contract questions) | Present the rows, wait for answers, re-dispatch per step 3 with answers in `Findings:`, then parent check and this same return route. |
| Other checks | Use the citation table and its three-round rollback below. |

End a turn awaiting selection, restoration, or answers with phase `plan` retained in_progress and no tracker initialization of any kind. Keep the snapshot for the eventual return. Resolved failure rows disappear only through the writer's Baseline rerun; resume writes no Open Questions rows. Plans without `baseline:` bullets intentionally enter this continuation on their `baseline-line` finding.

### Citation repair

Record the plan's state before any write: tracked and clean when `git -C <worktree> ls-files --error-unmatch -- <plan path>` exits 0 and `git -C <worktree> status --porcelain -- <plan path>` prints nothing (index and working copy both match HEAD; a staged edit alone makes it dirty); otherwise copy the file to a temp path outside the repository before citation repair writes anything. Any non-empty porcelain output, including staged-only `M  <plan path>`, takes this copy path even when tracked and the working copy equals HEAD. Never substitute `git -C <worktree> checkout` for the dirty or untracked plan's snapshot or saved-copy restore.

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

PASS with the plan tracked and clean before the loop -> read [commit-message.md](../../gauntlet/commit-message.md), take the entire subject verbatim from its Plan citation repair row, and commit the plan alone with that message on stdin:

```bash
git -C <worktree> add -- <plan path> && git -C <worktree> commit -q -F - -- <plan path>
```

A failed commit stops with git's output. PASS with the plan untracked or dirty before the loop -> leave the repair in the working copy; it lands with the next task commit. Then continue the originating route: the call table from `skip plan R`, or `## Spec with plan` step 3.

Stop (a finding with no row, or a finding surviving the third round): when a round wrote the plan, restore its pre-loop bytes (`git -C <worktree> checkout -- <plan path>` when tracked and clean, else the saved copy) - a stop before the first write runs no Git command; print the findings (a dead `Modify:` row prefixed with its owning task, e.g. `Task 5:`), leave `plan` in_progress with no `init`, and print one line:

- no row: `Repair stopped: <check> - <reason> is outside citation repair; the plan file is unchanged. Edit the plan (task changes allowed), then re-run /skill:gauntlet-resume.`
- third round: `Repair stopped: <check> - <reason> survived 3 rounds. Edit the plan, then re-run /skill:gauntlet-resume.`

Resume never edits the spec or writes an Open Question itself; the dispatched plan-writer owns generated baseline rows.

A restore that ran `## Plan repair` prints `Repaired plan: <n> findings (<comma-separated check names, deduplicated>)` on its own line directly before the closing line; the `Standing grant` line (SKILL.md "Post-restore continuation") keeps its place after the closing line. A first-check PASS prints no receipt and makes no commit.
