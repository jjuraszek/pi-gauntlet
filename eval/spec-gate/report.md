# eval report: spec-gate (partial run: option-6-handoff)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 74s

## Change

The option-6-handoff replay checks draft PR creation: the title comes from the committed H1 with Markdown backticks intact, and the summary and Integration section reach gh through a file even when a body line reads EOF. Only this narrated publication sample is in scope; it does not open a PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| option-6-handoff | anthropic/claude-opus-5-5 | improved | 19584 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |
| option-6-handoff | github-copilot/gpt-6.1-sol | improved | 18488 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |

## Feedback

- option-6-handoff / anthropic/claude-opus-5-5: Only publication moved, and it moved as intended. Before typed the heading into the command as a shell literal (--title 'Export `pwd` receipts') and passed --body-file "$BODY", which depends on the variable set by the mktemp call. After reads the H1 from the committed file (git show HEAD:doc/specs/export.md piped through sed), passes it as one quoted "$TITLE" argument, and gives --body-file the literal path that mktemp printed, with the file writer (not a heredoc) producing the summary plus the Integration section including the EOF line. Every fact Before kept still holds in After, but three spots are thinner and worth firming up. First, say outright that the file writer wrote to the same literal pr-body path that --body-file names, and that the mint and write happen before the push; After currently leaves this to inference. Second, the guarded --published-only delta dropped Before's "source verified, then run" step, and the differing-remote and missing-remote deltas dropped "nothing removed"; restoring those phrases makes it explicit that no destroy or ref deletion ran. Third, --base "$DEFAULT" still leans on a variable from the PROOF step; writing the resolved main, or resolving it inside the same command block, would remove the last cross-call shell dependency.
- option-6-handoff / github-copilot/gpt-6.1-sol: Only publication moved, and it moved as intended. Before typed the heading into the command as shell source and passed --body-file "$BODY", which relies on shell state from the mktemp call. After reads the H1 from the committed file (git show HEAD:<spec> piped through sed) into TITLE, passes it as one quoted argument with the backticks intact, and gives --body-file the literal path the mint printed, with the body written by a file writer rather than a heredoc. No fact that Before kept was lost, but three are carried by thin wording. The .gitignore invalid-diff variant is now a one-line 'substitute' instruction rather than a rendered block, so keep the offending path and origin/main explicit there. The safe and guarded wrapper bullets depend on the phrases 'no native removal' and 'without another deletion', so keep those. The body-transport paragraph should say outright that the writer targets the printed pr-body path, so the same-path link between mint, writer and --body-file is stated rather than implied.

exit: 0
