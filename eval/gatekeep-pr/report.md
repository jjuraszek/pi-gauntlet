# eval report: gatekeep-pr (partial run: teardown-own-run-folder)

for: 9b402d47a362a756f32726ee82298d0e94cb99162ce36365f9b7f92e1f519ed6

wall: 29s

## Change

Select only teardown-own-run-folder for this change. At the supplied Teardown checkpoint, run the marked block with the surviving primary and this run's literal absolute folder; pass both drafts as KEEP and name the returned gate-kept paths. Never delete the sibling run or OS-temp files. This no-tool sample proves command narration only; scripts/gate-teardown.test.mjs executes the filesystem checks. Gate mint and stage-file path moves receive deterministic coverage only, not model samples. Preserve every other sample's saved evidence as earlier-revision coverage; this is not a target-wide pass. The older course-stop-cleanup f4, batch-cleanup-stop c3 and stop-draft-files retained facts are stale against the record-outside-run-folder compatibility rule; move their fixtures into run folders before their next selected run, but do not edit or rerun them here.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| teardown-own-run-folder | anthropic/claude-opus-5-5 | improved | 9930 | owned-block: fails -> holds (intended change); no-sweep: holds -> holds (intended but unchanged); sibling: holds -> holds (intended but unchanged); kept: fails -> holds (intended change); os-temp: holds -> holds (intended but unchanged) |
| teardown-own-run-folder | github-copilot/gpt-6.1-sol | improved | 10712 | owned-block: fails -> holds (intended change); no-sweep: holds -> holds (intended but unchanged); sibling: holds -> holds (intended but unchanged); kept: fails -> holds (intended change); os-temp: holds -> holds (intended but unchanged) |

## Feedback

- teardown-own-run-folder / anthropic/claude-opus-5-5: After moved owned-block and kept from fails to holds, as intended, and kept the other three facts. Before composed its own `cp`, `rm -f {…}` and `rmdir` commands and never invoked the marked block; After sets PRIMARY=/work/widgets, RUN_DIR=/work/widgets/.git/gauntlet/tmp/gate.ABC123 and both absolute KEEP paths, then runs the marked block once and states it composes no move or delete of its own. The block's `mv` into /tmp/gate-kept.NEW001 and /tmp/gate-kept.NEW002 precedes its single `rm -rf` of the literal run folder, and the closing message names each path with its reason (reply failed with HTTP 503, coverage not picked) without claiming either was posted. No-sweep, sibling and os-temp still hold: gate.DEF456 and the /tmp OLD files appear only in the untouched list, and the `gate.*`, `verify.*` and `review.*` strings are an ownership check and prose shorthand, not cleanup commands. To keep this stable, retain the wording that requires literal absolute PRIMARY, RUN_DIR and KEEP values, one invocation of the marked block, and no self-composed deletion. Consider asking the narration to list removed files by full name rather than `verify.*`-style shorthand, and to abbreviate no path with an ellipsis inside the narrated `mv`, so a stricter reader cannot mistake the shorthand for a wildcard or an incomplete path.
- teardown-own-run-folder / github-copilot/gpt-6.1-sol: After moved owned-block and kept in the intended direction and lost nothing Before held. Before composed its own cp/mktemp copies plus a per-file rm and rmdir, so it never invoked the marked block and never passed the drafts as KEEP. After sets PRIMARY=/work/widgets and RUN_DIR to the literal gate.ABC123 path, passes reply.body and coverage.body as KEEP, and runs the marked block, whose single rm -rf targets only "$RUN_DIR". Its closing message names /tmp/gate-kept.NEW001 for the reply that failed with HTTP 503 and /tmp/gate-kept.NEW002 for the unpicked coverage post, without claiming either was posted. No-sweep, sibling and os-temp still hold: the only loop and gate.* pattern sit inside the verbatim ownership-check block, gate.DEF456 appears in no command, and nothing in /tmp is deleted (the block only moves the two drafts into it). To keep this robust, keep the wording that requires literal absolute PRIMARY and RUN_DIR from the surviving primary, and that forbids any cleanup command outside the marked block. Consider asking for KEEP entries to be written as full literal absolute paths rather than "$RUN_DIR/..." expansions, so a strict reader cannot question whether they are absolute. Also keep the instruction that the closing message states each draft's reason beside its returned gate-kept path.

exit: 0
