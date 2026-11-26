# eval report: gatekeep-pr-scope (partial run: post-merge-menu)

for: 9792f40c5e710241c5f6af7b1370c1f9dc686de0ba6e475d6bd67a0c422839f9

wall: 74s

## Change

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-menu | anthropic/claude-opus-5-5 | unchanged | 10636 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |
| post-merge-menu | github-copilot/gpt-6.1-sol | unchanged | 6627 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-menu / anthropic/claude-opus-5-5: No fact moved: all six hold in both Before and After, matching the expected holds -> holds for f1, f2 and f6. After keeps the own-merge menu intact: row 1 is the only recommendation and combines ticket coverage, cleanup, publish the guide and tag the release; rows 5 and 6 offer each action separately with its merge-base script and source quote; none of the other five Integration entries appears; stop is last. Variant A posts the PR coverage, syncs the base and runs the tag script once, then settles with `gauntlet: done merged` and a not-run list, without publishing the guide, removing the worktree or showing another menu. Variant B runs no post step, leaves .worktrees/pr-210 in place and lists every unpicked command. Three wording choices are worth keeping because the facts rest on them: the explicit "Stop runs no step" line in B, the worktree path in the settle line, and a command on every not-run line. After's line that the cleanup base pull "already happened as the tag step's prerequisite" is accurate, but keep it clearly apart from the result lines so it is not read as a picked cleanup step. Both outputs still render the pre-merge final menu although the case says to start at the own-merge menu; this moves no fact, but dropping it would follow the case more closely. The two-sentence opening in After delivers the Change without row numbers or labeled fields and costs no fact here.
- post-merge-menu / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both menus put the combination (ticket coverage, cleanup, tag, publish) as the only recommended row 1, offer tag and publish separately with their merge-base scripts, omit the other five Integration entries, keep stop last, and both variants settle with `gauntlet: done merged` plus a not-run list without a second menu. After's opening is a cleaner two-sentence behavior description and drops Before's 'production timing is checked after merge' / 'observable half checked after merge' wording, which keeps AC4 from being judged beyond the spec's paging-bound mechanism; keep that. Small risks to watch in After: the added phrases 'Nothing blocks merging' and 'no repair was selected' and the trailing 'smaller paging-helper point remains unchanged' bullet are harmless here but add non-step items to the not-run list; the line 'The base synchronization needed by tagging ran successfully, although the cleanup group was not selected' sits among not-run bullets and could be read as a result line in the wrong place, so move it next to the `base: synced` result. In A the result lines appear twice (inline and after settlement) in both outputs; state that the tag command ran once so the repeat is not read as a second execution. In B, keep the explicit sentence that no coverage post, cleanup, tag, or publish runs, and keep the worktree path plus the unpicked commands, as After does.

exit: 0
