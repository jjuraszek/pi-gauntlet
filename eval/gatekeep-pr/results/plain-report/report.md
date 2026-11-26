# eval report: gatekeep-pr (partial run: plain-report)

for: 2f7cca332ee570eebafc1e9e71a0660673e4b7e4f02158c0673ebffb8db5d328

wall: 79s

## Change

Report functionality-only coverage in plain-report, both in the opening and in the evidence mapping. Omit external observations and do not assign them an outcome.

Search once for other authors' open PRs awaiting the viewer's review, even when the viewer's team is asked to review the viewer's own PR. A typed PR still bypasses discovery. Keep a changes-requested PR in discovery when every requester was asked again or the last commit came after all outstanding change requests. The answered sample supplies fixed verdicts and checks which lookups the parent runs, which PRs it lists and routes, and what it says when a lookup fails. A shell test classifies the responses; it cannot show that the parent used the verdict before routing. Show each list in visible reply text with a bold heading. For one typed PR, show the list after the initial PR, viewer and ticket display reads, in the reply carrying the first remaining Gather read (`gh run list`). Mint the run folder, create the continuation record, and initialize the tracker only after that call; reuse all the reads in the rest of Gather. The typed-list-note replay names the paired call outside the visible reply; it checks narrated order, not actual delivery beside a tool call. At first provisioning the single-PR runner or set parent sends the list only when earlier reply text in view lacks it. The list-send-if-missing replay tests whether the writer distinguishes a visible list from a shell result or a pasteable line. Resolve discovered-roster ticket links before the final sort and send the list in the reply carrying the first tool call after the sort. The over-cap and Claude Code rejection replays check the narrated command order and the list's carrier; their tools are off, so they cannot observe actual tool-call delivery or exercise the optional Linear lookup.

For overrides-own-block-only, a verifier runs the shared verification command on an already green head because gatekeep-pr requests local verification. The shape-ticket report suffix has no effect.

Unselected samples, including `merge-landed-message` and `fix-row-return-file`, retain their historical results. They are not coverage for this change.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | unchanged | 29961 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (held); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |
| plain-report | github-copilot/gpt-6.1-sol | unchanged | 20367 | prose: holds -> holds (held); role: holds -> holds (held); sync: holds -> holds (held); scope: holds -> holds (held); findings: holds -> holds (held); standing: holds -> holds (held); language: holds -> holds (held); choices: holds -> holds (held) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: No fact moved, and the functionality-only coverage is delivered in both the openings and A's evidence mapping, with no external observation or `not judged` outcome. Three After wordings came close to moving a fact and are worth tightening. First, standing in A is the nearest call: Before said the required unit check is still running "so merging also waits on it", while After only reports that the check is running next to the local failure, leaving the reader to infer from "required" that it precedes merge; restore an explicit clause such as "so merging also waits on it". Second, After's sync sentence adds "and pushed", which the supplied sync record does not state, and drops "no commits dropped"; keep the sentence to the supplied outcome (rebased onto main, one conflict in src/export.ts resolved, no commits dropped). Third, B's "You cannot approve your own PR." now stands as its own paragraph between standing and the recommendation, which strains the three-part shape; fold it back into the standing paragraph. Smaller risks: B dropped the supplied approval, the stop rows disagree ("remove the worktree" in A and C, "leave the worktree in place" in B), and C's assess row says "end at a closing menu", which reads as internal phrasing; Before's "end the run ... leave the PR as it is" was safer unless the skill mandates the cleanup wording.
- plain-report / github-copilot/gpt-6.1-sol: No fact moved in this case: both outputs satisfy all eight, and none of the facts listed under Expected to move belong to this case, so it only shows that the change did not regress report rendering. After delivers the functionality-only coverage in both the opening and the evidence mapping, with no external observation and no `not judged` outcome, and it keeps the markers, the recommended row 1, the role, prior-review and sync prose, and the show evidence hint. Its small improvements are within facts that already held: A's second part now opens with a single standing sentence that names both the blockers and the running required check, and the inspection says "Commit being reviewed" where Before said "assessed head". To keep everything Before kept, hold the opening to exactly two sentences without row numbers, keep SHAs, the CI run ID, the log path and the usage counters only inside the show evidence response, and keep B and C attributing their evidence to CI only. Two things in A are worth tightening, though neither fails a fact: the test file path appears twice in blocker 1, and standing and problems run to several paragraphs, which strains the three-part shape.

exit: 0
