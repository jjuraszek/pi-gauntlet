# eval report: plan (partial run: post-action-no-task)

for: ad358530f60a6d0ef22620b1d646bb1b5cd90119b2c2d59f5237f928d9d3fd18

wall: 72s

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
| post-action-no-task | anthropic/claude-opus-5-5 | unchanged | 9677 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |
| post-action-no-task | github-copilot/gpt-6.1-sol | regressed | 9915 | entries: holds -> holds (held); mixed-row: holds -> fails (regression); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |

## Feedback

- post-action-no-task / anthropic/claude-opus-5-5: No fact moved on this sample: all four hold in both outputs. The expected citation move (fails -> holds) is not visible here, because Before already places `release-audit --live` exactly once, on the `Excluded citation (not work, not an acceptance condition):` line inside Task 1, which owns § "Acceptance criteria" L8-L9, and keeps it out of steps, Tests and table cells; After does the same. Both outputs leave every Integration entry (L12-L18, including tagging) without a coverage row or task, keep the literal `EMPTY` in Task 1's tests, implementation and coverage row without mentioning the import sandbox or the live audit as proof, and give Design L4 and L5 each a row and an owning task. To keep these facts, preserve the contract wording that puts the external command only in the owning task's excluded-citation line and bars Integration entries from the table and tasks. Outside the listed facts, After dropped the top-level Files section, the baseline provenance paragraph and the `Modify:` lines for the edited test files (while still staging them with `git add`), and it also dropped the stray `PLAN WRITTEN` status line that Before emitted against the case instruction; if the first three are unintended, check the moved test-file ownership and baseline wording in the contract.
- post-action-no-task / github-copilot/gpt-6.1-sol: The expected citation move (fails -> holds) does not show in this pair: Before already places `release-audit --live` exactly once, on the Excluded citation line inside Task 1 and nowhere in steps, Tests or table cells, and After does the same. What did move is mixed-row, which regressed: After's coverage row for § "Acceptance criteria" L8-L9 reads "Scanner reports `EMPTY` for input with no records; import sandbox venue", which pulls the venue into the requirement cell, whereas Before's row stated only the `EMPTY` literal. The likely cause is the instruction to cite the requirement "through its indented disposition line" being read as a cue to summarise that line's content rather than only to extend the anchor range. To keep what Before kept, have the contract say that the disposition line widens the anchor (L8-L9) only, and that the requirement (short) cell and the task's steps and Tests carry just the functional literal. It should also say that an unrecognized disposition such as a venue, like the external command, is never restated in a table cell, step or test; the command appears only on the owning task's Excluded citation line and the venue appears nowhere outside the anchor range. Entries and design held in both outputs: neither has an Integration row or task, and both give L4 and L5 a coverage row and an owning task.

On this branch, the earlier post-action-no-task replay for github-copilot/gpt-6.1-sol regressed on mixed-row and reproduced on confirmation; the sample was replayed fresh once afterward.

exit: 1
