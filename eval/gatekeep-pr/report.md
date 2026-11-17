# eval report: gatekeep-pr (partial runs: teardown-own-run-folder; batch-reject-queue)

for: 86302a9c7a19c3aab1d8ad8240749ebf93045b6d8c12319a93e1305ea2efe830

## Teardown change

wall: 31s

Select only teardown-own-run-folder for this change. At the supplied Teardown checkpoint, run the marked block with the surviving primary and this run's literal absolute folder; pass both drafts as KEEP and name the returned gate-kept paths. Never delete the sibling run or OS-temp files. This no-tool sample proves command narration only; scripts/gate-teardown.test.mjs executes the filesystem checks. Gate mint and stage-file path moves receive deterministic coverage only, not model samples. Gate helpers, verification logs, worker controllers and merge bodies use RUN_DIR; stages use checkout-local SCRATCH. scripts/stage-skill-lint.test.mjs checks every scoped file and the shared Git recipe; script fixtures cover happy-path logs and wave indexes. Preserve every other sample's saved results as historical records of earlier revisions; this is not a target-wide pass. Preserve fix-row-return-file and other historical sample evidence; coverage is partial. The saved fix-row-file-observation results also remain historical records, not coverage of this change. The older course-stop-cleanup f4, batch-cleanup-stop c3 and stop-draft-files retained facts are stale against the record-outside-run-folder compatibility rule; move their fixtures into run folders before their next selected run, but do not edit or rerun them here.

## Approach change

wall: 72s

Implement reject's frozen-note menu, close permissions, ordered post/close/cleanup steps, back and rejected settlement. Add run-only overrule mapping and dispositions, failed-repair three-section reporting and contributor-safe closure and coverage. Dispatch remedy-only approach repairs on both harnesses and carry their closure inputs across every post-work review, including external head moves. Keep pre-work approach detection, first-report wording and ordinary no-conflict menus.

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
| batch-reject-queue | anthropic/claude-opus-5-5 | improved | 10896 | queue: fails -> holds (intended change); back: fails -> holds (intended change); answer: fails -> holds (intended change) |
| batch-reject-queue | github-copilot/gpt-6.1-sol | improved | 12940 | queue: fails -> holds (intended change); back: fails -> holds (intended change); answer: fails -> holds (intended change) |

## Approach feedback

- batch-reject-queue / anthropic/claude-opus-5-5: All three facts moved from fails to holds, and Before held none of them, so nothing was lost. Before treated `reject`, `back` and `overrule 1` as undefined change requests, re-rendered the initial menu and called `rejected` an invalid outcome. After's wording makes reject a parent-owned terminal pick that waits until the round is collected, then renders `gauntlet: gate=gatekeep-pr/reject recommended=1` in its own message with the full saved note and a recommended note/close/cleanup row, with no child dispatch and cleanup run from /work/widgets rather than the removed worktree. Back now withdraws reject, deletes the note and leaves `work_started` false and P1 intact; the unchanged head gets a parent re-render with no reject row and no dispatch, while the moved head gets a step-3 report-mode dispatch that judges approach again and never restores reject. `overrule 1` is queued as #88's answer, recorded by the child against the last rendered numbering and re-rendered without resuming delivery, and the parent saves the rejected row before teardown and prints it only in the closing roster message. To keep this robust, state explicitly that the row is saved before the record is deleted (After says only "before tearing #88 down"), and keep the explicit lines that terminal steps dispatch no child and that the `gauntlet: retired` line carries no settlement row. In D, the claims that overrule deletes the note and leads straight to a final menu with merge go beyond what the facts need; keep them only if the procedure text specifies them, since they could conflict with ordinary-menu facts in other cases.
- batch-reject-queue / github-copilot/gpt-6.1-sol: Before failed all three facts because its procedure had no reject, back or overrule actions: it treated each as a change request, rendered no reject menu and denied a `rejected` settlement. After moves all three. For queue, it holds `reject` as a parent-owned pick until PR 89's stop collects the round, then renders the menu under `gauntlet: gate=gatekeep-pr/reject recommended=1` with the full saved note and a recommended note/close/cleanup row, dispatches no child, and runs cleanup via `git -C /work/widgets`, not from the removed worktree. For back, B sets `reject_withdrawn`, deletes the note, leaves `work_started` false and the blocker untouched, and returns PR 88 with no dispatch; C dispatches step-3 re-entry on the moved head with whole-diff approach review and rejection still withdrawn. For answer, D queues `overrule 1`, has the child record it against the retained problem mapping and re-render without resuming delivery, and has the parent keep the `rejected` row before teardown and print it only in the final closing message. Three things are softer than the facts and worth tightening. First, the reject menu is announced with "The next message is…" inside the same output as the routing table and queue lines, so require the gate marker to be the first line of a genuinely separate message. Second, B says "retained report" but should say the retained report and its ordinary menu return. Third, D should say explicitly that the re-rendered report arrives in the next round and that the settlement row is retained before record deletion. Before held no fact, so there is nothing to preserve here.

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
