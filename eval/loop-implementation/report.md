# eval report: loop-implementation (partial run: scaled-cap-grant)

for: 37c88fb87cf0c52040edb6c7c7a3892883cd75a8e93ab1b658f7552871d1c36f

wall: 97s

## Change

Persist the row-scaled total cap in the ledger, grant positive increments through one parent commit, stop capless legacy ledgers before the ordered table, and keep row funding, seed recovery, validation and child-only windows independent. Select operational row decisions through cap history. New samples are baseline-skipped: new sample, no pre-edit sample evidence; the runner still generates genuine baseline and candidate evidence.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| scaled-cap-grant | anthropic/claude-opus-5-5 | improved | 21336 | stop: fails -> holds (unplanned improvement); grant: fails -> holds (unplanned improvement); parse: fails -> holds (unplanned improvement); independent: fails -> holds (unplanned improvement); windows: holds -> holds (held); entry: fails -> holds (unplanned improvement); validation: holds -> holds (held) |
| scaled-cap-grant | github-copilot/gpt-6.1-sol | improved | 26787 | stop: fails -> holds (unplanned improvement); grant: fails -> holds (unplanned improvement); parse: fails -> holds (unplanned improvement); independent: fails -> holds (unplanned improvement); windows: holds -> holds (held); entry: fails -> holds (unplanned improvement); validation: holds -> holds (held) |

## Feedback

- scaled-cap-grant / anthropic/claude-opus-5-5: After moves five facts from fails to holds and regresses none. Before treated the cap as the resolved maxIterations setting (default 30), refused any `cap +N` action, offered no funding beside the cap at the double-exhausted stop, and had no row-scaled entry formula, so stop/grant/parse/independent/entry all failed there; After persists `cap:` in the ledger, parses `^cap \+([1-9][0-9]*)` with the pipe-stripped words cell, writes `cap +50 |` and `cap: 147` in one `loop: raise cap` commit with iterations and attempts untouched, lists funding and cap as separate replies at the attempts-3 stop, and computes 24×4+1=97 / 0×4+1=1 at entry. The two facts Before already kept (windows and validation) survive intact: After explicitly excludes `loop: raise cap` from child-commit counting, re-fires rule 3 after the grant, and repairs the cap-to-999 child by restoring the saved header while keeping the bumped iteration and bumping attempts. One small tightening to keep in future wordings: After's rule-3 'assumed no stall' in Snapshot 1 is an assumption rather than a stated input; phrasing it as 'the snapshot gives no empty child commits' would make the ordered-table walk rest on the case text rather than an inference, without affecting any fact.
- scaled-cap-grant / github-copilot/gpt-6.1-sol: After moved stop, grant, parse, independent, and entry from fails to holds by introducing the durable cap header, the cap +N human command with its one-commit `loop: raise cap` grant, the `cap +N | words` normalization, the separate funding-vs-cap offers under rule 2, and the rows×4+1 entry calculation; Before rejected all of these as undefined and defaulted to maxIterations 30. The two facts Before already kept (windows and validation) are preserved in After: the grant is explicitly excluded from child-commit counting, the rule-3 stop recurs after the grant, only `loop: retry row 24` starts new windows, and the cap-to-999 child is handled as a changed-header miss with the saved cap restored, iteration 98 retained, row 24 failed at attempts 2 and a repair commit. No regressions observed. Two small polish points for the After wording: in section 4 the retry row says it 'starts new empty-child and validation-miss windows' — keep that phrasing consistent with section 5 so readers do not infer a cap grant can also do so; and in section 1 consider stating in one line that the `cap +50 |` decision is skipped when selecting the operational row decision (After says it in prose) so the 'still row24 failed' selection is unambiguous.

exit: 0
