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

replay: continuation

The gate was rendered in the preceding turn; now handle these independent replies, not a conversation sequence. Output only a common approval recipe and case-ID continuations, with no briefing or gate menu. State the shared commit, HEAD check and phase-completion sequence once, then apply that sequence to each accepted case after its exact header fields, decoded amendment permission and separate funding value. Show each next skill's invocation literally after any carrier line. For rejected replies, render the response and state what changes. Keep the complete response under 1000 words. Do not use tools.

| Case | Reply |
|---|---|
| plan-stop | 1 --amends-stop |
| loop-stop | 2 --amends-stop |
| plan-funded | 1 --fund-rounds=3 |
| plan-stop-funded | 1 --amends-stop --fund-rounds=3 |
| loop-allowance | 2 --allowance=6 |
| prose-stop | approve, stop on amends |
| digit-stop | 1, stop on amends |
| prose-funding | approve and fund 3 more rounds |
