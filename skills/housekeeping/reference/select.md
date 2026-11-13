# Select

With no argument, resolve the primary checkout and actual default branch first from Git metadata, then test the shared primary/default-branch precondition before picking an input. Run the status observation once; require exit 0 before using either outcome below. Untracked files count; ignored files do not. Keep the chosen input even when Selection skips every uncommitted path. Resolve an explicit argument with the first matching row. Treat a trailing number after a directory or PR argument as that run's file budget.

| Argument | Input |
|---|---|
| `#N`, a bare number, `owner/repo#N`, or a pull-request URL | PR |
| An existing directory inside this repo | directory |
| None, and `git -C <primary> status --porcelain --untracked-files=normal` prints at least one line | uncommitted |
| None, and that command prints nothing | unpushed |
| Anything else | Stop, naming the directory, no-argument and PR forms; end per Report. |

After resolving an input, create the run folder with `mktemp -d "${TMPDIR:-/tmp}/housekeeping.XXXXXX"`. Name it on every later stop. Resolve the primary checkout and the actual default branch from Git metadata, not an assumed branch name.

## Admission and run fields

Apply the selected column before checking any file. Write the input and resulting fields to `<run>/run.md`; never re-resolve it. Later steps consume the fields, not the input name.

| Field | directory | uncommitted | PR | unpushed |
|---|---|---|---|---|
| Precondition | Primary checkout, default branch checked out; fetch `origin <default>` and require local HEAD equal to `origin/<default>`; require the worktree-home check below. | Primary checkout, default branch checked out. | Open PR in this repo, draft or ready; session outside its worktree; non-primary worktree clean and equal to the PR's remote head; push dry-run succeeds. | Primary checkout, default branch checked out, `git status --porcelain --untracked-files=normal` empty; fetch `origin <default>`. With `git rev-list --count origin/<default>..HEAD` at zero, end as an empty selection. Otherwise require `origin/<default>` to be an ancestor of HEAD, `git branch -r --contains HEAD` to print nothing, and no delivery receipt to name HEAD. |
| Candidates | Tracked files under the directory, minus every file with an uncommitted change, staged or unstaged. | Modified, staged and untracked files. | Files added, modified or renamed against the PR merge-base. | Files added, modified or renamed across `origin/<default>..HEAD`. |
| `root` | Primary checkout | Primary checkout | PR worktree | Primary checkout |
| `rules-from` | Working tree | Working tree | Merge-base commit | Working tree |
| `picks` | fix, ticket, ignore | fix, ignore | fix, ignore | fix, ignore |
| `bounds` | on | off | off | off |
| `delivery` | `pr-per-class` | `in-place` | `commit-push` | `amend` |
| `parallel` | 8 on pi, 1 on Claude Code | 1 | 1 | 1 |

At zero ahead, return no candidates whether HEAD equals or is behind the fetched ref; apply the ancestor stop only at one or more commits ahead.

For the receipt check, resolve `<common dir>` with `git -C <primary> rev-parse --path-format=absolute --git-common-dir`. Require no file under `<common dir>/gauntlet/receipts/` to hold a `delivered:` line naming `squash <HEAD's full SHA>`. Treat a missing folder as no receipt; read receipts without writing or removing them.

For a PR, read the worktree reuse table in [assessment](../../gatekeep-pr/reference/assessment.md). Reuse a worktree on its branch by that table's fast-forward-only path, at any path except the primary; otherwise create it by the sequence below. Apply that table's push dry-run. Record the push target and merge-base.

| Failed observation | Stop before Check |
|---|---|
| Directory or no-argument run outside the primary or off the default branch | Name the PR input in one line: use `/skill:housekeeping <PR>`. |
| No-argument run: the status observation exits nonzero | Carry its error; pick neither input. |
| Unpushed run: fetch of `origin <default>` failed, or `origin/<default>` does not exist | Carry the fetch error; never treat it as nothing to check. |
| Unpushed run: one or more commits ahead and fetched `origin/<default>` is not an ancestor of HEAD | State the two commits; an amend must not rewrite a commit the remote has moved past. |
| Unpushed run: `git branch -r --contains HEAD` prints a ref | Name the ref; an amend must not rewrite a commit a remote-tracking ref holds. |
| Unpushed run: a delivery receipt names HEAD as its squash | Name the receipt file; a coordinated-finish retry needs that commit reachable from the default branch. |
| Directory HEAD differs from fetched `origin/<default>` | State the two commits; a fix PR must not carry unpushed primary commits. |
| PR closed, merged or in another repo | Name that state or repo. |
| PR head checked out in the primary | Ask the human to check out the default branch there to free the PR branch. |
| PR worktree dirty or diverged | Name the dirt or divergent commits; change nothing. |
| PR push dry-run failed | Carry its reason; do not offer an ignore-only walk. |
| Session inside the PR worktree | Name the primary checkout as the required session location; head instructions are already loaded here. |

End each stop per Report.

## Selection

For an uncommitted run, count `git rev-list --count origin/<default>..HEAD` against the local ref without fetching. With a positive count, add `<n> commits ahead of the local origin/<default> ref (not fetched) - not checked while the checkout has uncommitted files` to `not-checked`. With no local ref or a zero count, add nothing. Treat this as a comparison with the local ref, not a current reading of the remote.

Use one filter for every input's candidate set. Drop every path matching an ignore rule, including tracked paths, using `git check-ignore --no-index`. Drop deleted paths. For a rename keep its new path and skip its old path. Preserve path boundaries: a directory selects its descendants, not a sibling with the same prefix. Use Git's path-safe listings for paths containing whitespace. Exclude symlinks and binary files before the split below.

Resolve dirs once from the session checkout with `gauntlet_setting({ key: "flowGuards" })`: use its `specDirs` and `planDirs`; on a harness without that tool, use spec dirs `doc/specs`, `docs/specs` and plan dirs `doc/plans`, `docs/plans`. Record the dirs in `<run>/run.md` and carry every returned `errors` entry into Report's rule-sources list. For a PR, use the same session value, not a settings file at the merge-base. Match a dir's components as a contiguous run in the path's components, so `<root>/services/x/doc/specs/a.md` is in `doc/specs`.

Skip each candidate in a plan dir before populating either list. Put each surviving candidate in a spec dir in `specs`, sorted, outside `budget`; keep it out of `files`. Sort the remaining paths and take at most `budget` into `files`. Set `budget` to the argument's number, else the overrides `## housekeeping` value, else 200; read no other selection setting from the overrides file. Apply rule-source path skips at Check, not here. List files past the budget, symlinks, binary files, and directory candidates with uncommitted changes in `not-checked`, each with its reason. Skip ignored, deleted and plan-dir paths without checking them.

Record `commit` as HEAD of `root` at Select. Record changed line ranges per selected file for a change-based selection. For an unpushed run, record changed line ranges against `origin/<default>`. Keep `commit` as the last unpushed commit; add no remote-head field. Keep `files`, `specs`, `not-checked`, the worktree home and the push target in `<run>/run.md`. With both `files` and `specs` empty, skip Check, Decide and Fix and go to Report. With non-empty `specs` and empty `files`, go to Check.

## Worktree sequence

Use this sequence for every PR or fix worktree. Do not invoke `/skill:using-git-worktrees`: its creator can edit the primary and cannot be pinned through the override's `create:` command to the required commit.

1. Read only `home:` from the overrides `## using-git-worktrees`, defaulting to `<primary>/.worktrees/<name>`.
2. At Select, require a home inside the primary to be ignored by Git. On failure, stop per Report naming the ignore line the human must add; add nothing yourself.
3. Run `git -C <primary> worktree add` at that home from the explicit commit or branch, one creation at a time. Use the PR head branch for PR admission; take a fix branch's starting commit from the Fix step.
4. Confirm the created path in `git -C <primary> worktree list --porcelain`.

Commit nothing on the primary, ask no setup question, and never run the override's `create:` command.

## Expected state

Write `<run>/expected/` beside the record: copies of every `files` and `specs` file with its mode, the candidate paths that do not exist, `git ls-files --stage` and `git status --porcelain` from `root`. Preserve contents, not just HEAD and status, so a second edit to an already-dirty file is visible. Check compares this state before Decide; Fix compares it before each class and advances the copies only after a kept class. Never advance the index listing for `delivery: in-place`.
