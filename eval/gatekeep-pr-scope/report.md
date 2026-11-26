# eval report: gatekeep-pr-scope (partial run: post-merge-menu)

for: 02ffb799ff2ffd5a86fcafc25504d8ac87ec8f895789c331a7885606773325d4

wall: 92s

## Change

Report `matched` when marked Integration entries and acceptance rows account for every live ticket row, even when the acceptance criteria came from the design. With one ticket row absent from both spec sections, report `differs` for that original ticket row only. Omit Integration entries and their statuses from the report, evidence, and menus; retain the informational cross-check and actions already offered by the post-merge menu.

Select the contract from spec paths outside the PR body's Integration block. `integration-names-spec-path` checks that an absent path in a nested Integration line neither selects a contract nor blocks the gate. Rerun `integration-not-judged` and `post-merge-menu` to check that scope accounting and explicitly picked actions remain unchanged.

Select integration-not-judged for scope accounting: match a verbatim, marked ticket row once without judging it, keep actual drift visible, and give no claim disposition to an observation under the body's Integration heading. Judge the mixed row's promised behavior and the absent line number separately. Select post-merge-menu for the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. These samples do not cover the rest of the target.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and functionality-only coverage; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-menu | anthropic/claude-opus-5-5 | unchanged | 11951 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |
| post-merge-menu | github-copilot/gpt-6.1-sol | unchanged | 12793 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-menu / anthropic/claude-opus-5-5: No fact moved: every fact holds in both outputs. In After, the own-merge menu still recommends row 1 as ticket coverage, cleanup, publish the guide and tag the release, offers rows 5 and 6 separately with `scripts/publish-guide.sh` and `scripts/tag-release.sh`, and offers no other Integration entry as an action (f1). Variant B runs only the run-folder teardown, says the worktree stays at .worktrees/pr-210, and lists every unpicked command (f2, f5). Variant A posts the PR coverage, syncs the base, runs the tag script once, does not publish or remove the worktree, and settles with `gauntlet: done merged` plus the not-run list and no further menu (f6). No blocker is minted for the deferred email and audit rows, and the coverage block carries only the spec's dispositions (f3, f4). After also drops Before's unsupported 'observable half checked after merge' note on AC4 and paraphrases the spec's tag entry instead of quoting the Integration line with its done-when status, which fits the Change. To keep these facts, keep the wording that names the source of each merger action (PR body for the guide, spec for the tag) with its merge-base command on its own row, keep the sentence that the base sync runs before a release script when cleanup is unpicked, and keep the explicit 'Stop runs no step' and 'The worktree stays at ...' lines. One caution: the opening summary now precedes the `gauntlet: gate=gatekeep-pr/final` header rather than following it; if any consumer expects that header first, restore the order.
- post-merge-menu / github-copilot/gpt-6.1-sol: No fact moved between Before and After. Both menus put ticket coverage, cleanup, publish the guide and tag the release in the single recommended row 1, offer the two merger actions separately with their merge-base scripts and quoted source, keep the other five Integration entries off the menu, and put stop last. In both, variant A posts the PR coverage, syncs the base, runs scripts/tag-release.sh once, leaves the guide unpublished and the worktree intact, and settles with gauntlet: done merged plus the not-run commands and no second menu; variant B runs nothing and lists the worktree path and unpicked commands. The After wording delivers the Change's plain-language opening and single-menu settle without minting a blocker for the deferred email and audit rows or judging ticket rows beyond the spec. Two details are fragile and worth pinning in the wording. First, After's settle says "Checkout: .worktrees/pr-210" and uses a "$WORKTREE" placeholder in the removal command, where Before said "The checkout remains at .worktrees/pr-210"; keep an explicit statement that the worktree remains in place and keep the literal path beside any placeholder so f5 stays unambiguous. Second, After fills retained-payload paths with <kept-...-path> placeholders; keep requiring that every unpicked step prints its command, and that prerequisite sync is reported as run only when a selected step needed it, so f2 and f6 continue to hold.

exit: 0
