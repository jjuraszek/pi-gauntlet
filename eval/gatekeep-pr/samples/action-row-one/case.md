# Case: action-row-one

## Data

Render seven independent action menus in the order below. Use the supplied observations as the completed step-5 assessment for each case. This case overrides replay.md's initial/final simulation: render only the seven reports and action menus, without simulating a pick or running a tool. Label each case outside its report so its gate line remains the report's first line. Keep each recommendation's reason immediately above Pick one. Do not repair, post, push, approve or watch anything.

Shared record unless a case overrides it: PR 642 in sample/forge-kit, OPEN and non-draft; viewer mira is the human author, WRITE permission; head 9c1e4f2 is pushable; helpers are present; course deliver; maxFixRounds 5. There are zero blockers, zero nits, no drafted replies, no contract proposal and no available body or source repair. Delivers: make health endpoint respond with the build version; Ticket APP-91 OK and README OK. Approve is unavailable on an own PR. The assessment is complete, so switching to assess only reposts the same findings, not new evidence.

### Case A: pending binding CI can progress

The first watch window expired. Mergeability is MERGEABLE. The binding test_unit check is still running in run 7001 on the assessed head; no failure has occurred, no approval or external prerequisite is missing. Verification source is pending. Repair rounds used 1 of 10; sync used 0 of 10. Another watch window is runnable and can observe the check finishing. Deliver is offered as exactly one additional watch window, with neither cap extended. Merge is withheld until the binding check completes.

### Case B: BLOCKED without bypass cannot progress

Both binding checks test_unit and build_image are green in run 7001 on the assessed head. Mergeability is BLOCKED after refresh; reviewDecision is REVIEW_REQUIRED. The active ruleset requires an independent review. Viewer has WRITE, no admin or matching bypass actor. No repair, sync, watch or workflow approval can satisfy that rule. A different reviewer has not approved. Deliver remains visible only as a conditional retry after the failed prerequisite changes, never an automatic sync or a current way to change the outcome.

### Case C: unchanged prerequisite at the cap cannot progress

Repair rounds used 10 of 10; sync used 0 of 10. CI cannot start the binding test_unit job because workflow approval is required from a repository maintainer; source is pending. The viewer lacks workflow-approval permission. The missing approval is the same retained failed prerequisite as the last attempt and has not changed. The cap extension offered by deliver adds 10 to each cap, but cannot supply that approval. Continuing would immediately re-exit without progress. No local repair or available non-stop action can change the outcome.

### Case D: own PR has a safe repair

Both checks are green and mergeability is MERGEABLE. One blocker: the health endpoint returns a hardcoded version instead of the build version (src/health.ts:8); health_version in tests/health.test.mjs failed locally. A drafted source repair reads the existing build-version value; viewer mira owns this PR and can push it. Repair rounds used 0 of 10; sync used 0 of 10. No missing external prerequisite. Render initial, not final.

### Case E: another author's PR has a body-only blocker

Author robin; viewer mira is a requested reviewer with WRITE. Checks are green and mergeability is MERGEABLE. The only blocker is the description's contradicted claim "Reports uptime", while the endpoint returns only the build version (src/health.ts:8). Drafted description preview: replace "Reports uptime" with "Reports the build version". No source repair, nit or contract proposal. Editing this body with consent resolves the blocker; head_pushable is true and deliver is offered, so recommend deliver for this repair without an author decision; render initial.

### Case F: another author's blocker needs the author

Author robin; viewer mira is a requested reviewer with READ and cannot push source changes. Checks are green and mergeability is MERGEABLE. One blocker: missing version field in src/health.ts:8; health_version in tests/health.test.mjs failed locally. No body-only fix or available source repair, but posting that finding gives the author the concrete fix. Render initial, with assess recommended rather than unavailable deliver or automatic stop.

### Case G: draft contract proposal

Own PR; checks are green and mergeability is MERGEABLE. The approved spec requires the build version at /health; the PR deliberately returns it at /status, so that requirement is deviates and blocks normal merge. A source-checked contract proposal is drafted at /tmp/gate-contract.md to change the endpoint to /status. No source or body fix, no permission to auto-change the approved spec. The proposal is pending in the retained record. Render contract-exception with preserve contract recommended, plus accept contract change and stop; execute nothing yet.
