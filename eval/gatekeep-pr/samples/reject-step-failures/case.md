bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/gauntlet/commit-message.md
## Entry

Exercise reject step execution and settlement only, as independent rows in a compact result table. No tools, no live PR, no provisioning, full report or helper. For each row show selected-step results, terminal marker and settlement outcome, note retention and cleanup count. Render only G's full reject menu and H's unchanged waiting menu response. Keep within 1700 words.

## Shared snapshot

PR 88 in example/widgets is OPEN at aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa on main, body unchanged. Viewer is not author, viewer_can_close true. Course null; work_started false; reject menu open with checked note /tmp/gatekeep-note.synthetic and matching stored hash. /work/widgets-pr-88 is a clean owned non-primary worktree, remote-synced with no unpushed commits. Cleanup removes it successfully; branch stays because PR is unmerged. Menu mapping is 1 note+close+cleanup, 2 note, 3 close, 4 cleanup, 5 back, 6 stop. Valid note text was previewed and has the required three headings. All unspecified reads and writes succeed; successful note POST confirms commit_id and close confirms CLOSED. No other post steps.

## Independent rows

A. Pick 2,3. Note POST fails HTTP 403 review forbidden. Close must not be sent.
B. Pick 2,3. Note succeeds. Close fails HTTP 403 close forbidden and readback remains OPEN.
C. Pick 1. Before note, actual body differs from preview. Do not refresh away this observation. Cleanup stays eligible.
D. Pick 2. Saved note bytes no longer match reject.note_sha256.
E. Pick 4, cleanup alone.
F. Pick 1. Note fails HTTP 502 upstream error. Picked cleanup succeeds; Non-final stop must not inspect the removed path.
G. At menu render, viewer_can_close is unreadable. The saved note is exactly:
### What this PR builds
A job copies the catalog.
### Why it does not fit this repo
The change feed already supplies catalog edits, docs/architecture.md:12.
### What to do instead
Consume the change feed and remove the copy.
No step picked. Render its menu with no close row and no terminal settlement.
H. At the original menu the human replies 2,5 (note plus back). Show only its clarification and still-waiting behavior; execute nothing and settle nothing.
I. Pick 3, close alone. No note was picked; close succeeds.
J. Pick 1. Before note PR state is MERGED by someone else; cleanup remains eligible, but do not claim this run merged or rejected it.

## Arguments

`88`
