# PR-head worktree

## Select home and stop before writes

For a caller passing PR values, follow this reference instead of `using-git-worktrees/SKILL.md` Steps 0 and 1. Derive ROOT from the absolute git common directory as in Step 0, applying its submodule guard. Resolve the worktree home through the existing overrides/native-tool/wrapper contract; default to `$ROOT/.worktrees/<name>`. Set `<name>` to `headRefName` with every `/` replaced by `-`. Never adopt the session's linked tree unless it is the selected home on `headRefName`.

Run `git -C "$ROOT" fetch origin`, then check these stops in order before creating or modifying any file in the primary or a worktree, or running `git worktree add`.

| Observable case | Exact stop |
|---|---|
| `isCrossRepository` true | `PR #N's head lives on fork <headRepository.nameWithOwner>; rework needs an in-repo branch.` |
| `headRefName` listed by `git -C "$ROOT" worktree list --porcelain` at another path, including `.worktrees/pr-<N>` | `branch <headRefName> is checked out at <path>; finish or remove that worktree first.` |
| `git -C "$ROOT" rev-parse --verify -q <headRefOid>^{commit}` fails after fetch, or `origin/<headRefName>` differs from `headRefOid` | `PR #N head <headRefOid7> is not reachable (origin/<headRefName> is at <sha7>); the branch moved.` |
| Local branch exists and `git -C "$ROOT" merge-base --is-ancestor <headRefName> origin/<headRefName>` exits 1 | `local branch <headRefName> is at <sha7>, not an ancestor of origin/<headRefName> (<sha7>); rework needs the PR head.` |

## Provision the exact head

Apply the first matching row after all stops pass. Keep the process cwd unchanged and carry WORKTREE as a value.

| State | Action |
|---|---|
| Selected home is already on `headRefName` | Run Step 3's dirty-tree ask first; do not stash or clean automatically. Then run `git -C "$WORKTREE" merge --ff-only origin/<headRefName>` and require HEAD equal to `headRefOid`; otherwise stop naming both SHAs. |
| No worktree, local branch exists | Only after ancestry proof, run `git -C "$ROOT" update-ref refs/heads/<headRefName> origin/<headRefName>`, then `git -C "$ROOT" worktree add "<home>" <headRefName>`. Never use `git -C "$ROOT" branch -f`. |
| No worktree, no local branch | Run `git -C "$ROOT" worktree add "<home>" <headRefName>`. Git's unique-remote DWIM resolves exactly one matching remote-tracking branch as `--track -b <headRefName> "<home>" origin/<headRefName>`; do not substitute the generic new-branch `-b` creation path. |

For fresh creation, apply Step 3's source-clean ask and the existing home safety checks after the ordered stops. Respect the resolved home and native tool/wrapper, but use an overrides `create:` only when it takes `<branch>` as an existing branch and contains no `-b`/`-B`. Otherwise run the built-in checkout above and add `create: override skipped (contains -b)` to the report. Resolve tokens and surface wrapper failures through the existing contract.

Verify `git -C "$WORKTREE" rev-parse HEAD` equals `headRefOid`. On a post-create head race, leave the tree intact and stop naming its path and both SHAs. Capture `PRE_REWORK_HEAD=<headRefOid>` and `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)` as full SHAs. In the Step 4 report use `Base: <headRefName> @ <sha7>` and add immediately after it:

```text
PR: <owner/repo#N>
Pre-rework head: <sha>
Base SHA: <sha7>
```

## Preserve pre-rework history

Advance by merge: preserve every commit reachable from PRE_REWORK_HEAD. Never `git rebase`, or use `reset` or `commit --amend` to replace a commit at or below that boundary. Keep the flow's appended-spec approval `commit --amend --no-edit` in `brainstorming/reference/spec-finalization.md` and appended-wave fold `reset --soft "$WAVE_BASE_SHA"` in `subagent-driven-development/SKILL.md` unchanged; require WAVE_BASE_SHA to descend from PRE_REWORK_HEAD.

## Merge the fetched base

Run `git -C "$WORKTREE" merge --no-ff --no-edit origin/<baseRefName>` and record the matching outcome:

| Outcome | Record and continuation |
|---|---|
| Base already an ancestor | `merge: no-op - head contains origin/<base>`; no commit. |
| Clean merge | `merge: <sha7>`; this merge is the first rework commit. |
| Conflicts | Follow the helper recipe below. |

Snapshot `git -C "$WORKTREE" status --porcelain` before helper dispatch. Get conflicted paths with `git -C "$WORKTREE" diff --name-only --diff-filter=U`. Dispatch one fresh foreground `implementer`, `cwd` the worktree, `async: false`, with that exact file list, fetched base, and SCOPED_TEST_COMMANDS. Require resolution of every listed file preserving both sides' intent, exactly the supplied scoped commands, and `git -C "$WORKTREE" add` for every resolved file. Require return `done`, or `done - contract exception: <why>` when resolution changes a PR or bound-ticket obligation. Forbid helper commits, aborts, and edits outside the list.

Read the first-found overrides file from BASE_SHA, not the conflicted tree: `git -C "$ROOT" show <BASE_SHA>:<overrides path>`. Use SCOPED_TEST_COMMANDS only from a documented file-scoped runner under `## PR gate` or `## verification-before-completion` with `requires credentials` not `true`. Missing runner or `requires credentials: true` means `none`, with the reason recorded as `none run (<reason>)`. Never infer file scope from a full-suite script such as `npm test`.

Continue only with an empty unmerged index (`git -C "$WORKTREE" diff --name-only --diff-filter=U`), every listed file staged (`git -C "$WORKTREE" diff --cached --name-only`), and the `git -C "$WORKTREE" status --porcelain` delta contained in the listed paths. Then complete with `git -C "$WORKTREE" commit --no-edit` and record `merge: <sha7>, <n> file(s) resolved, scoped tests <green | red in <file>: <tests> | none>`. Land a reported contract exception and name it in the spec's `## Rework record` `Changes:`.

For any failed helper/completion checks, run `git -C "$WORKTREE" merge --abort`, record `merge: unresolved - <files>`, and continue on the original unmerged head. Open the spec's Design with `merge origin/<base> and resolve <files>` as eventual Task 1. On every outcome, require the base-SHA constraint reads owned by `brainstorming/reference/pr-subject.md`.

Treat this merge, helper edits to the conflict list, and scoped conflict tests as the sole preapproval write/run exception outside spec directories. Run no other brainstorming tests, dispatch no reviewer, and push nothing; leave review of the merge to end-of-flow code review.

## Fetch unresolved review threads

Run this query; callers cite this owner rather than copying it:

```
gh api graphql --paginate -f query='query($o:String!,$r:String!,$n:Int!,$endCursor:String){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100,after:$endCursor){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated path line originalLine comments(first:100){pageInfo{hasNextPage endCursor} totalCount nodes{url body author{login} createdAt}}}}}}}' -F o=<owner> -F r=<repo> -F n=<N>
```

Merge every reviewThreads page and filter to `isResolved == false`. For each thread whose comments report `hasNextPage: true` (with `totalCount` exceeding the first page), fetch the remaining pages by thread id with a separate comment cursor:

```
gh api graphql --paginate -f query='query($id:ID!,$endCursor:String){node(id:$id){... on PullRequestReviewThread{comments(first:100,after:$endCursor){pageInfo{hasNextPage endCursor} nodes{url body author{login} createdAt}}}}}' -F id=<thread id>
```

Start that thread's follow-up query at its first comment page, then replace its initial comments with the complete paginated connection to avoid duplicates. Keep each thread's comment cursor separate from the reviewThreads cursor and fetch until its last page. Carry all comments in order: read the first request and every reply because replies can change the request. Render location as `<path>:<line>`, else `<path>:<originalLine> (outdated)`, else `<path>`. On fetch failure carry `threads: not fetched (<reason>)` to the gather draft and `Threads: not fetched (<reason>)` to the record; continue. On successful empty fetch record `Threads: none`.
