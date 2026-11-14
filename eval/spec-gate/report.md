# eval report: spec-gate (partial run: flag-replies)

for: 17f403466c54029a9972fbf875f673a4dedf4f10a94ea837ae3c0985cbccc1be

wall: 6s

## Change

Accept `1 --amends-stop` and `2 --amends-stop` as engine approvals that persist `none` instead of the default grant. Keep waves for row 1 and loop with the settings allowance for row 2. Use the decoded table value for every approval before the existing amend, HEAD check and phase-completion handoff. Quote the full resulting grant value in narration.

Run only `flag-replies` against base `855e872a42f9cac7a795704f3e0b383b182950ab` for this edit. Its two independent opt-out cases prove narrated persistence and ordering, not live git or tracker effects. Other flag combinations, rejections and bare approval aliases remain outside this partial run. Preserve all other sample records, including the earlier four-row recommendation coverage, without claiming they were rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | improved | 6050 | plan-stop: fails -> holds (intended change); loop-stop: fails -> holds (intended change) |
| flag-replies | github-copilot/gpt-6.1-sol | improved | 5745 | plan-stop: fails -> holds (intended change); loop-stop: fails -> holds (intended change) |

## Feedback

- flag-replies / anthropic/claude-opus-5-5: Both facts moved as intended: Before treated `--amends-stop` as an unrecognized token, asked a clarifying question and wrote nothing, while After accepts `1 --amends-stop` and `2 --amends-stop` as approvals, persists `**Amend-grant:** none` with `**Engine:** waves` or `**Engine:** loop`, stages and amends the spec commit keeping the council audit, checks both values in HEAD, completes brainstorm and hands off to writing-plans or loop-implementation with the settings allowance of 4 left unwritten. The narration quotes the grant as `none` in both cases, which satisfies the full-value requirement; keep that explicit sentence ('persist `none` instead of the default grant') since it is what carries the quote. Two things to tighten so the facts stay robust: in loop-stop the commit step says only 'keeps the council-audit body' and the HEAD check drops the word 'exactly', whereas plan-stop names the subject, the audit lines and 'exactly' - mirror the plan-stop wording in both branches. Also, the rendered gate still carries the stale line 'Add "; allowance N" to 4 or 5' and the '; fund N fix rounds' suffix text, which now conflicts with the new four-row menu where 4 is draft PR and flags are `--fund-rounds=N` / `--allowance=N`; it does not affect these facts but should be removed or rewritten to avoid misleading replies outside this partial run.
- flag-replies / github-copilot/gpt-6.1-sol: Before stopped both replies before persistence (no decoding rule for `--amends-stop`, no engine field, no amend, no HEAD check, no handoff, and it misread reply 2 as the waves route), so both facts fail there. After accepts both replies without asking for clarification, persists `**Amend-grant:** none` with `**Engine:** waves` for row 1 and `**Engine:** loop` for row 2, stages and amends preserving the audit body, verifies both fields in HEAD, completes brainstorm and invokes writing-plans / loop-implementation, with the settings allowance of 4 used but not written to spec or settings, so both facts hold. Two things are thin and worth tightening: the narration is phrased conditionally ('I would read Standing grants and decode...') rather than as an accepted, performed sequence, and the grant value `none` appears only inside the header field literal rather than as an explicitly quoted resulting grant (e.g. 'grant value: "none"'); state the acceptance and the quoted grant value outright so the facts do not depend on a generous reading. Also note the After gate still carries a stale trailer line referring to options '4 or 5' and '; fund N fix rounds' syntax that no longer matches the four-row menu with `--allowance=N` / `--fund-rounds=N` flags; aligning that line would avoid confusion without affecting the Change.

exit: 0
