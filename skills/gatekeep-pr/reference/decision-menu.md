# gatekeep-pr: step 6 - menu

Read from SKILL.md step 6. Input: the report's verdict and the PR state. Output: the menu appended under the verdict line. Nothing executes until a pick; the pick runs per `post-selection-loop.md`.

## Verbs

`fix`, `push`, `review`, `approve`, `approve workflow run`, `update branch`, `merge`, `merge anyway`, `reply`, `propose ticket change`, `show evidence`, `wait`, `stop`.

Rows are `<n>. <verb> - <consequence>`; every row, `stop` included, carries its consequence clause. `stop` is always last, before the compose hint. `show evidence` is always offered and never `[recommended]`. A row the actor cannot execute - by `## Availability` below, or because the forge would refuse it (branch protection, a withhold) - is omitted and named in the compose line's `Not offered:` sentence; it is never `[recommended]`. Exactly one row is `[recommended]`.

- `fix` - apply the drafted payloads for the named blockers (default: all open blockers; with no open blockers, the nit payloads) through fresh implementer helpers in the provisioned worktree, review the wave before any push, push when `push` is available (`fix-wave.md`); `fix nits` applies nit payloads only, `fix + nits` blockers and nits; with no drafted payload at all, the human names the change
- `push` - push local fix commits (renders only when unpushed commits exist)
- `review` - post the blockers as a GitHub review: request-changes on someone else's PR, a comment on your own
- `approve` - approve the PR (never your own)
- `approve workflow run` - `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve` for a held run on the assessed head, then re-poll (`fix-wave.md` `## Evidence after push`)
- `update branch` - `gh pr update-branch <N>`, then fast-forward the worktree to the new head (`fix-wave.md` `## Conflicts`); renders on a conflict with no wave commit, or when `merge_state_status` is `BEHIND` at the merge preconditions
- `merge` - `gh pr merge --match-head-commit <assessed-sha>` with the resolved `merge policy` (default squash); preconditions per `post-selection-loop.md` `### Merge preconditions`
- `merge anyway - accept AC<n> as impossible` - merge while an `impossible` row withholds it; lifts exactly that AC's withhold
- `merge anyway` - merge while the pending-reviewer overlay withholds it; prints what it overrode
- `reply` - post the drafted replies under `PR comments` (`reply <n>` for one)
- `propose ticket change` - show the drafted AC text verbatim; post it as a tracker comment on an explicit confirmation reply, via the resolved tracker verb (`gh issue comment`, the overrides' tracker mapping, or `/skill:linear`); re-fetch the ticket first and re-render instead of posting when the AC row text drifted; no write path -> copy-paste block
- `show evidence` - print the evidence record, claim and AC outcomes, dispositions, drafted payloads and replies (`report.md` `## What stays out`)
- `wait` - poll the reviewer run, every pending check in the resolved set (required or not), and the comment set, then re-render
- `stop` - leave the PR as-is

Compose hint: `Type a number, or compose: "fix 2", "fix nits", "fix + nits", "fix 1 + reply". Not offered: push (needs push to <head_url>:<head_ref>), merge (needs WRITE on <owner>/<repo>).` The first sentence lists only compositions whose every verb is a rendered row: no `Nits` section, no `fix nits`; no `reply` row, no `fix 1 + reply`; no composable row, `Type a number.` alone. The second sentence names every omitted row as `<verb> (<why it is omitted>)` and is dropped when nothing is omitted. `merge anyway` and `merge anyway - accept AC<n> as impossible` render as their own rows when `## Availability` allows them, so the rendered-row rule does not apply to them. A composed line never bundles a push-producing verb (`fix`, `push`) with `merge`. When a failing check withholds `merge`, the hint line also offers `check <name> flaky | real | ci-broken`, which records the disposition on that check (`findings.md` `## Dispositions`): `flaky` lifts the blocker, `real` keeps it until green, `ci-broken` triggers the fallback local run (`ci-broken` records `ci-infrastructure-broken`).

A composed line naming an omitted row is refused by name and the menu re-renders; the two `merge anyway` rows are the only overrides.

## Availability

Rows derive from the digest's `permissions` block (`../verification-brief.md` Section A; `head_pushable` from step 2, `assessment.md`). A field that reads `unreadable` fails closed: its rows are omitted.

| Row | Available when |
|---|---|
| `fix` | a helper facility exists (`../SKILL.md` `## Harness notes`) and the fix-round cap is not `0` and the round cap is not reached (`fix-wave.md` `## Wave`) |
| `push` | `head_pushable` is true and unpushed wave commits exist and the last pre-push review had no Critical or Moderate finding |
| `merge` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and the merge preconditions hold (`post-selection-loop.md`) |
| `merge anyway`, `merge anyway - accept AC<n> as impossible` | its own overlay's withhold is the only unmet merge prerequisite (`post-selection-loop.md` `### Merge preconditions`) and `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`; otherwise omitted and named in `Not offered:` |
| `approve workflow run` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and a held run exists on the assessed head |
| `update branch` | `can_update_branch` is true and no unpushed wave commit exists |
| `approve`, `review`, `reply`, `propose ticket change`, `show evidence`, `wait`, `stop` | per the consent table and overlays below |

## Consent table

Authorship moves only `[recommended]`, never which rows are offered. The first rendered row is `[recommended]`; when every other row is `show evidence`, `stop` is `[recommended]`.

A `fixable` verdict with zero blockers (a withhold reason) uses the mergeable rows with `merge` omitted; the reason stays in the verdict line (`report.md`) and in the `Not offered:` sentence. On such a withhold, `[recommended]` goes to `approve workflow run` under the held-run overlay, else to `wait` under the verification-evidence-pending, pending-reviewer, or pending-required-check overlay, else to `propose ticket change` while an `impossible` row is `drafted`, else to `stop`.

| Author | Verdict | Rows |
|---|---|---|
| you | mergeable | `merge`; `fix`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| you | fixable | `fix`; `review`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | mergeable | `approve`; `fix`; `merge`; `reply` (when a drafted reply exists); `show evidence`; `stop` |
| someone else | fixable | `review`; `fix`; `reply` (when a drafted reply exists); `show evidence`; `stop` |

`propose ticket change` joins any row set after the `fix` rows whenever an `impossible` row is `drafted`. `push` joins any row set after `fix` when unpushed fix commits sit in the worktree.

## Overlays

Overlays modify the consent row; they are never a second offer source. When two apply, the one higher in this table wins the `merge` reason and `[recommended]`.

| Overlay | Trigger | Effect |
|---|---|---|
| merged or closed PR | `state` is not `OPEN` | the report renders; the menu is `show evidence` and `stop` only |
| draft PR | `isDraft` | `merge` and `approve` are omitted (`Not offered: merge (draft)`, plus `approve (draft)` when the consent row holds `approve`) and never carry `[recommended]`; `review` is recommended on someone else's fixable draft and `fix` on their mergeable draft; on your own, `fix` when a blocker exists, else `stop` |
| held run | an `action_required` conclusion on an Actions run of the assessed head (`../verification-brief.md` Evidence resolution, Held run) with no `local run: held run not approvable` evidence yet for that head | `approve workflow run` renders as row 1 when available (`## Availability`) and is `[recommended]` when `Blockers` is empty, else `[recommended]` stays on the consent row's first row; `merge` is omitted (`Not offered: merge (workflow run awaiting approval)`); once the held-run-not-approvable local run exists, this overlay no longer applies and `merge` follows the preconditions |
| verification evidence pending | the Evidence resolution table resolved Pending for the assessed head (`../verification-brief.md` Section B) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted (`Not offered: merge (verification evidence pending)`); consent rows otherwise unchanged |
| CI check | an undispositioned failing check in the resolved set, or a pending required check (`findings.md` `## Dispositions`); a held run is not a pending required check here (the `held run` overlay owns it) | on a failing check, the hint line offers `check <name> flaky \| real \| ci-broken`; `merge` is omitted (`Not offered: merge (<check name> failing)`); `flaky` restores `merge` on the next render; `real` and `ci-infrastructure-broken` keep it omitted until green; a pending required check renders one `PR comments` line (`A required check is still pending, so merge waits. (<check name>)`), puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`, and omits `merge` (`Not offered: merge (required check pending)`); it mints no disposition hint (not dispositionable) |
| pending reviewer | a `pending` ledger row, a queued or in-progress reviewer run on the assessed head, or a failed comment refetch (`post-selection-loop.md` `### Re-render`) | puts `wait` as row 1 and, when `Blockers` is empty, `[recommended]`; `merge` is omitted (`Not offered: merge (reviewer still running)` or `merge (comments not refreshed)`); `merge anyway` renders as its own row when `## Availability` allows it, overrides only this overlay, and does not bypass an unreviewed delta or a blocker; a `reviewer failed (<conclusion>)` row changes nothing |
| comment source review incomplete | the `### Re-render` step-4 source review of a comment delta did not finish (`post-selection-loop.md`) | one `PR comments` line `The comment source review did not finish, so merge waits. (<reason>)`; `merge` is omitted (`Not offered: merge (comment source review incomplete)`) with no `anyway` row; `reply` and `review` are dropped (the delta is unreviewed); `fix`, `show evidence`, `stop` stay; `stop` is `[recommended]` |
| impossible AC | an `impossible` row in `drafted` or `proposed` while every other merge prerequisite holds | `merge` is omitted (`Not offered: merge (ticket change pending on AC<n>)`); `merge anyway - accept AC<n> as impossible` renders as its own row when `## Availability` allows it and lifts exactly that withhold - blockers, an unreviewed delta, pending checks, and forge-refused states stay in force |
| head not pushable | `head_pushable` is false or `unreadable` (a fork head, a branch this actor cannot push, or an unreadable head) | `push` is omitted (`Not offered: push (needs push to <head_url>:<head_ref>)`); `fix` stays and applies to the local worktree branch (`assessment.md` provisioning), its consequence clause reading "open a PR from that branch, or hand the patch to the author"; `merge` follows `## Availability` |
| bot author | `author_is_bot` | the someone-else rows |

## Fixtures

Fixture 1 - own PR, fixable, one nit, one drafted ticket change, one drafted reply: the menu in `report.md` `## Worked example`.

Fixture 2 - the re-render after fixture 1's `fix` pushed; the reviewer bot is mid-run on the new head:

```
Delivers: the reports page exports CSV on demand. The PR covers AC1-2 of gh-45; AC3
(export completes under 5s on production data) is checked after merge, not here.

Ticket changes:
- AC4 asks for the customer's credit score in the export, and the vendor API this
  service reads returns no such field.
  Proposed wording: "Exports include the customer's risk tier." (drafted; vendor doc api.example.com/v2/customers)

PR comments:
- maria's comment on the missing CSV header is already addressed, so the drafted reply points her at the fix. (3f2a1c0)
- The reviewer run is still in progress, so merge waits. (https://github.com/<owner>/<repo>/actions/runs/<run-id>)

Nits:
- The export pages results with its own loop instead of the shared paging helper, so a paging bug fixed once would need fixing twice. (src/api/export.ts:31, lib/page.ts)

Verdict: fixable - reviewer run in progress

1. wait - poll the reviewer run, then re-render [recommended]
2. fix - apply the nit payload in the worktree, review the wave, push
3. propose ticket change - show the AC4 edit for approval before it posts
4. reply - post the drafted reply to maria
5. show evidence - gate output, CI run
6. stop - leave the PR as-is
Type a number, or compose: "fix nits". Not offered: merge (reviewer still running), merge anyway (ticket change pending on AC4), merge anyway - accept AC4 as impossible (reviewer still running).
```

Fixture 3 - a different PR: your own, ticket fully covered, no nits, no drafted replies; the reviewer bot's run was the only withhold and `wait` just returned.

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
