# eval report: gauntlet-resume (partial run: deferred-spec-stop)

for: 6abb95989c5289609d984124b64b6eb4f724679d4b5eb485c01eaa097d1c3551

wall: 35s

## Change

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before tracker refresh without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations against 09c9f4e1; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

For a deferred spec, print the numbered gauntlet command before restoring a tracker so the user can open the PR in a fresh session.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| deferred-spec-stop | anthropic/claude-opus-5-5 | improved | 7514 | routes: holds -> holds (held); published: holds -> holds (held); exemption: holds -> holds (held); ordered: holds -> holds (held); notice: fails -> holds (intended change) |
| deferred-spec-stop | github-copilot/gpt-6.1-sol | improved | 10643 | routes: holds -> holds (held); published: holds -> holds (held); exemption: holds -> holds (held); ordered: holds -> holds (held); notice: fails -> holds (intended change) |

## Feedback

- deferred-spec-stop / anthropic/claude-opus-5-5: None of the four facts moved: in both outputs every route reads Engine: deferred at entry check 6, prints the handoff-only stop and ends with no tracker call, dispatch into a phase, grant line or continuation. The After wording delivered the Change visibly, since the printed line now names the explicit entry and resolved number (`run /skill:gauntlet #42` instead of `run brainstorming #42`), and the Published brainstorm route still stops before `start brainstorm` with #42 taken from the known subject when no PR header exists, without repairing the PR or restarting brainstorm. The Grant exemption route still stops with `all` never decoded. To keep this stable, keep the sentence that deferred-header admission runs before grant decoding, the approval question and any arming call, and keep the explicit statement that the brainstorm-stage push-succeeded/PR-create-failed case stops on the deferred header rather than the ordinary gate. One small risk: After's lists of calls not reached (`start brainstorm`, `plan_check`, `skip implement`, `start verify`, `init`) are clearly explanatory, but they are less complete in the verify and seed routes than Before's, so wording that says 'no tracker call of any kind' in the stop rule would protect the ordered fact without relying on enumerations. After also dropped the offending path/line report that Before printed after each stop; if the skill still prescribes it, restore that wording.
- deferred-spec-stop / github-copilot/gpt-6.1-sol: None of the four facts moved: in both outputs every route reads the header at entry check 6, sees Engine: deferred, prints the handoff-only stop line and ends with no tracker call, dispatch, PR repair, brainstorm restart or continuation, and the Amend-grant: all variant stops the same way. The only visible effect of the After wording is the stop line itself, which now names the explicit entry and PR number (`run /skill:gauntlet #42` instead of `run brainstorming #42`), plus an explicit step saying the stop comes before grant decoding and that the known PR subject is used when no PR header exists. That delivers the Change without cost to these facts. To keep them safe, keep the wording that places deferred-header admission before grant decoding and before any tracker restoration, keep the sentence that the brainstorm-stage grant exemption does not bypass it, and keep forbidden actions phrased as things not done rather than as calls. One fragility present in both outputs: the line "I'm using the gauntlet-resume skill to continue an interrupted flow." is printed after the stop line, which a stricter reader could take as a preamble or continuation after the stop; wording that prints the announcement before the stop line, or suppresses it on a deferred stop, would remove that ambiguity.

exit: 0
