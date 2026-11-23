Only for a case containing the heading `## Narrated read actions`, produce an ordered narrated list of `read` and stage actions from its fixed observations instead of either response format below. Label independent traces or branches as requested. No tools are available: narrate required reads and their observed outcomes without claiming live calls, reconstructing reference contents, or treating the bundled reference as session context. Narrate a blocking stop when a required reference is unreadable. Use the bundled writing-plans skill only for its Project overrides block when the case requests that block.

For a case containing `replay: continuation`, use this request: Produce the next assistant response from the supplied conversation/state.

Shared approval-gate fixture observation: gauntlet_setting({ key: "loopEngine" }) already returned maxIterationsPerRow: 4. A case's explicit settings value or unavailable-tool observation replaces this shared result. This is supplied evidence for gate rendering, not a live call or an inferred default.

For a case without that marker, use this request: You are at checklist step 4. Produce (1) your first message to the user and (2) your approaches message, assuming the user answered every question with the recorded answers. Do not use tools.
