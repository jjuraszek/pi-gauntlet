# eval report: spec-gate (partial run: flag-replies)

for: ea5e3924e504e35bb48fd5237ff620eb12744879cba26e73a1433a566da94029

wall: 31s

## Change

Extend flag-replies with `1 --fund-rounds=3`: append the funding token to the complete default grant on one physical line and retain Engine waves. Keep its terminal period verbatim before the appended semicolon; the first candidate dropped it on one model. Verify the amended HEAD before completing brainstorm and planning. Run only flag-replies for this change; preserve its opt-out facts and all unrelated sample records. This replay proves narrated persistence, not live git writes or target-wide coverage.

Accept `1 --amends-stop` and `2 --amends-stop` as engine approvals that persist `none` instead of the default grant. Keep waves for row 1 and loop with the settings allowance for row 2. Use the decoded table value for every approval before the existing amend, HEAD check and phase-completion handoff. Quote the full resulting grant value in narration.

Run only `flag-replies` against base `855e872a42f9cac7a795704f3e0b383b182950ab` for this edit. Its two independent opt-out cases prove narrated persistence and ordering, not live git or tracker effects. Other flag combinations, rejections and bare approval aliases remain outside this partial run. Preserve all other sample records, including the earlier four-row recommendation coverage, without claiming they were rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | improved | 7047 | plan-stop: holds -> holds (intended but unchanged); loop-stop: fails -> holds (intended change); plan-funded: fails -> holds (intended change) |
| flag-replies | github-copilot/gpt-6.1-sol | improved | 6358 | plan-stop: fails -> holds (intended change); loop-stop: fails -> holds (intended change); plan-funded: fails -> holds (intended change) |

## Feedback

- flag-replies / anthropic/claude-opus-5-5: After moved loop-stop and plan-funded as intended: `2 --amends-stop` is now accepted as a loop-engine approval persisting `**Amend-grant:** none` with `**Engine:** loop`, the settings allowance of 4 is used without being written to spec or settings, and `1 --fund-rounds=3` now persists the complete default grant with its terminal period kept before `; fund 3 fix rounds` on one physical line with `**Engine:** waves`, each followed by the audit-preserving amend, HEAD check, phase completion and correct next skill. plan-stop did not move as expected because Before already satisfied it as written: it accepted `1 --amends-stop` without clarification, persisted and quoted `none` with waves, amended, verified HEAD and invoked writing-plans, so the expected fails -> holds is really holds -> holds. To keep everything solid, keep the per-case explicit quoting of the full grant value in both the header and HEAD-check lines (in plan-funded the HEAD check says 'that exact value' rather than repeating it, which is fine but a verbatim repeat would be safer), and keep the explicit 'not written to the spec or settings' sentence for loop-stop. Also note the After gate still carries the stale trailer line 'Add "; fund N fix rounds" ... to 1 or 2 ... "; allowance N" to 4 or 5', which contradicts the new four-option flag menu; it does not affect any fact here, but removing or rewording it to the `--fund-rounds=N` / `--allowance=N` flags would prevent a model from rejecting or re-clarifying flag replies.
- flag-replies / github-copilot/gpt-6.1-sol: Before stopped all three cases before persistence, asked for the Standing grants / Value decoding text, and narrated no engine field, amend, HEAD check, or handoff, so every fact fails there. After moves all three: each case accepts the reply without clarification, narrates the exact header values (`**Amend-grant:** none` with `**Engine:** waves` or `loop`; the full default grant with its terminal period kept before `; fund 3 fix rounds` on one line with `**Engine:** waves`), stages and amends with the audit body preserved, verifies both fields in HEAD, then completes brainstorm and invokes writing-plans or loop-implementation, with the loop case using the settings allowance of 4 without writing it to spec or settings. Weak spots to tighten: the narration is conditional ('I would persist… stopping instead if…') rather than a flat statement of what was persisted and verified, and the grant value `none` is quoted only inside the field line rather than called out as the full grant value, so a stricter reader could mark those down; word the instruction to state the resulting grant value explicitly in quotes and narrate the amend and HEAD check as performed steps. Also, the After gate still carries the legacy line 'Add "; fund N fix rounds"… to 4 or 5' which references options that no longer exist in the four-row menu; removing or reconciling it would avoid confusion without affecting these facts.

exit: 0
