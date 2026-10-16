replay: continuation

## Current state
Synthetic report-runner spec: doc/specs/report-runner.md. Checklist complete; approved spec is in the spec-review amendment loop. No standing grant. No plan exists, so applying recommendations reopens no tasks and causes no phase change. No edits have been applied. The supplied menu has already been shown. Produce the next response, describing the selected spec edits and recorded choices. This text-only replay cannot execute tools; do not claim actual disk writes or commits.

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

## Recorded conversation
Assistant:
Spec amendments: 2 need your call - from the spec review; applying as recommended reopens no tasks; no phase change.

1. Share retry policy - move retry policy into one owner. Adapters currently disagree about when to retry.
   Changing retry ownership needs your architecture choice.
   Example: adapter-local retry limits -> one coordinator retry limit.
   Reviewer: changing retry ownership needs a human architecture choice
   Impact: Design / retries: adapter-owned policies -> shared policy
   A) accept - add a retry service owning all retry policies
   B) alt-1 - use the existing report coordinator for shared policy; adapters keep execution
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: B - reuse the coordinator while making retry policy consistent
2. Classify blocked execution - classify exit 126 as blocked rather than failed. Operators need to distinguish a launch problem from a report failure.
   Operator-visible status changes need your decision.
   Example: exit 126 = failed -> blocked.
   Reviewer: operator-visible status changes need a human decision
   Impact: Design / run status: exit 126 is failed -> blocked
   A) accept - classify exit 126 as blocked
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: A - a separate status identifies launch failures

Reply with one line per item: `1. A`, `2. <your own text>`. Bare `1` takes every recommendation.
Standing grant: reply "auto-apply amends" - every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Details
crosscut: Design / retries - old: each report adapter owns its retry policy -> new: a new retry service owns all retry policies
exit126: Design / run status - old: exit 126 is failed -> new: exit 126 is blocked

User:
1. B
2. keep 126 as failed, document it
