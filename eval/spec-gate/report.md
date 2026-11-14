# eval report: spec-gate (partial run: recommended-row)

for: c3501464611d2876acdfaa860dc267ce20b9369fffd27532c5e9af3c2af284ec

wall: 31s

## Change

Tie exactly one rendered recommendation to its first-line marker and trailing reason: tag one row among 1, 2, and 4 at the sentence end, use that same number in recommended=N and Recommended: N - reason, and leave row 3 and flag lines untagged. Keep the four fixed labels, per-engine flags and resolved allowance default.

Run only `recommended-row` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. Extend its facts with recommendation consistency, retaining the four-row, flag, non-default allowance, briefing and drafted-row facts. Context-based selection, bundled-row selection and reply grammar remain outside this partial run. Preserve other sample results without claiming fresh coverage.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 14964 | recommendation: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 12545 | recommendation: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |

## Feedback

- recommended-row / anthropic/claude-opus-5-5: After moves all five expected facts. Row 1 alone ends with [recommended], and the first line's recommended=1 and the trailing "Recommended: 1 - ..." line use the same number with a concrete, case-specific reason. The six-choice template is replaced by four fixed-label rows of one sentence each, with no experimental label or separate auto-apply choice. Each engine's flags sit beneath it as separate bullets with blank lines between row groups, and each bullet ends in its default, including the allowance of 7 rather than the shared 4. Briefing and drafted-row facts are kept, but two things put them or the new facts at risk. First, After adds a "## Briefing" heading that Before did not emit; I counted the briefing as verbatim because the body text is unchanged, but a stricter reader could not, so say explicitly to reproduce the briefing body with no added heading. Second, the legacy line "Add \"; fund N fix rounds\" ... to 1 or 2 ... Add \"; allowance N\" to 4 or 5" survives after the rows; it refers to a row 5 that no longer exists, attaches allowance to the draft PR row, and offers fix rounds on the loop engine row, contradicting the per-engine flag bullets. Delete that sentence from the template so the flag bullets are the only place flags are described. Also consider holding the Recommended reason to one sentence, and pinning the "(default: ...)" form so the fund-rounds default says "stop and ask after the escalated round" rather than the vaguer "there".
- recommended-row / github-copilot/gpt-6.1-sol: After moved all five expected facts and kept the two that Before already held. The six-choice template became four fixed-label rows of one sentence each, with no experimental label and no separate auto-apply choice. Row 2 alone ends with [recommended], and both the first-line recommended=2 and the trailing 'Recommended: 2 - ...' line carry the same number with a concrete reason. Each engine's flags sit in their own bullets beneath it, each ending in its default, with the allowance shown as 7 rather than 4. The briefing and the drafted acceptance row with its in-scope disposition are still reproduced verbatim before the menu. One leftover needs fixing: the trailing line 'Add "; fund N fix rounds" ... to 1 or 2 ... Add "; allowance N" to 4 or 5' still describes the old six-row menu. It points at a row 5 that no longer exists, attaches allowance to row 4 (now the draft PR), and offers fund rounds on row 2 (now the loop engine), which contradicts the new flag bullets. Remove that sentence or reword it to refer to the flags (--fund-rounds=N on row 1, --allowance=N on row 2) so the gate has a single consistent grammar. Also keep the explicit instructions that the tag goes only at the sentence end of row 1, 2 or 4 and never on row 3 or a flag bullet, and that the allowance default comes from this gate's loopEngine result.

exit: 0
