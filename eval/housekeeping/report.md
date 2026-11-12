# eval report: housekeeping (partial run: overrides-rule-cited)

for: 0ad959b6322f51ecf51c67c55ca310846cb00ced5efd954b867cb7a92bddfe27

wall: 23s

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replays cover card checkpoints, not live selection or delivery. Keep every unanswered card box empty and mark the recommendation only with its label, so the PR card does not imply a recorded choice. For an overrides-sourced rule, cite both its file and `## housekeeping` in the card's explanation.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| overrides-rule-cited | anthropic/claude-opus-5-5 | unchanged | 11325 | override-finding: holds -> holds (held); section-cited: holds -> holds (held); no-execution: holds -> holds (held); source-file: holds -> holds (held); marker: holds -> holds (held) |
| overrides-rule-cited | github-copilot/gpt-6.1-sol | unchanged | 8843 | override-finding: holds -> holds (held); section-cited: holds -> holds (held); no-execution: holds -> holds (held); source-file: holds -> holds (held); marker: holds -> holds (held) |

## Feedback

- overrides-rule-cited / anthropic/claude-opus-5-5: No fact moved. After still identifies the trailing period on docs/setup.md:1 as the finding, explains the no-period heading rule as the project's own rule, cites both .pi/gauntlet-overrides.md and the `## housekeeping` section, and keeps all three option boxes empty with the recommendation marked only by its label and the fix described conditionally under 'What happens if you accept'. Two minor wording wobbles worth tightening so they don't drift in other cases: the Ticket and Ignore lines say 'them' and 'they' although this card has exactly one finding (use 'this finding' / 'it', or key the plural on the actual count), and the Fix line mixes the plain-language register of the rest of the card with internal jargon ('Build this class in its own worktree and open its own pushed PR') that the preceding section already explained more simply; one phrasing, e.g. 'Fix - remove the period in a separate pull request against the default branch; your checkout stays unchanged', would say the same thing without the shift in tone. After also drops Before's explicit note that the overrides rule 'adds a new check and does not conflict with any base rule'; not required by the facts, but restoring one sentence would keep that context without hurting the Change.
- overrides-rule-cited / github-copilot/gpt-6.1-sol: No fact moved. After still names the trailing period on docs/setup.md:1 as the finding, cites both `.pi/gauntlet-overrides.md` and `## housekeeping` as the rule's source, keeps all three option boxes empty with only the `[recommended]` label on Fix, and frames the PR and edit purely under "What happens if you accept", so no reader would take the heading as already changed. Two small wording tweaks would tighten it without risking any fact: say "it"/"this heading" instead of "them" in the Ticket and Ignore lines (the card covers one finding, and the plural reads as boilerplate), and consider keeping Before's one-line note that the overrides rule adds a check and conflicts with no base rule, which makes the override-sourced origin even harder to mistake for a base rule.

exit: 0
