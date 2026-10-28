## Briefing

Orchard coordinators use orchard-billing to collect monthly fees from growers, but a repeated collection request can charge the same invoice twice. The proposed change gives each collection request a stable receipt so retries return the original outcome instead of collecting again.

**What changes**
- Coordinators see one receipt per invoice collection, including retries after an interrupted connection.
- A pending collection stays visibly pending until its outcome is known.
- Growers receive a confirmation only after the collection succeeds.

**Approval risks**
- Existing duplicate charges remain a manual refund task.
- The payment partner must preserve request keys across retries.

**Done when**
- Repeated requests produce one charge and one receipt, including after a service restart.

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

Ticket orchard-billing#7, Acceptance criteria, rows verbatim (ticket provenance, so the drafted block is omitted):
- [ ] Repeated collection requests return the original receipt.
  in-scope

## User reply

3
