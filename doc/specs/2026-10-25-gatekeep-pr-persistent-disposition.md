# gatekeep-pr: one course per run

**Goal:** A gatekeep-pr run asks the human one question before the terminal menu - `assess` or `deliver` - and under `deliver` repairs, syncs, pushes, and watches CI with no menu until the PR is mergeable, stuck, or out of rounds.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** supersedes `doc/specs/2026-10-11-gh-62-gatekeep-decision-grants.md`, the retained-consent grant model (`consent.fix`, `consent.merge_base`, revoke grammar, grant-covered Next-action rows); supersedes `doc/specs/2026-10-13-gatekeep-pr-speed-and-fixability.md` D1 (the "Blockers empty" watch guard, the single end-of-step watch, and the "menu omits fix at maxFixRounds" rule) and D5/D6 (per-proposal exact-text selection and the 30 s poll loop as the only wait).

## Problem

Gating a PR today is a chain of identical picks. On PR 1017 the human typed `1` nine times in a row (wait, wait, wait, wait, fix, wait, merge base, wait, merge) before `cleanup` rendered; on PR 1026 the run stopped at "round cap reached: 5 of 5" with six blockers open after four red CI checks each re-rendered `fix [recommended]` instead of running the held grant. The picks are not separate decisions. They are the same decision - "make this PR mergeable" - re-asked at every rule boundary the skill draws.

Four rules draw those boundaries, all in `skills/gatekeep-pr/reference/`:

| Boundary | Rule | Effect |
|---|---|---|
| The `fix` grant covers only source-verified drafted payloads | `post-selection-loop.md` `### Continuation record`, `### Next action` ("Held repair grant and only readiness evidence ... pending -> Nothing extra") | CI-minted failures after a push re-render `fix` |
| The CI watch runs only when `Blockers` is empty | `### Pre-menu refresh` watch guard | A blocker such as "spec row needs CI green" disables the watch that would close it; every CI wait is a human `wait` pick |
| The wait window never renews | `### Wait course` (15 min, "a retained grant, repeated menu/Wait entry, or expiry alone never renews it") | Four `wait` menus in a row for one long job |
| `merge base` is a separate grant; every push and body-only write spends a round | `### Next action`, `fix-wave.md` `## Wave` | A base conflict mid-CI stops at the conflict menu under a held fix grant; conflict and description rounds exhaust the cap |

Premise corrections carried from discovery: the skill already persists a `fix` decision and already renders a fresh final menu at readiness (`### Next action`, "Every merge prerequisite holds -> render fresh final menu; never automatically merge or approve"), so the gap is the grant's scope, not its absence. The round cap is not a gatekeep constant: `fix-wave.md` reads `closureReview.maxFixRounds` through `gauntlet_setting` (default `3` in `extensions/lib/gauntlet-settings.ts:92`, shared with the verify-phase conformance loop and the phase-tracker guard) and hard-codes `3` only as the no-tool fallback; the observed "5 of 5" came from the user's own `settings.json` override, not the default.

Framing: pivoted to the course model - the existing continuation record and fresh-final-menu rule already hold the shape, so the fix is to make the persisted decision mean "until mergeable" rather than add a parallel disposition vocabulary with grouped verbs.

## Acceptance criteria

none - no ticket

## Design

### D0 Authoring constraints

- Every edited file under `skills/gatekeep-pr/` is under 500 lines by `wc -l` and under 50,000 bytes by `wc -c`; a rewrite that would cross either limit extracts the touched concern to `reference/<topic>.md` first (forge-skill `## Authoring rules`, oversized-file rule). `post-selection-loop.md` is 29,698 bytes and 149 lines today; the D3 loop body and D5 extraction keep it under both limits.
- Every changed instruction in those files is read back against forge-skill `## Authoring rules` (imperative voice, low conditionality, minimal diff) before the finish, and the commit body names the check.
- `closureReview.maxFixRounds` defaults to `5` everywhere the default is stated (D4 inventory).
- One course pick per run; under `deliver` no menu renders between the initial pick and an exit, except the contract-exception template (D6).

### D1 Course

One human decision precedes the terminal menu: the **course**, picked on the initial menu and written into the continuation record as `course: assess | deliver | deliver-nits`. The field replaces `consent.fix`, `consent.merge_base`, `consent.scope_at_grant`, and the `revoke` grammar in `verification-brief.md`'s record schema; `repair.rounds_used`, `repair.poll_deadline`, and `repair.wave` stay, and D4 adds `repair.rounds_cap`, `repair.syncs_used`, and `repair.syncs_cap`. Every write after the initial pick is authorized by the course or by a terminal pick; nothing else. A course is set once per run and never re-asked; an obstacle menu's `deliver` row continues the course, and its `assess` row switches it.

Readiness at the first report (every D3 readiness precondition already holds) skips the initial menu: the final menu renders directly with `course` unset, so an already-mergeable PR costs one pick, not two. An unset course promises no nit work; the final menu's `fix nits` row (D5) exposes remaining nits.

Authorship changes defaults inside a course, never which courses exist. The author test is the digest's `viewer.is_author` (`viewer.login == pr.author.login`, `verification-brief.md` Section A), not the consent table's row labels. `deliver` syncs by rebase with `--force-with-lease` when `viewer.is_author` is true and `author_is_bot` is false, and by base merge otherwise - a bot-authored head is never rewritten and takes the someone-else rows throughout; `assess` offers `approve` only when `viewer.is_author` is false and zero blockers are open.

### D2 assess

`assess` posts the current assessment findings - the open blockers step 5 rendered under `Blockers`, with their locators - as one GitHub review through the existing `review` verb: `--request-changes` when `viewer.is_author` is false, `--comment` on the human's own PR. Drafted thread replies (the `C#` ledger, `findings.md` `## Namespaces`) are a different payload and stay behind the assess terminal's `reply` row. With zero open blockers `assess` posts nothing and renders the assess terminal directly, where `approve` is eligible on someone else's PR. It performs no repair and no sync.

### D3 deliver

`deliver` is a loop with a fixed body and three exits, and no menu renders between the initial pick and an exit except the contract-exception template (D6). Before every iteration, run `### Exit check`; a readiness or obstacle condition that already holds exits without touching the branch. Body, in order, repeated until an exit:

1. Repair every open blocker - source-backed findings and CI-minted `P#` failures alike - through the implementer wave of `fix-wave.md` `## Wave`; under `deliver-nits` the wave also carries every open nit payload, and a nit minted by a later re-review joins the next wave.
2. Sync with base only when a freshness or conflict precondition fails: `mergeable` is `CONFLICTING`, `merge_state_status` is `BEHIND`, or the local `merge-tree` check before the push reports a conflict. Strategy per D1; procedure per `### Loop sync`. A conflict goes to a helper, never to the orchestrator.
3. Pre-push review, then push (`fix-wave.md` `## Review before push`, `## Evidence after push`). A carried set holding Critical or Moderate is not pushed: it goes back to step 1 as a repair wave (a round when it changes source); at the cap it is the cap exit with the commits unpushed and the verdict naming the reviewer's top finding.
4. Watch CI with one window bounded by the `## PR gate` key `timeout minutes` (default 15). The window renews only on the gate's own push; a base move during the watch does not renew it and is a sync trigger for the next iteration, not a round.
5. Own-push re-review (`post-selection-loop.md` `### Re-render`), then back to the exit check.

#### Exit check

Evaluated before every iteration and after every step that changes the head, the digest, or the record. First matching row wins; readiness is checked first so an already-ready PR never syncs or pushes.

| Exit | Condition | Renders |
|---|---|---|
| readiness | every merge precondition in `post-selection-loop.md` `### Merge preconditions` holds, and under `deliver-nits` every nit payload opted into at the pick plus every nit minted since has a `resolved` closure line | final menu (`merge` omitted with `Not offered: merge (draft)` on a draft; `merge` omitted with `(needs WRITE on <owner>/<repo>)` below `WRITE`) |
| obstacle | any row of the obstacle resolver below | obstacle menu, verdict names the row's text |
| cap | `repair.rounds_used` reaches `repair.rounds_cap`, or `repair.syncs_used` reaches `repair.syncs_cap` | obstacle menu, verdict `round cap reached: <used> of <cap>` or `sync cap reached: <used> of <cap>` |

Obstacle resolver - exhaustive and fail-closed; a state not listed here that withholds merge is a defect, and the implementer adds its row rather than looping:

| State | Under `deliver` | Verdict text |
|---|---|---|
| Continuation record missing, unreadable, or target mismatch | obstacle; `repair.*` never reset | `stuck - run record unreadable` |
| The same check red twice with no repair-wave commit pushed between the two observations | obstacle; the obstacle menu's hint line offers `check <name> flaky \| real \| ci-broken`; `flaky` then `deliver` resumes | `stuck - <check> red twice without a source change` |
| Failing check with no `--log-failed` output and no source lead | one re-run request inside the wave, then the row above | - |
| Implementer returns `open - needs <what>` or `open - contract exception` | contract exception -> D6 overlay; any other `open - needs` -> obstacle | `stuck - needs <what>` |
| Completed wave with every payload `open` (HEAD equals `pre_wave_head`) or a scoped test unchanged-red after restored edits | obstacle through the existing `### No-progress obstacle` checkpoint; no round spent | `stuck - no progress: <failed prerequisite>` |
| `mergeStateStatus` `BLOCKED` with nothing dispositionable | obstacle; never attributed to a named rule | `GitHub reports BLOCKED, no local repair applies` |
| `mergeStateStatus` `UNKNOWN` or `unreadable` after one re-poll, regardless of CI color or a pending binding check | obstacle | `stuck - merge state unknown` |
| Pre-menu refresh or comment refetch fails (`gh` non-zero, pagination incomplete) | one retry, then obstacle | `stuck - refresh failed: <reason>` |
| Comment-delta source review did not finish | one retry with a fresh reviewer, then obstacle | `stuck - comment source review incomplete` |
| `timeout minutes` elapsed with a binding check pending | obstacle; `deliver` on the obstacle menu opens exactly one more window | `stuck - CI pending past <n> minutes` |
| `action_required` held run on the assessed head | `viewer.is_author` true and `viewer_permission` at least `WRITE` -> `approve workflow run` runs under the course, then the watch; otherwise obstacle with an `approve workflow run` row | `stuck - workflow run awaiting approval` |
| `head_pushable` false or `unreadable` mid-course (lost since the initial menu) | obstacle; commits stay local, branch named | `stuck - cannot push to <head_url>:<head_ref>` |
| Lease refused or remote head moved under a local rewrite | `git reset --hard <pre_head>`, assert, obstacle | `stuck - remote head moved` |
| Loop sync failed (`### Loop sync` failure path) | obstacle after restore | `stuck - sync: <reason>` |
| Repo disallows the resolved merge policy | obstacle at readiness time | `merge policy <policy> is disabled on <owner>/<repo>` |
| PR `state` closed or merged mid-course | closed-PR template (D5) | - |
| Session lost mid-course | nothing resumes; a new session re-renders the initial menu | - |

A `deliver` pick on the obstacle menu retries only the rows marked obstacle after the human's action clears them (a `flaky` disposition, a workflow approval, a moved base); the no-progress row keeps its checkpoint and re-exits until the failed prerequisite observably changed, as `### No-progress obstacle` already requires, and the checkpoint history is appended, never erased.

#### Loop sync

Owner: a new `fix-wave.md` `## Sync` section replacing `## Conflicts` rows 1-4; the entry-time `--rebase [base]` sync in `sync.md` stays once per invocation and is a different procedure (it runs before step 3; the loop sync runs inside D3 step 2 and never re-enters `sync.md`).

- Trigger: D3 step 2's preconditions only. A current, conflict-free head skips the sync.
- Own branch (`viewer.is_author` true, `author_is_bot` false, `git rev-list --merges origin/<baseRefName>..HEAD` empty): rebase. Record `<pre_head>` = `git rev-parse HEAD` as the local recovery head at this sync (fresh per sync, never the step-2b value). Separately record `<expected_remote_head>` from the assessed/pushed remote head and verify it with a fresh remote-head read before sync and push. Preserve that value through local repair and rebase; a remote mismatch is an obstacle, not permission to overwrite it. Permitted orchestrator git writes are exactly `sync.md` `## Permitted orchestrator git writes`: `fetch origin <baseRefName>`, `rebase origin/<baseRefName>`, `GIT_EDITOR=true rebase --continue`, `rebase --abort`, `reset --hard <pre_head>`, and the lease push. A conflict stop dispatches one fresh implementer per stop with `sync.md` `## Conflict stop`'s task and continue rules. The push is `git push --no-follow-tags --force-with-lease=<head_ref>:<expected_remote_head> <head_url> HEAD:refs/heads/<head_ref>`, on every rewritten head. For remote A, local repair B, then rebase C, the lease expects A and rollback restores B.
- Own branch whose history holds merge commits: not rewritten; the base-merge strategy below applies and the stop line says `sync: merged base - head contains merge commits`.
- Someone else's or bot-authored branch: base merge - one fresh implementer merges `origin/<baseRefName>` into the branch and resolves conflicts in one commit (today's `## Conflicts` row 2 procedure), ordinary push.
- Review after a rewrite: the pre-push reviewer's range is `git range-diff origin/<baseRefName> <pre_head> HEAD` plus `git diff <pre_head> HEAD -- <resolved files>` for the replay (as `sync.md` `## Review before push`), and `git diff <pushed_head_after_replay> HEAD` for the wave commits; closure lines still bind to the wave's `P#`/`L#` ids. After a base merge the delta is `git show --remerge-diff <merge-sha>` as today.
- Evidence after a rewrite: the successful lease push sets `repair.wave.pushed_head` and the digest's `headRefOid` to the new SHA; the own-push sequence (`### Re-render`) rebinds the ledger and evidence to it; dispositions recorded before the push carry as they do for any own push.
- Failure path: `rebase --abort` while in progress, else `reset --hard <pre_head>`; assert `HEAD == <pre_head>` and a clean tree; a mismatch is a hard stop. Then the `stuck - sync: <reason>` obstacle row.
- Each sync spends one `repair.syncs_used`, rounds untouched.

### D4 Round accounting

A round is one implementer wave that dispatches at least one payload and leaves a new commit on the branch - source-changing - including a source-changing pre-push carried-set retry. Conflict-only sync (a helper merge commit or a rebase stop resolution), description-only repair, CI watches, re-reviews, and a completed empty wave (HEAD equals `pre_wave_head`, every payload `open`) spend nothing; the empty wave routes to the no-progress obstacle instead. "Red twice with no source delta" means no repair-wave commit was pushed between the two observations of that check.

The record carries `repair.rounds_cap`, initialized at the course pick to `2 x closureReview.maxFixRounds`, read through `gauntlet_setting({ key: "closureReview" })`; the no-tool fallback is `2 x 5`. The obstacle menu's `deliver` row adds exactly `2 x maxFixRounds` to `repair.rounds_cap` and persists it before any work; `repair.rounds_used` is cumulative for the run and never resets, so an exhausted run exits again only after the extension is spent. `repair.syncs_cap` and `repair.syncs_used` follow the same rule with the same initial value, bounding busy-base loops that spend no rounds. A timeout obstacle's `deliver` opens one more `timeout minutes` window and extends neither cap.

`closureReview.maxFixRounds` defaults to `5` in `extensions/lib/gauntlet-settings.ts:92`; a missing or non-integer value normalizes to `5`, a negative value clamps to `0`. Every stated default follows: `doc/configuration.md:12` (JSON example), `:25` (conformance-loop paragraph, including "uses `3` where `gauntlet_setting` is absent" -> `5`), `:192` (fix-round cap bullet), `README.md:542` (settings row) and `:82` (gatekeep blurb, when it states the cap), `skills/verification-before-completion/reference/conformance-check.md:182` ("default `3`, ... coerces non-integers to `3`"), `skills/verification-before-completion/reference/settings-precedence.md:25`, and `fix-wave.md` `## Wave` (`else 3`). A cap of `0` or no helper facility omits the `deliver` rows from the initial menu.

The verify-phase runtime guard (`extensions/phase-tracker.ts`, `closureReview.enforce`) is unchanged and counts implementer dispatches against `1 x maxFixRounds` inside a brainstorming-entered flow's `verify` phase. A gatekeep-pr run inside that window can be blocked by the guard before its own `2 x` budget; the skill exposes that block as the obstacle `stuck - phase-tracker fix-round guard: <its reason>` rather than promising ten dispatches in every context.

### D5 Menus

All menu templates move to a new `skills/gatekeep-pr/reference/menus.md`; `SKILL.md` step 6 and step 7 name which template renders at which exit, and `decision-menu.md` keeps only the verb definitions, `## Availability`, and `## Withhold reason resolver` (the consent table and `## Overlays` move into `menus.md` as the state map below). Rows are flat numbers (menu-layout's bare-numeric reply mapping is unchanged), `stop` is last, exactly one row carries `[recommended]`, and `show evidence` is a hint-line command under every menu, not a row. `merge base`, `update branch`, and `show evidence` leave the row verbs; `wait` survives only as the `merge queued` template's re-read row.

Typed commands: `post-selection-loop.md` `### Next action` matches the exact strings `show evidence`, `reply <n>`, and `check <name> flaky | real | ci-broken` before the bare-numeric mapping; `show evidence` prints the record (`report.md` `## What stays out`) and re-renders the same menu without settling anything. Any other non-numeric reply is a change request, never a course.

Template inventory - `menus.md` holds exactly these ten headings, and the state map names which renders:

| Template | Renders when | Rows |
|---|---|---|
| initial | first report not ready, `course` unset | `assess`; `deliver`; `deliver with nits`; `stop` |
| final | readiness exit, or first report ready | `merge` (viewer `WRITE`+, resolved merge policy, repo allows it); `approve` (someone else's PR, zero blockers, never a draft); `fix nits` (nits remain and the course excluded them); `reply` (drafted reply exists); `stop` |
| assess terminal | after D2 posts (or posts nothing) | `deliver` (switch course); `approve` (someone else's PR, zero blockers); `reply`; `stop` `[recommended]` |
| obstacle | obstacle or cap exit | `deliver` (continue: `+2 x maxFixRounds` rounds and syncs, or one more window on a timeout); `approve workflow run` (held-run row only); `assess`; `stop` `[recommended]` |
| contract exception | pending contract exception mid-course | `accept contract change`; `preserve contract` `[recommended]`; `stop` |
| own merge | this run's `merge` returned `MERGED` | `cleanup` `[recommended]`; `post coverage to ticket` (issue and rows); `post coverage to PR`; `stop` |
| merge queued | this run's `merge` returned another state | `wait` (re-run the post-merge read) `[recommended]`; `stop` |
| approved | `approved_head` equals the assessed head | `cleanup` `[recommended]`; `stop` |
| closed PR | `state` not `OPEN` at step 1 or mid-course | `cleanup` `[recommended]`; `stop` |
| batch summary | multi-PR parent round (`batch.md`) | current rows unchanged, each child's menu from this file |

`[recommended]`: `deliver` on the initial menu of the human's own PR, `assess` on someone else's; `merge` on the own-PR final menu, `approve` on someone else's final menu when it renders, else `merge`. The successful-post suppression, failed-post row retention, queued-merge re-read, and parent ownership of terminal posts stay as `decision-menu.md` `## Overlays` and `batch.md` define them today.

Initial menu (own PR, two blockers, one nit):

```
Verdict: not ready - 2 blockers, 1 nit

Pick one:
1. assess - post the review to the PR; then approve or stop, no repairs.
2. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]
3. deliver with nits - deliver, and fold the 1 nit into the repairs.
4. stop - remove the worktree, leave the PR as is.

Course holds until the final menu; `show evidence` prints the full record.
```

Row-omission rules: someone else's PR reads "merge main into the branch" in row 2 and `[recommended]` moves to `assess`; zero nits drops row 3; cap `0`, no helper facility, or `head_pushable` false/`unreadable` drops rows 2-3, named in the hint line (`Not offered: deliver (needs push to <head_url>:<head_ref>)`); a PR merged or closed at step 1 renders the closed-PR template.

`approve` and `merge` are separate rows with separate conditions; no setting selects approval. The `## PR gate` `merge policy` key (`squash | merge-commit | rebase`) chooses only the `gh pr merge` flag; the sync strategy is authorship-based (D1). The human-input line `approve (round 1) / approve (round 2)` is read as the brainstorming gate's record of two spec approvals and settles no menu rule.

`fix nits` on the final menu authorizes one D3 iteration for the nit payloads - repair, sync if a precondition requires, pre-push review, push, watch, re-review - and returns to the final menu or an obstacle/cap exit; it leaves `course` unchanged and never becomes a standing nit course. While that selected nit work is outstanding, readiness is withheld for this iteration even when `course` is unset or `deliver`; complete its repair before evaluating readiness again.

### D6 Drift guard

The Next-action table in `post-selection-loop.md` collapses to one rule: course set and no exit condition -> continue the D3 body. The contract-exception template is the only mid-course menu: an implementer's `open - contract exception: <why>` renders it through `### Contract decision`, and the course resumes after `accept contract change` (owning amendment process, then baseline update) or `preserve contract` (baseline kept, the wave re-runs without that payload); it is never an obstacle exit. An eval sample fails on any other mid-course menu.

Existing rules the course model replaces, each with its new owner - the implementation rewrites or deletes every one, leaving no contradicting sentence:

| Today | Becomes | Owner |
|---|---|---|
| Red flag "A mutation without explicit selection, validated action-scoped retained authority, or the sync's `--rebase` authority" | "A mutation without a set course, a terminal pick, or the sync's `--rebase` authority" | `### Continuation record` |
| Red flag "An open-PR menu ... without `fix` while an open blocker exists, or without `fix nits` while a nit exists ...; any menu without `show evidence` ..." | "A menu rendered under `deliver` before an exit condition, other than the contract-exception template; a menu not rendered from a `menus.md` template; a menu with two `[recommended]`, `stop` not last, or no `show evidence` hint line" | `menus.md` |
| Red flag "A CI wait while a blocker is open or before the first report, or a second push inside one round" | "A CI watch outside D3 step 4 or before the first report, or a second push inside one iteration" | D3 body in `post-selection-loop.md` |
| Red flag "`cleanup` rendered on an ordinary open-PR menu, or its steps run without a pick" | "`cleanup` rendered on a non-terminal template, or `cleanup.md` steps 2-4 run on a non-final `stop`" | `cleanup.md` |
| `### Teardown` "An ordinary open-PR `stop` offers teardown, never autonomous - say when unpushed fix commits would be discarded; a reused worktree is left as found ..." | the D7 non-final stop paragraph | `cleanup.md` `## Non-final stop` |
| `### Pre-menu refresh` watch guard ("Blockers are empty") and `### Wait course` renewal rules | D3 step 4 and the `timeout` obstacle row | `post-selection-loop.md` |
| `### Next action` rows naming grants, `revoke`, `merge base`, `update branch` | the single course rule | `post-selection-loop.md` |
| `decision-menu.md` `## Consent table`, `## Overlays` table, `## Availability` rows for `fix`, `fix nits`, `merge base`, `update branch`, `push`, `wait` | the D5 state map | `menus.md` |
| `fix-wave.md` `## Conflicts` rows 1-4 and `## Wave` round-count sentences ("Count file, description-only, and conflict-only attempts under the same cap", "a grant never raises the cap") | `## Sync` and the D4 definition | `fix-wave.md` |
| `verification-brief.md` record schema `consent.*` lines | `course`, `repair.rounds_cap`, `repair.syncs_used`, `repair.syncs_cap` | `verification-brief.md` |

### D7 stop on a non-final menu

`stop` on the initial, assess-terminal, obstacle, or contract-exception menu runs a new `cleanup.md` `## Non-final stop` entry mode, distinct from step 1's terminal eligibility:

- On a `rebased locally` head, `git reset --hard <pre_head>` first and assert `HEAD == <pre_head>` with a clean tree, as the open-PR `stop` does today.
- Remove the worktree when all of: `worktree.path` is not the primary; `git status --porcelain --untracked-files=no` is empty (untracked helper residue never blocks and is deleted by `git worktree remove --force`); `git merge-base --is-ancestor HEAD <last pushed head>` succeeds, where the last pushed head is `repair.wave.pushed_head` when set, else the assessed `headRefOid`; and, under a keyed `## using-git-worktrees` contract, the ownership match step 1 already requires (`home:`/`<name>` pattern through `realpath`). Created and reused trees are both eligible - the pick is the human's teardown request.
- Otherwise keep the tree and print `worktree: kept - <reason> at <path>` with reason one of `unpushed commits <shas>`, `uncommitted changes`, `outside configured home`, `ambiguous home match`.
- Run `worktree.destroy` when recorded, else `git worktree remove --force` and `git worktree prune`; print `worktree: done`.
- Branch deletion, base pull, and `## cleanup` override steps never run here; they stay behind the terminal `cleanup` pick after a merge. The record, helper outputs, and body files are deleted per `### Teardown`.

### D8 Batch mode

`batch.md` changes in these sentences and nowhere else:

- Record initialization: `course` null, `repair.rounds_cap`/`repair.syncs_cap` per D4, `repair.rounds_used`/`repair.syncs_used` zero; the "grants null" and "Use the existing field schema, no new schema" sentences follow the new schema.
- Child dispatch mode `assess | execute` is renamed `report | execute` so the dispatch mode and the `assess` course do not share a word; a queued pick is a course or a terminal verb, and "Record direct picks with existing grant grammar" becomes "Record direct picks as the child's `course` or terminal verb".
- A child under `deliver` runs D3 with its three exits and returns `REPORT` at each; the parent renders that child's template from `menus.md`.
- The parent keeps the `merge queued` re-read (`wait` row) and terminal posts; "For ordinary open PRs offer human-selected teardown ... never auto-destroy" becomes the D7 non-final stop, run by the parent after all children finish.
- Budget sentences name `repair.rounds_cap`/`repair.syncs_cap` instead of grants.
- Parent rendering: the summary renders once, after the children's closing lines and before the first menu; each child report prints verbatim in roster order under its own `#<N>` heading directly above that PR's queued menu, with no synthetic `Verdict:` restatement; a pending binding check is expressed only in that PR's queued menu (`Not offered: merge (<check> pending)`); every parent-owned terminal pick is queued until all picks are collected, announced by `Queued until all picks are collected (<roster summary>)`.
- Everything else (admission, serial provisioning, roster, result lines, recovery adapter) is unchanged.

## Errors and edge cases

| Case | Behavior | Owner |
|---|---|---|
| Continuation record missing or unparseable mid-course | Obstacle exit, verdict `stuck - run record unreadable`; `repair.*` not reset | `post-selection-loop.md` `### Continuation record` |
| `mergeStateStatus` `BLOCKED` with nothing dispositionable | Obstacle exit, verdict "GitHub reports BLOCKED, no local repair applies"; never attributed to a named rule | `findings.md` `## Dispositions` |
| `mergeStateStatus` `UNKNOWN` with green CI after one re-poll | Obstacle exit, verdict `stuck - merge state unknown`; no round or sync spent | D3 obstacle resolver |
| Failing check with no `--log-failed` output and no source lead | One re-run request inside the wave; red twice with no repair-wave commit between -> obstacle with the `check <name> flaky \| real \| ci-broken` hint | `fix-wave.md` `## Evidence after push` |
| Conflict on rebase of the human's own branch | Conflict-stop helper resolves; a failure-path return is an obstacle after restore; `--force-with-lease=<head_ref>:<expected_remote_head>` push | `fix-wave.md` `## Sync` |
| Own branch with merge commits in its history | Base-merge strategy, never rewritten | `fix-wave.md` `## Sync` |
| Base moves during the watch | Window does not renew; next iteration syncs (one `syncs_used`); no round spent | D3 step 4 |
| `timeout minutes` elapsed with checks pending | Obstacle, verdict `stuck - CI pending past <n> minutes`; `deliver` on the obstacle menu opens one window | D3 exits |
| Contract exception during a wave | Contract-exception template renders, then the course resumes after the pick; never an obstacle exit | `post-selection-loop.md` `### Contract decision`, D6 |
| `deliver` typed when its rows are omitted | A change request, never a course | `menus.md` row-omission rules |
| `deliver-nits` on an already-mergeable PR with nits | Not ready: the nit wave runs; readiness requires every opted-in nit resolved | D3 readiness exit |
| `stop` with local commits beyond the last pushed head, or uncommitted tracked changes | Worktree kept; stop line reports path and reason; untracked residue alone never keeps it | `cleanup.md` `## Non-final stop` |
| Obstacle `deliver` after a cap exit | `repair.rounds_cap` and `repair.syncs_cap` grow by `2 x maxFixRounds`, persisted before work; usage never resets | D4 |
| Obstacle `deliver` on an unchanged no-progress checkpoint | Re-exits with the same verdict until the failed prerequisite changed | `post-selection-loop.md` `### No-progress obstacle` |
| Phase-tracker guard blocks an implementer dispatch inside a `verify` phase | Obstacle, verdict names the guard's reason | D4 |
| Session lost mid-course | Nothing resumes; a new session re-renders the initial menu | README `## Architecture` (unchanged rule) |

## Tests

- `scripts/gatekeep-comment-reconcile.test.mjs`: the retained-consent and poll-window assertions (lines 144-158) move to the `course` field, `repair.rounds_cap`, and the own-push-only window renewal; line 475's `/else 3; a cap of `0` omits `fix`/` becomes the `2 x 5` fallback text; new assertions check that `menus.md` holds exactly the ten template headings of D5, that `decision-menu.md` defines none of `wait`, `merge base`, `update branch`, `show evidence` as rows, and that `SKILL.md` carries none of the D6 "Today" red-flag sentences.
- `extensions/lib/gauntlet-settings.test.ts:167-172`: default `5`, non-integer `1.5` -> `5`, `-3` -> `0`; `extensions/phase-tracker.test.ts:1552-1561` ("cap guard: default 3 waves pass ..."): five waves pass, the sixth is blocked, reason text `cap of 5`; the explicit `maxFixRounds: 3` harness at `:1778` is unchanged. Set `maxFixRounds: 3` explicitly in the grant-credit test at `:1732` so its three-round exhaustion and extra-credit assertions remain independent of the shared default.
- `eval/gatekeep-pr`: new samples `course-deliver-no-mid-menu` (no menu between the initial pick and an exit), `course-deliver-nits` (nit payloads in each wave; a nit from the last re-review joins before readiness), `course-ready-at-first-report` (final menu directly, course unset, `fix nits` exposed), `course-assess-terminal` (blockers posted as request-changes on someone else's PR, comment on own; nothing posted at zero blockers; `approve` only on someone else's PR with zero blockers), `course-cap-exhausted` (obstacle at `2 x maxFixRounds`; conflict-only sync and description rounds not counted; obstacle `deliver` extends `repair.rounds_cap` once), `course-obstacle-unknown` (green CI, `UNKNOWN` merge state -> obstacle, no loop), `course-stop-cleanup` (non-final `stop` removes an eligible created or reused worktree; keeps one with unpushed commits), `menu-rows-omitted` (zero nits, cap 0, head not pushable, closed PR). Existing samples asserting `consent.fix` / `merge base` grants, `wait` rows, `show evidence` rows, or the 15-minute deadline are rewritten to the course model or retired with the reason in `intent.md`.
- `target.json` of `eval/gatekeep-pr`, `eval/gatekeep-pr-scope`, and `eval/gatekeep-pr-merge-state` each gain `skills/gatekeep-pr/reference/menus.md` in `skillFiles` (text replay runs `--no-tools`, so a linked file is never read); their menu expectations are updated to the templates before the full targets re-run.
- Acceptance checks, run before the finish and named in the commit body: `wc -l` and `wc -c` over every edited `skills/gatekeep-pr/**/*.md` (under 500 and 50,000), plus the forge-skill `## Authoring rules` read-back on the changed instructions.
- `npm test` for the rest: skill-size lint, `pi.settings` ban, model-literal lint, packed-install smoke.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## Architecture` gatekeep paragraph (architecture - the grant model becomes the course model, with the cap multiplier and non-final `stop` teardown); `README.md:542` `closureReview.maxFixRounds` row, `README.md:82` gatekeep blurb, `doc/configuration.md:12`, `:25`, `:192` (operations/tunable parameters - default `3` -> `5`, non-integer -> `5`, and gatekeep-pr spends `2 x` that value for rounds and for syncs); `CHANGELOG.md` `## Unreleased` entry in this change (the course model, the default `5`, the `2 x` cap, non-final `stop` teardown; `release.sh` promotes it)
- Derived / memory docs invalidated: `README.md` `## PR gate` `merge policy` row (chooses the `gh pr merge` flag for the final `merge` row; the sync strategy is authorship-based); `skills/verification-before-completion/reference/settings-precedence.md:25` and `reference/conformance-check.md:182` (restate the default `3` and the non-integer coercion)

Portable bar: `reference/documentation-impact.md`.

## Out of scope

- A gatekeep-only round-cap settings key; the multiplier covers the ask without a new key.
- Letter sub-options (`2A`/`2B`) and any change to `menu-layout.md`'s reply mapping.
- A `## PR gate` key that preselects the course; the initial menu stays the one decision.
- Resuming a course across sessions.
- The `--rebase [base]` step-2b entry sync; it runs once per invocation as today and is not the loop sync of D3.
- The verify-phase runtime guard's own cap (`1 x maxFixRounds`); the skill reports its block, never bypasses it.

## Open questions

none
