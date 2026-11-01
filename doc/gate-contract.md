# Gauntlet gate contract

A driver reads the first line of the last user-facing assistant message at settlement (`agent_settled`), not an intermediate report or private handoff. The [shared first-line grammar and reply mapping](../skills/brainstorming/reference/menu-layout.md) own marker syntax, token charsets, recommendation rules, and numeric remapping. The `/gauntlet:` slash-command namespace is different from the `gauntlet:` message marker.

A proper reply can advance a `gate` or `question`; `done` and `stuck` are true endings with no advancing reply. Questions retain inventory IDs below but emit only the bare `gauntlet: question` line, not their IDs. Row bodies define input: there is no `picks=` field or per-gate token list in the marker.

## Gates

Sites are real ATX heading prefixes, excluding headings inside fenced examples. Repeated IDs identify the same gate at distinct rendering sites, not additional gates.

| gate id | kind | rendering file | site | layout |
|---|---|---|---|---|
| brainstorming/understand-the-idea | question | skills/brainstorming/SKILL.md | ### 3. Understand the idea | X) options; templates=3 |
| brainstorming/present-the-design | question | skills/brainstorming/SKILL.md | ### 6. Present the design in two rounds | X) options |
| brainstorming/cut-question | question | skills/brainstorming/reference/ticket-acceptance.md | # Ticket Handling | X) options |
| brainstorming/relatedness-before-provisioning | question | skills/brainstorming/reference/pr-subject.md | ## Relatedness before provisioning | X) options |
| brainstorming/user-review-gate | gate | skills/brainstorming/reference/spec-finalization.md | ## User Review Gate | 1 - rows |
| brainstorming/human-batch | gate | skills/brainstorming/reference/amendment-surface.md | ## 4. Human batch - one menu | item-letter |
| brainstorming/human-batch | gate | skills/brainstorming/reference/amendment-surface.md | ## Worked example | item-letter |
| writing-plans/step-6-baseline-failure | question | skills/writing-plans/SKILL.md | ## Author the plan | X) options |
| writing-plans/step-6-baseline-dirty | question | skills/writing-plans/SKILL.md | ## Author the plan | X) options |
| writing-plans/step-6-contract-questions | question | skills/writing-plans/SKILL.md | ## Author the plan | X) options |
| subagent-driven-development/stop-note | question | skills/subagent-driven-development/stop-note.md | ## Template | free |
| loop-implementation/human-stop | question | skills/loop-implementation/SKILL.md | ## Human stop | free |
| loop-implementation/discard-authorization | question | skills/loop-implementation/SKILL.md | ## Human stop | free |
| verification-before-completion/step-6 | gate | skills/verification-before-completion/reference/conformance-check.md | ### Fix loop - SDD wave-loop mirror, per round | free |
| finishing-a-development-branch/step-4 | gate | skills/finishing-a-development-branch/SKILL.md | ### Step 4: Present Options | N. rows; templates=3 |
| finishing-a-development-branch/carried-open | gate | skills/finishing-a-development-branch/reference/disposition-protocol.md | # Carried-open disposition protocol | item-letter |
| finishing-a-development-branch/carried-open | gate | skills/finishing-a-development-branch/SKILL.md | ### Step 3.5: Closure / Conformance Disposition Gate | item-letter |
| finishing-a-development-branch/pr-subject-row-1 | gate | skills/finishing-a-development-branch/SKILL.md | #### PR-subject row 1: Push to the PR branch | 1 - rows |
| finishing-a-development-branch/option-5 | question | skills/finishing-a-development-branch/SKILL.md | #### Option 5: Discard | free |
| using-git-worktrees/step-3 | question | skills/using-git-worktrees/SKILL.md | ## Step 3 | free |
| using-git-worktrees/detached-head | question | skills/using-git-worktrees/SKILL.md | ## Detached HEAD | free |
| gatekeep-pr/initial | gate | skills/gatekeep-pr/reference/menus.md | ## initial | N. rows |
| gatekeep-pr/final | gate | skills/gatekeep-pr/reference/menus.md | ## final | N. rows |
| gatekeep-pr/assess-terminal | gate | skills/gatekeep-pr/reference/menus.md | ## assess terminal | N. rows |
| gatekeep-pr/obstacle | gate | skills/gatekeep-pr/reference/menus.md | ## obstacle | N. rows |
| gatekeep-pr/contract-exception | gate | skills/gatekeep-pr/reference/menus.md | ## contract exception | N. rows |
| gatekeep-pr/own-merge | gate | skills/gatekeep-pr/reference/menus.md | ## own merge | N. rows |
| gatekeep-pr/merge-queued | gate | skills/gatekeep-pr/reference/menus.md | ## merge queued | N. rows |
| gatekeep-pr/approved | gate | skills/gatekeep-pr/reference/menus.md | ## approved | N. rows |
| gatekeep-pr/closed-pr | gate | skills/gatekeep-pr/reference/menus.md | ## closed PR | N. rows |
| gatekeep-pr/batch-summary | gate | skills/gatekeep-pr/reference/menus.md | ## batch summary | N. rows |
| gatekeep-pr/sync-preconditions | gate | skills/gatekeep-pr/reference/sync.md | ## Preconditions | N. rows |
| gatekeep-pr/other-author-confirmation | question | skills/gatekeep-pr/reference/sync.md | ## Other-author confirmation | free |
| gatekeep-pr/provision-serially | question | skills/gatekeep-pr/reference/batch.md | ## Provision serially | free |
| chase-bug/verdict-menu | gate | skills/chase-bug/SKILL.md | ### 4. Verdict menu | N. rows |
| chase-bug/response-to-origin | gate | skills/chase-bug/SKILL.md | ### 5. Response to origin | N. rows |
| check-delivery/confirmation-gate | gate | skills/check-delivery/SKILL.md | ## Confirmation gate and the batched write | N. rows |
| shape-ticket/step-3 | question | skills/shape-ticket/SKILL.md | ### 3 - Interactive questioning | free |
| shape-ticket/step-8 | gate | skills/shape-ticket/reference/repo-audit.md | ## Complete the batch and present gates | N. rows |
| shape-ticket/hard-stop | question | skills/shape-ticket/SKILL.md | ## AC integrity gate | free |
| gauntlet-resume/discovery | gate | skills/gauntlet-resume/SKILL.md | ## Arguments | N. rows |
| gauntlet-resume/spec-without-plan | question | skills/gauntlet-resume/reference/reconstruction.md | ## Spec without plan | free |
| gauntlet-resume/spec-with-ledger | question | skills/gauntlet-resume/reference/reconstruction.md | ## Spec with ledger | free |
| gauntlet-resume/spec-with-plan | question | skills/gauntlet-resume/reference/reconstruction.md | ## Spec with plan | free |
| gauntlet-resume/dispatch | question | skills/gauntlet-resume/SKILL.md | ## Dispatch | free |
| gauntlet-handoff/step-1 | question | skills/gauntlet-handoff/SKILL.md | ## Sequence | free |
| gauntlet-performance/reply-exactly-this-in-this-order | gate | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | N. rows |
| gauntlet-performance/target-path | question | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | free |
| gauntlet-performance/overwrite | question | skills/gauntlet-performance/SKILL.md | ## Reply - exactly this, in this order | free |

## Terminals

The line precedes the existing report body. `gauntlet: stuck` below is the fixed prefix; append the concrete reason on that same line. Shape-ticket's concrete singleton is an example of its dynamic counters, not a restriction to written tickets.

| skill | ending | report site | line |
|---|---|---|---|
| finishing-a-development-branch | Options 1-2: normal or draft PR created | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: done pr-created |
| finishing-a-development-branch | Option 3: squash-merged and verified | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: done merged |
| finishing-a-development-branch | Option 4: Keeping branch <name>. Worktree preserved at <path>. | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: done kept |
| finishing-a-development-branch | Option 5: authorized discard completed | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: done discarded |
| finishing-a-development-branch | PR-subject push and body edit; close-member gate answered or no qualifying members | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: done pushed |
| finishing-a-development-branch | Executed option fails after the gate | skills/finishing-a-development-branch/SKILL.md § ## Completion | gauntlet: stuck |
| gatekeep-pr | stop on approved | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done approved |
| gatekeep-pr | stop on own-merge | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done merged |
| gatekeep-pr | stop on closed-pr | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done closed-pr |
| gatekeep-pr | stop on final | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done final |
| gatekeep-pr | stop on merge-queued | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: done merge-queued |
| gatekeep-pr | stop on initial, assess-terminal, obstacle, or contract-exception; failed cleanup assertion | skills/gatekeep-pr/reference/cleanup.md § ## Non-final stop | gauntlet: stuck |
| gatekeep-pr | Hard assertion failures in fix-wave Sync or loop Exit check | skills/gatekeep-pr/reference/post-selection-loop.md § ### Teardown | gauntlet: stuck |
| gatekeep-pr | Sync restore/assert mismatch | skills/gatekeep-pr/reference/sync.md § ## Failure path | gauntlet: stuck |
| shape-ticket | Ended batch or singleton with no failure contributor; dynamic counters | skills/shape-ticket/reference/repo-audit.md § ## Complete the batch and present gates | gauntlet: done written=1 |
| shape-ticket | Ended batch with unfetched, close-failed, or close-by-hand contributor | skills/shape-ticket/reference/repo-audit.md § ## Complete the batch and present gates | gauntlet: stuck |
| check-delivery | Batched write landed | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done delivered |
| check-delivery | Delivery already recorded | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done already-recorded |
| check-delivery | Write halves emitted for manual execution | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: done manual |
| check-delivery | Findings-comment gate answered or not offered; partial write failure or declined success write | skills/check-delivery/SKILL.md § ## Confirmation gate and the batched write | gauntlet: stuck |
| check-delivery | Quick-reference STOP: unreadable ref/repo mismatch, terminal ticket, zero ACs, open deliverable PR, ambiguous/off-default deliverables, unreachable/timed-out/unbound delivery target | skills/check-delivery/SKILL.md § ## Quick reference | gauntlet: stuck |
| check-delivery | Already-terminal ticket with delivery recorded; no write | skills/check-delivery/SKILL.md § ## Quick reference | gauntlet: done already-recorded |
| chase-bug | Response sent | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done responded |
| chase-bug | Unaddressable origin: rendered summary | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done summary |
| chase-bug | Copy-paste draft is last act, including push failure | skills/chase-bug/SKILL.md § ### 5. Response to origin | gauntlet: done draft |
| gauntlet-resume | No handoff briefs; argument stop routes (including missing bare-name worktree routed to entry check 2) | skills/gauntlet-resume/SKILL.md § ## Arguments | gauntlet: stuck |
| gauntlet-resume | Entry-check failure | skills/gauntlet-resume/SKILL.md § ## Entry checks | gauntlet: stuck |
| gauntlet-resume | Ledger plan_check FAIL | skills/gauntlet-resume/reference/reconstruction.md § ## Spec with ledger | gauntlet: stuck |
| gauntlet-handoff | Step 7: brief written | skills/gauntlet-handoff/SKILL.md § ## Sequence | gauntlet: done brief-written |
| gauntlet-handoff | --out and --key exclusivity STOP | skills/gauntlet-handoff/SKILL.md § ## Sequence | gauntlet: stuck |

Shape-ticket emits one batch settlement line after the last ticket, also for a singleton. Emit nonzero `<key>=<count>` counters, comma-joined without spaces, in this fixed order: `written,closed,declined,dropped,no-op,stopped,unfetched,close-failed,close-by-hand`. Use `done` unless any `unfetched`, `close-failed`, or `close-by-hand` count is nonzero; then use `stuck` with those same ordered counters. `declined` and `dropped` are human decisions, not failures. `stopped` means an integrity stop left without recovery values when the run ended; `gauntlet: done stopped=1` is valid. An active hard-stop recovery ask is still `question`, never a batch ending.

Gatekeep terminal stop reports retain the checkout path and local branch. Non-final stops retain the obstacle's `stuck - ` reason, or `stopped at <template id>` for initial, assess-terminal, and contract-exception. Hard stops retain the actual error. A verdict above a menu is not an ending. A successful PR-subject push followed by the close-member question is still the finishing gate, not `done pushed`.

Resume's argument failures cover a spec seed with an extra worktree, an unrecognized file, a missing path, a missing/invalid bare-name worktree, and other unmatched input, plus no discovery briefs. Entry checks also reject invalid token/override combinations and stale or foreign briefs. Successful resume has no `done`: it continues into the resumed skill's gate.

## Reading a reply

| Layout | Reply |
|---|---|
| N. rows | Send the displayed row number. Apply the shared grammar's numeric remap-and-echo rule before acting, not a guessed stable row index. Gatekeep also accepts `show evidence`, `check <name> flaky`, `check <name> real`, and `check <name> ci-broken`; another string is a change request. Finishing Step 4 also accepts `fix minors` or selected IDs such as `fix minors F3, F9`. |
| 1 - rows | Send the leading number. The spec approval gate accepts `; allowance N` on 4/5 for a positive per-row ledger allowance for this run, or `; fund N fix rounds` on 1/2 for waves funding. On 4/5 the funding token is ignored with a waves-only note. The close-absorbed-members gate uses its displayed approval/revision rows. |
| X) options | Send the letter or free text, preserving the question's recommendation format. |
| item-letter | Send `<item>. <letter>` per the [carried-open response grammar](../skills/finishing-a-development-branch/reference/disposition-protocol.md#response-grammar); use the displayed choices for each item. |
| free / question | Answer the words requested by the body: a number of funded rounds or stop for conformance escalation, typed `discard` for discard authorization, `retry <n> \| <hint>` or `rows +N` for loop row stops, or `yes`/`no` for the named confirmations. |

Ordinary answers outside skill-owned turns, invented gates, tracker/ticket/PR payloads, and private child results are not marker surfaces. Evidence comments still begin with `Delivered: <sha>`; response drafts, close comments, and handoff brief contents keep their own formats. The marker belongs to the surrounding assistant message.

Automatic continuations carry no intermediate terminal line: verification's Closure / conformance into finishing, SDD Continuous Execution, loop After the loop, and chase-bug handoffs into brainstorming, hotfix, or shape-ticket settle at the next skill's gate. Combined batch/menu and closure/options messages use one parent marker. A terminal report and a later new-skill gate on separate turns each carry their own marker.

The executable inventory check is `node scripts/gate-contract-lint.mjs`. It checks listed slices and reverse marker coverage, not inventory completeness, dynamic counter arithmetic, or actual model output; review the full spec inventory against source sites when changing this table.
