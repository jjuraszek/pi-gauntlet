# eval report: gauntlet (partial run: pr-body-drafted-row)

for: c4a998790b00da8a2ddb379fc6330df343e3a0f6b3a3fe3e7dc43cad44ebd062

wall: 29s

## Change

Count grouped ticket rows after sorting: moved entries get no AC index, and the companion carries Integration verbatim. Keep one drafted constraint row for several malformed-input scenarios of the same functionality.

Select workflow-stage-ticket-row to check how the spec writer sorts an unrepaired ticket. A source-text assertion cannot show whether the writer keeps a whole mixed row while moving only its external clause, or preserves an existing entry's nested lines. Stop at the authored sections; this sample does not test the approval summary or a tracker write.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-drafted-row | anthropic/claude-opus-5-5 | unchanged | 5529 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |
| pr-body-drafted-row | github-copilot/gpt-6.1-sol | unchanged | 5580 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-drafted-row / anthropic/claude-opus-5-5: All three facts hold in both outputs, so the After wording moved nothing on this case; f1 was expected to go fails -> holds, but Before already rewrote the PR-description proof to the empty-directory observable and kept the release-script row as a behavior. After reaches the same result through the new sorting vocabulary (labeling the PR-description sketch a pipeline result, stating it becomes neither a row nor an Integration entry, omitting `## Integration`) and still writes exactly two unchecked in-scope rows under `Drafted from the design, no ticket rows:` with no cut question and no `none` fallback. To keep this stable, retain the wording that makes a functionality producing pull-request text stay an acceptance criterion because files deliver it, and the wording that a stage-only proof sketch attached to a committed outcome is rewritten to a file-level observable rather than dropped, moved to Integration, or raised as a scope question. One thing to watch: After's row 1 embeds the proof method (`as a listing of that directory in a checkout of the delivered commit shows`) inside the row; that is harmless here, but wording that keeps rows to the observable outcome and leaves the check to `## Tests` would reduce the risk of a row's observable drifting toward a proof artifact.
- pr-body-drafted-row / github-copilot/gpt-6.1-sol: On this case nothing moved between the two outputs: both drop the PR-description listing as a sole observable (Before omits it as workflow-stage proof, After replaces it with the empty-directory check in the delivered checkout), both keep the release-script pull-request-body behavior as an in-scope acceptance row, both render exactly two unchecked in-scope rows under 'Drafted from the design, no ticket rows:', and neither asks a cut or scope question or falls back to none. Note that f1 was expected to move fails -> holds, but the Before text shown here already holds, so the After wording shows no measurable gain on this sample. After's second row matches the Design commitment more literally ('writes the changelog section into the pull request body') than Before's Given/running paraphrase, which is a safer rendering for f2; to keep all three facts, retain the explicit instruction that a proof sketch about PR-description text is rewritten to the outcome's own file-checkable observable rather than dropped or turned into a row, that script-produced PR text stays a behavior row, and that rewriting a proof never triggers a scope-cut question.

exit: 0
