# Check-delivery set turns

Text evals for the parent after fresh delivery children return. The target loads the single-ticket confirmation/write section, the set's Turns section, and menu-layout. The combined assembly exceeds the original target's 1,200-word budget, so set samples live here and leave the single-ticket target intact. The runner's wordCap bounds replies, not input assembly.

- `batch-one-gate-per-turn`: three read report files; show only the first ticket's display report and confirmation gate, with exactly one leading marker and no transport metadata.
- `batch-decline-isolates`: decline ticket 12; show its plain outcome and ticket 15's unchanged report and independent gate, with no write.
- `batch-approved-after-decline`: after ticket 15's approved comment succeeds, show its plain delivered outcome before ticket 18's unchanged report and gate. Re-fetch and write results are supplied observations, not observed tool calls.
- `batch-ac-conflict-row`: show the initial AC-conflict recovery gate, quoted rows and retry/skip, without a reading question or sibling gate.
- `batch-ac-conflict-reading`: after retry is selected, ask for the typed reading in a separate question turn and wait; no retry is claimed before the reading.
- `batch-closing-marker`: decline the last ticket after two deliveries; show one set settlement marker and all three plain outcomes in roster order.

Run each named sample explicitly with `node eval/run.mjs check-delivery-batch <sample> --base d3aa93b651f89223161c6039446cd8af3ee3296c`. The batch reference is candidate-only at that base. Results are sample-scoped, not proof of actual dispatch or tracker tool calls; the disposable-tracker smoke owns those observations.
