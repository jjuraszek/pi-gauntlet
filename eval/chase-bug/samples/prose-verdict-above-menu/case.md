bundle+: skills/brainstorming/reference/menu-layout.md
bundle+: skills/chase-bug/SKILL.md

Produce one response with two independent checkpoints. All writes and handoffs are simulated; do not run tools.

## Checkpoint 1 - Generate the gate

You are at step 4, Verdict menu. Origin: free text, response target: none. The tracked baseline and checkpoint 2 are clean. Prior-report search completed without a match. A local repro and falsification test confirmed a real bug: `/widgets/` returns 404 instead of 200 because `src/router.ts:88` compares paths without normalization. All six hotfix predicates pass; the fix is small and safe. Generate the gate and stop for a pick.

## Checkpoint 2 - Draft to the reporter

Independently continue a GitHub-issue origin with its response target set. `gh` is available and the resolved channel is `gh issue comment`. Verdict: cannot-replicate. The documented reproduction attempts in Chrome and Firefox with clean profiles both render the page successfully. The report lacks the reporter's browser and version. The human picked Respond to reporter. Show the draft and its `send it` confirmation; do not push.
