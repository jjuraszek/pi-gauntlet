# eval report: gauntlet (partial run: post-action-sorted)

for: eaabe1071ee7efc5abe91e7a7d3fda55c6a29db6a501bec4cf2e2622ccdfac97

wall: 26s

## Change

An ordinary coding request does not enter the gauntlet, even with the entry instructions in context. Select ordinary-request-no-run to check the assistant's proposed actions before its first edit: no phase starts, no worktree is created and no step instructions are loaded. Both revisions require consent; no fact is expected to move. This tool-free sample checks the assistant's routing decision, not a live checkout. For handoff-follows-pointer, the completion reply supplies the next file. A read-only replay resumes with that tool result in history. Only the file provides the receipt; a narrated read cannot pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-action-sorted | anthropic/claude-opus-5-5 | unchanged | 5938 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| post-action-sorted | github-copilot/gpt-6.1-sol | unchanged | 5593 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- post-action-sorted / anthropic/claude-opus-5-5: All four facts hold in both outputs, so the After wording moved nothing on this case. Both render the two ABC-204 rows verbatim with in-scope dispositions and the provenance header, add no row and ask no cut question (f3); both place the DEPLOY_TOKEN step in a bold-labelled **Post-deployment housekeeping.** paragraph inside Design with the admin actor and after-merge timing, and keep it out of Tests and imperatives (f1); both leave the scan-time PR-body note out of every authored section, with the only PR-text obligation being the release script's generated changelog body (f2); and both keep that release-script requirement in Design with a Tests line comparing the generated body against the changelog fixture (f4). Note that the expected fails -> holds movement for f1 and f2 is not visible here because Before already satisfies them. To keep these facts stable, preserve the wording that sorts each commitment into change versus operator step, names the bold housekeeping label explicitly as a paragraph inside Design, and forbids any sentence making non-script PR text an obligation; After's Design states the release-script behavior as a plain declarative rather than an Add: line, which still satisfies f4, but keeping an explicit fixture-comparison Tests line is what anchors it.
- post-action-sorted / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both outputs put the secret creation in a bold-labelled **Post-deployment housekeeping.** paragraph (not a heading) with the repository admin as actor and after-merge timing, both leave the scan-time PR-body note out of Design and Tests as an obligation, both copy the two ABC-204 rows verbatim with in-scope dispositions and provenance while adding no row and asking no scope-cut question, and both keep the release script's changelog-into-PR-body requirement in Design with a fixture-versus-generated-body comparison in Tests. The expected fails -> holds movement on f1 and f2 is not visible here because Before already satisfied them. After's housekeeping paragraph is slightly cleaner since it drops Before's extra sentence mentioning acceptance criteria and test requirements, and its indented section rendering under a numbered step did not disturb the verbatim rows; to keep all four facts, keep the wording that sorts admin-owned post-merge actions into the labelled paragraph with actor and timing, keeps delivery-note PR text out of authored obligations, and still treats script-generated PR text as a behavior with a Design line and a Tests line.

exit: 0
