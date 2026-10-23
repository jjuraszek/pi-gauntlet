# gatekeep-pr multi-PR mode: one dispatching child per PR, menus in turn, picks executed in parallel

**Goal:** `/skill:gatekeep-pr 12 15 18 [--rebase [base]]` gates a set of PRs through today's single-PR pipeline, each PR in its own worktree inside its own fresh child context, then shows the human one summary and each PR's unchanged decision menu in turn, queues the picks, and executes them in parallel.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#79

## Problem

`/skill:gatekeep-pr` takes exactly one PR (`skills/gatekeep-pr/SKILL.md` argument block; `reference/sync.md` runs the `--rebase` sync once per invocation). Gating N PRs today means N sessions or an external loop that re-invokes the skill, with N rebase confirmations and no view of which PRs touch the same files. Ticket #79 asks for a set form that runs the existing pipeline per PR in parallel and keeps every decision per PR.

Premises checked during brainstorming:

- Corrected: "`--rebase` already works on all PRs" - no multi-PR form exists; applying the sync to every PR is this spec's work.
- Disproved: "fix, fix nits, and wait are the same decision on every PR" - rows derive per PR from `reference/decision-menu.md` `## Availability` (`wait`, `push`, `merge`, `review` vanish on a `rebased locally` head; `fix` needs an open blocker and remaining fix rounds; `merge`/`approve` need a mergeable verdict with WRITE). A shared menu was rejected; the menu stays per PR.
- Corrected: a child can dispatch `subagent` only when its persona's `tools:` lists it (pi-cohort `skills/pi-cohort/SKILL.md:17`, `src/runs/shared/pi-args.ts:108-131`); no persona in pi-gauntlet or pi-cohort does. The ticket's "one fresh helper per PR" needs a new persona, which this spec adds.
- Verified: nesting depth 2 (pi-cohort default) is enough - main session depth 0, per-PR child depth 1, the child's Verify/Review helpers depth 2 and blocked from dispatching further (`src/shared/types.ts:1032-1046`).
- Verified: a persona `tools:` allowlist hides extension tools (`doc/personas.md`: `plan_check` is "the extension tool a `tools:` allowlist would otherwise exclude"), so the child persona lists the extension tools it needs.
- Verified: a pi-cohort `tasks` entry carries a `skill` field that injects named skills into that child (`skills/pi-cohort/SKILL.md:64`); a persona with `inheritSkills: false` gets the skill text only through it.
- Verified: pi-cohort admits at most `maxTasks` entries per `tasks` call (default `8`) and runs `concurrency` of them at once (default `4`) (pi-cohort `doc/configuration.md:47`); an oversized array fails before any child starts.
- Verified: `plan_tracker` rebuilds its state from the current session branch (`extensions/plan-tracker.ts:84`, `ctx.sessionManager.getBranch()`), so a fresh child's tracker is its own and never the parent's.
- Verified: `eval/gatekeep-pr` is a `kind: text` target (`eval/gatekeep-pr/target.json`): samples replay skill text with no tools, so they are behavioral replay evidence and cannot exercise a live dispatch.
- Unverified: parallel child dispatch has not been exercised end to end; the runtime smoke in `## Tests` is the first live check.

Framing: kept - the scout's objection (a single menu cuts across per-PR row derivation) resolved to keeping per-PR menus, not to a different change.

## Acceptance criteria

Ticket #79, `Acceptance criteria`, rows verbatim:

- [ ] `/skill:gatekeep-pr 12 15 18 [--rebase [base]]` (two or more space-separated PR numbers or URLs) runs today's pipeline up to the report - worktree provisioning, the sync when `--rebase` is present, the verify helper, the review helper, the rendered report - for each PR in its own worktree as one fresh helper per PR, dispatched as one parallel batch; each PR's issue reference is resolved from the PR as it is today, and a positional issue reference is rejected with a one-line error in multi-PR mode.
  in-scope
- [ ] A single PR argument behaves byte-for-byte as today: every existing `eval/gatekeep-pr` sample passes unchanged.
  in-scope
- [ ] `--rebase [base]` applies today's sync to every PR in the set before its verification; a PR whose rebase conflicts returns a `conflicting` result to the parent instead of a report, and the other PRs' helpers run to completion.
  in-scope
- [ ] One helper failing (unavailable CI, unpushable head, helper timeout) returns a failure with its reason to the parent and does not abort the other PRs.
  in-scope
- [ ] After every helper returns, the parent renders one summary with one line per PR (verdict, or `conflicting` / `failed` with the reason; CI evidence; blocker count) followed by the files that two or more PRs in the set change, then presents each PR's decision menu in turn - a conflicting PR gets today's conflict menu; no push beyond the `--rebase` sync, PR edit, comment, review, or tracker write happens before that PR's menu pick. Check: an `eval/gatekeep-pr` sample with three synthetic PRs, two touching one file; the summary names the shared file and the transcript before the first menu contains no write command other than the sync push.
  in-scope
- [ ] A menu pick for one PR runs that PR's loop (fix wave, re-review, re-render) in that PR's worktree without touching the others; `stop` on one PR advances to the next PR's menu.
  in-scope
- [ ] `skills/gatekeep-pr/SKILL.md` documents the multi-PR argument form; `node eval/run.mjs gatekeep-pr` passes with the committed `report.md`; `npm test` passes.
  in-scope

Design clauses that fix the reading of ambiguous rows:

- Row 3 `conflicting`: the child runs today's sync unchanged, including its helper-owned conflict resolution and review (`reference/sync.md` `## Conflict stop`). A conflict the helper resolves continues to the report as today. A conflict the sync cannot resolve takes today's `## Failure path` recovery (restore `<pre_head>`, assert a clean tree, record `sync: failed - <reason>`) and then, in multi-PR mode only, the child returns `conflicting` with that sync record instead of continuing to step 3 and a report (`### Outcome adapter`). The single-PR path still continues to step 3 unsynced; `reference/sync.md` does not change.
- Row 4 failure boundary: a `failed` result is a child that errors, times out, exits without a result line, or hits a sync terminal stop that is not a conflict (`permissions.head_pushable` false or unreadable, no helper facility, missing base ref, baseline mismatch, lease refusal - `reference/sync.md` `## Preconditions`, `## Baseline`, `## Push`), or whose Verify step resolves no evidence source for the assessed head (the Evidence resolution table of `verification-brief.md` Section B requires a fallback run that cannot happen). The ticket names unpushable head and unavailable CI as failures, so in multi-PR mode they return `failed: <reason>` rather than a report with restricted rows; the single-PR path keeps its report with restricted rows (`### Outcome adapter`).
- Row 6 `stop` advances: every pick advances to the next PR's menu, because picks are queued and executed after the last menu (`### Pick round`). `stop` advances like any other pick; its consequences (the `rebased locally` reset, the teardown offer, temporary-file deletion) run before the PR retires (`### Pick round`).

## Design

### Entry and argument grammar

`SKILL.md` `## Arguments` gains one rule: two or more PR tokens (numbers or URLs, space-separated, before any `--rebase`) enter multi-PR mode. One PR token is the existing path, untouched. In multi-PR mode a positional issue reference is a one-line error before any dispatch; `--rebase [base]` is parsed as today and applies to every PR. Also one-line errors before any dispatch, confirmation, or provisioning: a duplicate PR number, a PR URL whose repo differs from the others or from `origin`, a set larger than pi-cohort's configured `maxTasks` (`gauntlet_setting` is not the source; read pi-cohort's `parallel.maxTasks`, default `8`, and print `multi-PR mode takes at most <max> PRs (pi-cohort parallel.maxTasks); got <n>` - the parent never chunks the promised single batch), and the Claude Code harness (a Claude Code subagent cannot dispatch subagents, so multi-PR mode is pi-only; the single-PR path keeps its Claude Code support).

Multi-PR mode lives in a new `skills/gatekeep-pr/reference/batch.md`; `SKILL.md` adds the argument rule and one row pointing at it and stays under the 120-line cap `scripts/gatekeep-comment-reconcile.test.mjs:199` asserts (80 lines today). Every existing reference file is reused unchanged by the child.

### Components

| Component | Location | Responsibility |
|---|---|---|
| Parent (orchestrator) | `reference/batch.md`, run in the user's session | parse and admit the set, run the shared primary-checkout setup and provision every worktree in roster order, pre-collect the other-author confirmation, mint the roster and each continuation record, dispatch children, render the summary and the menus, queue picks, run `cleanup` and `stop` consequences between batches, re-dispatch, retire PRs |
| Child persona `pr-gatekeeper` | `agents/pr-gatekeeper.md` (`### Persona`) | run one PR's single-PR steps 1-5 in a provisioned worktree (`assess`) or step 7 for one queued pick (`execute`), dispatch its Verify/Review/implementer helpers as fresh contexts, update the supplied continuation record and write the rendered report, return one result line, never render a menu or ask the human |
| Roster | one JSON file under `${TMPDIR:-/tmp}` (`mktemp gatekeep-roster.XXXXXX`), never in a worktree | per PR: number, worktree path, continuation-record path, report path, status (`pending`, `report`, `conflicting`, `failed`, `stopped`, `retired`), result reason, queued pick |
| Continuation record | existing per-PR file (`reference/post-selection-loop.md` `### Continuation record`, field schema in `verification-brief.md`) | the private parent-child handoff: unchanged grammar; the parent initializes it once and writes queued picks into it, the child owns every assessment and execution field (`### Private handoff`) |

### Data flow

1. Parent parses and admits the arguments, then runs one `gh pr view --json number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files` per PR.
2. Parent runs the shared primary-checkout setup once: one `git fetch origin` (plus `git fetch origin pull/<N>/head:pr-<N>` per fork PR) and the gitignore-first step of `reference/assessment.md` `## Provision the worktree` when the resolved home is inside the primary. It then provisions each PR's worktree in roster order, one at a time, with the step-2 provisioning table unchanged (reuse row, divergence stops, keyed `create:`, the `HEAD == headRefOid` check). A provisioning stop marks that PR `failed: provisioning - <reason>` in the roster with no child dispatched for it; the other PRs continue. No two fetches or `git worktree add` calls ever run against the primary checkout at once; this serialization, not the concurrency cap, coordinates the shared writes.
3. With `--rebase`, the parent compares each author to `gh api user --jq .login` and, after its fetch, drops from the candidate list every PR whose sync would be a `no-op` or `skipped` by `reference/sync.md` preconditions 4-5 (`git merge-base --is-ancestor origin/<base> <headRefOid>` exits 0, or `git rev-list --merges origin/<base>..<headRefOid>` is non-empty; both reads). When at least one other-author or unreadable-author PR remains, the parent prints the `## Other-author confirmation` explanation once, listing those PRs, and asks for a yes once. No other-author PR -> no question. This is the only human question before the summary, and the single-PR run asks the same question.
4. Parent mints the roster and initializes one continuation record per PR (`### Private handoff`), then dispatches one foreground `tasks` batch (`async: false`, `context: "fresh"`, one `pr-gatekeeper` task per provisioned PR, `cwd` that PR's worktree, `skill: gatekeep-pr`) with mode `assess`. Each task names the PR, the rebase flag and base, `rebase confirmation: yes | no | not asked` for that PR, the record path, the report path, the statement `worktree provisioned at <path> on <headRefOid>; fetch and gitignore done - skip the fetch, run no worktree add, verify HEAD`, and the output contract of `### Child results`. pi-cohort's `concurrency` bounds how many run at once.
5. Child `assess`: runs steps 1-5 exactly as `SKILL.md` writes them in the provisioned worktree, with its own `plan_tracker` stages, dispatching Verify and Review as fresh helpers from its own context. At `reference/sync.md` `## Other-author confirmation` it substitutes the supplied answer for the ask - `yes` proceeds, `no` records `sync: declined - other author's branch` (stage `skipped`) and runs step 3 unsynced, exactly as a typed reply would; `not asked` means the PR is same-author or never reaches that step. It writes the rendered report (`reference/report.md` form) to the report path, updates the record, and returns one result line (`### Child results`); the `### Outcome adapter` decides `conflicting` and `failed` before any report renders; a pre-report ask returns `STOPPED` with the ask (`### Pre-report asks`).
6. Parent reads every result line (a child that returns none of the four forms, errors, or times out is `failed: <first error line>`), builds the summary from the records (`### Summary`), then renders each PR's menu in roster order by printing that PR's report verbatim and applying `reference/decision-menu.md` unchanged to the record's state. A `conflicting` PR renders today's conflict rows (`reference/fix-wave.md` `## Conflicts`: `update branch`, `merge base`, `reply`, `stop`, plus `show evidence`); a `failed` PR renders `retry`, `show evidence`, `stop` (`### Pick round`); a `STOPPED` PR renders the ask it recorded with `stop` last.
7. Each pick is written into that PR's continuation record (the existing grant grammar: bare `fix`, named `fix 2`, `fix + nits`, `merge base`, `wait`, ...) and the parent moves to the next PR's menu. `show evidence` renders in place from the record and the helper output paths it names, then re-asks. `cleanup`, `stop`, and `retry` follow `### Pick round`.
8. After the last menu, the parent runs the queued parent-owned work (`cleanup`, `stop` consequences), then dispatches one `tasks` batch of `pr-gatekeeper` children, one per PR with a queued pick, each task carrying its mode: `execute` with the pick for an ordinary pick, `assess` for `retry`. An `execute` child runs `### Pre-menu refresh` first: a moved head or a row no longer offered re-enters the pipeline (step 3 or 5 per `SKILL.md` re-entry rules) and returns a fresh report without executing the pick; otherwise it runs step 7 for the pick through `reference/post-selection-loop.md` and `reference/fix-wave.md` and returns the re-rendered report. `### Outcome adapter` applies to `execute` results too.
9. Parent re-renders the summary and the menus of every non-retired PR; repeat from 7 until the roster is empty. The parent never dispatches a batch while one is in flight.

### Child results

The child's last line is exactly one of `REPORT <report path>`, `CONFLICTING <report path> - <sync record>`, `FAILED - <reason>`, `STOPPED - <ask> - <what the user must supply>`. The report path is the one the task supplied; the child never mints a second report path or continuation record (`### Persona` pins `completionGuard: false` so no acceptance block follows the line). Anything else, a non-zero result, or a timeout is `failed: <first error line>` in the parent.

### Outcome adapter

Batch-only mapping, applied by the child at the single-PR path's existing decision points; `reference/sync.md`, `verification-brief.md`, and `reference/post-selection-loop.md` do not change:

| Single-PR event | Single-PR course (unchanged) | Multi-PR result |
|---|---|---|
| sync `## Failure path` with reason `unresolved stop in <commit7>`, `implementer returned open`, `residue outside conflicted files`, or `reviewer: <top finding>` | restore `<pre_head>`, `sync: failed - <reason>`, continue to step 3 unsynced | restore `<pre_head>` as today, record `sync: failed - <reason>`, write no report, return `CONFLICTING` with the record; the parent renders today's conflict rows |
| sync `## Failure path` with reason `rebase failed: <first line>` or `push rejected: <first server line>` | same recovery, continue unsynced | `FAILED - sync: <reason>` after the same recovery |
| sync terminal stop (`## Preconditions` 1-3, `## Baseline` mismatch, `## Push` lease refusal) | stage `failed`, `stop` and `show evidence` only | `FAILED - sync: <reason>`; the parent's menu for it is `retry`, `show evidence`, `stop` - never the broader conflict rows |
| `permissions.head_pushable` false or unreadable without `--rebase` | report with `push` omitted (`head not pushable` overlay) | `FAILED - head not pushable: <head_url>:<head_ref>` before Verify runs |
| Verify resolves no evidence source: the Evidence resolution table requires a fallback local run and none can run (`requires credentials: true`, no verification command after the ladder, or the run is refused) | report with `not run` as missing evidence | `FAILED - no verification evidence: <reason>` |
| helper output empty, off-contract, non-zero, or async handle (`reference/assessment.md` `## Helpers`) | quote the failure, offer `stop` | `FAILED - helper <role>: <quoted failure>` |
| every other step 1-5 and step 7 outcome | report and menu | `REPORT` |

A `conflicting` or `failed` result still leaves the worktree on `<pre_head>` with a clean tree, because the single-PR recovery ran first; `retry` depends on it (`### Pick round`).

### Pre-report asks

Asks the single-PR path puts to the human before the report, and what a child returns for each. The child stops at the ask, writes nothing further, and returns `STOPPED - <ask> - <needed input>`; the parent renders the ask as that PR's menu turn with the candidates or observed state the child reported, records the answer, and re-dispatches `assess` with the answer as a task input; the child re-runs steps 1-5 from the start (the provisioning reuse row makes that idempotent) and substitutes the supplied answer at that ask only.

| Ask (owner) | Child returns | Task input on re-dispatch |
|---|---|---|
| unresolved `create:` `<token>` (`reference/assessment.md` `## Provision the worktree`) - parent-owned in multi-PR mode because the parent provisions | asked by the parent itself during step 2, once per token value | - |
| configuration rung 4, no verification command resolved (`## Configuration`) | `STOPPED - verification command - <subproject dirs seen>` | `verification command: <command>` |
| two or more spec candidates (`## Select the scope contract` rule 4) | `STOPPED - spec candidate - <paths>` | `spec: <path>` |
| `mergeable`/`mergeStateStatus` `UNKNOWN` after the single re-poll | not an ask: the report renders with merge withheld as today | - |

No other ask exists in steps 1-5 (the sync's only ask is pre-collected; every other stop is a terminal stop mapped by `### Outcome adapter`). Step 7 asks (contract exception, no-progress obstacle, budget) are menus the report already carries, so an `execute` child returns `REPORT` and the parent renders them from the record as any other menu.

### Private handoff

The parent initializes each record once, before dispatch: `consent.target` (lowercase base owner/repo, PR number, `baseRefName` from its gather), `pr` identity, `worktree`, grants null, rounds zero, `approved_head` null, `cleanup_done` false - the existing field set, nothing added. A child that finds a supplied record validates it as `### Continuation record` requires and never re-initializes it; it owns every field that single-PR step 1-7 writes: the digest (`pr.files`, `status_checks[]`, `actions_runs[]`, `permissions`, `scope`, `sync`), evidence and helper output paths, finding IDs and dispositions, drafted payloads, the comment ledger, `approved_head`, `pr.state`, `pr.merge_commit`, `repair.*`. The parent owns only initialization and the queued pick; the rebase confirmation and a pre-report answer ride in the task text, never in the record; fetched fields never overwrite grants, exactly as today. Between batches the parent reads records, never writes assessment fields.

### Summary

Rendered from the records, one line per PR in roster order, fixed form:

`#<N> <verdict line> | evidence: <ci | local | pending | unknown> | blockers: <count | unknown>`

where `<verdict line>` is the report's `Verdict:` text for a `REPORT` result, `conflicting - <sync record>` for `CONFLICTING`, `failed - <reason>` for `FAILED`, `stopped - <ask>` for `STOPPED`; `evidence` is the record's Evidence resolution `source` (`verification-brief.md` Section B), `unknown` when Verify did not run; `blockers` is the open `P#` count, `unknown` without a review. Then one block `Shared files:` with one line per path changed by two or more PRs, `<path> - #<N>, #<M>`, derived from each record's `pr.files`; a PR without a gathered `pr.files` is listed as `#<N> - files unknown` under the block. `none` when no path is shared. Landing order is the human's call; the parent never schedules merges.

### Pick round

- Picks queue; nothing executes until the last menu of the round. `show evidence` is the only in-place action.
- `retry` (batch-only verb, defined in `batch.md`, not added to `decision-menu.md`): row text `retry - re-dispatch this PR's assessment with the same record`, `[recommended]` on a `failed` or `conflicting`-after-recovery PR whose worktree is tracked-clean with no in-progress rebase (`git -C <worktree> status --porcelain` empty, no `.git/rebase-merge` or `rebase-apply`); otherwise the row is omitted and named `Not offered: retry (worktree dirty or mid-rebase: <state>)`, so the human fixes the tree by hand or picks `stop`. A `retry` queues an `assess` task in the next batch beside the `execute` tasks.
- `cleanup` (terminal overlays only, as today): queued, run by the parent itself between batches (`reference/cleanup.md`, then the overrides' `## cleanup` steps), because it tears down the worktree a child would need. The PR stays in the roster with `cleanup_done` true: its menu re-renders on the next round with `cleanup` gone and the remaining terminal rows (`post coverage to ticket`, `post coverage to PR`, `show evidence`, `stop`) available, as the single-PR `own merge` and `approved` overlays re-render after `cleanup`.
- `stop`: queued; between batches the parent runs today's consequences in that PR's worktree - on a `rebased locally` head `git reset --hard <pre_head>` with the `HEAD == <pre_head>` and clean-tree assertion; on an ordinary open-PR menu the teardown offer (never autonomous, naming unpushed fix commits that would be discarded); under a terminal overlay leave the checkout as found and print the leftover path and branch; delete that PR's continuation record, helper output files, and `log_path` files (`reference/post-selection-loop.md` `### Teardown`). Then the PR retires. The teardown offer is one of today's asks, not a new gate.
- An `execute` child whose pre-menu refresh finds a moved head returns a fresh report; the parent re-renders that PR's menu rather than reporting the pick as done.
- `wait` on several PRs runs as parallel `execute` children, each a bounded `gh pr checks --watch` on its own PR; the batch returns when every watch returns.

### Grants and retained authority

No new grant machinery. A queued pick enters the PR's continuation record exactly as a direct pick does today, and the child's `### Next action` consumes retained authority on every re-entry. A PR that turns `CONFLICTING` or behind-base after a sibling merges rebases from its retained `merge base` grant on its next `execute` without a new pick; a bare `fix` grant covers later source-verified blockers of that PR only. Grants never cross PRs.

### Progress tracking

Parent `plan_tracker`: `init` with one task per PR named `pr-<N> state: <record path>`; `update` to `in_progress` on dispatch, `complete` when the PR retires, `failed` on a `failed` result that the human does not `retry`. Each child keeps the single-PR tracking from `SKILL.md` `## Progress tracking` in its own session: `plan_tracker` is session-scoped (`extensions/plan-tracker.ts:84`), so the child's stages never collide with the parent's roster tasks. Without `plan_tracker`, a plain checklist, behavior unchanged.

### Persona

`agents/pr-gatekeeper.md`: description is the routing label "runs one PR of a gatekeep-pr multi-PR set to its report or executes one queued pick"; `tools:` is the single-PR orchestrator's needs (`read, grep, find, ls, bash, edit, write`) plus `subagent`, `gauntlet_setting`, `plan_tracker` - the narrow allowlist, nothing more. Pins and why (`doc/personas.md` `## Frontmatter knobs`): `defaultContext: fresh` (one context per PR), `inheritProjectContext: true` (the consumer's `AGENTS.md` carries the verification entrypoint the ladder discovers), `inheritSkills: false` (no dispatch loop through skill discovery; the task's `skill: gatekeep-pr` field injects the skill text explicitly), `systemPromptMode: replace` (the body is the whole prompt), `completionGuard: false` (the result line is the output contract; an acceptance block would break it). `thinking` and `model` stay unset. The body states: use the supplied record and report paths, never `mktemp` a second record; apply `### Outcome adapter` and `### Child results`; never render a menu or ask the human. It is the first pi-gauntlet persona with dispatch rights; `doc/personas.md` records the row and the reason (the multi-PR mode needs a context per PR, and only a persona with `subagent` can run the helper steps).

## Errors and edge cases

- Child failure is isolated: a `failed` PR shows `failed - <reason>` in the summary and offers `retry` (when its worktree is safe), `show evidence`, `stop`; other PRs are unaffected.
- A provisioning failure (divergence, dirt, a foreign branch at the default path, a non-zero `create:`) is a `failed` PR with no child dispatched; `retry` re-provisions after the human clears the obstacle.
- Every PR already merged or closed at step 1: summary plus terminal menus (`cleanup`, `show evidence`, `stop`), no helpers dispatched.
- Shared files: the summary lists every file changed by two or more PRs with their numbers (`### Summary`); menus are unchanged.
- A PR under a terminal overlay (`own merge`, `approved`, `merged or closed`) stays in the roster until its `stop` pick; `cleanup` does not retire it; retirement is never automatic.
- A keyed `## using-git-worktrees` `home:` resolves per PR with `<name>` -> `pr-<N>`, as the single-PR run does; the parent provisions them in roster order.
- A `cleanup` or `stop` consequence on a worktree a child is still using cannot happen: the parent runs them only between batches.
- A set larger than `maxTasks` is refused with the one-line size error before any fetch, confirmation, or provisioning.

## Tests

- `eval/gatekeep-pr/samples/<new>`: three synthetic PRs, two changing one file, one other-author PR with a `--rebase` conflict the helper cannot resolve. Must hold: the other-author confirmation is asked at most once and lists only that PR; the summary follows the `### Summary` form, names the shared file with both PR numbers, and shows `conflicting - sync: failed - unresolved stop in <commit7>` for the conflict PR; the conflict PR's menu is the conflict rows; menus render in roster order, each from that PR's report; the transcript before the first menu contains no write command other than the sync push; a pick on PR 1 is queued and PR 2's menu renders before any execution.
- `eval/gatekeep-pr/samples/<new>`: one child returns no result line (timeout), one returns `FAILED - head not pushable`, one returns `REPORT`; both failed PRs show `failed - <reason>` with `retry`, `show evidence`, `stop`; the third PR's menu is unchanged; the next batch carries one `assess` task for the `retry` beside the `execute` task.
- `eval/gatekeep-pr/samples/<new>`: `rebase confirmation: no` in an `assess` task on an other-author PR; the child records `sync: declined - other author's branch`, stage `skipped`, runs unsynced, and returns `REPORT`; a sibling with `yes` syncs; a sibling with a sync terminal stop (`head_pushable` false) returns `FAILED - sync: ...` and its menu is `retry`, `show evidence`, `stop`, not the conflict rows.
- `eval/gatekeep-pr/samples/<new>`: a round with `cleanup` on an `own merge` PR and `stop` on a `rebased locally` PR; the parent runs cleanup between batches and the PR re-renders with `cleanup` gone and the post rows available; the `stop` PR resets to `<pre_head>` and retires; a supplied record is never re-initialized by the child.
- Assembly: each new sample opens with `bundle+: skills/gatekeep-pr/reference/batch.md` and `bundle+: agents/pr-gatekeeper.md` (`eval/README.md` `bundle+`); the two files land in the plan's first commit so `node eval/run.mjs gatekeep-pr --base <that commit>` has a readable baseline for them (the runner refuses a `bundle+` file absent at the base). Existing samples keep their assemblies and outcomes (single-PR byte-for-byte, AC2); `intent.md` extended; `node eval/run.mjs gatekeep-pr` with committed `report.md`.
- `eval/gatekeep-pr-scope` assembles `SKILL.md` (`target.json`), so the argument rule and the new row replay its samples: run `node eval/run.mjs gatekeep-pr-scope` and commit its `report.md` with unchanged verdicts.
- Runtime smoke (recorded in the branch's verification evidence, not in a text eval): one parent batch over two synthetic PRs in a scratch repo, each child in its own worktree; one child forced to fail before Verify (an unpushable head, `### Outcome adapter`) and return `FAILED - head not pushable: ...` with no report and no helper dispatch, while its sibling dispatches Verify and Review, uses `plan_tracker`, writes to its supplied report path, and returns `REPORT`. Must hold: two worktrees, one report at the sibling's supplied path and none at the failed PR's, no second continuation record, the failed PR's menu is `retry`/`show evidence`/`stop`, the sibling's menu is its ordinary menu.
- `npm test`: persona lint for `agents/pr-gatekeeper.md`, instruction-size lint on `reference/batch.md`, `SKILL.md` under 120 lines (`scripts/gatekeep-comment-reconcile.test.mjs`), marketplace allowlist unchanged (multi-PR mode is pi-only, so the Claude Code allowlist does not widen).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - the `gatekeep-pr` paragraph gains the multi-PR invocation, the `maxTasks` set limit, and the once-per-set rebase confirmation (operations / tunable parameters); `doc/personas.md` - `pr-gatekeeper` row with its pins and the note that it is the first persona with `subagent` and extension tools in its allowlist (architecture; non-obvious rationale); `CHANGELOG.md` - `## Unreleased` entry for the multi-PR invocation and the dispatching persona, `(#79)`, landing with the implementation (major procedures)
- Derived / memory docs invalidated: `eval/gatekeep-pr/README.md` sample inventory

(Materiality bar: `reference/documentation-impact.md`. `skills/dispatching-parallel-agents/SKILL.md` is skill surface, not a doc-impact entry.)

## Out of scope

- A combined batch menu or batch verbs beyond `retry` (rejected: rows derive per PR).
- Landing order, dependency scheduling, or a `close` verdict across PRs (#77 dropped these).
- Reworking a PR against current rules (#78).
- Multi-PR mode on Claude Code.
- Any change to the single-PR pipeline, its references, or its sync semantics; the `### Outcome adapter` lives in `batch.md` and the persona body only.
- A generic resume-at-stop protocol; the pre-report asks are enumerated in `### Pre-report asks` and re-dispatch `assess` with the answer.

## Open questions

none - the stop-kind question is settled by `### Pre-report asks` and `### Outcome adapter`; `plan_tracker` scoping is verified session-scoped (`extensions/plan-tracker.ts:84`).
