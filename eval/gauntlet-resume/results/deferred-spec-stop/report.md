# eval report: gauntlet-resume (partial run: deferred-spec-stop)

for: 6abb95989c5289609d984124b64b6eb4f724679d4b5eb485c01eaa097d1c3551

wall: 54s

## Change

Accept only current-format briefs and ledgers through the single gauntlet-resume entry point. Load loop restoration, plan restoration and plan repair from their owning references, and load coordinated rules only for multi-leg briefs. Preserve the continuation skill, phase, exact task snapshot and fresh-gate boundary for current-format brainstorm, plan, implement, verify and ship briefs. Recover current ledger returns from ledger-held attribution before tracker refresh without counting a consumed attempt twice; preserve mixed verification/conformance tasks and plan baseline upgrades. Stop old ledgers at admission with the unsupported-format sentence and recovery pointer, without conversion or tracker mutation. Selected text replays compare supplied observations against 09c9f4e1; they do not prove live reads or tracker execution. Coverage is sample-scoped, not a target-wide pass.

Stop before restoring either tracker: name the numbered gauntlet command only for an identified spec PR, point a recorded create failure to the create-only retry, and otherwise ask for the draft PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| deferred-spec-stop | anthropic/claude-opus-5-5 | improved | 14082 | routes: fails -> holds (unplanned improvement); unknown: fails -> holds (unplanned improvement); published: fails -> holds (unplanned improvement); exemption: fails -> holds (unplanned improvement); ordered: holds -> holds (held); notice: fails -> holds (intended change) |
| deferred-spec-stop | github-copilot/gpt-6.1-sol | improved | 10949 | routes: fails -> holds (unplanned improvement); unknown: fails -> holds (unplanned improvement); published: fails -> holds (unplanned improvement); exemption: fails -> holds (unplanned improvement); ordered: holds -> holds (held); notice: fails -> holds (intended change) |

## Feedback

- deferred-spec-stop / anthropic/claude-opus-5-5: After moved four facts by replacing the single `run brainstorming #N` stop with three evidence-keyed messages, and it kept the one fact Before held: both outputs stop every route at check 6 with no tracker call, dispatch or continuation. The identified-PR routes (Brief, Process-state, Seed) now print `run /skill:gauntlet #42`, where Before printed `run brainstorming #42`, or an unfilled `#N` on the routes with no PR. Bare tree now asks which draft PR contains the spec, without a numbered command and without assuming creation failed. Published brainstorm and Grant exemption now print the same retry pointer, and the `all` grant is never decoded. The weak point is the retry pointer's wording: "retry opening the draft PR at the spec approval step that published this spec" never says "option 4" or "create-only". I counted it as holding because it directs only PR creation, with no push, restart or numbered command, but a stricter reader could fail it. To make it unambiguous, have the recorded-create-failure row name the retry explicitly, for example "retry option 4 (open the draft PR only; the push already succeeded)". Keep the rest as it is: the three-row evidence split (identified PR, recorded create failure, neither), the admission-before-arming order, and the explicit statements that no tracker call, dispatch or grant line occurs.
- deferred-spec-stop / github-copilot/gpt-6.1-sol: Before printed the same placeholder line on every route ("run brainstorming #N"), so it never named /skill:gauntlet #42, never asked for the draft PR, and never pointed to the create retry; only the no-mutation fact held. After's three-way split at entry check 6 moved the other four facts: Brief, Process-state and Seed print "run /skill:gauntlet #42", Bare tree asks "which draft PR contains this spec?" with no numbered command and no assumption of a create failure, and both Published brainstorm and Grant exemption (Amend-grant all) print the same retry pointer with no numbered command, PR creation, tracker restoration or brainstorm restart. Every route still stops before any tracker call, dispatch or continuation, so nothing Before kept was lost. The one soft spot is the retry line: "retry opening the draft PR at the spec approval step that published this spec" reads as the create-only retry, but it does not name option 4 or say that the push is not repeated, so I counted it as holding on a lenient reading. To make it unambiguous, have the wording name the option explicitly, for example "choose option 4 (retry opening the draft PR only; the branch is already pushed) at the spec approval step", and keep the three branches, the single check-6 stop and the statement that the grant exemption does not bypass deferred admission exactly as they are.

exit: 0
