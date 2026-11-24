# eval report: gauntlet (partial run: post-action-sorted)

for: 527b32c147bbd8dae72711ee87408c6d1ba85358508766387a42e05ec512fa0c

wall: 34s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | unchanged | 6390 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| post-action-sorted | github-copilot/gpt-6.1-sol | unchanged | 5868 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: All four facts hold in both outputs, so the After wording moved nothing on this case even though f1 and f2 were expected to go from fails to holds; Before already placed the DEPLOY_TOKEN step in a bold-labeled **Post-deployment housekeeping.** paragraph with actor (repository admin) and timing (after merge), and already left the scan-time PR-body note out of Acceptance criteria, Design, and Tests. After keeps both behaviors, copies the two ticket rows verbatim with their in-scope dispositions and the Ticket ABC-204 provenance header without adding rows or asking a cut question, and keeps the release-script changelog behavior in Design with a Tests line comparing the generated body against the fixture. One thing to watch: After formats the other Design subsections as bold run-in labels too, which makes the housekeeping paragraph less visually distinct but does not break the fact; and After's narration mentions the scan-time item only in the pre-render reasoning as omitted, which is fine, but any wording that encouraged echoing it inside the authored sections (for example as a 'not included' note in Design) would risk f2. To keep these facts stable, keep the rule wording that says the operator step goes only in the labeled housekeeping paragraph with supplied actor and timing, and that delivery-note PR text gets no sentence at all in the authored sections while script-generated PR text stays a Design behavior with a Tests line.
- post-action-sorted / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both outputs keep the two ticket rows verbatim with in-scope dispositions and Ticket ABC-204 provenance and ask no scope-cut question (f3); both place the DEPLOY_TOKEN step in a bold-labelled **Post-deployment housekeeping.** paragraph, not a heading, with the repository-admin actor and after-merge timing and no Design imperative or Tests line for it (f1); both leave the scan-time PR note out of Design and Tests, mentioning it only in the classification preamble as something not to make an obligation (f2); and both keep the release script's changelog-into-PR-body requirement in Design with a fixture-versus-generated-body comparison in Tests (f4). Note that the expected fails -> holds movement for f1 and f2 did not appear on this sample because Before already satisfied them. To keep this stable, the After wording should continue to state explicitly that manual operator actions go in the labelled housekeeping paragraph with actor and timing, that delivery-note PR text is never written as a Design imperative or Tests line, and that script-generated PR text remains a behavior in Design and Tests; the preamble sentence about the scan-time note is safe as long as it stays outside the authored sections.

exit: 0
