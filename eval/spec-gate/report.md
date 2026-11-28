# eval report: spec-gate (partial run: scope-cuts-listed)

for: 183b17dcb3e6fee49fc43676f091aa3cb1d0376fe6219952fb4e376c87537757

wall: 30s

## Change

The shared instructions continue past a spent allowance while the last round moved. The loop, waves and resume samples cover that behavior; no sample of this target was rerun.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| scope-cuts-listed | anthropic/claude-opus-5-5 | unchanged | 11657 | f2: holds -> holds (held); f3: holds -> holds (held); moved: holds -> holds (intended but unchanged); no-question: holds -> holds (held); f1: holds -> holds (held) |
| scope-cuts-listed | github-copilot/gpt-6.1-sol | unchanged | 10277 | f2: holds -> holds (held); f3: holds -> holds (held); moved: holds -> holds (intended but unchanged); no-question: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- scope-cuts-listed / anthropic/claude-opus-5-5: No fact moved between Before and After: both hold all four, so the expected fails -> holds on `moved` did not show up, because Before already satisfied it. In both outputs Scope cuts names only the deferred-refund and browser-export rows with their dispositions, and sits after the committed-to line and before the Council line. In both, a single `Not acceptance criteria:` line directly below it lists the four marked rows with their kinds and omits the unmarked receipt comparison. Both show the normal menu and proceed on reply `1` to the plan engine without asking about row placement. The After wording did change other things: the flag defaults now read "continues only while the review reports progress" and "stops a row that has stopped making progress", which delivers the Change; a `## Briefing` heading was added; and the "Drafted acceptance criteria (approval ratifies)" block was dropped. None of these touch the listed facts, but confirm the dropped block is intended. One fragility remains in both outputs: the live-check row is truncated mid-word ("real ide" in Before, "real identity provide" in After). To keep `moved` safe under a stricter reading, say explicitly that each Integration row is reproduced verbatim and in full before its ` - <kind>` suffix, with no length cap, and keep the instruction that the line goes immediately under Scope cuts and that unmarked Integration entries are omitted.
- scope-cuts-listed / github-copilot/gpt-6.1-sol: No fact moved: both outputs hold all four. Both list only the deferred refunds row and the deviating export row under Scope cuts, place that line between the committed line and the Council line, follow it directly with a single `Not acceptance criteria:` line carrying the four marked rows and their kinds without the receipt comparison, and take the reply "1" as the plan engine without asking about the rows. The expected fails -> holds on `moved` did not show up, because Before already rendered that line correctly. The visible differences in After are the reworded defaults for `--fund-rounds` ("none; past the escalated round the run continues only while the review reports progress") and `--allowance` ("stops a row that has stopped making progress"), which deliver the Change without touching any fact, and "spec path and worktree path not supplied" in the committed line. One fragility to watch: the last Not-acceptance-criteria row is truncated mid-word in both outputs ("real iden" in Before, "real ide" in After). It is still identifiable as the deployed-login live check, but wording that truncates at a word boundary, or not at all, would keep `moved` safe.

exit: 0
