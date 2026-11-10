# gatekeep-pr: menu templates

Read with `decision-menu.md` at step 6. Select the template from this state map; terminal state takes precedence over a pending contract exception, which takes precedence over course execution.

| State | Template |
|---|---|
| this run's merge returned MERGED | own merge |
| this run's merge returned another state | merge queued |
| approved_head equals assessed head | approved |
| PR state no longer OPEN | closed PR |
| pending contract exception | contract exception |
| readiness exit, including first report ready with course unset | final |
| obstacle or cap exit, including course unset with undispositionable BLOCKED | obstacle |
| assess completed | assess terminal |
| first report not ready, course unset | initial |
| multi-PR parent round | batch summary |

Resolve BLOCKED through `post-selection-loop.md` `### Merge preconditions` before selecting an obstacle; treat only BLOCKED without eligible bypass as undispositionable.

Render every menu in full from its template: the verdict line, every available row, and the hint line. Never narrate or summarize a menu; do not substitute "the initial template applied; the human picked 2" for its rendering. Quote a numeric pick only after the rendered menu.

Append ` recommended=1` to each gate line. Emit one first line per turn; when combining batch summary and nonterminal child menus, emit only the parent `gatekeep-pr/batch-summary` line. Render each terminal post menu in its own message under its terminal gate marker, separate from the batch summary. Keep runtime guard text, including any quoted escalation instruction, inside the obstacle body, never as a second standalone marker.

Render flat numbers through [menu-layout](../../brainstorming/reference/menu-layout.md); preserve its bare-numeric mapping. Move the recommended action to row 1 before numbering every menu, including child and batch menus; tag only that row `[recommended]`. Treat each template's row list as available actions, not fixed display order. Keep non-recommended stop last and the remaining actions in their listed order. Put `show evidence` in every hint line, never in a row. Include every omission reason from `decision-menu.md`. A menu rendered under `deliver` before an exit condition, other than the contract-exception template, is a red flag; so is a menu not rendered from these templates, two recommendations, a recommendation not on row 1, or no evidence hint.

Render terminal steps through `## post` and `cleanup.md`; keep each override separate from worktree, branch and base cleanup.

Use `viewer.is_author` (`viewer.login == pr.author.login`) and `author_is_bot` for defaults. Treat a bot-authored head as someone else's throughout. Keep `merge policy` (`squash | merge-commit | rebase`) solely as the `gh pr merge` flag selector, never approval or sync strategy. Treat `approve (round 1) / approve (round 2)` as spec approval history, not menu configuration.

## Recommendation

Choose the action recommendation from the findings, including obstacle and cap exits. When no available non-stop row can change the outcome, recommend `stop` before applying authorship defaults; an unchanged failed prerequisite remains blocking even after a cap extension. Recommend deliver for the human's own PR, assess for someone else's when an open blocker needs the author's decision; when delivery is omitted on an own PR, recommend assess. Treat a blocker as needing the author's decision only when its repair requires a missing requirement, an acceptance-criteria change, or a scope choice, rather than a code or description-only repair already drafted in the findings.

When every open blocker has a drafted repair, none needs the author's decision, and the head is pushable and `deliver` is offered, recommend `deliver` regardless of authorship. When a pending binding check or a failing check classified flaky is the only obstacle and a continuation can make progress, recommend `deliver`; keep the no-progress stop pin ahead of this choice. Choose among available rows from the findings for any other action state. Put one prose sentence immediately above `Pick one:` naming the recommendation and its reason from the finding or state. A recommendation confers no authority: wait for the numeric pick before any repair, push, body edit, or post.

In the final state, recommend `merge` whenever available through the ordinary path or an eligible admin override, regardless of authorship; otherwise recommend `approve` when available, else `stop`. Apply the same row-1 ordering, reason sentence, and numeric-pick boundary.

## initial

Offer `assess`, eligible `deliver`, eligible `deliver with nits`, then `stop`. Choose the recommendation through `## Recommendation`. Omit deliver with nits with zero nits, and both delivery rows with cap zero, missing helpers, or non-pushable/unreadable head; name each reason, including `Not offered: deliver (needs push to <head_url>:<head_ref>)`. For someone else's/bot PR change the sync consequence to "merge main into the branch". Map `deliver with nits` to stored `deliver-nits`.

```text
gauntlet: gate=gatekeep-pr/initial recommended=1
Verdict: not ready - 2 blockers, 1 nit

Pick one:
1. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]
2. assess - post the review to the PR; then approve or stop, no repairs.
3. deliver with nits - deliver, and fold the 1 nit into the repairs.
4. stop - remove the worktree, leave the PR as is.

Course holds until the final menu; `show evidence` prints the full record.
```

## final

Start the message with `gauntlet: gate=gatekeep-pr/final`.

For eligible BLOCKED readiness, render `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` with the resolved policy, and carry `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` in the `Evidence:` line below. Keep the ordinary `merge` row and the same recommendation defaults; render no separate bypass row.

Offer available `merge`, `approve`, `fix nits` when nits remain and the course excluded them, `reply` when drafted replies exist, then `stop`. Choose the recommendation through `## Recommendation`. Omit merge on a draft with `Not offered: merge (draft)` or below WRITE with `Not offered: merge (needs WRITE on <owner>/<repo>)`. Omit approve on drafts and own PRs. Authorize exactly one delivery iteration for fix nits, leaving course unchanged (`post-selection-loop.md` `### Next action`). Hint: `Type a number; show evidence prints the full record.` Print one compact `Evidence:` line above the `Delivers:` line naming the source (`CI (source: ci)` or the local run), the head SHA, each run and its checks with their conclusions, the binding-pending count, and `merge_state_status`; put the same record in the `show evidence` hint's parenthetical.

## assess terminal

Start the message with `gauntlet: gate=gatekeep-pr/assess-terminal`.

Offer available `deliver` (switch course), `approve` only on someone else's non-draft PR with zero blockers, `reply` for drafted thread replies, then `stop` `[recommended]`. Hint: `Type a number; show evidence prints the full record.`

## obstacle

Start the message with `gauntlet: gate=gatekeep-pr/obstacle`.

For undispositionable BLOCKED with no local repair, use this template even with course unset: recommend stop, with no wait row, no sync promise, and no approve row. Describe eligible deliver only as retrying after the failed prerequisite changes; promise no automatic sync. Reserve the course-unset initial assess/deliver/stop template for a pending-only report when its sole withhold is a not-yet-resolved binding CI check; source blockers still use initial under the state map.

Print the concrete obstacle and retained failed prerequisites. Keep the `Delivers:` line in the obstacle report. Offer eligible `deliver`, `approve workflow run` only for the held-run permission case, `assess` (switch course), then `stop`. Choose the recommendation through `## Recommendation`. Feed the `Evidence:` line from the verifier record's resolved source, never from the raw check or run rollup - render a `source: pending` record as `Evidence: pending (<binding check> binding; head <sha>)`, and when `course` is unset render the deliver row as `deliver - set course to deliver; <one clause naming what retries>, no round charged` instead of `resume the retained course`. Render ordinary obstacle continuation as `deliver - resume the retained course; <one clause naming what retries>, no round charged`. For every non-timeout deliver selection, add exactly `2 x maxFixRounds` to both caps and persist before work, preserving usage. Append `add <n> to each cap` (`+2 x maxFixRounds`, with cumulative usage/caps) to the row even below both caps. On timeout describe exactly one additional watch window instead, with neither cap extended. An unchanged prerequisite re-exits even after extension. Print exactly one `Evidence:` line before the verdict, naming the resolved evidence source and assessed head per `report.md` (for example `Evidence: CI (run 7001, test_unit and build_image green on 9c1e4f2)`). Include `check <name> flaky | real | ci-broken` in the hint for failing checks; flaky followed by a numeric deliver selection can resume. Hint: `Type a number; show evidence prints the full record (<source summary>)`. Replace `<source summary>` with the same source summary used in `Evidence:`, including the CI run, check outcomes, and assessed head when CI is the source.

## contract exception

Start the message with `gauntlet: gate=gatekeep-pr/contract-exception`.

Print the concrete proposed contract change before the rows. Offer `accept contract change`, `preserve contract` `[recommended]`, then `stop`. Render preserve's consequence as "reject the proposal, keep <named requirement>, and resume authorized implementation repair within it". Route through `post-selection-loop.md` `### Contract decision`; show evidence settles nothing. Hint: `Type a number; show evidence prints the full record.`

## post

Render this archetype once on entry to own merge, approved or closed PR. Retain the numbered step mapping in `post_steps` through inspection and execution. Build rows in this step order:

| Step | Availability and consequence |
|---|---|
| post the drafted replies | Unposted, source-reviewed drafted replies; post their saved bodies to their PR threads. |
| post coverage to ticket | Own merge with an issue and scope rows; post the saved AC coverage block to the resolved ticket. |
| post coverage to PR | Own merge; post the same block as a PR comment. |
| cleanup | At least one worktree, local branch or base-pull sub-step can run through `cleanup.md` steps 1-3. |
| each PR-named step | Merged PR with a runnable action resolved through `findings.md` `## PR-named steps`; show its source sentence beside its command. |
| each cleanup override | One row per runnable merge-base `## cleanup` item, in list order, through `cleanup.md` step 4. |

Only number a step with work to execute, showing its exact command or what it posts and where. List a fully skipped step under the rows with its reason, not a number. Keep cleanup as one row and name each skipped sub-step and its reason alongside the executable sub-steps. Show substituted commands, including the primary cwd and the base-pull prerequisite for a step that needs the merged change when cleanup is not picked.

With multiple runnable steps, make row 1 a combination naming its members' labels and row numbers; give every runnable step its own row below it. Include all runnable steps except the PR copy of coverage when the ticket copy is included. Apply `batch.md`'s shared-item scheduling in set mode. Omit another step only for a concrete assessment reason; always include runnable PR-named steps. Put the reason for each omission in the recommendation sentence above the prompt. With one runnable step, make that step row 1 without a combination; with none, offer only stop. Keep stop last otherwise, and tag only row 1 `[recommended]`.

Use `Pick one, or several separated by commas:` and `Type a number; show evidence prints the full record.` Parse and execute through `post-selection-loop.md` `### Next action`, then its `### Post steps`; a pick settles the PR rather than re-rendering the menu. Treat the merge queued variant separately: wait and stop take one number, not a combination.

> I recommend the reply, ticket checklist and cleanup because the ticket already holds the checklist's PR copy.
>
> Pick one, or several separated by commas:
> 1. post the reply, post coverage to ticket, cleanup - rows 2, 3 and 5. [recommended]
> 2. post the reply - answer robin's retry question in its PR thread.
> 3. post coverage to ticket - comment the acceptance checklist on acme/widgets#45.
> 4. post coverage to PR - comment the same checklist on the PR.
> 5. cleanup - remove .worktrees/csv-export (including untracked files), delete branch csv-export and pull main in the primary checkout.
> 6. stop - run nothing and list the unpicked steps with their commands.
>
> Type a number; show evidence prints the full record.

## own merge

Start the message with `gauntlet: gate=gatekeep-pr/own-merge`.

After this run's merge returns `MERGED`, render `## post` once with own-merge coverage availability. Run the selected set through `post-selection-loop.md` `### Post steps`.

## merge queued

Start the message with `gauntlet: gate=gatekeep-pr/merge-queued`.

After this run's merge returns a state other than `MERGED`, offer `wait` - re-run `gh pr view <N> --json state,mergeCommit` `[recommended]`, then `stop`. Render `The merge is queued, so coverage posts wait. (<state>)`. A MERGED read records pr.state and pr.merge_commit and renders own merge; OPEN or another state keeps this template. Run no CI watch. Hint: `Type a number; show evidence prints the full record.`

## approved

Start the message with `gauntlet: gate=gatekeep-pr/approved`.

When `approved_head` equals the assessed head, render `## post` once without coverage or PR-named rows. Keep reply freshness through `post-selection-loop.md` `### Post steps`.

## closed PR

Start the message with `gauntlet: gate=gatekeep-pr/closed-pr`.

When state is not OPEN at step 1 or mid-course, render `## post` once without own-merge coverage. Keep this distinct from this run's own merge; list merge-dependent steps on a closed-unmerged PR as `skipped - PR not merged`.

## batch summary

Start the message with `gauntlet: gate=gatekeep-pr/batch-summary`.

For a recovered `CONFLICTING` child, offer only safe `retry` and `stop`, with `show evidence` hint-only. Render `retry - re-dispatch this PR's assessment with the same record` `[recommended]` only after `batch.md`'s clean-recovery and no-rebase checks pass; otherwise omit retry with its recorded reason and recommend stop. Offer no update branch or merge base rows. Hint: `Type a number; show evidence prints the full record.`

Let the `batch.md` parent render its current summary rows and each child's template from this file. Keep terminal posts and queued-merge wait parent-owned, including after worktree removal; retain each post outcome for the parent's closing message. Preserve the parent's row consequences and admission/queue semantics. Hint: `Type a number; show evidence prints the full record.`
