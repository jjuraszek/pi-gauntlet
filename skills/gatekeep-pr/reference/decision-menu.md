# gatekeep-pr: step 6 - menu

Read from SKILL.md step 6. Input: the report's verdict and the PR state. Output: the menu appended under the verdict line. Execute a pick or validated retained action only through `post-selection-loop.md` `### Next action`; the menu grants no authority by recommendation.

## Verbs

`accept contract change`, `preserve contract`, `fix`, `fix nits`, `push`, `review`, `approve`, `approve workflow run`, `update branch`, `merge base`, `merge`, `merge anyway`, `reply`, `post coverage to ticket`, `post coverage to PR`, `cleanup`, `show evidence`, `wait`, `stop`.

Render fix consequences with the applicable lifetime from `post-selection-loop.md` `### Continuation record`. For named fixes, state that authority retains only the selected stable IDs for later independent reassessments, with the same lifetime as broad fixes; link active pre-push retries to `fix-wave.md` `## Review before push`. For clarification-only fixes, state one-shot authority for the exactly selected payload; keep nit consequences one-shot.

Read and apply [menu-layout](../../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

Rows are `<n>. <verb> - <consequence>`; every row, `stop` included, carries its consequence clause. `stop` is always last, before the compose hint. `show evidence` is always offered and never `[recommended]`. A row the actor cannot execute - by `## Availability` below, or because the forge would refuse it (branch protection, a withhold) - is omitted and named in the compose line's `Not offered:` sentence; it is never `[recommended]`. Exactly one row is `[recommended]`. A **terminal overlay** is `own merge`, `merge queued` (once its read returns `MERGED` it re-renders as `own merge`), `approved`, or `merged or closed PR`; every other menu is an ordinary open-PR menu. **Landed** means the PR's `state` is `MERGED`; under `approved` and under a closed-unmerged PR nothing has landed.

- `accept contract change` - invoke the concrete proposal's owning amendment process through `post-selection-loop.md` `### Contract decision`; settle the baseline only after completion
- `preserve contract` - reject the concrete proposal and resume only permitted scope-preserving repair through `post-selection-loop.md` `### Contract decision`; keep independent blockers open
- `fix` - retain covered blocker repair during this run until readiness or a new decision boundary (`post-selection-loop.md`); apply description targets through the loop's Description repair and file payloads for the named blockers (open blockers by default) through fresh implementer helpers in the provisioned worktree, review the wave before any push, push when `push` is available (`fix-wave.md`); on a `rebased locally` head, lease-push once every carried blocker is resolved (`fix-wave.md` `## Evidence after push`); `fix + nits` composes this verb with `fix nits`
- `fix nits` - apply one-shot nit payloads drafted at this pick (`findings.md` `## Drafted payloads`) through fresh implementer helpers in the provisioned worktree, review the wave before any push, push when `push` is available (`fix-wave.md`); `fix + nits` typed with zero open blockers runs as this verb
- `push` - push local fix commits (renders only when unpushed commits exist)
- `review` - post the blockers as a GitHub review: request-changes on someone else's PR, a comment on your own
- `approve` - approve the PR (never your own)
- `approve workflow run` - `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve` for a held run on the assessed head, then re-enter the refresh (`post-selection-loop.md` `### Pre-menu refresh`)
- `update branch` - `gh pr update-branch <N>`, then fast-forward the worktree to the new head (`fix-wave.md` `## Conflicts`); renders on a conflict with no wave commit, or when `merge_state_status` is `BEHIND` at the merge preconditions
- `merge base` - retain merging the recorded base and resolving conflicts through reviewed helper work and push during this run until readiness or a new decision boundary (`fix-wave.md`)
- `merge` - `gh pr merge --match-head-commit <assessed-sha>` with the flag of the resolved `merge policy` (`squash` -> `--squash`, `merge-commit` -> `--merge`, `rebase` -> `--rebase`; default squash); preconditions per `post-selection-loop.md` `### Merge preconditions`, including the repo allowing that method
- `merge anyway` - merge while the pending-reviewer overlay withholds it; prints what it overrode
- `reply` - post the drafted replies under `PR comments` (`reply <n>` for one)
- `post coverage to ticket` - post the rendered `AC coverage` block as a comment on the source ticket via the resolved tracker verb (`gh issue comment`, the overrides' tracker mapping, or `/skill:linear`); renders only under the `own merge` overlay
- `post coverage to PR` - post the same block with `gh pr comment <N> --body-file`; renders only under the `own merge` overlay
- `cleanup` - tear down the gate's checkout and local branch per `cleanup.md`, then run the repo's `## cleanup` steps in order; the consequence clause names each override step as `<label> (<resolved command>)` with placeholders already substituted, so the exact tracker comment or release invocation is visible before the pick; with no `## cleanup` section the clause reads `tear down the gate's checkout and local branch (untracked files there are deleted)`
- `show evidence` - print the evidence record, claim and AC outcomes, dispositions, drafted payloads and replies (`report.md` `## What stays out`)
- `wait` - run one bounded `gh pr checks --watch` on every **binding** pending check in the resolved set (required or not), then re-render
- `stop` - leave the PR as-is; under a terminal overlay leave the checkout as found and print one line naming the leftover worktree path and local branch; on an ordinary open-PR menu with a `rebased locally` head run `git reset --hard <pre_head>` before `### Teardown`, discarding the rewrite and any unpushed fix commits, and assert `HEAD == <pre_head>` with a clean tree; a mismatch is the existing hard stop with the error, and the remote stays untouched

Compose hint: `Type a number, or compose: "fix 2", "fix nits", "fix + nits", "fix 1 + reply". Not offered: push (needs push to <head_url>:<head_ref>), merge (needs WRITE on <owner>/<repo>).` The first sentence lists only compositions whose every verb is a rendered row: `fix nits` and `fix + nits` appear only when both the `fix` and `fix nits` rows render; no `reply` row, no `fix 1 + reply`; no composable row, `Type a number.` alone. The second sentence names every omitted row as `<verb> (<why it is omitted>)` and is dropped when nothing is omitted. `merge anyway` renders as its own row when `## Availability` allows it, so the rendered-row rule does not apply to it. Offer `revoke fix` and `revoke merge base` compose forms for held grants, persisting only the named revocation through the loop. A composed line never bundles a push-producing verb (`fix`, `fix nits`, `push`, `merge base`) with `merge`. When a failing check withholds `merge`, the hint line also offers `check <name> flaky | real | ci-broken`, which records the disposition on that check (`findings.md` `## Dispositions`): `flaky` lifts the blocker, `real` keeps it until green, `ci-broken` triggers the fallback local run (`ci-broken` records `ci-infrastructure-broken`).

A composed line naming an omitted row is refused by name and the menu re-renders; the `merge anyway` row is the only override.

## Availability

Rows derive from the digest's `permissions` block (`../verification-brief.md` Section A; `head_pushable` from step 2, `assessment.md`). A field that reads `unreadable` fails closed: its rows are omitted.

| Row | Available when |
|---|---|
| `accept contract change`, `preserve contract` | a recorded contract exception is pending and no terminal/sync stop applies; route numeric and typed selections through `post-selection-loop.md` `### Contract decision` |
| `fix` | an open blocker or explicitly requested exact clarification payload exists (a failing-check `P#` included), a helper facility exists (`../SKILL.md` `## Harness notes`), and the fix-round cap is neither `0` nor reached (`fix-wave.md` `## Wave`) |
| `fix nits` | a nit exists, a helper facility exists (`../SKILL.md` `## Harness notes`), and the fix-round cap is neither `0` nor reached (`fix-wave.md` `## Wave`); a `fix` with neither blocker nor requested clarification, or a `fix nits` with no nit, is dropped from the row set and never named in `Not offered:` |
| `merge base` | open PR with `mergeable: CONFLICTING` or `mergeStateStatus: BEHIND`, even with zero code blockers; head_pushable true, helpers, remaining budget, and no terminal/sync stop; preserve rebased-locally lease-only restrictions |
| `push` | `head_pushable` is true and unpushed wave commits exist and the last pre-push review's carried set (`fix-wave.md` `## Review before push`) held no Critical or Moderate |
| `merge` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and the merge preconditions hold (`post-selection-loop.md`) |
| `merge anyway` | its own overlay's withhold is the only unmet merge prerequisite (`post-selection-loop.md` `### Merge preconditions`) and `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`; otherwise omitted and named in `Not offered:` |
| `approve workflow run` | `viewer_permission` is `WRITE`, `MAINTAIN`, or `ADMIN`, and a held run exists on the assessed head |
| `update branch` | `can_update_branch` is true and no unpushed wave commit exists |
| `update branch`, `review`, `merge`, `merge anyway`, `push`, `wait` | omitted while the sync record is `rebased locally`, named in `Not offered:` as `(head not pushed)`; the fix wave's lease push is the only write to the PR head |
| `cleanup` | only under a terminal overlay, never on an ordinary open-PR menu; it leaves the menu after it runs, success or not (`cleanup.md`) |
| `approve`, `review`, `reply`, `post coverage to ticket`, `post coverage to PR`, `show evidence`, `wait`, `stop` | per the consent table and overlays below |

## Consent table

Read `menus.md` `## Consent table` now.

## Withhold reason resolver

The single source for the merge-withhold reason, the `PR comments` line, and the `Not offered: merge (...)` text, in this precedence; overlays above `merge state` (merged or closed PR, draft PR, held run) keep their own reasons, and under two firing overlays the higher one owns the reason and the single `PR comments` line - the first matching reason renders, and `report.md`'s `fixable - <withhold reason>` carries the same word:

1. `merge_state_status` is `BLOCKED` -> line `GitHub reports this actor's merge as blocked, so merge waits. (merge_state_status BLOCKED; reviewDecision <value>)`, `Not offered: merge (blocked by GitHub)`, reason `blocked by GitHub`. `reviewDecision` rides as a locator only - never as a claim about which rule blocks, and no rendered sentence says another developer's approval is required.
2. `merge_state_status` is `UNKNOWN` or `unreadable`, or the pre-menu refresh failed -> line `GitHub has not reported this actor's merge state, so merge waits. (merge_state_status <value>)` (on a failed refresh the locator is `merge state not refreshed (<reason>)`), `Not offered: merge (merge state unknown)`, reason `merge state unknown`.
3. a binding pending check (`../verification-brief.md` Section B, binding classification) -> line `A check that binds this actor is still pending, so merge waits. (<check name>)`, `Not offered: merge (<check name> pending)`, reason `binding check pending`.

## Overlays

Read `menus.md` `## Overlays` now.

## Fixtures

Read `menus.md` `## Fixtures` now.
