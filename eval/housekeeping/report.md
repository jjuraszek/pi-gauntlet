# eval report: housekeeping (partial run: base-rule-wins)

for: 0ad959b6322f51ecf51c67c55ca310846cb00ced5efd954b867cb7a92bddfe27

wall: 12s

refresh: complete; sample: base-rule-wins; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/base-rule-wins/candidate.json)

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| base-rule-wins | anthropic/claude-opus-5-5 | improved | 11514 | base-applied: fails -> holds (unplanned improvement); override-disclosed: fails -> holds (unplanned improvement); no-execution: holds -> holds (held); repo-source: holds -> holds (held); marker: holds -> holds (held) |
| base-rule-wins | github-copilot/gpt-6.1-sol | unchanged | 8044 | base-applied: holds -> holds (held); override-disclosed: holds -> holds (held); no-execution: holds -> holds (held); repo-source: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- base-rule-wins / anthropic/claude-opus-5-5: Before inverted the compiled override: its Rule conflict section said "the repository's own guidance takes precedence over the base rule" and recommended Ignore, so it retained the console.debug under the README permission and misstated which rule wins, failing base-applied and override-disclosed. After fixes both: it names the base rule with its source file, quotes the README `## Diagnostics` guidance, states plainly that "the fixed rule takes precedence over that README guidance," proposes deletion, and marks Fix as recommended. Both outputs keep no-execution; After's empty `[ ]` boxes with the recommendation marked only by label are exactly what the Change asked for and do not imply a recorded pick. Nothing regressed. One small note for the author: the compiled check lists `overrides: README.md, `## Diagnostics``, and the Change asks that an overrides-sourced rule cite both its file and the heading, which After does; keep that "X takes precedence over Y" sentence as a fixed template so future wording tweaks cannot drift back to merely citing both sources without naming the winner.
- base-rule-wins / github-copilot/gpt-6.1-sol: Nothing moved. After still treats the console.debug line as a finding under the base-rules removal rule and proposes removing it, states plainly that the base rule "takes precedence over" the README.md `## Diagnostics` permission, and presents an unanswered card with empty boxes and only a [recommended] label, describing the PR purely as a consequence of accepting rather than as something already created. Two small things worth preserving from Before that After dropped without affecting any fact: the compiled check id (`code-debug`) and the verbatim quoted line, both of which make the finding easier to verify from the card alone; adding them back under "What was found" would keep the new structure while retaining that precision.

exit: 0
