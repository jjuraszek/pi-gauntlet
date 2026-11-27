# eval report: loop (partial run: tracker-refresh)

for: 6a099150775b5ff06474a688f58c8d0d00589bcdd9cda1a8bd99640e85aa92bd

wall: 95s

## Change

Load the human stop procedure before a stop or ledger amendment, not for clean dispatch or interrupted-return recovery. The clean-dispatch and human-stop-counts samples test narrated reads on supplied observations, not live traces.

After an interrupted return, read the repaired rows from the ledger and continue without a tracker call, including on resume. Seed the list once. At subsequent dispatches and stops, rely on automatic projection. Read status before using a task index across a dispatch or stop.

Select seed-dispositions to check the initial state of an approved row with an unrecognized disposition. Its duplicate-id criterion gets the same open row as an unmarked criterion. The replay checks the driver's interpretation, not a live dispatch.

The worker's action boundary is covered by loop-implementer/mixed-migration-row. No driver sample was rerun for that change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| tracker-refresh | anthropic/claude-opus-5-5 | improved | 17707 | seed: holds -> holds (held); baseline: fails -> holds (unplanned improvement); retry-order: fails -> holds (unplanned improvement); cut-completion: fails -> holds (unplanned improvement) |
| tracker-refresh | github-copilot/gpt-6.1-sol | improved | 13594 | seed: holds -> holds (held); baseline: fails -> holds (unplanned improvement); retry-order: fails -> holds (unplanned improvement); cut-completion: fails -> holds (unplanned improvement) |

## Feedback

- tracker-refresh / anthropic/claude-opus-5-5: After moved three facts by dropping every driver `plan_tracker` refresh after the single Entry seeding call. Before refreshed after each tuple write, after each admission, after the amendment commit and again at rule 1, which contradicts the baseline, retry-order and cut-completion facts; After relies on automatic projection and says so explicitly ("I make no tracker write", "no `update` call"). The baseline call for Before depends on reading its pre-dispatch refresh as a tracker write; if you count only list write-backs as writes, Before holds there. The seed fact holds in both, since both run plan_check, commit, start implement, refresh with only the ledger path, skip seed dispatch and print the empty gate set without running `make ci`. To keep this, retain the "seed the list once, then rely on automatic projection" wording. Two things in After are thin: the row 3 in_progress observation appears only in the Ownership section rather than at the dispatch step, and preservation of prior decision history at the cut is implied rather than stated. Wording that asks the driver to note the observed projection at each dispatch and to state that prior Decisions lines are untouched by an amendment would make those facts more robust. After also says no human stop occurs although an approved amendment is applied; consider wording that clarifies whether the amendment approval counts as a stop.
- tracker-refresh / github-copilot/gpt-6.1-sol: The After wording removed every driver `plan_tracker` refresh except the single one after implement start, and that is what moved three facts. Before refreshed after each pending-tuple write, after each return admission, after the amendment commit and again under rule 1, so it failed baseline, retry-order and cut-completion. After writes the tuple and dispatches directly, admits returns and commits the cut with no tracker call, and reaches verify through rule 1 with only the explicit `phase_tracker` start for verify, so all three now hold. The seed fact holds in both: `plan_check`, the stamped skeleton commit, implement start, a path-only refresh, no seed dispatch, and the `gate set empty - every row cut` line with no `make ci`. To keep this, keep "seed the list once, then rely on automatic projection" explicit. Also keep the entry-step-5 refresh call spelled out with only the absolute ledger path, so the one remaining refresh is not dropped. One wording risk: After says "refresh the held grant, dispositions, membership, paths, and Rules" after the amendment, which a reader could mistake for a tracker refresh. "Re-decode" would avoid that. After also only alludes to the baseline rows showing skipped; stating that the two baseline-done rows show skipped at verify start as an observed projection would make that part of the baseline fact more robust.

exit: 0
