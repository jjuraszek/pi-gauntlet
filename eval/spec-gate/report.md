# eval report: spec-gate (partial run: option-6-handoff)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 77s

## Change

The option-6-handoff replay checks draft PR creation: the title comes from the committed H1 with Markdown backticks intact, and the summary and Integration section reach gh through a file even when a body line reads EOF. Only this narrated publication sample is in scope; it does not open a PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| option-6-handoff | anthropic/claude-opus-5-5 | improved | 23073 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |
| option-6-handoff | github-copilot/gpt-6.1-sol | improved | 19647 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |

## Feedback

- option-6-handoff / anthropic/claude-opus-5-5: Only publication moved, and it moved as intended. Before failed it because its PUBLISH block passed `--base "$DEFAULT"` inherited from the separate PROOF sequence, minted the body file via `$SCRATCH`, and had the equality retry re-run 'only the gh pr create line', which inherits TITLE and DEFAULT from an earlier shell. After fixes this with a single self-contained CREATE call: it reads the committed H1 into TITLE in that same call, passes the observed base as the literal 'main', and names the literal body-file path that mktemp printed and the file writer used; the retry then refers back to that whole block. PUSH is split out, so the retry cannot re-push, and the body with its bare EOF line is still written as data by the file writer rather than a heredoc. No fact that Before kept was lost. To keep it that way, keep the wording that makes CREATE one fresh-shell call with a literal base and path, and keep the explicit 'No amend and no push' on the retry. Three small things could be tightened: the BASE step still shows a `DEFAULT=$(...)` assignment that nothing later uses and could be read as shell-state reliance; the mint output is abbreviated as `.../pr-body.Q7rT2k` and would be safer printed in full so the same-path match is unambiguous; and the two retry gates are merged into one block, so render them separately if the case's 'independently' is to be honoured literally. The flagged reply would also be safer if it kept the word 'malformed'.
- option-6-handoff / github-copilot/gpt-6.1-sol: Only publication moved, and it moved because After makes the create call self-contained: the base is passed as the observed literal `main`, the committed H1 is read into TITLE inside the same `&&`-chained call, and the equality retry reruns "Publish's entire TITLE/create block". Before failed that fact because the create inherited `$DEFAULT` from the earlier base-proof block and the retry reran "only the create command", which inherited TITLE. Keep the file-writer body transport with the mint-printed absolute path, as both outputs already have it. No fact regressed, but three After passages are terser than Before and hold only by implication, so restore the explicit wording: say "no writes" in the replies `1` and `2` questions; state "no native removal" for the keep-branch wrapper and "no second deletion" for the guarded wrapper; and give the host checkout a recovery instruction (resolve the other-path checkout by hand) rather than only saying continuation stops. Also keep the explicit `origin/main` label beside the offending name-status lines in the invalid-diff output, and state the pushed SHA in the create-failure report, so those facts do not rest on the Withheld line or the branch name alone.

exit: 0
