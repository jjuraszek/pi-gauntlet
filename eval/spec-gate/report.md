# eval report: spec-gate (partial run: scope-cuts-listed)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 33s

## Change

The recommended-row replay checks that the gate selects the first bundled in-scope row after three cut rows and a single-observation row. Wording pins alone do not show which row the recommendation quotes. Only this sample is in scope.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| scope-cuts-listed | anthropic/claude-opus-5-5 | improved | 12532 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |
| scope-cuts-listed | github-copilot/gpt-6.1-sol | improved | 11202 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- scope-cuts-listed / anthropic/claude-opus-5-5: After moved the `moved` fact by adding a single `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with their marker kinds and leaves out the unmarked receipt comparison; Before had no such line. Scope cuts still names only the deferred and deviating rows and still sits between the committed-to line and the Council line, and the menu and the plan-engine choice proceed with no placement question, so nothing Before kept was lost. Three things are fragile, though. The fourth entry is truncated mid-word ("against the real ide - live check"), so say that each row is quoted in full and never shortened. After also inserts a new "Drafted acceptance criteria (approval ratifies)" block between Scope cuts and Council, which the Change does not ask for and which repeats the elsewhere row next to the cuts; if it is not intended, say that nothing but the `Not acceptance criteria:` line goes between Scope cuts and the Council line. Finally, the reply echo changed to "I approve option 1", which reads as the assistant approving rather than the user; wording such as "Approved with the plan engine" keeps the voice Before had. Note that the recommendation is still row 2 with the reason "no row bundles more than one outcome" in both outputs, so this sample shows no movement on the recommended-row behaviour the Change describes.
- scope-cuts-listed / github-copilot/gpt-6.1-sol: After adds a `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with their kinds (person step, merge or deploy condition, environment state, live check) and omits the unmarked receipt comparison, which is what moves `moved` from fails to holds. Scope cuts still names only the deferred refunds row and the deviating export row, still sits between the committed-to line and the Council line, and the menu and the user's choice of the plan engine proceed with no question about the moved rows, so f2, f3 and no-question are kept. One weakness: the fourth row is cut off mid-word ("against the real iden - live check"); it is still identifiable so I counted it, but the wording should say to quote each marked row in full, or give a short label for it, rather than cutting it at a length limit, so a stricter reading cannot fail it. Separately, and outside these facts, After's recommendation is unchanged from Before (2 - loop, "no row bundles more than one outcome"), so if the Change was meant to make this sample recommend the plan engine from the first bundled in-scope row, this output does not show that yet.

exit: 0
