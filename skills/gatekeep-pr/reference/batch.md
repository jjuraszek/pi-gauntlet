# gatekeep-pr: multi-PR parent-child contract

Use this contract only for two or more PR tokens. Keep the single-PR path and its duties unchanged. The parent owns admission, primary-checkout provisioning, human menus, and teardown; each child owns one PR's assessment and execution.

## Admit before effects

Reject with a one-line error before any fetch, confirmation, provisioning, or dispatch: positional issue references, duplicate identities (normalize number and URL to the same repository/number), URLs from different repositories or not matching origin, an oversized set, and Claude Code. For Claude Code print exactly: `multi-PR mode requires pi's nested dispatch`. Resolve each issue from its PR, never from a positional issue argument.

Read the active pi-cohort configuration's `parallel.maxTasks`, default `8`; gauntlet_setting is not its source. Never chunk the set. For an oversized set print exactly:

`multi-PR mode takes at most <max> PRs (pi-cohort parallel.maxTasks); got <n>`

For `source: discovered`, send a rejection separately from discovery's earlier list: begin with `gauntlet: stuck <reason>`, then the cap or harness rejection text and exactly one `discovered, smallest first: <numbers comma-separated>` line, in supplied sorted order; for example after cap 4 got 6: `discovered, smallest first: 101, 97, 112, 88, 130, 104`. After successful admission of a discovered set, print that plain-number line once, before minting the run folder. For a typed set print no `discovered, smallest first:` line. Preserve supplied token order through provisioning, summary rows, and queued menus; never trim.

After admission, mint one parent `RUN_DIR` with `post-selection-loop.md` `### Continuation record` from the session checkout, before creating the roster or records. Stop on failure with the error before tracker initialization. Use each admitted token (URL or bare number) unchanged as `pr_token` for its gather:

```bash
gh pr view "$pr_token" --json number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files,url,title,body,additions,deletions,closingIssuesReferences,reviewRequests --jq '(.linearRefs = [(.title + " " + (.body // "")) | scan("https://linear\\.app/([A-Za-z0-9-]+)/issue/([A-Za-z][A-Za-z0-9]+-[0-9]+)(?:[^A-Za-z0-9_-]|$)") | {key: .[0], id: (.[1] | ascii_upcase)}]) | .body |= (. // "")[0:300]'
```

For a typed set read `gh api user --jq .login` and the Section A `gh api user/teams` command once each, recording `unreadable` on failure. Before provisioning, print `PRs to gate:` and one entry per successful gather in typed order, regardless of PR state. Use [List entries and Ticket display](../verification-brief.md#list-entries) unchanged. Send the list as its own message without a marker and continue without waiting. Leave failed gathers to their existing handling. For `source: discovered`, discovery already printed the list; print no second one. Resolve trusted worktree configuration from the base merge-base, never from PR-controlled files.

## Provision serially

Start the message with `gauntlet: question` when asking unresolved create tokens or the set-wide other-author confirmation. Apply [menu-layout](../../brainstorming/reference/menu-layout.md), preserving the one yes for the set. Keep private `REPORT`, `CONFLICTING`, `FAILED`, and `STOPPED` child results unchanged; mark only the parent user-facing turn.

Fetch origin once with `git fetch origin`; for each fork PR, run `git fetch origin pull/<N>/head:pr-<N>` only when no worktree holds a local `pr-<N>` branch, and otherwise leave the reuse row's `git fetch origin pull/<N>/head` + `git merge --ff-only FETCH_HEAD` to that PR's provisioning step. Apply assessment's gitignore-first rule before built-in creation when the resolved home is inside the primary; sibling homes need no edit. Provision in roster order, one at a time. No concurrent primary fetch or worktree add is allowed, regardless of cohort concurrency.

Reuse assessment's provisioning table unchanged: reuse an expected branch at any path, fast-forward only, stop on dirt, divergence, local-only commits, or foreign operations; never repurpose a foreign branch at the default path. Resolve keyed home/create/destroy with `<name>` = `pr-<N>`, shell-quote tokens, check the created path in `git worktree list --porcelain`, and verify `HEAD == headRefOid`. A non-zero create marks that PR failed; never fall back to worktree add. Ask unresolved create tokens in the parent once per token, never execute unresolved placeholders. Isolate `failed - provisioning - <reason>` with no child; continue siblings. A provisioning retry re-provisions only after the obstacle clears.

With rebase requested, reuse the viewer login read for the list (including `unreadable`). After fetch exclude sync preconditions 4-5 from confirmation: heads already containing origin/base and heads containing merge commits. Compare `git merge-base --is-ancestor origin/<base> <headRefOid>` and `git rev-list --merges origin/<base>..<headRefOid>`. List only remaining other-author or unreadable-author PRs. Explain once that replay changes SHAs and committer identity, can outdate anchored comments, and can dismiss approvals; ask yes once for the set. No eligible PR means no question. Supply each task `rebase confirmation: yes | no | not asked`. Keep sync's own safety fetch and baseline checks; skip duplicate provisioning only.

## Private handoff

Write the roster at `<RUN_DIR>/roster`. Store per PR number, worktree, record path, report path, status (`pending`, `report`, `conflicting`, `failed`, `stopped`, `retired`), reason, and queued pick. Before creating each record, run `mkdir "<RUN_DIR>/pr-<N>"`; stop on failure. Use `<RUN_DIR>/pr-<N>/state` for its record and `<RUN_DIR>/pr-<N>/report` for its report. Each child takes its run folder from its supplied record's directory and mints no `gate.` folder.

Initialize each existing-format continuation record once: `consent.target` (lowercase base owner/repo, PR number, gathered baseRefName), PR identity, worktree, `course` null, `repair.rounds_used` and `repair.syncs_used` zero, `approved_head` null. Use the continuation-record schema; initialize `repair.rounds_cap` and `repair.syncs_cap` to `2 x` the resolved `closureReview.maxFixRounds` under D4 (`fix-wave.md` `## Wave`). Only the first course pick may resolve its initial D4 allowance; re-dispatch never reinitializes usage or caps. The parent owns only initialization and direct queued picks; the child owns all assessment and execution fields, findings, digest, evidence, repair state, approved head, payloads, and comment ledger. Carry confirmations and answers in task text only; never overwrite course, counters, caps, deadline, ledger, or helper paths on refresh or re-dispatch. Carry `repair.wave.spec` and `repair.wave.ledger` once created, with their row history and counters, through every private handoff; wave settlement retains the pair until terminal teardown. Validate supplied records using the continuation-record identity and finding-artifact rules: a missing locator or missing, unreadable or malformed artifact exits `stuck - run record unreadable`, never resets them.

## Foreground dispatch

Dispatch one foreground fresh `subagent` tasks batch, one `pr-gatekeeper` task per provisioned PR. Use `async: false`, `context: "fresh"`, each PR's worktree as cwd, and `skill: "gatekeep-pr"` for explicit injection. Use per-task `acceptance: { level: "none", reason: "the gatekeep child result line is the handoff contract" }`; the persona's completionGuard pin is separate. Let cohort concurrency bound running tasks, not alter membership.

Supply mode `report` or `execute`, the gathered `url` as the child's PR token, rebase flag/base, confirmation, optional answer, record/report paths, queued pick for execute, and this statement:

`worktree provisioned at <path> on <headRefOid>; fetch and gitignore done - skip the fetch, run no worktree add, verify HEAD`

Supply the skill and this batch contract explicitly; do not depend on child discovery. Derive the installed procedure root from the selected skill's absolute `filePath` metadata (the path returned by the runtime's skill resolution), taking the directory containing `SKILL.md`. Supply `procedure root: <absolute installed skill directory>` in every report and execute task. Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd; this includes sibling briefs and baseline files as well as files under `reference/`. Report mode runs steps 1-5 with sequential fresh Verify then Review in the supplied worktree, never separate helper worktrees. Preserve trusted configuration, digest/head binding, and PR-local tracking. Delegate tracked source edits and commits to the fix wave's worker: `loop-implementer` for file findings, `implementer` for sync helpers. Execute refreshes first, then runs step 7 using the course rules; under `deliver` run through a D3 readiness, obstacle, or cap exit and return `REPORT`. Refresh before any execute write: if HEAD moved or the row is unavailable, return a fresh report instead of doing the stale action. The course, `repair.rounds_cap`/`repair.syncs_cap`, usage, deadlines, and no-progress decisions stay PR-local; never borrow sibling consent. Parallel waits are independent bounded watches.

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

The parent alone renders menus, gathers answers, and runs post/stop consequences. Render the summary once, after the children's closing lines and before the first menu, without a standalone report block before it. Preserve each supplied child report unchanged, including under show evidence. For each PR in roster order, print `#<N>` and copy the child's standing sentence unchanged on one line; add no verdict, evidence or blocker fields. For a child without a report, state its recorded conflict, failure or ask as a sentence. Describe a pending required check in that PR's deliver row; leave the supplied standing sentence unchanged. Follow with `Shared files:` and every changed path shared by two or more PRs, `<path> - #<N>, #<M>`. Include `#<N> - files unknown` for missing gathered files; print `none` when no path overlaps. Never schedule merges or choose landing order.

Print each supplied child report file verbatim in roster order, each under its own `#<N>` heading and directly above that PR's queued menu from `menus.md`; add no synthetic `Verdict:` restatement at the menu turn. Render only the first PR's report and menu in the summary turn; collect each PR's pick before rendering the next PR's report and menu in a new turn. Never put two PRs' menus in one message or ask for all picks in one combined reply. Render each child's template from `menus.md`: reports with their template rows, conflicts through `menus.md` `## batch summary`'s recovered CONFLICTING template, failures with retry/evidence/stop, STOPPED with the recorded ask and stop. Apply `menus.md`'s row ordering to every child menu. For retry use exactly `retry - re-dispatch this PR's assessment with the same record`, recommended only after clean recovery and no rebase. Resolve the actual gitdir with git (a worktree .git can be a file); require empty `git -C <worktree> status --porcelain` and neither rebase-merge nor rebase-apply there. Otherwise omit retry and explain that the worktree is dirty or mid-rebase, naming the observed porcelain line or rebase directory.

Render one post menu per merged PR, each in its own message, using `menus.md` `## post`. Keep the batch summary in a separate message before these menus. Each post-menu message starts with `gauntlet: gate=gatekeep-pr/own-merge recommended=1`, never the batch-summary marker. Before substitution, assign a `## cleanup` item whose unresolved text holds none of `<issue>`, `<pr>`, `<merge-sha>` to the shared set: include it in the last merged PR's row 1 only, in roster order for this round. Offer its individual row on earlier merged PRs while it has not run. Keep PR-specific items with their PR. Record shared-item execution in the parent roster across rounds: a shared item runs at most once in the set. Omit it from later menus and skip it in queued picks only after its command runs with a recorded result, never because an earlier pick is queued.

Queue every parent-owned terminal pick (a post row or set of rows, reject, merge, wait, stop) until every roster entry's pick for the round is collected. Print `Queued until all picks are collected (<roster summary>)` before the execution block for each queued pick, including a single-entry roster. Summarize each roster entry's collected pick or pending status inside `<roster summary>`.

Show evidence in-place from retained record/helper paths and leave the same menu waiting. Queue a directly typed `overrule <n>` as this PR's answer for the round, like a check disposition; the child records it against the retained rendered blocker mapping and returns the re-rendered report/menu next round without resuming a course. Queue all other picks and answers until the round's final pick. Record direct picks as the child's `course` or terminal selection; do not turn answers into grants. Execute queued terminal picks in roster order from the primary checkout through `post-selection-loop.md` `### Post steps`, preserving its step order, deduplication, guards, failed-step continuation and nested-skill pauses. Keep remaining steps and other PRs' queued picks waiting until a picked skill returns. The parent owns every post step, even after cleanup removes a PR worktree; exclude terminal picks from child dispatch and never use a removed worktree as cwd. Run no helper for terminal posts. Skip compare-and-swap only on merged or closed PRs; delegate approved/open reply freshness to `### Post steps`.

A reject pick is parent-owned: queue it until the round's last pick, then render that PR's reject menu in a separate parent message from its retained record and note. Use `menus.md`'s reject marker, and run picked steps through `reject.md` `## Reject` from the primary checkout after all children finish; never skip its freshness guards on an open PR. For back with head, description and base unchanged, apply `reject.md` `## Back` and return the PR to the next round without child dispatch: re-render its retained report without note and its menu without reject. With a moved head, dispatch step-3 re-entry in the next round with the same record; let `work_started` decide whether to judge approach. Retire a successfully rejected PR with its `rejected` settlement row.

For `merge queued`, the parent handles `wait` after all picks: re-read `gh pr view <N> --json state,mergeCommit` per `post-selection-loop.md` `### Merge course`. On `MERGED`, persist `pr.state` and `pr.merge_commit` and render its one post menu under `own merge`; otherwise re-render `merge queued` with wait/stop and the evidence hint, without helper, child or CI watch. Next batch mixes retry/answered-ask `report` with ordinary nonterminal `execute` tasks, always the same record.

## Between batches and retirement

Run parent post/stop consequences only after all children finish, never on a live child's tree. After all selected post steps finish for a PR, retire it with no re-render, including when a step failed. On stop retire it without running unpicked post steps. For non-final stop run `cleanup.md` `## Non-final stop`; under terminal overlays leave the checkout as found and print its leftover path/branch.

At retirement, run `post-selection-loop.md` `### Teardown` with the surviving primary as `PRIMARY`, that PR's `<RUN_DIR>/pr-<N>` as `RUN_DIR` and its unrun or failed body files as `KEEP`. Store `teardown: removed` on success or `teardown: kept <path> - <error>` on failure in its roster entry; retire it either way. Retain its settlement row and not-run sentences with the block's printed kept paths in the parent roster for the final message. Start every PR retirement message, including the last, with `gauntlet: retired #<N> - <reason>`, without a terminal marker or settlement row; keep private child result lines unchanged. Await all next-batch results and render only nonretired PRs until all retire.

After the last PR retires and every selected step finishes, retain the roster's closing rows in memory. Run the same Teardown block on the parent `RUN_DIR` with no `KEEP` only when every entry says `teardown: removed`; otherwise delete nothing and name each kept child path and its error. The block independently refuses a parent with a remaining `pr-<N>` directory. Report a parent-block failure with its path and error. Render one parent closing message. Start the message with `gauntlet: stuck retired` when any retained outcome is `stuck - <reason>`, otherwise `gauntlet: done retired`. Print every retained PR settlement row and its not-run sentences in roster order, including PRs retired in earlier rounds.

Initialize parent tracker tasks `pr-<N> state: <record path>`; mark in_progress on dispatch, complete on retirement, failed on unretried failure. Child trackers are session-local stages, not parent roster tasks. Use a plain checklist if plan_tracker is unavailable.
