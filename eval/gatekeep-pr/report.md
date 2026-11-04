# eval report: gatekeep-pr (partial run: nit-batch-row)

for: 9cdc0d054e1de42279c1262d1c2bd6f0831778ea0427d561ed71a62946544a92

wall: 75s

## Change

Clarify the unchanged description-repair safeguards at the finding-artifact routing boundary: keep description targets and replies outside ACs and ledger rows, compare fresh head/body against the selected proposal before a description write, and require readback and a fresh claim-recheck helper before closing only the affected contribution. Keep replies behind their explicit pick. Preserve nit-batch-row/n6 without weakening its fact or changing description repair. Selected model coverage is nit-batch-row only: artifact construction and non-file routing narration, not live writes or row admission.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| nit-batch-row | anthropic/claude-opus-5-5 | improved | 17028 | n1: fails -> holds (unplanned improvement); n2: fails -> holds (unplanned improvement); n3: fails -> holds (unplanned improvement); n4: fails -> holds (unplanned improvement); n5: fails -> holds (unplanned improvement); n6: holds -> holds (held); n7: fails -> holds (unplanned improvement); n8: holds -> holds (held) |
| nit-batch-row | github-copilot/gpt-6.1-sol | improved | 17976 | n1: fails -> holds (unplanned improvement); n2: fails -> holds (unplanned improvement); n3: fails -> holds (unplanned improvement); n4: fails -> holds (unplanned improvement); n5: fails -> holds (unplanned improvement); n6: holds -> holds (held); n7: fails -> holds (unplanned improvement); n8: holds -> holds (held) |

## Feedback

- nit-batch-row / anthropic/claude-opus-5-5: Nothing regressed: After keeps both facts Before held (n6, n8) and additionally satisfies n1–n5 and n7, which Before failed outright because it declared that no derived spec or companion ledger exists, split N1 and N2 into separate wave rows in both checkpoints, and gave each nit its own scoped command rather than the union. The description-repair clarification landed cleanly in After's section 7: P3 is explicitly 'not an AC or a ledger row', the compare-and-swap re-fetches head/body against the proposal's assessed_head and original_body, readback is required, and a fresh Section B description recheck helper runs before closing only P3's claim contribution; C1 stays behind an explicit `reply 1` pick. The only wording to watch is that After's selected_ids list now includes L2 alongside P1 while the AC and row are shared — that is consistent with n1 as long as the narration continues to state (as it does) that L2 gets no separate row; keeping the sentence 'P1 and L2 share one AC because they are deduplicated contributors' adjacent to the ledger is what preserves n1 under the new wording.
- nit-batch-row / github-copilot/gpt-6.1-sol: No fact that Before kept was lost in After: n6 (P3/C1 stay outside ACs and ledger rows, fresh head/body comparison plus readback and an affected-only recheck helper before closing only the claim contribution, C1 unposted behind an explicit reply pick) and n8 (no dispatch, verification, push or external write) both hold in After, and the reworded description-repair paragraph in After is actually more precise than Before ("fresh head/body/base comparison, preserves unrelated body text, then requires readback and a fresh affected-only description-recheck helper"). Before failed n1-n5 and n7 only because it refused to write the derived spec and companion ledger at all, so the After wording that constructs the three-row delivery ledger (P1/L2 batched, P2, one nit batch row), the one-row terminal ledger, the record-sibling paths, the repair.wave.spec/ledger persistence, and the union scoped commands with cd prefixes delivers everything the facts ask for. One minor hardening suggestion: in the delivery Stop line, state explicitly that neither sibling artifact is staged or committed (as the terminal section already does) and that npm test is not run at this checkpoint, so n4 and n5 rest on a direct sentence rather than on "not tracked edits" and the general stop statement.

exit: 0
