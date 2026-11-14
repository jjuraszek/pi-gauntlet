## Briefing

Repeated collection requests can charge the same invoice twice, leaving coordinators to reconcile receipts while growers wait for refunds. Give each request a stable receipt so retries return the original outcome rather than collecting again.

**What changes**
- Return the existing receipt after a retry, including after a service restart.
- Leave pending outcomes visible until the payment partner confirms the result.

**Approval risks**
- Existing duplicates still need manual refunds.
- Confirm the partner preserves request keys before rollout.

**Done when**
- Retries produce one charge and one receipt.

## Critique pass return

Applied:
1. Clarified the retry outcome.
Deferred:
none
Rejected:
none

## Spec commit

Clarify collection retries

Applied:
1. Clarified the retry outcome.
Deferred:
none
Rejected:
none

## Spec acceptance criteria

Drafted from the design, no ticket rows:
- [ ] Retried collection requests return the original receipt.
  in-scope

## Gate observations

This is a new free-text spec, not a PR subject. The pre-summary phase_tracker({ action: "status" }) call succeeded and its observation ends with `Context: 25.1% of window`. No engine preference has been stated. For this gate, gauntlet_setting({ key: "loopEngine" }) returned maxIterationsPerRow: 7, replacing the shared pre-read value of 4.

## User reply

1

## Independent recommendation checks

After the initial gate and its reply, evaluate these independent gate observations with the same acceptance row and no user reply. None is a create-only retry view. Give only each case ID, the first-line gate marker, the selected row's sentence with its tag, and its Recommended line; do not repeat the briefing, flags, or unselected rows.

| Case | Status observation | Rendered choices |
|---|---|---|
| unknown | Context: unknown | 1, 2, 3, 4 |
| boundary | Context: 25.0% of window | 1, 2, 3, 4 |
| low | Context: 12.4% of window | 1, 2, 3, 4 |
| withheld | Context: 80.0% of window | 1, 2, 3; row 4 is withheld because this is PR #42 |

## Zero-row recommendation checks

For each independent case below, replace the spec's acceptance section with `none - ticket not fetched (tracker unreachable)`. No checkbox rows exist, the council audit is available, and none is a create-only retry view. Use the supplied rendered choices; give only the case ID, first-line gate marker, selected row's sentence with its tag, and Recommended line. There is no user reply.

| Case | Status observation | Rendered choices |
|---|---|---|
| zero-unknown | Context: unknown | 1, 3, 4 |
| zero-low | Context: 12.0% of window | 1, 3, 4 |
| zero-withheld | Context: 80.0% of window | 1, 3; row 4 is withheld because this is PR #42 |
| zero-high | Context: 31.0% of window | 1, 3, 4 |

## Bundled-row recommendation checks

Evaluate each independent case using its replacement committed acceptance section below. Rendered choices are 1, 2, 3, 4; none is a create-only retry view and there is no user reply. Output only the case ID and its Recommended line, not another menu.

| Case | Status observation | Acceptance section |
|---|---|---|
| bundle-in-scope | Context: 12.0% of window | A |
| bundle-venue | Context: unknown | B |
| bundle-high | Context: 31.0% of window | A |

### Acceptance section A

Ticket #42, checkbox list, rows verbatim:
- [ ] Retries return the receipt and emit an audit event.
  in-scope

### Acceptance section B

Ticket #42, checkbox list, rows verbatim:
- [ ] Deploy the worker and publish the dashboard.
  deviates: dashboard is outside this change
- [ ] Provision backups and send daily reports.
  deferred: next release
- [ ] Export invoices and archive old receipts.
  elsewhere: archive service
- [ ] The status line shows the receipt ID, total, and currency.
  in-scope
- [ ] Retries return the receipt and enqueue a follow-up email.
  venue: staging payment sandbox
- [ ] Publish a receipt schema and add its migration command.
  in-scope
