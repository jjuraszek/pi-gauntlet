for: b0edc73eb6a8c3994f3fe537ebdf2b380a9163465e541bf3ab453928decb9299

## Change

Run every plan task through the same N >= 1 wave loop, including an all-singleton code plan. Keep chain SR treePath and older-runtime materialized snapshots, separate integrated CR, scoped gates, repair/escalation exceptions and doc-only SR-only waves. Replace integrated repair's unstaged/uncommitted override with a payload carrying no commit or staging instruction and a repair-only diff between scratch-index tree captures, unaffected by worker commits. The tree-capture rule also applies to pre-integration SR re-reviews: chain-wave-dispatch/snapshot-rereview retains its detached replacement snapshot, failed-setup evidence, plain non-chain dispatch, verbatim report, trajectory and cleanup after saved terminal output, while adding original/replacement snapshot tree captures and a Fix delta. Tree capture is not another SR dispatch and does not permit early snapshot cleanup. Fold worker commits into the wave commit only after acceptance, then complete tracker tasks. Repair a failed integrated test gate in place, rerun the scoped union and renew affected-task SR before initial CR. Zero surviving integration patches skip steps 5-7 and use bounded clean-base singleton retries. Remove committed-sequential-review samples/results because that execution path is deleted; real Git whole-diff review tests remain outside this target. Preserve chain recovery, snapshot isolation, escalation sentinels and stable facts. Make the existing D1 commit-before-completion lifecycle explicit at exhausted retries: retain in_progress pending human decision, including terminal failure, rather than marking failed or complete. Require saved terminal output and cleanup for every reviewer-cwd snapshot, while allowing a tree-before-only reconstruction to be removed after capture. Stop dispatch on replacement snapshot setup or tree-capture failure and explicitly retain the failed directory and shell output without cleanup; successful tree-after capture precedes the plain re-review. This is behavior-changing conformance evidence.

## Expected to move

- singleton-apply-failure/completion-withheld: fails -> holds - D1 keeps the failed apply task in_progress until its own wave commits; exhausted retries do not authorize a terminal tracker write.
- chain-stop-blocked/never-rechain: fails -> holds - D1 requires pending to in_progress at fan-out and complete only at the wave commit; make this existing lifecycle explicit during stopped-chain recovery.

- all-singleton-waves/singleton-dispatch: fails -> holds - Every plan task now uses the ordinary singleton wave dispatch rather than a separate in-place execution path.
- all-singleton-waves/integrated-gates: fails -> holds - Singleton code tasks now integrate patches and receive one initial integrated CR per wave.
- all-singleton-waves/accepted-commit: fails -> holds - The orchestrator commits each singleton wave after acceptance before completion.
- integrated-wave-repair/fix-only-delta: fails -> holds - Scratch-index tree captures include committed repairs and new files without implementation changes in the delta.
- integrated-wave-repair/in-place-payload: fails -> holds - The in-place repair carries no commit or staging override.
- integrated-wave-repair/gates-preserved: fails -> holds - Acceptance precedes a single wave commit folding the repair worker's moved HEAD before completion.
- test-gate-repair/in-place-repair: fails -> holds - A failed test gate dispatches one worker in the dirty integrated checkout instead of a nested wave from stale HEAD.
- test-gate-repair/scoped-rerun: fails -> holds - The repaired integrated wave reruns the whole scoped union before review.
- test-gate-repair/affected-task-sr: fails -> holds - A behavior repair invalidates the affected task's earlier SR verdict and requires integrated-checkout SR.
- test-gate-repair/sr-before-initial-cr: fails -> holds - Initial CR must await affected-task SR after the repaired gate passes.
- singleton-apply-failure/no-empty-wave: fails -> holds - Zero integrated patches skip tests, CR and commit instead of reviewing an empty wave.
- singleton-apply-failure/clean-base-retry: fails -> holds - The rejected singleton patch retries from the unchanged clean base, not an integrated dirty checkout.
