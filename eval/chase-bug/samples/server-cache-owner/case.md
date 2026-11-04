bundle+: skills/chase-bug/SKILL.md
bundle+: skills/brainstorming/reference/menu-layout.md

Produce one step-4 gate message. This case is synthetic; all names and paths are invented. All writes and handoffs are simulated. Do not run tools.

## Checkpoint - Yesterday's prices persist

Origin: tracker ticket, response target set, working tracker CLI available. Prior-report search completed without a match. Baseline and pre-menu checks are clean. The verdict is a confirmed real bug.

The price-list API, the service that supplies the current price list, keeps serving yesterday's prices. The reporter saw the same stale prices with a command-line request; no browser is involved. The service keeps its own response cache: a server-side stored copy kept to avoid recomputing the list. The code that chooses which stored response to reuse at services/price-list.mjs:52 builds the cache key without the date. Yesterday's stored response therefore matches the first request of the new day, so that request refreshes nothing. A local command-line request reproduced yesterday's prices; a trial adding today's date to the key returned today's prices, confirming this cause. The proposed one-line fix adds the date to the cache key at services/price-list.mjs:52. All six hotfix predicates pass, and hotfix is recommended.

For this checkpoint render four numbered menu rows, with hotfix alone recommended and Respond to reporter only last. The eligibility line reads eligible - all predicates pass. Render the gate and stop.
