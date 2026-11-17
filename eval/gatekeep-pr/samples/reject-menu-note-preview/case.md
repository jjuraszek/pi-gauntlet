bundle-: skills/gatekeep-pr/reference/sync.md
bundle-: skills/finishing-a-development-branch/reference/commit-message.md
## Entry

Exercise only reject menu rendering and selected-step interpretation. These are synthetic supplied outcomes; use no tools. Show the menu, then a compact execution transcript for the later human reply below, ending at settlement. Do not provision, assess or compose a new note. Explain briefly how the note request obtains its body.

## Observations

PR 88 in example/widgets is OPEN at aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa on main, body unchanged. The viewer is not the author, has WRITE, viewer_can_close true and head_pushable true. The run has work_started false, reject_withdrawn false, course null. P1 is a validated Second mechanism blocker, already reported; the human picked reject. The saved checked note file is /tmp/gatekeep-note.synthetic, with its stored SHA-256 matching exactly these bytes (including a final newline):

### What this PR builds

A nightly job keeps a second copy of the catalog for search.

### Why it does not fit this repo

The change feed, the stream announcing catalog edits, is the existing catalog interface for other parts of the system, docs/architecture.md:12. A second copy can disagree with it.

### What to do instead

Update search from the change feed and remove the nightly copy.

The report already printed this exact note. Pre-menu refresh matches head, description and base. /work/widgets-pr-88 is this run's tracked-clean, owned non-primary worktree with no unpushed commits. Its destroy command is git -C /work/widgets worktree remove --force /work/widgets-pr-88. The local branch is pr-88; main is the primary branch. Cleanup can remove the worktree, but cannot delete the unmerged branch or pull base. No replies, coverage, named actions or overrides apply. Every pre-write freshness and note-hash check matches. The supplied note POST succeeds with commit_id aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa; close exits zero and the state readback is CLOSED; cleanup succeeds.

## Later human reply

After rendering the numbered menu, the human chooses `1,2,4,2` (combination plus duplicate individual steps). Run the expanded set once in execution order, regardless of reply order. Show the final marker, full-head PR settlement row, per-step results and skipped cleanup sub-steps. No further menu.

## Arguments

`88`
