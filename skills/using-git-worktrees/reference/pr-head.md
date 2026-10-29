# PR-head worktree

## Select caller mode before PR reads

For `$ROOT`, `$BRANCH`, `REMOTE_BRANCH=existing`, follow companion mode below before reading any PR fields. For resolved home PR values, follow "Select home and stop before writes"; carry the caller's observed coordinated marked-home N>1 context for base-sync recovery only. Keep singleton PR and N-PR rework recovery unchanged.

### Companion identity and provisioning

Use caller `$ROOT` unchanged, not the session's git common directory; apply Step 0's submodule guard against that root. Use `$BRANCH` as the branch and the companion's repo identity in every stop, never a PR number. Run `git -C "$ROOT" fetch origin`, then repeat the live check `git -C "$ROOT" ls-remote --exit-code --heads origin refs/heads/<branch>` before any companion writes. On any fetch failure or lookup exit other than 0 or 2 stop naming repo and command output, never diagnose absence. On exit 0 require `origin/<branch>`. On exit 2 stop even when a stale tracking ref still resolves: `origin/<branch> is missing in <repo>; on the machine that ran option 6, push <branch> from that companion's checkout, then rerun brainstorming #N`. On that machine, verify `git log -1 --format=%H refs/heads/<branch> -- <spec-dir>/<home spec filename>` shows the leg-file commit without checking out or modifying the primary, then run `git push -u origin <branch>`. Stop continuation when that commit exists on no machine; do not regenerate it.

Set `ORIGINAL_HEAD=$(git -C "$ROOT" rev-parse origin/<branch>)`. Obtain nonempty `baseRefName` with `gh repo view <owner/name> --json defaultBranchRef -q .defaultBranchRef.name` (positional repo, never `-R`), then `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)`; retain full SHAs. Resolve home and create through Step 1a's rules from this repo's own overrides and `.pi/settings.json` read by file with existing preset rules, already compared with recorded contract in caller preflight. Derive NAME from BRANCH with `/` replaced by `-`.

Read no `headRefOid`, `MEMBER_HEADS` or `PRE_REWORK_HEAD` on this path. Skip cross-repository/PR-head-unreachable checks, PR reports, pre-rework refs and thread fetching. Keep the checked-out-elsewhere stop from the home table, substituting BRANCH and naming repo. Before the local-branch ancestry stop, apply coordinated base-sync recovery below. Without recovery require `git -C "$ROOT" merge-base --is-ancestor refs/heads/<branch> origin/<branch>` for an existing branch; on exit 1 use the local-branch ancestry stop naming repo and replacing "rework needs the PR head" with "companion needs the published branch head". Surface command errors, not negative proofs.

Apply the "Provision the exact head" rows and wrapper/token/home safety rules with BRANCH for headRefName and ORIGINAL_HEAD for headRefOid. Keep their order: validated recovery, selected-home dirty-tree ask then ff-only and exact head, absent tree/local ancestor proof then update-ref and add, absent tree/absent branch existing-branch DWIM add. Never supply `-b`/`-B`. Run a compatible existing-branch wrapper only; retain `create: override skipped (contains -b)` otherwise. After creation require HEAD equal ORIGINAL_HEAD or validated recovery tip; on mismatch preserve the tree and print its path and both full SHAs.

Run only "Merge the fetched base", with companion WORKTREE and its own BASE_SHA overrides for SCOPED_TEST_COMMANDS. Keep helper scope, staging, contained-delta and orchestrator completion checks. On failure abort and record `merge: unresolved - <files>`; return the unresolved result to the coordinated caller for its by-hand stop, not the home Task 1 continuation. Require `git -C "$WORKTREE" merge-base --is-ancestor <ORIGINAL_HEAD> HEAD` after merge. Report Base SHA and merge outcome, not `PR:` or `Pre-rework head:`. Require Step 4's coordinated read-back (`worktree list --porcelain` path and `branch --show-current` exactly BRANCH) before `Worktree ready at <path>`.

On every companion provisioning failure name repo and branch and print `Preserved created legs:` using Step 4's inventory, including the stopped member's tree after a successful creator. Remove nothing.

### Recover coordinated base sync

Apply only for a companion or a caller-observed marked home with N>1 Legs, before ancestry and exact-head stops. Use ORIGINAL_HEAD for companions and home headRefOid for marked home as the published head. Inspect the actual `refs/heads/<branch>` tip, not session HEAD. Keep the active-rebase guard below. For a differing local tip require published-head ancestry, then walk `git -C "$ROOT" log --first-parent --format='%H %P' origin/<branch>..refs/heads/<branch>`. Require a nonempty walk, exactly two parents on every entry, and `git -C "$ROOT" merge-base --is-ancestor <second parent> origin/<baseRefName>` exit 0 for each. Require a clean existing selected worktree. A failed proof takes the existing ancestry/carries-commits-beyond stop naming repo; preserve local commits and all created legs.

Reuse the validated tip without reset, update-ref or `-b`: keep its selected tree or add the existing branch when no tree exists. Verify HEAD equals that tip; merge the fetched base as usual, including `merge: no-op` when contained. Append `Base sync recovered: <sha7>` to read-back. For marked home continue its PR reports, refs and validation normally, preserving original pre-rework identities; bypass the member-merge/rework-base recovery checks below for this validated exemption. Keep merge sync and validate original-head ancestry.

## Select home and stop before writes

Consume SYNC beside the ordered array of admitted PR values, home first; use home's `headRefName` for checkout and `PRE_REWORK_HEAD=<home headRefOid>`. Carry the remaining entries as MEMBER_HEADS `{ number, url, title, headRefName, headRefOid }`. For a caller passing PR values, follow this reference instead of `using-git-worktrees/SKILL.md` Steps 0 and 1. Derive ROOT from the absolute git common directory as in Step 0, applying its submodule guard. Resolve the worktree home through the existing overrides/native-tool/wrapper contract; default to `$ROOT/.worktrees/<name>`. Set `<name>` to `headRefName` with every `/` replaced by `-`. Never adopt the session's linked tree unless it is the selected home on `headRefName`.

Run `git -C "$ROOT" fetch origin`, then check reachability and remote equality for every admitted PR (home and members) before any worktree write: require each original `headRefOid` object and `origin/<headRefName>` equal to it; use the branch-moved stop below naming that PR. Resolve `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)` as a full SHA before any conflict helper needs fetched-base overrides. Then check these stops in order before creating or modifying any file in the primary or a worktree, or running `git worktree add`.

| Observable case | Exact stop |
|---|---|
| `isCrossRepository` true | `PR #N's head lives on fork <headRepository.nameWithOwner>; rework needs an in-repo branch.` |
| `headRefName` listed by `git -C "$ROOT" worktree list --porcelain` at another path, including `.worktrees/pr-<N>` | `branch <headRefName> is checked out at <path>; finish or remove that worktree first.` |
| `git -C "$ROOT" rev-parse --verify -q <headRefOid>^{commit}` fails after fetch, or `origin/<headRefName>` differs from `headRefOid` | `PR #N head <headRefOid7> is not reachable (origin/<headRefName> is at <sha7>); the branch moved.` |
| Local branch exists without validated recovery (after recovery below; N=1 without a rework-base ref, with or without a worktree, always takes this check) and `git -C "$ROOT" merge-base --is-ancestor <headRefName> origin/<headRefName>` exits 1 | `local branch <headRefName> is at <sha7>, not an ancestor of origin/<headRefName> (<sha7>); rework needs the PR head.` |

## Recover an interrupted sync

Before the local-branch ancestry stop and exact-head rows, apply "Recover coordinated base sync" for an observed coordinated marked home; on validated recovery use its provisioning row and skip the remaining recovery checks here. Resolve the existing selected worktree's rebase state paths with `git -C "$WORKTREE" rev-parse --path-format=absolute --git-path rebase-merge` and `git -C "$WORKTREE" rev-parse --path-format=absolute --git-path rebase-apply`; stop on either command failing; stop when either resolved path is an existing directory: `worktree <path> has a rebase in progress; finish or abort it by hand`; treat neither path being a directory as no active rebase (`REBASE_HEAD` lingers after a completed rebase and is not the signal). Require a clean existing home tree on every recovery path. With no worktree, inspect refs from ROOT before any worktree operation.

Inspect the actual local home branch tip, not caller HEAD. When `refs/gauntlet/rework-base/pr-<home>` exists, require its ancestry of that tip and every `refs/gauntlet/pre-rework/pr-<N>` to equal the recorded `headRefOid`. On mismatch use the carries-commits-beyond stop below; on successful validation set `SYNC=rebase` regardless of the token. Continue from the validated tip without reset. Per member run `git -C "$ROOT" cherry <tip> <member headRefOid> <BASE_SHA>`; no `+` line records `Member replay: #<N> (already landed)`, otherwise replay that member in the sync procedure after provisioning the validated branch.

Without a rework-base ref, for a list with an existing home worktree or local branch, inspect the actual local home branch tip with `git -C "$ROOT" rev-parse refs/heads/<headRefName>`, never caller HEAD. For a tip differing from home headRefOid, require home `headRefOid` ancestry, then walk `git -C "$ROOT" log --first-parent --format='%H %P %s' <headRefOid>..<local home tip>`. Recognize recovery only for a nonempty walk; require every entry to be a two-parent merge with canonical subject `merge PR #<N> head <sha7> into PR #<home>`, where N is an admitted member, sha7 matches its original head, and its full original `headRefOid` is the second parent. Require a clean existing home tree. On unrelated commits, failed ancestry, or dirt, stop before writes: `worktree <path> on <headRefName> carries commits beyond PR #<home>'s head (<sha7>) that are not member merges from this list; resolve by hand or remove the worktree.` Use the selected home path even when no worktree exists.

Continue from the validated tip without reset or branch deletion; force `SYNC=merge` for recognized canonical merges. For recognized merges skip the member and report `Member merge: #<N> <sha7> (already landed)` using the existing merge commit SHA. Otherwise apply the exact-head checks below for every N.

## Provision the exact head

Apply the first matching row after all stops pass. Keep the process cwd unchanged and carry WORKTREE as a value.

| State | Action |
|---|---|
| Recovery validated an existing home branch | Reuse its clean selected worktree unchanged; with no worktree, run `git -C "$ROOT" worktree add "$WORKTREE" <headRefName>` on that existing branch. Verify `git -C "$WORKTREE" rev-parse HEAD` equals the validated local tip. Never use update-ref, -b, reset, clean, or deletion on recovery. |
| Selected home is already on `headRefName` | Run Step 3's dirty-tree ask first; do not stash or clean automatically. Then run `git -C "$WORKTREE" merge --ff-only origin/<headRefName>` and require HEAD equal to `headRefOid`; otherwise stop naming both SHAs. |
| No worktree, local branch exists | Only after ancestry proof, run `git -C "$ROOT" update-ref refs/heads/<headRefName> origin/<headRefName>`, then `git -C "$ROOT" worktree add "<home>" <headRefName>`. Never use `git -C "$ROOT" branch -f`. |
| No worktree, no local branch | Run `git -C "$ROOT" worktree add "<home>" <headRefName>`. Git's unique-remote DWIM resolves exactly one matching remote-tracking branch as `--track -b <headRefName> "<home>" origin/<headRefName>`; do not substitute the generic new-branch `-b` creation path. |

For fresh creation, apply Step 3's source-clean ask and the existing home safety checks after the ordered stops. Respect the resolved home and native tool/wrapper, but use an overrides `create:` only when it takes `<branch>` as an existing branch and contains no `-b`/`-B`. Otherwise run the built-in checkout above and add `create: override skipped (contains -b)` to the report. Resolve tokens and surface wrapper failures through the existing contract.

Verify `git -C "$WORKTREE" rev-parse HEAD` equals home `headRefOid` for every list size without recovery, or the validated recovery tip. On a post-create head race, leave the tree intact and stop naming its path and both SHAs. Capture `PRE_REWORK_HEAD=<headRefOid>` and `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)` as full SHAs. In the Step 4 report use `Base: <headRefName> @ <sha7>` and add immediately after it:

```text
PR: <owner/repo#N>
Pre-rework head: <sha>
Base SHA: <sha7>
```

## Record the pre-rework heads

After exact-head verification, run `git -C "$WORKTREE" update-ref refs/gauntlet/pre-rework/pr-<N> <headRefOid>` for every admitted PR; stop on any error. Preserve original refs on recovery and require their identities before proceeding. Keep the appended-spec approval `commit --amend --no-edit` and appended-wave fold `reset --soft "$WAVE_BASE_SHA"`; require WAVE_BASE_SHA to descend from the rework base in rebase mode, or PRE_REWORK_HEAD in merge mode.

## Sync onto the fetched base

| SYNC | Procedure |
|---|---|
| `rebase` | Save last-good SHA (PRE_REWORK_HEAD for a fresh run, validated local tip on recovery). Run `git -C "$WORKTREE" rebase --no-rebase-merges origin/<baseRefName>`; save last-good on success. Then replay remaining members in listed order: `git -C "$WORKTREE" rebase --no-rebase-merges --onto HEAD <BASE_SHA> <member headRefOid>`. After each success run `git -C "$WORKTREE" update-ref refs/heads/<home headRefName> HEAD`, then `git -C "$WORKTREE" checkout <home headRefName>` and save last-good. Never update member refs locally or on origin. On complete success run `git -C "$WORKTREE" update-ref refs/gauntlet/rework-base/pr-<home> HEAD`; stop on ref errors. |
| `merge` | Follow the member-then-base recipe below verbatim; do not write rework-base. |

On every sync outcome read the fetched-base constraints owned by `brainstorming/reference/pr-subject.md`. For rebase conflicts use the helper and fetched-base scoped-runner contract below, adding `git -C "$WORKTREE" rebase --show-current-patch` to its payload. Forbid helper commits and `rebase --continue`, `rebase --abort`, or `rebase --skip`. Require every listed file staged, empty unmerged index, and contained status delta before the orchestrator runs `GIT_EDITOR=true git -C "$WORKTREE" rebase --continue`. For an empty stopped commit the orchestrator runs `git -C "$WORKTREE" rebase --skip`. Dispatch a fresh helper at each later stop.

On helper or completion failure run `git -C "$WORKTREE" rebase --abort`; for a member additionally run `git -C "$WORKTREE" checkout <home headRefName>` before proving restoration. Require abort exit 0, HEAD equal to saved last-good SHA, branch equal to home, and successful empty `git -C "$WORKTREE" status --porcelain --untracked-files=all`. On failure stop with the complete restore-failure report in the merge recipe below, quoting the literal observed branch and HEAD output; never reset, clean, or delete to recover. After clean home abort record `sync: unresolved - <files>` and all members `pending`; continue on the saved pre-attempt home tip, opening Design with `rebase onto origin/<base> and resolve <files>` as Task 1. After clean member abort retain earlier outcomes, record `Member replay: #<N> unresolved - <files>` and later members `pending`; open Design with `replay #<N> onto home and resolve <files>` as Task 1. Do not replay later members on either failure. Task 1 completes pending replays and persists Rework base before finishing.

Record final differing tip as `Base: <base> @ <sha7> - rebased: <pre7>..<new7>, <n> stop(s) in <files>`; only final equality permits `Base: <base> @ <sha7> - sync: no-op`. Record one `Member replay: #<N> <outcome>` in listed order: actual first/last added SHAs `<first7>..<last7>`, `empty` for all commits dropped, `(already landed)` on recovery, `unresolved - <files>`, or `pending`. Replay from BASE_SHA even for shared commits; equivalent commits drop, textual conflicts use the helper. All-dropped is not an error.

After complete rebase print `Rework base: <full sha>` immediately after `Base SHA:` in Step 4. Keep every PR/Pre-rework head pair and carry MEMBER_HEADS to gather.

### Merge admitted member heads

Before the base merge, iterate remaining MEMBER_HEADS in listed order. Save the last-good home SHA before each merge. Run `git -C "$WORKTREE" merge --no-ff -m "merge PR #<N> head <sha7> into PR #<home>" <headRefOid>` using the original supplied head, not a newly advanced remote tip. On success record `Member merge: #<N> <merge sha7>`; an ancestor no-op records no new commit.

For conflicts use the fetched-base scoped-runner selection and helper/completion recipe in "Merge the fetched base": fresh foreground implementer, exact conflicted paths, staging, empty unmerged index, contained status delta, and orchestrator `git -C "$WORKTREE" commit --no-edit`. Preserve the canonical subject, including in a manual resolution. Record any contract exception for the spec's Rework record.

On helper or completion failure run `git -C "$WORKTREE" merge --abort` and capture its exit status. Before claiming restoration, require abort exit status 0, `git -C "$WORKTREE" rev-parse HEAD` equal to the saved last-good full SHA, `git -C "$WORKTREE" branch --show-current` equal to home's `headRefName`, and successful `git -C "$WORKTREE" status --porcelain --untracked-files=all` with empty output (checkout and index clean). On any failed check or residual edit, stop naming the failing PR, conflicted files, selected worktree, the observed branch and HEAD quoted as the literal `branch --show-current` and `rev-parse HEAD` output (or that command's error text), never as a reference to an earlier step, abort exit status, remaining status paths or inspection errors, and saved last-good SHA with earlier merged members; require manual recovery before rerunning and do not claim restoration. Never reset or clean to force recovery. Only after all checks pass, stop with `PR #<N> conflicts with home PR #<home> in <files>; the worktree at <path> is left on <headRefName> at <sha7> with #<earlier members> already merged; merge #<N> by hand there (git merge --no-ff <headRefOid>) and rerun the same list, or rerun without #<N>.` Tell the developer to retain the canonical subject for manual merging. Stop before the base merge, spec, plan, later member merges, push, or close. Do not use the base-conflict continuation for member failures.

After all members, merge the fetched base. In the Step 4 report print one `PR:` / `Pre-rework head:` pair per admitted PR, home first, followed by member outcome lines in listed order, then the base outcome; print Base SHA once. Carry MEMBER_HEADS to gather.

### Merge the fetched base

Run `git -C "$WORKTREE" merge --no-ff --no-edit origin/<baseRefName>` and record the matching outcome:

| Outcome | Record and continuation |
|---|---|
| Base already an ancestor | `merge: no-op - head contains origin/<base>`; no commit. |
| Clean merge | `merge: <sha7>`; this merge follows the member merges (the first rework commit for N=1). |
| Conflicts | Follow the helper recipe below. |

Keep the process cwd unchanged; explicitly target the selected worktree in every helper discovery, status, staging, completion, commit, and abort command. Snapshot `git -C "$WORKTREE" status --porcelain` before helper dispatch. Get conflicted paths with `git -C "$WORKTREE" diff --name-only --diff-filter=U`. Dispatch one fresh foreground `implementer`, `cwd` the worktree, `async: false`, with that exact file list, fetched base, and SCOPED_TEST_COMMANDS. Require resolution of every listed file preserving both sides' intent, exactly the supplied scoped commands, and `git -C "$WORKTREE" add` for every resolved file. Require return `done`, or `done - contract exception: <why>` when resolution changes a PR or bound-ticket obligation. Forbid helper commits, aborts, and edits outside the list.

Read the first-found overrides file from BASE_SHA, not the conflicted tree: `git -C "$ROOT" show <BASE_SHA>:<overrides path>`. Use SCOPED_TEST_COMMANDS only from a documented file-scoped runner under `## PR gate` or `## verification-before-completion` with `requires credentials` not `true`. Missing runner or `requires credentials: true` means `none`, with the reason recorded as `none run (<reason>)`. Never infer file scope from a full-suite script such as `npm test`.

Continue only with an empty unmerged index (`git -C "$WORKTREE" diff --name-only --diff-filter=U`), every listed file staged (`git -C "$WORKTREE" diff --cached --name-only`), and the `git -C "$WORKTREE" status --porcelain` delta contained in the listed paths. Then complete with `git -C "$WORKTREE" commit --no-edit` and record `merge: <sha7>, <n> file(s) resolved, scoped tests <green | red in <file>: <tests> | none>`. Land a reported contract exception and name it in the spec's `## Rework record` `Changes:`.

For any failed helper/completion checks, run `git -C "$WORKTREE" merge --abort`, record `merge: unresolved - <files>`, and continue on the original unmerged head. Open the spec's Design with `merge origin/<base> and resolve <files>` as eventual Task 1. On every outcome, require the base-SHA constraint reads owned by `brainstorming/reference/pr-subject.md`.

## Validate the sync outcome

Validate once per outcome: rebase success - require `git -C "$WORKTREE" merge-base --is-ancestor refs/gauntlet/rework-base/pr-<home> HEAD`; home rebase aborted - HEAD equals saved pre-attempt last-good home SHA (PRE_REWORK_HEAD for a fresh run, validated local tip on recovery); member replay aborted - HEAD equals saved last-good rebased home tip; merge (any outcome) - require `git -C "$WORKTREE" merge-base --is-ancestor <each original head> HEAD` exit 0 for home and every member. Stop on failure naming PR and SHAs. Original-head ancestry is never asserted against a rebased tip.

Treat the base sync (rebase or merge) and each member replay or merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests as the sole preapproval write/run exception outside spec directories. Run no other brainstorming tests, dispatch no reviewer, and push nothing; leave review of the sync to end-of-flow code review.

## Fetch unresolved review threads

Run this query per admitted PR, N=1 included, before gather; callers cite this owner rather than copying it:

```
gh api graphql --paginate -f query='query($o:String!,$r:String!,$n:Int!,$endCursor:String){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100,after:$endCursor){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated path line originalLine comments(first:100){pageInfo{hasNextPage endCursor} totalCount nodes{url body author{login} createdAt}}}}}}}' -F o=<owner> -F r=<repo> -F n=<N>
```

Merge every reviewThreads page and filter to `isResolved == false`. For each thread whose comments report `hasNextPage: true` (with `totalCount` exceeding the first page), fetch the remaining pages by thread id with a separate comment cursor:

```
gh api graphql --paginate -f query='query($id:ID!,$endCursor:String){node(id:$id){... on PullRequestReviewThread{comments(first:100,after:$endCursor){pageInfo{hasNextPage endCursor} nodes{url body author{login} createdAt}}}}}' -F id=<thread id>
```

Start that thread's follow-up query at its first comment page, then replace its initial comments with the complete paginated connection to avoid duplicates. Keep each thread's comment cursor separate from the reviewThreads cursor and fetch until its last page. Carry all comments in order: read the first request and every reply because replies can change the request. Render location as `<path>:<line>`, else `<path>:<originalLine> (outdated)`, else `<path>`. On any thread or comment fetch failure stop before gather and spec with `threads for #<N> not fetched (<gh error>)`. Finish owns its distinct post-verification fetch-failure reporting. On successful empty fetch record `Threads: none`.
