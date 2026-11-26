# eval report: spec-gate (partial run: scope-cuts-listed)

for: 95f907b8b9de977f3729b7bec0ee83d2f670d851b1a4eaeb1980e0646882d493

wall: 11s

## Change

Only scope-cuts-listed was rejudged. The judge reused both models' saved replies to check that the approval message lists the four marked Integration rows once with their kinds, apart from the scope cuts, without asking a placement question.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| scope-cuts-listed | anthropic/claude-opus-5-5 | improved | 10866 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |
| scope-cuts-listed | github-copilot/gpt-6.1-sol | improved | 5471 | f2: holds -> holds (held); f3: holds -> holds (held); moved: fails -> holds (intended change); no-question: holds -> holds (held); f1: holds -> holds (held) |

## Feedback

- scope-cuts-listed / anthropic/claude-opus-5-5: After adds a single `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with their marker kinds and omits the unmarked receipt comparison, which is what moves `moved` from fails to holds. Scope cuts still names only the deferred and deviating rows, still sits between the committed-to line and the Council line, and the menu and the plan-engine choice proceed with no placement question, so f2, f3 and no-question are kept. Two things are fragile. The fourth entry is truncated mid-word ("against the real ide - live check"); it is still identifiable as the deployed-login live check, but the wording should say to render each row's text in full, or as a deliberate short label, rather than cutting it at a character limit. After also inserts a "Drafted acceptance criteria (approval ratifies)" block between Scope cuts and Council; f3 survives because Scope cuts is still between the two lines, but if that block is not intended, say that only the `Not acceptance criteria:` line goes between Scope cuts and Council. The reply narration also shifted to "I approve option 1", which reads as the assistant approving; "Approved with the plan engine" from Before is clearer about who approved.
- scope-cuts-listed / github-copilot/gpt-6.1-sol: After adds a single `Not acceptance criteria:` line directly below Scope cuts that lists the four marked Integration rows once each with their marker kinds and leaves out the unmarked receipt comparison, which is what moves `moved` from fails to holds. Scope cuts still names only the deferred refunds row and the deviating export row, still sits between the committed-to line and the Council line, and the gate still shows the normal four-row menu and takes "1" as the plan engine without asking about the moved rows, so f2, f3 and no-question are kept. One weakness to fix: the fourth entry is truncated mid-word ("login succeeds against the real iden - live check"), which a stricter reader could say does not fully list the deployed-login row; word the instruction so each row is carried verbatim or as a deliberate short label (e.g. "deployed login - live check") rather than cut at a character limit, and keep the line positioned between Scope cuts and the blank line before Council so f3 continues to hold.

exit: 0
