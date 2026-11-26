# eval report: gauntlet (partial run: pr-rework-integration-not-claims)

for: 78d6495fe00532298d08db1802023491cfe23cb11c3b680486ab49c25ef339d3

wall: 17s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality. Ask about an unmatched group only when it has a surviving acceptance row. When acceptance rows survive, check all original group headings for a member match before stopping; a surviving known nonmember row stays `elsewhere: <repo>` even when the matched member's rows all move. When all ticket rows move to Integration, draft acceptance rows from the design without an ownership question or stop. `group-all-rows-sorted` checks both ownership decisions before any write, not the live workflow.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-rework-integration-not-claims | anthropic/claude-opus-5-5 | improved | 9101 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |
| pr-rework-integration-not-claims | github-copilot/gpt-6.1-sol | improved | 6033 | contradicted-claim: holds -> holds (held); provenance-only: fails -> holds (unplanned improvement); no-question: holds -> holds (held) |

## Feedback

- pr-rework-integration-not-claims / anthropic/claude-opus-5-5: After moved provenance-only from fails to holds. Before listed the operator-card update and its nested shift-log line under `keeps:` and judged them ("the diff cannot verify them", "the limit written on the operator card must be three"), whereas After leaves the Integration block out of keeps, changes and dropped claims entirely. Both outputs state that the three-attempt claim is contradicted by the four attempts `attempt < 4` allows, and neither asks a question about the Integration block, so those two facts are unchanged. One point to tighten: After reports the contradiction only inside `changes:` ("does not meet the stated claim") and says `dropped claims: none` without explanation, so wording that tells the scout to name a contradicted body claim explicitly, even when a repair keeps it, would make that fact sturdier. After also drops the Integration block silently rather than carrying it; if the Change intends it to travel verbatim as provenance, say so explicitly: Integration entries are copied verbatim with nested lines intact into a separate provenance spot, never under keeps, changes or dropped claims, never checked against the diff, and never the subject of a question.
- pr-rework-integration-not-claims / github-copilot/gpt-6.1-sol: After moved provenance-only from fails to holds: Before rendered the operator-card update and its nested shift-log step under `keeps:` and judged them against the diff ("Neither operational action is implemented by the supplied diff"), whereas After leaves the Integration block out of keeps, changes, and dropped claims entirely and raises no question about it. Contradicted-claim holds in both, since each quotes the three-attempt claim under dropped claims and states the diff permits four attempts; After places the explicit "four attempts" in the `changes:` line and only says the diff "does not yet satisfy this claim" in the dropped-claims line, which is slightly weaker than Before's direct "The supplied diff permits four attempts." To keep that fact robust, the wording should require the dropped-claim line itself to state the observed count from the diff next to the quoted claim. After also dropped Before's carried-specs, base-sync, and scoped-tests lines; if those are still wanted in the scout output, say so explicitly, while keeping the instruction that Integration entries are carried verbatim as provenance and never sorted into keeps, changes, or dropped claims or judged against the diff.

exit: 0
