# eval report: spec-gate (partial run: recommended-row)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 51s

## Change

The recommended-row replay checks that the gate selects the first bundled in-scope row after three cut rows and a single-observation row. Wording pins alone do not show which row the recommendation quotes. Only this sample is in scope.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | unchanged | 13863 | unbundled: holds -> holds (intended but unchanged); bundled: holds -> holds (intended but unchanged); recommendation: holds -> holds (intended but unchanged); zero-rows: holds -> holds (intended but unchanged); engine-only: holds -> holds (intended but unchanged); context: holds -> holds (intended but unchanged); rows: holds -> holds (intended but unchanged); sentences: holds -> holds (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: holds -> holds (intended but unchanged); defaults: holds -> holds (intended but unchanged) |
| recommended-row | github-copilot/gpt-6.1-sol | unchanged | 15381 | unbundled: holds -> holds (intended but unchanged); bundled: holds -> holds (intended but unchanged); recommendation: holds -> holds (intended but unchanged); zero-rows: holds -> holds (intended but unchanged); engine-only: holds -> holds (intended but unchanged); context: holds -> holds (intended but unchanged); rows: holds -> holds (intended but unchanged); sentences: holds -> holds (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: holds -> holds (intended but unchanged); defaults: holds -> holds (intended but unchanged) |

## Feedback

- recommended-row / anthropic/claude-opus-5-5: No fact moved: every fact holds in both Before and After, so the expected fails -> holds transitions are not visible in this sample because Before already satisfied each one. In particular, Before already quoted acceptance row 5 under a row-1 recommendation for bundle-after-cuts and already gave the exact fallback reason for unbundled-facets. The After text differs only cosmetically: the code fences are dropped in favour of bold case headings, the post-reply steps are condensed from a bullet list into one sentence, and in the zero-low gate the Council line now sits above the Acceptance criteria line instead of below it. None of these touch a fact as written, but the zero-low reordering is the one to watch, since a stricter fact about line order would catch it; keep the Council line directly above `Pick one:` as in the initial gate. To keep every fact, preserve the exact strings the facts pin: the first-line marker, a single `[recommended]` tag, `Recommended: 2 - no row bundles more than one outcome.`, the `Withheld: draft PR - #42 already exists` line, the `Loop engine unavailable` line, and the default of 7 for `--allowance=N`. If the Change is meant to show which row the recommendation quotes, this sample cannot tell the two wordings apart; it would need a case where the old wording quotes the wrong row, for example row 4 or row 6 in section B.
- recommended-row / github-copilot/gpt-6.1-sol: No fact moved: every fact holds in both Before and After, so the text does not show the fails-to-holds movement listed under Expected to move. The bundle-after-cuts line is identical in both outputs, quoting acceptance row 5 while recommending row 1, so the Change's target behaviour was already present in Before. After does drift in ways the facts do not cover. It adds a literal `## Briefing` heading directly under the marker line. It drops the `Withheld: draft PR - #42 already exists` line from zero-withheld, although it keeps it in the withheld check. It moves the council line below the acceptance placeholder in zero-low. It shortens the reply-1 handling so the Amend-grant and `Engine: waves` persistence are no longer stated. To keep everything Before kept, the wording should say to render the briefing body without the input's section heading, to print the Withheld line in every case where row 4 is withheld (zero-row cases included), and to keep the explicit grant and engine echo when handling a numeric reply.

exit: 0
