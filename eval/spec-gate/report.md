# eval report: spec-gate (partial run: row-3-reply)

for: 79afc0f5c110971d06844fd5471d71317081534b924178ff79c7efe677fbc998

wall: 43s

## Change

On reply `3`, read the council audit from the spec commit and print it verbatim, then reuse the rendered four-row gate, including its flag lines, recommendation tag, marker and reason. Reuse the context and settings observations instead of reading them again or recomputing the recommendation. Record no approval or grant and change neither the spec nor its commit.

Update row-3-reply's six-row fact to the four-row contract and add a snapshot-reuse fact. Supply a low-context observation while keeping the existing ticket row, briefing, audit and shared settings result. Run only `spec-gate/row-3-reply` against base `855e872a42f9cac7a795704f3e0b383b182950ab`. This text replay proves rendering and narrated read/no-write behavior, not live git or tracker effects. Preserve all other sample records; the report is partial, not a target-wide pass.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| row-3-reply | anthropic/claude-opus-5-5 | improved | 14429 | f1: holds -> holds (held); f2: fails -> holds (intended change); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); reuse: holds -> holds (intended but unchanged) |
| row-3-reply | github-copilot/gpt-6.1-sol | improved | 12193 | f1: holds -> holds (held); f2: fails -> holds (intended change); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); reuse: holds -> holds (intended but unchanged) |

## Feedback

- row-3-reply / anthropic/claude-opus-5-5: The After wording moved f2 as intended: the re-presented gate now has exactly four numbered rows (plan engine, loop engine, council explanation, draft PR), and its flag lines, single [recommended] tag, recommended=2 marker and Recommended: reason line are character-identical to the initial gate, where Before re-presented a six-row menu with no recommendation. The reuse fact did not move on the text. Before already narrated that only the committed audit was reread, that the status and settings observations were reused, that the summarizer was not re-dispatched and that the removed temp file was not read; it had no recommendation to recompute, so it satisfies the fact as written. If you want Before to fail it, the fact should require affirmatively that a rendered recommendation is carried over. After is clearer here because it explicitly says there was no new phase_tracker call, no new gauntlet_setting call and no recomputed recommendation; keep that. Three things are worth tightening so the facts Before kept stay safe. First, After drops Before's explicit statement that no grant or engine is recorded; f3 still holds because nothing is approved, but restoring 'no approval and no amendment grant is recorded' makes it unambiguous. Second, After omits the '## Briefing' heading that Before printed above the briefing body; I read it as a section label and the body is verbatim, but a stricter reader could count that against 'verbatim source briefing' in f2. Third, the spec path now shows '<project>' where Before showed 'orchard-billing'; keep it stable between the initial gate and the re-presentation, as After does.
- row-3-reply / github-copilot/gpt-6.1-sol: The After wording moved f2 as intended: the re-presented gate now has exactly four rows (plan engine, loop engine, council explanation, draft PR), and its flag lines, single [recommended] tag, recommended=2 marker, Recommended: reason line, verbatim briefing and Council counts line are identical to the initial gate. Before failed f2 because it rendered the six-row menu with no recommendation. Nothing Before kept was lost: the audit is still verbatim (f1), no approval or grant is recorded (f3), no spec or commit change is made (f4), and the counts stay 11/0/0 (f5). The reuse fact did not move as expected, because Before's text already satisfies it as written: it says status and settings are reused and not reread, the removed temp file is not read, the only source is the committed audit, and it has no recommendation to recompute. If you want reuse to separate the two wordings, make the fact require that the reused snapshot carries the recommendation marker, tag and reason unchanged. Two small tightenings would make After more robust on reuse: have it say explicitly that the summary is not regenerated or read from the removed temp file (Before said this, After only implies it), and have it name the committed audit as the single thing read, rather than framing it as a commit-body read it could not perform.

exit: 0
