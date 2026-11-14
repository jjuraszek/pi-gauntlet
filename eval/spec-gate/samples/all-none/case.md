Render the primary gate and handle its reply, then handle the two independent continuation snapshots below without rendering their gates again. Keep the entire response under 1200 words.

## Primary gate observations

The status call returned `Context: 16.0% of window`. This is a ticket subject with no existing PR. The committed spec contains these ticket acceptance rows:

- [ ] Retrying a collection returns its existing receipt.
  in-scope
- [ ] A pending collection remains visibly pending.
  in-scope

## Briefing

Orchard coordinators use orchard-billing to collect monthly fees from growers, but a repeated collection request can currently charge the same invoice twice. Coordinators then reconcile receipts by hand while growers wait for a refund, and neither group can tell whether a retry is safe. The proposed change gives each collection request a stable receipt and makes retries return the original outcome instead of collecting again.

**What changes**
- Coordinators see one receipt for each invoice collection, including retries after an interrupted connection.
- A pending collection stays visibly pending until its outcome is known; the service does not guess that a timeout means failure.
- Growers receive a confirmation only after the collection succeeds, with the invoice amount and collection date.

**Approval risks**
- Existing duplicate charges remain a manual refund task; this change prevents new duplicates rather than rewriting past receipts.
- The payment partner must preserve request keys across retries. Collection remains paused if that guarantee cannot be confirmed.
- Receipt retention increases stored billing data, so operators must approve the retention window before rollout.

**Done when**
- Repeated requests produce one charge and one receipt, including after a service restart.
- Pending outcomes remain visible, confirmations are sent once, and coordinators can reconcile the rollout's first billing cycle without duplicate charges.

## Critique pass return

Applied: none
Deferred: none
Rejected: none

## Spec commit

Applied: none
Deferred: none
Rejected: none

## User reply

approve

## Independent continuation snapshots

These are separate gates, not choices to combine. Each gate has already rendered its recommendation; handle the user's next reply using that snapshot. Do not render a second briefing, call tools, or reconsider the recommendation.

### plan

The gate marker ends in `recommended=1`. Rendered row 1 is `1 - plan engine: write a task plan, then implement it in reviewed waves. [recommended]`. Rows 2, 3, and 4 are also rendered, without a recommendation tag. The reason quotes the first bundled acceptance row. User reply: `approve`.

### draft

The gate marker ends in `recommended=4`. Rendered row 4 is `4 - draft PR: approve the spec's content, publish a draft PR, and stop this flow for a fresh session to continue there. [recommended]`. Rows 1, 2, and 3 are also rendered, without a recommendation tag. The observed context percentage is 31.0%. User reply: `approve`.
