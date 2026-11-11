# Case: final-row-one

## Data

Render four independent final reports and menus in the order below. Use these observations as the completed step-5 assessment. Override replay.md's command narration and initial/final simulation: render only these four final reports, without simulating a pick or running a tool. Label each case outside its report so its gate line remains the report's first line. Tag row 1 [recommended] in all four menus, including the admin-override case. Do not repair, post, push, approve or merge anything.

Shared record: PR 642 in sample/forge-kit, OPEN and non-draft; viewer mira; head 9c1e4f2 is pushable; helpers are present; course deliver; maxFixRounds 5. There are zero blockers, zero nits, no drafted replies and no contract proposal. Delivers: make the health endpoint respond with the build version; Ticket APP-91 OK and README OK. Both binding checks test_unit and build_image are green in run 7001 on the assessed head. Verification source is ci. Review is complete with no placeholder; base main is unchanged, and head is current with base. Repair rounds used 1 of 10; sync used 0 of 10. Merge policy is squash. All merge prerequisites other than the permissions and merge-state facts specified below hold. Each case is at a readiness exit, not an assess-terminal exit.

### Case A: own PR with ordinary merge

The human author is mira, viewer.is_author true and author_is_bot false. Viewer has WRITE permission. merge_state_status is CLEAN, mergeable is MERGEABLE, reviewDecision is APPROVED. Merge is available through the ordinary path. Approve is unavailable on an own PR.

### Case B: another author's PR with ordinary merge

The author is robin, viewer.is_author false and author_is_bot false. Viewer has WRITE permission. merge_state_status is CLEAN, mergeable is MERGEABLE, reviewDecision is APPROVED. Both merge and approve are available.

### Case C: another author's PR with admin override

The author is robin, viewer.is_author false and author_is_bot false. Viewer has ADMIN permission. merge_state_status is BLOCKED after refresh, mergeable is MERGEABLE, reviewDecision is REVIEW_REQUIRED. The active ruleset allows administrators to bypass it and the refreshed digest records bypass_eligible true. All CI evidence is green and binding. Merge is available only through the bypass path and approve is available.

### Case D: another author's PR without merge permission

The author is robin, viewer.is_author false and author_is_bot false. Viewer has READ permission and can submit a review. merge_state_status is CLEAN, mergeable is MERGEABLE, reviewDecision is APPROVED. Merge is unavailable solely because the viewer lacks WRITE; approve is available.
