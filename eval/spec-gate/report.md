# eval report: spec-gate (partial run: option-6-handoff)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 80s

## Change

The recommended-row replay checks that the gate selects the first bundled in-scope row after three cut rows and a single-observation row. Wording pins alone do not show which row the recommendation quotes. Only this sample is in scope.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| option-6-handoff | anthropic/claude-opus-5-5 | improved | 19705 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (unplanned improvement); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |
| option-6-handoff | github-copilot/gpt-6.1-sol | improved | 18263 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (unplanned improvement); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |

## Feedback

- option-6-handoff / anthropic/claude-opus-5-5: The only fact that moved is publication, from fails to holds. Before piped the body through `--body-file -` with a shell heredoc and passed `--base "$DEFAULT"`, so the body was shell source and no scratch file was named. After writes the body with the file writer to a mktemp scratch file under .git/gauntlet/tmp and passes `--body-file "$BODY"` with an explicit `--base main`; keep that wording. No fact that Before kept was lost, but several now hold by implication rather than by statement, and one more round of trimming could drop them. In the create-failure section After no longer says there is no cleanup or that the checkout is intact; only the completion ordering implies it. The invalid-diff section says the amended spec is retained but no longer names the checkout. The differing-remote, missing-remote and moved-branch deltas give only the report line, without Before's explicit 'nothing is pinned' and 'no update-ref'. The safe-wrapper report abbreviates the path to `…/spec-export`. Restoring those short explicit clauses and the full path would make these facts robust. None of the Expected to move ids appear in this case's facts, and this sample's recommendation rendering is unchanged between Before and After.
- option-6-handoff / github-copilot/gpt-6.1-sol: The only fact that moved is publication, from fails to holds. Before piped the body through `--body-file -` with a quoted shell heredoc, so the literal EOF line sat in shell source and no scratch file was named. After writes the exact bytes with a file writer to a mktemp scratch path and passes `--body-file "$BODY"`, keeping push before create with explicit head and base and the H1 title. No fact that Before kept was lost, but three After wordings are thinner than Before and worth firming up. First, the narration line `Supplied settings allowance: 4; status: 12.0%` sits just below the zero-row gate; keep it clearly outside the gate, or drop it, so it cannot be read as an allowance line. Second, the create-failure text says only `retain published HEAD/checkout/body`; restore Before's explicit statement that branch spec-export is pushed at the full SHA. Third, the equality retry no longer says `never amend/push again`, and the unguarded and host reports now share one code block; say the former explicitly and give each variant its own labelled report as Before did. None of the recommended-row behaviours named in the Change are exercised by this case, so nothing here confirms or contradicts them.

exit: 0
