# eval report: gatekeep-pr-scope (partial run: post-merge-menu)

for: 14fd05ac2b38fff43a320dfe4e4afd2f32a05048cf58369319a2927517060b0f

wall: 82s

## Change

Select post-merge-menu for Integration handling. The standard PR-named step mechanism offers the merger's after-merge assignments from the spec and PR body. Neither source authorizes execution. Preserve earlier scope results as partial evidence; do not rerun other samples.

Bind this intent to the shared gatekeep-pr assembly after #160's rejection, overrule and repair/report changes. Validate assembly and command wiring deterministically only; preserve all saved replies and report verdicts as earlier-revision evidence. Run no scope model sample for this repair; selected #160 evidence lives in eval/gatekeep-pr/report.md.

Describe scope in a two-sentence plain-language opening using behavior names, not row numbers or labeled fields. Preserve covered mechanisms, deferred references, deliberate deviations and their approved reasons, external repositories and post-merge observations; retain detailed mapping under show evidence and in posted coverage.

Render the single post menu after approve or merge, execute the validated selection once in step order, and settle with the not-run list. Pause only for a selected nested skill. The replay wrapper requests no post-pick menu re-render except inspection or invalid-input handling. Preserve cleanup guards and selected-only authority.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| post-merge-menu | anthropic/claude-opus-5-5 | unchanged | 7166 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |
| post-merge-menu | github-copilot/gpt-6.1-sol | unchanged | 10359 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f3: holds -> holds (held); f4: holds -> holds (held); f5: holds -> holds (held); f6: holds -> holds (intended but unchanged) |

## Feedback

- post-merge-menu / anthropic/claude-opus-5-5: No fact moved: both outputs render the own-merge menu with row 1 as the sole recommended combination (ticket coverage, cleanup, publish the guide, tag the release), offer publish and tag separately with their merge-base commands and quoted source, and keep the other five Integration entries off the menu; both treat AC3 and AC5 as deferred to acme/widgets#46 without a blocker and judge only the spec's rows; in A both post the PR coverage, sync the base, run the tag command once, leave the guide unpublished and the worktree in place, and settle with gauntlet: done merged plus the not-run list and no further menu; in B both run no post step and name .worktrees/pr-210 with the unpicked commands. The After wording delivers the Change's intended shape here (two-sentence behavior-named opening without row numbers, single post menu, one execution in step order, settle with the not-run list). To keep these facts stable, keep the explicit 'No step runs' and 'The checkout is left as found' lines in the stop variant, keep the 'Checkout <path> on local branch' line in the settle block, and keep each not-run bullet carrying its exact command. Two small things to watch: the After final-menu stop row now says the worktree is left as it is where Before said it is removed, so make sure that matches the intended cleanup guard; and the After coverage block dropped the 'observable half checked after merge' note on AC4, which the Change asks to preserve as a post-merge observation in posted coverage, so consider restoring it even though no fact in this case tests it.
- post-merge-menu / github-copilot/gpt-6.1-sol: No fact moved: After keeps all six, matching the expected holds -> holds for f1, f2 and f6. The menu still puts ticket coverage, cleanup, publish the guide and tag the release in the recommended row 1, offers the two merger actions separately with their merge-base commands and source quotes, and leaves the other five Integration entries off. Variant A posts PR coverage, syncs the base, runs the tag command once, and settles with `gauntlet: done merged` plus the not-run list and no second menu. Variant B runs nothing and names the worktree path and every unpicked command. Three places are thinner than Before and worth pinning in the wording so later edits do not erode f5 and f6. First, the stop row now reads "leave the checkout unchanged" instead of promising to list what remains undone; keep that listing an explicit requirement of the settle step. Second, in A the unpicked publish step is given as a bare `scripts/publish-guide.sh` while B gives the full `(cd '<primary>' && ...)` form; require the full runnable command for every not-run step in both variants. Third, the opening and the posted AC4 line dropped Before's note that production timing is observed after merge; the Change asks to preserve post-merge observations, so restore that clause.

exit: 0
