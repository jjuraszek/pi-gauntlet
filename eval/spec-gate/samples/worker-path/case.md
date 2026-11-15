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

## Spec acceptance criteria

Ticket orchard-billing#7, Acceptance criteria, rows verbatim (ticket provenance, so the drafted block is omitted):
- [ ] Repeated collection requests return the original receipt.
  in-scope

## Gate observations

This is a new ticket spec, not a PR subject. The critique pass used a worker and produced no council audit. The pre-summary status observation ends with `Context: unknown`.

## User reply

1

## Independent withholding checks

After handling the initial reply, render these independent gates from the same briefing and worker return. Do not repeat the briefing or commit line. For each case give its ID, gate marker, numbered rows with their flag bullets, any unavailability or withheld line, and Recommended line. Use `Context: unknown` for every case; none is a create-only retry. Keep each recommendation reason to one sentence.

| Case | Acceptance section | Subject | Critique |
|---|---|---|---|
| zero-worker | `none - ticket not fetched (tracker unreachable)`; no checkbox rows | new spec | worker, no audit |
| pr-worker | original single in-scope row | PR #42 | worker, no audit |
| zero-pr-worker | same zero-row section as zero-worker | PR #42 | worker, no audit |
| aborted | original single in-scope row | new spec | council aborted before an audit existed |

Then handle reply `3` independently against each of these four gates: print only the clarification and whether anything changes, without rendering the gate again. No independent case approves implementation. Limit the complete response to 1150 words.
