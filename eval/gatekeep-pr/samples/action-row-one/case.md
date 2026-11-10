# Case: action-row-one

## Data

Render three independent action menus in the order below. Use the supplied observations as the completed step-5 assessment for each case. This case overrides replay.md's initial/final simulation: render only the three obstacle reports, without simulating a pick or running a tool. Label each case outside its report so its gate line remains the report's first line. Keep each recommendation's reason immediately above Pick one. Do not repair, post, push, approve or watch anything.

Shared record for all three cases: PR 642 in sample/forge-kit, OPEN and non-draft; viewer mira is the human author, WRITE permission; head 9c1e4f2 is pushable; helpers are present; course deliver; maxFixRounds 5. There are zero blockers, zero nits, no drafted replies, no contract proposal and no available body or source repair. Delivers: make health endpoint respond with the build version; Ticket APP-91 OK and README OK. Approve is unavailable on an own PR. The assessment is complete, so switching to assess only reposts the same findings, not new evidence.

### Case A: pending binding CI can progress

The first watch window expired. Mergeability is MERGEABLE. The binding test_unit check is still running in run 7001 on the assessed head; no failure has occurred, no approval or external prerequisite is missing. Verification source is pending. Repair rounds used 1 of 10; sync used 0 of 10. Another watch window is runnable and can observe the check finishing. Deliver is offered as exactly one additional watch window, with neither cap extended. Merge is withheld until the binding check completes.

### Case B: BLOCKED without bypass cannot progress

Both binding checks test_unit and build_image are green in run 7001 on the assessed head. Mergeability is BLOCKED after refresh; reviewDecision is REVIEW_REQUIRED. The active ruleset requires an independent review. Viewer has WRITE, no admin or matching bypass actor. No repair, sync, watch or workflow approval can satisfy that rule. A different reviewer has not approved. Deliver remains visible only as a conditional retry after the failed prerequisite changes, never an automatic sync or a current way to change the outcome.

### Case C: unchanged prerequisite at the cap cannot progress

Repair rounds used 10 of 10; sync used 0 of 10. CI cannot start the binding test_unit job because workflow approval is required from a repository maintainer; source is pending. The viewer lacks workflow-approval permission. The missing approval is the same retained failed prerequisite as the last attempt and has not changed. The cap extension offered by deliver adds 10 to each cap, but cannot supply that approval. Continuing would immediately re-exit without progress. No local repair or available non-stop action can change the outcome.
