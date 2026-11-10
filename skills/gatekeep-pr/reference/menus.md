# gatekeep-pr: menus

Read at step 6; execute picks through `post-selection-loop.md` `### Next action`. Apply SKILL.md's wording rules and [menu-layout](../../brainstorming/reference/menu-layout.md)'s numeric mapping. Derive availability from the digest's permissions; `unreadable` fails closed.

Render every menu in full: the standing sentence, every available row as `<n>. <verb> - <consequence>`, then the hint. Never narrate or summarize a menu. Quote a numeric pick only after the rendered menu. Move the recommended action to row 1 before numbering every menu, including child and batch menus; tag only it `[recommended]`. Keep non-recommended stop last; other rows follow table order. Append ` recommended=1` to each gate line. Emit one first line per turn: the parent batch-summary marker for combined nonterminal child menus, each terminal post menu's marker in its own message. Keep runtime guard text inside the obstacle body, not a second marker.

Use `Pick one:` except for post combinations. Hint: `Type a number; show evidence prints the full record.` Append `check <name> flaky | real | ci-broken` for failing checks. Keep show evidence hint-only. Omit unavailable rows with a sentence from Missing rows; never suffix a disabled row. Under deliver, render no menu before an exit except contract exception.

## States

Take the first matching row. Resolve BLOCKED through `post-selection-loop.md` `### Merge preconditions` before selecting an obstacle; only BLOCKED without eligible bypass is undispositionable. The table switches rows off in addition to their availability rules.

| State | Entry | Archetype | Rows switched off | Marker |
|---|---|---|---|---|
| own-merge | This run's merge returned MERGED | post | wait | Start the message with `gauntlet: gate=gatekeep-pr/own-merge` |
| merge-queued | This run's merge returned another state | post | All except wait and stop | Start the message with `gauntlet: gate=gatekeep-pr/merge-queued` |
| approved | approved_head equals assessed head | post | Coverage, PR-named steps, wait | Start the message with `gauntlet: gate=gatekeep-pr/approved` |
| closed-pr | PR no longer OPEN | post | Own-merge coverage, wait; mark merge-dependent steps skipped on closed-unmerged | Start the message with `gauntlet: gate=gatekeep-pr/closed-pr` |
| contract-exception | Pending contract proposal | action | All except accept contract change, preserve contract and stop | Start the message with `gauntlet: gate=gatekeep-pr/contract-exception` |
| final | Readiness exit, including ready first report with course unset | final | deliver | Start the message with `gauntlet: gate=gatekeep-pr/final` |
| obstacle | Obstacle or cap exit, including course unset with undispositionable BLOCKED | action | Contract rows, deliver with nits | Start the message with `gauntlet: gate=gatekeep-pr/obstacle` |
| assess-terminal | Assess completed | final | merge, fix nits | Start the message with `gauntlet: gate=gatekeep-pr/assess-terminal` |
| initial | First report not ready, course unset: repairable blockers or pending-only CI | action | Contract rows, approve workflow run | Start the message with `gauntlet: gate=gatekeep-pr/initial`; render: `gauntlet: gate=gatekeep-pr/initial recommended=1` |

## Recommendation

Choose from the findings, including obstacle and cap exits. Apply these pins in order: contract-exception recommends `preserve contract`; when no available non-stop row can change the outcome, recommend `stop`; else use rule 3's own-PR action default. Treat bot-authored heads as someone else's. An unchanged failed prerequisite still blocks after a cap extension; a cap with a changed prerequisite does not force stop.

Without a pin, use the first match:

1. After assess, recommend stop unless a concrete change since that pick (new head, cleared blocker, author answer) warrants another row; name that change.
2. With a pending binding check or a failing check classified flaky as the only obstacle, recommend `deliver` when offered.
3. Recommend deliver for the human's own PR, assess for someone else's when an open blocker needs the author's decision. Use offered action rows. Require an author decision for behavior, contract or scope not settled by the ticket, spec or PR text: a missing requirement, an acceptance-criteria change, or a scope choice. Exclude repairs matching their promises.
4. When every open blocker has a drafted repair, none needs the author's decision, and the head is pushable and `deliver` is offered, recommend `deliver` regardless of authorship.
5. In the final state, recommend `merge` whenever available through the ordinary path or an eligible admin override, regardless of authorship; otherwise recommend `approve` when available, else `stop`.

Otherwise choose the available row that settles this PR with the fewest human stops. Put one sentence immediately above `Pick one:` naming the recommendation and its reason from the finding or state. A recommendation confers no authority; wait for the pick.

## action

| Row | Availability | Pick |
|---|---|---|
| `deliver` | Helpers, positive maxFixRounds, head_pushable true | Run the persistent delivery course to readiness, obstacle or cap; use `fix-wave.md` accounting. |
| `deliver with nits` | Delivery available and nits remain | Store deliver-nits; include all current and subsequently minted nits. |
| `assess` | Initial or obstacle | Post open blockers with locators as one head-pinned review through `post-selection-loop.md` `### Fix wave`; with zero blockers post nothing. Render assess-terminal, without repair or sync; keep C# replies behind reply. |
| `approve workflow run` | Held run on assessed head; viewer_permission WRITE, MAINTAIN or ADMIN | Run `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve`, refresh and watch under the course. |
| `accept contract change` | Pending recorded proposal | Invoke its owning amendment through `### Contract decision`; replace the baseline only after completion. |
| `preserve contract` | Pending recorded proposal | Reject the proposal, keep the named requirement and independent blockers, resume scope-preserving authorized work without the rejected payload this re-run. |
| `stop` | Always | Run `### Teardown`; non-final stop delegates to `cleanup.md` `## Non-final stop`. |

Show the proposal. Offer `accept contract change`, `preserve contract` `[recommended]`, then `stop` before numbering. Describe delivery sync as rebase for the viewer's own PR, merge main into the branch for someone else's or a bot's.

Own-PR: `1. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]`

### obstacle

Choose the recommendation through `## Recommendation`. Show the actual failed prerequisite. For undispositionable BLOCKED with no local repair, offer no wait row, no sync promise, and no approve row; describe deliver only as retrying after that prerequisite changes. With course unset describe starting work; otherwise describe continuing it.

For every non-timeout deliver selection, add exactly `2 x maxFixRounds` to both caps and persist before work, preserving usage; explain the added repair and sync attempts in the row, leaving counters under show evidence. On timeout offer exactly one additional watch window instead, with neither cap extended. An unchanged prerequisite re-exits even after extension.

## final

Choose the recommendation through `## Recommendation`; print its `[recommended]` tag on row 1.

| Row | Availability | Pick |
|---|---|---|
| `merge` | Non-draft; viewer_permission WRITE, MAINTAIN or ADMIN; all `### Merge preconditions` hold | Run `gh pr merge --match-head-commit <assessed-sha>` with the resolved policy flag; append `--admin` only on the bypass path in `post-selection-loop.md` `### Merge course`. |
| `approve` | viewer.is_author false, zero blockers, non-draft | Approve; persist approved_head only after success. |
| `fix nits` | Nits outside the course; helpers and head_pushable true; accounting permits one iteration | Run exactly one delivery iteration, course unchanged; initialize missing accounting through `fix-wave.md` `## Wave`. |
| `reply` | Unposted drafted reply, source review complete | Post drafted replyable C# replies; exact `reply <n>` selects one. |
| `deliver` | Assess-terminal; action's delivery availability | Switch to the delivery course defined in action. |
| `stop` | Always | Run Teardown; keep final stop distinct from non-final assess-terminal stop. |

For eligible BLOCKED readiness, explain that GitHub requires an admin override and required checks passed. Render `merge - <policy>-merge using your admin override.` Keep one merge row, no bypass row. Use merge policy solely as the command flag selector, never approval or sync strategy; spec approval history configures no menu. Keep the resolved source, head, check results and merge state under show evidence, not a report line or hint parenthetical.

## post

Render once on entry to own-merge, approved or closed-pr. Retain the numbered mapping in `post_steps` through inspection and execution. Build steps in this order:

| Step | Availability and pick |
|---|---|
| post the drafted replies | Unposted, source-reviewed drafts: post saved bodies to their PR threads. |
| post coverage to ticket | Own-merge, issue and scope rows, not previously successful: post the saved AC coverage block to the resolved ticket. |
| post coverage to PR | Own-merge, not previously successful: post the same block as a PR comment. |
| cleanup | At least one worktree, local branch or base-pull sub-step can run: execute `cleanup.md` steps 1-3. |
| each PR-named step | Merged PR, runnable through `findings.md` `## PR-named steps`: show its source sentence beside its command. |
| each cleanup override | One runnable merge-base `## cleanup` item per row, in list order: execute through `cleanup.md` step 4. |
| wait | Merge-queued only: re-run `gh pr view <N> --json state,mergeCommit`. MERGED records pr.state and pr.merge_commit and renders own-merge once; any other state re-renders merge-queued. Run no CI watch. |
| stop | Run Teardown without a step; retain its merge-queued ending for that variant. |

Only number a step with work to execute, showing its exact command or what it posts and where. List fully skipped steps below the rows with reasons, not numbers. Keep cleanup one row, naming skipped sub-steps and reasons beside runnable ones. Show substitutions, primary cwd, and the base-pull prerequisite for steps needing the merged change when cleanup is not picked.

With multiple runnable steps, make row 1 a combination naming members' labels and row numbers; give each step its own row below. Include all except the PR copy of coverage when the ticket copy is included, and apply `batch.md`'s shared-item scheduling. Omit another step only for a concrete assessment reason, stated above the prompt; always include runnable PR-named steps. With one runnable step it is row 1; with none offer only stop. Stop runs no step and delegates to Teardown.

Use `Pick one, or several separated by commas:`. Parse through `post-selection-loop.md` `### Next action`, execute through its `### Post steps`, and settle without another menu. That owner retains freshness, failed/unpicked payloads, nested skill gates and closing messages.

> I recommend every step except the PR copy of the checklist, because the ticket comment carries it.
>
> Pick one, or several separated by commas:
> 1. post the reply, post coverage to ticket, cleanup, publish the handbook, close the ticket - rows 2, 3, 5, 6 and 7. [recommended]
> 2. post the reply - answer robin's retry question in its PR thread.
> 3. post coverage to ticket - comment the acceptance checklist on acme/widgets#45.
> 4. post coverage to PR - comment the same checklist on the PR.
> 5. cleanup - remove .worktrees/csv-export (including untracked files), delete branch csv-export and pull main in the primary checkout.
> 6. publish the handbook - run `scripts/publish-handbook.sh` from the primary. The PR says: "After merge, publish the handbook."
> 7. close the ticket - run `gh issue close 45 --comment "Delivered in <pr url>, merged 9f1c2d3."`.
> 8. stop - run nothing; list unpicked steps with their commands.
>
> Type a number; show evidence prints the full record.

For merge-queued, take one number, never a combination; offer only wait and stop, recommend wait, and explain that coverage waits for the merge.

## Missing rows

Resolve every unmet prerequisite through `post-selection-loop.md` `### Exit check`; permission never turns a repairable gap into readiness. Explain each omission in one plain sentence; invent no named GitHub rule.

| Observation | Explanation |
|---|---|
| BLOCKED with no eligible bypass and no local repair | GitHub blocks this actor from merging and no local repair applies. |
| UNKNOWN/unreadable after one re-poll | GitHub's merge status could not be read, so merging cannot proceed. |
| binding pending check | Name the required check still running; watch only at delivery step 4. |
| draft | Mark the draft ready for review before merging or approval. |
| below WRITE | Merging needs write access to the repository. |
| own PR | You cannot approve your own PR. |
| missing helpers, zero cap, head not pushable | Name each reason delivery is unavailable. |
| other failed prerequisite | Name its actual missing input or unsafe state from Exit check. |

## batch summary

Start the message with `gauntlet: gate=gatekeep-pr/batch-summary`.

For a recovered `CONFLICTING` child, offer only safe `retry` and `stop`. Offer retry only after `batch.md`'s clean-recovery and no-rebase checks pass: re-dispatch assessment with the same record; otherwise explain its omission. Recommend retry when available, else stop. Offer no update branch or merge base rows.

Let `batch.md` render summary rows and child archetypes, preserving its admission, queue and row consequences. Keep terminal posts and queued-merge wait parent-owned after worktree removal, retaining every outcome for the parent's closing message.
