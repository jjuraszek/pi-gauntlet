# Escalated fix rounds

**Escalate** = one escalated round; stop only on failure. Call `gauntlet_setting({ key: "escalationLoop" })` (unavailable -> stop and report). `implModel` undefined -> stop note. Otherwise re-dispatch that fix - same payload and isolation knobs (`cwd`, `worktree`, `SCOPED_TEST_COMMANDS`, status protocol, prior patch, spec anchors) plus the prior report verbatim - overriding only `model: <implModel>`, `context: "fresh"`, `async: false`; one implementer, no fan-out. Run the normal fix-round review gate (SR then CR on `Behaviour-change: yes`, else the triggering reviewer with the re-review marker). All clean -> proceed; the escalated patch supersedes the prior one at integrate. A non-`DONE` status or a dispatch error -> stop note per `stop-note.md`. A review with issues -> a funded round while one remains for the task (below), otherwise stop note; no other second dispatch. Once per loop; independent of the convergence exception. No `plan_tracker` write during escalation - keep the task `in_progress` until the wave commit or, on a stop, the human decides.

## Funded rounds

Decode the current `**Amend-grant:**` line using **Value decoding** in [Standing grants](../../brainstorming/reference/amendment-surface.md#standing-grants) before each funded dispatch. Funding is independent of ordinary fixes and the escalated round; it never supplies a missing `implModel`, another escalation grant, verify credits, or `grant_fix_rounds`. Keep the review-3 convergence exception once per loop; never re-arm it through funding.

Start one per-task ledger at zero when each task first enters Fix-Loop Rounds. Carry it across SR, behavior-change reroutes, the SR-to-CR transition, and wave repairs re-entering SR; use no wave-level allowance. Determine touched owners using the SR targeting rule (tasks whose files the fix touches). For a multi-task CR repair, spend once from every touched task; a touched exhausted owner stops the wave with that task's stop note before dispatch.

Before every funded dispatch, print `funded round <k> of <N> for task <n>` for each touched task. Apply mid-loop grants prospectively, with spent starting at zero: rounds before the token was written neither count against nor toward it. Repeat the escalated payload and isolation exactly: configured `model: <implModel>` from `escalationLoop`, `context: "fresh"`, `async: false`, one implementer, no fan-out, same `cwd`/`worktree`, task text, prior patch, spec anchors, status protocol, `SCOPED_TEST_COMMANDS`, and complete prior report verbatim. Run the same tests and same review gate: SR then CR on `Behaviour-change: yes`, otherwise the triggering reviewer with the re-review marker, trajectory block and Fix delta. Every dispatched round spends one, including failures.

| Funded outcome | Action |
|---|---|
| Errors and non-`DONE` | Count as spent and stop with the task's stop note. |
| Any funded re-review reports `STAGNANT` | Stop immediately regardless of funding remaining. |
| Issue-bearing re-review with rounds left | Dispatch the next funded round. |
| Issue-bearing re-review after N rounds | Stop with the exhausted task's stop note. |
| All reviews clean | Continue through the wave gate and commit before task completion. |

Emit the task's stop note for the funded-stop outcomes above (including `STAGNANT`) and an escalated-round failure with no funded round left. While a budget token exists, include `budget: <spent> of <N> spent` in every stop note after `Problem:` and any `Searched:` lines and before the file finding, including pre-escalation stops, missing `implModel`, and exhausted fact lookups at spent zero; use the `(not recovered on resume)` suffix below when recovery fails, and omit the line without a token. Treat this line as the only round-history exception to `stop-note.md`'s no-round-history rule.

On resume, keep header restoration unchanged; recover each task's spent count only from its `funded round <k> of <N>` transcript lines. Without recoverable lines, treat funding as exhausted; stop the next issue-bearing re-review with `budget: <N> of <N> spent (not recovered on resume)`. Treat a newly written budget token as the human refund, never a resume reset. Use no new spent carrier or handoff/resume grammar.
