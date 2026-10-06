# gatekeep-pr: step 6 - menu

Read from SKILL.md step 6. Input: the report's verdict and the PR state. Output: the menu appended under the verdict line. Nothing executes until a pick; the pick runs per `post-selection-loop.md`.

## Verbs

`fix`, `push`, `review`, `approve`, `approve workflow run`, `update branch`, `merge`, `merge anyway`, `reply`, `post coverage to ticket`, `post coverage to PR`, `show evidence`, `wait`, `stop`.

Rows are `<n>. <verb> - <consequence>`; every row, `stop` included, carries its consequence clause. `stop` is always last, before the compose hint. `show evidence` is always offered and never `[recommended]`. A row the actor cannot execute - by `## Availability` below, or because the forge would refuse it (branch protection, a withhold) - is omitted and named in the compose line's `Not offered:` sentence; it is never `[recommended]`. Exactly one row is `[recommended]`.

- `fix` - apply the drafted payloads for the named blockers (default: all open blockers; with no open blockers, the nit payloads) through fresh implementer helpers in the provisioned worktree, review the wave before any push, push when `push` is available (`fix-wave.md`); `fix nits` applies nit payloads only, `fix + nits` blockers and nits; with no drafted payload at all, the human names the change
- `push` - push local fix commits (renders only when unpushed commits exist)
- `review` - post the blockers as a GitHub review: request-changes on someone else's PR, a comment on your own
- `approve` - approve the PR (never your own)
- `approve workflow run` - `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve` for a held run on the assessed head, then re-poll (`fix-wave.md` `## Evidence after push`)
- `update branch` - `gh pr update-branch <N>`, then fast-forward the worktree to the new head (`fix-wave.md` `## Conflicts`); renders on a conflict with no wave commit, or when `merge_state_status` is `BEHIND` at the merge preconditions
- `merge` - `gh pr merge --match-head-commit <assessed-sha>` with the resolved `merge policy` (default squash); preconditions per `post-selection-loop.md` `### Merge preconditions`
- `merge anyway` - merge while the pending-reviewer overlay withholds it; prints what it overrode
- `reply` - post the drafted replies under `PR comments` (`reply <n>` for one)
- `post coverage to ticket` - post the rendered `AC coverage` block as a comment on the source ticket via the resolved tracker verb (`gh issue comment`, the overrides' tracker mapping, or `/skill:linear`); renders only under the `own merge` overlay
- `post coverage to PR` - post the same block with `gh pr comment <N> --body-file`; renders only under the `own merge` overlay
- `show evidence` - print the evidence record, claim and AC outcomes, dispositions, drafted payloads and replies (`report.md` `## What stays out`)
- `wait` - poll the reviewer run, every **binding** pending check in the resolved set (required or not), `mergeStateStatus` while it is `BLOCKED`, `UNKNOWN`, or `unreadable`, and the comment set, then re-render
- `stop` - leave the PR as-is

Compose hint: `Type a number, or compose: "fix 2", "fix nits", "fix + nits", "fix 1 + reply". Not offered: push (needs push to <head_url>:<head_ref>), merge (needs WRITE on <owner>/<repo>).` The first sentence lists only compositions whose every verb is a rendered row: no `Nits` section, no `fix nits`; no `reply` row, no `fix 1 + reply`; no composable row, `Type a number.` alone. The second sentence names every omitted row as `<verb> (<why it is omitted>)` and is dropped when nothing is omitted. `merge anyway` renders as its own row when `## Availability` allows it, so the rendered-row rule does not apply to it. A composed line never bundles a push-producing verb (`fix`, `push`) with `merge`. When a failing check withholds `merge`, the hint line also offers `check <name> flaky | real | ci-broken`, which records the disposition on that check (`findings.md` `## Dispositions`): `flaky` lifts the blocker, `real` keeps it until green, `ci-broken` triggers the fallback local run (`ci-broken` records `ci-infrastructure-broken`).

A composed line naming an omitted row is refused by name and the menu re-renders; the `merge anyway` row is the only override.

## Availability

Rows derive from the digest's `permissions` block (`../verification-brief.md` Section A; `head_pushable` from step 2, `assessment.md`). A field that reads `unreadable` fails closed: its rows are omitted.

| Row | Available when |
|---|---|
| `fix` | a helper facility exists (`../SKILL.md` `## Harness notes`) and the fix-round cap is not `0` and the round cap is not reached (`fix-wave.md` `## Wave`) |
| `push` | `head_pushable` is true and unpushed wave commits exist and the last pre-push review had no Critical or Moderate finding |
| `merge` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and the merge preconditions hold (`post-selection-loop.md`) |
| `merge anyway` | its own overlay's withhold is the only unmet merge prerequisite (`post-selection-loop.md` `### Merge preconditions`) and `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`; otherwise omitted and named in `Not offered:` |
| `approve workflow run` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and a held run exists on the assessed head |
| `update branch` | `can_update_branch` is true and no unpushed wave commit exists |
| `approve`, `review`, `reply`, `post coverage to ticket`, `post coverage to PR`, `show evidence`, `wait`, `stop` | per the consent table and overlays below |

## Consent table

Authorship moves only `[recommended]`, never which rows are offered. The first rendered row is `[recommended]`; when every other row is `show evidence`, `stop` is `[recommended]`.

A `fixable` verdict with zero blockers (a withhold reason) uses the mergeable rows with `merge` omitted; the reason stays in the verdict line (`report.md`) and in the `Not offered:` sentence. On such a withhold, `[recommended]` goes to `approve workflow run` under the held-run overlay, else to `approve` or `wait` under the merge state overlay, else to `wait` under the verification-evidence-pending, pending-reviewer, or binding-pending-check overlay, else to `stop`.

| Author | Verdict | Rows |
|---|---|---|
| you | mergeable | `merge`; `fix`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| you | fixable | `fix`; `review`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | mergeable | `approve`; `fix`; `merge`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | fixable | `review`; `fix`; `reply` (when a drafted reply exists); `show evidence`; `stop` |

`push` joins any row set after `fix` when unpushed fix commits sit in the worktree.

## Withhold reason resolver

The single source for the merge-withhold reason, the `PR comments` line, and the `Not offered: merge (...)` text, in this precedence; overlays above `merge state` (merged or closed PR, draft PR, held run) keep their own reasons, and under two firing overlays the higher one owns the reason and the single `PR comments` line - the first matching reason renders, and `report.md`'s `fixable - <withhold reason>` carries the same word:

1. `merge_state_status` is `BLOCKED` -> line `GitHub reports this actor's merge as blocked, so merge waits. (merge_state_status BLOCKED; reviewDecision <value>)`, `Not offered: merge (blocked by GitHub)`, reason `blocked by GitHub`. `reviewDecision` rides as a locator only - never as a claim about which rule blocks, and no rendered sentence says another developer's approval is required.
2. `merge_state_status` is `UNKNOWN` or `unreadable`, or the pre-menu refresh failed -> line `GitHub has not reported this actor's merge state, so merge waits. (merge_state_status <value>)` (on a failed refresh the locator is `merge state not refreshed (<reason>)`), `Not offered: merge (merge state unknown)`, reason `merge state unknown`.
3. a binding pending check (`../verification-brief.md` Section B, binding classification) -> line `A check that binds this actor is still pending, so merge waits. (<check name>)`, `Not offered: merge (<check name> pending)`, reason `binding check pending`.

## Overlays

Overlays modify the consent row; they are never a second offer source, except `own merge`, which supplies the post-coverage rows. When two apply, the one higher in this table wins the `merge` reason and `[recommended]`.

| Overlay | Trigger | Effect |
|---|---|---|
| own merge | this run's `merge` pick ran and the post-merge read (`post-selection-loop.md` `### Merge course`) returned `state: MERGED` | the menu is `post coverage to ticket` (when `issue` is non-null and `scope.rows` is non-empty), `post coverage to PR`, `show evidence`, `stop`, with `stop` `[recommended]`; each post row renders once and leaves the menu after its post succeeds; a failed post keeps its row and prints the `gh` error; no compare-and-swap runs before a post |
| merge queued | this run's `merge` pick ran and the post-merge read returned a state other than `MERGED` | the menu is `wait` (re-run the post-merge read, then re-render), `show evidence`, `stop`, with `wait` `[recommended]`; one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` |
| merged or closed PR | `state` was not `OPEN` at step 1 | the report renders; the menu is `show evidence` and `stop` only |
| draft PR | `isDraft` | `merge` and `approve` are omitted (`Not offered: merge (draft)`, plus `approve (draft)` when the consent row holds `approve`) and never carry `[recommended]`; `review` is recommended on someone else's fixable draft and `fix` on their mergeable draft; on your own, `fix` when a blocker exists, else `stop` |
| held run | an `action_required` conclusion on an Actions run of the assessed head (`../verification-brief.md` Evidence resolution, Held run) with no `local run: held run not approvable` evidence yet for that head | `approve workflow run` renders as row 1 when available (`## Availability`) and is `[recommended]` when `Blockers` is empty, else `[recommended]` stays on the consent row's first row; `merge` is omitted (`Not offered: merge (workflow run awaiting approval)`); once the held-run-not-approvable local run exists, this overlay no longer applies and `merge` follows the preconditions |
| merge state | `merge_state_status` is `BLOCKED`, `UNKNOWN`, or `unreadable`, or the pre-menu refresh failed (`post-selection-loop.md` `### Pre-menu refresh`) - independent of any pending check, so a green-CI state-only block fires it | one `PR comments` line from `## Withhold reason resolver` (reason 1 or 2); `wait` as row 1; `[recommended]` goes to `approve` when the consent row renders it (someone else's PR, resolver reason 1, `reviewDecision` `REVIEW_REQUIRED`) - recommending a row attributes nothing to a rule - else to `wait` when `Blockers` is empty; `merge` omitted with the resolver's `Not offered` text; no `anyway` row |
| verification evidence pending | the Evidence resolution table resolved Pending for the assessed head (`../verification-brief.md` Section B) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted with `## Withhold reason resolver` reason 3's text; consent rows otherwise unchanged |
| CI check | an undispositioned failing check in the resolved set, or a binding pending check (`findings.md` `## Dispositions`); a held run is not a binding pending check here (the `held run` overlay owns it) | on a failing check, the hint line offers `check <name> flaky \| real \| ci-broken`; `merge` is omitted (`Not offered: merge (<check name> failing)`); `flaky` restores `merge` on the next render; `real` and `ci-infrastructure-broken` keep it omitted until green; a binding pending check renders one `PR comments` line and omits `merge` with the text of `## Withhold reason resolver` reason 3, and puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; under both this and the `merge state` overlay the higher one owns the reason and the single `PR comments` line; it mints no disposition hint (not dispositionable) |
| pending reviewer | a `pending` ledger row, a queued or in-progress reviewer run on the assessed head, or a failed comment refetch (`post-selection-loop.md` `### Re-render`) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted (`Not offered: merge (reviewer still running)` or `merge (comments not refreshed)`); `merge anyway` renders as its own row when `## Availability` allows it, overrides only this overlay, and does not bypass an unreviewed delta or a blocker; a `reviewer failed (<conclusion>)` row changes nothing |
| comment source review incomplete | the `### Re-render` step-4 source review of a comment delta did not finish (`post-selection-loop.md`) | one `PR comments` line `The comment source review did not finish, so merge waits. (<reason>)`; `merge` is omitted (`Not offered: merge (comment source review incomplete)`) with no `anyway` row; `reply` and `review` are dropped (the delta is unreviewed); `fix`, `show evidence`, `stop` stay; `stop` is `[recommended]` |
| head not pushable | `head_pushable` is false or `unreadable` (a fork head, a branch this actor cannot push, or an unreadable head) | `push` is omitted (`Not offered: push (needs push to <head_url>:<head_ref>)`); `fix` stays and applies to the local worktree branch (`assessment.md` provisioning), its consequence clause reading "open a PR from that branch, or hand the patch to the author"; `merge` follows `## Availability` |
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

Verdict: fixable - reviewer run in progress

1. wait - poll the reviewer run, then re-render [recommended]
2. fix - apply the nit payload in the worktree, review the wave, push
3. reply - post the drafted reply to maria
4. show evidence - gate output, CI run
5. stop - leave the PR as-is
Type a number, or compose: "fix nits". Not offered: merge (reviewer still running).
```

Fixture 3 - a different PR: your own, every spec row covered, no nits, no drafted replies; the reviewer bot's run was the only withhold and `wait` just returned.

(a) The run concluded `failure`: the `PR comments` line disappears, the reviewer check is inert, the verdict is `mergeable - CI green on the assessed head (test)`, and the menu is `merge` [recommended], `fix`, `show evidence`, `stop`.

(b) The run concluded `success` and the verdict comment raises a retry bug; source review confirms it and mints a blocker:

```
PR comments:
- The reviewer bot's retry concern holds up against the source, so the drafted reply confirms it. (src/retry.ts)

Blockers:
1. Retries never count up, so a failing call retries forever instead of giving up
   after the limit. (src/retry.ts:41)

Verdict: fixable - 1 blocker

1. fix - apply the blocker in the worktree, review the wave, push          [recommended]
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

1. post coverage to ticket - comment the block above on acme/widgets#45
2. post coverage to PR - comment the block above on the PR
3. show evidence - gate output, CI run
4. stop - leave the PR as-is                                        [recommended]
Type a number.
```
