# Integrated Wave Reviewer Prompt Template

Dispatch one wave-reviewer after the wave gate is green, including doc-only waves.

```text
planPath: <absolute plan>
anchor: ### Task N:
anchors: <use instead of anchor for the wave union>
Spec: <absolute authoritative home spec>
Leg: <owning leg>
Rules: <combined task/leg Rules resolved in owning checkout>
Implementer reports: <saved paths>
BASE_SHA: <fixed WAVE_BASE_SHA>
HEAD_SHA: WORKTREE
SCOPED_TEST_COMMANDS: <wave manifest tests union; none for docs>

Read selected task sections and their Spec:, Files:, Tests: and Rules: yourself. Treat the spec as the sole authority. Review the integrated whole diff, including additions. Return clause rows met | unmet | out-of-scope with evidence before findings; any unmet or out-of-scope yields at least FIX_FIRST. Emit structured output matching WAVE_VERDICT_SCHEMA and the saved report. On unreadable anchors return REJECT with anchorUnreadable and Reasoning: anchor unreadable: <path>#<anchor>.
```

For re-reviews append the prior saved path under `## Previous review report (re-review trigger)` and `## Fix delta` with tree-before/tree-after object IDs. Run `git diff --binary <tree-before> <tree-after>` in the integrated checkout yourself to inspect only the repair delta; retain BASE_SHA for the whole-wave review. Never substitute a worker commit range or a working-tree diff for the Fix delta tree pair.

## Re-review: trajectory verdict

Include the following in the reviewer's task text on every re-review, after
the prior review report path under a
`## Previous review report (re-review trigger)` heading.
Read the saved report yourself; retain the supplied `## Fix delta` block:

If your task contains a "Previous review report (re-review trigger)" section
and you found issues, append exactly one more line after the verdict footer; make it the true final line of the report:

TRAJECTORY: CONVERGING (<n_prev> -> <n_now>, max severity <X>)
TRAJECTORY: DIVERGING
TRAJECTORY: STAGNANT (repeat of: <finding>)

Pick the first label that applies, in this order:

1. STAGNANT: a previous Critical or Moderate finding survives materially unchanged - name it.
   (e.g. the same unchecked error path flagged last round is still unchecked)
2. DIVERGING: <n_now> >= <n_prev>, or the fix introduced a new Critical or Moderate finding.
   (e.g. 3 findings fixed but the fix broke an import: DIVERGING, not CONVERGING)
3. CONVERGING: otherwise - the Critical/Moderate count fell, no new Critical or
   Moderate appeared, and every surviving Critical or Moderate was materially improved.

<n_prev>/<n_now> count Critical and Moderate findings only; Minors - ride-along
Minors declined or unchanged, and `(outside fix delta)` downgrades alike - never
move the `TRAJECTORY:` line. <X> is the highest remaining severity. For this line the severity set is
exactly Critical/Moderate/Minor, regardless of the vocabulary used elsewhere in
your report.

The orchestrator dispatches one extra fix only when this line says CONVERGING
without "max severity Critical" - be accurate, not generous.

If you found no issues, report success as usual and omit this line.
First reviews (no previous-report section) omit this line.
