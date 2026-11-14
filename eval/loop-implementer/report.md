# eval report: loop-implementer (partial run: companion-return-file)

for: f9c38358b0feaa2b327f741e8a81374a46f789b5c2b2d94bb37c3a15c6c56b21

wall: 43s

## Change

Read dispatched wording and ticket inputs for loop worker messages. Keep home attribution in the committed ledger's returned field and outside-ledger rows in the supplied checkout-local return file, written before the single code commit. Remove all dispatch state from messages. Select only home-plain-commit and companion-return-file for this edit.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| companion-return-file | anthropic/claude-opus-5-5 | unchanged | 12427 | reads: holds -> holds (held); external-ledger: holds -> holds (held); return-file: holds -> holds (intended but unchanged); result: holds -> holds (held); message: holds -> holds (intended but unchanged); one-commit: holds -> holds (held); reply: holds -> holds (held) |
| companion-return-file | github-copilot/gpt-6.1-sol | unchanged | 14090 | reads: holds -> holds (held); external-ledger: holds -> holds (held); return-file: holds -> holds (intended but unchanged); result: holds -> holds (held); message: holds -> holds (intended but unchanged); one-commit: holds -> holds (held); reply: holds -> holds (held) |

## Feedback

- companion-return-file / anthropic/claude-opus-5-5: No fact moved on this case: both outputs read the spec before the ledger, read the rules and the supplied wording file, leave the home ledger untouched, write the return file before the single code-only commit, use the plain subject "Include imported plants in pagination totals" with no ticket, and reply with only the matching row 2 done decision. The expected fails -> holds moves for companion-return-file/return-file and companion-return-file/message therefore do not show here, because Before already satisfied both. The one drift in After is the result row in the return file: it is wrapped in leading and trailing pipes (`| 2 | done | 1 | ... |`), where Before wrote the bare `2 | done | 1 | ...` form that matches the pending tuple's style. It is still a headerless four-column row, so I reported return-file as holding, but a strict parser or stricter reading could reject it. To lock this down, have the After wording say the result row is written as bare cells joined by ` | ` with no leading or trailing pipe and no table header, ideally with a literal one-line example. After also drops Before's read-back of the return file after writing and no longer says the file sits under the git directory and so cannot be staged; neither is required by a fact, but restoring both would keep the write-before-commit and never-staged guarantees explicit.
- companion-return-file / github-copilot/gpt-6.1-sol: No fact moved on this case: both outputs satisfy all seven facts, so the expected fails -> holds moves for return-file and message do not appear here, because Before already wrote the tuple-first return file before its single commit and already used the plain subject "Include imported plants in pagination totals" with an empty body and no ticket. After keeps all of that: spec then ledger then wording and AGENTS.md reads, an untouched home ledger and HEAD, a return file with tuple, iteration: 6, one headerless row 2 done row and a matching decision, an unstaged return file, one commit, a clean status check and a decision-only reply. The differences are outside the facts: After reads the wording file up front rather than at the commit site, reuses the existing failing test instead of editing it (closer to the case) and so stages only src/totals.mjs, and no longer prints the return-file content as a separate block from the write command. To keep these facts stable, keep the wording explicit that the return file is written before the commit and never staged or deleted by the worker, that the ticket comes only from the dispatched input, and that the final reply is the decision line verbatim from the return file; consider asking for the return content to be shown verbatim so the tuple, blank lines and row layout stay easy to check.

exit: 0
