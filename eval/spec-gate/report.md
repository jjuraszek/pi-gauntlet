# eval report: spec-gate (partial run: scope-cuts-listed)

for: d097923fa0970afaa411da6d42e961433aae8ae6fa628c23a30634a65c01098d

wall: 31s

## Change

Select scope-cuts-listed to check the approval message for an unrepaired ticket. The rendered gate, not the prompt text, shows whether all four marked rows appear once with their kind, apart from the cuts, without a new question. This replay stops after the gate reply; it does not write a spec or start implementation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| scope-cuts-listed | anthropic/claude-opus-5-5 | improved | 8802 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |
| scope-cuts-listed | github-copilot/gpt-6.1-sol | improved | 8122 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- scope-cuts-listed / anthropic/claude-opus-5-5: After adds a single `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with its kind and leaves out the unmarked receipt comparison, which is what moves `moved` from fails to holds. Scope cuts still names only the deferred and deviating rows and still sits between the committed-to line and the Council line, and the approval menu and the plan-engine reply proceed with no new question, so f2, f3 and no-question are kept. One weakness: the fourth row is cut off mid-word ("against the real ide - live check"), which suggests a per-row length cap. I still counted it because the row is identifiable and carries its kind, but a stricter reader might not. To make this robust, the wording should say each marked row is quoted in full, or shortened only at a word boundary to a recognisable phrase, and never cut mid-word. Keep the current instructions that the line comes only from marked Integration rows, sits immediately under Scope cuts, and raises no question.
- scope-cuts-listed / github-copilot/gpt-6.1-sol: After adds a single `Not acceptance criteria:` line directly below Scope cuts, which is what moves `moved` from fails to holds: it lists the four marked Integration rows once each with their kind (person step, merge or deploy condition, environment state, live check) and leaves out the unmarked receipt comparison. Scope cuts still names only the deferred refunds row and the deviating export row, and still sits between the committed-to line and the Council line, so f2 and f3 are kept. The menu is unchanged and the reply "1" proceeds to the plan engine with no placement question, so no-question is kept. One fragility: the fourth row is truncated mid-word ("...against the real iden - live check"), which suggests a length cap on the row text. It is still identifiable here, but a tighter cut could make a row unrecognisable and flip `moved` back. To guard against that, the wording should say to render each marked row's text in full (or a short complete paraphrase) followed by its kind, never clipped mid-word, while keeping the line directly under Scope cuts and separate from it.

exit: 0
