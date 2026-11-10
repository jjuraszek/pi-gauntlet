for: 3736c94b4b4424fa0885782867e6007f2b35451aaf8b6ffddea16273884053d8

## Change

Collect terminal follow-ups in one post menu. Expand a comma-separated pick through the saved mapping, deduplicate its steps and run them in step order. Keep typed reply numbers distinct from menu row numbers. Evidence inspection changes no selection; invalid or mixed-stop picks run nothing, and a second invalid reply leaves the menu waiting without another question or question marker.

Select only post-menu-set-reply for this increment. It exercises seven independent input cases against a retained merged-PR menu: a subset, overlapping combination, typed reply, evidence inspection, stop, mixed stop and repeated out-of-range input. Only the second-invalid reply rule changes in this increment; the sample also checks the existing selection rules. Retain all other sample records as historical evidence, not current coverage. This is sample-scoped coverage, not a target-wide pass or live PR verification. Batch scheduling and PR-named command resolution are not covered here.

## Expected to move

- post-menu-set-reply/subset: fails -> holds - Comma-separated picks select only their member steps and settle.
- post-menu-set-reply/union: fails -> holds - Combination expansion deduplicates steps before execution.
- post-menu-set-reply/typed-reply: fails -> holds - Typed reply 1 selects the saved draft, not menu row 1.
- post-menu-set-reply/inspection: fails -> holds - Inspection preserves the retained post mapping without settlement.
- post-menu-set-reply/stop: fails -> holds - Terminal stop declines all post work and preserves the checkout.
- post-menu-set-reply/mixed-stop: fails -> holds - Stop mixed with another number is rejected before any work.
- post-menu-set-reply/out-of-range: fails -> holds - Repeated invalid picks remain waiting without executing steps.

## Validation boundary

Judge every candidate fact absolutely, not only improvement over baseline. Preserve cleanup ownership, branch-deletion and base-sync guards. The runner assembles both arms from the working-tree file list; no baseline file is removed in this increment. Later removal of decision-menu.md limits baseline completeness, so comparison direction alone is never evidence of preserved mechanics. No other sample or live PR runs for this increment.
