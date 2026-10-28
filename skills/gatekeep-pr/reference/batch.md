# gatekeep-pr: multi-PR parent-child contract

Use this contract only for two or more PR tokens. Keep the single-PR path and its duties unchanged. The parent owns admission, primary-checkout provisioning, human menus, and teardown; each child owns one PR's assessment and execution.

## Admit before effects

Reject with a one-line error before any fetch, confirmation, provisioning, or dispatch: positional issue references, duplicate identities (normalize number and URL to the same repository/number), URLs from different repositories or not matching origin, an oversized set, and Claude Code. Multi-PR mode requires pi's nested dispatch. Resolve each issue from its PR, never from a positional issue argument.

Read the active pi-cohort configuration's `parallel.maxTasks`, default `8`; gauntlet_setting is not its source. Never chunk the set. For an oversized set print exactly:

`multi-PR mode takes at most <max> PRs (pi-cohort parallel.maxTasks); got <n>`

Gather each PR with `gh pr view --json number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files`. Resolve trusted worktree configuration from the base merge-base, never from PR-controlled files.

## Provision serially

Start the message with `gauntlet: question` when asking unresolved create tokens or the set-wide other-author confirmation. Apply [menu-layout](../../brainstorming/reference/menu-layout.md), preserving the one yes for the set. Keep private `REPORT`, `CONFLICTING`, `FAILED`, and `STOPPED` child results unchanged; mark only the parent user-facing turn.

Fetch origin once with `git fetch origin`; for each fork PR, run `git fetch origin pull/<N>/head:pr-<N>` only when no worktree holds a local `pr-<N>` branch, and otherwise leave the reuse row's `git fetch origin pull/<N>/head` + `git merge --ff-only FETCH_HEAD` to that PR's provisioning step. Apply assessment's gitignore-first rule before built-in creation when the resolved home is inside the primary; sibling homes need no edit. Provision in roster order, one at a time. No concurrent primary fetch or worktree add is allowed, regardless of cohort concurrency.

Reuse assessment's provisioning table unchanged: reuse an expected branch at any path, fast-forward only, stop on dirt, divergence, local-only commits, or foreign operations; never repurpose a foreign branch at the default path. Resolve keyed home/create/destroy with `<name>` = `pr-<N>`, shell-quote tokens, check the created path in `git worktree list --porcelain`, and verify `HEAD == headRefOid`. A non-zero create marks that PR failed; never fall back to worktree add. Ask unresolved create tokens in the parent once per token, never execute unresolved placeholders. Isolate `failed - provisioning - <reason>` with no child; continue siblings. A provisioning retry re-provisions only after the obstacle clears.

With rebase requested, read the viewer via `gh api user --jq .login`. After fetch exclude sync preconditions 4-5 from confirmation: heads already containing origin/base and heads containing merge commits. Compare `git merge-base --is-ancestor origin/<base> <headRefOid>` and `git rev-list --merges origin/<base>..<headRefOid>`. List only remaining other-author or unreadable-author PRs. Explain once that replay changes SHAs and committer identity, can outdate anchored comments, and can dismiss approvals; ask yes once for the set. No eligible PR means no question. Supply each task `rebase confirmation: yes | no | not asked`. Keep sync's own safety fetch and baseline checks; skip duplicate provisioning only.

## Private handoff

Create the OS-temp roster with `mktemp "${TMPDIR:-/tmp}/gatekeep-roster.XXXXXX"`, never in a worktree. Store per PR number, worktree, record path, report path, status (`pending`, `report`, `conflicting`, `failed`, `stopped`, `retired`), reason, and queued pick. Pre-mint record/report paths outside worktrees.

Initialize each existing-format continuation record once: `consent.target` (lowercase base owner/repo, PR number, gathered baseRefName), PR identity, worktree, `course` null, `repair.rounds_used` and `repair.syncs_used` zero, `approved_head` null, `cleanup_done` false. Use the continuation-record schema; initialize `repair.rounds_cap` and `repair.syncs_cap` to `2 x` the resolved `closureReview.maxFixRounds` under D4 (`fix-wave.md` `## Wave`). Only the first course pick may resolve its initial D4 allowance; re-dispatch never reinitializes usage or caps. The parent owns only initialization and direct queued picks; the child owns all assessment and execution fields, findings, digest, evidence, repair state, approved head, payloads, and comment ledger. Carry confirmations and answers in task text only; never overwrite course, counters, caps, deadline, ledger, or helper paths on refresh or re-dispatch. Validate supplied records using the continuation-record identity rules, never reset them.

## Foreground dispatch

Dispatch one foreground fresh `subagent` tasks batch, one `pr-gatekeeper` task per provisioned PR. Use `async: false`, `context: "fresh"`, each PR's worktree as cwd, and `skill: "gatekeep-pr"` for explicit injection. Use per-task `acceptance: { level: "none", reason: "the gatekeep child result line is the handoff contract" }`; the persona's completionGuard pin is separate. Let cohort concurrency bound running tasks, not alter membership.

Supply mode `report` or `execute`, PR identity, rebase flag/base, confirmation, optional answer, record/report paths, queued pick for execute, and this statement:

`worktree provisioned at <path> on <headRefOid>; fetch and gitignore done - skip the fetch, run no worktree add, verify HEAD`

Supply the skill and this batch contract explicitly; do not depend on child discovery. Derive the installed procedure root from the selected skill's absolute `filePath` metadata (the path returned by the runtime's skill resolution), taking the directory containing `SKILL.md`. Supply `procedure root: <absolute installed skill directory>` in every report and execute task. Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd; this includes sibling briefs and baseline files as well as files under `reference/`. Report mode runs steps 1-5 with sequential fresh Verify then Review in the supplied worktree, never separate helper worktrees. Preserve trusted configuration, digest/head binding, and PR-local tracking. Delegate tracked source edits and commits to implementer. Execute refreshes first, then runs step 7 using the course rules; under `deliver` run through a D3 readiness, obstacle, or cap exit and return `REPORT`. Refresh before any execute write: if HEAD moved or the row is unavailable, return a fresh report instead of doing the stale action. The course, `repair.rounds_cap`/`repair.syncs_cap`, usage, deadlines, and no-progress decisions stay PR-local; never borrow sibling consent. Parallel waits are independent bounded watches.

Write only the supplied report, never a second record/report. End with exactly one closing result line:

| Result | Closing line |
|---|---|
| Report | `REPORT <report path>` |
| Conflict after recovery, no rendered report | `CONFLICTING <report path> - <sync record>` |
| Failure | `FAILED - <reason>` |
| Pre-report ask | `STOPPED - <ask> - <what the user must supply>` |

Await all children before rendering or running consequences; never overlap batches. Classify non-zero, timeout, absent or off-contract result as `failed - <first error line>`, using the first error, not an invented success. Isolate failures. All terminal PRs get summary and terminal menus with no helper dispatch.

## Recovery-first outcome adapter

Apply only in multi-PR mode at existing decision points. Leave single-PR owners and reference contracts unchanged. Never retry an unsafe checkout. For sync failures first restore/assert `<pre_head>` and a clean tree using the existing abort/reset recovery; a failed assertion is a hard failure, not permission to continue.

| Event | Child result after required recovery |
|---|---|
| `unresolved stop in <commit7>`, `implementer returned open`, `residue outside conflicted files`, `reviewer: <top finding>` | Record `sync: failed - <reason>`; no rendered report; `CONFLICTING <report path> - <sync record>` |
| `rebase failed: <first line>` or `push rejected: <first server line>` | `FAILED - sync: <reason>` |
| Sync terminal preconditions, baseline mismatch, lease refusal | `FAILED - sync: <reason>`; never conflict rows |
| Without rebase, head pushability false or unreadable | `FAILED - head not pushable: <head_url>:<head_ref>` before Verify |
| Required fallback cannot run: credentials, unresolved verification command after answer handling, or refused run | `FAILED - no verification evidence: <reason>`; never fabricate evidence |
| Helper output empty, off-contract, non-zero, or async | `FAILED - helper <role>: <quoted failure>` |
| All other steps 1-5 or 7 outcomes | `REPORT <report path>` |

Use only these pre-report asks; stop at the ask without further writes:

| Ask | Closing line | Re-dispatched report task answer |
|---|---|---|
| Verification configuration rung 4 | `STOPPED - verification command - <subproject dirs seen>` | `verification command: <command>` |
| Multiple spec candidates | `STOPPED - spec candidate - <paths>` | `spec: <path>` |

Re-assess from steps 1-5 with the same record; substitute the answer at that ask only. Use `yes` confirmation as typed authority; `no` records `sync: declined - other author's branch`, stage skipped, then assesses unsynced. `not asked` covers same-author/no-op/skipped cases. Never ask the human from a child. UNKNOWN merge state after the single re-poll produces a report with merge withheld, not an ask. Step-7 contract, no-progress, and budget decisions return reports for parent menus.

## Summary and menu round

The parent alone renders menus, gathers answers, and runs cleanup/stop consequences. Render the summary once, after the children's closing lines and before the first menu, without a standalone report block before it. Never rewrite, correct, or reconcile a child's report: preserve spelling, counts, verdict wording, missing lines, and off-contract lines, including under show evidence; add no corrections block or inserted report lines. Render summary rows in roster order:

`#<N> <verdict line> | evidence: <ci | local | pending | unknown> | blockers: <count | unknown>`

Use the child's supplied Verdict text unchanged, `conflicting - <sync record>`, `failed - <reason>`, or `stopped - <ask>`. Express a pending binding check only in that PR's queued menu: describe watching the check in its deliver row and print `Not offered: merge (<check> pending)`; leave the supplied verdict unchanged. Evidence is the record's resolved source; use unknown before Verify. Count open P# findings; use unknown without review. Follow with `Shared files:` and every changed path shared by two or more PRs, `<path> - #<N>, #<M>`. Include `#<N> - files unknown` for missing gathered files; print `none` when no path overlaps. Never schedule merges or choose landing order.

Print each supplied child report file verbatim in roster order, each under its own `#<N>` heading and directly above that PR's queued menu from `menus.md`; add no synthetic `Verdict:` restatement at the menu turn. Render each child's template from `menus.md`: reports with their template rows, conflicts through `menus.md` `## batch summary`'s recovered CONFLICTING template, failures with retry/evidence/stop, STOPPED with the recorded ask and stop last. For retry use exactly `retry - re-dispatch this PR's assessment with the same record`, recommended only after clean recovery and no rebase. Resolve the actual gitdir with git (a worktree .git can be a file); require empty `git -C <worktree> status --porcelain` and neither rebase-merge nor rebase-apply there. Otherwise omit the row and print `Not offered: retry (worktree dirty or mid-rebase: <state>)`. Substitute `<observed state>` with the concrete observation - the porcelain line(s) or the rebase directory name - one line per snapshot, never the placeholder text.

Queue every parent-owned terminal pick (post coverage to PR or ticket, merge, cleanup, wait, stop) until every roster entry's pick for the round is collected. Print `Queued until all picks are collected (<roster summary>)` before the execution block for each queued pick, including a single-entry roster. Summarize each roster entry's collected pick or pending status inside `<roster summary>`.

Show evidence only in-place from record/helper paths, then re-ask. Queue all other picks and answers until the final menu. Record direct picks as the child's `course` or terminal verb; do not turn answers into grants. For terminal overlays, the parent handles `post coverage to ticket`, `post coverage to PR`, and `show evidence` from the primary checkout, even after cleanup removes the PR worktree; assign the parent the `merge queued` overlay's `wait` pick after all picks are collected: re-run `post-selection-loop.md` `### Merge course`'s post-merge read (`gh pr view <N> --json state,mergeCommit`), on `MERGED` persist `pr.state` and `pr.merge_commit` and render coverage/menu under `own merge`, otherwise re-render `merge queued` (`wait`/`show evidence`/`stop`), with no helper, child, or CI watch. Follow `decision-menu.md`'s terminal rows and `post-selection-loop.md` `### Merge course` and `### Output done-check`: execute the direct selected post only, with no compare-and-swap or helper dispatch; preserve successful-post suppression, failed-post rows, and terminal re-rendering. Queue terminal posts with all other external writes until every PR's pick is collected; keep evidence in-place from the retained record/helper paths. Exclude terminal picks from child dispatch; never use a removed worktree as cwd. Next batch mixes retry/answered-ask `report` with ordinary nonterminal `execute` tasks, always same record.

## Between batches and retirement

Run parent cleanup/stop only after all children finish, never on a live child's tree. For cleanup apply cleanup guards and ordered overrides. Keep the PR and post rows in the roster, set cleanup_done, and re-render with cleanup gone. Cleanup does not retire.

For non-final stop run `cleanup.md` `## Non-final stop` after all children finish. Under terminal overlays leave checkout as found and print leftover path/branch. Delete only that PR's record, helper outputs, and log_path files under existing teardown rules, then retire it. Await all next-batch results and re-render every nonretired PR; repeat until all retire.

Initialize parent tracker tasks `pr-<N> state: <record path>`; mark in_progress on dispatch, complete on retirement, failed on unretried failure. Child trackers are session-local stages, not parent roster tasks. Use a plain checklist if plan_tracker is unavailable.
