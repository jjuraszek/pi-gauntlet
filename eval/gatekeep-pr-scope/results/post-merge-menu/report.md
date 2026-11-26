# eval report: gatekeep-pr-scope (partial run: post-merge-menu)

for: fe8ab5d3633579fb62f48545a418b76c7055fa570612db93b67e74caf30e7b97

wall: 96s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. Keep `differs` for missing or changed ticket rows, and give Integration entries no outcome or blocker.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-menu | anthropic/claude-opus-5-5 | unchanged | 11166 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |
| post-merge-menu | github-copilot/gpt-6.1-sol | unchanged | 12776 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-menu / anthropic/claude-opus-5-5: No fact moved: all six hold in both outputs, which matches the expected holds -> holds for f1, f2 and f6. After keeps the own-merge menu intact: row 1 is the only recommendation and combines ticket coverage, cleanup, publish the guide and tag the release; each action is also offered separately with its merge-base command and quoted source; none of the other five Integration entries appears; stop is last. Variant A posts the PR coverage, syncs the base, runs the tag command once and settles with `gauntlet: done merged` plus the not-run list, without publishing the guide, removing the worktree or showing another menu. Variant B runs no post step, leaves `.worktrees/pr-210` in place and names it, and lists every unpicked command. After's opening is the two-sentence behavior-name summary the Change asks for, and it drops Before's unsupported "production timing is checked after merge" and "observable half checked after merge" wording, so AC4 is no longer judged beyond the spec's paging-bound mechanism. To keep these facts stable, keep three things explicit in the wording: the run-folder teardown is not a post step, the settle block always prints the worktree path, and each not-run item carries its full command, including the base-pull prerequisite for the release commands under stop.
- post-merge-menu / github-copilot/gpt-6.1-sol: No fact moved: all six hold in both outputs, which matches the expected holds -> holds for f1, f2 and f6. After still renders one own-merge menu with the combination as row 1 and the only recommendation, guide publication and tagging as separate rows with their merge-base commands and source quotes, and stop last. Variant A posts the PR coverage, syncs the base, runs the tag command once and settles with `gauntlet: done merged` plus the not-run list, with no second menu. Variant B runs nothing and names .worktrees/pr-210 and the unpicked commands. After also drops Before's unsupported "production timing is checked after merge" and "observable half checked after merge" wording and gives the two-sentence behavior-named opening the Change asks for. Three things are worth tightening to keep these facts safe. First, B's sentence about not being able to simulate "the prescribed draft-retention and teardown operations" could be read as saying stop would normally run teardown; say plainly that stop runs nothing and leaves the worktree. Second, neither output prints the unpicked ticket-coverage or PR-coverage post command in the not-run list, only a draft placeholder; print the actual `gh` comment command so "names its unpicked step commands" holds without leniency. Third, keep the wording that the base pull is an implied prerequisite of a picked release command rather than a separately picked step, so A's sync is not read as running an unselected row.

exit: 0
