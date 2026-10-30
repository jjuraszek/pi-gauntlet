for: f9718f4f15a9a795009ad6dc817772b200c050ef5ddcf3a0daad1027fb6798b4

## Change
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Expected to move
- one-review-per-wave/protocol: fails -> holds - one integrated review follows the green gate, including doc-only waves.
- direct-report-read/protocol: fails -> holds - bounded direct reads replace report relay workers.
- repair-on-top/protocol: fails -> holds - repairs use committed current-tree snapshots and delta-only integration.
- apply-failure-rebuild/protocol: fails -> holds - only delta apply failures trigger automatic rebuild.
- escalation-same-tree/protocol: fails -> holds - escalation keeps current tree without requiring a grant.
