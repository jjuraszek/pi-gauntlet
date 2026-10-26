# gatekeep-pr: step 6 - menu

Read from SKILL.md step 6 with `menus.md`. Execute through `post-selection-loop.md` `### Next action`; recommendations confer no authority.

## Verbs

Read and apply [menu-layout](../../brainstorming/reference/menu-layout.md) before presenting rows and before numeric lookup. Render `<n>. <verb> - <consequence>` using the selected `menus.md` template. Keep `show evidence` hint-only and queued wait solely in the merge queued template.

- `assess` - post the current open Blockers with locators as one review through `review`; use `gh pr review --request-changes` for someone else's/bot PR and `--comment` on the human's own PR; with zero blockers post nothing, then render assess terminal. Perform no repair or sync. Keep C# thread replies behind reply.
- `deliver` - run the persistent delivery course through readiness, obstacle, or cap; at an obstacle continue under the cumulative accounting rules in `fix-wave.md` `## Wave`.
- `deliver with nits` - store deliver-nits and include every current and subsequently minted nit in delivery.
- `fix nits` - authorize exactly one delivery iteration without changing course; initialize missing accounting from `fix-wave.md` `## Wave` before work.
- `accept contract change` - invoke the proposal's owning amendment through `### Contract decision`; update the baseline only after completion.
- `preserve contract` - keep the baseline and independent blockers; resume scope-preserving course work without the rejected payload on that re-run.
- `approve` - approve someone else's non-draft PR with zero blockers; persist approved_head only after success.
- `approve workflow run` - execute `gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve`, then refresh and watch under the course.
- `merge` - execute `gh pr merge --match-head-commit <assessed-sha>` with the resolved policy flag and all merge preconditions; never infer approval from a setting.
- `reply` - post drafted replyable C# replies; exact `reply <n>` selects one.
- `post coverage to ticket` - post the rendered AC coverage block through the resolved tracker verb; renders only under the `own merge` template with issue and rows.
- `post coverage to PR` - post the same block with `gh pr comment <N> --body-file`; renders only under the `own merge` template.
- `cleanup` - run `cleanup.md` behind a terminal pick; name each resolved cleanup override command in the consequence, or say "tear down the gate's checkout and local branch (untracked files there are deleted)" with no override.
- `stop` - run `### Teardown`; delegate non-final stop to `cleanup.md` `## Non-final stop`, keeping terminal behavior distinct.

## Availability

Derive availability from the digest's permissions; `unreadable` fails closed. Omit unavailable rows and name concrete reasons in `Not offered:`; never render an unavailable row with a suffix.

| Row | Available when |
|---|---|
| `assess` | initial or obstacle course selection |
| `deliver`, `deliver with nits` | helpers exist, maxFixRounds is positive, head_pushable is true; deliver with nits additionally needs nits; use the template's continuation rules at an obstacle |
| `fix nits` | final template, nits remain outside the course, helpers and head_pushable true, accounting permits one iteration |
| `accept contract change`, `preserve contract` | pending recorded contract exception |
| `merge` | non-draft, viewer_permission `WRITE`, `MAINTAIN`, or `ADMIN`, all `### Merge preconditions` hold |
| `approve` | viewer.is_author false, zero blockers, non-draft |
| `approve workflow run` | held run on assessed head and viewer_permission `WRITE`, `MAINTAIN`, or `ADMIN` |
| `reply` | drafted reply exists and source review complete |
| `cleanup` | terminal template and cleanup_done false |
| `post coverage to ticket`, `post coverage to PR` | own merge template, not previously successful; ticket also needs issue and rows |
| `stop` | every template |

## Withhold reason resolver

Resolve every actual unmet `### Merge preconditions` reason through `post-selection-loop.md` `### Exit check`. Keep repairable gaps in the course, not a false readiness caused by missing WRITE permission. Render one concrete reason and locator rather than spinning.

| Observation | Render |
|---|---|
| BLOCKED with no local repair | Use findings.md `## Dispositions` for the actor-framed PR-comments line and obstacle verdict; render obstacle even with course unset, plus `Not offered: merge (blocked by GitHub)`; never attribute a named rule |
| UNKNOWN/unreadable after one re-poll | `stuck - merge state unknown`; `Not offered: merge (merge state unknown)` |
| binding pending check | name the check under PR comments, `Not offered: merge (<check name> pending)`; watch only at delivery step 4 |
| draft | `Not offered: merge (draft)` |
| below WRITE | `Not offered: merge (needs WRITE on <owner>/<repo>)` |
| other failed prerequisite | name its actual missing evidence/input or unsafe-state obstacle from Exit check |
