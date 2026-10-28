# eval report: spec-gate (partial run: row-3-reply)

for: 94c1830623edbfb202f7618f5f131dbfd68b8165246706b0fb0790ef5cc2b628

wall: 41s

## Change

Preserve the approval gate and recorded design state when finalization materializes coordinated members.

Render every drafted acceptance row and disposition verbatim under Drafted acceptance criteria (approval ratifies): after Scope cuts: and before Council:, with five options. Ticket-row gates omit this block. The paired sample preserves verbatim briefing and audit counts and narrates reply-1 continuation; text replay proves supplied-observation rendering, not live gate execution.

The Wave 1 edit to skills/brainstorming/reference/spec-finalization.md adds a Scope cuts line between the committed-to line and the Council line. Build it from deferred, deviates, and venue acceptance-criteria rows, excluding in-scope and elsewhere rows; render none when no cuts exist.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| row-3-reply | anthropic/claude-opus-5-5 | unchanged | 14641 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |
| row-3-reply | github-copilot/gpt-6.1-sol | unchanged | 16889 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held) |

## Feedback

- row-3-reply / anthropic/claude-opus-5-5: No fact moved: After still prints all thirteen audit lines verbatim, re-presents the verbatim briefing with the Council line at 11/0/0 and the numbered rows 1–3 (plus 4–5), and states that nothing in the spec or commit changed. Two small drifts are worth tightening though. First, Before's reply opened with an explicit 'It is not an approval' sentence; After relies only on the option-3 text in the re-presented gate for that statement, so a reader checking f3 from the reply alone has to infer it—restore a one-line 'Not an approval; no auto-apply grant recorded' at the top of the reply. Second, After collapsed the 'Drafted acceptance criteria (approval ratifies):' header into a single placeholder sentence, which weakens the Change's requirement that the block appear under that literal header between Scope cuts: and Council:; keep the header line verbatim and put only the row contents in the placeholder so the drafted-rows-block facts land on the header text rather than on a description of it.
- row-3-reply / github-copilot/gpt-6.1-sol: After keeps every fact Before kept: the eleven Applied lines plus Deferred: none and Rejected: none are reproduced verbatim (wrapping them in a code fence does not alter the text), the briefing is re-presented word for word, the Council line still reads 11 applied, 0 deferred, 0 rejected, options 1/2/3 are present with 3 explicitly marked 'Not an approval', and nothing in the reply touches the spec or commit. The wording differences are cosmetic — 'Scope cuts: cannot render without…' instead of 'unavailable…', a merged sentence about drafted rows and predecessor candidates, and a new note that options 4 and 5 require acceptance-criteria rows. Where After falls short of the Change rather than of the facts is in the new blocks themselves: the instructions say to render 'Scope cuts: none' when no deferred/deviates/venue rows exist and to show a 'Drafted acceptance criteria (approval ratifies):' heading between Scope cuts and Council; After instead declines to render either because the acceptance-criteria section was not supplied. A safer wording would keep the verbatim audit and briefing exactly as now, then emit 'Scope cuts: none' (or the actual cut rows) and the 'Drafted acceptance criteria (approval ratifies):' header with its rows or an explicit 'none supplied' line, so the gate always shows the two new lines in the mandated positions without disturbing the Council counts or the five numbered options.

exit: 0
