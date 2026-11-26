# eval report: spec-gate (partial run: option-6-handoff)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 82s

## Change

The option-6-handoff replay checks draft PR creation: the title comes from the committed H1 with Markdown backticks intact, and the summary and Integration section reach gh through a file even when a body line reads EOF. Only this narrated publication sample is in scope; it does not open a PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| option-6-handoff | anthropic/claude-opus-5-5 | improved | 23069 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: fails -> holds (unplanned improvement); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |
| option-6-handoff | github-copilot/gpt-6.1-sol | improved | 17427 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |

## Feedback

- option-6-handoff / anthropic/claude-opus-5-5: After moved publication from fails to holds, as intended. Before inlined the title as a quoted shell literal, depended on $DEFAULT carried over from an earlier call, and sent a summary-only body through a heredoc that dropped the Integration section. After mints a scratch path, writes the summary plus the exact Integration section (including the literal EOF and End of receipt lines) with the file writer, and runs a self-contained CREATE block that reads the H1 from HEAD in the same call, passes the literal base 'main' and names the minted path in --body-file; the equality retry refers back to that whole block, which qualifies. Keep those properties: do not let CREATE inherit TITLE or DEFAULT from an earlier step, and keep the body file path identical between mint, writer and --body-file. After also moved single-member to holds, which is a strict reading on my part: Before printed a literal `pushed: spec-export at …` line in the create-failure output, which I counted as a pushed: prefix line, while After reports the pushed branch in prose. Keep that prose form. No fact that Before held regressed. Two things to keep stable are the abbreviated SHAs (aaaa…a) outside the moved-retry and cleanup reports, where the full 40-character SHAs are required and present, and the explicit note that rows 1 and 3 remain in the invalid-diff redraw so implementation approvals stay visibly allowed.
- option-6-handoff / github-copilot/gpt-6.1-sol: Only publication moved, from fails to holds, and no fact that Before kept was lost. Before inlined the title in shell source, sent the body through an `EOF` heredoc to stdin, and dropped the Integration section. After writes the summary plus the full Integration section (literal `EOF` and `End of receipt` lines) with a file writer to the minted absolute path, and passes that same literal path to `--body-file`. Its create call is self-contained: it reads the committed H1 from `git show HEAD:doc/specs/export.md` in the same call, passes it as one `"$TITLE"` argument, and uses the observed base `main` rather than an inherited `$DEFAULT`, so the equality retry can refer back to it and still work in a fresh shell. To keep this robust, keep saying explicitly that the retry reruns that complete create block, and that the scratch path is the literal one the mint printed rather than a `$SCRATCH` variable from the mint's shell. The terser passages (native remove/prune in prose, cleanup reports grouped in blocks, host-checkout recovery in one sentence) still satisfy completion, cleanup, remote-gate and moved-ref, but they are close to the minimum. Do not trim further the exact per-repo report lines, the 'no second deletion' and 'refuse unguarded execution' statements, or the another-path recovery note.

exit: 0
