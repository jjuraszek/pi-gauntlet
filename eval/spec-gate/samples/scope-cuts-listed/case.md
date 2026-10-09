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

Applied: [blocker] interrupted retry recharges - raised-by: [vendor-a-model-x, vendor-b-model-y] -> reuse the collection key after every interrupted request (grounded: vendor-a-model-x interrupted collection probe)
Applied: [blocker] uncertain payment outcome - raised-by: [vendor-b-model-y] -> preserve pending outcomes until the payment partner confirms them
Applied: [major] confirmation precedes receipt - raised-by: [vendor-c-model-z] -> store the receipt before sending a grower confirmation
Applied: [major] restart loses collection key - raised-by: [vendor-a-model-x] -> keep collection keys through a service restart (grounded: vendor-a-model-x restart probe)
Applied: [major] changed amount on retry - raised-by: [vendor-b-model-y] -> reject retries that change the invoice amount
Applied: [major] retry hides original receipt - raised-by: [vendor-c-model-z] -> show coordinators the original receipt on a retry
Applied: [major] unconfirmed partner guarantee - raised-by: [vendor-a-model-x, vendor-c-model-z] -> require payment partner confirmation before rollout
Applied: [minor] historical refund scope - raised-by: [vendor-b-model-y] -> state that historical refunds remain manual
Applied: [minor] retention approval ownership - raised-by: [vendor-c-model-z] -> name the receipt retention approval owner
Applied: [minor] confirmation lacks date - raised-by: [vendor-a-model-x] -> include the collection date in confirmations
Applied: [minor] rollout reconciliation gap - raised-by: [vendor-b-model-y, vendor-c-model-z] -> check the first billing cycle for duplicate charges
Deferred: none
Rejected: none

## Spec commit

Applied: [blocker] interrupted retry recharges - raised-by: [vendor-a-model-x, vendor-b-model-y] -> reuse the collection key after every interrupted request (grounded: vendor-a-model-x interrupted collection probe)
Applied: [blocker] uncertain payment outcome - raised-by: [vendor-b-model-y] -> preserve pending outcomes until the payment partner confirms them
Applied: [major] confirmation precedes receipt - raised-by: [vendor-c-model-z] -> store the receipt before sending a grower confirmation
Applied: [major] restart loses collection key - raised-by: [vendor-a-model-x] -> keep collection keys through a service restart (grounded: vendor-a-model-x restart probe)
Applied: [major] changed amount on retry - raised-by: [vendor-b-model-y] -> reject retries that change the invoice amount
Applied: [major] retry hides original receipt - raised-by: [vendor-c-model-z] -> show coordinators the original receipt on a retry
Applied: [major] unconfirmed partner guarantee - raised-by: [vendor-a-model-x, vendor-c-model-z] -> require payment partner confirmation before rollout
Applied: [minor] historical refund scope - raised-by: [vendor-b-model-y] -> state that historical refunds remain manual
Applied: [minor] retention approval ownership - raised-by: [vendor-c-model-z] -> name the receipt retention approval owner
Applied: [minor] confirmation lacks date - raised-by: [vendor-a-model-x] -> include the collection date in confirmations
Applied: [minor] rollout reconciliation gap - raised-by: [vendor-b-model-y, vendor-c-model-z] -> check the first billing cycle for duplicate charges
Deferred: none
Rejected: none

## Spec acceptance criteria

- [ ] Collection retries return the original receipt.
  in-scope
- [ ] Pending collection outcomes remain visible.
  in-scope
- [ ] Historical duplicate charges receive automatic refunds.
  deferred: acme/widgets#46
- [ ] The receipt export opens in the browser.
  venue: staging - export opens in the browser
- [ ] Grower confirmations use the shared email transport.
  elsewhere: acme/mailer

## User reply

1
