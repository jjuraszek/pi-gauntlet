# eval report: gatekeep-pr (partial runs: teardown-own-run-folder; reject-not-after-pick)

for: 4429f02212eb7e0ae54618f5a701325a107cace343770f43aaec651007029e39

## Teardown change

wall: 31s

Select only teardown-own-run-folder for this change. At the supplied Teardown checkpoint, run the marked block with the surviving primary and this run's literal absolute folder; pass both drafts as KEEP and name the returned gate-kept paths. Never delete the sibling run or OS-temp files. This no-tool sample proves command narration only; scripts/gate-teardown.test.mjs executes the filesystem checks. Gate mint and stage-file path moves receive deterministic coverage only, not model samples. Gate helpers, verification logs, worker controllers and merge bodies use RUN_DIR; stages use checkout-local SCRATCH. scripts/stage-skill-lint.test.mjs checks every scoped file and the shared Git recipe; script fixtures cover happy-path logs and wave indexes. Preserve every other sample's saved results as historical records of earlier revisions; this is not a target-wide pass. Preserve fix-row-return-file and other historical sample evidence; coverage is partial. The saved fix-row-file-observation results also remain historical records, not coverage of this change. The older course-stop-cleanup f4, batch-cleanup-stop c3 and stop-draft-files retained facts are stale against the record-outside-run-folder compatibility rule; move their fixtures into run folders before their next selected run, but do not edit or rerun them here.

## Approach change

wall: 89s

Implement reject's frozen-note menu, close permissions, ordered post/close/cleanup steps, back and rejected settlement. Add run-only overrule mapping and dispositions, failed-repair three-section reporting and contributor-safe closure and coverage. Dispatch remedy-only approach repairs on both harnesses and carry their closure inputs across every post-work review, including external head moves. Keep pre-work approach detection, first-report wording and ordinary no-conflict menus. Bind approach remedies to the same no-infrastructure, no-dependency and no-new-module payload limit as every finding; return needs through each harness's existing tail when a remedy cannot fit.

This evidence refresh covers only reject-not-after-pick, adding its post-fix-nits-push checkpoint at a different assessed head. Coverage is partial; no other sample is replayed and the skill bundle is unchanged.

## Teardown cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| teardown-own-run-folder | anthropic/claude-opus-5-5 | improved | 9537 | owned-block: fails -> holds (intended change); no-sweep: holds -> holds (intended but unchanged); sibling: holds -> holds (intended but unchanged); kept: fails -> holds (intended change); os-temp: holds -> holds (intended but unchanged) |
| teardown-own-run-folder | github-copilot/gpt-6.1-sol | improved | 9671 | owned-block: fails -> holds (intended change); no-sweep: holds -> holds (intended but unchanged); sibling: holds -> holds (intended but unchanged); kept: fails -> holds (intended change); os-temp: holds -> holds (intended but unchanged) |

## Teardown feedback

- teardown-own-run-folder / anthropic/claude-opus-5-5: The After wording moved owned-block and kept from fails to holds and lost nothing Before kept. Before composed its own cleanup (cp into minted files, then a by-name rm -f and rmdir), so it never invoked the marked block or passed KEEP. After names the marked gate-teardown-shell block and runs it once with PRIMARY=/work/widgets and RUN_DIR=/work/widgets/.git/gauntlet/tmp/gate.ABC123 as literal absolute paths, and it explicitly rejects the removed PR checkout as PRIMARY. It passes both drafts as absolute KEEP paths, and the block moves them to /tmp/gate-kept.NEW001 and /tmp/gate-kept.NEW002 before the single rm -rf of the run folder. The closing message gives each path its reason (HTTP 503 failure not retried, coverage not picked) without claiming either was posted. No-sweep, sibling and os-temp still hold: the only pattern is the block's own gate.* ownership check, gate.DEF456 appears in no deletion, and nothing in /tmp is deleted. To keep this stable, keep the wording that requires literal absolute paths for PRIMARY, RUN_DIR and each KEEP entry, that says the block is the only recursive deletion, and that the closing message uses the block's printed kept paths in reply-then-coverage order. Keeping the explicit statement that the sibling run and existing OS-temp files are left alone would also stop a later edit drifting back to composed or prefix-based cleanup.
- teardown-own-run-folder / github-copilot/gpt-6.1-sol: After moved owned-block and kept from fails to holds, and no fact that Before kept was lost. Before composed its own mktemp/cp, per-file rm and rmdir sequence, so it never invoked the marked block and never passed the drafts as KEEP. After runs the marked Teardown block with PRIMARY=/work/widgets and RUN_DIR=/work/widgets/.git/gauntlet/tmp/gate.ABC123 as literals, passes reply.body and coverage.body as KEEP, and its only recursive deletion is the block's own rm -rf of RUN_DIR. Its closing message names /tmp/gate-kept.NEW001 for the HTTP 503 reply and /tmp/gate-kept.NEW002 for the unpicked coverage post without claiming either was posted. no-sweep, sibling and os-temp still hold: the only glob-like syntax and loops are inside the verbatim ownership-check block, gate.DEF456 appears in no command, and nothing in /tmp is deleted. To keep this stable, keep the wording that requires literal absolute PRIMARY and RUN_DIR from the surviving primary. Consider asking for the KEEP entries to be written as fully spelled absolute paths rather than "$RUN_DIR/..." expansions, so a stricter reader cannot dispute them. Keep requiring the closing message to pair each returned gate-kept path with its reason (failed and not retried, or not picked), and to add no cleanup command outside the block.

## Approach cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| reject-not-after-pick | anthropic/claude-opus-5-5 | improved | 18357 | boundary: fails -> holds (intended change); other-picks: fails -> holds (intended change); closure: fails -> holds (intended change); fix-nits-head: fails -> holds (intended change); external: fails -> holds (intended change); back: fails -> holds (intended change); continuation: fails -> holds (intended change) |
| reject-not-after-pick | github-copilot/gpt-6.1-sol | improved | 20413 | boundary: fails -> holds (intended change); other-picks: holds -> holds (intended but unchanged); closure: holds -> holds (intended but unchanged); fix-nits-head: holds -> holds (intended but unchanged); external: fails -> holds (intended change); back: fails -> holds (intended change); continuation: holds -> holds (intended but unchanged) |

## Approach feedback

- reject-not-after-pick / anthropic/claude-opus-5-5: Before kept none of these facts: it said the skill had no reject row, work_started, reject_withdrawn or note handling, so there was nothing to regress, and all seven facts moved from fails to holds. What moved them in After is the pick-boundary rule that saves work_started true, deletes the note and nulls reject before the handler's first dispatch or write; the work versus non-work classification, with fix nits leaving course null; the remedy-only dispatch on both harnesses carrying instead, builds, base evidence and the scoped test; the closure-only Re-review task carried across the external head move despite a null prior review; the explicit absence of an approach appendix after the fix-nits push; and reject.md Back withdrawing with "Nothing was posted or closed". Three facts hold by inference rather than by statement, so tighten the wording there. In E, have the output say the step-4 task requires the carried `P1: resolved` contributor closure line, not just that P1 is a closure-only prior item. In C, have the post-push step name comment and evidence reconciliation at the exact pushed head, rather than only a "pre-menu refresh". In A through C, have the re-entry state that work_started stays true and that course and usage are not reset; the failed repair in A and the terminal menu in B currently leave this implied. Also keep the reject-menu-step row of the table explicit that work_started is unchanged and nothing is posted or closed at the boundary, rather than deferring to "reject.md settlement".
- reject-not-after-pick / github-copilot/gpt-6.1-sol: After moved three facts and lost none. Boundary now holds because After says every valid work pick deletes the saved rejection note and clears reject before any dispatch or external write, and that a failed handler does not undo this; Before disclaimed any reject workflow and never cleared the note. External now holds because After carries P1 with builds, remedy and evidence under a required closure ID and calls the approach review closure-only, where Before re-asked whether the mechanism still conflicts with the base architecture across the whole diff. Back now holds because D persists reject_withdrawn true, deletes the note, clears reject and says nothing was posted or closed, where Before treated back as an unsupported request. Other-picks, closure, fix-nits-head and continuation held in both, though Before left two points implicit that After states outright: no approach judgment after C's push, and none in F's comment-delta review. To keep all seven, retain the explicit save-before-dispatch sentence, the 'closure-only: no new whole-PR approach judgment or appendix' phrasing for E, and 'perform no approach judgment' for F's task at the new head. Three additions in After are worth pinning down so they do not drift: the 'reply' row in F's final menu, the overrule hint on A's needs-fixture obstacle, and A's 'adding ten repair attempts' wording, which should stay an extension of caps and never read as resetting course or usage. Keep reject rows and note previews out of every post-pick menu.

exit: 0

## Selected sample evidence

Coverage is limited to the 15 behavior-relevant samples below, not the full gatekeep-pr target. All 30 saved replay cells satisfy all 138 After facts; `scripts/gatekeep-reject.test.mjs` and `scripts/gatekeep-overrule.test.mjs` bind those cells to their current assembled bundles, inputs and expected facts. Each listed command is `node eval/run.mjs gatekeep-pr <sample>` and exited 0. No scope or merge-state model sample ran; their existing saved replies remain historical evidence.

| Sample | Final verdict | Replay cells | After facts |
|---|---|---|---|
| reject-not-after-pick | improved | 2 | all hold |
| approach-conflict-report | improved | 2 | all hold |
| reject-row-first-menu | improved | 2 | all hold |
| approach-blocker-other-row | improved | 2 | all hold |
| stuck-blocker-sections | improved | 2 | all hold |
| row-exhaustion | improved | 2 | all hold |
| overrule-approach | improved | 2 | all hold |
| reject-step-failures | improved | 2 | all hold |
| approach-none-unchanged | unchanged | 2 | all hold |
| approach-local-instance | improved | 2 | all hold |
| reject-menu-note-preview | improved | 2 | all hold |
| reject-back | improved | 2 | all hold |
| overrule-stuck-blocker | improved | 2 | all hold |
| consent-no-progress-stop | improved | 2 | all hold |
| batch-reject-queue | improved | 2 | all hold |
