for: 57da92a3615a49b9ef69c9d952aa3b1012b2771ccd68458d4447517c518bfdfb

## Change

Use one implementer-to-spec-review chain per all-DONE wave on pi-cohort >=7.4.0, with separate code review after integration and scoped tests. Apply outputSchema only to implementers; read SR verdicts from the prose Verdict: line in their known output: reports. Initial chained SR tasks disable pi-cohort acceptance (level none with a reason); snapshot re-reviews and code review keep inferred acceptance. Exercise chain-wave-dispatch and chain-stop-blocked; preserve patch-review-snapshot as the pi-cohort 7.3.1 fallback sample. Use snapshots for every other pre-integration review, never re-chain after stop/error, and fail closed on unmaterialized trees. Keep integrated and sequential reviews unchanged. Preserve TRAJECTORY: STAGNANT, DIVERGING, max severity Critical, one escalation per loop, and the plan_tracker lifecycle through wave commit. This is behavior-changing conformance evidence.

## Expected to move

- chain-wave-dispatch/single-chain: fails -> holds - The supported runtime combines initial implementation and spec review in one chain.
- chain-wave-dispatch/spec-gap-completes: fails -> holds - The chain ends at spec review; NEEDS_REWORK completes it without an SR stop condition.
- chain-stop-blocked/status-routing: fails -> holds - Apply D1's identity-matched session-artifact recovery and unavailable-artifact fallback, and D3's independent failure diagnosis alongside exit-0 stop statuses.
- chain-stop-blocked/never-rechain: fails -> holds - Apply D3's one-chain-per-wave boundary and retain successful siblings through plain recovery dispatches and wave commit.
