bundle+: skills/finishing-a-development-branch/SKILL.md
bundle+: skills/using-git-worktrees/reference/pr-head.md
Invocation: `/skill:finishing-a-development-branch /work/widget/.worktrees/retry`.
Simulate independent checkpoints; execute no commands or live writes. Use at most 600 words, aliases for full SHAs, and terse checkpoint deltas. Gates passed and scoped test-retry passed on a known clean commit; telemetry-excluding tree checks are clean. Choose PR-subject row 1 unless a variant says otherwise.
The spec Rework record has top-level groups in this order:
PR: acme/widget#12 - Retry
Pre-rework head: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Threads: src/retry.ts:1 HOME - fix: retry repair
PR: acme/widget#13 - Retry delay
Pre-rework head: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
Threads: src/delay.ts:2 MEMBER13 - fix: retain delay
PR: acme/widget#14 - Retry cap
Pre-rework head: cccccccccccccccccccccccccccccccccccccccc
Threads: src/cap.ts:3 MEMBER14 - keep open: cap discussion
Base: main @ 1234567 - merge: ddddddd
Keeps: retry behavior
Changes: repair retries
Dropped claims: none
Scoped tests: test-retry
Each group also has a ### PR #N - title subsection with lowercase provenance; do not copy that provenance into combined fields. Home is OPEN on branch retry, base main. All original heads and origin/retry are ancestors of HEAD eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee. Home HOME task is accepted complete with one first-parent naming commit fffffff. Refreshed member #13 retains MEMBER13 and gains NEW13, #14 reports MEMBER14 newly resolved. A member fix lives on its own history, not home's first-parent walk.
Capture evidence, strip/seal whole PR against origin/main, preserve each original head ref, push only home without force, refresh threads per PR, and preserve fresh description bytes `Original description\n` using outside-repo scratch. Successful body write uses `gh pr edit 12 --repo acme/widget --body-file "$SCRATCH"`. Successful members are OPEN at their recorded heads unless overridden.
Push and body edit succeed. Eligibility refresh finds #13 OPEN at bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb; #14 OPEN at 9999999999999999999999999999999999999999, not ancestor of pushed home. #14's current head 9999999999999999999999999999999999999999 is not in the local object database until fetched; the fetch succeeds. Render exact eligible-only question; answer 1 and #13 recheck is unchanged. Independently compare #14 advanced but current head already contained in pushed home, and no eligible members.
