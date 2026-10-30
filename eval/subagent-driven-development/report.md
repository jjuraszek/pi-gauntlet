# eval report: subagent-driven-development (partial run: blocked-resume-tree)

for: 7095729dd21ac87cd7b6a6bf004fc83d420452d17a8487477a8ce0c4f0ad1e4e

wall: 58s

## Change

Localize implement amendments to affected entries and historical evidence, preserving staged repairs during no-execution maintenance. Attribute retained failures by command/assertion/path plus corresponding repair evidence, not task membership. Preserve semantic inventory through failed apply and retry; keep grant, redraw and unrelated-regression stops and parent stamping. The local-amend-revalidation sample exercises these distinctions. Full model reports/results remain parent verification-owned.
Replace per-task spec and per-wave code review with one post-gate integrated wave review. Read unresolved child reports directly once at limit 300 with one compact retry; retain delegated source/spec/plan reads. Repair on the current integrated tree, using committed clean snapshots and delta-only apply for isolated waves, direct edits in-place. Rebuild only after repair delta apply failure; preserve siblings and original wave base. Fold escalation, convergence, funding and transcript-only recovery into one transition table. These are behavior-changing instructions; parent verification owns model results.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| blocked-resume-tree | anthropic/claude-opus-5-5 | improved | 25176 | protocol: fails -> holds (unplanned improvement) |
| blocked-resume-tree | github-copilot/gpt-6.1-sol | error |  |  |

## Feedback

- blocked-resume-tree / anthropic/claude-opus-5-5: Before routes the BLOCKED answer through a delegated lookup, redispatches in /workspace/project with the sibling additions intact, keeps anchors and wave-union scoped tests, and uses no relay child, but it never counts the BLOCKED as a failure (no counter increment, no mention of the attempt ledger) and it rewrites the repair payload rather than appending the answer to the unchanged one, so the fact's 'count failure / append to unchanged payload' clauses are not met. After fixes both: it names the transition-table row, increments failed[1], re-dispatches the identical payload with an appended '## Answer to your BLOCKED question' section, explicitly refuses worktree removal / re-snapshot / Rebuild, consumes only answer/evidence, and keeps anchors and scoped tests. The one wording hazard in After is the dispatch block itself: it says the in-place existing repair tree is /workspace/project 'with no worktree:' yet the carrier sets `worktree: true` and step 2 removes a repair worktree and applies a delta, which contradicts the 'same current tree, direct edits in-place' intent for a tree that still holds uncommitted sibling additions. To keep this fact robustly, make the carrier shape conditional on the wave mode (omit `worktree: true` and the delta-apply/remove steps when RP_TREE is /workspace/project; use them only when a committed clean snapshot exists), and keep the scoped-test placeholder as the wave union so sibling regressions remain visible during the gate.
- blocked-resume-tree / github-copilot/gpt-6.1-sol: error - github-copilot API error (429): 429 quota exceeded

exit: 1
