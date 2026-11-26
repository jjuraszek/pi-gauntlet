# eval report: spec-gate (partial runs: recommended-row, scope-cuts-listed)

for: ec3171f5beacef50bf911ba58c0e116940449abc691c1a2a795b332ade7f8e57

wall: recommended-row 53s; scope-cuts-listed 33s

## Change

The recommended-row replay checks that the gate selects the first bundled in-scope row after three cut rows and a single-observation row. Wording pins alone do not show which row the recommendation quotes. The scope-cuts-listed replay checks that the same gate lists the two cuts separately from the four moved rows.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | unchanged | 13880 | unbundled: holds -> holds (intended but unchanged); bundled: holds -> holds (intended but unchanged); recommendation: holds -> holds (intended but unchanged); zero-rows: holds -> holds (intended but unchanged); engine-only: holds -> holds (intended but unchanged); context: holds -> holds (intended but unchanged); rows: holds -> holds (intended but unchanged); sentences: holds -> holds (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: holds -> holds (intended but unchanged); defaults: holds -> holds (intended but unchanged) |
| recommended-row | github-copilot/gpt-6.1-sol | unchanged | 12325 | unbundled: holds -> holds (intended but unchanged); bundled: holds -> holds (intended but unchanged); recommendation: holds -> holds (intended but unchanged); zero-rows: holds -> holds (intended but unchanged); engine-only: holds -> holds (intended but unchanged); context: holds -> holds (intended but unchanged); rows: holds -> holds (intended but unchanged); sentences: holds -> holds (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: holds -> holds (intended but unchanged); defaults: holds -> holds (intended but unchanged) |
| scope-cuts-listed | anthropic/claude-opus-5-5 | improved | 9570 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |
| scope-cuts-listed | github-copilot/gpt-6.1-sol | improved | 10869 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- recommended-row: Both models quoted acceptance row 5, not a cut row or the single-observation row 4, and named both outcomes. The baseline already did this. See the [judgments](results/recommended-row/candidate.json).

- scope-cuts-listed / anthropic/claude-opus-5-5: After adds a single `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with their kinds and leaves out the unmarked receipt comparison, which is what moves `moved` from fails to holds; Before had no such line. Scope cuts still names only the deferred refunds row and the deviating export row with their dispositions, it still sits between the committed-to line and the Council line, and the gate asks nothing about the moved rows before the normal menu and the plan-engine approval, so f2, f3 and no-question are kept. One weakness: the fourth entry is truncated mid-word ("against the real ide - live check"), which is still identifiable as the deployed login row but would fail a stricter reading, so the wording should say to quote each marked row in full, or to shorten only at a word boundary with an explicit ellipsis, and never cut the marker kind. After also adds a `## Briefing` heading and changes the committed-to line's path and worktree to placeholders; neither affects a fact here, but if those are unintended, pin the wording so the briefing renders without an added heading and the committed-to line keeps its concrete values.
- scope-cuts-listed / github-copilot/gpt-6.1-sol: After moved `moved` by adding one `Not acceptance criteria:` line directly below Scope cuts; it lists the four marked Integration rows once each with their kinds and leaves out the unmarked receipt comparison, where Before had no such line at all. The other three facts are unchanged: Scope cuts still names only the deferred and deviating rows with their dispositions (no `elsewhere` venue row, no Integration entry), it still sits between the committed line and the Council line, and reply `1` still proceeds to the plan engine with no question about the moved rows. The one weakness is that the fourth row is cut mid-word ("against the real iden - live check"); it is still identifiable, so I counted it, but a stricter reader could fail it. To keep this stable, have the wording say each marked row is quoted in full or shortened only at a word boundary, always followed by its marker kind, and keep the instructions that the line draws only from marked Integration rows and raises no question. The Change paragraph is about the recommended-row replay, but in this sample the recommendation is identical in both outputs (2 - loop, "no row bundles more than one outcome"), so nothing here shows that part of the change taking effect.

exit: 0
