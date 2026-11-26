# eval report: plan (partial run: post-action-no-task)

for: 66520522b2d861d6a1e1778fbf2acd87719c2bdc406afbba760f4ff38b9d8ee0

wall: 39s

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
| post-action-no-task | anthropic/claude-opus-5-5 | unchanged | 8659 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |
| post-action-no-task | github-copilot/gpt-6.1-sol | unchanged | 8690 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |

## Feedback

- post-action-no-task / anthropic/claude-opus-5-5: No fact moved between the two outputs: all four hold in both. The expected citation move (fails -> holds) does not show in this sample, because Before already cites `release-audit --live` exactly once, on the Excluded citation line in Task 1 (owner of Acceptance criteria L8-L9), and keeps it out of steps, Tests and table cells; After does the same. In both, the coverage table has only the two Design rows and the L8-L9 row, each owned by an implementing task, and no task touches an Integration entry, the import sandbox or the live audit. The one relevant difference is that After drops Before's explicit closing sentence that Integration entries get no row and no task; the fact still holds by absence, but if you want that guarantee to be robust, keep contract wording that says Integration entries get neither a row nor a task. Also keep the wording that puts the external command only on the owning task's single Excluded citation line, and the mixed-row rule that carries only the functional literal `EMPTY` into the row, tests and steps.
- post-action-no-task / github-copilot/gpt-6.1-sol: No fact moved between Before and After on this sample: all four hold in both. The citation fact was expected to go from fails to holds, but Before already satisfies it. In both outputs `release-audit --live` appears exactly once, on its own line opening `Excluded citation (not work, not an acceptance condition):` inside Task 1, which owns § "Acceptance criteria" L8-L9. It is not in any step, Tests bullet or coverage-table cell, so this replay does not show the new wording causing the citation behaviour. After still keeps Integration L12-L18 out of the coverage table and out of every task, including tagging. It keeps the literal `EMPTY` in Task 1's tests, implementation step and coverage row without drawing in the import sandbox or the live audit. It also keeps Design L4 and L5 each with a row and an owning task. To keep these, preserve the contract wording that places the excluded citation as a standalone line in the owning task, outside the Tests list and the steps, and the rule that Integration entries get neither a row nor a task. To demonstrate the intended movement, you would need a sample whose Before actually puts the command in a step or omits it. The only differences in After are incidental: `Baseline home` instead of `Baseline project`, a flat Files list, and format/commit split into seven steps. None of them affects a listed fact.

exit: 0
