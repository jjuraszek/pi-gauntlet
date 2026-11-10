# eval report: gatekeep-pr (partial run: post-step-pr-named)

for: c20ea711ca78f59e4ef38c9a0005a1828400c32a80ec4aeeffe0fdc3d7157fa0

wall: 85s

## Change

Resolve merger actions named in the PR body or head spec into post steps using only merge-base overrides, AGENTS.md and directly linked documents. Exactly one distinct documented command makes an action runnable and mandatory in row 1. Deduplicate action sources, repeated command citations and matching cleanup items. Keep missing or ambiguous commands and unresolved tokens open with their source sentences in the menu and closing message. PR text supplies the action, never command authority; observations and automatic deployments are not merger actions.

Select only post-step-pr-named for this increment. Its synthetic merged PR exercises one unique command, duplicate sources and citations, an override match, missing and ambiguous commands, an unresolved token, and observation-only text. Retain all other sample records as historical evidence, not current coverage. Coverage is sample-scoped, not a target-wide pass or live PR verification.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-step-pr-named | anthropic/claude-opus-5-5 | improved | 21932 | unique-command: fails -> holds (intended change); override-match: fails -> holds (intended change); no-command: fails -> holds (intended change); ambiguous-command: fails -> holds (intended change); unresolved-token: fails -> holds (intended change); observation: holds -> holds (intended but unchanged); execution: fails -> holds (intended change) |
| post-step-pr-named | github-copilot/gpt-6.1-sol | improved | 18549 | unique-command: fails -> holds (intended change); override-match: fails -> holds (intended change); no-command: fails -> holds (intended change); ambiguous-command: fails -> holds (intended change); unresolved-token: fails -> holds (intended change); observation: holds -> holds (intended but unchanged); execution: fails -> holds (intended change) |

## Feedback

- post-step-pr-named / anthropic/claude-opus-5-5: After moves every targeted fact to holds and keeps the one fact Before already held (observation): the menu now quotes each source sentence verbatim beside the runnable rows and the unnumbered open actions, folds the notify action into the single cleanup-item row with its PR sentence, orders base sync before scripts/publish-handbook.sh, runs scripts/notify-maintainers.sh exactly once, posts PR coverage as part of row 1, and settles with gauntlet: done merged without re-rendering a menu. Before failed chiefly because it never showed the source sentences (it only paraphrased the action names) and because row 1 omitted the runnable PR-coverage post, so 'Coverage was not posted' broke execution. Nothing regressed in After; the only wording worth tightening is to avoid calling the notify item a separate 'row 5' in prose while also describing it as the cleanup item's row — e.g. 'notify maintainers (cleanup item, one row)' — so a reader cannot mistake it for a duplicated PR-named step, and to keep the closing message's open-action bullets exactly mirroring the menu's unnumbered list, which After already does.
- post-step-pr-named / github-copilot/gpt-6.1-sol: After delivers every intended move: the publish-handbook step appears once in row 4 with its documented command and quoted source sentence and sits inside the recommended composite row 1; notify-maintainers is a single cleanup-override row carrying the PR sentence and runs once after publication; search-index, archive migration and dashboard refresh stay open and unnumbered with their source sentences in both the menu and the closing block, with the two-hop doc/search.md explicitly rejected as authority; observation and automatic deployment are excluded; and the run syncs base before publishing, posts coverage, keeps the primary checkout, and ends with `gauntlet: done merged` with no second menu. The only fact Before already held was observation, and After keeps it. Note that Before's failures were not just missing execution but missing provenance: it never quoted the source sentences for open actions and treated the second-hop `deep-reindex.sh` as resolved, so the After wording that quotes each source sentence verbatim next to its open reason and names the one-hop limit is exactly what carries these facts — keep that explicit 'The PR assigns: "..."' pattern and the one-hop statement in any future revision, and keep the composite row 1 ordering (coverage, cleanup/base sync, publish, notify) so the 'after publication' and 'after base sync' orderings remain visible.

exit: 0
