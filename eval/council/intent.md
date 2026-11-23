for: aa8ace0c2d8b4fd80c1ce608805e7ccd6066f3829d41e29c81ff4c37d2f0bd87

## Change
Preserve review and approval gates while finalization adds the Legs section and companion-file contract.

Move council findings transport to file-only member and chair outputs, require direct chair reads from explicit paths, and delegate spec application to the fresh applier. Parent checks structure and audit counts, rereads the spec first, restores before retry or abort, and cleans only attributable paths against the absolute worktree root while preserving the single user gate. Cases prescribe actions without claiming real execution.

## Expected to move
- member-file-only/paired-output: fails -> holds - Pair file-only mode with every initial and retry task output.
- member-file-only/only-failed: fails -> holds - Retain targeted complete-task retry with file-only output.
- member-file-only/quorum-boundary: fails -> holds - Override harness invitation and keep findings outside the parent.
- chair-file-only/chair-file-output: fails -> holds - Save chair report file-only and remove dead reads field.
- chair-file-only/direct-read-input: fails -> holds - Chair reads explicit paths directly rather than relying on injection.
- chair-file-only/complete-report: fails -> holds - Injected output file must contain the entire report.
- chair-file-only/chair-retry: fails -> holds - Judge chair usability from its file.
- chair-file-only/single-coverage: fails -> holds - Keep report findings outside parent while retaining partial coverage.
- applier-dispatch/snapshots: fails -> holds - Snapshot spec and every dirty path before delegation.
- applier-dispatch/fresh-dispatch: fails -> holds - Dispatch inherited-model fresh foreground applier.
- applier-dispatch/full-context: fails -> holds - Pass authoritative context into applier task.
- applier-dispatch/protected-boundary: fails -> holds - Delegate scope adjudication with grant and guideline protection.
- audit-rollback/mechanical-reject: fails -> holds - Validate all labels and disposition cardinality mechanically.
- audit-rollback/read-first: fails -> holds - Reread spec before any post-return action.
- audit-rollback/restore-retry: fails -> holds - Restore snapshot before identical retry and after final failure.
- audit-rollback/abort-contract: fails -> holds - Abort to unchanged gate without partial spec or invented counts.
- audit-rollback/zero-valid: fails -> holds - Accept valid empty audit despite grep no-match status.
- post-applier-reread/first-reread: fails -> holds - Parent rereads applier edits first.
- post-applier-reread/full-snapshots: fails -> holds - Enumerate nested untracked files in both snapshots.
- post-applier-reread/rooted-cleanup: fails -> holds - Root individual untracked deletions in explicit worktree, not parent cwd.
- post-applier-reread/before-set-preserved: fails -> holds - Preserve all before-set dirty paths regardless of status-code changes.
- post-applier-reread/gate-suffix: fails -> holds - Report attributable outside-spec cleanup at existing gate.
- post-applier-reread/finalization: fails -> holds - Preserve finalization after applier cleanup and audit handoff.
