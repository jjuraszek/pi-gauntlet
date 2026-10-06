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

Cut two filler paragraphs; replaced one 'we should' with 'we will'; no external references flagged.

## Spec commit

Clarify orchard-billing collection retry behavior

## User reply

1
