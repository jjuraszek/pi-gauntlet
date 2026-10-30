for: 658b25bd18b8c5a7d37f535aec94d4795c5aeb89685448d6d26cd91af135a207

## Change
Localize implement amendments to affected entries and historical evidence, preserving staged repairs during no-execution maintenance. Attribute retained failures by command/assertion/path plus corresponding repair evidence, not task membership. Preserve semantic inventory through failed apply and retry; keep grant, redraw and unrelated-regression stops and parent stamping. The local-amend-revalidation sample exercises these distinctions. Full model reports/results remain parent verification-owned.
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Expected to move
- local-amend-revalidation/attribution: fails -> holds - Distinguish repaired template rename from unrelated auth regression.
- local-amend-revalidation/staged: fails -> holds - Preserve declared staged repair without baseline execution.
- local-amend-revalidation/repeated: fails -> holds - Authorized intermediate evidence does not trigger refresh or new consent.
- local-amend-revalidation/semantic: fails -> holds - Reopen only semantic work changes after parent stamp.
- one-review-per-wave/protocol: fails -> holds - one integrated review follows the green gate, including doc-only waves.
- direct-report-read/protocol: fails -> holds - bounded direct reads replace report relay workers.
- repair-on-top/protocol: fails -> holds - repairs use committed current-tree snapshots and delta-only integration.
- apply-failure-rebuild/protocol: fails -> holds - only delta apply failures trigger automatic rebuild.
- escalation-same-tree/protocol: fails -> holds - escalation keeps current tree without requiring a grant.
