# Gauntlet gate contract

A driver reads the first line of the last user-facing assistant message at settlement (`agent_settled`), not an intermediate report or private handoff. The [shared first-line grammar and reply mapping](../skills/gauntlet/menu-layout.md) own marker syntax, token charsets, recommendation rules, and numeric remapping. The `/gauntlet:` slash-command namespace is different from the `gauntlet:` message marker.

A proper reply can advance a `gate` or `question`; `done` and `stuck` are true endings with no advancing reply. Questions retain inventory IDs below but emit only the bare `gauntlet: question` line, not their IDs. Row bodies define input: there is no `picks=` field or per-gate token list in the marker.

## Gatekeep menus

Gatekeep has three menu archetypes: action (initial, obstacle and contract-exception), final (ready or assess-terminal), and post (own-merge, approved and closed-pr, with merge-queued as a wait/stop variant and reject as a variant entered from the action menu). State IDs identify variants, not fixed row positions. Row 1 is the sole judged recommendation. While reject is offered, an open approach blocker whose ground recommends rejection favors reject, with one sentence naming the first such conflict in report order. Needless machinery alone leaves the ordinary recommendation rules in force. Row 1 favors `preserve contract` when a proposed change would drop the intended outcome, even if the ticket asks for the change. Otherwise, row 1 follows what the reread ticket asks for. With no ticket or a silent ticket, row 1 favors a change only when the PR's goal requires it. When no available action can change the outcome, row 1 favors stop. Otherwise, your own PR defaults to deliver, author-decision blockers favor assess on someone else's PR, ready repairs or pending-only checks favor deliver, and readiness favors merge regardless of author. An unchanged assess result favors stop. The [recommendation owner](../skills/gatekeep-pr/reference/menus.md#recommendation) defines precedence and exceptions.

The [pick lifecycle](../skills/gatekeep-pr/reference/post-selection-loop.md#pick-lifecycle) persists `work_started` before work, including a refused or failed action. The reject row stays absent afterward; `back` from the reject menu instead persists `reject_withdrawn` and returns without posting or closing. Inspection and typed dispositions do not start work.

The report uses plain-language change/scope, standing/problems and recommendation parts, with evidence behind `show evidence`. A post menu renders once, accepts a set reply and ends after the picked steps settle; its closing message lists every unpicked, skipped or failed command or payload. Row 1 combines runnable steps except duplicate PR coverage when ticket coverage is included. Each step retains an individual row; nested skills retain their own gates. Set replies expand combinations and collapse duplicates before execution in step order. Shared overrides execute at most once in set mode.

PR-named steps come from merger actions in the PR body or head spec, but their executable commands come only from the merge-base overrides, `AGENTS.md` or its one-hop linked documents. Exactly one distinct documented command makes a step runnable; unresolved or ambiguous actions stay visible with their source sentences. See the [post execution owner](../skills/gatekeep-pr/reference/post-selection-loop.md#post-steps) and [PR-named steps](../skills/gatekeep-pr/reference/findings.md#pr-named-steps).

## Gates

Sites are real ATX heading prefixes, excluding headings inside fenced examples. Repeated IDs identify the same gate at distinct rendering sites, not additional gates.

| gate id | kind | rendering file | site | layout |
|---|---|---|---|---|
| brainstorm/understand-the-idea | question | skills/gauntlet/SKILL.md | ### 3. Understand the idea | X) options; templates=1 |
| brainstorm/understand-the-idea | question | skills/gauntlet/brainstorm/opening-message.md | # Opening message | X) options; templates=3 |
| brainstorm/present-the-design | question | skills/gauntlet/SKILL.md | ### 6. Present the design in two rounds | X) options |
| brainstorm/cut-question | question | skills/gauntlet/brainstorm/ticket-acceptance.md | # Ticket Handling | X) options |
| brainstorm/relatedness-before-provisioning | question | skills/gauntlet/brainstorm/pr-subject.md | ## Relatedness before provisioning | X) options |
| brainstorm/user-review-gate | gate | skills/gauntlet/brainstorm/spec-finalization.md | ## User Review Gate | 1 - rows |
| brainstorm/user-review-gate | gate | skills/gauntlet/brainstorm/spec-pr.md | ## Publish row 4 | 4 - create-only retry |
| brainstorm/human-batch | gate | skills/gauntlet/amendment-surface.md | ## 4. Human batch - one menu | item-letter |
| brainstorm/human-batch | gate | skills/gauntlet/amendment-surface.md | ## Worked example | item-letter |
| plan/step-6-baseline-failure | question | skills/gauntlet/plan/open-questions.md | ## Ask the human | X) options |
| plan/step-6-baseline-dirty | question | skills/gauntlet/plan/open-questions.md | ## Ask the human | X) options |
| plan/step-6-contract-questions | question | skills/gauntlet/plan/open-questions.md | ## Ask the human | X) options |
| implement/stop-note | question | skills/gauntlet/implement/waves/stop-note.md | ### Template | free |
| implement/human-stop | question | skills/gauntlet/implement/loop/human-stop.md | # Human stop | free |
| implement/discard-authorization | question | skills/gauntlet/implement/loop/human-stop.md | # Human stop | free |
| verify/whole-diff-review | question | skills/gauntlet/implement/waves/stop-note.md | ## Whole-diff review | free |
| verify/step-6 | gate | skills/gauntlet/conformance-check.md | ### Fix loop - SDD wave-loop mirror, per round | free |
| ship/step-4 | gate | skills/gauntlet/ship/ship.md | ### Step 4: Present Options | N. rows; templates=3 |
| ship/carried-open | gate | skills/gauntlet/ship/disposition-protocol.md | # Carried-open disposition protocol | item-letter |
| ship/carried-open | gate | skills/gauntlet/ship/ship.md | ### Step 3.5: Closure / Conformance Disposition Gate | item-letter |
| ship/pr-subject-row-1 | gate | skills/gauntlet/ship/pr-branch-push.md | # PR-subject row 1: Push to the PR branch | 1 - rows |
| ship/option-5 | question | skills/gauntlet/ship/ship.md | #### Option 5: Discard | free |
| gauntlet/step-3 | question | skills/gauntlet/worktrees.md | ## Step 3 | free |
| gauntlet/detached-head | question | skills/gauntlet/worktrees.md | ## Detached HEAD | free |
| gatekeep-pr/initial | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/final | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/assess-terminal | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/obstacle | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/contract-exception | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/own-merge | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/own-merge | gate | skills/gatekeep-pr/reference/batch.md | ## Summary and menu round | N. rows |
| gatekeep-pr/merge-queued | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/approved | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/closed-pr | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/reject | gate | skills/gatekeep-pr/reference/menus.md | ## States | N. rows |
| gatekeep-pr/batch-summary | gate | skills/gatekeep-pr/reference/menus.md | ## batch summary | N. rows |
| gatekeep-pr/sync-preconditions | gate | skills/gatekeep-pr/reference/sync.md | ## Preconditions | N. rows |
| gatekeep-pr/other-author-confirmation | question | skills/gatekeep-pr/reference/sync.md | ## Other-author confirmation | free |
| gatekeep-pr/provision-serially | question | skills/gatekeep-pr/reference/batch.md | ## Provision serially | free |
| chase-bug/verdict-menu | gate | skills/chase-bug/SKILL.md | ### 4. Verdict menu | N. rows |
| chase-bug/verdict-menu | gate | skills/chase-bug/reference/verdict-report.md | ## Golden examples - step-4 gates only | N. rows; templates=3 |
| chase-bug/response-to-origin | gate | skills/chase-bug/SKILL.md | ### 5. Response to origin | N. rows |
| housekeeping/card | gate | skills/housekeeping/reference/card.md | ## Card template | N. rows |
| check-delivery/confirmation-gate | gate | skills/check-delivery/SKILL.md | ## Confirmation gate and the batched write | N. rows |
| check-delivery/confirmation-gate | gate | skills/check-delivery/reference/batch.md | ## Turns | N. rows |
| check-delivery/set-recovery | gate | skills/check-delivery/reference/batch.md | ## Turns | N. rows |
| check-delivery/ac-conflict-reading | question | skills/check-delivery/reference/batch.md | ## Turns | free |
| shape-ticket/step-3 | question | skills/shape-ticket/SKILL.md | ### 3 - Interactive questioning | free |
| shape-ticket/step-8 | gate | skills/shape-ticket/reference/repo-audit.md | ## Complete the batch and present gates | N. rows |
| shape-ticket/hard-stop | question | skills/shape-ticket/SKILL.md | ## AC integrity gate | free |
| gauntlet-resume/discovery | gate | skills/gauntlet-resume/SKILL.md | ## Arguments | N. rows |
| gauntlet-resume/spec-without-plan | question | skills/gauntlet-resume/reference/reconstruction.md | ## Spec without plan | free |
| gauntlet-resume/spec-with-ledger | question | skills/gauntlet-resume/reference/restore-loop.md | ## Spec with ledger | free |
| gauntlet-resume/spec-with-plan | question | skills/gauntlet-resume/reference/restore-plan.md | ## Spec with plan | free |
| gauntlet-resume/dispatch | question | skills/gauntlet-resume/SKILL.md | ## Dispatch | free |
| gauntlet-handoff/step-1 | question | skills/gauntlet-handoff/SKILL.md | ## Sequence | free |
| gauntlet-performance/reply-exactly-this-in-this-order | gate | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | N. rows |
| gauntlet-performance/target-path | question | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | free |
| gauntlet-performance/overwrite | question | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | free |

## Terminals

The line precedes the existing report body. `gauntlet: stuck` below is the fixed prefix; append the concrete reason on that same line. Shape-ticket's concrete singleton is an example of its dynamic counters, not a restriction to written tickets.

| skill | ending | report site | line |
|---|---|---|---|
| ship | Options 1-2: normal or draft PR created | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: done pr-created |
| ship | Option 3: squash-merged and verified | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: done merged |
| ship | Option 4: Keeping branch <name>. Worktree preserved at <path>. | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: done kept |
| ship | Option 5: authorized discard completed | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: done discarded |
| ship | PR-subject push and body edit; close-member gate answered or no qualifying members; a reported Integration-only sync failure does not change the outcome | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: done pushed |
| ship | Executed option fails after the gate | skills/gauntlet/ship/ship.md § ## Completion | gauntlet: stuck |
| gatekeep-pr | post pick or stop on approved | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done approved |
| gatekeep-pr | post pick or stop on own-merge | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done merged |
| gatekeep-pr | post pick or stop on closed-pr | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done closed-pr |
| gatekeep-pr | Successful rejection note post or confirmed close | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done rejected |
| gatekeep-pr | stop on final | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done final |
| gatekeep-pr | stop on merge-queued | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done merge-queued |
| gatekeep-pr | stop on initial, assess-terminal, obstacle, contract-exception, or reject without successful note or close; failed cleanup assertion | skills/gatekeep-pr/reference/cleanup.md § ## Non-final stop | gauntlet: stuck |
| gatekeep-pr | Hard assertion failures in fix-wave Sync or loop Exit check | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: stuck |
| gatekeep-pr | Sync restore/assert mismatch | skills/gatekeep-pr/reference/sync.md § ## Failure path | gauntlet: stuck |
| gatekeep-pr | All PRs retired and selected follow-on steps finished; no stuck outcome | skills/gatekeep-pr/reference/batch.md § ## Between batches and retirement | gauntlet: done retired |
| gatekeep-pr | All PRs retired and selected follow-on steps finished; any stuck outcome | skills/gatekeep-pr/reference/batch.md § ## Between batches and retirement | gauntlet: stuck retired |
| shape-ticket | Ended batch or singleton with no failure contributor; dynamic counters | skills/shape-ticket/reference/repo-audit.md § ## Complete the batch and present gates | gauntlet: done written=1 |
| shape-ticket | Ended batch with unfetched, close-failed, or close-by-hand contributor | skills/shape-ticket/reference/repo-audit.md § ## Complete the batch and present gates | gauntlet: stuck |
| check-delivery | Batched write landed | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done delivered |
| check-delivery | Delivery already recorded | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done already-recorded |
| check-delivery | Write halves emitted for manual execution | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done manual |
| check-delivery | Findings-comment gate answered or not offered; partial write failure or declined success write | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: stuck |
| check-delivery | Quick-reference STOP: unreadable ref/repo mismatch, terminal ticket, zero ACs, open deliverable PR, ambiguous/off-default deliverables, unreachable/timed-out/unbound delivery target | skills/check-delivery/SKILL.md § ## Quick reference | gauntlet: stuck |
| check-delivery | Already-terminal ticket with delivery recorded; no write | skills/check-delivery/SKILL.md § ## Quick reference | gauntlet: done already-recorded |
| check-delivery | Set settled without failures; dynamic counters | skills/check-delivery/reference/batch.md § ## Turns | gauntlet: done delivered=1 |
| check-delivery | Set settled with failed tickets; same dynamic counters | skills/check-delivery/reference/batch.md § ## Turns | gauntlet: stuck |
| check-delivery | Set admission rejected | skills/check-delivery/reference/batch.md § ## Admit | gauntlet: stuck |
| check-delivery | Set shared preparation stopped | skills/check-delivery/reference/batch.md § ## Shared prep | gauntlet: stuck |
| chase-bug | Response sent | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done responded |
| chase-bug | Unaddressable origin: rendered summary | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done summary |
| chase-bug | Copy-paste draft is last act, including push failure | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done draft |
| housekeeping | Empty file selection | skills/housekeeping/SKILL.md § ## 5. Report | gauntlet: done empty |
| housekeeping | No surviving findings | skills/housekeeping/SKILL.md § ## 5. Report | gauntlet: done clean |
| housekeeping | Human stopped the card walk; nothing executed | skills/housekeeping/SKILL.md § ## 5. Report | gauntlet: done stopped |
| housekeeping | Fix finished with no open classes; dynamic counters | skills/housekeeping/SKILL.md § ## 5. Report | gauntlet: done prs=1 |
| housekeeping | Invalid input, failed precondition, unexpected Check mutation or Fix ending with open classes | skills/housekeeping/SKILL.md § ## 5. Report | gauntlet: stuck |
| gauntlet-resume | No handoff briefs; argument stop routes (including missing bare-name worktree routed to entry check 2) | skills/gauntlet-resume/SKILL.md § ## Arguments | gauntlet: stuck |
| gauntlet-resume | Entry-check failure | skills/gauntlet-resume/SKILL.md § ## Entry checks | gauntlet: stuck |
| gauntlet-resume | Unsupported or malformed ledger | skills/gauntlet-resume/reference/restore-loop.md § ## Ledger admission | gauntlet: stuck |
| gauntlet-resume | Ledger plan_check FAIL | skills/gauntlet-resume/reference/restore-loop.md § ## Spec with ledger | gauntlet: stuck |
| gauntlet-handoff | Step 6: brief written | skills/gauntlet-handoff/SKILL.md § ## Sequence | gauntlet: done brief-written |
| gauntlet-handoff | --out and --key exclusivity STOP | skills/gauntlet-handoff/SKILL.md § ## Sequence | gauntlet: stuck |

Housekeeping's [Report](../skills/housekeeping/SKILL.md#5-report) uses nonzero `key=count` class counters, comma-joined without spaces, in this fixed order: `prs,commits,amended,edited,tickets,not-filed,ignored,not-decided,open`. `amended` counts classes folded into the last unpushed commit, not commits pushed; an amend run names that commit before and after the fold and states that nothing was pushed. Fix completion uses `done` unless `open` is nonzero, including a rejected push; then it uses `stuck` with the same ordered counters. `not-filed`, `ignored` and `not-decided` are human decisions, not failures. Its card marker's `recommended=<n>` names the recommended pick, not the card number; intermediate picks continue the walk without a terminal marker. The `spec-superseded` card offers only Delete (`fix`) and Keep (`ignore`) in every run, including directory runs; Keep counts as `ignored`. Delete remains available without a hotfix-bounds check.

Shape-ticket emits one batch settlement line after the last ticket, also for a singleton. Emit nonzero `<key>=<count>` counters, comma-joined without spaces, in this fixed order: `written,closed,declined,dropped,no-op,stopped,unfetched,close-failed,close-by-hand`. Use `done` unless any `unfetched`, `close-failed`, or `close-by-hand` count is nonzero; then use `stuck` with those same ordered counters. `declined` and `dropped` are human decisions, not failures. `stopped` means an integrity stop left without recovery values when the run ended; `gauntlet: done stopped=1` is valid. An active hard-stop recovery ask is still `question`, never a batch ending.

Check-delivery set settlement uses nonzero counters in fixed order `delivered,manual,declined,already-recorded,skipped,failed`, comma-joined without spaces. Use `done` without failures and `stuck` with the same counters when `failed` is nonzero. Declined and skipped tickets are human decisions, not failures. While the roster continues, only the next ticket's gate marker appears; previous outcomes are plain text.

Gatekeep terminal stop reports retain the checkout path and local branch. Non-final stops retain the obstacle's `stuck - ` reason, or `stopped at <template id>` for initial, assess-terminal, and contract-exception. Hard stops retain the actual error. A verdict above a menu is not an ending. A successful PR-subject push followed by the close-member question is still the finishing gate, not `done pushed`.

Resume's argument failures cover a spec seed with an extra worktree, an unrecognized file, a missing path, a missing/invalid bare-name worktree, and other unmatched input, plus no discovery briefs. Entry checks also reject invalid token/override combinations and stale or foreign briefs. Successful resume has no `done`: it continues into the resumed skill's gate.

## Nonterminal retirement

Gatekeep's multi-PR parent starts a per-PR retirement message with `gauntlet: retired #<N> - <reason>` while any PR remains, as defined in [Between batches and retirement](../skills/gatekeep-pr/reference/batch.md#between-batches-and-retirement). This marker is not a gate or a terminal settlement and takes no advancing reply. After the last retirement and selected follow-on steps, the parent emits one `done retired` or `stuck retired` settlement with every retained PR row in roster order.

## Reading a reply

| Layout | Reply |
|---|---|
| N. rows | Send the displayed row number. Apply the shared grammar's numeric remap-and-echo rule before acting, not a guessed stable row index. Gatekeep's own-merge, approved, closed-pr and reject post menus accept a comma-separated set of displayed numbers, excluding back and stop from any set; row 1 expands its combination and duplicate steps run once in step order. Other menus take one number. Gatekeep recognizes `show evidence`, `reply <n>` for a drafted reply, `check <name> flaky`, `check <name> real`, and `check <name> ci-broken`, and `overrule <n>` (an approach blocker at any time; another finding-based blocker after an unrepaired attempt) before numeric parsing on their eligible states; another string is a change request. Finishing Step 4 also accepts `fix minors` or selected IDs such as `fix minors F3, F9`. |
| 1 - rows | Send the leading number, row label, or `approve` (which echoes and takes `recommended=<n>`). At the spec approval gate (`gauntlet: gate=brainstorm/user-review-gate recommended=<n>`), accept approval prose that names no row and carries no amendment, grant, or budget wording as the just-rendered recommended row's plain digit, with the same literal `Taking "approve" as option <n> - <label>` echo before acting. Rows 1 (`plan engine`), 2 (`loop engine`), 3 (`council explanation`), and 4 (`draft PR`) take `--amends-stop` on 1/2, `--fund-rounds=N` on 1, and `--allowance=N` on 2; N must be a positive safe integer. `--allowance=N` on 1, `--fund-rounds=N` on 2, any flag on 3/4, old suffix forms, worded stop/grant/budget intent, and malformed tokens ask one clarifying question quoting the token without writes; a second invalid reply leaves it waiting. The close-absorbed-members gate uses its displayed approval/revision rows. |
| X) options | Send the letter or free text, preserving the question's recommendation format. |
| item-letter | Send `<item>. <letter>` per the [carried-open response grammar](../skills/gauntlet/ship/disposition-protocol.md#response-grammar); use the displayed choices for each item. |
| free / question | Answer the words requested by the body: the input named in `Needs:` at a stalled stop (conformance still accepts an explicit round grant), typed `discard` for discard authorization, `retry <n> \| <hint>` or `rows +N` for loop row stops, or `yes`/`no` for the named confirmations. |

Housekeeping's [card reply owner](../skills/housekeeping/reference/card.md#replies) accepts an available row number to record the pick and show the next card; `<n> except 1 3` leaves those numbered items unchanged. An available Fix number (Delete on the spec card) followed by text records that text verbatim as the class's fix instruction. `list` shows the full numbered item list and keeps the card open. `go` ends the walk and executes only picks recorded so far; unanswered classes remain not decided. `stop` ends the run with nothing executed, keeps the decisions file and names the run folder. An unavailable pick, unknown item or unrecognized reply repeats the full card with one line naming the valid replies; the card stays open without recording a pick or advancing the walk. Nothing executes during the walk; execution starts after the last answer or `go`.

Check-delivery's set-recovery gate takes `1` (retry), `2` (skip), or `stop`. An AC-conflict retry opens a separate reading question taking free text or `skip`; an empty reply also skips. Only a nonempty reading redispatches the ticket. `stop` at either set gate settles the current ticket without a write and skips the unrendered roster.

At the [spec approval gate](../skills/gauntlet/brainstorm/spec-finalization.md#user-review-gate), `Scope cuts:` lists deferred and deviating criteria. Directly below it, `Not acceptance criteria:` lists each ticket row moved to Integration once with its kind, without a question. The line is absent when no ticket row moved.

Loop approval row 2 displays `--allowance=N` with `(default: <n>)` from `loopEngine.maxIterationsPerRow` (default 4), with settings warnings beside the menu. An explicit `--allowance=N` override emits `run allowance: <n>` immediately before loop entry; it is not an Amend-grant or spec field. A pre-seed crash loses that carrier. Existing ledgers use their durable allowance, not a later reply or settings change.

Every loop stop starts with `gauntlet: question`, lists each open/failed row as `row <n>: <attempts> of <effective allowance>` and prints `Preserve every row's attempts.` The allowance sets the progress check for numbered attempts, seed repairs and verification repairs. At a spent counter take one more round when the last round moved; stop on a stall. Without a previous round to compare, take one round. A row's stagnation or validation-miss pair supplies a hint and continues below allowance. A `row <n> retry` ledger decision resets that row's windows; an admitted `amended | <cut row <n>, or <N> item(s)> | <first item title>` decision starts new windows for every row. Neither resets attempts or spent escalation. Intermediate reports continue to the next ordered-table action in the same turn, never settle the loop.

At a row stop, `retry <n> | <hint>` buys one attempt for that row; `rows +N` raises the shared allowance for every row and leg without resetting counters or windows. Seed exhaustion prints `seed: <k> of <allowance>` with `Problem:` and `Needs:`, without listing replies; repeated repair reasons at or above allowance stall the seed. A home return that passes the DONE, clean exactly-one-commit boundary with the consumed `iterations:` but retains its matching `pending:` tuple is an ordinary or seed validation miss, not interrupted recovery. A home return whose committed ledger carries the dispatched tuple on neither the `returned:` line nor a retained `pending:` line takes interrupted recovery for wrong attribution, as do dirty or zero/multiple-commit boundaries, dispatch errors and non-DONE returns. Outside-ledger files with wrong tuple/iteration attribution are result-validation misses after unchanged-home and clean single-commit boundaries pass. Both paths consume one failed attempt with or without amend permission; commit messages supply no attribution. Interrupted recovery is unconditional, before the allowance check: signal only jobs with matching live start identity, command and group leadership, skip absent or mismatched jobs and delete the jobs file. Reset to the saved pre-dispatch HEAD and run `clean -fd` even with a surviving job. Restore the saved ledger with the consumed iteration and spent escalation, clear pending, restore the saved `returned:` value, and commit a failed row with attempts +1 plus `repair row <n> | <reason> | iteration <i>` (or `repair seed | <reason> | iteration <i>` with rows unchanged). Remaining dirt does not block repair; wrong HEAD or an unwritten repair repeats reset and repair, each failure pass counting against the same allowance until the repair lands on the saved HEAD or the existing exhaustion stop fires. Companion and resumed pending returns use the same recovery, with home repair decisions and no second iteration bump.

With no `pending:` tuple, a dirty tree at entry or resume instead renders `Stopped: dirty tree with no dispatch pending`, lists paths and offers typed `discard` or Stop only. A budget reply authorizes no discard. `discard` runs `reset --hard HEAD` and `clean -fd`, then resumes the suspended entry or restore sequence, including ledger admission before dispatch or verification. Any other reply preserves the tree. Resume retains its missing-history stops and no-tuple admission question; answering `interrupted` discards the listed commits and dirty paths through reset to the pre-dispatch HEAD and `clean -fd`.

Verification repairs count current home `repair verification | <repo> <child sha7, or interrupted - <reason>> | iteration <i>` decisions plus one for a `pending: verify` tuple on disk against the allowance. The parent writes the decision and clears pending together, so one dispatch is never counted twice. Interrupted repairs append exactly one home decision after reset, with saved row cells, the consumed iteration, no pending tuple and no repair code. The parent record changes the ledger rather than writing an empty commit and preserves `returned:`. Remaining dirt blocks neither the ledger record nor gate rerun; wrong HEAD or an unwritten record takes the same failure pass against the verification repair allowance. A repeated failure or interrupted last repair at allowance renders `Stopped: verification failed with every row closed` and `repairs: <k> of <allowance>`, with `Problem:` and `Needs:` and no menu. This stop and missing-capability stops accept only an amendment request. Both engines grant one conformance round at a positive cap when the last round closed a gap, fixed a failing check or cleared a Critical or Moderate finding. A live block takes `phase_tracker({ action: "grant_fix_rounds", rounds: 1, reason: "<what the last round closed>" })`; with `closureReview.enforce: false`, continue without a call. A stalled cap or tool error stops. No amendment grant or ledger allowance funds these rounds.

An admitted target failure with first result `unreachable: <what> - <where>` enters the amendment surface: when `<what>` starts with `unnamed action `, ask whether to name the action in the spec or cut the row. Missing input with a buildable stand-in needs no amendment: the row closes or fails on the stand-in check. For input without a buildable stand-in or another missing prerequisite, auto-apply the audited cut under amend permission, otherwise show the human batch. Approval authorizes every paid or external action named in an AC or Design, with its runner and inputs, for the whole flow. A count or wording deferring it to later approval does not withhold authorization. Run it whenever an attempt needs it without asking and reuse output for local rechecks; evidence commands name local replay or fixtures. An unnamed action or missing prerequisite still uses `unreachable:`. Execution and budget replies do not grant amendment permission. The [human stop procedure](../skills/gauntlet/implement/loop/human-stop.md) owns these routes.

These are the stops this recovery and authorization contract keeps or touches, not the driver's whole stop set. Missing capabilities or references, malformed grants, unresolved verification entrypoints, repeated-evidence amendment handling and failed refresh guards retain their own text. The driver renders only stops named in its skill and references; another failed dispatch consumes an attempt, not an invented menu or approval.

| Stop | Without amend permission (`2 --amends-stop`) | With amend permission (default `2`) |
|---|---|---|
| Row stalls at effective allowance; seed repairs repeat the same reason at allowance; escalation model unavailable for a row's escalated round | States `Problem:` and `Needs:` without a menu; accepts retry, `rows +N` or an amendment request | Same |
| Verification repairs stall at allowance; escalation model unavailable for a verification repair | States `Problem:` and `Needs:` without a menu; accepts an amendment request only | Same |
| Conformance fix-round cap | Takes one round on progress; stops on a stall | Same |
| Unnamed paid or outside-repository action | Asks whether to name the action in the spec or cut the row | Same |
| Other spec amendment, including a missing-prerequisite cut | Reviewer applies evidence-backed factual corrections; other amendments stop for review | Applies with no human turn |
| Row reopened by an applied amendment during verify | Applies the row progress test at allowance, with verify active, then reruns step 1 | Same |
| A redraw | Stops | Stops |
| Run cannot start: missing `checks:`, `allowance:` or `returned:`, a `cap:` line, unavailable settings tool, or seed `plan_check` findings | Stops | Stops |
| Dirty tree with no dispatch pending; on resume, admission question or missing-history stops (unrecoverable pre-dispatch ledger/tuple, or unreadable child attribution with no tuple) | Stops | Stops |
| Dispatch returns an async handle despite `async: false` | Stops | Stops |

A budget reply does not supply a missing escalation model. A reopened row already at allowance takes the same row progress test with or without amend permission. Once an amendment is approved, the driver dispatches without a second authorization, with verify active and no phase reset, then reruns step 1 after closure. See [Loop engine operations](configuration.md#loop-stop-boundaries).

Ordinary answers outside skill-owned turns, invented gates, tracker/ticket/PR payloads, and private child results are not marker surfaces. Evidence comments still begin with `Delivered: <sha>`; response drafts, close comments, and handoff brief contents keep their own formats. The marker belongs to the surrounding assistant message.

Automatic continuations carry no intermediate terminal line: verification's Closure / conformance into finishing, SDD Continuous Execution, loop After the loop, and chase-bug handoffs into brainstorming, hotfix, or shape-ticket settle at the next skill's gate. Combined batch/menu and closure/options messages use one parent marker. A terminal report and a later new-skill gate on separate turns each carry their own marker.

Only line one is a driver marker. During implementation, a marker below a preamble vetoes automatic restart but gives the driver no command. An unmarked first line is neither permission to answer nor a promise of another turn. A `pi-gauntlet-transition-recovery` custom message with `details.piGauntletRecoveryEdge: "implement-continue"` requests recovery; the request alone does not prove a run starts. Wait for another settlement only when a continuation is scheduled. If none follows, surface the existing stop to the operator.

The executable inventory check is `node scripts/gate-contract-lint.mjs`. It checks listed slices and reverse marker coverage, not inventory completeness, dynamic counter arithmetic, or actual model output; review the full spec inventory against source sites when changing this table.
