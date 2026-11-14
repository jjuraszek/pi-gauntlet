## Briefing

Repeated collection requests return the original receipt instead of collecting again.

**What changes**
- Reuse the receipt on a retry.

**Approval risks**
- Existing duplicate charges still need manual refunds.

**Done when**
- A retry returns the existing receipt.

## Critique pass return

Applied:
none
Deferred:
none
Rejected:
none

## Spec commit

Clarify collection retries

Applied:
none
Deferred:
none
Rejected:
none

## Spec acceptance criteria

Ticket #42, checkbox list, rows verbatim:
- [ ] Retried collection requests return the original receipt.
  in-scope

## Gate observations

This is a new ticket spec, not a PR subject. The summary was read successfully; the brief wording above is complete. The pre-read status ends with `Context: 12.0% of window`. The settings observation supplies maxIterationsPerRow: 4. The committed spec header currently has `**Amend-grant:** none` and no engine field. All four rows are available.

## User reply

Treat the following as independent replies to the same gate, not a conversation sequence. Render the gate once, then handle each reply separately using its case ID. Narrate the resulting header fields, commit and HEAD check, then the phase completion and next skill; do not use tools.

| Case | Reply |
|---|---|
| plan-stop | 1 --amends-stop |
| loop-stop | 2 --amends-stop |
| plan-funded | 1 --fund-rounds=3 |
| plan-stop-funded | 1 --amends-stop --fund-rounds=3 |
