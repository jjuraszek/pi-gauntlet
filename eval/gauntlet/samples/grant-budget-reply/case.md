replay: continuation

## Current state
Synthetic report-runner spec: doc/specs/report-runner.md. The spec is committed with **Amend-grant:** none; its council audit is in the commit body. The user is at the spec approval gate. No plan exists. This text-only replay cannot execute tools: narrate intended persistence and routing, without claiming actual disk writes or commits. Produce two independent next responses labelled A and B, each starting from this same state and gate.

The committed acceptance section has one in-scope ticket row: `The runner writes a daily summary and emails it to the owner.` The observed context is 12.0% and the settings allowance is 4.

## Gate already shown
gauntlet: gate=brainstorm/user-review-gate recommended=1
Report runner writes a daily summary.
Spec written and committed to doc/specs/report-runner.md (worktree: <worktree>).
Scope cuts: none
Council: 1 applied, 0 deferred, 0 rejected

1 - plan engine: write a task plan, then implement it in reviewed waves. [recommended]
- `--amends-stop`: stop for my review before a blocked task changes the spec's scope, acceptance criteria, or contracts (default: apply it and list it at the finish gate; a redraw always stops).
- `--fund-rounds=N`: fund up to N extra fix rounds per task after its escalated round (default: stop and ask there).

2 - loop engine: skip the plan and iterate a fresh implementer over the acceptance criteria.
- `--amends-stop`: stop for my review before the loop rewords or cuts a row it is stuck on (default: apply it and list it at the finish gate; a redraw always stops).
- `--allowance=N`: attempts per row before the loop stops and asks (default: 4).

3 - council explanation: show the council audit, then return to this gate without approving.

4 - draft PR: approve the spec's content only and publish it as a draft PR; to continue, start a fresh session and run `/skill:gauntlet #<N>` there.

Recommended: 1 - row 1 "The runner writes a daily summary and emails it to the owner." commits to writing a summary, emailing it; a plan splits it into tasks.

Or tell me what to change in the spec.

## Independent observations
A: The user replies `1 --fund-rounds=3`.
B: The user replies `fund 3 fix rounds` alone.
