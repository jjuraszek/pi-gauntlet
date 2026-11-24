# eval report: gauntlet (partial run: pr-body-drafted-row)

for: 527b32c147bbd8dae72711ee87408c6d1ba85358508766387a42e05ec512fa0c

wall: 24s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 6186 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5836 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: All three facts hold in both outputs, so the After wording moved nothing on this case: f1 was expected to go fails -> holds, but Before already rewrote the PR-description proof to the directory-empty observable and kept the release-script PR-body row as a behavior, so there is no observed improvement here, only an unchanged pass. After keeps what Before kept: the `Drafted from the design, no ticket rows:` header, exactly two unchecked in-scope rows (empty retired-parser test directory; release script writes the changelog section into the PR body), no cut or scope question, and no `none` fallback. To keep these stable, retain the wording that makes the model (a) rewrite a workflow-stage proof to the Design's own observable rather than cutting the outcome, (b) apply the named exception when PR text is itself produced by code under change, and (c) state explicitly that rewriting a proof is not a scope decision and triggers no question. One minor note: After's step 5 sentence 'The class does not apply when the row asserts one named directory is empty' is ambiguous about which class (tree-wide split) it means; naming the class explicitly in the skill wording would avoid a reader mistaking it for the workflow-stage class.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: All three facts hold in both outputs, so the After wording moved nothing in this case: f1 was expected to go fails -> holds, but Before already excludes the PR-description file list from the acceptance rows and keeps the release-script PR-body behavior as a real row, so it holds on both sides. After keeps the same two unchecked in-scope rows under the 'Drafted from the design, no ticket rows:' provenance line, asks no cut or scope question, and emits no none fallback. The one drift to watch is the second row's phrasing: After says the script 'produces a pull request body containing the changelog section' with a 'Given a sample changelog' precondition, which still reads as the committed behavior but leans toward test-setup wording; to keep f2 safe, have the wording state the row as the Design commitment itself ('the release script writes the changelog section into the pull request body') and leave the sample-changelog setup to Tests. After also dropped the Before's explicit note that the sample-changelog check stays in Tests and the next-stage self-review step; neither is a fact here, but retaining the Tests note would make the proof-versus-behavior split explicit.

exit: 0
