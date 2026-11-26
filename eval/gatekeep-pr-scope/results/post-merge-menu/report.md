# eval report: gatekeep-pr-scope (partial run: post-merge-menu)

for: c90090ed9730dbe5d97f89090389b8e2b559be8a964d9db3b458a37f6445a02d

wall: 78s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. With one ticket row absent from both spec sections, report `differs` for that original ticket row only. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and PR-named steps, including open actions without trusted commands. Keep observation-only clauses out of post steps without promising a later judgment.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. State the reason tagging the release is open without giving it a runnable row, and promise no later judgment of the mixed row's staging confirmation. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-menu | anthropic/claude-opus-5-5 | unchanged | 12282 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |
| post-merge-menu | github-copilot/gpt-6.1-sol | unchanged | 10763 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-menu / anthropic/claude-opus-5-5: No fact moved: both outputs keep all six. After's own-merge menu still recommends the combination of ticket coverage, cleanup, publish the guide and tag the release as row 1, offers each action separately with its merge-base script, and puts no other Integration entry on the menu. In B, stop runs only the run-folder teardown, leaves .worktrees/pr-210 in place and lists every unpicked command. In A, the PR coverage is posted, the base is synced, the tag script runs once, the guide and the worktree are untouched, and the output settles with `gauntlet: done merged` and no second menu. After also delivers the Change where Before did not: it drops Before's 'production timing is checked after merge' and 'observable half checked after merge' wording, so no later judgment is promised. Three things in After are worth tightening so they cannot erode f6 or f2 later. First, the result lines 'post coverage to PR: done' and 'tag the release: done' appear both inline and in the settlement, which a stricter reader could take as the step running twice; say that result lines are printed once, in the settlement. Second, Variant A keeps `coverage-ticket.XXXXXX` although the saved file was `coverage.XXXXXX`, and Variant B keeps two bodies where only one was saved; name the kept file consistently. Third, stop's menu row now says 'keep the worktree as it is' on the final menu while the own-merge stop says 'run nothing'; keep that 'run nothing; list unpicked steps with their commands' wording fixed, since f2 and f5 depend on it.
- post-merge-menu / github-copilot/gpt-6.1-sol: No fact moved: After keeps the same seven-row menu, with row 1 the only recommendation combining ticket coverage, cleanup, publish the guide and tag the release, rows 5 and 6 each carrying its merge-base command and source quote, no other Integration entry offered, and stop last. Variant A still posts PR coverage, syncs the base, runs `scripts/tag-release.sh` once, leaves the guide unpublished and the worktree in place, and settles with `gauntlet: done merged` plus the not-run commands and no second menu. Variant B still runs nothing, names `.worktrees/pr-210` and lists the unpicked commands. The Change shows where it should: the opening now names the paging limit and four-second deadline as the mechanism instead of promising a post-merge production check, and the AC4 coverage line drops "observable half checked after merge". Two wording risks are worth tightening. First, the "Preserve ... through teardown" sentences in A and B refer to saved-progress teardown, but a reader could take them as checkout teardown; say "saved-progress teardown (not the worktree)" or drop the sentence when the fixture supplies no run folder, so f5 and f6 stay unambiguous. Second, the stop row no longer says it lists what remains undone; restoring that phrase keeps the menu's promise aligned with the settled not-run list.

exit: 0
