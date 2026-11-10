for: fb4e03b48655bb4ae13b9b70b027afd8aaa03bf91d9488dfcaf9b32153abf6ab

## Change

In set mode, render one post menu per merged PR in its own message and retire each PR after its chosen steps or stop, without a post-menu ladder. Recommend a shared cleanup override only on the last merged PR in the round; an early explicit selection runs it then, and the parent retains that execution across rounds to prevent a second run or later offer. Keep PR-specific items local, collect all picks before executing in roster order, and copy the child's standing sentence unchanged in the summary. Retain per-PR not-run sentences for the single parent closing message.

Select only batch-post-menu for this increment. Its two synthetic variants cover recommended picks and an explicit early shared-item pick followed by stop on the other PR. Keep all other saved sample results as historical evidence, not current coverage. No live PR, multi-PR dispatch or external cleanup is exercised.

## Expected to move

- batch-post-menu/separate: fails -> holds - Render each merged PR's post menu once in its own message.
- batch-post-menu/shared: fails -> holds - Recommend the shared item only on the last merged PR while keeping an individual early row.
- batch-post-menu/once: fails -> holds - Run the shared item once at the selected PR and omit it thereafter.
- batch-post-menu/retirement: fails -> holds - Retire after the pick and carry every PR's not-run sentences into one parent closing message.
- batch-post-menu/standing: fails -> holds - Copy the child standing sentence instead of labeled summary fields.

## Validation boundary

Require every candidate fact to hold, not merely improvement over baseline. Preserve all-picks collection, roster execution order, primary-checkout ownership and the existing cleanup guards. The target's bundle-free hash is unchanged because batch.md is added by the selected sample. Other samples and live behavior are not covered; this is a partial result, not a target-wide pass.
