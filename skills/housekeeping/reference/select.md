# Select

Resolve the argument with the first matching row. Treat a trailing number after a directory or PR argument as that run's file budget.

| Argument | Input |
|---|---|
| `#N`, a bare number, `owner/repo#N`, or a pull-request URL | PR |
| An existing directory inside this repo | directory |
| None | uncommitted |
| Anything else | Stop, naming the directory, no-argument and PR forms; end per Report. |

After resolving an input, create the run folder with `mktemp -d "${TMPDIR:-/tmp}/housekeeping.XXXXXX"`. Name it on every later stop. Resolve the primary checkout and the actual default branch from Git metadata, not an assumed branch name.

## Admission and run fields

Apply the selected column before checking any file. Write the resulting fields to `<run>/run.md`; later steps consume the fields, not the input name.

| Field | directory | uncommitted | PR |
|---|---|---|---|
| Precondition | Primary checkout, default branch checked out; fetch `origin <default>` and require local HEAD equal to `origin/<default>`; require the worktree-home check below. | Primary checkout, default branch checked out. | Open PR in this repo, draft or ready; session outside its worktree; non-primary worktree clean and equal to the PR's remote head; push dry-run succeeds. |
| Candidates | Tracked files under the directory, minus every file with an uncommitted change, staged or unstaged. | Modified, staged and untracked files. | Files added, modified or renamed against the PR merge-base. |
| `root` | Primary checkout | Primary checkout | PR worktree |
| `rules-from` | Working tree | Working tree | Merge-base commit |
| `picks` | fix, ticket, ignore | fix, ignore | fix, ignore |
| `bounds` | on | off | off |
| `delivery` | `pr-per-class` | `in-place` | `commit-push` |
| `parallel` | 8 on pi, 1 on Claude Code | 1 | 1 |

For a PR, read the worktree reuse table in [assessment](../../gatekeep-pr/reference/assessment.md). Reuse a worktree on its branch by that table's fast-forward-only path, at any path except the primary; otherwise create it by the sequence below. Apply that table's push dry-run. Record the push target and merge-base.

| Failed observation | Stop before Check |
|---|---|
| Directory or uncommitted run outside the primary or off the default branch | Name the PR input in one line: use `/skill:housekeeping <PR>`. |
| Directory HEAD differs from fetched `origin/<default>` | State the two commits; a fix PR must not carry unpushed primary commits. |
| PR closed, merged or in another repo | Name that state or repo. |
| PR head checked out in the primary | Ask the human to check out the default branch there to free the PR branch. |
| PR worktree dirty or diverged | Name the dirt or divergent commits; change nothing. |
| PR push dry-run failed | Carry its reason; do not offer an ignore-only walk. |
| Session inside the PR worktree | Name the primary checkout as the required session location; head instructions are already loaded here. |

End each stop per Report.

## Selection

Use one filter for every input's candidate set. Drop every path matching an ignore rule, including tracked paths, using `git check-ignore --no-index`. Drop deleted paths. For a rename keep its new path and skip its old path. Preserve path boundaries: a directory selects its descendants, not a sibling with the same prefix. Use Git's path-safe listings for paths containing whitespace. Exclude symlinks and binary files before the split below.

Resolve dirs once from the session checkout with `gauntlet_setting({ key: "flowGuards" })`: use its `specDirs` and `planDirs`; on a harness without that tool, use spec dirs `doc/specs`, `docs/specs` and plan dirs `doc/plans`, `docs/plans`. Record the dirs in `<run>/run.md` and carry every returned `errors` entry into Report's rule-sources list. For a PR, use the same session value, not a settings file at the merge-base. Match a dir's components as a contiguous run in the path's components, so `services/x/doc/specs/a.md` is in `doc/specs`.

Skip each candidate in a plan dir before populating either list. Put each surviving candidate in a spec dir in `specs`, sorted, outside `budget`; keep it out of `files`. Sort the remaining paths and take at most `budget` into `files`. Set `budget` to the argument's number, else the overrides `## housekeeping` value, else 200; read no other selection setting from the overrides file. Apply rule-source path skips at Check, not here. List files past the budget, symlinks, binary files, and directory candidates with uncommitted changes in `not-checked`, each with its reason. Skip ignored, deleted and plan-dir paths without checking them.

Record `commit` as HEAD of `root` at Select. Record changed line ranges per selected file for a change-based selection. Keep `files`, `specs`, `not-checked`, the worktree home and the push target in `<run>/run.md`. With both `files` and `specs` empty, skip Check, Decide and Fix and go to Report. With non-empty `specs` and empty `files`, go to Check.

## Worktree sequence

Use this sequence for every PR or fix worktree. Do not invoke `/skill:using-git-worktrees`: its creator can edit the primary and cannot be pinned through the override's `create:` command to the required commit.

1. Read only `home:` from the overrides `## using-git-worktrees`, defaulting to `<primary>/.worktrees/<name>`.
2. At Select, require a home inside the primary to be ignored by Git. On failure, stop per Report naming the ignore line the human must add; add nothing yourself.
3. Run `git -C <primary> worktree add` at that home from the explicit commit or branch, one creation at a time. Use the PR head branch for PR admission; take a fix branch's starting commit from the Fix step.
4. Confirm the created path in `git -C <primary> worktree list --porcelain`.

Commit nothing on the primary, ask no setup question, and never run the override's `create:` command.

## Expected state

Write `<run>/expected/` beside the record: copies of every `files` and `specs` file with its mode, the candidate paths that do not exist, `git ls-files --stage` and `git status --porcelain` from `root`. Preserve contents, not just HEAD and status, so a second edit to an already-dirty file is visible. Check compares this state before Decide; Fix compares it before each class and advances the copies only after a kept class. Never advance the index listing for `delivery: in-place`.
