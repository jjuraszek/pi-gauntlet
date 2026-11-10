for: 1e0e326d4e8c00118f54ab0afb38b9ed29bbec6a157c38d5e310a0d61b13ed1e

## Change

Collect terminal follow-ups in one post menu. Recommend a combination that names its member rows, keep each runnable step separately selectable, omit the duplicate PR coverage copy from the combination, and settle after the selected set finishes. Keep pre-merge drafted replies available, separate cleanup overrides from checkout cleanup, and preserve skipped-step reasons and unrun payloads.

Select only post-menu-combined for this increment. It covers one merged PR with a drafted reply, two coverage destinations, partially runnable checkout cleanup, a notification and a fully skipped release. Retain all other sample results as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. Set parsing edge cases, batch scheduling and PR-named command resolution are not covered by this sample.

## Expected to move

- post-menu-combined/single-menu: fails -> holds - A post selection ends the run instead of opening another terminal menu.
- post-menu-combined/combination: fails -> holds - Row 1 names the recommended combination and its member row numbers.
- post-menu-combined/runnable-rows: fails -> holds - Each executable step has its own informative row.
- post-menu-combined/guards: fails -> holds - Fully skipped release is unnumbered and partial cleanup names the skipped base pull.
- post-menu-combined/draft: fails -> holds - Unposted pre-merge reply drafts remain selectable after merge.
- post-menu-combined/execution: fails -> holds - A single pick runs the recommended steps in order, then reports results and unrun work.

## Validation boundary

Judge every candidate fact absolutely, not only improvement over baseline. Preserve cleanup ownership, branch-deletion and base-sync guards. The runner assembles both arms from the working-tree file list; no baseline file is removed in this increment. Later removal of decision-menu.md limits baseline completeness, so comparison direction alone is never evidence of preserved mechanics. No other sample or live PR runs for this increment.
