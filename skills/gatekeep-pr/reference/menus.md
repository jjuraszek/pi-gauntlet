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

Render every menu in full from its template: the verdict line, every available row, and the hint line. Never narrate or summarize a menu; do not substitute "the initial template applied; the human picked 2" for its rendering. Quote a numeric pick only after the rendered menu.

Render flat numbers through [menu-layout](../../brainstorming/reference/menu-layout.md); preserve its bare-numeric mapping. Put exactly one `[recommended]` on an available row and `stop` last. Put `show evidence` in every hint line, never in a row. Include every omission reason from `decision-menu.md`. A menu rendered under `deliver` before an exit condition, other than the contract-exception template, is a red flag; so is a menu not rendered from these templates, two recommendations, stop not last, or no evidence hint.

Render terminal cleanup consequences through `cleanup.md`; use `skipped - needs a landed change` for merge-SHA-dependent overrides in the row text and result block.

Use `viewer.is_author` (`viewer.login == pr.author.login`) and `author_is_bot` for defaults. Treat a bot-authored head as someone else's throughout. Keep `merge policy` (`squash | merge-commit | rebase`) solely as the `gh pr merge` flag selector, never approval or sync strategy. Treat `approve (round 1) / approve (round 2)` as spec approval history, not menu configuration.

## initial

Offer `assess`, eligible `deliver`, eligible `deliver with nits`, then `stop`. Recommend deliver for the human's own PR, assess for someone else's; when delivery is omitted on an own PR, recommend assess. Omit deliver with nits with zero nits, and both delivery rows with cap zero, missing helpers, or non-pushable/unreadable head; name each reason, including `Not offered: deliver (needs push to <head_url>:<head_ref>)`. For someone else's/bot PR change the sync consequence to "merge main into the branch". Map `deliver with nits` to stored `deliver-nits`.

```text
Verdict: not ready - 2 blockers, 1 nit

Pick one:
1. assess - post the review to the PR; then approve or stop, no repairs.
2. deliver - repair blockers, rebase on main, watch CI, repeat until merge is offered. [recommended]
3. deliver with nits - deliver, and fold the 1 nit into the repairs.
4. stop - remove the worktree, leave the PR as is.

Course holds until the final menu; `show evidence` prints the full record.
```

## final

Offer available `merge`, `approve`, `fix nits` when nits remain and the course excluded them, `reply` when drafted replies exist, then `stop`. Recommend merge for own PR; recommend approve for someone else's when available, else merge; with neither available recommend stop. Omit merge on a draft with `Not offered: merge (draft)` or below WRITE with `Not offered: merge (needs WRITE on <owner>/<repo>)`. Omit approve on drafts and own PRs. Authorize exactly one delivery iteration for fix nits, leaving course unchanged (`post-selection-loop.md` `### Next action`). Hint: `Type a number; show evidence prints the full record.` Print one compact `Evidence:` line above the `Delivers:` line naming the source (`CI (source: ci)` or the local run), the head SHA, each run and its checks with their conclusions, the binding-pending count, and `merge_state_status`; put the same record in the `show evidence` hint's parenthetical.

## assess terminal

Offer available `deliver` (switch course), `approve` only on someone else's non-draft PR with zero blockers, `reply` for drafted thread replies, then `stop` `[recommended]`. Hint: `Type a number; show evidence prints the full record.`

## obstacle

For undispositionable BLOCKED with no local repair, use this template even with course unset: keep stop last and `[recommended]`, with no wait row, no sync promise, and no approve row. Describe eligible deliver only as retrying after the failed prerequisite changes; promise no automatic sync. Reserve the course-unset initial assess/deliver/stop template for a pending-only report when its sole withhold is a not-yet-resolved binding CI check; source blockers still use initial under the state map.

Print the concrete obstacle and retained failed prerequisites. Keep the `Delivers:` line in the obstacle report. Offer eligible `deliver`, `approve workflow run` only for the held-run permission case, `assess` (switch course), then `stop` `[recommended]`. Feed the `Evidence:` line from the verifier record's resolved source, never from the raw check or run rollup - render a `source: pending` record as `Evidence: pending (<binding check> binding; head <sha>)`, and when `course` is unset render the deliver row as `deliver - set course to deliver; <one clause naming what retries>, no round charged` instead of `resume the retained course`. Render ordinary obstacle continuation as `deliver - resume the retained course; <one clause naming what retries>, no round charged`. For every non-timeout deliver selection, add exactly `2 x maxFixRounds` to both caps and persist before work, preserving usage. Append `add <n> to each cap` (`+2 x maxFixRounds`, with cumulative usage/caps) to the row even below both caps. On timeout describe exactly one additional watch window instead, with neither cap extended. An unchanged prerequisite re-exits even after extension. Print exactly one `Evidence:` line before the verdict, naming the resolved evidence source and assessed head per `report.md` (for example `Evidence: CI (run 7001, test_unit and build_image green on 9c1e4f2)`). Include `check <name> flaky | real | ci-broken` in the hint for failing checks; flaky followed by a numeric deliver selection can resume. Hint: `Type a number; show evidence prints the full record (<source summary>)`. Replace `<source summary>` with the same source summary used in `Evidence:`, including the CI run, check outcomes, and assessed head when CI is the source.

## contract exception

Print the concrete proposed contract change before the rows. Offer `accept contract change`, `preserve contract` `[recommended]`, then `stop`. Render preserve's consequence as "reject the proposal, keep <named requirement>, and resume authorized implementation repair within it". Route through `post-selection-loop.md` `### Contract decision`; show evidence settles nothing. Hint: `Type a number; show evidence prints the full record.`

## own merge

After this run's merge returns `MERGED`, offer `cleanup` `[recommended]` until attempted, `post coverage to ticket` when issue and scope rows exist, `post coverage to PR`, then `stop`. Suppress each successful post for the rest of the run; a failed post keeps its row and prints the error. A post re-renders this template, never tears down or ends the run, and runs no compare-and-swap. After cleanup removes its row recommend the first available post, else stop. Hint: `Type a number; show evidence prints the full record.`

## merge queued

After this run's merge returns a state other than `MERGED`, offer `wait` - re-run `gh pr view <N> --json state,mergeCommit` `[recommended]`, then `stop`. Render `The merge is queued, so coverage posts wait. (<state>)`. A MERGED read records pr.state and pr.merge_commit and renders own merge; OPEN or another state keeps this template. Run no CI watch. Hint: `Type a number; show evidence prints the full record.`

## approved

When `approved_head` equals the assessed head, offer `cleanup` `[recommended]` until attempted, then `stop`; recommend stop after cleanup. Hint: `Type a number; show evidence prints the full record.`

## closed PR

When state is not OPEN at step 1 or mid-course, offer `cleanup` `[recommended]` until attempted, then `stop`; recommend stop after cleanup. Keep this distinct from this run's own merge. Hint: `Type a number; show evidence prints the full record.`

## batch summary

For a recovered `CONFLICTING` child, offer only safe `retry` and `stop`, with `show evidence` hint-only. Render `retry - re-dispatch this PR's assessment with the same record` `[recommended]` only after `batch.md`'s clean-recovery and no-rebase checks pass; otherwise omit retry with its recorded reason and recommend stop. Keep stop last; offer no update branch or merge base rows. Hint: `Type a number; show evidence prints the full record.`

Let the `batch.md` parent render its current summary rows and each child's template from this file. Keep terminal posts and queued-merge wait parent-owned, including after worktree removal; suppress successful posts and retain failed posts. Preserve the parent's row consequences and admission/queue semantics. Put stop last and exactly one recommendation. Hint: `Type a number; show evidence prints the full record.`
