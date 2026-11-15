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

This is a new ticket spec, not a PR subject. The summary was read successfully; the brief wording above is complete. The pre-read status ends with `Context: 12.0% of window`. The settings observation supplies maxIterationsPerRow: 4. The committed spec header currently has `**Amend-grant:** none` and no engine field. All four rows are available; row 2 loop engine is the recommendation in the marker, tag and reason.

## User reply

replay: continuation

The gate was rendered in the preceding turn; now handle these independent replies, not a conversation sequence. Output only a common approval recipe and case-ID continuations, with no briefing or gate menu. State the shared commit, HEAD check and phase-completion sequence once, then apply that sequence to each accepted case after its exact header fields, decoded amendment permission and separate funding value. Show each next skill's invocation literally after any carrier line. Quote the full default grant G once as a shared exact header value for every granting branch, including its final period; show funded G with its suffix in full once. For rejected replies, state once that every rejection leaves the gate waiting without writes or commits, then give exactly one clarifying question per case. Keep the complete response under 1200 words. Do not use tools.

| Case | Reply |
|---|---|
| bare-plan | 1 |
| bare-loop | 2 |
| approve-loop | approve |
| approve-stop | approve --amends-stop |
| label-funded | plan engine --fund-rounds=3 --amends-stop |
| plan-stop | 1 --amends-stop |
| loop-stop | 2 --amends-stop |
| plan-funded | 1 --fund-rounds=3 |
| plan-stop-funded | 1 --amends-stop --fund-rounds=3 |
| loop-allowance | 2 --allowance=6 |
| loop-stop-allowance | 2 --allowance=6 --amends-stop |
| wrong-plan | 1 --allowance=6 |
| wrong-loop | 2 --fund-rounds=3 |
| council-flag | 3 --amends-stop |
| draft-flag | 4 --amends-stop |
| approve-wrong | approve --fund-rounds=3 |
| label-wrong | plan engine --allowance=6 |
| zero | 1 --fund-rounds=0 |
| negative | 2 --allowance=-1 |
| decimal | 2 --allowance=1.5 |
| unsafe | 1 --fund-rounds=9007199254740992 |
| missing | 2 --allowance |
| duplicate | 1 --amends-stop --amends-stop |
| unknown | 1 --other |
| flag-alone | --amends-stop |
| budget-alone | fund 3 fix rounds |
| old-loop | 2; allowance 6 |
| old-plan | plan engine, fund 3 fix rounds |
| old-approve | approve; allowance 6 |
| old-more | 1, 3 more fix rounds |
| removed-five | 5 |
| removed-six | 6 |
| granting-words | 1 apply every amend |
| prose-stop | approve, stop on amends |
| digit-stop | 1, stop on amends |
| prose-funding | approve and fund 3 more rounds |
