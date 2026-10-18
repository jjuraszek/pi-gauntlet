The parent implementation worktree is /workspace/project. Before a task's spec review, materializing its returned patch into /tmp/review-snapshot/tree failed: git apply --index exited 1 with 'error: patch failed: src/parse.ts:8'. No successful snapshot path was printed. The worker already returned DONE, but its temporary checkout was deleted. The parent still contains the old files at the wave base.

What are the next actions? Decide whether any reviewer is dispatched and which checkout it would read. Stop at this failure decision.
