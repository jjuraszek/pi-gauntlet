for: e06c4f6e09931c0d8fdc05337f4e345dac8302bfd23b3feb1d343bf14bff3e31

## Change
forge-skill now binds any file a repo's AGENTS.md or CLAUDE.md routes to it, and its authoring rules gain "No history": an added or changed line carries no date or narration of a rule's past, and when the edited rule sits inside a changelog, dated-entry list, or "previously" section, that section's surviving rules move into the section that owns their topic and the history section is deleted in the same edit. A history section the edit does not touch stays byte-identical. Every other rule (imperative voice, minimal diff, low conditionality, one example) is unchanged.

## Expected to move
- history-section-cleanup/history-gone: fails -> holds - the No history rule folds the touched `## History` section into its topic section and deletes it.
- history-section-cleanup/rule-in-deploy: fails -> holds - the surviving profile rule moves from the dated bullet into `## Deploy`.
- history-section-cleanup/no-dates-added: fails -> holds - the baseline edits the dated bullet in place, adding a line that carries a date; the No history rule puts the rule in `## Deploy` without a date.
