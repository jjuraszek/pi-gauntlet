# eval report: gauntlet (partial run: pr-body-drafted-row)

for: eaabe1071ee7efc5abe91e7a7d3fda55c6a29db6a501bec4cf2e2622ccdfac97

wall: 20s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 4653 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5069 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: Both outputs satisfy all three facts: each rewrites the PR-description proof sketch for behavior 1 into the directory-is-empty observable, keeps the release-script PR-body row as a genuine behavior rather than stage proof, renders exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:`, and asks no cut or scope question with no `none` fallback. The expected f1 move (fails -> holds) does not appear in this sample because Before already drops the PR-description observable; After shows the same behavior with only minor wording differences (e.g. 'every obsolete parser test file has been removed', 'section text'). To keep these facts stable, retain the explicit wording that a workflow-stage proof attached to a committed outcome is rewritten to the Design behavior rather than cut, the stated exception that PR text produced by the script under change is behavior, and the instruction that rewriting a proof triggers no scope question.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: Nothing in After moved a fact relative to Before: both outputs omit the PR-description file list as an acceptance observable while keeping the release script's pull-request-body behavior as a real row (f1), both render exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` naming the empty retired-parser test directory and the changelog section in the pull request body (f2), and both ask no cut or scope question and use no `none` fallback (f3). Note that f1 was expected to go fails -> holds, but Before's text already satisfies it, so the observed result is holds -> holds. After's second row rephrases 'writes its changelog section into the pull request body' as 'includes that section in the generated pull request body'; this still names the committed behavior, but to stay safely within f2 keep wording close to the Design commitment (the release script writes the changelog section into the pull request body), keep the exact provenance line, and continue to state explicitly that the PR-description list is stage proof dropped from the row while the outcome itself is retained.

exit: 0
