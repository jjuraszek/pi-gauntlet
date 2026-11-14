# eval report: spec-gate (partial run: recommended-row)

for: 7e62f1a38bce428ac66a80b64745e7b6ffa9669977a9ab677408463cb80ef078

wall: 16s

refresh: complete; sample: recommended-row; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/recommended-row/candidate.json)

## Change

Recommend the rendered draft-PR row for a numeric context reading strictly above 25, before assessing acceptance rows. Compare the decimal reading without flooring and give the fresh-session instruction before `/skill:brainstorming #<N>`, explaining that this is less prone to hallucination. Read status beside the settings lookup before the final summary Read; missing readings never block the gate. Keep the four fixed labels, flags, resolved allowance default, and the single tag matched by the marker and reason.

Outside the create-only retry view, restrict recommendations to rendered engine rows for unknown context, 25% or lower, or a withheld draft-PR row. Run only `recommended-row` against base `855e872a42f9cac7a795704f3e0b383b182950ab`: retain its initial 25.1% gate and add compact independent recommendation checks for unknown, 25.0%, 12.4%, and 80.0% with row 4 withheld. These checks prove exclusion of row 4, not which engine wins. Preserve the initial gate's recommendation-consistency, four-row, flag, non-default allowance, briefing and drafted-row facts. Bundled-row selection, actual withholding, create-only retry and reply grammar remain outside this partial run; preserve other sample results without claiming fresh coverage.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 15005 | recommendation: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> fails (intended but unchanged); defaults: fails -> holds (intended change) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 15676 | recommendation: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |

## Feedback

- recommended-row / anthropic/claude-opus-5-5: After moved eight facts in the intended direction and lost none that Before kept: the briefing and drafted row are still verbatim ahead of the menu. The four fixed labels, the one-sentence rows and the flag bullets ending in their defaults (allowance 7, not 4) all come from the new menu wording. The single [recommended] tag on row 4 matches the recommended=4 marker and the Recommended line, whose reason cites 25.1%, a fresh session before `/skill:brainstorming #<N>`, and lower hallucination risk. The four compact checks each pick row 1 with a matching marker, tagged sentence and reason, so row 4 is excluded at unknown, 25.0%, 12.4% and withheld. Flags still fails, on a narrow point: the fact requires blank lines between row groups, and the Recommended line sits directly under row 4 with no blank line, so require a blank line after row 4 before that line. Two smaller residues are worth fixing. The old footer survives ('Add "; fund N fix rounds" ... to 1 or 2' and 'Add "; allowance N" to 4 or 5'); it names a row 5 that no longer exists and a reply grammar that competes with the new flags, so delete it or rewrite it in terms of `--fund-rounds=N` and `--allowance=N` on rows 1 and 2. The reason says 'start a fresh session and run ... there'; 'start a fresh session before running ...' would make the ordering explicit so no reader takes the command as resetting the current session.
- recommended-row / github-copilot/gpt-6.1-sol: After delivers every expected move and keeps the two facts Before already held (verbatim briefing and the drafted acceptance row with its in-scope disposition). The four fixed-label one-sentence rows, the per-engine flag bullets ending in their defaults (allowance 7, not 4), and the single [recommended] tag on row 4 matched by the recommended=4 marker and the Recommended: 4 line all show in the text. The reason cites 25.1% unfloored, puts the fresh session before `/skill:brainstorming #<N>`, and mentions lower hallucination risk without implying the command resets context. All four independent checks pick an engine row with consistent marker, tag and reason, never row 4. One leftover puts this at risk: the legacy sentence 'Add "; fund N fix rounds" ... to 1 or 2 ... Add "; allowance N" to 4 or 5' still follows the Recommended line. It refers to a row 5 that no longer exists, calls row 4 an allowance target when it is now draft PR, and duplicates the new flag bullets in the old reply grammar. Delete that sentence from the template, or rewrite it to point only at the flags under rows 1 and 2, and put a blank line after the Recommended line so the reason stands apart from trailing instructions. The checks all chose row 2 with identical reasoning; the facts allow that, but if the wording is meant to leave the engine choice open, say explicitly that either engine row is valid when row 4 is excluded.

exit: 0
