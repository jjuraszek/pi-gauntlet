# eval report: plan (partial run: post-action-no-task)

for: 78c0807e9bda1851fed5087f5d934b76277862b13c9aacd9ef2a90384e4688fe

wall: 40s

## Change

Partition planning by reader. Keep only the planning flow in SKILL.md and move the authoring rules into the complete plan contract. Send four paths, not a skill path, to the child. Load open-questions.md only on substantive questions or the second identical parent FAIL, and stop when that reference is unreadable. Preserve stamping, one finished-plan read and execution handoff.

The selected fresh-child-authors-plan replay checks that the parent dispatches four paths and reads neither reference on a clean run. The selected parent-offers-fix-first-narrow-amend replay checks a narrated read before the recovery menu, while gate-line-first checks the user-facing first line and pause without narration. These interpretation and read-order choices require model replay; deterministic checks establish the file partition and branch pointers, not the narrated behavior. Coverage is sample-scoped, not an instrumented plan-phase run or a target-wide pass.

The child-reads-one-contract replay checks that the plan-writer reads the whole contract at its supplied path before writing, without reading SKILL.md or requesting a fifth path. Baseline-fails-on-base, removal-lists-delete and maintenance-after-delete check retained failure evidence, Delete ownership and ordinary/implement-only maintenance after the move. The local checker validates both recorded removal plans; it observes neither live reads nor a live plan phase. Preserve leg routing and PR-subject verification; their selected replays remain separate coverage.

The leg-checkout-by-branch case selects the replay's existing Role: plan-writer branch and drops the parent skill slice. This removes conflicting parent dispatch/no-write instructions from the child exercise while preserving all six expected facts. Its case asks for every Files kind of each task path and scopes the final reply line to case A, because one reply covers three independent observations and case C writes no plan. The contract's ownership wording for an edited test file is moved text, unchanged by this edit. Reseed and replay only this sample; retain the two passing PR records and all other sample evidence.

The post-action-no-task replay checks that Integration entries have no task or coverage row. For a mixed row, keep the functional literal in the assigned work and put the external command only in the owning task's excluded citation. Run the local plan checker on both saved plans; this sample does not exercise live planning.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-no-task | anthropic/claude-opus-5-5 | unchanged | 8728 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |
| post-action-no-task | github-copilot/gpt-6.1-sol | unchanged | 6544 | entries: holds -> holds (held); mixed-row: holds -> holds (held); citation: holds -> holds (intended but unchanged); design: holds -> holds (held) |

## Feedback

- post-action-no-task / anthropic/claude-opus-5-5: No fact moved between Before and After: all four hold in both. Both outputs give no coverage row or task to any Integration entry (L12-L18), keep the literal `EMPTY` in Task 1's tests, implementation and coverage row without the operator's audit, and cover Design L4 and L5 with a row and an owning task each. The expected citation move (fails -> holds) does not show in this sample, because Before already cites `release-audit --live` exactly once, on the `Excluded citation (not work, not an acceptance condition):` line inside Task 1 and nowhere in steps, Tests or table cells. The After wording therefore preserves the behaviour rather than causing it here, so keep the contract's rule that a mixed row puts the functional literal in the assigned work and the external command only in the owning task's excluded citation. Outside the listed facts, After ends with a `PLAN WRITTEN /workspace/project/doc/plans/scan.md` status line although the case asks for the plan Markdown only, and adds `Baseline home` and `Baseline provenance` lines before the separator. After also swaps the concrete test and implementation code for prose bullets and uses `node --check` as the format/lint step. If those are unintended, have the contract state that the status reply is separate from the plan file content and that steps carry concrete code.
- post-action-no-task / github-copilot/gpt-6.1-sol: On this sample no fact moved: both Before and After keep Integration entries out of the coverage table and out of every task (no tagging, draining, vendor confirmation or cutover work), both table and task the literal `EMPTY` for no-record input without tying it to the operator's live audit, both cite `release-audit --live` exactly once on the 'Excluded citation (not work, not an acceptance condition):' line inside Task 1 (the owner of Acceptance criteria L8-L9) and nowhere in steps, Tests or table cells, and both give Design L4 and Design L5 a coverage row plus an implementing task. The expected fails -> holds move for the citation fact is therefore not visible here, because Before already satisfied it; the After wording preserves it rather than producing it. To keep all four facts stable, retain the contract's explicit wording that Integration entries get no row and no task, that a mixed acceptance row keeps only its functional literal in the assigned work, and that the external command appears once on the excluded-citation line of the owning task. Unrelated differences in After (relative spec path, grouped Files list, heredoc commit messages, `via:` naming the source file) did not affect any fact, but they are drift worth checking against the contract's intent since the Change was meant to move text, not alter plan shape.

exit: 0
