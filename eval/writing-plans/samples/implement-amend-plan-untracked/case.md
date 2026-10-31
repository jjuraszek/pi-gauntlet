bundle+: agents/plan-writer.md

Role: plan-writer, implement-phase Amend-apply. Home /workspace/app, plan doc/plans/new.md and spec doc/specs/new.md. Granted one-bullet spec correction. Both files exist on disk. git -C /workspace/app show HEAD:doc/plans/new.md exits 128, stderr first line fatal: path 'doc/plans/new.md' exists on disk, but not in 'HEAD'. Current content and previousApplyReport are available but no committed plan original exists. Describe writes and structured failure; compare jj-only without git HEAD. Do not execute tools.
