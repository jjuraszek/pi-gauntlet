# eval report: spec-gate (partial run: flag-replies)

for: 56aa63be88dd1f38f57fd3fee95b14b8e65fee69cbef7ea3dac197b172ef3e82

wall: 44s

## Change

Extend flag-replies with `1 --amends-stop --fund-rounds=3`: persist only `fund 3 fix rounds` with Engine waves, keeping funding separate from amendment permission. Scope the default-grant append and unfunded opt-out rules so neither overrides the combined flags. Run only flag-replies for this change against base 855e872a42f9cac7a795704f3e0b383b182950ab; retain every existing fact and unrelated sample record. This is partial narrated persistence coverage, not live git execution or a target-wide pass.

Extend flag-replies with `1 --fund-rounds=3`: append the funding token to the complete default grant on one physical line and retain Engine waves. Keep its terminal period verbatim before the appended semicolon; the first candidate dropped it on one model. Verify the amended HEAD before completing brainstorm and planning. Run only flag-replies for this change; preserve its opt-out facts and all unrelated sample records. This replay proves narrated persistence, not live git writes or target-wide coverage.

Accept `1 --amends-stop` and `2 --amends-stop` as engine approvals that persist `none` instead of the default grant. Keep waves for row 1 and loop with the settings allowance for row 2. Use the decoded table value for every approval before the existing amend, HEAD check and phase-completion handoff. Quote the full resulting grant value in narration.

Run only `flag-replies` against base `855e872a42f9cac7a795704f3e0b383b182950ab` for this edit. Its two independent opt-out cases prove narrated persistence and ordering, not live git or tracker effects. Other flag combinations, rejections and bare approval aliases remain outside this partial run. Preserve all other sample records, including the earlier four-row recommendation coverage, without claiming they were rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | improved | 12384 | plan-stop: holds -> holds (intended but unchanged); loop-stop: fails -> holds (intended change); plan-stop-funded: fails -> holds (intended change); plan-funded: fails -> holds (intended change) |
| flag-replies | github-copilot/gpt-6.1-sol | improved | 11030 | plan-stop: fails -> holds (intended change); loop-stop: fails -> holds (intended change); plan-stop-funded: fails -> holds (intended change); plan-funded: fails -> holds (intended change) |

## Feedback

- flag-replies / anthropic/claude-opus-5-5: After moved three facts by listing `--amends-stop`, `--fund-rounds=N` and `--allowance=N` as flags under each engine row, so the replies decode as approvals instead of the contradiction and malformed-token clarifications Before produced for loop-stop, plan-funded and plan-stop-funded. Loop-stop now persists `none` with `Engine: loop` and uses the settings allowance of 4 without writing it. Plan-funded writes the full default grant with its terminal period before `; fund 3 fix rounds` on one line. Plan-stop-funded writes only `fund 3 fix rounds` with waves. Plan-stop did not move as expected: Before already accepted `1 --amends-stop`, kept `none`, added waves, amended with the audit, checked HEAD and handed off to writing-plans, so it holds in both. Two things would make the result sturdier. First, plan-stop-funded separates funding from permission only through the brief phrase "funding only and no amend permission"; require an explicit sentence that the budget funds three extra fix rounds per task but grants no auto-apply permission. Second, the gate still carries the old trailer line ("Add '; fund N fix rounds' ... to 1 or 2 ... '; allowance N' to 4 or 5"), which refers to rows 4 and 5 that are no longer loop options and to funding on row 2; remove or rewrite it to match the new flag syntax. Keep the explicit instruction to quote the full persisted grant value in both the header step and the HEAD check, since that is what satisfies the narration requirements.
- flag-replies / github-copilot/gpt-6.1-sol: Before treated `--amends-stop` and `--fund-rounds=3` as undefined, asked a clarifying question in all four cases, and left the header, commit and phase untouched, so every fact fails there. After defines the flags under rows 1 and 2 of the gate and decodes each reply directly, which moves all four facts to holds. The opt-out cases persist `**Amend-grant:** none` with waves and loop respectively, and loop-stop uses the settings allowance of 4 without writing it. plan-funded quotes the complete default grant with its terminal period before `; fund 3 fix rounds` on one line. plan-stop-funded persists only `fund 3 fix rounds` with waves. Every case narrates stage, `git commit --amend --no-edit` preserving the audit body, the HEAD check of both fields, phase completion and the correct next skill. Two wording points are worth tightening to keep these stable. First, plan-stop-funded separates funding from permission only through the terse phrase "without amendment permission"; have the wording say outright that the budget funds three extra fix rounds but grants no auto-apply permission, so the distinction survives across models. Second, the gate still carries the legacy line "Add '; fund N fix rounds' to 1 or 2 ... Add '; allowance N' to 4 or 5", which contradicts the new four-row layout: row 2 is now the loop engine and rows 4 and 5 are no longer loop options. Drop or rewrite that line to match the flag syntax so it cannot pull a model back toward clarification or misapplied funding on row 2.

exit: 0
