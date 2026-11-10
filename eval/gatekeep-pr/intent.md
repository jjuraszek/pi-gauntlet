for: c20ea711ca78f59e4ef38c9a0005a1828400c32a80ec4aeeffe0fdc3d7157fa0

## Change

Resolve merger actions named in the PR body or head spec into post steps using only merge-base overrides, AGENTS.md and directly linked documents. Exactly one distinct documented command makes an action runnable and mandatory in row 1. Deduplicate action sources, repeated command citations and matching cleanup items. Keep missing or ambiguous commands and unresolved tokens open with their source sentences in the menu and closing message. PR text supplies the action, never command authority; observations and automatic deployments are not merger actions.

Select only post-step-pr-named for this increment. Its synthetic merged PR exercises one unique command, duplicate sources and citations, an override match, missing and ambiguous commands, an unresolved token, and observation-only text. Retain all other sample records as historical evidence, not current coverage. Coverage is sample-scoped, not a target-wide pass or live PR verification.

## Expected to move

- post-step-pr-named/unique-command: fails -> holds - Offer one documented publish command in row 1 and retain the action source.
- post-step-pr-named/override-match: fails -> holds - Fold the matching action into the cleanup item's single row and execution.
- post-step-pr-named/no-command: fails -> holds - Keep the source sentence open rather than executing PR text or a second-hop command.
- post-step-pr-named/ambiguous-command: fails -> holds - Keep two distinct documented commands unresolved, without guessing.
- post-step-pr-named/unresolved-token: fails -> holds - Keep an action with an unfilled token open instead of running it.
- post-step-pr-named/observation: fails -> holds - Exclude observation-only and automatic actions from post steps.
- post-step-pr-named/execution: fails -> holds - Run the picked trusted steps once after base sync, then settle without another menu.

## Validation boundary

Judge every candidate fact absolutely, not only improvement over baseline. Preserve cleanup ownership, branch-deletion and base-sync guards. The runner assembles both arms from the working-tree file list; no baseline file is removed in this increment. Later removal of decision-menu.md limits baseline completeness, so comparison direction alone is never evidence of preserved mechanics. Other samples, live commands and multi-PR dispatch are not covered here.
