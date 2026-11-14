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

This is a new free-text spec, not a PR subject. The latest explicit phase_tracker status observation ends with `Context: 12%`. No engine preference has been stated. For this gate, gauntlet_setting({ key: "loopEngine" }) returned maxIterationsPerRow: 7, replacing the shared pre-read value of 4.

## User reply

1
