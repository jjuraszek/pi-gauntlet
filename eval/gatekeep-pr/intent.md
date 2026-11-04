for: 9cdc0d054e1de42279c1262d1c2bd6f0831778ea0427d561ed71a62946544a92

## Change
Clarify the unchanged description-repair safeguards at the finding-artifact routing boundary: keep description targets and replies outside ACs and ledger rows, compare fresh head/body against the selected proposal before a description write, and require readback and a fresh claim-recheck helper before closing only the affected contribution. Keep replies behind their explicit pick. Preserve nit-batch-row/n6 without weakening its fact or changing description repair. Selected model coverage is nit-batch-row only: artifact construction and non-file routing narration, not live writes or row admission.

## Expected to move
