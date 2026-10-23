# eval report: shape-ticket pre-behavior baseline

for: 5560958f357cc72a255639c7ba034cf1ac66d0a468a554dceda279d40d418c48

## Evidence boundary

Seeded against audit-reference addition 5b97a46a7b0ef331e72077362e92eff4a59e1b77 with the behavior skill unchanged. This is preparation evidence, not a candidate comparison or a new claim against historical base 555a5bb. No judge or candidate run was performed. Existing cache records were refreshed by the runner without changing legacy bundles or expected facts.

The first baseline-only run reported `baseline seeded (replay 14, wall 164s)`. Clarifying snapshot substitutions in audit-byte-lock and supplying the current repository in audit-grounding invalidated four cells; the second run reported `baseline seeded (replay 4, wall 52s)`. All 20 records contain two `ok` replies; every reply stays under the global 1600-word cap and every new multi-checkpoint reply stays under 1200 words.

## Reviewed new sample outcomes

These are direct human-style inspection notes, not machine-judge verdicts. The fact definitions remain the authority for the subsequent comparison.

| sample | observed baseline behavior |
|---|---|
| batch-repair | Both disclose ABC-102 during initial preparation. One keeps its hard stop local; the other explicitly blocks every write and leaves ABC-103 stopped. Both deduplicate refs and preserve independent count/order/receipt results. |
| audit-repo-fit | Both attribute the retained wrapper idea and carry the original to a Reporter note; cited AC-only correction does not introduce a question. |
| scenario-best-effort | Both keep feature filing open with a none footer and preserve the defect expectation of 12 rows rather than replacing it with zero. |
| audit-quiet-noop | Both leave the conforming body unchanged without roast, gate or write; missing/empty audit remains unavailable rather than forcing repair. |
| audit-byte-lock | Clarified snapshots produce a conformance-only byte match; substantive scenario repair normalizes rows and the old note does not swallow a new proposed note. |
| audit-dispatch | Both describe 8+1 file-only task chunks and numeric controls. Both stop on unexpected async without polling or relaunch. The first reply treats a Max 8 rejection as per-ticket audit unavailability and continues on the ordinary path, rather than classifying it as a dispatch recipe bug; the second reports rejection and zero results without recovery. |
| audit-grounding | Both retain the contradicted reporter text verbatim in a proposed note and distinguish grounded/not-found/unobservable sibling branches; native fallback is simulated, not executed. |

Only directly observed failures were added to intended moves: first-gate disclosure, ticket-local stops, and Max 8 rejection classification. Foreground async stopping already holds in both saved replies. Other facts remain guards or unclassified until the post-integration judge run.

## Actual reply word counts

Columns follow each record's stored output order: anthropic/claude-opus-5-5, then github-copilot/gpt-6.1-sol.

| sample | first model | second model |
|---|---|---|
| audit-byte-lock | 819 | 898 |
| audit-dispatch | 1035 | 861 |
| audit-grounding | 888 | 845 |
| audit-quiet-noop | 534 | 131 |
| audit-repo-fit | 671 | 708 |
| batch-repair | 911 | 919 |
| bounded-prose | 628 | 548 |
| bug-source-ack | 277 | 245 |
| closed-concern-additions | 695 | 496 |
| displaced-detail | 960 | 597 |
| domain-reader | 688 | 401 |
| member-file-only | 860 | 728 |
| menu-after-numbered-findings | 497 | 428 |
| multi-repo-groups | 534 | 182 |
| repair-overflow | 1470 | 1227 |
| repair-source | 518 | 390 |
| scenario-best-effort | 854 | 804 |
| source-carried | 263 | 171 |
| source-missing | 259 | 167 |
| venue-stripped | 428 | 192 |
