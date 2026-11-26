# eval report: spec-gate (partial run: option-6-handoff)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 79s

## Change

The option-6-handoff replay checks draft PR creation: the title comes from the committed H1 with Markdown backticks intact, and the summary and Integration section reach gh through a file even when a body line reads EOF. Only this narrated publication sample is in scope; it does not open a PR.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| option-6-handoff | anthropic/claude-opus-5-5 | improved | 19080 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: fails -> holds (intended change); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |
| option-6-handoff | github-copilot/gpt-6.1-sol | unchanged | 33620 | menu: holds -> holds (held); persistence: holds -> holds (held); publication: holds -> holds (intended but unchanged); single-member: holds -> holds (held); completion: holds -> holds (held); replies: holds -> holds (held); invalid: holds -> holds (held); rejection: holds -> holds (held); create-failure: holds -> holds (held); retry: holds -> holds (held); retry-menu: holds -> holds (held); continue: holds -> holds (held); cleanup: holds -> holds (held); remote-gate: holds -> holds (held); moved-ref: holds -> holds (held) |

## Feedback

- option-6-handoff / anthropic/claude-opus-5-5: The only fact that moved is publication, and it moved as intended. Before typed the heading into the command as shell source (`--title 'Export `pwd` receipts'`), so the title was never read from the committed file. After derives `TITLE` from `git show HEAD:doc/specs/export.md` via sed, guards it with `test -n`, and passes it as the single argument `"$TITLE"`, while keeping the file-writer body with the literal `EOF` line and `--body-file "$BODY"`. Every other fact held in both outputs. Three spots in After are thinner than Before and worth firming up in the wording. First, the differing-remote and missing-remote deltas should say outright that no destroy and no ref deletion run; After only says "there is no pin" or gives the kept report. Second, the invalid-diff offending lines should be rendered as verbatim name-status output in a code block with the `origin/main` base named, as Before did. Third, the moved-retry should say explicitly that no push, create or completion follows. Keep the explicit read-the-H1-as-data step, the pinned-SHA `update-ref -d`, and the URL, Continue line, completion, cleanup ordering exactly as they are.
- option-6-handoff / github-copilot/gpt-6.1-sol: No fact changed state between the two outputs, so the expected fails -> holds on publication did not show up as a flip. Before already passed the title as a single-quoted literal `'Export `pwd` receipts'` with both backticks intact and wrote the body through a file writer to a scratch --body-file, which satisfies the fact as written since it only names double-quoted inlining as failing. After is the stronger form: it reads the H1 from the committed file with `git show HEAD:... | sed`, guards against an empty title, and passes `"$TITLE"` as one argument, so keep that wording. If you want Before-style output to fail, the fact itself needs to say that any inlined heading in shell source fails, not only the double-quoted kind. Three places in After are thinner than Before and worth tightening. The persistence step reads "edit home header to: # Export `pwd` receipts with: ...", which is confusing; say the two lines go directly under the existing header. The guarded-wrapper delta dropped Before's explicit "no second deletion". The invalid-diff blocks dropped the standalone `origin/main` line, so the base now appears only inside the Withheld row. After's explicit "pushed branch `spec-export`" on create failure, the two-line full-SHA block on moved retry and "refuse execution" on the unguarded wrapper are clearer than Before and should stay.

exit: 0
