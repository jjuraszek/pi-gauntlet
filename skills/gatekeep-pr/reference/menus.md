# gatekeep-pr: menu templates

Read from SKILL.md step 6 with `decision-menu.md`.

## Consent table

Authorship moves only `[recommended]`, never which rows are offered. The first rendered row is `[recommended]`; when every other row is `show evidence`, `stop` is `[recommended]`.

A `fixable` verdict with zero blockers (a withhold reason) uses the mergeable rows with `merge` omitted; the reason stays in the verdict line (`report.md`) and in the `Not offered:` sentence. On such a withhold, `[recommended]` goes to `approve workflow run` under the held-run overlay, else to `approve` or `wait` under the merge state overlay, else to `wait` under the verification-evidence-pending, pending-reviewer, or binding-pending-check overlay, else to `stop`.

| Author | Verdict | Rows |
|---|---|---|
| you | mergeable | `merge`; `fix nits`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| you | fixable | `fix`; `fix nits`; `review`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | mergeable | `approve`; `fix nits`; `merge`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | fixable | `review`; `fix`; `fix nits`; `reply` (when a drafted reply exists); `show evidence`; `stop` |

Add `fix` to mergeable rows only for an explicitly requested exact clarification; a clarification-only selection grants that payload and no ongoing blocker grant. Add available `merge base` to applicable main row sets without a fake blocker or empty fix. With no held strategy, prefer available `update branch`, otherwise recommend available `merge base`; higher safety overlays keep their recommendation. Preserve a held merge-base strategy, never replace it with update branch or rerun --rebase step 2b.

`push` joins any row set after `fix` or `fix nits` when unpushed fix commits sit in the worktree.


## Overlays

For a pending contract exception, print the concrete proposed contract change before the rows, using the recorded proposal; numeric and typed picks select these actual rows and route to `post-selection-loop.md` `### Contract decision`. Render the `preserve contract` consequence as "reject the proposal, keep <named requirement>, and resume authorized implementation repair within it". Existing terminal/sync stops take precedence; otherwise the contract-exception overlay replaces ordinary rows, and lower overlays cannot discard its decision rows.

Apply overlays to the consent row; take additional rows only from a terminal overlay (`cleanup` and the post-coverage rows) or the pending `contract exception` (contract-decision rows). When two apply, the one higher in this table wins the `merge` reason and `[recommended]`.

| Overlay | Trigger | Effect |
|---|---|---|
| own merge | this run's `merge` pick ran and the post-merge read (`post-selection-loop.md` `### Merge course`) returned `state: MERGED` | the menu is `cleanup` `[recommended]`, `post coverage to ticket` (when `issue` is non-null and `scope.rows` is non-empty), `post coverage to PR`, `show evidence`, `stop`; each post row renders once and leaves the menu after its post succeeds, and a successful post re-renders this menu - posting never tears down and never ends the run; a failed post keeps its row and prints the `gh` error; no compare-and-swap runs before a post |
| merge queued | this run's `merge` pick ran and the post-merge read returned a state other than `MERGED` | the menu is `wait` (re-run the post-merge read, then re-render), `show evidence`, `stop`, with `wait` `[recommended]`; one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` |
| approved | the continuation record's `approved_head` equals the assessed head (`post-selection-loop.md` sets it only when `gh pr review --approve` exits 0, before the re-render; a non-zero exit prints the `gh` error and the ordinary menu re-renders) | the menu is `cleanup` `[recommended]`, `show evidence`, `stop` |
| merged or closed PR | `state` was not `OPEN` at step 1 | the report renders; the menu is `cleanup` `[recommended]`, `show evidence`, `stop` |
| contract exception | a recorded contract exception is pending, with no terminal/sync stop | replace the ordinary menu with `accept contract change`, `preserve contract`, `show evidence`, `stop`; recommend `preserve contract`; use `post-selection-loop.md` `### Contract decision` for every selection |
| draft PR | `isDraft` | `merge` and `approve` are omitted (`Not offered: merge (draft)`, plus `approve (draft)` when the consent row holds `approve`) and never carry `[recommended]`; `review` is recommended on someone else's fixable draft, `fix nits` on their mergeable draft when a nit exists, else `stop`; on your own, `fix` when a blocker exists, else `stop` |
| held run | an `action_required` conclusion on an Actions run of the assessed head (`../verification-brief.md` Evidence resolution, Held run) with no `local run: held run not approvable` evidence yet for that head | `approve workflow run` renders as row 1 when available (`## Availability`) and is `[recommended]` when `Blockers` is empty, else `[recommended]` stays on the consent row's first row; `merge` is omitted (`Not offered: merge (workflow run awaiting approval)`); once the held-run-not-approvable local run exists, this overlay no longer applies and `merge` follows the preconditions |
| merge state | `merge_state_status` is `BLOCKED`, `UNKNOWN`, or `unreadable`, or the pre-menu refresh failed (`post-selection-loop.md` `### Pre-menu refresh`) - independent of any pending check, so a green-CI state-only block fires it | one `PR comments` line from `## Withhold reason resolver` (reason 1 or 2); `wait` as row 1; `[recommended]` goes to `approve` when the consent row renders it (someone else's PR, resolver reason 1, `reviewDecision` `REVIEW_REQUIRED`) - recommending a row attributes nothing to a rule - else to `wait` when `Blockers` is empty; `merge` omitted with the resolver's `Not offered` text; no `anyway` row |
| verification evidence pending | the Evidence resolution table resolved Pending for the assessed head (`../verification-brief.md` Section B) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted with `## Withhold reason resolver` reason 3's text; consent rows otherwise unchanged |
| CI check | an undispositioned failing check in the resolved set, or a binding pending check (`findings.md` `## Dispositions`); a held run is not a binding pending check here (the `held run` overlay owns it) | on a failing check, the hint line offers `check <name> flaky \| real \| ci-broken`; `merge` is omitted (`Not offered: merge (<check name> failing)`); `flaky` restores `merge` on the next render; `real` and `ci-infrastructure-broken` keep it omitted until green; a binding pending check renders one `PR comments` line and omits `merge` with the text of `## Withhold reason resolver` reason 3, and puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; under both this and the `merge state` overlay the higher one owns the reason and the single `PR comments` line; it mints no disposition hint (not dispositionable) |
| pending reviewer | a `pending` ledger row, a queued or in-progress reviewer run on the assessed head, or a failed comment refetch (`post-selection-loop.md` `### Re-render`) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted (`Not offered: merge (reviewer still running)` or `merge (comments not refreshed)`); `merge anyway` renders as its own row when `## Availability` allows it, overrides only this overlay, and does not bypass an unreviewed delta or a blocker; a `reviewer failed (<conclusion>)` row changes nothing |
| comment source review incomplete | the `### Re-render` step-4 source review of a comment delta did not finish (`post-selection-loop.md`) | one `PR comments` line `The comment source review did not finish, so merge waits. (<reason>)`; `merge` is omitted (`Not offered: merge (comment source review incomplete)`) with no `anyway` row; `reply` and `review` are dropped (the delta is unreviewed); `fix`, `fix nits`, `show evidence`, `stop` stay; `stop` is `[recommended]` |
| head not pushable | `head_pushable` is false or `unreadable` (a fork head, a branch this actor cannot push, or an unreadable head) | `push` is omitted (`Not offered: push (needs push to <head_url>:<head_ref>)`); `fix` and `fix nits` stay and apply to the local worktree branch (`assessment.md` provisioning), their consequence clauses reading "open a PR from that branch, or hand the patch to the author"; `merge` follows `## Availability` |
| bot author | `author_is_bot` | the someone-else rows |


## Fixtures

Fixture 1 - own PR, fixable, one nit, one drafted reply: the menu in `report.md` `## Worked example`.

Fixture 2 - the re-render after fixture 1's `fix` pushed; the reviewer bot is mid-run on the new head:

```
Delivers: the reports page exports CSV on demand. ACs 1, 2, 4; 3 deferred per spec to acme/widgets#46; 4's observable half (export completes under 5s on production data) is checked after merge, not here.

PR comments:
- maria's comment on the missing CSV header is already addressed, so the drafted reply points her at the fix. (3f2a1c0)
- The reviewer run is still in progress, so merge waits. (https://github.com/<owner>/<repo>/actions/runs/<run-id>)

Nits:
- The export pages results with its own loop instead of the shared paging helper, so a paging bug fixed once would need fixing twice. (src/api/export.ts:31, lib/page.ts)
1 nit open - fix nits to take them

Verdict: fixable - reviewer run in progress

1. wait - run one bounded CI watch, then re-render [recommended]
2. fix nits - apply the one-shot nit payload in the worktree, review the wave, push
3. reply - post the drafted reply to maria
4. show evidence - gate output, CI run
5. stop - leave the PR as-is
Type a number. Not offered: merge (reviewer still running).
```

Fixture 3 - a different PR: your own, every spec row covered, no nits, no drafted replies; the reviewer bot's run was the only withhold and `wait` just returned.

(a) The run concluded `failure`: the `PR comments` line disappears, the reviewer check is inert, the verdict is `mergeable - CI green on the assessed head (test)`, and the menu is `merge` [recommended], `show evidence`, `stop`.

(b) The run concluded `success` and the verdict comment raises a retry bug; source review confirms it and mints a blocker:

```
PR comments:
- The reviewer bot's retry concern holds up against the source, so the drafted reply confirms it. (src/retry.ts)

Blockers:
1. Retries never count up, so a failing call retries forever instead of giving up
   after the limit. (src/retry.ts:41)

Verdict: fixable - 1 blocker

1. fix - retain in-scope blocker repair during this run until readiness or a new decision boundary; review before push [recommended]
2. review - post the blocker as a comment on your PR
3. reply - post the drafted reply
4. show evidence - gate output, CI run, drafted edit
5. stop - leave the PR as-is
Type a number, or compose: "fix 1 + reply".
```

When source review disproves the comment, no blocker is minted; the mergeable menu renders with `reply` for the drafted reply.

Fixture 4 - the pre-merge refetch finds a new human comment after a `merge` pick: the merge aborts even when the concern is false, the comment is reviewed against source, and the menu re-renders for a fresh pick. A same-head identical-body timestamp edit mints a ledger row but triggers no source review or test run.

Fixture 5 - this run's `merge` pick succeeded (`state: MERGED`):

```
## AC coverage
Informational - the ticket's rows are unchanged. PR https://github.com/acme/widgets/pull/210, merged 9f1c2d3, spec <path>
- [ ] The reports page offers an Export CSV button. - covered
- [ ] Exports are emailed to the requesting user. - deferred per spec to acme/widgets#46

1. cleanup - remove .worktrees/pr-210 and branch csv-export, pull main, then close ticket (gh issue close 45 --comment "Delivered in https://github.com/acme/widgets/pull/210, merged 9f1c2d3e4b5a6978.") [recommended]
2. post coverage to ticket - comment the block above on acme/widgets#45
3. post coverage to PR - comment the block above on the PR
4. show evidence - gate output, CI run
5. stop - leave the PR as-is; .worktrees/pr-210 and branch csv-export stay
Type a number.
```
