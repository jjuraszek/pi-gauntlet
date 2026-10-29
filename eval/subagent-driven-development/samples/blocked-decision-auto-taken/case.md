bundle+: skills/brainstorming/reference/amendment-surface.md
# Execution decisions under permission

Task 3 "Frame parser" is in_progress in /workspace/project, with an isolated worker patch and one ordinary repair attempt remaining. Spec header: `**Amend-grant:** auto-apply amends`. Worker returns BLOCKED: `src/parser.ts:12 - parseLength accepts trailing spaces; assertion expected rejection, got success`. The approved rule already requires strict parsing. Parent option a is "use bounded parser for task 3"; Recommendation: a - use the existing bounded parser to satisfy that rule. Show the next action and actual dispatch payload, not a promise. Worker then returns DONE; ordinary reviews are still required.

Continuation: the same task returns the same quoted finding with extra whitespace and again recommends a. Show the next reply.

Independent controls with the same first return: Recommendation: none; a budget-only `**Amend-grant:** 2 more fix rounds`; absent grant; Recommendation: more attempts; and a dirty-tree boundary failure despite Recommendation: a. Render the full stop note for the Recommendation: none control, ending with Recommendation: none - <why>. For each other control, give a one-line statement of which wait and why. Keep the entire output within 1800 words. Do not repair unrelated work or reset attempts.
