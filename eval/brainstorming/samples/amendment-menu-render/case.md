bundle-: skills/brainstorming/reference/spec-finalization.md
replay: continuation

## Current state
Synthetic report-runner spec: doc/specs/report-runner.md. Checklist complete; approved spec is in the spec-review amendment loop. No standing grant. No plan exists, so applying recommendations reopens no tasks and causes no phase change. No edits have been applied. Produce only the human-batch menu; do not call tools.

## Prepared batch
Trigger: the spec review. Both items escalated. No reviewer-cleared items.

1. handle: crosscut; title: Share retry policy
Location: Design / retries. Old: each report adapter owns its retry policy. Accept: a new retry service owns all retry policies. Alternative alt-1: the existing report coordinator owns the shared retry policy; adapters keep execution.
What: move retry policy into one owner. Why: adapters currently disagree about when to retry.
Example: adapter-local retry limits -> one coordinator retry limit.
Evidence: adapters/alpha.ts:18 uses two retries; adapters/beta.ts:22 uses four.
Reviewer: changing retry ownership needs a human architecture choice
Reviewer result: crosscut: escalate - changing retry ownership needs a human architecture choice - probed: adapter retry limits - different limits
Recommended: alt-1, because using the existing coordinator avoids a new service while keeping policy consistent.

2. handle: exit126; title: Classify blocked execution
Location: Design / run status. Old: exit 126 is failed. Accept: exit 126 is blocked. No alternatives.
What: classify exit 126 as blocked rather than failed. Why: operators need to distinguish a launch problem from a report failure.
Example: exit 126 = failed -> blocked.
Evidence: synthetic launch test returns 126 before report execution.
Reviewer: operator-visible status changes need a human decision
Reviewer result: exit126: escalate - operator-visible status changes need a human decision - probed: launch test - exit 126 before execution
Recommended: accept, because a separate status identifies launch failures.
