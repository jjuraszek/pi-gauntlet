# eval report: plan (partial run: post-action-no-task)

for: 593c1b3eb72622cc1ee1fd85a4f570a350708bf9553a5730620c2558d3dc1459

wall: 34s

The `post-action-no-task` run predates the rebase onto main. No replay tested the merged instructions.

Saved rows for other samples predate the commit-body wording change and were not rerun.

## Change

Select post-action-no-task to check that an unrecognized disposition neither removes the scanner requirement from the plan nor adds a sandbox task. The replay checks the writer's assignment, not just the coverage grammar.

Partition planning by reader. Keep only the planning flow in SKILL.md and move the authoring rules into the complete plan contract. Send four paths, not a skill path, to the child. Load open-questions.md only on substantive questions or the second identical parent FAIL, and stop when that reference is unreadable. Preserve stamping, one finished-plan read and execution handoff.

The selected fresh-child-authors-plan replay checks that the parent dispatches four paths and reads neither reference on a clean run. The selected parent-offers-fix-first-narrow-amend replay checks a narrated read before the recovery menu, while gate-line-first checks the user-facing first line and pause without narration. These interpretation and read-order choices require model replay; deterministic checks establish the file partition and branch pointers, not the narrated behavior. Coverage is sample-scoped, not an instrumented plan-phase run or a target-wide pass.

The child-reads-one-contract replay checks that the plan-writer reads the whole contract at its supplied path before writing, without reading SKILL.md or requesting a fifth path. Baseline-fails-on-base, removal-lists-delete and maintenance-after-delete check retained failure evidence, Delete ownership and ordinary/implement-only maintenance after the move. The local checker validates both recorded removal plans; it observes neither live reads nor a live plan phase. Preserve leg routing and PR-subject verification; their selected replays remain separate coverage.

The leg-checkout-by-branch case selects the replay's existing Role: plan-writer branch and drops the parent skill slice. This removes conflicting parent dispatch/no-write instructions from the child exercise while preserving all six expected facts. Its case asks for every Files kind of each task path and scopes the final reply line to case A, because one reply covers three independent observations and case C writes no plan. The contract's ownership wording for an edited test file is moved text, unchanged by this edit. Reseed and replay only this sample; retain the two passing PR records and all other sample evidence.

The post-action-no-task replay checks that Integration entries have no task or coverage row. For a mixed row, keep the functional literal in the assigned work and put the external command only in the owning task's excluded citation. Run the local plan checker on both saved plans; this sample does not exercise live planning.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-no-task | anthropic/claude-opus-5-5 | unchanged | 9955 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |
| post-action-no-task | github-copilot/gpt-6.1-sol | unchanged | 5928 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |

## Feedback

- post-action-no-task / anthropic/claude-opus-5-5: No fact moved between the two outputs: all four hold in both. The expected citation move (fails -> holds) does not show in this pair, because Before already cites `release-audit --live` exactly once, on the `Excluded citation (not work, not an acceptance condition):` line in Task 1, which owns Acceptance criteria L8-L9, and keeps it out of steps, Tests and table cells; After does the same. Both outputs leave every Integration entry (L12-L18) without a coverage row or task, keep the `EMPTY` literal in Task 1's tests, implementation and coverage row without the import sandbox or live audit as requirement or proof, and give Design L4 and L5 each a row and an implementing task. To keep these facts, the contract wording should continue to state three things explicitly: Integration entries get no row and no task; a mixed row keeps only its functional literal in the assigned work; and the external command appears once, only on the owning task's excluded-citation line. Two differences fall outside the listed facts: After drops Before's trailing `PLAN WRITTEN` status line, which the case asked to omit, and After lists the edited test files only under `Test:` where Before also listed them under `Modify:`, so check that against the contract's ownership wording for an edited test file.
- post-action-no-task / github-copilot/gpt-6.1-sol: No fact moved between Before and After on this sample: both plans omit every Integration entry from the coverage table and tasks (no tagging, queue drain, login or cutover work), both table and task the literal `EMPTY` for a no-record input under Task 1 without drawing the import sandbox or the live audit into steps, Tests or proof, both place `release-audit --live` exactly once on the `Excluded citation (not work, not an acceptance condition):` line inside the task that owns Acceptance criteria L8-L9, and both give Design L4 and L5 a coverage row with an implementation owner. The expected citation move (fails -> holds) is therefore not visible here, because Before already satisfied it; the moved contract wording preserved the behavior rather than producing it. The only differences are incidental: After drops the backticks around the spec path in the task Spec lines, reorders the Files header, uses an isolated temporary changelog in the release test, and leaves the commit message to be composed on stdin instead of inlining a heredoc. None of these touch the facts. To keep them stable, retain the contract's explicit rules that Integration entries get neither a row nor a task, that a mixed row keeps only the functional literal in the assigned work, and that the external command is cited once on the excluded-citation line of the owning task and nowhere in steps, Tests or table cells.

## Earlier wording attempt (superseded)

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-no-task | anthropic/claude-opus-5-5 | unchanged | 8833 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |
| post-action-no-task | github-copilot/gpt-6.1-sol | inconclusive | 11256 | entries: holds -> holds (held); mixed-row: holds -> fails (regression); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |

The first wording put `venue: import sandbox` in the requirement cell on the primary Copilot replay but not on confirmation. The current comparison above uses the second wording.

exit: 0
